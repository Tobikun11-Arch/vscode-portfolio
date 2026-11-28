/** Images already requested, so each one is fetched once. */
const requested = new Set<string>()
/** Keep loaded images referenced so their decoded pixels stay ready to paint. */
const kept: HTMLImageElement[] = []

/**
 * Warm the cache so images appear instantly when a file is first opened.
 * Fetches a few at a time in the given order (so the first ones finish first
 * and the page's own requests aren't starved), and decodes each one up front.
 */
export function preloadImages(urls: string[], concurrency = 4): void {
  if (typeof Image === 'undefined') return
  const queue = urls.filter((u) => u && !requested.has(u))
  queue.forEach((u) => requested.add(u))

  const next = () => {
    const url = queue.shift()
    if (!url) return
    const img = new Image()
    img.decoding = 'async'
    img.src = url
    kept.push(img)
    const done = () => next()
    // decode() resolves once the image is downloaded *and* ready to draw.
    if (typeof img.decode === 'function') img.decode().then(done, done)
    else img.onload = img.onerror = done
  }
  for (let i = 0; i < concurrency; i++) next()
}
