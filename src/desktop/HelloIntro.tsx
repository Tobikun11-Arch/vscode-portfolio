import { useEffect, useState } from 'react'

const WORDS = ['hello', 'kumusta']
/** How long each word takes to write and then rest on screen. */
const WORD_MS = [2300, 1900]
const FADE_MS = 700
const SEEN_KEY = 'hello-intro-seen'

/**
 * First-visit greeting: "hello" (then "kumusta") written out in handwriting,
 * like a new Mac's welcome, before fading into the desktop. Plays once per
 * visit, only on the home address, and any click or key skips it.
 */
export function shouldShowIntro(): boolean {
  if (import.meta.env.MODE === 'test' || typeof window === 'undefined') return false
  if (window.location.pathname.replace(/\/+$/, '') !== '') return false
  try {
    return sessionStorage.getItem(SEEN_KEY) !== '1'
  } catch {
    return true
  }
}

export function HelloIntro({ onDone }: { onDone(): void }) {
  const [word, setWord] = useState(0)
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const reduced =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  // Wait (briefly) for the handwriting font so the first stroke isn't drawn in a fallback.
  useEffect(() => {
    let cancelled = false
    const go = () => !cancelled && setReady(true)
    const timeout = window.setTimeout(go, 1200)
    document.fonts?.load('600 160px "Dancing Script"').then(go, go)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* fine: it may play again next visit */
    }
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [])

  // Word → word → fade out.
  useEffect(() => {
    if (!ready || leaving) return
    const last = word === WORDS.length - 1
    const t = window.setTimeout(
      () => (last ? setLeaving(true) : setWord((w) => w + 1)),
      reduced ? 900 : WORD_MS[word],
    )
    return () => clearTimeout(t)
  }, [ready, word, leaving, reduced])

  useEffect(() => {
    if (!leaving) return
    const t = window.setTimeout(onDone, reduced ? 0 : FADE_MS)
    return () => clearTimeout(t)
  }, [leaving, onDone, reduced])

  // Any click or key skips straight to the desktop.
  useEffect(() => {
    const skip = () => setLeaving(true)
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [])

  return (
    <div
      className={`hello${leaving ? ' is-leaving' : ''}`}
      role="img"
      aria-label="hello"
      onPointerDown={() => setLeaving(true)}
    >
      {ready && (
        <svg key={word} className="hello__word" viewBox="0 0 900 300" aria-hidden="true">
          <text x="50%" y="62%" textAnchor="middle">
            {WORDS[word]}
          </text>
        </svg>
      )}
      <span className="hello__hint">Click anywhere to skip</span>
    </div>
  )
}
