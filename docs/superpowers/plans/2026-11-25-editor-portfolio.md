# Editor-Style Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/` into a VS Code-style editor window over the Bliss wallpaper. The explorer shows a `Joenel-Portfolio` file tree, and each file opens as a real page inside the editor's main area, at its own URL.

**Architecture:**
- One catch-all route renders `EditorWindow`, which reads the URL to decide the active file.
- A pure tab model (open/close/neighbor) is persisted to `sessionStorage` and synced with the URL by one hook.
- Pages are plain React components registered by file id.
- Layout is CSS only: a floating window at ≥768px, and a full-screen editor with a drawer below that.

**Tech Stack:**
- React 19, TypeScript, Vite 8.
- `react-router` 8.x in declarative mode (`BrowserRouter`, `useLocation`, `useNavigate`; `MemoryRouter` in tests). The spec says v7, but v8 is current and keeps the same declarative API.
- `lucide-react` for icons. Plain CSS.
- Tests: Vitest 5, jsdom, Testing Library (`react`, `user-event`, `jest-dom`).

**Spec:** `docs/superpowers/specs/2026-11-24-editor-portfolio-design.md`. The reference screenshots are in `docs/superpowers/specs/2026-11-24-editor-portfolio-refs/`.

## Global Constraints

- Root folder label: `Joenel-Portfolio`. The explorer shows it uppercase as `JOENEL-PORTFOLIO`.
- File tree, names and URLs (exact):

  | id | name | URL |
  |---|---|---|
  | `home` | `home.tsx` | `/` |
  | `about` | `about.md` | `/about` |
  | `experience` | `experience.md` | `/experience` |
  | `web-app` | `projects/web-app.tsx` | `/projects/web-app` |
  | `mobile-app` | `projects/mobile-app.tsx` | `/projects/mobile-app` |
  | `desktop-app` | `projects/desktop-app.tsx` | `/projects/desktop-app` |
  | `contact` | `contact.md` | `/contact` |

  Explorer order: home, about, experience, projects/ (web-app, mobile-app, desktop-app), contact. `projects` starts expanded.
- Empty-editor URL: `/~empty`.
- Page content renders only inside the editor main area, which scrolls by itself. `html`/`body` never scroll (`overflow: hidden` on body).
- No margin, padding or rounded frame at the viewport edges. On desktop the wallpaper is flush; on phones the editor is flush.
- No Microsoft VS Code logo, and never the text "Visual Studio Code". Use our own `Logo` component.
- Breakpoint: phone is `max-width: 767px`; desktop/tablet is `min-width: 768px`.
- Desktop window size: `width: min(1200px, 90vw); height: min(760px, 85vh)`, centered.
- Colors: editor `#1f1f1f`, sidebar/title/tab bar `#181818`, borders `#2b2b2b`, text `#cccccc`, accent `#0078d4`. UI text is 13px system font; file names use a monospace stack.
- Empty-editor hints (exact copy): `Show All Commands  Ctrl+Shift+P`, `Go to File  Ctrl+P`, `Find in Files  Ctrl+Shift+F`.
- Title bar menu words (decorative): `File Edit Selection View Go`.
- Tabs `sessionStorage` key: `jp:tabs`.
- Keep the existing wallpaper: the `.wallpaper` layer in `src/App.css` and `public/bliss-910.jpg` / `public/bliss-1200.jpg`.
- Switching files must never reload the page or flash.

## Review Focus

1. **Trailing slash or different case in the URL** (`/About/`, `/projects/web-app/`): the matching file should open, not "not found". Test: `files.test.ts › resolves trailing slash and case`.
2. **A URL that isn't a file** (`/projects`, `/foo`): the main area shows the not-found page, no bogus tab is added, and the existing tabs stay. Test: `EditorWindow.test.tsx › unknown url shows not found without adding a tab`.
3. **Bad or unavailable `sessionStorage`** (invalid JSON, unknown ids, `getItem` throws in private mode): load falls back to the URL's file alone and never crashes. Test: `tabsModel.test.ts › loadTabs tolerates bad storage`.
4. **Back after closing a tab**: the closed file reopens as a tab and becomes active. Test: `useEditorTabs.test.tsx › back reopens closed tab`.
5. **Phone drawer left open**: choosing a file closes the drawer, and so does a URL change from Back. Test: `EditorWindow.test.tsx › drawer closes on navigation`.

