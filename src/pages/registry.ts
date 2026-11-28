import type { ComponentType } from 'react'
import type { FileId } from '../files'
import { About } from './About'
import { Contact } from './Contact'
import { Experience } from './Experience'
import { Home } from './Home'
import { DesktopApp } from './projects/DesktopApp'
import { MobileApp } from './projects/MobileApp'
import { PROJECTS, screensOf } from './projects/data'
import { WebApp } from './projects/WebApp'

export const PAGES: Record<FileId, ComponentType> = {
  home: Home,
  about: About,
  experience: Experience,
  'web-app': WebApp,
  'mobile-app': MobileApp,
  'desktop-app': DesktopApp,
  contact: Contact,
}

export const PAGE_IMAGES: string[] = [
  '/profile.png',
  // First banner screenshot of every project first, so the top of each page is ready soonest…
  ...PROJECTS.flatMap((p) => p.banners[0]?.screens[0]?.src ?? []),
  // …then every other screenshot, so opening any project shows its images instantly.
  ...PROJECTS.flatMap((p) => screensOf(p).flatMap((s) => s.src ?? [])),
]
