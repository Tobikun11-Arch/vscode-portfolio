import { useState, type ChangeEvent } from 'react'
import { fileById, type FileId } from '../files'
import { getSearchIndex, searchFiles, type SearchMatch, type SearchResult } from '../search/search'
import { FileIcon } from './FileIcon'

interface SearchPanelProps {
  onOpen(id: FileId): void
}

/** Long lines are trimmed so the match stays visible in the narrow sidebar. */
function Snippet({ match, length }: { match: SearchMatch; length: number }) {
  const start = match.index > 24 ? match.index - 16 : 0
  const before = (start > 0 ? '…' : '') + match.line.slice(start, match.index)
  const hit = match.line.slice(match.index, match.index + length)
  const after = match.line.slice(match.index + length)
  return (
    <>
      {before}
      <mark>{hit}</mark>
      {after}
    </>
  )
}

export function SearchPanel({ onOpen }: SearchPanelProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    setQuery(next)
    setResults(searchFiles(getSearchIndex(), next))
  }

  const needle = query.trim()
  const total = results.reduce((sum, r) => sum + r.matches.length, 0)

  return (
    <section className="side-panel" aria-label="Search">
      <div className="side-panel__title">SEARCH</div>
      <div className="search-box">
        <input
          type="search"
          value={query}
          onChange={onChange}
          placeholder="Search"
          aria-label="Search in all files"
          autoFocus
          spellCheck={false}
        />
      </div>

      {needle && results.length === 0 && <p className="side-panel__note">No results found.</p>}

      {results.length > 0 && (
        <>
          <p className="side-panel__note">
            {total} {total === 1 ? 'result' : 'results'} in {results.length}{' '}
            {results.length === 1 ? 'file' : 'files'}
          </p>
          <div className="search-results">
            {results.map((result) => {
              const file = fileById(result.id)
              return (
                <div key={result.id} role="group" aria-label={file.name} className="search-file">
                  <div className="search-file__head">
                    <FileIcon ext={file.ext} />
                    <span className="search-file__name">{file.name}</span>
                    <span className="search-file__count">{result.matches.length}</span>
                  </div>
                  {result.matches.map((match, i) => (
                    <button
                      key={i}
                      type="button"
                      className="search-match"
                      onClick={() => onOpen(result.id)}
                    >
                      <Snippet match={match} length={needle.length} />
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}
