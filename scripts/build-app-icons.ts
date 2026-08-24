/**
 * Crop the circular signal mark out of the wordmark lockup and emit a real
 * icon set from it.
 *
 * `public/favicon.png` was the full "RADIOCOM" wordmark squeezed into a 64x64
 * square — illegible past ~24px and the wrong shape for a home-screen tile.
 * The glyph the mark actually needs sits at the left edge of
 * `src/assets/radiocom-logo.webp` (600x105, native resolution — not upscaled
 * from the favicon), a clean circle with two signal arcs. This script crops
 * it out and resizes it into every size the manifest and the `<head>` link
 * tags need, plus one maskable variant with safe-zone padding for Android's
 * adaptive-icon mask.
 *
 * Run: bun scripts/build-app-icons.ts
 */
import { spawnSync } from "node:child_process";

const PY = `
from PIL import Image

SRC = "src/assets/radiocom-logo.webp"
# The mark's tight bounding box within the lockup, found by scanning columns
# for alpha content: it runs edge-to-edge on both axes (0-111, 0-104), with a
# clear gap before the "R" of the wordmark starts at column 144.
MARK_BOX = (0, 0, 112, 105)

src = Image.open(SRC).convert("RGBA")
mark = src.crop(MARK_BOX)

def flat_icon(size, pad_frac=0.06):
    """Transparent square canvas, mark centred and scaled to fill it minus pad."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    inner = round(size * (1 - 2 * pad_frac))
    scale = inner / max(mark.size)
    resized = mark.resize((round(mark.width * scale), round(mark.height * scale)), Image.LANCZOS)
    x = (size - resized.width) // 2
    y = (size - resized.height) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas

def maskable_icon(size, safe_frac=0.6):
    """Solid --pitch background, mark confined to the centred safe-zone circle."""
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    inner = round(size * safe_frac)
    scale = inner / max(mark.size)
    resized = mark.resize((round(mark.width * scale), round(mark.height * scale)), Image.LANCZOS)
    x = (size - resized.width) // 2
    y = (size - resized.height) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas.convert("RGB")

flat_icon(32).save("public/favicon.png", "PNG")
flat_icon(180).save("public/apple-touch-icon.png", "PNG")
flat_icon(192).save("public/icon-192.png", "PNG")
flat_icon(512).save("public/icon-512.png", "PNG")
maskable_icon(512).save("public/icon-512-maskable.png", "PNG")

print("  favicon.png            32x32   transparent")
print("  apple-touch-icon.png   180x180 transparent")
print("  icon-192.png           192x192 transparent")
print("  icon-512.png           512x512 transparent")
print("  icon-512-maskable.png  512x512 solid bg, 60% safe zone")
`;

const r = spawnSync("python3", ["-c", PY], { stdio: "inherit" });
process.exit(r.status ?? 1);
