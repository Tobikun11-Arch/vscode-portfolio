import {
  ExternalLink,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react'
import type { MouseEvent } from 'react'
import { useDesktopWindow } from '../desktop/useDesktopWindow'
import { TrafficLights } from '../editor/TitleBar'
import {
  cycleRepeat,
  formatTime,
  next,
  playIndex,
  prev,
  seek,
  setVolume,
  shufflePlay,
  togglePlay,
  toggleShuffle,
  usePlayer,
} from './player'
import { PLAYLIST_NAME, TRACKS } from './tracks'
import './music.css'

/** Animated bars shown next to the song that's playing. */
export function Equalizer({ paused = false }: { paused?: boolean }) {
  return (
    <span className={`eq${paused ? ' is-paused' : ''}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}

/** Click or drag anywhere on a bar to set a 0..1 value. */
function Slider({
  value,
  onChange,
  label,
  className = '',
}: {
  value: number
  onChange(v: number): void
  label: string
  className?: string
}) {
  const fromEvent = (e: MouseEvent<HTMLDivElement> | PointerEvent, el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
  }
  return (
    <div
      className={`slider ${className}`}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      style={{ ['--v' as string]: `${value * 100}%` }}
      onPointerDown={(e) => {
        const el = e.currentTarget
        onChange(fromEvent(e.nativeEvent, el))
        const move = (ev: PointerEvent) => onChange(fromEvent(ev, el))
        const up = () => {
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerup', up)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onChange(Math.min(1, value + 0.05))
        else if (e.key === 'ArrowLeft') onChange(Math.max(0, value - 0.05))
        else return
        e.preventDefault()
      }}
    >
      <div className="slider__track">
        <div className="slider__fill" />
      </div>
    </div>
  )
}

export function PlayerControls({ compact = false }: { compact?: boolean }) {
  const p = usePlayer()
  const RepeatIcon = p.repeat === 'one' ? Repeat1 : Repeat
  return (
    <div className={`controls${compact ? ' is-compact' : ''}`}>
      {!compact && (
        <button
          type="button"
          aria-label="Shuffle"
          aria-pressed={p.shuffle}
          className={`controls__minor${p.shuffle ? ' is-on' : ''}`}
          onClick={toggleShuffle}
        >
          <Shuffle size={16} />
        </button>
      )}
      <button type="button" aria-label="Previous" className="controls__minor" onClick={prev}>
        <SkipBack size={18} fill="currentColor" />
      </button>
      <button type="button" aria-label={p.playing ? 'Pause' : 'Play'} className="controls__play" onClick={togglePlay}>
        {p.playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
      </button>
      <button type="button" aria-label="Next" className="controls__minor" onClick={next}>
        <SkipForward size={18} fill="currentColor" />
      </button>
      {!compact && (
        <button
          type="button"
          aria-label={`Repeat: ${p.repeat}`}
          className={`controls__minor${p.repeat !== 'off' ? ' is-on' : ''}`}
          onClick={cycleRepeat}
        >
          <RepeatIcon size={16} />
        </button>
      )}
    </div>
  )
}

export function Progress() {
  const p = usePlayer()
  const dur = p.duration || 30
  return (
    <div className="progress">
      <span>{formatTime(p.time)}</span>
      <Slider label="Seek" value={p.index < 0 ? 0 : p.time / dur} onChange={(v) => seek(v * dur)} />
      <span>{formatTime(dur)}</span>
    </div>
  )
}

export function MusicWindow() {
  const win = useDesktopWindow('music')
  const p = usePlayer()
  if (!win.visible) return null

  const current = p.index >= 0 ? TRACKS[p.index] : null
  const VolumeIcon = p.volume === 0 ? VolumeX : p.volume < 0.5 ? Volume1 : Volume2
  const playlistPlaying = p.index >= 0 && p.playing

  return (
    <div
      ref={win.ref}
      className={`window music${win.maximized ? ' is-maximized' : ''}${win.dragging ? ' is-dragging' : ''}`}
      style={win.style}
      onPointerDownCapture={win.focus}
      role="application"
      aria-label="Music"
    >
      <header
        className="music__titlebar"
        onPointerDown={(e) => {
          if (e.button === 0 && !(e.target as Element).closest('button')) win.startDrag(e)
        }}
        onDoubleClick={(e) => {
          if (!(e.target as Element).closest('button')) win.toggleMaximize()
        }}
      >
        <TrafficLights
          onClose={win.close}
          onMinimize={win.minimize}
          onMaximize={win.toggleMaximize}
          maximized={win.maximized}
        />
        <span className="music__app-name">Music</span>
      </header>

      <div className="music__body">
        <nav className="music__library" aria-label="Your library">
          <div className="music__library-title">
            <ListMusic size={18} aria-hidden="true" /> Your Library
          </div>
          <button type="button" className="music__lib-item is-active">
            <span className="music__lib-cover">
              {TRACKS.slice(0, 4).map((t) => (
                <img key={t.id} src={t.artwork} alt="" loading="lazy" />
              ))}
            </span>
            <span>
              <span className="music__lib-name">{PLAYLIST_NAME}</span>
              <span className="music__lib-meta">Playlist · Joenel</span>
            </span>
          </button>
        </nav>

        <main className="music__main">
          <section className="music__hero">
            <div className="music__cover" aria-hidden="true">
              {TRACKS.slice(0, 4).map((t) => (
                <img key={t.id} src={t.artwork} alt="" />
              ))}
            </div>
            <div>
              <p className="music__kicker">Playlist</p>
              <h1 className="music__title">{PLAYLIST_NAME}</h1>
              <p className="music__desc">
                Enjoy my playlists!
              </p>
              <p className="music__meta">
                <strong>Joenel</strong> · {TRACKS.length} songs · 30-sec previews
              </p>
            </div>
          </section>

          <div className="music__actions">
            <button
              type="button"
              className="music__big-play"
              aria-label={playlistPlaying ? 'Pause playlist' : 'Play playlist'}
              onClick={togglePlay}
            >
              {playlistPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
            </button>
            <button
              type="button"
              className={`music__action${p.shuffle ? ' is-on' : ''}`}
              aria-label="Shuffle play"
              onClick={shufflePlay}
            >
              <Shuffle size={22} />
            </button>
          </div>

          <ol className="tracklist">
            <li className="tracklist__head" aria-hidden="true">
              <span>#</span>
              <span>Title</span>
              <span className="tracklist__album">Album</span>
              <span className="tracklist__time">0:30</span>
            </li>
            {TRACKS.map((t, i) => {
              const isCurrent = i === p.index
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    className={`tracklist__row${isCurrent ? ' is-current' : ''}`}
                    onClick={() => (isCurrent ? togglePlay() : playIndex(i))}
                    aria-label={`${isCurrent && p.playing ? 'Pause' : 'Play'} ${t.title} by ${t.artist}`}
                  >
                    <span className="tracklist__num">
                      {isCurrent ? <Equalizer paused={!p.playing} /> : i + 1}
                      <Play size={14} fill="currentColor" className="tracklist__hover-play" aria-hidden="true" />
                    </span>
                    <span className="tracklist__title">
                      <img src={t.artwork} alt="" width={40} height={40} loading="lazy" />
                      <span>
                        <span className="tracklist__name">{t.title}</span>
                        <span className="tracklist__artist">{t.artist}</span>
                      </span>
                    </span>
                    <span className="tracklist__album">{t.album}</span>
                    <span className="tracklist__time">0:30</span>
                  </button>
                </li>
              )
            })}
          </ol>
          <p className="music__credit">
            30-second previews courtesy of Apple Music. Use the ↗ button in the player bar to hear
            the full song.
          </p>
        </main>
      </div>

      <footer className="nowbar">
        <div className="nowbar__track">
          {current ? (
            <>
              <img src={current.artwork} alt="" width={56} height={56} />
              <span>
                <span className="nowbar__name">{current.title}</span>
                <span className="nowbar__artist">{current.artist}</span>
              </span>
            </>
          ) : (
            <span className="nowbar__artist">Pick a song to start</span>
          )}
        </div>
        <div className="nowbar__center">
          <PlayerControls />
          <Progress />
        </div>
        <div className="nowbar__right">
          {current && (
            <a
              className="nowbar__link"
              href={current.link}
              target="_blank"
              rel="noreferrer"
              aria-label="Open full song in Apple Music"
              title="Open full song in Apple Music"
            >
              <ExternalLink size={16} />
            </a>
          )}
          <button
            type="button"
            className="controls__minor"
            aria-label={p.volume === 0 ? 'Unmute' : 'Mute'}
            onClick={() => setVolume(p.volume === 0 ? 0.8 : 0)}
          >
            <VolumeIcon size={18} />
          </button>
          <Slider className="is-volume" label="Volume" value={p.volume} onChange={setVolume} />
        </div>
      </footer>
    </div>
  )
}
