import horecaImg from "@/assets/industry-horeca.jpg";
import constructionImg from "@/assets/industry-construction.jpg";
import securityImg from "@/assets/industry-security.jpg";
import miningImg from "@/assets/industry-mining.jpg";
import transportImg from "@/assets/industry-transport.jpg";
import manufacturingImg from "@/assets/industry-manufacturing.jpg";
import type { IndustrySlug } from "@/data/industries";

/**
 * The photograph for each industry.
 *
 * Lifted out of `IndustryDetail.tsx` because the brand pages now use the same
 * six frames for their poster shelf. One map, so a replacement photograph
 * lands in both places and the two cannot drift.
 */
export const INDUSTRY_IMAGES: Record<IndustrySlug, string> = {
  horeca: horecaImg,
  construction: constructionImg,
  security: securityImg,
  mining: miningImg,
  transport: transportImg,
  manufacturing: manufacturingImg,
};
