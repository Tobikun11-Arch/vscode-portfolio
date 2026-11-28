import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { FILES, FILE_TREE, type FileId } from '../files'
import { FileIcon } from './FileIcon'

export interface PaletteCommand {
  id: string
  label: string
  run(): void
}

interface QuickOpenProps {
  onOpenFile(id: FileId): void
  commands: PaletteCommand[]
  onClose(): void
  /** Start in command mode (">"), like Ctrl+Shift+P. */
  startWithCommands?: boolean
}

type Item =
  | { kind: 'file'; key: string; label: string; detail: string; ext: 'md' | 'tsx'; id: FileId }
  | { kind: 'cmd'; key: string; label: string; run(): void }

/** Ctrl+P "Go to file", plus ">" for a few commands. */
export function QuickOpen({ onOpenFile, commands, onClose, startWithCommands }: QuickOpenProps) {
  const [query, setQuery] = useState(startWithCommands ? '>' : '')
  const [selected, setSelected] = useState(0)
  const field = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    field.current?.focus()
  }, [])

  const commandMode = query.startsWith('>')
  const needle = (commandMode ? query.slice(1) : query).trim().toLowerCase()

  const items: Item[] = commandMode
    ? commands
        .filter((c) => c.label.toLowerCase().includes(needle))
        .map((c) => ({ kind: 'cmd', key: c.id, label: c.label, run: c.run }))
    : FILES.filter((f) => `${f.name} ${f.path}`.toLowerCase().includes(needle)).map((f) => ({
        kind: 'file',
        key: f.id,
        label: f.name,
        detail: `${FILE_TREE.name}${f.path.startsWith('/projects/') ? '/projects' : ''}`,
        ext: f.ext,
        id: f.id,
      }))

  const pick = (item: Item | undefined) => {
    if (!item) return
    onClose()
    if (item.kind === 'file') onOpenFile(item.id)
    else item.run()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const next = (selected + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % Math.max(1, items.length)
      setSelected(next)
      list.current?.children[next]?.scrollIntoView?.({ block: 'nearest' })
    } else if (e.key === 'Enter') {
      e.preventDefault()
      pick(items[selected])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <div className="quick-open__scrim" onPointerDown={onClose}>
      <div
        className="quick-open"
        role="dialog"
        aria-label="Go to file"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <input
          ref={field}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelected(0)
          }}
          onKeyDown={onKeyDown}
          placeholder="Search files by name (type > for commands)"
          aria-label="Search files by name"
          spellCheck={false}
        />
        <ul ref={list} className="quick-open__list" role="listbox">
          {items.length === 0 && (
            <li className="quick-open__empty">
              {commandMode ? 'No matching commands' : 'No matching files'}
            </li>
          )}
          {items.map((item, i) => (
            <li
              key={item.key}
              role="option"
              aria-selected={i === selected}
              className={`quick-open__item${i === selected ? ' is-selected' : ''}`}
              onPointerEnter={() => setSelected(i)}
              onClick={() => pick(item)}
            >
              {item.kind === 'file' ? (
                <>
                  <FileIcon ext={item.ext} />
                  <span className="quick-open__label">{item.label}</span>
                  <span className="quick-open__detail">{item.detail}</span>
                </>
              ) : (
                <span className="quick-open__label">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
