import { X } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { FILES, type FileId } from '../files'
import { RESUME_FILENAME, RESUME_URL } from '../pages/resume'

interface Line {
  id: number
  kind: 'in' | 'out' | 'muted' | 'ok' | 'err'
  text: ReactNode
}

export interface CommandRequest {
  cmd: string
  /** Changes on every request so the same command can be sent twice. */
  n: number
}

interface TerminalProps {
  request: CommandRequest | null
  onOpenFile(id: FileId): void
  onExit(): void
}

const BOOT_STEP = 70
const BOOT_MS = 7 * BOOT_STEP + 30

const EMAIL ='joenelsevellejo831@gmail.com'
const GITHUB = 'https://github.com/Tobikun11-Arch'
const LINKEDIN = 'https://www.linkedin.com/in/joenel-sevellejo-2919a7259'

const HELP: [string, string][] = [
  ['whoami', 'who built this'],
  ['ls', 'list the files in this portfolio'],
  ['open <file>', 'open a file, e.g. open about'],
  ['about · experience · contact', 'jump straight to that page'],
  ['projects', 'list my projects'],
  ['skills', 'my tech stack'],
  ['resume', 'download my resume (PDF)'],
  ['email · github · linkedin', 'get in touch'],
  ['clear', 'clear the terminal'],
  ['exit', 'close the terminal'],
]

const SKILLS: [string, string][] = [
  ['languages', 'TypeScript, JavaScript, Go, Java, SQL, Python'],
  ['frontend', 'React, Next.js, React Native (Expo), Electron, Tailwind, TanStack Query, Zustand'],
  ['backend', 'Node.js, Express, Gin (Go), MongoDB, Prisma, Firebase, Supabase'],
  ['tools', 'Git, GitHub Actions, Docker, Jest, Postman, Vercel'],
]

const PAGE_COMMANDS: Record<string, FileId> = {
  home: 'home',
  about: 'about',
  experience: 'experience',
  contact: 'contact',
}

