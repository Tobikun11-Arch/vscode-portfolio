import { Play, Square } from 'lucide-react'

interface RunPanelProps {
  running: boolean
  onRun(): void
  onStop(): void
  onCommand(cmd: string): void
}

const TRY = ['help', 'whoami', 'projects', 'skills', 'resume', 'contact']

/** Run and Debug view: starts the "portfolio" in the terminal panel. */
export function RunPanel({ running, onRun, onStop, onCommand }: RunPanelProps) {
  return (
    <section className="side-panel" aria-label="Run and Debug">
      <div className="side-panel__title">RUN AND DEBUG</div>
      <div className="run-panel">
        {running ? (
          <button type="button" className="run-panel__btn is-stop" onClick={onStop}>
            <Square size={12} fill="currentColor" aria-hidden="true" /> Stop portfolio
          </button>
        ) : (
          <button type="button" className="run-panel__btn" onClick={onRun}>
            <Play size={14} fill="currentColor" aria-hidden="true" /> Run portfolio
          </button>
        )}
        <p>
          Opens a terminal where you can explore this portfolio with commands. Shortcut:{' '}
          <kbd>Ctrl</kbd> + <kbd>`</kbd>
        </p>
      </div>
      <div className="side-panel__section">TRY A COMMAND</div>
      <ul className="run-panel__cmds">
        {TRY.map((cmd) => (
          <li key={cmd}>
            <button type="button" onClick={() => onCommand(cmd)}>
              <span aria-hidden="true">$</span> {cmd}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
