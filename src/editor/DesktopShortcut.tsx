import { Folder } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { playClick } from './clickSound'

type Pos = { x: number; y: number }

const STORAGE_KEY = 'desktop-shortcut-pos'
const DRAG_THRESHOLD = 4
const START: Pos = { x: 12, y: 12 }

function loadPos(): Pos {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw) as Pos
      if (Number.isFinite(p.x) && Number.isFinite(p.y)) return p
    }
  } catch {
    /* storage unavailable: use the default spot */
  }
  return START
}

function savePos(p: Pos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}

/** Keep the icon fully on screen. */
function clamp(p: Pos, el: HTMLElement | null): Pos {
  const w = el?.offsetWidth ?? 92
  const h = el?.offsetHeight ?? 80
  return {
    x: Math.min(Math.max(0, p.x), Math.max(0, window.innerWidth - w)),
    y: Math.min(Math.max(0, p.y), Math.max(0, window.innerHeight - h)),
  }
}

/**
 * Old-school desktop icon: drag it anywhere on the wallpaper, double-click
 * (or tap on touch) to reopen the editor. Clicking plays a retro mouse click.
 */
export function DesktopShortcut({ onOpen }: { onOpen(): void }) {
  const [selected, setSelected] = useState(false)
  const [pos, setPos] = useState<Pos>(loadPos)
  const [dragging, setDragging] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const drag = useRef<{ id: number; startX: number; startY: number; origin: Pos; moved: boolean } | null>(null)

  // Pull the icon back on screen after a resize (or a saved spot from a bigger screen).
  useEffect(() => {
    const fit = () => setPos((p) => clamp(p, ref.current))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <button
      ref={ref}
      type="button"
      className={`desktop-shortcut${selected ? ' is-selected' : ''}${dragging ? ' is-dragging' : ''}`}
      style={{ left: pos.x, top: pos.y }}
      aria-label="Joenel-Portfolio"
      onClick={() => setSelected(true)}
      onBlur={() => setSelected(false)}
      onDoubleClick={onOpen}
      onPointerDown={(e) => {
        if (e.button !== 0) return
        playClick()
        setSelected(true)
        drag.current = { id: e.pointerId, startX: e.clientX, startY: e.clientY, origin: pos, moved: false }
        e.currentTarget.setPointerCapture?.(e.pointerId)
      }}
      onPointerMove={(e) => {
        const d = drag.current
        if (!d || d.id !== e.pointerId) return
        const dx = e.clientX - d.startX
        const dy = e.clientY - d.startY
        if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
        if (!d.moved) {
          d.moved = true
          setDragging(true)
        }
        setPos(clamp({ x: d.origin.x + dx, y: d.origin.y + dy }, ref.current))
      }}
      onPointerUp={(e) => {
        const d = drag.current
        drag.current = null
        if (d?.moved) {
          setDragging(false)
          setPos((p) => {
            savePos(p)
            return p
          })
          return
        }
        if (e.pointerType === 'touch') onOpen()
      }}
      onPointerCancel={() => {
        drag.current = null
        setDragging(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onOpen()
        }
      }}
    >
      <Folder className="desktop-shortcut__icon" size={44} strokeWidth={1.25} aria-hidden="true" />
      <span className="desktop-shortcut__label">Joenel-Portfolio</span>
    </button>
  )
}
