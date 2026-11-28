import { EditorWindow } from '../editor/EditorWindow'
import { MusicWindow } from '../music/MusicWindow'
import { Dock } from './Dock'
import { useDesktop } from './desktopStore'
import { DynamicIsland } from './DynamicIsland'
import './desktop.css'

/** The whole screen: wallpaper icons, app windows, the dock and the Dynamic Island. */
export function Desktop() {
  const { open } = useDesktop()
  const anyOpen = open.editor || open.music
  return (
    <div className={`desktop${anyOpen ? ' has-open-window' : ''}`}>
      <EditorWindow />
      <MusicWindow />
      <DynamicIsland />
      <Dock />
    </div>
  )
}
