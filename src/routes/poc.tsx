import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LANG } from "@/lib/i18n";

/**
 * Legacy unprefixed URL. Everything now lives under a locale prefix, so this
 * permanently redirects to the Russian equivalent — these are the URLs that are
 * already indexed, and a 301 is what transfers their ranking to the new path.
 *
 * The redirect lives in the router rather than host config so it holds under any
 * nitro preset. `netlify.toml`'s [[redirects]] only apply when Netlify serves
 * the build, and the output path is preset-dependent — `dist/` under the netlify
 * preset, `.output/public` under cloudflare and node-server. A router redirect
 * is preset-independent, and duplicating the rule costs nothing.
 */
export const Route = createFileRoute("/poc")({
  beforeLoad: () => {
    throw redirect({
      to: "/$lang/poc",
      params: { lang: DEFAULT_LANG },
      statusCode: 301,
    });
  },
});
