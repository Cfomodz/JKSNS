# JSOS Portfolio — Handoff Guide

This is an OS-style portfolio built with Next.js. If you want to fork it and make it your own, here's what to change.

---

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

---

## What to Personalize

### 0. Projects and Competitions (start here)

Projects, competition results, and the bio live in one place, `src/lib/portfolio/`.
The About app, the terminal filesystem, the desktop folders, page routes, the
sitemap, and structured data all read from it.

| File | What to change |
|------|---------------|
| `src/lib/portfolio/projects.ts` | Projects (name, blurb, highlights, links) and earlier work |
| `src/lib/portfolio/competitions.ts` | Seasons, results, and the event series each result belongs to |
| `src/lib/portfolio/profile.ts` | Overview paragraphs and focus areas |
| `public/readmes/<event>.md` | Hand-written event write-ups (everything above `## Results by season`) |

After editing the data, regenerate the markdown it produces:

```bash
npm run content:sync
```

That rewrites the season results (`comp-*.md`), project pages, `earlier-work.md`,
and the `## Results by season` table in each event write-up. `npm run test:run`
fails while any of them is out of date.

### 1. Your Identity

| File | What to change |
|------|---------------|
| `src/features/os/desktop/AboutSystemModal.tsx` | Name, version, kernel name |
| `src/features/apps/about/ProfileSidebar.tsx` | Name, title, avatar image, social links |
| `src/features/apps/about/TabContent.tsx` | Layout of the About tabs and the System Manual text |
| `src/features/apps/terminal/TerminalApp.tsx` | Welcome banner version string |
| `src/lib/seo/metadata.ts` | Site title, description, OpenGraph tags |
| `src/lib/seo/entity.ts` | Structured data (name, job title, location, employer, education, URLs) |
| `app/layout.tsx` | Favicon paths, metadata |

### 2. Desktop Folders & Files

| File | What to change |
|------|---------------|
| `src/features/os/filesystem/files.ts` | Folder layout; contents are built from `src/lib/portfolio/` |
| `src/features/os/desktop/useDesktop.ts` | Desktop icons (Projects, Competitions, Blog, Resume) |
| `src/features/apps/terminal/use-terminal-state.ts` | Terminal filesystem layout; contents come from `src/lib/portfolio/` |
| `public/readmes/*.md` | Markdown opened from the desktop folders (see section 0 for which are generated) |

### 3. Dock & Apps

| File | What to change |
|------|---------------|
| `src/features/os/desktop/dock/dock-config.tsx` | Which apps appear in the dock, icons, order |
| `src/features/os/store/types.ts` | `AppID` enum — add/remove app identifiers |
| `src/features/os/window/app-registry.tsx` | Maps AppIDs to React components |

### 4. Wallpapers

| File | What to change |
|------|---------------|
| `public/assets/wallpapers/` | Drop in your own .jpg files |
| `src/features/os/desktop/wallpapers.ts` | Register them with names and dominant colors |
| `src/features/os/store/system-store.ts` | Default wallpaper path |

### 5. System Manual (FAQ)

The System Manual tab, including the privacy policy and terms of use, is inline in
`src/features/apps/about/TabContent.tsx` (`ManualPanel`).

### 6. Terminal Commands

All commands live in `src/features/apps/terminal/use-terminal-state.ts` in the `COMMAND_REGISTRY` object. Add, remove, or modify any command there.

Games are separate components:
- `src/features/apps/terminal/SnakeGame.tsx`
- `src/features/apps/terminal/TetrisGame.tsx`
- `src/features/apps/terminal/Game2048.tsx`

### 7. Favicon

Replace `public/favicon.ico` and `public/assets/web_assets/favicon.ico` with your own. The PNG icons in
`public/assets/web_assets/` (`favicon-96x96.png`, `apple-touch-icon.png`, and the two
`web-app-manifest-*.png` files used by `public/manifest.json`) are crops of the profile photo;
regenerate them at the same sizes if you change it.

### 8. Boot Animation

| File | What to change |
|------|---------------|
| `src/features/os/boot/constants.ts` | Boot duration, logo |
| `src/features/os/boot/BootScreen.tsx` | Boot screen appearance |
| `src/features/os/boot/WelcomeOverlay.tsx` | Post-boot welcome screen |

---

## Architecture at a Glance

```
src/
  features/
    apps/           # Each app is a self-contained folder
      about/        # About Me app (profile sidebar + tabs)
      terminal/     # Terminal emulator with VFS, games, easter eggs
      settings/     # System preferences (wallpaper, dock, terminal color)
      folder/       # Finder-style folder viewer
      markdown/     # Markdown file viewer
      browser/      # Blog / technical reports
    os/
      boot/         # Boot animation sequence
      desktop/      # Desktop, dock, system bar, wallpaper, icons
      window/       # Window management (drag, resize, minimize, fullscreen)
      store/        # Zustand stores (system state, notifications)
      filesystem/   # Virtual filesystem for desktop folders
      notification/ # macOS-style notification pills
  lib/
    portfolio/      # Projects, competitions, bio: the content source of truth
    seo/            # Metadata, structured data, URL routing
    analytics.ts    # Event tracking
```

State management: **Zustand** with `persist` middleware (wallpaper, dock config, and terminal font color survive page reloads via localStorage).

Styling: **Tailwind CSS** with glassmorphism (`bg-black/60 backdrop-blur-xl`) on all windows.

---

## Deployment

This repository uses a static Next.js export. A production build writes the site
to `out/`:

```bash
npm run build
```

### GitHub Pages

The repository includes `.github/workflows/deploy.yml`, which builds the site,
uploads `out/`, and deploys that artifact. GitHub repository settings must match
that workflow:

1. Open **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**. Do not use
   **Deploy from a branch**: branch mode runs the legacy Pages/Jekyll path and can
   render this repository's `README.md` instead of the Next.js application.
3. Set the custom domain to `jackson.stephens.sh`. Keep the tracked `CNAME` file
   identical to that hostname.
4. After changing the source, run or re-run **Deploy to GitHub Pages** in the
   Actions tab and verify that its deployed SHA matches the intended release.
5. When GitHub's DNS check completes, enable **Enforce HTTPS**.

After deleting and recreating the GitHub repository, repeat these settings steps;
Pages source selection is repository metadata and is not restored by Git.

For another static host, deploy the contents of `out/` after running:

```bash
npm run build
```

---

## Easter Eggs

Hidden terminal commands (not shown in `help`):
`sl`, `cowsay`, `apt moo`, `rev`, `ping`, `coffee`, `sudo`, `rm -rf`, `mkdir`, `git status`, and the games `snake`, `tetris`, `2048`
