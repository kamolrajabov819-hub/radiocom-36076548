/**
 * Normalise the four PoC uploads into the cutout set the rest of the site uses.
 *
 * The files arrived from the image generator as `Hand_holding_two-way_radio_2K_…`
 * and friends — 1.8-2.7k originals, no `@800` candidate, and one name carrying a
 * literal `…` (U+2026), which is legal in a Vite import specifier and a trap for
 * whoever next has to type it.
 *
 * Two real problems beyond the naming:
 *
 *  1. **A sparse alpha veil.** Three of the four carry scattered pixels of alpha
 *     16-63 spread to the canvas edges — WebP's lossy alpha, not a background.
 *     It is invisible composited on white, but it defeats `getbbox()` entirely:
 *     every one of those three reports a bounding box of the full canvas, so
 *     nothing downstream can tell where the subject actually is.
 *
 *  2. **Wildly different subject scale**, which is the visible fault. Measured
 *     against a mask of alpha >= 64, the subject fills 36% of the canvas on the
 *     four-radio fan and 84% on the close hand — so dropped into equally sized
 *     slots, one radio renders at roughly half the weight of the other and the
 *     row reads as four unrelated stock photos.
 *
 * The threshold is 64 because that is where the bounding box stops moving:
 * across 16 -> 128 the surviving pixel count changes by 0.3 points (all veil)
 * while the fan's box collapses from 100% of the canvas to 36% and then holds
 * (1267px wide at 64, 1265px at 128). It is used only to *locate* the subject —
 * the crop is taken from the untouched original, so antialiased edges and the
 * contact shadows survive. A gentle alpha floor of 8 afterwards clears the veil
 * from the output without biting into a real soft edge.
 *
 * Run: bun scripts/build-poc-cutouts.ts
 */
import { spawnSync } from "node:child_process";

const PY = `
import glob, os
from PIL import Image

SRC = "src/assets"
DST = "src/assets/cutout"
FULL, SMALL, QUALITY = 1600, 800, 88
# Locate the subject with this; never write it.
FIND = 64
# Clear the veil from the output with this; soft edges live well above it.
FLOOR = 8
# Breathing room around the subject, as a share of its longest side. The site's
# own slots supply the real spacing — this only stops the crop shaving a
# contact shadow.
PAD = 0.02

# (substring that identifies the upload, destination stem)
WANT = [
    ("mac-apple",  "poc-handover-box-cutout"),
    ("202608211203", "poc-radio-in-hand-cutout"),
    ("Four_black", "poc-fleet-fan-cutout"),
    ("202608242222.webp", "poc-radio-held-cutout"),
]

def pick(fragment):
    hits = [p for p in glob.glob(os.path.join(SRC, "*.webp"))
            if fragment.lower() in os.path.basename(p).lower()]
    # "202608242222.webp" must not also match the handover file, which carries
    # the same trailing stamp; the longest basename is always the other one.
    hits = [h for h in hits if "mac-apple" not in os.path.basename(h).lower()] or hits
    if len(hits) != 1:
        raise SystemExit(f"expected exactly one match for {fragment!r}, got {hits}")
    return hits[0]

os.makedirs(DST, exist_ok=True)
for fragment, stem in WANT:
    src = pick(fragment)
    im = Image.open(src).convert("RGBA")
    W, H = im.size

    mask = im.getchannel("A").point(lambda v: 255 if v >= FIND else 0)
    box = mask.getbbox()
    if box is None:
        raise SystemExit(f"{src}: no subject above alpha {FIND}")

    pad = int(max(box[2] - box[0], box[3] - box[1]) * PAD)
    box = (max(0, box[0] - pad), max(0, box[1] - pad),
           min(W, box[2] + pad), min(H, box[3] + pad))

    out = im.crop(box)
    # Drop the residual veil so the file is a clean cutout on any surface.
    a = out.getchannel("A").point(lambda v: 0 if v < FLOOR else v)
    out.putalpha(a)

    def save(img, target, path):
        w, h = img.size
        if max(w, h) > target:
            s = target / max(w, h)
            img = img.resize((round(w * s), round(h * s)), Image.LANCZOS)
        img.save(path, "WEBP", quality=QUALITY, method=6)
        return img.size

    big = save(out.copy(), FULL, os.path.join(DST, f"{stem}.webp"))
    sml = save(out.copy(), SMALL, os.path.join(DST, f"{stem}@800.webp"))
    os.remove(src)

    print(f"  {stem:26s} {W}x{H} -> crop {box[2]-box[0]}x{box[3]-box[1]} "
          f"({100*(box[2]-box[0])*(box[3]-box[1])//(W*H)}% of canvas) -> {big[0]}x{big[1]} + {sml[0]}x{sml[1]}")
`;

const r = spawnSync("python3", ["-c", PY], { stdio: "inherit" });
process.exit(r.status ?? 1);