---

## File Structure

```
src/
  files.ts                  file tree data + URL resolution
  files.test.ts
  tabs/tabsModel.ts         pure tab operations + sessionStorage load/save
  tabs/tabsModel.test.ts
  tabs/useEditorTabs.ts     hook: syncs tabs with URL, exposes open/close
  tabs/useEditorTabs.test.tsx
  pages/registry.ts         FileId -> page component; PAGE_IMAGES
  pages/Home.tsx About.tsx Experience.tsx Contact.tsx
  pages/projects/WebApp.tsx MobileApp.tsx DesktopApp.tsx
  pages/NotFound.tsx
  pages/pages.css           shared page styles (placeholder look)
  editor/EditorWindow.tsx   layout + window/drawer/sidebar state
  editor/EditorWindow.test.tsx
  editor/TitleBar.tsx ActivityBar.tsx Explorer.tsx TabBar.tsx
  editor/EditorArea.tsx EmptyEditor.tsx StatusBar.tsx
  editor/DesktopShortcut.tsx Logo.tsx FileIcon.tsx
  editor/editor.css
  preload.ts                preloadImages()
  test/setup.ts             jest-dom + sessionStorage reset
  App.tsx App.css main.tsx  (modify)
public/placeholders/*.svg   small placeholder images
vercel.json
vitest.config.ts
```

---

### Task 1: Tooling, git, and the file model

**Files:**
- Create: `vitest.config.ts`, `src/test/setup.ts`, `src/files.ts`, `src/files.test.ts`
- Modify: `package.json` (deps and the `test` script). Tests import `describe/it/expect/vi` from `vitest` explicitly; no globals and no tsconfig change.

**Interfaces:**
- Produces:
  - `type FileId = 'home'|'about'|'experience'|'web-app'|'mobile-app'|'desktop-app'|'contact'`
  - `interface FileNode { kind: 'file'; id: FileId; name: string; path: string; ext: 'tsx'|'md' }`
  - `interface FolderNode { kind: 'folder'; name: string; children: TreeNode[] }`
  - `type TreeNode = FileNode | FolderNode`
  - `const FILE_TREE: FolderNode` (root `name: 'Joenel-Portfolio'`)
  - `const FILES: FileNode[]` (flat, in explorer order)
  - `const EMPTY_PATH = '/~empty'`
  - `fileById(id: FileId): FileNode`
  - `fileByPath(pathname: string): FileNode | undefined`

- [ ] **Step 1: Initialize git and install dependencies**

Run:
```
git init
npm i react-router@^8.5.2 lucide-react@^1.79.0
npm i -D vitest@^5.1.1 jsdom@^31.0.1 @testing-library/react@^16.3.3 @testing-library/dom@^10 @testing-library/user-event@^14.6.13 @testing-library/jest-dom@^8.0.0
```
Add `"test": "vitest run"` to the scripts. Write `vitest.config.ts` (jsdom environment, `setupFiles: ['src/test/setup.ts']`, react plugin). `setup.ts` imports `@testing-library/jest-dom/vitest` and runs `sessionStorage.clear()` plus RTL `cleanup()` in `afterEach`. Make sure `.gitignore` covers `node_modules` and `dist`. Expected: install succeeds with no peer-dependency errors.

- [ ] **Step 2: Write failing tests in `src/files.test.ts`**

```ts
it('lists files in explorer order', () => {
  expect(FILES.map(f => f.id)).toEqual(
    ['home','about','experience','web-app','mobile-app','desktop-app','contact'])
})
it('names and paths match the spec', () => {
  expect(fileById('about')).toMatchObject({ name: 'about.md', path: '/about' })
  expect(fileById('web-app')).toMatchObject({ name: 'web-app.tsx', path: '/projects/web-app' })
  expect(fileById('home').path).toBe('/')
})
it('root folder is Joenel-Portfolio with a projects folder', () => {
  expect(FILE_TREE.name).toBe('Joenel-Portfolio')
  const projects = FILE_TREE.children.find(n => n.kind === 'folder')
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
```

- [ ] **Step 3: Run `npm test`. Expected: FAIL (module not found).**

- [ ] **Step 4: Implement `src/files.ts`.** `FILES` is derived by walking `FILE_TREE` depth-first. `fileByPath` lowercases the path and strips trailing slashes, except that `/` stays `/`.

