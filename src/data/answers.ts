/**
 * The answers section — one page per question a buyer asks before they know
 * which radio they want.
 *
 * Every other page on this site is transactional: a product, a brand, an
 * industry, the service centre. That leaves the top of the funnel unserved.
 * Somebody searching «какая дальность у рации на самом деле» has no page here
 * to land on, so the click goes to whoever wrote one — and an AI answer engine
 * asked the same question quotes them rather than us.
 *
 * ── Why this lives in a data file and not in `ru.json` ──────────────────────
 *
 * The locale JSONs exist for UI strings, and `verify-i18n`'s rules are tuned
 * for labels: it skips anything under 40 characters as a label, and compares
 * translated length against the Russian to catch a missing clause. Long-form
 * prose would add tens of thousands of characters to files that are read on
 * every route, and would drown those rules in noise. `specs.ts` and
 * `products.ts` already carry localised prose this way — the same `{ ru, en,
 * uz }` shape, read through the same `pick()`. `qa-i18n-rendered` still catches
 * an untranslated page, because it fails on stray Cyrillic in rendered en/uz.
 *
 * ── Prose written for citation ──────────────────────────────────────────────
 *
 * Every page opens with `answer`: two sentences that answer the question
 * completely, before any preamble. That is the passage Google lifts for a
 * featured snippet and the passage an answer engine quotes, and it only works
 * if it stands alone with no antecedent. The reasoning comes after it, not
 * before.
 *
 * ── Every number here is traceable ──────────────────────────────────────────
 *
 * Figures come from `products.ts` and `specs.ts` and nowhere else — 21 visible
 * models, 600 000–3 100 000 сум, 300 м–3 км in town against 3–10 км in the
 * open. `verify-answers` re-derives them from the catalogue and fails when the
 * prose and the data disagree, which is what stops the copy going stale the
 * next time a price list lands.
 */
import type { Product } from "./products";

/** A string in all three published locales. */
type L = { ru: string; en: string; uz: string };

export type AnswerSlug =
  | "how-to-choose"
  | "real-range"
  | "analog-or-digital"
  | "how-many-radios"
  | "radio-price-tashkent"
  | "pmr-or-poc"
  | "warranty-and-repair"
  | "radio-licence-uzbekistan";

export type Answer = {
  slug: AnswerSlug;
  /** The `h1`. Phrased as the question somebody types. */
  question: L;
  /**
   * The direct answer, two sentences, self-contained.
   *
   * Marked `speakable` in the schema and rendered before anything else on the
   * page. It must make sense quoted on its own, with no "this" or "it"
   * pointing back at a sentence the quoter did not take.
   */
  answer: L;
  /** `<=65` characters once " | Radiocom" is appended — `verify-snippets` enforces. */
  metaTitle: L;
  /** 70-160 characters. */
  metaDesc: L;
  /** Body. One `h2` per entry. */
  sections: { heading: L; body: L }[];
  /** Follow-ups, rendered as the shared `Faq` and emitted as `FAQPage`. */
  faq: { q: L; a: L }[];
  /** Product ids to show at the foot. Must be visible — `verify-answers` checks. */
  picks: string[];
  /** Ordered steps. Only where the page is genuinely a procedure: emits `HowTo`. */
  steps?: { name: L; text: L }[];
  /** Source image under `src/assets/`, mapped in `scripts/build-og-images.ts`. */
  ogCard: string;
  /** Sibling pages to link. Keeps the section crawlable as a cluster. */
  related: AnswerSlug[];
  /**
   * Written, but not published.
   *
   * A draft is skipped by the route, the index, the sitemap and `llms.txt`, so
   * it ships nowhere. It exists so the text can be reviewed in the repo before
   * it becomes a claim the site makes. `verify-answers` requires that anything
   * containing a `TODO-LEGAL` marker is a draft, which is the mechanism that
   * stops an unconfirmed legal claim reaching production.
   */
  draft?: true;
};

/** Marker for a sentence that needs human confirmation before it can publish. */
export const TODO_LEGAL = "TODO-LEGAL";

