import { createFileRoute } from "@tanstack/react-router";
import { routeOptions } from "@/pages/Product";

export const Route = createFileRoute("/$lang/catalog/$id")(routeOptions);
