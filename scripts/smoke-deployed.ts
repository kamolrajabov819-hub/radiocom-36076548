/**
 * The deployed surface, checked over HTTP against a real Netlify deploy.
 *
 * Every other gate in this repo runs against the build directory or a local
 * preview. Three things are invisible from there, and all three are load-bearing:
 *
 *   - **Netlify Functions do not run locally.** `node .output/server/index.mjs`
 *     serves the static site and nothing else, so `/mcp` and `/mcp/health` have
 *     only ever been tested by importing the handler directly. Whether Netlify
 *     *routes* them — in particular the second entry of `config.path`'s array —
 *     is a question only a deploy can answer.
 *   - **`verify-agent-discovery` asserts the header exists in `netlify.toml`,
 *     not that Netlify applies it.** `/.well-known/api-catalog` has no file
 *     extension, so nothing can infer its type from the name; measured under the
 *     local node-server preset it comes back `text/plain; charset=utf-8`. RFC
 *     9727 is identified by `application/linkset+json` plus its profile
 *     parameter, so that header is doing real work that has never been observed
 *     doing it.
 *   - **A discovery document is a promise about URLs, not files.** The build
 *     gate proves each link's file exists in the output directory. Only this
 *     proves the published URL answers.
 *
 * Nothing here is hardcoded. The model count comes from `_catalog.json`, the
 * links come from the generated catalogue, and the expected tool list comes from
 * calling the local handler — so a green run also proves the deploy is *this*
 * commit rather than a stale one.
 *
 * Run:
 *   bun scripts/smoke-deployed.ts https://deploy-preview-26--radiocomuz.netlify.app
 *   bun scripts/smoke-deployed.ts https://radiocom.uz
 */
import { readFileSync } from "node:fs";
import handler from "../netlify/functions/mcp.mts";
import catalog from "../netlify/functions/_catalog.json" with { type: "json" };

const BASE = (process.argv[2] ?? "").replace(/\/+$/, "");
if (!BASE || !/^https?:\/\//.test(BASE)) {
  console.error("usage: bun scripts/smoke-deployed.ts <https://base-url>");
  process.exit(2);
}

let fail = 0;
const check = (label: string, cond: boolean, detail = "") => {
  console.log(`  ${cond ? "ok  " : "FAIL"} ${label}${cond ? "" : "  <- " + detail}`);
  if (!cond) fail++;
};

/** 20s is generous for a cold Netlify Function; a hang is a failure, not a wait. */
const get = (path: string, init: RequestInit = {}) =>
  fetch(BASE + path, { redirect: "follow", signal: AbortSignal.timeout(20_000), ...init });

/**
 * Re-anchor a published href onto the base being tested.
 *
 * The catalogue's hrefs are absolute `https://radiocom.uz/...` because
 * `SITE_URL` is baked in at generation time. Following them literally would
 * check production while reporting on a deploy preview — a green run that says
 * nothing about the thing just deployed. Only the path travels.
 */
const pathOf = (href: string) => new URL(href).pathname;

console.log(`\nsmoke-deployed: ${BASE}\n`);

// Pointing this at a local preview is a reasonable mistake to make, and the
// resulting wall of red looks alarming while meaning nothing. Say so up front.
if (/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/.test(BASE)) {
  console.log(
    "  note  this is a local preview, so the Netlify-only checks below will fail\n" +
      "        by design: Functions do not run here (every /mcp* path 404s) and\n" +
      "        Nitro serves the extensionless catalogue as text/plain. Run this\n" +
      "        against a deploy preview or production for a meaningful result.\n",
  );
}

/**
 * Preflight: prove the host is reachable before reporting on what it serves.
 *
 * Without this the script is actively misleading when it cannot get through.
 * Run from behind an egress proxy that denies the host, every request comes
 * back 403 with the proxy's own plain-text error page — and the checks below
 * dutifully report "served as text/plain, not application/linkset+json" and
 * "the deploy is serving a different build". Both read as findings about
 * Netlify. Neither request ever reached it.
 *
 * A wrong answer stated confidently is worse than no answer, so a failure here
 * stops the run rather than colouring the next eighteen lines red.
 */
{
  let reason = "";
  try {
    const res = await get("/");
    // A site that is up answers *something* coherent on `/` — 200 after the
    // locale redirect, or a redirect. A 403 or 5xx here is infrastructure, not
    // content.
    if (res.status >= 400) reason = `GET / returned ${res.status}`;
  } catch (e) {
    reason = e instanceof Error ? e.message : String(e);
  }
  if (reason) {
    console.log(`  STOP  cannot reach ${BASE} — ${reason}\n`);
    console.log(
      "        Nothing below would describe the deploy, so the run stops here.\n" +
        "        Check the URL, and whether this machine is behind a proxy or\n" +
        "        allowlist that blocks the host.\n",
    );
    process.exit(2);
  }
}

