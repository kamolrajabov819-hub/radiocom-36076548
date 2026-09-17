/*
 * Product photography — real files, not CDN pointers.
 *
 * Every one of these used to be a `.asset.json` pointer resolving to
 * radiocom.lovable.app: a single point of failure outside this repository, and
 * one that could never receive responsive variants because the bytes lived
 * somewhere else. They are now imported files, so Vite fingerprints them,
 * emits them, and the `@800` sibling beside each one becomes a real `srcSet`
 * candidate rather than the 404 that Phase 1 had to fix.
 *
 * All but fifteen are the 15.09.26 studio shoot, processed by
 * `scripts/build-catalog-photos.ts`, which is where the naming and the framing
 * rules are written down. In short: `<model>-<variant>`, `hero` is the radio
 * alone and front-facing, and every single-radio frame is cropped so the radio
 * fills the same 82% of its height. That last part is the point — before this
 * set, three heroes showed the radio's back, four showed a box instead of the
 * product, a dozen carried a `RADIOCOM` watermark, and no two frames agreed on
 * a camera angle.
 *
 * The fifteen exceptions are the older kit flat-lays, kept deliberately: `InBox`
 * pairs the parts list with `gallery[gallery.length - 1]`, and a flat-lay of the
 * charger, earpiece and spare battery is the photograph of precisely that list.
 * The new retail-box frames show a sealed box, which is not the same thing. So
 * every `gallery` below ends on whichever frame actually shows what you get.
 */
// ── Radiocom RCD — front shot, retail box, and the kit flat-lay ──
import rcd70Hero from "@/assets/catalog/rcd-70-hero.webp";
import rcd70Hero800 from "@/assets/catalog/rcd-70-hero@800.webp";
import rcd70Hero400 from "@/assets/catalog/rcd-70-hero@400.webp";
import rcd70Box from "@/assets/catalog/rcd-70-box.webp";
import rcd70Box800 from "@/assets/catalog/rcd-70-box@800.webp";
import rcd70Box400 from "@/assets/catalog/rcd-70-box@400.webp";
import rcd70Kit from "@/assets/catalog/rcd-70-kit.webp";
import rcd70Kit800 from "@/assets/catalog/rcd-70-kit@800.webp";
import rcd70Kit400 from "@/assets/catalog/rcd-70-kit@400.webp";
import rcd60Hero from "@/assets/catalog/rcd-60-hero.webp";
import rcd60Hero800 from "@/assets/catalog/rcd-60-hero@800.webp";
import rcd60Hero400 from "@/assets/catalog/rcd-60-hero@400.webp";
import rcd60Box from "@/assets/catalog/rcd-60-box.webp";
import rcd60Box800 from "@/assets/catalog/rcd-60-box@800.webp";
import rcd60Box400 from "@/assets/catalog/rcd-60-box@400.webp";
import rcd60Kit from "@/assets/catalog/rcd-60-kit.webp";
import rcd60Kit800 from "@/assets/catalog/rcd-60-kit@800.webp";
import rcd60Kit400 from "@/assets/catalog/rcd-60-kit@400.webp";
import rcd50Hero from "@/assets/catalog/rcd-50-hero.webp";
import rcd50Hero800 from "@/assets/catalog/rcd-50-hero@800.webp";
import rcd50Hero400 from "@/assets/catalog/rcd-50-hero@400.webp";
import rcd50Box from "@/assets/catalog/rcd-50-box.webp";
import rcd50Box800 from "@/assets/catalog/rcd-50-box@800.webp";
import rcd50Box400 from "@/assets/catalog/rcd-50-box@400.webp";
import rcd50Kit from "@/assets/catalog/rcd-50-kit.webp";
import rcd50Kit800 from "@/assets/catalog/rcd-50-kit@800.webp";
import rcd50Kit400 from "@/assets/catalog/rcd-50-kit@400.webp";
import rcd40Hero from "@/assets/catalog/rcd-40-hero.webp";
import rcd40Hero800 from "@/assets/catalog/rcd-40-hero@800.webp";
import rcd40Hero400 from "@/assets/catalog/rcd-40-hero@400.webp";
import rcd40Box from "@/assets/catalog/rcd-40-box.webp";
import rcd40Box800 from "@/assets/catalog/rcd-40-box@800.webp";
import rcd40Box400 from "@/assets/catalog/rcd-40-box@400.webp";
import rcd40Kit from "@/assets/catalog/rcd-40-kit.webp";
import rcd40Kit800 from "@/assets/catalog/rcd-40-kit@800.webp";
import rcd40Kit400 from "@/assets/catalog/rcd-40-kit@400.webp";
import rcd30Hero from "@/assets/catalog/rcd-30-hero.webp";
import rcd30Hero800 from "@/assets/catalog/rcd-30-hero@800.webp";
import rcd30Hero400 from "@/assets/catalog/rcd-30-hero@400.webp";
import rcd30Box from "@/assets/catalog/rcd-30-box.webp";
import rcd30Box800 from "@/assets/catalog/rcd-30-box@800.webp";
import rcd30Box400 from "@/assets/catalog/rcd-30-box@400.webp";
import rcd30Kit from "@/assets/catalog/rcd-30-kit.webp";
import rcd30Kit800 from "@/assets/catalog/rcd-30-kit@800.webp";
import rcd30Kit400 from "@/assets/catalog/rcd-30-kit@400.webp";

