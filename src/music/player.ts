import { useSyncExternalStore } from 'react'
import { TRACKS } from './tracks'

export type RepeatMode = 'all' | 'one' | 'off'

export interface PlayerState {
  /** Index into TRACKS, or -1 before anything has played. */
  index: number
  playing: boolean
  loading: boolean
  time: number
  duration: number
  volume: number
  shuffle: boolean
  repeat: RepeatMode
}

let state: PlayerState = {
  index: -1,
  playing: false,
  loading: false,
  time: 0,
  duration: 30,
  volume: 0.8,
  shuffle: false,
  repeat: 'all',
}

const listeners = new Set<() => void>()
const set = (patch: Partial<PlayerState>) => {
  state = { ...state, ...patch }
  listeners.forEach((fn) => fn())
}

/** One audio element for the whole site, created on first play (keeps tests and SSR happy). */
let audio: HTMLAudioElement | null = null
let failedInARow = 0

function el(): HTMLAudioElement | null {
  if (audio || typeof Audio === 'undefined') return audio
  audio = new Audio()
  audio.preload = 'auto'
  audio.volume = state.volume
  audio.addEventListener('timeupdate', () => set({ time: audio!.currentTime }))
  audio.addEventListener('loadedmetadata', () => set({ duration: audio!.duration || 30 }))
  audio.addEventListener('playing', () => {
    failedInARow = 0
    set({ playing: true, loading: false })
  })
  audio.addEventListener('waiting', () => set({ loading: true }))
  audio.addEventListener('pause', () => set({ playing: false }))
  // Previews are 30 seconds: when one ends, roll straight into the next song.
  audio.addEventListener('ended', () => {
    if (state.repeat === 'one') return load(state.index)
    const last = !state.shuffle && state.index === TRACKS.length - 1
    if (last && state.repeat === 'off') return set({ playing: false, time: 0 })
    next()
  })
  // A preview that won't load is skipped (but never loop forever if the network is down).
  audio.addEventListener('error', () => {
    failedInARow++
    if (failedInARow < 3) next()
    else set({ playing: false, loading: false })
  })
  return audio
}

function load(index: number) {
  const a = el()
  if (!a) return
  const i = (index + TRACKS.length) % TRACKS.length
  if (state.index !== i || !a.src) a.src = TRACKS[i].preview
  else a.currentTime = 0
  set({ index: i, time: 0, duration: 30, loading: true })
  a.play().catch(() => set({ playing: false, loading: false }))
}

export function playIndex(index: number) {
  load(index)
}

export function togglePlay() {
  const a = el()
  if (!a) return
  if (state.index < 0) return load(0)
  if (a.paused) void a.play().catch(() => set({ playing: false }))
  else a.pause()
}

export function next() {
  if (state.shuffle && TRACKS.length > 1) {
    let i = state.index
    while (i === state.index) i = Math.floor(Math.random() * TRACKS.length)
    return load(i)
  }
  load(state.index + 1)
}

export function prev() {
  // Like most players: past 3 seconds, "previous" restarts the song.
  if (audio && audio.currentTime > 3) {
    audio.currentTime = 0
    return
  }
  load(state.index - 1)
}

export function seek(seconds: number) {
  if (!audio) return
  audio.currentTime = Math.max(0, Math.min(seconds, state.duration))
  set({ time: audio.currentTime })
}

export function setVolume(v: number) {
  const volume = Math.max(0, Math.min(1, v))
  if (audio) audio.volume = volume
  set({ volume })
}

export function toggleShuffle() {
  set({ shuffle: !state.shuffle })
}

export function cycleRepeat() {
  set({ repeat: state.repeat === 'all' ? 'one' : state.repeat === 'one' ? 'off' : 'all' })
}

export function shufflePlay() {
  set({ shuffle: true })
  load(Math.floor(Math.random() * TRACKS.length))
}

const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
const get = () => state

export function usePlayer(): PlayerState {
  return useSyncExternalStore(subscribe, get, get)
}

export const formatTime = (s: number) => {
  const t = Math.max(0, Math.floor(s || 0))
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}
