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
 * Naming is `<model>-<variant>`: `hero` is the radios alone, `kit`/`box` is the
 * retail packaging or accessory flat-lay. Heroes lead the product pages —
 * an apple.com product hero is the product, never its box.
 */
import rcd70Hero from "@/assets/catalog/rcd-70-hero.webp";
import rcd70Hero800 from "@/assets/catalog/rcd-70-hero@800.webp";
import rcd70Hero400 from "@/assets/catalog/rcd-70-hero@400.webp";
import rcd70Kit from "@/assets/catalog/rcd-70-kit.webp";
import rcd70Kit400 from "@/assets/catalog/rcd-70-kit@400.webp";
import rcd70Kit800 from "@/assets/catalog/rcd-70-kit@800.webp";
import rcd60Hero from "@/assets/catalog/rcd-60-hero.webp";
import rcd60Hero800 from "@/assets/catalog/rcd-60-hero@800.webp";
import rcd60Hero400 from "@/assets/catalog/rcd-60-hero@400.webp";
import rcd60Kit from "@/assets/catalog/rcd-60-kit.webp";
import rcd60Kit400 from "@/assets/catalog/rcd-60-kit@400.webp";
import rcd60Kit800 from "@/assets/catalog/rcd-60-kit@800.webp";
import rcd50Hero from "@/assets/catalog/rcd-50-hero.webp";
import rcd50Hero800 from "@/assets/catalog/rcd-50-hero@800.webp";
import rcd50Hero400 from "@/assets/catalog/rcd-50-hero@400.webp";
import rcd50Kit from "@/assets/catalog/rcd-50-kit.webp";
import rcd50Kit400 from "@/assets/catalog/rcd-50-kit@400.webp";
import rcd50Kit800 from "@/assets/catalog/rcd-50-kit@800.webp";
// Device-only crops, for the model strip. Five Radiocom models have no
// standalone product shot — only a kit flat-lay — so the strip was showing a
// charger and two cables where the other three showed a radio. These are the
// radio cropped out of that same flat-lay by `scripts/crop-device-shots.ts`,
// not new photography.
import rcd40Device from "@/assets/catalog/rcd-40-device.webp";
import rcd30Device from "@/assets/catalog/rcd-30-device.webp";
import rc50Device from "@/assets/catalog/rc-50-device.webp";
import rc20Device from "@/assets/catalog/rc-20-device.webp";
import rc10Device from "@/assets/catalog/rc-10-device.webp";
import rcd40Kit from "@/assets/catalog/rcd-40-kit.webp";
import rcd40Kit800 from "@/assets/catalog/rcd-40-kit@800.webp";
import rcd40Kit400 from "@/assets/catalog/rcd-40-kit@400.webp";
import rcd30Kit from "@/assets/catalog/rcd-30-kit.webp";
import rcd30Kit800 from "@/assets/catalog/rcd-30-kit@800.webp";
import rcd30Kit400 from "@/assets/catalog/rcd-30-kit@400.webp";
import rc50Kit from "@/assets/catalog/rc-50-kit.webp";
import rc50Kit800 from "@/assets/catalog/rc-50-kit@800.webp";
import rc50Kit400 from "@/assets/catalog/rc-50-kit@400.webp";
import rc20Kit from "@/assets/catalog/rc-20-kit.webp";
import rc20Kit800 from "@/assets/catalog/rc-20-kit@800.webp";
import rc20Kit400 from "@/assets/catalog/rc-20-kit@400.webp";
import rc10Kit from "@/assets/catalog/rc-10-kit.webp";
import rc10Kit800 from "@/assets/catalog/rc-10-kit@800.webp";
import rc10Kit400 from "@/assets/catalog/rc-10-kit@400.webp";

