import { ChevronRight, Hash, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Heading {
  el: HTMLElement
  text: string
  level: number
}

const editorArea = () => document.querySelector<HTMLElement>('.window .editor-area')

/**
 * Secondary side bar: the headings of the open page, like the editor's Outline view.
 * Click one to scroll to it; the one you're reading is highlighted.
 */
export function OutlinePanel({ fileKey, fileName, onClose }: { fileKey: string; fileName: string; onClose(): void }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [current, setCurrent] = useState(0)

  // Read the headings once the page has rendered (and again if it changes, e.g. lazy content).
  useEffect(() => {
    const area = editorArea()
    if (!area) return
    const read = () =>
      setHeadings(
        Array.from(area.querySelectorAll<HTMLElement>('h1, h2, h3')).map((el) => ({
          el,
          text: el.textContent?.trim() ?? '',
          level: Number(el.tagName[1]),
        })),
      )
    read()
    const mo = new MutationObserver(read)
    mo.observe(area, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [fileKey])

  // Highlight the last heading scrolled past the top of the editor.
  useEffect(() => {
    const area = editorArea()
    if (!area || headings.length === 0) return
    const onScroll = () => {
      const top = area.getBoundingClientRect().top + 24
      let idx = 0
      headings.forEach((h, i) => {
        if (h.el.getBoundingClientRect().top <= top) idx = i
      })
      setCurrent(idx)
    }
    onScroll()
    area.addEventListener('scroll', onScroll, { passive: true })
    return () => area.removeEventListener('scroll', onScroll)
  }, [headings])

  return (
    <aside className="outline" aria-label="Outline">
      <div className="side-panel__title">
        OUTLINE
        <button type="button" className="side-panel__action" aria-label="Close outline" onClick={onClose}>
          <X size={14} aria-hidden="true" />
        </button>
      </div>
      <div className="outline__file">
        <ChevronRight size={14} aria-hidden="true" className="outline__chevron" />
        {fileName || 'No file open'}
      </div>
      {headings.length === 0 ? (
        <p className="side-panel__note">No headings in this file.</p>
      ) : (
        <ul className="outline__list">
          {headings.map((h, i) => (
            <li key={`${i}-${h.text}`}>
              <button
                type="button"
                className={`outline__item${i === current ? ' is-current' : ''}`}
                style={{ paddingLeft: 16 + (h.level - 1) * 12 }}
                onClick={() => h.el.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                <Hash size={12} aria-hidden="true" />
                <span>{h.text}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
