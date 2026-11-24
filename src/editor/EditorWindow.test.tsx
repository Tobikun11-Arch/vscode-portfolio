import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router'
import { describe, expect, it } from 'vitest'
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

const explorer = () => screen.getByRole('navigation', { name: 'Explorer' })
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
    expect(screen.queryByRole('button', { name: 'Joenel-Portfolio' })).not.toBeInTheDocument()
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
    expect(explorer()).toHaveClass('is-drawer-open')
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
    expect(explorer()).not.toHaveClass('is-drawer-open')

    await userEvent.click(screen.getByRole('button', { name: 'Open explorer' }))
    expect(explorer()).toHaveClass('is-drawer-open')
    await userEvent.click(screen.getByRole('button', { name: 'test back' }))
    expect(screen.getByRole('heading', { level: 1, name: /joenel/i })).toBeInTheDocument()
    expect(explorer()).not.toHaveClass('is-drawer-open')
  })

  it('backdrop closes the drawer', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Open explorer' }))
    await userEvent.click(screen.getByRole('button', { name: 'Close explorer' }))
    expect(explorer()).not.toHaveClass('is-drawer-open')
    expect(screen.queryByRole('button', { name: 'Close explorer' })).not.toBeInTheDocument()
  })

  it('choosing the already-open file still closes the drawer', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Open explorer' }))
    await userEvent.click(item('home.tsx'))
    expect(explorer()).not.toHaveClass('is-drawer-open')
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
