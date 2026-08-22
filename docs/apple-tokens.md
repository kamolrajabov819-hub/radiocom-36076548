# Apple design tokens — extracted from the reference pages

Mined from the three `refs/apple/**/styles.css` captures (MacBook Air product page,
buy-macbook-pro, buy-mac-student). Frequency counts are occurrences in the real
stylesheet, so the top rows are what Apple actually leans on — not what a style guide
claims. Regenerate with the commands in "How this was extracted" at the bottom.

**This file exists so later phases don't re-parse 20 MB of CSS.** Read it instead.

## Palette

| Token | Value | Occurrences | Role |
|---|---|---|---|
| Ink | `#1d1d1f` | 64 | Primary text. Not black. |
| Secondary text | `#86868b` | 38 | Captions, footnotes, disabled |
| Band grey | `#f5f5f7` | 31 | The alternating section band |
| Tertiary text | `#6e6e73` | 22 | Sub-labels, legal |
| Hairline | `#d2d2d7` | 11 | Dividers, 1px rules, input borders |
| Dark surface text | `#424245` | 6 | Text on light grey inside dark contexts |
| Near-white | `#fbfbfd` | 5 | Very subtle raised surface |
| True black / white | `#000000` / `#ffffff` | 4 / 2 | Rare — dark bands and page ground |

**Radiocom deviation:** accent stays `#e30613` (`--signal`). Apple's link blue
(`#0066cc`) is never adopted. This is the one deliberate divergence from the reference.

The repo's `src/styles.css` already maps these: `--pitch` (white), `--charcoal`,
`--panel`, `--cool` (secondary), `--crisp` (ink), `--signal` (red).

## Type scale

Real `font-size` / `line-height` / `letter-spacing` / `font-weight` quadruples, ranked by
frequency. Note the tracking sign flip: **large type tightens (negative), small type
opens up (positive)**. That inversion is most of what makes the scale read as Apple.

| Size | Line height | Tracking | Weight | Count | Use |
|---|---|---|---|---|---|
| 17px | 1.47 | −0.022em | 400 | 8 | **Body copy.** The workhorse. |
| 17px | 1.24 | −0.022em | 400 | 14 | Tight body — captions under media |
| 12px | 1.33 | −0.01em | 400 | 17 | Legal, footnotes |
| 14px | 1.29 | −0.016em | 400 | 8 | Small UI label |
| 19px | 1.21 | +0.012em | 600 | 20 | Card headline |
| 21px | 1.19 | +0.011em | 600 | 24 | Card headline, large |
| 24px | 1.17 | +0.009em | 600 | 19 | Sub-section head |
| 28px | 1.14 | +0.007em | 600 | 18 | Section head, small |
| 32px | 1.125 | +0.004em | 600 | 13 | Section head |
| 40px | 1.10 | 0em | 600 | 10 | Section head, large |
| 48px | 1.08 | −0.003em | 600 | 12 | Display, small |
| 56px | 1.07 | 0em | 600 | 5 | Display |
| 64px / 80px | ~1.05 | negative | 600 | 5 / 2 | Hero display |

**The inflection is at 40px** — at and above it tracking goes to zero then negative;
below it stays positive. Body at 17px is the exception: strongly negative (−0.022em)
because it is set at a reading size where tight tracking aids the line, not a display size.

Weight is binary in practice: **400 for prose, 600 for anything that is a heading.**
No 500, no 700 in the captured pages.

## Geometry

**Container widths** (these are hard steps, not fluid):

| Width | Count | Role |
|---|---|---|
| 1068px | 566 | **The desktop content column.** The dominant one. |
| 734px | 639 | Tablet / small-desktop content column |
| 833px | 157 | Intermediate step |
| 980px | 9 | Legacy Apple column, still present |

**Breakpoints:** 320 / 480 / 734–735 / 833–834 / 1023 / 1068–1069 / 1441.
Apple pairs each container width with a breakpoint one pixel above it
(`734`/`735`, `1068`/`1069`) — the max-width and the media query are the same number.