// ── Radiocom RC ──
import rc50Hero from "@/assets/catalog/rc-50-hero.webp";
import rc50Hero800 from "@/assets/catalog/rc-50-hero@800.webp";
import rc50Hero400 from "@/assets/catalog/rc-50-hero@400.webp";
import rc50Box from "@/assets/catalog/rc-50-box.webp";
import rc50Box800 from "@/assets/catalog/rc-50-box@800.webp";
import rc50Box400 from "@/assets/catalog/rc-50-box@400.webp";
import rc50Kit from "@/assets/catalog/rc-50-kit.webp";
import rc50Kit800 from "@/assets/catalog/rc-50-kit@800.webp";
import rc50Kit400 from "@/assets/catalog/rc-50-kit@400.webp";
import rc20Hero from "@/assets/catalog/rc-20-hero.webp";
import rc20Hero800 from "@/assets/catalog/rc-20-hero@800.webp";
import rc20Hero400 from "@/assets/catalog/rc-20-hero@400.webp";
import rc20Box from "@/assets/catalog/rc-20-box.webp";
import rc20Box800 from "@/assets/catalog/rc-20-box@800.webp";
import rc20Box400 from "@/assets/catalog/rc-20-box@400.webp";
import rc20Kit from "@/assets/catalog/rc-20-kit.webp";
import rc20Kit800 from "@/assets/catalog/rc-20-kit@800.webp";
import rc20Kit400 from "@/assets/catalog/rc-20-kit@400.webp";
import rc10Hero from "@/assets/catalog/rc-10-hero.webp";
import rc10Hero800 from "@/assets/catalog/rc-10-hero@800.webp";
import rc10Hero400 from "@/assets/catalog/rc-10-hero@400.webp";
import rc10Box from "@/assets/catalog/rc-10-box.webp";
import rc10Box800 from "@/assets/catalog/rc-10-box@800.webp";
import rc10Box400 from "@/assets/catalog/rc-10-box@400.webp";
import rc10Kit from "@/assets/catalog/rc-10-kit.webp";
import rc10Kit800 from "@/assets/catalog/rc-10-kit@800.webp";
import rc10Kit400 from "@/assets/catalog/rc-10-kit@400.webp";

// ── Motorola T82 Extreme, Quad and RSM ──
import t82ExtremeHero from "@/assets/catalog/t82-extreme-hero.webp";
import t82ExtremeHero800 from "@/assets/catalog/t82-extreme-hero@800.webp";
import t82ExtremeHero400 from "@/assets/catalog/t82-extreme-hero@400.webp";
import t82ExtremePair from "@/assets/catalog/t82-extreme-pair.webp";
import t82ExtremePair800 from "@/assets/catalog/t82-extreme-pair@800.webp";
import t82ExtremePair400 from "@/assets/catalog/t82-extreme-pair@400.webp";
import t82ExtremeSide from "@/assets/catalog/t82-extreme-side.webp";
import t82ExtremeSide800 from "@/assets/catalog/t82-extreme-side@800.webp";
import t82ExtremeSide400 from "@/assets/catalog/t82-extreme-side@400.webp";
import t82ExtremeBack from "@/assets/catalog/t82-extreme-back.webp";
import t82ExtremeBack800 from "@/assets/catalog/t82-extreme-back@800.webp";
import t82ExtremeBack400 from "@/assets/catalog/t82-extreme-back@400.webp";
import t82ExtremeCase from "@/assets/catalog/t82-extreme-case.webp";
import t82ExtremeCase800 from "@/assets/catalog/t82-extreme-case@800.webp";
import t82ExtremeCase400 from "@/assets/catalog/t82-extreme-case@400.webp";
import t82ExtremeBox from "@/assets/catalog/t82-extreme-box.webp";
import t82ExtremeBox800 from "@/assets/catalog/t82-extreme-box@800.webp";
import t82ExtremeBox400 from "@/assets/catalog/t82-extreme-box@400.webp";
import t82ExtremeQuadHero from "@/assets/catalog/t82-extreme-quad-hero.webp";
import t82ExtremeQuadHero800 from "@/assets/catalog/t82-extreme-quad-hero@800.webp";
import t82ExtremeQuadHero400 from "@/assets/catalog/t82-extreme-quad-hero@400.webp";
import t82ExtremeQuadBack from "@/assets/catalog/t82-extreme-quad-back.webp";
import t82ExtremeQuadBack800 from "@/assets/catalog/t82-extreme-quad-back@800.webp";
import t82ExtremeQuadBack400 from "@/assets/catalog/t82-extreme-quad-back@400.webp";
import t82ExtremeQuadCase from "@/assets/catalog/t82-extreme-quad-case.webp";
import t82ExtremeQuadCase800 from "@/assets/catalog/t82-extreme-quad-case@800.webp";
import t82ExtremeQuadCase400 from "@/assets/catalog/t82-extreme-quad-case@400.webp";
import t82ExtremeQuadBox from "@/assets/catalog/t82-extreme-quad-box.webp";
import t82ExtremeQuadBox800 from "@/assets/catalog/t82-extreme-quad-box@800.webp";
import t82ExtremeQuadBox400 from "@/assets/catalog/t82-extreme-quad-box@400.webp";
import t82ExtremeRsmHero from "@/assets/catalog/t82-extreme-rsm-hero.webp";
import t82ExtremeRsmHero800 from "@/assets/catalog/t82-extreme-rsm-hero@800.webp";
import t82ExtremeRsmHero400 from "@/assets/catalog/t82-extreme-rsm-hero@400.webp";

// ── Motorola T82 ──
import t82Hero from "@/assets/catalog/t82-hero.webp";
import t82Hero800 from "@/assets/catalog/t82-hero@800.webp";
import t82Hero400 from "@/assets/catalog/t82-hero@400.webp";
import t82Side from "@/assets/catalog/t82-side.webp";
import t82Side800 from "@/assets/catalog/t82-side@800.webp";
import t82Side400 from "@/assets/catalog/t82-side@400.webp";
import t82Case from "@/assets/catalog/t82-case.webp";
import t82Case800 from "@/assets/catalog/t82-case@800.webp";
import t82Case400 from "@/assets/catalog/t82-case@400.webp";
import t82Box from "@/assets/catalog/t82-box.webp";
import t82Box800 from "@/assets/catalog/t82-box@800.webp";
import t82Box400 from "@/assets/catalog/t82-box@400.webp";

// ── Motorola T72 ──
import t72Hero from "@/assets/catalog/t72-hero.webp";
import t72Hero800 from "@/assets/catalog/t72-hero@800.webp";
import t72Hero400 from "@/assets/catalog/t72-hero@400.webp";
import t72Box from "@/assets/catalog/t72-box.webp";
import t72Box800 from "@/assets/catalog/t72-box@800.webp";
import t72Box400 from "@/assets/catalog/t72-box@400.webp";

