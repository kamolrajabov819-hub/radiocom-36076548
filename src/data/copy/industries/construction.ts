/** The construction industry page body. See `industries-content.ts` for why this is a module of its own. */
import type { IndustryContent } from "@/data/industries-content";

const content: IndustryContent = {
  problem: {
    ru: "Пыль, вибрация, километры между бригадами. Обычные телефоны не выживают и не покрывают объект.",
    en: "Dust, vibration, kilometers between crews. Regular phones don’t survive and don’t cover the site.",
    uz: "Chang, tebranish, brigadalar orasida kilometrlar. Oddiy telefonlar dosh bermaydi va ob'ektni qamrab ololmaydi.",
  },
  solution: {
    ru: "Ударопрочные DMR-рации с защитой IP67: RCD-70 PRO на объекте, RCD-50 и RCD-60 PRO для бригад.",
    en: "Rugged IP67 DMR radios: RCD-70 PRO on site, RCD-50 and RCD-60 PRO for the crews.",
    uz: "IP67 himoyali zarbaga chidamli DMR ratsiyalar: obyektda RCD-70 PRO, brigadalar uchun RCD-50 va RCD-60 PRO.",
  },
  pains: [
    {
      ru: "Прораб не докрикивается до кранов и монтажников",
      en: "Foreman can’t reach crane ops or fitters",
      uz: "Brigadir kran va montajchilarga yeta olmaydi",
    },
    {
      ru: "Телефоны трескаются, тонут, разряжаются от пыли",
      en: "Phones crack, drown, die in dust",
      uz: "Telefonlar yorilib, cho'kib, changdan buziladi",
    },
    {
      ru: "Мобильная связь пропадает за бетонными стенами",
      en: "Cell signal vanishes past concrete walls",
      uz: "Beton devor orasida mobil aloqa yo'qoladi",
    },
  ],
  outcomes: [
    {
      n: {
        ru: "IP67",
        en: "IP67",
        uz: "IP67",
      },
      u: {
        ru: "",
        en: "",
        uz: "",
      },
      l: {
        ru: "Пыль и вода на площадке — RCD-70 PRO",
        en: "Dust and water on site — RCD-70 PRO",
        uz: "Maydondagi chang va suv — RCD-70 PRO",
      },
    },
    {
      n: {
        ru: "до 10",
        en: "up to 10",
        uz: "10 km gacha",
      },
      u: {
        ru: "км",
        en: "km",
        uz: "",
      },
      l: {
        ru: "На открытой местности — RCD-70 PRO",
        en: "In open ground — RCD-70 PRO",
        uz: "Ochiq joyda — RCD-70 PRO",
      },
    },
    {
      n: {
        ru: "DMR",
        en: "DMR",
        uz: "DMR",
      },
      u: {
        ru: "",
        en: "",
        uz: "",
      },
      l: {
        ru: "Чистый цифровой звук в шуме стройки — RCD-50, RCD-60 и RCD-70 PRO",
        en: "Clear digital audio over site noise — RCD-50, RCD-60 and RCD-70 PRO",
        uz: "Qurilish shovqinida toza raqamli ovoz — RCD-50, RCD-60 va RCD-70 PRO",
      },
    },
  ],
  quote: {
    ru: "Раньше теряли по 2 часа в день на «догоните бригадира». Сейчас — нажал кнопку, вся смена слышит. За месяц окупилось.",
    en: "We used to lose 2 hours a day chasing foremen. Now — press a button, the whole shift hears it. Paid off in a month.",
    uz: "Ilgari brigadirlarni izlashga kunlik 2 soat ketardi. Endi — tugmani bosdim, butun smena eshitadi. Bir oyda o'zini oqladi.",
  },
  quoteAuthor: {
    ru: "ГИП, коммерческий комплекс, Ташкент",
    en: "Project lead, mixed-use complex",
    uz: "Loyiha rahbari, savdo majmuasi",
  },
  faq: [
    {
      q: {
        ru: "Выдержит ли рация зимнюю стройку?",
        en: "Will radios survive winter builds?",
        uz: "Qish qurilishida chidaydimi?",
      },
      a: {
        ru: "IP67 защищает от пыли, грязи и струй воды на площадке. Точный температурный диапазон зависит от модели — привезём рации на объект и проверим в ваших условиях до покупки.",
        en: "IP67 keeps out the dust, grit and water jets of a site. The exact temperature range depends on the model — we will bring radios to your site and test them in your conditions before you buy.",
        uz: "IP67 maydondagi chang, loy va suv oqimidan himoya qiladi. Aniq harorat diapazoni modelga bog'liq — ratsiyalarni obyektga olib kelamiz va sotib olishdan oldin sizning sharoitingizda sinab ko'ramiz.",
      },
    },
    {
      q: {
        ru: "Нужен ли ретранслятор?",
        en: "Do we need a repeater?",
        uz: "Retranslyator kerakmi?",
      },
      a: {
        ru: "Только если объект длиннее 500 м или между бригадами есть перекрытия. Оценим на выезде — бесплатно.",
        en: "Only if the site runs longer than 500 m, or there are floors between the crews. We assess that on the visit, free of charge.",
        uz: "Faqat ob'ekt 500 m dan uzun bo'lsa yoki brigadalar orasida to'siq bo'lsa. Chiqib bepul baholaymiz.",
      },
    },
    {
      q: {
        ru: "Что если рация утонула в бетоне?",
        en: "What if a radio ends up in wet concrete?",
        uz: "Ratsiya ho'l betonga tushib ketsa-chi?",
      },
      a: {
        ru: "IP67 выдерживает пыль и струи воды. Если рация всё же вышла из строя — восстановим или заменим по гарантии 12 месяцев в собственном сервис-центре.",
        en: "IP67 withstands dust and water jets. If a radio does fail, we repair or replace it under the 12-month warranty in our own service centre.",
        uz: "IP67 chang va suv oqimiga chidaydi. Agar ratsiya baribir ishdan chiqsa — 12 oylik kafolat doirasida o'z servis markazimizda tiklaymiz yoki almashtiramiz.",
      },
    },
  ],
};

export default content;
