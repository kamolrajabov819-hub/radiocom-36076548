/**
 * Turn the 15.09.26 studio upload into the catalogue set the site renders.
 *
 * The upload is 53 photographs of two-way radios, all 2400x1792, all lit the
 * same way. It is the first internally consistent shoot this catalogue has had,
 * and it replaces photography with four measured faults: heroes that showed the
 * radio's back (`t42-blue`, `t42-triple`, `xt185`), heroes that showed a box
 * instead of the product (`t62-red`, `t82`, `tlkr-t92h2o`, `xt420`), a baked-in
 * `RADIOCOM` watermark on about a dozen frames, and five Radiocom models with no
 * standalone product shot at all — those rendered a kit flat-lay with the radio
 * crudely cropped back out of it for the model strip.
 *
 * Three transforms, in this order, and the order is load-bearing.
 *
 *  1. **Crop**, for the three frames with the studio rig in shot — a softbox,
 *     a C-stand and white flats.
 *
 *  2. **Matte.** The upload's ground is not white: it is a grey-lavender
 *     vignette, luminance 189-255, spreading up to 64 within a single frame.
 *     Every catalog `<img>` on this site is composited with
 *     `mix-blend-multiply` against a white page, so the grey has to go.
 *
 *     It goes by matting, and **the product's own pixels are never modified**.
 *     That is not a stylistic preference, it is the correction for how this
 *     shipped the first time. The first version divided each pixel by the
 *     background model — `pixel / bg * 255` — which does whiten the ground, but
 *     applies the same multiplier to the radio. Measured on the frames it
 *     mangled: the RCD-70's casing went from luminance 17.8 to 32.0, the
 *     RCD-60's from 18.4 to 34.6, and the RC-50's from 21.2 to **44.5** — more
 *     than doubled. Black radios rendered as grey ones and the whole catalogue
 *     looked washed out. Nobody asked for the photographs to be re-graded; the
 *     ask was to remove the background.
 *
 *     So: estimate the ground by diffusing a 7% border ring inwards, mark the
 *     product where the frame departs from that estimate, and composite the
 *     *original* pixels over white through that mask. Where alpha is 1 the
 *     output is the upload, byte for byte.
 *
 *     Crop has to come first or the rig poisons the border ring the model is
 *     built from. On `Motorola T42 Quad with box` that is the difference
 *     between a border minimum of 9 and of 178.
 *
 *  3. **Reframe**, which is what actually delivers "every radio in one
 *     position". The upload is a wide frame with a small subject — a single
 *     radio is about 450x1300 inside 2400x1792 — so used as shot it would
 *     render far smaller than the tight crops it replaces, and a single radio
 *     would not match a group shot. The subject is located at luma < 248 (easy,
 *     once the ground is white) and a square crop is taken that puts it at
 *     TARGET_H of the frame's height, or TARGET_W of its width where the
 *     subject is wider than it is tall. So every single radio lands at exactly
 *     the same size, and a group of four scales down only as far as its own
 *     width requires.
 *
 * Square output, because every catalog call site but two declares a square
 * intrinsic size, and `object-contain` everywhere means a square never
 * overflows a landscape or a portrait slot.
 *
 * Python through `spawnSync` rather than `sharp`, matching
 * `build-poc-cutouts.ts`: it keeps `bun.lock` untouched. PIL and numpy are
 * present; scipy, rembg and ImageMagick are not.
 *
 * The 53 originals live at `raw-catalog/` in the repo root, gitignored, and
 * they stay there: this script reads them on every run rather than consuming
 * them. They sit outside `src/assets/` deliberately — `inventory-assets.ts`
 * walks that tree and would list 53 camera files as site assets, and no clone
 * should carry ~5 MB of pixels no browser will ever request. They are also in
 * git history at `c02609c`, where they were uploaded, so to restore them:
 *
 *   mkdir -p raw-catalog
 *   git show --name-only --format= c02609c | while IFS= read -r f; do
 *     [ -n "$f" ] && git show "c02609c:$f" > "raw-catalog/$f"
 *   done
 *
 * Rewriting a master invalidates three files derived from it — its `@800` and
 * `@400` siblings and its `public/og/product-<slug>.jpg` card — and leaving
 * those behind is exactly how the whitened radios reached production. The
 * masters were corrected; the derivatives were not; and `srcSet` picks a
 * derivative at most viewport sizes, so the fix was invisible. Measured on the
 * files that shipped, the stale `@800` read luminance 16.4 where its own master
 * read 7.2.
 *
 * So this script deletes them, which turns two gates that already exist into
 * tripwires for that mistake: `verify-assets` requires every `@800`/`@400` that
 * `products.ts` imports to be on disk, and `verify-seo` gate 21 requires every
 * social card at exactly 1200x630. Skip the two follow-up commands and the
 * build fails loudly rather than shipping last week's pixels.
 *
 * Run: bun scripts/build-catalog-photos.ts
 * Then: bun scripts/build-image-variants.ts   (the @800/@400 siblings)
 *       bun scripts/build-og-images.ts        (the social cards)
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";

/**
 * `uploaded filename` -> `slug-variant`, built by looking at all 53 frames.
 *
 * The filenames do not always say which colour variant they are, and four of
 * them say the wrong thing, so this table follows the photographs:
 * `Motorola_T42_frontside` is the *triple*, while `…_Frontside_(2)` is the
 * single *blue*; `Motorola_T62_in_the_box` is *blue* and
 * `Motorola_T62_with_box` is *red*; and `Motorola_T82_Extreme_with_box` is the
 * *RSM* bundle — it is the only frame in the upload showing the two remote
 * speaker microphones, which is what distinguishes that SKU.
 *
 * `-hero` is the radio alone and front-facing, and the name matters beyond
 * documentation: `build-og-images.ts` globs this directory for `*-hero.webp`
 * to build each model's social card, and `verify-seo` gate 21 fails the build
 * if one is missing.
 */
