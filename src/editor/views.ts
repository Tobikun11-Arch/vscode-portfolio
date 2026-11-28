import { Blocks, Bug, Files, GitBranch, Search } from 'lucide-react'
import type { ComponentType } from 'react'

export type SidebarView = 'explorer' | 'search' | 'git' | 'debug' | 'extensions'

export const VIEWS: {
  id: SidebarView
  label: string
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>
}[] = [
  { id: 'explorer', label: 'Explorer', Icon: Files },
  { id: 'search', label: 'Search', Icon: Search },
  { id: 'git', label: 'Source Control', Icon: GitBranch },
  { id: 'debug', label: 'Run and Debug', Icon: Bug },
  { id: 'extensions', label: 'Extensions', Icon: Blocks },
]
