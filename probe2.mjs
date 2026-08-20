import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto('http://127.0.0.1:8080/ru/poc', { waitUntil: 'domcontentloaded' });
console.log(JSON.stringify(await p.evaluate(() =>
  [...document.querySelectorAll('h2')].map(h => ({
    text: h.textContent.slice(0, 34),
    size: getComputedStyle(h).fontSize,
    cls: h.className.slice(0, 60),
  }))), null, 1));
await b.close();