- [ ] **Step 5: Run `npm test`. Expected: PASS.**

- [ ] **Step 6: Commit** the existing scaffold plus this task: `git add -A && git commit -m "chore: test tooling, routing deps, file model"`.

---

### Task 2: Tab model and storage

**Files:**
- Create: `src/tabs/tabsModel.ts`, `src/tabs/tabsModel.test.ts`

**Interfaces:**
- Consumes: `FileId`, `FILES` (Task 1)
- Produces:
  - `openTab(tabs: FileId[], id: FileId): FileId[]` adds `id` at the end if it is absent and returns the same array reference if it is present.
  - `closeTab(tabs: FileId[], id: FileId): { tabs: FileId[]; neighbor: FileId | null }`. `neighbor` is the tab to the right of the closed one, else the one to its left, else `null`.
  - `loadTabs(): FileId[]` reads `sessionStorage['jp:tabs']`, drops unknown ids and duplicates, and returns `[]` on any error.
  - `saveTabs(tabs: FileId[]): void` swallows storage errors.

- [ ] **Step 1: Write failing tests**

```ts
it('openTab appends once', () => {
  expect(openTab(['home'], 'about')).toEqual(['home','about'])
  const t: FileId[] = ['home']; expect(openTab(t, 'home')).toBe(t)
})
it('closeTab picks right neighbor, then left, then null', () => {
  expect(closeTab(['home','about','contact'], 'about')).toEqual({ tabs: ['home','contact'], neighbor: 'contact' })
  expect(closeTab(['home','about'], 'about')).toEqual({ tabs: ['home'], neighbor: 'home' })
  expect(closeTab(['home'], 'home')).toEqual({ tabs: [], neighbor: null })
})
it('save/load round-trips', () => {
  saveTabs(['about','home']); expect(loadTabs()).toEqual(['about','home'])
})
it('loadTabs tolerates bad storage', () => {
  sessionStorage.setItem('jp:tabs', '{not json'); expect(loadTabs()).toEqual([])
  sessionStorage.setItem('jp:tabs', '["about","nope","about"]'); expect(loadTabs()).toEqual(['about'])
  const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied') })
  expect(loadTabs()).toEqual([]); spy.mockRestore()
})
```

- [ ] **Step 2: Run `npm test`. Expected: FAIL.**
- [ ] **Step 3: Implement `tabsModel.ts`.**
- [ ] **Step 4: Run `npm test`. Expected: PASS.**
- [ ] **Step 5: Commit** `feat: tab model with session storage`.

---

### Task 3: URL ↔ tabs hook

**Files:**
- Create: `src/tabs/useEditorTabs.ts`, `src/tabs/useEditorTabs.test.tsx`

**Interfaces:**
- Consumes: Task 1 (`fileByPath`, `fileById`, `EMPTY_PATH`), Task 2 (`openTab`, `closeTab`, `loadTabs`, `saveTabs`)
- Produces: `useEditorTabs(): { tabs: FileId[]; activeId: FileId | null; status: 'file' | 'empty' | 'notFound'; open(id: FileId): void; close(id: FileId): void }`
  - The URL is the source of truth for the active file. Initial tabs are `loadTabs()`, then the URL's file is opened.
  - On every location change: if the URL resolves to a file, open its tab (`status: 'file'`). If the path is `/~empty`, use `status: 'empty'` and `activeId: null`. Otherwise use `status: 'notFound'`, `activeId: null`, and leave the tabs unchanged.
  - `open(id)` calls `navigate(fileById(id).path)` (a push) and does nothing if `id` is already active.
  - `close(id)` removes the tab. If `id` was active, it navigates (push) to the neighbor's path, or to `/~empty` when no tabs are left.
  - Tabs are saved with `saveTabs` whenever they change.

- [ ] **Step 1: Write failing tests.** Use a test harness component inside `MemoryRouter` that renders `tabs.join(',')`, `activeId`, `status` and the current `location.pathname`, plus buttons that call `open` and `close`.

