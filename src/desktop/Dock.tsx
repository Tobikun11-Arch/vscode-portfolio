import { FileDown, Music } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { playClick } from '../editor/clickSound'
import { Logo } from '../editor/Logo'
import { GithubIcon } from '../pages/BrandIcons'
import { RESUME_FILENAME, RESUME_URL } from '../pages/resume'
import { usePlayer } from '../music/player'
import { focusApp, openApp, requestMinimize, useDesktop, type AppId } from './desktopStore'

interface DockItem {
  key: string
  label: string
  tile: ReactNode
  app?: AppId
  href?: string
  download?: string
}

const ITEMS: (DockItem | 'divider')[] = [
  {
    key: 'editor',
    app: 'editor',
    label: 'Joenel-Portfolio',
    tile: (
      <span className="dock__tile is-editor">
        <Logo size={34} />
      </span>
    ),
  },
  {
    key: 'music',
    app: 'music',
    label: 'Music',
    tile: (
      <span className="dock__tile is-music">
        <Music size={26} strokeWidth={2.2} />
      </span>
    ),
  },
  'divider',
  {
    key: 'resume',
    label: 'Resume.pdf',
    href: RESUME_URL,
    download: RESUME_FILENAME,
    tile: (
      <span className="dock__tile is-resume">
        <FileDown size={24} />
      </span>
    ),
  },
  {
    key: 'github',
    label: 'GitHub',
    href: 'https://github.com/Tobikun11-Arch',
    tile: (
      <span className="dock__tile is-github">
        <GithubIcon size={26} />
      </span>
    ),
  },
]

const BASE = 48
const MAX_SCALE = 1.55
const REACH = 130

/** macOS-style dock: magnifies under the pointer, bounces apps open, dots show running apps. */
export function Dock() {
  const { open, front } = useDesktop()
  const player = usePlayer()
  const [scales, setScales] = useState<Record<string, number>>({})
  const [bouncing, setBouncing] = useState<string | null>(null)
  const refs = useRef<Record<string, HTMLElement | null>>({})

  // Magnify icons near the pointer (measured from each icon's resting center).
  const magnify = (mouseX: number) => {
    const next: Record<string, number> = {}
    for (const [key, el] of Object.entries(refs.current)) {
      if (!el) continue
      const r = el.getBoundingClientRect()
      const d = Math.abs(mouseX - (r.left + r.width / 2))
      next[key] = 1 + (MAX_SCALE - 1) * Math.max(0, 1 - d / REACH) ** 2
    }
    setScales(next)
  }
  const scaleFor = (key: string) => scales[key] ?? 1

  const launch = (item: DockItem) => {
    playClick()
    if (!item.app) return
    if (!open[item.app]) {
      setBouncing(item.key)
      window.setTimeout(() => setBouncing(null), 700)
      openApp(item.app)
    } else if (front !== item.app) {
      focusApp(item.app)
    } else {
      // Already open and in front: clicking its icon again tucks it back into the dock.
      requestMinimize(item.app)
    }
  }

  const running = (app?: AppId) =>
    app === 'editor' ? open.editor : app === 'music' ? open.music || player.index >= 0 : false

  return (
    <nav
      className="dock"
      aria-label="Dock"
      onPointerMove={(e) => e.pointerType === 'mouse' && magnify(e.clientX)}
      onPointerLeave={() => setScales({})}
    >
      {ITEMS.map((item, i) => {
        if (item === 'divider') return <span key={`d${i}`} className="dock__divider" aria-hidden="true" />
        const s = scaleFor(item.key)
        const body = (
          <>
            <span className="dock__label">{item.label}</span>
            {item.tile}
            {running(item.app) && <span className="dock__dot" aria-hidden="true" />}
          </>
        )
        const common = {
          className: `dock__item${bouncing === item.key ? ' is-bouncing' : ''}`,
          style: { width: BASE * s, height: BASE * s },
          ref: (el: HTMLElement | null) => {
            refs.current[item.key] = el
          },
          'aria-label': item.label,
        }
        return item.href ? (
          <a
            key={item.key}
            {...common}
            href={item.href}
            download={item.download}
            {...(item.download ? {} : { target: '_blank', rel: 'noreferrer' })}
            onClick={() => playClick()}
          >
            {body}
          </a>
        ) : (
          <button key={item.key} type="button" {...common} data-dock-app={item.app} onClick={() => launch(item)}>
            {body}
          </button>
        )
      })}
    </nav>
  )
}
