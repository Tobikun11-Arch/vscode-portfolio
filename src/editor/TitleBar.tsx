import { ArrowLeft, ArrowRight, Menu, PanelBottom, PanelLeft, PanelRight, Search } from 'lucide-react'
import type { MouseEvent, PointerEvent } from 'react'

interface TitleBarProps {
  onToggleDrawer(): void
  onMinimize(): void
  onMaximize(): void
  onClose(): void
  maximized: boolean
  /** Pointer down on empty title-bar space: start dragging the window. */
  onDragStart?(e: PointerEvent<HTMLElement>): void
  nav: { canBack: boolean; canForward: boolean; onBack(): void; onForward(): void }
  onQuickOpen(): void
  layout: {
    sidebar: boolean
    panel: boolean
    outline: boolean
    onToggleSidebar(): void
    onTogglePanel(): void
    onToggleOutline(): void
  }
}

/** Layout icon with its region filled in, shown while that region is visible. */
const LayoutFill = ({ fill }: { fill: { x: number; y: number; w: number; h: number } }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="layout-fill">
    <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect {...{ x: fill.x, y: fill.y, width: fill.w, height: fill.h }} fill="currentColor" />
  </svg>
)
const PanelLeftFill = () => <LayoutFill fill={{ x: 3, y: 3, w: 7, h: 18 }} />
const PanelBottomFill = () => <LayoutFill fill={{ x: 3, y: 14, w: 18, h: 7 }} />
const PanelRightFill = () => <LayoutFill fill={{ x: 14, y: 3, w: 7, h: 18 }} />

/** Clicks on buttons never start a drag or a double-click zoom. */
const onChrome = (e: { target: EventTarget }) => !(e.target as Element).closest('button')

/* macOS traffic-light glyphs: only drawn while the pointer is over the group. */
const CloseGlyph = () => (
  <svg viewBox="0 0 10 10" aria-hidden="true">
    <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" />
  </svg>
)
const MinimizeGlyph = () => (
  <svg viewBox="0 0 10 10" aria-hidden="true">
    <path d="M2 5h6" />
  </svg>
)
const ZoomGlyph = ({ maximized }: { maximized: boolean }) => (
  <svg viewBox="0 0 10 10" aria-hidden="true" className="is-filled">
    {maximized ? (
      <>
        <path d="M5.2 4.8V1.6L8.4 4.8z" />
        <path d="M4.8 5.2v3.2L1.6 5.2z" />
      </>
    ) : (
      <>
        <path d="M2.4 2.4h3.8L2.4 6.2z" />
        <path d="M7.6 7.6H3.8l3.8-3.8z" />
      </>
    )}
  </svg>
)

/** macOS close / minimize / zoom buttons, shared by every window. */
export function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
  maximized,
}: {
  onClose(): void
  onMinimize(): void
  onMaximize(): void
  maximized: boolean
}) {
  return (
    <div className="title-bar__controls">
      <button type="button" aria-label="Close" className="traffic-light is-close" onClick={onClose}>
        <CloseGlyph />
      </button>
      <button type="button" aria-label="Minimize" className="traffic-light is-minimize" onClick={onMinimize}>
        <MinimizeGlyph />
      </button>
      <button
        type="button"
        aria-label={maximized ? 'Restore' : 'Maximize'}
        className="traffic-light is-zoom"
        onClick={onMaximize}
      >
        <ZoomGlyph maximized={maximized} />
      </button>
    </div>
  )
}

export function TitleBar({
  onToggleDrawer,
  onMinimize,
  onMaximize,
  onClose,
  maximized,
  onDragStart,
  nav,
  onQuickOpen,
  layout,
}: TitleBarProps) {
  return (
    <header
      className="title-bar"
      onPointerDown={(e) => {
        if (e.button === 0 && onChrome(e)) onDragStart?.(e)
      }}
      onDoubleClick={(e: MouseEvent) => {
        // macOS: double-clicking the title bar zooms the window.
        if (onChrome(e)) onMaximize()
      }}
    >
      <button
        type="button"
        className="title-bar__drawer-btn"
        aria-label="Open explorer"
        onClick={onToggleDrawer}
      >
        <Menu size={18} aria-hidden="true" />
      </button>
      <TrafficLights
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        maximized={maximized}
      />
      <div className="title-bar__center">
        <span className="title-bar__nav">
          <button type="button" aria-label="Go back" disabled={!nav.canBack} onClick={nav.onBack}>
            <ArrowLeft size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Go forward"
            disabled={!nav.canForward}
            onClick={nav.onForward}
          >
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </span>
        <button
          type="button"
          className="title-bar__search"
          aria-label="Go to file (Ctrl+P)"
          aria-keyshortcuts="Control+P"
          onClick={onQuickOpen}
        >
          <Search size={12} aria-hidden="true" />
          <span>Joenel-Portfolio</span>
        </button>
      </div>
      <div className="title-bar__layout">
        <button
          type="button"
          aria-label="Toggle primary side bar"
          aria-pressed={layout.sidebar}
          onClick={layout.onToggleSidebar}
        >
          {layout.sidebar ? <PanelLeftFill /> : <PanelLeft size={14} aria-hidden="true" />}
        </button>
        <button
          type="button"
          aria-label="Toggle panel (Ctrl+`)"
          aria-pressed={layout.panel}
          onClick={layout.onTogglePanel}
        >
          {layout.panel ? <PanelBottomFill /> : <PanelBottom size={14} aria-hidden="true" />}
        </button>
        <button
          type="button"
          aria-label="Toggle outline"
          aria-pressed={layout.outline}
          onClick={layout.onToggleOutline}
        >
          {layout.outline ? <PanelRightFill /> : <PanelRight size={14} aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}
