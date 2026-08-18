import { createFileRoute } from "@tanstack/react-router";
import { routeOptions } from "@/pages/Home";

export const Route = createFileRoute("/$lang/")(routeOptions);
