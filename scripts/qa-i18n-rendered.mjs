/**
 * Renders every page in every locale and looks for text that did not translate.
 *
 * `verify-i18n` checks the JSON files and the source: are the keys present in
 * all three locales, does every `t()` call resolve, is any English string
 * repeated verbatim across locales. All of that can pass while a reader still
 * sees something wrong, because the failure mode is at render time:
 *
 *   - a raw key leaking through as visible text — `tradein.sub` shipped on both
 *     brand pages in all three locales, because the key was stored as data in a
 *     card table rather than written as a literal `t("...")`, which put it out
 *     of reach of the source scan;
 *   - Russian surviving onto an English or Uzbek page, from a component that
 *     hardcoded a string instead of reaching for a key.
 *
 * 12 routes x 3 locales. Proper nouns are exempt — "Radiocom" and "Motorola"
 * are the same word in every language, and so is "сум" as a currency literal.
 *
 *   bun scripts/qa-i18n-rendered.mjs [baseUrl]
 */
import { chromium } from "playwright-core";
const BASE = process.argv[2] ?? "http://127.0.0.1:4173";
const b = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const ROUTES = [
  "",
  "/radiocom",
  "/motorola",
  "/poc",
  "/radiocom/rcd-70",
  "/radiocom/rcd-70/specs",
  "/service",
  "/compare",
  "/industries",
  "/industries/construction",
  "/search",
  "/sitemap",
];
// Proper nouns and technical literals that are the same in every language.
const OK_CYRILLIC = /^(RADIOCOM|Radiocom|Motorola|сум)$/;
let bad = 0;
for (const lang of ["ru", "en", "uz"]) {
  for (const r of ROUTES) {
    await p.goto(`${BASE}/${lang}${r}`, { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(350);
    const found = await p.evaluate((lang) => {
      const out = { keys: [], cyrillic: [] };
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walk.nextNode())) {
        const t = n.textContent.trim();
        if (!t) continue;
        // A raw key looks like `word.word` or `word.word.word` with no spaces.
        if (
          /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){1,3}$/.test(t) &&
          !/\.(uz|ru|com|webp|png|jpg)$/.test(t)
        )
          out.keys.push(t);
        if (lang !== "ru" && /[А-Яа-яЁё]/.test(t)) out.cyrillic.push(t.slice(0, 44));
      }
      return out;
    }, lang);
    const cyr = [...new Set(found.cyrillic)].filter(
      (x) => !/^(RADIOCOM|Radiocom|Motorola)$/.test(x.trim()),
    );
    const keys = [...new Set(found.keys)];
    if (keys.length || cyr.length) {
      bad += keys.length + cyr.length;
      console.log(`FAIL /${lang}${r || "/"}`);
      if (keys.length) console.log(`     raw keys: ${keys.slice(0, 6).join(" · ")}`);
      if (cyr.length)
        console.log(
          `     untranslated: ${cyr
            .slice(0, 6)
            .map((s) => JSON.stringify(s))
            .join(" · ")}`,
        );
    }
  }
}
await b.close();
process.exitCode = bad ? 1 : 0;
console.log(
  bad === 0
    ? `\nrendered i18n: ok — 36 page/locale combinations, no raw keys, no stray Cyrillic`
    : `\nrendered i18n: ${bad} problems`,
);
