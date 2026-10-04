/** The «ip67» answer page body. See `answers-content.ts` for why each page is a module of its own. */
import type { AnswerContent } from "@/data/answers-content";

const content: AnswerContent = {
  picks: ["rcd-70", "rcd-50", "m-tlkr-t92h2o", "m-t82-extreme"],
  related: ["how-to-choose", "real-range", "analog-or-digital"],
  cta: {
    path: "/motorola/tlkr-t92h2o",
    anchor: {
      ru: "Рация Motorola TLKR-T92 H2O",
      en: "The Motorola TLKR-T92 H2O",
      uz: "Motorola TLKR-T92 H2O ratsiyasi",
    },
  },
  sections: [
    {
      heading: {
        ru: "Как читать класс защиты IP",
        en: "How to read an IP rating",
        uz: "IP himoya darajasini qanday o'qish",
      },
      body: {
        ru: "Код IP по стандарту IEC 60529 состоит из двух цифр. Первая — защита от пыли и твёрдых частиц, от 0 до 6: шестёрка значит, что пыль внутрь не проходит совсем. Вторая — защита от воды, от 0 до 9: 4 — брызги с любой стороны, 5 — струи воды, 7 — погружение до 1 метра на 30 минут. Буква X вместо цифры означает, что по этому пункту рацию не испытывали.",
        en: "An IP code under IEC 60529 has two digits. The first is protection from dust and solids, 0 to 6: a 6 means no dust gets in at all. The second is protection from water, 0 to 9: 4 is splashing from any direction, 5 is jets of water, 7 is immersion to 1 metre for 30 minutes. An X in place of a digit means the radio was not tested on that point.",
        uz: "IEC 60529 standarti bo'yicha IP kodi ikki raqamdan iborat. Birinchisi — chang va qattiq zarralardan himoya, 0 dan 6 gacha: oltilik chang ichkariga umuman kirmasligini bildiradi. Ikkinchisi — suvdan himoya, 0 dan 9 gacha: 4 — har tomondan sachrashlar, 5 — suv oqimi, 7 — 30 daqiqa davomida 1 metrgacha cho'mish. Raqam o'rnidagi X harfi ratsiya bu bo'yicha sinovdan o'tkazilmaganini bildiradi.",
      },
    },
    {
      heading: {
        ru: "Водонепроницаемая рация: какой класс нужен",
        en: "A waterproof radio: which rating you need",
        uz: "Suv o'tkazmaydigan ratsiya: qaysi daraja kerak",
      },
      body: {
        ru: "Для стройки, карьера, улицы и работы у воды нужен IP67: в нашем каталоге это Radiocom RCD-70 PRO, RCD-50 PRO и Motorola TLKR-T92 H2O, которая к тому же держится на воде. Для склада, отеля или магазина, где рации страшны разве что дождь и брызги, хватает IP54–IP55 — такой класс у большинства профессиональных раций Radiocom.",
        en: "For a building site, a quarry, outdoor work or work by the water you want IP67: in our catalogue that is the Radiocom RCD-70 PRO, RCD-50 PRO and the Motorola TLKR-T92 H2O, which also floats. For a warehouse, a hotel or a shop, where the worst a radio meets is rain and splashes, IP54–IP55 is enough — and most professional Radiocom radios have it.",
        uz: "Qurilish, karyer, ochiq havo va suv yonidagi ish uchun IP67 kerak: katalogimizda bular Radiocom RCD-70 PRO, RCD-50 PRO va suvda cho'kmaydigan Motorola TLKR-T92 H2O. Ombor, mehmonxona yoki do'kon uchun, ya'ni ratsiyaga faqat yomg'ir va sachrashlar xavf solsa, IP54–IP55 yetarli — professional Radiocom ratsiyalarining ko'pchiligida aynan shunday himoya bor.",
      },
    },
    {
      heading: {
        ru: "Что значит IPX4 у Motorola Talkabout",
        en: "What IPX4 means on a Motorola Talkabout",
        uz: "Motorola Talkabout'da IPX4 nima degani",
      },
      body: {
        ru: "У Motorola T82 и T82 Extreme класс IPX4: рация защищена от брызг с любой стороны, а испытания на пыль не проводились. Под дождём такая рация работает, но в воду её лучше не ронять.",
        en: "The Motorola T82 and T82 Extreme are rated IPX4: the radio is protected against splashing from any direction, and was not tested for dust. It will work in the rain, but it is best not dropped in water.",
        uz: "Motorola T82 va T82 Extreme'da IPX4 darajasi bor: ratsiya har tomondan sachrashlardan himoyalangan, chang bo'yicha esa sinov o'tkazilmagan. Bunday ratsiya yomg'irda ishlaydi, lekin uni suvga tushirmagan ma'qul.",
      },
    },
  ],
  faq: [
    {
      q: {
        ru: "Можно ли купаться с рацией IP67?",
        en: "Can I swim with an IP67 radio?",
        uz: "IP67 ratsiya bilan cho'milish mumkinmi?",
      },
      a: {
        ru: "Нет: IP67 испытывают кратковременным погружением — до 1 метра на 30 минут. Рация переживёт падение в лужу или в воду, но не рассчитана на долгую работу под водой.",
        en: "No: IP67 is tested with a brief immersion — up to 1 metre for 30 minutes. The radio will survive a fall into a puddle or into water, but it is not built to work under water for long.",
        uz: "Yo'q: IP67 qisqa muddatli cho'mish bilan sinaladi — 30 daqiqa davomida 1 metrgacha. Ratsiya ko'lmakka yoki suvga tushib ketsa ham ishlaydi, lekin suv ostida uzoq ishlashga mo'ljallanmagan.",
      },
    },
    {
      q: {
        ru: "Чем IP67 отличается от IP54?",
        en: "How does IP67 differ from IP54?",
        uz: "IP67 IP54'dan nimasi bilan farq qiladi?",
      },
      a: {
        ru: "IP67 полностью пыленепроницаем и выдерживает погружение в воду. IP54 защищён от пыли частично и выдерживает только брызги с любой стороны.",
        en: "IP67 is fully dust-tight and survives immersion in water. IP54 is partly protected from dust and withstands only splashing from any direction.",
        uz: "IP67 changni umuman o'tkazmaydi va suvga cho'mishga chidaydi. IP54 changdan qisman himoyalangan va faqat har tomondan sachrashlarga chidaydi.",
      },
    },
    {
      q: {
        ru: "Какие рации с защитой IP67 есть в наличии?",
        en: "Which IP67 radios are in stock?",
        uz: "Qaysi IP67 himoyali ratsiyalar mavjud?",
      },
      a: {
        ru: "Radiocom RCD-70 PRO, Radiocom RCD-50 PRO и Motorola TLKR-T92 H2O. Привезём их на бесплатный тест на ваш объект.",
        en: "The Radiocom RCD-70 PRO, the Radiocom RCD-50 PRO and the Motorola TLKR-T92 H2O. We will bring them to your site for a free trial.",
        uz: "Radiocom RCD-70 PRO, Radiocom RCD-50 PRO va Motorola TLKR-T92 H2O. Ularni ob'ektingizga bepul sinovga olib boramiz.",
      },
    },
  ],
};

export default content;
