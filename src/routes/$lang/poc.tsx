import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/pages/Poc.meta";
import { PoCPage } from "@/pages/Poc";
import { loadPageCopy } from "@/data/copy";

export const Route = createFileRoute("/$lang/poc")({
  loader: ({ params }) => loadPageCopy("poc", params.lang),
  head,
  component: PoCPage,
});
