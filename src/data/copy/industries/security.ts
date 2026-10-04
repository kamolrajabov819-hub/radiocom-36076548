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
    {
      q: {
        ru: "Какую гарнитуру выбрать охраннику?",
        en: "Which earpiece should a guard use?",
        uz: "Qo'riqchiga qaysi garnitura kerak?",
      },
      a: {
        ru: "Ту, что подходит к разъёму рации и к форме: у RCD-70 PRO разъём Motorola M5, у RCD-60 PRO — Motorola 2-pin. Подберём гарнитуру на бесплатном тесте.",
        en: "One that fits the radio's connector and the uniform: the RCD-70 PRO takes a Motorola M5 connector, the RCD-60 PRO a Motorola 2-pin. We will match one during the free trial.",
        uz: "Ratsiya ulagichiga va formaga mos keladiganini: RCD-70 PRO'da Motorola M5, RCD-60 PRO'da esa Motorola 2-pin ulagichi bor. Garniturani bepul sinovda tanlab beramiz.",
      },
    },
    {
      q: {
        ru: "Есть ли функция «работа в одиночку»?",
        en: "Is there a lone worker mode?",
        uz: "Yolg'iz ishlash rejimi bormi?",
      },
      a: {
        ru: "Да, у {{rcDmr}}. Этот режим нужен, когда охранник обходит территорию один.",
        en: "Yes, on the {{rcDmr}}. It is there for a guard who patrols the grounds alone.",
        uz: "Ha, {{rcDmr}} modellarida bor. Bu rejim qo'riqchi hududni yolg'iz aylanib chiqqanda kerak.",
      },
    },
  ],
  sections: [
    {
      heading: {
        ru: "Рации для охраны объектов",
        en: "Radios for site security",
        uz: "Ob'ektlarni qo'riqlash uchun ratsiyalar",
      },
      body: [
        {
          ru: "Охране нужна связь, которую не слышат посторонние. У {{rcAes}} переговоры шифруются по AES-256, а у RCD-70 PRO есть GPS — диспетчер видит, где стоит каждый пост. Для обхода территории в одиночку у {{rcDmr}} есть режим работы в одиночку.",
          en: "Security needs radio that outsiders cannot hear. The {{rcAes}} encrypt calls with AES-256, and the RCD-70 PRO adds GPS, so the dispatcher sees where every post is. For patrolling alone, the {{rcDmr}} have a lone worker mode.",
          uz: "Qo'riqlash xizmatiga begonalar eshitmaydigan aloqa kerak. {{rcAes}} suhbatlarni AES-256 bilan shifrlaydi, RCD-70 PRO'da esa GPS bor — dispetcher har bir post qayerdaligini ko'radi. Hududni yolg'iz aylanib chiqish uchun {{rcDmr}} modellarida yolg'iz ishlash rejimi bor.",
        },
        {
          ru: "В торговом центре, банке или офисе, где охрана работает среди посетителей, нужна компактная рация со скрытой гарнитурой. Гарнитуру подбираем к разъёму рации и к форме на бесплатном тесте.",
          en: "In a shopping centre, a bank or an office, where guards work among the public, you want a compact radio with a concealed earpiece. We match the earpiece to the radio's connector and to the uniform during the free trial.",
          uz: "Savdo markazi, bank yoki ofisda qo'riqchilar tashrif buyuruvchilar orasida ishlaydi, shuning uchun yashirin garniturali ixcham ratsiya kerak. Garniturani bepul sinovda ratsiya ulagichi va formaga mos qilib tanlaymiz.",
        },
      ],
    },
    {
      heading: {
        ru: "Рации для службы безопасности: какую выбрать",
        en: "Radios for a security service: which to choose",
        uz: "Xavfsizlik xizmati uchun ratsiya: qaysi birini tanlash",
      },
      body: [
        {
          ru: "В городской застройке главный вопрос — дальность: RCD-70 PRO берёт {{rcMaxCity}}. Для постов внутри одного здания хватит и Motorola XT420 из нашего подбора. Все модели Radiocom с шифрованием и GPS — на странице [рации Radiocom](/radiocom).",
          en: "Among city buildings the first question is range: the RCD-70 PRO reaches {{rcMaxCity}}. For posts inside a single building, the Motorola XT420 from our shortlist is enough. Every Radiocom model with encryption and GPS is on the [Radiocom radios](/radiocom) page.",
          uz: "Shahar binolari orasida asosiy savol — masofa: RCD-70 PRO {{rcMaxCity}} ishlaydi. Bitta bino ichidagi postlar uchun tanlovimizdagi Motorola XT420 ham yetarli. Shifrlash va GPS'li barcha Radiocom modellari [Radiocom ratsiyalari](/radiocom) sahifasida.",
        },
      ],
    },
  ],
};

export default content;
