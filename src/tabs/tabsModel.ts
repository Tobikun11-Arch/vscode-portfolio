import { FILES, type FileId } from '../files'

const STORAGE_KEY = 'jp:tabs'
const KNOWN_IDS = new Set<string>(FILES.map((f) => f.id))

export function openTab(tabs: FileId[], id: FileId): FileId[] {
  return tabs.includes(id) ? tabs : [...tabs, id]
}

export function closeTab(
  tabs: FileId[],
  id: FileId,
): { tabs: FileId[]; neighbor: FileId | null } {
  const index = tabs.indexOf(id)
  if (index === -1) return { tabs, neighbor: null }
  const remaining = tabs.filter((t) => t !== id)
  const neighbor = tabs[index + 1] ?? tabs[index - 1] ?? null
  return { tabs: remaining, neighbor }
}

export function loadTabs(): FileId[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const result: FileId[] = []
    for (const value of parsed) {
      if (typeof value === 'string' && KNOWN_IDS.has(value) && !result.includes(value as FileId)) {
        result.push(value as FileId)
      }
    }
    return result
  } catch {
    return []
  }
}

export function saveTabs(tabs: FileId[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tabs))
  } catch {
    // Storage unavailable (private mode, quota): tabs just won't persist.
  }
}