export const answers: Answer[] = [
  /* ── 1. How to choose ─────────────────────────────────────────────── */
  {
    slug: "how-to-choose",
    question: {
      ru: "Как выбрать рацию",
      en: "How to choose a two-way radio",
      uz: "Ratsiyani qanday tanlash kerak",
    },
    answer: {
      ru: "Выбор рации сводится к трём вопросам: на каком расстоянии работают люди, что стоит между ними и сколько часов длится смена. Ответьте на эти три — и подойдёт одна из 21 модели, которые есть в наличии в Ташкенте.",
      en: "Choosing a two-way radio comes down to three questions: how far apart your people work, what stands between them, and how long the shift runs. Answer those three and one of the 21 models in stock in Tashkent will fit.",
      uz: "Ratsiya tanlash uchta savolga keladi: odamlar qanday masofada ishlaydi, ular orasida nima turibdi va smena necha soat davom etadi. Shu uchtasiga javob bering — Toshkentda mavjud 21 modeldan biri mos keladi.",
    },
    metaTitle: {
      ru: "Как выбрать рацию — 5 шагов",
      en: "How to choose a two-way radio — 5 steps",
      uz: "Ratsiyani qanday tanlash — 5 bosqich",
    },
    metaDesc: {
      ru: "Как выбрать рацию: расстояние, препятствия, длительность смены, аналоговая или цифровая. Пять шагов и 21 модель в наличии в Ташкенте с ценами.",
      en: "How to choose a two-way radio: distance, obstacles, shift length, analogue or digital. Five steps, and 21 models in stock in Tashkent with prices.",
      uz: "Ratsiyani qanday tanlash: masofa, to'siqlar, smena uzunligi, analog yoki raqamli. Besh bosqich va Toshkentda narxlari bilan 21 model.",
    },
    steps: [
      {
        name: {
          ru: "Измерьте расстояние",
          en: "Measure the distance",
          uz: "Masofani o'lchang",
        },
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
        name: {
          ru: "Посчитайте смену",
          en: "Count the shift",
          uz: "Smenani hisoblang",
        },
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
    picks: ["rc-20", "rcd-50", "m-t82-extreme", "rcd-70"],
    ogCard: "cutout/hands-compare-cutout.webp",
    related: ["real-range", "analog-or-digital", "radio-price-tashkent"],
  },

  /* ── 2. Real range ────────────────────────────────────────────────── */
  {
    slug: "real-range",
    question: {
      ru: "Какая дальность у рации на самом деле",
      en: "What range does a two-way radio really get",
      uz: "Ratsiyaning haqiqiy masofasi qanday",
    },
    answer: {
      ru: "Цифра в характеристиках — это прямая видимость в хорошую погоду, то есть верхняя граница. В городской застройке рации из этого каталога реально берут от 300 метров до 3 километров, на открытой местности — от 3 до 10 километров.",
      en: "The figure on a spec sheet is line-of-sight in good weather — the ceiling, not the norm. In built-up streets the radios in this catalogue realistically reach 300 metres to 3 kilometres; in open country, 3 to 10 kilometres.",
      uz: "Xususiyatlardagi raqam — yaxshi ob-havoda to'g'ridan-to'g'ri ko'rinish, ya'ni yuqori chegara. Zich qurilishda bu katalogdagi ratsiyalar haqiqatda 300 metrdan 3 kilometrgacha, ochiq joyda — 3 dan 10 kilometrgacha oladi.",
    },
    metaTitle: {
      ru: "Дальность рации: сколько на самом деле",
      en: "Two-way radio range: what you really get",
      uz: "Ratsiya masofasi: haqiqatda qancha",
    },
    metaDesc: {
      ru: "Реальная дальность рации: 300 м – 3 км в городе и 3–10 км на открытой местности. Что съедает сигнал и как проверить на своём объекте бесплатно.",
      en: "Real two-way radio range: 300 m to 3 km in town and 3 to 10 km in the open. What eats the signal, and how to test it free on your own site.",
      uz: "Ratsiyaning haqiqiy masofasi: shaharda 300 m – 3 km, ochiq joyda 3–10 km. Signalni nima yeydi va o'z ob'ektingizda qanday bepul tekshirish mumkin.",
    },
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
    picks: ["rcd-70", "rcd-60", "m-t82-extreme", "m-t42-red"],
    ogCard: "cutout/radios-fan-cutout.webp",
    related: ["how-to-choose", "pmr-or-poc", "analog-or-digital"],
  },

  /* ── 3. Analogue or digital ───────────────────────────────────────── */
  {
    slug: "analog-or-digital",
    question: {
      ru: "Аналоговая или цифровая рация",
      en: "Analogue or digital two-way radio",
      uz: "Analog yoki raqamli ratsiya",
    },
    answer: {
      ru: "Аналоговая рация проще и дешевле, и её хватает, когда людей немного и вокруг тихо. Цифровая даёт чистый звук в шуме, закрытый от посторонних канал и больше каналов на той же частоте.",
      en: "An analogue radio is simpler and cheaper, and it is enough when the team is small and the surroundings are quiet. A digital one gives clean audio through noise, a channel outsiders cannot listen to, and more channels on the same frequency.",
      uz: "Analog ratsiya sodda va arzon, odam kam va atrof tinch bo'lganda yetarli. Raqamli shovqinda toza ovoz, begonalar eshitolmaydigan kanal va o'sha chastotada ko'proq kanal beradi.",
    },
    metaTitle: {
      ru: "Аналоговая или цифровая рация — что выбрать",
      en: "Analogue or digital radio — which to choose",
      uz: "Analog yoki raqamli ratsiya — qaysi biri",
    },
    metaDesc: {
      ru: "Чем цифровая рация отличается от аналоговой: звук в шуме, закрытый канал, число каналов и цена. Radiocom RC против RCD, с ценами в Ташкенте.",
      en: "How a digital radio differs from an analogue one: audio in noise, a closed channel, channel count and price. Radiocom RC against RCD, with Tashkent prices.",
      uz: "Raqamli ratsiya analogdan nimasi bilan farq qiladi: shovqindagi ovoz, yopiq kanal, kanallar soni va narx. Radiocom RC va RCD, Toshkent narxlari bilan.",
    },
    sections: [
      {
        heading: {
          ru: "Звук в шуме",
          en: "Audio through noise",
          uz: "Shovqindagi ovoz",
        },
        body: {
          ru: "Главная разница слышна в цеху и на стройке. Аналоговый сигнал слабеет постепенно: сначала шипение, потом неразборчиво. Цифровой держит разборчивость до последнего и обрывается резко. На шумном объекте это разница между «переспросил» и «услышал с первого раза».",
          en: "The real difference shows in a machine hall or on a building site. An analogue signal degrades gradually — first hiss, then nothing you can make out. A digital one stays intelligible to the last and then cuts out sharply. On a loud site that is the difference between asking twice and hearing it first time.",
          uz: "Asosiy farq sexda va qurilishda eshitiladi. Analog signal asta-sekin zaiflashadi: avval shitirlash, keyin tushunarsiz. Raqamli oxirigacha tushunarli qoladi va keskin uziladi. Shovqinli ob'ektda bu «qayta so'radim» va «birinchi martada eshitdim» orasidagi farq.",
        },
      },
      {
        heading: {
          ru: "Кто вас слышит",
          en: "Who can hear you",
          uz: "Sizni kim eshitadi",
        },
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
    picks: ["rc-20", "rc-50", "rcd-50", "rcd-70"],
    ogCard: "cutout/lineup-seven-cutout.webp",
    related: ["how-to-choose", "real-range", "radio-price-tashkent"],
  },

  /* ── 4. How many radios ───────────────────────────────────────────── */
  {
    slug: "how-many-radios",
    question: {
      ru: "Сколько раций нужно",
      en: "How many two-way radios do you need",
      uz: "Nechta ratsiya kerak",
    },
    answer: {
      ru: "Считайте не по штату, а по людям, которые должны слышать друг друга в одну и ту же минуту. Для ресторана это обычно 4–6 раций, для смены на объекте — по одной на каждого, кто принимает решения, плюс одна запасная на зарядке.",
      en: "Count not by headcount but by the people who must hear each other in the same minute. For a restaurant that is usually four to six radios; for a shift on site, one for everyone who makes decisions, plus one spare on charge.",
      uz: "Shtat bo'yicha emas, bir daqiqada bir-birini eshitishi kerak bo'lgan odamlar bo'yicha hisoblang. Restoran uchun bu odatda 4–6 ratsiya, ob'ektdagi smena uchun — qaror qabul qiladigan har bir kishiga bittadan, ustiga quvvatda turadigan bitta zaxira.",
    },
    metaTitle: {
      ru: "Сколько раций нужно на смену",
      en: "How many radios you need for a shift",
      uz: "Bir smenaga nechta ratsiya kerak",
    },
    metaDesc: {
      ru: "Сколько раций нужно ресторану, стройке или охране: как считать по людям, а не по штату, зачем запасная на зарядке. Посчитаем на объекте бесплатно.",
      en: "How many radios a restaurant, building site or security team needs: count by people, not headcount, and why one spare stays on charge. We count on site, free.",
      uz: "Restoran, qurilish yoki qo'riqlashga nechta ratsiya kerak: shtat emas, odam bo'yicha hisoblash va nega bitta zaxira quvvatda turadi. Bepul hisoblaymiz.",
    },
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
    picks: ["m-xt185", "rc-20", "m-t42-quad", "rcd-50"],
    ogCard: "cutout/four-arranged-cutout.webp",
    related: ["how-to-choose", "radio-price-tashkent", "real-range"],
  },

  /* ── 5. Price ─────────────────────────────────────────────────────── */
  {
    slug: "radio-price-tashkent",
    question: {
      ru: "Сколько стоит рация в Ташкенте",
      en: "What a two-way radio costs in Tashkent",
      uz: "Toshkentda ratsiya qancha turadi",
    },
    answer: {
      ru: "В наличии 21 модель по цене от 600 000 до 3 100 000 сум. Разброс объясняется тремя вещами: дальностью, защитой от пыли и воды и тем, аналоговая рация или цифровая.",
      en: "There are 21 models in stock, from 600 000 to 3 100 000 UZS. The spread comes down to three things: range, protection against dust and water, and whether the radio is analogue or digital.",
      uz: "Mavjud 21 model narxi 600 000 dan 3 100 000 so'mgacha. Farq uchta narsaga bog'liq: masofa, chang va suvdan himoya va ratsiya analog yoki raqamli ekani.",
    },
    metaTitle: {
      ru: "Цена рации в Ташкенте — от 600 000 сум",
      en: "Two-way radio price in Tashkent — from 600 000 UZS",
      uz: "Toshkentda ratsiya narxi — 600 000 so'mdan",
    },
    metaDesc: {
      ru: "Сколько стоит рация в Ташкенте: 21 модель от 600 000 до 3 100 000 сум. От чего зависит цена, что входит в комплект и почему дешёвая выходит дороже.",
      en: "What a two-way radio costs in Tashkent: 21 models from 600 000 to 3 100 000 UZS. What sets the price, what is in the box, and why cheap ends up dearer.",
      uz: "Toshkentda ratsiya qancha turadi: 600 000 dan 3 100 000 so'mgacha 21 model. Narx nimaga bog'liq, komplektda nima bor va nega arzoni qimmatga tushadi.",
    },
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
        q: {
          ru: "Цены окончательные?",
          en: "Are the prices final?",
          uz: "Narxlar yakuniymi?",
        },
        a: {
          ru: "Цены на страницах моделей актуальны и указаны в сумах. На парк от нескольких штук считаем отдельно — напишите количество, и вернёмся с цифрой.",
          en: "The prices on the model pages are current and quoted in UZS. For a fleet of several units we quote separately — send the quantity and we will come back with a figure.",
          uz: "Model sahifalaridagi narxlar dolzarb va so'mda ko'rsatilgan. Bir nechta donadan iborat park uchun alohida hisoblaymiz — sonini yozing, raqam bilan qaytamiz.",
        },
      },
      {
        q: {
          ru: "Есть ли Trade-In?",
          en: "Is there a trade-in?",
          uz: "Trade-in bormi?",
        },
        a: {
          ru: "Да. Принесите устаревшую рацию — подберём актуальную модель Motorola или Radiocom со скидкой.",
          en: "Yes. Bring in an old radio and we will pick a current Motorola or Radiocom model at a discount.",
          uz: "Ha. Eskirgan ratsiyani olib keling — chegirma bilan zamonaviy Motorola yoki Radiocom modelini tanlaymiz.",
        },
      },
      {
        q: {
          ru: "Доставка платная?",
          en: "Is delivery charged?",
          uz: "Yetkazib berish pullikmi?",
        },
        a: {
          ru: "Нет, доставка по Узбекистану бесплатная.",
          en: "No — delivery anywhere in Uzbekistan is free.",
          uz: "Yo'q, O'zbekiston bo'ylab yetkazib berish bepul.",
        },
      },
    ],
    picks: ["rc-10", "rc-20", "rcd-50", "m-t82-extreme-quad"],
    ogCard: "cutout/hands-scattered-cutout.webp",
    related: ["how-to-choose", "analog-or-digital", "how-many-radios"],
  },

  /* ── 6. PMR or PoC ────────────────────────────────────────────────── */
  {
    slug: "pmr-or-poc",
    question: {
      ru: "Обычная рация или PoC",
      en: "A normal radio or PoC",
      uz: "Oddiy ratsiya yoki PoC",
    },
    answer: {
      ru: "Обычная рация говорит своими радиоволнами и работает там, куда добивает её антенна. PoC-рация говорит через мобильную сеть, поэтому связь есть везде, где ловит телефон, — но за неё платят ежемесячно.",
      en: "A normal radio talks on its own radio waves and works as far as its antenna reaches. A PoC radio talks over the mobile network, so it works anywhere a phone has signal — but it carries a monthly cost.",
      uz: "Oddiy ratsiya o'z radioto'lqinlarida gapiradi va antennasi yetgan joyda ishlaydi. PoC ratsiyasi mobil tarmoq orqali gapiradi, shuning uchun telefon tutadigan hamma joyda aloqa bor — lekin uning oylik to'lovi bor.",
    },
    metaTitle: {
      ru: "Обычная рация или PoC — что выбрать",
      en: "Normal radio or PoC — which to choose",
      uz: "Oddiy ratsiya yoki PoC — qaysi biri",
    },
    metaDesc: {
      ru: "Чем PoC-рация отличается от обычной: покрытие, оборудование, абонплата и сколько человек можно подключить. Что выбрать для объекта и для автопарка.",
      en: "How a PoC radio differs from a normal one: coverage, equipment, monthly cost and how many people it carries. Which suits a single site and which a fleet.",
      uz: "PoC ratsiyasi oddiydan nimasi bilan farq qiladi: qamrov, jihoz, abonent to'lovi va nechta odam ulanadi. Ob'ekt uchun va avtopark uchun qaysi biri.",
    },
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
    picks: ["rcd-70", "rcd-60", "rcd-50"],
    ogCard: "cutout/pair-floating-cutout.webp",
    related: ["real-range", "how-to-choose", "analog-or-digital"],
  },

  /* ── 7. Warranty and repair ───────────────────────────────────────── */
  {
    slug: "warranty-and-repair",
    question: {
      ru: "Что делать, если рация сломалась",
      en: "What to do if a radio breaks",
      uz: "Ratsiya buzilsa nima qilish kerak",
    },
    answer: {
      ru: "На каждую рацию из каталога действует гарантия 12 месяцев на сам аппарат. Привезите её в наш сервис в Ташкенте: диагностика покажет причину, после неё называется цена, и она больше не меняется.",
      en: "Every radio in this catalogue carries a 12-month warranty on the unit itself. Bring it to our service centre in Tashkent: the diagnosis finds the cause, a price is quoted after it, and that price does not move.",
      uz: "Katalogdagi har bir ratsiyaga apparatning o'ziga 12 oy kafolat amal qiladi. Uni Toshkentdagi servisimizga olib keling: diagnostika sababni ko'rsatadi, undan keyin narx aytiladi va u boshqa o'zgarmaydi.",
    },
    metaTitle: {
      ru: "Ремонт рации в Ташкенте — что делать",
      en: "Radio repair in Tashkent — what to do",
      uz: "Toshkentda ratsiya ta'miri — nima qilish kerak",
    },
    metaDesc: {
      ru: "Рация сломалась: что покрывает гарантия 12 месяцев, что в неё не входит, как проходит диагностика и почему цена после неё не меняется. Ташкент.",
      en: "A radio has broken: what the 12-month warranty covers, what it does not, how diagnosis works and why the price does not move after it. Tashkent.",
      uz: "Ratsiya buzildi: 12 oylik kafolat nimani qoplaydi, nima kirmaydi, diagnostika qanday o'tadi va nega undan keyin narx o'zgarmaydi. Toshkent.",
    },
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
    picks: ["rcd-70", "rcd-50", "rc-20"],
    ogCard: "cutout/macro-display-cutout.webp",
    related: ["how-to-choose", "radio-price-tashkent"],
  },

  /* ── 8. Licensing — DRAFT, NOT PUBLISHED ──────────────────────────── */
  /**
   * This page is written and deliberately unpublished.
   *
   * It is the highest-value page in the section: «нужно ли разрешение на
   * рацию» is what somebody types before they buy anything. It is also the one
   * page whose central claim this repository cannot support.
   *
   * What the catalogue does prove: 17 of the 21 visible models publish
   * 446.0–446.1 МГц in their frequency row, and four — RCD-70, RCD-60, RCD-50
   * and the Motorola T72 — publish no frequency at all. What it does not prove
   * is the legal half: whether that band is licence-exempt under Uzbek
   * regulation, and what the four undocumented models require. The HoReCa page
   * already asserts the first as a one-line FAQ answer, but a page whose whole
   * title is the licensing question makes it the site's central claim — the
   * kind an answer engine quotes verbatim — and being wrong about a regulator
   * is expensive.
   *
   * So every legally-loaded sentence below is marked `TODO-LEGAL`, and
   * `verify-answers` fails the build if a marked entry is ever un-drafted.
   * Clearing it needs the actual Госкомсвязи rule, not a better guess.
   */
  {
    slug: "radio-licence-uzbekistan",
    draft: true,
    question: {
      ru: "Нужно ли разрешение на рацию в Узбекистане",
      en: "Do you need a licence for a two-way radio in Uzbekistan",
      uz: "O'zbekistonda ratsiya uchun ruxsatnoma kerakmi",
    },
    answer: {
      ru: `${TODO_LEGAL}: подтвердить у Госкомсвязи РУз и переписать одним предложением. Черновик: большинству раций из этого каталога — 17 из 21 модели работают в диапазоне 446.0–446.1 МГц — оформление частот не требуется. Для остальных моделей мы сопровождаем оформление сами.`,
      en: `${TODO_LEGAL}: confirm with the Uzbek communications regulator and rewrite in one sentence. Draft: most radios in this catalogue — 17 of 21 models operate on 446.0–446.1 MHz — need no frequency paperwork. For the rest we handle the filing ourselves.`,
      uz: `${TODO_LEGAL}: O'zbekiston Aloqa qo'mitasi bilan tasdiqlash va bitta gap bilan qayta yozish. Qoralama: bu katalogdagi ratsiyalarning ko'pchiligi — 21 modeldan 17 tasi 446.0–446.1 MGts diapazonida ishlaydi — chastota rasmiylashtirishni talab qilmaydi. Qolganlari uchun rasmiylashtirishni o'zimiz olib boramiz.`,
    },
    metaTitle: {
      ru: "Нужно ли разрешение на рацию в Узбекистане",
      en: "Radio licence in Uzbekistan — is one needed",
      uz: "O'zbekistonda ratsiyaga ruxsatnoma kerakmi",
    },
    metaDesc: {
      ru: `${TODO_LEGAL}. Черновик: нужно ли разрешение на рацию в Узбекистане, какие модели работают без оформления частот и что мы берём на себя, если оформление нужно.`,
      en: `${TODO_LEGAL}. Draft: whether a radio licence is needed in Uzbekistan, which models work without frequency paperwork, and what we handle when paperwork is required.`,
      uz: `${TODO_LEGAL}. Qoralama: O'zbekistonda ratsiyaga ruxsatnoma kerakmi, qaysi modellar chastota rasmiylashtirishsiz ishlaydi va rasmiylashtirish kerak bo'lsa nimani o'z zimmamizga olamiz.`,
    },
    sections: [
      {
        heading: {
          ru: "Что мы точно знаем по каталогу",
          en: "What the catalogue definitely says",
          uz: "Katalog bo'yicha aniq bilganimiz",
        },
        body: {
          ru: "17 из 21 модели в наличии указывают в характеристиках диапазон 446.0–446.1 МГц. Четыре модели — RCD-70, RCD-60, RCD-50 и Motorola T72 — частоту в характеристиках не публикуют, поэтому по ним ничего утверждать нельзя без данных производителя.",
          en: "17 of the 21 models in stock state 446.0–446.1 MHz in their specifications. Four — the RCD-70, RCD-60, RCD-50 and Motorola T72 — publish no frequency, so nothing can be asserted about them without the manufacturer's data.",
          uz: "Mavjud 21 modeldan 17 tasi xususiyatlarida 446.0–446.1 MGts diapazonini ko'rsatadi. To'rtta model — RCD-70, RCD-60, RCD-50 va Motorola T72 — chastotani e'lon qilmaydi, shuning uchun ishlab chiqaruvchi ma'lumotisiz ular haqida hech narsa aytib bo'lmaydi.",
        },
      },
      {
        heading: {
          ru: "Что нужно подтвердить",
          en: "What needs confirming",
          uz: "Nimani tasdiqlash kerak",
        },
        body: {
          ru: `${TODO_LEGAL}: является ли диапазон 446 МГц безлицензионным по действующим правилам Узбекистана, есть ли ограничения по мощности, и что требуется для четырёх моделей без опубликованной частоты. До подтверждения страница не публикуется.`,
          en: `${TODO_LEGAL}: whether the 446 MHz band is licence-exempt under current Uzbek rules, whether there are power limits, and what is required for the four models with no published frequency. The page stays unpublished until this is confirmed.`,
          uz: `${TODO_LEGAL}: 446 MGts diapazoni O'zbekistonning amaldagi qoidalari bo'yicha litsenziyasizmi, quvvat cheklovlari bormi va chastotasi e'lon qilinmagan to'rtta model uchun nima talab qilinadi. Tasdiqlanmaguncha sahifa chop etilmaydi.`,
        },
      },
    ],
    faq: [],
    picks: ["m-t82-extreme", "rc-20", "rcd-70"],
    ogCard: "cutout/radio-single-cutout.webp",
    related: ["how-to-choose", "pmr-or-poc"],
  },
];

/** Published pages, in the order the index lists them. */
export const publishedAnswers: Answer[] = answers.filter((a) => !a.draft);

/** Slugs that resolve to a real page. The route's 404 guard reads this. */
export const ANSWER_SLUGS: readonly string[] = publishedAnswers.map((a) => a.slug);

export const answerBySlug = (slug: string): Answer | undefined =>
  publishedAnswers.find((a) => a.slug === slug);

/** `picks` as products, in the order given, skipping anything not visible. */
export function answerPicks(a: Answer, visible: Product[]): Product[] {
  return a.picks
    .map((id) => visible.find((p) => p.id === id))
    .filter((p): p is Product => p != null);
}
