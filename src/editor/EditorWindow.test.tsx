import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { FILES } from '../files'
import { saveTabs } from '../tabs/tabsModel'

const renderAt = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

function BackButton() {
  const navigate = useNavigate()
  return <button onClick={() => navigate(-1)}>test back</button>
}

const sidebar = () => screen.getByRole('complementary', { name: 'Side bar' })
const tree = () => screen.getByRole('tree')
const item = (name: string) => within(tree()).getByRole('treeitem', { name })

describe('EditorWindow (desktop)', () => {
  it('shows the explorer root and all files', () => {
    renderAt()
    expect(screen.getByText('JOENEL-PORTFOLIO')).toBeInTheDocument()
    for (const file of FILES) expect(item(file.name)).toBeInTheDocument()
  })

  it('clicking a file opens it in a tab and main area', async () => {
    renderAt()
    await userEvent.click(item('about.md'))
    expect(screen.getByRole('tab', { name: 'about.md' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { level: 1, name: /about/i })).toBeInTheDocument()
  })

  it('active file is highlighted', async () => {
    renderAt()
    await userEvent.click(item('about.md'))
    expect(item('about.md')).toHaveAttribute('aria-selected', 'true')
    expect(item('home.tsx')).toHaveAttribute('aria-selected', 'false')
  })

  it('projects folder toggles', async () => {
    renderAt()
    await userEvent.click(item('projects'))
    expect(within(tree()).queryByRole('treeitem', { name: 'web-app.tsx' })).not.toBeInTheDocument()
    expect(item('projects')).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(item('projects'))
    expect(item('web-app.tsx')).toBeInTheDocument()
  })

  it('Enter on a focused file opens it', async () => {
    renderAt()
    item('contact.md').focus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('heading', { level: 1, name: /contact/i })).toBeInTheDocument()
  })

  it('closing a tab with its x', async () => {
    renderAt()
    await userEvent.click(item('about.md'))
    await userEvent.click(screen.getByRole('button', { name: 'Close about.md' }))
    expect(screen.queryByRole('tab', { name: 'about.md' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /joenel/i })).toBeInTheDocument()
  })

  it('Explorer icon toggles the sidebar', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Explorer' }))
    expect(screen.queryByRole('tree')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Explorer' }))
    expect(tree()).toBeInTheDocument()
  })

  it('unknown url shows not found without adding a tab', () => {
    renderAt('/foo')
    expect(screen.getByText(/file not found/i)).toBeInTheDocument()
    expect(screen.queryAllByRole('tab')).toHaveLength(0)
  })

  it('unknown url keeps stored tabs, none selected', () => {
    saveTabs(['about'])
    renderAt('/foo')
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(1)
    expect(tabs[0]).toHaveAccessibleName('about.md')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false')
  })

  it('maximize toggles to restore', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Maximize' }))
    expect(screen.getByRole('button', { name: 'Restore' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Restore' }))
    expect(screen.getByRole('button', { name: 'Maximize' })).toBeInTheDocument()
  })

  it('close hides window and shows shortcut', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('tree')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Joenel-Portfolio' })).toBeInTheDocument()
  })

  it('minimize hides window too', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Minimize' }))
    expect(screen.queryByRole('tree')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Joenel-Portfolio' })).toBeInTheDocument()
  })

  it('double-click shortcut reopens with same file', async () => {
    renderAt('/about')
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    await userEvent.dblClick(screen.getByRole('button', { name: 'Joenel-Portfolio' }))
    expect(screen.getByRole('heading', { level: 1, name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'about.md' })).toBeInTheDocument()
    // The folder stays on the desktop (like a real one) while the window is open.
    expect(screen.getByRole('button', { name: 'Joenel-Portfolio' })).toBeInTheDocument()
  })

  it('Enter on the focused shortcut reopens', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    screen.getByRole('button', { name: 'Joenel-Portfolio' }).focus()
    await userEvent.keyboard('{Enter}')
    expect(tree()).toBeInTheDocument()
  })

  it('hamburger opens the drawer', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Open explorer' }))
    expect(sidebar()).toHaveClass('is-drawer-open')
  })

  it('drawer closes on navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
        <BackButton />
      </MemoryRouter>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Open explorer' }))
    await userEvent.click(item('about.md'))
    expect(sidebar()).not.toHaveClass('is-drawer-open')

    await userEvent.click(screen.getByRole('button', { name: 'Open explorer' }))
    expect(sidebar()).toHaveClass('is-drawer-open')
    await userEvent.click(screen.getByRole('button', { name: 'test back' }))
    expect(screen.getByRole('heading', { level: 1, name: /joenel/i })).toBeInTheDocument()
    expect(sidebar()).not.toHaveClass('is-drawer-open')
  })

  it('backdrop closes the drawer', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Open explorer' }))
    await userEvent.click(screen.getByRole('button', { name: 'Close explorer' }))
    expect(sidebar()).not.toHaveClass('is-drawer-open')
    expect(screen.queryByRole('button', { name: 'Close explorer' })).not.toBeInTheDocument()
  })

  it('choosing the already-open file still closes the drawer', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Open explorer' }))
    await userEvent.click(item('home.tsx'))
    expect(sidebar()).not.toHaveClass('is-drawer-open')
  })

  it('scrolls the newly active tab into view', async () => {
    const scrolled: string[] = []
    const original = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function (this: Element) {
      scrolled.push(this.textContent ?? '')
    }
    try {
      renderAt()
      await userEvent.click(item('desktop-app.tsx'))
      expect(scrolled.at(-1)).toContain('desktop-app.tsx')
    } finally {
      Element.prototype.scrollIntoView = original
    }
  })

  it('title bar shows the project name and never the VS Code name', () => {
    const { container } = renderAt()
    expect(screen.getByText('Joenel-Portfolio')).toBeInTheDocument()
    expect(container.textContent).not.toContain('Visual Studio Code')
  })
})

