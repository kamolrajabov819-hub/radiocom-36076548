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
        // AES-256 is on the RCD-50/60/70 sheets only, not RCD-30 or RCD-40.
        ru: "Разговор слышат только свои — RCD-50, RCD-60 и RCD-70 PRO",
        en: "Only your own team hears you — RCD-50, RCD-60 and RCD-70 PRO",
        uz: "Suhbatni faqat o'zingiznikilar eshitadi — RCD-50, RCD-60 va RCD-70 PRO",
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
        uz: "mA·soat",
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
        ru: "Да, и мы делаем это за вас: готовим документы и сопровождаем оформление частот в Государственной комиссии по радиочастотам.",
        en: "Yes, and we do it for you: we prepare the documents and see the frequency filing through with the State Commission on Radio Frequencies.",
        uz: "Ha, va buni biz siz uchun qilamiz: hujjatlarni tayyorlaymiz va chastotalarni Radiochastotalar bo'yicha davlat komissiyasida rasmiylashtirishni olib boramiz.",
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
    {
      q: {
        ru: "Как организовать связь на удалённом месторождении?",
        en: "How do you set up radio on a remote field?",
        uz: "Uzoq konda aloqani qanday tashkil qilish mumkin?",
      },
      a: {
        ru: "Если там есть мобильная сеть — через PoC-рации. Если нет — своей DMR-сетью с ретранслятором. Мы приезжаем на объект, замеряем связь и предлагаем решение.",
        en: "If there is mobile coverage, with PoC radios. If not, with your own DMR network and a repeater. We come out to the site, measure the signal and propose a solution.",
        uz: "Agar u yerda mobil tarmoq bo'lsa — PoC ratsiyalar orqali. Bo'lmasa — retranslyatorli o'z DMR tarmog'i bilan. Ob'ektga kelamiz, aloqani o'lchaymiz va yechim taklif qilamiz.",
      },
    },
    {
      q: {
        ru: "Что лучше для карьера: DMR или PoC?",
        en: "Which is better for a quarry: DMR or PoC?",
        uz: "Karyer uchun nima yaxshi: DMR yoki PoC?",
      },
      a: {
        ru: "DMR работает без мобильной сети и не зависит от оператора; PoC работает везде, где есть сеть, и связывает карьер с городом. Выбор зависит от покрытия на вашем участке — проверим его на выезде.",
        en: "DMR works with no mobile network and depends on no operator; PoC works anywhere there is a network and links the quarry with town. The choice depends on the coverage at your site — we check it on a visit.",
        uz: "DMR mobil tarmoqsiz ishlaydi va operatorga bog'liq emas; PoC esa tarmoq bor hamma joyda ishlaydi va karyerni shahar bilan bog'laydi. Tanlov uchastkangizdagi qamrovga bog'liq — buni ob'ektga chiqib tekshiramiz.",
      },
    },
  ],
  sections: [
    {
      heading: {
        ru: "Рации для карьера и месторождения",
        en: "Radios for quarries and oil fields",
        uz: "Karyer va kon uchun ratsiyalar",
      },
      body: [
        {
          ru: "На карьере, руднике или месторождении рация живёт в пыли и на ветру, далеко от города. Поэтому берут цифровые DMR-рации с защитой IP67 — {{rcIp67}}: шифрование AES-256, аккумулятор 3600 мА·ч на смену, а у RCD-70 PRO ещё и GPS.",
          en: "In a quarry, a mine or an oil field a radio lives in dust and wind, far from town. So the choice is a digital DMR radio rated IP67 — the {{rcIp67}}: AES-256 encryption, a 3,600 mAh battery for the shift, and GPS on the RCD-70 PRO as well.",
          uz: "Karyer, rudnik yoki konda ratsiya chang va shamolda, shahardan uzoqda ishlaydi. Shuning uchun IP67 himoyali raqamli DMR ratsiyalari tanlanadi — {{rcIp67}}: AES-256 shifrlash, smenaga yetadigan 3600 mA·soat akkumulyator, RCD-70 PRO'da esa GPS ham bor.",
        },
        {
          ru: "Для работы в одиночку на удалённом участке у {{rcDmr}} есть режим работы в одиночку. Искробезопасных версий в нашем каталоге нет: если участок требует Ex-исполнения, напишите класс — подберём решение отдельно.",
          en: "For anyone working alone on a remote section, the {{rcDmr}} have a lone worker mode. There are no intrinsically safe versions in our catalogue: if your section requires Ex-rated equipment, tell us the class and we will source a solution separately.",
          uz: "Uzoq uchastkada yolg'iz ishlash uchun {{rcDmr}} modellarida yolg'iz ishlash rejimi bor. Katalogimizda uchqun xavfsiz versiyalar yo'q: uchastkangiz Ex ijrosini talab qilsa, sinfini yozing — yechimni alohida tanlaymiz.",
        },
      ],
    },
    {
      heading: {
        ru: "Рации для нефти и газа: DMR или PoC",
        en: "Radios for oil and gas: DMR or PoC",
        uz: "Neft va gaz uchun ratsiyalar: DMR yoki PoC",
      },
      body: [
        {
          ru: "Там, где ловит мобильная сеть, удобны [PoC-рации](/poc): связь вахты с базой и городом без своей инфраструктуры. Где сети нет, нужна своя DMR-сеть — рации говорят напрямую, а на большой территории через ретранслятор. Такую сеть мы проектируем после выезда на объект, а частоты оформляем через Государственную комиссию по радиочастотам.",
          en: "Where the mobile network reaches, [PoC radios](/poc) are convenient: the shift crew can talk to base and to town with no infrastructure of your own. Where there is no network, you need your own DMR network — radios talking directly, and through a repeater across a large area. We design such a network after a site visit and handle the frequencies through the State Commission on Radio Frequencies.",
          uz: "Mobil tarmoq tutgan joyda [PoC ratsiyalar](/poc) qulay: vaxta baza va shahar bilan o'z infratuzilmasisiz bog'lanadi. Tarmoq yo'q joyda o'z DMR tarmog'i kerak — ratsiyalar to'g'ridan-to'g'ri, katta hududda esa retranslyator orqali gaplashadi. Bunday tarmoqni ob'ektga chiqqandan keyin loyihalaymiz, chastotalarni esa Radiochastotalar bo'yicha davlat komissiyasi orqali rasmiylashtiramiz.",
        },
      ],
    },
  ],
};

export default content;
