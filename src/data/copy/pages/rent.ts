/**
 * /rent — «аренда раций в Ташкенте» / «ratsiya ijarasi Toshkentda».
 *
 * Built only from what the README and the PoC page's rental block already
 * say: Motorola radios with the full set of accessories, spare batteries and
 * setup; Radiocom's own frequencies, which work across the republic; terms
 * from one day to five years and more. There is no rental price list and no
 * deposit rule on record, so the page names neither — it says the price is
 * worked out per job, and asks for the request (owner questions).
 */
import type { PageCopy } from "@/data/copy/pick";

const copy: PageCopy = {
  hero: {
    kicker: {
      ru: "Посуточно и на годы",
      en: "By the day or by the year",
      uz: "Kunlik va yillarga",
    },
    title: { ru: "Аренда раций", en: "Two-way radio rental", uz: "Ratsiya ijarasi" },
    sub: {
      ru: "Рации Motorola на день, на мероприятие или на объект — от одного дня до пяти лет и дольше. С полным комплектом аксессуаров, запасными аккумуляторами и настройкой.",
      en: "Motorola radios for a day, an event or a site — from one day to five years and beyond. With the full set of accessories, spare batteries and setup.",
      uz: "Bir kunga, tadbirga yoki ob'ektga Motorola ratsiyalari — bir kundan besh yilgacha va undan ham ko'proq. To'liq aksessuarlar, zaxira akkumulyatorlar va sozlash bilan.",
    },
  },
  sections: [
    {
      heading: {
        ru: "Аренда раций в Ташкенте",
        en: "Radio rental in Tashkent",
        uz: "Toshkentda ratsiya ijarasi",
      },
      body: [
        {
          ru: "Рации можно взять ровно на столько, на сколько они нужны: на один день, на неделю, на сезон или на несколько лет. Мы выдаём рации Motorola с полным комплектом аксессуаров и запасными аккумуляторами и настраиваем их до выдачи — вам остаётся включить и говорить.",
          en: "Take radios for exactly as long as you need them: a day, a week, a season or several years. We hand over Motorola radios with the full set of accessories and spare batteries, set up before you collect them — all that is left is to switch on and talk.",
          uz: "Ratsiyalarni aynan kerakli muddatga olish mumkin: bir kunga, bir haftaga, mavsumga yoki bir necha yilga. Motorola ratsiyalarini to'liq aksessuarlar va zaxira akkumulyatorlar bilan beramiz va berishdan oldin sozlaymiz — sizga faqat yoqib, gaplashish qoladi.",
        },
        {
          ru: "Рации настраиваем на собственные частоты Radiocom, которые работают по всей республике, поэтому арендованные рации можно взять и за пределы Ташкента.",
          en: "We set the radios to Radiocom's own frequencies, which work across the whole country, so rented radios can go beyond Tashkent too.",
          uz: "Ratsiyalarni butun respublikada ishlaydigan Radiocom'ning o'z chastotalariga sozlaymiz, shuning uchun ijaraga olingan ratsiyalarni Toshkentdan tashqariga ham olib chiqish mumkin.",
        },
      ],
    },
    {
      heading: {
        ru: "Аренда раций на мероприятие",
        en: "Radio rental for events",
        uz: "Tadbir uchun ratsiya ijarasi",
      },
      body: [
        {
          ru: "Концерт, конференция, свадьба, съёмка или спортивный турнир длятся день-два, и покупать рации ради этого незачем. Посуточная аренда закрывает такие задачи: получили настроенный комплект, провели мероприятие, вернули.",
          en: "A concert, a conference, a wedding, a shoot or a tournament lasts a day or two, and there is no reason to buy radios for it. Daily rental covers exactly that: collect a configured set, run the event, hand it back.",
          uz: "Konsert, konferensiya, to'y, suratga olish yoki sport musobaqasi bir-ikki kun davom etadi va buning uchun ratsiya sotib olishning hojati yo'q. Kunlik ijara aynan shunday vazifalar uchun: sozlangan to'plamni olasiz, tadbirni o'tkazasiz, qaytarasiz.",
        },
      ],
    },
    {
      heading: {
        ru: "Долгосрочная аренда раций для объектов",
        en: "Long-term rental for sites",
        uz: "Ob'ektlar uchun uzoq muddatli ijara",
      },
      body: [
        {
          ru: "Для стройки, сезонного производства или проекта с понятным сроком рации можно взять на месяцы и годы — до пяти лет и дольше. Если вы решите, что рации нужны насовсем, посмотрите [рации Motorola](/motorola) и [рации Radiocom](/radiocom), а подбор под отрасль — на странице [рации для бизнеса](/industries).",
          en: "For a building site, seasonal production or a project with a known end date, radios can be taken for months or years — up to five years and beyond. If you decide you need radios for good, see [Motorola radios](/motorola) and [Radiocom radios](/radiocom), and a choice by industry on [radios for business](/industries).",
          uz: "Qurilish, mavsumiy ishlab chiqarish yoki muddati aniq loyiha uchun ratsiyalarni oylar va yillarga — besh yilgacha va undan ko'proqqa olish mumkin. Ratsiyalar doimiy kerak deb qaror qilsangiz, [Motorola ratsiyalari](/motorola) va [Radiocom ratsiyalari](/radiocom)ni ko'ring, soha bo'yicha tanlov esa [biznes uchun ratsiyalar](/industries) sahifasida.",
        },
      ],
    },
    {
      heading: {
        ru: "Сколько стоит аренда раций",
        en: "What radio rental costs",
        uz: "Ratsiya ijarasi narxi",
      },
      body: [
        {
          ru: "Стоимость считаем под задачу: она зависит от количества раций, срока и комплекта. Оставьте заявку — назовём цену и сроки.",
          en: "We price each job on its own: it depends on the number of radios, the term and the set. Leave a request and we will come back with a price and dates.",
          uz: "Narxni vazifaga qarab hisoblaymiz: u ratsiyalar soni, muddat va to'plamga bog'liq. Ariza qoldiring — narx va muddatlarni aytamiz.",
        },
      ],
    },
  ],
  faq: [
    {
      q: {
        ru: "На какой срок можно взять рации в аренду?",
        en: "For how long can I rent radios?",
        uz: "Ratsiyalarni qancha muddatga ijaraga olish mumkin?",
      },
      a: {
        ru: "От одного дня до пяти лет и дольше: посуточно на мероприятие или на месяцы и годы для объекта.",
        en: "From one day to five years and beyond: by the day for an event, or for months and years on a site.",
        uz: "Bir kundan besh yilgacha va undan ko'proq: tadbir uchun kunlik yoki ob'ekt uchun oylar va yillarga.",
      },
    },
    {
      q: {
        ru: "Что входит в аренду раций?",
        en: "What comes with a rental?",
        uz: "Ratsiya ijarasiga nima kiradi?",
      },
      a: {
        ru: "Рации Motorola с полным комплектом аксессуаров, запасные аккумуляторы и настройка: рации приходят готовыми к работе.",
        en: "Motorola radios with the full set of accessories, spare batteries and setup: the radios arrive ready to work.",
        uz: "To'liq aksessuarli Motorola ratsiyalari, zaxira akkumulyatorlar va sozlash: ratsiyalar ishga tayyor holda keladi.",
      },
    },
    {
      q: {
        ru: "Работают ли арендованные рации за пределами Ташкента?",
        en: "Do rented radios work outside Tashkent?",
        uz: "Ijaradagi ratsiyalar Toshkentdan tashqarida ishlaydimi?",
      },
      a: {
        ru: "Да. Мы настраиваем их на собственные частоты Radiocom, которые работают по всей республике.",
        en: "Yes. We set them to Radiocom's own frequencies, which work across the whole country.",
        uz: "Ha. Ularni butun respublikada ishlaydigan Radiocom'ning o'z chastotalariga sozlaymiz.",
      },
    },
    {
      q: {
        ru: "Сколько стоит аренда рации в сутки?",
        en: "How much is a radio per day?",
        uz: "Ratsiya ijarasi kuniga qancha turadi?",
      },
      a: {
        ru: "Цена зависит от количества раций, срока и комплекта, поэтому мы считаем её под вашу задачу. Оставьте заявку — ответим с расчётом.",
        en: "It depends on the number of radios, the term and the set, so we price it for your job. Leave a request and we will reply with a quote.",
        uz: "Narx ratsiyalar soni, muddat va to'plamga bog'liq, shuning uchun uni vazifangizga qarab hisoblaymiz. Ariza qoldiring — hisob-kitob bilan javob beramiz.",
      },
    },
  ],
};

export default copy;
