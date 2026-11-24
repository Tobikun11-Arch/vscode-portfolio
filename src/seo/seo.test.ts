import { beforeEach, describe, expect, it } from 'vitest'
import { FILES } from '../files'
import { applyPageMeta, metaFor, NOT_FOUND_META, PAGE_SEO } from './seo'
import { buildRobots, buildSitemap } from './sitemap'

const SITE = 'https://example.vercel.app'

const head = (selector: string) => document.head.querySelectorAll(selector)
const attr = (selector: string, name: string) => document.head.querySelector(selector)?.getAttribute(name)

describe('PAGE_SEO', () => {
  it('has a title and description for every file', () => {
    for (const file of FILES) {
      const seo = PAGE_SEO[file.id]
      expect(seo.title).toContain('Joenel')
      expect(seo.description.length).toBeGreaterThan(50)
      expect(seo.description.length).toBeLessThanOrEqual(160)
    }
  })

  it('home title leads with name and role', () => {
    expect(PAGE_SEO.home.title).toBe('Joenel F. Sevellejo — Fullstack Developer')
  })
})

describe('metaFor', () => {
  it('builds absolute canonical urls', () => {
    expect(metaFor('about', SITE).url).toBe('https://example.vercel.app/about')
    expect(metaFor('home', SITE).url).toBe('https://example.vercel.app/')
    expect(metaFor('web-app', SITE + '/').url).toBe('https://example.vercel.app/projects/web-app')
  })
})

describe('applyPageMeta', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.title = ''
  })

  it('sets title, description, canonical and social tags', () => {
    applyPageMeta(metaFor('about', SITE))
    expect(document.title).toBe(PAGE_SEO.about.title)
    expect(attr('meta[name="description"]', 'content')).toBe(PAGE_SEO.about.description)
    expect(attr('link[rel="canonical"]', 'href')).toBe(`${SITE}/about`)
    expect(attr('meta[property="og:title"]', 'content')).toBe(PAGE_SEO.about.title)
    expect(attr('meta[property="og:url"]', 'content')).toBe(`${SITE}/about`)
    expect(attr('meta[name="twitter:title"]', 'content')).toBe(PAGE_SEO.about.title)
    expect(attr('meta[name="robots"]', 'content')).toBe('index, follow')
  })

  it('updates existing tags instead of adding duplicates', () => {
    applyPageMeta(metaFor('about', SITE))
    applyPageMeta(metaFor('contact', SITE))
    expect(head('meta[name="description"]')).toHaveLength(1)
    expect(head('link[rel="canonical"]')).toHaveLength(1)
    expect(attr('link[rel="canonical"]', 'href')).toBe(`${SITE}/contact`)
  })

  it('marks not-found pages as noindex', () => {
    applyPageMeta(NOT_FOUND_META)
    expect(attr('meta[name="robots"]', 'content')).toBe('noindex')
    expect(head('link[rel="canonical"]')).toHaveLength(0)
  })
})

describe('sitemap and robots', () => {
  it('lists every page url once', () => {
    const xml = buildSitemap(SITE)
    for (const file of FILES) {
      const loc = `<loc>${SITE}${file.path === '/' ? '/' : file.path}</loc>`
      expect(xml.split(loc)).toHaveLength(2)
    }
    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/)
    expect(xml).not.toContain('~empty')
  })

  it('robots allows crawling and points to the sitemap', () => {
    expect(buildRobots(SITE)).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
  })
})
