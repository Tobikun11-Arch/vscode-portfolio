import { ProjectPage } from './ProjectPage'
import { PROJECT_SHOTS } from './shots'

export function MobileApp() {
  return (
    <ProjectPage
      title="Mobile app"
      shots={PROJECT_SHOTS['mobile-app']}
      orientation="portrait"
      tech={['React Native', 'Expo', 'TypeScript']}
    />
  )
}
