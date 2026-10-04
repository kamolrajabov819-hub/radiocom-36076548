/** The mining industry page body. See `industries-content.ts` for why this is a module of its own. */
import type { IndustryContent } from "@/data/industries-content";

const content: IndustryContent = {
  problem: {
    ru: "Огромные территории, взрывоопасные зоны, требования к искробезопасности.",
    en: "Huge areas, hazardous zones, strict intrinsic-safety requirements.",
    uz: "Katta hududlar, portlash xavfli zonalar, aniq uchqun xavfsizligi talablari.",
  },
  solution: {
    ru: "Цифровые DMR-рации RCD PRO с защитой IP67, шифрованием и аккумулятором на смену. Подберём комплект под участок.",
    en: "Digital RCD PRO radios with IP67 protection, encryption and a shift-long battery. We size the kit to the site.",
    uz: "IP67 himoyasi, shifrlash va smenaga yetadigan akkumulyatorli raqamli RCD PRO ratsiyalar. Komplektni uchastkaga moslaymiz.",
  },
  pains: [
    {
      ru: "На карьере 3 км — обычная рация не пробивает",
      en: "3 km pit — regular radios can’t reach across",
      uz: "3 km karyer — oddiy ratsiya yetmaydi",
    },
    {
      ru: "Во взрывоопасной зоне обычная электроника запрещена",
      en: "Standard electronics banned in Ex zones",
      uz: "Xavfli zonalarda oddiy elektronika taqiqlangan",
    },
    {
      ru: "Смена в шахте без связи с поверхностью",
      en: "Underground crew loses contact with surface",
      uz: "Yer ostidagi smena yer usti bilan aloqasiz",
    },
  ],
  outcomes: [
    {
      n: {
        ru: "IP67",
        en: "IP67",
        uz: "IP67",
      },
      u: {
        ru: "",
        en: "",
        uz: "",
      },
      l: {
        ru: "Пыль и вода на участке — RCD-70 PRO",
        en: "Dust and water on site — RCD-70 PRO",
        uz: "Uchastkadagi chang va suv — RCD-70 PRO",
      },
    },
    {
      n: {
        ru: "AES-256",
        en: "AES-256",
        uz: "AES-256",
      },
      u: {
        ru: "",
        en: "",
        uz: "",
      },
      l: {
        ru: "Разговор слышат только свои — линейка RCD PRO",
        en: "Only your own team hears you — the RCD PRO range",
        uz: "Suhbatni faqat o'zingiznikilar eshitadi — RCD PRO liniyasi",
      },
    },
    {
      n: {
        ru: "3600",
        en: "3,600",
        uz: "3600",
      },
      u: {
        ru: "мА·ч",
        en: "mAh",
        uz: "mA·s",
      },
      l: {
        ru: "Смена на одном заряде — RCD-70 и RCD-50 PRO",
        en: "A full shift on one charge — RCD-70 and RCD-50 PRO",
        uz: "Bir zaryadda butun smena — RCD-70 va RCD-50 PRO",
      },
    },
  ],
  quote: {
    ru: "Radiocom развернули DMR-сеть на карьере за 3 дня. С тех пор ни одного отказа — работают вторая зима подряд.",
    en: "Radiocom rolled out the DMR network across the pit in 3 days. Second winter running — zero downtime.",
    uz: "Radiocom karyerga DMR-tarmoqni 3 kunda o'rnatdi. Ikkinchi qish — hech qanday uzilish yo'q.",
  },
  quoteAuthor: {
    ru: "Главный инженер, горнодобывающее предприятие",
    en: "Chief engineer, mining operation",
    uz: "Bosh muhandis, kon korxonasi",
  },
  clients: {
    ru: "Нам доверяют: Uz-Kor Gas Chemical, ERIELL, ENTER Engineering, HYUNDAI Engineering, SAMSUNG Engineering Construction.",
    en: "Trusted by: Uz-Kor Gas Chemical, ERIELL, ENTER Engineering, HYUNDAI Engineering, SAMSUNG Engineering Construction.",
    uz: "Bizga ishonishadi: Uz-Kor Gas Chemical, ERIELL, ENTER Engineering, HYUNDAI Engineering, SAMSUNG Engineering Construction.",
  },
  faq: [
    {
      q: {
        ru: "Есть ли сертификация для взрывоопасных зон?",
        en: "Do you supply ATEX-certified units?",
        uz: "Portlash xavfli zonalar uchun sertifikat bormi?",
      },
      a: {
        ru: "Искробезопасных (Ex) версий в текущем каталоге нет. Напишите, какой класс требуется на вашем участке, — подберём решение отдельно.",
        en: "There are no intrinsically safe (Ex) versions in the current catalogue. Tell us which class your site requires and we will source it separately.",
        uz: "Joriy katalogda uchqundan himoyalangan (Ex) versiyalar yo'q. Uchastkangizga qaysi sinf kerakligini yozing — alohida yechim tanlaymiz.",
      },
    },
    {
      q: {
        ru: "Нужно ли согласовывать частоты?",
        en: "Do the frequencies have to be registered?",
        uz: "Chastotalarni kelishish kerakmi?",
      },
      a: {
        ru: "Да, и мы делаем это за вас: полностью сопровождаем оформление в Госкомсвязи РУз.",
        en: "Yes, and we do it for you: we handle the whole filing with State Comms of Uzbekistan.",
        uz: "Ha, va buni biz siz uchun qilamiz: O'zbekiston Aloqa qo'mitasidagi rasmiylashtirishni to'liq olib boramiz.",
      },
    },
    {
      q: {
        ru: "Какая гарантия на промышленное исполнение?",
        en: "What warranty on industrial builds?",
        uz: "Sanoat modellariga qanday kafolat?",
      },
      a: {
        ru: "Гарантия 12 месяцев на радиоблок. Обслуживание — в нашем авторизованном сервис-центре, оригинальными запчастями.",
        en: "12 months on the radio unit. Servicing is done in our authorised centre with original parts.",
        uz: "Radioblokka 12 oy kafolat. Xizmat ko'rsatish — o'z vakolatli servis markazimizda, original ehtiyot qismlar bilan.",
      },
    },
  ],
};

export default content;
