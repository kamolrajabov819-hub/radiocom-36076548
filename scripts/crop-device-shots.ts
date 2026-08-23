/**
 * Crop a kit flat-lay down to the radio inside it.
 *
 * The model strip on a brand page is apple.com's chip row: one device per chip,
 * so a reader can tell an RCD-70 from an RC-10 at a glance. Five Radiocom
 * models have no standalone product shot — the catalogue only has a kit
 * flat-lay — so those chips rendered a charger, a headset and two coiled cables
 * at 96px, and the row read as a jumble rather than a lineup.
 *
 * Inventing a photograph is out. Cropping the radio out of the photograph we
 * already have is not: it is the same image, framed on its subject.
 *
 * How it picks the radio: threshold to non-white, label connected components on
 * a 5x-downsampled mask, and score each component by `height x solidity`, where
 * solidity is filled area over bounding-box area. Height alone is not enough —
 * on the RCD-40 the coiled cable runs the full height of the composition and
 * beats the radio outright. Solidity is what separates a solid block of plastic
 * from a loop of wire.
 *
 * Outputs `<model>-device.webp` beside the source. Committed artifacts, like
 * the `@800` variants; re-run only if the source flat-lays change.
 *
 * Run: bun scripts/crop-device-shots.ts
 */
import { spawnSync } from "node:child_process";

const PY = `
from PIL import Image
from collections import deque

SCALE, WHITE, PAD = 5, 232, 0.06
SOURCES = ["rcd-40-kit", "rcd-30-kit", "rc-50-kit", "rc-20-kit", "rc-10-kit"]

for name in SOURCES:
    im = Image.open(f"src/assets/catalog/{name}.webp").convert("RGB")
    W, H = im.size
    sw, sh = W // SCALE, H // SCALE
    px = im.resize((sw, sh), Image.LANCZOS).load()
    mask = [[(px[x, y][0] < WHITE or px[x, y][1] < WHITE or px[x, y][2] < WHITE)
             for x in range(sw)] for y in range(sh)]

    seen = [[False] * sw for _ in range(sh)]
    best = None
    for y0 in range(sh):
        for x0 in range(sw):
            if not mask[y0][x0] or seen[y0][x0]:
                continue
            q = deque([(x0, y0)]); seen[y0][x0] = True
            minx = maxx = x0; miny = maxy = y0; area = 0
            while q:
                x, y = q.popleft(); area += 1
                minx = min(minx, x); maxx = max(maxx, x)
                miny = min(miny, y); maxy = max(maxy, y)
                for dx, dy in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(-1,-1),(1,-1),(-1,1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < sw and 0 <= ny < sh and mask[ny][nx] and not seen[ny][nx]:
                        seen[ny][nx] = True; q.append((nx, ny))
            if area < 40:
                continue
            w, h = maxx - minx + 1, maxy - miny + 1
            score = h * (area / (w * h))
            if best is None or score > best[0]:
                best = (score, minx, miny, maxx, maxy, area, w, h)

    score, minx, miny, maxx, maxy, area, w, h = best
    box = [minx * SCALE, miny * SCALE, (maxx + 1) * SCALE, (maxy + 1) * SCALE]
    padx = int((box[2] - box[0]) * PAD); pady = int((box[3] - box[1]) * PAD)
    box = [max(0, box[0] - padx), max(0, box[1] - pady),
           min(W, box[2] + padx), min(H, box[3] + pady)]

    out = im.crop(box)
    dst = f"src/assets/catalog/{name.replace('-kit', '')}-device.webp"
    out.save(dst, "WEBP", quality=88, method=6)
    print(f"  {name:14s} {W}x{H} -> {out.size[0]}x{out.size[1]}  solidity={area/(w*h):.2f}")
`;

const r = spawnSync("python3", ["-c", PY], { stdio: "inherit" });
process.exit(r.status ?? 1);
