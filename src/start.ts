import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { resolveLegacy } from "./lib/legacy-redirects";
import { rewriteLocation } from "./lib/marketing-params";

/**
 * Attaches the Supabase bearer token to serverFn RPCs — but loads Supabase
 * only when one actually fires.
 *
 * This is the same middleware as `@/integrations/supabase/auth-attacher`, with
 * the client import made dynamic. The generated version imports
 * `./client` at module scope, and because this middleware is registered
 * globally, that put the whole Supabase SDK — auth-js, postgrest-js,
 * storage-js and realtime-js, roughly 600 KB — into the client bundle of every
 * page on the site. Lighthouse measured 534 KB of the 999 KB entry chunk as
 * unused on a product page; this is the bulk of it.
 *
 * Nothing on this site calls it. There is not one `createServerFn` in the
 * codebase — the lead form posts to `/api/send-lead` with plain `fetch` — so
 * the middleware has never run in production while costing every visitor the
 * download. Keeping it registered means auth still attaches the day a serverFn
 * is added; the dynamic import means the SDK arrives at that moment and not
 * before.
 *
 * Deliberately re-declared here rather than edited in place: the generated file
 * carries a "do not edit" marker, so it is left untouched. If Lovable ever
 * rewires `start.ts` to import it again the site still works — it just gets
 * slower, which is the safe direction for that failure to go.
 */
const attachSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});

/**
 * Answer clients that do not ask for HTML, instead of erroring at them.
 *
 * TanStack Start's request handler ends with:
 *
 * a check that accepts only the wildcard type and `text/html`, and answers
 * anything else with `Response.json({ error: 'Only HTML requests are
 * supported here' }, { status: 500 })`.
 *
 * So `Accept: text/markdown` — or `application/json`, or anything else a
 * non-browser sends — got **HTTP 500**. Not a 406, which is the status that
 * means "I cannot produce that": a 500, which tells every crawler, uptime
 * check and agent that the site is broken. It is reproducible with one curl.
 *
 * This middleware runs before that check and handles the two cases:
 *
 * **Markdown is asked for** → render the page as usual, convert the HTML, and
 * return it as `text/markdown`. The conversion is in `html-to-markdown.ts`.
 *
 * **Anything else non-HTML** → render HTML anyway. A client that sent a narrow
 * `Accept` and gets a useful page is strictly better off than one that gets a
 * 500, and it is what every server did before content negotiation got strict.
 *
 * The browser path is untouched: a wildcard or `text/html` Accept returns on
 * the first line, before anything else here runs.
 *
 * Every failure mode falls back to the normal response rather than throwing —
 * this sits in front of every request on the site, so it must never be the
 * reason a page does not render.
 */
/**
 * The locale-appropriate `llms.txt` for a path.
 *
 * Russian lives at the conventional `/llms.txt`; the other two sit beside it.
 * Anything without a recognised prefix — `/sitemap.xml`, `/` before the
 * redirect — gets the Russian one, which is the site's default locale.
 */
function llmsForPath(pathname: string): string {
  const seg = pathname.split("/")[1];
  return seg === "en" || seg === "uz" ? `/llms.${seg}.txt` : "/llms.txt";
}

/**
 * The `Link` header, per RFC 8288.
 *
 * Two relations, both IANA-registered, both pointing at something that exists:
 *
 *   describedby  the locale's llms.txt — a plain-text summary of the catalogue
 *   alternate    `<>`, an empty relative reference, which per RFC 3986 resolves
 *                to the requesting URL. It says "this same page is also
 *                available as Markdown", which is true — see the middleware
 *                below.
 *
 * The Markdown alternate is omitted from a Markdown response, which *is* the
 * alternate and should not advertise itself as its own.
 */
function linkHeader(pathname: string, withMarkdownAlternate: boolean): string {
  const rels = [`<${llmsForPath(pathname)}>; rel="describedby"; type="text/plain"`];
  if (withMarkdownAlternate) rels.push(`<>; rel="alternate"; type="text/markdown"`);
  return rels.join(", ");
}

