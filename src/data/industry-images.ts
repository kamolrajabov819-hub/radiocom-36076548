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

import horecaPoster from "@/assets/industry-horeca-poster.webp";
import constructionPoster from "@/assets/industry-construction-poster.webp";
import securityPoster from "@/assets/industry-security-poster.webp";
import miningPoster from "@/assets/industry-mining-poster.webp";
import transportPoster from "@/assets/industry-transport-poster.webp";
import manufacturingPoster from "@/assets/industry-manufacturing-poster.webp";

/**
 * The 2:3 portrait crop for poster cards.
 *
 * `INDUSTRY_IMAGES` above are 1400x900 landscape JPEGs — right for the industry
 * page's full-bleed hero, wrong for a 200px-wide portrait card, which cropped a
 * wide frame down and paid for every pixel it discarded. Six of them added
 * 318 KB to a brand page. These are cropped and sized for the card: 421 KB for
 * the set against 1319 KB of originals, and composed for the frame rather than
 * trimmed to fit it.
 */
export const INDUSTRY_POSTERS: Record<IndustrySlug, string> = {
  horeca: horecaPoster,
  construction: constructionPoster,
  security: securityPoster,
  mining: miningPoster,
  transport: transportPoster,
  manufacturing: manufacturingPoster,
};