// ── Motorola T62 ──
import t62RedHero from "@/assets/catalog/t62-red-hero.webp";
import t62RedHero800 from "@/assets/catalog/t62-red-hero@800.webp";
import t62RedHero400 from "@/assets/catalog/t62-red-hero@400.webp";
import t62RedCase from "@/assets/catalog/t62-red-case.webp";
import t62RedCase800 from "@/assets/catalog/t62-red-case@800.webp";
import t62RedCase400 from "@/assets/catalog/t62-red-case@400.webp";
import t62RedKit from "@/assets/catalog/t62-red-kit.webp";
import t62RedKit800 from "@/assets/catalog/t62-red-kit@800.webp";
import t62RedKit400 from "@/assets/catalog/t62-red-kit@400.webp";
import t62BlueHero from "@/assets/catalog/t62-blue-hero.webp";
import t62BlueHero800 from "@/assets/catalog/t62-blue-hero@800.webp";
import t62BlueHero400 from "@/assets/catalog/t62-blue-hero@400.webp";
import t62BlueCase from "@/assets/catalog/t62-blue-case.webp";
import t62BlueCase800 from "@/assets/catalog/t62-blue-case@800.webp";
import t62BlueCase400 from "@/assets/catalog/t62-blue-case@400.webp";
import t62BlueBox from "@/assets/catalog/t62-blue-box.webp";
import t62BlueBox800 from "@/assets/catalog/t62-blue-box@800.webp";
import t62BlueBox400 from "@/assets/catalog/t62-blue-box@400.webp";

// ── Motorola T42 ──
import t42TripleHero from "@/assets/catalog/t42-triple-hero.webp";
import t42TripleHero800 from "@/assets/catalog/t42-triple-hero@800.webp";
import t42TripleHero400 from "@/assets/catalog/t42-triple-hero@400.webp";
import t42TripleSide from "@/assets/catalog/t42-triple-side.webp";
import t42TripleSide800 from "@/assets/catalog/t42-triple-side@800.webp";
import t42TripleSide400 from "@/assets/catalog/t42-triple-side@400.webp";
import t42TripleBack from "@/assets/catalog/t42-triple-back.webp";
import t42TripleBack800 from "@/assets/catalog/t42-triple-back@800.webp";
import t42TripleBack400 from "@/assets/catalog/t42-triple-back@400.webp";
import t42TripleCase from "@/assets/catalog/t42-triple-case.webp";
import t42TripleCase800 from "@/assets/catalog/t42-triple-case@800.webp";
import t42TripleCase400 from "@/assets/catalog/t42-triple-case@400.webp";
import t42QuadHero from "@/assets/catalog/t42-quad-hero.webp";
import t42QuadHero800 from "@/assets/catalog/t42-quad-hero@800.webp";
import t42QuadHero400 from "@/assets/catalog/t42-quad-hero@400.webp";
import t42QuadBack from "@/assets/catalog/t42-quad-back.webp";
import t42QuadBack800 from "@/assets/catalog/t42-quad-back@800.webp";
import t42QuadBack400 from "@/assets/catalog/t42-quad-back@400.webp";
import t42QuadCase from "@/assets/catalog/t42-quad-case.webp";
import t42QuadCase800 from "@/assets/catalog/t42-quad-case@800.webp";
import t42QuadCase400 from "@/assets/catalog/t42-quad-case@400.webp";
import t42RedHero from "@/assets/catalog/t42-red-hero.webp";
import t42RedHero800 from "@/assets/catalog/t42-red-hero@800.webp";
import t42RedHero400 from "@/assets/catalog/t42-red-hero@400.webp";
import t42RedPair from "@/assets/catalog/t42-red-pair.webp";
import t42RedPair800 from "@/assets/catalog/t42-red-pair@800.webp";
import t42RedPair400 from "@/assets/catalog/t42-red-pair@400.webp";
import t42RedBox from "@/assets/catalog/t42-red-box.webp";
import t42RedBox800 from "@/assets/catalog/t42-red-box@800.webp";
import t42RedBox400 from "@/assets/catalog/t42-red-box@400.webp";
import t42BlueHero from "@/assets/catalog/t42-blue-hero.webp";
import t42BlueHero800 from "@/assets/catalog/t42-blue-hero@800.webp";
import t42BlueHero400 from "@/assets/catalog/t42-blue-hero@400.webp";
import t42BluePair from "@/assets/catalog/t42-blue-pair.webp";
import t42BluePair800 from "@/assets/catalog/t42-blue-pair@800.webp";
import t42BluePair400 from "@/assets/catalog/t42-blue-pair@400.webp";
import t42BlueBox from "@/assets/catalog/t42-blue-box.webp";
import t42BlueBox800 from "@/assets/catalog/t42-blue-box@800.webp";
import t42BlueBox400 from "@/assets/catalog/t42-blue-box@400.webp";

// ── Motorola TLKR T92 H2O ──
import tlkrHero from "@/assets/catalog/tlkr-t92h2o-hero.webp";
import tlkrHero800 from "@/assets/catalog/tlkr-t92h2o-hero@800.webp";
import tlkrHero400 from "@/assets/catalog/tlkr-t92h2o-hero@400.webp";
import tlkrViews from "@/assets/catalog/tlkr-t92h2o-views.webp";
import tlkrViews800 from "@/assets/catalog/tlkr-t92h2o-views@800.webp";
import tlkrViews400 from "@/assets/catalog/tlkr-t92h2o-views@400.webp";
import tlkrKit from "@/assets/catalog/tlkr-t92h2o-kit.webp";
import tlkrKit800 from "@/assets/catalog/tlkr-t92h2o-kit@800.webp";
import tlkrKit400 from "@/assets/catalog/tlkr-t92h2o-kit@400.webp";

// ── Motorola XT ──
import xt185Hero from "@/assets/catalog/xt185-hero.webp";
import xt185Hero800 from "@/assets/catalog/xt185-hero@800.webp";
import xt185Hero400 from "@/assets/catalog/xt185-hero@400.webp";
import xt185Kit from "@/assets/catalog/xt185-kit.webp";
import xt185Kit800 from "@/assets/catalog/xt185-kit@800.webp";
import xt185Kit400 from "@/assets/catalog/xt185-kit@400.webp";
import xt420Hero from "@/assets/catalog/xt420-hero.webp";
import xt420Hero800 from "@/assets/catalog/xt420-hero@800.webp";
import xt420Hero400 from "@/assets/catalog/xt420-hero@400.webp";
import xt420Box from "@/assets/catalog/xt420-box.webp";
import xt420Box800 from "@/assets/catalog/xt420-box@800.webp";
import xt420Box400 from "@/assets/catalog/xt420-box@400.webp";

