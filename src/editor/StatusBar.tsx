import { GitBranch } from 'lucide-react'
import { FILE_TREE, fileById, type FileId } from '../files'

export function StatusBar({ activeId }: { activeId: FileId | null }) {
  const file = activeId ? fileById(activeId) : null
  const path = file
    ? `${FILE_TREE.name}${file.path.startsWith('/projects/') ? '/projects' : ''}/${file.name}`
    : ''
  return (
    <footer className="status-bar">
      <span className="status-bar__item">
        <GitBranch size={12} aria-hidden="true" /> main
      </span>
      <span className="status-bar__item status-bar__path">{path}</span>
      <span className="status-bar__spacer" />
      {file && <span className="status-bar__item">Ln 1, Col 1</span>}
      {file && <span className="status-bar__item">{file.ext === 'md' ? 'Markdown' : 'TypeScript JSX'}</span>}
    </footer>
  )
}
