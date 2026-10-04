/**
 * /about — «компания Radiocom» / «Radiocom kompaniyasi».
 *
 * Every line is the README's company history, the owner's answers, or a claim
 * the site already makes: founded in Tashkent in 2012 with Motorola
 * distribution; in 2013 the exclusive radio supplier to the Uz-Kor Gas
 * Chemical consortium, ENTER Engineering, ERIELL, HYUNDAI Engineering and
 * SAMSUNG Engineering (also named on the mining page); Vertex Standard
 * distribution from 2014; the 2015 Electromagnetic Compatibility Centre report;
 * every product certified in Uzbekistan; 35+ models and 10 000+ clients (the
 * figures the home page counts up to); the own service centre.
 *
 * Left out on purpose: the README's «единственный крупнейшим поставщиком», its
 * «топ-3» and «более 100 000 организаций» (which contradicts the 10 000+ the
 * site publishes) — rankings and counts nobody can check from here — and the
 * 2016 Fisher Lab agency, which is metal detectors, not radio.
 */
import type { PageCopy } from "@/data/copy/pick";

const copy: PageCopy = {
  hero: {
    kicker: { ru: "С 2012 года", en: "Since 2012", uz: "2012-yildan beri" },
    title: { ru: "О компании Radiocom", en: "About Radiocom", uz: "Radiocom kompaniyasi haqida" },
    sub: {
      ru: "С 2012 года поставляем рации Motorola в Узбекистан, ведём собственную линейку Radiocom и ремонтируем рации в своём сервисном центре в Ташкенте.",
      en: "Since 2012 we have supplied Motorola radios in Uzbekistan, built our own Radiocom line and repaired radios in our own service centre in Tashkent.",
      uz: "2012-yildan beri O'zbekistonga Motorola ratsiyalarini yetkazib beramiz, o'z Radiocom liniyamizni rivojlantiramiz va Toshkentdagi o'z servis markazimizda ratsiyalarni ta'mirlaymiz.",
    },
  },
  sections: [
    {
      heading: {
        ru: "Компания Radiocom",
        en: "The Radiocom company",
        uz: "Radiocom kompaniyasi",
      },
      body: [
        {
          ru: "Radiocom основана в Ташкенте в 2012 году и с того же года занимается дистрибуцией раций Motorola в Узбекистане. Сегодня в нашем ассортименте больше 35 моделей, а клиентов — больше 10 000: государственные структуры, службы безопасности, добывающие и транспортные компании, стройка, производство, торговля, отели и рестораны.",
          en: "Radiocom was founded in Tashkent in 2012 and has distributed Motorola radios in Uzbekistan since that year. Today our range runs to more than 35 models, and our clients to more than 10,000: government bodies, security services, mining and transport companies, construction, manufacturing, retail, hotels and restaurants.",
          uz: "Radiocom 2012-yilda Toshkentda tashkil topgan va o'sha yildan beri O'zbekistonda Motorola ratsiyalari distribyutsiyasi bilan shug'ullanadi. Bugun assortimentimizda 35 dan ortiq model, mijozlarimiz esa 10 000 dan ortiq: davlat tuzilmalari, xavfsizlik xizmatlari, qazib oluvchi va transport kompaniyalari, qurilish, ishlab chiqarish, savdo, mehmonxona va restoranlar.",
        },
        {
          ru: "Кроме Motorola, у нас есть собственная линейка раций Radiocom — цифровые RCD и аналоговые RC. Посмотреть модели можно на страницах [рации Motorola](/motorola) и [рации Radiocom](/radiocom).",
          en: "Alongside Motorola we have our own range of Radiocom radios — digital RCD and analogue RC. The models are on the [Motorola radios](/motorola) and [Radiocom radios](/radiocom) pages.",
          uz: "Motorola'dan tashqari, bizda o'zimizning Radiocom ratsiyalari liniyasi bor — raqamli RCD va analog RC. Modellarni [Motorola ratsiyalari](/motorola) va [Radiocom ratsiyalari](/radiocom) sahifalarida ko'rish mumkin.",
        },
      ],
    },
    {
      heading: {
        ru: "История Radiocom",
        en: "Our history",
        uz: "Radiocom tarixi",
      },
      body: [
        {
          ru: "2012 — компания создана и получает дистрибуцию Motorola в Узбекистане. 2013 — становится эксклюзивным поставщиком радиооборудования для консорциума Uz-Kor Gas Chemical, ENTER Engineering, ERIELL, HYUNDAI Engineering и SAMSUNG Engineering. 2014 — получает дистрибуцию Vertex Standard.",
          en: "2012 — the company is founded and takes on Motorola distribution in Uzbekistan. 2013 — it becomes the exclusive radio equipment supplier to the Uz-Kor Gas Chemical consortium, ENTER Engineering, ERIELL, HYUNDAI Engineering and SAMSUNG Engineering. 2014 — it takes on Vertex Standard distribution.",
          uz: "2012 — kompaniya tashkil topadi va O'zbekistonda Motorola distribyutsiyasini oladi. 2013 — Uz-Kor Gas Chemical konsorsiumi, ENTER Engineering, ERIELL, HYUNDAI Engineering va SAMSUNG Engineering uchun radiouskunalarning eksklyuziv yetkazib beruvchisiga aylanadi. 2014 — Vertex Standard distribyutsiyasini oladi.",
        },
        {
          ru: "2015 — в отчёте Центра электромагнитной совместимости Республики Узбекистан Radiocom названа первой в стране по объёму продаж раций диапазона PMR 446–446,1 МГц.",
          en: "2015 — a report by the Electromagnetic Compatibility Centre of the Republic of Uzbekistan names Radiocom first in the country by sales of radios on the PMR 446–446.1 MHz band.",
          uz: "2015 — O'zbekiston Respublikasi Elektromagnit moslashuv markazi hisobotida Radiocom PMR 446–446,1 MGts diapazonidagi ratsiyalar sotuvi hajmi bo'yicha mamlakatda birinchi deb ko'rsatilgan.",
        },
      ],
    },
    {
      heading: {
        ru: "Сертификация, гарантия и сервис",
        en: "Certification, warranty and service",
        uz: "Sertifikatsiya, kafolat va servis",
      },
      body: [
        {
          ru: "Каждую модель, которую мы продаём, сертифицируем в Узбекистане, а работа с частотами для клиентов идёт через Государственную комиссию по радиочастотам. На каждую рацию — гарантия 12 месяцев, ремонт по гарантии и после неё — в нашем авторизованном [сервисном центре](/service).",
          en: "Every model we sell is certified in Uzbekistan, and frequency work for our clients goes through the State Commission on Radio Frequencies. Every radio carries a 12-month warranty, and repairs under warranty and after it are done in our authorised [service centre](/service).",
          uz: "Sotadigan har bir modelimizni O'zbekistonda sertifikatlaymiz, mijozlar uchun chastotalar bilan ishlash esa Radiochastotalar bo'yicha davlat komissiyasi orqali olib boriladi. Har bir ratsiyaga 12 oy kafolat, kafolat davrida va undan keyingi ta'mir esa vakolatli [servis markazimizda](/service).",
        },
        {
          ru: "Перед покупкой рации можно бесплатно протестировать на вашем объекте, а доставка по Узбекистану бесплатная. Адрес, телефоны и часы работы — на странице [контакты](/contacts).",
          en: "Before you buy you can trial the radios free on your own site, and delivery across Uzbekistan is free. The address, phone numbers and opening hours are on the [contacts](/contacts) page.",
          uz: "Sotib olishdan oldin ratsiyalarni ob'ektingizda bepul sinab ko'rishingiz mumkin, O'zbekiston bo'ylab yetkazib berish esa bepul. Manzil, telefonlar va ish vaqti — [kontaktlar](/contacts) sahifasida.",
        },
      ],
    },
  ],
  faq: [
    {
      q: {
        ru: "С какого года работает Radiocom?",
        en: "Since when has Radiocom been trading?",
        uz: "Radiocom qachondan beri ishlaydi?",
      },
      a: {
        ru: "С 2012 года: тогда компания была основана в Ташкенте и получила дистрибуцию Motorola в Узбекистане.",
        en: "Since 2012, when the company was founded in Tashkent and took on Motorola distribution in Uzbekistan.",
        uz: "2012-yildan: o'shanda kompaniya Toshkentda tashkil topgan va O'zbekistonda Motorola distribyutsiyasini olgan.",
      },
    },
    {
      q: {
        ru: "Radiocom — официальный дистрибьютор Motorola?",
        en: "Is Radiocom an official Motorola distributor?",
        uz: "Radiocom Motorola'ning rasmiy distribyutorimi?",
      },
      a: {
        ru: "Да. Radiocom занимается дистрибуцией Motorola в Узбекистане с 2012 года, и каждая рация продаётся с официальной гарантией 12 месяцев.",
        en: "Yes. Radiocom has distributed Motorola in Uzbekistan since 2012, and every radio is sold with an official 12-month warranty.",
        uz: "Ha. Radiocom 2012-yildan beri O'zbekistonda Motorola distribyutsiyasi bilan shug'ullanadi va har bir ratsiya 12 oylik rasmiy kafolat bilan sotiladi.",
      },
    },
    {
      q: {
        ru: "Где находится офис Radiocom?",
        en: "Where is the Radiocom office?",
        uz: "Radiocom ofisi qayerda joylashgan?",
      },
      a: {
        ru: "В Ташкенте, в Мирзо-Улугбекском районе: улица Узбекистон Овози, 2, Le Grande Plaza (бывшая гостиница «Тата»), 1-й и 2-й этажи.",
        en: "In Tashkent, Mirzo-Ulugbek district: 2 Uzbekiston Ovozi Street, Le Grande Plaza (formerly the Tata Hotel), 1st and 2nd floors.",
        uz: "Toshkentda, Mirzo Ulug'bek tumanida: O'zbekiston Ovozi ko'chasi, 2, Le Grande Plaza (sobiq «Tata» mehmonxonasi), 1- va 2-qavatlar.",
      },
    },
  ],
};

export default copy;
