/**
 * Cut the two logo-bearing studio shots into the alpha cutouts the home page
 * renders.
 *
 * The 17.09.26 upload is two photographs of a RADIOCOM radio wearing the
 * wordmark — a floating pair and a macro of the grille — replacing the two
 * frames on the home page whose radios carried no branding at all. Both arrive
 * as 1792x2400 JPEGs on a studio ground; both call sites need alpha.
 *
 * ── Why alpha, when one of them is `object-cover` ──────────────────────────
 *
 * The Trade-In card floats its radios over the card, so the need is obvious
 * there. The macro is less so: it fills a `bg-charcoal` tile edge to edge, and
 * a JPEG ground would simply *be* the tile's background. But `--charcoal` is
 * `#f5f5f7`, and the copy tile beside it is the same colour — so a cutout makes
 * the pair of tiles read as one continuous surface with a radio floating in it,
 * while a photograph's own blue-grey ground would put a slab of a different
 * light next to it. The cutout is the design; this keeps it.
 *
 * ── The matte ─────────────────────────────────────────────────────────────
 *
 * Same background model as `build-catalog-photos.ts`: diffuse a 7% border ring
 * inwards to estimate the ground, mark the subject where the frame departs from
 * that estimate, fill enclosed holes. The one difference is where the mask
 * lands — that script composites over white for a page that knocks white out
 * with `mix-blend-multiply`, and this one writes the mask to the alpha channel,
 * because `ProductShot`'s `cutout` mode wants a real channel and blending a
 * cutout is worse than a no-op (see `ProductShot.tsx`).
 *
 * Both of that script's hard-won guards earn their keep again here:
 *
 *  - **Ring-outlier rejection.** The macro's radio runs off the left and bottom
 *    edges of the frame, so part of the ring is subject, not ground — measured,
 *    the ring's luminance runs from 0 to 254 against a median of 213. Anything
 *    meaningfully darker than that median is treated as subject, which is the
 *    same fix the T42's battery covers needed.
 *  - **The cast-shadow gate, on the pair only.** The pair floats above a soft
 *    grey shadow, and `ProductShot` draws its own contact shadow under the
 *    cutout; keeping the photographed one would stack two. `lum < DARK` drops
 *    it. The macro has nothing in frame but the product, and that same gate
 *    cost it 10.8% of the frame — highlights at luminance 240, not shadow —
 *    which is why `shadow` is per-image rather than a constant.
 *  - **Dropping the specks.** What the gate leaves of the pair's shadow is
 *    three dense fragments, 3.33%, 0.42% and 0.21% of the mask against the
 *    subject's 96.03%. `largest_parts` keeps components within 10% of the
 *    biggest, which is a 29x gap to fall through rather than a tuned
 *    threshold.
 *
 * ── Framing ───────────────────────────────────────────────────────────────
 *
 * The macro is not cropped. Its source is 1792x2400, which at 1600 on the
 * longest edge is 1195x1600 — exactly the dimensions of the file it replaces,
 * so the tile's declared intrinsics stay true and nothing reflows.
 *
 * The pair *is* cropped to its subject, because the call site is
 * `object-contain` inside a `max-h` box: empty margin there is not breathing
 * room, it is the radios rendering smaller. `PAD` keeps the crop off the
 * silhouette.
 *
 * Sources live at `raw-catalog/`, gitignored, alongside the catalogue shoot.
 * They are in git history at `7b99165`, where they were uploaded.
 *
 * Run: bun scripts/build-logo-cutouts.ts
 * Then: bun scripts/build-image-variants.ts \
 *         src/assets/radio-macro-cutout.webp \
 *         src/assets/cutout/pair-floating-cutout.webp
 *
 * Name the two files. Handed a directory it walks the whole of it, and
 * `src/assets` holds a dozen images that have deliberately never had
 * variants — running it wide generates 25 files nothing imports.
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";

/**
 * `source under raw-catalog/` -> `destination path`.
 *
 * `crop` trims to the subject; `shadow` says the frame has a cast shadow to
 * throw away. Both are per-image because the two frames genuinely differ —
 * see the header.
 */
const JOBS = [
  {
    src: "raw-catalog/logo-macro.jpeg",
    dst: "src/assets/radio-macro-cutout.webp",
    crop: false,
    shadow: false,
    diff: 35,
  },
  {
    src: "raw-catalog/logo-pair-floating.jpeg",
    dst: "src/assets/cutout/pair-floating-cutout.webp",
    crop: true,
    shadow: true,
    diff: 18,
  },
];

