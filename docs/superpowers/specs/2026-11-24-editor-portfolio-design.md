# Editor-style portfolio: design

Date: 2026-11-24
Project: `personal/portfolio` (React 19 + Vite 8 + TypeScript)

## Intent and the why

Joenel's portfolio should feel like walking up to an old Windows XP PC that
has a code editor open. The Bliss wallpaper fills the screen, and a VS
Code-style editor window sits on top of it. Visitors explore the portfolio
by opening "files" in the editor's file explorer. The goal is nostalgia plus
a developer identity: the site itself shows that its owner writes code.

## Reference screenshots

These are the user's screenshots, in `2026-11-24-editor-portfolio-refs/`:

- `explorer-area.png`: a real VS Code window, dark theme, floating over
  the Bliss wallpaper. The user circled the explorer: that is where the
  Joenel-Portfolio tree goes.
- `main-area.png`: the same window, with the main editor area circled.
  That is the only region where page content appears. When nothing is open
  it shows a large, faint logo watermark in the middle, with three
  shortcut hints under it ("Show All Commands", "Go to File",
  "Find in Files").
- `old-nav-menu.png`: the user's previous site navigation (HOME, ABOUT,
  EXPERIENCE, PROJECTS with sub-items, CONTACT). The file tree replaces it.

Look to match: VS Code's default dark theme. Editor background about
`#1f1f1f`, sidebar/title bar about `#181818`, thin `#2b2b2b` borders, light
grey text, blue accent for the active item, compact 13px UI text. The
window has the normal modern VS Code chrome: slightly rounded window
corners and a soft shadow are fine. See "Old days" below for what has to
be flush.

## The "old days" requirement

The user said: "dont add space in corner since i want it look like theyre
experience the old days." In practice: the wallpaper (desktop) and the
editor (phone) reach every edge and corner of the browser viewport. There is
no page margin, padding, or rounded frame around the whole screen, so it
feels like looking at a real PC desktop. It does **not** ask for an
XP-style window frame. The editor window copies VS Code, per the
screenshots.

## Goals

- `/` shows the wallpaper with the editor window open on top.
- The editor's explorer (left sidebar) shows one root folder,
  **Joenel-Portfolio**, with this tree:

  ```
  Joenel-Portfolio
  ├─ home
  ├─ about
  ├─ experience
  ├─ projects/          (folder: expands/collapses, has no page of its own)
  │   ├─ web app
  │   ├─ mobile app
  │   └─ desktop app
  └─ contact
  ```

- Clicking a file opens it as a **real page** (styled content: photo,
  text, project screenshots) rendered **only inside the editor's main
  area**: the region right of the sidebar and below the title bar. The
  title bar, activity bar, sidebar and wallpaper stay visible around it. The
  page scrolls inside that area; the browser page itself never scrolls.
- Each file has its own URL (decided: option A):

  | File | URL |
  |---|---|
  | home | `/` |
  | about | `/about` |
  | experience | `/experience` |
  | projects/web app | `/projects/web-app` |
  | projects/mobile app | `/projects/mobile-app` |
  | projects/desktop app | `/projects/desktop-app` |
  | contact | `/contact` |

  Switching files is instant client-side navigation (no reload, no flash).
  Back/forward work, refresh keeps the same file open, and links can be
  shared.
- Works from phone to large desktop.

## Non-goals

- No real code editing, terminal, search, or git features. Menus and most
  activity-bar icons are decorative.
- No CMS or backend. Content lives in the repo.
- No light theme for the editor: it is always dark, like the reference.

## Anti-goals (failure even if it "works")

- Any visible loading/flash when switching files.
- Page content spilling outside the editor's main area on desktop.
- Spacing, margins or rounded gutters at the screen edges or corners. The
  wallpaper (desktop) or the editor (phone) is flush to every edge (see
  "The 'old days' requirement").
- Using Microsoft's VS Code logo or the name "Visual Studio Code". The look
  and layout are imitated, the branding is not.

## Constraints

- Existing setup: the Bliss wallpaper is already a fixed full-screen layer
  (`src/App.css`, `public/bliss-910.jpg` for phones,
  `public/bliss-1200.jpg` for ≥768px). Keep it.
