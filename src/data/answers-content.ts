/**
 * The body copy of the answers pages, keyed by slug.
 *
 * Split from `answers.ts` for a measured reason, not a stylistic one.
 *
 * `head` is the one route property TanStack cannot code-split, so every
 * `.meta.ts` module — and everything it imports — is eager for every visitor on
 * every route. When the sections, follow-up questions and steps lived alongside
 * the titles in one module, importing that module for `head` pulled the whole
 * body of all eight pages into the entry chunk, and therefore onto pages that
 * never show an answer.
 *
 * Split, this text is a 41 KB route chunk. Unsplit — reintroduced deliberately
 * and rebuilt, to check rather than assume — the entry chunk goes 611 -> 649 KB
 * and every route on the site pays 37 KB more, including the ones that have
 * nothing to do with the answers section. `qa-weight`'s baseline check is what
 * measures that, and what fails if this file ever loses its separation.
 *
 * Nothing here is imported by a `.meta.ts`. It is read only by
 * `Answers.tsx`/`AnswerDetail.tsx`, which are code-split, so this text ships
 * only to a reader who opens an answers page.
 *
 * The consequence for schema: `FAQPage` and `HowTo` need this text and cannot
 * be built in `head`. They are emitted from the page component instead, which
 * is still server-rendered, so a crawler sees them in the delivered HTML —
 * JSON-LD is valid in the body as well as the head.
 */

/** A string in all three published locales. */
type L = { ru: string; en: string; uz: string };

export type AnswerContent = {
  /** Body. One `h2` per entry. */
  sections: { heading: L; body: L }[];
  /** Follow-ups, rendered as the shared `Faq` and emitted as `FAQPage`. */
  faq: { q: L; a: L }[];
  /** Ordered steps. Only where the page is genuinely a procedure: emits `HowTo`. */
  steps?: { name: L; text: L }[];
  /** Product ids to show at the foot. Must be visible — `verify-answers` checks. */
  picks: string[];
  /** Sibling pages to link. Keeps the section crawlable as a cluster. */
  related: string[];
};

