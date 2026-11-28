import { Maximize2 } from 'lucide-react'
import { useState } from 'react'
import { Equalizer, PlayerControls, Progress } from '../music/MusicWindow'
import { usePlayer } from '../music/player'
import { TRACKS } from '../music/tracks'
import { openApp, useDesktop } from './desktopStore'

/**
 * While music plays and the Music window is minimized or closed, the player
 * lives in a pill at the top of the screen. Hover (or tap) to expand it into
 * full controls.
 */
export function DynamicIsland() {
  const { open } = useDesktop()
  const p = usePlayer()
  const [expanded, setExpanded] = useState(false)

  if (p.index < 0 || open.music) return null
  const t = TRACKS[p.index]

  return (
    <div
      className={`island${expanded ? ' is-expanded' : ''}`}
      role="region"
      aria-label={`Now playing: ${t.title} by ${t.artist}`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setExpanded(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setExpanded(false)}
      onClick={(e) => {
        // Tap to expand on touch screens; taps on the controls don't collapse it.
        if (!(e.target as Element).closest('button, .slider')) setExpanded((v) => !v)
      }}
    >
      <div className="island__compact" aria-hidden={expanded}>
        <img src={t.artwork} alt="" width={26} height={26} />
        <span className="island__ticker">{t.title}</span>
        <Equalizer paused={!p.playing} />
      </div>

      <div className="island__full" aria-hidden={!expanded}>
        <div className="island__row">
          <img src={t.artwork} alt="" width={54} height={54} />
          <span className="island__text">
            <span className="island__kicker">Joenel Playlist</span>
            <span className="island__title">{t.title}</span>
            <span className="island__artist">{t.artist}</span>
          </span>
          <Equalizer paused={!p.playing} />
        </div>
        <Progress />
        <div className="island__row is-controls">
          <PlayerControls compact />
          <button
            type="button"
            className="island__open"
            aria-label="Open Music"
            onClick={() => {
              setExpanded(false)
              openApp('music')
            }}
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
