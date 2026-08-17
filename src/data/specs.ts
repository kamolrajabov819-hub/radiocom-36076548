/**
 * Full manufacturer specifications, box contents and feature lists, per product.
 *
 * Vocabulary that repeats across models lives in `spec-dict.ts`; this file holds
 * only what is genuinely per-model.
 *
 * Three sections per product, mirroring how the vendor sheets are actually written:
 *   `inBox`    — комплектация, with quantities
 *   `rows`     — measurable label/value pairs (frequency, power, dimensions, weight…)
 *   `features` — a flat capability list (VOX, Room Monitor, keypad lock…)
 *
 * Every figure here is the manufacturer's own. Do not round, average or "tidy" them.
 */

import {
  BOX,
  F,
  SPEC,
  V,
  aaa,
  audioConnector,
  box,
  callTones,
  channels,
  channelsCodes,
  cm,
  grams,
  hours,
  liIon,
  liPo,
  mah,
  mm,
  pfbFeature,
  radios,
  toneCodes,
  upToHours,
  upToKm,
  watts,
  type BoxLine,
  type L,
} from "./spec-dict";

export { RANGE_NOTE } from "./spec-dict";

export type SpecRow = { label: L; value: L };

export type ProductSpec = {
  /** Vendor marketing paragraph, where one was supplied. */
  intro?: L;
  /** Colour the unit ships in, when the vendor calls it out. */
  colour?: L;
  /** "In the box" list. */
  inBox: BoxLine[];
  /** Measurable specifications. */
  rows: SpecRow[];
  /** Capability bullets. */
  features: L[];
  /** Show the line-of-sight disclaimer — set on every model quoting a range. */
  rangeNote?: boolean;
};

const row = (label: L, value: L): SpecRow => ({ label, value });

const ip = (grade: string): L => ({ ru: grade, en: grade, uz: grade });

/* ─────────────────────────────────────────────────────────────
   Shared blocks
   ───────────────────────────────────────────────────────────── */

/** PMR-446 header rows shared by every Talkabout. */
const pmr446 = (range: L): SpecRow[] => [
  row(SPEC.standard, V.pmr),
  row(SPEC.freq, V.freq446),
  row(SPEC.range, range),
];

/** T82 family — T82, T82 Extreme, Extreme Quad, Extreme RSM share one sheet. */
const t82Rows: SpecRow[] = [
  ...pmr446(upToKm("10")),
  row(SPEC.ingress, ip("IPX4")),
  row(SPEC.channels, channelsCodes("8", "121")),
  row(SPEC.callTones, callTones("20")),
  row(SPEC.power, watts("0,5")),
  row(SPEC.dimensions, mm("57×181×33")),
];

const t82Features: L[] = [
  F.freeCalls,
  F.niMh,
  F.vox,
  F.scanMonitor,
  F.roomMonitor,
  F.lcdBacklit,
  F.keypadLock,
  F.batteryIndicator,
  F.headsetJack,
];

/** T42 family — the entry-level AAA-powered Talkabout. */
const t42Rows = (range: L): SpecRow[] => [
  ...pmr446(range),
  row(SPEC.channels, channels("8")),
  row(SPEC.batteryType, aaa("3")),
  row(SPEC.power, watts("0,5")),
  row(SPEC.dimensions, mm("50×134×29")),
  row(SPEC.weight, grams("74")),
];

const t42Features: L[] = [F.freeCalls, F.lcdBacklit, F.keypadLock, F.batteryIndicator];

/** T62 family. */
const t62Rows: SpecRow[] = [
  ...pmr446({
    ru: "до 8 км на открытой местности, 700–800 м в городских условиях",
    en: "up to 8 km in the open, 700–800 m in built-up areas",
    uz: "ochiq joyda 8 km gacha, shahar sharoitida 700–800 m",
  }),
  row(SPEC.channels, channelsCodes("8", "121")),
  row(SPEC.callTones, callTones("5")),
  row(SPEC.power, watts("0,5")),
  row(SPEC.dimensions, mm("55×165×30")),
  row(SPEC.weight, grams("103")),
  row(SPEC.warranty, V.warrantyRadioOnly),
];

