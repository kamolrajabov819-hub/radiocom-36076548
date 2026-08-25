/**
 * The companies whose logos run in the «Нам доверяют» strip.
 *
 * Every entry carries a real company name, and that is the whole reason this
 * file exists rather than a `import.meta.glob` over the directory. The uploads
 * arrived as `about-company-radiocom.image.AB-1.Woblo.webp`,
 * `...image.CE-1...`, `...image.ozv...` — nineteen of the fifty-two were
 * unreadable from the filename alone. A glob would have produced `alt="AB-1"`,
 * which is worse than no alt text: it tells a screen-reader user nothing and
 * gives a crawler a string that means nothing. Each was identified by opening
 * the image, so `AB-1` is Asakabank, `CE-1` is Çalık Enerji and `ozv` is
 * Özgüven.
 *
 * The files were renamed to match, so the next person can read the directory.
 *
 * All 52 are 156x156 RGBA and 4.4 KB on average — 229 KB for the set, which is
 * why the strip can carry every logo rather than a curated subset.
 *
 * **`?no-inline` on every import, and it is load-bearing.** Vite inlines any
 * asset under 4 KB as a base64 data URI, and 29 of these 52 are under that
 * threshold — so without it the strip compiled to a 111 KB JavaScript chunk of
 * base64 instead of a few hundred bytes of URLs. That is the worst of every
 * world: the bytes land in a script that has to be downloaded and parsed
 * before the page can run, they cannot be cached or revalidated separately,
 * and `loading="lazy"` on the images becomes a lie because a data URI has
 * already arrived. It pushed six routes over the `qa-weight` ceiling, which is
 * how it was caught.
 */
import logoAsakabank from "@/assets/companies-trust/asakabank.webp?no-inline";
import logoAdliyaVazirligi from "@/assets/companies-trust/adliya-vazirligi.webp?no-inline";
import logoAgmk from "@/assets/companies-trust/agmk.webp?no-inline";
import logoAkfa from "@/assets/companies-trust/akfa.webp?no-inline";
import logoDavlatXavfsizlikXizmati from "@/assets/companies-trust/davlat-xavfsizlik-xizmati.webp?no-inline";
import logoBekabadCement from "@/assets/companies-trust/bekabad-cement.webp?no-inline";
import logoCalikEnerji from "@/assets/companies-trust/calik-enerji.webp?no-inline";
import logoCocaCola from "@/assets/companies-trust/coca-cola.webp?no-inline";
import logoCentralPark from "@/assets/companies-trust/central-park.webp?no-inline";
import logoDreamCity from "@/assets/companies-trust/dream-city.webp?no-inline";
import logoDiscoverInvest from "@/assets/companies-trust/discover-invest.webp?no-inline";
import logoEnterEngineering from "@/assets/companies-trust/enter-engineering.webp?no-inline";
import logoEriell from "@/assets/companies-trust/eriell.webp?no-inline";
import logoGoldenHouse from "@/assets/companies-trust/golden-house.webp?no-inline";
import logoGm from "@/assets/companies-trust/gm.webp?no-inline";
import logoHavas from "@/assets/companies-trust/havas.webp?no-inline";
import logoHilton from "@/assets/companies-trust/hilton.webp?no-inline";
import logoHyattRegency from "@/assets/companies-trust/hyatt-regency.webp?no-inline";
import logoKorzinka from "@/assets/companies-trust/korzinka.webp?no-inline";
import logoMakro from "@/assets/companies-trust/makro.webp?no-inline";
import logoMan from "@/assets/companies-trust/man.webp?no-inline";
import logoMagicCity from "@/assets/companies-trust/magic-city.webp?no-inline";
import logoMimar from "@/assets/companies-trust/mimar.webp?no-inline";
import logoMediapark from "@/assets/companies-trust/mediapark.webp?no-inline";
import logoMuradBuildings from "@/assets/companies-trust/murad-buildings.webp?no-inline";
import logoNbu from "@/assets/companies-trust/nbu.webp?no-inline";
import logoNgmk from "@/assets/companies-trust/ngmk.webp?no-inline";
import logoNrg from "@/assets/companies-trust/nrg.webp?no-inline";
import logoOrientGroup from "@/assets/companies-trust/orient-group.webp?no-inline";
import logoSamarkand from "@/assets/companies-trust/samarkand.webp?no-inline";
import logoSilkRoad from "@/assets/companies-trust/silk-road.webp?no-inline";
import logoUzautoTrailer from "@/assets/companies-trust/uzauto-trailer.webp?no-inline";
import logoUzauto from "@/assets/companies-trust/uzauto.webp?no-inline";
import logoUzkimyosanoat from "@/assets/companies-trust/uzkimyosanoat.webp?no-inline";
import logoIchkiIshlarVazirligi from "@/assets/companies-trust/ichki-ishlar-vazirligi.webp?no-inline";
import logoProkuratura from "@/assets/companies-trust/prokuratura.webp?no-inline";
import logoAmirsoy from "@/assets/companies-trust/amirsoy.webp?no-inline";
import logoArtel from "@/assets/companies-trust/artel.webp?no-inline";
import logoAshxobod from "@/assets/companies-trust/ashxobod.webp?no-inline";
import logoHotelBeldersoy from "@/assets/companies-trust/hotel-beldersoy.webp?no-inline";
import logoCarrefour from "@/assets/companies-trust/carrefour.webp?no-inline";
import logoCompass from "@/assets/companies-trust/compass.webp?no-inline";
import logoEcopark from "@/assets/companies-trust/ecopark.webp?no-inline";
import logoInfinbank from "@/assets/companies-trust/infinbank.webp?no-inline";
import logoInternationalHotelTashkent from "@/assets/companies-trust/international-hotel-tashkent.webp?no-inline";
import logoKapitalbank from "@/assets/companies-trust/kapitalbank.webp?no-inline";
import logoCourtyardByMarriott from "@/assets/companies-trust/courtyard-by-marriott.webp?no-inline";
import logoOzguven from "@/assets/companies-trust/ozguven.webp?no-inline";
import logoRiviera from "@/assets/companies-trust/riviera.webp?no-inline";
import logoSamarqandDarvoza from "@/assets/companies-trust/samarqand-darvoza.webp?no-inline";
import logoUzbekneftegaz from "@/assets/companies-trust/uzbekneftegaz.webp?no-inline";
import logoUzlitiEngineering from "@/assets/companies-trust/uzliti-engineering.webp?no-inline";

