/** The transport industry page body. See `industries-content.ts` for why this is a module of its own. */
import type { IndustryContent } from "@/data/industries-content";

const content: IndustryContent = {
  problem: {
    ru: "Диспетчеру не хватает связи с водителями за пределами города. Мобильная связь дорогая и рвётся.",
    en: "The dispatcher loses drivers outside the city. Cellular is expensive and drops.",
    uz: "Dispetcher haydovchilarni shahar tashqarisida yo'qotadi. Mobil aloqa qimmat va uziladi.",
  },
  solution: {
    ru: "В машины — рации Radiocom RCD. За городом — PoC-рации: они работают через мобильную сеть, поэтому связь есть по всей стране.",
    en: "Radiocom RCD radios in the vehicles. Out of town — PoC radios: they run over the mobile network, so you have coverage across the whole country.",
    uz: "Mashinalarga — Radiocom RCD ratsiyalari. Shahardan tashqarida — PoC ratsiyalari: ular mobil tarmoq orqali ishlaydi, shuning uchun aloqa butun mamlakat bo'ylab bor.",
  },
  pains: [
    {
      ru: "Водитель в Бухаре — диспетчер в Ташкенте не может связаться",
      en: "Driver in Bukhara — Tashkent dispatch can’t reach",
      uz: "Haydovchi Buxoroda — Toshkentdagi dispetcher aloqasiz",
    },
    {
      ru: "Мобильные тарифы съедают маржу перевозки",
      en: "Cellular tariffs eat freight margin",
      uz: "Mobil tariflar tashish marjasini yeb qo'yadi",
    },
    {
      ru: "Групповая связь колонны — только по громкой связи телефонов",
      en: "Convoy comms via phone speakerphone only",
      uz: "Kolonna bilan guruh aloqasi faqat telefon karnayi orqali",
    },
  ],
  outcomes: [
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
        ru: "Диспетчер видит экипаж на карте — RCD-70 PRO",
        en: "The dispatcher sees the crew on a map — RCD-70 PRO",
        uz: "Dispetcher ekipajni xaritada ko'radi — RCD-70 PRO",
      },
    },
    {
      n: {
        ru: "до 10",
        en: "up to 10",
        uz: "10 km gacha",
      },
      u: {
        ru: "км",
        en: "km",
        uz: "",
      },
      l: {
        ru: "На трассе и открытой местности — RCD-70, RCD-60 и RCD-50 PRO",
        en: "On the road and in open ground — RCD-70, RCD-60 and RCD-50 PRO",
        uz: "Trassada va ochiq joyda — RCD-70, RCD-60 va RCD-50 PRO",
      },
    },
    {
      n: {
        ru: "3600",
        en: "3,600",
        uz: "3600",
      },
      u: {
        ru: "мА·ч",
        en: "mAh",
        uz: "mA·soat",
      },
      l: {
        ru: "Смена за рулём без подзарядки — RCD-70 и RCD-50 PRO",
        en: "A shift behind the wheel without recharging — RCD-70 and RCD-50 PRO",
        uz: "Rul ortida smena — quvvatlashsiz — RCD-70 va RCD-50 PRO",
      },
    },
  ],
  quote: {
    ru: "Перевели весь автопарк на связь через мобильную сеть — платим за связь на 40% меньше, а диспетчер видит всех водителей на карте.",
    en: "We moved the whole fleet onto radios that work over the mobile network — we pay 40% less for communications, and the dispatcher sees every driver on a map.",
    uz: "Butun avtoparkni mobil tarmoq orqali aloqaga o'tkazdik — aloqa uchun 40% kam to'laymiz, dispetcher esa barcha haydovchilarni xaritada ko'radi.",
  },
  quoteAuthor: {
    ru: "Начальник автопарка, логистическая компания",
    en: "Fleet manager, logistics operator",
    uz: "Avtopark boshlig'i, logistika kompaniyasi",
  },
  faq: [
    {
      q: {
        ru: "Будет ли связь на трассе и в горах?",
        en: "Will there be coverage on the highway and in the mountains?",
        uz: "Trassada va tog'larda aloqa bo'ladimi?",
      },
      a: {
        ru: "Там, где ловит мобильная сеть, — да. Покрытие на вашем маршруте лучше уточнить у своего оператора.",
        en: "Wherever the mobile network reaches, yes. For a specific route, check the coverage with your own operator.",
        uz: "Mobil tarmoq tutadigan joyda — ha. Aniq marshrut bo'yicha qamrovni o'z operatoringizdan aniqlang.",
      },
    },
    {
      q: {
        ru: "Сколько стоит абонплата?",
        en: "What’s the monthly cost?",
        uz: "Oylik to'lov qancha?",
      },
      a: {
        ru: "От 45 000 сум/мес за устройство при пакете от 10 шт.",
        en: "From 45,000 UZS/device on a 10-unit pack.",
        uz: "10 dan boshlab paketda 45 000 so'm/oy dan boshlab.",
      },
    },
    {
      q: {
        ru: "Можно совместить с обычными рациями?",
        en: "Can we combine them with normal radios?",
        uz: "Oddiy ratsiyalar bilan birlashtirish mumkinmi?",
      },
      a: {
        ru: "Да. В диспетчерской ставится шлюз, и обе связи работают в одном канале.",
        en: "Yes. A gateway goes in the dispatch room and both kinds of radio share one channel.",
        uz: "Ha. Dispetcherlik xonasiga shlyuz o'rnatiladi va ikkala aloqa bitta kanalda ishlaydi.",
      },
    },
    {
      q: {
        ru: "Какая рация нужна водителю?",
        en: "Which radio does a driver need?",
        uz: "Haydovchiga qaysi ratsiya kerak?",
      },
      a: {
        ru: "В пределах города и терминала — цифровая рация Radiocom RCD, например RCD-70 PRO с GPS. Для рейсов между городами — PoC-рация, которая работает через мобильную сеть.",
        en: "Within the city and the terminal, a digital Radiocom RCD — the RCD-70 PRO with GPS, for example. For runs between cities, a PoC radio that works over the mobile network.",
        uz: "Shahar va terminal ichida — raqamli Radiocom RCD ratsiyasi, masalan GPS'li RCD-70 PRO. Shaharlararo reyslar uchun — mobil tarmoq orqali ishlaydigan PoC ratsiya.",
      },
    },
    {
      q: {
        ru: "Как связаться с водителем в другом городе?",
        en: "How do I reach a driver in another city?",
        uz: "Boshqa shahardagi haydovchi bilan qanday bog'lanish mumkin?",
      },
      a: {
        ru: "Через PoC-рацию: она передаёт голос по мобильной сети, поэтому расстояние не ограничено — связь есть там, где ловит телефон.",
        en: "With a PoC radio: it carries voice over the mobile network, so distance is no limit — it works wherever a phone has signal.",
        uz: "PoC ratsiya orqali: u ovozni mobil tarmoq orqali uzatadi, shuning uchun masofa cheklanmagan — telefon tutgan joyda aloqa bor.",
      },
    },
  ],
  sections: [
    {
      heading: {
        ru: "Рации для логистики и автопарка",
        en: "Radios for logistics and fleets",
        uz: "Logistika va avtopark uchun ratsiyalar",
      },
      body: [
        {
          ru: "Диспетчеру нужно знать, где машина, и говорить с водителем без звонков. На площадке терминала и в городе с этим справляются цифровые рации Radiocom: у RCD-70 PRO есть GPS, и экипаж видно на карте, а RCD-70, RCD-60 и RCD-50 PRO берут {{rcMaxOpen}} на открытой трассе.",
          en: "A dispatcher needs to know where each vehicle is and to talk to its driver without phoning. In the terminal yard and in town, digital Radiocom radios handle it: the RCD-70 PRO has GPS, so the crew shows on a map, and the RCD-70, RCD-60 and RCD-50 PRO reach {{rcMaxOpen}} on an open road.",
          uz: "Dispetcherga mashina qayerdaligini bilish va haydovchi bilan qo'ng'iroqsiz gaplashish kerak. Terminal maydonida va shaharda buni raqamli Radiocom ratsiyalari uddalaydi: RCD-70 PRO'da GPS bor, ekipaj xaritada ko'rinadi, RCD-70, RCD-60 va RCD-50 PRO esa ochiq yo'lda {{rcMaxOpen}} ishlaydi.",
        },
        {
          ru: "Между городами дальности обычной рации не хватит. Там работают [PoC-рации](/poc): они говорят через мобильную сеть, поэтому водитель на связи везде, где ловит телефон.",
          en: "Between cities a conventional radio runs out of range. That is the job for [PoC radios](/poc): they talk over the mobile network, so the driver is reachable anywhere a phone has signal.",
          uz: "Shaharlar orasida oddiy ratsiyaning masofasi yetmaydi. U yerda [PoC ratsiyalar](/poc) ishlaydi: ular mobil tarmoq orqali gaplashadi, shuning uchun haydovchi telefon tutgan hamma joyda aloqada bo'ladi.",
        },
      ],
    },
    {
      heading: {
        ru: "Рации для водителей и диспетчерской",
        en: "Radios for drivers and the dispatch room",
        uz: "Haydovchilar va dispetcherlik uchun ratsiyalar",
      },
      body: [
        {
          ru: "Водителю нужна рация, которой можно пользоваться одной кнопкой, не отвлекаясь от дороги, а диспетчеру — общий вызов на всех и группы по маршрутам: у цифровых RCD есть индивидуальные, групповые и общие вызовы. Подбор под ваш автопарк начинается с бесплатного теста на маршруте.",
          en: "A driver needs a radio that works with one button, without taking their eyes off the road; a dispatcher needs an all-call and groups per route — the digital RCD radios make individual, group and all-call calls. A choice for your fleet starts with a free trial on the route.",
          uz: "Haydovchiga yo'ldan chalg'imay bitta tugma bilan ishlatiladigan ratsiya, dispetcherga esa hammaga umumiy chaqiruv va marshrutlar bo'yicha guruhlar kerak: raqamli RCD ratsiyalarida yakka, guruhli va umumiy chaqiruvlar bor. Avtoparkingiz uchun tanlov marshrutdagi bepul sinovdan boshlanadi.",
        },
      ],
    },
  ],
};

export default content;
