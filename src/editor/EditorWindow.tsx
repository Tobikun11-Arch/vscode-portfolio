import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import type { FileId } from '../files'
import { PAGE_IMAGES } from '../pages/registry'
import { preloadImages } from '../preload'
import { useEditorTabs } from '../tabs/useEditorTabs'
import { ActivityBar } from './ActivityBar'
import { DesktopShortcut } from './DesktopShortcut'
import { EditorArea } from './EditorArea'
import './editor.css'
import { Explorer } from './Explorer'
import { StatusBar } from './StatusBar'
import { TabBar } from './TabBar'
import { TitleBar } from './TitleBar'

type WindowState = 'normal' | 'maximized' | 'hidden'

export function EditorWindow() {
  const { tabs, activeId, status, open, close } = useEditorTabs()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [windowState, setWindowState] = useState<WindowState>('normal')

  const [drawerOpen, setDrawerOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    preloadImages(PAGE_IMAGES)
  }, [])

  // Any navigation (file click, Back/Forward, links in a page) closes the phone drawer.
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  const hide = () => setWindowState('hidden')
  const openFromExplorer = (id: FileId) => {
    setDrawerOpen(false)
    open(id)
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
          <ActivityBar
            explorerOpen={sidebarOpen}
            onToggleExplorer={() => setSidebarOpen((v) => !v)}
          />
          {(sidebarOpen || drawerOpen) && (
            <Explorer
              activeId={activeId}
              onOpen={openFromExplorer}
              className={drawerOpen ? 'is-drawer-open' : ''}
            />
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
