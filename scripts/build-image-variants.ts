/**
 * Re-encode source photography to the two sizes the site actually serves.
 *
 * Every image goes to a 1600px full source plus an 800px `srcSet` candidate —
 * the `src`/`srcSmall` pair `ProductShot` has taken since the Phase 1 fix. The
 * originals are camera files: most catalogue shots are 6500x4333 and several
 * top-level photos are 3 MB. A browser never requests those pixels, but every
 * visitor on 4G pays for them, and every clone of this repo carries them.
 *
 * Uses Pillow rather than sharp or vite-imagetools deliberately. Both of those
 * would add a dependency and rewrite `bun.lock`, which syncs to Lovable and to
 * a build environment I cannot verify from here — the same reasoning that kept
 * vite-imagetools out in Phase 1. Pillow is already present, runs once, and
 * leaves no trace in the dependency graph. The outputs are committed artifacts,
 * exactly like the `@800` files that already existed.
 *
 * Originals stay recoverable from git history at commit `6f4237d`.
 *
 * Idempotent: an image already at or below the target is left alone, so a
 * second run is a no-op rather than a second round of lossy re-encoding.
 *
 * Run: bun scripts/build-image-variants.ts [--dir src/assets/catalog]
 */
import { spawnSync } from "node:child_process";

const PY = `
import sys, os, glob
from PIL import Image

FULL, SMALL, QUALITY = 1600, 800, 82
dirs = sys.argv[1:] or ["src/assets/catalog"]

def encode(im, path, target):
    w, h = im.size
    if max(w, h) > target:
        scale = target / max(w, h)
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    # Alpha is load-bearing here: the Motorola frames are cutouts, and
    # flattening them onto white would defeat the contact-shadow treatment
    # they get on a tinted band.
    im.save(path, "WEBP", quality=QUALITY, method=6)
    return im.size

saved_before = saved_after = 0
made = skipped = 0

for d in dirs:
    for f in sorted(glob.glob(os.path.join(d, "*.webp"))):
        base = os.path.basename(f)
        if "@800" in base:
            continue
        small_path = f.replace(".webp", "@800.webp")
        im = Image.open(f)
        w, h = im.size
        before = os.path.getsize(f)

        if max(w, h) <= FULL and os.path.exists(small_path):
            skipped += 1
            continue

        saved_before += before
        if max(w, h) > FULL:
            encode(im.copy(), f, FULL)
        if not os.path.exists(small_path):
            encode(im.copy(), small_path, SMALL)
        saved_after += os.path.getsize(f) + os.path.getsize(small_path)
        made += 1
        nw, nh = Image.open(f).size
        sw, sh = Image.open(small_path).size
        print(f"  {base:34s} {w}x{h} -> {nw}x{nh} + {sw}x{sh}  "
              f"{before//1024}KB -> {(os.path.getsize(f)+os.path.getsize(small_path))//1024}KB")

print(f"\\n{made} processed, {skipped} already sized")
if saved_before:
    print(f"weight: {saved_before//1024}KB -> {saved_after//1024}KB "
          f"({100 - saved_after*100//saved_before}% smaller, both variants included)")
`;

const dirs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const r = spawnSync("python3", ["-c", PY, ...(dirs.length ? dirs : ["src/assets/catalog"])], {
  stdio: "inherit",
});
process.exit(r.status ?? 1);
