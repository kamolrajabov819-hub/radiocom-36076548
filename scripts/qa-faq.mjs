/**
 * FAQ acceptance gate.
 *
 * Checks the three things the old hand-rolled disclosures got wrong, across
 * every route that renders a FAQ in every locale:
 *
 *   1. ARIA wiring — aria-expanded, aria-controls pointing at a real element,
 *      and a heading wrapping the trigger.
 *   2. Keyboard operation — Enter opens, Enter closes (collapsible), and an
 *      open panel actually has height.
 *   3. The answer text is in the **server-rendered HTML** whether the row is
 *      open or shut. Both these pages ship FAQPage JSON-LD, and structured
 *      data whose answers are not in the DOM is what Google penalises.
 *
 * Usage: node scripts/qa-faq.mjs http://localhost:4173
 */
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://localhost:4173";
const SLUGS = ["horeca", "construction", "security", "mining", "transport", "manufacturing"];
const LOCALES = ["ru", "en", "uz"];
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const routes = [
  ...LOCALES.flatMap((l) => SLUGS.map((s) => `/${l}/industries/${s}`)),
  ...LOCALES.map((l) => `/${l}/service`),
];

const b = await chromium.launch({ executablePath: CHROME });
let fail = 0;
let checked = 0;
let rowsSeen = 0;

for (const route of routes) {
  const url = BASE + route;
  const problems = [];

  const html = await (await fetch(url)).text();

  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(400);

  const info = await p.evaluate(() => {
    const triggers = [...document.querySelectorAll("[data-faq] button[aria-expanded]")];
    return triggers.map((t) => {
      const panel = document.getElementById(t.getAttribute("aria-controls") || "");
      return {
        q: (t.textContent || "").trim().slice(0, 40),
        expanded: t.getAttribute("aria-expanded"),
        controls: !!t.getAttribute("aria-controls"),
        panelFound: !!panel,
        answer: panel ? (panel.textContent || "").trim().slice(0, 60) : "",
        headed: ["H2", "H3", "H4"].includes(t.parentElement?.tagName || ""),
      };
    });
  });

  if (!info.length) problems.push("no FAQ triggers found");
  rowsSeen += info.length;

  for (const r of info) {
    if (r.expanded === null) problems.push(`aria-expanded missing: ${r.q}`);
    if (!r.controls) problems.push(`aria-controls missing: ${r.q}`);
    if (!r.panelFound) problems.push(`aria-controls points at nothing: ${r.q}`);
    if (!r.headed) problems.push(`trigger not wrapped in a heading: ${r.q}`);
    if (r.answer && !html.includes(r.answer.slice(0, 30)))
      problems.push(`answer NOT in SSR html: ${r.q}`);
  }

  if (info.length) {
    const t0 = p.locator("[data-faq] button[aria-expanded]").first();
    await t0.focus();
    await p.keyboard.press("Enter");
    await p.waitForTimeout(450);
    if ((await t0.getAttribute("aria-expanded")) !== "true")
      problems.push("Enter did not open the row");
    await p.keyboard.press("Enter");
    await p.waitForTimeout(450);
    if ((await t0.getAttribute("aria-expanded")) !== "false")
      problems.push("Enter did not close the row (collapsible)");

    await p.keyboard.press("Enter");
    await p.waitForTimeout(550);
    const h = await p.evaluate(() => {
      const t = document.querySelector('[data-faq] button[aria-expanded="true"]');
      const panel = document.getElementById(t?.getAttribute("aria-controls") || "");
      return panel ? Math.round(panel.getBoundingClientRect().height) : -1;
    });
    if (h <= 0) problems.push(`open panel has no height (${h}px)`);
  }

  await p.close();
  checked++;
  if (problems.length) {
    fail++;
    console.log(`\n✗ ${route}`);
    for (const x of [...new Set(problems)]) console.log(`    ${x}`);
  }
}

await b.close();
console.log(`\n${checked} routes, ${rowsSeen} FAQ rows, ${fail} failing\n`);
process.exit(fail ? 1 : 0);
