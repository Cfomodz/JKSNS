# SEO Infrastructure Documentation

Technical reference for the SEO implementation in JSOS.

---

## Architecture Overview

The portfolio uses a **Hybrid State Architecture** that lets search engines crawl a single-page "OS" interface. Each route is statically exported; the server parses the path, hydrates the window store, and renders the window's content in the initial HTML.

```
URL Request → Static Page → Parse Path → Hydrate Store → SSR Window Content
```

---

## URL Schema

| Pattern | Description | Example |
|---------|-------------|---------|
| `/` | Desktop (no windows) | `https://jackson.stephens.sh` |
| `/about` | About window | `/about` |
| `/resume` | Resume in the Markdown Viewer | `/resume` |
| `/projects` | Projects folder | `/projects` |
| `/projects/[slug]` | A project write-up | `/projects/project-kraken` |
| `/experience` | Competitions folder | `/experience` |
| `/experience/[slug]` | A season's results or an event write-up | `/experience/season-2025-2026`, `/experience/rmccdc` |

### Where slugs come from

File slugs are not listed by hand. `src/features/os/filesystem/files.ts` builds the Projects and Competitions folders from `src/lib/portfolio/`, and `src/lib/seo/path-routing.ts` derives every `/projects/[slug]` and `/experience/[slug]` route, the sitemap, and the crawler index from those folders. Adding a project or a season adds its page.

**Projects:** `project-kraken`, `claude-preflight`, `distillr`, `jsos`, `earlier-work`

**Competitions:** `season-2026-2027`, `season-2025-2026`, `season-2024-2025`, `season-2023-2024`, `nccdc`, `rmccdc`, `cyberforce`, `sandia`, `ctf`, `defense`

### Legacy URLs

Query-parameter URLs (`/?app=...&file=...`) map to clean paths through `getLegacyRedirectPath`. The old competition pages that lived under `/projects/rmccdc`, `/projects/nccdc`, and `/projects/cyberforce` now live under `/experience/`.

---

## Schema.org Structured Data

**File:** `src/lib/seo/schema.ts`

- **ProfilePage + Person** on every page (`app/layout.tsx`). `worksFor` and `alumniOf` are omitted until `src/lib/seo/entity.ts` records an employer or school.
- **WebSite** on every page.
- **SoftwareApplication** on each project page, built from `src/lib/portfolio/projects.ts`.

---

## File Structure

```
src/lib/portfolio/          # Content source of truth
├── competitions.ts         # Seasons, results, event series
├── projects.ts             # Projects and earlier work
├── profile.ts              # Bio and focus areas
├── markdown.ts             # Generators for public/readmes/*.md
└── content-sync.test.ts    # Fails when public/readmes/ drifts from the data

src/lib/seo/
├── index.ts          # Barrel exports
├── url-state.ts      # Legacy query-param ↔ state mapping
├── metadata.ts       # Site config and app metadata
├── path-metadata.ts  # Per-route metadata
├── path-routing.ts   # Path ↔ window state, sitemap paths
├── entity.ts         # Entity identity data
├── schema.ts         # Schema.org JSON-LD
└── SiteIndex.tsx     # Hidden nav for crawlers

app/
├── page.tsx
├── about/page.tsx
├── resume/page.tsx
├── projects/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── experience/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── layout.tsx
├── sitemap.ts
└── robots.ts
```

---

## Verification

```
https://jackson.stephens.sh                              # Desktop
https://jackson.stephens.sh/about                        # About window
https://jackson.stephens.sh/projects/project-kraken      # Project write-up
https://jackson.stephens.sh/experience/season-2025-2026  # Season results
https://jackson.stephens.sh/sitemap.xml                  # Every route above
```
