import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Menu,
  Minus,
  PanelBottom,
  PanelLeft,
  PanelRight,
  Search,
  Square,
  X,
} from 'lucide-react'
import { Logo } from './Logo'

interface TitleBarProps {
  onToggleDrawer(): void
  onMinimize(): void
  onMaximize(): void
  onClose(): void
  maximized: boolean
}

const MENU = ['File', 'Edit', 'Selection', 'View', 'Go']

export function TitleBar({
  onToggleDrawer,
  onMinimize,
  onMaximize,
  onClose,
  maximized,
}: TitleBarProps) {
  return (
    <header className="title-bar">
      <button
        type="button"
        className="title-bar__drawer-btn"
        aria-label="Open explorer"
        onClick={onToggleDrawer}
      >
        <Menu size={18} aria-hidden="true" />
      </button>
      <span className="title-bar__logo">
        <Logo size={16} />
      </span>
      <div className="title-bar__menu" aria-hidden="true">
        {MENU.map((word) => (
          <span key={word}>{word}</span>
        ))}
        <span>…</span>
      </div>
      <div className="title-bar__center">
        <span className="title-bar__nav" aria-hidden="true">
          <ArrowLeft size={14} />
          <ArrowRight size={14} />
        </span>
        <div className="title-bar__search">
          <Search size={12} aria-hidden="true" />
          <span>Joenel-Portfolio</span>
        </div>
      </div>
      <div className="title-bar__layout" aria-hidden="true">
        <PanelLeft size={14} />
        <PanelBottom size={14} />
        <PanelRight size={14} />
      </div>
      <div className="title-bar__controls">
        <button type="button" aria-label="Minimize" onClick={onMinimize}>
          <Minus size={14} aria-hidden="true" />
        </button>
        <button type="button" aria-label={maximized ? 'Restore' : 'Maximize'} onClick={onMaximize}>
          {maximized ? <Copy size={12} aria-hidden="true" /> : <Square size={12} aria-hidden="true" />}
        </button>
        <button type="button" aria-label="Close" className="is-close" onClick={onClose}>
          <X size={15} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
