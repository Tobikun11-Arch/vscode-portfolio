export type FileId =
  | 'home'
  | 'about'
  | 'experience'
  | 'web-app'
  | 'mobile-app'
  | 'desktop-app'
  | 'contact'

export interface FileNode {
  kind: 'file'
  id: FileId
  name: string
  path: string
  ext: 'tsx' | 'md'
}

export interface FolderNode {
  kind: 'folder'
  name: string
  children: TreeNode[]
}

export type TreeNode = FileNode | FolderNode

export const EMPTY_PATH = '/~empty'

const file = (id: FileId, name: string, path: string): FileNode => ({
  kind: 'file',
  id,
  name,
  path,
  ext: name.endsWith('.md') ? 'md' : 'tsx',
})

export const FILE_TREE: FolderNode = {
  kind: 'folder',
  name: 'Joenel-Portfolio',
  children: [
    file('home', 'home.tsx', '/'),
    file('about', 'about.md', '/about'),
    file('experience', 'experience.md', '/experience'),
    {
      kind: 'folder',
      name: 'projects',
      children: [
        file('web-app', 'web-app.tsx', '/projects/web-app'),
        file('mobile-app', 'mobile-app.tsx', '/projects/mobile-app'),
        file('desktop-app', 'desktop-app.tsx', '/projects/desktop-app'),
      ],
    },
    file('contact', 'contact.md', '/contact'),
  ],
}

const flatten = (node: FolderNode): FileNode[] =>
  node.children.flatMap((child) => (child.kind === 'file' ? [child] : flatten(child)))

export const FILES: FileNode[] = flatten(FILE_TREE)

export function fileById(id: FileId): FileNode {
  const found = FILES.find((f) => f.id === id)
  if (!found) throw new Error(`Unknown file id: ${id}`)
  return found
}

function normalizePath(pathname: string): string {
  const trimmed = pathname.toLowerCase().replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

export function fileByPath(pathname: string): FileNode | undefined {
  const path = normalizePath(pathname)
  return FILES.find((f) => f.path === path)
}
