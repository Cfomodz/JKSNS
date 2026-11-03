# JSOS — Interactive Portfolio

An OS-style portfolio site built with Next.js. Features a macOS-inspired desktop with draggable windows, a working terminal with games, and glassmorphism throughout.

## Quick Start

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
```

Output goes to `out/` for static hosting (GitHub Pages, Netlify, etc.)

## Updating content

Projects, competition results, and the bio live in `src/lib/portfolio/`. After editing them:

```bash
npm run content:sync
```

That regenerates the markdown in `public/readmes/` that the desktop folders open. The test suite fails if it falls out of date.

## Customization

See [HANDOFF.md](./HANDOFF.md) for a full guide on making this your own.
