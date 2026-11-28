import type { CSSProperties } from 'react'
import type { Banner, Project, Screen } from './data'

interface Props {
  project: Project
  banner: Banner
  /** Only the first banner loads eagerly; the rest wait until they are swiped to. */
  eager?: boolean
}

/** The screenshot itself, or a labelled stand-in until the real image is added. */
function ScreenImage({ screen, eager }: { screen: Screen; eager?: boolean }) {
  if (screen.src) {
    return (
      <img
        className="device__img"
        src={screen.src}
        alt={screen.label}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
    )
  }
  return (
    <div className="device__placeholder" role="img" aria-label={screen.label}>
      <span className="device__placeholder-bar" />
      <span className="device__placeholder-label">{screen.label}</span>
      <span className="device__placeholder-file">{screen.file}.png</span>
    </div>
  )
}

function MacBook({ screen, eager }: { screen: Screen; eager?: boolean }) {
  return (
    <div className="macbook">
      <div className="macbook__lid">
        <span className="macbook__notch" />
        <div className="macbook__screen">
          <ScreenImage screen={screen} eager={eager} />
        </div>
      </div>
      <div className="macbook__base" />
    </div>
  )
}

function Phone({ screen, eager, className = '' }: { screen: Screen; eager?: boolean; className?: string }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone__screen">
        <span className="phone__island" />
        <ScreenImage screen={screen} eager={eager} />
      </div>
    </div>
  )
}

/**
 * A 16:9 landscape banner: project name, headline and link on the left,
 * device mockups on the right. Everything scales with the banner width.
 */
export function DeviceBanner({ project, banner, eager }: Props) {
  const mobile = project.kind === 'mobile'
  const [left, center, right] = banner.screens
  return (
    <div
      className={`banner banner--${mobile ? 'phones' : 'laptop'}`}
      style={{ '--brand': project.accent } as CSSProperties}
    >
      <div className="banner__copy">
        <span className="banner__pill">{project.name}</span>
        <p className="banner__headline">{banner.headline}</p>
        <p className="banner__caption">{banner.caption}</p>
        {project.url && <span className="banner__url">{project.url.label}</span>}
      </div>

      <div className="banner__stage">
        <span className="banner__blob" />
        {mobile ? (
          <>
            {left && <Phone screen={left} className="phone--side phone--left" />}
            {right && <Phone screen={right} className="phone--side phone--right" />}
            {center && <Phone screen={center} eager={eager} className="phone--center" />}
          </>
        ) : (
          <>
            <MacBook screen={banner.screens[0]} eager={eager} />
            {banner.phone && <Phone screen={banner.phone} className="phone--front" />}
            {banner.float && (
              <div className="banner__float">
                <ScreenImage screen={banner.float} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
