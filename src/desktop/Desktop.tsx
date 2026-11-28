import { useCallback, useEffect, useState } from 'react'
import { EditorWindow } from '../editor/EditorWindow'
import { MusicWindow } from '../music/MusicWindow'
import { TRACKS } from '../music/tracks'
import { preloadImages } from '../preload'
import { Dock } from './Dock'
import { useDesktop } from './desktopStore'
import { DynamicIsland } from './DynamicIsland'
import { HelloIntro, shouldShowIntro } from './HelloIntro'
import './desktop.css'

/** The whole screen: the hello intro, app windows, the dock and the Dynamic Island. */
export function Desktop() {
  const { open } = useDesktop()
  const anyOpen = open.editor || open.music
  const [intro, setIntro] = useState(shouldShowIntro)
  const [arrived, setArrived] = useState(false)
  const endIntro = useCallback(() => {
    setIntro(false)
    setArrived(true)
  }, [])

  // The editor queues every project screenshot on mount; the playlist covers go after them.
  useEffect(() => {
    preloadImages(TRACKS.map((t) => t.artwork))
  }, [])

  return (
    <div className={`desktop${anyOpen ? ' has-open-window' : ''}${arrived ? ' is-arriving' : ''}`}>
      <EditorWindow />
      <MusicWindow />
      <DynamicIsland />
      {!intro && <Dock />}
      {intro && <HelloIntro onDone={endIntro} />}
    </div>
  )
}
