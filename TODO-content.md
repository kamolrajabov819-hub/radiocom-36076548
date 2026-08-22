# Content and assets needed from you

Everything here is a decision or an asset I deliberately did **not** invent. Nothing on
this list is blocking a phase unless it says so.

## Photography

| Slot | What is there now | What is needed |
|---|---|---|
| Home → "Почему Radiocom" → warranty tile | `product/radio-kit-wide.webp` | **The source photo has the charging cable cropped in half at the bottom-left edge.** It is not a layout bug — the crop is baked into the 1600×900 original. A re-crop with the cable either fully in or fully out would fix it. |
| Everywhere | 55 × `.asset.json` CDN pointers | These resolve to `radiocom.lovable.app` and exist nowhere in this repo. They render in production today. If that Lovable project is ever unpublished, deleted or rate-limited they vanish from the Netlify site with no local copy. See "CDN assets" below. |

## CDN assets — a decision I need from you

~70 images (all product photography, the logo, the catalogue PDF) are `.asset.json`
pointers to Lovable's CDN rather than files in the repo. The brief called localising them
optional, and it is — but two things make it worth deciding now:

1. **They cannot get responsive variants while they are remote.** Phase 1 gave the six
   local WebP files real `srcset` pairs. The CDN images cannot have the same treatment,
   so the product photography — the heaviest images on the site — ships one size to every
   device.
2. **They are a single point of failure outside this repository.**

I could not localise them myself: this sandbox's network policy blocks
`radiocom.lovable.app`, so I cannot download them. **This needs to run somewhere with
access to that host.** Say the word and I will write the script (walk
`src/assets/**/*.asset.json`, fetch each `url`, write the binary alongside, swap the
import, verify byte-for-byte before deleting any pointer).

## Copy reserved from the deleted Brands section

Phase 2 deleted `BrandsStrip` and its `brands.*` i18n keys as instructed. The Russian
copy was good and Phase 5's brand pages want it, so it is parked verbatim in
`docs/_brands-copy-reserved.json` (all three locales) rather than thrown away —
`rc_desc`, `mot_desc`, `official`, `headline`, `sub`, `view`, `models`.

## Still to confirm

- **Prices.** No product page can show "От N сум" until real prices exist in
  `src/data/products.ts`. Currently absent. Phase 5 will leave the price slot empty and
  list every missing model here rather than ship a placeholder number.
- **`seo-dataforseo` credentials** — the skill is installed but inert. Phase 7 will use
  the free-tier paths unless you supply a key.