const t62Features: L[] = [
  F.freeCalls,
  F.niMh,
  F.vox,
  F.scanMonitor,
  F.roomMonitor,
  F.lcdBacklit,
  F.keypadLock,
  F.batteryIndicator,
  F.headsetJack,
];

/** CLP / CLK — the retail and hospitality pair. */
const clRows = (dims: L): SpecRow[] => [
  row(SPEC.standard, V.pmr),
  row(SPEC.freq, V.freq446),
  row(SPEC.range, {
    ru: "до 6 этажей или 7400 м²",
    en: "up to 6 floors or 7,400 m²",
    uz: "6 qavatgacha yoki 7400 m²",
  }),
  row(SPEC.channels, channelsCodes("8", "219")),
  row(SPEC.batteryType, liIon("1130")),
  row(SPEC.power, watts("0,5")),
  row(SPEC.dimensions, dims),
  row(SPEC.weight, grams("68")),
];

const clFeatures = (bodyFeature: L): L[] => [
  bodyFeature,
  F.freeCalls,
  F.liIon,
  F.bigPtt,
  F.vox,
  F.headsetJack,
  F.lowBatteryAlert,
];

/** Digital RCD platform features shared by RCD-50/60/70. */
const rcdDigitalFeatures = (buttons: L, extra: L[] = []): L[] => [
  F.tdma,
  F.voiceAnnounce,
  F.callsAll,
  F.radioManagement,
  F.aes256,
  F.loneWorker,
  buttons,
  ...extra,
];

/* ─────────────────────────────────────────────────────────────
   Per-product specifications
   ───────────────────────────────────────────────────────────── */

