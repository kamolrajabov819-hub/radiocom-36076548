import motorolaImg from "@/assets/product-motorola.jpg";
import hyteraImg from "@/assets/product-hytera.jpg";
import pocImg from "@/assets/product-poc.jpg";
import compactImg from "@/assets/product-compact.jpg";
import rcd60Asset from "@/assets/radiocom-rcd60.jpg.asset.json";

const rcd60Img = rcd60Asset.url;

export type Category =
  | "amateur"
  | "professional"
  | "mobile"
  | "repeater"
  | "poc"
  | "accessories"
  | "monitors"
  | "pda";

export type Brand =
  | "Motorola"
  | "Hytera"
  | "Decross"
  | "Alinco"
  | "Samcom"
  | "Caltta"
  | "Radiocom RC";

export type Product = {
  id: string;
  name: string;
  brand: Brand;
  category: Category;
  image: string;
  tags: string[];
  price: number | null; // in сум; null = договорная
  rangeCity: string;
  rangeOpen?: string;
  industries: string[]; // slugs
  blurb: string;
};

const RC = "Radiocom RC" as const;

// Helper — most Motorola PMR-446 talkabouts share the same tag set
const TALK = ["PMR446", "License-free"];

export const products: Product[] = [
  // ─── Radiocom RC ───
  { id: "rc-5d",  name: "Radiocom RC-5D",  brand: RC, category: "professional", image: rcd60Img, tags: ["Long range", "License-free"], price: 2_000_000, rangeCity: "до 3 км",  rangeOpen: "до 10 км", industries: ["construction","security","mining","transport"], blurb: "Флагман линейки Radiocom. Дальность до 10 км на открытой местности." },
  { id: "rc-50",  name: "Radiocom RC-50",  brand: RC, category: "professional", image: rcd60Img, tags: ["Long range"],                  price: 1_500_000, rangeCity: "до 2,5 км", rangeOpen: "до 5 км",  industries: ["construction","security","transport"], blurb: "Универсальная модель для среднего радиуса действия." },
  { id: "rc-21",  name: "Radiocom RC-21",  brand: RC, category: "professional", image: rcd60Img, tags: ["Long range"],                  price: 2_100_000, rangeCity: "до 1,5 км", rangeOpen: "до 4 км",  industries: ["horeca","security","construction"], blurb: "Компактная профессиональная рация с усиленным приёмом." },
  { id: "rc-10",  name: "Radiocom RC-10",  brand: RC, category: "amateur",      image: rcd60Img, tags: ["Compact"],                     price: 1_300_000, rangeCity: "до 1 км",   rangeOpen: "до 3 км",  industries: ["horeca","security"], blurb: "Начальный уровень линейки — надёжно и просто." },

  // ─── Motorola Talkabout ───
  { id: "m-t82-extreme",       name: "Motorola Talkabout T82 Extreme",       brand: "Motorola", category: "amateur", image: motorolaImg, tags: [...TALK, "IPx4"], price: 1_700_000, rangeCity: "до 1,5 км", industries: ["horeca","security","construction"], blurb: "Защищённая безлицензионная рация для outdoor задач." },
  { id: "m-t82",               name: "Motorola Talkabout T82",               brand: "Motorola", category: "amateur", image: motorolaImg, tags: TALK,               price: 1_500_000, rangeCity: "до 1,5 км", industries: ["horeca","security"], blurb: "Компактная PMR-рация для команд и мероприятий." },
  { id: "m-t82-extreme-quad",  name: "Motorola Talkabout T82 Extreme Quad",  brand: "Motorola", category: "amateur", image: motorolaImg, tags: [...TALK, "Quad", "IPx4"], price: 3_100_000, rangeCity: "до 1,5 км", industries: ["horeca","security","construction"], blurb: "Комплект из 4 раций для организованных бригад." },
  { id: "m-t72",               name: "Motorola Talkabout T72",               brand: "Motorola", category: "amateur", image: motorolaImg, tags: TALK,               price: 1_300_000, rangeCity: "до 1 км",   industries: ["horeca","security"], blurb: "Актуальная PMR для повседневных задач." },
  { id: "m-xt185",             name: "Motorola Talkabout XT185",             brand: "Motorola", category: "amateur", image: motorolaImg, tags: TALK,               price: 1_500_000, rangeCity: "до 1 км",   industries: ["horeca"], blurb: "PMR для розницы, HoReCa и общественных заведений." },
  { id: "m-t62",               name: "Motorola Talkabout T62",               brand: "Motorola", category: "amateur", image: motorolaImg, tags: TALK,               price: 1_100_000, rangeCity: "до 900 м",  industries: ["horeca"], blurb: "Стильная PMR с надёжным приёмом." },
  { id: "m-t42-triple",        name: "Motorola Talkabout T42 Triple",        brand: "Motorola", category: "amateur", image: motorolaImg, tags: [...TALK, "Triple"], price: 700_000,   rangeCity: "до 300 м",  industries: ["horeca"], blurb: "Комплект из 3 раций для малых команд." },
  { id: "m-t42",               name: "Motorola Talkabout T42",               brand: "Motorola", category: "amateur", image: motorolaImg, tags: TALK,               price: 600_000,   rangeCity: "до 300 м",  industries: ["horeca"], blurb: "Начальная PMR для семей и малого бизнеса." },
  { id: "m-t42-quad",          name: "Motorola Talkabout T42 Quad",          brand: "Motorola", category: "amateur", image: motorolaImg, tags: [...TALK, "Quad"],  price: 900_000,   rangeCity: "до 300 м",  industries: ["horeca"], blurb: "Комплект из 4 раций T42." },
  { id: "m-t82-extreme-rsm",   name: "Motorola Talkabout T82 Extreme RSM",   brand: "Motorola", category: "amateur", image: motorolaImg, tags: [...TALK, "RSM"],  price: 1_700_000, rangeCity: "до 1,5 км", industries: ["security","construction"], blurb: "С выносным микрофоном (RSM) для скрытого ношения." },

  // ─── Motorola Pro (Portable) ───
  { id: "m-tlkr-t92h2o",       name: "Motorola TLKR-T92H2O",                 brand: "Motorola", category: "amateur", image: motorolaImg, tags: [...TALK, "IP67", "Float"], price: 1_800_000, rangeCity: "до 1,5 км", industries: ["horeca","construction","security"], blurb: "Плавает, водозащищена IP67 — для воды и стройки." },
  { id: "m-xt420",             name: "Motorola XT420",                       brand: "Motorola", category: "professional", image: motorolaImg, tags: [...TALK, "IP55"], price: 2_200_000, rangeCity: "до 2 км", industries: ["horeca","security","construction"], blurb: "Безлицензионная PMR для HoReCa и объектной охраны." },
  { id: "m-clp446",            name: "Motorola CLP 446",                     brand: "Motorola", category: "professional", image: motorolaImg, tags: [...TALK, "Compact"], price: 2_300_000, rangeCity: "до 1,5 км", industries: ["horeca","security"], blurb: "Ультра-компактный формат — незаметна в кармане." },
  { id: "m-clk446",            name: "Motorola CLK 446",                     brand: "Motorola", category: "professional", image: motorolaImg, tags: [...TALK, "Compact", "Display"], price: 2_500_000, rangeCity: "до 1,5 км", industries: ["horeca","security"], blurb: "Компактная PMR с дисплеем и подсветкой." },
  { id: "m-dp1400",            name: "Motorola DP1400",                      brand: "Motorola", category: "professional", image: motorolaImg, tags: ["DMR", "IP54"], price: 4_800_000, rangeCity: "до 5 км", industries: ["construction","security","transport"], blurb: "Начальная DMR для профессионального использования." },
  { id: "m-dp2400",            name: "Motorola DP2400",                      brand: "Motorola", category: "professional", image: motorolaImg, tags: ["DMR", "IP54"], price: 7_200_000, rangeCity: "до 6 км", industries: ["construction","security","manufacturing","transport"], blurb: "DMR-платформа для среднего бизнеса." },
  { id: "m-dp2600",            name: "Motorola DP2600",                      brand: "Motorola", category: "professional", image: motorolaImg, tags: ["DMR", "Display", "IP54"], price: 7_600_000, rangeCity: "до 6 км", industries: ["construction","security","manufacturing"], blurb: "DMR с полным дисплеем и клавиатурой." },
  { id: "m-dp3441",            name: "Motorola DP3441",                      brand: "Motorola", category: "professional", image: motorolaImg, tags: ["DMR", "Compact", "IP67"], price: 8_900_000, rangeCity: "до 5 км", industries: ["security","horeca"], blurb: "Компактная профессиональная DMR — незаметная." },
  { id: "m-dp4400",            name: "Motorola DP4400",                      brand: "Motorola", category: "professional", image: motorolaImg, tags: ["DMR", "GPS", "IP68"], price: 8_000_000, rangeCity: "до 8 км", industries: ["mining","construction","security"], blurb: "Флагман DMR: GPS, IP68, шумоподав." },
  { id: "m-dp4600",            name: "Motorola DP4600",                      brand: "Motorola", category: "professional", image: motorolaImg, tags: ["DMR", "GPS", "Display", "IP68"], price: 8_300_000, rangeCity: "до 8 км", industries: ["mining","construction","security","transport"], blurb: "DMR с дисплеем — топовая рабочая станция." },
  { id: "m-dp4800",            name: "Motorola DP4800",                      brand: "Motorola", category: "professional", image: motorolaImg, tags: ["DMR", "GPS", "Keypad", "IP68"], price: 9_170_000, rangeCity: "до 8 км", industries: ["mining","construction","security","transport","manufacturing"], blurb: "Максимальная комплектация: клавиатура, GPS, IP68." },

  // ─── Motorola Mobile / Base ───
  { id: "m-dm2600",            name: "Motorola DM2600",                      brand: "Motorola", category: "mobile", image: motorolaImg, tags: ["DMR", "Mobile"], price: 8_200_000, rangeCity: "до 15 км", industries: ["transport","mining","construction"], blurb: "Автомобильная DMR-станция." },
  { id: "m-dm4600",            name: "Motorola DM4600",                      brand: "Motorola", category: "mobile", image: motorolaImg, tags: ["DMR", "Mobile", "Display"], price: 10_200_000, rangeCity: "до 20 км", industries: ["transport","mining","construction"], blurb: "Топовая мобильная DMR с дисплеем." },

  // ─── Motorola Repeaters ───
  { id: "m-slr5500",           name: "Motorola SLR5500",                     brand: "Motorola", category: "repeater", image: motorolaImg, tags: ["Repeater", "DMR"], price: 55_600_000, rangeCity: "покрытие объекта", industries: ["mining","construction","security","manufacturing"], blurb: "DMR-ретранслятор для средних сетей." },
  { id: "m-slr8000",           name: "Motorola SLR8000",                     brand: "Motorola", category: "repeater", image: motorolaImg, tags: ["Repeater", "DMR", "Heavy duty"], price: 88_400_000, rangeCity: "покрытие города", industries: ["mining","transport","security"], blurb: "Мощный DMR-ретранслятор для крупных сетей." },

  // ─── Decross ───
  { id: "d-dc93",              name: "Decross DC93",                          brand: "Decross", category: "amateur", image: compactImg, tags: ["LPD/PMR"], price: 1_500_000, rangeCity: "до 1,5 км", industries: ["horeca","security"], blurb: "Профессиональная безлицензионная рация." },
  { id: "d-dc63-red",          name: "Decross DC63 Red",                      brand: "Decross", category: "amateur", image: compactImg, tags: ["LPD/PMR"], price: 800_000,   rangeCity: "до 900 м",  industries: ["horeca"], blurb: "Компактная рация в красном корпусе." },
  { id: "d-dc63-blue",         name: "Decross DC63 Blue",                     brand: "Decross", category: "amateur", image: compactImg, tags: ["LPD/PMR"], price: 800_000,   rangeCity: "до 900 м",  industries: ["horeca"], blurb: "Компактная рация в синем корпусе." },
  { id: "d-dc44",              name: "Decross DC44",                          brand: "Decross", category: "amateur", image: compactImg, tags: ["LPD/PMR"], price: 600_000,   rangeCity: "до 300 м",  industries: ["horeca"], blurb: "Начальный уровень для семей и малого бизнеса." },
  { id: "d-dc43",              name: "Decross DC43",                          brand: "Decross", category: "amateur", image: compactImg, tags: ["LPD/PMR"], price: 500_000,   rangeCity: "до 300 м",  industries: ["horeca"], blurb: "Самая доступная модель Decross." },

  // ─── Hytera ───
  { id: "h-s35-pro-lf",        name: "Hytera S35 Pro LF",                     brand: "Hytera", category: "amateur", image: hyteraImg, tags: ["Long range"], price: 1_800_000, rangeCity: "до 2,5 км", industries: ["construction","security","horeca"], blurb: "Профессиональная безлицензионная модель Hytera." },
  { id: "h-s31-lf",            name: "Hytera S31 LF",                         brand: "Hytera", category: "amateur", image: hyteraImg, tags: ["Compact"], price: 1_300_000, rangeCity: "до 1,5 км", industries: ["horeca","security"], blurb: "Средний уровень Hytera для повседневных задач." },
  { id: "h-s10-mini-lf",       name: "Hytera S10 mini LF",                    brand: "Hytera", category: "amateur", image: hyteraImg, tags: ["Ultra-compact"], price: 900_000, rangeCity: "до 1 км", industries: ["horeca"], blurb: "Ультра-компактная Hytera размером с брелок." },

  // ─── Caltta PoC ───
  { id: "c-e690",              name: "Caltta E690",                           brand: "Caltta",  category: "poc", image: pocImg, tags: ["PoC", "LTE", "GPS", "WiFi"], price: null, rangeCity: "Глобальная", industries: ["transport","mining","security","manufacturing"], blurb: "Флагман PoC от Caltta — глобальная связь через LTE." },
  { id: "c-e600",              name: "Caltta E600",                           brand: "Caltta",  category: "poc", image: pocImg, tags: ["PoC", "LTE", "GPS"], price: null, rangeCity: "Глобальная", industries: ["transport","security","manufacturing"], blurb: "PoC-платформа для профессиональных сетей." },

  // ─── Baby Monitors (Motorola) ───
  { id: "bm-peekabo",          name: "Motorola PEEKABO",                      brand: "Motorola", category: "monitors", image: compactImg, tags: ["Video"],                 price: 600_000, rangeCity: "до 300 м", industries: [], blurb: "Компактная видеоняня с ночным режимом." },
  { id: "bm-vm65-connect",     name: "Motorola VM65 CONNECT",                 brand: "Motorola", category: "monitors", image: compactImg, tags: ["Video", "WiFi"],         price: 1_200_000, rangeCity: "WiFi", industries: [], blurb: "Wi-Fi видеоняня с приложением на смартфоне." },
  { id: "bm-mbp36xl",          name: "Motorola MBP36XL",                      brand: "Motorola", category: "monitors", image: compactImg, tags: ["Video", "5\" screen"],   price: 960_000, rangeCity: "до 300 м", industries: [], blurb: "5-дюймовый экран, наклон и зум камеры." },
  { id: "bm-vm34",             name: "Motorola VM34",                         brand: "Motorola", category: "monitors", image: compactImg, tags: ["Video"],                 price: 900_000, rangeCity: "до 300 м", industries: [], blurb: "Средняя линейка с двусторонней связью." },
  { id: "bm-mbp481",           name: "Motorola MBP481",                       brand: "Motorola", category: "monitors", image: compactImg, tags: ["Video"],                 price: 600_000, rangeCity: "до 300 м", industries: [], blurb: "Начальная видеоняня Motorola." },
  { id: "bm-am24-white",       name: "Motorola AM24 White",                   brand: "Motorola", category: "monitors", image: compactImg, tags: ["Audio"],                 price: 480_000, rangeCity: "до 300 м", industries: [], blurb: "Аудио-радионяня с чётким звуком." },
  { id: "bm-am21-white",       name: "Motorola AM21 White",                   brand: "Motorola", category: "monitors", image: compactImg, tags: ["Audio", "Compact"],      price: 420_000, rangeCity: "до 300 м", industries: [], blurb: "Простая аудио-радионяня." },

  // ─── PDA ───
  { id: "pda-pad-6000m2",      name: "Industrial PDA PAD 6000M2",             brand: RC, category: "pda", image: pocImg, tags: ["Rugged", "Barcode", "PoC"], price: null, rangeCity: "LTE / WiFi", industries: ["transport","manufacturing"], blurb: "Промышленный КПК для склада и логистики." },
];