export type Client = { src: string; name: string };

export const clients: Client[] = [
  { src: logoAsakabank, name: "Asakabank" },
  { src: logoAdliyaVazirligi, name: "Adliya vazirligi" },
  { src: logoAgmk, name: "AGMK" },
  { src: logoAkfa, name: "AKFA" },
  { src: logoDavlatXavfsizlikXizmati, name: "Davlat xavfsizlik xizmati" },
  { src: logoBekabadCement, name: "Bekabad Cement" },
  { src: logoCalikEnerji, name: "Çalık Enerji" },
  { src: logoCocaCola, name: "Coca-Cola" },
  { src: logoCentralPark, name: "Central Park" },
  { src: logoDreamCity, name: "Dream City" },
  { src: logoDiscoverInvest, name: "Discover Invest" },
  { src: logoEnterEngineering, name: "Enter Engineering" },
  { src: logoEriell, name: "ERIELL" },
  { src: logoGoldenHouse, name: "Golden House" },
  { src: logoGm, name: "GM" },
  { src: logoHavas, name: "HAVAS" },
  { src: logoHilton, name: "Hilton" },
  { src: logoHyattRegency, name: "Hyatt Regency" },
  { src: logoKorzinka, name: "Korzinka" },
  { src: logoMakro, name: "Makro" },
  { src: logoMan, name: "MAN" },
  { src: logoMagicCity, name: "Magic City" },
  { src: logoMimar, name: "MIMAR" },
  { src: logoMediapark, name: "MediaPark" },
  { src: logoMuradBuildings, name: "Murad Buildings" },
  { src: logoNbu, name: "NBU" },
  { src: logoNgmk, name: "NGMK" },
  { src: logoNrg, name: "NRG" },
  { src: logoOrientGroup, name: "Orient Group" },
  { src: logoSamarkand, name: "Samarkand" },
  { src: logoSilkRoad, name: "Silk Road" },
  { src: logoUzautoTrailer, name: "UzAuto Trailer" },
  { src: logoUzauto, name: "UzAuto" },
  { src: logoUzkimyosanoat, name: "Uzkimyosanoat" },
  { src: logoIchkiIshlarVazirligi, name: "Ichki ishlar vazirligi" },
  { src: logoProkuratura, name: "Prokuratura" },
  { src: logoAmirsoy, name: "Amirsoy" },
  { src: logoArtel, name: "Artel" },
  { src: logoAshxobod, name: "Ashxobod" },
  { src: logoHotelBeldersoy, name: "Hotel Beldersoy" },
  { src: logoCarrefour, name: "Carrefour" },
  { src: logoCompass, name: "Compass" },
  { src: logoEcopark, name: "Ecopark" },
  { src: logoInfinbank, name: "InfinBank" },
  { src: logoInternationalHotelTashkent, name: "International Hotel Tashkent" },
  { src: logoKapitalbank, name: "Kapitalbank" },
  { src: logoCourtyardByMarriott, name: "Courtyard by Marriott" },
  { src: logoOzguven, name: "Özgüven" },
  { src: logoRiviera, name: "Riviera" },
  { src: logoSamarqandDarvoza, name: "Samarqand Darvoza" },
  { src: logoUzbekneftegaz, name: "Uzbekneftegaz" },
  { src: logoUzlitiEngineering, name: "UZLITI Engineering" },
];