// 1. The API catalogue, and the media type that only a host can apply.
const localCatalogText = readFileSync("public/.well-known/api-catalog", "utf8");
const localCatalog = JSON.parse(localCatalogText);
{
  const res = await get("/.well-known/api-catalog");
  check("GET /.well-known/api-catalog returns 200", res.status === 200, String(res.status));

  const ct = res.headers.get("content-type") ?? "";
  check(
    "served as application/linkset+json (not text/plain or octet-stream)",
    ct.startsWith("application/linkset+json"),
    ct || "(no content-type)",
  );
  // The profile parameter is what distinguishes an RFC 9727 API catalogue from
  // any other linkset, so a bare `application/linkset+json` is only half right.
  check(
    "carries the RFC 9727 profile parameter",
    ct.includes("rfc-editor.org/info/rfc9727"),
    ct || "(no content-type)",
  );

  const body = await res.text();
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(body);
  } catch {
    /* reported by the next check */
  }
  check("body is parseable JSON", parsed !== null, body.slice(0, 120));
  check(
    "deployed catalogue matches the one in this commit",
    JSON.stringify(parsed) === JSON.stringify(localCatalog),
    "the deploy is serving a different build",
  );
}

// 2. Every link the catalogue promises actually answers.
//
//    This is the check the build gate cannot make. `resolves()` there maps a URL
//    back to a file in `public/`; here the question is whether the published URL
//    returns 200 from the host that serves it.
for (const entry of localCatalog.linkset as Array<Record<string, unknown>>) {
  for (const [rel, targets] of Object.entries(entry)) {
    if (rel === "anchor" || !Array.isArray(targets)) continue;
    for (const t of targets as Array<{ href: string }>) {
      const path = pathOf(t.href);
      const res = await get(path);
      check(`${rel} → ${path}`, res.ok, `${res.status}`);
    }
  }
}

// 3. The health endpoint, which is what the catalogue's `status` relation points
//    at — and the first time the second entry of `config.path` has been exercised.
{
  const res = await get("/mcp/health");
  check("GET /mcp/health returns 200", res.status === 200, String(res.status));

  const body = res.ok ? await res.json().catch(() => null) : null;
  check("health reports status ok", body?.status === "ok", JSON.stringify(body));
  check(
    `health reports ${catalog.products.length} models, matching _catalog.json`,
    body?.models === catalog.products.length,
    `${body?.models} vs ${catalog.products.length}`,
  );
  check(
    "health is not cacheable",
    (res.headers.get("cache-control") ?? "").includes("no-store"),
    res.headers.get("cache-control") ?? "(none)",
  );

  // The old `endsWith("/health")` form answered 405 here, which is a confusing
  // reply to what is plainly a health check.
  const slash = await get("/mcp/health/");
  check("GET /mcp/health/ (trailing slash) also 200", slash.status === 200, String(slash.status));
}

// 4. The MCP endpoint itself, over the wire rather than through an import.
{
  const rpc = async (payload: unknown) =>
    get("/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
      },
      body: JSON.stringify(payload),
    });

  const res = await rpc({ jsonrpc: "2.0", id: 1, method: "tools/list" });
  check("POST /mcp tools/list returns 200", res.status === 200, String(res.status));
  const json = res.ok ? await res.json().catch(() => null) : null;

  // Expected names come from the handler in this working tree, so this compares
  // the deploy against the code rather than against a number someone typed.
  const localRes = await handler(
    new Request("https://radiocom.uz/mcp", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
    }),
  );
  const expected = (
    (await localRes.json()) as { result?: { tools?: Array<{ name: string }> } }
  ).result?.tools
    ?.map((t) => t.name)
    .sort();
  const actual = (json?.result?.tools ?? []).map((t: { name: string }) => t.name).sort();
  check(
    `serves the same ${expected?.length ?? 0} tools this commit defines`,
    JSON.stringify(actual) === JSON.stringify(expected),
    `deployed [${actual}] vs local [${expected}]`,
  );

  const getMcp = await get("/mcp");
  check(
    "GET /mcp is 405 with an Allow header",
    getMcp.status === 405 && !!getMcp.headers.get("allow"),
    `${getMcp.status} allow=${getMcp.headers.get("allow")}`,
  );
}

// 5. The Link header and Markdown negotiation, which come from SSR middleware
//    rather than from `netlify.toml` — the fix in #24 after the header shipped
//    broken. `qa-link-header.mjs` covers this in depth against a local preview;
//    the two checks here just confirm the middleware survives the deploy.
{
  const res = await get("/ru");
  const link = res.headers.get("link") ?? "";
  check(
    "Link on /ru points describedby at /llms.txt",
    link.includes('<https://radiocom.uz/llms.txt>; rel="describedby"') ||
      link.includes('</llms.txt>; rel="describedby"'),
    link || "(no Link header)",
  );

  const md = await get("/ru", { headers: { accept: "text/markdown" } });
  check(
    "Accept: text/markdown returns Markdown",
    (md.headers.get("content-type") ?? "").includes("text/markdown"),
    md.headers.get("content-type") ?? "(none)",
  );
}

console.log(
  fail === 0
    ? `\nsmoke-deployed: ok — the deployed surface matches this commit`
    : `\nsmoke-deployed: ${fail} FAILURE(S) against ${BASE}`,
);
process.exit(fail ? 1 : 0);
