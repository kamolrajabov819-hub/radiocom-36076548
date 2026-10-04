import { createFileRoute } from "@tanstack/react-router";
import { brandHead } from "@/pages/Brand.meta";
import { loadPageCopy } from "@/data/copy";
import { MotorolaPage } from "@/pages/Brand";

export const Route = createFileRoute("/$lang/motorola/")({
  // The brand's SEO text and FAQ, narrowed to this language (src/data/copy).
  loader: ({ params }) => loadPageCopy("motorola", params.lang),
  head: brandHead("motorola"),
  component: MotorolaPage,
});
