/**
 * Every HTML page carries the `Link` header it promises.
 *
 * This check exists because the header shipped broken and nothing noticed. It
 * was declared in `netlify.toml`, a scan of the live site found no `Link`
 * header at all, and the two likely reasons — Netlify documents `[[headers]]`
 * for static assets rather than SSR responses, and the globs were `/ru/*`,
 * which does not match the canonical homepage `/ru` — were both invisible from
 * a local build.
 *
 * So this asserts against a running server, on the exact paths that failed:
 * the bare locale roots, not just nested pages.
 *
 * Run: node scripts/qa-link-header.mjs [baseUrl]
 */
const BASE = process.argv[2] ?? "http://localhost:4173";
const PATHS = ["/ru", "/en", "/uz", "/ru/radiocom", "/ru/service", "/ru/industries/construction"];
const EXPECTED_LLMS = { ru: "/llms.txt", en: "/llms.en.txt", uz: "/llms.uz.txt" };

let fail = 0;
const bad = (m) => {
  console.log("  FAIL " + m);
  fail++;
};

for (const path of PATHS) {
  const res = await fetch(BASE + path, { redirect: "follow" });
  const link = res.headers.get("link");
  const lang = path.split("/")[1];

  if (!link) {
    bad(`${path}: no Link header`);
    continue;
  }
  if (!link.includes(`<${EXPECTED_LLMS[lang]}>; rel="describedby"`)) {
    bad(`${path}: describedby should point at ${EXPECTED_LLMS[lang]} — got ${link}`);
    continue;
  }
  if (!link.includes(`rel="alternate"; type="text/markdown"`)) {
    bad(`${path}: no Markdown alternate — got ${link}`);
    continue;
  }
  console.log(`  ok   ${path.padEnd(30)} ${link.slice(0, 62)}…`);
}

// The Markdown representation must not advertise itself as its own alternate.
{
  const res = await fetch(`${BASE}/ru/radiocom`, { headers: { accept: "text/markdown" } });
  const link = res.headers.get("link") ?? "";
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("text/markdown")) bad(`Accept: text/markdown returned ${ct}`);
  else if (link.includes('rel="alternate"'))
    bad("the Markdown response advertises a Markdown alternate of itself");
  else console.log("  ok   markdown response carries describedby, not a self-alternate");
}

console.log(
  fail === 0
    ? `\nqa-link-header: ok — Link header on ${PATHS.length} routes, correct llms.txt per locale`
    : `\nqa-link-header: ${fail} problem(s)`,
);
process.exit(fail ? 1 : 0);
