/**
 * /industries — «рации для бизнеса» / «biznes uchun ratsiyalar».
 *
 * The hub's job in the link graph is to hand each industry page its own
 * primary keyword as anchor text — «рации для стройки», «рации для охраны»…
 * (docs/seo/keyword-map.md) — and to say how the choice is made. The claims
 * are the industry pages' own: the free site visit, the free trial, the
 * 12-month warranty, PoC where ordinary range runs out.
 */
import type { PageCopy } from "@/data/copy/pick";

const copy: PageCopy = {
  sections: [
    {
      heading: {
        ru: "Корпоративная радиосвязь для предприятий",
        en: "Business radio for companies",
        uz: "Korxonalar uchun korporativ radioaloqa",
      },
      body: [
        {
          ru: "Рации для бизнеса выбирают не по каталогу, а по объекту: стройке нужна защита от пыли и воды, охране — шифрование, ресторану — незаметные гарнитуры, автопарку — связь на трассе. Поэтому подбор собран по отраслям: [рации для стройки](/industries/construction), [рации для охраны](/industries/security), [рации для ресторана](/industries/horeca), [рации для производства](/industries/manufacturing), [рации для логистики](/industries/transport) и [рации для горнодобывающей отрасли](/industries/mining).",
          en: "Business radios are chosen by the site, not the catalogue: a building site needs dust and water protection, security needs encryption, a restaurant needs discreet earpieces, a fleet needs signal on the road. So the choice is laid out by industry: [radios for construction](/industries/construction), [radios for security](/industries/security), [radios for restaurants](/industries/horeca), [radios for manufacturing](/industries/manufacturing), [radios for logistics](/industries/transport) and [radios for mining](/industries/mining).",
          uz: "Biznes uchun ratsiyalar katalog bo'yicha emas, ob'ekt bo'yicha tanlanadi: qurilishga chang va suvdan himoya, qo'riqlashga shifrlash, restoranga sezilmaydigan garnitura, avtoparkka yo'lda aloqa kerak. Shuning uchun tanlov sohalar bo'yicha tuzilgan: [qurilish uchun ratsiyalar](/industries/construction), [qo'riqlash uchun ratsiyalar](/industries/security), [restoran uchun ratsiyalar](/industries/horeca), [ishlab chiqarish uchun ratsiyalar](/industries/manufacturing), [logistika uchun ratsiyalar](/industries/transport) va [kon sanoati uchun ratsiyalar](/industries/mining).",
        },
      ],
    },
    {
      heading: {
        ru: "Как мы подбираем рации для предприятия",
        en: "How we choose radios for a company",
        uz: "Korxona uchun ratsiyalarni qanday tanlaymiz",
      },
      body: [
        {
          ru: "Сначала — бесплатный выезд на объект: смотрим расстояния, этажи и условия работы. Затем привозим рации на тест, и вы проверяете связь в своей смене до покупки. Если обычной дальности не хватает, предлагаем [PoC-рации](/poc), которые работают через мобильную сеть. На каждую рацию — гарантия 12 месяцев и ремонт в нашем [сервисном центре](/service).",
          en: "First, a free visit to the site: we look at the distances, the floors and the working conditions. Then we bring radios for a trial, and you check the signal on your own shift before you buy. Where ordinary range falls short, we offer [PoC radios](/poc), which work over the mobile network. Every radio carries a 12-month warranty and is repaired in our [service centre](/service).",
          uz: "Avval — ob'ektga bepul chiqish: masofalar, qavatlar va ish sharoitini ko'ramiz. Keyin ratsiyalarni sinovga olib boramiz va siz sotib olishdan oldin aloqani o'z smenangizda tekshirasiz. Oddiy masofa yetmasa, mobil tarmoq orqali ishlaydigan [PoC ratsiyalar](/poc)ni taklif qilamiz. Har bir ratsiyaga 12 oy kafolat, ta'mir esa [servis markazimizda](/service).",
        },
      ],
    },
  ],
  faq: [],
};

export default copy;
