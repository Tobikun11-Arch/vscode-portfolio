import { Placeholder } from './Placeholder'

const ROLES = [
  { title: 'Job title', company: 'Company name', years: '2024 – present' },
  { title: 'Job title', company: 'Company name', years: '2022 – 2024' },
  { title: 'Job title', company: 'Company name', years: '2020 – 2022' },
]

export function Experience() {
  return (
    <article className="page">
      <h1>
        Experience <Placeholder />
      </h1>
      <ol className="page__timeline">
        {ROLES.map((role, i) => (
          <li key={i}>
            <h2>
              {role.title} <span className="page__muted">@ {role.company}</span>
            </h2>
            <p className="page__muted">{role.years}</p>
            <p>One or two lines on what you built and the impact it had.</p>
          </li>
        ))}
      </ol>
    </article>
  )
}
