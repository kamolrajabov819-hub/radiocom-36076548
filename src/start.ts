import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

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
const agentAcceptMiddleware = createMiddleware().server(async ({ request, next }) => {
  const accept = request.headers.get("accept") ?? "*/*";
  if (accept.includes("*/*") || accept.includes("text/html")) return next();

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
    return new Response(markdown, {
      status: response.status,
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        // Caches must not hand this Markdown to a browser that asked for HTML.
        vary: "Accept",
        "x-markdown-tokens": String(Math.ceil(markdown.length / 4)),
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
  // `agentAcceptMiddleware` first: it decides what to do with a non-HTML
  // `Accept` before `errorMiddleware` wraps the render.
  requestMiddleware: [agentAcceptMiddleware, errorMiddleware],
}));
