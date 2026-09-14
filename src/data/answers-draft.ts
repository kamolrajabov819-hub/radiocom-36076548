/**
 * Answer pages that are written but not published.
 *
 * Nothing under `src/` imports this file, and that is the whole point. A draft
 * exists so its text can be reviewed in the repo before it becomes a claim the
 * site makes; a `draft: true` flag filtered at runtime does not achieve that,
 * because the filtered-out text still ships inside the JS bundle. It was
 * measurably doing so — `TODO-LEGAL` and «Госкомсвязи» were both greppable in
 * the built entry chunk while the page rendered nowhere. Keeping drafts in a
 * module only the build scripts read is what makes "unpublished" true of the
 * delivered site rather than only of the router.
 *
 * `verify-answers` reads this file, concatenates it with the published set and
 * applies every rule to both, so a draft is held to the same standard as a live
 * page. One rule is the interlock: a `TODO-LEGAL` marker is allowed here and
 * nowhere else.
 *
 * ── The one draft, and what would clear it ──────────────────────────────────
 *
 * `radio-licence-uzbekistan` is the highest-value page in the section and the
 * one this repository cannot finish. The catalogue proves 17 of 21 visible
 * models publish 446.0–446.1 МГц and that four publish no frequency at all.
 * Whether that band is licence-exempt under Uzbek law is a legal question no
 * file here can settle, and the site already implies an answer on the HoReCa
 * page. Clearing it needs the actual Госкомсвязи РУз rule — not a better guess
 * — after which the marked sentences get rewritten and the record moves into
 * `answers.ts` and `answers-content.ts` unchanged in shape.
 */
import type { Answer } from "./answers";
import type { AnswerContent } from "./answers-content";

export const draftAnswers: Answer[] = [
  {
    slug: "radio-licence-uzbekistan",
    draft: true,
    question: {
      ru: "Нужно ли разрешение на рацию в Узбекистане",
      en: "Do you need a licence for a two-way radio in Uzbekistan",
      uz: "O'zbekistonda ratsiya uchun ruxsatnoma kerakmi",
    },
    answer: {
      ru: "TODO-LEGAL: подтвердить у Госкомсвязи РУз и переписать одним предложением. Черновик: большинству раций из этого каталога — 17 из 21 модели работают в диапазоне 446.0–446.1 МГц — оформление частот не требуется. Для остальных моделей мы сопровождаем оформление сами.",
      en: "TODO-LEGAL: confirm with the Uzbek communications regulator and rewrite in one sentence. Draft: most radios in this catalogue — 17 of 21 models operate on 446.0–446.1 MHz — need no frequency paperwork. For the rest we handle the filing ourselves.",
      uz: "TODO-LEGAL: O'zbekiston Aloqa qo'mitasi bilan tasdiqlash va bitta gap bilan qayta yozish. Qoralama: bu katalogdagi ratsiyalarning ko'pchiligi — 21 modeldan 17 tasi 446.0–446.1 MGts diapazonida ishlaydi — chastota rasmiylashtirishni talab qilmaydi. Qolganlari uchun rasmiylashtirishni o'zimiz olib boramiz.",
    },
    metaTitle: {
      ru: "Нужно ли разрешение на рацию в Узбекистане",
      en: "Radio licence in Uzbekistan — is one needed",
      uz: "O'zbekistonda ratsiyaga ruxsatnoma kerakmi",
    },
    metaDesc: {
      ru: "TODO-LEGAL. Черновик: нужно ли разрешение на рацию в Узбекистане, какие модели работают без оформления частот и что мы берём на себя, если оформление нужно.",
      en: "TODO-LEGAL. Draft: whether a radio licence is needed in Uzbekistan, which models work without frequency paperwork, and what we handle when paperwork is required.",
      uz: "TODO-LEGAL. Qoralama: O'zbekistonda ratsiyaga ruxsatnoma kerakmi, qaysi modellar chastota rasmiylashtirishsiz ishlaydi va rasmiylashtirish kerak bo'lsa nimani o'z zimmamizga olamiz.",
    },
    ogCard: "cutout/radio-single-cutout.webp",
  },
];

export const draftContent: Record<string, AnswerContent> = {
  "radio-licence-uzbekistan": {
    picks: ["m-t82-extreme", "rc-20", "rcd-70"],
    related: ["how-to-choose", "pmr-or-poc"],
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
          ru: "TODO-LEGAL: является ли диапазон 446 МГц безлицензионным по действующим правилам Узбекистана, есть ли ограничения по мощности, и что требуется для четырёх моделей без опубликованной частоты. До подтверждения страница не публикуется.",
          en: "TODO-LEGAL: whether the 446 MHz band is licence-exempt under current Uzbek rules, whether there are power limits, and what is required for the four models with no published frequency. The page stays unpublished until this is confirmed.",
          uz: "TODO-LEGAL: 446 MGts diapazoni O'zbekistonning amaldagi qoidalari bo'yicha litsenziyasizmi, quvvat cheklovlari bormi va chastotasi e'lon qilinmagan to'rtta model uchun nima talab qilinadi. Tasdiqlanmaguncha sahifa chop etilmaydi.",
        },
      },
    ],
    faq: [],
  },
};
