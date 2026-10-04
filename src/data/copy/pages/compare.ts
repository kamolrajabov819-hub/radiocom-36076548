/**
 * /compare — «сравнение раций» / «ratsiyalarni solishtirish».
 *
 * The three H2s are the queries the map parks here until their own pages
 * exist: «рации дальнего действия» (until /long-range), «самые защищённые
 * рации», «лучшие рации до 1 000 000 сум». Each answers with the models the
 * catalogue actually puts in that set — `{{longRange}}`, `{{ip67}}`,
 * `{{under1m}}` are computed from products.ts and specs.ts, so the lists move
 * when the range does. «Как выбрать рацию» is deliberately not here: it belongs
 * to /answers/how-to-choose, and this page links to it instead.
 */
import type { PageCopy } from "@/data/copy/pick";

const copy: PageCopy = {
  sections: [
    {
      heading: {
        ru: "Рации дальнего действия",
        en: "Long-range radios",
        uz: "Uzoq masofali ratsiyalar",
      },
      body: [
        {
          ru: "На открытой местности дальше всех работают {{maxOpenModels}} — {{maxOpen}} по данным производителя. От 6 км по паспорту берут {{longRange}}.",
          en: "In open country the {{maxOpenModels}} reach furthest, {{maxOpen}} by the manufacturer's figures. Rated at 6 km or more: {{longRange}}.",
          uz: "Ochiq joyda eng uzoqqa {{maxOpenModels}} ishlaydi — ishlab chiqaruvchi ma'lumotiga ko'ra {{maxOpen}}. Pasport bo'yicha 6 km va undan ko'proq masofani {{longRange}} beradi.",
        },
        {
          ru: "В городе дальность в разы меньше: бетон, металл и этажи гасят сигнал, поэтому цифры в таблице — верхняя граница, а не обещание. Почему так и чего ждать на практике, мы разобрали в статье [дальность рации](/answers/real-range), а выбрать модель под объект поможет разбор [как выбрать рацию](/answers/how-to-choose).",
          en: "In town the range is several times shorter: concrete, steel and floors soak up the signal, so the figures in the table are a ceiling, not a promise. Why, and what to expect in practice, is in our piece on [real radio range](/answers/real-range); for picking a model for your site, see [how to choose a radio](/answers/how-to-choose).",
          uz: "Shaharda masofa bir necha baravar kam: beton, metall va qavatlar signalni so'ndiradi, shuning uchun jadvaldagi raqamlar va'da emas, yuqori chegaradir. Buning sababi va amalda nimani kutish kerakligini [ratsiya necha km ishlaydi](/answers/real-range) maqolasida tushuntirganmiz, ob'ektga model tanlashda esa [ratsiyani qanday tanlash kerak](/answers/how-to-choose) yordam beradi.",
        },
      ],
    },
    {
      heading: {
        ru: "Самые защищённые рации (IP67)",
        en: "The toughest radios (IP67)",
        uz: "Eng himoyalangan ratsiyalar (IP67)",
      },
      body: [
        {
          ru: "Класс IP67 означает, что пыль внутрь не проникает, а рация выдерживает кратковременное погружение в воду. Такая защита у {{ip67}} — это выбор для стройки, карьера, улицы и воды. Для дождя и брызг хватает IP54–IP55: такой класс у большинства профессиональных раций Radiocom.",
          en: "IP67 means dust cannot get inside and the radio survives a brief immersion in water. The {{ip67}} carry it — the choice for building sites, quarries, outdoor work and water. For rain and splashes IP54–IP55 is enough, and most professional Radiocom radios have it.",
          uz: "IP67 darajasi chang ichkariga kirmasligini va ratsiya suvga qisqa muddat cho'mishga chidashini bildiradi. Bunday himoya {{ip67}} modellarida bor — bu qurilish, karyer, ochiq havo va suv uchun tanlov. Yomg'ir va sachrashlar uchun IP54–IP55 yetarli: professional Radiocom ratsiyalarining ko'pchiligida aynan shunday himoya.",
        },
      ],
    },
    {
      heading: {
        ru: "Лучшие рации до 1 000 000 сум",
        en: "The best radios under 1 000 000 UZS",
        uz: "1 000 000 so'mgacha eng yaxshi ratsiyalar",
      },
      body: [
        {
          ru: "До 1 000 000 сум за комплект стоят {{under1m}} — безлицензионные Motorola Talkabout для семьи, отдыха и небольшого кафе. Если нужна дальность и защита для работы на объекте, сравните их с [рациями Radiocom](/radiocom), а для отеля и ресторана посмотрите подбор [раций для ресторана](/industries/horeca).",
          en: "Up to 1 000 000 UZS per kit you get the {{under1m}} — licence-free Motorola Talkabouts for families, the outdoors and a small café. If you need range and protection for work on site, compare them with [Radiocom radios](/radiocom); for a hotel or restaurant, see our pick of [radios for restaurants](/industries/horeca).",
          uz: "Komplekt uchun 1 000 000 so'mgacha {{under1m}} turadi — oila, dam olish va kichik kafe uchun litsenziyasiz Motorola Talkabout. Ob'ektda ishlash uchun masofa va himoya kerak bo'lsa, ularni [Radiocom ratsiyalari](/radiocom) bilan solishtiring, mehmonxona va restoran uchun esa [restoran uchun ratsiyalar](/industries/horeca) tanlovini ko'ring.",
        },
      ],
    },
  ],
  faq: [],
};

export default copy;
