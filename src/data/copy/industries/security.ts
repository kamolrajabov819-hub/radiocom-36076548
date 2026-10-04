/** The security industry page body. See `industries-content.ts` for why this is a module of its own. */
import type { IndustryContent } from "@/data/industries-content";

const content: IndustryContent = {
  problem: {
    ru: "Нужна связь, которую не подслушают, с тревожной кнопкой и картой, где видно каждый пост.",
    en: "You need a channel nobody can listen in on, an alarm button, and a map showing every post.",
    uz: "Tinglab bo'lmaydigan aloqa, trevoga tugmasi va har bir postni ko'rsatadigan xarita kerak.",
  },
  solution: {
    ru: "Цифровые рации с шифрованием, тревожной кнопкой и GPS. Диспетчер видит все посты на карте.",
    en: "Digital radios with encryption, an alarm button and GPS. The dispatcher sees every post on a map.",
    uz: "Shifrlash, trevoga tugmasi va GPS'li raqamli ratsiyalar. Dispetcher barcha postlarni xaritada ko'radi.",
  },
  pains: [
    {
      ru: "Смены пропадают с радаров — никто не знает где сотрудник",
      en: "Officers go off the radar — nobody knows where",
      uz: "Xodimlar radardan yo'qoladi — hech kim qayerdaligini bilmaydi",
    },
    {
      ru: "Разговоры прослушиваются на открытых частотах",
      en: "Open frequencies can be scanned by anyone",
      uz: "Ochiq chastotalarni har kim eshitishi mumkin",
    },
    {
      ru: "Тревогу поднимают по телефону — уходит 30–90 секунд",
      en: "The alarm goes up by phone — that costs 30 to 90 seconds",
      uz: "Trevoga telefon orqali ko'tariladi — 30–90 soniya ketadi",
    },
  ],
  outcomes: [
    {
      n: {
        ru: "AES-256",
        en: "AES-256",
        uz: "AES-256",
      },
      u: {
        ru: "",
        en: "",
        uz: "",
      },
      l: {
        ru: "Разговор слышат только свои — RCD-50, RCD-60 и RCD-70 PRO",
        en: "Only your own team hears you — RCD-50, RCD-60 and RCD-70 PRO",
        uz: "Suhbatni faqat o'zingiznikilar eshitadi — RCD-50, RCD-60 va RCD-70 PRO",
      },
    },
    {
      n: {
        ru: "GPS",
        en: "GPS",
        uz: "GPS",
      },
      u: {
        ru: "",
        en: "",
        uz: "",
      },
      l: {
        ru: "Видно, где стоит пост — RCD-70 PRO",
        en: "You can see where each post is — RCD-70 PRO",
        uz: "Post qayerda turgani ko'rinadi — RCD-70 PRO",
      },
    },
    {
      n: {
        ru: "до 3",
        en: "up to 3",
        uz: "3 km gacha",
      },
      u: {
        ru: "км",
        en: "km",
        uz: "",
      },
      l: {
        ru: "В плотной городской застройке — RCD-70 PRO",
        en: "In dense urban blocks — RCD-70 PRO",
        uz: "Zich shahar qurilishida — RCD-70 PRO",
      },
    },
  ],
  quote: {
    ru: "Ставим DMR с шифрованием на все объекты. Диспетчер видит смену на карте, а тревожная кнопка реально спасает — проверено дважды.",
    en: "We standardized on encrypted DMR across all our sites. Dispatch sees every officer, and the panic button has already saved us twice.",
    uz: "Barcha ob'ektlarga shifrlangan DMR o'rnatdik. Dispetcher xodimlarni ko'radi, tugma ikki marta yordam berdi.",
  },
  quoteAuthor: {
    ru: "Директор ЧОП, Ташкент",
    en: "Director, private security firm",
    uz: "Xususiy qo'riqlash direktori",
  },
  faq: [
    {
      q: {
        ru: "Могут ли нас подслушать?",
        en: "Can anyone listen in on us?",
        uz: "Bizni tinglashlari mumkinmi?",
      },
      a: {
        ru: "Практически нет: в цифровом режиме разговор шифруется, а ключ можно менять из программы.",
        en: "Practically not: in digital mode the conversation is encrypted, and the key can be changed from software.",
        uz: "Deyarli yo'q: raqamli rejimda suhbat shifrlanadi, kalitni esa dasturdan o'zgartirish mumkin.",
      },
    },
    {
      q: {
        ru: "Работает ли GPS внутри здания?",
        en: "Does GPS work inside a building?",
        uz: "GPS bino ichida ishlaydimi?",
      },
      a: {
        ru: "На улице — да. В помещении рация показывает последнюю точку, где она поймала сигнал.",
        en: "Outdoors, yes. Indoors the radio shows the last point where it had a signal.",
        uz: "Ko'chada — ha. Bino ichida ratsiya signalni oxirgi marta tutgan nuqtani ko'rsatadi.",
      },
    },
    {
      q: {
        ru: "Куда уходит сигнал с тревожной кнопки?",
        en: "Where does the alarm button send its signal?",
        uz: "Trevoga tugmasi signalni qayerga yuboradi?",
      },
      a: {
        ru: "Всем, кто на канале, и диспетчеру — вместе с координатами поста.",
        en: "To everyone on the channel and to the dispatcher, together with the post's coordinates.",
        uz: "Kanaldagi barchaga va dispetcherga — post koordinatalari bilan birga.",
      },
    },
  ],
};

export default content;