export const PHOTO_MAP: Record<string, string> = {
  // ── Radiocom RCD ──
  "RCD - 70 PRO frontside.webp": "rcd-70-hero",
  "RCD - 70 PRO with box.webp": "rcd-70-box",
  "RCD - 60 PRO frontside.webp": "rcd-60-hero",
  "RCD - 60 PRO with box.webp": "rcd-60-box",
  "RCD - 50 PRO frontside.webp": "rcd-50-hero",
  "RCD - 50 PRO with box.webp": "rcd-50-box",
  "rcd-40-frontside.webp": "rcd-40-hero",
  "RCD - 40 PRO with box.webp": "rcd-40-box",
  "RCD -30 frontside.webp": "rcd-30-hero",
  "RCD - 30 with box.webp": "rcd-30-box",

  // ── Radiocom RC ──
  "RC -50 frontside.webp": "rc-50-hero",
  "RC - 50 with box.webp": "rc-50-box",
  "RC - 20 frontside.webp": "rc-20-hero",
  "RC - 20 with box.webp": "rc-20-box",
  "Rc -10 frontside.webp": "rc-10-hero",
  "RC -10 with box.webp": "rc-10-box",

  // ── Motorola T82 Extreme ──
  "motorola-t82-extreme-frontside.webp": "t82-extreme-hero",
  "motorola-t82-extreme-backside.webp": "t82-extreme-back",
  "motorola-t82-extreme-cornerside.webp": "t82-extreme-side",
  "motorola-t82-extreme cornerside.webp": "t82-extreme-pair",
  "motorola-t82-extreme-in the box.webp": "t82-extreme-case",
  "motorola-t82-extreme-with box and equipment.webp": "t82-extreme-box",

  // ── Motorola T82 Extreme Quad ──
  "motorola-talkabout-t82-extreme-quad frontside.webp": "t82-extreme-quad-hero",
  "motorola-talkabout-t82-extreme-quad backside.webp": "t82-extreme-quad-back",
  "motorola-talkabout-t82-extreme-quad with box.webp": "t82-extreme-quad-case",
  "motorola-talkabout-t82-extreme-quad with box and equipment.webp": "t82-extreme-quad-box",

  // ── Motorola T82 Extreme RSM — the two speaker mics identify it ──
  "Motorola T82 Extreme with box.webp": "t82-extreme-rsm-hero",

  // ── Motorola T82 ──
  "Motorola T82 frontside.webp": "t82-hero",
  "Motorola T82 corner side.webp": "t82-side",
  "Motorola T82 in the box.webp": "t82-case",
  "Motorola T82 with equipment.webp": "t82-box",

  // ── Motorola T72 ──
  "Motorola Talkabout T72 frontside.webp": "t72-hero",

  // ── Motorola T62 ──
  "Motorola T62 Red frontside.webp": "t62-red-hero",
  "Motorola T62 with box.webp": "t62-red-case",
  "Motorola T62 frontside.webp": "t62-blue-hero",
  "Motorola T62 in the box.webp": "t62-blue-case",

  // ── Motorola T42 ──
  "Motorola T42 frontside.webp": "t42-triple-hero",
  "Motorola T42 Triple corner side.webp": "t42-triple-side",
  "Motorola T42 backside.webp": "t42-triple-back",
  "motorola-talkabout-t42-triple with box.webp": "t42-triple-case",
  "Motorola T42 Quad front side.webp": "t42-quad-hero",
  "Motorola T42 quad backside.webp": "t42-quad-back",
  "Motorola T42 Quad with box.webp": "t42-quad-case",
  "Motorola T42 red Frontside .webp": "t42-red-hero",
  "Motorola T42 red corner side.webp": "t42-red-pair",
  "Motorola T42 Frontside (2).webp": "t42-blue-hero",
  "Motorola T42 corner side.webp": "t42-blue-pair",

  // ── Motorola TLKR T92 H2O ──
  "Motorola T92 H2O frontside.webp": "tlkr-t92h2o-hero",
  "Motorola T92 H2O all sides and with box.webp": "tlkr-t92h2o-views",

  // ── Motorola XT ──
  "Motorola XT 185 frontside.webp": "xt185-hero",
  "Motorola XT 420 frontside.webp": "xt420-hero",
  "Motorola XT 420 with box and equipment.webp": "xt420-box",
};

