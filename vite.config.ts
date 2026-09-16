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

    build: {
      /**
       * Never base64-inline a product photograph, however small it encodes.
       *
       * Vite inlines any asset under 4 KB as a `data:` URI. That is a good
       * default for an icon and a bad one here, and the 15.09.26 photography
       * made it bite: those frames sit on a pure white ground, white compresses
       * to almost nothing, and six `@400` variants came out under the limit.
       * Vite inlined them — 26 KB of base64 in the entry chunk, which every
       * visitor then downloads on every page, including the pages that never
       * show that radio. Measured: the entry chunk went 611 -> 640 KB and
       * `qa-weight` failed on both its ceilings.
       *
       * base64 also costs a third more bytes than the file it encodes, and an
       * inlined asset can never be cached separately or fetched in parallel.
       * So: catalogue images are always emitted as files. Everything else keeps
       * Vite's default, which is why this returns `undefined` rather than 0.
       */
      assetsInlineLimit: (filePath: string) =>
        /[\\/]assets[\\/]catalog[\\/]/.test(filePath) ? false : undefined,
    },
  },

  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
