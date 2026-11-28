import { ChevronLeft, ChevronRight, Maximize2, Pause, Play, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react'

export interface Slide {
  key: string
  /** Read out for the slide and used for the dot buttons. */
  label: string
  content: ReactNode
}

interface Props {
  label: string
  slides: Slide[]
  /** Auto-advance only while the carousel is on screen (its project is the active one). */
  active?: boolean
  /** Milliseconds each slide stays before moving on. */
  interval?: number
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Horizontal slider that also plays on its own. Native scroll-snap does the
 * swiping on touch and trackpads; arrows, dots, keyboard and mouse drag cover
 * everything else. Auto-play pauses on hover, focus, drag and when hidden, and
 * the pause button stops it for good. Clicking a slide opens it large in a
 * viewer that covers most of the screen.
 */
export function Carousel({ label, slides, active = true, interval = 5000 }: Props) {
  const track = useRef<HTMLUListElement>(null)
  const root = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const [stopped, setStopped] = useState(prefersReducedMotion)
  const [held, setHeld] = useState({ hover: false, focus: false, drag: false, hidden: false, viewer: false })
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  /** Set for one tick after a mouse drag so the click that ends it does not open the viewer. */
  const dragged = useRef(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const [viewer, setViewer] = useState<number | null>(null)

  const count = slides.length
  const items = () => Array.from(track.current?.children ?? []) as HTMLElement[]
  const playing = active && !stopped && count > 1 && !Object.values(held).some(Boolean)

  const hold = useCallback(
    (key: keyof typeof held, value: boolean) => setHeld((h) => (h[key] === value ? h : { ...h, [key]: value })),
    [],
  )

  const sync = useCallback(() => {
    const el = track.current
    if (!el) return
    const list = Array.from(el.children) as HTMLElement[]
    if (!list.length) return
    const left = el.scrollLeft
    let nearest = 0
    list.forEach((s, i) => {
      if (Math.abs(s.offsetLeft - left) < Math.abs(list[nearest].offsetLeft - left)) nearest = i
    })
    setIndex(nearest)
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(sync)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null
    ro?.observe(el)
    return () => {
      el.removeEventListener('scroll', onScroll)
      ro?.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [sync])

  // Stop when the tab is in the background or the carousel is scrolled out of view.
  useEffect(() => {
    const onVisibility = () => hold('hidden', document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    const el = root.current
    const io =
      el && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => hold('hidden', !entry.isIntersecting || document.hidden), {
            threshold: 0.4,
          })
        : null
    if (el) io?.observe(el)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      io?.disconnect()
    }
  }, [hold])

  const goTo = useCallback(
    (i: number) => {
      const el = track.current
      const target = (Array.from(el?.children ?? []) as HTMLElement[])[(i + count) % count]
      if (!el || !target) return
      if (el.scrollTo) el.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
      else el.scrollLeft = target.offsetLeft
      // jsdom and some browsers skip the scroll event for programmatic scrolls.
      setIndex((i + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => goTo(index + 1), interval)
    return () => window.clearTimeout(id)
  }, [playing, index, interval, goTo])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') goTo(Math.min(index + 1, count - 1))
    else if (e.key === 'ArrowLeft') goTo(Math.max(index - 1, 0))
    else if (e.key === 'Home') goTo(0)
    else if (e.key === 'End') goTo(count - 1)
    else if (e.key === 'Enter') openViewer(index)
    else return
    e.preventDefault()
  }

  // Mouse drag so desktop visitors can swipe too. Touch and pen use native scrolling.
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !track.current) return
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e: PointerEvent) => {
    const d = drag.current
    const el = track.current
    if (!d || !el) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) < 4) return
    if (!d.moved) {
      d.moved = true
      el.setPointerCapture(e.pointerId)
      el.classList.add('is-dragging')
      hold('drag', true)
    }
    el.scrollLeft = d.left - dx
  }
  const endDrag = () => {
    const d = drag.current
    const el = track.current
    drag.current = null
    if (!d?.moved || !el) return
    dragged.current = true
    window.setTimeout(() => (dragged.current = false), 0)
    el.classList.remove('is-dragging')
    hold('drag', false)
    const from = Math.max(
      0,
      items().findIndex((s) => s.offsetLeft >= d.left - 2),
    )
    const moved = el.scrollLeft - d.left
    goTo(Math.min(count - 1, Math.max(0, from + (Math.abs(moved) > 40 ? Math.sign(moved) : 0))))
  }

  // The viewer is a native modal <dialog>: it sits above everything, traps focus,
  // closes on Escape and hands focus back to the carousel when it closes.
  const openViewer = (i: number) => {
    if (dragged.current) return
    setViewer(i)
  }
  const closeViewer = () => dialog.current?.close()
  const step = (dir: 1 | -1) => setViewer((v) => (v === null ? v : (v + dir + count) % count))

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (viewer !== null && !d.open) {
      hold('viewer', true)
      d.showModal?.()
    }
  }, [viewer, hold])

  const onViewerKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'ArrowLeft') step(-1)
    else return
    e.preventDefault()
  }

  const single = count <= 1

  return (
    <section
      ref={root}
      className={`carousel${playing ? ' is-playing' : ''}`}
      style={{ '--interval': `${interval}ms` } as CSSProperties}
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={(e) => e.pointerType === 'mouse' && hold('hover', true)}
      onPointerLeave={() => hold('hover', false)}
      onFocus={(e) => {
        // Keyboard focus pauses; a mouse click on a dot or arrow should not.
        let visible = true
        try {
          visible = (e.target as Element).matches(':focus-visible')
        } catch {
          // Older engines without :focus-visible: treat all focus as keyboard focus.
        }
        if (visible) hold('focus', true)
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hold('focus', false)
      }}
    >
      <div className="carousel__viewport">
        <ul
          ref={track}
          className="carousel__track"
          tabIndex={0}
          aria-label={`${label}, use arrow keys to browse`}
          aria-live={playing ? 'off' : 'polite'}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDragStart={(e) => e.preventDefault()}
        >
          {slides.map((s, i) => (
            <li
              key={s.key}
              className="carousel__slide"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${s.label}`}
              onClick={() => openViewer(i)}
            >
              {s.content}
            </li>
          ))}
        </ul>

        {!single && (
          <>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--prev"
              aria-label="Previous slide"
              disabled={index === 0}
              onClick={() => goTo(index - 1)}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--next"
              aria-label="Next slide"
              disabled={index === count - 1}
              onClick={() => goTo(index + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {!single && (
        <div className="carousel__footer">
          <button
            type="button"
            className="carousel__play"
            aria-label={stopped ? 'Play slideshow' : 'Pause slideshow'}
            aria-pressed={!stopped}
            onClick={() => setStopped((v) => !v)}
          >
            {stopped ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button type="button" className="carousel__play" aria-label="View larger" onClick={() => openViewer(index)}>
            <Maximize2 size={14} />
          </button>
          <span className="carousel__count">
            {index + 1} / {count}
          </span>
          <div className="carousel__dots">
            {slides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                className={`carousel__dot${i === index ? ' is-active' : ''}`}
                aria-label={`Show slide ${i + 1}: ${s.label}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => goTo(i)}
              >
                {/* Remounts whenever play resumes so the fill restarts with the timer. */}
                {i === index && <span key={`${index}-${playing}`} className="carousel__progress" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {single && (
        <div className="carousel__footer">
          <button type="button" className="carousel__play" aria-label="View larger" onClick={() => openViewer(0)}>
            <Maximize2 size={14} />
          </button>
        </div>
      )}

      <dialog
        ref={dialog}
        className="viewer"
        aria-label={`${label}, enlarged`}
        onClose={() => {
          setViewer(null)
          hold('viewer', false)
          if (viewer !== null) goTo(viewer)
        }}
        onClick={(e) => {
          // A click on the dimmed area around the frame closes it.
          if (e.target === e.currentTarget) closeViewer()
        }}
        onKeyDown={onViewerKey}
      >
        {viewer !== null && (
          <div className="viewer__frame">
            <div className="viewer__bar">
              <span className="viewer__title">{slides[viewer]?.label}</span>
              {!single && (
                <span className="viewer__count">
                  {viewer + 1} / {count}
                </span>
              )}
              <button type="button" className="viewer__close" aria-label="Close" onClick={closeViewer} autoFocus>
                <X size={18} />
              </button>
            </div>
            <div className="viewer__stage">{slides[viewer]?.content}</div>
            {!single && (
              <>
                <button
                  type="button"
                  className="viewer__nav viewer__nav--prev"
                  aria-label="Previous slide"
                  onClick={() => step(-1)}
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className="viewer__nav viewer__nav--next"
                  aria-label="Next slide"
                  onClick={() => step(1)}
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </section>
  )
}