/**
 * Deliberately not in the map.
 *
 * `RCD - 70 PRO frontside (2).webp` is the same frame as
 * `RCD - 70 PRO frontside.webp` — different bytes, identical 744x1451 subject
 * box. A gallery that shows the same photograph twice reads as a mistake, so
 * it is named here rather than silently skipped. See `TODO-content.md`.
 */
export const SKIPPED: Record<string, string> = {
  "RCD - 70 PRO frontside (2).webp": "duplicate of RCD - 70 PRO frontside.webp",
};

/**
 * The older frames kept on purpose, and reframed rather than reprocessed.
 *
 * `InBox` in `ProductStory.tsx` pairs a model's parts list with
 * `gallery[gallery.length - 1]`, and these flat-lays — charger, earpiece, spare
 * battery, belt clip, laid out — are the photograph of precisely that list. The
 * 15.09.26 shoot has no equivalent for these nine models: its "with box" frames
 * show a sealed retail box, which is a different claim. They carry a `RADIOCOM`
 * watermark, which is the price of keeping them.
 *
 * They need no flatten — their grounds are already white, or alpha — but they
 * arrive at 1080x1080, 1280x960 and 1600x1200, so they are reframed to the same
 * square at the same subject scale as everything else. One aspect across the
 * whole catalogue means one honest `width`/`height` at every call site.
 */
export const KEPT = [
  "rcd-70-kit",
  "rcd-60-kit",
  "rcd-50-kit",
  "rcd-40-kit",
  "rcd-30-kit",
  "rc-50-kit",
  "rc-20-kit",
  "rc-10-kit",
  "t42-red-box",
  "t42-blue-box",
  "t62-blue-box",
  "t62-red-kit",
  "t72-box",
  "tlkr-t92h2o-kit",
  "xt185-kit",
];

