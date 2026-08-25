/**
 * Re-encode source photography to the three sizes the site actually serves.
 *
 * Every image goes to a 1600px full source plus 800px and 400px `srcSet`
 * candidates — the `src`/`srcSmall`/`srcTiny` trio `ProductShot` takes. The
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
 * Takes directories or individual files. A whole directory is the usual case;
 * naming files matters for `src/assets`, where most of the cutouts render far
 * wider than 400px and a tiny variant for them would be weight nobody fetches.
 *
 * Run: bun scripts/build-image-variants.ts [dir-or-file ...]
 */
import { spawnSync } from "node:child_process";

const PY = `
import sys, os, glob
from PIL import Image

FULL, SMALL, TINY, QUALITY = 1600, 800, 400, 82
dirs = sys.argv[1:] or ["src/assets/catalog"]

# JPEG for .jpg sources, WEBP for .webp. Mixing them would be worse than it
# sounds: the industry photographs are referenced by '.jpg' path from three
# call sites, and silently emitting WEBP bytes under a '.jpg' name works in
# every browser but breaks anything that trusts the extension.
def fmt(path):
    ext = os.path.splitext(path)[1].lower()
    if ext in (".jpg", ".jpeg"):
        return "JPEG", dict(quality=QUALITY, optimize=True, progressive=True)
    return "WEBP", dict(quality=QUALITY, method=6)

def encode(im, path, target):
    w, h = im.size
    if max(w, h) > target:
        scale = target / max(w, h)
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    f, opts = fmt(path)
    # Alpha is load-bearing for the cutouts, and flattening them onto white
    # would defeat the contact-shadow treatment they get on a tinted band --
    # but JPEG cannot carry it, so those sources are composited first.
    if f == "JPEG" and im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGB")
    im.save(path, f, **opts)
    return im.size

saved_before = saved_after = 0
made = skipped = 0

for d in dirs:
    if os.path.isfile(d):
        files = [d]
    else:
        files = []
        for ext in ("*.webp", "*.jpg", "*.jpeg"):
            files += glob.glob(os.path.join(d, ext))
    for f in sorted(files):
        base, ext = os.path.splitext(os.path.basename(f))
        # Skip the variants themselves. '@800' alone was not enough once '@400'
        # existed: a second run would have read 'x@400.webp' as a fresh source
        # and written 'x@400@800.webp' beside it, which is the opposite of the
        # idempotence this script promises.
        if base.endswith("@800") or base.endswith("@400"):
            continue
        stem = f[: -len(ext)]
        small_path, tiny_path = stem + "@800" + ext, stem + "@400" + ext
        im = Image.open(f)
        w, h = im.size
        before = os.path.getsize(f)

        # A 400w candidate as well as the 800w one. The smallest thing on
        # offer used to be 800w, and plenty of slots are far smaller than that
        # -- the model strip's chips are 104px, the product cards 260px. At
        # DPR 1 the browser now picks 400w; at DPR 2 it still picks 800w, so
        # nothing softens on a phone.
        if max(w, h) <= FULL and os.path.exists(small_path) and os.path.exists(tiny_path):
            skipped += 1
            continue

        saved_before += before
        if max(w, h) > FULL:
            encode(im.copy(), f, FULL)
        if not os.path.exists(small_path):
            encode(im.copy(), small_path, SMALL)
        if not os.path.exists(tiny_path):
            encode(im.copy(), tiny_path, TINY)
        after = sum(os.path.getsize(p) for p in (f, small_path, tiny_path))
        saved_after += after
        made += 1
        nw, nh = Image.open(f).size
        sw, sh = Image.open(small_path).size
        tw, th = Image.open(tiny_path).size
        print(f"  {os.path.basename(f):34s} {w}x{h} -> {nw}x{nh} + {sw}x{sh} + {tw}x{th}  "
              f"{before//1024}KB -> {after//1024}KB")

print(f"\\n{made} processed, {skipped} already sized")
if saved_before:
    print(f"weight: {saved_before//1024}KB -> {saved_after//1024}KB "
          f"({100 - saved_after*100//saved_before}% smaller, all variants included)")
`;

const dirs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const r = spawnSync("python3", ["-c", PY, ...(dirs.length ? dirs : ["src/assets/catalog"])], {
  stdio: "inherit",
});
process.exit(r.status ?? 1);
