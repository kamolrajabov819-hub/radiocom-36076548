import { createFileRoute } from "@tanstack/react-router";
import { routeOptions } from "@/pages/Search";

export const Route = createFileRoute("/$lang/search")(routeOptions);