const PY = `
import json, os, sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

SRC, DST = "raw-catalog", "src/assets/catalog"
OUT, QUALITY = 1600, 82
# Locate the subject on the flattened frame. The ground is 255 by then; 248
# leaves room for encoder noise without reaching into a contact reflection.
FIND = 248
# A single radio lands at TARGET_H of the frame height. A subject wider than it
# is tall is held to TARGET_W instead, so a four-radio group scales down only as
# far as its own width demands.
TARGET_H, TARGET_W = 0.82, 0.88
# A pixel is product when it differs from the background model by DIFF and is
# darker than DARK. See matte() for the measurement behind both.
DIFF, DARK, FEATHER = 18.0, 215.0, 1.0
# Diffusion parameters for the background model. A wide blur over few passes
# looked equivalent and ran six times faster, and for 52 of the 53 frames it
# was — but 'Motorola T42 Frontside (2).webp' carries the steepest vignette in
# the shoot (border luminance 189 at the top against 255 at the bottom), and at
# blur 6 the model could not follow it. It left a pale grey halo around the
# radio, and because the reframe locates the subject on the flattened image,
# that halo was read as subject: the crop came out 1601x2397 instead of
# 449x1292, so the radio also rendered smaller than every one of its siblings.
# A narrow blur propagated over many passes tracks the gradient instead —
# measured on that frame, the residual drops from 3.61% of the canvas to 0.19%
# and the subject box returns to 448x1276. 240 passes and 400 measure
# identically, so this is the cheaper of the two.
BLUR, PASSES = 3, 240

PHOTO_MAP = json.loads(sys.argv[1])
# Fractions of W/H. All three carry the studio rig — a softbox, a C-stand and
# white flats — in shot.
CROPS = {
    "Motorola T82 frontside.webp":                 (0.36, 0.26, 1.00, 1.00),
    "Motorola T42 Quad with box.webp":             (0.10, 0.34, 1.00, 1.00),
    "motorola-talkabout-t42-triple with box.webp": (0.06, 0.28, 0.93, 1.00),
}

def matte(im):
    """Cut the studio ground away. Never touch the product's own pixels."""
    W, H = im.size
    s = im.resize((max(8, W // 8), max(8, H // 8)), Image.LANCZOS)
    a8 = np.asarray(s).astype(np.float32)
    h, w, _ = a8.shape
    b = max(3, int(min(h, w) * 0.07))
    ring = np.zeros((h, w), bool)
    ring[:b, :] = ring[-b:, :] = ring[:, :b] = ring[:, -b:] = True

    # The ring is "known background" - but a subject that runs off the frame
    # sits inside it and would be matted away. That is not hypothetical: the two
    # battery covers in 'Motorola T42 corner side.webp' reach y=0.94H, just
    # inside a 7% ring. So reject the ring's own outliers instead of hand-tuning
    # a width per image: anything meaningfully darker than the ring's median is
    # subject, not ground.
    lum8 = 0.299 * a8[:, :, 0] + 0.587 * a8[:, :, 1] + 0.114 * a8[:, :, 2]
    known = ring & (lum8 >= np.median(lum8[ring]) - 12)
    if known.sum() < ring.sum() * 0.6:
        known = ring

    est = a8.copy()
    for _ in range(PASSES):
        est = np.asarray(
            Image.fromarray(np.clip(est, 0, 255).astype(np.uint8))
                 .filter(ImageFilter.GaussianBlur(BLUR))
        ).astype(np.float32)
        est[known] = a8[known]          # the border is measured, never guessed
    bg = np.asarray(
        Image.fromarray(np.clip(est, 0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    ).astype(np.float32)

    a = np.asarray(im).astype(np.float32)
    d = np.abs(a - bg).max(axis=2)
    lum = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]

    # Two conditions, and the second is what keeps the soft cast shadow out.
    # Measured on 'RCD - 70 PRO frontside.webp': pixels differing from the
    # background model by >= DIFF have a median luminance of 41 inside the
    # product and 238 in the shadow beside it, whose darkest pixel is 226. A
    # cast shadow on a light ground simply never gets as dark as a product.
    core = (d >= DIFF) & (lum < DARK)

    cm = Image.fromarray((core * 255).astype(np.uint8))
    cm = cm.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    # Fill enclosed holes, which is how a light body rides back in: the white
    # T42 casings are far above DARK, but they are ringed by the dark antenna,
    # seams and belt clip, so the silhouette closes around them.
    solid = fill_holes(np.asarray(cm) > 127)

    alpha = np.asarray(
        Image.fromarray((solid * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(FEATHER))
    ).astype(np.float32) / 255.0
    out = a * alpha[..., None] + 255.0 * (1.0 - alpha[..., None])
    return np.clip(out, 0, 255).astype(np.uint8)

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

def subject_box(a):
    lum = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]
    m = lum < FIND
    # 3x3 erode via shifted ANDs — drops encoder speckle without scipy.
    e = m[1:-1, 1:-1] & m[:-2, 1:-1] & m[2:, 1:-1] & m[1:-1, :-2] & m[1:-1, 2:]
    ys, xs = np.where(e)
    if len(xs) == 0:
        return None
    return int(xs.min()) + 1, int(ys.min()) + 1, int(xs.max()) + 2, int(ys.max()) + 2

os.makedirs(DST, exist_ok=True)
rows = []
for name, stem in sorted(PHOTO_MAP.items(), key=lambda kv: kv[1]):
    path = os.path.join(SRC, name)
    if not os.path.exists(path):
        raise SystemExit(
            f"missing upload: {path}\\n"
            "The originals are gitignored at raw-catalog/ and archived in git "
            "history at c02609c. See the header of this file for how to "
            "restore them."
        )
    im = Image.open(path).convert("RGB")

    if name in CROPS:
        l, t, r, b = CROPS[name]
        W, H = im.size
        im = im.crop((int(l * W), int(t * H), int(r * W), int(b * H)))

    flat = matte(im)
    box = subject_box(flat)
    if box is None:
        raise SystemExit(f"{name}: no subject found above luma {FIND}")
    x0, y0, x1, y1 = box
    sw, sh = x1 - x0, y1 - y0
    side = max(sh / TARGET_H, sw / TARGET_W)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2

    # Paste onto white rather than crop, so a subject that reaches the frame
    # edge gains padding instead of being cut.
    canvas = Image.new("RGB", (int(round(side)), int(round(side))), (255, 255, 255))
    canvas.paste(Image.fromarray(flat), (int(round(side / 2 - cx)), int(round(side / 2 - cy))))
    if canvas.size[0] != OUT:
        canvas = canvas.resize((OUT, OUT), Image.LANCZOS)
    canvas.save(os.path.join(DST, stem + ".webp"), "WEBP", quality=QUALITY, method=6)

    f = np.asarray(canvas).astype(np.float32)
    edge = np.concatenate([f[:12].reshape(-1, 3), f[-12:].reshape(-1, 3),
                           f[:, :12].reshape(-1, 3), f[:, -12:].reshape(-1, 3)])
    rows.append((stem, sw, sh, round(100 * sh / side), round(100 * sw / side),
                 round(float((0.299*edge[:,0] + 0.587*edge[:,1] + 0.114*edge[:,2]).min()))))

# ── second pass: reframe the kept frames, no flatten ──────────────────────
KEPT = json.loads(sys.argv[2])
for stem in KEPT:
    path = os.path.join(DST, stem + ".webp")
    if not os.path.exists(path):
        raise SystemExit(f"missing kept frame: {path}")
    im = Image.open(path)
    alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    im = im.convert("RGBA" if alpha else "RGB")
    arr = np.asarray(im).astype(np.float32)
    if alpha:
        # a cutout: the alpha channel already is the subject mask
        m = arr[:, :, 3] > 64
        e = m[1:-1,1:-1] & m[:-2,1:-1] & m[2:,1:-1] & m[1:-1,:-2] & m[1:-1,2:]
        ys, xs = np.where(e)
        box = (int(xs.min())+1, int(ys.min())+1, int(xs.max())+2, int(ys.max())+2) if len(xs) else None
    else:
        box = subject_box(arr[:, :, :3])
    if box is None:
        raise SystemExit(f"{stem}: no subject found")
    x0, y0, x1, y1 = box
    sw, sh = x1 - x0, y1 - y0
    side = max(sh / TARGET_H, sw / TARGET_W)

    # This pass reads and writes the same path, so a re-run would re-encode a
    # frame it has already framed. The geometry is stable - measured across
    # four frames, a second pass reproduced the subject box to the pixel - but
    # the WebP generation loss is not, and it accumulates on every run. On an
    # already-framed frame side recomputes to 1602 against OUT=1600, so
    # "square at OUT, and side within 1% of it" identifies that case exactly.
    if im.size == (OUT, OUT) and abs(side - OUT) / OUT < 0.01:
        rows.append((stem + " (kept, framed)", sw, sh,
                     round(100 * sh / side), round(100 * sw / side), -1))
        continue

    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    bg = (255, 255, 255, 0) if alpha else (255, 255, 255)
    canvas = Image.new("RGBA" if alpha else "RGB", (int(round(side)), int(round(side))), bg)
    canvas.paste(im, (int(round(side / 2 - cx)), int(round(side / 2 - cy))))
    if canvas.size[0] != OUT:
        canvas = canvas.resize((OUT, OUT), Image.LANCZOS)
    canvas.save(path, "WEBP", quality=QUALITY, method=6)
    rows.append((stem + " (kept, reframed)", sw, sh, round(100 * sh / side), round(100 * sw / side), -1))

print(f"  {'stem':<26}{'subject':>12}{'height':>8}{'width':>7}{'edge':>7}")
for r in rows:
    print(f"  {r[0]:<26}{str(r[1]) + 'x' + str(r[2]):>12}{str(r[3]) + '%':>8}{str(r[4]) + '%':>7}{('-' if r[5] < 0 else str(r[5])):>7}")
print(f"\\n  {len(rows)} written to {DST} at {OUT}x{OUT} ({len(rows) - len(KEPT)} from the shoot, {len(KEPT)} kept frames)")
`;

