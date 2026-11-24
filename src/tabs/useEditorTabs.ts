import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { EMPTY_PATH, fileById, fileByPath, type FileId } from '../files'
import { closeTab, loadTabs, openTab, saveTabs } from './tabsModel'

export type EditorStatus = 'file' | 'empty' | 'notFound'

export interface EditorTabs {
  tabs: FileId[]
  activeId: FileId | null
  status: EditorStatus
  open(id: FileId): void
  close(id: FileId): void
}

/** Keeps the open tabs in sync with the URL, which owns the active file. */
export function useEditorTabs(): EditorTabs {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const urlFile = fileByPath(pathname)
  const activeId = urlFile?.id ?? null
  const status: EditorStatus = urlFile
    ? 'file'
    : pathname.replace(/\/+$/, '') === EMPTY_PATH
      ? 'empty'
      : 'notFound'

  const [tabs, setTabs] = useState<FileId[]>(() => {
    const stored = loadTabs()
    return activeId ? openTab(stored, activeId) : stored
  })

  // Any navigation to a file (click, Back/Forward, deep link) opens its tab.
  // Adjusted during render (not in an effect) so the tab appears in the same paint.
  const [seenActiveId, setSeenActiveId] = useState(activeId)
  if (activeId !== seenActiveId) {
    setSeenActiveId(activeId)
    if (activeId) setTabs((current) => openTab(current, activeId))
  }

  useEffect(() => {
    saveTabs(tabs)
  }, [tabs])

  const open = useCallback(
    (id: FileId) => {
      if (id !== activeId) navigate(fileById(id).path)
    },
    [activeId, navigate],
  )

  const close = useCallback(
    (id: FileId) => {
      const { tabs: remaining, neighbor } = closeTab(tabs, id)
      setTabs(remaining)
      if (id === activeId) navigate(neighbor ? fileById(neighbor).path : EMPTY_PATH)
    },
    [tabs, activeId, navigate],
  )

  return { tabs, activeId, status, open, close }
}
