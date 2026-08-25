import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/pages/Poc.meta";
import { PoCPage } from "@/pages/Poc";

export const Route = createFileRoute("/$lang/poc")({ head, component: PoCPage });
