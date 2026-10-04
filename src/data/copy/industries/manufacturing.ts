/** The manufacturing industry page body. See `industries-content.ts` for why this is a module of its own. */
import type { IndustryContent } from "@/data/industries-content";

const content: IndustryContent = {
  problem: {
    ru: "Смены на разных участках, шум, необходимость быстрой координации бригадиров.",
    en: "Shifts across many zones, industrial noise, foremen need instant coordination.",
    uz: "Turli uchastkalardagi smenalar, sanoat shovqini, brigadirlar tezkor koordinatsiyaga muhtoj.",
  },
  solution: {
    ru: "Цифровые рации с ретранслятором: слышно всех сразу, в любом углу территории. Плюс складские терминалы со сканером — для учёта.",
    en: "Digital radios with a repeater: everyone hears everyone, anywhere on the site. Plus warehouse terminals with a scanner for stock-keeping.",
    uz: "Retranslyatorli raqamli ratsiyalar: hududning istalgan burchagida hamma bir vaqtda eshitadi. Ustiga hisob uchun skanerli ombor terminallari.",
  },
  pains: [
    {
      ru: "Бригадиры не слышат друг друга через шум цеха",
      en: "Foremen can’t hear each other over machine noise",
      uz: "Brigadirlar sex shovqinida bir-birini eshitmaydi",
    },
    {
      ru: "Кладовщики бегают с бумагой между стеллажами",
      en: "Store staff run between the racks with paper",
      uz: "Omborchilar javonlar orasida qog'oz bilan yugurishadi",
    },
    {
      ru: "Смена не знает, что случилось на другом участке",
      en: "Shift doesn’t know what happened at another zone",
      uz: "Smena boshqa uchastkada nima bo'lganini bilmaydi",
    },
  ],
  outcomes: [
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
        // Named models, not "the RCD PRO range": RCD-40's sheet does not say DMR.
        ru: "Цифровая связь без помех — RCD-50, RCD-60 и RCD-70 PRO",
        en: "Digital voice without interference — RCD-50, RCD-60 and RCD-70 PRO",
        uz: "Xalaqitsiz raqamli aloqa — RCD-50, RCD-60 va RCD-70 PRO",
      },
    },
    {
      n: {
        ru: "до 2,5",
        en: "up to 2.5",
        uz: "2,5 km gacha",
      },
      u: {
        ru: "км",
        en: "km",
        uz: "",
      },
      l: {
        ru: "В цехах и на территории — RCD-50 и RCD-60 PRO",
        en: "Across shop floors and yards — RCD-50 and RCD-60 PRO",
        uz: "Sexlarda va hududda — RCD-50 va RCD-60 PRO",
      },
    },
    {
      n: {
        ru: "0",
        en: "0",
        uz: "0",
      },
      u: {
        ru: "сум/мин",
        en: "UZS/min",
        uz: "so'm/daq",
      },
      l: {
        ru: "Своя частота: связь без абонплаты и трафика",
        en: "Your own frequency: no subscription, no traffic charges",
        uz: "O'z chastotangiz: abonent to'lovi va trafiksiz",
      },
    },
  ],
  quote: {
    ru: "Наладили рации и складские терминалы за неделю. Кладовщики перестали ходить с блокнотами, комплектация ускорилась почти вдвое.",
    en: "The radios and the warehouse terminals were running in a week. The store staff stopped walking around with notebooks and picking got almost twice as fast.",
    uz: "Ratsiyalar va ombor terminallarini bir haftada yo'lga qo'ydik. Omborchilar bloknot bilan yurishni bas qildi, yig'ish deyarli ikki barobar tezlashdi.",
  },
  quoteAuthor: {
    ru: "Директор по операциям, производство упаковки",
    en: "Ops director, packaging plant",
    uz: "Operatsion direktor, qadoqlash zavodi",
  },
  faq: [
    {
      q: {
        ru: "Работают ли рации в шумном цеху?",
        en: "Do radios work in noisy shops?",
        uz: "Shovqinli sexda ishlaydimi?",
      },
      a: {
        ru: "Да. Шумоподавление убирает фон — слышно даже при 100 дБ в цеху.",
        en: "Yes. Noise cancelling strips out the background — you can hear at 100 dB on the shop floor.",
        uz: "Ha. Shovqinni bostirish fonni olib tashlaydi — sexda 100 dB da ham eshitiladi.",
      },
    },
    {
      q: {
        ru: "Складские терминалы работают с 1С?",
        en: "Do the warehouse terminals work with 1C?",
        uz: "Ombor terminallari 1C bilan ishlaydimi?",
      },
      a: {
        ru: "Да. Есть готовые связки, а при необходимости дописываем под ваш учёт.",
        en: "Yes. There are ready-made integrations, and we write to fit your own stock system where needed.",
        uz: "Ha. Tayyor bog'lanishlar bor, kerak bo'lsa sizning hisobingizga moslab yozamiz.",
      },
    },
    {
      q: {
        ru: "Как быстро развернёте систему?",
        en: "How fast can you deploy?",
        uz: "Qancha vaqtda o'rnatasiz?",
      },
      a: {
        ru: "От 2 до 7 дней в зависимости от размера производства.",
        en: "2 to 7 days depending on plant size.",
        uz: "Ishlab chiqarish hajmiga qarab 2 dan 7 kungacha.",
      },
    },
  ],
};

export default content;
