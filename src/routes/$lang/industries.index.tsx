import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/pages/IndustriesIndex.meta";
import { IndustriesOverview } from "@/pages/IndustriesIndex";

export const Route = createFileRoute("/$lang/industries/")({ head, component: IndustriesOverview });
