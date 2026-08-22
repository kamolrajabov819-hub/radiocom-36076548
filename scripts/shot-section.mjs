import { chromium } from "playwright-core";
const [,, url, out, w, dpr] = process.argv;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: +w, height: 1100 }, deviceScaleFactor: +(dpr||1) });
await p.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await p.evaluate(async () => { const s=innerHeight*0.5;
  for(let y=0;y<document.body.scrollHeight;y+=s){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));} scrollTo(0,0); });
await p.waitForTimeout(1200);
// Frame the "Почему Radiocom" band by its eyebrow text
const el = await p.evaluateHandle(() => {
  const h = [...document.querySelectorAll("*")].find(n => n.textContent?.trim() === "Почему Radiocom");
  return h ? h.closest("section") : document.body;
});
await el.asElement().screenshot({ path: out });
await b.close();
console.log("wrote", out);
