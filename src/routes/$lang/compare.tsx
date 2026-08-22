import { createFileRoute } from "@tanstack/react-router";
import { routeOptions } from "@/pages/Compare";

export const Route = createFileRoute("/$lang/compare")(routeOptions);