**Radii:**

| Radius | Count | Use |
|---|---|---|
| 28px | 18 | **Large tiles**, bento cards, media panels |
| 18px | 2 | Standard card |
| 12px | 4 | Small card, inline media |
| 8px | 7 | Buttons, inputs |
| 980px | 3 | Pill buttons (the "infinite" radius idiom) |
| 50% | 18 | Circular controls — the `‹ ›` shelf arrows, close buttons |

The repo already uses `rounded-[28px]` on bento cards, which matches.

**Section rhythm:** the common vertical paddings are 96, 76, 50, 48, 40, 24px.
The repo's `section` (96/128px) and `section-tight` are in range; 76px is the value
Apple uses for the tighter band and has no repo equivalent yet.

## Motion

Apple's captured easings, by frequency:

| Curve | Count | Note |
|---|---|---|
| `cubic-bezier(0.4, 0, 0.6, 1)` | 234 + 78 | The dominant one. Symmetric ease-in-out. |
| `cubic-bezier(0, 0, 0.2, 1)` | 95 | Decelerate — entrances |
| `cubic-bezier(0.42, 0, 0.58, 1)` | 21 | Standard ease-in-out |

**Keep the repo's `cubic-bezier(0.22, 1, 0.36, 1)`.** It is a stronger decelerate than
Apple's `(0.4, 0, 0.6, 1)` and it is already applied consistently across `styles.css` and
`springs.ts`. The brief's Phase 6 specifies it explicitly. Swapping every easing to match
Apple's exactly would be a large diff for a difference almost nobody can perceive, and
would fight the existing system. Noted here only so the divergence is a decision on
record rather than an oversight.

Durations: 400–700ms. Entry animations fade-up only. No parallax stacking.
`prefers-reduced-motion` is handled globally at the bottom of `styles.css`.

## Layout patterns worth copying

From the rasterised screenshots (`refs/apple/screenshot-p*.png`):

- **Highlights shelf** (p4, p8) — horizontal scroll-snap row of equal-height cards,
  circular `‹ ›` arrows centred *below* the shelf, not overlaid on it. Cards are portrait
  (roughly 3:4). Overflow bleeds past the container to the viewport edge. This is the
  Phase 4 target for "Как проходит ремонт".
- **Asymmetric bento** (p2, p4) — mixed spans, never a uniform grid. Photos bleed to the
  rounded edge with no inner padding; text sits either above the photo or overlaid on it
  with a scrim. Cards carry a headline *and* a supporting line — never a bare noun.
- **Text-over-photo cards** (p2, "Apple at Work") — white text, centred, on a darkened
  photograph, with chevron links beneath.
- **Two-up product panels** (p8, "Switch to Mac") — equal cards, centred text at top,
  product photo bottom-anchored and `object-contain`. **This is exactly the Phase 2
  card-1 requirement** (image below text, horizontal, bottom-anchored).
- **Spec disclosure rows** (p1) — icon, short claim with the number coloured, `+` control
  bottom-right of the card.

## How this was extracted

```sh
CSS=refs/apple/macbookair13inchandmacbookair15inchapple.fullpage.Woblo/*/styles.css
grep -oE 'border-radius:[^;}]*' $CSS | sort | uniq -c | sort -rn
grep -oE 'max-width: *[0-9]+px' $CSS | grep -oE '[0-9]+' | sort -n | uniq -c | sort -rn
grep -oE 'font-size: *[0-9.]+px' $CSS | grep -oE '[0-9.]+' | sort -n | uniq -c | sort -rn
```

The type-triple table came from a Python pass that walks every `{...}` rule body and
pairs `font-size` with the `line-height` / `letter-spacing` / `font-weight` declared
alongside it. `refs/` is gitignored — re-unpack the zips to regenerate.
