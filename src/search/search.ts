import { createElement } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router'
import { FILES, type FileId } from '../files'
import { PAGES } from '../pages/registry'

export interface SearchDoc {
  id: FileId
  lines: string[]
}

export interface SearchMatch {
  line: string
  /** Position of the first match inside `line`. */
  index: number
}

export interface SearchResult {
  id: FileId
  matches: SearchMatch[]
}

const BLOCKS = 'h1, h2, h3, p, li, dt, dd'

/** Text of a block, adding a space between inline pieces that would otherwise glue words together. */
function blockText(el: Element): string {
  let out = ''
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? ''
    if (!text) continue
    const needsSpace = out !== '' && !/\s$/.test(out) && /^[\p{L}\p{N}]/u.test(text)
    out += needsSpace ? ` ${text}` : text
  }
  return out.replace(/\s+/g, ' ').trim()
}

/** One line per innermost block element, in document order. */
export function extractLines(root: Element): string[] {
  return [...root.querySelectorAll(BLOCKS)]
    .filter((el) => !el.querySelector(BLOCKS))
    .map(blockText)
    .filter((line) => line.length > 0)
}

/** Renders every page off-screen and records the text it shows. */
export function buildSearchIndex(): SearchDoc[] {
  return FILES.map((file) => {
    const container = document.createElement('div')
    const root = createRoot(container)
    flushSync(() => {
      root.render(createElement(MemoryRouter, null, createElement(PAGES[file.id])))
    })
    const lines = extractLines(container)
    root.unmount()
    return { id: file.id, lines }
  })
}

let cachedIndex: SearchDoc[] | null = null

/** Built once, on first search (call from an event handler, not during render). */
export function getSearchIndex(): SearchDoc[] {
  cachedIndex ??= buildSearchIndex()
  return cachedIndex
}

export function searchFiles(index: SearchDoc[], query: string): SearchResult[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []
  const results: SearchResult[] = []
  for (const doc of index) {
    const matches: SearchMatch[] = []
    for (const line of doc.lines) {
      const index = line.toLowerCase().indexOf(needle)
      if (index !== -1) matches.push({ line, index })
    }
    if (matches.length > 0) results.push({ id: doc.id, matches })
  }
  return results
}
