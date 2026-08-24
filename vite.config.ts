// @lovable.dev/vite-tanstack-config already includes the following - do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { contentDate } from "./scripts/lib/content-date";

// Resolved once, here, so the value in `article:modified_time` and the value in
// `<lastmod>` are the same string from the same commit. Computing it in two
// places would let a build that straddles midnight publish two different
// answers to the same question. See scripts/lib/content-date.ts.
const CONTENT_DATE = contentDate();

export default defineConfig({
  // Put plugins exactly here at the root level so Cloudflare's parser can find it
  plugins: [],

  vite: {
    define: { __CONTENT_DATE__: JSON.stringify(CONTENT_DATE) },
  },
  
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
