import { chromium } from 'playwright-core';
const [, , url, out, width, mode] = process.argv;
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const page = await browser.newPage({
  viewport: { width: +width, height: 1000 },
  deviceScaleFactor: 2,
});
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

// Walk the page so every `whileInView` reveal and ScrollTrigger fires, then
// return to the top — otherwise a full-page shot captures un-revealed sections.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.6;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 400));
});
await page.waitForTimeout(900);
await page.screenshot({ path: out, fullPage: mode === 'full' });
if (errs.length) console.log('PAGE ERRORS:\n' + errs.slice(0, 5).join('\n'));
await browser.close();
