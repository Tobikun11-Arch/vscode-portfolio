import { Placeholder } from '../Placeholder'

export interface ProjectPageProps {
  title: string
  image: string
  tech: string[]
}

/** Shared layout for the three project files. */
export function ProjectPage({ title, image, tech }: ProjectPageProps) {
  return (
    <article className="page">
      <h1>
        {title} <Placeholder />
      </h1>
      <img
        className="page__shot"
        src={image}
        alt={`${title} screenshot`}
        width={800}
        height={450}
      />
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
