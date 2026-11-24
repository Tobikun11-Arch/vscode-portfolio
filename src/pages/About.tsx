import { Placeholder } from './Placeholder'

export function About() {
  return (
    <article className="page">
      <h1>
        About me <Placeholder />
      </h1>
      <div className="page__split">
        <img
          className="page__portrait"
          src="/placeholders/portrait.svg"
          alt="Portrait of Joenel"
          width={320}
          height={320}
        />
        <div>
          <p className="page__lead">
            A few sentences about who you are, where you're based, and how you got into building
            software.
          </p>
          <p>
            What you enjoy working on, what you're learning right now, and what you do when you're
            not coding.
          </p>
        </div>
      </div>
    </article>
  )
}
