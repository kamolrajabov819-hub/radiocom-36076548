# Keyword map

Phase 3 of the SEO brief. `keyword-map.csv` has one row per query: 627 rows across 20 live or new URLs and the pages the map proposes but this build does not have yet.

## Where the data comes from, and what it is not

- **Source.** The owner's «Radiocom.uz — SEO Keyword Map (RU / UZ)», supplied on 2026-10-04 in place of the Wordstat, Keyword Planner and Ahrefs exports the brief asked for. The owner asked for it to be used as the keyword data.
- **Clustering.** The clusters, the primary keyword per URL and the cannibalisation map are the owner's. There was no SERP data, so no SERP-overlap clustering was done.
- **No volumes.** The `volume_*`, `kd`, `cpc` and `current_position` columns are empty on purpose. They mean "not measured", not zero. `difficulty` is the tier from the map's own table (§2), not a tool score.
- **Status.** `live` means the page already did this before the keyword pass. `this-pr` means this branch makes it true. `not-built:<reason>` means the map proposes it and the reason is below.

Before money goes into ads, check the primary keywords in Yandex Wordstat (region: Uzbekistan) and Google Keyword Planner (Uzbekistan, Russian + Uzbek). The headings are easy to move once real volumes exist.

## Top 30 clusters → URL

| # | Cluster | Primary (ru) | Primary (uz) | URL | Prio |
|---|---|---|---|---|---|
| 1 | Home | рации в Ташкенте · купить рации в Ташкенте | Toshkentda ratsiyalar sotib olish | `/` | P1 |
| 2 | Radiocom catalogue | рации Radiocom | Radiocom ratsiyalari | `/radiocom` | P1 |
| 3 | Motorola catalogue | рации Motorola | Motorola ratsiyalari | `/motorola` | P1 |
| 4 | Product (template) | рация {бренд модель} | {model} ratsiyasi | `/{brand}/{model}` | P1 |
| 5 | Compare | сравнение раций | ratsiyalarni solishtirish | `/compare` | P1 |
| 6 | PoC | PoC-рации | PoC ratsiyalar | `/poc` | P1 |
| 7 | Repair | ремонт раций в Ташкенте | ratsiya ta'mirlash Toshkentda | `/service` | P1 |
| 8 | Business hub | рации для бизнеса | biznes uchun ratsiyalar | `/industries` | P1 |
| 9 | Construction | рации для стройки | qurilish uchun ratsiyalar | `/industries/construction` | P1 |
| 10 | Security | рации для охраны | qo'riqlash uchun ratsiyalar | `/industries/security` | P1 |
| 11 | HoReCa | рации для ресторана | restoran uchun ratsiyalar | `/industries/horeca` | P1 |
| 12 | Manufacturing, warehouses | рации для производства | ishlab chiqarish uchun ratsiyalar | `/industries/manufacturing` | P1 |
| 13 | Logistics | рации для логистики | logistika uchun ratsiyalar | `/industries/transport` | P2 |
| 14 | Mining, oil and gas | рации для горнодобывающей отрасли | kon sanoati uchun ratsiyalar | `/industries/mining` | P2 |
| 15 | Rental | аренда раций в Ташкенте | ratsiya ijarasi Toshkentda | `/rent` **new** | P1 |
| 16 | Turnkey networks | организация радиосвязи на предприятии | korxonada radioaloqa tizimi | `/solutions` **new** | P1 |
| 17 | Contacts | Radiocom адрес и контакты | Radiocom manzil va kontaktlar | `/contacts` **new** | P1 |
| 18 | Company | компания Radiocom | Radiocom kompaniyasi | `/about` **new** | P2 |
| 19 | How to choose | как выбрать рацию | ratsiyani qanday tanlash kerak | `/answers/how-to-choose` | P1 |
| 20 | Range | дальность рации | ratsiya necha km ishlaydi | `/answers/real-range` | P1 |
| 21 | Analogue vs digital | аналоговая или цифровая рация | analog yoki raqamli ratsiya | `/answers/analog-or-digital` | P1 |
| 22 | How many | сколько раций нужно | nechta ratsiya kerak | `/answers/how-many-radios` | P1 |
| 23 | Price (informational) | сколько стоит рация в Ташкенте | ratsiya qancha turadi | `/answers/radio-price-tashkent` | P1 |
| 24 | PoC vs PMR | PoC или обычная рация | PoC yoki oddiy ratsiya | `/answers/pmr-or-poc` | P1 |
| 25 | Broken radio | рация сломалась что делать | ratsiya buzilsa nima qilish kerak | `/answers/warranty-and-repair` | P1 |
| 26 | Licence-free | безлицензионные рации | litsenziyasiz ratsiyalar | `/answers/pmr446` **new** | P1 |
| 27 | DMR | что такое DMR | DMR nima | `/answers/what-is-dmr` **new** | P1 |
| 28 | IP67 | что значит IP67 у рации | IP67 nima degani | `/answers/ip67` **new** | P1 |
| 29 | Accessories | аксессуары для раций · гарнитура для рации | ratsiya aksessuarlari | `/accessories…` | — not built |
| 30 | Permit | нужно ли разрешение на рацию | ratsiya uchun ruxsat kerakmi | `/answers/permit` | — not built |

