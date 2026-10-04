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
    {
      q: {
        ru: "Работает ли рация в металлическом цехе?",
        en: "Does a radio work in a steel-framed shop?",
        uz: "Metall sexda ratsiya ishlaydimi?",
      },
      a: {
        ru: "Да, но металл сокращает дальность: стеллажи и конструкции отражают сигнал. Поэтому мы проверяем связь в вашем цехе на бесплатном тесте, а для большой территории подбираем ретранслятор.",
        en: "Yes, but metal shortens the range: racking and steelwork reflect the signal. That is why we check the signal in your own shop during a free trial, and add a repeater for a large site.",
        uz: "Ha, lekin metall masofani qisqartiradi: stellajlar va konstruksiyalar signalni qaytaradi. Shuning uchun aloqani sexingizda bepul sinovda tekshiramiz, katta hudud uchun esa retranslyator tanlaymiz.",
      },
    },
    {
      q: {
        ru: "Можно ли разделить смену по каналам?",
        en: "Can a shift be split across channels?",
        uz: "Smenani kanallarga bo'lish mumkinmi?",
      },
      a: {
        ru: "Да. Мастерам, кладовщикам и водителям погрузчиков можно дать свои каналы, а цифровые RCD поддерживают общий вызов, который слышат все.",
        en: "Yes. Supervisors, storekeepers and forklift drivers can each have their own channel, and the digital RCD radios support an all-call that everyone hears.",
        uz: "Ha. Ustalar, omborchilar va yuklagich haydovchilariga alohida kanal berish mumkin, raqamli RCD ratsiyalari esa hamma eshitadigan umumiy chaqiruvni qo'llab-quvvatlaydi.",
      },
    },
  ],
  sections: [
    {
      heading: {
        ru: "Рации для завода и цеха",
        en: "Radios for factories and shop floors",
        uz: "Zavod va sex uchun ratsiyalar",
      },
      body: [
        {
          ru: "В цеху связи мешают шум оборудования и металл: стеллажи, конструкции и станки отражают и гасят сигнал. Цифровые DMR-рации RCD-50, RCD-60 и RCD-70 PRO дают разборчивый звук без помех, у RCD-50 PRO есть подавление фонового шума, а RCD-50 и RCD-70 PRO рассчитаны на смену на одном заряде.",
          en: "On a shop floor, machine noise and metal get in the way: racking, steelwork and machines reflect and absorb the signal. The digital DMR RCD-50, RCD-60 and RCD-70 PRO deliver clear voice without interference, the RCD-50 PRO suppresses background noise, and the RCD-50 and RCD-70 PRO are built to last a shift on one charge.",
          uz: "Sexda aloqaga uskunalar shovqini va metall xalaqit beradi: stellajlar, konstruksiyalar va dastgohlar signalni qaytaradi va so'ndiradi. Raqamli DMR ratsiyalari RCD-50, RCD-60 va RCD-70 PRO xalaqitsiz aniq ovoz beradi, RCD-50 PRO fon shovqinini bosadi, RCD-50 va RCD-70 PRO esa bir zaryadda butun smenaga mo'ljallangan.",
        },
        {
          ru: "Смену на нескольких участках удобно разделить по каналам: мастера, кладовщики, водители погрузчиков — каждый на своём. У цифровых RCD есть индивидуальные, групповые и общие вызовы, поэтому срочное сообщение слышат все сразу.",
          en: "A shift spread over several areas is easiest to split by channel: supervisors, storekeepers and forklift drivers each on their own. The digital RCD radios make individual, group and all-call calls, so an urgent message reaches everyone at once.",
          uz: "Bir necha uchastkadagi smenani kanallar bo'yicha bo'lish qulay: ustalar, omborchilar, yuklagich haydovchilari — har biri o'z kanalida. Raqamli RCD ratsiyalarida yakka, guruhli va umumiy chaqiruvlar bor, shuning uchun shoshilinch xabarni hamma birdaniga eshitadi.",
        },
      ],
    },
    {
      heading: {
        ru: "Рации для склада",
        en: "Radios for warehouses",
        uz: "Ombor uchun ratsiyalar",
      },
      body: [
        {
          ru: "На складе важны лёгкость и время работы: кладовщику и водителю погрузчика подойдут Motorola XT420 или Radiocom RC-20 из нашего подбора. Рации работают на своей частоте, поэтому связь не зависит от мобильной сети и обходится без абонентской платы. Для складов при автопарке посмотрите и [рации для логистики](/industries/transport).",
          en: "In a warehouse, weight and run time matter: a storekeeper or forklift driver is well served by the Motorola XT420 or the Radiocom RC-20 from our shortlist. The radios use their own frequency, so they do not depend on the mobile network and carry no monthly fee. For a warehouse attached to a fleet, see [radios for logistics](/industries/transport) too.",
          uz: "Omborda yengillik va ish vaqti muhim: omborchi va yuklagich haydovchisiga tanlovimizdagi Motorola XT420 yoki Radiocom RC-20 mos keladi. Ratsiyalar o'z chastotasida ishlaydi, shuning uchun aloqa mobil tarmoqqa bog'liq emas va oylik to'lovsiz. Avtopark qoshidagi omborlar uchun [logistika uchun ratsiyalar](/industries/transport) sahifasini ham ko'ring.",
        },
      ],
    },
  ],
};

export default content;
