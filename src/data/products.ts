import rc10 from "@/assets/catalog/rc-10.jpg.asset.json";
import rc20 from "@/assets/catalog/rc-20.jpg.asset.json";
import rc50 from "@/assets/catalog/rc-50.jpg.asset.json";
import rcd30 from "@/assets/catalog/rcd-30.jpg.asset.json";
import rcd40 from "@/assets/catalog/rcd-40.jpg.asset.json";
import rcd50 from "@/assets/catalog/rcd-50.jpg.asset.json";
import rcd60 from "@/assets/catalog/rcd-60.jpg.asset.json";
import rcd70 from "@/assets/catalog/rcd-70.jpg.asset.json";
import t42red from "@/assets/catalog/t42-red.png.asset.json";
import t42blue from "@/assets/catalog/t42-blue.png.asset.json";
import t42triple from "@/assets/catalog/t42-triple.png.asset.json";
import t42quad from "@/assets/catalog/t42-quad.png.asset.json";
import t62red from "@/assets/catalog/t62-red.png.asset.json";
import t62blue from "@/assets/catalog/t62-blue.png.asset.json";
import t72 from "@/assets/catalog/t72.png.asset.json";
import t82 from "@/assets/catalog/t82.png.asset.json";
import t82extreme from "@/assets/catalog/t82-extreme.png.asset.json";
import t82extremeQuad from "@/assets/catalog/t82-extreme-quad.png.asset.json";
import xt185 from "@/assets/catalog/xt185.png.asset.json";
import xt420 from "@/assets/catalog/xt420.png.asset.json";
import tlkrT92 from "@/assets/catalog/tlkr-t92h2o.png.asset.json";

import rcd60b from "@/assets/catalog/rcd-60-2.jpg.asset.json";
import rcd70b from "@/assets/catalog/rcd-70-2.jpg.asset.json";
import t82e2 from "@/assets/catalog/t82-extreme-2.jpg.asset.json";
import t82e3 from "@/assets/catalog/t82-extreme-3.jpg.asset.json";
import t72b from "@/assets/catalog/t72-2.jpg.asset.json";
import t72c from "@/assets/catalog/t72-3.jpg.asset.json";
import t62r2 from "@/assets/catalog/t62-red-2.jpg.asset.json";
import t62r3 from "@/assets/catalog/t62-red-3.jpg.asset.json";
import t62b2 from "@/assets/catalog/t62-blue-2.jpg.asset.json";
import t42tri2 from "@/assets/catalog/t42-triple-2.jpg.asset.json";
import t42tri3 from "@/assets/catalog/t42-triple-3.jpg.asset.json";
import t42q2 from "@/assets/catalog/t42-quad-2.jpg.asset.json";
import t42q3 from "@/assets/catalog/t42-quad-3.jpg.asset.json";
import t42r2 from "@/assets/catalog/t42-red-2.jpg.asset.json";
import t42r3 from "@/assets/catalog/t42-red-3.jpg.asset.json";
import t42r4 from "@/assets/catalog/t42-red-4.jpg.asset.json";
import t42b2 from "@/assets/catalog/t42-blue-2.jpg.asset.json";
import t42b3 from "@/assets/catalog/t42-blue-3.jpg.asset.json";
import t42b4 from "@/assets/catalog/t42-blue-4.jpg.asset.json";
import tlkr2 from "@/assets/catalog/tlkr-t92h2o-2.jpg.asset.json";
import tlkr3 from "@/assets/catalog/tlkr-t92h2o-3.jpg.asset.json";
import xt185b from "@/assets/catalog/xt185-2.jpg.asset.json";
import xt185c from "@/assets/catalog/xt185-3.jpg.asset.json";
// Stand-in shot for the two on-site models that have no catalogue photo yet.
// Replace with real CLP 446 / CLK 446 renders when they arrive.
import genericMotorola from "@/assets/product-motorola.jpg";
import { assetUrl } from "@/lib/asset";

export type Category = "amateur" | "professional";

export type Brand = "Motorola" | "Radiocom RC";

export type Product = {
  id: string;
  name: string;
  brand: Brand;
  category: Category;
  image: string;
  gallery?: string[];
  tags: string[];
  price: number | null; // in сум; null = договорная
  rangeCity: string;
  rangeOpen?: string;
  industries: string[]; // slugs
  blurb: string;
};

const RC = "Radiocom RC" as const;
const MOT = "Motorola" as const;

// Helper — most Motorola PMR-446 talkabouts share the same tag set
const TALK = ["PMR446", "License-free"];