- Hosting (builder's call): the site is served from the **domain root**
  on a host that supports SPA rewrites (Vercel or Netlify), so `/about`
  etc. load `index.html` on refresh. Add the rewrite config file
  (`vercel.json`) now. Vite's dev server already does this. If the user
  later picks GitHub Pages at a subpath, add a router `basename`, Vite
  `base`, and a 404.html fallback.

## Approaches considered

1. **Each file has its own URL via React Router (chosen).** Shareable
   links, a working back button, refresh keeps the file open. Costs one
   small dependency. The user worried this would mean a loading screen per
   file; it doesn't, since routing is client-side and the swap is instant.
2. **Everything on `/`, file switching in React state only.** Slightly
   simpler, but no shareable links, refresh resets to home, and back leaves
   the site. Rejected: a portfolio gets shared.

## Layout

### Desktop and tablet (≥768px wide)

```
┌─────────────────────── wallpaper (flush to edges) ───────────────────────┐
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────────┐   │
│   │ [logo] File Edit Selection View Go   ← →  [ Joenel-Portfolio ] _ □ × │
│   ├──┬──────────────┬────────────────────────────────────────────────┤   │
│   │▣ │ EXPLORER     │ [home ×][about ×]                    (tabs)    │   │
│   │⌕ │ ▾ JOENEL-    │                                                │   │
│   │⑂ │   PORTFOLIO  │      Page content for the active file,         │   │
│   │  │   home       │      scrolling inside this area only           │   │
│   │  │   about      │                                                │   │
│   │  │   experience │                                                │   │
│   │  │ ▾ projects   │                                                │   │
│   │  │     web app  │                                                │   │
│   │  │     ...      │                                                │   │
│   │⚙ │   contact    │                                                │   │
│   ├──┴──────────────┴────────────────────────────────────────────────┤   │
│   │ status bar                                                       │   │
│   └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

- The window is centered over the wallpaper, at roughly
  `min(1200px, 90vw)` × `min(760px, 85vh)`.
- Window parts: title bar (own small logo, decorative menu words, search-box
  look showing "Joenel-Portfolio", window buttons), activity bar (icons),
  explorer sidebar, tab bar, main area, status bar.

### Phone (<768px)

- The editor fills the whole screen edge to edge; the window frame and the
  wallpaper margins go away.
- The sidebar is hidden. A ☰ button in the top bar slides the explorer in
  as a drawer over the main area. Choosing a file closes the drawer.
- The main area takes all the remaining space and scrolls inside itself.
- (Builder's call) From top to bottom, phones show: a slim top bar (☰, the
  logo, "Joenel-Portfolio"), the tab bar (scrolls sideways if it gets
  crowded), then the main area. Hidden on phones: the activity bar, the
  menu words, the window buttons and the status bar. With no window
  buttons, close/minimize and the desktop shortcut don't exist on phones.

## Behavior

- **Tabs:** opening a file adds a tab (or focuses its existing tab). Tabs
  can be closed with ×. Closing the last tab shows an empty-editor screen
  (own logo watermark plus short hints, like `main-area.png`).
- **Tabs and the URL (builder's call):**
  - The URL is the single source of truth for the **active** file.
  - Whenever the URL points at a file (a click, Back/Forward, a deep link
    or a refresh), that file's tab opens if needed and becomes active. So
    Back to a file whose tab was closed reopens the tab.
  - The list of open tabs is kept in `sessionStorage`, so it survives a
    refresh within the same browser tab. A fresh visit starts with just
    the URL's file.
  - Closing the active tab navigates to its neighbor with a normal history
    push, so Back returns to the closed file and reopens it.
  - Closing the last tab shows the empty-editor screen at `/~empty` (a
    "no file open" state). Refreshing there keeps it empty.
- **Explorer:** the active file is highlighted. `projects` starts expanded
  and toggles on click. Keyboard: tree items are focusable and Enter opens.
- **Unknown URL:** shows a "file not found" page inside the main area.
- **Images:** kept small. Images of other pages are preloaded in the
  background after first load, so first opens are instant.

## Content

The user will supply their real photo, bio, experience and projects later.
Until then each page uses clearly marked placeholder text and images.

## Decided by the user

- Editor window over the Bliss wallpaper on `/`.
- Root folder name **Joenel-Portfolio** and the file tree above.
- Files open as real pages, only inside the editor's main area.
- Per-file URLs (option A).
- Phone: full-screen editor with a ☰ file drawer.
- No Microsoft logo or product name.
- Nothing flush-breaking: no spacing at screen edges or corners.

## Builder's calls (made by Claude, open to correction)

- **File names with extensions** to feel real: `home.tsx`, `about.md`,
  `experience.md`, `contact.md`, and `web-app.tsx`, `mobile-app.tsx`,
  `desktop-app.tsx` inside `projects/`, each with a matching file-type
  icon. Tab labels use the same names.
- **Window buttons:** maximize toggles the window to fill the screen.
  Close and minimize hide the window and leave a "Joenel-Portfolio"
  desktop shortcut icon in the top-left of the wallpaper; double-click (or
  tap on touch) reopens it. Explorer-icon click in the activity bar toggles
  the sidebar on desktop. Other icons and menus are decorative.
- **Status bar:** a thin bar at the bottom showing the current file's path
  and a few decorative items (branch name, line/column).
- **Libraries:** `react-router` (v7, declarative mode) for URLs and
  `lucide-react` for icons. Plain CSS, no UI kit.
- **Tablet:** treated as desktop (floating window) from 768px.
- **Fonts:** system UI font for editor chrome; a monospace stack for
  file names and code-like accents.

## Left to the builder

- Exact colors, spacing and sizes inside the editor (match the dark look
  of the reference screenshots).
- Visual design of each page's placeholder content.
- Animation details for the drawer, tabs and window open/close.
- How the tab list is held in state.
