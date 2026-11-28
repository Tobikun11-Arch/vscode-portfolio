import { fileById, type FileId } from '../files'

export interface PageSeo {
  title: string
  description: string
}

export interface PageMeta extends PageSeo {
  /** Absolute canonical URL; absent for pages that shouldn't be indexed. */
  url?: string
  robots: 'index, follow' | 'noindex'
}

const NAME = 'Joenel F. Sevellejo'

export const PAGE_SEO: Record<FileId, PageSeo> = {
  home: {
    title: `${NAME} — Fullstack Developer`,
    description:
      'Joenel F. Sevellejo is a fullstack developer from Cavite, Philippines building web and mobile apps with React, Next.js, Node.js and Go.',
  },
  about: {
    title: `About — ${NAME}`,
    description:
      'Joenel F. Sevellejo, fullstack developer and BSIT student at Cavite State University – Tanza. Skills: React, Next.js, Node.js, Go, Docker.',
  },
  experience: {
    title: `Experience — ${NAME}`,
    description:
      'Work experience of Joenel F. Sevellejo: fullstack developer at Dynamic VA Referral Services, freelance clients since 2024, and lead developer of the DonClaudio’s capstone.',
  },
  'web-app': {
    title: `Web App Projects — ${NAME}`,
    description:
      'Web app projects by Joenel F. Sevellejo, fullstack developer: React, Next.js and Node.js applications built for clients.',
  },
  'mobile-app': {
    title: `Mobile App Projects — ${NAME}`,
    description:
      'Mobile app projects by Joenel F. Sevellejo, built with React Native and Expo for iOS and Android.',
  },
  'desktop-app': {
    title: `Desktop App Projects — ${NAME}`,
    description:
      'Desktop app projects by Joenel F. Sevellejo, fullstack developer, built with modern web technologies.',
  },
  contact: {
    title: `Contact — ${NAME}`,
    description:
      'Contact Joenel F. Sevellejo, fullstack developer in Cavite, Philippines, by email, GitHub, LinkedIn or Instagram.',
  },
}

export const NOT_FOUND_META: PageMeta = {
  title: `File not found — ${NAME}`,
  description: PAGE_SEO.home.description,
  robots: 'noindex',
}

/** Set at build time (see vite.config.ts); falls back to the current origin. */
export function siteUrl(): string {
  const fromBuild = import.meta.env.VITE_SITE_URL as string | undefined
  return fromBuild || window.location.origin
}

export function metaFor(id: FileId, site: string = siteUrl()): PageMeta {
  const base = site.replace(/\/+$/, '')
  return { ...PAGE_SEO[id], url: base + fileById(id).path, robots: 'index, follow' }
}

function upsert(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

const metaTag = (key: 'name' | 'property', name: string) => () => {
  const el = document.createElement('meta')
  el.setAttribute(key, name)
  return el
}

/** Keeps the head tags in sync with the open file (one tag each, never duplicated). */
export function applyPageMeta(meta: PageMeta): void {
  document.title = meta.title
  const set = (key: 'name' | 'property', name: string, value: string) =>
    upsert(`meta[${key}="${name}"]`, metaTag(key, name), 'content', value)

  set('name', 'description', meta.description)
  set('name', 'robots', meta.robots)
  set('property', 'og:title', meta.title)
  set('property', 'og:description', meta.description)
  set('name', 'twitter:title', meta.title)
  set('name', 'twitter:description', meta.description)

  if (meta.url) {
    set('property', 'og:url', meta.url)
    upsert(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement('link'), { rel: 'canonical' }),
      'href',
      meta.url,
    )
  } else {
    document.head.querySelector('link[rel="canonical"]')?.remove()
  }
}
