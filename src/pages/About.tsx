const SKILLS: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Java', 'JavaScript', 'Go', 'SQL', 'Python'] },
  {
    group: 'Frontend',
    items: ['React.js', 'Vite', 'Next.js', 'Tailwind CSS', 'Tanstack Query', 'Zustand'],
  },
  {
    group: 'Backend',
    items: ['Node.js', 'Express.js', 'Gin (Go)', 'MongoDB', 'Firebase', 'Supabase', 'Prisma ORM'],
  },
  {
    group: 'Tools & Technologies',
    items: ['Git', 'GitHub', 'Docker', 'Postman', 'REST APIs', 'Workbench', 'DBeaver'],
  },
]

export function About() {
  return (
    <article className="page">
      <h1>About me</h1>
      <div className="page__split">
        <img
          className="page__portrait"
          src="/placeholders/portrait.svg"
          alt="Portrait of Joenel F. Sevellejo"
          width={320}
          height={320}
        />
        <div>
          <p className="page__lead">
            I'm Joenel F. Sevellejo, a fullstack developer based in Tanza, Cavite, Philippines.
          </p>
          <p>
            Since 2024 I've shipped web apps for freelance clients, kept a startup's production
            platform stable as a full-time developer, and built automated outreach systems for a
            referral services company. I like owning a feature from the database to the UI.
          </p>
        </div>
      </div>

      <h2>Education</h2>
      <div className="page__entry">
        <div className="page__entry-head">
          <strong>Cavite State University – Tanza</strong>
          <span className="page__muted">Aug 2023 – Present</span>
        </div>
        <p className="page__muted">Bachelor of Science in Information Technology</p>
      </div>

      <h2>Skills</h2>
      <dl className="page__skills">
        {SKILLS.map(({ group, items }) => (
          <div key={group}>
            <dt>{group}</dt>
            <dd>
              <ul className="page__tags">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
