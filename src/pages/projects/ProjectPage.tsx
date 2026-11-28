import { Placeholder } from '../Placeholder'
import { ScreenshotCarousel } from './ScreenshotCarousel'
import type { Screenshot } from './ScreenshotCarousel'

export interface ProjectPageProps {
  title: string
  shots: Screenshot[]
  orientation?: 'landscape' | 'portrait'
  tech: string[]
}

/** Shared layout for the three project files. */
export function ProjectPage({ title, shots, orientation, tech }: ProjectPageProps) {
  return (
    <article className="page">
      <h1>
        {title} <Placeholder />
      </h1>
      <ScreenshotCarousel title={title} shots={shots} orientation={orientation} />
      <p className="page__lead">
        What the project does, who it's for, and the most interesting problem you solved.
      </p>
      <h2>Built with</h2>
      <ul className="page__tags">
        {tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </article>
  )
}
