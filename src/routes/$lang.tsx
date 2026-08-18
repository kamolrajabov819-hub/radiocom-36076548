import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { isLang, type Lang } from "@/lib/i18n";

/**
 * Locale layout. Every page lives under /ru, /en or /uz.
 *
 * The URL is the only source of truth for language — there is no localStorage
 * fallback — so each locale has its own crawlable URL and Google can index all
 * three.
 *
 * This route validates the segment; the `I18nextProvider` itself lives in
 * `__root.tsx` so that the shared chrome rendered around `<Outlet />` — nav,
 * contact block, footer, sticky CTA, lead form — is inside it too.
 */
export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    if (!isLang(params.lang)) throw notFound();
    return { lang: params.lang as Lang };
  },
  component: Outlet,
});
