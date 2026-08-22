/**
 * IndexNow ping — tells Bing and Yandex the sitemap changed, immediately.
 *
 * Yandex is the reason this exists. It carries real share in Uzbekistan, and
 * both it and Bing accept IndexNow; Google does not participate, so this is
 * additive to the sitemap rather than a replacement for it. A normal crawl
 * cycle for a small regional site is days to weeks — IndexNow is minutes.
 *
 * The key is self-issued: any hex string, published at `/<key>.txt` containing
 * itself, proves control of the host. No console registration, no secret. It is
 * checked into `public/` deliberately — a key that is not publicly fetchable
 * fails verification, so there is nothing to protect.
 *
 * GATED ON DEPLOY. Netlify sets `CONTEXT=production` on a production build and
 * something else on a branch or preview build. Without that check every local
 * `bun run build` would announce the site to two search engines, which is spam
 * and would eventually get the key throttled.
 *
 * FAILS SOFT, ALWAYS. A search engine being slow must never fail a deploy —
 * the sitemap still exists and the site still ships. Every outcome is logged.
 *
 * Run by `bun run build` after the sitemap is finalized.
 * Force a run locally with: INDEXNOW=1 bun scripts/indexnow.ts
 */
import { readFile } from "node:fs/promises";
import { SITE_URL } from "../src/lib/seo";

const KEY = "522cb0c8834b9e0950503fc0e99cbed8";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const HOST = new URL(SITE_URL).host;

const forced = process.env.INDEXNOW === "1";
const isProductionDeploy = process.env.CONTEXT === "production";

if (!forced && !isProductionDeploy) {
  console.log("indexnow: skipped (not a production deploy; set INDEXNOW=1 to force)");
  process.exit(0);
}

const sitemap = await readFile(".output/public/sitemap.xml", "utf8").catch(() => null);
if (!sitemap) {
  console.log("indexnow: skipped — .output/public/sitemap.xml not found");
  process.exit(0);
}

// Page URLs only. <image:loc> entries are also <loc>-shaped, and submitting
// image files as pages is exactly the kind of noise that gets a key throttled.
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (!urls.length) {
  console.log("indexnow: skipped — sitemap contains no page URLs");
  process.exit(0);
}

// The API caps a batch at 10,000; this site is at 165 and will not approach it,
// but chunking costs three lines and removes the failure mode entirely.
const CHUNK = 10_000;
let ok = 0;
let failed = 0;

for (let i = 0; i < urls.length; i += CHUNK) {
  const batch = urls.slice(i, i + CHUNK);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `${SITE_URL}/${KEY}.txt`,
        urlList: batch,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    // 200 accepted, 202 accepted-but-key-pending. Anything else is informative
    // but not fatal.
    if (res.ok) ok += batch.length;
    else {
      failed += batch.length;
      console.log(`indexnow: endpoint returned ${res.status} ${res.statusText}`);
    }
  } catch (e) {
    failed += batch.length;
    console.log(`indexnow: ping failed — ${e instanceof Error ? e.message : String(e)}`);
  }
}

console.log(
  failed
    ? `indexnow: ${ok}/${urls.length} url(s) submitted, ${failed} not — deploy continues regardless`
    : `indexnow: submitted ${ok} url(s) for ${HOST}`,
);