```tsx
it('deep link opens its tab', ...)            // initialEntries ['/about'] -> tabs 'about', active 'about'
it('restores stored tabs and adds url file', ...) // saveTabs(['home','contact']); entry '/about' -> 'home,contact,about'
it('open pushes the file url', ...)           // click open('contact') -> pathname '/contact', tabs include contact
it('closing active tab navigates to neighbor', ...) // tabs home,about active about; close('about') -> pathname '/', active home
it('back reopens closed tab', ...)            // then history back (navigate(-1) button) -> pathname '/about', tabs include about, active about
it('closing last tab goes to /~empty', ...)   // only home; close('home') -> pathname '/~empty', status 'empty', tabs ''
it('unknown url keeps tabs, status notFound', ...) // saveTabs(['home']); entry '/foo' -> tabs 'home', status 'notFound', active null
```

Each test asserts the exact strings shown in the comments.

- [ ] **Step 2: Run `npm test`. Expected: FAIL.**
- [ ] **Step 3: Implement `useEditorTabs.ts`.** Hold tabs in `useState(() => openTab(loadTabs(), urlFileId))`. Use an effect keyed on `location.pathname` to open the URL's file. Use an effect on `tabs` to call `saveTabs`.
- [ ] **Step 4: Run `npm test`. Expected: PASS.**
- [ ] **Step 5: Commit** `feat: sync editor tabs with url`.

---

### Task 4: Pages, placeholders, and the main area

**Files:**
- Create: `src/pages/registry.ts`, the page components listed in File Structure, `src/pages/pages.css`, `public/placeholders/portrait.svg`, `public/placeholders/web-app.svg`, `public/placeholders/mobile-app.svg`, `public/placeholders/desktop-app.svg`, `src/preload.ts`, `src/editor/EditorArea.tsx`, `src/editor/EmptyEditor.tsx`, `src/editor/Logo.tsx`
- Test: `src/editor/EditorArea.test.tsx`

**Interfaces:**
- Consumes: `FileId` (Task 1); `status` and `activeId` from Task 3
- Produces:
  - `PAGES: Record<FileId, ComponentType>`
  - `PAGE_IMAGES: string[]` (every `/placeholders/*.svg` path)
  - `preloadImages(urls: string[]): void`, which creates `new Image()` per URL
  - `EditorArea({ status, activeId }: { status: 'file'|'empty'|'notFound'; activeId: FileId | null })`
  - `EmptyEditor()`
  - `Logo({ size }: { size?: number })`, our own mark: a rounded square with `J` and `</>` styling, drawn as inline SVG
  - `NotFound()`

Each page shows an `<h1>` and a visible `Placeholder` badge with short placeholder copy:
- Home: name and title, plus links to the other files using react-router `Link`.
- About: the portrait image and bio.
- Experience: a list of three roles.
- Each project page: a screenshot, a description, and a tech list.
- Contact: email and social links as placeholders.

Each image has `width`/`height` attributes to prevent layout shift. The placeholder SVGs are each under 2 KB, use flat shapes and contain the text "Placeholder".

- [ ] **Step 1: Write failing tests**

```tsx
it('renders the active page heading', ...)    // status 'file', activeId 'about' -> heading /about/i
it('renders every registered page', ...)      // loop all FileIds: render inside MemoryRouter, expect a level-1 heading
it('empty state shows the three hints', ...)  // status 'empty' -> 'Show All Commands', 'Go to File', 'Find in Files'
it('not found state', ...)                    // status 'notFound' -> text /file not found/i
it('never renders the VS Code name', ...)     // container.textContent not to contain 'Visual Studio Code' in any state
```

- [ ] **Step 2: Run `npm test`. Expected: FAIL.**
- [ ] **Step 3: Implement the pages, registry, `EditorArea`, `EmptyEditor`, `Logo`, `NotFound` and `preload.ts`.** `EditorArea` is the scroll container: `overflow: auto; height: 100%`.
- [ ] **Step 4: Run `npm test`. Expected: PASS.**
- [ ] **Step 5: Commit** `feat: portfolio pages and editor main area`.

---

### Task 5: Editor window chrome on desktop

**Files:**
- Create: `src/editor/EditorWindow.tsx`, `src/editor/EditorWindow.test.tsx`, `src/editor/TitleBar.tsx`, `src/editor/ActivityBar.tsx`, `src/editor/Explorer.tsx`, `src/editor/TabBar.tsx`, `src/editor/StatusBar.tsx`, `src/editor/FileIcon.tsx`, `src/editor/editor.css`
- Modify:
  - `src/App.tsx`: keep the wallpaper div, and render `<Routes><Route path="*" element={<EditorWindow/>}/></Routes>`.
  - `src/main.tsx`: wrap the app in `BrowserRouter`.
  - `src/index.css`: `html, body, #root { height: 100%; overflow: hidden }`.
  - `src/App.css`: remove `.page`.

