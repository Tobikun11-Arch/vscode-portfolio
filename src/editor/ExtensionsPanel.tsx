import { Database } from 'lucide-react'
import { useState } from 'react'
import {
  siDocker,
  siElectron,
  siExpo,
  siExpress,
  siFirebase,
  siGin,
  siGit,
  siGithubactions,
  siGo,
  siJavascript,
  siJest,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostman,
  siPrisma,
  siPython,
  siReact,
  siReactquery,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
  type SimpleIcon,
} from 'simple-icons'

interface Extension {
  name: string
  /** Official logo (Simple Icons, CC0). Without one, the tile shows `mono` instead. */
  logo?: SimpleIcon
  /** Fallback letters on a colored tile, for tech without a logo in Simple Icons. */
  mono: string
  color: string
  ink?: string
  category: 'Language' | 'Frontend' | 'Backend' | 'Tooling'
  about: string
  /** Where I used it, from the resume. */
  usedIn?: string
}

/** My tech stack, from the resume's skills section, shown as installed extensions. */
const EXTENSIONS: Extension[] = [
  { name: 'TypeScript', logo: siTypescript, mono: 'TS', color: '#3178c6', category: 'Language', about: 'Typed JavaScript for every project here.', usedIn: 'Dyna-Mail, Clovars, DonClaudio’s' },
  { name: 'JavaScript', logo: siJavascript, mono: 'JS', color: '#f7df1e', ink: '#1f1f1f', category: 'Language', about: 'The language of the web, front to back.' },
  { name: 'Go', logo: siGo, mono: 'Go', color: '#00add8', category: 'Language', about: 'Fast, simple backend services with Gin.' },
  { name: 'Java', logo: siOpenjdk, mono: 'Jv', color: '#e76f00', category: 'Language', about: 'OOP foundations and desktop systems.' },
  { name: 'Python', logo: siPython, mono: 'Py', color: '#3776ab', category: 'Language', about: 'Scripting, DSA practice and ML basics.' },
  { name: 'SQL', mono: 'SQ', color: '#5c6bc0', category: 'Language', about: 'Relational data modeling and queries.' },
  { name: 'React.js', logo: siReact, mono: 'Re', color: '#20232a', ink: '#61dafb', category: 'Frontend', about: 'Component-driven UIs, including this portfolio.' },
  { name: 'Next.js', logo: siNextdotjs, mono: 'N', color: '#000000', category: 'Frontend', about: 'Full-stack React with SSR and API routes.', usedIn: 'Dyna-Mail, DonClaudio’s' },
  { name: 'React Native (Expo)', logo: siExpo, mono: 'RN', color: '#4630eb', category: 'Frontend', about: 'One codebase for iOS, Android and web.', usedIn: 'Freelance clients' },
  { name: 'Electron', logo: siElectron, mono: 'El', color: '#2b2e3a', ink: '#9feaf9', category: 'Frontend', about: 'Cross-platform desktop apps with auto-updates.', usedIn: 'Clovars' },
  { name: 'Tailwind CSS', logo: siTailwindcss, mono: 'Tw', color: '#0f172a', ink: '#38bdf8', category: 'Frontend', about: 'Utility-first styling, fast and consistent.' },
  { name: 'TanStack Query', logo: siReactquery, mono: 'TQ', color: '#ff4154', category: 'Frontend', about: 'Server state, caching and background refetching.' },
  { name: 'Zustand', mono: 'Zu', color: '#443e38', ink: '#f5d0a9', category: 'Frontend', about: 'Small, fast client state.' },
  { name: 'Vite', logo: siVite, mono: 'Vi', color: '#646cff', category: 'Frontend', about: 'Instant dev server and lean builds.' },
  { name: 'Node.js', logo: siNodedotjs, mono: 'No', color: '#3c873a', category: 'Backend', about: 'JavaScript on the server.' },
  { name: 'Express.js', logo: siExpress, mono: 'Ex', color: '#353535', category: 'Backend', about: 'REST APIs, webhooks and auth.', usedIn: 'DonClaudio’s, DynaCore Ledger' },
  { name: 'Gin (Go)', logo: siGin, mono: 'Gi', color: '#0090a8', category: 'Backend', about: 'High-performance HTTP APIs in Go.' },
  { name: 'MongoDB', logo: siMongodb, mono: 'Mo', color: '#13aa52', category: 'Backend', about: 'Document database for fast-moving schemas.', usedIn: 'Dyna-Mail, DonClaudio’s' },
  { name: 'Prisma ORM', logo: siPrisma, mono: 'Pr', color: '#2d3748', category: 'Backend', about: 'Type-safe database access.', usedIn: 'Dyna-Mail' },
  { name: 'Firebase', logo: siFirebase, mono: 'Fb', color: '#ffca28', ink: '#1f1f1f', category: 'Backend', about: 'Auth, realtime data and hosting.' },
  { name: 'Supabase', logo: siSupabase, mono: 'Sb', color: '#1c1c1c', ink: '#3ecf8e', category: 'Backend', about: 'Postgres with auth and storage built in.' },
  { name: 'Git & GitHub', logo: siGit, mono: 'Gt', color: '#f05032', category: 'Tooling', about: 'Branching and pull-request reviews on every project.' },
  { name: 'GitHub Actions', logo: siGithubactions, mono: 'GA', color: '#2088ff', category: 'Tooling', about: 'CI pipelines and release automation.', usedIn: 'Clovars' },
  { name: 'Jest', logo: siJest, mono: 'Je', color: '#99425b', category: 'Tooling', about: 'Unit and API tests with Supertest.', usedIn: 'DynaCore Ledger (155 tests)' },
  { name: 'Docker', logo: siDocker, mono: 'Dk', color: '#2496ed', category: 'Tooling', about: 'Containers for consistent environments.' },
  { name: 'Postman', logo: siPostman, mono: 'Pm', color: '#ff6c37', category: 'Tooling', about: 'Testing every REST endpoint before handoff.' },
  { name: 'Vercel', logo: siVercel, mono: '▲', color: '#000000', category: 'Tooling', about: 'Deploys for web apps and APIs.' },
]