const PY = `
import json, os, sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

JOBS = json.loads(sys.argv[1])
OUT, QUALITY = 1600, 88
# A pixel is product when it differs from the background model by the job's
# diff and, where the frame has a cast shadow, is darker than DARK. See
# build-catalog-photos.ts for the measurements behind both.
#
# diff is per-image because it has to clear each ground's own texture. The
# pair's is clean white and separates at 18. The macro's backdrop carries a
# soft out-of-focus smudge in the upper right which reads at d=24 -- inside an
# 18 threshold, so it came through as a grey cloud welded to the antenna, and
# being connected to the subject no component filter could reach it. The radio
# body sits at d=160, so 35 drops the smudge to 0.1% of its area while the body
# keeps 95%.
DARK, FEATHER = 215.0, 1.0
BLUR, PASSES = 3, 240
# Breathing room around a cropped subject, as a share of its longest side --
# enough that the crop never shaves an antenna tip or a soft edge.
PAD = 0.02

def alpha_for(im, shadow, diff):
    """The subject mask, as a float 0..1 array the size of the frame."""
    W, H = im.size
    s = im.resize((max(8, W // 8), max(8, H // 8)), Image.LANCZOS)
    a8 = np.asarray(s).astype(np.float32)
    h, w, _ = a8.shape
    b = max(3, int(min(h, w) * 0.07))
    ring = np.zeros((h, w), bool)
    ring[:b, :] = ring[-b:, :] = ring[:, :b] = ring[:, -b:] = True

    lum8 = 0.299 * a8[:, :, 0] + 0.587 * a8[:, :, 1] + 0.114 * a8[:, :, 2]
    known = ring & (lum8 >= np.median(lum8[ring]) - 12)
    if known.sum() < ring.sum() * 0.6:
        known = ring

    # Seed the unknown region from the known ground, not from the image.
    #
    # Diffusing from a copy of the frame means the model starts out holding the
    # subject's own pixels wherever it has no measurement, and only washes them
    # out if the subject is small enough for the ground to reach the middle.
    # These two frames are not: measured on the macro, whose radio fills over
    # half the frame and runs off two edges, the model came out with a minimum
    # luminance of 20 and a median of 119 -- it had memorised the radio, so the
    # radio no longer differed from it and the body came out full of holes.
    # Seeded from the mean of the known ground the same model reads min 199,
    # median 229, which is what a picture of the ground should look like.
    est = a8.copy()
    est[~known] = a8[known].mean(axis=0)
    for _ in range(PASSES):
        est = np.asarray(
            Image.fromarray(np.clip(est, 0, 255).astype(np.uint8))
                 .filter(ImageFilter.GaussianBlur(BLUR))
        ).astype(np.float32)
        est[known] = a8[known]
    bg = np.asarray(
        Image.fromarray(np.clip(est, 0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    ).astype(np.float32)

    a = np.asarray(im).astype(np.float32)
    d = np.abs(a - bg).max(axis=2)
    lum = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]
    # The DARK gate is only for a frame with a cast shadow to throw away.
    #
    # It costs the macro 10.8% of its frame: those pixels have a median
    # luminance of 240 against a median d of 52, which is not shadow, it is
    # the specular highlight running along the casing's mouldings. And because
    # that radio runs off the left and bottom edges, the holes it punched were
    # not enclosed, so fill_holes could not put them back -- the body came out
    # with ragged white bites taken from it. The macro has nothing in frame but
    # the product, so it needs no such gate.
    core = (d >= diff) & (lum < DARK) if shadow else (d >= diff)

    cm = Image.fromarray((core * 255).astype(np.uint8))
    cm = cm.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    solid = largest_parts(fill_holes(np.asarray(cm) > 127))
    return np.asarray(
        Image.fromarray((solid * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(FEATHER))
    ).astype(np.float32) / 255.0

def largest_parts(mask, keep=0.10):
    """Drop specks the matte kept that are not the product.

    The pair floats above a soft cast shadow, and the lum < DARK gate takes
    most of it but not the densest patches: measured on this frame, the mask
    came out as five connected components -- the two radios, touching, at
    96.03% of it, then three shadow fragments at 3.33%, 0.42% and 0.21%. On a
    white card those render as grey smudges under the radios.

    A 29x gap between the subject and the largest fragment is not a tolerance
    to tune, it is a different kind of thing, so this keeps every component
    within keep of the biggest and drops the rest. Two radios that did not
    touch would come out as two components near 48% each and both survive.
    """
    h, w = mask.shape
    seen = np.zeros_like(mask)
    out = np.zeros_like(mask)
    comps = []
    for sy in range(h):
        for sx in range(w):
            if not mask[sy, sx] or seen[sy, sx]:
                continue
            q = deque([(sy, sx)]); seen[sy, sx] = True; px = []
            while q:
                y, x = q.popleft(); px.append((y, x))
                for ny, nx in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True; q.append((ny, nx))
            comps.append(px)
    if not comps:
        return mask
    biggest = max(len(c) for c in comps)
    for c in comps:
        if len(c) >= biggest * keep:
            for y, x in c:
                out[y, x] = True
    return out

def fill_holes(mask):
    """True where mask is True or enclosed by it. BFS inward from the border."""
    h, w = mask.shape
    outside = np.zeros((h, w), bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if not mask[y, x] and not outside[y, x]:
                outside[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if not mask[y, x] and not outside[y, x]:
                outside[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):
            if 0 <= ny < h and 0 <= nx < w and not mask[ny, nx] and not outside[ny, nx]:
                outside[ny, nx] = True; q.append((ny, nx))
    return ~outside

for job in JOBS:
    src, dst, crop = job["src"], job["dst"], job["crop"]
    if not os.path.exists(src):
        raise SystemExit(
            f"missing upload: {src}\\n"
            "The sources are gitignored under raw-catalog/ and archived in git "
            "history at 7b99165. See the header of this file."
        )
    im = Image.open(src).convert("RGB")
    W, H = im.size
    alpha = alpha_for(im, job["shadow"], float(job["diff"]))

    rgba = np.dstack([np.asarray(im).astype(np.uint8),
                      (np.clip(alpha, 0, 1) * 255).astype(np.uint8)])
    out = Image.fromarray(rgba, "RGBA")

    if crop:
        ys, xs = np.where(alpha > 0.5)
        if not len(xs):
            raise SystemExit(f"{src}: the matte found no subject")
        pad = int(max(xs.max() - xs.min(), ys.max() - ys.min()) * PAD)
        box = (max(0, int(xs.min()) - pad), max(0, int(ys.min()) - pad),
               min(W, int(xs.max()) + 1 + pad), min(H, int(ys.max()) + 1 + pad))
        out = out.crop(box)

    w, h = out.size
    if max(w, h) > OUT:
        s = OUT / max(w, h)
        out = out.resize((round(w * s), round(h * s)), Image.LANCZOS)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    out.save(dst, "WEBP", quality=QUALITY, method=6)

    a = np.asarray(out)[:, :, 3]
    print(f"  {os.path.basename(dst):32s} {W}x{H} -> {out.size[0]}x{out.size[1]}"
          f"  transparent {100*(a<16).mean():.1f}%  opaque {100*(a==255).mean():.1f}%")
`;

const r = spawnSync("python3", ["-c", PY, JSON.stringify(JOBS)], { stdio: "inherit" });

if (r.status === 0) {
  // Drop the siblings of every master this run rewrote.
  //
  // `build-image-variants.ts` skips a file that already has both, so without
  // this a re-run leaves last run's @800 and @400 in place and the page serves
  // them: `srcSet` picks a variant at most viewport sizes, so the new artwork
  // would be invisible on almost every screen. That is exactly how the
  // whitened catalogue radios reached production; `build-catalog-photos.ts`
  // carries the same guard for the same reason.
  let dropped = 0;
  for (const { dst } of JOBS)
    for (const suffix of ["@800", "@400"]) {
      const path = dst.replace(/\.webp$/, `${suffix}.webp`);
      if (!existsSync(path)) continue;
      rmSync(path);
      dropped++;
    }
  console.log(`\n  dropped ${dropped} stale sibling(s). Now run:`);
  console.log("    bun scripts/build-image-variants.ts \\");
  for (const [i, { dst }] of JOBS.entries())
    console.log(`      ${dst}${i < JOBS.length - 1 ? " \\" : ""}`);
}
process.exit(r.status ?? 1);
