import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, TouchEvent } from 'react'
import { KIND_LABEL, projectsOf } from './data'
import type { ProjectKind } from './data'
import { ProjectSection } from './ProjectSection'
import './projects.css'

/** How far past the bottom (or top) the visitor has to keep scrolling before the page turns. */
const WHEEL_INTENT = 90
const SWIPE_INTENT = 70
/** Wheel input is ignored this long after a page turn so momentum does not skip a project. */
const TURN_LOCK_MS = 750
const MAX_LOCK_MS = 1600

type Landing = 'top' | 'bottom'

const atTop = (el: HTMLElement) => el.scrollTop <= 1
const atBottom = (el: HTMLElement) => el.scrollTop + el.clientHeight >= el.scrollHeight - 2

/**
 * One project per screen. Each project scrolls on its own; scrolling past the
 * bottom turns the page to the next project, and past the top goes back.
 * The dots on the right jump straight to any project.
 */
export function ProjectStack({ kind }: { kind: ProjectKind }) {
  const projects = projectsOf(kind)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const panels = useRef<(HTMLDivElement | null)[]>([])
  const stack = useRef<HTMLDivElement>(null)
  const wheel = useRef({ intent: 0, last: 0, lockUntil: 0, lockStart: 0 })
  const touch = useRef<{ x: number; y: number; top: boolean; bottom: boolean } | null>(null)

  const go = useCallback(
    (i: number, landing: Landing = 'top') => {
      if (i < 0 || i >= projects.length || i === activeRef.current) return
      const prev = panels.current[activeRef.current]
      const panel = panels.current[i]
      if (panel) panel.scrollTop = landing === 'top' ? 0 : panel.scrollHeight
      const hadFocus = !!prev && prev.contains(document.activeElement)
      activeRef.current = i
      setActive(i)
      const now = performance.now()
      wheel.current = { intent: 0, last: now, lockUntil: now + TURN_LOCK_MS, lockStart: now }
      // The old panel becomes inert, so carry keyboard focus over to the new one.
      if (hadFocus) panel?.focus({ preventScroll: true })
    },
    [projects.length],
  )

  // Wheel: native listener so it can cancel the scroll while turning the page.
  useEffect(() => {
    const el = stack.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      const w = wheel.current
      const now = performance.now()
      if (now < w.lockUntil) {
        // Swallow trackpad momentum from the gesture that turned the page.
        e.preventDefault()
        w.lockUntil = Math.min(w.lockStart + MAX_LOCK_MS, Math.max(w.lockUntil, now + 120))
        return
      }
      const panel = panels.current[activeRef.current]
      if (!panel) return
      if (now - w.last > 250) w.intent = 0
      w.last = now
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? panel.clientHeight : 1)
      const i = activeRef.current
      if (dy > 0 && atBottom(panel) && i < projects.length - 1) {
        e.preventDefault()
        w.intent += dy
        if (w.intent >= WHEEL_INTENT) go(i + 1, 'top')
      } else if (dy < 0 && atTop(panel) && i > 0) {
        e.preventDefault()
        w.intent -= dy
        if (w.intent >= WHEEL_INTENT) go(i - 1, 'bottom')
      } else {
        w.intent = 0
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [go, projects.length])

  // Touch: a fresh swipe that starts at the edge turns the page.
  const onTouchStart = (e: TouchEvent) => {
    const panel = panels.current[activeRef.current]
    const t = e.touches[0]
    if (!panel || !t || e.touches.length > 1) return
    touch.current = { x: t.clientX, y: t.clientY, top: atTop(panel), bottom: atBottom(panel) }
  }
  const onTouchEnd = (e: TouchEvent) => {
    const start = touch.current
    touch.current = null
    const panel = panels.current[activeRef.current]
    const t = e.changedTouches[0]
    if (!start || !panel || !t) return
    const dx = t.clientX - start.x
    const dy = start.y - t.clientY
    if (Math.abs(dx) > Math.abs(dy)) return
    const i = activeRef.current
    if (dy > SWIPE_INTENT && start.bottom && atBottom(panel)) go(i + 1, 'top')
    else if (dy < -SWIPE_INTENT && start.top && atTop(panel)) go(i - 1, 'bottom')
  }

  // Keyboard: Page Down / Space / Down at the bottom, Page Up / Up at the top.
  const onKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return
    const panel = panels.current[activeRef.current]
    if (!panel) return
    const i = activeRef.current
    const down = e.key === 'PageDown' || e.key === 'ArrowDown' || (e.key === ' ' && !e.shiftKey)
    const up = e.key === 'PageUp' || e.key === 'ArrowUp' || (e.key === ' ' && e.shiftKey)
    if (down && atBottom(panel) && i < projects.length - 1) {
      e.preventDefault()
      go(i + 1, 'top')
    } else if (up && atTop(panel) && i > 0) {
      e.preventDefault()
      go(i - 1, 'bottom')
    }
  }

  return (
    <div
      ref={stack}
      className="pstack"
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <h1 className="visually-hidden">{KIND_LABEL[kind]} projects</h1>

      {projects.map((p, i) => {
        const pos = i < active ? 'before' : i > active ? 'after' : 'active'
        return (
          <div
            key={p.id}
            ref={(el) => {
              panels.current[i] = el
            }}
            className="pstack__panel"
            data-pos={pos}
            inert={pos !== 'active'}
            tabIndex={-1}
            aria-label={p.name}
            role="region"
          >
            <div className="page page--project">
              <ProjectSection
                project={p}
                position={i + 1}
                total={projects.length}
                active={pos === 'active'}
                next={projects[i + 1]}
                onNext={() => go(i + 1)}
                onFirst={() => go(0)}
              />
            </div>
          </div>
        )
      })}

      {projects.length > 1 && (
        <nav className="pstack__dots" aria-label={`${KIND_LABEL[kind]} projects`}>
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`pstack__dot${i === active ? ' is-active' : ''}`}
              aria-label={p.name}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => go(i)}
            >
              <span className="pstack__dot-label" aria-hidden="true">
                {p.name}
              </span>
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
