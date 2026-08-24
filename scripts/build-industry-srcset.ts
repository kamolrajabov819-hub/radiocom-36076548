/**
 * Emit an 800px `srcSet` candidate for the three IndustriesTeaser photos on
 * the home page.
 *
 * `industry-horeca.jpg`, `industry-construction.jpg` and `industry-security.jpg`
 * are 1400x900 sources shown in a 3:4 card that never needs more than ~460px
 * on desktop or the full mobile viewport width — every visitor was downloading
 * the full 1400px original regardless of screen size. Matches the `@800`
 * naming convention `build-image-variants.ts` already uses for the catalogue.
 *
 * Run: bun scripts/build-industry-srcset.ts
 */
import { spawnSync } from "node:child_process";

const PY = `
from PIL import Image

TARGET, QUALITY = 800, 82
NAMES = ["industry-horeca", "industry-construction", "industry-security"]

for name in NAMES:
    src = f"src/assets/{name}.jpg"
    dst = f"src/assets/{name}@800.jpg"
    im = Image.open(src)
    w, h = im.size
    scale = TARGET / max(w, h)
    small = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    small.save(dst, "JPEG", quality=QUALITY, optimize=True)
    print(f"  {name+'.jpg':32s} {w}x{h} -> {small.size[0]}x{small.size[1]}")
`;

const r = spawnSync("python3", ["-c", PY], { stdio: "inherit" });
process.exit(r.status ?? 1);
