import { X } from 'lucide-react'
import { fileById, type FileId } from '../files'
import { FileIcon } from './FileIcon'

interface TabBarProps {
  tabs: FileId[]
  activeId: FileId | null
  onSelect(id: FileId): void
  onClose(id: FileId): void
}

export function TabBar({ tabs, activeId, onSelect, onClose }: TabBarProps) {
  return (
    <div className="tab-bar" role="tablist" aria-label="Open files">
      {tabs.map((id) => {
        const file = fileById(id)
        const selected = id === activeId
        return (
          <div key={id} role="presentation" className={`tab${selected ? ' is-active' : ''}`}>
            <button
              type="button"
              role="tab"
              aria-selected={selected}
              className="tab__label"
              onClick={() => onSelect(id)}
            >
              <FileIcon ext={file.ext} />
              {file.name}
            </button>
            <button
              type="button"
              className="tab__close"
              aria-label={`Close ${file.name}`}
              onClick={() => onClose(id)}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
