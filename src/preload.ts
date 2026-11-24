/** Warm the browser cache so images appear instantly when a file is first opened. */
export function preloadImages(urls: string[]): void {
  for (const url of urls) {
    const img = new Image()
    img.src = url
  }
}
