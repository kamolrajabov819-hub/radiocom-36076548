/**
 * The agent-discovery documents must describe things that exist.
 *
 * This gate exists because the last round shipped two defects that nothing
 * caught, and both were the same kind of mistake — a document that *looked*
 * right and was not checked against reality:
 *
 *   - `ai-catalog.json` used `id` where the ARD spec requires `identifier`, so
 *     a scanner reported "entry 0 is missing identifier" and every entry was
 *     invalid. The file was well-formed JSON, served with the right headers, and
 *     completely useless.
 *   - The `Link` header was declared in `netlify.toml` and never reached the
 *     page. Nothing asserted it, so nothing noticed.
 *
 * The rule these documents live by is "publish only what exists": a discovery
 * document is a promise, and an agent that follows a `urn:air:` identifier to a
 * 404 is worse served than one that found no document at all. That rule was a
 * comment in TODO-content.md. Here it is a build failure.
 *
 * Run: bun scripts/verify-agent-discovery.ts
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { SITE_URL } from "../src/lib/seo";

let fail = 0;
const bad = (m: string) => {
  console.log("FAIL " + m);
  fail++;
};

const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));

/**
 * Map a published URL back to the file this build emits for it.
 *
 * `/mcp` is the exception: it is a Netlify Function, not a file, so it is
 * checked against the function source instead.
 */
function resolves(url: string): boolean {
  if (!url.startsWith(SITE_URL)) return false;
  const path = url.slice(SITE_URL.length) || "/";
  if (path === "/mcp") return existsSync("netlify/functions/mcp.mts");
  if (path === "/") return true;
  return existsSync(`public${path}`);
}

// 1. ARD manifest — every entry valid per the spec's section 4.2.
{
  const p = "public/.well-known/ai-catalog.json";
  if (!existsSync(p)) bad(`${p} is missing — run scripts/generate-seo.ts`);
  else {
    const doc = read(p);
    const problems: string[] = [];
    if (!doc.specVersion) problems.push("no specVersion");
    if (!doc.host?.url) problems.push("no host.url");
    if (!Array.isArray(doc.entries) || !doc.entries.length) problems.push("no entries");

    (doc.entries ?? []).forEach((e: Record<string, unknown>, i: number) => {
      const at = `entry ${i}${typeof e.displayName === "string" ? ` (${e.displayName})` : ""}`;
      // `identifier`, not `id`. This is the exact defect that shipped.
      if (typeof e.identifier !== "string" || !e.identifier)
        problems.push(`${at}: missing identifier${"id" in e ? ' — it has "id", which the spec does not use' : ""}`);
      else if (!e.identifier.startsWith("urn:air:"))
        problems.push(`${at}: identifier "${e.identifier}" is not a urn:air: URN`);
      if (typeof e.displayName !== "string" || !e.displayName) problems.push(`${at}: missing displayName`);
      if (typeof e.type !== "string" || !e.type) problems.push(`${at}: missing type`);
      const hasUrl = typeof e.url === "string" && e.url;
      const hasData = e.data != null;
      if (hasUrl === hasData) problems.push(`${at}: needs exactly one of url or data`);
      if (hasUrl && !resolves(e.url as string))
        problems.push(`${at}: url ${e.url} does not resolve to anything this build emits`);
    });

    const ids = (doc.entries ?? []).map((e: { identifier?: string }) => e.identifier);
    if (new Set(ids).size !== ids.length) problems.push("duplicate identifiers");

    if (problems.length) bad(`ai-catalog.json:\n     ${problems.join("\n     ")}`);
    else console.log(`ok  ai-catalog.json — ${doc.entries.length} entries, every one resolvable`);
  }
}

