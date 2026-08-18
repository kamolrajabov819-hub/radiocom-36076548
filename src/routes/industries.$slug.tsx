import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LANG } from "@/lib/i18n";

/**
 * Legacy unprefixed URL. Everything now lives under a locale prefix, so this
 * permanently redirects to the Russian equivalent — these are the URLs that are
 * already indexed, and a 301 is what transfers their ranking to the new path.
 *
 * The redirect lives in the router rather than host config because netlify.toml
 * still declares `publish = "dist"` while the build emits a Cloudflare worker to
 * .output/, so the host config cannot be relied on.
 */
export const Route = createFileRoute("/industries/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$lang/industries/$slug",
      params: { lang: DEFAULT_LANG, slug: params.slug },
      statusCode: 301,
    });
  },
});
