/** The «how-to-choose» answer page body. See `answers-content.ts` for why each page is a module of its own. */
import type { AnswerContent } from "@/data/answers-content";

const content: AnswerContent = {
  picks: ["rc-20", "rcd-50", "m-t82-extreme", "rcd-70"],
  related: ["real-range", "analog-or-digital", "radio-price-tashkent"],
  cta: {
    path: "/compare",
    anchor: {
      ru: "Сравнение раций",
      en: "Compare two-way radios",
      uz: "Ratsiyalarni solishtirish",
    },
  },
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
};

export default content;
