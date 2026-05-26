// Assembles a Vercel Build Output API v3 directory (.vercel/output) from the
// Vite build (dist/client + dist/server). Run AFTER `vite build`.
//
//   .vercel/output/
//     ├─ static/                 ← dist/client (served by the CDN)
//     ├─ functions/index.func/   ← SSR handler, fully bundled (no node_modules)
//     └─ config.json             ← routes: static first, everything else → SSR
import { build } from "esbuild";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, ".vercel/output");
const fnDir = resolve(outDir, "functions/index.func");
const staticDir = resolve(outDir, "static");

if (!existsSync(resolve(root, "dist/server/server.js"))) {
  throw new Error("dist/server/server.js not found — run `vite build` first.");
}

// 1. clean
await rm(outDir, { recursive: true, force: true });
await mkdir(fnDir, { recursive: true });

// 2. static client assets
await cp(resolve(root, "dist/client"), staticDir, { recursive: true });

// 3. bundle the serverless function into a single self-contained ESM file so it
//    carries all of its dependencies (node_modules is not available at runtime).
await build({
  entryPoints: [resolve(root, "scripts/vercel-entry.mjs")],
  outfile: resolve(fnDir, "index.mjs"),
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  // Some bundled CJS deps call require() at runtime; provide one for ESM output.
  banner: {
    js: "import{createRequire as __cr}from'node:module';const require=__cr(import.meta.url);",
  },
});

// 4. function runtime config
await writeFile(
  resolve(fnDir, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs22.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
      shouldAddHelpers: false,
      supportsResponseStreaming: true,
    },
    null,
    2,
  ),
);
await writeFile(resolve(fnDir, "package.json"), JSON.stringify({ type: "module" }, null, 2));

// 5. top-level routing config
await writeFile(
  resolve(outDir, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: "filesystem" },
        { src: "/(.*)", dest: "/index" },
      ],
    },
    null,
    2,
  ),
);

console.log("✓ .vercel/output assembled (static + SSR function)");