export const answerContent: Record<string, AnswerContent> = {
  "how-to-choose": {
    picks: ["rc-20", "rcd-50", "m-t82-extreme", "rcd-70"],
    related: ["real-range", "analog-or-digital", "radio-price-tashkent"],
    sections: [
      {
        heading: {
          ru: "Почему характеристики не отвечают на вопрос",
          en: "Why the spec sheet does not answer the question",
          uz: "Nega xususiyatlar bu savolga javob bermaydi",
        },
        body: {
          ru: "Дальность в характеристиках измеряется в прямой видимости при хорошей погоде — это верхняя граница, а не то, что вы получите. Две одинаковые по цифрам рации ведут себя по-разному в цеху и в гостинице. Поэтому выбор начинается с объекта, а не с таблицы.",
          en: "The range on a spec sheet is measured line-of-sight in good weather. That is the ceiling, not what you will get. Two radios with identical numbers behave differently in a machine hall and in a hotel. So the choice starts with the site, not the table.",
          uz: "Xususiyatlardagi masofa to'g'ridan-to'g'ri ko'rinishda va yaxshi ob-havoda o'lchanadi — bu yuqori chegara, siz oladigan narsa emas. Raqamlari bir xil ikkita ratsiya sexda va mehmonxonada har xil ishlaydi. Shuning uchun tanlov jadvaldan emas, ob'ektdan boshlanadi.",
        },
      },
      {
        heading: {
          ru: "Что почти никто не учитывает",
          en: "What almost nobody accounts for",
          uz: "Deyarli hech kim hisobga olmaydigan narsa",
        },
        body: {
          ru: "Аксессуары решают больше, чем кажется. Гарнитура нужна там, где шумно или где гостям не нужно слышать персонал. Запасной аккумулятор дешевле, чем вторая рация. А зарядка на несколько мест экономит место и время в конце смены.",
          en: "Accessories decide more than people expect. An earpiece is what you need where it is loud, or where guests should not hear the staff. A spare battery costs less than a second radio. And a multi-slot charger saves both space and time at the end of a shift.",
          uz: "Aksessuarlar o'ylanganidan ko'proq hal qiladi. Shovqinli joyda yoki mehmonlar xodimlarni eshitmasligi kerak bo'lgan joyda garnitura kerak. Zaxira akkumulyator ikkinchi ratsiyadan arzon. Ko'p o'rinli quvvatlagich esa smena oxirida joy va vaqtni tejaydi.",
        },
      },
    ],
    faq: [
      {
        q: {
          ru: "Можно ли обойтись телефонами вместо раций?",
          en: "Can we just use phones instead of radios?",
          uz: "Ratsiya o'rniga telefonlardan foydalansa bo'ladimi?",
        },
        a: {
          ru: "Можно, пока людей двое. Рация выигрывает там, где нажал один раз и слышат все сразу, где нет мобильной сети и где телефон не переживёт смену: пыль, вода, падения.",
          en: "You can, while there are two of you. A radio wins where one press reaches everyone at once, where there is no mobile network, and where a phone would not survive the shift — dust, water, drops.",
          uz: "Ikki kishi bo'lsa, mumkin. Ratsiya bir marta bosilganda hammaga yetadigan, mobil tarmoq yo'q va telefon smenani o'tkazolmaydigan joyda — chang, suv, tushib ketish — yutadi.",
        },
      },
      {
        q: {
          ru: "Обязательно ли брать все рации одной модели?",
          en: "Do all the radios have to be the same model?",
          uz: "Barcha ratsiyalar bir xil model bo'lishi shartmi?",
        },
        a: {
          ru: "Нет, но они должны работать в одном стандарте и на одном канале. Смешивать аналоговую и цифровую в одной группе нельзя — они друг друга не услышат.",
          en: "No, but they must share a standard and a channel. You cannot mix analogue and digital in one group — they will not hear each other.",
          uz: "Yo'q, lekin ular bir standart va bir kanalda ishlashi kerak. Bitta guruhda analog va raqamlini aralashtirib bo'lmaydi — ular bir-birini eshitmaydi.",
        },
      },
      {
        q: {
          ru: "Сколько занимает подбор?",
          en: "How long does it take to pick?",
          uz: "Tanlash qancha vaqt oladi?",
        },
        a: {
          ru: "Разговор — 15 минут в рабочее время. Выезд на объект с рациями — по договорённости, обычно в тот же или на следующий день.",
          en: "The conversation takes 15 minutes during working hours. A visit with the radios is by arrangement, usually the same day or the next.",
          uz: "Suhbat — ish vaqtida 15 daqiqa. Ratsiyalar bilan ob'ektga chiqish kelishuv bo'yicha, odatda o'sha kuni yoki ertasiga.",
        },
      },
    ],
    steps: [
      {
        name: { ru: "Измерьте расстояние", en: "Measure the distance", uz: "Masofani o'lchang" },
        text: {
          ru: "Не по карте, а между людьми, которые должны слышать друг друга. В городской застройке рации из каталога берут от 300 м до 3 км, на открытой местности — от 3 до 10 км.",
          en: "Not on a map — between the people who need to hear each other. In built-up streets the radios in this catalogue reach 300 m to 3 km; in the open, 3 to 10 km.",
          uz: "Xaritada emas, bir-birini eshitishi kerak bo'lgan odamlar orasida. Zich qurilishda katalogdagi ratsiyalar 300 m dan 3 km gacha, ochiq joyda — 3 dan 10 km gacha oladi.",
        },
      },
      {
        name: {
          ru: "Посмотрите, что между ними",
          en: "Look at what is in between",
          uz: "Ular orasida nima borligiga qarang",
        },
        text: {
          ru: "Бетонные стены, перекрытия и металл съедают дальность сильнее, чем расстояние. Если между людьми несколько этажей или цех с оборудованием, считайте по нижней цифре, а не по верхней.",
          en: "Concrete walls, floors and metal eat range faster than distance does. If there are several storeys or a machine hall between people, plan against the lower figure, not the higher one.",
          uz: "Beton devorlar, oraliq qavatlar va metall masofadan ko'ra ko'proq qamrovni yeydi. Odamlar orasida bir necha qavat yoki jihozli sex bo'lsa, yuqori emas, quyi ko'rsatkichga qarab hisoblang.",
        },
      },
      {
        name: {
          ru: "Решите: аналоговая или цифровая",
          en: "Decide: analogue or digital",
          uz: "Hal qiling: analog yoki raqamli",
        },
        text: {
          ru: "Аналоговая проще и дешевле. Цифровая даёт чистый звук в шуме и закрытый канал. В линейке Radiocom RC — аналоговые, RCD — цифровые.",
          en: "Analogue is simpler and cheaper. Digital gives clean audio through noise and a closed channel. In the Radiocom range, RC is analogue and RCD is digital.",
          uz: "Analog sodda va arzon. Raqamli shovqinda toza ovoz va yopiq kanal beradi. Radiocom liniyasida RC — analog, RCD — raqamli.",
        },
      },
      {
        name: { ru: "Посчитайте смену", en: "Count the shift", uz: "Smenani hisoblang" },
        text: {
          ru: "Рация должна пережить смену без зарядки. Если смена длинная или их две подряд, берите модель с большим аккумулятором или запасной аккумулятор в комплект.",
          en: "The radio has to outlast the shift without a charge. If the shift is long, or there are two back to back, take a model with a bigger battery or add a spare to the kit.",
          uz: "Ratsiya smenani quvvatlamasdan o'tkazishi kerak. Smena uzun bo'lsa yoki ketma-ket ikkita bo'lsa, katta akkumulyatorli model yoki komplektga zaxira akkumulyator oling.",
        },
      },
      {
        name: {
          ru: "Проверьте на своём объекте",
          en: "Test it on your own site",
          uz: "O'z ob'ektingizda sinab ko'ring",
        },
        text: {
          ru: "Последний шаг — единственный, который отвечает точно. Мы привозим рации на объект и проверяем связь в ваших стенах до покупки, бесплатно.",
          en: "The last step is the only one that answers exactly. We bring the radios to your site and test the signal inside your own walls before you buy, free of charge.",
          uz: "Oxirgi bosqich — aniq javob beradigan yagona bosqich. Ratsiyalarni ob'ektga olib kelamiz va sotib olishdan oldin o'z devorlaringiz ichida aloqani bepul tekshiramiz.",
        },
      },
    ],
  },
  "real-range": {
    picks: ["rcd-70", "rcd-60", "m-t82-extreme", "m-t42-red"],
    related: ["how-to-choose", "pmr-or-poc", "analog-or-digital"],
    sections: [
      {
        heading: {
          ru: "Что съедает дальность",
          en: "What eats the range",
          uz: "Masofani nima yeydi",
        },
        body: {
          ru: "Рельеф, погода, электромагнитные помехи и физические препятствия. Бетон с арматурой хуже кирпича, металлический ангар хуже бетона, а холм между двумя точками отменяет любую цифру. Поэтому в характеристиках всегда стоит «до»: это лучший случай, а не средний.",
          en: "Terrain, weather, electromagnetic interference and physical obstructions. Reinforced concrete is worse than brick, a metal shed is worse than concrete, and a hill between two points cancels any number at all. That is why a spec sheet always says «up to» — it is the best case, not the average.",
          uz: "Relyef, ob-havo, elektromagnit to'siqlar va jismoniy to'siqlar. Armaturali beton g'ishtdan yomonroq, metall angar betondan yomonroq, ikki nuqta orasidagi tepalik esa istalgan raqamni bekor qiladi. Shuning uchun xususiyatlarda doim «gacha» turadi: bu o'rtacha emas, eng yaxshi holat.",
        },
      },
      {
        heading: {
          ru: "Город против открытой местности",
          en: "Town against open country",
          uz: "Shahar va ochiq joy",
        },
        body: {
          ru: "Разрыв больше, чем ожидают. Одна и та же рация, которая на трассе берёт 10 километров, в плотной застройке даёт полтора. Это не брак и не обман в характеристиках — это физика: в городе сигналу мешает всё сразу.",
          en: "The gap is wider than people expect. The same radio that makes 10 kilometres on a highway gives one and a half in dense streets. That is not a fault and not a lie on the box — it is physics: in a town everything obstructs the signal at once.",
          uz: "Farq kutilganidan katta. Trassada 10 kilometr oladigan o'sha ratsiya zich qurilishda bir yarim beradi. Bu nuqson ham, xususiyatlardagi yolg'on ham emas — bu fizika: shaharda signalga hamma narsa birdan xalaqit beradi.",
        },
      },
      {
        heading: {
          ru: "Как узнать точно",
          en: "How to know for certain",
          uz: "Aniq qanday bilish mumkin",
        },
        body: {
          ru: "Единственный честный способ — проверить на месте. Мы привозим рации на объект, проходим с ними те маршруты, по которым ходят ваши люди, и показываем, где связь есть, а где её нет. Это бесплатно и ни к чему не обязывает.",
          en: "The only honest way is to test on site. We bring the radios out, walk the routes your people actually walk, and show you where the signal holds and where it does not. It is free and commits you to nothing.",
          uz: "Yagona halol yo'l — joyida tekshirish. Ratsiyalarni ob'ektga olib kelamiz, odamlaringiz yuradigan marshrutlardan o'tamiz va aloqa qayerda bor, qayerda yo'qligini ko'rsatamiz. Bu bepul va hech narsaga majbur qilmaydi.",
        },
      },
    ],
    faq: [
      {
        q: {
          ru: "Можно ли увеличить дальность?",
          en: "Can the range be increased?",
          uz: "Masofani oshirish mumkinmi?",
        },
        a: {
          ru: "Да — ретранслятором. Он принимает сигнал и передаёт дальше, и покрывает объект, который одна рация не берёт. Нужен он или нет, видно после выезда на место.",
          en: "Yes — with a repeater. It receives the signal and passes it on, covering a site a single radio cannot reach. Whether you need one becomes clear after a site visit.",
          uz: "Ha — retranslyator bilan. U signalni qabul qilib, uzatadi va bitta ratsiya yetmaydigan ob'ektni qoplaydi. Kerak yoki yo'qligi joyga chiqqandan keyin ma'lum bo'ladi.",
        },
      },
      {
        q: {
          ru: "Влияет ли антенна на дальность?",
          en: "Does the antenna affect range?",
          uz: "Antenna masofaga ta'sir qiladimi?",
        },
        a: {
          ru: "Да, и заметно. Штатная антенна рассчитана на баланс размера и приёма. Менять её самостоятельно не стоит: неподходящая антенна ухудшает связь и может вывести передатчик из строя.",
          en: "Yes, noticeably. The supplied antenna is a balance between size and reception. Do not swap it yourself: the wrong antenna makes the link worse and can damage the transmitter.",
          uz: "Ha, sezilarli. Standart antenna o'lcham va qabul muvozanatiga mo'ljallangan. Uni o'zingiz almashtirmang: mos kelmaydigan antenna aloqani yomonlashtiradi va uzatgichni ishdan chiqarishi mumkin.",
        },
      },
    ],
  },
  "analog-or-digital": {
    picks: ["rc-20", "rc-50", "rcd-50", "rcd-70"],
    related: ["how-to-choose", "real-range", "radio-price-tashkent"],
    sections: [
      {
        heading: { ru: "Звук в шуме", en: "Audio through noise", uz: "Shovqindagi ovoz" },
        body: {
          ru: "Главная разница слышна в цеху и на стройке. Аналоговый сигнал слабеет постепенно: сначала шипение, потом неразборчиво. Цифровой держит разборчивость до последнего и обрывается резко. На шумном объекте это разница между «переспросил» и «услышал с первого раза».",
          en: "The real difference shows in a machine hall or on a building site. An analogue signal degrades gradually — first hiss, then nothing you can make out. A digital one stays intelligible to the last and then cuts out sharply. On a loud site that is the difference between asking twice and hearing it first time.",
          uz: "Asosiy farq sexda va qurilishda eshitiladi. Analog signal asta-sekin zaiflashadi: avval shitirlash, keyin tushunarsiz. Raqamli oxirigacha tushunarli qoladi va keskin uziladi. Shovqinli ob'ektda bu «qayta so'radim» va «birinchi martada eshitdim» orasidagi farq.",
        },
      },
      {
        heading: { ru: "Кто вас слышит", en: "Who can hear you", uz: "Sizni kim eshitadi" },
        body: {
          ru: "Аналоговый канал открыт: любая рация на той же частоте слышит разговор. Цифровая может шифровать эфир, и тогда разговор слышат только свои. Для охраны, инкассации и всего, где обсуждают деньги или маршруты, это решающий пункт.",
          en: "An analogue channel is open: any radio on the same frequency hears the conversation. A digital one can encrypt the air, and then only your own team hears it. For security work, cash handling and anything where money or routes are discussed, that is the deciding point.",
          uz: "Analog kanal ochiq: o'sha chastotadagi istalgan ratsiya suhbatni eshitadi. Raqamli efirni shifrlashi mumkin, shunda suhbatni faqat o'zingiznikilar eshitadi. Qo'riqlash, inkassatsiya va pul yoki marshrut muhokama qilinadigan hamma joyda bu hal qiluvchi nuqta.",
        },
      },
      {
        heading: {
          ru: "Что есть в каталоге",
          en: "What is in the catalogue",
          uz: "Katalogda nima bor",
        },
        body: {
          ru: "У Radiocom это видно по названию: RC — аналоговые, RCD — цифровые. Линейка Motorola в каталоге аналоговая. Смешивать аналоговые и цифровые рации в одной группе нельзя — они не услышат друг друга, поэтому выбор делается один раз на весь парк.",
          en: "With Radiocom the name tells you: RC is analogue, RCD is digital. The Motorola range in this catalogue is analogue. Analogue and digital radios cannot share a group — they will not hear each other — so the decision is made once, for the whole fleet.",
          uz: "Radiocom'da bu nomidan ko'rinadi: RC — analog, RCD — raqamli. Katalogdagi Motorola liniyasi analog. Analog va raqamli ratsiyalarni bitta guruhda aralashtirib bo'lmaydi — ular bir-birini eshitmaydi, shuning uchun tanlov butun park uchun bir marta qilinadi.",
        },
      },
    ],
    faq: [
      {
        q: {
          ru: "Цифровая всегда лучше?",
          en: "Is digital always better?",
          uz: "Raqamli har doim yaxshiroqmi?",
        },
        a: {
          ru: "Нет. Если людей четверо, объект небольшой и вокруг тихо, аналоговая делает ту же работу дешевле. Цифровая окупается там, где шумно, где нужен закрытый канал или где раций много.",
          en: "No. With four people, a small site and a quiet setting, analogue does the same job for less. Digital pays for itself where it is loud, where the channel must be closed, or where there are a lot of radios.",
          uz: "Yo'q. To'rt kishi bo'lsa, ob'ekt kichik va atrof tinch bo'lsa, analog o'sha ishni arzonroq bajaradi. Raqamli shovqinli, yopiq kanal kerak yoki ratsiya ko'p bo'lgan joyda o'zini oqlaydi.",
        },
      },
      {
        q: {
          ru: "Можно ли перевести аналоговый парк на цифру постепенно?",
          en: "Can an analogue fleet move to digital gradually?",
          uz: "Analog parkni bosqichma-bosqich raqamliga o'tkazsa bo'ladimi?",
        },
        a: {
          ru: "Частично. Некоторые цифровые модели умеют работать и в аналоговом режиме, что позволяет держать смешанный парк во время перехода. Какие именно — уточним по вашему списку моделей.",
          en: "Partly. Some digital models can also run in analogue mode, which lets a mixed fleet work during the changeover. Which ones exactly we will confirm against your list of models.",
          uz: "Qisman. Ba'zi raqamli modellar analog rejimda ham ishlay oladi, bu o'tish davrida aralash parkni saqlashga imkon beradi. Aynan qaysilari — model ro'yxatingiz bo'yicha aniqlaymiz.",
        },
      },
    ],
  },
  "how-many-radios": {
    picks: ["m-xt185", "rc-20", "m-t42-quad", "rcd-50"],
    related: ["how-to-choose", "radio-price-tashkent", "real-range"],
    sections: [
      {
        heading: {
          ru: "Считайте по ролям, а не по головам",
          en: "Count roles, not heads",
          uz: "Bosh emas, rol bo'yicha hisoblang",
        },
        body: {
          ru: "Рация нужна тому, кто принимает решение или сообщает о проблеме. В ресторане это хостес, менеджер зала, шеф, бар, склад и один официант на зал. Посудомойщику рация не нужна — и это нормально, парк не должен совпадать со штатным расписанием.",
          en: "A radio belongs to whoever makes a decision or reports a problem. In a restaurant that is the host, the floor manager, the chef, the bar, the store room and one waiter per room. The dishwasher does not need one — and that is fine: the fleet does not have to match the payroll.",
          uz: "Ratsiya qaror qabul qiladigan yoki muammo haqida xabar beradigan kishiga kerak. Restoranda bu xostes, zal menejeri, oshpaz, bar, ombor va zalga bitta ofitsiant. Idish yuvuvchiga ratsiya kerak emas — bu normal, park shtat jadvaliga mos kelishi shart emas.",
        },
      },
      {
        heading: {
          ru: "Одна запасная всегда на зарядке",
          en: "One spare always on charge",
          uz: "Bitta zaxira doim quvvatda",
        },
        body: {
          ru: "Это правило экономит больше, чем стоит. Рация садится, падает или уходит со сменщиком — и без запасной кто-то остаётся без связи в худший момент. Одна лишняя на каждые пять-шесть работающих закрывает почти все такие случаи.",
          en: "This rule saves more than it costs. A radio goes flat, gets dropped, or leaves with the person going home — and without a spare somebody loses contact at the worst moment. One extra for every five or six in use covers almost all of it.",
          uz: "Bu qoida o'zi turadiganidan ko'proq tejaydi. Ratsiya quvvati tugaydi, tushib ketadi yoki smenachi bilan ketadi — zaxirasiz esa kimdir eng yomon paytda aloqasiz qoladi. Har besh-oltita ishlayotganiga bitta ortiqcha deyarli barcha shunday holatlarni yopadi.",
        },
      },
      {
        heading: {
          ru: "Когда нужны каналы, а не рации",
          en: "When you need channels, not radios",
          uz: "Qachon ratsiya emas, kanal kerak",
        },
        body: {
          ru: "Если групп несколько — кухня и зал, монтаж и охрана — им нужен не общий эфир, а разные каналы. Иначе все слышат всё, и через неделю люди начинают выключать рации. Разнести группы по каналам можно на любой модели из каталога.",
          en: "Where there are several groups — kitchen and floor, install and security — what they need is separate channels, not one shared air. Otherwise everyone hears everything, and within a week people start switching the radios off. Every model in this catalogue can split groups across channels.",
          uz: "Guruh bir nechta bo'lsa — oshxona va zal, montaj va qo'riqlash — ularga umumiy efir emas, alohida kanallar kerak. Aks holda hamma hamma narsani eshitadi va bir haftadan keyin odamlar ratsiyani o'chira boshlaydi. Guruhlarni kanallarga ajratish katalogdagi har qanday modelda mumkin.",
        },
      },
    ],
    faq: [
      {
        q: {
          ru: "Дешевле ли брать комплектом?",
          en: "Is a kit cheaper?",
          uz: "Komplekt bilan olish arzonroqmi?",
        },
        a: {
          ru: "Обычно да. В каталоге есть готовые комплекты из трёх и четырёх раций с зарядкой и гарнитурами — они выходят дешевле, чем те же рации поштучно.",
          en: "Usually yes. The catalogue carries ready three- and four-radio kits with charger and headsets, and they come out cheaper than the same radios bought singly.",
          uz: "Odatda ha. Katalogda quvvatlagich va garnituralar bilan uch va to'rtta ratsiyadan tayyor komplektlar bor — ular o'sha ratsiyalarni donalab olishdan arzonroq chiqadi.",
        },
      },
      {
        q: {
          ru: "Можно ли докупить рации позже?",
          en: "Can we add more radios later?",
          uz: "Keyinroq ratsiya qo'shib olsa bo'ladimi?",
        },
        a: {
          ru: "Да, если модель та же или совместимая по стандарту и каналам. Поэтому лучше сразу выбрать модель, которая останется в каталоге, — подскажем, какие из них долгоживущие.",
          en: "Yes, as long as the model is the same or compatible in standard and channels. So it is worth picking a model that will stay in the catalogue — we will say which ones are long-lived.",
          uz: "Ha, agar model o'sha yoki standart va kanallar bo'yicha mos bo'lsa. Shuning uchun katalogda qoladigan modelni tanlagan ma'qul — qaysilari uzoq yashashini aytamiz.",
        },
      },
    ],
  },
  "radio-price-tashkent": {
    picks: ["rc-10", "rc-20", "rcd-50", "m-t82-extreme-quad"],
    related: ["how-to-choose", "analog-or-digital", "how-many-radios"],
    sections: [
      {
        heading: {
          ru: "От чего зависит цена",
          en: "What sets the price",
          uz: "Narx nimaga bog'liq",
        },
        body: {
          ru: "Дальность стоит денег: рация на 10 километров по открытой местности дороже той, что берёт четыре. Защита по стандарту IP — тоже: корпус, который не боится пыли и струи воды, дороже обычного. И цифровая всегда дороже аналоговой той же дальности.",
          en: "Range costs money: a radio that makes 10 kilometres in the open is dearer than one that makes four. So does an IP rating — a shell that shrugs off dust and a jet of water costs more than a plain one. And digital is always dearer than analogue at the same range.",
          uz: "Masofa pul turadi: ochiq joyda 10 kilometr oladigan ratsiya to'rt kilometrlikdan qimmat. IP standarti bo'yicha himoya ham: chang va suv oqimidan qo'rqmaydigan korpus oddiysidan qimmat. Raqamli esa o'sha masofadagi analogdan doim qimmat.",
        },
      },
      {
        heading: {
          ru: "Что входит в цену",
          en: "What the price includes",
          uz: "Narxga nima kiradi",
        },
        body: {
          ru: "У каждой модели на странице характеристик указано, что лежит в коробке: аккумулятор, зарядное устройство, антенна, клипса, у части моделей — гарнитура. Комплекты из трёх и четырёх раций включают зарядку на несколько мест. Ничего докупать, чтобы начать работать, не нужно.",
          en: "Every model's specs page lists what is in the box: battery, charger, antenna, belt clip, and on some models a headset. Three- and four-radio kits include a multi-slot charger. Nothing extra has to be bought before you can start using them.",
          uz: "Har bir modelning xususiyatlar sahifasida qutida nima borligi ko'rsatilgan: akkumulyator, quvvatlagich, antenna, klipsa, ba'zi modellarda — garnitura. Uch va to'rtta ratsiyadan iborat komplektlarga ko'p o'rinli quvvatlagich kiradi. Ishlashni boshlash uchun hech narsa qo'shib olish shart emas.",
        },
      },
      {
        heading: {
          ru: "Почему дешёвая иногда выходит дороже",
          en: "Why cheap sometimes ends up dearer",
          uz: "Nega arzoni ba'zan qimmatga tushadi",
        },
        body: {
          ru: "Рация, которой не хватает дальности на ваш объект, не решает задачу ни за какие деньги. Её меняют через месяц — и платят дважды. Поэтому мы возим рации на тест до покупки: дешевле один выезд, чем один неверный парк.",
          en: "A radio that does not have the range for your site solves nothing at any price. It gets replaced within a month, and you pay twice. That is why we bring radios out to test before you buy: one visit costs less than one wrong fleet.",
          uz: "Ob'ektingizga masofasi yetmaydigan ratsiya hech qanday pulga vazifani hal qilmaydi. Uni bir oydan keyin almashtirishadi — va ikki marta to'lashadi. Shuning uchun sotib olishdan oldin ratsiyalarni sinovga olib kelamiz: bitta chiqish bitta noto'g'ri parkdan arzon.",
        },
      },
    ],
    faq: [
      {
        q: { ru: "Цены окончательные?", en: "Are the prices final?", uz: "Narxlar yakuniymi?" },
        a: {
          ru: "Цены на страницах моделей актуальны и указаны в сумах. На парк от нескольких штук считаем отдельно — напишите количество, и вернёмся с цифрой.",
          en: "The prices on the model pages are current and quoted in UZS. For a fleet of several units we quote separately — send the quantity and we will come back with a figure.",
          uz: "Model sahifalaridagi narxlar dolzarb va so'mda ko'rsatilgan. Bir nechta donadan iborat park uchun alohida hisoblaymiz — sonini yozing, raqam bilan qaytamiz.",
        },
      },
      {
        q: { ru: "Есть ли Trade-In?", en: "Is there a trade-in?", uz: "Trade-in bormi?" },
        a: {
          ru: "Да. Принесите устаревшую рацию — подберём актуальную модель Motorola или Radiocom со скидкой.",
          en: "Yes. Bring in an old radio and we will pick a current Motorola or Radiocom model at a discount.",
          uz: "Ha. Eskirgan ratsiyani olib keling — chegirma bilan zamonaviy Motorola yoki Radiocom modelini tanlaymiz.",
        },
      },
      {
        q: { ru: "Доставка платная?", en: "Is delivery charged?", uz: "Yetkazib berish pullikmi?" },
        a: {
          ru: "Нет, доставка по Узбекистану бесплатная.",
          en: "No — delivery anywhere in Uzbekistan is free.",
          uz: "Yo'q, O'zbekiston bo'ylab yetkazib berish bepul.",
        },
      },
    ],
  },
  "pmr-or-poc": {
    picks: ["rcd-70", "rcd-60", "rcd-50"],
    related: ["real-range", "how-to-choose", "analog-or-digital"],
    sections: [
      {
        heading: {
          ru: "Один объект или вся страна",
          en: "One site or the whole country",
          uz: "Bitta ob'ekt yoki butun mamlakat",
        },
        body: {
          ru: "Это главный вопрос. Если люди работают на одной площадке — обычная рация дешевле и не зависит от оператора. Если водители, экспедиции или объекты разбросаны по стране, обычная рация физически не дотянется, и тогда PoC становится единственным вариантом.",
          en: "That is the deciding question. If people work on one site, a normal radio is cheaper and depends on no operator. If drivers, crews or sites are spread across the country, a normal radio physically cannot reach — and then PoC is the only option.",
          uz: "Bu asosiy savol. Odamlar bitta maydonchada ishlasa — oddiy ratsiya arzon va operatorga bog'liq emas. Haydovchilar, ekspeditsiyalar yoki ob'ektlar mamlakat bo'ylab tarqoq bo'lsa, oddiy ratsiya jismonan yetmaydi va o'shanda PoC yagona variant bo'lib qoladi.",
        },
      },
      {
        heading: {
          ru: "Что нужно поставить",
          en: "What you have to install",
          uz: "Nima o'rnatish kerak",
        },
        body: {
          ru: "Обычной рации на большом объекте может понадобиться антенна, а иногда и ретранслятор. PoC не требует ничего: вышки оператора уже стоят. Поэтому вход в PoC дешевле, а владение — дороже, потому что появляется ежемесячный платёж за каждое устройство.",
          en: "A normal radio on a large site may need an antenna, and sometimes a repeater. PoC needs nothing installed: the operator's masts already exist. So PoC is cheaper to start and dearer to own, because every device carries a monthly charge.",
          uz: "Katta ob'ektda oddiy ratsiyaga antenna, ba'zan retranslyator kerak bo'lishi mumkin. PoC hech narsani talab qilmaydi: operator minoralari allaqachon turibdi. Shuning uchun PoC'ga kirish arzon, egalik qilish esa qimmat, chunki har bir qurilma uchun oylik to'lov paydo bo'ladi.",
        },
      },
      {
        heading: {
          ru: "Можно и то и другое",
          en: "You can have both",
          uz: "Ikkalasi ham bo'lishi mumkin",
        },
        body: {
          ru: "Их не обязательно противопоставлять. На складе и в цеху работают обычные рации, у водителей — PoC, а в диспетчерской ставится шлюз, и обе связи оказываются в одном канале. Для транспорта и логистики это самая частая конфигурация.",
          en: "They are not necessarily rivals. Normal radios cover the warehouse and the shop floor, drivers carry PoC, and a gateway in the dispatch room puts both on one channel. For transport and logistics that is the most common setup of all.",
          uz: "Ularni qarama-qarshi qo'yish shart emas. Omborda va sexda oddiy ratsiyalar ishlaydi, haydovchilarda — PoC, dispetcherlik xonasiga esa shlyuz o'rnatiladi va ikkala aloqa bitta kanalda bo'ladi. Transport va logistika uchun bu eng keng tarqalgan konfiguratsiya.",
        },
      },
    ],
    faq: [
      {
        q: {
          ru: "PoC работает без интернета?",
          en: "Does PoC work without the internet?",
          uz: "PoC internetsiz ishlaydimi?",
        },
        a: {
          ru: "Нет. PoC-рации нужна мобильная сеть оператора — там, где не ловит телефон, не будет и связи. На таких участках работает обычная рация со своей частотой.",
          en: "No. A PoC radio needs the operator's mobile network — where a phone has no signal, neither will the radio. On those stretches a normal radio on its own frequency is what works.",
          uz: "Yo'q. PoC ratsiyasiga operatorning mobil tarmog'i kerak — telefon tutmaydigan joyda aloqa ham bo'lmaydi. Bunday joylarda o'z chastotasidagi oddiy ratsiya ishlaydi.",
        },
      },
      {
        q: {
          ru: "Сколько человек можно подключить к PoC?",
          en: "How many people can PoC carry?",
          uz: "PoC'ga nechta odam ulanadi?",
        },
        a: {
          ru: "Тысячи, и это не ограничено зоной приёма, как у обычной рации. Группы настраиваются программно, поэтому добавить нового человека — вопрос настройки, а не оборудования.",
          en: "Thousands, and it is not capped by a reception area the way a normal radio is. Groups are configured in software, so adding a person is a matter of settings rather than equipment.",
          uz: "Minglab, va bu oddiy ratsiyadagidek qabul zonasi bilan cheklanmagan. Guruhlar dasturiy sozlanadi, shuning uchun yangi odam qo'shish jihoz emas, sozlash masalasi.",
        },
      },
    ],
  },
  "warranty-and-repair": {
    picks: ["rcd-70", "rcd-50", "rc-20"],
    related: ["how-to-choose", "radio-price-tashkent"],
    sections: [
      {
        heading: {
          ru: "Что покрывает гарантия",
          en: "What the warranty covers",
          uz: "Kafolat nimani qoplaydi",
        },
        body: {
          ru: "Гарантия 12 месяцев распространяется на саму рацию. Аксессуары и аккумуляторы она не покрывает — это расходники, и их ресурс зависит от того, сколько циклов заряда они прошли. Это стандартное условие, а не исключение конкретной модели.",
          en: "The 12-month warranty applies to the radio itself. It does not cover accessories and batteries — those are consumables, and their life depends on how many charge cycles they have been through. That is a standard condition, not an exception for one model.",
          uz: "12 oylik kafolat ratsiyaning o'ziga tegishli. U aksessuarlar va akkumulyatorlarni qoplamaydi — bular sarf materiallari va ularning resursi qancha quvvatlash sikli o'tganiga bog'liq. Bu muayyan modelning istisnosi emas, standart shart.",
        },
      },
      {
        heading: {
          ru: "Как проходит ремонт",
          en: "How the repair goes",
          uz: "Ta'mirlash qanday o'tadi",
        },
        body: {
          ru: "Четыре шага: принимаем и фиксируем неисправность, находим причину на профильном оборудовании, называем фиксированную цену, ремонтируем оригинальными запчастями и проверяем передатчик перед возвратом. Цена, названная после диагностики, дальше не растёт.",
          en: "Four steps: we take the radio in and record the fault, find the cause on proper test equipment, quote a fixed price, then repair with original parts and check the transmitter before handing it back. The price quoted after diagnosis does not rise afterwards.",
          uz: "To'rt bosqich: ratsiyani qabul qilib, nosozlikni qayd etamiz, maxsus jihozda sababni topamiz, qat'iy narx aytamiz, original ehtiyot qismlar bilan ta'mirlaymiz va qaytarishdan oldin uzatgichni tekshiramiz. Diagnostikadan keyin aytilgan narx keyin oshmaydi.",
        },
      },
      {
        heading: {
          ru: "Если гарантия закончилась",
          en: "If the warranty has expired",
          uz: "Kafolat tugagan bo'lsa",
        },
        body: {
          ru: "Чиним и после гарантии, теми же оригинальными запчастями и по той же схеме с фиксированной ценой. Мы авторизованный сервисный центр Motorola и Radiocom, поэтому ремонтируем и то, что куплено не у нас.",
          en: "We repair after the warranty too, with the same original parts and the same fixed-price process. We are an authorised Motorola and Radiocom service centre, so we also take radios that were not bought here.",
          uz: "Kafolatdan keyin ham ta'mirlaymiz, o'sha original ehtiyot qismlar bilan va o'sha qat'iy narx sxemasi bo'yicha. Biz Motorola va Radiocom'ning rasmiy servis markazimiz, shuning uchun bizdan sotib olinmagan ratsiyalarni ham olamiz.",
        },
      },
    ],
    faq: [
      {
        q: {
          ru: "Сколько занимает ремонт?",
          en: "How long does a repair take?",
          uz: "Ta'mirlash qancha vaqt oladi?",
        },
        a: {
          ru: "Зависит от неисправности и наличия запчасти. Точный срок называем вместе с ценой — после диагностики, а не до неё.",
          en: "It depends on the fault and on parts availability. We give the exact time along with the price — after the diagnosis, not before it.",
          uz: "Nosozlik va ehtiyot qism mavjudligiga bog'liq. Aniq muddatni narx bilan birga aytamiz — diagnostikadan keyin, undan oldin emas.",
        },
      },
      {
        q: {
          ru: "Что если рация утонула или её раздавило?",
          en: "What if the radio drowned or was crushed?",
          uz: "Ratsiya suvga tushsa yoki ezilsa-chi?",
        },
        a: {
          ru: "Приносите — посмотрим. Часть таких случаев ремонтируется, часть нет, и это видно только после разборки. Диагностика покажет, что дешевле: ремонт или замена.",
          en: "Bring it in and we will look. Some of those are repairable and some are not, and it only shows once it is opened up. The diagnosis tells you which is cheaper: repair or replacement.",
          uz: "Olib keling — ko'ramiz. Bunday holatlarning bir qismi ta'mirlanadi, bir qismi yo'q, bu faqat ochilgandan keyin ma'lum bo'ladi. Diagnostika qaysi biri arzonroq ekanini ko'rsatadi: ta'mir yoki almashtirish.",
        },
      },
    ],
  },
};

/**
 * `picks` as products, in the order given, skipping anything not visible.
 *
 * Lives here rather than in `answers.ts` because its only caller is the detail
 * page, which already imports this module. Putting it beside the slim module
 * would drag `products.ts`'s `Product` type — and the `picks` arrays — back
 * onto every route through `head`.
 */
export function answerPicks<T extends { id: string }>(content: AnswerContent, visible: T[]): T[] {
  return content.picks
    .map((id) => visible.find((p) => p.id === id))
    .filter((p): p is T => p != null);
}
