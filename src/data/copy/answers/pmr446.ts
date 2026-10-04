/** The «pmr446» answer page body. See `answers-content.ts` for why each page is a module of its own. */
import type { AnswerContent } from "@/data/answers-content";

const content: AnswerContent = {
  picks: ["m-t82-extreme", "m-t82", "m-xt185", "m-tlkr-t92h2o"],
  related: ["analog-or-digital", "pmr-or-poc", "real-range"],
  cta: {
    path: "/motorola",
    anchor: { ru: "Рации Motorola", en: "Motorola radios", uz: "Motorola ratsiyalari" },
  },
  sections: [
    {
      heading: {
        ru: "Как работают безлицензионные рации",
        en: "How licence-free radios work",
        uz: "Litsenziyasiz ratsiyalar qanday ishlaydi",
      },
      body: {
        ru: "Рации PMR446 говорят напрямую друг с другом, без вышек, ретрансляторов и оператора: нажали кнопку — вас слышат все, кто на том же канале. Мощность у них небольшая, у моделей нашего каталога — 0,5 Вт, поэтому дальность зависит от местности: у Motorola T42 — до 4 км на открытом месте, у T82 и TLKR-T92 H2O — до 10 км по данным производителя, а в городе в разы меньше.",
        en: "PMR446 radios talk directly to each other, with no towers, repeaters or operator: press the button and everyone on the same channel hears you. Their power is low — 0.5 W on the models in our catalogue — so range depends on the terrain: up to 4 km in the open for the Motorola T42, up to 10 km for the T82 and TLKR-T92 H2O by the manufacturer's figures, and several times less in town.",
        uz: "PMR446 ratsiyalari minora, retranslyator va operatorsiz bir-biri bilan to'g'ridan-to'g'ri gaplashadi: tugmani bossangiz, o'sha kanaldagi hamma sizni eshitadi. Quvvati kichik — katalogimizdagi modellarda 0,5 Vt, shuning uchun masofa joyga bog'liq: Motorola T42 ochiq joyda 4 km gacha, T82 va TLKR-T92 H2O esa ishlab chiqaruvchi ma'lumotiga ko'ra 10 km gacha ishlaydi, shaharda esa bir necha baravar kam.",
      },
    },
    {
      heading: {
        ru: "Каналы и коды конфиденциальности",
        en: "Channels and privacy codes",
        uz: "Kanallar va maxfiylik kodlari",
      },
      body: {
        ru: "Talkabout T82, T62 и T42 работают на 8 каналах, T72, XT185 и XT420 — на 16. К каналу добавляется код конфиденциальности — у T82, T72 и T62 их 121: рация открывает звук только для своих, и чужие группы на том же канале вы не слышите. Но код не шифрует речь, поэтому для переговоров, которые нельзя подслушать, нужны цифровые рации с шифрованием.",
        en: "The Talkabout T82, T62 and T42 work on 8 channels; the T72, XT185 and XT420 on 16. On top of the channel goes a privacy code — the T82, T72 and T62 have 121: the radio opens its speaker only for your group, so other groups on the same channel stay silent. A code does not encrypt speech, though, so calls that must not be overheard need digital radios with encryption.",
        uz: "Talkabout T82, T62 va T42 8 ta kanalda, T72, XT185 va XT420 esa 16 ta kanalda ishlaydi. Kanalga maxfiylik kodi qo'shiladi — T82, T72 va T62'da ularning soni 121 ta: ratsiya ovozni faqat o'z guruhingiz uchun ochadi, o'sha kanaldagi begona guruhlarni eshitmaysiz. Lekin kod nutqni shifrlamaydi, shuning uchun eshitib bo'lmaydigan suhbatlar uchun shifrlashli raqamli ratsiyalar kerak.",
      },
    },
    {
      heading: {
        ru: "Кому подходят рации PMR446",
        en: "Who PMR446 radios suit",
        uz: "PMR446 ratsiyalari kimga mos",
      },
      body: {
        ru: "Безлицензионные рации — для задач, где люди работают рядом и не нужна защита переговоров: ресторан и отель, магазин и склад, мероприятие, семья, поход или рыбалка. Если смена работает на стройке, в охране или в шумном цеху, где важны дальность, защита корпуса и шифрование, смотрите цифровые рации стандарта DMR.",
        en: "Licence-free radios suit work where people are close together and calls need no protection: a restaurant or hotel, a shop or warehouse, an event, a family, a hike or a fishing trip. If the shift is on a building site, in security or on a noisy shop floor, where range, a sealed casing and encryption matter, look at digital DMR radios.",
        uz: "Litsenziyasiz ratsiyalar odamlar yaqin ishlaydigan va suhbatni himoya qilish shart bo'lmagan vazifalar uchun: restoran va mehmonxona, do'kon va ombor, tadbir, oila, sayohat yoki baliq ovi. Smena qurilishda, qo'riqlashda yoki shovqinli sexda ishlasa, ya'ni masofa, korpus himoyasi va shifrlash muhim bo'lsa, DMR standartidagi raqamli ratsiyalarni ko'ring.",
      },
    },
  ],
  faq: [
    {
      q: {
        ru: "Чем PMR446 отличается от DMR?",
        en: "How is PMR446 different from DMR?",
        uz: "PMR446 DMR'dan nimasi bilan farq qiladi?",
      },
      a: {
        ru: "PMR446 — это диапазон частот: рации Motorola из нашего каталога работают в нём в аналоговом режиме. DMR — цифровой стандарт: речь передаётся в цифре, её можно шифровать, а один канал вмещает два разговора.",
        en: "PMR446 is a frequency band: the Motorola radios in our catalogue use it in analogue mode. DMR is a digital standard: speech travels as data, it can be encrypted, and one channel carries two conversations.",
        uz: "PMR446 — chastota diapazoni: katalogimizdagi Motorola ratsiyalari unda analog rejimda ishlaydi. DMR esa raqamli standart: nutq raqamli uzatiladi, uni shifrlash mumkin, bitta kanal esa ikkita suhbatni sig'diradi.",
      },
    },
    {
      q: {
        ru: "Можно ли подслушать безлицензионную рацию?",
        en: "Can a licence-free radio be overheard?",
        uz: "Litsenziyasiz ratsiyani eshitib olish mumkinmi?",
      },
      a: {
        ru: "Да: аналоговый сигнал не шифруется, и любая рация на том же канале его примет. Код конфиденциальности скрывает чужие разговоры от вас, но не ваши — от других.",
        en: "Yes: an analogue signal is not encrypted, and any radio on the same channel will pick it up. A privacy code hides other people's calls from you, not yours from them.",
        uz: "Ha: analog signal shifrlanmaydi va o'sha kanaldagi har qanday ratsiya uni qabul qiladi. Maxfiylik kodi begona suhbatlarni sizdan yashiradi, lekin siznikini boshqalardan emas.",
      },
    },
    {
      q: {
        ru: "Какая безлицензионная рация работает дальше всех?",
        en: "Which licence-free radio has the longest range?",
        uz: "Qaysi litsenziyasiz ratsiya eng uzoqqa ishlaydi?",
      },
      a: {
        ru: "В нашем каталоге — Motorola T82, T82 Extreme и TLKR-T92 H2O: до 10 км на открытой местности по данным производителя. В городе и между этажами дальность в разы меньше.",
        en: "In our catalogue, the Motorola T82, T82 Extreme and TLKR-T92 H2O: up to 10 km in open country by the manufacturer's figures. In town and between floors the range is several times shorter.",
        uz: "Katalogimizda — Motorola T82, T82 Extreme va TLKR-T92 H2O: ishlab chiqaruvchi ma'lumotiga ko'ra ochiq joyda 10 km gacha. Shaharda va qavatlar orasida masofa bir necha baravar kam.",
      },
    },
  ],
};

export default content;
