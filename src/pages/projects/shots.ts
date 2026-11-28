import type { Screenshot } from './ScreenshotCarousel'

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1)

/**
 * Screenshots per project, in the order the carousel shows them.
 * Drop real images into /public/projects/<project>/ and list them here.
 */
export const PROJECT_SHOTS = {
  'web-app': range(4).map<Screenshot>((i) => ({
    src: `/placeholders/web-app-${i}.svg`,
    caption: `Web app screen ${i}`,
    width: 800,
    height: 450,
  })),
  'mobile-app': range(5).map<Screenshot>((i) => ({
    src: `/placeholders/mobile-app-${i}.svg`,
    caption: `Mobile app screen ${i}`,
    width: 390,
    height: 844,
  })),
  'desktop-app': range(3).map<Screenshot>((i) => ({
    src: `/placeholders/desktop-app-${i}.svg`,
    caption: `Desktop app screen ${i}`,
    width: 800,
    height: 450,
  })),
} satisfies Record<string, Screenshot[]>
