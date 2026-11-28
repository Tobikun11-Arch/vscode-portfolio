import { ProjectPage } from './ProjectPage'
import { PROJECT_SHOTS } from './shots'

export function WebApp() {
  return (
    <ProjectPage
      title="Web app"
      shots={PROJECT_SHOTS['web-app']}
      tech={['React', 'TypeScript', 'Node.js']}
    />
  )
}
