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
 */
import logoAsakabank from "@/assets/companies-trust/asakabank.webp";
import logoAdliyaVazirligi from "@/assets/companies-trust/adliya-vazirligi.webp";
import logoAgmk from "@/assets/companies-trust/agmk.webp";
import logoAkfa from "@/assets/companies-trust/akfa.webp";
import logoDavlatXavfsizlikXizmati from "@/assets/companies-trust/davlat-xavfsizlik-xizmati.webp";
import logoBekabadCement from "@/assets/companies-trust/bekabad-cement.webp";
import logoCalikEnerji from "@/assets/companies-trust/calik-enerji.webp";
import logoCocaCola from "@/assets/companies-trust/coca-cola.webp";
import logoCentralPark from "@/assets/companies-trust/central-park.webp";
import logoDreamCity from "@/assets/companies-trust/dream-city.webp";
import logoDiscoverInvest from "@/assets/companies-trust/discover-invest.webp";
import logoEnterEngineering from "@/assets/companies-trust/enter-engineering.webp";
import logoEriell from "@/assets/companies-trust/eriell.webp";
import logoGoldenHouse from "@/assets/companies-trust/golden-house.webp";
import logoGm from "@/assets/companies-trust/gm.webp";
import logoHavas from "@/assets/companies-trust/havas.webp";
import logoHilton from "@/assets/companies-trust/hilton.webp";
import logoHyattRegency from "@/assets/companies-trust/hyatt-regency.webp";
import logoKorzinka from "@/assets/companies-trust/korzinka.webp";
import logoMakro from "@/assets/companies-trust/makro.webp";
import logoMan from "@/assets/companies-trust/man.webp";
import logoMagicCity from "@/assets/companies-trust/magic-city.webp";
import logoMimar from "@/assets/companies-trust/mimar.webp";
import logoMediapark from "@/assets/companies-trust/mediapark.webp";
import logoMuradBuildings from "@/assets/companies-trust/murad-buildings.webp";
import logoNbu from "@/assets/companies-trust/nbu.webp";
import logoNgmk from "@/assets/companies-trust/ngmk.webp";
import logoNrg from "@/assets/companies-trust/nrg.webp";
import logoOrientGroup from "@/assets/companies-trust/orient-group.webp";
import logoSamarkand from "@/assets/companies-trust/samarkand.webp";
import logoSilkRoad from "@/assets/companies-trust/silk-road.webp";
import logoUzautoTrailer from "@/assets/companies-trust/uzauto-trailer.webp";
import logoUzauto from "@/assets/companies-trust/uzauto.webp";
import logoUzkimyosanoat from "@/assets/companies-trust/uzkimyosanoat.webp";
import logoIchkiIshlarVazirligi from "@/assets/companies-trust/ichki-ishlar-vazirligi.webp";
import logoProkuratura from "@/assets/companies-trust/prokuratura.webp";
import logoAmirsoy from "@/assets/companies-trust/amirsoy.webp";
import logoArtel from "@/assets/companies-trust/artel.webp";
import logoAshxobod from "@/assets/companies-trust/ashxobod.webp";
import logoHotelBeldersoy from "@/assets/companies-trust/hotel-beldersoy.webp";
import logoCarrefour from "@/assets/companies-trust/carrefour.webp";
import logoCompass from "@/assets/companies-trust/compass.webp";
import logoEcopark from "@/assets/companies-trust/ecopark.webp";
import logoInfinbank from "@/assets/companies-trust/infinbank.webp";
import logoInternationalHotelTashkent from "@/assets/companies-trust/international-hotel-tashkent.webp";
import logoKapitalbank from "@/assets/companies-trust/kapitalbank.webp";
import logoCourtyardByMarriott from "@/assets/companies-trust/courtyard-by-marriott.webp";
import logoOzguven from "@/assets/companies-trust/ozguven.webp";
import logoRiviera from "@/assets/companies-trust/riviera.webp";
import logoSamarqandDarvoza from "@/assets/companies-trust/samarqand-darvoza.webp";
import logoUzbekneftegaz from "@/assets/companies-trust/uzbekneftegaz.webp";
import logoUzlitiEngineering from "@/assets/companies-trust/uzliti-engineering.webp";

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
