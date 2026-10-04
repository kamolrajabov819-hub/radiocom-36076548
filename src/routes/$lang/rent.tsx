import { createFileRoute } from "@tanstack/react-router";
import { infoHead } from "@/pages/InfoPage.meta";
import { RentPage } from "@/pages/Rent";
import { loadPageCopy } from "@/data/copy";

/**
 * `/{lang}/rent` — one of the pages the keyword map added. Its copy, FAQ
 * included, is a code-split module the loader narrows to one language
 * (src/data/copy/index.ts); `head` comes from the shared InfoPage.meta.
 */
export const Route = createFileRoute("/$lang/rent")({
  loader: ({ params }) => loadPageCopy("rent", params.lang),
  head: infoHead("rent"),
  component: RentPage,
});
