import { Folder } from 'lucide-react'
import { useState } from 'react'

/** Old-school desktop icon: double-click (or tap on touch) reopens the editor. */
export function DesktopShortcut({ onOpen }: { onOpen(): void }) {
  const [selected, setSelected] = useState(false)
  return (
    <button
      type="button"
      className={`desktop-shortcut${selected ? ' is-selected' : ''}`}
      aria-label="Joenel-Portfolio"
      onClick={() => setSelected(true)}
      onBlur={() => setSelected(false)}
      onDoubleClick={onOpen}
      onPointerUp={(e) => {
        if (e.pointerType === 'touch') onOpen()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onOpen()
        }
      }}
    >
      <Folder className="desktop-shortcut__icon" size={44} strokeWidth={1.25} aria-hidden="true" />
      <span className="desktop-shortcut__label">Joenel-Portfolio</span>
    </button>
  )
}
