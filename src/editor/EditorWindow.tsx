import { useEffect, useState } from 'react'
import { PAGE_IMAGES } from '../pages/registry'
import { preloadImages } from '../preload'
import { useEditorTabs } from '../tabs/useEditorTabs'
import { ActivityBar } from './ActivityBar'
import { EditorArea } from './EditorArea'
import './editor.css'
import { Explorer } from './Explorer'
import { StatusBar } from './StatusBar'
import { TabBar } from './TabBar'
import { TitleBar } from './TitleBar'

export function EditorWindow() {
  const { tabs, activeId, status, open, close } = useEditorTabs()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    preloadImages(PAGE_IMAGES)
  }, [])

  const noop = () => {}

  return (
    <div className="desktop">
      <div className="window" role="application" aria-label="Joenel-Portfolio editor">
        <TitleBar
          onToggleDrawer={noop}
          onMinimize={noop}
          onMaximize={noop}
          onClose={noop}
          maximized={false}
        />
        <div className="window__body">
          <ActivityBar
            explorerOpen={sidebarOpen}
            onToggleExplorer={() => setSidebarOpen((v) => !v)}
          />
          {sidebarOpen && <Explorer activeId={activeId} onOpen={open} />}
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
