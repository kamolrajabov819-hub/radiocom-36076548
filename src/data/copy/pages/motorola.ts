/**
 * /motorola — «рации Motorola» / «Motorola ratsiyalari» (docs/seo/keyword-map.md).
 *
 * Secondary terms: «Motorola Talkabout», «безлицензионные рации Motorola»,
 * «рации Motorola цена», kits of 2/3/4. Ranges, kit names and run times are
 * `{{placeholders}}` from the catalogue. «Официальный дистрибьютор с 2012 года»
 * is the README's history (Motorola distribution, 2012); the licence-free
 * PMR446 claim is the one the page's own meta has always made.
 *
 * Not here: the CLP and CLK 446 — hidden in the catalogue, so a page that
 * cannot show them does not name them.
 */
import type { PageCopy } from "@/data/copy/pick";

const copy: PageCopy = {
  sections: [
    {
      heading: {
        ru: "Рации Motorola Talkabout",
        en: "Motorola Talkabout radios",
        uz: "Motorola Talkabout ratsiyalari",
      },
      body: [
        {
          ru: "Talkabout — безлицензионные рации Motorola диапазона PMR446: T82 Extreme, T82, T72, T62 и T42. Включили, выбрали общий канал и код конфиденциальности — и можно говорить, без разрешений и абонентской платы. Модели отличаются дальностью и защитой: {{motMaxOpenModels}} берут {{motMaxOpen}} на открытой местности, а {{motIp67}} защищена по IP67.",
          en: "Talkabouts are Motorola's licence-free radios on the PMR446 band: the T82 Extreme, T82, T72, T62 and T42. Switch on, pick a shared channel and privacy code, and you are talking — no permit and no monthly fee. They differ in range and protection: the {{motMaxOpenModels}} reach {{motMaxOpen}} in open country, and the {{motIp67}} is rated IP67.",
          uz: "Talkabout — PMR446 diapazonidagi litsenziyasiz Motorola ratsiyalari: T82 Extreme, T82, T72, T62 va T42. Yoqasiz, umumiy kanal va maxfiylik kodini tanlaysiz — va gaplashaverasiz, ruxsatnoma va oylik to'lovsiz. Modellar masofa va himoyasi bilan farq qiladi: {{motMaxOpenModels}} ochiq joyda {{motMaxOpen}} ishlaydi, {{motIp67}} esa IP67 bilan himoyalangan.",
        },
      ],
    },
    {
      heading: {
        ru: "Рации Motorola XT для бизнеса",
        en: "Motorola XT radios for business",
        uz: "Biznes uchun Motorola XT ratsiyalari",
      },
      body: [
        {
          ru: "XT185 и XT420 — рации Motorola для персонала отелей, ресторанов и складов, тоже в безлицензионном диапазоне PMR446. XT185 продаётся парой, с двумя гарнитурами с кнопкой PTT в комплекте, XT420 — по одной рации. Время работы по данным производителя: {{motBatteryLife}}.",
          en: "The XT185 and XT420 are Motorola's radios for hotel, restaurant and warehouse staff, also on the licence-free PMR446 band. The XT185 comes as a pair with two PTT earpieces in the box; the XT420 is sold singly. Run times by the manufacturer's figures: {{motBatteryLife}}.",
          uz: "XT185 va XT420 — mehmonxona, restoran va ombor xodimlari uchun Motorola ratsiyalari, ular ham litsenziyasiz PMR446 diapazonida ishlaydi. XT185 juft bo'lib, komplektdagi ikkita PTT tugmali garnitura bilan sotiladi, XT420 esa bittadan. Ishlab chiqaruvchi ma'lumotiga ko'ra ish vaqti: {{motBatteryLife}}.",
        },
      ],
    },
    {
      heading: {
        ru: "Комплекты раций Motorola",
        en: "Motorola radio kits",
        uz: "Motorola ratsiya to'plamlari",
      },
      body: [
        {
          ru: "{{motKits}} продаются комплектами на три и четыре рации — удобно для семьи, небольшой бригады или смены. Остальные модели Talkabout — парой. Цены Motorola в нашем каталоге — от {{motMin}} до {{motMax}} за комплект; все модели рядом, с дальностью и защитой, — в [сравнении раций](/compare).",
          en: "The {{motKits}} come in kits of three and four radios — handy for a family, a small crew or a shift. The other Talkabouts come as pairs. Motorola prices in our catalogue run from {{motMin}} to {{motMax}} per kit; every model side by side, with range and protection, is in the [radio comparison](/compare).",
          uz: "{{motKits}} uch va to'rt ratsiyali to'plamlarda sotiladi — oila, kichik brigada yoki smena uchun qulay. Qolgan Talkabout modellari juft bo'lib sotiladi. Katalogimizda Motorola narxi komplekt uchun {{motMin}}dan {{motMax}}gacha; barcha modellar masofa va himoyasi bilan [ratsiyalarni solishtirish](/compare) sahifasida.",
        },
      ],
    },
    {
      heading: {
        ru: "Оригинальные Motorola без разрешения на частоту",
        en: "Genuine Motorola, no frequency permit",
        uz: "Chastota ruxsatnomasisiz original Motorola",
      },
      body: [
        {
          ru: "Talkabout, TLKR и XT работают на свободных частотах 446 МГц, поэтому разрешение на частоту для них не нужно. Если объекту нужна цифровая связь с шифрованием, посмотрите [рации Radiocom](/radiocom) линейки RCD.",
          en: "Talkabout, TLKR and XT radios use the free 446 MHz band, so they need no frequency permit. If your site needs encrypted digital radio, look at the RCD line of [Radiocom radios](/radiocom).",
          uz: "Talkabout, TLKR va XT erkin 446 MGts chastotalarida ishlaydi, shuning uchun ularga chastota ruxsatnomasi kerak emas. Ob'ektga shifrlangan raqamli aloqa kerak bo'lsa, RCD liniyasidagi [Radiocom ratsiyalari](/radiocom)ni ko'ring.",
        },
        {
          ru: "Radiocom — официальный дистрибьютор Motorola в Узбекистане с 2012 года. Каждая рация продаётся с официальной гарантией 12 месяцев и обслуживается в нашем [сервисном центре](/service) в Ташкенте.",
          en: "Radiocom has been an official Motorola distributor in Uzbekistan since 2012. Every radio is sold with an official 12-month warranty and serviced in our [service centre](/service) in Tashkent.",
          uz: "Radiocom 2012-yildan beri O'zbekistonda Motorola'ning rasmiy distribyutori. Har bir ratsiya 12 oylik rasmiy kafolat bilan sotiladi va Toshkentdagi [servis markazimizda](/service) xizmat ko'rsatiladi.",
        },
      ],
    },
  ],
  faq: [
    {
      q: {
        ru: "Какая рация Motorola работает дальше всех?",
        en: "Which Motorola radio has the longest range?",
        uz: "Qaysi Motorola ratsiyasi eng uzoqqa ishlaydi?",
      },
      a: {
        ru: "{{motMaxOpenModels}} — {{motMaxOpen}} на открытой местности по данным производителя. В городе и между этажами дальность в разы меньше, поэтому перед покупкой рации можно бесплатно протестировать на вашем объекте.",
        en: "The {{motMaxOpenModels}}: {{motMaxOpen}} in open country by the manufacturer's figures. In town and between floors the range is several times shorter, which is why you can trial the radios free on your own site before you buy.",
        uz: "{{motMaxOpenModels}} — ishlab chiqaruvchi ma'lumotiga ko'ra ochiq joyda {{motMaxOpen}}. Shaharda va qavatlar orasida masofa bir necha baravar kam, shuning uchun sotib olishdan oldin ratsiyalarni ob'ektingizda bepul sinab ko'rishingiz mumkin.",
      },
    },
    {
      q: {
        ru: "Нужно ли разрешение на Motorola T82?",
        en: "Does the Motorola T82 need a permit?",
        uz: "Motorola T82 uchun ruxsat kerakmi?",
      },
      a: {
        ru: "Нет. Motorola T82 и T82 Extreme работают в безлицензионном диапазоне PMR446, разрешение на частоту для них не нужно.",
        en: "No. The Motorola T82 and T82 Extreme work on the licence-free PMR446 band, so no frequency permit is needed.",
        uz: "Yo'q. Motorola T82 va T82 Extreme litsenziyasiz PMR446 diapazonida ishlaydi, ularga chastota ruxsatnomasi kerak emas.",
      },
    },
    {
      q: {
        ru: "Как отличить оригинальную Motorola от подделки?",
        en: "How do I know a Motorola radio is genuine?",
        uz: "Original Motorola'ni qalbakisidan qanday ajratish mumkin?",
      },
      a: {
        ru: "Надёжнее всего — купить у официального дистрибьютора. Radiocom поставляет Motorola в Узбекистан с 2012 года: каждая рация продаётся с официальной гарантией 12 месяцев и обслуживается в нашем сервисном центре в Ташкенте.",
        en: "The surest way is to buy from an official distributor. Radiocom has supplied Motorola in Uzbekistan since 2012: every radio is sold with an official 12-month warranty and serviced in our own service centre in Tashkent.",
        uz: "Eng ishonchli yo'li — rasmiy distribyutordan sotib olish. Radiocom 2012-yildan beri O'zbekistonga Motorola yetkazib beradi: har bir ratsiya 12 oylik rasmiy kafolat bilan sotiladi va Toshkentdagi servis markazimizda xizmat ko'rsatiladi.",
      },
    },
  ],
};

export default copy;
