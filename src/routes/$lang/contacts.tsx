import { createFileRoute } from "@tanstack/react-router";
import { infoHead } from "@/pages/InfoPage.meta";
import { ContactsPage } from "@/pages/Contacts";
import { loadPageCopy } from "@/data/copy";

/**
 * `/{lang}/contacts` — one of the pages the keyword map added. Its copy, FAQ
 * included, is a code-split module the loader narrows to one language
 * (src/data/copy/index.ts); `head` comes from the shared InfoPage.meta.
 */
export const Route = createFileRoute("/$lang/contacts")({
  loader: ({ params }) => loadPageCopy("contacts", params.lang),
  head: infoHead("contacts"),
  component: ContactsPage,
});