export const products: Product[] = [
  // ─── Radiocom RCD (digital / professional) ───
  { id: "rcd-70", name: "Radiocom RCD-70", brand: RC, category: "professional", image: assetUrl(rcd70), gallery: [assetUrl(rcd70b)], tags: ["DMR", "GPS", "IP67"], price: 4_200_000, rangeCity: "до 4 км", rangeOpen: "до 12 км", industries: ["mining","construction","security","transport"], blurb: "Флагман линейки RCD: цифровой DMR, GPS и защита IP67." },
  { id: "rcd-60", name: "Radiocom RCD-60", brand: RC, category: "professional", image: assetUrl(rcd60), gallery: [assetUrl(rcd60b)], tags: ["DMR", "Display", "Keypad"], price: 3_600_000, rangeCity: "до 3,5 км", rangeOpen: "до 10 км", industries: ["construction","security","mining","transport"], blurb: "Цифровая рация с дисплеем и клавиатурой в полном комплекте." },
  { id: "rcd-50", name: "Radiocom RCD-50", brand: RC, category: "professional", image: assetUrl(rcd50), tags: ["DMR", "Display"], price: 3_100_000, rangeCity: "до 3 км", rangeOpen: "до 8 км", industries: ["construction","security","manufacturing"], blurb: "Рабочая лошадка бригад: чистый цифровой звук и дисплей." },
  { id: "rcd-40", name: "Radiocom RCD-40", brand: RC, category: "professional", image: assetUrl(rcd40), tags: ["DMR", "Long range"], price: 2_600_000, rangeCity: "до 2,5 км", rangeOpen: "до 7 км", industries: ["construction","security","transport"], blurb: "Средний класс RCD с усиленным приёмом и долгим циклом работы." },
  { id: "rcd-30", name: "Radiocom RCD-30", brand: RC, category: "professional", image: assetUrl(rcd30), tags: ["DMR", "Compact"], price: 2_200_000, rangeCity: "до 2 км", rangeOpen: "до 6 км", industries: ["horeca","security","construction"], blurb: "Компактная цифровая рация для входа в профессиональный сегмент." },

  // ─── Radiocom RC (analog / everyday) ───
  { id: "rc-50", name: "Radiocom RC-50", brand: RC, category: "professional", image: assetUrl(rc50), tags: ["Long range"], price: 1_500_000, rangeCity: "до 2,5 км", rangeOpen: "до 5 км", industries: ["construction","security","transport"], blurb: "Универсальная модель для среднего радиуса действия." },
  { id: "rc-20", name: "Radiocom RC-20", brand: RC, category: "amateur", image: assetUrl(rc20), tags: ["Compact", "License-free"], price: 1_400_000, rangeCity: "до 1,5 км", rangeOpen: "до 4 км", industries: ["horeca","security"], blurb: "Лёгкая рация для персонала — комплект с зарядкой и гарнитурой." },
  { id: "rc-10", name: "Radiocom RC-10", brand: RC, category: "amateur", image: assetUrl(rc10), tags: ["Compact"], price: 1_300_000, rangeCity: "до 1 км", rangeOpen: "до 3 км", industries: ["horeca","security"], blurb: "Начальный уровень линейки — надёжно и просто." },

  // ─── Motorola Talkabout ───
  { id: "m-t82-extreme",      name: "Motorola Talkabout T82 Extreme",      brand: MOT, category: "amateur", image: assetUrl(t82extreme), gallery: [assetUrl(t82e2), assetUrl(t82e3)],     tags: [...TALK, "IPx4"],         price: 1_700_000, rangeCity: "до 1,5 км", industries: ["horeca","security","construction"], blurb: "Защищённая безлицензионная рация для outdoor задач." },
  { id: "m-t82-extreme-quad", name: "Motorola Talkabout T82 Extreme Quad", brand: MOT, category: "amateur", image: assetUrl(t82extremeQuad), tags: [...TALK, "Quad", "IPx4"], price: 3_100_000, rangeCity: "до 1,5 км", industries: ["horeca","security","construction"], blurb: "Комплект из 4 раций для организованных бригад." },
  { id: "m-t82-extreme-rsm",  name: "Motorola Talkabout T82 Extreme RSM", brand: MOT, category: "amateur", image: assetUrl(t82extreme), gallery: [assetUrl(t82e2), assetUrl(t82e3)],     tags: [...TALK, "RSM", "IPx4"],  price: 2_100_000, rangeCity: "до 1,5 км", industries: ["horeca","security","construction"], blurb: "T82 Extreme в комплекте с выносными микрофонами RSM для работы в шуме." },
  { id: "m-t82",              name: "Motorola Talkabout T82",              brand: MOT, category: "amateur", image: assetUrl(t82),            tags: TALK,                      price: 1_500_000, rangeCity: "до 1,5 км", industries: ["horeca","security"], blurb: "Компактная PMR-рация для команд и мероприятий." },
  { id: "m-t72",              name: "Motorola Talkabout T72 Go Active",    brand: MOT, category: "amateur", image: assetUrl(t72), gallery: [assetUrl(t72b), assetUrl(t72c)],            tags: [...TALK, "IPx4"],         price: 1_300_000, rangeCity: "до 1 км",   industries: ["horeca","security","construction"], blurb: "Актуальная PMR для активного использования вне помещений." },
  { id: "m-t62-red",          name: "Motorola Talkabout T62 Red",          brand: MOT, category: "amateur", image: assetUrl(t62red), gallery: [assetUrl(t62r2), assetUrl(t62r3)],         tags: TALK,                      price: 1_100_000, rangeCity: "до 900 м",  industries: ["horeca"], blurb: "Стильная PMR в красном корпусе с надёжным приёмом." },
  { id: "m-t62-blue",         name: "Motorola Talkabout T62 Blue",         brand: MOT, category: "amateur", image: assetUrl(t62blue), gallery: [assetUrl(t62b2)],        tags: TALK,                      price: 1_100_000, rangeCity: "до 900 м",  industries: ["horeca"], blurb: "Та же T62 в синем корпусе — для команд и семьи." },
  { id: "m-t42-triple",       name: "Motorola Talkabout T42 Triple",       brand: MOT, category: "amateur", image: assetUrl(t42triple), gallery: [assetUrl(t42tri2), assetUrl(t42tri3)],      tags: [...TALK, "Triple"],       price: 700_000,   rangeCity: "до 300 м",  industries: ["horeca"], blurb: "Комплект из 3 раций для малых команд." },
  { id: "m-t42-quad",         name: "Motorola Talkabout T42 Quad",         brand: MOT, category: "amateur", image: assetUrl(t42quad), gallery: [assetUrl(t42q2), assetUrl(t42q3)],        tags: [...TALK, "Quad"],         price: 900_000,   rangeCity: "до 300 м",  industries: ["horeca"], blurb: "Комплект из 4 раций T42." },
  { id: "m-t42-red",          name: "Motorola Talkabout T42 Red",          brand: MOT, category: "amateur", image: assetUrl(t42red), gallery: [assetUrl(t42r2), assetUrl(t42r3), assetUrl(t42r4)],         tags: TALK,                      price: 600_000,   rangeCity: "до 300 м",  industries: ["horeca"], blurb: "Начальная PMR для семей и малого бизнеса." },
  { id: "m-t42-blue",         name: "Motorola Talkabout T42 Blue",         brand: MOT, category: "amateur", image: assetUrl(t42blue), gallery: [assetUrl(t42b2), assetUrl(t42b3), assetUrl(t42b4)],        tags: TALK,                      price: 600_000,   rangeCity: "до 300 м",  industries: ["horeca"], blurb: "T42 в синем корпусе — просто, доступно, надёжно." },
  { id: "m-tlkr-t92h2o",      name: "Motorola TLKR-T92 H2O",               brand: MOT, category: "amateur", image: assetUrl(tlkrT92), gallery: [assetUrl(tlkr2), assetUrl(tlkr3)],        tags: [...TALK, "IP67", "Float"], price: 1_800_000, rangeCity: "до 1,5 км", industries: ["horeca","construction","security"], blurb: "Плавает, водозащищена IP67 — для воды и стройки." },
  { id: "m-xt185",            name: "Motorola XT185",                      brand: MOT, category: "amateur", image: assetUrl(xt185), gallery: [assetUrl(xt185b), assetUrl(xt185c)],          tags: TALK,                      price: 1_500_000, rangeCity: "до 1 км",   industries: ["horeca"], blurb: "PMR для розницы, HoReCa и общественных заведений." },
  { id: "m-xt420",            name: "Motorola XT420",                      brand: MOT, category: "professional", image: assetUrl(xt420),     tags: [...TALK, "IP55"],         price: 2_200_000, rangeCity: "до 2 км",   industries: ["horeca","security","construction","manufacturing"], blurb: "Безлицензионная PMR для HoReCa и объектной охраны." },

  // ─── Motorola CL — on-site retail & hospitality ───
  // NOTE: both use a stand-in photo until real catalogue shots are supplied.
  { id: "m-clp446",           name: "Motorola CLP 446",                    brand: MOT, category: "professional", image: genericMotorola, tags: [...TALK, "Antibacterial"], price: 2_400_000, rangeCity: "до 6 этажей", industries: ["horeca","security"], blurb: "Плоская рация без антенны для персонала зала — антибактериальный корпус." },
  { id: "m-clk446",           name: "Motorola CLK 446",                    brand: MOT, category: "professional", image: genericMotorola, tags: [...TALK, "Antimicrobial", "Display"], price: 2_600_000, rangeCity: "до 6 этажей", industries: ["horeca","security"], blurb: "Самая тонкая CL: 14 мм, антимикробное покрытие, дисплей." },
];

export const categoryLabels: Record<Category, { ru: string; en: string; uz: string }> = {
  amateur:      { ru: "Любительские",     en: "Amateur",      uz: "Havaskor" },
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
