import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

export interface Screenshot {
  src: string
  /** Short description: used as alt text and shown under the slide. */
  caption: string
  width: number
  height: number
}

interface Props {
  title: string
  shots: Screenshot[]
  /** Portrait shows several phone screens side by side; landscape shows one at a time. */
  orientation?: 'landscape' | 'portrait'
}

/**
 * Horizontal screenshot slider. Native scroll-snap does the swiping on touch
 * and trackpads; arrows, dots, keyboard and mouse drag cover everything else.
 */
export function ScreenshotCarousel({ title, shots, orientation = 'landscape' }: Props) {
  const track = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)
  const [edges, setEdges] = useState({ start: true, end: shots.length <= 1 })
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)

  const slides = () => Array.from(track.current?.children ?? []) as HTMLElement[]

  const sync = useCallback(() => {
    const el = track.current
    if (!el) return
    const items = Array.from(el.children) as HTMLElement[]
    const left = el.scrollLeft
    let nearest = 0
    items.forEach((s, i) => {
      if (Math.abs(s.offsetLeft - left) < Math.abs(items[nearest].offsetLeft - left)) nearest = i
    })
    const atEnd = left + el.clientWidth >= el.scrollWidth - 2
    setIndex(atEnd ? items.length - 1 : nearest)
    setEdges({ start: left <= 2, end: atEnd })
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
    sync()
    return () => {
      el.removeEventListener('scroll', onScroll)
      ro?.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [sync])

  const goTo = (i: number) => {
    const target = slides()[Math.max(0, Math.min(i, shots.length - 1))]
    if (!target || !track.current) return
    track.current.scrollTo?.({ left: target.offsetLeft, behavior: 'smooth' })
  }

  const step = (dir: 1 | -1) => {
    const el = track.current
    const first = slides()[0]
    if (!el || !first) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy?.({ left: dir * (first.offsetWidth + gap), behavior: 'smooth' })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'ArrowLeft') step(-1)
    else if (e.key === 'Home') goTo(0)
    else if (e.key === 'End') goTo(shots.length - 1)
    else return
    e.preventDefault()
  }

  // Mouse drag so desktop visitors can "swipe" too. Touch and pen use native scrolling.
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
    }
    el.scrollLeft = d.left - dx
  }
  const endDrag = () => {
    const d = drag.current
    const el = track.current
    drag.current = null
    if (!d?.moved || !el) return
    el.classList.remove('is-dragging')
    // Settle on the slide in the direction the visitor dragged.
    const items = slides()
    const dir = Math.sign(el.scrollLeft - d.left)
    const from = items.findIndex((s) => s.offsetLeft >= d.left - 2)
    goTo(Math.max(0, from) + (Math.abs(el.scrollLeft - d.left) > 40 ? dir : 0))
  }

  const single = shots.length <= 1
  const current = shots[index] ?? shots[0]

  return (
    <section
      className={`carousel carousel--${orientation}`}
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
    >
      <div className="carousel__viewport">
        <ul
          ref={track}
          className="carousel__track"
          tabIndex={0}
          aria-label={`${title} screenshots, use arrow keys to browse`}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDragStart={(e) => e.preventDefault()}
        >
          {shots.map((s, i) => (
            <li
              key={s.src}
              className="carousel__slide"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${shots.length}`}
            >
              <img
                src={s.src}
                alt={s.caption}
                width={s.width}
                height={s.height}
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </li>
          ))}
        </ul>

        {!single && (
          <>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--prev"
              aria-label="Previous screenshot"
              disabled={edges.start}
              onClick={() => step(-1)}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--next"
              aria-label="Next screenshot"
              disabled={edges.end}
              onClick={() => step(1)}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      <div className="carousel__footer">
        <p className="carousel__caption" aria-live="polite">
          {current?.caption}
        </p>
        {!single && (
          <div className="carousel__nav">
            <span className="carousel__count">
              {index + 1} / {shots.length}
            </span>
            <div className="carousel__dots">
              {shots.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  className={`carousel__dot${i === index ? ' is-active' : ''}`}
                  aria-label={`Show screenshot ${i + 1}`}
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
