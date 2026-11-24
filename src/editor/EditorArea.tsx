import type { FileId } from '../files'
import { NotFound } from '../pages/NotFound'
import { PAGES } from '../pages/registry'
import '../pages/pages.css'
import type { EditorStatus } from '../tabs/useEditorTabs'
import { EmptyEditor } from './EmptyEditor'

interface EditorAreaProps {
  status: EditorStatus
  activeId: FileId | null
}

/** The only region where page content renders; it scrolls on its own. */
export function EditorArea({ status, activeId }: EditorAreaProps) {
  let content
  if (status === 'file' && activeId) {
    const Page = PAGES[activeId]
    content = <Page />
  } else if (status === 'empty') {
    content = <EmptyEditor />
  } else {
    content = <NotFound />
  }

  return (
    // key resets scroll position when switching files
    <main className="editor-area" key={activeId ?? status}>
      {content}
    </main>
  )
}