/**
 * Re-emit a response with extra headers, without touching the body.
 *
 * `Response.headers` is immutable once the runtime has built the response, so
 * the header cannot simply be appended. Passing `res.body` straight through
 * keeps the SSR *stream* intact — buffering it here would delay first paint on
 * every page on the site to add one header.
 */
function withHeaders(res: Response, add: Record<string, string>): Response {
  try {
    const headers = new Headers(res.headers);
    for (const [k, v] of Object.entries(add)) headers.append(k, v);
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  } catch {
    return res;
  }
}

const isHtml = (res: Response) => (res.headers.get("content-type") ?? "").includes("text/html");

/**
 * CDN caching for server-rendered pages.
 *
 * Netlify does not cache function responses unless told to, so every page
 * view ran the whole React render — 0.5–2.2 s of server time measured by the
 * SEO checkers, before the first byte. These headers put the HTML on Netlify's
 * edge for an hour and let it serve a stale copy for a week while it
 * revalidates in the background. A deploy invalidates all of it, so a release
 * is never hidden behind a cached page.
 *
 *   Cache-Control               the browser always revalidates. Only the CDN
 *                               holds the page.
 *   Netlify-CDN-Cache-Control   the edge, `durable` so every edge node shares
 *                               one copy rather than each rendering its own.
 *   Netlify-Vary                the cache key: the path, the search query `q`
 *                               (the only parameter that changes a page) and
 *                               `Accept`, because the same URL answers
 *                               `Accept: text/markdown` with Markdown. Every
 *                               other parameter — `utm_*`, `gclid`, `yclid` —
 *                               is left out of the key, so an ad click is
 *                               served the cached page instead of a fresh
 *                               render per click ID.
 *
 * Only a request with **no query string at all** may fill the cache. A request
 * carrying `?gclid=…` is still *served* from the clean entry (the key ignores
 * gclid) but never *creates* one, so no visitor's parameters are ever baked
 * into a page that is then handed to someone else. Redirects, 404s and 500s
 * are never cached: a cached `/` → `/ru` would be served for the WordPress URLs
 * that also arrive at `/`, which must go elsewhere.
 */
function cacheHeaders(request: Request, res: Response): Record<string, string> {
  if (request.method !== "GET" || res.status !== 200) return {};
  if (new URL(request.url).search !== "") return {};
  return {
    "Cache-Control": "public, max-age=0, must-revalidate",
    "Netlify-CDN-Cache-Control": "public, durable, max-age=3600, stale-while-revalidate=604800",
    "Netlify-Vary": "query=q,header=Accept",
    Vary: "Accept",
  };
}

/**
 * Every redirect keeps the visit's marketing parameters, byte for byte.
 *
 * The router rebuilds a redirect's query from its parsed search, which drops
 * it entirely when a route does not ask for it and corrupts it when it does
 * (`yclid` is parsed into a rounded Number — see `lib/marketing-params.ts`).
 * So this runs outermost and fixes the `Location` of every same-origin
 * redirect on its way out: the router's marketing segments are removed and the
 * request's raw ones appended. `/?gclid=x&utm_source=y` reaches
 * `/ru?gclid=x&utm_source=y` with both values exactly as the ad wrote them.
 *
 * It also makes the router's own canonical redirect permanent. TanStack throws
 * one when a URL is not in its normal form (a trailing slash, for instance)
 * and gives it the default 307, which tells a search engine the old URL is
 * still the real one. For a GET it is a 301.
 *
 * And it is where the old WordPress URLs are answered (`lib/legacy-redirects.ts`),
 * before the router runs, because this is the only place that sees the raw URL:
 * the router has already parsed `?page_id=1249` into a Number by the time a
 * route could look at it. A URL with a replacement is a 301 straight to it; a
 * URL with none renders the router's 404 page and is answered 410, which tells
 * a search engine the page is gone on purpose rather than missing.
 */
/** The answer for an old WordPress file or feed path that the router would only redirect. */
const GONE_PAGE =
  '<!doctype html><html lang="ru"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">' +
  '<meta name="robots" content="noindex"><title>Страница удалена — Radiocom</title></head>' +
  '<body style="font:16px/1.5 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0">' +
  '<main style="text-align:center;padding:1.5rem"><h1 style="font-size:1.25rem">Этой страницы больше нет</h1>' +
  '<p><a href="/ru">Рации Motorola и Radiocom — на главную</a></p></main></body></html>';

