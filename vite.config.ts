// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GitHub Pages serves this project site under /<repo>/. The deploy workflow sets
// GITHUB_PAGES=true so the asset base + router basepath match that subpath, while
// local dev/build stay at the root.
const base = process.env.GITHUB_PAGES === "true" ? "/DublinHacx/" : "/";

export default defineConfig({
  cloudflare: false,
  // Static single-page-app output (no server runtime) so it can be hosted on GitHub Pages.
  tanstackStart: {
    spa: { enabled: true },
    router: { basepath: base },
  },
  vite: {
    base,
  },
});
