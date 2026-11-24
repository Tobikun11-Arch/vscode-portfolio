import { Logo } from './Logo'

const HINTS = [
  { label: 'Show All Commands', keys: ['Ctrl', 'Shift', 'P'] },
  { label: 'Go to File', keys: ['Ctrl', 'P'] },
  { label: 'Find in Files', keys: ['Ctrl', 'Shift', 'F'] },
]

export function EmptyEditor() {
  return (
    <div className="empty-editor">
      <div className="empty-editor__watermark" aria-hidden="true">
        <Logo size={180} />
      </div>
      <dl className="empty-editor__hints">
        {HINTS.map((hint) => (
          <div key={hint.label} className="empty-editor__hint">
            <dt>{hint.label}</dt>
            <dd>
              {hint.keys.map((key) => (
                <kbd key={key}>{key}</kbd>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
