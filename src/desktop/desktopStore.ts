import { useSyncExternalStore } from 'react'

export type AppId = 'editor' | 'music'

interface DesktopState {
  /** Which app windows are showing (hidden = minimized or closed). */
  open: Record<AppId, boolean>
  /** The window on top. */
  front: AppId
  /** Bumped to ask a window to minimize itself (it owns the genie animation). */
  minimizeReq: Record<AppId, number>
}

/**
 * The site opens on the bare desktop. A deep link (e.g. /about from Google or a
 * shared link) opens the editor straight away so the visitor lands on that page.
 * Tests render the editor at "/", so they start with it open too.
 */
function initialEditorOpen() {
  if (import.meta.env.MODE === 'test') return true
  if (typeof window === 'undefined') return false
  return window.location.pathname.replace(/\/+$/, '') !== ''
}

let state: DesktopState = {
  open: { editor: initialEditorOpen(), music: false },
  front: 'editor',
  minimizeReq: { editor: 0, music: 0 },
}
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((fn) => fn())

export function openApp(app: AppId) {
  state = { ...state, open: { ...state.open, [app]: true }, front: app }
  emit()
}

export function hideApp(app: AppId) {
  const other: AppId = app === 'editor' ? 'music' : 'editor'
  state = {
    ...state,
    open: { ...state.open, [app]: false },
    front: state.open[other] ? other : state.front,
  }
  emit()
}

/** Ask an open window to minimize into the dock (with its animation). */
export function requestMinimize(app: AppId) {
  state = { ...state, minimizeReq: { ...state.minimizeReq, [app]: state.minimizeReq[app] + 1 } }
  emit()
}

export function focusApp(app: AppId) {
  if (state.front === app) return
  state = { ...state, front: app }
  emit()
}

export function getDesktop(): DesktopState {
  return state
}

const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useDesktop(): DesktopState {
  return useSyncExternalStore(subscribe, getDesktop, getDesktop)
}

/** Center of an app's dock icon: windows minimize into it and open out of it. */
export function dockPoint(app: AppId): { x: number; y: number } {
  const icon = document.querySelector(`[data-dock-app="${app}"]`)
  if (icon) {
    const r = icon.getBoundingClientRect()
    if (r.width) return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
  return { x: window.innerWidth / 2, y: window.innerHeight - 30 }
}
