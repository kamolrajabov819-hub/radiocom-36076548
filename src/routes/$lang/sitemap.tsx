import { createFileRoute } from "@tanstack/react-router";
import { routeOptions } from "@/pages/Sitemap";

export const Route = createFileRoute("/$lang/sitemap")(routeOptions);
