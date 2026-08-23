import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { NotFoundComponent } from "@/components/NotFound";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Prefetch a route's chunk and loader when the pointer or keyboard focus
    // lands on a link to it, so the click itself has nothing left to wait for.
    //
    // This rather than a `<script type="speculationrules">` prefetch. The two
    // do the same job by different routes — Speculation Rules prefetches the
    // *document*, TanStack prefetches the route module — and after hydration
    // this site navigates as an SPA, so the document fetch would be discarded
    // work on every hover. Running both would fetch each route twice.
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    // The root route's `notFoundComponent` only covers a `notFound()` thrown
    // from inside a route that matched. A path matching no route at all falls
    // through to this, and with it unset TanStack renders a bare
    // `<p>Not Found</p>` inside the site chrome — correct 404 status, but no
    // heading, no navigation and no styling. /ru/motorola/clp446 got the real
    // 404 page while /ru/anything-else got the bare paragraph.
    defaultNotFoundComponent: NotFoundComponent,
  });

  return router;
};
