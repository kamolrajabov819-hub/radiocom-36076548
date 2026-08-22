/**
 * Post-build pass: rewrite the built sitemap with real image URLs.
 *
 * `generate-seo.ts` runs before vite and therefore cannot know an image's
 * public URL — vite fingerprints assets, so `src/assets/catalog/rcd-70-hero.webp`
 * ships as `/assets/rcd-70-hero-DkW1gDWO.webp`. This runs after vite, maps every
 * source path onto the file that was actually emitted, and writes the
 * image-enriched sitemap over the build output.
 *
 * It fails the build on any image it cannot resolve. That is deliberate: the
 * failure mode this replaced was a sitemap full of `https://radiocom.uz/home/
 * user/.../src/assets/...` URLs, every one a 404, submitted to Google as
 * canonical image locations. Silence would have shipped that.
 *
 * Run by `bun run build` after vite. Standalone: bun scripts/finalize-sitemap.ts
 */
import { readdir, writeFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import { entries, renderSitemap } from "./lib/sitemap";

const OUT = ".output/public";
const ASSETS = `${OUT}/assets`;

/**
 * Vite emits `<name>-<hash><ext>`. The hash is base64url, 8 characters in
 * current vite, but the length has moved between majors — so this matches a
 * range rather than pinning one, and verifies uniqueness rather than trusting
 * the pattern.
 */
function stripHash(file: string): string {
  const ext = extname(file);
  const stem = basename(file, ext);
  const m = stem.match(/^(.*)-([A-Za-z0-9_-]{8,12})$/);
  return m ? `${m[1]}${ext}` : file;
}

const built = await readdir(ASSETS).catch(() => {
  throw new Error(
    `finalize-sitemap: ${ASSETS} not found. This runs after \`vite build\` — check the build script order.`,
  );
});

const byName = new Map<string, string>();
const collisions: string[] = [];
for (const file of built) {
  const key = stripHash(file);
  if (byName.has(key)) collisions.push(key);
  byName.set(key, `/assets/${file}`);
}
if (collisions.length) {
  // Two source files with the same basename in different directories would map
  // to one key and the second would silently win, pointing a product's sitemap
  // entry at another product's photograph.
  throw new Error(
    `finalize-sitemap: ${collisions.length} basename collision(s) in ${ASSETS} — ` +
      `cannot resolve unambiguously: ${collisions.join(", ")}`,
  );
}

const unresolved = new Set<string>();
const resolve = (src: string): string | undefined => {
  const hit = byName.get(basename(src));
  if (!hit) unresolved.add(src);
  return hit;
};

const sitemap = renderSitemap(entries, resolve);

if (unresolved.size) {
  throw new Error(
    `finalize-sitemap: ${unresolved.size} image(s) in the sitemap have no built asset:\n` +
      [...unresolved].map((s) => `  ${s}`).join("\n"),
  );
}

await writeFile(`${OUT}/sitemap.xml`, sitemap, "utf8");

const images = (sitemap.match(/<image:image>/g) ?? []).length;
const unique = new Set([...sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1]))
  .size;
console.log(
  `seo: finalized ${OUT}/sitemap.xml — ${images} image entries (${unique} unique files) across ${entries.length * 3} urls`,
);
