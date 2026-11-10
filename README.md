# DataQuest

Learn. Practise. Prove Your Skills. A practice platform for data analytics (Excel, SQL, Power BI, Python, Tableau).

This repository currently contains **Phase 1**: brand, design system, public site, learning paths and topic pages.

## Run it

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL for production
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

Requires Node 18.18 or newer. No other services are needed for Phase 1.

## Stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Radix primitives with shadcn-style components
(`src/components/ui`), Geist font, next-themes.

## Structure

```
src/app                 routes: /, /paths, /paths/[tool], /paths/[tool]/[topic], /projects, /pricing, sitemap, robots, OG image
src/components/ui       Button, Badge, Card, Tabs, Accordion, Progress
src/components/home     interactive product preview, FAQ
src/components/learn    code block, knowledge check, practice question, path card, topic list
src/content             paths.ts (outline), lessons/*.ts (lesson content), projects.ts
src/lib                 site config, progress store, syntax highlighter
```

Design tokens live in `src/app/globals.css` (CSS variables for light and dark) and are mapped in `tailwind.config.ts`.

## Adding a lesson

Add an entry keyed `"<tool>/<topic-slug>"` to a file in `src/content/lessons` using the `Lesson` type. The topic page,
path counts, sitemap and "In development" labels update from the data.

## Phase 1 status

Working:
- Homepage, navigation, light/dark theme, responsive layouts
- Five learning paths with 65 outlined topics; 20 full lessons (all 16 SQL topics, plus the first lesson of each other path)
- Knowledge checks validated in the browser; topic completion and path progress saved in `localStorage`
- Practice questions with hint and solution revealed on request
- Interactive homepage preview (sample data, three prepared queries evaluated in the browser)
- Per-page metadata, canonical URLs, JSON-LD, sitemap, robots.txt, Open Graph image

Not built yet (later phases): accounts and synced progress (Supabase), SQL execution engine and Monaco editor, dataset
library, XP/streaks/leaderboards, payments, admin dashboard, analytics. Nothing in the UI claims these are live.

Configuration left empty on purpose: Pro price and social links in `src/lib/site.ts`.

Known limits of Phase 1: knowledge-check answers ship in the page bundle and progress is per browser. Both move
server-side with Phase 2 and 3.
