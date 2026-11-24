import type { ReactNode } from 'react'

interface Role {
  title: string
  company: string
  type: string
  dates: string
  points: ReactNode[]
}

const ROLES: Role[] = [
  {
    title: 'Fullstack Developer',
    company: 'Dynamic VA Referral Services',
    type: 'Part-time',
    dates: 'January 2026 – Present',
    points: [
      <>
        Engineered an <strong>automated cold email outreach system</strong> that expanded the
        company's prospective client pipeline by targeting new business segments, directly
        supporting lead generation goals.
      </>,
      <>
        Improved <strong>email deliverability and open rates</strong> by optimizing domain warm-up
        sequences and sender reputation management, reducing bounce rates and increasing campaign
        effectiveness.
      </>,
      <>
        Designed and built <strong>personalized email sequence workflows</strong> that shortened
        the sales outreach cycle, enabling the marketing team to engage more prospects in less
        time.
      </>,
      <>
        Integrated outreach tooling with <strong>CRM workflows</strong>, giving the team real-time
        visibility into campaign performance and enabling data-driven decisions on client
        acquisition strategy.
      </>,
    ],
  },
  {
    title: 'Fullstack Developer',
    company: 'Medianeth (Startup)',
    type: 'Full-time',
    dates: 'March 2025 – September 2025',
    points: [
      <>
        Stabilized a production platform serving active users by resolving{' '}
        <strong>critical bugs</strong> and implementing new features, reducing system downtime and
        improving overall reliability.
      </>,
      <>
        Optimized <strong>database queries</strong> and resolved cross-environment errors, cutting
        average response time and enabling the platform to handle higher load without
        infrastructure changes.
      </>,
      <>
        Accelerated the <strong>deployment pipeline</strong> by collaborating closely with the
        team on <strong>CI/CD</strong> practices, resulting in smoother releases and fewer
        post-deployment incidents.
      </>,
      <>
        Enhanced platform capabilities through <strong>iterative feature development</strong>,
        directly contributing to improved user retention and expanded product functionality.
      </>,
    ],
  },
  {
    title: 'Fullstack Web Developer',
    company: 'Freelance',
    type: 'Freelance',
    dates: 'January 2024 – Present',
    points: [
      <>
        Delivered <strong>4+ full-stack web applications</strong> for multiple clients using{' '}
        <strong>React.js, Next.js, and Node.js</strong> with scalable architecture, meeting project
        deadlines and performance requirements.
      </>,
      <>
        Built responsive, cross-platform UIs with{' '}
        <strong>React Native (Expo) and Tailwind CSS</strong>, ensuring consistent user experiences
        across mobile and web with <strong>zero critical UI regressions</strong>.
      </>,
      <>
        Maintained code quality and reduced integration issues through{' '}
        <strong>Git/GitHub version control and Postman-based API testing</strong>, enabling
        reliable delivery across all client projects.
      </>,
      <>
        Improved clients' <strong>search engine rankings</strong> by implementing{' '}
        <strong>SEO</strong> in the web applications developed, optimizing site structures,
        metadata, and content strategies.
      </>,
    ],
  },
]

export function Experience() {
  return (
    <article className="page">
      <h1>Experience</h1>
      <ol className="page__timeline">
        {ROLES.map((role) => (
          <li key={role.company}>
            <h2>
              {role.title} <span className="page__muted">@ {role.company}</span>
            </h2>
            <p className="page__meta">
              <span>{role.dates}</span>
              <span className="page__muted">{role.type}</span>
            </p>
            <ul className="page__bullets">
              {role.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </article>
  )
}
