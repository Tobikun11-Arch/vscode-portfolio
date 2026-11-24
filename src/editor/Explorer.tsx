import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { FILE_TREE, type FileId, type FolderNode, type TreeNode } from '../files'
import { FileIcon } from './FileIcon'

interface ExplorerProps {
  activeId: FileId | null
  onOpen(id: FileId): void
  className?: string
}

const activate = (event: KeyboardEvent, action: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    action()
  }
}

export function Explorer({ activeId, onOpen, className = '' }: ExplorerProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set())

  const toggle = (name: string) =>
    setCollapsed((current) => {
      const next = new Set(current)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })

  const renderNode = (node: TreeNode, depth: number) => {
    const indent = { paddingLeft: 8 + depth * 12 }

    if (node.kind === 'file') {
      const selected = node.id === activeId
      return (
        <li
          key={node.id}
          role="treeitem"
          aria-label={node.name}
          aria-selected={selected}
          tabIndex={0}
          className={`tree-row${selected ? ' is-active' : ''}`}
          style={indent}
          onClick={() => onOpen(node.id)}
          onKeyDown={(e) => activate(e, () => onOpen(node.id))}
        >
          <span className="tree-row__twisty" aria-hidden="true" />
          <FileIcon ext={node.ext} />
          <span className="tree-row__name">{node.name}</span>
        </li>
      )
    }

    const expanded = !collapsed.has(node.name)
    return (
      <li key={node.name} role="none">
        <div
          role="treeitem"
          aria-label={node.name}
          aria-expanded={expanded}
          aria-selected={false}
          tabIndex={0}
          className="tree-row"
          style={indent}
          onClick={() => toggle(node.name)}
          onKeyDown={(e) => activate(e, () => toggle(node.name))}
        >
          <span className="tree-row__twisty" aria-hidden="true">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
          <span className="tree-row__name">{node.name}</span>
        </div>
        {expanded && (
          <ul role="group" className="tree-group">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    )
  }

  const root: FolderNode = FILE_TREE
  return (
    <nav className={`explorer ${className}`.trim()} aria-label="Explorer">
      <div className="explorer__title">EXPLORER</div>
      <div className="explorer__root">
        <ChevronDown size={14} aria-hidden="true" />
        <span>{root.name.toUpperCase()}</span>
      </div>
      <ul role="tree" aria-label={root.name} className="tree">
        {root.children.map((child) => renderNode(child, 1))}
      </ul>
    </nav>
  )
}
