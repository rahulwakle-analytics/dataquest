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

## Status

Working:
- Homepage, navigation, light/dark theme, responsive layouts
- Five learning paths with 65 outlined topics and 23 full lessons: all 16 SQL topics, the four Excel Fundamentals
  topics, and the first lesson of Power BI, Python and Tableau
- **Excel practice engine** (`src/lib/sheet`): a formula parser and evaluator written for this project. It supports
  arithmetic, comparisons, text joining, relative/absolute/mixed references, ranges, table (structured) references
  and about 30 functions. A learner's formula is calculated, copied across the fill range with references adjusted
  as Excel would, and compared with the reference solution on the sample data and on extra test cases.
  It is not Excel and does not open workbooks.
- **Sort and filter exercises** (`src/lib/table-practice.ts`): the table the learner produces is compared with the goal view
- Progressive hints, solutions on request, knowledge checks; one lesson template for every path
- Dashboard at `/dashboard`: topics completed, exercises solved, learning history
- **Career layer**: `/explore` (the profession, four workplace scenarios, sourced salary ranges), `/roadmap`
  (nine stages with completion tracking) and `/career` (resume, portfolio and LinkedIn checklists, interview
  question bank, self-assessed mock interview, case studies, role profiles). Content lives in `src/content/career.ts`.
  Salary figures carry their source and the date checked; update them there.
- Progress saved in `localStorage` (validated lesson progress and self-ticked checklists are stored separately)
- Per-page metadata, canonical URLs, JSON-LD, sitemap, robots.txt, Open Graph image

## Content checks

```bash
npm run verify
```

Runs engine unit tests and, for every interactive exercise, checks that the reference solution gives the hand-written
expected values, passes its own test cases, and that each listed wrong answer is rejected.

Not built yet: accounts and synced progress (Supabase), SQL execution engine and Monaco editor, dataset library,
XP/streaks/leaderboards, payments, admin, analytics. Nothing in the UI claims these are live.

Known limits: answers and solutions ship in the page bundle and are checked in the browser, and progress is per
browser. Both move server-side with accounts. SQL, Power BI, Python and Tableau questions are self-checked
against a model solution and have one hint each.

Configuration left empty on purpose: Pro price and social links in `src/lib/site.ts`.
