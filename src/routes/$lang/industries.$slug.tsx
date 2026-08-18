import { createFileRoute } from "@tanstack/react-router";
import { routeOptions } from "@/pages/IndustryDetail";

export const Route = createFileRoute("/$lang/industries/$slug")(routeOptions);
