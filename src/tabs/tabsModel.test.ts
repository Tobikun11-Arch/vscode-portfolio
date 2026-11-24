import { describe, expect, it, vi } from 'vitest'
import type { FileId } from '../files'
import { closeTab, loadTabs, openTab, saveTabs } from './tabsModel'

describe('tab model', () => {
  it('openTab appends once', () => {
    expect(openTab(['home'], 'about')).toEqual(['home', 'about'])
    const t: FileId[] = ['home']
    expect(openTab(t, 'home')).toBe(t)
  })

  it('closeTab picks right neighbor, then left, then null', () => {
    expect(closeTab(['home', 'about', 'contact'], 'about')).toEqual({
      tabs: ['home', 'contact'],
      neighbor: 'contact',
    })
    expect(closeTab(['home', 'about'], 'about')).toEqual({ tabs: ['home'], neighbor: 'home' })
    expect(closeTab(['home'], 'home')).toEqual({ tabs: [], neighbor: null })
  })

  it('save/load round-trips', () => {
    saveTabs(['about', 'home'])
    expect(loadTabs()).toEqual(['about', 'home'])
  })

  it('loadTabs tolerates bad storage', () => {
    sessionStorage.setItem('jp:tabs', '{not json')
    expect(loadTabs()).toEqual([])
    sessionStorage.setItem('jp:tabs', '["about","nope","about"]')
    expect(loadTabs()).toEqual(['about'])
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    expect(loadTabs()).toEqual([])
    spy.mockRestore()
  })

  it('saveTabs swallows storage errors', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    expect(() => saveTabs(['home'])).not.toThrow()
    spy.mockRestore()
  })
})
