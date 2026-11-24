import { describe, expect, it, vi } from 'vitest'
import { COMMITS_URL, fetchCommits, timeAgo } from './commits'

const apiCommit = (sha: string, message: string, date: string) => ({
  sha,
  html_url: `https://github.com/Tobikun11-Arch/vscode-portfolio/commit/${sha}`,
  commit: { message, author: { name: 'Joenel Sevellejo', date } },
})

const okResponse = (body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status: 200 }))

describe('fetchCommits', () => {
  it('asks GitHub for the portfolio repo history', async () => {
    const fetchFn = vi.fn(() => okResponse([]))
    await fetchCommits(fetchFn)
    expect(fetchFn).toHaveBeenCalledWith(COMMITS_URL, expect.anything())
    expect(COMMITS_URL).toContain('api.github.com/repos/Tobikun11-Arch/vscode-portfolio/commits')
  })

  it('maps commits to subject line, short sha, author, date and link', async () => {
    const fetchFn = vi.fn(() =>
      okResponse([
        apiCommit(
          '84c92e62dcbca19c86f57971204f2f3ff6092b22',
          'content: fill pages\n\nCo-Authored-By: someone',
          '2026-11-24T16:26:59Z',
        ),
      ]),
    )
    const [commit] = await fetchCommits(fetchFn)
    expect(commit).toEqual({
      sha: '84c92e62dcbca19c86f57971204f2f3ff6092b22',
      shortSha: '84c92e6',
      subject: 'content: fill pages',
      author: 'Joenel Sevellejo',
      date: '2026-11-24T16:26:59Z',
      url: 'https://github.com/Tobikun11-Arch/vscode-portfolio/commit/84c92e62dcbca19c86f57971204f2f3ff6092b22',
    })
  })

  it('reuses a fresh cached copy instead of calling GitHub again', async () => {
    const fetchFn = vi.fn(() => okResponse([apiCommit('a'.repeat(40), 'one', '2026-11-24T00:00:00Z')]))
    await fetchCommits(fetchFn)
    const again = await fetchCommits(fetchFn)
    expect(fetchFn).toHaveBeenCalledTimes(1)
    expect(again[0].subject).toBe('one')
  })

  it('refetches when forced', async () => {
    const fetchFn = vi.fn(() => okResponse([]))
    await fetchCommits(fetchFn)
    await fetchCommits(fetchFn, { force: true })
    expect(fetchFn).toHaveBeenCalledTimes(2)
  })

  it('treats an empty repository as no commits', async () => {
    const fetchFn = vi.fn(() => Promise.resolve(new Response('{}', { status: 409 })))
    expect(await fetchCommits(fetchFn)).toEqual([])
  })

  it('throws a readable error when GitHub refuses (e.g. rate limit)', async () => {
    const fetchFn = vi.fn(() => Promise.resolve(new Response('{}', { status: 403 })))
    await expect(fetchCommits(fetchFn)).rejects.toThrow(/GitHub/)
  })
})

describe('timeAgo', () => {
  const now = new Date('2026-11-25T12:00:00Z')
  it.each([
    ['2026-11-25T11:59:40Z', 'just now'],
    ['2026-11-25T11:55:00Z', '5 minutes ago'],
    ['2026-11-25T11:00:00Z', '1 hour ago'],
    ['2026-11-24T12:00:00Z', '1 day ago'],
    ['2026-11-10T12:00:00Z', '15 days ago'],
    ['2026-08-25T12:00:00Z', '3 months ago'],
    ['2024-11-25T12:00:00Z', '2 years ago'],
  ])('%s -> %s', (date, expected) => {
    expect(timeAgo(date, now)).toBe(expected)
  })
})
