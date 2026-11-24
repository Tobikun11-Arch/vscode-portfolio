const EMAIL = 'joenelsevellejo831@gmail.com'

export function Contact() {
  return (
    <article className="page">
      <h1>Contact</h1>
      <p className="page__lead">
        Have a project in mind or want to work together? Send me an email.
      </p>
      <dl className="page__contacts">
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>Tanza, Cavite, Philippines</dd>
        </div>
      </dl>
    </article>
  )
}
