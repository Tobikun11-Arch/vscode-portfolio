import { ExternalLink, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GITHUB_OWNER, GITHUB_REPO, REPO_URL, fetchCommits, timeAgo, type Commit } from '../git/commits'

type LoadState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; commits: Commit[] }

/** Commit history of the portfolio repo, read live from GitHub. */
export function GitGraphPanel() {
  const [state, setState] = useState<LoadState>({ kind: 'loading' })

  const load = (force: boolean) =>
    fetchCommits(undefined, { force }).then(
      (commits) => setState({ kind: 'ready', commits }),
      (error: unknown) =>
        setState({ kind: 'error', message: error instanceof Error ? error.message : String(error) }),
    )

  useEffect(() => {
    void load(false)
  }, [])

  const refresh = () => {
    setState({ kind: 'loading' })
    void load(true)
  }

  return (
    <section className="side-panel" aria-label="Source Control">
      <div className="side-panel__title">
        SOURCE CONTROL
        <button type="button" className="side-panel__action" aria-label="Refresh" onClick={refresh}>
          <RefreshCw size={14} aria-hidden="true" />
        </button>
      </div>
      <a className="git-repo" href={REPO_URL} target="_blank" rel="noreferrer">
        {GITHUB_OWNER}/{GITHUB_REPO}
        <ExternalLink size={12} aria-hidden="true" />
      </a>
      <div className="side-panel__section">GRAPH</div>

      {state.kind === 'loading' && <p className="side-panel__note">Loading history…</p>}

      {state.kind === 'error' && (
        <div className="side-panel__note">
          <p>Couldn't load the history. {state.message}</p>
          <button type="button" className="git-retry" onClick={refresh}>
            Retry
          </button>
        </div>
      )}

      {state.kind === 'ready' && state.commits.length === 0 && (
        <p className="side-panel__note">No commits yet.</p>
      )}

      {state.kind === 'ready' && state.commits.length > 0 && (
        <ol className="git-graph">
          {state.commits.map((commit, i) => (
            <li key={commit.sha} className="git-commit" aria-label={`commit ${commit.subject}`}>
              <span className="git-commit__rail" aria-hidden="true">
                <span className={`git-commit__dot${i === 0 ? ' is-head' : ''}`} />
              </span>
              <a
                className="git-commit__body"
                href={commit.url}
                target="_blank"
                rel="noreferrer"
                title={`${commit.shortSha} · ${commit.author} · ${new Date(commit.date).toLocaleString()}`}
              >
                <span className="git-commit__subject">
                  {commit.subject}
                  {i === 0 && <span className="git-commit__ref">main</span>}
                </span>
                <span className="git-commit__meta">
                  {commit.shortSha} · {commit.author} · {timeAgo(commit.date)}
                </span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
