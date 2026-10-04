/** The «what-is-dmr» answer page body. See `answers-content.ts` for why each page is a module of its own. */
import type { AnswerContent } from "@/data/answers-content";

const content: AnswerContent = {
  picks: ["rcd-70", "rcd-60", "rcd-50", "rcd-30"],
  related: ["analog-or-digital", "pmr-or-poc", "how-to-choose"],
  cta: {
    path: "/radiocom",
    anchor: {
      ru: "Цифровые рации Radiocom RCD",
      en: "Digital Radiocom RCD radios",
      uz: "Raqamli Radiocom RCD ratsiyalari",
    },
  },
  sections: [
    {
      heading: { ru: "Как работает DMR", en: "How DMR works", uz: "DMR qanday ishlaydi" },
      body: {
        ru: "DMR — стандарт Европейского института телекоммуникационных стандартов (ETSI). Рация переводит голос в цифровой поток и передаёт его кусками, по очереди в двух временных слотах одного канала (TDMA). Поэтому на одной частоте можно вести два независимых разговора, а передатчик работает только в своём слоте и расходует аккумулятор экономнее.",
        en: "DMR is a standard of the European Telecommunications Standards Institute (ETSI). The radio turns voice into a digital stream and sends it in bursts, taking turns in two time slots on one channel (TDMA). So one frequency carries two independent conversations, and the transmitter works only in its own slot, which is easier on the battery.",
        uz: "DMR — Yevropa telekommunikatsiya standartlari instituti (ETSI) standarti. Ratsiya ovozni raqamli oqimga aylantiradi va uni bitta kanalning ikki vaqt slotida navbat bilan bo'laklab uzatadi (TDMA). Shuning uchun bitta chastotada ikkita mustaqil suhbat olib borish mumkin, uzatkich esa faqat o'z slotida ishlaydi va akkumulyatorni tejamliroq sarflaydi.",
      },
    },
    {
      heading: {
        ru: "Чем DMR лучше аналоговой рации",
        en: "What DMR does better than analogue",
        uz: "DMR analog ratsiyadan nimasi bilan yaxshi",
      },
      body: {
        ru: "Цифровой звук остаётся разборчивым почти до края зоны связи и в шуме объекта, где аналог уже хрипит. В цифре переговоры можно шифровать — у Radiocom RCD-70, RCD-60 и RCD-50 PRO шифрование AES-256, — а вызывать можно одного человека, группу или всех сразу. У RCD-70 PRO есть ещё GPS, а у всех RCD PRO — аналоговый режим для связи с обычными рациями.",
        en: "Digital voice stays clear almost to the edge of coverage and over site noise, where analogue is already crackling. In digital mode calls can be encrypted — the Radiocom RCD-70, RCD-60 and RCD-50 PRO use AES-256 — and you can call one person, a group or everyone at once. The RCD-70 PRO adds GPS, and every RCD PRO has an analogue mode for talking to ordinary radios.",
        uz: "Raqamli ovoz aloqa zonasining deyarli chetigacha va ob'ekt shovqinida ham aniq qoladi, analog esa u yerda allaqachon xirillaydi. Raqamli rejimda suhbatlarni shifrlash mumkin — Radiocom RCD-70, RCD-60 va RCD-50 PRO'da AES-256 shifrlash bor — bitta odamga, guruhga yoki hammaga birdaniga qo'ng'iroq qilish mumkin. RCD-70 PRO'da GPS ham bor, barcha RCD PRO'larda esa oddiy ratsiyalar bilan aloqa uchun analog rejim mavjud.",
      },
    },
    {
      heading: {
        ru: "Кому нужна DMR-рация",
        en: "Who needs a DMR radio",
        uz: "DMR ratsiya kimga kerak",
      },
      body: {
        ru: "DMR выбирают там, где важны чистый звук в шуме и защита переговоров: на стройке, в охране, на производстве, на карьере и месторождении. Для кафе, магазина или семьи обычно хватает безлицензионных аналоговых раций диапазона 446 МГц.",
        en: "DMR is the choice where clean voice over noise and private calls matter: building sites, security, factories, quarries and oil fields. For a café, a shop or a family, licence-free analogue radios on 446 MHz are usually enough.",
        uz: "DMR shovqinda toza ovoz va suhbat himoyasi muhim bo'lgan joylarda tanlanadi: qurilishda, qo'riqlashda, ishlab chiqarishda, karyer va konda. Kafe, do'kon yoki oila uchun odatda 446 MGts diapazonidagi litsenziyasiz analog ratsiyalar yetarli.",
      },
    },
  ],
  faq: [
    {
      q: {
        ru: "Чем DMR отличается от PMR?",
        en: "How is DMR different from PMR?",
        uz: "DMR PMR'dan nimasi bilan farq qiladi?",
      },
      a: {
        ru: "DMR — цифровой стандарт связи, PMR446 — диапазон частот около 446 МГц для маломощных безлицензионных раций. Рации Motorola из нашего каталога работают в PMR446 в аналоговом режиме, цифровые Radiocom RCD — по стандарту DMR.",
        en: "DMR is a digital radio standard; PMR446 is a band around 446 MHz for low-power licence-free radios. The Motorola radios in our catalogue use PMR446 in analogue mode, while the digital Radiocom RCD radios run DMR.",
        uz: "DMR — raqamli aloqa standarti, PMR446 esa kam quvvatli litsenziyasiz ratsiyalar uchun 446 MGts atrofidagi chastota diapazoni. Katalogimizdagi Motorola ratsiyalari PMR446'da analog rejimda, raqamli Radiocom RCD esa DMR standartida ishlaydi.",
      },
    },
    {
      q: {
        ru: "Работают ли DMR-рации разных производителей вместе?",
        en: "Do DMR radios from different makers work together?",
        uz: "Turli ishlab chiqaruvchilarning DMR ratsiyalari birga ishlaydimi?",
      },
      a: {
        ru: "DMR — открытый стандарт, поэтому рации разных производителей, как правило, связываются в цифре, если настроены на одну частоту, цветовой код и группу. Совместимость конкретных моделей лучше проверить на тесте.",
        en: "DMR is an open standard, so radios from different makers usually talk in digital mode when set to the same frequency, colour code and group. It is worth checking specific models together on a trial.",
        uz: "DMR ochiq standart, shuning uchun turli ishlab chiqaruvchilarning ratsiyalari bitta chastota, rang kodi va guruhga sozlanganda odatda raqamli rejimda bog'lanadi. Aniq modellar mosligini sinovda tekshirgan ma'qul.",
      },
    },
    {
      q: {
        ru: "Какие рации Radiocom поддерживают DMR?",
        en: "Which Radiocom radios support DMR?",
        uz: "Qaysi Radiocom ratsiyalari DMR'ni qo'llab-quvvatlaydi?",
      },
      a: {
        ru: "RCD-70 PRO, RCD-60 PRO, RCD-50 PRO и RCD-30 PRO. Все они работают и в аналоговом режиме.",
        en: "The RCD-70 PRO, RCD-60 PRO, RCD-50 PRO and RCD-30 PRO. All of them also work in analogue mode.",
        uz: "RCD-70 PRO, RCD-60 PRO, RCD-50 PRO va RCD-30 PRO. Ularning barchasi analog rejimda ham ishlaydi.",
      },
    },
  ],
};

export default content;