function findFile(arg: string) {
  const a = arg.toLowerCase().replace(/^\.?\/*/, '').replace(/^projects\//, '')
  return FILES.find((f) => f.id === a || f.name.toLowerCase() === a || f.name.replace(/\.\w+$/, '') === a)
}

function downloadResume() {
  const link = document.createElement('a')
  link.href = RESUME_URL
  link.download = RESUME_FILENAME
  link.click()
}

/** A small fake shell in the bottom panel, for exploring the portfolio with commands. */
export function Terminal({ request, onOpenFile, onExit }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const history = useRef<string[]>([])
  const historyAt = useRef(0)
  const nextId = useRef(0)
  const body = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)

  const print = (kind: Line['kind'], text: ReactNode) =>
    setLines((prev) => [...prev, { id: nextId.current++, kind, text }])

  // Boot output, like `npm run dev`, typed out a line at a time.
  const mountedAt = useRef(0)
  useEffect(() => {
    mountedAt.current = Date.now()
    const boot: [Line['kind'], ReactNode][] = [
      ['muted', '> joenel-portfolio@1.0.0 dev'],
      ['muted', '> vite'],
      ['out', ''],
      ['ok', '  VITE ready in 312 ms'],
      ['out', `  ➜  Local:   ${window.location.origin}/`],
      ['out', ''],
      ['out', 'Type "help" to see what you can do.'],
    ]
    const timers = boot.map(([kind, text], i) => window.setTimeout(() => print(kind, text), i * BOOT_STEP))
    return () => timers.forEach(clearTimeout)
  }, [])

  const run = (raw: string) => {
    const cmdline = raw.trim()
    print('in', cmdline)
    if (!cmdline) return
    history.current.push(cmdline)
    historyAt.current = history.current.length
    const [cmd, ...rest] = cmdline.split(/\s+/)
    const arg = rest.join(' ')
    const name = cmd.toLowerCase()

    if (name in PAGE_COMMANDS) {
      const file = FILES.find((f) => f.id === PAGE_COMMANDS[name])!
      print('ok', `Opening ${file.name}…`)
      onOpenFile(file.id)
      return
    }

    switch (name) {
      case 'help':
        HELP.forEach(([c, d]) =>
          print(
            'out',
            <>
              <span className="term__cmd">{c.padEnd(30)}</span>
              {d}
            </>,
          ),
        )
        break
      case 'whoami':
        print('out', 'Joenel F. Sevellejo')
        print('muted', 'Full Stack Developer · Tanza, Cavite, Philippines')
        print('muted', 'BS Information Technology @ Cavite State University – Tanza')
        break
      case 'ls':
        print('out', FILES.map((f) => f.name).join('   '))
        break
      case 'projects':
        FILES.filter((f) => f.path.startsWith('/projects/')).forEach((f) =>
          print('out', `projects/${f.name}`),
        )
        print('muted', 'Open one with: open web-app')
        break
      case 'open':
      case 'cat':
      case 'code': {
        if (!arg) {
          print('err', `usage: ${name} <file>   (try: ls)`)
          break
        }
        const file = findFile(arg)
        if (!file) {
          print('err', `${name}: ${arg}: No such file. Try "ls".`)
          break
        }
        print('ok', `Opening ${file.name}…`)
        onOpenFile(file.id)
        break
      }
      case 'skills':
      case 'stack':
        SKILLS.forEach(([group, list]) =>
          print(
            'out',
            <>
              <span className="term__cmd">{group.padEnd(11)}</span>
              {list}
            </>,
          ),
        )
        break
      case 'resume':
        print('ok', `Downloading ${RESUME_FILENAME}…`)
        downloadResume()
        break
      case 'email':
        print(
          'out',
          <a href={`mailto:${EMAIL}`} className="term__link">
            {EMAIL}
          </a>,
        )
        break
      case 'github':
      case 'linkedin': {
        const url = name === 'github' ? GITHUB : LINKEDIN
        print(
          'out',
          <a href={url} target="_blank" rel="noreferrer" className="term__link">
            {url}
          </a>,
        )
        break
      }
      case 'echo':
        print('out', arg)
        break
      case 'date':
        print('out', new Date().toString())
        break
      case 'pwd':
        print('out', '/home/joenel/Joenel-Portfolio')
        break
      case 'sudo':
        print('err', 'Nice try. You still need to hire me first.')
        break
      case 'clear':
      case 'cls':
        setLines([])
        break
      case 'exit':
        onExit()
        break
      default:
        print('err', `command not found: ${cmd}. Type "help" to see what you can do.`)
    }
  }

  // Commands sent from the Run and Debug panel (after the boot output if just opened).
  useEffect(() => {
    if (!request) return
    const wait = Math.max(0, mountedAt.current + BOOT_MS - Date.now())
    const t = window.setTimeout(() => run(request.cmd), wait)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.n])

  useEffect(() => {
    body.current?.scrollTo?.({ top: body.current.scrollHeight })
  }, [lines])

  useEffect(() => {
    field.current?.focus({ preventScroll: true })
  }, [])

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const h = history.current
      if (!h.length) return
      historyAt.current = Math.min(h.length, Math.max(0, historyAt.current + (e.key === 'ArrowUp' ? -1 : 1)))
      setInput(h[historyAt.current] ?? '')
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <section className="terminal" aria-label="Terminal">
      <div className="terminal__tabs">
        <span>PROBLEMS</span>
        <span>OUTPUT</span>
        <span>DEBUG CONSOLE</span>
        <span className="is-active">TERMINAL</span>
        <span className="terminal__spacer" />
        <button type="button" aria-label="Close terminal" onClick={onExit}>
          <X size={14} aria-hidden="true" />
        </button>
      </div>
      <div className="terminal__body" ref={body} onClick={() => field.current?.focus()}>
        {lines.map((line) => (
          <div key={line.id} className={`term__line is-${line.kind}`}>
            {line.kind === 'in' ? (
              <>
                <span className="term__prompt">joenel@portfolio:~$</span> {line.text}
              </>
            ) : (
              line.text || ' '
            )}
          </div>
        ))}
        <label className="term__line term__input">
          <span className="term__prompt">joenel@portfolio:~$</span>
          <input
            ref={field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </label>
      </div>
    </section>
  )
}
