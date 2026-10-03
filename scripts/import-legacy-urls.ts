/**
 * Bring the old site's real URLs into the redirect fixture.
 *
 * The fixture (`scripts/fixtures/legacy-urls.txt`) started from the slugs in
 * the brief, because the old sitemap could not be fetched from the build
 * environment. This reads the exports once they exist:
 *
 *   bun scripts/import-legacy-urls.ts seo-input/legacy/sitemap.xml \
 *     [seo-input/ahrefs/top-pages.csv] [seo-input/gsc/pages.csv] [--write]
 *
 * - Every `<loc>` in the sitemap that the fixture does not have yet is listed
 *   with where `resolveLegacy` sends it now. With `--write` they are appended
 *   to the fixture under a dated heading, so `bun run verify` checks them from
 *   then on. Review that section: the expected column is what the code does
 *   today, which is exactly what needs a human eye.
 * - Traffic exports (Ahrefs Top pages, Search Console pages — UTF-16 or UTF-8,
 *   comma or tab separated, English or Russian headers) are used for one
 *   thing: any URL that would answer 410 but still has traffic is flagged. The
 *   brief's rule is that such a URL goes to its nearest parent category
 *   instead; that is a decision per URL, made in `legacy-redirects.ts`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolveLegacy } from "../src/lib/legacy-redirects";

const FIXTURE = "scripts/fixtures/legacy-urls.txt";
const ORIGIN = "https://radiocom.uz";

const args = process.argv.slice(2);
const write = args.includes("--write");
const [sitemapPath, ...trafficPaths] = args.filter((a) => !a.startsWith("--"));
if (!sitemapPath) {
  console.error("usage: bun scripts/import-legacy-urls.ts <sitemap.xml> [traffic.csv …] [--write]");
  process.exit(2);
}

/** Text from a file in UTF-8 or UTF-16 (Ahrefs exports UTF-16 LE with a BOM). */
function readText(path: string): string {
  const buf = readFileSync(path);
  if (buf[0] === 0xff && buf[1] === 0xfe)
    return new TextDecoder("utf-16le").decode(buf.subarray(2));
  if (buf[0] === 0xfe && buf[1] === 0xff)
    return new TextDecoder("utf-16be").decode(buf.subarray(2));
  return new TextDecoder("utf-8").decode(buf).replace(/^\uFEFF/, "");
}

/** Path plus query of an old-site URL, or null for another host. */
function toPath(raw: string): string | null {
  try {
    const u = new URL(raw.trim(), ORIGIN);
    if (!/(^|\.)radiocom\.uz$/.test(u.hostname)) return null;
    return u.pathname + u.search;
  } catch {
    return null;
  }
}

function outcome(path: string): string {
  const url = new URL(path, ORIGIN);
  const r = resolveLegacy(url);
  if (r === "gone") return "gone";
  if (r === null) return url.pathname === "/" ? "/ru" : "(router)";
  return r.path;
}

// 1. The sitemap.
const xml = readText(sitemapPath);
const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) =>
  m[1].replace(/&amp;/g, "&"),
);
if (/<sitemapindex/i.test(xml))
  console.log(
    `note: ${sitemapPath} is a sitemap index — save each child sitemap and pass those instead`,
  );

const known = new Set(
  readText(FIXTURE)
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#"))
    .map((l) => l.split("\t")[0]),
);
const fresh = [
  ...new Set(locs.map(toPath).filter((p): p is string => p !== null && !known.has(p))),
];
const resolved = fresh.map((p) => ({ path: p, target: outcome(p) }));

console.log(`${locs.length} URLs in ${sitemapPath}; ${fresh.length} not yet in the fixture.`);
for (const r of resolved) console.log(`  ${r.target.padEnd(32)} ${decodeURIComponent(r.path)}`);
const routerOnly = resolved.filter((r) => r.target === "(router)");
if (routerOnly.length)
  console.log(
    `\n${routerOnly.length} URL(s) are not handled by legacy-redirects.ts at all and will reach the router — map them.`,
  );

// 2. Traffic: a 410 with visitors is a decision to revisit.
for (const path of trafficPaths) {
  const text = readText(path);
  const rows = text.split(/\r?\n/).filter(Boolean);
  const sep = rows[0].includes("\t") ? "\t" : rows[0].includes(";") ? ";" : ",";
  const cells = (line: string) => line.split(sep).map((c) => c.replace(/^"|"$/g, "").trim());
  const header = cells(rows[0]).map((h) => h.toLowerCase());
  const urlCol = header.findIndex((h) => /^(url|page|top pages|address|страница|адрес)/.test(h));
  const trafficCol = header.findIndex((h) => /(traffic|clicks|клики|трафик|визиты|visits)/.test(h));
  if (urlCol < 0) {
    console.log(`\n${path}: no URL column found in ${JSON.stringify(header)}; skipped`);
    continue;
  }
  const flagged = rows
    .slice(1)
    .map(cells)
    .map((c) => ({
      path: toPath(c[urlCol] ?? ""),
      traffic: trafficCol >= 0 ? Number((c[trafficCol] ?? "0").replace(/[^\d.]/g, "")) || 0 : 1,
    }))
    .filter((r): r is { path: string; traffic: number } => r.path !== null && r.traffic > 0)
    .filter((r) => outcome(r.path) === "gone");
  console.log(`\n${path}: ${flagged.length} URL(s) answer 410 but still get traffic`);
  for (const f of flagged.sort((a, b) => b.traffic - a.traffic))
    console.log(`  ${String(f.traffic).padStart(6)}  ${decodeURIComponent(f.path)}`);
}

// 3. Append to the fixture.
if (write && resolved.length) {
  const today = new Date().toISOString().slice(0, 10);
  const block = [
    "",
    `# Imported from ${sitemapPath} on ${today} — review the expected column`,
    ...resolved.map((r) => `${r.path}\t${r.target}`),
    "",
  ].join("\n");
  writeFileSync(FIXTURE, readText(FIXTURE).replace(/\n*$/, "\n") + block);
  console.log(`\nappended ${resolved.length} URL(s) to ${FIXTURE}`);
} else if (resolved.length) {
  console.log("\n(dry run — pass --write to append them to the fixture)");
}