**Interfaces:**
- Consumes: `useEditorTabs` (Task 3), `EditorArea`, `Logo`, `preloadImages`, `PAGE_IMAGES` (Task 4), `FILE_TREE`, `fileById` (Task 1)
- Produces:
  - `EditorWindow()`, which owns `sidebarOpen: boolean` (desktop, default `true`). Later tasks add window and drawer state here.
  - `Explorer({ activeId, onOpen }: { activeId: FileId | null; onOpen(id: FileId): void })`. It renders a `role="tree"`, with `role="treeitem"` for files and the folder. The folder toggles its `aria-expanded`. Enter or click on a file calls `onOpen`. The active file has `aria-selected="true"`.
  - `TabBar({ tabs, activeId, onSelect, onClose })`. It renders a `role="tablist"`; each tab has `role="tab"`, a label equal to the file `name`, and a close button labeled `Close <name>`.
  - `TitleBar({ onToggleDrawer, onMinimize, onMaximize, onClose, maximized })`. It shows the Logo, the menu words, and a center box with the text `Joenel-Portfolio`. Its buttons are labeled `Minimize`, `Maximize` (`Restore` when maximized) and `Close`, plus `Open explorer` for ☰, which only shows on phones via CSS.
  - `ActivityBar({ onToggleExplorer })`. The first icon, labeled `Explorer`, calls the callback. The others (search, source control, extensions, settings) are decorative `aria-hidden` icons.
  - `StatusBar({ activeId })` shows the branch `main`, the path `Joenel-Portfolio/<name>` (or nothing when no file is active) and `Ln 1, Col 1`.
  - `EditorWindow` calls `preloadImages(PAGE_IMAGES)` once on mount.

The CSS follows Global Constraints:
- The window is a grid of title bar / (activity bar | sidebar 240px | tabs + main area) / status bar.
- `border-radius: 8px` and a soft shadow on the window only.
- The status bar is `#0078d4` with white text.

- [ ] **Step 1: Write failing tests** (render `<App/>` inside `MemoryRouter`).

```tsx
it('shows the explorer root and all files', ...)  // 'JOENEL-PORTFOLIO'; treeitems include every FILES name
it('clicking a file opens it in a tab and main area', ...) // click 'about.md' -> tab 'about.md' selected, heading /about/i
it('active file is highlighted', ...)             // treeitem 'about.md' aria-selected true after click
it('projects folder toggles', ...)                // click 'projects' -> 'web-app.tsx' not in document; click again -> back
it('Enter on a focused file opens it', ...)       // focus 'contact.md', keyboard Enter -> heading /contact/i
it('closing a tab with its x', ...)               // open about, click 'Close about.md' -> tab gone, home heading shown
it('Explorer icon toggles the sidebar', ...)      // click 'Explorer' -> tree not in document; click again -> back
it('unknown url shows not found without adding a tab', ...) // no stored tabs, entry '/foo' -> /file not found/i, queryAllByRole('tab') length 0; with saveTabs(['about']) -> exactly one tab 'about.md', not selected
```

- [ ] **Step 2: Run `npm test`. Expected: FAIL.**
- [ ] **Step 3: Implement the components and CSS.**
- [ ] **Step 4: Run `npm test`, then `npm run build`. Expected: both PASS.**
- [ ] **Step 5: Visual check.** Start the preview (`portfolio-dev` in `personal/.claude/launch.json`) at a 1440×900 viewport:
  - The window is centered on Bliss, and the wallpaper is flush to every edge.
  - Clicking files switches them with no reload. Network shows no document request.
  - A long page scrolls inside the main area only.
- [ ] **Step 6: Commit** `feat: editor window chrome, explorer, tabs`.

---

### Task 6: Window buttons and desktop shortcut

**Files:**
- Create: `src/editor/DesktopShortcut.tsx`
- Modify: `src/editor/EditorWindow.tsx`, `src/editor/editor.css`
- Test: `src/editor/EditorWindow.test.tsx` (add cases)

