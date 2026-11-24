import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation, useNavigate } from 'react-router'
import { describe, expect, it } from 'vitest'
import { saveTabs } from './tabsModel'
import { useEditorTabs } from './useEditorTabs'

function Harness() {
  const { tabs, activeId, status, open, close } = useEditorTabs()
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <div>
      <output data-testid="tabs">{tabs.join(',')}</output>
      <output data-testid="active">{activeId ?? 'none'}</output>
      <output data-testid="status">{status}</output>
      <output data-testid="path">{location.pathname}</output>
      <button onClick={() => open('contact')}>open contact</button>
      <button onClick={() => open('about')}>open about</button>
      <button onClick={() => close('about')}>close about</button>
      <button onClick={() => close('home')}>close home</button>
      <button onClick={() => navigate(-1)}>back</button>
    </div>
  )
}

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Harness />
    </MemoryRouter>,
  )

const text = (id: string) => screen.getByTestId(id).textContent

describe('useEditorTabs', () => {
  it('deep link opens its tab', () => {
    renderAt('/about')
    expect(text('tabs')).toBe('about')
    expect(text('active')).toBe('about')
    expect(text('status')).toBe('file')
  })

  it('restores stored tabs and adds url file', () => {
    saveTabs(['home', 'contact'])
    renderAt('/about')
    expect(text('tabs')).toBe('home,contact,about')
  })

  it('open pushes the file url', async () => {
    renderAt('/')
    await userEvent.click(screen.getByText('open contact'))
    expect(text('path')).toBe('/contact')
    expect(text('tabs')).toBe('home,contact')
    expect(text('active')).toBe('contact')
  })

  it('closing active tab navigates to neighbor', async () => {
    renderAt('/')
    await userEvent.click(screen.getByText('open about'))
    await userEvent.click(screen.getByText('close about'))
    expect(text('path')).toBe('/')
    expect(text('active')).toBe('home')
    expect(text('tabs')).toBe('home')
  })

  it('back reopens closed tab', async () => {
    renderAt('/')
    await userEvent.click(screen.getByText('open about'))
    await userEvent.click(screen.getByText('close about'))
    await userEvent.click(screen.getByText('back'))
    expect(text('path')).toBe('/about')
    expect(text('tabs')).toBe('home,about')
    expect(text('active')).toBe('about')
  })

  it('closing last tab goes to /~empty', async () => {
    renderAt('/')
    await userEvent.click(screen.getByText('close home'))
    expect(text('path')).toBe('/~empty')
    expect(text('status')).toBe('empty')
    expect(text('tabs')).toBe('')
    expect(text('active')).toBe('none')
  })

  it('unknown url keeps tabs, status notFound', () => {
    saveTabs(['home'])
    renderAt('/foo')
    expect(text('tabs')).toBe('home')
    expect(text('status')).toBe('notFound')
    expect(text('active')).toBe('none')
  })

  it('closing an inactive tab does not navigate', async () => {
    saveTabs(['about'])
    renderAt('/')
    await userEvent.click(screen.getByText('close about'))
    expect(text('path')).toBe('/')
    expect(text('tabs')).toBe('home')
  })
})
