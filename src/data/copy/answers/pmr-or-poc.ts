/** The «pmr-or-poc» answer page body. See `answers-content.ts` for why each page is a module of its own. */
import type { AnswerContent } from "@/data/answers-content";

const content: AnswerContent = {
  picks: ["rcd-70", "rcd-60", "rcd-50"],
  related: ["real-range", "how-to-choose", "analog-or-digital"],
  cta: { path: "/poc", anchor: { ru: "PoC-рации", en: "PoC radios", uz: "PoC ratsiyalar" } },
  sections: [
    {
      heading: {
        ru: "Один объект или вся страна",
        en: "One site or the whole country",
        uz: "Bitta ob'ekt yoki butun mamlakat",
      },
      body: {
        ru: "Это главный вопрос. Если люди работают на одной площадке — обычная рация дешевле и не зависит от оператора. Если водители, экспедиции или объекты разбросаны по стране, обычная рация физически не дотянется, и тогда PoC становится единственным вариантом.",
        en: "That is the deciding question. If people work on one site, a normal radio is cheaper and depends on no operator. If drivers, crews or sites are spread across the country, a normal radio physically cannot reach — and then PoC is the only option.",
        uz: "Bu asosiy savol. Odamlar bitta maydonchada ishlasa — oddiy ratsiya arzon va operatorga bog'liq emas. Haydovchilar, ekspeditsiyalar yoki ob'ektlar mamlakat bo'ylab tarqoq bo'lsa, oddiy ratsiya jismonan yetmaydi va o'shanda PoC yagona variant bo'lib qoladi.",
      },
    },
    {
      heading: {
        ru: "Что нужно поставить",
        en: "What you have to install",
        uz: "Nima o'rnatish kerak",
      },
      body: {
        ru: "Обычной рации на большом объекте может понадобиться антенна, а иногда и ретранслятор. PoC не требует ничего: вышки оператора уже стоят. Поэтому вход в PoC дешевле, а владение — дороже, потому что появляется ежемесячный платёж за каждое устройство.",
        en: "A normal radio on a large site may need an antenna, and sometimes a repeater. PoC needs nothing installed: the operator's masts already exist. So PoC is cheaper to start and dearer to own, because every device carries a monthly charge.",
        uz: "Katta ob'ektda oddiy ratsiyaga antenna, ba'zan retranslyator kerak bo'lishi mumkin. PoC hech narsani talab qilmaydi: operator minoralari allaqachon turibdi. Shuning uchun PoC'ga kirish arzon, egalik qilish esa qimmat, chunki har bir qurilma uchun oylik to'lov paydo bo'ladi.",
      },
    },
    {
      heading: {
        ru: "Можно и то и другое",
        en: "You can have both",
        uz: "Ikkalasi ham bo'lishi mumkin",
      },
      body: {
        ru: "Их не обязательно противопоставлять. На складе и в цеху работают обычные рации, у водителей — PoC, а в диспетчерской ставится шлюз, и обе связи оказываются в одном канале. Для транспорта и логистики это самая частая конфигурация.",
        en: "They are not necessarily rivals. Normal radios cover the warehouse and the shop floor, drivers carry PoC, and a gateway in the dispatch room puts both on one channel. For transport and logistics that is the most common setup of all.",
        uz: "Ularni qarama-qarshi qo'yish shart emas. Omborda va sexda oddiy ratsiyalar ishlaydi, haydovchilarda — PoC, dispetcherlik xonasiga esa shlyuz o'rnatiladi va ikkala aloqa bitta kanalda bo'ladi. Transport va logistika uchun bu eng keng tarqalgan konfiguratsiya.",
      },
    },
  ],
  faq: [
    {
      q: {
        ru: "PoC работает без интернета?",
        en: "Does PoC work without the internet?",
        uz: "PoC internetsiz ishlaydimi?",
      },
      a: {
        ru: "Нет. PoC-рации нужна мобильная сеть оператора — там, где не ловит телефон, не будет и связи. На таких участках работает обычная рация со своей частотой.",
        en: "No. A PoC radio needs the operator's mobile network — where a phone has no signal, neither will the radio. On those stretches a normal radio on its own frequency is what works.",
        uz: "Yo'q. PoC ratsiyasiga operatorning mobil tarmog'i kerak — telefon tutmaydigan joyda aloqa ham bo'lmaydi. Bunday joylarda o'z chastotasidagi oddiy ratsiya ishlaydi.",
      },
    },
    {
      q: {
        ru: "Сколько человек можно подключить к PoC?",
        en: "How many people can PoC carry?",
        uz: "PoC'ga nechta odam ulanadi?",
      },
      a: {
        ru: "Тысячи, и это не ограничено зоной приёма, как у обычной рации. Группы настраиваются программно, поэтому добавить нового человека — вопрос настройки, а не оборудования.",
        en: "Thousands, and it is not capped by a reception area the way a normal radio is. Groups are configured in software, so adding a person is a matter of settings rather than equipment.",
        uz: "Minglab, va bu oddiy ratsiyadagidek qabul zonasi bilan cheklanmagan. Guruhlar dasturiy sozlanadi, shuning uchun yangi odam qo'shish jihoz emas, sozlash masalasi.",
      },
    },
  ],
};

export default content;
