import { Link } from 'react-router'
import { FILES } from '../files'
import { Placeholder } from './Placeholder'

export function Home() {
  const others = FILES.filter((f) => f.id !== 'home')
  return (
    <article className="page">
      <p className="page__eyebrow">// hello, world</p>
      <h1>
        Hi, I'm Joenel <Placeholder />
      </h1>
      <p className="page__lead">
        Software developer building web, mobile and desktop apps. Short intro about what you do
        and what you care about goes here.
      </p>
      <h2>Open a file</h2>
      <ul className="page__links">
        {others.map((file) => (
          <li key={file.id}>
            <Link to={file.path}>{file.path === '/' ? 'home' : file.path.slice(1)}</Link>
          </li>
        ))}
      </ul>
    </article>
  )
}
