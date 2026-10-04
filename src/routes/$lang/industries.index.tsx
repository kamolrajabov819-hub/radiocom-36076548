import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/pages/IndustriesIndex.meta";
import { IndustriesOverview } from "@/pages/IndustriesIndex";
import { loadPageCopy } from "@/data/copy";

export const Route = createFileRoute("/$lang/industries/")({
  loader: ({ params }) => loadPageCopy("industries", params.lang),
  head,
  component: IndustriesOverview,
});