const redirectParamsMiddleware = createMiddleware().server(async ({ request, next }) => {
  const legacy =
    request.method === "GET" || request.method === "HEAD"
      ? resolveLegacy(new URL(request.url))
      : null;
  if (legacy && legacy !== "gone") {
    const location = rewriteLocation(legacy.path, request.url) ?? legacy.path;
    return new Response(null, { status: 301, headers: { location } });
  }

  const result = await next();
  const res = result.response;
  if (legacy === "gone") {
    // The router's own 404 page, re-stamped 410 — unless the router answered
    // with its trailing-slash redirect first (`/feed/`, `/wp-admin/`), which
    // would make a dead URL take two hops to say so.
    try {
      const response =
        res.status === 404
          ? new Response(res.body, { status: 410, statusText: "Gone", headers: res.headers })
          : new Response(GONE_PAGE, {
              status: 410,
              headers: { "content-type": "text/html; charset=utf-8" },
            });
      return { ...result, response };
    } catch {
      return result;
    }
  }
  if (res.status < 300 || res.status >= 400) return result;
  const location = res.headers.get("location");
  if (!location) return result;

  const rewritten = rewriteLocation(location, request.url);
  if (rewritten === null) return result;

  const temporary = res.status === 302 || res.status === 307;
  const status = temporary && request.method === "GET" ? 301 : res.status;
  try {
    const headers = new Headers(res.headers);
    headers.set("location", rewritten);
    return { ...result, response: new Response(null, { status, headers }) };
  } catch {
    return result;
  }
});

const agentAcceptMiddleware = createMiddleware().server(async ({ request, next }) => {
  const accept = request.headers.get("accept") ?? "*/*";
  const pathname = new URL(request.url).pathname;

  // The browser path. It still has to pass through here, because the `Link`
  // header is emitted on the way out — it was previously declared in
  // `netlify.toml`, and a scan of the live site found no `Link` header on the
  // page at all. Two things could explain that and I could not test either
  // from here: Netlify documents `[[headers]]` for static assets rather than
  // SSR function responses, and the globs were `/ru/*`, which does not match
  // the canonical homepage `/ru`. Emitting from the handler that owns the
  // response settles both.
  if (accept.includes("*/*") || accept.includes("text/html")) {
    const result = await next();
    if (!isHtml(result.response)) return result;
    return {
      ...result,
      response: withHeaders(result.response, {
        Link: linkHeader(pathname, true),
        ...cacheHeaders(request, result.response),
      }),
    };
  }

  const wantsMarkdown = accept.includes("text/markdown") || accept.includes("text/x-markdown");

  // The renderer reads `Accept` off this same object. Incoming request headers
  // are immutable under some runtimes, so this is attempted rather than
  // assumed; if it throws, the response below is the handler's own and the
  // fallback still returns something sane.
  try {
    request.headers.set("accept", "text/html");
  } catch {
    /* headers are guarded here — fall through and handle what we get */
  }

  const result = await next();
  const response = result.response;

  if (!wantsMarkdown) return result;

  try {
    const html = await response.clone().text();
    if (!html.trimStart().toLowerCase().startsWith("<!doctype")) return result;
    const { htmlToMarkdown } = await import("./lib/html-to-markdown");
    const markdown = htmlToMarkdown(html, new URL(request.url).origin);
    const cache = cacheHeaders(request, response);
    delete cache.Vary; // set below, lowercase, for every Markdown response
    return new Response(markdown, {
      status: response.status,
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        // Caches must not hand this Markdown to a browser that asked for HTML.
        vary: "Accept",
        "x-markdown-tokens": String(Math.ceil(markdown.length / 4)),
        link: linkHeader(pathname, false),
        ...cache,
      },
    });
  } catch {
    return result;
  }
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  // `redirectParamsMiddleware` outermost, so it sees every response on its way
  // out, the Markdown branch included. Then `agentAcceptMiddleware`: it decides
  // what to do with a non-HTML `Accept` before `errorMiddleware` wraps the
  // render.
  requestMiddleware: [redirectParamsMiddleware, agentAcceptMiddleware, errorMiddleware],
}));
