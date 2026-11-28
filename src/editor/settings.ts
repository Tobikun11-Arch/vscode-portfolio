import { useSyncExternalStore } from 'react'

export type ThemeId = 'dark' | 'light' | 'monokai'
export type WallpaperId = 'bliss' | 'dusk' | 'ocean' | 'graphite'

export interface Settings {
  theme: ThemeId
  wallpaper: WallpaperId
  sound: boolean
}

export const THEMES: { id: ThemeId; label: string }[] = [
  { id: 'dark', label: 'Dark Modern' },
  { id: 'light', label: 'Light Modern' },
  { id: 'monokai', label: 'Monokai' },
]

export const WALLPAPERS: { id: WallpaperId; label: string }[] = [
  { id: 'bliss', label: 'Rolling hills' },
  { id: 'dusk', label: 'Dusk' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'graphite', label: 'Graphite' },
]

const KEY = 'portfolio-settings'
const DEFAULTS: Settings = { theme: 'dark', wallpaper: 'bliss', sound: true }

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) }
  } catch {
    /* storage unavailable: defaults */
  }
  return DEFAULTS
}

let current: Settings = load()
const listeners = new Set<() => void>()

function applyWallpaper(id: WallpaperId) {
  if (typeof document !== 'undefined') document.documentElement.dataset.wallpaper = id
}
applyWallpaper(current.wallpaper)

export function getSettings(): Settings {
  return current
}

export function updateSettings(patch: Partial<Settings>) {
  current = { ...current, ...patch }
  applyWallpaper(current.wallpaper)
  try {
    localStorage.setItem(KEY, JSON.stringify(current))
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn())
}

const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Visitor preferences (theme, wallpaper, sound), remembered in this browser. */
export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, getSettings, getSettings)
}
