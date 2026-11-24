import { ProjectPage } from './ProjectPage'

export function DesktopApp() {
  return (
    <ProjectPage
      title="Desktop app"
      image="/placeholders/desktop-app.svg"
      tech={['Electron', 'React', 'SQLite']}
    />
  )
}
