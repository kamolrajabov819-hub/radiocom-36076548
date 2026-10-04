/**
 * /poc — «PoC-рации» / «PoC ratsiyalar» (docs/seo/keyword-map.md).
 *
 * Secondary: «рация с SIM-картой», «рация через интернет», «рация без
 * ограничения дальности». Every claim restates one the page already makes in
 * `poc.*`: it talks over the mobile network, works wherever a phone has signal,
 * needs no towers or repeaters, carries voice, photo, video and text, shows
 * people on a map, scales to thousands. Nothing here names an operator, a
 * network generation the radios have not been confirmed on, or an airtime
 * price — none of those is on record.
 */
import type { PageCopy } from "@/data/copy/pick";

const copy: PageCopy = {
  sections: [
    {
      heading: {
        ru: "Что такое PoC-рация",
        en: "What a PoC radio is",
        uz: "PoC ratsiya nima",
      },
      body: [
        {
          ru: "PoC (Push-to-Talk over Cellular) — рация, которая передаёт голос через мобильную сеть, а не своими радиоволнами. Внутри — SIM-карта с мобильным интернетом, поэтому у PoC-рации нет привычного ограничения дальности: связь есть везде, где ловит телефон, — в соседнем районе Ташкента, в другом городе или на трассе.",
          en: "PoC (Push-to-Talk over Cellular) is a radio that carries your voice over the mobile network instead of its own radio waves. Inside is a SIM card with mobile data, so a PoC radio has no range limit in the usual sense: it works anywhere a phone has signal — across Tashkent, in another city or out on the highway.",
          uz: "PoC (Push-to-Talk over Cellular) — ovozni o'z radioto'lqinlari bilan emas, mobil tarmoq orqali uzatadigan ratsiya. Ichida mobil internetli SIM karta bor, shuning uchun PoC ratsiyada odatiy masofa cheklovi yo'q: telefon tutgan hamma joyda aloqa bor — Toshkentning boshqa tumanida, boshqa shaharda yoki yo'lda.",
        },
      ],
    },
    {
      heading: {
        ru: "Где работает PoC в Узбекистане",
        en: "Where PoC works in Uzbekistan",
        uz: "PoC O'zbekistonda qayerda ishlaydi",
      },
      body: [
        {
          ru: "Там же, где мобильный интернет. Вышки уже построили операторы связи, поэтому для PoC не нужно ставить антенны и ретрансляторы и не нужны собственные частоты. Где сети нет — в глубоком подвале или далеко от вышек, — PoC молчит, как и телефон; там нужна обычная рация, например [цифровые рации Radiocom](/radiocom), или [своя радиосеть на предприятии](/solutions).",
          en: "Wherever there is mobile data. The operators have already built the towers, so PoC needs no antennas, no repeaters and no frequencies of your own. Where there is no network — a deep basement, far from any tower — PoC goes quiet just as a phone does; that is a job for a conventional radio, such as the [digital Radiocom radios](/radiocom), or for [a radio network of your own](/solutions).",
          uz: "Mobil internet bor joyda. Minoralarni aloqa operatorlari allaqachon qurgan, shuning uchun PoC uchun antenna va retranslyator o'rnatish ham, o'z chastotangiz ham kerak emas. Tarmoq yo'q joyda — chuqur yerto'lada yoki minoralardan uzoqda — PoC ham telefon kabi jim qoladi; u yerda oddiy ratsiya kerak, masalan [raqamli Radiocom ratsiyalari](/radiocom), yoki [korxonaning o'z radiotarmog'i](/solutions).",
        },
      ],
    },
    {
      heading: {
        ru: "Рация через интернет для диспетчера",
        en: "A radio over the internet, built for dispatch",
        uz: "Dispetcher uchun internet orqali ishlaydigan ratsiya",
      },
      body: [
        {
          ru: "Кроме голоса, PoC-рация передаёт фото, видео и текст, а диспетчер видит сотрудников на карте. В одну группу можно объединить тысячи человек — водителей, охрану, бригады в разных городах. Чем PoC отличается от обычной рации по каждому пункту, мы разобрали в статье [PoC или обычная рация](/answers/pmr-or-poc), а подбор для перевозок — на странице [рации для логистики](/industries/transport).",
          en: "Besides voice, a PoC radio sends photos, video and text, and the dispatcher sees the team on a map. One group can hold thousands of people — drivers, security, crews in different cities. How PoC compares with a conventional radio point by point is in [PoC or a conventional radio](/answers/pmr-or-poc), and a pick for haulage is on [radios for logistics](/industries/transport).",
          uz: "Ovozdan tashqari, PoC ratsiya foto, video va matn yuboradi, dispetcher esa xodimlarni xaritada ko'radi. Bitta guruhga minglab odamni birlashtirish mumkin — haydovchilar, qo'riqchilar, turli shaharlardagi brigadalar. PoC oddiy ratsiyadan har bir jihatda nimasi bilan farq qilishini [PoC yoki oddiy ratsiya](/answers/pmr-or-poc) maqolasida yozganmiz, tashish uchun tanlov esa [logistika uchun ratsiyalar](/industries/transport) sahifasida.",
        },
      ],
    },
  ],
  faq: [
    {
      q: {
        ru: "Нужна ли отдельная SIM-карта для PoC-рации?",
        en: "Does a PoC radio need its own SIM card?",
        uz: "PoC ratsiya uchun alohida SIM karta kerakmi?",
      },
      a: {
        ru: "Да. PoC-рация работает через мобильную сеть, поэтому в каждой стоит своя SIM-карта с мобильным интернетом.",
        en: "Yes. A PoC radio works over the mobile network, so each one carries its own SIM card with mobile data.",
        uz: "Ha. PoC ratsiya mobil tarmoq orqali ishlaydi, shuning uchun har biriga mobil internetli alohida SIM karta qo'yiladi.",
      },
    },
    {
      q: {
        ru: "Есть ли у PoC-рации ограничение дальности?",
        en: "Does a PoC radio have a range limit?",
        uz: "PoC ratsiyada masofa cheklovi bormi?",
      },
      a: {
        ru: "Привычного ограничения нет: связь есть везде, где ловит мобильная сеть, — хоть в соседнем районе, хоть в другом городе. Там, где сети нет, PoC не работает, и тогда нужна обычная рация.",
        en: "Not in the usual sense: it works anywhere the mobile network reaches — the next district or another city. Where there is no network, PoC does not work, and a conventional radio is the answer.",
        uz: "Odatiy cheklov yo'q: mobil tarmoq tutgan hamma joyda aloqa bor — qo'shni tumanda ham, boshqa shaharda ham. Tarmoq bo'lmagan joyda PoC ishlamaydi, u yerda oddiy ratsiya kerak.",
      },
    },
    {
      q: {
        ru: "Нужен ли ретранслятор для PoC?",
        en: "Does PoC need a repeater?",
        uz: "PoC uchun retranslyator kerakmi?",
      },
      a: {
        ru: "Нет. PoC работает через вышки оператора, которые уже стоят, поэтому антенны и ретрансляторы ставить не нужно.",
        en: "No. PoC runs on the operator's towers, which are already standing, so there are no antennas or repeaters to install.",
        uz: "Yo'q. PoC operatorning allaqachon qurilgan minoralari orqali ishlaydi, shuning uchun antenna va retranslyator o'rnatish shart emas.",
      },
    },
  ],
};

export default copy;
