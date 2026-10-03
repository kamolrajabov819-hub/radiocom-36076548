import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { DEFAULT_LANG } from "@/lib/i18n";
import { hasWordPressKey } from "@/lib/legacy-redirects";

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
 *
 * The old WordPress site addressed its pages as `/?products=…`, `/?page_id=…`
 * and so on, and those arrive here too. They are mapped in `src/start.ts`
 * before the router runs (see `lib/legacy-redirects.ts`), so the only ones that
 * reach this route are those with no equivalent page. They must not fall
 * through to the home page — a redirect of a dead URL to `/` is treated as a
 * soft 404 — so any WordPress key here is a 404, which the middleware answers
 * as 410. Checked by key, not value: the router has already parsed the values.
 */
export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => {
    if (hasWordPressKey(Object.keys(location.search))) throw notFound();
    throw redirect({
      to: "/$lang",
      params: { lang: DEFAULT_LANG },
      statusCode: 301,
    });
  },
});
