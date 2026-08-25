import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/pages/Home.meta";
import { HomePage } from "@/pages/Home";

export const Route = createFileRoute("/$lang/")({ head, component: HomePage });
