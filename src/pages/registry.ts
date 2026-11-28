import type { ComponentType } from 'react'
import type { FileId } from '../files'
import { About } from './About'
import { Contact } from './Contact'
import { Experience } from './Experience'
import { Home } from './Home'
import { DesktopApp } from './projects/DesktopApp'
import { MobileApp } from './projects/MobileApp'
import { PROJECT_SHOTS } from './projects/shots'
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
  // First screenshot of each project; the rest lazy-load as you swipe.
  ...Object.values(PROJECT_SHOTS).map((shots) => shots[0].src),
]
