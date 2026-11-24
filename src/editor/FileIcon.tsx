import { Atom, FileText } from 'lucide-react'
import type { FileNode } from '../files'

/** File-type icon: React-style atom for .tsx, document for .md. */
export function FileIcon({ ext }: { ext: FileNode['ext'] }) {
  return ext === 'tsx' ? (
    <Atom className="file-icon file-icon--tsx" size={14} aria-hidden="true" />
  ) : (
    <FileText className="file-icon file-icon--md" size={14} aria-hidden="true" />
  )
}
