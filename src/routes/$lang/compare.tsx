import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/pages/Compare.meta";
import { ComparePage } from "@/pages/Compare";
import { loadPageCopy } from "@/data/copy";

export const Route = createFileRoute("/$lang/compare")({
  loader: ({ params }) => loadPageCopy("compare", params.lang),
  head,
  component: ComparePage,
});
