import { describe, expect, it } from 'vitest'
import { EMPTY_PATH, FILES, FILE_TREE, fileById, fileByPath } from './files'

describe('file model', () => {
  it('lists files in explorer order', () => {
    expect(FILES.map((f) => f.id)).toEqual([
      'home',
      'about',
      'experience',
      'web-app',
      'mobile-app',
      'desktop-app',
      'contact',
    ])
  })

  it('names and paths match the spec', () => {
    expect(fileById('about')).toMatchObject({ name: 'about.md', path: '/about' })
    expect(fileById('web-app')).toMatchObject({
      name: 'web-app.tsx',
      path: '/projects/web-app',
    })
    expect(fileById('home').path).toBe('/')
  })

  it('root folder is Joenel-Portfolio with a projects folder', () => {
    expect(FILE_TREE.name).toBe('Joenel-Portfolio')
    const projects = FILE_TREE.children.find((n) => n.kind === 'folder')
    expect(projects?.name).toBe('projects')
  })

  it('resolves trailing slash and case', () => {
    expect(fileByPath('/About/')?.id).toBe('about')
    expect(fileByPath('/projects/web-app/')?.id).toBe('web-app')
    expect(fileByPath('/')?.id).toBe('home')
  })

  it('returns undefined for folders and unknown paths', () => {
    expect(fileByPath('/projects')).toBeUndefined()
    expect(fileByPath('/foo')).toBeUndefined()
    expect(fileByPath(EMPTY_PATH)).toBeUndefined()
  })
})
