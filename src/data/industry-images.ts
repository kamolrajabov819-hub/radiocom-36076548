import horecaImg from "@/assets/industry-horeca.jpg";
import constructionImg from "@/assets/industry-construction.jpg";
import securityImg from "@/assets/industry-security.jpg";
import miningImg from "@/assets/industry-mining.jpg";
import transportImg from "@/assets/industry-transport.jpg";
import manufacturingImg from "@/assets/industry-manufacturing.jpg";
import horeca800 from "@/assets/industry-horeca@800.jpg";
import construction800 from "@/assets/industry-construction@800.jpg";
import security800 from "@/assets/industry-security@800.jpg";
import mining800 from "@/assets/industry-mining@800.jpg";
import transport800 from "@/assets/industry-transport@800.jpg";
import manufacturing800 from "@/assets/industry-manufacturing@800.jpg";
import horeca400 from "@/assets/industry-horeca@400.jpg";
import construction400 from "@/assets/industry-construction@400.jpg";
import security400 from "@/assets/industry-security@400.jpg";
import mining400 from "@/assets/industry-mining@400.jpg";
import transport400 from "@/assets/industry-transport@400.jpg";
import manufacturing400 from "@/assets/industry-manufacturing@400.jpg";
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

/**
 * `srcSet` for the same six frames, as the industry hero and the home page's
 * industry cards both need it.
 *
 * Kept beside the map rather than built at the call site because **the width
 * descriptor has to be the file's real width**, and only this module knows it.
 * The landscape heroes crop to 1400/800/400 so the numbers below are literal,
 * but the pipeline scales by the longest edge, so a portrait source lands far
 * narrower than its `@800` name suggests — see `INDUSTRY_POSTER_SRCSET`, where
 * the `@800` file is 533px across. A descriptor that overstates a candidate is
 * not a rounding error: it tells the browser a file will cover a slot it
 * cannot, and the picture renders soft.
 *
 * Separate maps rather than a richer value type, because `INDUSTRY_IMAGES` is
 * also read for `ImageObject` structured data, where a bare absolute URL is
 * what the consumer wants.
 */
export const INDUSTRY_IMAGE_SRCSET: Record<IndustrySlug, string> = {
  horeca: `${horeca400} 400w, ${horeca800} 800w, ${horecaImg} 1400w`,
  construction: `${construction400} 400w, ${construction800} 800w, ${constructionImg} 1400w`,
  security: `${security400} 400w, ${security800} 800w, ${securityImg} 1400w`,
  mining: `${mining400} 400w, ${mining800} 800w, ${miningImg} 1400w`,
  transport: `${transport400} 400w, ${transport800} 800w, ${transportImg} 1400w`,
  manufacturing: `${manufacturing400} 400w, ${manufacturing800} 800w, ${manufacturingImg} 1400w`,
};

/**
 * The same candidates with the 1400px master withheld.
 *
 * Fed to a `<source media="(max-width: 768px)">` on the industry hero. See the
 * comment at that call site for why a phone is better served by the 800px file
 * than by the master, and why this is done by narrowing the menu rather than by
 * misstating `sizes`.
 */
export const INDUSTRY_IMAGE_SRCSET_SMALL: Record<IndustrySlug, string> = {
  horeca: `${horeca400} 400w, ${horeca800} 800w`,
  construction: `${construction400} 400w, ${construction800} 800w`,
  security: `${security400} 400w, ${security800} 800w`,
  mining: `${mining400} 400w, ${mining800} 800w`,
  transport: `${transport400} 400w, ${transport800} 800w`,
  manufacturing: `${manufacturing400} 400w, ${manufacturing800} 800w`,
};

import horecaPoster from "@/assets/industry-horeca-poster.webp";
import constructionPoster from "@/assets/industry-construction-poster.webp";
import securityPoster from "@/assets/industry-security-poster.webp";
import miningPoster from "@/assets/industry-mining-poster.webp";
import transportPoster from "@/assets/industry-transport-poster.webp";
import manufacturingPoster from "@/assets/industry-manufacturing-poster.webp";
import horecaPoster800 from "@/assets/industry-horeca-poster@800.webp";
import constructionPoster800 from "@/assets/industry-construction-poster@800.webp";
import securityPoster800 from "@/assets/industry-security-poster@800.webp";
import miningPoster800 from "@/assets/industry-mining-poster@800.webp";
import transportPoster800 from "@/assets/industry-transport-poster@800.webp";
import manufacturingPoster800 from "@/assets/industry-manufacturing-poster@800.webp";
import horecaPoster400 from "@/assets/industry-horeca-poster@400.webp";
import constructionPoster400 from "@/assets/industry-construction-poster@400.webp";
import securityPoster400 from "@/assets/industry-security-poster@400.webp";
import miningPoster400 from "@/assets/industry-mining-poster@400.webp";
import transportPoster400 from "@/assets/industry-transport-poster@400.webp";
import manufacturingPoster400 from "@/assets/industry-manufacturing-poster@400.webp";

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

/**
 * `srcSet` for the poster crops.
 *
 * The descriptors are 267/533/600, not 400/800/600, and that is deliberate:
 * these frames are 2:3 portraits, and the variant pipeline scales by the
 * longest edge, so `@400` is 267x400 and `@800` is 533x800. Naming them 400w
 * and 800w would promise the browser 50% more horizontal resolution than the
 * files hold, and a card 211px wide on a phone at DPR 2 — 422 device pixels —
 * would settle for the 267px file and render visibly soft.
 */
export const INDUSTRY_POSTER_SRCSET: Record<IndustrySlug, string> = {
  horeca: `${horecaPoster400} 267w, ${horecaPoster800} 533w, ${horecaPoster} 600w`,
  construction: `${constructionPoster400} 267w, ${constructionPoster800} 533w, ${constructionPoster} 600w`,
  security: `${securityPoster400} 267w, ${securityPoster800} 533w, ${securityPoster} 600w`,
  mining: `${miningPoster400} 267w, ${miningPoster800} 533w, ${miningPoster} 600w`,
  transport: `${transportPoster400} 267w, ${transportPoster800} 533w, ${transportPoster} 600w`,
  manufacturing: `${manufacturingPoster400} 267w, ${manufacturingPoster800} 533w, ${manufacturingPoster} 600w`,
};