Every URL in rows 1–28 now carries its primary keyword in the title, the h1, the first screen and at least one h2, plus an SEO text block and (except compare and the hub) an FAQ with FAQPage schema. The verification table at the end gives each page's title, h1 and first paragraph.

## Cannibalisation, as applied

The map's §6, with what this branch did for each row.

| Keyword | Owner page | What keeps it there |
|---|---|---|
| рации в Ташкенте | `/` | Home h1 and title. The brand pages use «Рации Radiocom / Motorola». |
| рации Motorola | `/motorola` | Product pages use «Рация Motorola {модель}». |
| как выбрать рацию | `/answers/how-to-choose` | Compare links to it and does not use the phrase in a heading. |
| сравнение раций | `/compare` | The answers use «сравнение раций» only as anchor text pointing at compare. |
| сколько стоит рация (informational) | `/answers/radio-price-tashkent` | Home answers the price question in one FAQ row and links nowhere else for it. The article's commercial link goes to home. |
| аренда раций | `/rent` | PoC's rental block is now a card linking to /rent. |
| организация радиосвязи / ретранслятор | `/solutions` | PoC's five-step network block moved to /solutions. PoC keeps a card. |
| цифровые рации DMR | `/radiocom` for now | `/digital` is not built. The DMR article links to /radiocom with «цифровые рации Radiocom RCD». |
| рации дальнего действия | `/compare` for now | An h2 on compare until `/long-range` exists. |
| ремонт раций | `/service` | The warranty article links to /service with «ремонт раций в Ташкенте». |
| {модель} характеристики | product page | The full spec table is on the product page, and `/specs` canonicals to it. |
| Motorola T42 / T62 | one page per model | Red canonicals to Blue. See the deviations below. |
| рации для склада | `/industries/manufacturing` | Transport links to it for warehouses. |

## Where this deviates from the map, and why

1. **T42/T62 colour pages: canonical, not 301.** The map asks for 301s. The brief forbids changing existing URLs. So each Red page stays live and buyable, names its Blue twin as canonical (`canonicalOf` in `products.ts`), and leaves the sitemap. Both colours get a colour switch. The old colourless T62 URL already redirects to Blue.
2. **`/specs` is canonicalised, not merged away.** This is the map's second option. The table now also renders on the product page, which is what makes the canonical honest. `/specs` keeps answering 200.
3. **No repair price table on /service, and no rental prices on /rent.** No repair or rental price is on record. Both pages say the price is set after diagnosis or per job. See the owner questions.
4. **No /accessories pages.** The site has no accessories range or data (`TODO-content.md`). The price list does carry accessories at 250 000–500 000 сум, so this is the first page to build once the range is confirmed.
5. **No /industries/retail, /events or /outdoor.** Each industry page needs six photo crops (`scripts/build-industry-photos.ts`), and there are none for these three.
6. **No /digital or /long-range yet.** Both are P2. /radiocom and the DMR article carry «цифровые рации», and /compare has a «Рации дальнего действия» h2 whose model list is computed from the catalogue.
7. **No /frequencies and no permit article.** The licence draft (`answers-draft.ts`) waits on the regulator's actual rule: is 446 MHz exempt, and what do the professional models need? The site still says only what it already said: PMR446 radios need no frequency permit, and «оформляем частоты» for the rest.
8. **No /delivery, /cases, /trade-in, /mobile-radios or /hytera.** There are no per-city delivery facts and no case studies. The rest are P3 or not sold.
9. **The remaining 11 answer articles are not written yet.** The map's own cadence is 2–4 a month. This branch publishes three: pmr446, what-is-dmr and ip67. All three are definitional, with model lists from the catalogue.
10. **Home h1** is «Рации в Ташкенте — Motorola и Radiocom» (uz: «Toshkentda ratsiyalar va radiostansiyalar»), in a plain line above the slogan. The brief keeps the slogan as a display line.
11. **Titles shortened to fit 65 characters**, e.g. «Рации для горнодобывающей отрасли — подбор и тест на объекте». Product titles drop to a shorter form for long model names, such as «Motorola Talkabout T82 Extreme Quad».
12. **PoC copy without operator names, «LTE» or a monthly price.** None of those is on record for the radios sold.
13. **Retail «client examples: Korzinka, Makro, Carrefour»** are unused, because the retail page is not built. Before any page names them, check they are clients.

