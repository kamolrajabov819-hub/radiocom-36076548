/** The «warranty-and-repair» answer page body. See `answers-content.ts` for why each page is a module of its own. */
import type { AnswerContent } from "@/data/answers-content";

const content: AnswerContent = {
  picks: ["rcd-70", "rcd-50", "rc-20"],
  related: ["how-to-choose", "radio-price-tashkent"],
  cta: {
    path: "/service",
    anchor: {
      ru: "Ремонт раций в Ташкенте",
      en: "Two-way radio repair in Tashkent",
      uz: "Toshkentda ratsiya ta'mirlash",
    },
  },
  sections: [
    {
      heading: {
        ru: "Что покрывает гарантия",
        en: "What the warranty covers",
        uz: "Kafolat nimani qoplaydi",
      },
      body: {
        ru: "Гарантия 12 месяцев распространяется на саму рацию. Аксессуары и аккумуляторы она не покрывает — это расходники, и их ресурс зависит от того, сколько циклов заряда они прошли. Это стандартное условие, а не исключение конкретной модели.",
        en: "The 12-month warranty applies to the radio itself. It does not cover accessories and batteries — those are consumables, and their life depends on how many charge cycles they have been through. That is a standard condition, not an exception for one model.",
        uz: "12 oylik kafolat ratsiyaning o'ziga tegishli. U aksessuarlar va akkumulyatorlarni qoplamaydi — bular sarf materiallari va ularning resursi qancha quvvatlash sikli o'tganiga bog'liq. Bu muayyan modelning istisnosi emas, standart shart.",
      },
    },
    {
      heading: {
        ru: "Как проходит ремонт",
        en: "How the repair goes",
        uz: "Ta'mirlash qanday o'tadi",
      },
      body: {
        ru: "Четыре шага: принимаем и фиксируем неисправность, находим причину на профильном оборудовании, называем фиксированную цену, ремонтируем оригинальными запчастями и проверяем передатчик перед возвратом. Цена, названная после диагностики, дальше не растёт.",
        en: "Four steps: we take the radio in and record the fault, find the cause on proper test equipment, quote a fixed price, then repair with original parts and check the transmitter before handing it back. The price quoted after diagnosis does not rise afterwards.",
        uz: "To'rt bosqich: ratsiyani qabul qilib, nosozlikni qayd etamiz, maxsus jihozda sababni topamiz, qat'iy narx aytamiz, original ehtiyot qismlar bilan ta'mirlaymiz va qaytarishdan oldin uzatgichni tekshiramiz. Diagnostikadan keyin aytilgan narx keyin oshmaydi.",
      },
    },
    {
      heading: {
        ru: "Если гарантия закончилась",
        en: "If the warranty has expired",
        uz: "Kafolat tugagan bo'lsa",
      },
      body: {
        ru: "Чиним и после гарантии, теми же оригинальными запчастями и по той же схеме с фиксированной ценой. Мы авторизованный сервисный центр Motorola и Radiocom, поэтому ремонтируем и то, что куплено не у нас.",
        en: "We repair after the warranty too, with the same original parts and the same fixed-price process. We are an authorised Motorola and Radiocom service centre, so we also take radios that were not bought here.",
        uz: "Kafolatdan keyin ham ta'mirlaymiz, o'sha original ehtiyot qismlar bilan va o'sha qat'iy narx sxemasi bo'yicha. Biz Motorola va Radiocom'ning rasmiy servis markazimiz, shuning uchun bizdan sotib olinmagan ratsiyalarni ham olamiz.",
      },
    },
  ],
  faq: [
    {
      q: {
        ru: "Сколько занимает ремонт?",
        en: "How long does a repair take?",
        uz: "Ta'mirlash qancha vaqt oladi?",
      },
      a: {
        ru: "Зависит от неисправности и наличия запчасти. Точный срок называем вместе с ценой — после диагностики, а не до неё.",
        en: "It depends on the fault and on parts availability. We give the exact time along with the price — after the diagnosis, not before it.",
        uz: "Nosozlik va ehtiyot qism mavjudligiga bog'liq. Aniq muddatni narx bilan birga aytamiz — diagnostikadan keyin, undan oldin emas.",
      },
    },
    {
      q: {
        ru: "Что если рация утонула или её раздавило?",
        en: "What if the radio drowned or was crushed?",
        uz: "Ratsiya suvga tushsa yoki ezilsa-chi?",
      },
      a: {
        ru: "Приносите — посмотрим. Часть таких случаев ремонтируется, часть нет, и это видно только после разборки. Диагностика покажет, что дешевле: ремонт или замена.",
        en: "Bring it in and we will look. Some of those are repairable and some are not, and it only shows once it is opened up. The diagnosis tells you which is cheaper: repair or replacement.",
        uz: "Olib keling — ko'ramiz. Bunday holatlarning bir qismi ta'mirlanadi, bir qismi yo'q, bu faqat ochilgandan keyin ma'lum bo'ladi. Diagnostika qaysi biri arzonroq ekanini ko'rsatadi: ta'mir yoki almashtirish.",
      },
    },
  ],
};

export default content;
