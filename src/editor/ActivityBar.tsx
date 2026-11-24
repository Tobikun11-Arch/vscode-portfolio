import { Blocks, Bug, Settings, UserRound } from 'lucide-react'
import { VIEWS, type SidebarView } from './views'

interface ActivityBarProps {
  view: SidebarView
  sidebarOpen: boolean
  onSelectView(view: SidebarView): void
}

export function ActivityBar({ view, sidebarOpen, onSelectView }: ActivityBarProps) {
  return (
    <nav className="activity-bar" aria-label="Activity bar">
      {VIEWS.map(({ id, label, Icon }) => {
        const active = sidebarOpen && view === id
        return (
          <button
            key={id}
            type="button"
            aria-label={label}
            aria-pressed={active}
            className={`activity-bar__item${active ? ' is-active' : ''}`}
            onClick={() => onSelectView(id)}
          >
            <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )
      })}
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
