<div align="center">

# Joenel-Portfolio

**The portfolio of Joenel F. Sevellejo, Full Stack Developer from Cavite, Philippines,
built as a macOS-style desktop with a code-editor portfolio and a music app.**

[**Live site → seve-eosin.vercel.app**](https://seve-eosin.vercel.app)

<a href="docs/media/preview.webm">
  <img src="docs/media/preview.gif" alt="Preview: opening the editor from the dock, browsing about.md and experience.md, the Extensions and Run and Debug panels, then opening Music, playing Multo and minimizing it into the Dynamic Island" width="800">
</a>

<sub>Click the preview for the full-quality video.</sub>

</div>

---

## What's inside

The site opens on a desktop with an Ocean wallpaper and a macOS-style dock. From there:

### 🧑‍💻 Joenel-Portfolio (the editor)
A code-editor–style window where every page of the portfolio is a file.

- **Explorer:** `home.tsx`, `about.md`, `experience.md`, `projects/*` and `contact.md`, each with its own URL (`/about`, `/experience`, …).
- **Search** across every file, with clickable example searches.
- **Source Control** shows this repository's real commit history, live from GitHub.
- **Run and Debug** opens a working terminal. Try `help`, `whoami`, `projects`, `skills` or `resume`.
- **Extensions** shows my tech stack as installed extensions, with where I used each one.
- **Outline**, **Quick Open** (`Ctrl+P`), the **Command Palette** (`Ctrl+Shift+P`) and working back/forward buttons.
- **Settings:** color themes (Dark Modern, Light Modern, Monokai), wallpapers, sound effects and window reset.
- **Account** popup with links and a resume download.

### 🎵 Music
A music player built around **Joenel Playlist**, 20 Tagalog and English songs.

- Play, pause, next, previous, shuffle, repeat, seek and volume.
- Each song plays its official **30-second preview** and moves on to the next one automatically.
- Minimize or close Music while a song plays and it moves into a **Dynamic Island** at the top of the screen. Hover over it for full controls.

### 🖥️ Desktop
- **Dock** with magnification, launch bounce, running-app dots, resume download and GitHub link.
- Windows open and **minimize with a genie animation**, close like macOS, zoom with the green button, and can be **dragged** by their title bar.
- Works on phones: windows go full screen and the dock steps aside.

### 🔎 SEO
Per-page titles and descriptions, canonical URLs, Open Graph / Twitter cards, JSON-LD and a generated `sitemap.xml` and `robots.txt`.

## Tech stack

| | |
|---|---|
| **Framework** | React 19, TypeScript, Vite |
| **Routing** | React Router (every file has a real URL) |
| **Icons** | lucide-react |
| **Animation** | Web Animations API (genie, zoom, close) and CSS transitions |
| **Audio** | `HTMLAudioElement` streaming Apple's 30-second previews |
| **Testing** | Vitest + Testing Library |
| **Linting** | Oxlint |
| **Hosting** | Vercel |

No UI framework and no state library: app state lives in small `useSyncExternalStore` stores (`desktopStore`, `player`, `settings`).

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production (also writes `sitemap.xml` and `robots.txt`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with Oxlint |
| `npm test` | Run the tests with Vitest |

Set `SITE_URL` to your domain when building outside Vercel so canonical links and the sitemap point to it. On Vercel it's detected automatically.

## Project structure

```
src/
├── desktop/      # Desktop shell: dock, Dynamic Island, window manager (open / focus / drag / genie)
├── editor/       # Editor window: title bar, activity bar, panels, terminal, settings, themes
├── music/        # Music app: playlist data, audio player store, player UI
├── pages/        # Portfolio content: home, about, experience, projects, contact
├── tabs/         # Editor tabs kept in sync with the URL
├── search/       # Search index built from what each page renders
├── git/          # Commit history from the GitHub API
└── seo/          # Page metadata, sitemap and robots.txt
public/           # Profile photo, resume PDF, wallpapers, social preview image
docs/media/       # README preview (GIF + video)
```

## Customizing

- **Content:** edit the pages in `src/pages/` (`Experience.tsx`, `About.tsx`, `Contact.tsx`, …).
- **Resume:** replace `public/Joenel-Sevellejo-Resume.pdf`.
- **Playlist:** edit `src/music/tracks.ts`. Songs are looked up with the public iTunes Search API.
- **Default wallpaper and theme:** `DEFAULTS` in `src/editor/settings.ts`.

## Credits

- Song previews and artwork are streamed from Apple Music via the iTunes Search API. No audio files are stored in this repository. Each song links to the full track.
- Inspired by Visual Studio Code, macOS and Spotify. Not affiliated with Microsoft, Apple or Spotify.

## Contact

- **Email:** [joenelsevellejo831@gmail.com](mailto:joenelsevellejo831@gmail.com)
- **GitHub:** [@Tobikun11-Arch](https://github.com/Tobikun11-Arch)
- **LinkedIn:** [joenel-sevellejo](https://www.linkedin.com/in/joenel-sevellejo-2919a7259)
