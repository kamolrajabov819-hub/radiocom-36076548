import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://127.0.0.1:8080/ru', { waitUntil: 'domcontentloaded' });
await page.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80));} });
const out = await page.evaluate(() => {
  const img = [...document.querySelectorAll('img')].find(i => i.currentSrc.includes('rcd-front-back'));
  if (!img) return 'not found';
  const w = img.parentElement, plate = w.parentElement;
  const d = (el) => { const r = el.getBoundingClientRect(); const c = getComputedStyle(el);
    return { cls: el.className.slice(0,90), box: `${Math.round(r.width)}x${Math.round(r.height)}`,
             display: c.display, position: c.position, objectFit: c.objectFit, placeItems: c.placeItems }; };
  return { img: d(img), wrapper: d(w), plate: d(plate) };
});
console.log(JSON.stringify(out, null, 2));
await browser.close();
