import { ProjectPage } from './ProjectPage'

export function WebApp() {
  return (
    <ProjectPage
      title="Web app"
      image="/placeholders/web-app.svg"
      tech={['React', 'TypeScript', 'Node.js']}
    />
  )
}
