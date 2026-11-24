import { Link } from 'react-router'

export function NotFound() {
  return (
    <article className="page page--center">
      <h1>File not found</h1>
      <p className="page__muted">That file isn't in Joenel-Portfolio. Pick one from the explorer.</p>
      <p>
        <Link to="/">Open home.tsx</Link>
      </p>
    </article>
  )
}