## The map's technical list (§8)

| # | Item | Status |
|---|---|---|
| 1 | Netlify host vs radiocom.uz | Launch step, not a code change (`LAUNCH.md`). |
| 2 | «0+» counters in SSR | Fixed in #32. |
| 3 | Home h1 has no keyword | Fixed in this branch. |
| 4 | Product h1 lacks «Рация» | Fixed in this branch. |
| 5 | 35+ vs 21 | Fixed in #32: company-level copy says 35+, and page-level counts stay true. |
| 6 | RCD-60/40/30 PMR vs DMR; RCD-70 0.5 W | RCD-60 and RCD-30 are DMR by their own TDMA Tier II feature lists. RCD-40 loses its unsupported DMR tag. The RCD-70 power figure stays as the manufacturer's (owner question). |
| 7 | Price logic | Checked against the price-list PDF: all correct. RCD-30 and RC-20 are two-radio kits, and their blurbs now say so. |
| 8 | NAP | One address everywhere, with the district and «Le Grande Plaza (бывш. «Тата»)». |
| 9 | hreflang | Already reciprocal ru/uz/en + x-default (`verify-seo` gate 1). |
| 10 | Structured data | LocalBusiness, Product + Offer (UZS) and BreadcrumbList were present. FAQPage is now on home, both brands, PoC, service, the industries and the new pages. |
| 11 | Duplicates | `/specs` and the colour twins are canonicalised. `/search` results were already noindex; the bare form stays (gates 19/24). |
| 12 | Motorola meta promises CLP/CLK | Removed. |
| 13 | «Госкомсвязь» | Replaced with the body the README names, the State Commission on Radio Frequencies (ГКРЧ). |

## Not sold: opportunities for the owner

Queries the map lists but the site does not serve:

- **Accessories**: headsets, batteries, chargers, antennas. They are on the price list but not on the site.
- **Hytera, Kenwood, Baofeng.** «Baofeng или Motorola» is a planned article; it should not become a product page.
- **Mobile (vehicle) radios.**

## Uzbek-Cyrillic queries

Some Uzbek users search in Cyrillic («рация нархи», «рацияни таъмирлаш»). Check whether Search Console and Yandex.Webmaster show impressions for them before writing anything. If they do, a short Uzbek-Cyrillic FAQ answer on the Russian home or service page can catch them. The brief rules out a fourth locale.

## Verification: title, h1, first line

Read from the server HTML of this branch's build (JavaScript off), ru and uz. The last two columns check for the exact primary keyword, lower-cased.

Each ✗ carries the cluster, just not as the exact string:

- **The map's own wording, kept as written:** the home titles («Рации и радиостанции в Ташкенте», «Ratsiya sotib olish Toshkentda») and the /solutions titles («Радиосвязь для предприятия под ключ», «Korxona uchun radioaloqa»).
- **This branch's wording:** the uz manufacturing and transport h1s add «va omborlar» / «va transport» inside the keyword, and their titles carry it exactly. The uz PMR446 title reads «Litsenziyasiz PMR446 ratsiyalari», and its h1 carries the exact keyword.

