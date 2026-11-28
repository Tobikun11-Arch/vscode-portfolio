import { Check, Download, Mail } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { GithubIcon, LinkedinIcon } from '../pages/BrandIcons'
import { RESUME_FILENAME, RESUME_URL } from '../pages/resume'
import { THEMES, WALLPAPERS, updateSettings, useSettings } from './settings'

const EMAIL = 'joenelsevellejo831@gmail.com'

/** Popover anchored to the bottom of the activity bar; closes on outside click or Esc. */
function Popover({ label, onClose, children }: { label: string; onClose(): void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element
      if (!ref.current?.contains(target) && !target.closest('[data-menu-trigger]')) onClose()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])
  return (
    <div ref={ref} className="menu-popover" role="dialog" aria-label={label}>
      {children}
    </div>
  )
}

export function AccountMenu({ onClose }: { onClose(): void }) {
  return (
    <Popover label="Account" onClose={onClose}>
      <div className="account">
        <img src="/profile.png" alt="" width={48} height={48} className="account__photo" />
        <div>
          <div className="account__name">Joenel F. Sevellejo</div>
          <div className="account__role">Full Stack Developer · Cavite, PH</div>
          <div className="account__status">
            <span className="account__dot" aria-hidden="true" /> Available for work
          </div>
        </div>
      </div>
      <div className="menu-sep" />
      <a className="menu-item" href="https://github.com/Tobikun11-Arch" target="_blank" rel="noreferrer">
        <GithubIcon /> GitHub
      </a>
      <a
        className="menu-item"
        href="https://www.linkedin.com/in/joenel-sevellejo-2919a7259"
        target="_blank"
        rel="noreferrer"
      >
        <LinkedinIcon /> LinkedIn
      </a>
      <a className="menu-item" href={`mailto:${EMAIL}`}>
        <Mail size={16} aria-hidden="true" /> Email me
      </a>
      <div className="menu-sep" />
      <a className="menu-item is-primary" href={RESUME_URL} download={RESUME_FILENAME}>
        <Download size={16} aria-hidden="true" /> Download resume
      </a>
    </Popover>
  )
}

interface ManageMenuProps {
  onClose(): void
  onCommandPalette(): void
  onResetWindow(): void
}

export function ManageMenu({ onClose, onCommandPalette, onResetWindow }: ManageMenuProps) {
  const settings = useSettings()
  return (
    <Popover label="Manage" onClose={onClose}>
      <button
        type="button"
        className="menu-item"
        onClick={() => {
          onClose()
          onCommandPalette()
        }}
      >
        Command Palette… <kbd>Ctrl+Shift+P</kbd>
      </button>
      <div className="menu-sep" />
      <div className="menu-heading">Color Theme</div>
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          role="menuitemradio"
          aria-checked={settings.theme === t.id}
          className="menu-item"
          onClick={() => updateSettings({ theme: t.id })}
        >
          <span className="menu-check">{settings.theme === t.id && <Check size={14} />}</span>
          {t.label}
        </button>
      ))}
      <div className="menu-sep" />
      <div className="menu-heading">Wallpaper</div>
      {WALLPAPERS.map((w) => (
        <button
          key={w.id}
          type="button"
          role="menuitemradio"
          aria-checked={settings.wallpaper === w.id}
          className="menu-item"
          onClick={() => updateSettings({ wallpaper: w.id })}
        >
          <span className="menu-check">{settings.wallpaper === w.id && <Check size={14} />}</span>
          <span className={`menu-swatch is-${w.id}`} aria-hidden="true" />
          {w.label}
        </button>
      ))}
      <div className="menu-sep" />
      <button
        type="button"
        role="menuitemcheckbox"
        aria-checked={settings.sound}
        className="menu-item"
        onClick={() => updateSettings({ sound: !settings.sound })}
      >
        <span className="menu-check">{settings.sound && <Check size={14} />}</span>
        Sound effects
      </button>
      <button
        type="button"
        className="menu-item"
        onClick={() => {
          onClose()
          onResetWindow()
        }}
      >
        <span className="menu-check" />
        Reset window
      </button>
    </Popover>
  )
}
