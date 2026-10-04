/** The «real-range» answer page body. See `answers-content.ts` for why each page is a module of its own. */
import type { AnswerContent } from "@/data/answers-content";

const content: AnswerContent = {
  picks: ["rcd-70", "rcd-60", "m-t82-extreme", "m-t42-red"],
  related: ["how-to-choose", "pmr-or-poc", "analog-or-digital"],
  cta: {
    path: "/compare",
    anchor: {
      ru: "Сравнение раций по дальности",
      en: "Compare radios by range",
      uz: "Ratsiyalarni masofa bo'yicha solishtirish",
    },
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
};

export default content;