import {
  inCity,
  upToFloors,
  upToKm,
  upToKmRange,
  upToM,
  type L,
  type Lang,
} from "@/data/spec-dict";

export type Category = "amateur" | "professional";

export type Brand = "Motorola" | "Radiocom RC";

/**
 * `blurb`, `rangeCity` and `rangeOpen` carry all three languages.
 *
 * They used to be bare Russian strings, which meant the catalogue grid, the
 * product page and the compare table stayed Russian no matter which locale the
 * visitor was on — the copy lives in the data layer, so no amount of i18n JSON
 * could reach it. Read them through `pick(value, lang)` from `spec-dict`.
 */
export type BrandSlug = "radiocom" | "motorola";

export type Product = {
  id: string;
  /**
   * URL segment under the brand, e.g. `rcd-60` at `/ru/radiocom/rcd-60`.
   *
   * Derived from `id` rather than hand-written per model: the Motorola ids
   * carry an `m-` prefix that exists to keep the two families apart in one flat
   * list, and that prefix is redundant once the brand is already in the path.
   * Hand-maintaining 24 duplicate strings would only invite them to drift out
   * of sync with the ids the redirect map is built from.
   */
  slug: string;
  brandSlug: BrandSlug;
  name: string;
  brand: Brand;
  category: Category;
  image: string;
  /** The `@800` sibling — a real import, never derived from `image`. */
  imageSmall?: string;
  /** The `@400` sibling. The model strip renders a 104px chip; 800w there is
   *  eight times the pixels it can show. Same rule: a real import or absent. */
  imageTiny?: string;
  gallery?: string[];
  /** `@800` siblings of `gallery`. Without this rung the card hover shot
   *  jumped straight from 400w to the 1600w master: at a 260px slot on a
   *  phone at DPR 2 the browser needs 520px, so it took the master and paid
   *  91 KB for it. */
  gallerySmall?: string[];
  /** `@400` siblings of `gallery`, for the 187px card hover shot. */
  galleryTiny?: string[];
  /**
   * Kept in the data but absent from the site: no photograph exists, and the
   * model is not in the current price list. It still needs to be here so the
   * generated `/catalog/{id}` 301 keeps working for URLs Google has indexed.
   */
  hidden?: true;
  tags: string[];
  price: number | null; // in сум; null = договорная
  rangeCity: L;
  rangeOpen?: L;
  industries: string[]; // slugs
  blurb: L;
};

const RC = "Radiocom RC" as const;
const MOT = "Motorola" as const;

// Helper — most Motorola PMR-446 talkabouts share the same tag set
const TALK = ["PMR446", "License-free"];

