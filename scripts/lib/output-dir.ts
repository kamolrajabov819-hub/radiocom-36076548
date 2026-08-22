import { readdir } from "node:fs/promises";

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
 * Returns `null` when no output directory exists, so a caller can decide
 * whether that is fatal.
 */
const CANDIDATES = [".output/public", "dist"] as const;

export async function findPublicDir(): Promise<string | null> {
  for (const dir of CANDIDATES) {
    // An `assets/` child is what distinguishes a real build output from a
    // leftover empty directory.
    const ok = await readdir(`${dir}/assets`).then(
      (files) => files.length > 0,
      () => false,
    );
    if (ok) return dir;
  }
  return null;
}

export const OUTPUT_CANDIDATES = CANDIDATES;