**Interfaces:**
- Consumes: `TitleBar` callbacks (Task 5)
- Produces:
  - `EditorWindow` state `windowState: 'normal' | 'maximized' | 'hidden'`.
  - `DesktopShortcut({ onOpen }: { onOpen(): void })`: a button labeled `Joenel-Portfolio`, positioned top-left of the wallpaper with a folder icon and white text with a shadow. It reopens on double-click, or on Enter when focused.

Behavior:
- Maximize toggles `normal` ↔ `maximized`. Maximized fills the viewport with no radius and no shadow.
- Minimize and Close both set `hidden`. That hides the window and shows `DesktopShortcut`.
- Reopening returns to `normal` with the same URL and tabs.

- [ ] **Step 1: Write failing tests**

```tsx
it('maximize toggles to restore', ...)   // click 'Maximize' -> button 'Restore' exists; click -> 'Maximize'
it('close hides window and shows shortcut', ...) // click 'Close' -> no tree; button 'Joenel-Portfolio' present
it('minimize hides window too', ...)
it('double-click shortcut reopens with same file', ...) // at '/about': close, dblClick shortcut -> heading /about/i, tab 'about.md'
```

- [ ] **Step 2: Run `npm test`. Expected: FAIL.**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run `npm test`. Expected: PASS.**
- [ ] **Step 5: Commit** `feat: window buttons and desktop shortcut`.

---

### Task 7: Phone layout and explorer drawer

**Files:**
- Modify: `src/editor/EditorWindow.tsx`, `src/editor/TitleBar.tsx`, `src/editor/editor.css`
- Test: `src/editor/EditorWindow.test.tsx` (add cases)

**Interfaces:**
- Consumes: `TitleBar`'s `onToggleDrawer` (Task 5)
- Produces: `EditorWindow` state `drawerOpen: boolean`, default `false`. When the drawer is open, the explorer gets class `is-drawer-open`, and a backdrop button labeled `Close explorer` appears.

Behavior:
- ☰ (`Open explorer`) opens the drawer.
- Choosing a file, tapping the backdrop, or any `location.pathname` change closes it.

CSS at `max-width: 767px`:
- The window is `position: fixed; inset: 0` with no radius or shadow.
- Hidden: the activity bar, menu words, window buttons and status bar.
- Shown: the ☰ button.
- The sidebar becomes an off-canvas drawer (`transform: translateX(-100%)`, and `0` when open) over the main area.
- The tab bar gets `overflow-x: auto`.
- `DesktopShortcut` never appears, because window buttons aren't reachable.

- [ ] **Step 1: Write failing tests**

```tsx
it('hamburger opens the drawer', ...)    // click 'Open explorer' -> explorer has class is-drawer-open
it('drawer closes on navigation', ...)   // open drawer, click 'about.md' -> class removed; open again, navigate via Back -> removed
it('backdrop closes the drawer', ...)    // click 'Close explorer' -> removed
```

- [ ] **Step 2: Run `npm test`. Expected: FAIL.**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run `npm test`. Expected: PASS.**
- [ ] **Step 5: Visual check** at 375×812 (mobile preset):
  - The editor is flush to all four edges, with no gaps.
  - The top bar shows ☰ and `Joenel-Portfolio`.
  - The drawer slides in and choosing a file closes it.
  - Long content scrolls inside the main area only.
  - Then check at 768×1024: it should show the floating window.
- [ ] **Step 6: Commit** `feat: phone layout with explorer drawer`.

---

### Task 8: Hosting config and final verification

**Files:**
- Create: `vercel.json` containing `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
- Modify: `index.html`: set `<title>Joenel-Portfolio</title>`, and `<body style>` only if it's needed for the dark fallback.

- [ ] **Step 1: Run `npm test`, `npm run lint` and `npm run build`.** Expected: all pass with 0 errors.
- [ ] **Step 2: Production check.** Run `npm run preview`. In the browser pane:
  - Load `/projects/mobile-app` directly and refresh. The same file and tabs remain.
  - Back and Forward move between files.
  - Close every tab, go to `/~empty` and refresh. It stays empty.
- [ ] **Step 3: Screenshot** desktop 1440×900 and phone 375×812 for the user.
- [ ] **Step 4: Commit** `chore: vercel rewrites, title`.
