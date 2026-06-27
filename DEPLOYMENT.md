# Deploying Dublin Hacx to Vercel

This is a static marketing site (no database or backend). It has two deploy targets:

- **Vercel** — runs in **SSR** mode for server-rendered pages.
- **GitHub Pages** — runs in **SPA** mode (static files only). Handled by
  `.github/workflows/deploy.yml`; nothing here applies to it.

The build mode is chosen automatically: Vercel sets `VERCEL=1`, and `vercel.json`
also sets `VITE_TARGET=vercel` as a backup, so `vite.config.ts` disables SPA mode.

## 1. Create the project

1. Go to [vercel.com](https://vercel.com) → **New Project** → import this GitHub repo.
2. **Framework preset:** Other
3. **Build command:** `npm run build:vercel`
4. **Output directory:** `.vercel/output`
5. **Install command:** `npm install`

(Items 2–5 are also pinned in `vercel.json`, but set them in the dashboard to match.)

## 2. Environment variables

Under **Settings → Environment Variables**, add **all** of the following. The
"scope" column says whether the value is needed when the bundle is built
(build-time, baked into the client) and/or when the function runs (runtime).

| Variable | Scope | Notes |
| --- | --- | --- |
| `VITE_TARGET` | build-time | Set to `vercel`. Already in `vercel.json`; add here as a backup |

> This is a static marketing site. Registration is handled by an external
> Google Form, so no database or backend secrets are required.

> **Do NOT set `GITHUB_PAGES` on Vercel.** It only belongs to the GitHub Pages
> workflow; setting it on Vercel rewrites the asset base path to `/DublinHacx/`
> and breaks the site.

## 3. Redeploying after changing env vars

Environment-variable changes do **not** take effect on the existing build. Go to
**Deployments → ⋯ → Redeploy** and make sure **"Use existing Build Cache" is
unchecked** so the new values are picked up.
