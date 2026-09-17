/**
 * Turn an industry photograph into the six files the site renders for it.
 *
 * Each industry needs a landscape hero and a portrait poster, each with two
 * smaller siblings — the shapes `industry-images.ts` documents:
 *
 *   industry-<slug>.jpg           1400x900   the page's full-bleed hero
 *   industry-<slug>@800.jpg        800x514
 *   industry-<slug>@400.jpg        400x257
 *   industry-<slug>-poster.webp    600x900   the brand pages' poster shelf
 *   industry-<slug>-poster@800.webp 533x800
 *   industry-<slug>-poster@400.webp 267x400
 *
 * The two crops are 1.56:1 and 0.67:1 — near-opposite shapes cut from one
 * landscape frame — so a centred crop is the wrong default. The poster throws
 * away about two thirds of the width, and in all three of these photographs the
 * people are off centre: the control-room operator sits right of frame, the
 * site crew right of centre, the factory pair just left. Centred, the poster
 * would cut the operator's face and clip a worker off the crew.
 *
 * So each source carries a `focus` — the fraction of the frame the crop should
 * centre on — and both crops are anchored to it, clamped so the window stays
 * inside the image. It is one number per axis per photograph, read off the
 * frame, and it is the whole reason this is a table rather than a one-liner.
 *
 * Sources live gitignored at `raw-catalog/`, alongside the rest of the
 * photography. They are in git history at `69f002d`, where they were uploaded.
 *
 * Run: bun scripts/build-industry-photos.ts
 * Then: bun scripts/build-image-variants.ts <the six masters it names>
 *       — it prints the exact command. Handed a directory it walks all of it,
 *       and `src/assets` holds images that deliberately have no variants.
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";

/**
 * `source under raw-catalog/` -> industry slug, plus where to aim the crops.
 *
 * `focus` is [x, y] as a fraction of the source. Measured off each frame:
 * the factory pair walk up the centre aisle, the operator and the site crew
 * both sit right of centre.
 */
const JOBS = [
  {
    src: "raw-catalog/industry-manufacturing-src.jpg",
    slug: "manufacturing",
    focus: [0.48, 0.55],
  },
  {
    src: "raw-catalog/industry-security-src.jpg",
    slug: "security",
    focus: [0.66, 0.45],
  },
  {
    src: "raw-catalog/industry-construction-src.jpg",
    slug: "construction",
    focus: [0.68, 0.6],
  },
];

const PY = `
import json, os, sys
from PIL import Image

JOBS = json.loads(sys.argv[1])
DST = "src/assets"
# The two shapes, and the quality each format is written at. 86 for the hero
# matches the weight of the frames already in the folder (a 1400x900 industry
# JPEG sits around 100-290 KB depending on how busy it is).
HERO = (1400, 900, 86)
POSTER = (600, 900, 86)

def crop_to(im, ratio, fx, fy):
    """The largest window of this aspect ratio, centred on the focal point."""
    W, H = im.size
    w, h = (W, round(W / ratio)) if W / ratio <= H else (round(H * ratio), H)
    # Centre on the focus, then slide the window back inside the frame rather
    # than letting it hang off an edge.
    x = min(max(round(W * fx - w / 2), 0), W - w)
    y = min(max(round(H * fy - h / 2), 0), H - h)
    return im.crop((x, y, x + w, y + h))

for job in JOBS:
    src, slug = job["src"], job["slug"]
    fx, fy = job["focus"]
    if not os.path.exists(src):
        raise SystemExit(
            f"missing upload: {src}\\n"
            "The sources are gitignored under raw-catalog/ and archived in git "
            "history at 69f002d. See the header of this file."
        )
    im = Image.open(src).convert("RGB")

    hw, hh, hq = HERO
    hero = crop_to(im, hw / hh, fx, fy).resize((hw, hh), Image.LANCZOS)
    hero_path = os.path.join(DST, "industry-" + slug + ".jpg")
    hero.save(hero_path, "JPEG", quality=hq, optimize=True, progressive=True)

    pw, ph, pq = POSTER
    poster = crop_to(im, pw / ph, fx, fy).resize((pw, ph), Image.LANCZOS)
    poster_path = os.path.join(DST, "industry-" + slug + "-poster.webp")
    poster.save(poster_path, "WEBP", quality=pq, method=6)

    print(f"  {slug:14s} {im.size[0]}x{im.size[1]} -> hero {hw}x{hh} "
          f"({os.path.getsize(hero_path)//1024} KB), poster {pw}x{ph} "
          f"({os.path.getsize(poster_path)//1024} KB)")
`;

const r = spawnSync("python3", ["-c", PY, JSON.stringify(JOBS)], { stdio: "inherit" });

if (r.status === 0) {
  // Drop the siblings of every master this run rewrote, for the reason
  // `build-catalog-photos.ts` does: `build-image-variants.ts` skips a file that
  // already has both, and `srcSet` serves a variant at most viewport sizes, so
  // a stale sibling makes the new photograph invisible on almost every screen.
  const masters = JOBS.flatMap(({ slug }) => [
    `src/assets/industry-${slug}.jpg`,
    `src/assets/industry-${slug}-poster.webp`,
  ]);
  let dropped = 0;
  for (const master of masters)
    for (const suffix of ["@800", "@400"]) {
      const path = master.replace(/\.(jpg|webp)$/, `${suffix}.$1`);
      if (!existsSync(path)) continue;
      rmSync(path);
      dropped++;
    }
  console.log(`\n  dropped ${dropped} stale sibling(s). Now run:`);
  console.log(`    bun scripts/build-image-variants.ts \\\n      ${masters.join(" \\\n      ")}`);
}
process.exit(r.status ?? 1);
