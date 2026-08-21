export const INDUSTRY_SLUGS = [
  "horeca",
  "construction",
  "security",
  "mining",
  "transport",
  "manufacturing",
] as const;
export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

// Recommended product IDs per industry slug (subset of catalog to feature)
export const industryPicks: Record<IndustrySlug, string[]> = {
  horeca: ["rc-20", "rc-10", "m-xt185", "m-t62-red", "m-t82", "rcd-30"],
  construction: ["rcd-60", "rcd-50", "m-tlkr-t92h2o", "m-t82-extreme", "rc-50", "rcd-70"],
  security: ["rcd-70", "rcd-60", "m-xt420", "rc-50", "m-t82-extreme-quad", "rcd-30"],
  mining: ["rcd-70", "rcd-60", "rcd-50", "rc-50", "m-t82-extreme", "rcd-40"],
  transport: ["rcd-70", "rcd-40", "rc-50", "rcd-60", "m-t82", "rcd-30"],
  manufacturing: ["rcd-50", "rcd-40", "m-xt420", "rcd-60", "rc-20", "rcd-70"],
};
