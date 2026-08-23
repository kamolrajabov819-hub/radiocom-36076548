import { readdir, stat } from "node:fs/promises";

/**
 * Where the build actually put the public files.
 *
 * Nitro's output path is set by the preset, and this project builds under three
 * of them:
 *
 *   cloudflare (the local default)  ->  .output/public
 *   node-server (local QA)          ->  .output/public
 *   netlify (what Netlify picks)    ->  dist
 *
 * Hardcoding `.output/public` is what broke the Netlify deploy on PR #14: every
 * local build put the files there, so nothing caught it until Netlify ran the
 * same script against its own preset and the post-build step threw.
 *
 * `publish = "dist"` in `netlify.toml` is therefore *correct* — the netlify
 * preset's `publicDir` is `{{ rootDir }}/dist/`. An earlier comment in that file
 * claimed it was wrong, on the evidence of local builds alone. It was not.
 *
 * Picks the **most recently written** candidate, not the first one that exists.
 *
 * That distinction is the whole function. The repo's own workflow builds under
 * two presets back to back — the default for local QA and `netlify` for what
 * actually deploys — so after the first build `.output/public` exists forever.
 * A first-match search then enriched that stale directory's sitemap on every
 * subsequent netlify build and left `dist/sitemap.xml` with no image entries at
 * all: 321 image URLs generated, written to a directory nothing deploys, and
 * the deployed sitemap silently thinner than the one that was verified.
 *
 * It never showed up on Netlify itself, where only `dist` is ever created — the
 * failure was invisible precisely where the build was being checked. Ordering by
 * mtime is correct in both cases and needs no knowledge of which preset ran.
 *
 * Returns `null` when no output directory exists, so a caller can decide
 * whether that is fatal.
 */
const CANDIDATES = [".output/public", "dist"] as const;

export async function findPublicDir(): Promise<string | null> {
  const found: { dir: string; mtime: number }[] = [];
  for (const dir of CANDIDATES) {
    // An `assets/` child is what distinguishes a real build output from a
    // leftover empty directory.
    const ok = await readdir(`${dir}/assets`).then(
      (files) => files.length > 0,
      () => false,
    );
    if (!ok) continue;
    // The directory's own mtime moves when vite writes into it, so it dates the
    // build rather than any one file inside it.
    const { mtimeMs } = await stat(`${dir}/assets`);
    found.push({ dir, mtime: mtimeMs });
  }
  if (!found.length) return null;
  found.sort((a, b) => b.mtime - a.mtime);
  return found[0].dir;
}

export const OUTPUT_CANDIDATES = CANDIDATES;
