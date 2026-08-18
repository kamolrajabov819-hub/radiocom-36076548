import { createFileRoute } from "@tanstack/react-router";
import { routeOptions } from "@/pages/IndustriesIndex";

export const Route = createFileRoute("/$lang/industries/")(routeOptions);
