import { createFileRoute } from "@tanstack/react-router";
import { infoHead } from "@/pages/InfoPage.meta";
import { AboutPage } from "@/pages/About";
import { loadPageCopy } from "@/data/copy";

/**
 * `/{lang}/about` — one of the pages the keyword map added. Its copy, FAQ
 * included, is a code-split module the loader narrows to one language
 * (src/data/copy/index.ts); `head` comes from the shared InfoPage.meta.
 */
export const Route = createFileRoute("/$lang/about")({
  loader: ({ params }) => loadPageCopy("about", params.lang),
  head: infoHead("about"),
  component: AboutPage,
});
