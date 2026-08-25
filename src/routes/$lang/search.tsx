import { createFileRoute } from "@tanstack/react-router";
import { head, validateSearch } from "@/pages/Search.meta";
import { SearchPage } from "@/pages/Search";

export const Route = createFileRoute("/$lang/search")({
  // `validateSearch` is eager alongside `head` for the same reason: the router
  // parses `?q=` to match the route, long before the page body is fetched, and
  // `head` itself reads the parsed value to decide whether to emit `noindex`.
  validateSearch,
  head,
  component: SearchPage,
});
