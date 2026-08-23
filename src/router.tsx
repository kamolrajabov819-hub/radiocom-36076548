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
