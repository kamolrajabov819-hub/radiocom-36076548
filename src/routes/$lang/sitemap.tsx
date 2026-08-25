import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/pages/Sitemap.meta";
import { SitemapPage } from "@/pages/Sitemap";

export const Route = createFileRoute("/$lang/sitemap")({ head, component: SitemapPage });
