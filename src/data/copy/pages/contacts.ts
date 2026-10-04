/**
 * /contacts — «Radiocom адрес и контакты» / «Radiocom manzil va kontaktlar».
 *
 * One address everywhere (the same string as `BUSINESS.street` and the
 * footer): Мирзо-Улугбекский район, ул. Узбекистон Овози, 2, Le Grande Plaza —
 * the hotel's current name, with «Тата» beside it (owner's keyword map) —
 * floors 1–2. Hours are the README's: Monday to Friday, 9:00–18:00. The phone
 * numbers are deliberately not in this copy: the page renders them from
 * `lib/contacts.ts`, the one place `verify-contacts` allows them.
 */
import type { PageCopy } from "@/data/copy/pick";

const copy: PageCopy = {
  hero: {
    kicker: { ru: "Контакты", en: "Contacts", uz: "Kontaktlar" },
    title: {
      ru: "Адрес и контакты Radiocom",
      en: "Radiocom address and contacts",
      uz: "Radiocom manzili va kontaktlari",
    },
    sub: {
      ru: "Офис и сервисный центр в Ташкенте, в Мирзо-Улугбекском районе. Работаем с понедельника по пятницу, с 9:00 до 18:00.",
      en: "Our office and service centre are in Tashkent, in the Mirzo-Ulugbek district. Open Monday to Friday, 9:00 to 18:00.",
      uz: "Ofis va servis markazimiz Toshkentda, Mirzo Ulug'bek tumanida. Dushanbadan jumagacha, 9:00 dan 18:00 gacha ishlaymiz.",
    },
  },
  sections: [
    {
      heading: {
        ru: "Как нас найти",
        en: "How to find us",
        uz: "Bizni qanday topish mumkin",
      },
      body: [
        {
          ru: "Офис и сервисный центр Radiocom — в Мирзо-Улугбекском районе Ташкента, на улице Узбекистон Овози, 2: здание Le Grande Plaza (бывшая гостиница «Тата»), 1-й и 2-й этажи. Сюда можно приехать в рабочие часы и привезти рацию в ремонт.",
          en: "The Radiocom office and service centre are in Tashkent's Mirzo-Ulugbek district at 2 Uzbekiston Ovozi Street: the Le Grande Plaza building (formerly the Tata Hotel), 1st and 2nd floors. Come by during opening hours, or bring a radio in for repair.",
          uz: "Radiocom ofisi va servis markazi Toshkentning Mirzo Ulug'bek tumanida, O'zbekiston Ovozi ko'chasi, 2-uyda: Le Grande Plaza binosi (sobiq «Tata» mehmonxonasi), 1- va 2-qavatlar. Bu yerga ish vaqtida kelishingiz va ratsiyani ta'mirga olib kelishingiz mumkin.",
        },
      ],
    },
    {
      heading: {
        ru: "Магазин и сервис раций в Ташкенте",
        en: "Radio sales and service in Tashkent",
        uz: "Toshkentda ratsiya do'koni va servisi",
      },
      body: [
        {
          ru: "Подобрать рацию, оформить заказ, договориться о бесплатном тесте или [аренде раций](/rent) можно по телефону, в Telegram или через форму заявки. Ремонтом занимается наш [сервисный центр](/service) — у него отдельный номер. Доставка по Узбекистану бесплатная.",
          en: "To choose a radio, place an order, or arrange a free trial or [radio rental](/rent), call us, message us on Telegram or leave a request. Repairs are handled by our [service centre](/service), which has its own number. Delivery across Uzbekistan is free.",
          uz: "Ratsiya tanlash, buyurtma berish, bepul sinov yoki [ratsiya ijarasi](/rent) haqida kelishish uchun qo'ng'iroq qiling, Telegram orqali yozing yoki ariza qoldiring. Ta'mir bilan [servis markazimiz](/service) shug'ullanadi — uning alohida raqami bor. O'zbekiston bo'ylab yetkazib berish bepul.",
        },
      ],
    },
  ],
  faq: [
    {
      q: {
        ru: "Где находится Radiocom?",
        en: "Where is Radiocom?",
        uz: "Radiocom qayerda joylashgan?",
      },
      a: {
        ru: "В Ташкенте, в Мирзо-Улугбекском районе: улица Узбекистон Овози, 2, Le Grande Plaza (бывшая гостиница «Тата»), 1-й и 2-й этажи.",
        en: "In Tashkent's Mirzo-Ulugbek district: 2 Uzbekiston Ovozi Street, Le Grande Plaza (formerly the Tata Hotel), 1st and 2nd floors.",
        uz: "Toshkentda, Mirzo Ulug'bek tumanida: O'zbekiston Ovozi ko'chasi, 2, Le Grande Plaza (sobiq «Tata» mehmonxonasi), 1- va 2-qavatlar.",
      },
    },
    {
      q: {
        ru: "Какие часы работы у Radiocom?",
        en: "What are Radiocom's opening hours?",
        uz: "Radiocom'ning ish vaqti qanday?",
      },
      a: {
        ru: "С понедельника по пятницу, с 9:00 до 18:00. Суббота и воскресенье — выходные.",
        en: "Monday to Friday, 9:00 to 18:00. Closed on Saturday and Sunday.",
        uz: "Dushanbadan jumagacha, 9:00 dan 18:00 gacha. Shanba va yakshanba — dam olish kunlari.",
      },
    },
    {
      q: {
        ru: "Как связаться с сервисным центром?",
        en: "How do I reach the service centre?",
        uz: "Servis markazi bilan qanday bog'lanish mumkin?",
      },
      a: {
        ru: "У сервисного центра свой номер — он указан на этой странице, — или оставьте заявку на ремонт на странице сервиса.",
        en: "The service centre has its own number, listed on this page — or leave a repair request on the service page.",
        uz: "Servis markazining o'z raqami bor — u shu sahifada ko'rsatilgan — yoki servis sahifasida ta'mirga ariza qoldiring.",
      },
    },
  ],
};

export default copy;
