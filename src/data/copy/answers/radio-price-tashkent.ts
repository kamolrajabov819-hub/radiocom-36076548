/** The «radio-price-tashkent» answer page body. See `answers-content.ts` for why each page is a module of its own. */
import type { AnswerContent } from "@/data/answers-content";

const content: AnswerContent = {
  picks: ["rc-10", "rc-20", "rcd-50", "m-t82-extreme-quad"],
  related: ["how-to-choose", "analog-or-digital", "how-many-radios"],
  cta: {
    path: "/",
    anchor: {
      ru: "Рации в Ташкенте",
      en: "Two-way radios in Tashkent",
      uz: "Toshkentda ratsiyalar",
    },
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
};

export default content;
