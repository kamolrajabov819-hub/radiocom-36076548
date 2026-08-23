import { useTranslation } from "react-i18next";
import { BUSINESS } from "@/lib/seo";

/**
 * The office on a map.
 *
 * The query used to be the literal string `radiocom.u` — a truncated
 * `radiocom.uz` — which is not an address and not a business Google can
 * resolve, so the embed dropped the visitor somewhere unrelated. It now asks
 * for the same address `BUSINESS` gives the `LocalBusiness` schema and the
 * footer, so the pin, the structured data and the printed address cannot
 * disagree.
 *
 * Coordinates rather than the street string alone: the street is written in
 * Russian and Google's geocoder resolves Tashkent street names inconsistently
 * across locales, while a lat/lng pin is the same in all three.
 */
export function MapEmbed() {
  const { t } = useTranslation();
  const { lat, lng } = BUSINESS.geo;
  const query = encodeURIComponent(`${lat},${lng} (${BUSINESS.legalName})`);

  return (
    <div className="map-embed">
      <iframe
        title={t("footer.map_title")}
        src={`https://maps.google.com/maps?q=${query}&z=17&hl=ru&ie=UTF8&iwloc=B&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