/** Very dark brand colors (Next.js, Vercel, Express…) would vanish on a dark tile. */
function isDark(hex: string) {
  const n = parseInt(hex, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60
}

function ExtensionIcon({ ext }: { ext: Extension }) {
  if (ext.name === 'SQL') {
    return (
      <span className="ext__icon is-logo" aria-hidden="true" style={{ color: ext.color }}>
        <Database size={22} strokeWidth={1.8} />
      </span>
    )
  }
  if (!ext.logo) {
    return (
      <span className="ext__icon" style={{ background: ext.color, color: ext.ink ?? '#ffffff' }} aria-hidden="true">
        {ext.mono}
      </span>
    )
  }
  const { path, hex } = ext.logo
  return (
    <span className="ext__icon is-logo" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22" fill={isDark(hex) ? 'currentColor' : `#${hex}`}>
        <path d={path} />
      </svg>
    </span>
  )
}

export function ExtensionsPanel() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const shown = q
    ? EXTENSIONS.filter((e) =>
        [e.name, e.category, e.about, e.usedIn ?? ''].some((t) => t.toLowerCase().includes(q)),
      )
    : EXTENSIONS

  return (
    <section className="side-panel" aria-label="Extensions">
      <div className="side-panel__title">EXTENSIONS</div>
      <div className="search-box">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search my stack"
          aria-label="Search extensions"
          spellCheck={false}
        />
      </div>
      <div className="side-panel__section">
        INSTALLED <span className="ext-count">{shown.length}</span>
      </div>
      {shown.length === 0 && (
        <p className="side-panel__note">Not installed yet. Ask me, I learn fast.</p>
      )}
      <ul className="ext-list">
        {shown.map((ext) => (
          <li key={ext.name} className="ext">
            <ExtensionIcon ext={ext} />
            <span className="ext__body">
              <span className="ext__name">{ext.name}</span>
              <span className="ext__about">{ext.about}</span>
              <span className="ext__meta">
                <span className="ext__publisher">{ext.usedIn ? `Used in ${ext.usedIn}` : ext.category}</span>
                <span className="ext__badge">Installed</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
