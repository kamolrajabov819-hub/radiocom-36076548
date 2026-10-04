# Questions for the owner

Facts the site will not invent. Each answered question records the answer and
the date; open ones say what is blocked until they are answered.

## Answered — 2026-10-02

1. **Which mobile number is correct?**
   **+998 93 389-07-10** (the new site's). It becomes the primary number: header,
   sticky call button, first `telephone` in schema. The landline
   +998 78 113-16-18 stays as the second number.
   **+998 93 980-07-10** is the service line and stays on the Service page and in
   the `Service` schema. The old site, orginfo.uz and press coverage show
   +998 93 387-07-10; those listings should be corrected to 389-07-10 (see
   `SEO-OFFSITE.md`).
2. **Telegram account.** `t.me/DiyorRadiocom` everywhere: the footer and contact
   icons, schema `sameAs`, and the «Написать в Telegram» buttons. The older
   `t.me/uz_Radiocom` and `t.me/radiocom_uz` are no longer linked.
3. **Model count.** Publish **35+**, without listing what the figure includes.
   Pages that list a set of models (brand pages, compare) keep their real count.
4. **Range.** Mostly Motorola and Radiocom, with some other lines. The site
   concentrates on Motorola and Radiocom; nothing else gets a page.
5. **Office floor.** The Tata hotel, **1st and 2nd floor**.

## Answered — 2026-10-04 (decided by Claude, at the owner's request)

The owner sent the keyword map and asked for the remaining questions to be settled without them. Where a question had a reasonable default, it was decided; where only the owner can know, it stays open below.

6. **GTM container.** Reuse the old site's `GTM-N8XPP97H`: it keeps the tags, triggers and history the marketer already has. Set `VITE_GTM_ID=GTM-N8XPP97H` in Netlify, **production context only** (`LAUNCH.md` step 3). It stays out of the code: no ID is ever hardcoded.
7. **Yandex Metrica.** Through GTM, never direct as well (`TRACKING.md`).
9. **Department phones.** Not published. The site shows the primary number, the landline and the service line, which are the owner's answers of 2026-10-02. The README's PoC, network-design and service-desk numbers stay off the site.
10. **HoReCa figures.** Replaced. The page now leads on the visible Motorola XT185's sheet (up to 24 h on a charge, two PTT earpieces in the box) instead of the hidden CLP/CLK's 7 400 m² and 68 g.
12. **Vertex Standard.** Stays in the service copy. The owner's keyword map lists it for /service, and the README has Vertex Standard distribution from 2014.
13. **Rental and network design.** Confirmed by the owner's map, which makes both P1 pages. Built from the README's own description: /rent (Motorola radios with accessories, spare batteries and setup, on Radiocom's own frequencies, 1 day to 5+ years) and /solutions (survey, design, equipment, frequencies, commissioning).
- **Address landmark.** From the owner's map: «Le Grande Plaza (бывш. Тата)», Мирзо-Улугбекский район. The district is also in the README. Applied to the schema, footer, llms.txt and `SEO-OFFSITE.md`.
- **Native Uzbek review.** Done by Claude, not a native speaker. Corrected the strings #32 added: «Telegram orqali», «aylanma tugmalari», «to'liq komplekt», «neft konida ishlayotgan nasos», «ratsiya orqali», the street as «O'zbekiston Ovozi ko'chasi, 2», and «mA·soat» for «mA·s». ASCII apostrophes are now enforced by `verify-content`. Worth a native read before ad spend.

## Open

Only the owner can answer these. Each says what it blocks.

| #   | Question | Blocks |
| --- | --- | --- |
| 8   | **Google Business Profile and Yandex Business URLs**, once claimed. They go into schema `sameAs` (a two-line change). Steps are in `SEO-OFFSITE.md`. | Local pack, `sameAs` |
| 11  | **Privacy policy and consent.** Uzbekistan's personal-data law governs collecting names and phone numbers through the forms and running analytics. A legal decision; the site will not draft one. Something for the lawyer: leads currently go to Telegram via Netlify, and Uzbek law has a data-localisation requirement for citizens' personal data. | Form footer, cookie notice |
| 14  | **RCD-40 PRO: DMR or digital PMR446?** Its sheet lists only the 446.0–446.1 MHz band and an analogue+digital mode, with no TDMA. The other RCD sheets list TDMA Tier II, which is DMR. Its catalogue tag is «PMR446» until this is answered. | RCD-40 tag, the DMR lists |
| 15  | **RCD-70 PRO's 0.5 W.** The sheet gives 0.5 W beside a 10 km range. Please confirm against the vendor sheet. | RCD-70 spec row |
| 16  | **Repair prices** for common faults: battery, antenna, won't charge, water damage. The keyword map wants a price table on /service; today it says the price is fixed after diagnosis. | /service price table |
| 17  | **Rental terms:** daily/monthly prices, deposit, minimum and maximum quantity, which models. /rent says «считаем под задачу». | /rent prices and FAQ |
| 18  | **The accessories range** (headsets, batteries, chargers, antennas) and its prices. The price list has accessories at 250 000–500 000 сум, but the site sells none. | /accessories and its four sub-pages |
| 19  | **Unsourced specifics already on the industry pages**, from the first Lovable build (August), not this work. Each needs confirming or removing: the six «Отзыв клиента» quotes and their figures («за месяц окупилось», «средний чек вырос», «комплектация ускорилась почти вдвое», «на 40% меньше», «за 3 дня»); HoReCa «обычно 4–6 раций»; manufacturing «100 дБ», warehouse terminals «работают с 1С», «от 2 до 7 дней»; transport «от 45 000 сум/мес за устройство», «шлюз в диспетчерской»; security «тревожная кнопка». The new copy repeats none of them. **The quotes are the riskiest:** an unattributed testimonial that is not a real client's words is a liability with search engines and under consumer law. | Industry pages' credibility |
| 20  | **Photography for retail, events and outdoor.** Each industry page needs six crops (`scripts/build-industry-photos.ts`). | /industries/retail, /events, /outdoor |
| 21  | **README claims not used:** «единственный крупнейший поставщик», «Топ-3» (2013), «более 100 000 организаций» (which contradicts the published 10 000+). Confirm them if they are worth publishing. /about uses only the dated history. | /about |