const rawProducts: Omit<Product, "slug" | "brandSlug">[] = [
  // ─── Radiocom RCD (digital / professional) ───
  {
    id: "rcd-70",
    name: "Radiocom RCD-70 PRO",
    brand: RC,
    category: "professional",
    image: rcd70Hero,
    imageSmall: rcd70Hero800,
    imageTiny: rcd70Hero400,
    gallery: [rcd70Box, rcd70Kit],
    gallerySmall: [rcd70Box800, rcd70Kit800],
    galleryTiny: [rcd70Box400, rcd70Kit400],
    tags: ["DMR", "GPS", "IP67"],
    price: 1_900_000,
    rangeCity: upToKm("3"),
    rangeOpen: upToKm("10"),
    industries: ["mining", "construction", "security", "transport"],
    blurb: {
      ru: "Флагман линейки RCD: цифровой DMR, GPS и защита IP67.",
      en: "The RCD flagship: digital DMR, GPS and IP67 protection.",
      uz: "RCD liniyasining flagmani: raqamli DMR, GPS va IP67 himoyasi.",
    },
  },
  {
    id: "rcd-60",
    name: "Radiocom RCD-60 PRO",
    brand: RC,
    category: "professional",
    image: rcd60Hero,
    imageSmall: rcd60Hero800,
    imageTiny: rcd60Hero400,
    gallery: [rcd60Box, rcd60Kit],
    gallerySmall: [rcd60Box800, rcd60Kit800],
    galleryTiny: [rcd60Box400, rcd60Kit400],
    tags: ["DMR", "Display", "Keypad"],
    price: 1_800_000,
    rangeCity: upToKm("2,5"),
    rangeOpen: upToKm("10"),
    industries: ["construction", "security", "mining", "transport"],
    blurb: {
      ru: "Цифровая рация с дисплеем и клавиатурой в полном комплекте.",
      en: "A digital radio with display and keypad, fully equipped.",
      uz: "Displey va klaviaturali raqamli radiostansiya, to'liq komplektda.",
    },
  },
  {
    id: "rcd-50",
    name: "Radiocom RCD-50 PRO",
    brand: RC,
    category: "professional",
    image: rcd50Hero,
    imageSmall: rcd50Hero800,
    imageTiny: rcd50Hero400,
    gallery: [rcd50Box, rcd50Kit],
    gallerySmall: [rcd50Box800, rcd50Kit800],
    galleryTiny: [rcd50Box400, rcd50Kit400],
    tags: ["DMR", "Display"],
    price: 1_800_000,
    rangeCity: upToKm("2,5"),
    rangeOpen: upToKm("10"),
    industries: ["construction", "security", "manufacturing"],
    blurb: {
      ru: "Рабочая лошадка бригад: чистый цифровой звук и дисплей.",
      en: "The crew workhorse: clean digital audio and a display.",
      uz: "Brigadalar uchun ishchi model: toza raqamli ovoz va displey.",
    },
  },
  {
    id: "rcd-40",
    name: "Radiocom RCD-40 PRO",
    brand: RC,
    category: "professional",
    image: rcd40Hero,
    imageSmall: rcd40Hero800,
    imageTiny: rcd40Hero400,
    gallery: [rcd40Box, rcd40Kit],
    gallerySmall: [rcd40Box800, rcd40Kit800],
    galleryTiny: [rcd40Box400, rcd40Kit400],
    tags: ["DMR", "Long range"],
    price: 1_600_000,
    rangeCity: upToKm("2"),
    rangeOpen: upToKm("6"),
    industries: ["construction", "security", "transport"],
    blurb: {
      ru: "Средний класс RCD с усиленным приёмом и долгим циклом работы.",
      en: "Mid-range RCD with boosted reception and a long duty cycle.",
      uz: "Kuchaytirilgan qabul va uzoq ish sikliga ega o'rta sinf RCD.",
    },
  },
  {
    id: "rcd-30",
    name: "Radiocom RCD-30 PRO",
    brand: RC,
    category: "professional",
    image: rcd30Hero,
    imageSmall: rcd30Hero800,
    imageTiny: rcd30Hero400,
    gallery: [rcd30Box, rcd30Kit],
    gallerySmall: [rcd30Box800, rcd30Kit800],
    galleryTiny: [rcd30Box400, rcd30Kit400],
    tags: ["DMR", "Compact"],
    price: 1_800_000,
    rangeCity: upToKm("1,5"),
    rangeOpen: upToKm("4"),
    industries: ["horeca", "security", "construction"],
    blurb: {
      ru: "Самая доступная цифровая рация в линейке — для небольших смен.",
      en: "The most affordable digital radio in the range — for small crews.",
      uz: "Liniyadagi eng arzon raqamli ratsiya — kichik smenalar uchun.",
    },
  },

  // ─── Radiocom RC (analog / everyday) ───
  {
    id: "rc-50",
    name: "Radiocom RC-50",
    brand: RC,
    category: "professional",
    image: rc50Hero,
    imageSmall: rc50Hero800,
    imageTiny: rc50Hero400,
    gallery: [rc50Box, rc50Kit],
    gallerySmall: [rc50Box800, rc50Kit800],
    galleryTiny: [rc50Box400, rc50Kit400],
    tags: ["Long range"],
    price: 1_300_000,
    rangeCity: upToKmRange("2", "2,5"),
    rangeOpen: upToKm("5"),
    industries: ["construction", "security", "transport"],
    blurb: {
      ru: "Универсальная модель для среднего радиуса действия.",
      en: "An all-round model for mid-range coverage.",
      uz: "O'rta radiusdagi aloqa uchun universal model.",
    },
  },
  {
    id: "rc-20",
    name: "Radiocom RC-20",
    brand: RC,
    category: "amateur",
    image: rc20Hero,
    imageSmall: rc20Hero800,
    imageTiny: rc20Hero400,
    gallery: [rc20Box, rc20Kit],
    gallerySmall: [rc20Box800, rc20Kit800],
    galleryTiny: [rc20Box400, rc20Kit400],
    tags: ["Compact", "License-free"],
    price: 1_600_000,
    rangeCity: upToKm("1,5"),
    rangeOpen: upToKm("4"),
    industries: ["horeca", "security"],
    blurb: {
      ru: "Лёгкая рация для персонала — комплект с зарядкой и гарнитурой.",
      en: "A light radio for floor staff — ships with charger and headset.",
      uz: "Xodimlar uchun yengil radiostansiya — quvvatlagich va garnitura bilan.",
    },
  },
  {
    id: "rc-10",
    name: "Radiocom RC-10",
    brand: RC,
    category: "amateur",
    image: rc10Hero,
    imageSmall: rc10Hero800,
    imageTiny: rc10Hero400,
    gallery: [rc10Box, rc10Kit],
    gallerySmall: [rc10Box800, rc10Kit800],
    galleryTiny: [rc10Box400, rc10Kit400],
    tags: ["Compact"],
    price: 1_300_000,
    rangeCity: upToKm("1"),
    rangeOpen: upToKm("3"),
    industries: ["horeca", "security"],
    blurb: {
      ru: "Начальный уровень линейки — надёжно и просто.",
      en: "The entry point of the range — simple and dependable.",
      uz: "Liniyaning boshlang'ich darajasi — sodda va ishonchli.",
    },
  },

  // ─── Motorola Talkabout ───
  {
    id: "m-t82-extreme",
    name: "Motorola Talkabout T82 Extreme",
    brand: MOT,
    category: "amateur",
    image: t82ExtremeHero,
    imageSmall: t82ExtremeHero800,
    imageTiny: t82ExtremeHero400,
    gallery: [t82ExtremePair, t82ExtremeSide, t82ExtremeBack, t82ExtremeCase, t82ExtremeBox],
    gallerySmall: [
      t82ExtremePair800,
      t82ExtremeSide800,
      t82ExtremeBack800,
      t82ExtremeCase800,
      t82ExtremeBox800,
    ],
    galleryTiny: [
      t82ExtremePair400,
      t82ExtremeSide400,
      t82ExtremeBack400,
      t82ExtremeCase400,
      t82ExtremeBox400,
    ],
    tags: [...TALK, "IPx4"],
    price: 1_500_000,
    rangeCity: upToKm("1,5"),
    rangeOpen: upToKm("10"),
    industries: ["horeca", "security", "construction"],
    blurb: {
      ru: "Защищённая рация для работы на улице. Разрешение не нужно.",
      en: "A rugged radio for working outdoors. No licence needed.",
      uz: "Ochiq havoda ishlash uchun himoyalangan ratsiya. Ruxsatnoma kerak emas.",
    },
  },
  {
    id: "m-t82-extreme-quad",
    name: "Motorola Talkabout T82 Extreme Quad",
    brand: MOT,
    category: "amateur",
    image: t82ExtremeQuadHero,
    imageSmall: t82ExtremeQuadHero800,
    imageTiny: t82ExtremeQuadHero400,
    gallery: [t82ExtremeQuadBack, t82ExtremeQuadCase, t82ExtremeQuadBox],
    gallerySmall: [t82ExtremeQuadBack800, t82ExtremeQuadCase800, t82ExtremeQuadBox800],
    galleryTiny: [t82ExtremeQuadBack400, t82ExtremeQuadCase400, t82ExtremeQuadBox400],
    tags: [...TALK, "Quad", "IPx4"],
    price: 2_800_000,
    rangeCity: upToKm("1,5"),
    rangeOpen: upToKm("10"),
    industries: ["horeca", "security", "construction"],
    blurb: {
      ru: "Комплект из 4 раций для организованных бригад.",
      en: "A four-radio kit for organised crews.",
      uz: "Uyushgan brigadalar uchun 4 ta radiostansiyadan iborat to'plam.",
    },
  },
  {
    id: "m-t82-extreme-rsm",
    name: "Motorola Talkabout T82 Extreme RSM",
    brand: MOT,
    category: "amateur",
    // Hidden again, and this entry is the one the CL models' notes point at.
    //
    // Two things kept it hidden originally: no photograph, and no line on the
    // price list. The 15.09.26 shoot closed the first — the hero below is the
    // case with both radios and both remote speaker microphones, which is
    // exactly what distinguishes this SKU — so it was published on the price
    // already in this array.
    //
    // The second gap never closed, and the revised price list makes it worse
    // rather than better: it cuts plain T82 Extreme to 1 500 000, so this
    // bundle would have sat 200 000 above a kit it used to match, on a figure
    // no list backs. A visible model quoting a price the downloadable price
    // list contradicts is worse than one that is absent, so it waits for a
    // real figure. Hidden rather than deleted, so its /catalog 301 keeps
    // resolving. See TODO-content.md.
    hidden: true,
    image: t82ExtremeRsmHero,
    imageSmall: t82ExtremeRsmHero800,
    imageTiny: t82ExtremeRsmHero400,
    tags: [...TALK, "RSM", "IPx4"],
    price: 1_700_000,
    rangeCity: upToKm("1,5"),
    rangeOpen: upToKm("10"),
    industries: ["horeca", "security", "construction"],
    blurb: {
      ru: "T82 Extreme в комплекте с выносными микрофонами RSM для работы в шуме.",
      en: "T82 Extreme bundled with RSM remote speaker microphones for noisy sites.",
      uz: "Shovqinli joylarda ishlash uchun RSM tashqi mikrofonlari bilan T82 Extreme.",
    },
  },
  {
    id: "m-t82",
    name: "Motorola Talkabout T82",
    brand: MOT,
    category: "amateur",
    image: t82Hero,
    imageSmall: t82Hero800,
    imageTiny: t82Hero400,
    gallery: [t82Side, t82Case, t82Box],
    gallerySmall: [t82Side800, t82Case800, t82Box800],
    galleryTiny: [t82Side400, t82Case400, t82Box400],
    tags: TALK,
    price: 1_300_000,
    rangeCity: upToKm("1,5"),
    rangeOpen: upToKm("10"),
    industries: ["horeca", "security"],
    blurb: {
      ru: "Компактная PMR-рация для команд и мероприятий.",
      en: "A compact PMR radio for teams and events.",
      uz: "Jamoalar va tadbirlar uchun ixcham PMR radiostansiya.",
    },
  },
  {
    id: "m-t72",
    name: "Motorola Talkabout T72",
    brand: MOT,
    category: "amateur",
    image: t72Hero,
    imageSmall: t72Hero800,
    imageTiny: t72Hero400,
    gallery: [t72Box],
    gallerySmall: [t72Box800],
    galleryTiny: [t72Box400],
    tags: [...TALK, "IPx4"],
    price: 1_300_000,
    rangeCity: upToKm("1"),
    rangeOpen: upToKm("8"),
    industries: ["horeca", "security", "construction"],
    blurb: {
      ru: "Актуальная PMR для активного использования вне помещений.",
      en: "A current-generation PMR built for active outdoor use.",
      uz: "Ochiq havoda faol foydalanish uchun zamonaviy PMR.",
    },
  },
  {
    id: "m-t62-red",
    name: "Motorola Talkabout T62 Red",
    brand: MOT,
    category: "amateur",
    image: t62RedHero,
    imageSmall: t62RedHero800,
    imageTiny: t62RedHero400,
    gallery: [t62RedCase, t62RedKit],
    gallerySmall: [t62RedCase800, t62RedKit800],
    galleryTiny: [t62RedCase400, t62RedKit400],
    tags: TALK,
    price: 1_000_000,
    rangeCity: upToM("900"),
    rangeOpen: upToKm("8"),
    industries: ["horeca"],
    blurb: {
      ru: "Стильная PMR в красном корпусе с надёжным приёмом.",
      en: "A styled PMR in a red shell, with dependable reception.",
      uz: "Ishonchli qabulga ega qizil korpusdagi nafis PMR.",
    },
  },
  {
    id: "m-t62-blue",
    name: "Motorola Talkabout T62 Blue",
    brand: MOT,
    category: "amateur",
    image: t62BlueHero,
    imageSmall: t62BlueHero800,
    imageTiny: t62BlueHero400,
    gallery: [t62BlueCase, t62BlueBox],
    gallerySmall: [t62BlueCase800, t62BlueBox800],
    galleryTiny: [t62BlueCase400, t62BlueBox400],
    tags: TALK,
    price: 1_000_000,
    rangeCity: upToM("900"),
    rangeOpen: upToKm("8"),
    industries: ["horeca"],
    blurb: {
      ru: "Та же T62 в синем корпусе — для команд и семьи.",
      en: "The same T62 in blue — for teams and families.",
      uz: "Xuddi shu T62 ko'k korpusda — jamoa va oila uchun.",
    },
  },
  {
    id: "m-t42-triple",
    name: "Motorola Talkabout T42 Triple",
    brand: MOT,
    category: "amateur",
    image: t42TripleHero,
    imageSmall: t42TripleHero800,
    imageTiny: t42TripleHero400,
    gallery: [t42TripleSide, t42TripleBack, t42TripleCase],
    gallerySmall: [t42TripleSide800, t42TripleBack800, t42TripleCase800],
    galleryTiny: [t42TripleSide400, t42TripleBack400, t42TripleCase400],
    tags: [...TALK, "Triple"],
    price: 700_000,
    rangeCity: upToM("300"),
    rangeOpen: upToKm("4"),
    industries: ["horeca"],
    blurb: {
      ru: "Комплект из 3 раций для малых команд.",
      en: "A three-radio kit for small teams.",
      uz: "Kichik jamoalar uchun 3 ta radiostansiyadan iborat to'plam.",
    },
  },
  {
    id: "m-t42-quad",
    name: "Motorola Talkabout T42 Quad",
    brand: MOT,
    category: "amateur",
    image: t42QuadHero,
    imageSmall: t42QuadHero800,
    imageTiny: t42QuadHero400,
    gallery: [t42QuadBack, t42QuadCase],
    gallerySmall: [t42QuadBack800, t42QuadCase800],
    galleryTiny: [t42QuadBack400, t42QuadCase400],
    tags: [...TALK, "Quad"],
    price: 900_000,
    rangeCity: upToM("300"),
    rangeOpen: upToKm("4"),
    industries: ["horeca"],
    blurb: {
      ru: "Комплект из 4 раций T42.",
      en: "A four-radio T42 kit.",
      uz: "4 ta T42 radiostansiyasidan iborat to'plam.",
    },
  },
  {
    id: "m-t42-red",
    name: "Motorola Talkabout T42 Red",
    brand: MOT,
    category: "amateur",
    image: t42RedHero,
    imageSmall: t42RedHero800,
    imageTiny: t42RedHero400,
    gallery: [t42RedPair, t42RedBox],
    gallerySmall: [t42RedPair800, t42RedBox800],
    galleryTiny: [t42RedPair400, t42RedBox400],
    tags: TALK,
    price: 600_000,
    rangeCity: upToM("300"),
    rangeOpen: upToKm("4"),
    industries: ["horeca"],
    blurb: {
      ru: "Начальная PMR для семей и малого бизнеса.",
      en: "An entry-level PMR for families and small businesses.",
      uz: "Oilalar va kichik biznes uchun boshlang'ich PMR.",
    },
  },
  {
    id: "m-t42-blue",
    name: "Motorola Talkabout T42 Blue",
    brand: MOT,
    category: "amateur",
    image: t42BlueHero,
    imageSmall: t42BlueHero800,
    imageTiny: t42BlueHero400,
    gallery: [t42BluePair, t42BlueBox],
    gallerySmall: [t42BluePair800, t42BlueBox800],
    galleryTiny: [t42BluePair400, t42BlueBox400],
    tags: TALK,
    price: 600_000,
    rangeCity: upToM("300"),
    rangeOpen: upToKm("4"),
    industries: ["horeca"],
    blurb: {
      ru: "T42 в синем корпусе — просто, доступно, надёжно.",
      en: "The T42 in blue — simple, affordable, dependable.",
      uz: "Ko'k korpusdagi T42 — sodda, arzon, ishonchli.",
    },
  },
  {
    id: "m-tlkr-t92h2o",
    name: "Motorola TLKR-T92 H2O",
    brand: MOT,
    category: "amateur",
    image: tlkrHero,
    imageSmall: tlkrHero800,
    imageTiny: tlkrHero400,
    gallery: [tlkrViews, tlkrKit],
    gallerySmall: [tlkrViews800, tlkrKit800],
    galleryTiny: [tlkrViews400, tlkrKit400],
    tags: [...TALK, "IP67", "Float"],
    price: 1_700_000,
    rangeCity: upToKm("1,5"),
    rangeOpen: upToKm("10"),
    industries: ["horeca", "construction", "security"],
    blurb: {
      ru: "Плавает, водозащищена IP67 — для воды и стройки.",
      en: "It floats, and it is IP67 waterproof — for water and building sites.",
      uz: "Suzadi va IP67 suvdan himoyalangan — suv va qurilish uchun.",
    },
  },
  {
    id: "m-xt185",
    name: "Motorola XT185",
    brand: MOT,
    category: "amateur",
    image: xt185Hero,
    imageSmall: xt185Hero800,
    imageTiny: xt185Hero400,
    gallery: [xt185Kit],
    gallerySmall: [xt185Kit800],
    galleryTiny: [xt185Kit400],
    tags: TALK,
    price: 1_500_000,
    rangeCity: upToKm("1"),
    rangeOpen: upToKm("8"),
    industries: ["horeca"],
    blurb: {
      ru: "PMR для розницы, HoReCa и общественных заведений.",
      en: "PMR for retail, HoReCa and public venues.",
      uz: "Chakana savdo, HoReCa va jamoat joylari uchun PMR.",
    },
  },
  {
    id: "m-xt420",
    name: "Motorola XT420",
    brand: MOT,
    category: "professional",
    image: xt420Hero,
    imageSmall: xt420Hero800,
    imageTiny: xt420Hero400,
    gallery: [xt420Box],
    gallerySmall: [xt420Box800],
    galleryTiny: [xt420Box400],
    tags: [...TALK, "IP55"],
    price: 2_200_000,
    rangeCity: inCity(upToKm("2")),
    industries: ["horeca", "security", "construction", "manufacturing"],
    blurb: {
      ru: "Безлицензионная PMR для HoReCa и объектной охраны.",
      en: "A licence-free PMR for HoReCa and on-site security.",
      uz: "HoReCa va obyekt qo'riqlash uchun litsenziyasiz PMR.",
    },
  },

  // ─── Motorola CL — on-site retail & hospitality ───
  // NOTE: both use a stand-in photo until real catalogue shots are supplied.
  {
    id: "m-clp446",
    name: "Motorola CLP 446",
    brand: MOT,
    category: "professional",
    // See m-t82-extreme-rsm: no photograph, absent from the price list,
    // hidden rather than deleted so its /catalog 301 keeps resolving.
    hidden: true,
    image: "",
    tags: [...TALK, "Antibacterial"],
    price: 2_300_000,
    rangeCity: upToFloors("6"),
    industries: ["horeca", "security"],
    blurb: {
      ru: "Плоская рация без антенны для персонала зала — антибактериальный корпус.",
      en: "A flat, antenna-free radio for front-of-house staff — antibacterial housing.",
      uz: "Zal xodimlari uchun antennasiz yassi radiostansiya — antibakterial korpus.",
    },
  },
  {
    id: "m-clk446",
    name: "Motorola CLK 446",
    brand: MOT,
    category: "professional",
    // See m-t82-extreme-rsm: no photograph, absent from the price list,
    // hidden rather than deleted so its /catalog 301 keeps resolving.
    hidden: true,
    image: "",
    tags: [...TALK, "Antimicrobial", "Display"],
    price: 2_500_000,
    rangeCity: upToFloors("6"),
    industries: ["horeca", "security"],
    blurb: {
      ru: "Самая тонкая CL: 14 мм, антимикробное покрытие, дисплей.",
      en: "The slimmest CL: 14 mm, antimicrobial coating, display.",
      uz: "Eng nozik CL: 14 mm, antimikrob qoplama, displey.",
    },
  },
];

