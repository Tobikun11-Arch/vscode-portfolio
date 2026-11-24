import { Placeholder } from './Placeholder'

const LINKS = [
  { label: 'Email', value: 'you@example.com', href: 'mailto:you@example.com' },
  { label: 'GitHub', value: 'github.com/your-handle', href: 'https://github.com/' },
  { label: 'LinkedIn', value: 'linkedin.com/in/your-handle', href: 'https://www.linkedin.com/' },
]

export function Contact() {
  return (
    <article className="page">
      <h1>
        Contact <Placeholder />
      </h1>
      <p className="page__lead">Want to work together or just say hi? Reach me here.</p>
      <dl className="page__contacts">
        {LINKS.map((link) => (
          <div key={link.label}>
            <dt>{link.label}</dt>
            <dd>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.value}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
