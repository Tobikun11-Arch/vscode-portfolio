import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { FILES } from '../files'
import { EditorArea } from './EditorArea'
import type { EditorStatus } from '../tabs/useEditorTabs'
import type { FileId } from '../files'

const renderArea = (status: EditorStatus, activeId: FileId | null) =>
  render(
    <MemoryRouter>
      <EditorArea status={status} activeId={activeId} />
    </MemoryRouter>,
  )

describe('EditorArea', () => {
  it('renders the active page heading', () => {
    renderArea('file', 'about')
    expect(screen.getByRole('heading', { level: 1, name: /about/i })).toBeInTheDocument()
  })

  it('renders every registered page', () => {
    for (const file of FILES) {
      const { unmount } = renderArea('file', file.id)
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      unmount()
    }
  })

  it('empty state shows the three hints', () => {
    renderArea('empty', null)
    expect(screen.getByText('Show All Commands')).toBeInTheDocument()
    expect(screen.getByText('Go to File')).toBeInTheDocument()
    expect(screen.getByText('Find in Files')).toBeInTheDocument()
  })

  it('not found state', () => {
    renderArea('notFound', null)
    expect(screen.getByText(/file not found/i)).toBeInTheDocument()
  })

  it('never renders the VS Code name', () => {
    const states: [EditorStatus, FileId | null][] = [
      ['empty', null],
      ['notFound', null],
      ...FILES.map((f): [EditorStatus, FileId] => ['file', f.id]),
    ]
    for (const [status, id] of states) {
      const { container, unmount } = renderArea(status, id)
      expect(container.textContent).not.toContain('Visual Studio Code')
      unmount()
    }
  })
})