// 2. Agent skills index — digests must match the files they name.
{
  const p = "public/.well-known/agent-skills/index.json";
  if (!existsSync(p)) bad(`${p} is missing — run scripts/generate-seo.ts`);
  else {
    const doc = read(p);
    const problems: string[] = [];
    if (!doc.$schema) problems.push("no $schema");
    if (!Array.isArray(doc.skills) || !doc.skills.length) problems.push("no skills");

    for (const s of doc.skills ?? []) {
      const at = `skill "${s.name ?? "?"}"`;
      if (!s.name) problems.push(`${at}: missing name`);
      if (s.type !== "skill-md" && s.type !== "archive")
        problems.push(`${at}: type must be skill-md or archive, got ${JSON.stringify(s.type)}`);
      if (!s.description) problems.push(`${at}: missing description`);
      if (!s.url || !resolves(s.url)) problems.push(`${at}: url ${s.url} does not resolve`);
      if (typeof s.digest !== "string" || !s.digest.startsWith("sha256:")) {
        problems.push(`${at}: digest must be "sha256:{hex}"`);
      } else if (s.url && resolves(s.url)) {
        // A digest that does not match the file it names is worse than none:
        // a consumer that verifies will reject a file that is actually fine.
        const file = `public${s.url.slice(SITE_URL.length)}`;
        const actual = "sha256:" + createHash("sha256").update(readFileSync(file)).digest("hex");
        if (actual !== s.digest) problems.push(`${at}: digest is stale — file hashes to ${actual}`);
      }
    }

    if (problems.length) bad(`agent-skills/index.json:\n     ${problems.join("\n     ")}`);
    else console.log(`ok  agent-skills/index.json — ${doc.skills.length} skill(s), digests match`);
  }
}

// 3. MCP server card — the endpoint it advertises must be ours and must exist.
{
  const p = "public/.well-known/mcp/server-card.json";
  if (!existsSync(p)) bad(`${p} is missing — run scripts/generate-seo.ts`);
  else {
    const doc = read(p);
    const problems: string[] = [];
    if (!doc.serverInfo?.name) problems.push("no serverInfo.name");
    if (!doc.serverInfo?.version) problems.push("no serverInfo.version");
    if (!doc.capabilities) problems.push("no capabilities");
    const url = doc.transport?.url;
    if (!url) problems.push("no transport.url");
    else if (!resolves(url)) problems.push(`transport.url ${url} is not an endpoint this repo serves`);

    if (problems.length) bad(`mcp/server-card.json:\n     ${problems.join("\n     ")}`);
    else console.log(`ok  mcp/server-card.json — advertises ${url}, which this repo serves`);
  }
}

// 4. The MCP function's data is the catalogue the site renders.
//
//    `_catalog.json` is generated from `products.ts`. If someone edits the
//    catalogue and does not regenerate, the tools answer with yesterday's
//    prices — silently, and to a customer.
{
  const p = "netlify/functions/_catalog.json";
  if (!existsSync(p)) bad(`${p} is missing — run scripts/generate-seo.ts`);
  else {
    const doc = read(p);
    const { visibleProducts } = await import("../src/data/products");
    if (doc.products?.length !== visibleProducts.length) {
      bad(
        `_catalog.json has ${doc.products?.length} products, products.ts has ${visibleProducts.length} visible — regenerate`,
      );
    } else {
      const stale = visibleProducts.filter((p2, i) => doc.products[i]?.slug !== p2.slug);
      if (stale.length) bad(`_catalog.json is out of order or stale: ${stale.map((x) => x.slug).join(", ")}`);
      else console.log(`ok  MCP catalogue matches products.ts — ${doc.products.length} models`);
    }
  }
}

// 5. robots.txt still declares content preferences.
{
  const robots = existsSync("public/robots.txt") ? readFileSync("public/robots.txt", "utf8") : "";
  if (!/^Content-Signal:/m.test(robots)) bad("robots.txt has no Content-Signal line");
  else console.log("ok  robots.txt declares Content-Signal");
}

console.log(fail === 0 ? "\nALL AGENT DISCOVERY CHECKS PASSED" : `\n${fail} FAILURES`);
process.exit(fail ? 1 : 0);
