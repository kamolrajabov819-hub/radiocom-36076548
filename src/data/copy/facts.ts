/**
 * The catalogue figures the landing copy quotes, computed — never typed.
 *
 * Every number a copy module mentions arrives through a `{{placeholder}}`
 * filled from here, so the prose and the price list cannot disagree: change a
 * price in `products.ts` and every paragraph quoting it changes with it.
 * `verify-content.ts` fails on a placeholder this function does not supply.
 */
import { formatPrice, priceFrom, visibleProducts, type Product } from "@/data/products";
import { specs } from "@/data/specs";
import { pick } from "@/data/spec-dict";
import type { Lang } from "@/lib/i18n";

/** "a, b и c" in the reader's language. */
const list = (names: string[], lang: Lang) => {
  const and = lang === "en" ? " and " : lang === "uz" ? " va " : " и ";
  return names.length < 2
    ? (names[0] ?? "")
    : `${names.slice(0, -1).join(", ")}${and}${names.at(-1)}`;
};

/** A range string in kilometres — «до 2,5 км» → 2.5, «до 900 м» → 0.9. */
const km = (text: string | undefined) => {
  const m = text?.match(/(\d+(?:[.,]\d+)?)/);
  if (!m) return 0;
  const n = Number(m[1].replace(",", "."));
  return /км|km/i.test(text ?? "") ? n : n / 1000;
};

/**
 * The model as prose names it: no brand (the sentence already says it), no
 * «Talkabout», and one name for a colour pair — «T62», not «T62 Red, T62 Blue».
 */
const model = (p: Product) =>
  p.name
    .replace(/^Radiocom |^Motorola /, "")
    .replace(/^Talkabout /, "")
    .replace(/ (Red|Blue)$/, "");

const names = (list: Product[]) => [...new Set(list.map(model))];

/** A spec row's value, by its Russian label (the join key `specs.ts` is written against). */
const specRow = (p: Product, label: string) =>
  specs[p.id]?.rows.find((r) => pick(r.label, "ru") === label)?.value;

const ingress = (p: Product) => specRow(p, "Класс защиты")?.ru ?? "";
const isDmr = (p: Product) => specRow(p, "Стандарт")?.ru === "DMR";
const hasAes = (p: Product) => !!specs[p.id]?.features.some((f) => f.ru.includes("AES-256"));
const mah = (p: Product) => Number(specRow(p, "Ёмкость аккумулятора")?.ru.match(/\d+/)?.[0] ?? 0);

/** Radios in the box: the "radio" line of `inBox`, or the "Комплект" row. */
const radiosInKit = (p: Product) => {
  const line = specs[p.id]?.inBox.find((b) => /рация|радиостанц/i.test(b.item.ru));
  return line?.qty ?? Number(specRow(p, "Комплект")?.ru.match(/\d+/)?.[0] ?? 1);
};

const maxPrice = (list: Product[]) => Math.max(...list.map((p) => p.price ?? 0));

/** The `{{…}}` values for one language. */
export function catalogueFacts(lang: Lang): Record<string, string> {
  const all = visibleProducts;
  const rc = all.filter((p) => p.brandSlug === "radiocom");
  const mot = all.filter((p) => p.brandSlug === "motorola");
  const price = (n: number | null) => formatPrice(n, lang);

  const open = (p: Product) => km(p.rangeOpen?.ru);
  const best = Math.max(...all.map(open));
  const longest = all.filter((p) => open(p) === best);
  const bestCity = Math.max(...all.map((p) => km(p.rangeCity.ru)));
  const cityLeader = all.find((p) => km(p.rangeCity.ru) === bestCity)!;
  const cheapest = all.filter((p) => p.price === priceFrom(all));
  const motLongest = mot.filter((p) => open(p) === Math.max(...mot.map(open)));

  const city = (p: Product) => km(p.rangeCity.ru);
  const extremes = (list: Product[], by: (p: Product) => number) => {
    const max = Math.max(...list.map(by));
    const min = Math.min(...list.map(by));
    return { max: list.find((p) => by(p) === max)!, min: list.find((p) => by(p) === min)! };
  };
  const rcCity = extremes(rc, city);
  const rcOpen = extremes(rc, open);
  const withMah = all.filter((p) => mah(p) > 0);
  const capacity = (list: Product[]) => {
    const xs = list.filter((p) => mah(p) > 0).map(mah);
    const unit = lang === "en" ? "mAh" : lang === "uz" ? "mA·soat" : "мА·ч";
    return `${Math.min(...xs)}–${Math.max(...xs)} ${unit}`;
  };
  /** «RCD-40 PRO — ~14 часов, RC-50 — ~12 часов…», straight from the spec rows. */
  const lifeList = (list: Product[]) =>
    list
      .filter((p) => specRow(p, "Время работы от аккумулятора"))
      .map((p) => `${model(p)} — ${pick(specRow(p, "Время работы от аккумулятора")!, lang)}`)
      .join(", ");

  return {
    minPrice: price(priceFrom(all)),
    maxPrice: price(maxPrice(all)),
    cheapestModel: cheapest[0] ? model(cheapest[0]) : "",
    rcMin: price(priceFrom(rc)),
    rcMax: price(maxPrice(rc)),
    motMin: price(priceFrom(mot)),
    motMax: price(maxPrice(mot)),
    maxOpen: pick(longest[0].rangeOpen!, lang),
    maxOpenModels: list(names(longest), lang),
    maxCity: pick(cityLeader.rangeCity, lang),
    maxCityModel: model(cityLeader),
    motMaxOpen: pick(motLongest[0].rangeOpen!, lang),
    motMaxOpenModels: list(names(motLongest), lang),
    ip67: list(names(all.filter((p) => ingress(p) === "IP67")), lang),
    under1m: list(names(all.filter((p) => (p.price ?? Infinity) <= 1_000_000)), lang),
    longRange: list(names(all.filter((p) => open(p) >= 6)), lang),
    battery: withMah.length ? capacity(all) : "",

    // Radiocom
    rcDmr: list(names(rc.filter(isDmr)), lang),
    rcAes: list(names(rc.filter(hasAes)), lang),
    rcIp67: list(names(rc.filter((p) => ingress(p) === "IP67")), lang),
    rcAnalog: list(names(rc.filter((p) => !p.name.includes("RCD"))), lang),
    rcMinCity: pick(rcCity.min.rangeCity, lang),
    rcMaxCity: pick(rcCity.max.rangeCity, lang),
    rcMaxCityModel: model(rcCity.max),
    rcMaxOpen: pick(rcOpen.max.rangeOpen!, lang),
    rcBattery: capacity(rc),
    rcBatteryLife: lifeList(rc),

    // Motorola
    motIp67: list(names(mot.filter((p) => ingress(p) === "IP67")), lang),
    motKits: list(names(mot.filter((p) => radiosInKit(p) >= 3)), lang),
    motBatteryLife: lifeList(mot),
  };
}
