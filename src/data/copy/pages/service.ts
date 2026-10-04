/**
 * /service — «ремонт раций в Ташкенте» / «ratsiya ta'mirlash Toshkentda».
 *
 * Secondary: «ремонт рации Motorola», «сервисный центр раций», «настройка
 * раций», «цена ремонта рации». Claims are the page's own (`service.*`: the
 * four-step flow, original parts, a price fixed after diagnosis, requests
 * taken round the clock), the warranty answer's (12 months on the radio, not
 * batteries or accessories; radios bought elsewhere repaired too), and
 * Vertex Standard from the service meta, which the owner's keyword map keeps.
 *
 * Deliberately absent: a repair price table. The map asks for one, and no
 * repair price is on record — it is an owner question, not a guess.
 * The FAQ adds four repair questions to the three return-policy rows already
 * on the page; `Service.tsx` emits one FAQPage covering all seven.
 */
import type { PageCopy } from "@/data/copy/pick";

const copy: PageCopy = {
  sections: [
    {
      heading: {
        ru: "Какие рации ремонтируем",
        en: "The radios we repair",
        uz: "Qaysi ratsiyalarni ta'mirlaymiz",
      },
      body: [
        {
          ru: "Наш сервисный центр в Ташкенте ремонтирует рации Motorola, Radiocom и Vertex Standard — по гарантии и после неё. Мы авторизованный сервис Motorola и Radiocom, поэтому берём в ремонт и рации, купленные не у нас.",
          en: "Our service centre in Tashkent repairs Motorola, Radiocom and Vertex Standard radios, under warranty and after it. We are an authorised Motorola and Radiocom service centre, so we also repair radios that were not bought from us.",
          uz: "Toshkentdagi servis markazimiz Motorola, Radiocom va Vertex Standard ratsiyalarini kafolat davrida ham, undan keyin ham ta'mirlaydi. Biz Motorola va Radiocom'ning vakolatli servisimiz, shuning uchun boshqa joydan sotib olingan ratsiyalarni ham ta'mirga olamiz.",
        },
        {
          ru: "Диагностика покажет причину, с чем бы вы ни пришли: рация не включается или не заряжается, шипит, пропала связь, износился аккумулятор или сломалась антенна.",
          en: "Diagnosis finds the cause whatever you bring in: a radio that will not switch on or charge, hisses, has lost its signal, or has a worn battery or a broken antenna.",
          uz: "Qanday muammo bilan kelmang, diagnostika sababini ko'rsatadi: ratsiya yoqilmayapti yoki zaryad olmayapti, shovqin qilyapti, aloqa yo'qolgan, akkumulyator eskirgan yoki antenna singan.",
        },
      ],
    },
    {
      heading: {
        ru: "Как проходит ремонт рации",
        en: "How a radio repair works",
        uz: "Ratsiya ta'miri qanday o'tadi",
      },
      body: [
        {
          ru: "Сначала принимаем рацию и фиксируем неисправность, затем находим причину на профильном оборудовании и называем фиксированную цену — после диагностики она не меняется. Ремонтируем только оригинальными запчастями, а перед возвратом проверяем связь и параметры передатчика.",
          en: "First we take the radio in and log the fault, then find the cause on dedicated test equipment and give you a fixed price — after diagnosis it does not change. We repair with original parts only, and check the signal and the transmitter before we hand the radio back.",
          uz: "Avval ratsiyani qabul qilib, nosozlikni qayd etamiz, so'ng sababini maxsus uskunada aniqlaymiz va qat'iy narxni aytamiz — diagnostikadan keyin u o'zgarmaydi. Faqat original ehtiyot qismlar bilan ta'mirlaymiz, qaytarishdan oldin esa aloqa va uzatkich parametrlarini tekshiramiz.",
        },
        {
          ru: "Гарантия на рации из нашего каталога — 12 месяцев на сам аппарат; аккумуляторы и аксессуары она не покрывает. Что делать, если рация сломалась, мы разобрали в статье [гарантия и ремонт раций](/answers/warranty-and-repair).",
          en: "Radios from our catalogue carry a 12-month warranty on the radio itself; batteries and accessories are not covered. What to do when a radio breaks is in our piece on [warranty and repair](/answers/warranty-and-repair).",
          uz: "Katalogimizdagi ratsiyalarga 12 oylik kafolat qurilmaning o'ziga beriladi; akkumulyator va aksessuarlarga u tegishli emas. Ratsiya buzilsa nima qilish kerakligini [kafolat va ta'mir](/answers/warranty-and-repair) maqolasida yozganmiz.",
        },
      ],
    },
    {
      heading: {
        ru: "Настройка раций",
        en: "Setting radios up",
        uz: "Ratsiyalarni sozlash",
      },
      body: [
        {
          ru: "Кроме ремонта, мы настраиваем рации: выставляем общие каналы и коды, чтобы вся смена говорила на одной волне. Заявку на ремонт или настройку можно оставить в любое время, включая выходные. Новые рации на замену — на страницах [рации Radiocom](/radiocom) и [рации Motorola](/motorola).",
          en: "Besides repairs, we set radios up: shared channels and codes, so the whole shift talks on one wave. You can leave a repair or setup request at any time, weekends included. Replacement radios are on the [Radiocom radios](/radiocom) and [Motorola radios](/motorola) pages.",
          uz: "Ta'mirdan tashqari, ratsiyalarni sozlaymiz: butun smena bitta to'lqinda gaplashishi uchun umumiy kanal va kodlarni o'rnatamiz. Ta'mir yoki sozlash uchun arizani istalgan vaqtda, dam olish kunlari ham qoldirish mumkin. Almashtirish uchun yangi ratsiyalar — [Radiocom ratsiyalari](/radiocom) va [Motorola ratsiyalari](/motorola) sahifalarida.",
        },
      ],
    },
  ],
  faq: [
    {
      q: {
        ru: "Какие рации вы ремонтируете?",
        en: "Which radios do you repair?",
        uz: "Qaysi ratsiyalarni ta'mirlaysiz?",
      },
      a: {
        ru: "Рации Motorola, Radiocom и Vertex Standard — по гарантии и после неё. Мы авторизованный сервисный центр Motorola и Radiocom, поэтому ремонтируем и рации, купленные не у нас.",
        en: "Motorola, Radiocom and Vertex Standard radios, under warranty and after it. We are an authorised Motorola and Radiocom service centre, so we also repair radios bought elsewhere.",
        uz: "Motorola, Radiocom va Vertex Standard ratsiyalarini — kafolat davrida ham, undan keyin ham. Biz Motorola va Radiocom'ning vakolatli servis markazimiz, shuning uchun boshqa joydan olingan ratsiyalarni ham ta'mirlaymiz.",
      },
    },
    {
      q: {
        ru: "Сколько стоит ремонт рации?",
        en: "How much does a radio repair cost?",
        uz: "Ratsiya ta'miri qancha turadi?",
      },
      a: {
        ru: "Стоимость зависит от неисправности, поэтому мы называем её после диагностики — и после этого она не меняется.",
        en: "It depends on the fault, so we quote it after diagnosis — and from then on the price does not change.",
        uz: "Narx nosozlikka bog'liq, shuning uchun uni diagnostikadan keyin aytamiz — va shundan keyin u o'zgarmaydi.",
      },
    },
    {
      q: {
        ru: "Сколько длится ремонт рации?",
        en: "How long does a repair take?",
        uz: "Ratsiya ta'miri qancha vaqt oladi?",
      },
      a: {
        ru: "Срок зависит от неисправности и от того, есть ли нужная запчасть. Мы называем его вместе с ценой, когда диагностика закончена.",
        en: "That depends on the fault and on whether the part is in stock. We give you the time together with the price, once diagnosis is done.",
        uz: "Muddat nosozlikka va kerakli ehtiyot qism bor-yo'qligiga bog'liq. Uni diagnostika tugagach, narx bilan birga aytamiz.",
      },
    },
    {
      q: {
        ru: "Можно ли спасти утопленную рацию?",
        en: "Can a radio that went under water be saved?",
        uz: "Suvga tushgan ratsiyani tiklash mumkinmi?",
      },
      a: {
        ru: "Иногда да. Привозите её на диагностику: после разборки станет ясно, можно ли её отремонтировать, и мы скажем, что выгоднее — ремонт или новая рация.",
        en: "Sometimes. Bring it in for diagnosis: once it is opened up we can tell whether it can be repaired, and which costs less, the repair or a new radio.",
        uz: "Ba'zan mumkin. Uni diagnostikaga olib keling: ochib ko'rgandan keyin ta'mirlash mumkinligi ma'lum bo'ladi, biz esa nima arzonroq — ta'mirmi yoki yangi ratsiyami — aytamiz.",
      },
    },
  ],
};

export default copy;
