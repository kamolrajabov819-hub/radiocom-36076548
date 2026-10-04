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
  outcomes: [
    {
      n: {
        ru: "7400",
        en: "7,400",
        uz: "7400",
      },
      u: {
        ru: "м²",
        en: "m²",
        uz: "m²",
      },
      l: {
        ru: "Покрытие до 6 этажей — Motorola CLP 446 и CLK 446",
        en: "Up to 6 floors of coverage — Motorola CLP 446 and CLK 446",
        uz: "6 qavatgacha qamrov — Motorola CLP 446 va CLK 446",
      },
    },
    {
      n: {
        ru: "68",
        en: "68",
        uz: "68",
      },
      u: {
        ru: "г",
        en: "g",
        uz: "g",
      },
      l: {
        ru: "Вес рации: незаметна под формой, гарнитура в комплекте",
        en: "Radio weight: invisible under a uniform, headset in the box",
        uz: "Ratsiya vazni: forma ostida bilinmaydi, garnitura komplektda",
      },
    },
    {
      n: {
        ru: "0,5",
        en: "0.5",
        uz: "0,5",
      },
      u: {
        ru: "Вт",
        en: "W",
        uz: "Vt",
      },
      l: {
        ru: "Свободный диапазон 446 МГц — разрешение не нужно",
        en: "The free 446 MHz band — no permit needed",
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
  ],
};

export default content;
