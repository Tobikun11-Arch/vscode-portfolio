import { ProjectPage } from './ProjectPage'
import { PROJECT_SHOTS } from './shots'

export function DesktopApp() {
  return (
    <ProjectPage
      title="Desktop app"
      shots={PROJECT_SHOTS['desktop-app']}
      tech={['Electron', 'React', 'SQLite']}
    />
  )
}
