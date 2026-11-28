import { Settings, UserRound } from 'lucide-react'
import { useCallback, useState } from 'react'
import { AccountMenu, ManageMenu } from './ActivityMenus'
import { VIEWS, type SidebarView } from './views'

interface ActivityBarProps {
  view: SidebarView
  sidebarOpen: boolean
  onSelectView(view: SidebarView): void
  onCommandPalette(): void
  onResetWindow(): void
}

export function ActivityBar({
  view,
  sidebarOpen,
  onSelectView,
  onCommandPalette,
  onResetWindow,
}: ActivityBarProps) {
  const [menu, setMenu] = useState<'account' | 'manage' | null>(null)
  const closeMenu = useCallback(() => setMenu(null), [])
  const toggle = (which: 'account' | 'manage') => setMenu((m) => (m === which ? null : which))

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
      <span className="activity-bar__spacer" />
      <button
        type="button"
        aria-label="Accounts"
        aria-expanded={menu === 'account'}
        data-menu-trigger
        className={`activity-bar__item${menu === 'account' ? ' is-open' : ''}`}
        onClick={() => toggle('account')}
      >
        <UserRound size={22} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Manage"
        aria-expanded={menu === 'manage'}
        data-menu-trigger
        className={`activity-bar__item${menu === 'manage' ? ' is-open' : ''}`}
        onClick={() => toggle('manage')}
      >
        <Settings size={22} strokeWidth={1.5} aria-hidden="true" />
      </button>
      {menu === 'account' && <AccountMenu onClose={closeMenu} />}
      {menu === 'manage' && (
        <ManageMenu onClose={closeMenu} onCommandPalette={onCommandPalette} onResetWindow={onResetWindow} />
      )}
    </nav>
  )
}