export const BRAND_SLUG: Record<Brand, BrandSlug> = {
  "Radiocom RC": "radiocom",
  Motorola: "motorola",
};

/**
 * The catalogue, with its URL identity attached.
 *
 * `/ru/catalog/m-t82` became `/ru/motorola/t82`, so the redirect map in
 * `scripts/generate-seo.ts` is generated from `id` -> `brandSlug/slug` over
 * this same array. One source, no second list to forget to update.
 */
export const products: Product[] = rawProducts.map((p) => ({
  ...p,
  brandSlug: BRAND_SLUG[p.brand],
  slug: p.id.replace(/^m-/, ""),
}));

/**
 * What the site actually shows.
 *
 * `products` is the full record — it has to stay complete because the
 * `/catalog/{id}` redirect map is generated from it, and a hidden model's old
 * URL is still indexed. `visibleProducts` is what every page, the lineup, the
 * compare tables and the sitemap iterate over. Anything that renders a product
 * to a visitor uses this; only the redirect generator uses `products`.
 */
export const visibleProducts: Product[] = products.filter((p) => !p.hidden);

export const BRAND_SLUGS: readonly BrandSlug[] = ["radiocom", "motorola"];

/** Narrows a raw route param to a real brand, so unknown segments can 404. */
export function isBrandSlug(v: string): v is BrandSlug {
  return (BRAND_SLUGS as readonly string[]).includes(v);
}

