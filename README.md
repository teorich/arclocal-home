# arclocal-home

Standalone Next.js application serving the ArcLocal public home page
(marketing landing page) at `/`.

The ArcLocal application itself (login, registration, invitation acceptance,
and the authenticated workspace) lives in a separate repository under
`app/web` and is served by the ArcLocal Encore application. This project holds
only the public marketing surface.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Yarn classic (1.22)
- SQLite (`better-sqlite3`) for CMS content

## Local development

```bash
yarn install
yarn dev
```

The development server runs on `http://localhost:3000`.

## Build

```bash
yarn build
```

Produces a standalone output (see `output: "standalone"` in `next.config.ts`)
deployed via the `Dockerfile`.

## Content management (CMS)

The page's wording is editable at `/admin` — hero, benefits, features, steps,
footer, SEO text and more. Edits are stored in SQLite and appear on the live
page immediately (the home page renders per request). The defaults live in
`src/lib/home-content.ts`; "Reset to defaults" in the editor restores them.

Configure the admin login with environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `CMS_ADMIN_EMAIL` / `CMS_ADMIN_PASSWORD` | the single admin login |
| `SESSION_SECRET` | signs the session cookie (rotate to sign everyone out) |
| `CMS_DB_PATH` | database file; `/data/cms.db` in Docker |

For local development copy `.env.example` to `.env.local` and fill it in; the
editor is then at `http://localhost:3000/admin`.

**Production:** mount a persistent volume at `/data` (for example
`docker run -v arclocal-cms:/data …`) or content edits are lost on redeploy,
and set the three variables above on the container. The CMS runs as a single
instance — SQLite does not support several replicas sharing one file.

## Routing

The home page is served at `/` and links to the application's `/login` and
`/register` routes. In production both apps share one hostname
(`arclocal.soliibridge.com`) split by path at the reverse proxy / Cloudflare
Tunnel:

- `/`, `/_next/*` and `/admin/*` (the CMS, pages and API)     → this app (port 3000)
- `/login`, `/register`, `/invite`, `/app/*`, `/assets/*`     → the ArcLocal app