import t82ExtremeHero from "@/assets/catalog/t82-extreme-hero.webp";
import t82ExtremeHero800 from "@/assets/catalog/t82-extreme-hero@800.webp";
import t82ExtremeHero400 from "@/assets/catalog/t82-extreme-hero@400.webp";
import t82ExtremePair from "@/assets/catalog/t82-extreme-pair.webp";
import t82ExtremePair400 from "@/assets/catalog/t82-extreme-pair@400.webp";
import t82ExtremePair800 from "@/assets/catalog/t82-extreme-pair@800.webp";
import t82ExtremeKit from "@/assets/catalog/t82-extreme-kit.webp";
import t82ExtremeKit400 from "@/assets/catalog/t82-extreme-kit@400.webp";
import t82ExtremeKit800 from "@/assets/catalog/t82-extreme-kit@800.webp";
import t82ExtremeQuadHero from "@/assets/catalog/t82-extreme-quad-hero.webp";
import t82ExtremeQuadHero800 from "@/assets/catalog/t82-extreme-quad-hero@800.webp";
import t82ExtremeQuadHero400 from "@/assets/catalog/t82-extreme-quad-hero@400.webp";
import t82Hero from "@/assets/catalog/t82-hero.webp";
import t82Hero800 from "@/assets/catalog/t82-hero@800.webp";
import t82Hero400 from "@/assets/catalog/t82-hero@400.webp";
import t72Hero from "@/assets/catalog/t72-hero.webp";
import t72Hero800 from "@/assets/catalog/t72-hero@800.webp";
import t72Hero400 from "@/assets/catalog/t72-hero@400.webp";
import t72Alt from "@/assets/catalog/t72-alt.webp";
import t72Alt400 from "@/assets/catalog/t72-alt@400.webp";
import t72Alt800 from "@/assets/catalog/t72-alt@800.webp";
import t72Box from "@/assets/catalog/t72-box.webp";
import t72Box400 from "@/assets/catalog/t72-box@400.webp";
import t72Box800 from "@/assets/catalog/t72-box@800.webp";
import t62RedHero from "@/assets/catalog/t62-red-hero.webp";
import t62RedHero800 from "@/assets/catalog/t62-red-hero@800.webp";
import t62RedHero400 from "@/assets/catalog/t62-red-hero@400.webp";
import t62RedFront from "@/assets/catalog/t62-red-front.webp";
import t62RedFront400 from "@/assets/catalog/t62-red-front@400.webp";
import t62RedFront800 from "@/assets/catalog/t62-red-front@800.webp";
import t62RedBack from "@/assets/catalog/t62-red-back.webp";
import t62RedBack400 from "@/assets/catalog/t62-red-back@400.webp";
import t62RedBack800 from "@/assets/catalog/t62-red-back@800.webp";
import t62BlueHero from "@/assets/catalog/t62-blue-hero.webp";
import t62BlueHero800 from "@/assets/catalog/t62-blue-hero@800.webp";
import t62BlueHero400 from "@/assets/catalog/t62-blue-hero@400.webp";
import t62BlueBox from "@/assets/catalog/t62-blue-box.webp";
import t62BlueBox400 from "@/assets/catalog/t62-blue-box@400.webp";
import t62BlueBox800 from "@/assets/catalog/t62-blue-box@800.webp";
import t42TripleHero from "@/assets/catalog/t42-triple-hero.webp";
import t42TripleHero800 from "@/assets/catalog/t42-triple-hero@800.webp";
import t42TripleHero400 from "@/assets/catalog/t42-triple-hero@400.webp";
import t42TripleAlt from "@/assets/catalog/t42-triple-alt.webp";
import t42TripleAlt400 from "@/assets/catalog/t42-triple-alt@400.webp";
import t42TripleAlt800 from "@/assets/catalog/t42-triple-alt@800.webp";
import t42TripleBox from "@/assets/catalog/t42-triple-box.webp";
import t42TripleBox400 from "@/assets/catalog/t42-triple-box@400.webp";
import t42TripleBox800 from "@/assets/catalog/t42-triple-box@800.webp";
import t42QuadHero from "@/assets/catalog/t42-quad-hero.webp";
import t42QuadHero800 from "@/assets/catalog/t42-quad-hero@800.webp";
import t42QuadHero400 from "@/assets/catalog/t42-quad-hero@400.webp";
import t42QuadAlt from "@/assets/catalog/t42-quad-alt.webp";
import t42QuadAlt400 from "@/assets/catalog/t42-quad-alt@400.webp";
import t42QuadAlt800 from "@/assets/catalog/t42-quad-alt@800.webp";
import t42QuadBox from "@/assets/catalog/t42-quad-box.webp";
import t42QuadBox400 from "@/assets/catalog/t42-quad-box@400.webp";
import t42QuadBox800 from "@/assets/catalog/t42-quad-box@800.webp";
import t42RedHero from "@/assets/catalog/t42-red-hero.webp";
import t42RedHero800 from "@/assets/catalog/t42-red-hero@800.webp";
import t42RedHero400 from "@/assets/catalog/t42-red-hero@400.webp";
import t42RedPair from "@/assets/catalog/t42-red-pair.webp";
import t42RedPair400 from "@/assets/catalog/t42-red-pair@400.webp";
import t42RedPair800 from "@/assets/catalog/t42-red-pair@800.webp";
import t42RedBox from "@/assets/catalog/t42-red-box.webp";
import t42RedBox400 from "@/assets/catalog/t42-red-box@400.webp";
import t42RedBox800 from "@/assets/catalog/t42-red-box@800.webp";
import t42BlueHero from "@/assets/catalog/t42-blue-hero.webp";
import t42BlueHero800 from "@/assets/catalog/t42-blue-hero@800.webp";
import t42BlueHero400 from "@/assets/catalog/t42-blue-hero@400.webp";
import t42BluePair from "@/assets/catalog/t42-blue-pair.webp";
import t42BluePair400 from "@/assets/catalog/t42-blue-pair@400.webp";
import t42BluePair800 from "@/assets/catalog/t42-blue-pair@800.webp";
import t42BlueBox from "@/assets/catalog/t42-blue-box.webp";
import t42BlueBox400 from "@/assets/catalog/t42-blue-box@400.webp";
import t42BlueBox800 from "@/assets/catalog/t42-blue-box@800.webp";
import tlkrHero from "@/assets/catalog/tlkr-t92h2o-hero.webp";
import tlkrHero800 from "@/assets/catalog/tlkr-t92h2o-hero@800.webp";
import tlkrHero400 from "@/assets/catalog/tlkr-t92h2o-hero@400.webp";
import tlkrFront from "@/assets/catalog/tlkr-t92h2o-front.webp";
import tlkrFront400 from "@/assets/catalog/tlkr-t92h2o-front@400.webp";
import tlkrFront800 from "@/assets/catalog/tlkr-t92h2o-front@800.webp";
import tlkrSide from "@/assets/catalog/tlkr-t92h2o-side.webp";
import tlkrSide400 from "@/assets/catalog/tlkr-t92h2o-side@400.webp";
import tlkrSide800 from "@/assets/catalog/tlkr-t92h2o-side@800.webp";
import xt185Hero from "@/assets/catalog/xt185-hero.webp";
import xt185Hero800 from "@/assets/catalog/xt185-hero@800.webp";
import xt185Hero400 from "@/assets/catalog/xt185-hero@400.webp";
import xt185Alt from "@/assets/catalog/xt185-alt.webp";
import xt185Alt400 from "@/assets/catalog/xt185-alt@400.webp";
import xt185Alt800 from "@/assets/catalog/xt185-alt@800.webp";
import xt185Kit from "@/assets/catalog/xt185-kit.webp";
import xt185Kit400 from "@/assets/catalog/xt185-kit@400.webp";
import xt185Kit800 from "@/assets/catalog/xt185-kit@800.webp";
import xt420Hero from "@/assets/catalog/xt420-hero.webp";
import xt420Hero800 from "@/assets/catalog/xt420-hero@800.webp";
import xt420Hero400 from "@/assets/catalog/xt420-hero@400.webp";

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
  /**
   * A device-only shot for the model strip, where `image` is a kit flat-lay.
   *
   * apple.com's chip row shows one device per chip; that is what makes the row
   * scannable. A flat-lay in the same slot renders as an unreadable scatter of
   * accessories at 96px. Falls back to `image` when the hero already is the
   * device alone.
   */
  strip?: string;
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
    gallery: [rcd70Kit],
    gallerySmall: [rcd70Kit800],
    galleryTiny: [rcd70Kit400],
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
    gallery: [rcd60Kit],
    gallerySmall: [rcd60Kit800],
    galleryTiny: [rcd60Kit400],
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
    gallery: [rcd50Kit],
    gallerySmall: [rcd50Kit800],
    galleryTiny: [rcd50Kit400],
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
    image: rcd40Kit,
    imageSmall: rcd40Kit800,
    imageTiny: rcd40Kit400,
    strip: rcd40Device,
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
    image: rcd30Kit,
    imageSmall: rcd30Kit800,
    imageTiny: rcd30Kit400,
    strip: rcd30Device,
    tags: ["DMR", "Compact"],
    price: 1_800_000,
    rangeCity: upToKm("1,5"),
    rangeOpen: upToKm("4"),
    industries: ["horeca", "security", "construction"],
    blurb: {
      ru: "Компактная цифровая рация для входа в профессиональный сегмент.",
      en: "A compact digital radio — the way into the professional tier.",
      uz: "Professional segmentga kirish uchun ixcham raqamli radiostansiya.",
    },
  },

  // ─── Radiocom RC (analog / everyday) ───
  {
    id: "rc-50",
    name: "Radiocom RC-50",
    brand: RC,
    category: "professional",
    image: rc50Kit,
    imageSmall: rc50Kit800,
    imageTiny: rc50Kit400,
    strip: rc50Device,
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
    image: rc20Kit,
    imageSmall: rc20Kit800,
    imageTiny: rc20Kit400,
    strip: rc20Device,
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
    image: rc10Kit,
    imageSmall: rc10Kit800,
    imageTiny: rc10Kit400,
    strip: rc10Device,
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
    gallery: [t82ExtremePair, t82ExtremeKit],
    gallerySmall: [t82ExtremePair800, t82ExtremeKit800],
    galleryTiny: [t82ExtremePair400, t82ExtremeKit400],
    tags: [...TALK, "IPx4"],
    price: 1_700_000,
    rangeCity: upToKm("1,5"),
    rangeOpen: upToKm("10"),
    industries: ["horeca", "security", "construction"],
    blurb: {
      ru: "Защищённая безлицензионная рация для outdoor задач.",
      en: "A rugged licence-free radio for work outdoors.",
      uz: "Ochiq havodagi vazifalar uchun himoyalangan, litsenziyasiz radiostansiya.",
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
    tags: [...TALK, "Quad", "IPx4"],
    price: 3_100_000,
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
    // No photograph exists for this model, and it is absent from the
    // 29.06.26 price list as well. Hidden rather than deleted: the
    // /catalog/m-t82-extreme-rsm 301 is generated from this array and points at a
    // URL Google has already indexed. Flip `hidden` when a shot lands.
    hidden: true,
    image: "",
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
    tags: TALK,
    price: 1_500_000,
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
    gallery: [t72Alt, t72Box],
    gallerySmall: [t72Alt800, t72Box800],
    galleryTiny: [t72Alt400, t72Box400],
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
    gallery: [t62RedFront, t62RedBack],
    gallerySmall: [t62RedFront800, t62RedBack800],
    galleryTiny: [t62RedFront400, t62RedBack400],
    tags: TALK,
    price: 1_100_000,
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
    gallery: [t62BlueBox],
    gallerySmall: [t62BlueBox800],
    galleryTiny: [t62BlueBox400],
    tags: TALK,
    price: 1_100_000,
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
    gallery: [t42TripleAlt, t42TripleBox],
    gallerySmall: [t42TripleAlt800, t42TripleBox800],
    galleryTiny: [t42TripleAlt400, t42TripleBox400],
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
    gallery: [t42QuadAlt, t42QuadBox],
    gallerySmall: [t42QuadAlt800, t42QuadBox800],
    galleryTiny: [t42QuadAlt400, t42QuadBox400],
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
    gallery: [tlkrFront, tlkrSide],
    gallerySmall: [tlkrFront800, tlkrSide800],
    galleryTiny: [tlkrFront400, tlkrSide400],
    tags: [...TALK, "IP67", "Float"],
    price: 1_800_000,
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
    gallery: [xt185Alt, xt185Kit],
    gallerySmall: [xt185Alt800, xt185Kit800],
    galleryTiny: [xt185Alt400, xt185Kit400],
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

/** Cheapest price in a brand's line-up, for the "from N сум" on brand cards. */
export function priceFrom(list: Product[]): number | null {
  const known = list.map((p) => p.price).filter((n): n is number => n != null);
  return known.length ? Math.min(...known) : null;
}

export const categoryLabels: Record<Category, { ru: string; en: string; uz: string }> = {
  amateur: { ru: "Любительские", en: "Amateur", uz: "Havaskor" },
  professional: { ru: "Профессиональные", en: "Professional", uz: "Professional" },
};

export const allBrands: Brand[] = ["Radiocom RC", "Motorola"];

export function formatPrice(price: number | null, lang: "ru" | "en" | "uz"): string {
  if (price == null) {
    return lang === "en" ? "On request" : lang === "uz" ? "Kelishiladi" : "Договорная";
  }
  const suffix = lang === "en" ? "UZS" : lang === "uz" ? "so'm" : "сум";
  return `${price.toLocaleString("ru-RU").replace(/,/g, " ")} ${suffix}`;
}
