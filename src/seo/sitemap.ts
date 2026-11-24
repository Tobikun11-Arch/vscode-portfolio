import { FILES } from '../files.ts'

/** Pure helpers used by vite.config.ts to emit sitemap.xml and robots.txt at build time. */
export function buildSitemap(site: string, lastmod?: string): string {
  const base = site.replace(/\/+$/, '')
  const urls = FILES.map((file) => {
    const lines = [`    <loc>${base}${file.path}</loc>`]
    if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`)
    lines.push(`    <priority>${file.id === 'home' ? '1.0' : '0.8'}</priority>`)
    return `  <url>\n${lines.join('\n')}\n  </url>`
  })
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

export function buildRobots(site: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${site.replace(/\/+$/, '')}/sitemap.xml\n`
}
