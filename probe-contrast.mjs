import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto('http://127.0.0.1:8080/ru', { waitUntil: 'domcontentloaded' });
// Force every reveal to its settled state, so contrast is measured on what a
// reader actually sees rather than on a frame mid-animation.
await p.addStyleTag({ content: '*{opacity:1 !important;transform:none !important;}' });
await p.waitForTimeout(400);
const rows = await p.evaluate(() => {
  const lum = ([r, g, b]) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const rgb = (s) => s.match(/\d+/g).slice(0, 3).map(Number);
  const bgOf = (el) => {
    let n = el;
    while (n) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return rgb(c);
      n = n.parentElement;
    }
    return [255, 255, 255];
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return +((x + 0.05) / (y + 0.05)).toFixed(2);
  };
  const seen = new Map();
  for (const el of document.querySelectorAll('p,span,div,a,h1,h2,h3,li,button')) {
    const txt = el.textContent?.trim();
    if (!txt || el.children.length) continue;
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    const bold = +cs.fontWeight >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const r = ratio(rgb(cs.color), bgOf(el));
    const need = large ? 3 : 4.5;
    if (r < need) {
      const key = `${cs.color} on ${bgOf(el)} @${size}px`;
      if (!seen.has(key)) seen.set(key, { color: cs.color, size, ratio: r, need, sample: txt.slice(0, 30) });
    }
  }
  return [...seen.values()];
});
console.log(rows.length ? JSON.stringify(rows, null, 1) : 'No real contrast failures at settled opacity.');
await b.close();
