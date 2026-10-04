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
    {
      q: {
        ru: "Какая рация лучше для стройки?",
        en: "Which radio is best for a building site?",
        uz: "Qurilish uchun qaysi ratsiya yaxshi?",
      },
      a: {
        ru: "Для большинства площадок — цифровая DMR-рация с защитой IP67: {{rcIp67}}. На небольшом объекте подойдут и RC-50 или Motorola T82 Extreme из нашего подбора — привезём их на тест и сравним на месте.",
        en: "For most sites, a digital DMR radio rated IP67: the {{rcIp67}}. A small site can manage with the RC-50 or the Motorola T82 Extreme from our shortlist — we will bring them out and compare them on the spot.",
        uz: "Ko'pchilik maydonlar uchun — IP67 himoyali raqamli DMR ratsiya: {{rcIp67}}. Kichik ob'ektga tanlovimizdagi RC-50 yoki Motorola T82 Extreme ham mos keladi — ularni sinovga olib borib, joyida solishtiramiz.",
      },
    },
    {
      q: {
        ru: "Пробивает ли рация бетонные перекрытия?",
        en: "Can a radio get through concrete floors?",
        uz: "Ratsiya beton qavatlardan o'tadimi?",
      },
      a: {
        ru: "Частично: каждое перекрытие ослабляет сигнал, поэтому на высотке связь между нижними и верхними этажами может пропадать. Насколько — зависит от здания; мы проверяем это на выезде и при необходимости подбираем ретранслятор.",
        en: "Partly: every floor slab weakens the signal, so in a tall building the lower and upper floors can lose each other. How much depends on the building; we check it on a site visit and add a repeater where it is needed.",
        uz: "Qisman: har bir qavat signalni kuchsizlantiradi, shuning uchun baland binoda pastki va yuqori qavatlar orasida aloqa uzilishi mumkin. Qanchalik — binoga bog'liq; buni ob'ektga chiqib tekshiramiz va kerak bo'lsa retranslyator tanlaymiz.",
      },
    },
  ],
  sections: [
    {
      heading: {
        ru: "Рации для строительства: что важно на площадке",
        en: "Radios for construction: what matters on site",
        uz: "Qurilish uchun ratsiyalar: maydonda nima muhim",
      },
      body: [
        {
          ru: "На стройке рация работает в пыли, под дождём и рядом с шумной техникой, поэтому начинать стоит с защиты корпуса. Класс IP67 у {{rcIp67}}: пыль внутрь не попадает, а вода рации не страшна. Цифровой DMR-звук RCD-50, RCD-60 и RCD-70 PRO остаётся разборчивым в шуме площадки.",
          en: "On a building site a radio lives in dust, rain and the noise of machinery, so start with how well the casing is sealed. The {{rcIp67}} are rated IP67: dust stays out and water does them no harm. The digital DMR voice of the RCD-50, RCD-60 and RCD-70 PRO stays clear over site noise.",
          uz: "Qurilishda ratsiya chang, yomg'ir va shovqinli texnika yonida ishlaydi, shuning uchun tanlovni korpus himoyasidan boshlash kerak. {{rcIp67}} IP67 darajasiga ega: ichiga chang kirmaydi, suv ham zarar qilmaydi. RCD-50, RCD-60 va RCD-70 PRO'ning raqamli DMR ovozi maydon shovqinida ham aniq eshitiladi.",
        },
        {
          ru: "Прорабу и бригадирам удобна рация с дисплеем и клавиатурой — RCD-60 PRO: видно канал и заряд. Крановщику и монтажникам на высоте нужна гарнитура, чтобы руки оставались свободными; её подберём к разъёму рации на бесплатном тесте.",
          en: "Site managers and foremen do well with a radio that has a display and keypad — the RCD-60 PRO shows the channel and the charge. A crane operator or a crew working at height needs an earpiece to keep both hands free; we match one to the radio's connector during the free trial.",
          uz: "Prorab va brigadirlar uchun displey va klaviaturali ratsiya qulay — RCD-60 PRO'da kanal va zaryad ko'rinib turadi. Kranchi va balandlikda ishlaydigan montajchilarga qo'llari bo'sh qolishi uchun garnitura kerak; uni bepul sinovda ratsiya ulagichiga mos qilib tanlaymiz.",
        },
      ],
    },
    {
      heading: {
        ru: "Связь через бетон и этажи",
        en: "Getting through concrete and floors",
        uz: "Beton va qavatlar orqali aloqa",
      },
      body: [
        {
          ru: "Бетонные перекрытия и арматура гасят сигнал, поэтому на стройке дальность всегда меньше паспортной: даже {{rcMaxCityModel}} в городской застройке берёт {{rcMaxCity}}. На небольшом объекте рации говорят напрямую, а ретранслятор нужен, если объект длиннее 500 м или между бригадами есть перекрытия. Это мы оцениваем на бесплатном выезде; все модели с дальностью — в [сравнении раций](/compare).",
          en: "Concrete slabs and rebar soak up the signal, so on a building site range is always below the rated figure: even the {{rcMaxCityModel}} reaches {{rcMaxCity}} among city buildings. On a small site radios talk directly; a repeater is needed when the site runs past 500 m or there are floors between crews. We assess that on a free site visit; every model's range is in the [radio comparison](/compare).",
          uz: "Beton qavatlar va armatura signalni so'ndiradi, shuning uchun qurilishda masofa har doim pasportdagidan kam: hatto {{rcMaxCityModel}} ham shahar binolari orasida {{rcMaxCity}} ishlaydi. Kichik ob'ektda ratsiyalar to'g'ridan-to'g'ri gaplashadi, retranslyator esa ob'ekt 500 m dan uzun bo'lsa yoki brigadalar orasida qavatlar bo'lsa kerak bo'ladi. Buni bepul chiqishda baholaymiz; barcha modellar masofasi [ratsiyalarni solishtirish](/compare) sahifasida.",
        },
      ],
    },
  ],
};

export default content;
