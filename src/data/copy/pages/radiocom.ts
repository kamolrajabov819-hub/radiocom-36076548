/**
 * /radiocom — «рации Radiocom» / «Radiocom ratsiyalari» (docs/seo/keyword-map.md).
 *
 * Secondary terms the sections are built on: «цифровые рации Radiocom RCD»,
 * «аналоговые рации Radiocom RC», «рации Radiocom цена». Which model has DMR,
 * AES-256 or IP67, the ranges, capacities and run times are `{{placeholders}}`
 * filled from `specs.ts` (see `facts.ts`); the copy never states a figure of its
 * own. The two connector names in the FAQ are the RCD-70 and RCD-60 spec sheets'
 * own («Разъём для аудиоаксессуаров Motorola M5 / 2-pin»).
 */
import type { PageCopy } from "@/data/copy/pick";

const copy: PageCopy = {
  sections: [
    {
      heading: {
        ru: "Цифровые рации Radiocom RCD",
        en: "Digital Radiocom RCD radios",
        uz: "Raqamli Radiocom RCD ratsiyalari",
      },
      body: [
        {
          ru: "Линейка RCD PRO — цифровые рации Radiocom, которые умеют работать и в аналоговом режиме. Стандарт DMR у {{rcDmr}}: в цифре речь звучит чище в шуме объекта, а у {{rcAes}} переговоры шифруются по AES-256, так что посторонний смену не услышит.",
          en: "The RCD PRO line is Radiocom's digital range, and every model also works in analogue mode. {{rcDmr}} run the DMR standard: digital voice stays clear over site noise, and on the {{rcAes}} calls are encrypted with AES-256, so no outsider can listen in on the shift.",
          uz: "RCD PRO liniyasi — analog rejimda ham ishlay oladigan raqamli Radiocom ratsiyalari. {{rcDmr}} DMR standartida ishlaydi: raqamli rejimda ovoz ob'ekt shovqinida ham toza eshitiladi, {{rcAes}} esa suhbatlarni AES-256 bilan shifrlaydi — begona odam smenani eshita olmaydi.",
        },
        {
          ru: "Для пыли, дождя и улицы есть {{rcIp67}} с защитой IP67. Флагман RCD-70 PRO добавляет GPS: диспетчер видит на карте, где находится каждый сотрудник.",
          en: "For dust, rain and outdoor work there are the {{rcIp67}}, rated IP67. The flagship RCD-70 PRO adds GPS, so a dispatcher can see every member of the team on a map.",
          uz: "Chang, yomg'ir va ochiq havo uchun IP67 himoyali {{rcIp67}} bor. Flagman RCD-70 PRO'da GPS ham bor: dispetcher har bir xodim qayerdaligini xaritada ko'radi.",
        },
      ],
    },
    {
      heading: {
        ru: "Аналоговые рации Radiocom RC",
        en: "Analogue Radiocom RC radios",
        uz: "Analog Radiocom RC ratsiyalari",
      },
      body: [
        {
          ru: "Серия RC — аналоговые рации для персонала и небольших объектов: {{rcAnalog}}. RC-20 и RC-10 продаются парой — две рации с зарядками и гарнитурами в одной коробке, а RC-50 продаётся по одной и дальше всех в серии берёт в городе.",
          en: "The RC series is the analogue range for floor staff and smaller sites: {{rcAnalog}}. The RC-20 and RC-10 come as a pair — two radios with chargers and earpieces in one box — while the RC-50 is sold singly and reaches furthest of the series in town.",
          uz: "RC seriyasi — xodimlar va kichik ob'ektlar uchun analog ratsiyalar: {{rcAnalog}}. RC-20 va RC-10 juft bo'lib sotiladi — bitta qutida quvvatlagich va garniturali ikkita ratsiya, RC-50 esa bittadan sotiladi va shaharda seriyadagi eng uzoq masofani beradi.",
        },
      ],
    },
    {
      heading: {
        ru: "Как выбрать модель Radiocom",
        en: "How to choose a Radiocom model",
        uz: "Radiocom modelini qanday tanlash",
      },
      body: [
        {
          ru: "Считайте от расстояния и условий. В городе рации Radiocom берут {{rcMinCity}} у младших моделей и {{rcMaxCity}} у {{rcMaxCityModel}}, на открытой местности — {{rcMaxOpen}} по данным производителя; бетон, металл и этажи эту цифру сокращают. Для стройки и добычи обычно выбирают RCD с защитой IP67, для ресторана и отеля — компактные RC-20 и RC-10 с гарнитурами.",
          en: "Work from the distance and the conditions. In town Radiocom radios reach {{rcMinCity}} on the entry models and {{rcMaxCity}} on the {{rcMaxCityModel}}, in open country {{rcMaxOpen}} by the manufacturer's figures; concrete, steel and floors cut that number down. Building sites and mines usually pick an IP67 RCD, restaurants and hotels the compact RC-20 and RC-10 with earpieces.",
          uz: "Masofa va sharoitdan kelib chiqing. Shaharda Radiocom ratsiyalari kichik modellarda {{rcMinCity}}, {{rcMaxCityModel}} modelida esa {{rcMaxCity}} ishlaydi, ochiq joyda — ishlab chiqaruvchi ma'lumotiga ko'ra {{rcMaxOpen}}; beton, metall va qavatlar bu raqamni kamaytiradi. Qurilish va kon uchun odatda IP67 himoyali RCD, restoran va mehmonxona uchun garniturali ixcham RC-20 va RC-10 tanlanadi.",
        },
        {
          ru: "Все модели с дальностью, защитой и ценой собраны в [сравнении раций](/compare), а подбор под вашу отрасль — на странице [рации для бизнеса](/industries).",
          en: "Every model, with its range, protection and price, is in the [radio comparison](/compare), and a choice for your industry is on [radios for business](/industries).",
          uz: "Barcha modellar masofa, himoya va narxi bilan [ratsiyalarni solishtirish](/compare) sahifasida, sohangizga mos tanlov esa [biznes uchun ratsiyalar](/industries) sahifasida.",
        },
      ],
    },
    {
      heading: {
        ru: "Гарантия и сервис",
        en: "Warranty and service",
        uz: "Kafolat va servis",
      },
      body: [
        {
          ru: "На каждую рацию Radiocom — гарантия 12 месяцев. Ремонт по гарантии и после неё делает наш [сервисный центр](/service) в Ташкенте: цену называем после диагностики, и она больше не меняется. Перед покупкой рации можно бесплатно протестировать на вашем объекте, а доставка по Узбекистану бесплатная.",
          en: "Every Radiocom radio carries a 12-month warranty. Our [service centre](/service) in Tashkent repairs them under warranty and after it: the price is set after diagnosis and does not move. Before you buy you can trial the radios free on your own site, and delivery across Uzbekistan is free.",
          uz: "Har bir Radiocom ratsiyasiga 12 oylik kafolat beriladi. Kafolat davrida ham, undan keyin ham ta'mirni Toshkentdagi [servis markazimiz](/service) bajaradi: narxni diagnostikadan keyin aytamiz va u boshqa o'zgarmaydi. Sotib olishdan oldin ratsiyalarni ob'ektingizda bepul sinab ko'rishingiz mumkin, O'zbekiston bo'ylab yetkazib berish esa bepul.",
        },
      ],
    },
  ],
  faq: [
    {
      q: {
        ru: "Чем рации Radiocom RCD отличаются от RC?",
        en: "How do Radiocom RCD radios differ from RC?",
        uz: "Radiocom RCD ratsiyalari RC'dan nimasi bilan farq qiladi?",
      },
      a: {
        ru: "RCD — цифровые рации с аналоговым режимом: у {{rcDmr}} стандарт DMR и более чистая речь, у {{rcAes}} есть шифрование AES-256. RC — аналоговые рации для персонала и небольших объектов, без цифрового режима.",
        en: "RCD radios are digital with an analogue mode: the {{rcDmr}} run DMR with cleaner voice, and the {{rcAes}} add AES-256 encryption. RC radios are analogue, for floor staff and smaller sites, with no digital mode.",
        uz: "RCD — analog rejimi ham bor raqamli ratsiyalar: {{rcDmr}} DMR standartida ishlaydi va ovozi tozaroq, {{rcAes}} modellarida AES-256 shifrlash bor. RC — xodimlar va kichik ob'ektlar uchun raqamli rejimsiz analog ratsiyalar.",
      },
    },
    {
      q: {
        ru: "Подходят ли к рациям Radiocom гарнитуры Motorola?",
        en: "Do Motorola earpieces fit Radiocom radios?",
        uz: "Motorola garniturasi Radiocom ratsiyalariga mos keladimi?",
      },
      a: {
        ru: "У RCD-70 PRO разъём для аудиоаксессуаров Motorola M5, у RCD-60 PRO — Motorola 2-pin, поэтому к ним подходят гарнитуры с этими разъёмами. Для остальных моделей подберём гарнитуру на бесплатном тесте.",
        en: "The RCD-70 PRO has a Motorola M5 audio accessory connector and the RCD-60 PRO a Motorola 2-pin, so earpieces with those connectors fit them. For the other models we will match an earpiece during the free trial.",
        uz: "RCD-70 PRO'da Motorola M5 audio aksessuar ulagichi, RCD-60 PRO'da esa Motorola 2-pin ulagichi bor, shuning uchun ularga shu ulagichli garnituralar mos keladi. Boshqa modellar uchun garniturani bepul sinovda tanlab beramiz.",
      },
    },
    {
      q: {
        ru: "Сколько работает аккумулятор рации Radiocom?",
        en: "How long does a Radiocom battery last?",
        uz: "Radiocom ratsiyasining akkumulyatori qancha ishlaydi?",
      },
      a: {
        ru: "Ёмкость аккумуляторов Radiocom — {{rcBattery}}. Там, где производитель указывает время работы, оно такое: {{rcBatteryLife}} на одном заряде.",
        en: "Radiocom batteries hold {{rcBattery}}. Where the manufacturer states a run time, it is: {{rcBatteryLife}} on a single charge.",
        uz: "Radiocom akkumulyatorlarining sig'imi — {{rcBattery}}. Ishlab chiqaruvchi ish vaqtini ko'rsatgan modellarda u bitta zaryadda shunday: {{rcBatteryLife}}.",
      },
    },
  ],
};

export default copy;
