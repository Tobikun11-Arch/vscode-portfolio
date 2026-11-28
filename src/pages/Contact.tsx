import { Building, FileDown, Globe, Mail, MapPin } from 'lucide-react'
import type { ReactNode } from 'react'
import { GithubIcon, InstagramIcon, LinkedinIcon } from './BrandIcons'
import { RESUME_FILENAME, RESUME_URL } from './resume'

interface Channel {
  label: string
  value: string
  href?: string
  /** Set to make the link download a file instead of opening it. */
  download?: string
  icon: ReactNode
}

const EMAIL = 'joenelsevellejo831@gmail.com'

const CHANNELS: Channel[] = [
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, icon: <Mail size={18} /> },
  {
    label: 'GitHub',
    value: 'Tobikun11-Arch',
    href: 'https://github.com/Tobikun11-Arch',
    icon: <GithubIcon />,
  },
  {
    label: 'LinkedIn',
    value: 'in/joenel-sevellejo-2919a7259',
    href: 'https://www.linkedin.com/in/joenel-sevellejo-2919a7259',
    icon: <LinkedinIcon />,
  },
  {
    label: 'Instagram',
    value: 'joenelsevellejo11',
    href: 'https://www.instagram.com/joenelsevellejo11',
    icon: <InstagramIcon />,
  },
  {
    label: 'Website',
    value: 'seve-eosin.vercel.app/about',
    href: 'https://seve-eosin.vercel.app/about',
    icon: <Globe size={18} />,
  },
  {
    label: 'Resume',
    value: 'Download PDF',
    href: RESUME_URL,
    download: RESUME_FILENAME,
    icon: <FileDown size={18} />,
  },
  { label: 'Work', value: 'Dynamic VARS', icon: <Building size={18} /> },
  { label: 'Location', value: 'Cavite, Philippines', icon: <MapPin size={18} /> },
]

export function Contact() {
  return (
    <article className="page">
      <h1>Contact</h1>
      <p className="page__lead">
        Have a project in mind or want to work together? Email is the fastest way to reach me, or
        find me on any of these.
      </p>
      <ul className="contact-grid">
        {CHANNELS.map((channel) => {
          const body = (
            <>
              <span className="contact-card__icon">{channel.icon}</span>
              <span className="contact-card__text">
                <span className="contact-card__label">{channel.label}</span>
                <span className="contact-card__value">{channel.value}</span>
              </span>
            </>
          )
          const external = channel.href?.startsWith('http')
          return (
            <li key={channel.label}>
              {channel.href ? (
                <a
                  className="contact-card"
                  href={channel.href}
                  download={channel.download}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {body}
                </a>
              ) : (
                <div className="contact-card">{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </article>
  )
}