| Page | Title | h1 | First line | kw in title | kw in h1 |
|---|---|---|---|---|---|
| `/ru` | Рации и радиостанции в Ташкенте — купить Motorola и Radiocom | Рации в Ташкенте — Motorola и Radiocom | Для работы и отдыха — от 600 000 сум. Привезём на бесплатный тест, дадим гарантию 12 месяцев и обслужим в своё… | ✗ | ✓ |
| `/uz` | Ratsiya sotib olish Toshkentda — Motorola va Radiocom narxlari | Toshkentda ratsiyalar va radiostansiyalar | Ish va dam olish uchun — 600 000 so'mdan. Bepul sinovga olib boramiz, 12 oy kafolat beramiz va o'z servisimizd… | ✗ | ✓ |
| `/ru/radiocom` | Рации Radiocom RC и RCD — цены на цифровые и аналоговые рации | Рации Radiocom | Своя линейка Radiocom: аналоговые RC и цифровые RCD. Гарантия и ремонт — в нашем же сервисе. | ✓ | ✓ |
| `/uz/radiocom` | Radiocom ratsiyalari — raqamli va analog ratsiyalar narxi | Radiocom ratsiyalari | Radiocom'ning o'z liniyasi: analog RC va raqamli RCD. Kafolat va ta'mirlash — o'z servisimizda. | ✓ | ✓ |
| `/ru/motorola` | Рации Motorola в Ташкенте — цены на Talkabout T82, XT420 | Рации Motorola | Talkabout, XT и TLKR — рации Motorola, которым не нужно разрешение на частоту. | ✓ | ✓ |
| `/uz/motorola` | Motorola ratsiyalari Toshkentda — T82, XT420 narxlari | Motorola ratsiyalari | Talkabout, XT va TLKR — chastota ruxsatnomasi kerak bo'lmaydigan Motorola ratsiyalari. | ✓ | ✓ |
| `/ru/compare` | Сравнение раций Motorola и Radiocom — дальность, защита, цены | Сравнение раций Motorola и Radiocom | Все модели Radiocom и Motorola по дальности, защите и цене. | ✓ | ✓ |
| `/uz/compare` | Ratsiyalarni solishtirish — Motorola va Radiocom: masofa, narx | Ratsiyalarni solishtirish: Motorola va Radiocom | Radiocom va Motorolaning barcha modellari masofa, himoya va narx bo'yicha. | ✓ | ✓ |
| `/ru/poc` | PoC-рации с SIM-картой — связь по всему Узбекистану | PoC-рации. Связь по всей стране. | PoC — это рация, которая говорит через мобильную сеть, а не через свою антенну. Где ловит телефон — там работа… | ✓ | ✓ |
| `/uz/poc` | PoC ratsiyalar — SIM kartali, butun O'zbekiston bo'ylab aloqa | PoC ratsiyalari. Butun mamlakat bo'ylab aloqa. | PoC — bu o'z antennasi orqali emas, mobil tarmoq orqali gapiradigan ratsiya. Telefon tutadigan joyda ratsiya h… | ✓ | ✓ |
| `/ru/service` | Ремонт раций в Ташкенте — сервисный центр Motorola и Radiocom | Ремонт раций в Ташкенте. | Чиним рации Motorola и Radiocom — по гарантии и после неё. Оригинальные запчасти, а цена после диагностики бол… | ✓ | ✓ |
| `/uz/service` | Ratsiya ta'mirlash Toshkentda — Motorola va Radiocom servisi | Toshkentda ratsiya ta'mirlash. | Motorola va Radiocom ratsiyalarini ta'mirlaymiz — kafolat davrida ham, keyin ham. Original ehtiyot qismlar, di… | ✓ | ✓ |
| `/ru/industries` | Рации для бизнеса: стройка, охрана, HoReCa, склад, нефтегаз | Рации для бизнеса по отраслям | Шесть отраслей, где мы уже всё настроили. Выберите свою — покажем, какие рации там работают и почему. | ✓ | ✓ |
| `/uz/industries` | Biznes uchun ratsiyalar: qurilish, qo'riqlash, HoReCa, ombor | Biznes uchun ratsiyalar: sohalar bo'yicha | Biz allaqachon hammasini sozlagan oltita soha. O'zingiznikini tanlang — u yerda qaysi ratsiyalar ishlashini va… | ✓ | ✓ |
| `/ru/industries/construction` | Рации для стройки — подбор, цены, тест на объекте | Рации для стройки | Крупные объекты. IP67, дальняя связь. | ✓ | ✓ |
| `/uz/industries/construction` | Qurilish uchun ratsiyalar — tanlash, narxlar, bepul sinov | Qurilish uchun ratsiyalar | Yirik ob'ektlar. IP67 himoya, uzoq masofa. | ✓ | ✓ |
| `/ru/industries/security` | Рации для охраны — подбор, цены, тест на объекте | Рации для охраны | ЧОП, объектная охрана, госбезопасность. | ✓ | ✓ |
| `/uz/industries/security` | Qo'riqlash uchun ratsiyalar — tanlash, narxlar, bepul sinov | Qo'riqlash uchun ratsiyalar | Xususiy qo'riqlash, ob'ekt himoyasi, davlat xavfsizligi. | ✓ | ✓ |
| `/ru/industries/horeca` | Рации для ресторана и отеля — подбор, цены, тест на объекте | Рации для ресторанов и отелей | Отели, рестораны, события. Скрытые гарнитуры, чистый эфир. | ✓ | ✓ |
| `/uz/industries/horeca` | Restoran uchun ratsiyalar — tanlash, narxlar, bepul sinov | Restoran va mehmonxonalar uchun ratsiyalar | Mehmonxona, restoran, tadbirlar. Yashirin garnituralar, toza efir. | ✓ | ✓ |
| `/ru/industries/manufacturing` | Рации для производства и склада — подбор, цены, тест | Рации для производства и складов | Заводы, цеха, распределительные центры. | ✓ | ✓ |
| `/uz/industries/manufacturing` | Ishlab chiqarish uchun ratsiyalar — tanlash, narxlar, sinov | Ishlab chiqarish va omborlar uchun ratsiyalar | Zavodlar, sexlar, distribyutsiya markazlari. | ✓ | ✗ |
| `/ru/industries/transport` | Рации для логистики и транспорта — подбор, цены, тест | Рации для логистики и транспорта | Автопарки, склады, экспедиции. | ✓ | ✓ |
| `/uz/industries/transport` | Logistika uchun ratsiyalar — tanlash, narxlar, bepul sinov | Logistika va transport uchun ratsiyalar | Avtoparklar, omborlar, ekspeditsiyalar. | ✓ | ✗ |
| `/ru/industries/mining` | Рации для горнодобывающей отрасли — подбор и тест на объекте | Рации для горнодобывающей отрасли | Карьеры, шахты, нефтегазовая инфраструктура. | ✓ | ✓ |
| `/uz/industries/mining` | Kon sanoati uchun ratsiyalar — tanlash, narxlar, bepul sinov | Kon sanoati uchun ratsiyalar | Karyerlar, konlar, neft-gaz infratuzilmasi. | ✓ | ✓ |
| `/ru/radiocom/rcd-70` | Рация Radiocom RCD-70 PRO — цена в Ташкенте, характеристики | Рация Radiocom RCD-70 PRO | Флагман линейки RCD: цифровой DMR, GPS и защита IP67. | ✓ | ✓ |
| `/uz/radiocom/rcd-70` | Radiocom RCD-70 PRO ratsiyasi — Toshkentda narxi va xususiyatlari | Radiocom RCD-70 PRO ratsiyasi | RCD liniyasining flagmani: raqamli DMR, GPS va IP67 himoyasi. | ✓ | ✓ |
| `/ru/motorola/t82` | Рация Motorola Talkabout T82 — цена в Ташкенте, характеристики | Рация Motorola Talkabout T82 | Компактная PMR-рация для команд и мероприятий. | ✓ | ✓ |
| `/uz/motorola/t82` | Motorola Talkabout T82 ratsiyasi — Toshkentda narxi | Motorola Talkabout T82 ratsiyasi | Jamoalar va tadbirlar uchun ixcham PMR radiostansiya. | ✓ | ✓ |
| `/ru/rent` | Аренда раций в Ташкенте — посуточно и на мероприятия | Аренда раций | Рации Motorola на день, на мероприятие или на объект — от одного дня до пяти лет и дольше. С полным комплектом… | ✓ | ✓ |
| `/uz/rent` | Ratsiya ijarasi Toshkentda — kunlik va tadbirlar uchun | Ratsiya ijarasi | Bir kunga, tadbirga yoki ob'ektga Motorola ratsiyalari — bir kundan besh yilgacha va undan ham ko'proq. To'liq… | ✓ | ✓ |
| `/ru/solutions` | Радиосвязь для предприятия под ключ — ретрансляторы, проект | Организация радиосвязи на предприятии | Приедем, замерим связь, посчитаем покрытие и поставим антенны. Проект, оборудование, частоты и запуск — под кл… | ✗ | ✓ |
| `/uz/solutions` | Korxona uchun radioaloqa — retranslyator, loyihalash | Korxonada radioaloqa tizimi | Kelamiz, aloqani o'lchaymiz, qamrovni hisoblaymiz va antennalarni o'rnatamiz. Loyiha, uskuna, chastotalar va i… | ✗ | ✓ |
| `/ru/about` | О компании Radiocom — дистрибьютор раций в Ташкенте с 2012 года | О компании Radiocom | С 2012 года поставляем рации Motorola в Узбекистан, ведём собственную линейку Radiocom и ремонтируем рации в с… | ✓ | ✓ |
| `/uz/about` | Radiocom kompaniyasi — 2012-yildan beri Toshkentda ratsiyalar | Radiocom kompaniyasi haqida | 2012-yildan beri O'zbekistonga Motorola ratsiyalarini yetkazib beramiz, o'z Radiocom liniyamizni rivojlantiram… | ✓ | ✓ |
| `/ru/contacts` | Radiocom — адрес и контакты магазина раций в Ташкенте | Адрес и контакты Radiocom | Офис и сервисный центр в Ташкенте, в Мирзо-Улугбекском районе. Работаем с понедельника по пятницу, с 9:00 до 1… | ✓ | ✓ |
| `/uz/contacts` | Radiocom manzil va kontaktlar — Toshkentda ratsiya do'koni | Radiocom manzili va kontaktlari | Ofis va servis markazimiz Toshkentda, Mirzo Ulug'bek tumanida. Dushanbadan jumagacha, 9:00 dan 18:00 gacha ish… | ✓ | ✓ |
| `/ru/answers/pmr446` | Безлицензионные рации PMR446: что это и кому подходят | Безлицензионные рации: что такое PMR446 | PMR446 — диапазон частот около 446 МГц для маломощных раций, на которых говорят без разрешения на частоту и бе… | ✓ | ✓ |
| `/uz/answers/pmr446` | Litsenziyasiz PMR446 ratsiyalari: nima va kimga mos | Litsenziyasiz ratsiyalar: PMR446 nima | PMR446 — 446 MGts atrofidagi chastota diapazoni bo'lib, undagi kam quvvatli ratsiyalarda chastota ruxsatnomasi… | ✗ | ✓ |
| `/ru/answers/what-is-dmr` | Что такое DMR в рации: цифровая связь простыми словами | Что такое DMR в рации | DMR (Digital Mobile Radio) — открытый европейский стандарт цифровой радиосвязи: голос передаётся в цифре, поэт… | ✓ | ✓ |
| `/uz/answers/what-is-dmr` | Ratsiyada DMR nima: raqamli aloqa oddiy so'zlar bilan | Ratsiyada DMR nima | DMR (Digital Mobile Radio) — raqamli radioaloqaning ochiq Yevropa standarti: ovoz raqamli uzatiladi, shuning u… | ✓ | ✓ |
| `/ru/answers/ip67` | Что значит IP67 у рации: защита от пыли и воды | Что значит IP67 у рации | IP67 — класс защиты по стандарту IEC 60529: цифра 6 означает, что пыль внутрь не проникает, а 7 — что рация вы… | ✓ | ✓ |
| `/uz/answers/ip67` | Ratsiyada IP67 nima degani: chang va suvdan himoya | Ratsiyada IP67 nima degani | IP67 — IEC 60529 standarti bo'yicha himoya darajasi: 6 raqami ichkariga chang kirmasligini, 7 esa ratsiya 1 me… | ✓ | ✓ |
