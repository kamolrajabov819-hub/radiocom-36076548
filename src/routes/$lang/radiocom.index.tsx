import { createFileRoute } from "@tanstack/react-router";
import { brandHead } from "@/pages/Brand.meta";
import { loadPageCopy } from "@/data/copy";
import { RadiocomPage } from "@/pages/Brand";

export const Route = createFileRoute("/$lang/radiocom/")({
  // The brand's SEO text and FAQ, narrowed to this language (src/data/copy).
  loader: ({ params }) => loadPageCopy("radiocom", params.lang),
  head: brandHead("radiocom"),
  component: RadiocomPage,
});
