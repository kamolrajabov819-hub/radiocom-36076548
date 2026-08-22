/**
 * Full-page screenshot for design review.
 *
 * Scrolls the page, then **forces every image to finish decoding** before
 * capturing. Without that last step a full-page screenshot is not trustworthy:
 * Chromium resizes the viewport to stitch the capture, which can re-arm
 * `loading="lazy"` images that had already been scrolled into view, and they
 * photograph as empty boxes. That produced a "broken image" that was not
 * broken at all.
 *
 * Usage: node scripts/shot-page.mjs <url> <out.png> [width] [dpr]
 */
import { chromium } from "playwright-core";

const [, , url, out, width = "1440", dpr = "1"] = process.argv;
if (!url || !out) {
  console.error("usage: node scripts/shot-page.mjs <url> <out.png> [width] [dpr]");
  process.exit(1);
}

const b = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const p = await b.newPage({
  viewport: { width: +width, height: 1100 },
  deviceScaleFactor: +dpr,
});

const errors = [];
p.on("pageerror", (e) => errors.push(String(e).slice(0, 140)));

await p.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

await p.evaluate(async () => {
  const step = innerHeight * 0.4;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 160));
  }
  scrollTo(0, 0);
});

// Take lazy images out of the equation entirely, then wait for the decode.
await p.evaluate(async () => {
  for (const i of document.images) i.loading = "eager";
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  await document.fonts.ready;
});
await p.waitForTimeout(900);

await p.screenshot({ path: out, fullPage: true });
await b.close();

console.log(`wrote ${out}${errors.length ? `  (${errors.length} page errors: ${errors[0]})` : ""}`);
