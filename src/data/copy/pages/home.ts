/**
 * Home — «рации в Ташкенте» / «Toshkentda ratsiyalar» (docs/seo/keyword-map.md).
 *
 * The home page carried almost no indexable text: a slogan, card captions and
 * a model shelf. This is the descriptive block the keyword map asks for — who
 * sells what, where, and for how much — plus the four questions a buyer asks
 * before they ring.
 *
 * Prices, ranges and model names are `{{placeholders}}` filled from the
 * catalogue (`facts.ts`). Every other claim is one the site already makes and
 * the README backs: Motorola distribution since 2012, the free trial, the
 * 12-month warranty, the own service centre, free delivery nationwide.
 */
import type { PageCopy } from "@/data/copy/pick";

const copy: PageCopy = {
  sections: [
    {
      heading: {
        ru: "Рации Motorola и Radiocom в Ташкенте",
        en: "Motorola and Radiocom radios in Tashkent",
        uz: "Toshkentda Motorola va Radiocom ratsiyalari",
      },
      body: [
        {
          ru: "Radiocom продаёт рации в Ташкенте с 2012 года: портативные радиостанции Motorola Talkabout и XT, цифровые рации Radiocom RCD стандарта DMR и аналоговые Radiocom RC. В каталоге есть профессиональные модели для стройки, охраны, ресторанов и отелей, производства, складов и транспорта — и простые рации для семьи и отдыха.",
          en: "Radiocom has sold two-way radios in Tashkent since 2012: Motorola Talkabout and XT handhelds, digital Radiocom RCD radios on the DMR standard, and analogue Radiocom RC. The catalogue has professional models for building sites, security, restaurants and hotels, factories, warehouses and transport — and simple radios for families and the outdoors.",
          uz: "Radiocom 2012-yildan beri Toshkentda ratsiya sotadi: Motorola Talkabout va XT portativ radiostansiyalari, DMR standartidagi raqamli Radiocom RCD va analog Radiocom RC ratsiyalari. Katalogda qurilish, qo'riqlash, restoran va mehmonxonalar, ishlab chiqarish, omborlar va transport uchun professional ratsiyalar, shuningdek oila va dam olish uchun oddiy modellar bor.",
        },
        {
          ru: "Перед покупкой рации можно бесплатно протестировать: мы привозим их на ваш объект, и вы проверяете связь там, где будете работать. На каждую рацию — официальная гарантия 12 месяцев, ремонт — в нашем сервисном центре в Ташкенте. Доставка по Узбекистану бесплатная.",
          en: "You can trial the radios free before you buy: we bring them to your site and you check the signal where you will actually work. Every radio carries an official 12-month warranty, and repairs are done in our own service centre in Tashkent. Delivery across Uzbekistan is free.",
          uz: "Ratsiya sotib olishdan oldin uni bepul sinab ko'rasiz: ratsiyalarni ob'ektingizga olib boramiz va aloqani aynan ishlaydigan joyingizda tekshirasiz. Har bir ratsiyaga 12 oylik rasmiy kafolat beriladi, ta'mir esa Toshkentdagi o'z servis markazimizda qilinadi. O'zbekiston bo'ylab yetkazib berish bepul.",
        },
      ],
    },
    {
      heading: {
        ru: "Цены на рации",
        en: "Two-way radio prices",
        uz: "Ratsiya narxi",
      },
      body: [
        {
          ru: "Рации в нашем каталоге стоят от {{minPrice}} до {{maxPrice}}. Цена указана за комплект, как в прайс-листе: в коробке недорогих Motorola Talkabout две, три или четыре рации, а профессиональная Radiocom RCD обычно продаётся по одной.",
          en: "Radios in our catalogue cost from {{minPrice}} to {{maxPrice}}. Prices are per kit, as on the price list: an affordable Motorola Talkabout box holds two, three or four radios, while a professional Radiocom RCD is usually sold singly.",
          uz: "Katalogimizdagi ratsiyalar narxi {{minPrice}}dan {{maxPrice}}gacha. Narx prays-varaqdagi kabi komplekt uchun ko'rsatilgan: arzon Motorola Talkabout qutisida ikki, uch yoki to'rtta ratsiya bo'ladi, professional Radiocom RCD esa odatda bittadan sotiladi.",
        },
        {
          ru: "Рации Radiocom стоят от {{rcMin}} до {{rcMax}}, Motorola — от {{motMin}} до {{motMax}}. Цену каждой модели вы найдёте на страницах [рации Radiocom](/radiocom) и [рации Motorola](/motorola), а [сравнение раций](/compare) сводит все модели в одну таблицу с дальностью и классом защиты.",
          en: "Radiocom radios cost from {{rcMin}} to {{rcMax}}, Motorola from {{motMin}} to {{motMax}}. Each model's price is on the [Radiocom radios](/radiocom) and [Motorola radios](/motorola) pages, and the [radio comparison](/compare) puts every model in one table with its range and protection rating.",
          uz: "Radiocom ratsiyalari {{rcMin}}dan {{rcMax}}gacha, Motorola esa {{motMin}}dan {{motMax}}gacha turadi. Har bir modelning narxi [Radiocom ratsiyalari](/radiocom) va [Motorola ratsiyalari](/motorola) sahifalarida, [ratsiyalarni solishtirish](/compare) jadvalida esa barcha modellar masofa va himoya darajasi bilan birga keltirilgan.",
        },
      ],
    },
    {
      heading: {
        ru: "Какую рацию выбрать для работы",
        en: "Which radio to choose for work",
        uz: "Ish uchun qaysi ratsiyani tanlash kerak",
      },
      body: [
        {
          ru: "Выбор начинается с объекта: на каком расстоянии работают люди, что стоит между ними и сколько длится смена. Мы разобрали это подробно в статье [как выбрать рацию](/answers/how-to-choose). Для стройки, охраны и производства обычно берут цифровые DMR-рации Radiocom RCD, для кафе, магазина или семьи хватает безлицензионных Motorola Talkabout на 446 МГц.",
          en: "The choice starts with the site: how far apart people work, what stands between them and how long the shift runs. We go through it in detail in [how to choose a radio](/answers/how-to-choose). Building sites, security teams and factories usually take digital DMR radios from the Radiocom RCD line; a café, a shop or a family is well served by licence-free Motorola Talkabouts on 446 MHz.",
          uz: "Tanlov ob'ektdan boshlanadi: odamlar qancha masofada ishlaydi, ular orasida nima bor va smena necha soat davom etadi. Buni [ratsiyani qanday tanlash kerak](/answers/how-to-choose) maqolasida batafsil yozganmiz. Qurilish, qo'riqlash va ishlab chiqarish uchun odatda raqamli DMR ratsiyalari Radiocom RCD olinadi, kafe, do'kon yoki oila uchun esa 446 MGts diapazonidagi litsenziyasiz Motorola Talkabout yetarli.",
        },
        {
          ru: "Если связь нужна между городами, без ограничения дальности, посмотрите [PoC-рации](/poc): они работают через мобильную сеть. А для отраслевого подбора есть страница [рации для бизнеса](/industries) — с моделями под каждую задачу.",
          en: "If you need to talk between cities, with no range limit, look at [PoC radios](/poc): they work over the mobile network. For a choice by industry there is [radios for business](/industries), with the models that suit each kind of work.",
          uz: "Agar aloqa shaharlar orasida, masofa cheklovisiz kerak bo'lsa, mobil tarmoq orqali ishlaydigan [PoC ratsiyalar](/poc)ni ko'ring. Soha bo'yicha tanlash uchun esa [biznes uchun ratsiyalar](/industries) sahifasi bor — har bir vazifaga mos modellar bilan.",
        },
      ],
    },
    {
      heading: {
        ru: "Аренда, ремонт и связь под ключ",
        en: "Rental, repair and turnkey radio",
        uz: "Ijara, ta'mir va kalit topshiriladigan aloqa",
      },
      body: [
        {
          ru: "Если рации нужны на день или на сезон, их можно взять в [аренду раций](/rent) — от одного дня до пяти лет и дольше. [Ремонт раций](/service) Motorola и Radiocom делает наш сервисный центр, по гарантии и после неё. А когда расстояние или бетон мешают связи на большом объекте, мы занимаемся [организацией радиосвязи на предприятии](/solutions): замеряем связь, считаем покрытие и ставим антенны.",
          en: "If you need radios for a day or a season, take them on [radio rental](/rent) — from one day to five years and beyond. [Radio repair](/service) for Motorola and Radiocom is done in our own service centre, under warranty and after it. And when distance or concrete cuts the signal on a large site, we build [a radio network for your business](/solutions): we measure the signal, calculate the coverage and put up the antennas.",
          uz: "Ratsiyalar bir kunga yoki mavsumga kerak bo'lsa, ularni [ratsiya ijarasi](/rent) orqali olish mumkin — bir kundan besh yilgacha va undan ko'proq. Motorola va Radiocom [ratsiya ta'mirlash](/service) ishlarini o'z servis markazimiz kafolat davrida ham, undan keyin ham bajaradi. Katta ob'ektda masofa yoki beton aloqaga xalaqit bersa, [korxonada radioaloqa tizimi](/solutions)ni quramiz: aloqani o'lchaymiz, qamrovni hisoblaymiz va antennalar o'rnatamiz.",
        },
      ],
    },
  ],
  faq: [
    {
      q: {
        ru: "Сколько стоит рация в Ташкенте?",
        en: "How much does a two-way radio cost in Tashkent?",
        uz: "Toshkentda ratsiya qancha turadi?",
      },
      a: {
        ru: "В нашем каталоге — от {{minPrice}} до {{maxPrice}} за комплект. Цена зависит от дальности, защиты от пыли и воды и от того, сколько раций в коробке: в недорогих комплектах Motorola Talkabout их от двух до четырёх.",
        en: "In our catalogue, from {{minPrice}} to {{maxPrice}} per kit. The price depends on range, dust and water protection, and how many radios are in the box: affordable Motorola Talkabout kits hold two to four.",
        uz: "Katalogimizda — komplekt uchun {{minPrice}}dan {{maxPrice}}gacha. Narx masofaga, chang va suvdan himoyaga hamda qutidagi ratsiyalar soniga bog'liq: arzon Motorola Talkabout komplektlarida ikkitadan to'rttagacha ratsiya bor.",
      },
    },
    {
      q: {
        ru: "Нужно ли разрешение на рацию?",
        en: "Do I need a permit for a two-way radio?",
        uz: "Ratsiya uchun ruxsat kerakmi?",
      },
      a: {
        ru: "Для раций диапазона PMR446 — например, Motorola Talkabout и XT — разрешение не нужно: это свободный диапазон 446 МГц. Если объекту нужны собственные частоты, оформление мы берём на себя и готовим документы для Государственной комиссии по радиочастотам.",
        en: "Radios on the PMR446 band — Motorola Talkabout and XT, for example — need no permit: 446 MHz is a licence-free band. If your site needs frequencies of its own, we take the paperwork on and prepare the documents for the State Commission on Radio Frequencies.",
        uz: "PMR446 diapazonidagi ratsiyalar — masalan, Motorola Talkabout va XT — uchun ruxsat kerak emas: 446 MGts erkin diapazon. Agar ob'ektga o'z chastotalari kerak bo'lsa, rasmiylashtirishni o'z zimmamizga olamiz va Radiochastotalar bo'yicha davlat komissiyasi uchun hujjatlarni tayyorlaymiz.",
      },
    },
    {
      q: {
        ru: "Какая рация работает дальше всех?",
        en: "Which radio has the longest range?",
        uz: "Qaysi ratsiya eng uzoqqa ishlaydi?",
      },
      a: {
        ru: "На открытой местности — {{maxOpenModels}}: {{maxOpen}} по данным производителя. В городе дальше всех берёт {{maxCityModel}} — {{maxCity}}. Реальная дальность зависит от рельефа и застройки, поэтому мы привозим рации на бесплатный тест.",
        en: "In open country: {{maxOpenModels}}, at {{maxOpen}} by the manufacturer's figures. In town the {{maxCityModel}} reaches furthest, {{maxCity}}. Real range depends on the terrain and the buildings, which is why we bring radios out for a free trial.",
        uz: "Ochiq joyda — {{maxOpenModels}}: ishlab chiqaruvchi ma'lumotiga ko'ra {{maxOpen}}. Shaharda eng uzoqqa {{maxCityModel}} yetadi — {{maxCity}}. Haqiqiy masofa joy relyefi va binolarga bog'liq, shuning uchun ratsiyalarni bepul sinovga olib boramiz.",
      },
    },
    {
      q: {
        ru: "Есть ли доставка по Узбекистану?",
        en: "Do you deliver across Uzbekistan?",
        uz: "O'zbekiston bo'ylab yetkazib berish bormi?",
      },
      a: {
        ru: "Да, доставка по всей республике бесплатная. В Ташкенте можно приехать в наш офис и сервисный центр на улице Узбекистон Овози, 2.",
        en: "Yes, delivery anywhere in the country is free. In Tashkent you can also come to our office and service centre at 2 Uzbekiston Ovozi Street.",
        uz: "Ha, butun respublika bo'ylab yetkazib berish bepul. Toshkentda O'zbekiston Ovozi ko'chasi, 2-uydagi ofisimiz va servis markazimizga kelishingiz ham mumkin.",
      },
    },
  ],
};

export default copy;
