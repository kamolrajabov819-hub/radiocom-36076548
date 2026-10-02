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

## Open

| #   | Question                                                                                                                                                                                                                                                                                                                                                     | Blocks                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| 6   | **GTM container.** The old WordPress site loads `GTM-N8XPP97H`. Reuse that container, or create a new one for the new site? Whoever owns it sets `VITE_GTM_ID` in Netlify (production context only).                                                                                                                                                         | Any tracking going live                |
| 7   | **Yandex Metrica: via GTM or direct?** The site is ready for either; GTM is the default (see `TRACKING.md`). Only add a direct counter if the marketer asks, and never both, or every visit counts twice.                                                                                                                                                    | Direct's conversion strategies         |
| 8   | **Google Business Profile and Yandex Business URLs**, once claimed. They go into schema `sameAs` (a two-line change).                                                                                                                                                                                                                                        | Local pack, `sameAs`                   |
| 9   | **Department phones from the old site.** `README.md` lists separate numbers for PoC (+998 93 387-16-20, +998 93 382-07-10), network design (+998 93 381-16-20, +998 71 233-16-20) and service (+998 93 505-16-20, +998 71 233-16-18), plus +998 93 505-07-19 in the main block. Are any still in use, and should the site publish them? None is shown today. | Contact section of PoC / service pages |
| 10  | **HoReCa outcome figures.** The HoReCa page leads with «7 400 м²» and «68 г», both attributed to Motorola CLP 446 / CLK 446, which are hidden in the catalogue (no photo). Keep the figures, or swap them for a visible model's?                                                                                                                             | HoReCa page copy                       |
| 11  | **Privacy policy and consent.** Uzbekistan's personal-data law governs collecting names and phone numbers through the forms and running analytics. Does the company have a privacy policy to publish, and should the forms carry a consent line? A legal question; the site will not draft one.                                                              | Form footer, cookie notice             |
| 12  | **«Vertex Standard» in the Service meta description.** Still serviced? If not, it comes out of the snippet.                                                                                                                                                                                                                                                  | Service page snippet                   |
| 13  | **Rental and network design as their own pages.** The README offers rental (1 day to 5+ years) and network design. Phase 5 builds pages only where keyword volume justifies them; confirm both services are still offered as described.                                                                                                                      | Phase 5                                |
