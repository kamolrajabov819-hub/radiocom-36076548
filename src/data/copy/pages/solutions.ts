/**
 * /solutions — «организация радиосвязи на предприятии» / «korxonada
 * radioaloqa tizimi».
 *
 * The README's network-design offer and the five steps that used to sit on the
 * PoC page (which now links here, so the two pages stop competing for «проект
 * радиосети»): a site survey and signal measurement, coverage calculation,
 * equipment chosen for the conditions, antennas and repeaters, the frequency
 * paperwork for the State Commission on Radio Frequencies, commissioning with
 * documents, «под ключ, с гарантией». No project price or timeline is on
 * record, so the FAQ says what they depend on instead.
 */
import type { PageCopy } from "@/data/copy/pick";

const copy: PageCopy = {
  hero: {
    kicker: {
      ru: "Радиосвязь под ключ",
      en: "Turnkey radio networks",
      uz: "Kalit topshiriladigan radioaloqa",
    },
    title: {
      ru: "Организация радиосвязи на предприятии",
      en: "Radio networks for your business",
      uz: "Korxonada radioaloqa tizimi",
    },
    sub: {
      ru: "Приедем, замерим связь, посчитаем покрытие и поставим антенны. Проект, оборудование, частоты и запуск — под ключ, с гарантией.",
      en: "We come out, measure the signal, calculate the coverage and put up the antennas. Design, equipment, frequencies and commissioning — turnkey, with a warranty.",
      uz: "Kelamiz, aloqani o'lchaymiz, qamrovni hisoblaymiz va antennalarni o'rnatamiz. Loyiha, uskuna, chastotalar va ishga tushirish — kalit topshiriladigan, kafolat bilan.",
    },
  },
  sections: [
    {
      heading: {
        ru: "Когда предприятию нужна своя радиосеть",
        en: "When a business needs its own radio network",
        uz: "Korxonaga o'z radiotarmog'i qachon kerak",
      },
      body: [
        {
          ru: "Обычные рации говорят напрямую, и на большом объекте их дальности не хватает: мешают расстояние, бетон, металл и рельеф. Своя радиосеть с ретрансляторами и антеннами покрывает всю территорию — карьер, завод, стройку или комплекс зданий — и не зависит от мобильного оператора.",
          en: "Ordinary radios talk directly, and on a large site their range runs out: distance, concrete, steel and terrain get in the way. Your own radio network, with repeaters and antennas, covers the whole territory — a quarry, a factory, a building site or a campus — and depends on no mobile operator.",
          uz: "Oddiy ratsiyalar to'g'ridan-to'g'ri gaplashadi va katta ob'ektda ularning masofasi yetmaydi: masofa, beton, metall va relyef xalaqit beradi. Retranslyator va antennali o'z radiotarmog'ingiz butun hududni — karyer, zavod, qurilish yoki binolar majmuasini — qamraydi va mobil operatorga bog'liq bo'lmaydi.",
        },
        {
          ru: "Если на объекте стабильная мобильная сеть, а людям нужна связь между городами, иногда проще взять [PoC-рации](/poc): они работают через сеть оператора без своей инфраструктуры.",
          en: "If the site has a solid mobile network and people need to talk between cities, [PoC radios](/poc) can be the simpler answer: they run on the operator's network with no infrastructure of your own.",
          uz: "Agar ob'ektda mobil tarmoq barqaror bo'lsa va odamlarga shaharlararo aloqa kerak bo'lsa, ba'zan [PoC ratsiyalar](/poc)ni olish osonroq: ular o'z infratuzilmasisiz operator tarmog'i orqali ishlaydi.",
        },
      ],
    },
    {
      heading: {
        ru: "Ретрансляторы и антенны",
        en: "Repeaters and antennas",
        uz: "Retranslyatorlar va antennalar",
      },
      body: [
        {
          ru: "Проект начинается с выезда: мы смотрим объект и замеряем связь там, где будут работать люди. Затем считаем зону покрытия и подбираем оборудование под ваши условия — ретрансляторы, антенны и рации. После монтажа настраиваем сеть, проверяем её и передаём вам вместе с документами.",
          en: "A project starts with a visit: we look at the site and measure the signal where people will actually work. Then we calculate the coverage area and choose the equipment for your conditions — repeaters, antennas and radios. After installation we configure the network, test it and hand it over with the documents.",
          uz: "Loyiha ob'ektga chiqishdan boshlanadi: ob'ektni ko'ramiz va odamlar ishlaydigan joyda aloqani o'lchaymiz. So'ng qamrov zonasini hisoblaymiz va sharoitingizga mos uskunani — retranslyator, antenna va ratsiyalarni — tanlaymiz. O'rnatgandan keyin tarmoqni sozlaymiz, tekshiramiz va hujjatlari bilan topshiramiz.",
        },
      ],
    },
    {
      heading: {
        ru: "Частоты и разрешения",
        en: "Frequencies and permits",
        uz: "Chastotalar va ruxsatnomalar",
      },
      body: [
        {
          ru: "Своей радиосети нужны свои частоты. Документы для Государственной комиссии по радиочастотам мы готовим сами и сопровождаем оформление до конца. Цифровые рации для такой сети — линейка RCD на странице [рации Radiocom](/radiocom).",
          en: "A network of your own needs frequencies of its own. We prepare the documents for the State Commission on Radio Frequencies ourselves and see the filing through to the end. The digital radios for such a network are the RCD line on the [Radiocom radios](/radiocom) page.",
          uz: "O'z radiotarmog'iga o'z chastotalari kerak. Radiochastotalar bo'yicha davlat komissiyasi uchun hujjatlarni o'zimiz tayyorlaymiz va rasmiylashtirishni oxirigacha olib boramiz. Bunday tarmoq uchun raqamli ratsiyalar — [Radiocom ratsiyalari](/radiocom) sahifasidagi RCD liniyasi.",
        },
      ],
    },
    {
      heading: {
        ru: "DMR или PoC для объекта",
        en: "DMR or PoC for your site",
        uz: "Ob'ekt uchun DMR yoki PoC",
      },
      body: [
        {
          ru: "DMR-сеть работает без мобильного оператора и подходит для закрытой территории, где сети нет или она нестабильна. PoC работает везде, где ловит телефон, и связывает людей в разных городах. Подробное сравнение — в статье [PoC или обычная рация](/answers/pmr-or-poc), а подбор под отрасль — на странице [рации для бизнеса](/industries).",
          en: "A DMR network runs without a mobile operator and suits an enclosed site where there is no network or it is unreliable. PoC works anywhere a phone has signal and links people in different cities. A detailed comparison is in [PoC or a conventional radio](/answers/pmr-or-poc), and a choice by industry on [radios for business](/industries).",
          uz: "DMR tarmog'i mobil operatorsiz ishlaydi va tarmoq yo'q yoki beqaror bo'lgan yopiq hudud uchun mos. PoC telefon tutgan hamma joyda ishlaydi va turli shaharlardagi odamlarni bog'laydi. Batafsil solishtirish — [PoC yoki oddiy ratsiya](/answers/pmr-or-poc) maqolasida, soha bo'yicha tanlov esa [biznes uchun ratsiyalar](/industries) sahifasida.",
        },
      ],
    },
  ],
  faq: [
    {
      q: {
        ru: "Кто оформляет частоты для радиосети?",
        en: "Who handles the frequencies for the network?",
        uz: "Radiotarmoq uchun chastotalarni kim rasmiylashtiradi?",
      },
      a: {
        ru: "Мы: готовим документы для Государственной комиссии по радиочастотам и сопровождаем оформление.",
        en: "We do: we prepare the documents for the State Commission on Radio Frequencies and see the filing through.",
        uz: "Biz: Radiochastotalar bo'yicha davlat komissiyasi uchun hujjatlarni tayyorlaymiz va rasmiylashtirishni olib boramiz.",
      },
    },
    {
      q: {
        ru: "Можно ли сначала проверить связь на объекте?",
        en: "Can you check the signal on site first?",
        uz: "Avval ob'ektda aloqani tekshirib ko'rish mumkinmi?",
      },
      a: {
        ru: "Да, с этого работа и начинается: мы приезжаем, замеряем связь и только потом готовим проект.",
        en: "Yes, that is where the work starts: we come out, measure the signal and only then prepare the design.",
        uz: "Ha, ish aynan shundan boshlanadi: kelamiz, aloqani o'lchaymiz va shundan keyingina loyihani tayyorlaymiz.",
      },
    },
    {
      q: {
        ru: "Сколько стоит радиосеть для предприятия?",
        en: "How much does a company radio network cost?",
        uz: "Korxona radiotarmog'i qancha turadi?",
      },
      a: {
        ru: "Это зависит от площади, рельефа, зданий и количества раций, поэтому стоимость мы называем после выезда и проекта.",
        en: "It depends on the area, the terrain, the buildings and the number of radios, so we give the cost after the site visit and the design.",
        uz: "Bu hudud maydoni, relyef, binolar va ratsiyalar soniga bog'liq, shuning uchun narxni ob'ektga chiqqandan va loyihadan keyin aytamiz.",
      },
    },
    {
      q: {
        ru: "Что лучше для объекта: DMR-сеть или PoC?",
        en: "Which is better for a site: a DMR network or PoC?",
        uz: "Ob'ekt uchun nima yaxshi: DMR tarmog'i yoki PoC?",
      },
      a: {
        ru: "Если на объекте стабильная мобильная сеть и нужна связь между городами — PoC. Если сети нет или связь нужна внутри закрытой территории — своя DMR-сеть с ретранслятором.",
        en: "If the site has a solid mobile network and you need to talk between cities, PoC. If there is no network, or the radio is needed inside an enclosed site, your own DMR network with a repeater.",
        uz: "Ob'ektda mobil tarmoq barqaror bo'lsa va shaharlararo aloqa kerak bo'lsa — PoC. Tarmoq bo'lmasa yoki aloqa yopiq hudud ichida kerak bo'lsa — retranslyatorli o'z DMR tarmog'i.",
      },
    },
  ],
};

export default copy;
