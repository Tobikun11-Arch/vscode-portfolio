import { describe, expect, it } from 'vitest'
import { buildSearchIndex, searchFiles, type SearchDoc } from './search'

const DOCS: SearchDoc[] = [
  { id: 'home', lines: ["Hi, I'm Joenel", 'Fullstack developer'] },
  { id: 'about', lines: ["I'm Joenel F. Sevellejo", 'Skills', 'Joenel likes Go'] },
  { id: 'contact', lines: ['Email', 'hello@example.com'] },
]

describe('searchFiles', () => {
  it('finds every file and line that mentions the query, case-insensitively', () => {
    const results = searchFiles(DOCS, 'JOENEL')
    expect(results.map((r) => r.id)).toEqual(['home', 'about'])
    expect(results[1].matches).toEqual([
      { line: "I'm Joenel F. Sevellejo", index: 4 },
      { line: 'Joenel likes Go', index: 0 },
    ])
  })

  it('returns nothing for blank queries', () => {
    expect(searchFiles(DOCS, '')).toEqual([])
    expect(searchFiles(DOCS, '   ')).toEqual([])
  })

  it('trims the query before matching', () => {
    expect(searchFiles(DOCS, '  example ').map((r) => r.id)).toEqual(['contact'])
  })

  it('returns nothing when there is no match', () => {
    expect(searchFiles(DOCS, 'kubernetes')).toEqual([])
  })
})

describe('buildSearchIndex', () => {
  it('indexes the text each page actually renders', () => {
    const index = buildSearchIndex()
    const about = index.find((d) => d.id === 'about')
    expect(about?.lines.some((l) => l.includes('Joenel F. Sevellejo'))).toBe(true)
    const experience = index.find((d) => d.id === 'experience')
    expect(experience?.lines.some((l) => l.includes('Dyna-Mail'))).toBe(true)
  })

  it('finds my name in home, about and contact', () => {
    const ids = searchFiles(buildSearchIndex(), 'joenel').map((r) => r.id)
    expect(ids).toEqual(expect.arrayContaining(['home', 'about', 'contact']))
  })

  it('keeps lines separate instead of gluing text together', () => {
    const index = buildSearchIndex()
    const all = index.flatMap((d) => d.lines)
    expect(all.every((l) => l.trim() === l && l.length > 0)).toBe(true)
    expect(all).toContain('Go')
  })
})