const r = spawnSync("python3", ["-c", PY, JSON.stringify(PHOTO_MAP), JSON.stringify(KEPT)], {
  stdio: "inherit",
});
if (r.status === 0) {
  // Every file derived from a master this run rewrote is now stale. Dropping
  // them here is what makes `verify` catch a half-finished regeneration — see
  // the note in the header on how the whitened radios reached production.
  let dropped = 0;
  const drop = (path: string) => {
    if (!existsSync(path)) return;
    rmSync(path);
    dropped++;
  };
  for (const stem of [...Object.values(PHOTO_MAP), ...KEPT]) {
    drop(`src/assets/catalog/${stem}@800.webp`);
    drop(`src/assets/catalog/${stem}@400.webp`);
    // `build-og-images.ts` builds one card per `*-hero.webp`, named for the
    // slug the stem carries.
    const hero = /^(.*)-hero$/.exec(stem);
    if (hero) drop(`public/og/product-${hero[1]}.jpg`);
  }
  console.log(`\n  dropped ${dropped} stale derivative(s). Now run:`);
  console.log("    bun scripts/build-image-variants.ts");
  console.log("    bun scripts/build-og-images.ts");
}
if (Object.keys(SKIPPED).length) {
  console.log(`\n  skipped ${Object.keys(SKIPPED).length}:`);
  for (const [f, why] of Object.entries(SKIPPED)) console.log(`    ${f} — ${why}`);
}
process.exit(r.status ?? 1);
