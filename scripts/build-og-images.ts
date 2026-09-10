/**
 * Compose the social preview card for every page type.
 *
 * A link to this site is most often opened in Telegram or WhatsApp — that is
 * how a catalogue URL actually travels in this market — and both render the
 * card from `og:image`. Before this, every one of the ~40 routes shared a
 * single `public/og-radiocom.jpg`, so a shared product link and a shared
 * service link were visually identical; and the product pages that *did*
 * override it pointed at a raw 1024x1024 catalogue `.webp` while the root's
 * `og:image:width`/`height` still declared 1200x630. A scraper told the wrong
 * dimensions either letterboxes the card or drops it.
 *
 * **No text is drawn.** Not for want of trying: the site's typeface ships as
 * `.woff2`, which Pillow cannot read, and converting it would mean adding
 * `fonttools` + `brotli` to an environment I cannot verify — the same reasoning
 * that kept `sharp` and `vite-imagetools` out. Falling back to DejaVu would put
 * a typeface on the card that appears nowhere on the site. So each card is the
 * photograph plus the real wordmark, and the words come from `og:title` and
 * `og:description`, which every scraper renders beside the image anyway. Text
 * baked into the picture would have been a second, worse copy of them.
 *
 * JPEG, not WebP: Telegram reads WebP, but several scrapers still do not, and a
 * social card that fails to decode is worse than one that is 40 KB larger.
 *
 * Outputs are committed artifacts under `public/og/`, like the `@800` variants.
 * This is not part of `bun run build` — it runs when the photography or the
 * catalogue changes:
 *
 *   bun scripts/build-og-images.ts
 *
 * Idempotent, and `verify-seo.ts` gate 21 fails the build if a route points at
 * a card that is missing or is not 1200x630.
 */
import { spawnSync } from "node:child_process";
import { publishedAnswers } from "../src/data/answers";
// Drafts get a card too: it costs one image and means publishing a page is a
// one-line move rather than a build step somebody forgets.
import { draftAnswers } from "../src/data/answers-draft";

const answers = [...publishedAnswers, ...draftAnswers];

/** Every non-product card, as `slug -> source image under src/assets/`. */
const PAGES: Record<string, string> = {
  home: "cutout/pair-floating-cutout.webp",
  radiocom: "cutout/lineup-seven-cutout.webp",
  motorola: "cutout/four-arranged-cutout.webp",
  compare: "cutout/hands-compare-cutout.webp",
  poc: "cutout/radios-fan-cutout.webp",
  service: "cutout/macro-display-cutout.webp",
  industries: "industry-construction.jpg",
  "industries-construction": "industry-construction.jpg",
  "industries-mining": "industry-mining.jpg",
  "industries-security": "industry-security.jpg",
  "industries-transport": "industry-transport.jpg",
  "industries-horeca": "industry-horeca.jpg",
  "industries-manufacturing": "industry-manufacturing.jpg",
  // The answers section. Each card reuses photography the site already ships —
  // `answers.ts` names the source per page, so the two cannot drift apart.
  answers: "cutout/radio-single-cutout.webp",
  ...Object.fromEntries(answers.map((a) => [`answers-${a.slug}`, a.ogCard])),
  search: "cutout/hands-scattered-cutout.webp",
  sitemap: "cutout/radio-single-cutout.webp",
};

// Product cards are discovered from `src/assets/catalog/` rather than by
// importing `products.ts`. That module's image fields are `@/assets/...`
// imports, so by the time a value is readable here Bun has already resolved it
// to a build URL — the source path this needs is exactly what is no longer
// there. The catalogue's filenames carry the slug (`rcd-70-hero.webp`,
// `rc-10-device.webp`), and `products.ts` derives `slug` from the same id, so
// the two agree by construction. Gate 21 fails the build if they ever stop.
const plan = JSON.stringify(PAGES);

const py = `
import json, os, re, sys
from PIL import Image

W, H = 1200, 630
MARGIN = 64
plan = json.loads(sys.argv[1])
src_root = "src/assets"
out_root = "public/og"
os.makedirs(out_root, exist_ok=True)

logo = Image.open("src/assets/radiocom-logo.webp").convert("RGBA")
LOGO_W = 150
logo = logo.resize((LOGO_W, max(1, round(logo.height * LOGO_W / logo.width))), Image.LANCZOS)

# Discover one card per model from the catalogue filenames.
import glob
for path in sorted(glob.glob(os.path.join(src_root, "catalog", "*.webp"))):
    name = os.path.basename(path)
    if "@800" in name:
        continue
    # Doubled backslash, deliberately: this Python lives inside a JS template
    # literal, which consumes a lone backslash before a non-escape character.
    # Written singly, the regex reaching Python matched any character where a
    # literal dot was meant. (No backticks in this block -- they would close
    # the template literal.)
    m = re.match(r"^(.*)-(hero|device)\\.webp$", name)
    if not m:
        continue
    slug = m.group(1)
    # '-hero' wins where a model has both; '-device' is the cropped strip shot.
    key = "product-" + slug
    if key in plan and m.group(2) == "device":
        continue
    plan[key] = os.path.join("catalog", name)

written, skipped = 0, []
for slug, rel in plan.items():
    path = os.path.join(src_root, rel)
    if not os.path.exists(path):
        skipped.append((slug, rel))
        continue
    card = Image.new("RGB", (W, H), (255, 255, 255))
    im = Image.open(path)
    if im.mode not in ("RGBA", "LA"):
        im = im.convert("RGB")

    # The subject gets the right two-thirds; the wordmark sits bottom-left, so
    # the left third stays clear rather than having the logo land on the photo.
    box_w, box_h = int(W * 0.62), int(H * 0.78)
    fitted = im.copy()
    fitted.thumbnail((box_w, box_h), Image.LANCZOS)
    x = W - MARGIN - fitted.width
    y = (H - fitted.height) // 2

    if fitted.mode in ("RGBA", "LA"):
        card.paste(fitted, (x, y), fitted)
    else:
        # A photograph with no alpha is a scene, not a product: let it bleed to
        # the right edge instead of floating on white with a visible seam.
        cover = im.copy()
        scale = max(W / cover.width, H / cover.height)
        cover = cover.resize((round(cover.width * scale), round(cover.height * scale)), Image.LANCZOS)
        left = (cover.width - W) // 2
        top = (cover.height - H) // 2
        card = cover.crop((left, top, left + W, top + H)).convert("RGB")
        # A white scrim behind the wordmark, or a dark photograph swallows it.
        scrim = Image.new("RGBA", (W, 190), (255, 255, 255, 0))
        for row in range(scrim.height):
            a = int(215 * (row / scrim.height) ** 1.6)
            for_row = Image.new("RGBA", (W, 1), (255, 255, 255, a))
            scrim.paste(for_row, (0, row))
        card = Image.alpha_composite(card.convert("RGBA"), 
                                     Image.new("RGBA", (W, H), (0, 0, 0, 0)))
        card.paste(scrim, (0, H - scrim.height), scrim)
        card = card.convert("RGB")

    card.paste(logo, (MARGIN, H - MARGIN - logo.height), logo)
    card.save(os.path.join(out_root, slug + ".jpg"), "JPEG", quality=88, optimize=True, progressive=True)
    written += 1

print(f"og: wrote {written} cards to {out_root}")
for slug, rel in skipped:
    print(f"  MISSING source for {slug}: {rel}")
if skipped:
    sys.exit(1)
`;

const r = spawnSync("python3", ["-c", py, plan], { stdio: "inherit" });
process.exit(r.status ?? 1);
