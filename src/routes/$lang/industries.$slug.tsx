import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/pages/IndustryDetail.meta";
import { IndustryPage } from "@/pages/IndustryDetail";

export const Route = createFileRoute("/$lang/industries/$slug")({ head, component: IndustryPage });
