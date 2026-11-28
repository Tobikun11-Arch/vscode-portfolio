import { GitBranch, Play } from 'lucide-react'
import { FILE_TREE, fileById, type FileId } from '../files'

export function StatusBar({ activeId, running = false }: { activeId: FileId | null; running?: boolean }) {
  const file = activeId ? fileById(activeId) : null
  const path = file
    ? `${FILE_TREE.name}${file.path.startsWith('/projects/') ? '/projects' : ''}/${file.name}`
    : ''
  return (
    // Like the real editor, the status bar turns orange while something is running.
    <footer className={`status-bar${running ? ' is-running' : ''}`}>
      <span className="status-bar__item">
        <GitBranch size={12} aria-hidden="true" /> main
      </span>
      {running && (
        <span className="status-bar__item">
          <Play size={11} fill="currentColor" aria-hidden="true" /> portfolio (running)
        </span>
      )}
      <span className="status-bar__item status-bar__path">{path}</span>
      <span className="status-bar__spacer" />
      {file && <span className="status-bar__item">Ln 1, Col 1</span>}
      {file && <span className="status-bar__item">{file.ext === 'md' ? 'Markdown' : 'TypeScript JSX'}</span>}
    </footer>
  )
}