export function productsOfBrand(brandSlug: BrandSlug): Product[] {
  return visibleProducts.filter((p) => p.brandSlug === brandSlug);
}

/**
 * Where an old `/catalog/{id}` URL should land.
 *
 * A hidden model is the case this exists for. Its product page 404s by design
 * (`productBySlug` is over `visibleProducts`), but its old catalogue URL is
 * already indexed — so redirecting it to its own product page produced a
 * 301 -> 404 chain, which Google reports as a broken redirect and which is
 * strictly worse than either a plain 404 or a redirect to a live page. The
 * brand page is the nearest thing that exists and answers 200.
 *
 * Returns `null` for an id that is not in `products` at all; the caller falls
 * back to the default brand page.
 */
export function legacyCatalogTarget(
  id: string,
): { brand: BrandSlug; model: string } | { brand: BrandSlug } | null {
  const p = products.find((x) => x.id === id);
  if (!p) return null;
  return p.hidden ? { brand: p.brandSlug } : { brand: p.brandSlug, model: p.slug };
}

/**
 * The model name with everything the surrounding context already says removed.
 *
 * For a chip in a brand page's model strip or a column head in the compare
 * table, the brand is redundant — the page or the row above states it — and so
 * is `Talkabout`, which every Motorola on the page shares and which therefore
 * distinguishes nothing. Left in, "Motorola Talkabout T82 Extreme Quad" wraps
 * to three lines in a 104px chip and a 210px table column, where the whole
 * point is to read a model at a glance.
 */
