import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router'
import type { FileId } from '../files'
import { PAGE_IMAGES } from '../pages/registry'
import { preloadImages } from '../preload'
import { applyPageMeta, metaFor, NOT_FOUND_META } from '../seo/seo'
import { useEditorTabs } from '../tabs/useEditorTabs'
import { ActivityBar } from './ActivityBar'
import { GitGraphPanel } from './GitGraphPanel'
import { SearchPanel } from './SearchPanel'
import { useDesktopWindow } from '../desktop/useDesktopWindow'
import { EditorArea } from './EditorArea'
import './editor.css'
import { Explorer } from './Explorer'
import { StatusBar } from './StatusBar'
import { TabBar } from './TabBar'
import { TitleBar } from './TitleBar'
import { VIEWS, type SidebarView } from './views'
import { ExtensionsPanel } from './ExtensionsPanel'
import { RunPanel } from './RunPanel'
import { Terminal, type CommandRequest } from './Terminal'
import { OutlinePanel } from './OutlinePanel'
import { QuickOpen, type PaletteCommand } from './QuickOpen'
import { THEMES, WALLPAPERS, updateSettings, useSettings } from './settings'
import { RESUME_FILENAME, RESUME_URL } from '../pages/resume'
import { fileById } from '../files'

export function EditorWindow() {
  const { tabs, activeId, status, open, close } = useEditorTabs()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [view, setView] = useState<SidebarView>('explorer')

  const [drawerOpen, setDrawerOpen] = useState(false)
  const { pathname } = useLocation()

  // Bottom terminal panel, started from Run and Debug (or Ctrl + `).
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [command, setCommand] = useState<CommandRequest | null>(null)
  const runCommand = (cmd: string) => {
    setTerminalOpen(true)
    setCommand((prev) => ({ cmd, n: (prev?.n ?? 0) + 1 }))
  }

  const settings = useSettings()
  const [outlineOpen, setOutlineOpen] = useState(false)
  const [quickOpen, setQuickOpen] = useState<'files' | 'commands' | null>(null)

  // Editor shortcuts: Ctrl+` terminal, Ctrl+P go to file, Ctrl+Shift+P commands, Ctrl+B side bar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return
      const key = e.key.toLowerCase()
      if (e.key === '`') setTerminalOpen((v) => !v)
      else if (key === 'p') setQuickOpen(e.shiftKey ? 'commands' : 'files')
      else if (key === 'b' && !e.shiftKey) setSidebarOpen((v) => !v)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Back / forward arrows walk the browser history, like the editor's navigation history.
  const navigate = useNavigate()
  const location = useLocation()
  const navType = useNavigationType()
  const historyIdx = (window.history.state as { idx?: number } | null)?.idx ?? 0
  const [maxIdx, setMaxIdx] = useState(historyIdx)
  const [seenKey, setSeenKey] = useState(location.key)
  if (location.key !== seenKey) {
    setSeenKey(location.key)
    setMaxIdx((m) => (navType === 'PUSH' ? historyIdx : Math.max(m, historyIdx)))
  }

  useEffect(() => {
    preloadImages(PAGE_IMAGES)
  }, [])

  // Browser title + SEO/social tags follow the open file.
  useEffect(() => {
    if (status === 'file' && activeId) applyPageMeta(metaFor(activeId))
    else if (status === 'empty') applyPageMeta({ ...NOT_FOUND_META, title: 'Joenel-Portfolio' })
    else applyPageMeta(NOT_FOUND_META)
  }, [status, activeId])

  // Any navigation (file click, Back/Forward, links in a page) closes the phone drawer.
  const [drawerPath, setDrawerPath] = useState(pathname)
  if (pathname !== drawerPath) {
    setDrawerPath(pathname)
    setDrawerOpen(false)
  }

  const win = useDesktopWindow('editor')
  const maximized = win.maximized

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

  const resetWindow = () => {
    win.reset()
    setSidebarOpen(true)
    setView('explorer')
    setTerminalOpen(false)
    setOutlineOpen(false)
  }

  const downloadResume = () => {
    const link = document.createElement('a')
    link.href = RESUME_URL
    link.download = RESUME_FILENAME
    link.click()
  }

  const paletteCommands: PaletteCommand[] = [
    { id: 'terminal', label: 'View: Toggle Terminal', run: () => setTerminalOpen((v) => !v) },
    { id: 'sidebar', label: 'View: Toggle Primary Side Bar', run: () => setSidebarOpen((v) => !v) },
    { id: 'outline', label: 'View: Toggle Outline', run: () => setOutlineOpen((v) => !v) },
    ...THEMES.map((t) => ({
      id: `theme-${t.id}`,
      label: `Preferences: Color Theme: ${t.label}`,
      run: () => updateSettings({ theme: t.id }),
    })),
    ...WALLPAPERS.map((w) => ({
      id: `wall-${w.id}`,
      label: `Preferences: Wallpaper: ${w.label}`,
      run: () => updateSettings({ wallpaper: w.id }),
    })),
    {
      id: 'sound',
      label: `Preferences: ${settings.sound ? 'Turn Off' : 'Turn On'} Sound Effects`,
      run: () => updateSettings({ sound: !settings.sound }),
    },
    { id: 'resume', label: 'Joenel: Download Resume', run: downloadResume },
    { id: 'run', label: 'Debug: Run Portfolio', run: () => runCommand('help') },
    { id: 'reset', label: 'View: Reset Window', run: resetWindow },
  ]

  if (!win.visible) return null

  return (
    <>
      <div
        ref={win.ref}
        className={`window${maximized ? ' is-maximized' : ''}${win.dragging ? ' is-dragging' : ''}`}
        style={win.style}
        onPointerDownCapture={win.focus}
        data-theme={settings.theme}
        role="application"
        aria-label="Joenel-Portfolio editor"
      >
        <TitleBar
          onToggleDrawer={() => setDrawerOpen((v) => !v)}
          onMinimize={win.minimize}
          onMaximize={win.toggleMaximize}
          onClose={win.close}
          maximized={maximized}
          onDragStart={win.startDrag}
          nav={{
            canBack: historyIdx > 0,
            canForward: historyIdx < maxIdx,
            onBack: () => navigate(-1),
            onForward: () => navigate(1),
          }}
          onQuickOpen={() => setQuickOpen('files')}
          layout={{
            sidebar: sidebarOpen,
            panel: terminalOpen,
            outline: outlineOpen,
            onToggleSidebar: () => setSidebarOpen((v) => !v),
            onTogglePanel: () => setTerminalOpen((v) => !v),
            onToggleOutline: () => setOutlineOpen((v) => !v),
          }}
        />
        <div className="window__body">
          <ActivityBar
            view={view}
            sidebarOpen={sidebarOpen}
            onSelectView={selectView}
            onCommandPalette={() => setQuickOpen('commands')}
            onResetWindow={resetWindow}
          />
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
              {view === 'debug' && (
                <RunPanel
                  running={terminalOpen}
                  onRun={() => {
                    setDrawerOpen(false)
                    setTerminalOpen(true)
                  }}
                  onStop={() => setTerminalOpen(false)}
                  onCommand={(cmd) => {
                    setDrawerOpen(false)
                    runCommand(cmd)
                  }}
                />
              )}
              {view === 'extensions' && <ExtensionsPanel />}
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
          <div className={`editor-pane${terminalOpen ? ' has-terminal' : ''}`}>
            <TabBar tabs={tabs} activeId={activeId} onSelect={open} onClose={close} />
            <EditorArea status={status} activeId={activeId} />
            {terminalOpen && (
              <Terminal
                request={command}
                onOpenFile={open}
                onExit={() => {
                  setTerminalOpen(false)
                  setCommand(null)
                }}
              />
            )}
          </div>
          {outlineOpen && (
            <OutlinePanel
              fileKey={activeId ?? status}
              fileName={activeId ? fileById(activeId).name : ''}
              onClose={() => setOutlineOpen(false)}
            />
          )}
        </div>
        <StatusBar activeId={activeId} running={terminalOpen} />
        {quickOpen && (
          <QuickOpen
            key={quickOpen}
            startWithCommands={quickOpen === 'commands'}
            commands={paletteCommands}
            onOpenFile={openFromSidebar}
            onClose={() => setQuickOpen(null)}
          />
        )}
      </div>
    </>
  )
}
