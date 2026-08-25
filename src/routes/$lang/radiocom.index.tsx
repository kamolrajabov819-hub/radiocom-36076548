import { createFileRoute } from "@tanstack/react-router";
import { brandHead } from "@/pages/Brand.meta";
import { RadiocomPage } from "@/pages/Brand";

export const Route = createFileRoute("/$lang/radiocom/")({
  head: brandHead("radiocom"),
  component: RadiocomPage,
});
