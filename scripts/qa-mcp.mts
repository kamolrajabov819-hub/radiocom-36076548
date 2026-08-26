/**
 * The MCP server's contract, exercised end to end.
 *
 * Netlify Functions do not run under `node .output/server/index.mjs` — the same
 * is true of `/api/send-lead` — so there is no preview URL to curl. The handler
 * is imported and driven directly instead, which tests the same code the
 * deploy runs and needs no server at all.
 *
 * What it is really guarding: the tools answer out of `_catalog.json`, which is
 * generated from `products.ts`. If a price becomes null, a spec table changes
 * shape, or a slug is renamed, the tool output changes with it — and a model
 * reading `undefined` or `NaN` would repeat it to a customer. Hence the check
 * that neither ever appears in rendered output.
 *
 * Run: bun scripts/qa-mcp.mts
 */
import handler from "../netlify/functions/mcp.mts";
import catalog from "../netlify/functions/_catalog.json" with { type: "json" };

const catalogSize = catalog.products.length;

const call = async (payload: unknown) => {
  const res = await handler(
    new Request("https://radiocom.uz/mcp", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
      body: JSON.stringify(payload),
    }),
  );
  const text = await res.text();
  return { status: res.status, ct: res.headers.get("content-type"), json: text ? JSON.parse(text) : null };
};

let fail = 0;
const check = (label: string, cond: boolean, detail = "") => {
  console.log(`  ${cond ? "ok  " : "FAIL"} ${label}${cond ? "" : "  <- " + detail}`);
  if (!cond) fail++;
};

// initialize
const init = await call({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} });
check("initialize returns 200 JSON", init.status === 200 && init.ct === "application/json", String(init.status));
check("protocolVersion is 2025-06-18", init.json?.result?.protocolVersion === "2025-06-18", JSON.stringify(init.json?.result?.protocolVersion));
check("advertises tools capability", !!init.json?.result?.capabilities?.tools);
check("serverInfo has name and version", !!init.json?.result?.serverInfo?.name && !!init.json?.result?.serverInfo?.version);

// notification -> 202, no body
const note = await call({ jsonrpc: "2.0", method: "notifications/initialized" });
check("notification gets 202 with no body", note.status === 202 && note.json === null, String(note.status));

// tools/list
const list = await call({ jsonrpc: "2.0", id: 2, method: "tools/list" });
const names = (list.json?.result?.tools ?? []).map((t: { name: string }) => t.name);
check("tools/list returns the four tools", names.length === 4, names.join(","));
check("every tool has description + inputSchema",
  (list.json?.result?.tools ?? []).every((t: { description?: string; inputSchema?: object }) => t.description && t.inputSchema));

// tools/call — each tool
const callTool = (name: string, args: object = {}) =>
  call({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name, arguments: args } });

const all = await callTool("list_radios");
const allText = all.json?.result?.content?.[0]?.text ?? "";
check("list_radios returns text content", typeof allText === "string" && allText.length > 100);
check("list_radios names a real model", allText.includes("RCD-70"), allText.slice(0, 80));

const search = await callTool("search_radios", { tag: "DMR" });
const searchText = search.json?.result?.content?.[0]?.text ?? "";
check("search by tag=DMR finds models", /\d+ of \d+ models match/.test(searchText), searchText.slice(0, 80));

const searchNone = await callTool("search_radios", { query: "zzzznothing" });
check("search with no hits explains itself",
  (searchNone.json?.result?.content?.[0]?.text ?? "").startsWith("No model matches"));

const one = await callTool("get_radio", { slug: "rcd-70", lang: "en" });
const oneText = one.json?.result?.content?.[0]?.text ?? "";
check("get_radio returns specs", oneText.includes("### Specifications"));
check("get_radio returns box contents", oneText.includes("### In the box"));
check("get_radio honours lang=en", oneText.includes("UZS"), oneText.slice(0, 120));

const bad = await callTool("get_radio", { slug: "does-not-exist" });
check("unknown slug lists the real ones",
  (bad.json?.result?.content?.[0]?.text ?? "").includes("Known slugs:"));

const cmp = await callTool("compare_radios", { slugs: ["rcd-70", "rcd-50"] });
const cmpText = cmp.json?.result?.content?.[0]?.text ?? "";
check("compare_radios compares both", cmpText.includes("rcd-70") && cmpText.includes("rcd-50"));
check("compare_radios shows shared specs", cmpText.includes("### Shared specifications"));

// A model priced on request must never render as a number.
const onRequest = await callTool("list_radios", { lang: "ru" });
check("no NaN or undefined leaks into output",
  !/NaN|undefined|\[object/.test(onRequest.json?.result?.content?.[0]?.text ?? ""));

// error paths
const unknown = await callTool("no_such_tool");
check("unknown tool reports isError, not a transport error", unknown.json?.result?.isError === true);

const badMethod = await call({ jsonrpc: "2.0", id: 4, method: "nope" });
check("unknown method returns -32601", badMethod.json?.error?.code === -32601);

const batch = await call([
  { jsonrpc: "2.0", id: 5, method: "ping" },
  { jsonrpc: "2.0", method: "notifications/initialized" },
]);
check("batch drops notification replies", Array.isArray(batch.json) && batch.json.length === 1, JSON.stringify(batch.json));

const get = await handler(new Request("https://radiocom.uz/mcp", { method: "GET" }));
check("GET returns 405 with Allow", get.status === 405 && !!get.headers.get("allow"));

// The health endpoint `/.well-known/api-catalog` points at.
{
  const res = await handler(new Request("https://radiocom.uz/mcp/health", { method: "GET" }));
  const body = await res.json();
  check("GET /mcp/health returns 200", res.status === 200, String(res.status));
  check("health reports status ok", body?.status === "ok", JSON.stringify(body));
  check(
    "health reports the real model count, not a constant",
    body?.models === catalogSize,
    `${body?.models} vs ${catalogSize}`,
  );
  check("health is not cacheable", (res.headers.get("cache-control") ?? "").includes("no-store"));
  const post = await handler(new Request("https://radiocom.uz/mcp/health", { method: "POST" }));
  check("POST /mcp/health is 405", post.status === 405, String(post.status));
  // A trailing slash must not fall through to the JSON-RPC branch and
  // answer 405 to what is plainly a health check.
  const slash = await handler(new Request("https://radiocom.uz/mcp/health/", { method: "GET" }));
  check("GET /mcp/health/ (trailing slash) still 200", slash.status === 200, String(slash.status));
}

console.log(fail === 0 ? "\nALL MCP CHECKS PASSED" : `\n${fail} FAILURES`);
process.exit(fail ? 1 : 0);
