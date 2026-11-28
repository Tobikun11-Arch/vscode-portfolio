import { useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { closeOut, genie, zoomFrom } from '../editor/windowMotion'
import { dockPoint, focusApp, hideApp, useDesktop, type AppId } from './desktopStore'

/**
 * Everything a macOS-style window needs: open/minimize genie into its dock icon,
 * close, zoom, dragging by the title bar, and coming to the front when clicked.
 */
export function useDesktopWindow(app: AppId) {
  const { open, front } = useDesktop()
  const visible = open[app]
  const ref = useRef<HTMLDivElement>(null)
  const [maximized, setMaximized] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const animating = useRef(false)
  const zoomFirst = useRef<DOMRect | null>(null)
  const wasVisible = useRef(visible)

  // Pour the window out of its dock icon when it (re)opens.
  useLayoutEffect(() => {
    if (visible && !wasVisible.current && ref.current) genie(ref.current, dockPoint(app), true)
    wasVisible.current = visible
  }, [visible, app])

  // Zoom (maximize / restore) animation after the new size is laid out.
  useLayoutEffect(() => {
    if (zoomFirst.current && ref.current) zoomFrom(ref.current, zoomFirst.current)
    zoomFirst.current = null
  }, [maximized])

  const runThen = async (anim: Animation | null, then: () => void) => {
    if (animating.current) return
    if (anim) {
      animating.current = true
      await anim.finished.catch(() => {})
      animating.current = false
    }
    then()
  }

  const minimize = () => {
    const el = ref.current
    void runThen(el && genie(el, dockPoint(app)), () => hideApp(app))
  }

  const close = () => {
    const el = ref.current
    void runThen(el && closeOut(el), () => {
      setOffset({ x: 0, y: 0 })
      setMaximized(false)
      hideApp(app)
    })
  }

  const toggleMaximize = () => {
    if (animating.current) return
    zoomFirst.current = ref.current?.getBoundingClientRect() ?? null
    setMaximized((m) => !m)
  }

  const reset = () => {
    setOffset({ x: 0, y: 0 })
    setMaximized(false)
  }

  /** Drag by the title bar, keeping the title bar reachable on screen. */
  const startDrag = (e: ReactPointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el || maximized || window.matchMedia?.('(max-width: 767px)').matches) return
    const rect = el.getBoundingClientRect()
    const start = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
    const base = { left: rect.left - offset.x, top: rect.top - offset.y }
    const KEEP = 120
    let moved = false

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x
      const dy = ev.clientY - start.y
      if (!moved && Math.hypot(dx, dy) < 3) return
      if (!moved) {
        moved = true
        setDragging(true)
      }
      const left = Math.min(Math.max(base.left + start.ox + dx, KEEP - rect.width), window.innerWidth - KEEP)
      const top = Math.min(Math.max(base.top + start.oy + dy, 0), window.innerHeight - 40)
      setOffset({ x: left - base.left, y: top - base.top })
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      setDragging(false)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  const moved = !maximized && (offset.x !== 0 || offset.y !== 0)
  const style: CSSProperties = {
    zIndex: front === app ? 20 : 10,
    ...(moved ? { translate: `${offset.x}px ${offset.y}px` } : {}),
  }

  return {
    ref,
    visible,
    maximized,
    dragging,
    style,
    minimize,
    close,
    toggleMaximize,
    reset,
    startDrag,
    focus: () => focusApp(app),
  }
}
