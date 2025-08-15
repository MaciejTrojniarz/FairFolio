# FairMerchant (AI-assisted)

This project was created with significant AI assistance (agent-driven edits), complemented by manual adjustments and reviews. It was built as part of the first edition of the 10xDevs course: https://www.10xdevs.pl/

## What it is
A small full‑stack app for managing products, events, and sales:
- Frontend: React + TypeScript (Vite), Material UI, Redux Toolkit, redux‑observable (RxJS), Vitest/Playwright
- Backend: Supabase (Auth, Postgres, Row Level Security), SQL migrations in `database/migrations`
- CI/CD: GitHub Actions
- Hosting: Netlify (frontend)

## Quick start (local)
- Requirements: Node 20
- Environment variables (frontend):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Steps:
```
cd frontend-app
npm ci
npm run dev
```

## Build
```
cd frontend-app
npm run build
```
Output is written to `frontend-app/dist/`.

## Tests
- Unit: `npm run -C frontend-app test:run`
- E2E: `npm run -C frontend-app test:e2e`

## Deploy (Netlify)
- Base directory: `frontend-app`
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`
- SPA routing: `_redirects` file in `frontend-app/public/` contains `/* /index.html 200`
- Public env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (intentionally embedded by Vite)

## Database (Supabase)
- Migrations live in `database/migrations` and include Row Level Security (RLS) on `public.events` so users only see/manage their own events (`creator_id = auth.uid()`).
- Apply via Supabase CLI (`supabase db push`) or psql using your project `DATABASE_URL`.

## App info
- The app’s semantic version (from `frontend-app/package.json`) is exposed in the UI under the User menu → Application info.

## Credits
- Built primarily with an AI coding agent plus manual curation, fixes, and integration work.
