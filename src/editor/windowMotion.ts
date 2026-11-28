/**
 * macOS-style window motion, done with the Web Animations API.
 * Every helper returns null when it can't or shouldn't animate (no WAAPI,
 * e.g. in tests, or the visitor prefers reduced motion), so callers just
 * change state straight away.
 */

export interface Point {
  x: number
  y: number
}

export function canAnimate(el: HTMLElement | null): el is HTMLElement {
  if (!el || typeof el.animate !== 'function') return false
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

const clampPct = (n: number) => Math.min(100, Math.max(0, n))

/**
 * Genie effect: the window is sucked into `target` (the desktop folder).
 * First the edge nearest the target pinches into a neck while the window
 * squashes toward it, then the whole thing shrinks into the point.
 * Pass `reverse` to pour the window back out of the folder.
 */
export function genie(el: HTMLElement, target: Point, reverse = false): Animation | null {
  if (!canAnimate(el)) return null
  const r = el.getBoundingClientRect()
  const ox = target.x - r.left
  const oy = target.y - r.top
  const neckCenter = clampPct((ox / r.width) * 100)
  const l = clampPct(neckCenter - 8)
  const rr = clampPct(neckCenter + 8)
  const fromAbove = target.y < r.top + r.height / 2

  const full = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
  const half = fromAbove
    ? `polygon(${l / 2}% 0%, ${(rr + 100) / 2}% 0%, 100% 100%, 0% 100%)`
    : `polygon(0% 0%, 100% 0%, ${(rr + 100) / 2}% 100%, ${l / 2}% 100%)`
  const neck = fromAbove
    ? `polygon(${l}% 0%, ${rr}% 0%, 100% 100%, 0% 100%)`
    : `polygon(0% 0%, 100% 0%, ${rr}% 100%, ${l}% 100%)`
  const origin = `${ox}px ${oy}px`

  return el.animate(
    [
      { offset: 0, transformOrigin: origin, clipPath: full, transform: 'scale(1)', opacity: 1 },
      { offset: 0.35, transformOrigin: origin, clipPath: half, transform: 'scale(0.92, 0.7)', opacity: 1 },
      { offset: 0.65, transformOrigin: origin, clipPath: neck, transform: 'scale(0.45, 0.25)', opacity: 0.9 },
      { offset: 1, transformOrigin: origin, clipPath: neck, transform: 'scale(0.02, 0.02)', opacity: 0 },
    ],
    {
      duration: 520,
      easing: reverse ? 'cubic-bezier(0.2, 0.8, 0.3, 1)' : 'cubic-bezier(0.55, 0, 0.75, 0.4)',
      direction: reverse ? 'reverse' : 'normal',
      // Hold the end frame while React unmounts the window (and the start frame before it opens).
      fill: reverse ? 'backwards' : 'forwards',
    },
  )
}

/** Close: a quick shrink and fade, like a macOS window closing. */
export function closeOut(el: HTMLElement): Animation | null {
  if (!canAnimate(el)) return null
  return el.animate(
    [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.94)', opacity: 0 },
    ],
    { duration: 180, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
  )
}

/** Zoom (maximize/restore): slide and stretch from the old frame to the new one (FLIP). */
export function zoomFrom(el: HTMLElement, first: DOMRect): Animation | null {
  if (!canAnimate(el)) return null
  const last = el.getBoundingClientRect()
  if (!last.width || !last.height) return null
  const dx = first.left - last.left
  const dy = first.top - last.top
  const sx = first.width / last.width
  const sy = first.height / last.height
  return el.animate(
    [
      { transformOrigin: 'top left', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
      { transformOrigin: 'top left', transform: 'none' },
    ],
    { duration: 280, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
  )
}
