import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { buildRobots, buildSitemap } from './src/seo/sitemap.ts'

/**
 * The public address of the site, used for canonical links, social previews and the sitemap.
 * Set SITE_URL to override; on Vercel it is picked up automatically from the production domain.
 */
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL
const configuredSiteUrl =
  process.env.SITE_URL || (vercelDomain ? `https://${vercelDomain}` : undefined)
const siteUrl = (configuredSiteUrl ?? 'http://localhost:5173').replace(/\/+$/, '')

function seoFiles(): Plugin {
  return {
    name: 'portfolio-seo',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap(siteUrl, today) })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots(siteUrl) })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoFiles()],
  // Only bake the URL in when it's known; otherwise the app uses the page's own origin.
  define: configuredSiteUrl
    ? { 'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl) }
    : {},
})