export const categoryLabels: Record<Category, { ru: string; en: string; uz: string }> = {
  amateur:      { ru: "Любительские",       en: "Amateur",       uz: "Havaskor" },
  professional: { ru: "Профессиональные",   en: "Professional",  uz: "Professional" },
  mobile:       { ru: "Автомобильные",      en: "Mobile / Base", uz: "Avto-statsiya" },
  repeater:     { ru: "Ретрансляторы",      en: "Repeaters",     uz: "Retranslyatorlar" },
  poc:          { ru: "PoC радиостанции",   en: "PoC",           uz: "PoC" },
  accessories:  { ru: "Аксессуары",         en: "Accessories",   uz: "Aksessuarlar" },
  monitors:     { ru: "Видео- и радионяни", en: "Baby monitors", uz: "Bolalar monitorlari" },
  pda:          { ru: "Промышленные КПК",   en: "Rugged PDAs",   uz: "KPK" },
};

export const allBrands: Brand[] = [
  "Motorola", "Hytera", "Radiocom RC", "Decross", "Caltta", "Alinco", "Samcom",
];

export function formatPrice(price: number | null, lang: "ru" | "en" | "uz"): string {
  if (price == null) {
    return lang === "en" ? "On request" : lang === "uz" ? "Kelishiladi" : "Договорная";
  }
  const suffix = lang === "en" ? "UZS" : lang === "uz" ? "so'm" : "сум";
  return `${price.toLocaleString("ru-RU").replace(/,/g, " ")} ${suffix}`;
}
