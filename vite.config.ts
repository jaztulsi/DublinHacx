// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Two deploy targets:
//   - Vercel runs SSR so TanStack Start server functions (createServerFn) execute
//     at runtime. Vercel sets VERCEL=1 automatically; vercel.json also sets
//     VITE_TARGET=vercel as a backup.
//   - GitHub Pages can only serve static files, so it uses SPA mode and serves the
//     project site under /<repo>/. Its deploy workflow sets GITHUB_PAGES=true so the
//     asset base + router basepath match that subpath. GITHUB_PAGES must NEVER be set
//     on Vercel or the base path breaks.
const isVercel = process.env.VERCEL === "1" || process.env.VITE_TARGET === "vercel";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const base = isGithubPages ? "/DublinHacx/" : "/";

export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    // SPA (static) for GitHub Pages; SSR for Vercel so server functions run.
    spa: { enabled: !isVercel },
    router: { basepath: base },
  },
  vite: {
    base,
  },
});
