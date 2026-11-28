import type { ReactNode } from 'react'

interface Role {
  title: string
  company: string
  type: string
  dates: string
  points: ReactNode[]
}

/** Mirrors the EXPERIENCE and PROJECTS sections of the resume PDF, in the same order. */
const ROLES: Role[] = [
  {
    title: 'Full Stack Developer',
    company: 'Dynamic VA Referral Services',
    type: 'Part-time',
    dates: 'January 2026 – Present',
    points: [
      <>
        Built <strong>Dyna-Mail</strong>, an in-house cold email and CRM platform (Next.js,
        MongoDB, Prisma) that replaced one-by-one sending with a{' '}
        <strong>3-step campaign wizard</strong>: CSV lead import, multi-day sequences, and
        merge-field personalization.
      </>,
      <>
        Tripled daily outreach capacity to <strong>300 emails/day</strong> by rotating sends across{' '}
        <strong>3 SMTP accounts</strong> with a 100-per-account daily cap, scaling volume without
        overloading any single sender's reputation.
      </>,
      <>
        Made campaign delivery fault-tolerant with a cron-driven queue that sends in batches of up
        to 100, locks jobs to <strong>prevent duplicate sends</strong>, and auto-retries failed
        emails <strong>up to 3 times</strong> at 30-minute intervals.
      </>,
      <>
        Put every prospect in one place by modeling <strong>11 CRM record types</strong> (deals,
        tasks, appointments, notes, files) alongside campaigns, so the team can follow up on
        replies without a separate CRM subscription.
      </>,
      <>
        Built <strong>DynaCore Ledger</strong> for Dynamic Virtual Finance Services, a multi-tenant
        back office covering invoicing, payments, expenses, payroll and PDF payslips, with{' '}
        <strong>22 REST API modules</strong>, per-business data isolation, and{' '}
        <strong>155 automated tests</strong> (Jest, Supertest).
      </>,
      <>
        Shipped <strong>Clovars</strong>, a cross-platform <strong>Electron desktop app</strong>{' '}
        for team time tracking (tray timer, role-based workspaces, CSV reports), released through{' '}
        <strong>v1.0.8</strong> with in-app auto-updates and GitHub Actions CI.
      </>,
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'Freelance',
    type: 'Freelance',
    dates: 'January 2024 – Present',
    points: [
      <>
        Delivered <strong>4+ full-stack web applications</strong> for multiple clients with
        React.js, Next.js and Node.js, shipping every project within its agreed deadline.
      </>,
      <>
        Built responsive UIs with <strong>React Native (Expo) and Tailwind CSS</strong> from a
        single codebase for mobile and web, with <strong>zero critical UI regressions</strong>{' '}
        reported after launch.
      </>,
      <>
        Reduced integration defects before client handoff by testing every REST endpoint in{' '}
        <strong>Postman</strong> and running all work through <strong>Git/GitHub</strong> branching
        and pull-request reviews.
      </>,
      <>
        Improved clients' <strong>search engine rankings</strong> by implementing technical SEO
        (metadata, sitemaps, semantic page structure) on every site delivered.
      </>,
    ],
  },
  {
    title: 'Lead Developer',
    company: "DonClaudio's Lechon House",
    type: 'Capstone · Next.js, Express, MongoDB, Xendit',
    dates: 'March 2026 – November 2026',
    points: [
      <>
        Led a <strong>4-person team</strong> as lead developer, authoring{' '}
        <strong>~93% of 525 commits</strong> and merging <strong>147 branches</strong> through a
        feature → development → production Git workflow.
      </>,
      <>
        Built an end-to-end restaurant ordering platform with{' '}
        <strong>3 role-based dashboards</strong> (customer, cashier, owner) backed by{' '}
        <strong>23 REST route modules</strong> and <strong>30 data models</strong> for orders,
        inventory, promos, rewards and pre-orders.
      </>,
      <>
        Replaced manual screenshot payment checks with <strong>Xendit</strong> checkout across{' '}
        <strong>5 channels</strong> (GCash, Maya, GrabPay, ShopeePay, cards); webhooks mark orders
        paid, cancel unpaid ones after <strong>30 minutes</strong>, restock, and auto-refund.
      </>,
      <>
        Turned the storefront into an <strong>installable PWA</strong> with an offline fallback and{' '}
        <strong>web push</strong> order-status notifications, keeping customers updated without the
        site open.
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
