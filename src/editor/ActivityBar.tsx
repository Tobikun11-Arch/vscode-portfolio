import { Blocks, Bug, Files, GitBranch, Search, Settings, UserRound } from 'lucide-react'

interface ActivityBarProps {
  explorerOpen: boolean
  onToggleExplorer(): void
}

export function ActivityBar({ explorerOpen, onToggleExplorer }: ActivityBarProps) {
  return (
    <nav className="activity-bar" aria-label="Activity bar">
      <button
        type="button"
        aria-label="Explorer"
        aria-pressed={explorerOpen}
        className={`activity-bar__item${explorerOpen ? ' is-active' : ''}`}
        onClick={onToggleExplorer}
      >
        <Files size={22} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <span className="activity-bar__item" aria-hidden="true">
        <Search size={22} strokeWidth={1.5} />
      </span>
      <span className="activity-bar__item" aria-hidden="true">
        <GitBranch size={22} strokeWidth={1.5} />
      </span>
      <span className="activity-bar__item" aria-hidden="true">
        <Bug size={22} strokeWidth={1.5} />
      </span>
      <span className="activity-bar__item" aria-hidden="true">
        <Blocks size={22} strokeWidth={1.5} />
      </span>
      <span className="activity-bar__spacer" />
      <span className="activity-bar__item" aria-hidden="true">
        <UserRound size={22} strokeWidth={1.5} />
      </span>
      <span className="activity-bar__item" aria-hidden="true">
        <Settings size={22} strokeWidth={1.5} />
      </span>
    </nav>
  )
}
