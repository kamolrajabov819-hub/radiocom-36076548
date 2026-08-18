import { createFileRoute } from "@tanstack/react-router";
import { routeOptions } from "@/pages/Catalog";

export const Route = createFileRoute("/$lang/catalog/")(routeOptions);
