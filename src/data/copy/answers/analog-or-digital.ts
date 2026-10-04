/** The «analog-or-digital» answer page body. See `answers-content.ts` for why each page is a module of its own. */
import type { AnswerContent } from "@/data/answers-content";

const content: AnswerContent = {
  picks: ["rc-20", "rc-50", "rcd-50", "rcd-70"],
  related: ["how-to-choose", "real-range", "radio-price-tashkent"],
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
};

export default content;
