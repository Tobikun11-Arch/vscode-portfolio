/**
 * Retro mechanical mouse click, synthesized with the Web Audio API so there is
 * no audio file to download. Two tiny filtered noise bursts: the switch
 * snapping down, then a quieter echo from the plastic shell.
 */
import { getSettings } from './settings'

type AudioCtor = typeof AudioContext

let ctx: AudioContext | null = null
let noise: AudioBuffer | null = null

function getContext(): AudioContext | null {
  if (ctx) return ctx
  const Ctor: AudioCtor | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext
  if (!Ctor) return null
  try {
    ctx = new Ctor()
  } catch {
    return null
  }
  // 30ms of white noise, reused for every click.
  noise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.03), ctx.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return ctx
}

function burst(ac: AudioContext, at: number, freq: number, gain: number, length: number) {
  const src = ac.createBufferSource()
  src.buffer = noise
  const band = ac.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = freq
  band.Q.value = 1.4
  const amp = ac.createGain()
  amp.gain.setValueAtTime(gain, at)
  amp.gain.exponentialRampToValueAtTime(0.0001, at + length)
  src.connect(band).connect(amp).connect(ac.destination)
  src.start(at)
  src.stop(at + length + 0.01)
}

export function playClick() {
  if (!getSettings().sound) return
  const ac = getContext()
  if (!ac || !noise) return
  if (ac.state === 'suspended') void ac.resume()
  const t = ac.currentTime
  burst(ac, t, 3200, 0.55, 0.012)
  burst(ac, t + 0.008, 1400, 0.25, 0.02)
}
