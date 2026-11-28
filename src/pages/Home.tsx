import { FileDown } from 'lucide-react'
import { Link } from 'react-router'
import { FILES } from '../files'
import { RESUME_FILENAME, RESUME_URL } from './resume'

export function Home() {
  const others = FILES.filter((f) => f.id !== 'home')
  return (
    <article className="page">
      <p className="page__eyebrow">// hello, world</p>
      <h1>Hi, I'm Joenel</h1>
      <p className="page__lead">
        Fullstack developer from Tanza, Cavite. I build web and mobile apps with React, Next.js,
        Node.js and Go, from automated email outreach systems to production platforms used every
        day.
      </p>
      <p>
        <a className="page__button" href={RESUME_URL} download={RESUME_FILENAME}>
          <FileDown size={16} aria-hidden="true" />
          Download resume
        </a>
      </p>
      <p>
        I'm also taking a BS in Information Technology at Cavite State University – Tanza. Open a
        file in the explorer, or start here:
      </p>
      <h2>Open a file</h2>
      <ul className="page__links">
        {others.map((file) => (
          <li key={file.id}>
            <Link to={file.path}>{file.path.slice(1)}</Link>
          </li>
        ))}
      </ul>
    </article>
  )
}
