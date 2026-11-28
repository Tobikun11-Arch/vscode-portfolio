import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { About } from './About'
import { Contact } from './Contact'
import { Experience } from './Experience'
import { Home } from './Home'

const renderPage = (Page: () => React.ReactElement) =>
  render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>,
  )

describe('resume content', () => {
  it('home introduces Joenel as a fullstack developer', () => {
    renderPage(Home)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hi, I'm Joenel")
    expect(screen.getByText(/fullstack developer/i)).toBeInTheDocument()
  })

  it('about shows education and skills', () => {
    renderPage(About)
    expect(screen.getByText('Cavite State University – Tanza')).toBeInTheDocument()
    expect(screen.getByText('Bachelor of Science in Information Technology')).toBeInTheDocument()
    for (const skill of ['Go', 'Next.js', 'Gin (Go)', 'Prisma ORM', 'Docker']) {
      expect(screen.getByText(skill)).toBeInTheDocument()
    }
  })

  it('about shows my real profile photo', () => {
    renderPage(About)
    const photo = screen.getByRole('img', { name: /joenel/i })
    expect(photo).toHaveAttribute('src', '/profile.png')
    expect(photo).toHaveAttribute('width', '400')
    expect(photo).toHaveAttribute('height', '400')
  })

  it('experience lists the three roles in resume order', () => {
    renderPage(Experience)
    const roles = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(roles).toHaveLength(3)
    expect(roles[0]).toContain('Dynamic VA Referral Services')
    expect(roles[1]).toContain('Medianeth')
    expect(roles[2]).toContain('Freelance')
    expect(screen.getByText('March 2025 – September 2025')).toBeInTheDocument()
  })

  it('contact email is a mailto link that does not open a blank tab', () => {
    renderPage(Contact)
    const email = screen.getByRole('link', { name: /joenelsevellejo831@gmail\.com/ })
    expect(email).toHaveAttribute('href', 'mailto:joenelsevellejo831@gmail.com')
    expect(email).not.toHaveAttribute('target')
  })

  it('contact lists every channel with the right links', () => {
    renderPage(Contact)
    const expectLink = (name: string, href: string) =>
      expect(screen.getByRole('link', { name: new RegExp(name, 'i') })).toHaveAttribute('href', href)
    expectLink('github', 'https://github.com/Tobikun11-Arch')
    expectLink('linkedin', 'https://www.linkedin.com/in/joenel-sevellejo-2919a7259')
    expectLink('instagram', 'https://www.instagram.com/joenelsevellejo11')
    expectLink('website', 'https://seve-eosin.vercel.app/about')
    expectLink('resume', '/Joenel-Sevellejo-Resume.pdf')
    expect(screen.getByText('Dynamic VARS')).toBeInTheDocument()
    expect(screen.getByText('Cavite, Philippines')).toBeInTheDocument()
  })

  it('external contact links open in a new tab safely', () => {
    renderPage(Contact)
    const github = screen.getByRole('link', { name: /github/i })
    expect(github).toHaveAttribute('target', '_blank')
    expect(github).toHaveAttribute('rel', 'noreferrer')
  })

  it('filled pages no longer show the placeholder badge', () => {
    for (const Page of [Home, Experience, Contact]) {
      const { unmount } = renderPage(Page)
      expect(screen.queryByText('Placeholder')).not.toBeInTheDocument()
      unmount()
    }
  })
})
