export const GITHUB_OWNER = 'Tobikun11-Arch'
export const GITHUB_REPO = 'vscode-portfolio'
export const REPO_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`
export const COMMITS_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?per_page=50`

const CACHE_KEY = 'jp:commits'
// GitHub allows 60 unauthenticated requests per hour per visitor, so cache briefly.
const CACHE_TTL_MS = 5 * 60 * 1000

export interface Commit {
  sha: string
  shortSha: string
  subject: string
  author: string
  date: string
  url: string
}

interface ApiCommit {
  sha: string
  html_url: string
  commit: { message: string; author: { name: string; date: string } | null }
}

type FetchFn = (url: string, init?: RequestInit) => Promise<Response>

function readCache(): Commit[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { at, commits } = JSON.parse(raw) as { at: number; commits: Commit[] }
    return Date.now() - at < CACHE_TTL_MS && Array.isArray(commits) ? commits : null
  } catch {
    return null
  }
}

function writeCache(commits: Commit[]): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), commits }))
  } catch {
    // Storage unavailable: just refetch next time.
  }
}

/** Latest commits of the portfolio repo, newest first. */
export async function fetchCommits(
  fetchFn: FetchFn = (url, init) => fetch(url, init),
  { force = false }: { force?: boolean } = {},
): Promise<Commit[]> {
  if (!force) {
    const cached = readCache()
    if (cached) return cached
  }

  const res = await fetchFn(COMMITS_URL, { headers: { Accept: 'application/vnd.github+json' } })
  if (res.status === 409) return [] // repository has no commits yet
  if (!res.ok) throw new Error(`GitHub returned ${res.status}. Try again in a little while.`)

  const data = (await res.json()) as ApiCommit[]
  const commits = data.map((c) => ({
    sha: c.sha,
    shortSha: c.sha.slice(0, 7),
    subject: c.commit.message.split('\n')[0],
    author: c.commit.author?.name ?? 'unknown',
    date: c.commit.author?.date ?? '',
    url: c.html_url,
  }))
  writeCache(commits)
  return commits
}

const UNITS: [unit: string, seconds: number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
]

export function timeAgo(date: string, now: Date = new Date()): string {
  const seconds = Math.max(0, (now.getTime() - new Date(date).getTime()) / 1000)
  for (const [unit, size] of UNITS) {
    const n = Math.floor(seconds / size)
    if (n >= 1) return `${n} ${unit}${n === 1 ? '' : 's'} ago`
  }
  return 'just now'
}
