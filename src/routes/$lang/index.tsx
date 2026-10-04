import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/pages/Home.meta";
import { HomePage } from "@/pages/Home";
import { loadPageCopy } from "@/data/copy";

export const Route = createFileRoute("/$lang/")({
  // The SEO text and FAQ, narrowed to this language (src/data/copy/index.ts).
  loader: ({ params }) => loadPageCopy("home", params.lang),
  head,
  component: HomePage,
});
