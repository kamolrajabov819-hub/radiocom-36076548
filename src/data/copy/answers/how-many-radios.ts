/** The «how-many-radios» answer page body. See `answers-content.ts` for why each page is a module of its own. */
import type { AnswerContent } from "@/data/answers-content";

const content: AnswerContent = {
  picks: ["m-xt185", "rc-20", "m-t42-quad", "rcd-50"],
  related: ["how-to-choose", "radio-price-tashkent", "real-range"],
  cta: {
    path: "/industries",
    anchor: { ru: "Рации для бизнеса", en: "Radios for business", uz: "Biznes uchun ratsiyalar" },
  },
  sections: [
    {
      heading: {
        ru: "Считайте по ролям, а не по головам",
        en: "Count roles, not heads",
        uz: "Bosh emas, rol bo'yicha hisoblang",
      },
      body: {
        ru: "Рация нужна тому, кто принимает решение или сообщает о проблеме. В ресторане это хостес, менеджер зала, шеф, бар, склад и один официант на зал. Посудомойщику рация не нужна — и это нормально, парк не должен совпадать со штатным расписанием.",
        en: "A radio belongs to whoever makes a decision or reports a problem. In a restaurant that is the host, the floor manager, the chef, the bar, the store room and one waiter per room. The dishwasher does not need one — and that is fine: the fleet does not have to match the payroll.",
        uz: "Ratsiya qaror qabul qiladigan yoki muammo haqida xabar beradigan kishiga kerak. Restoranda bu xostes, zal menejeri, oshpaz, bar, ombor va zalga bitta ofitsiant. Idish yuvuvchiga ratsiya kerak emas — bu normal, park shtat jadvaliga mos kelishi shart emas.",
      },
    },
    {
      heading: {
        ru: "Одна запасная всегда на зарядке",
        en: "One spare always on charge",
        uz: "Bitta zaxira doim quvvatda",
      },
      body: {
        ru: "Это правило экономит больше, чем стоит. Рация садится, падает или уходит со сменщиком — и без запасной кто-то остаётся без связи в худший момент. Одна лишняя на каждые пять-шесть работающих закрывает почти все такие случаи.",
        en: "This rule saves more than it costs. A radio goes flat, gets dropped, or leaves with the person going home — and without a spare somebody loses contact at the worst moment. One extra for every five or six in use covers almost all of it.",
        uz: "Bu qoida o'zi turadiganidan ko'proq tejaydi. Ratsiya quvvati tugaydi, tushib ketadi yoki smenachi bilan ketadi — zaxirasiz esa kimdir eng yomon paytda aloqasiz qoladi. Har besh-oltita ishlayotganiga bitta ortiqcha deyarli barcha shunday holatlarni yopadi.",
      },
    },
    {
      heading: {
        ru: "Когда нужны каналы, а не рации",
        en: "When you need channels, not radios",
        uz: "Qachon ratsiya emas, kanal kerak",
      },
      body: {
        ru: "Если групп несколько — кухня и зал, монтаж и охрана — им нужен не общий эфир, а разные каналы. Иначе все слышат всё, и через неделю люди начинают выключать рации. Разнести группы по каналам можно на любой модели из каталога.",
        en: "Where there are several groups — kitchen and floor, install and security — what they need is separate channels, not one shared air. Otherwise everyone hears everything, and within a week people start switching the radios off. Every model in this catalogue can split groups across channels.",
        uz: "Guruh bir nechta bo'lsa — oshxona va zal, montaj va qo'riqlash — ularga umumiy efir emas, alohida kanallar kerak. Aks holda hamma hamma narsani eshitadi va bir haftadan keyin odamlar ratsiyani o'chira boshlaydi. Guruhlarni kanallarga ajratish katalogdagi har qanday modelda mumkin.",
      },
    },
  ],
  faq: [
    {
      q: {
        ru: "Дешевле ли брать комплектом?",
        en: "Is a kit cheaper?",
        uz: "Komplekt bilan olish arzonroqmi?",
      },
      a: {
        ru: "Обычно да. В каталоге есть готовые комплекты из трёх и четырёх раций с зарядкой и гарнитурами — они выходят дешевле, чем те же рации поштучно.",
        en: "Usually yes. The catalogue carries ready three- and four-radio kits with charger and headsets, and they come out cheaper than the same radios bought singly.",
        uz: "Odatda ha. Katalogda quvvatlagich va garnituralar bilan uch va to'rtta ratsiyadan tayyor komplektlar bor — ular o'sha ratsiyalarni donalab olishdan arzonroq chiqadi.",
      },
    },
    {
      q: {
        ru: "Можно ли докупить рации позже?",
        en: "Can we add more radios later?",
        uz: "Keyinroq ratsiya qo'shib olsa bo'ladimi?",
      },
      a: {
        ru: "Да, если модель та же или совместимая по стандарту и каналам. Поэтому лучше сразу выбрать модель, которая останется в каталоге, — подскажем, какие из них долгоживущие.",
        en: "Yes, as long as the model is the same or compatible in standard and channels. So it is worth picking a model that will stay in the catalogue — we will say which ones are long-lived.",
        uz: "Ha, agar model o'sha yoki standart va kanallar bo'yicha mos bo'lsa. Shuning uchun katalogda qoladigan modelni tanlagan ma'qul — qaysilari uzoq yashashini aytamiz.",
      },
    },
  ],
};

export default content;
