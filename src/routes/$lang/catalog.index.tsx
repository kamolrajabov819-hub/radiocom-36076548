import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LANG, isLang } from "@/lib/i18n";

/**
 * `/{lang}/catalog` -> `/{lang}/radiocom`, permanently.
 *
 * The catalogue was replaced by two brand pages. These URLs are in the sitemap
 * that has been served for months and are the ones with whatever ranking the
 * site has, so they must 301 rather than 404 — a 404 discards the link equity
 * instead of passing it on.
 *
 * Radiocom is the destination rather than a disambiguation page because it is
 * the house brand and the larger share of the catalogue's search intent; a
 * visitor after Motorola is one nav click away.
 *
 * This lives in the router, not only in host config: `netlify.toml` declares
 * `publish = "dist"` while the build emits to `.output/`, so the host redirect
 * table cannot be relied on to be applied at all. The router redirect also
 * covers client-side navigation from any link still pointing at the old path.
 */
export const Route = createFileRoute("/$lang/catalog/")({
  beforeLoad: ({ params }) => {
    // `params.lang` is a raw string off the URL; narrow it so an invented
    // locale lands on the default rather than propagating an unknown code
    // into a 301 target.
    const lang = isLang(params.lang) ? params.lang : DEFAULT_LANG;
    throw redirect({
      to: "/$lang/radiocom",
      params: { lang },
      statusCode: 301,
    });
  },
});
