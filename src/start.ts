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
  requestMiddleware: [errorMiddleware],
}));
