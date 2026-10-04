import { createFileRoute } from "@tanstack/react-router";
import { infoHead } from "@/pages/InfoPage.meta";
import { SolutionsPage } from "@/pages/Solutions";
import { loadPageCopy } from "@/data/copy";

/**
 * `/{lang}/solutions` — one of the pages the keyword map added. Its copy, FAQ
 * included, is a code-split module the loader narrows to one language
 * (src/data/copy/index.ts); `head` comes from the shared InfoPage.meta.
 */
export const Route = createFileRoute("/$lang/solutions")({
  loader: ({ params }) => loadPageCopy("solutions", params.lang),
  head: infoHead("solutions"),
  component: SolutionsPage,
});
