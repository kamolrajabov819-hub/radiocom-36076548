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
 * ── What is in this module, and what is not ─────────────────────────────────
 *
 * Only the fields `head()` needs: the question, the direct answer, the two
 * search-result strings, and the links. The body copy lives in
 * `answers-content.ts`, because `head` cannot be code-split and everything it
 * imports ships to every route — see that file for the measurement.
 *
 * ── Why this is a data file and not `ru.json` ───────────────────────────────
 *
 * The locale JSONs exist for UI strings, and `verify-i18n`'s rules are tuned
 * for labels: it skips anything under 40 characters, and compares translated
 * length against the Russian to catch a missing clause. Long-form prose would
 * drown those rules in noise. `specs.ts` and `products.ts` already carry
 * localised prose this way, in the same `{ ru, en, uz }` shape read through the
 * same `pick()`. `qa-i18n-rendered` still catches an untranslated page, because
 * it fails on stray Cyrillic in the rendered en/uz output.
 *
 * ── Prose written for citation ──────────────────────────────────────────────
 *
 * Every page opens with `answer`: two sentences that answer the question
 * completely, before any preamble. That is the passage Google lifts for a
 * featured snippet and the passage an answer engine quotes, and it only works
 * if it stands alone with no antecedent pointing at a sentence the quoter did
 * not take. The reasoning comes after it, never before.
 *
 * ── Every number here is traceable ──────────────────────────────────────────
 *
 * Figures come from `products.ts` and `specs.ts` and nowhere else — 21 visible
 * models, 600 000–3 100 000 сум, 300 м–3 км in town against 3–10 км in the
 * open. `verify-answers` re-derives them from the catalogue and fails when the
 * prose and the data disagree, which is what stops the copy going stale the
 * next time a price list lands.
 */
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
   * page. It must make sense quoted on its own.
   */
  answer: L;
  /** `<=65` characters once " | Radiocom" is appended — `verify-snippets` enforces. */
  metaTitle: L;
  /** 70-160 characters. */
  metaDesc: L;
  /** Source image under `src/assets/`, mapped in `scripts/build-og-images.ts`. */
  ogCard: string;
  /**
   * Written, but not published.
   *
   * Drafts live in `answers-draft.ts`, which nothing in `src/` imports, so an
   * unpublished page reaches no route, no sitemap, no `llms.txt` — and no JS
   * chunk. That last one is why the file is separate rather than a `draft: true`
   * flag filtered at runtime: a filtered array still ships the text it filters
   * out, so the draft's unconfirmed sentences were being served to every visitor
   * inside the entry chunk while reading as "not published". `verify-answers`
   * requires that anything containing a `TODO-LEGAL` marker is a draft — the
   * interlock that stops an unconfirmed legal claim reaching production.
   *
   * One page is a draft today: `radio-licence-uzbekistan`. The catalogue proves
   * 17 of 21 visible models publish 446.0–446.1 МГц and that four publish no
   * frequency at all, but whether that band is licence-exempt under Uzbek law
   * is a legal question this repository cannot settle. Clearing it needs the
   * actual Госкомсвязи РУз rule, not a better guess.
   */
  draft?: true;
};

/** Marker for a sentence that needs human confirmation before it can publish. */
export const TODO_LEGAL = "TODO-LEGAL";

export const publishedAnswers: Answer[] = [
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
    ogCard: "cutout/hands-compare-cutout.webp",
  },
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
    ogCard: "cutout/radios-fan-cutout.webp",
  },
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
    ogCard: "cutout/lineup-seven-cutout.webp",
  },
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
    ogCard: "cutout/four-arranged-cutout.webp",
  },
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
    ogCard: "cutout/hands-scattered-cutout.webp",
  },
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
    ogCard: "cutout/pair-floating-cutout.webp",
  },
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
    ogCard: "cutout/macro-display-cutout.webp",
  },
];

export const answerBySlug = (slug: string): Answer | undefined =>
  publishedAnswers.find((a) => a.slug === slug);
