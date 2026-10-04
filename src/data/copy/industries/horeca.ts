/** The horeca industry page body. See `industries-content.ts` for why this is a module of its own. */
import type { IndustryContent } from "@/data/industries-content";

const content: IndustryContent = {
  problem: {
    ru: "Персонал теряет связь в шумных залах и между этажами. Гости слышат переговоры.",
    en: "Staff loses contact across noisy floors and between levels. Guests overhear crew chatter.",
    uz: "Xodimlar shovqinli zallarda va qavatlar orasida aloqani yo'qotadi. Mehmonlar xizmat suhbatlarini eshitadi.",
  },
  solution: {
    ru: "Маленькие рации и скрытые гарнитуры. Слышит только персонал, а разрешение на частоту не нужно.",
    en: "Small radios and concealed earpieces. Only the staff hear it, and no frequency permit is needed.",
    uz: "Kichik ratsiyalar va yashirin garnituralar. Faqat xodimlar eshitadi, chastota ruxsatnomasi kerak emas.",
  },
  pains: [
    {
      ru: "Официанты не слышат кухню в час пик",
      en: "Waiters can’t hear the kitchen at peak hours",
      uz: "Ofitsiantlar cho'qqi vaqtlarida oshxonani eshitmaydi",
    },
    {
      ru: "Клиенты слышат внутренние переговоры персонала",
      en: "Guests overhear internal staff chatter",
      uz: "Mijozlar xodimlar suhbatini eshitib qoladi",
    },
    {
      ru: "Обычные телефоны разряжаются за полсмены",
      en: "Regular phones die halfway through a shift",
      uz: "Oddiy telefonlar smenaning yarmida o'chadi",
    },
  ],
  // Figures from the Motorola XT185 sheet (specs.ts), a model the page
  // recommends. The page used to lead on 7 400 m² and 68 g, both from the CLP
  // and CLK 446, which are hidden in the catalogue for want of a photograph.
  outcomes: [
    {
      n: { ru: "24", en: "24", uz: "24" },
      u: { ru: "ч", en: "h", uz: "soat" },
      l: {
        ru: "До 24 часов на одном заряде — Motorola XT185",
        en: "Up to 24 hours on a single charge — Motorola XT185",
        uz: "Bir zaryadda 24 soatgacha ishlaydi — Motorola XT185",
      },
    },
    {
      n: { ru: "2", en: "2", uz: "2" },
      u: { ru: "гарнитуры", en: "earpieces", uz: "garnitura" },
      l: {
        ru: "С кнопкой PTT, в комплекте Motorola XT185: гости переговоров не слышат",
        en: "With a PTT button, in the Motorola XT185 box: guests don't hear the crew",
        uz: "PTT tugmali, Motorola XT185 komplektida: mehmonlar suhbatni eshitmaydi",
      },
    },
    {
      n: { ru: "0,5", en: "0.5", uz: "0,5" },
      u: { ru: "Вт", en: "W", uz: "Vt" },
      l: {
        ru: "Свободный диапазон 446 МГц — разрешение не нужно",
        en: "The licence-free 446 MHz band — no permit needed",
        uz: "Erkin 446 MGts diapazoni — ruxsatnoma kerak emas",
      },
    },
  ],
  quote: {
    ru: "Гости больше не слышат, что происходит на кухне. Смена стала спокойнее, а средний чек вырос — команда быстрее закрывает столы.",
    en: "Guests no longer hear what’s happening in the kitchen. Shifts got calmer and turnover went up — the team clears tables faster.",
    uz: "Mijozlar endi oshxonadagi gaplarni eshitmaydi. Smena tinchroq bo'ldi, tushum ko'paydi — jamoa stollarni tezroq bo'shatadi.",
  },
  quoteAuthor: {
    ru: "Управляющий сетью ресторанов, Ташкент",
    en: "Restaurant group operator, Tashkent",
    uz: "Restoran tarmog'i menejeri, Toshkent",
  },
  faq: [
    {
      q: {
        ru: "Нужно ли разрешение на частоту?",
        en: "Do we need a frequency permit?",
        uz: "Chastota uchun ruxsatnoma kerakmi?",
      },
      a: {
        ru: "Нет. Эти рации работают на свободном диапазоне 446 МГц — оформлять ничего не нужно.",
        en: "No. These radios work on the free 446 MHz band, so there is nothing to register.",
        uz: "Yo'q. Bu ratsiyalar erkin 446 MGts diapazonida ishlaydi — hech narsa rasmiylashtirish shart emas.",
      },
    },
    {
      q: {
        ru: "Сколько раций нужно для ресторана?",
        en: "How many radios for a restaurant?",
        uz: "Restoranga nechta ratsiya kerak?",
      },
      a: {
        ru: "Обычно 4–6 штук: хостес, менеджер зала, шеф, бариста, официант и склад. Приедем и посчитаем бесплатно.",
        en: "Usually four to six: the host, the floor manager, the chef, the barista, a waiter and the store room. We will come out and count for free.",
        uz: "Odatda 4–6 ta: xostes, zal menejeri, oshpaz, barista, ofitsiant va ombor. Kelib bepul hisoblab beramiz.",
      },
    },
    {
      q: {
        ru: "Можно попробовать до покупки?",
        en: "Can I try before I buy?",
        uz: "Sotib olishdan oldin sinab ko'rish mumkinmi?",
      },
      a: {
        ru: "Да, бесплатный тест на вашем объекте.",
        en: "Yes — free test on your site.",
        uz: "Ha — ob'ektingizda bepul sinov.",
      },
    },
    {
      q: {
        ru: "Будут ли гости слышать рации?",
        en: "Will guests hear the radios?",
        uz: "Mehmonlar ratsiyalarni eshitadimi?",
      },
      a: {
        ru: "Нет, если персонал работает с гарнитурами: звук идёт только в ухо сотруднику. Гарнитуры есть в комплекте Motorola XT185 и Radiocom RC-20.",
        en: "Not if the staff wear earpieces: the sound goes only to the wearer's ear. Earpieces come in the box with the Motorola XT185 and the Radiocom RC-20.",
        uz: "Yo'q, agar xodimlar garnitura bilan ishlasa: ovoz faqat xodimning qulog'iga boradi. Garnituralar Motorola XT185 va Radiocom RC-20 komplektida bor.",
      },
    },
    {
      q: {
        ru: "Хватит ли дальности на весь отель?",
        en: "Will the range cover the whole hotel?",
        uz: "Masofa butun mehmonxonaga yetadimi?",
      },
      a: {
        ru: "Это зависит от здания: этажи и бетон гасят сигнал. Мы привозим рации на бесплатный тест и до покупки проверяем связь на всех этажах.",
        en: "That depends on the building: floors and concrete absorb the signal. We bring radios for a free trial and check the signal on every floor before you buy.",
        uz: "Bu binoga bog'liq: qavatlar va beton signalni so'ndiradi. Ratsiyalarni bepul sinovga olib boramiz va sotib olishdan oldin aloqani barcha qavatlarda tekshiramiz.",
      },
    },
  ],
  sections: [
    {
      heading: {
        ru: "Рации для ресторана и кафе",
        en: "Radios for restaurants and cafés",
        uz: "Restoran va kafe uchun ratsiyalar",
      },
      body: [
        {
          ru: "В зале рация должна быть незаметной для гостей, а на кухне — слышной в шуме. Поэтому официантам, хостес и шефу дают компактные рации с гарнитурой: Motorola XT185 продаётся парой с двумя гарнитурами с кнопкой PTT, Radiocom RC-20 и RC-10 — тоже парой, с гарнитурами в коробке.",
          en: "On the floor a radio should go unnoticed by guests; in the kitchen it has to be heard over the noise. So waiters, hosts and the chef get compact radios with earpieces: the Motorola XT185 comes as a pair with two PTT earpieces, and the Radiocom RC-20 and RC-10 also come as pairs with earpieces in the box.",
          uz: "Zalda ratsiya mehmonlarga sezilmasligi, oshxonada esa shovqinda eshitilishi kerak. Shuning uchun ofitsiantlar, xostes va oshpazga garniturali ixcham ratsiyalar beriladi: Motorola XT185 ikkita PTT tugmali garnitura bilan juft bo'lib sotiladi, Radiocom RC-20 va RC-10 ham juft, qutida garniturasi bilan.",
        },
        {
          ru: "Эти рации работают в свободном диапазоне 446 МГц: разрешение на частоту не нужно, абонентской платы нет.",
          en: "These radios work on the free 446 MHz band: no frequency permit, and no monthly fee.",
          uz: "Bu ratsiyalar erkin 446 MGts diapazonida ishlaydi: chastota ruxsatnomasi kerak emas, oylik to'lov yo'q.",
        },
      ],
    },
    {
      heading: {
        ru: "Рации для отеля и гостиницы",
        en: "Radios for hotels",
        uz: "Mehmonxona uchun ratsiyalar",
      },
      body: [
        {
          ru: "В отеле связь нужна между ресепшн, этажами, housekeeping и техслужбой. Перекрытия ослабляют сигнал, поэтому для здания в несколько этажей мы привозим рации на бесплатный тест и проверяем связь на всех этажах. Для большого комплекса есть цифровые рации, например RCD-30 PRO — комплект из двух. Остальные модели для гостеприимства — в [сравнении раций](/compare).",
          en: "A hotel needs radio between reception, the floors, housekeeping and maintenance. Floors weaken the signal, so for a building of several storeys we bring radios out for a free trial and check the signal on every floor. A large complex can take digital radios such as the RCD-30 PRO, sold as a pair. The other models for hospitality are in the [radio comparison](/compare).",
          uz: "Mehmonxonada aloqa resepshn, qavatlar, housekeeping va texnik xizmat orasida kerak. Qavatlar signalni kuchsizlantiradi, shuning uchun bir necha qavatli bino uchun ratsiyalarni bepul sinovga olib boramiz va aloqani barcha qavatlarda tekshiramiz. Katta majmua uchun raqamli ratsiyalar ham bor, masalan juft bo'lib sotiladigan RCD-30 PRO. Mehmondo'stlik uchun boshqa modellar [ratsiyalarni solishtirish](/compare) sahifasida.",
        },
      ],
    },
  ],
};

export default content;
