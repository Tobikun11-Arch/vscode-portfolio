import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import type { FileId } from '../files'
import { PAGE_IMAGES } from '../pages/registry'
import { preloadImages } from '../preload'
import { useEditorTabs } from '../tabs/useEditorTabs'
import { ActivityBar } from './ActivityBar'
import { GitGraphPanel } from './GitGraphPanel'
import { SearchPanel } from './SearchPanel'
import { DesktopShortcut } from './DesktopShortcut'
import { EditorArea } from './EditorArea'
import './editor.css'
import { Explorer } from './Explorer'
import { StatusBar } from './StatusBar'
import { TabBar } from './TabBar'
import { TitleBar } from './TitleBar'
import { VIEWS, type SidebarView } from './views'

type WindowState = 'normal' | 'maximized' | 'hidden'

export function EditorWindow() {
  const { tabs, activeId, status, open, close } = useEditorTabs()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [view, setView] = useState<SidebarView>('explorer')
  const [windowState, setWindowState] = useState<WindowState>('normal')

  const [drawerOpen, setDrawerOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    preloadImages(PAGE_IMAGES)
  }, [])

  // Any navigation (file click, Back/Forward, links in a page) closes the phone drawer.
  const [drawerPath, setDrawerPath] = useState(pathname)
  if (pathname !== drawerPath) {
    setDrawerPath(pathname)
    setDrawerOpen(false)
  }

  const hide = () => setWindowState('hidden')
  const openFromSidebar = (id: FileId) => {
    setDrawerOpen(false)
    open(id)
  }

  // Like the real editor: clicking the active view's icon hides the side bar.
  const selectView = (next: SidebarView) => {
    if (next === view && sidebarOpen) {
      setSidebarOpen(false)
    } else {
      setView(next)
      setSidebarOpen(true)
    }
  }

  if (windowState === 'hidden') {
    return (
      <div className="desktop">
        <DesktopShortcut onOpen={() => setWindowState('normal')} />
      </div>
    )
  }

  const maximized = windowState === 'maximized'

  return (
    <div className="desktop">
      <div
        className={`window${maximized ? ' is-maximized' : ''}`}
        role="application"
        aria-label="Joenel-Portfolio editor"
      >
        <TitleBar
          onToggleDrawer={() => setDrawerOpen((v) => !v)}
          onMinimize={hide}
          onMaximize={() => setWindowState(maximized ? 'normal' : 'maximized')}
          onClose={hide}
          maximized={maximized}
        />
        <div className="window__body">
          <ActivityBar view={view} sidebarOpen={sidebarOpen} onSelectView={selectView} />
          {(sidebarOpen || drawerOpen) && (
            <aside
              className={`sidebar${drawerOpen ? ' is-drawer-open' : ''}`}
              aria-label="Side bar"
            >
              {/* Phones have no activity bar, so the drawer gets its own view switcher */}
              <div className="sidebar__switcher">
                {VIEWS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    aria-label={`Show ${label}`}
                    aria-pressed={view === id}
                    className={view === id ? 'is-active' : ''}
                    onClick={() => setView(id)}
                  >
                    <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                ))}
              </div>
              {view === 'explorer' && <Explorer activeId={activeId} onOpen={openFromSidebar} />}
              {view === 'search' && <SearchPanel onOpen={openFromSidebar} />}
              {view === 'git' && <GitGraphPanel />}
            </aside>
          )}
          {drawerOpen && (
            <button
              type="button"
              className="drawer-backdrop"
              aria-label="Close explorer"
              onClick={() => setDrawerOpen(false)}
            />
          )}
          <div className="editor-pane">
            <TabBar tabs={tabs} activeId={activeId} onSelect={open} onClose={close} />
            <EditorArea status={status} activeId={activeId} />
          </div>
        </div>
        <StatusBar activeId={activeId} />
      </div>
    </div>
  )
}
