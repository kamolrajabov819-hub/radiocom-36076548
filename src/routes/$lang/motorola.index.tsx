import { createFileRoute } from "@tanstack/react-router";
import { brandHead } from "@/pages/Brand.meta";
import { MotorolaPage } from "@/pages/Brand";

export const Route = createFileRoute("/$lang/motorola/")({
  head: brandHead("motorola"),
  component: MotorolaPage,
});