export function shortName(name: string): string {
  return name
    .replace(/^Radiocom |^Motorola /, "")
    .replace(/^Talkabout /, "")
    .replace(/\s+H2O$/, "");
}

export function productBySlug(brandSlug: BrandSlug, slug: string): Product | undefined {
  // Deliberately over `visibleProducts`: a hidden model must 404 as a product
  // page, not render one with an empty image slot.
  return visibleProducts.find((p) => p.brandSlug === brandSlug && p.slug === slug);
}

/**
 * The ends of a brand line-up's price span, for the summary line above it.
 *
 * Both skip the models priced "on request" rather than counting them as zero,
 * and both return `null` for a line-up with no published price at all — which
 * is what lets the caller drop the line entirely instead of rendering a range
 * with nothing in it.
 */
function knownPrices(list: Product[]): number[] {
  return list.map((p) => p.price).filter((n): n is number => n != null);
}

export function priceFrom(list: Product[]): number | null {
  const known = knownPrices(list);
  return known.length ? Math.min(...known) : null;
}

export function priceTo(list: Product[]): number | null {
  const known = knownPrices(list);
  return known.length ? Math.max(...known) : null;
}

export const categoryLabels: Record<Category, { ru: string; en: string; uz: string }> = {
  amateur: { ru: "Для дома и отдыха", en: "For home and outdoors", uz: "Uy va dam olish uchun" },
  professional: { ru: "Для работы", en: "For work", uz: "Ish uchun" },
};

export const allBrands: Brand[] = ["Radiocom RC", "Motorola"];

/**
 * Digits only, space-grouped. The `replace` is a fallback, not decoration: an
 * environment without the ru-RU locale data falls back to en-US and returns
 * "600,000", which reads as a decimal to a Russian or Uzbek reader.
 */
function groupDigits(price: number): string {
  return price.toLocaleString("ru-RU").replace(/,/g, " ");
}

function priceSuffix(lang: "ru" | "en" | "uz"): string {
  return lang === "en" ? "UZS" : lang === "uz" ? "so'm" : "сум";
}

export function formatPrice(price: number | null, lang: "ru" | "en" | "uz"): string {
  if (price == null) {
    return lang === "en" ? "On request" : lang === "uz" ? "Kelishiladi" : "Договорная";
  }
  return `${groupDigits(price)} ${priceSuffix(lang)}`;
}

/**
 * A line-up's price span as one string: "600 000 – 2 800 000 сум".
 *
 * The currency is named once, at the end, rather than after each figure —
 * "600 000 сум – 2 800 000 сум" is the same information read twice.
 *
 * Collapsing to a single price when the ends meet is not a nicety. A brand can
 * arrive at one published price two ways: it lists one model, or every model it
 * lists costs the same. Both would otherwise render "600 000 – 600 000 сум",
 * which reads as a mistake in the data rather than a range with no width.
 */
export function formatPriceRange(
  lo: number | null,
  hi: number | null,
  lang: "ru" | "en" | "uz",
): string {
  if (lo == null || hi == null || hi === lo) return formatPrice(lo ?? hi, lang);
  return `${groupDigits(lo)} – ${groupDigits(hi)} ${priceSuffix(lang)}`;
}
