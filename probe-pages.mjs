import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const slugs = ['horeca','construction','security','mining','transport','manufacturing'];
for (const s of slugs) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0,70)));
  await p.goto(`http://127.0.0.1:8080/ru/industries/${s}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));} });
  const r = await p.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim().slice(0,26),
    stats: document.querySelectorAll('dl dd').length,
    pains: document.querySelectorAll('ul li').length,
    products: document.querySelectorAll('article, a[href*="/catalog/"]').length,
    faq: document.querySelectorAll('button svg').length,
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
  }));
  const real = errs.filter(e => !e.includes("Unexpected token ':'"));
  console.log(`${s.padEnd(15)} h1=${String(r.h1).padEnd(20)} stats=${r.stats} pains=${r.pains} products=${r.products} overflow=${r.overflow} ${real.length?'ERR '+real[0]:''}`);
  await p.close();
}
await b.close();
