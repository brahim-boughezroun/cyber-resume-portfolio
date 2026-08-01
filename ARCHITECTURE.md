# Cyber Resume Portfolio

An interactive, cyberpunk-themed personal website for **Brahim Boughezroun** — an AI & Full-Stack Developer studying in Morocco. Built with **Next.js App Router**, **TypeScript**, and **Tailwind CSS**.

---

## What We're Building

A single-person portfolio that serves three purposes:

1. **Interactive Resume** — A visually striking homepage with animated effects (matrix rain, 3D scenes) that showcases skills, projects, experience, and contact info.
2. **Personal Blog** — A public-facing blog with an archive page and individual article views. Posts are filtered by draft/published status, with related-article suggestions.
3. **Database Backend** — PostgreSQL is wired up with migrations and seed scripts, ready for a future CMS upgrade where blog content moves from static JSON into the database.

## Architecture

```
src/
├── app/                    # Next.js App Router (file-based routing)
│   ├── layout.tsx          # Root layout — global metadata + HTML wrapper
│   ├── globals.css         # Shared styles (dark theme, custom properties)
│   ├── page.tsx            # Homepage — renders the interactive resume
│   ├── blog/               # Blog section
│   │   ├── layout.tsx      # Blog layout (header + footer)
│   │   ├── page.tsx        # Blog index — lists all published posts
│   │   └── [slug]/page.tsx # Dynamic route — renders a single article
│   └── api/
│       └── health/
│           └── database/route.ts  # Health-check endpoint (POSTGRES ping)
├── components/             # Reusable React components
│   ├── matrix-rain.tsx     # Animated matrix rain background effect
│   ├── player.tsx          # Interactive 3D scene (desktop world)
│   ├── desktop-world.tsx   # Main hero — interactive cyberpunk scene
│   ├── mobile-resume.tsx   # Resume view for mobile screens
│   └── blog/               # Blog-specific components
│       ├── author-card.tsx
│       ├── blog-header.tsx
│       ├── blog-footer.tsx
│       ├── post-card.tsx
│       └── share-buttons.tsx
├── data/                   # Static data (seeded from JSON, not DB)
│   ├── portfolio.ts        # Full resume data: skills, experience, projects, contact
│   └── blog.ts             # Blog post content (future: query from PostgreSQL)
├── types/                  # TypeScript type definitions
│   └── blog.ts             # BlogPost type (title, slug, content[], status, etc.)
├── database/               # Database layer (PostgreSQL)
│   ├── migrations/         # SQL migrations (users, sessions, posts, comments, indexes)
│   ├── seeds/              # Seed scripts (categories, admin user)
│   └── migrations/client.ts# pg.Pool singleton with hot-reload guard
```

## Data Flow

1. **Homepage** (`/`) loads `src/data/portfolio.ts` — the entire resume data set (skills, experience, projects, contact info).
2. **Blog index** (`/blog`) loads `src/data/blog.ts` — all posts, filtering out drafts.
3. **Article page** (`/blog/[slug]`) finds the matching post from the static data, then surfaces related posts by shared tags or category.
4. **Health API** (`/api/health/database`) connects to PostgreSQL via `pg.Pool` and returns connection status.
5. **Future**: Blog data is seeded into PostgreSQL via 9 migrations + seed scripts; the frontend will eventually query the database instead of static JSON.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (custom dark theme) |
| Database | PostgreSQL (via `pg`) |
| Migrations | Raw SQL files |
| Content (current) | Static JSON in `src/data/` |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Interactive resume — cyberpunk hero scene |
| `/blog` | Blog archive with hero stats panel and post grid |
| `/blog/:slug` | Individual article with tags, author card, share buttons, related posts |

## Key Design Decisions

- **Static-first content**: Blog posts live in `src/data/blog.ts` for fast SSR; the database is prepared for a future CMS-like upgrade.
- **Draft filtering**: Posts have a `status` field (`draft` | `published`). The index page filters; the article page calls `notFound()` for unpublished slugs.
- **Related posts**: Computed client-side by matching category or shared tags.
- **Database pool singleton**: Uses `globalThis` to prevent connection leaks during Next.js dev hot-reloads.
- **Cyberpunk theme**: Custom green-on-black palette (`#020704` background, `#38ff7a` accent, `#d9ffe3` text) with subtle grid backgrounds.
