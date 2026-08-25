import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/pages/Service.meta";
import { ServicePage } from "@/pages/Service";

/**
 * Properties spelled out rather than spread from an imported object.
 *
 * `@tanstack/router-plugin` code-splits by matching property keys on the object
 * literal passed to the route call — `component`, `loader`, `errorComponent`
 * and friends. `createFileRoute(path)(routeOptions)` and `{ ...routeOptions }`
 * both hide those keys behind an identifier the plugin cannot see through, so
 * it lifted nothing and every page body shipped in the entry chunk. Written
 * this way the plugin rewrites the `ServicePage` import into its own lazy
 * chunk. `head` stays eager, which is why it lives in its own light module.
 */
export const Route = createFileRoute("/$lang/service")({ head, component: ServicePage });
