/**
 * One-shot importer for the uploaded catalogue photography.
 *
 * The upload arrived as camera originals with inconsistent names — spaces,
 * `(2)` suffixes, a trailing space in `rcd 50 .webp`, mixed casing — and at
 * sizes no web page should ever serve: most Motorola shots are 6500x4333, one
 * is 1.1 MB. Serving those unchanged would cap Core Web Vitals no matter what
 * else the site does, so this script does three things in one pass:
 *
 *   1. Renames every file to `<model-slug>-<variant>.webp`.
 *   2. Re-encodes to two web sizes — 1600px for the full source and 800px for
 *      the `srcSet` small candidate, matching the `src`/`srcSmall` contract
 *      `ProductShot` has used since the Phase 1 fix.
 *   3. Drops the originals.
 *
 * The originals are not lost: they remain in git history at commit `6f4237d`,
 * which is where to go if a print-resolution copy is ever needed. Keeping
 * 6500px camera files in the working tree would make every clone of this repo
 * carry ~30 MB of pixels no browser will ever request.
 *
 * MAPPING NOTE — the `.asset.json` pointers could not be matched by filename.
 * Each pointer's `original_filename` holds the *old generated* name
 * (`t42-red-2.jpg`), not the uploaded one (`Motorola T42 red (2).webp`), so the
 * mapping below was built by looking at all 45 photographs and identifying the
 * model in each. Heroes are the radios-alone frames; the retail-box and kit
 * flat-lays become gallery shots, because a product hero on apple.com is the
 * product, not its packaging.
 *
 * Run: bun scripts/import-catalog-photos.ts
 */
import { existsSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

const DIR = "src/assets/catalog";

/** `uploaded filename` -> `slug-variant` (no extension). */
export const PHOTO_MAP: Record<string, string> = {
  // ── Radiocom RC — studio shots on white, 1280x960, no alpha ──
  "RC-10 Equipment.webp": "rc-10-kit",
  "RC-20 Equipment.webp": "rc-20-kit",
  "RC-50 Equipment.webp": "rc-50-kit",

  // ── Radiocom RCD — 1080x1080 studio, no alpha ──
  "rcd 30.webp": "rcd-30-kit",
  "rcd 40.webp": "rcd-40-kit",
  "rcd 50 .webp": "rcd-50-kit",
  "rcd50.webp": "rcd-50-hero",
  "rcd 60 (2).webp": "rcd-60-hero",
  "rcd 60.webp": "rcd-60-kit",
  "rcd 70 (2).webp": "rcd-70-hero",
  "rcd 70.webp": "rcd-70-kit",

  // ── Motorola T42 — cutouts with alpha ──
  "Motorola T42 red (2).webp": "t42-red-hero",
  "Motorola T42 red1.webp": "t42-red-pair",
  "Motorola T42 red2.webp": "t42-red-alt",
  "Motorola T42 red.webp": "t42-red-box",
  "Motorola T42 blue (3).webp": "t42-blue-hero",
  "Motorola T42 blue1.webp": "t42-blue-pair",
  "Motorola T42 blue.webp": "t42-blue-alt",
  "Motorola T42 blue (2).webp": "t42-blue-box",
  "Motorola T42 Triple.webp": "t42-triple-hero",
  "Motorola T42 Triple-1.webp": "t42-triple-alt",
  "Motorola T42 Triple-2.webp": "t42-triple-box",
  "Motorola T42 Quad.webp": "t42-quad-hero",
  "Motorola T42 Quad 3.webp": "t42-quad-alt",
  "Motorola T42 Quad1.webp": "t42-quad-box",

  // ── Motorola T62 ──
  "Motorola T62 blue (2).webp": "t62-blue-hero",
  "Motorola T62 blue.webp": "t62-blue-box",
  "Motorola T62 red.webp": "t62-red-hero",
  "Motorola T62 red (3).webp": "t62-red-front",
  "Motorola T62 red (2).webp": "t62-red-back",

  // ── Motorola T72 ──
  "Motorola T72 Go Active-1.webp": "t72-hero",
  "Motorola T72 Go Active.webp": "t72-alt",
  "Motorola T72 Go Active-2.webp": "t72-box",

  // ── Motorola TLKR T92 H2O ──
  "Motorola TLKR-T92 H2O.webp": "tlkr-t92h2o-hero",
  "Motorola TLKR-T92 H2O-2.webp": "tlkr-t92h2o-front",
  "Motorola TLKR-T92 H2O-1.webp": "tlkr-t92h2o-side",

  // ── Motorola XT ──
  "Motorola XT185-1.webp": "xt185-hero",
  "Motorola XT185-2.webp": "xt185-alt",
  "Motorola XT185.webp": "xt185-kit",
  "Motorola XT420.webp": "xt420-hero",

  // ── Motorola T82 ──
  "motorola-t82-1.webp": "t82-hero",
  "motorola-t82-extreme-1-v2.webp": "t82-extreme-hero",
  "motorola-t82-extreme-2.webp": "t82-extreme-pair",
  "motorola-t82-extreme-1.webp": "t82-extreme-kit",
  "motorola-t82-extreme-quad-1.webp": "t82-extreme-quad-hero",
};

const before = readdirSync(DIR).filter((f) => f.endsWith(".webp"));
const unmapped = before.filter((f) => !(f in PHOTO_MAP) && !/-@?\d*(@800)?\.webp$/.test(f));

let renamed = 0;
for (const [from, to] of Object.entries(PHOTO_MAP)) {
  const src = join(DIR, from);
  if (!existsSync(src)) continue;
  const dest = join(DIR, `${to}.webp`);
  if (existsSync(dest)) {
    rmSync(src);
    continue;
  }
  renameSync(src, dest);
  renamed++;
}

console.log(`renamed ${renamed} file(s)`);
if (unmapped.length) {
  console.log(`\n${unmapped.length} file(s) NOT in the map — check before shipping:`);
  for (const f of unmapped) console.log(`   ${f}`);
}
