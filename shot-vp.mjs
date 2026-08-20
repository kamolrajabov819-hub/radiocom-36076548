import { chromium } from 'playwright-core';
const [, , url, out, width, scrollTo] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: +width, height: 900 }, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.evaluate(async (y) => {
  for (let i = 0; i < y; i += 400) { scrollTo(0, i); await new Promise(r => setTimeout(r, 70)); }
  scrollTo(0, +y);
}, scrollTo || '0');
await p.waitForTimeout(900);
await p.screenshot({ path: out });
await b.close();
