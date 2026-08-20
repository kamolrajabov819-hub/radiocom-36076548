import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const path of ['/ru', '/ru/poc', '/ru/service', '/ru/catalog', '/ru/industries/horeca']) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('http://127.0.0.1:8080' + path, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));} });
  const r = await p.evaluate(() => {
    // Left edge of the first text block inside each top-level section.
    const lefts = [...document.querySelectorAll('main section, main > div > section')].map(s => {
      const el = s.querySelector('h1,h2,h3,p,div');
      return el ? Math.round(el.getBoundingClientRect().left) : null;
    }).filter(v => v !== null && v >= 0 && v < 200);
    const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
    return { lefts: [...new Set(lefts)].sort((a,b)=>a-b), overflow, scrollW: document.documentElement.scrollWidth };
  });
  console.log(`${path.padEnd(24)} left edges: ${JSON.stringify(r.lefts).padEnd(28)} h-overflow: ${r.overflow} (${r.scrollW}px)`);
  await p.close();
}
await b.close();