describe('Search view', () => {
  it('search icon opens search and lists every file that mentions my name', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    await userEvent.type(screen.getByRole('searchbox'), 'joenel')
    for (const name of ['home.tsx', 'about.md', 'contact.md']) {
      expect(screen.getByRole('group', { name })).toBeInTheDocument()
    }
    expect(screen.getByText(/results? in \d+ files?/i)).toBeInTheDocument()
  })

  it('clicking a match opens that file', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    await userEvent.type(screen.getByRole('searchbox'), 'Dyna-Mail')
    const group = screen.getByRole('group', { name: 'experience.md' })
    await userEvent.click(within(group).getAllByRole('button')[0])
    expect(screen.getByRole('heading', { level: 1, name: /experience/i })).toBeInTheDocument()
  })

  it('says when nothing matches', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    await userEvent.type(screen.getByRole('searchbox'), 'kubernetes-xyz')
    expect(screen.getByText(/^No results for/)).toBeInTheDocument()
  })

  it('switching views keeps the sidebar open', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(screen.queryByRole('tree')).not.toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  })

  it('phone drawer can switch to search', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Open explorer' }))
    await userEvent.click(within(sidebar()).getByRole('button', { name: 'Show Search' }))
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(sidebar()).toHaveClass('is-drawer-open')
  })
})

describe('Source Control view', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const stubCommits = (status: number, body: unknown) =>
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response(JSON.stringify(body), { status }))),
    )

  it('shows the commit graph from GitHub, newest first', async () => {
    stubCommits(200, [
      {
        sha: 'b'.repeat(40),
        html_url: 'https://github.com/Tobikun11-Arch/vscode-portfolio/commit/bbb',
        commit: { message: 'feat: search\n\nbody', author: { name: 'Joenel', date: '2026-11-25T00:00:00Z' } },
      },
      {
        sha: 'a'.repeat(40),
        html_url: 'https://github.com/Tobikun11-Arch/vscode-portfolio/commit/aaa',
        commit: { message: 'first', author: { name: 'Joenel', date: '2026-11-20T00:00:00Z' } },
      },
    ])
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Source Control' }))
    const items = await screen.findAllByRole('listitem', { name: /commit/i })
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('feat: search')
    expect(items[0]).toHaveTextContent('bbbbbbb')
    expect(within(items[0]).getByRole('link')).toHaveAttribute(
      'href',
      'https://github.com/Tobikun11-Arch/vscode-portfolio/commit/bbb',
    )
  })

  it('shows an error with a retry button when GitHub fails', async () => {
    stubCommits(403, {})
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Source Control' }))
    expect(await screen.findByText(/couldn't load/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })
})

describe('Page metadata', () => {
  it('browser title and description follow the open file', async () => {
    renderAt('/about')
    expect(document.title).toBe('About — Joenel F. Sevellejo')
    await userEvent.click(item('contact.md'))
    expect(document.title).toBe('Contact — Joenel F. Sevellejo')
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toMatch(
      /\/contact$/,
    )
  })

  it('unknown urls are not indexed', () => {
    renderAt('/foo')
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex',
    )
  })
})
