import { ArrowDown, ArrowUp, ExternalLink } from 'lucide-react'
import { GithubIcon } from '../BrandIcons'
import { Placeholder } from '../Placeholder'
import { Carousel } from './Carousel'
import { KIND_LABEL, screensOf } from './data'
import type { Project } from './data'
import { DeviceBanner } from './DeviceBanner'

interface Props {
  project: Project
  position: number
  total: number
  active: boolean
  next?: Project
  onNext: () => void
  onFirst: () => void
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Everything shown for one project: banners, summary, highlights and stack. */
export function ProjectSection({ project, position, total, active, next, onNext, onFirst }: Props) {
  const missingShots = screensOf(project).some((s) => !s.src)
  return (
    <article className="project">
      <header className="project__header">
        <p className="project__eyebrow">
          {KIND_LABEL[project.kind]} · {pad(position)} / {pad(total)}
        </p>
        <h2 className="project__name">
          {project.name}
          {project.role && <span className="project__role">{project.role}</span>}
          {missingShots && <Placeholder />}
        </h2>
      </header>

      <Carousel
        label={`${project.name} screenshots`}
        active={active}
        slides={project.banners.map((banner, i) => ({
          key: banner.headline,
          label: banner.headline,
          content: <DeviceBanner project={project} banner={banner} eager={i === 0} />,
        }))}
      />

      <p className="page__lead">{project.summary}</p>

      {(project.url || project.repo) && (
        <ul className="project__links">
          {project.url && (
            <li>
              <a href={project.url.href} target="_blank" rel="noreferrer">
                <ExternalLink size={14} aria-hidden="true" />
                {project.url.label}
              </a>
            </li>
          )}
          {project.repo && (
            <li>
              <a href={project.repo} target="_blank" rel="noreferrer">
                <GithubIcon size={14} />
                Source code
              </a>
            </li>
          )}
        </ul>
      )}

      <h3>Highlights</h3>
      <ul className="project__highlights">
        {project.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <h3>Built with</h3>
      <ul className="page__tags">
        {project.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      {total > 1 && (
        <footer className="project__footer">
          {next ? (
            <button type="button" className="project__next" onClick={onNext}>
              <span className="project__next-hint">Keep scrolling for the next project</span>
              <span className="project__next-name">
                {next.name}
                <ArrowDown size={16} aria-hidden="true" />
              </span>
            </button>
          ) : (
            <button type="button" className="project__next" onClick={onFirst}>
              <span className="project__next-hint">That's all of them</span>
              <span className="project__next-name">
                Back to the first project
                <ArrowUp size={16} aria-hidden="true" />
              </span>
            </button>
          )}
        </footer>
      )}
    </article>
  )
}