export const specs: Record<string, ProductSpec> = {
  /* ── Motorola Talkabout T82 family ─────────────────────── */

  "m-t82-extreme": {
    colour: { ru: "Чёрно-оранжевый", en: "Black and orange", uz: "Qora-to'q sariq" },
    inBox: [
      box(BOX.radio, 2),
      box(BOX.beltClip, 2),
      box(BOX.microUsb, 1),
      box(BOX.batteryNiMh800, 2),
      box(BOX.headset, 2),
      box(BOX.lanyard, 2),
      box(BOX.carryCase),
      box(BOX.manual),
    ],
    rows: t82Rows,
    features: t82Features,
    rangeNote: true,
  },

  "m-t82-extreme-quad": {
    colour: { ru: "Чёрно-оранжевый", en: "Black and orange", uz: "Qora-to'q sariq" },
    inBox: [
      box(BOX.radio, 4),
      box(BOX.beltClip, 4),
      box(BOX.microUsb, 2),
      box(BOX.batteryNiMh800, 4),
      box(BOX.headset, 4),
      box(BOX.lanyard, 4),
      box(BOX.carryCase),
      box(BOX.manual),
    ],
    rows: t82Rows,
    features: t82Features,
    rangeNote: true,
  },

  "m-t82-extreme-rsm": {
    colour: { ru: "Чёрно-оранжевый", en: "Black and orange", uz: "Qora-to'q sariq" },
    inBox: [
      box(BOX.radio, 2),
      box(BOX.beltClip, 2),
      box(BOX.microUsb, 1),
      box(BOX.batteryNiMh800, 2),
      box(BOX.rsmMic, 2),
      box(BOX.lanyard, 2),
      box(BOX.carryCase),
      box(BOX.manual),
    ],
    rows: t82Rows,
    features: t82Features,
    rangeNote: true,
  },

  "m-t82": {
    colour: { ru: "Чёрно-красный", en: "Black and red", uz: "Qora-qizil" },
    inBox: [
      box(BOX.radio, 2),
      box(BOX.beltClip, 2),
      box(BOX.microUsb, 1),
      box(BOX.batteryNiMh800, 2),
      box(BOX.manual),
    ],
    rows: t82Rows,
    features: t82Features,
    rangeNote: true,
  },

  /* ── Motorola TLKR T92 H2O ─────────────────────────────── */

  "m-tlkr-t92h2o": {
    colour: { ru: "Жёлтый", en: "Yellow", uz: "Sariq" },
    inBox: [
      box(BOX.radio, 2),
      box(BOX.beltClip, 2),
      box(BOX.batteryNiMh, 2),
      box(BOX.usbCarCharger, 1),
      box(BOX.usbCable, 2),
      box(BOX.carryCase),
      box(BOX.manual),
    ],
    rows: [
      ...pmr446(upToKm("10")),
      row(SPEC.ingress, {
        ru: "IP67 — пыле- и влагозащита",
        en: "IP67 — dust and water protection",
        uz: "IP67 — chang va suvdan himoya",
      }),
      row(SPEC.channels, channelsCodes("8", "121")),
      row(SPEC.callTones, callTones("20")),
      row(SPEC.power, watts("0,5")),
      row(SPEC.dimensions, mm("61×178×38")),
      row(SPEC.weight, grams("233")),
      row(SPEC.warranty, V.warrantyRadioOnly),
    ],
    features: [
      F.waterproofBody,
      F.freeCalls,
      F.niMh,
      F.scanMonitor,
      F.vibrate,
      F.lcdBacklit,
      F.torchAuto,
      F.whistleClips,
      F.keypadLock,
      F.batteryIndicator,
      F.headsetJack,
      F.voxHeadset,
    ],
    rangeNote: true,
  },

  /* ── Motorola XT ───────────────────────────────────────── */

  "m-xt420": {
    inBox: [
      box(BOX.radio, 1),
      box(BOX.holster, 1),
      box(BOX.powerAdapter, 1),
      box(BOX.charger, 1),
      box(BOX.battery, 1),
    ],
    rows: [
      row(SPEC.standard, V.pmr),
      row(SPEC.mode, V.analog),
      row(SPEC.freq, V.freq446),
      row(SPEC.power, watts("0,5")),
      row(SPEC.batteryType, liIon("2150")),
      row(SPEC.batteryCapacity, mah("2150")),
      row(SPEC.batteryLife, hours("12")),
      row(SPEC.channels, channels("16")),
      row(SPEC.ingress, ip("IP55")),
    ],
    features: [F.vox, F.scanMonitor, F.noiseSuppression, F.tot],
  },

  "m-xt185": {
    intro: {
      ru: "Motorola XT185 — компактная и лёгкая 16-канальная радиостанция в безлицензионном диапазоне PMR 446 МГц. В комплекте две рации и аксессуары к ним: аккумуляторы, зарядное устройство, гарнитуры. Дисплей показывает номер канала, заряд АКБ, используемый субтон и активные функции. Полного заряда литий-ионного аккумулятора хватает примерно на 24 часа работы в режиме 5/5/90.",
      en: "The Motorola XT185 is a compact, lightweight 16-channel radio on the licence-free PMR 446 MHz band. The kit ships with two radios plus batteries, charger and headsets. The display shows channel number, battery level, the sub-tone in use and any active functions. A full charge of the lithium-ion battery lasts roughly 24 hours on a 5/5/90 duty cycle.",
      uz: "Motorola XT185 — litsenziyasiz PMR 446 MGts diapazonida ishlaydigan ixcham va yengil 16 kanalli radiostansiya. Komplektda ikkita ratsiya va ularga aksessuarlar: akkumulyatorlar, quvvatlagich, garnituralar. Displey kanal raqami, akkumulyator zaryadi, ishlatilayotgan subton va faol funksiyalarni ko'rsatadi. Litiy-ion akkumulyatorning to'liq zaryadi 5/5/90 rejimida taxminan 24 soatga yetadi.",
    },
    inBox: [
      box(BOX.radio, 2),
      box(BOX.beltClip, 2),
      box(BOX.chargingCupSingle, 2),
      box(BOX.powerAdapterDual, 1),
      box(BOX.batteryLiIon, 2),
      box(BOX.strap, 2),
      box(BOX.headsetPtt, 2),
      box(BOX.manual),
    ],
    rows: [
      row(SPEC.standard, V.pmr),
      row(SPEC.freq, V.freq446),
      row(SPEC.range, upToKm("8")),
      row(SPEC.channels, channels("16")),
      row(SPEC.kit, radios("2")),
      row(SPEC.batteryType, liIon("1130")),
      row(SPEC.batteryCapacity, mah("1130")),
      row(SPEC.batteryLife, upToHours("24")),
      row(SPEC.power, watts("0,5")),
      row(SPEC.ingress, ip("IP54")),
      row(SPEC.origin, V.china),
    ],
    features: [F.lcdBacklit, F.liIon, F.freeCalls],
    rangeNote: true,
  },

  /* ── Motorola Talkabout T72 ────────────────────────────── */

  "m-t72": {
    intro: {
      ru: "Компактная и лёгкая, с дальностью действия до 8 км, T72 даёт свободу оставаться на связи независимо от того, куда приведёт приключение. Портативная рация с рейтингом IP54 создана, чтобы выдерживать экстремальные погодные условия. До 24 часов автономной работы благодаря Li-Ion аккумулятору ёмкостью 1130 мА·ч.",
      en: "Compact and light, with a range of up to 8 km, the T72 keeps you connected wherever the trip leads. Rated IP54, it is built to take rough weather. Up to 24 hours of runtime from a 1130 mAh Li-Ion battery.",
      uz: "Ixcham va yengil, 8 km gacha masofada ishlaydigan T72 sayohat qayerga olib borishidan qat'i nazar aloqada qolish imkonini beradi. IP54 darajasiga ega ratsiya og'ir ob-havo sharoitlariga bardosh berish uchun yaratilgan. 1130 mA·soat Li-Ion akkumulyator bilan 24 soatgacha ishlaydi.",
    },
    inBox: [box(BOX.radio, 2), box(BOX.chargingDock, 1), box(BOX.batteryLiIon, 2), box(BOX.manual)],
    rows: [
      row(SPEC.standard, {
        ru: "PMR446 — безлицензионный диапазон",
        en: "PMR446 — licence-free band",
        uz: "PMR446 — litsenziyasiz diapazon",
      }),
      row(SPEC.range, upToKm("8")),
      row(SPEC.channels, channelsCodes("16", "121")),
      row(SPEC.batteryType, liIon("1130")),
      row(SPEC.batteryCapacity, mah("1130")),
      row(SPEC.batteryLife, upToHours("24")),
      row(SPEC.ingress, ip("IP54")),
      row(SPEC.kit, radios("2")),
      row(SPEC.packaging, cm("16.5×17.5×7")),
      row(SPEC.origin, V.china),
      row(SPEC.warranty, V.months12),
    ],
    features: [F.easyPairing, F.ivox, F.lcdBacklit, F.scanMonitor, F.chargingDock, F.liIon],
    rangeNote: true,
  },

  /* ── Motorola Talkabout T62 ────────────────────────────── */

  "m-t62-red": {
    colour: { ru: "Чёрно-красный", en: "Black and red", uz: "Qora-qizil" },
    inBox: [
      box(BOX.radio, 2),
      box(BOX.beltClip, 2),
      box(BOX.microUsb, 1),
      box(BOX.batteryNiMh800, 2),
      box(BOX.manual),
    ],
    rows: t62Rows,
    features: t62Features,
    rangeNote: true,
  },

  "m-t62-blue": {
    colour: { ru: "Чёрно-синий", en: "Black and blue", uz: "Qora-ko'k" },
    inBox: [
      box(BOX.radio, 2),
      box(BOX.beltClip, 2),
      box(BOX.microUsb, 1),
      box(BOX.batteryNiMh800, 2),
      box(BOX.manual),
    ],
    rows: t62Rows,
    features: t62Features,
    rangeNote: true,
  },

  /* ── Motorola Talkabout T42 ────────────────────────────── */

  "m-t42-red": {
    colour: { ru: "Красный", en: "Red", uz: "Qizil" },
    inBox: [box(BOX.radio, 2), box(BOX.beltClip, 2), box(BOX.manual)],
    rows: t42Rows({
      ru: "до 4 км на открытой местности, 200–300 м в городских условиях",
      en: "up to 4 km in the open, 200–300 m in built-up areas",
      uz: "ochiq joyda 4 km gacha, shahar sharoitida 200–300 m",
    }),
    features: t42Features,
    rangeNote: true,
  },

  "m-t42-blue": {
    colour: { ru: "Синий", en: "Blue", uz: "Ko'k" },
    inBox: [box(BOX.radio, 2), box(BOX.beltClip, 2), box(BOX.manual)],
    rows: t42Rows({
      ru: "до 4 км на открытой местности, 200–300 м в городских условиях",
      en: "up to 4 km in the open, 200–300 m in built-up areas",
      uz: "ochiq joyda 4 km gacha, shahar sharoitida 200–300 m",
    }),
    features: t42Features,
    rangeNote: true,
  },

  "m-t42-triple": {
    inBox: [box(BOX.radio, 3), box(BOX.beltClip, 3), box(BOX.manual)],
    rows: t42Rows(upToKm("4")),
    features: t42Features,
    rangeNote: true,
  },

  "m-t42-quad": {
    inBox: [box(BOX.radio, 4), box(BOX.beltClip, 4), box(BOX.manual)],
    rows: t42Rows(upToKm("4")),
    features: t42Features,
    rangeNote: true,
  },

  /* ── Motorola CLP / CLK ────────────────────────────────── */

  "m-clp446": {
    colour: { ru: "Чёрный", en: "Black", uz: "Qora" },
    inBox: [
      box(BOX.radio, 1),
      box(BOX.holster, 1),
      box(BOX.headset, 1),
      box(BOX.powerAdapter, 1),
      box(BOX.charger, 1),
      box(BOX.batteryLiIon1130, 1),
      box(BOX.manual),
    ],
    rows: [...clRows(mm("50×88×19")), row(SPEC.warranty, V.warrantyRadioOnly)],
    features: clFeatures(F.antibacterial),
    rangeNote: true,
  },

  "m-clk446": {
    colour: { ru: "Чёрный", en: "Black", uz: "Qora" },
    inBox: [
      box(BOX.radio, 1),
      box(BOX.holster, 1),
      box(BOX.headset, 1),
      box(BOX.powerAdapter, 1),
      box(BOX.charger, 1),
      box(BOX.batteryLiIon1130, 1),
      box(BOX.manual),
    ],
    rows: clRows(mm("48×90×14")),
    features: clFeatures(F.antimicrobial),
    rangeNote: true,
  },

  /* ── Radiocom RCD — digital ────────────────────────────── */

  "rcd-70": {
    inBox: [
      box(BOX.radio, 1),
      box(BOX.clip, 1),
      box(BOX.chargingCup, 1),
      box(BOX.battery, 1),
      box(BOX.headset, 1),
      box(BOX.lanyard, 1),
    ],
    rows: [
      row(SPEC.standard, V.dmr),
      row(SPEC.mode, V.analogDigital),
      row(SPEC.ingress, ip("IP67")),
      row(SPEC.power, watts("0,5")),
      row(SPEC.batteryType, liPo("3600")),
      row(SPEC.batteryCapacity, mah("3600")),
      row(SPEC.zones, {
        ru: "До 1024 каналов — 32 зоны по 32 канала",
        en: "Up to 1,024 channels — 32 zones × 32 channels",
        uz: "1024 kanalgacha — 32 zona × 32 kanal",
      }),
      row(SPEC.contacts, {
        ru: "До 256 контактов, 64 группы приёма (RX), до 32 контактов в одной RX-группе",
        en: "Up to 256 contacts, 64 RX groups, up to 32 contacts per RX group",
        uz: "256 kontaktgacha, 64 qabul (RX) guruhi, bitta RX guruhida 32 kontaktgacha",
      }),
    ],
    features: rcdDigitalFeatures(pfbFeature("5"), [
      audioConnector("Motorola M5"),
      F.usbCProgramming,
    ]),
  },

  "rcd-60": {
    inBox: [
      box(BOX.radio, 1),
      box(BOX.clip, 1),
      box(BOX.chargingCup, 1),
      box(BOX.battery, 1),
      box(BOX.headset, 1),
      box(BOX.lanyard, 1),
    ],
    rows: [
      row(SPEC.standard, V.pmr),
      row(SPEC.mode, V.analogDigital),
      row(SPEC.ingress, ip("IP55")),
      row(SPEC.power, watts("0,5")),
      row(SPEC.batteryType, liIon("2200")),
      row(SPEC.batteryCapacity, mah("2200")),
      row(SPEC.zones, {
        ru: "До 1024 каналов — 32 зоны по 32 канала",
        en: "Up to 1,024 channels — 32 zones × 32 channels",
        uz: "1024 kanalgacha — 32 zona × 32 kanal",
      }),
      row(SPEC.contacts, {
        ru: "256 контактов, 64 группы RX, 32 контакта на группу RX",
        en: "256 contacts, 64 RX groups, 32 contacts per RX group",
        uz: "256 kontakt, 64 RX guruhi, RX guruhiga 32 kontakt",
      }),
    ],
    features: rcdDigitalFeatures(pfbFeature("2"), [audioConnector("Motorola 2-pin")]),
  },

  "rcd-50": {
    inBox: [
      box(BOX.radio, 1),
      box(BOX.clip, 1),
      box(BOX.chargingCup, 1),
      box(BOX.battery, 1),
      box(BOX.headset, 1),
      box(BOX.lanyard, 1),
    ],
    rows: [
      row(SPEC.standard, V.dmr),
      row(SPEC.mode, V.analogDigital),
      row(SPEC.ingress, {
        ru: "IP67 — защита от воды и пыли",
        en: "IP67 — dust and water protection",
        uz: "IP67 — suv va changdan himoya",
      }),
      row(SPEC.range, upToKm("8")),
      row(SPEC.batteryType, liPo("3600")),
      row(SPEC.batteryCapacity, mah("3600")),
      row(SPEC.zones, {
        ru: "До 800 каналов — 8 зон по 100 каналов",
        en: "Up to 800 channels — 8 zones × 100 channels",
        uz: "800 kanalgacha — 8 zona × 100 kanal",
      }),
      row(SPEC.contacts, {
        ru: "512 контактов, 64 группы RX, 32 контакта на группу RX",
        en: "512 contacts, 64 RX groups, 32 contacts per RX group",
        uz: "512 kontakt, 64 RX guruhi, RX guruhiga 32 kontakt",
      }),
    ],
    features: rcdDigitalFeatures(pfbFeature("2"), [F.ledDisplay, F.usbCharging, F.bgNoise]),
    rangeNote: true,
  },

  "rcd-40": {
    inBox: [
      box(BOX.radio, 1),
      box(BOX.clip, 1),
      box(BOX.chargingCup, 1),
      box(BOX.battery, 1),
      box(BOX.headset, 1),
      box(BOX.lanyard, 1),
    ],
    rows: [
      row(SPEC.standard, V.pmr),
      row(SPEC.mode, V.analogDigital),
      row(SPEC.freq, V.freq4460),
      row(SPEC.power, watts("0,5")),
      row(SPEC.batteryType, liIon("2200")),
      row(SPEC.batteryCapacity, mah("2200")),
      row(SPEC.batteryLife, hours("14")),
      row(SPEC.channels, channels("32")),
      row(SPEC.tones, toneCodes("8", "210")),
      row(SPEC.ingress, ip("IP55")),
    ],
    features: [F.vox, F.scanMonitor],
  },

  "rcd-30": {
    inBox: [
      box(BOX.radio, 2),
      box(BOX.clip, 2),
      box(BOX.chargingCup, 2),
      box(BOX.battery, 2),
      box(BOX.headset, 2),
      box(BOX.lanyard, 2),
    ],
    rows: [
      row(SPEC.standard, V.pmr),
      row(SPEC.mode, V.analogDigital),
      row(SPEC.freq, V.freq4460),
      row(SPEC.power, watts("0,5")),
      row(SPEC.batteryType, liIon("2200")),
      row(SPEC.batteryCapacity, mah("2200")),
      row(SPEC.ingress, ip("IP54")),
      row(SPEC.zones, {
        ru: "До 32 каналов — 2 зоны по 16 каналов",
        en: "Up to 32 channels — 2 zones × 16 channels",
        uz: "32 kanalgacha — 2 zona × 16 kanal",
      }),
      row(SPEC.contacts, {
        ru: "256 контактов, 64 группы RX, 32 контакта на группу RX",
        en: "256 contacts, 64 RX groups, 32 contacts per RX group",
        uz: "256 kontakt, 64 RX guruhi, RX guruhiga 32 kontakt",
      }),
    ],
    features: [F.tdma, F.voiceAnnounce, F.callsAll, F.radioManagement, F.loneWorker],
  },

  /* ── Radiocom RC — analogue ────────────────────────────── */

  "rc-50": {
    inBox: [
      box(BOX.radio, 1),
      box(BOX.clip, 1),
      box(BOX.chargingCup, 1),
      box(BOX.battery, 1),
      box(BOX.headset, 1),
      box(BOX.lanyard, 1),
    ],
    rows: [
      row(SPEC.standard, V.pmr),
      row(SPEC.mode, V.analog),
      row(SPEC.freq, V.freq4460),
      row(SPEC.power, watts("0,5")),
      row(SPEC.batteryType, liIon("2200")),
      row(SPEC.batteryCapacity, mah("2200")),
      row(SPEC.batteryLife, hours("12")),
      row(SPEC.channels, channels("16")),
      row(SPEC.tones, {
        ru: "Тональный сигнал CTCSS и код DCS на каждом канале",
        en: "CTCSS tone and DCS code on every channel",
        uz: "Har bir kanalda CTCSS toni va DCS kodi",
      }),
      row(SPEC.ingress, ip("IP55")),
    ],
    features: [F.vfoMr, F.lcdBacklit, F.batteryIndicator],
  },

  "rc-20": {
    inBox: [
      box(BOX.radio, 2),
      box(BOX.clip, 2),
      box(BOX.chargingCup, 2),
      box(BOX.battery, 2),
      box(BOX.headset, 2),
      box(BOX.lanyard, 2),
    ],
    rows: [
      row(SPEC.standard, V.pmr),
      row(SPEC.mode, V.analog),
      row(SPEC.freq, V.freq4460),
      row(SPEC.power, watts("0,5")),
      row(SPEC.batteryType, liIon("1700")),
      row(SPEC.batteryCapacity, mah("1800")),
      row(SPEC.batteryLife, hours("12")),
      row(SPEC.channels, channels("99")),
      row(SPEC.tones, toneCodes("50", "210")),
      row(SPEC.ingress, ip("IP54")),
    ],
    features: [F.lcd3Backlight, F.batteryIndicator, F.vox, F.scanMonitor],
  },

  "rc-10": {
    inBox: [
      box(BOX.radio, 2),
      box(BOX.clip, 2),
      box(BOX.chargingCup, 2),
      box(BOX.battery, 2),
      box(BOX.headset, 2),
      box(BOX.lanyard, 2),
    ],
    rows: [
      row(SPEC.standard, V.pmr),
      row(SPEC.mode, V.analog),
      row(SPEC.freq, V.freq4460),
      row(SPEC.power, watts("0,5")),
      row(SPEC.batteryType, liIon("1700")),
      row(SPEC.batteryCapacity, mah("1700")),
      row(SPEC.batteryLife, hours("12")),
      row(SPEC.channels, channels("99")),
      row(SPEC.tones, toneCodes("38", "83")),
      row(SPEC.ingress, ip("IP54")),
    ],
    features: [F.lcdBacklit, F.batteryIndicator, F.vox, F.torchLed],
  },
};

export const getSpec = (id: string): ProductSpec | undefined => specs[id];
