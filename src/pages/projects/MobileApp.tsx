import { ProjectPage } from './ProjectPage'

export function MobileApp() {
  return (
    <ProjectPage
      title="Mobile app"
      image="/placeholders/mobile-app.svg"
      tech={['React Native', 'Expo', 'TypeScript']}
    />
  )
}
