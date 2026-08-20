import { chromium } from 'playwright-core';
const [, , url, out, width, startSel, nth] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: +width, height: 1000 }, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.evaluate(async () => { const s = innerHeight*0.5;
  for (let y=0; y<document.body.scrollHeight; y+=s){scrollTo(0,y); await new Promise(r=>setTimeout(r,140));} scrollTo(0,0); });
await p.waitForTimeout(1000);
const box = await p.evaluate(([sel, n]) => {
  const el = document.querySelectorAll(sel)[+n];
  if (!el) return null;
  // capture this section plus the next two, i.e. the whole brand run
  let last = el; for (let i=0;i<2 && last.nextElementSibling;i++) last = last.nextElementSibling;
  const a = el.getBoundingClientRect(), z = last.getBoundingClientRect();
  return { x: 0, y: a.top + scrollY, width: innerWidth, height: (z.bottom + scrollY) - (a.top + scrollY) };
}, [startSel, nth]);
if (!box) { console.log('selector missed'); } else { await p.screenshot({ path: out, clip: box }); }
await b.close();
