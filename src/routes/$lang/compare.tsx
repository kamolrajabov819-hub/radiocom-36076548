import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/pages/Compare.meta";
import { ComparePage } from "@/pages/Compare";

export const Route = createFileRoute("/$lang/compare")({ head, component: ComparePage });
