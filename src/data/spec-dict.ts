/**
 * Localised vocabulary for product specifications.
 *
 * Almost every radio in the catalogue repeats the same box contents ("belt clip",
 * "charging cup", "manual") and the same spec rows ("PMR standard", "446–446.1 MHz",
 * "0.5 W"). Declaring that vocabulary once here — rather than inline per product —
 * keeps `specs.ts` readable, keeps the three languages in lockstep, and means a
 * wording fix lands everywhere at once.
 *
 * Source of truth for the Russian strings is the manufacturer copy supplied by
 * Radiocom; English and Uzbek are translations of it.
 */

export type Lang = "ru" | "en" | "uz";

/** A single string in all three site languages. */
export type L = Record<Lang, string>;

export const pick = (l: L, lang: Lang): string => l[lang] ?? l.ru;

/* ─────────────────────────────────────────────────────────────
   In the box
   ───────────────────────────────────────────────────────────── */

export const BOX = {
  radio: { ru: "Радиостанция", en: "Two-way radio", uz: "Radiostansiya" },
  beltClip: { ru: "Клипса на пояс", en: "Belt clip", uz: "Kamarga qisqich" },
  clip: { ru: "Клипса", en: "Belt clip", uz: "Qisqich" },
  holster: { ru: "Кобура для ношения", en: "Carry holster", uz: "Tashish g'ilofi" },
  microUsb: { ru: "Micro-USB зарядка", en: "Micro-USB charger", uz: "Micro-USB quvvatlagich" },
  usbCable: { ru: "USB-кабель", en: "USB cable", uz: "USB kabel" },
  usbCarCharger: {
    ru: "USB автомобильное зарядное устройство",
    en: "USB car charger",
    uz: "USB avtomobil quvvatlagichi",
  },
  charger: { ru: "Зарядное устройство", en: "Charger", uz: "Quvvatlash qurilmasi" },
  chargingCup: { ru: "Зарядная чаша", en: "Charging cup", uz: "Quvvatlash uyasi" },
  chargingCupSingle: {
    ru: "Одноместный стакан для зарядки",
    en: "Single-unit charging cup",
    uz: "Bir o'rinli quvvatlash stakani",
  },
  chargingDock: {
    ru: "Зарядная док-станция",
    en: "Charging dock",
    uz: "Quvvatlash dok-stansiyasi",
  },
  powerAdapter: { ru: "Сетевой адаптер", en: "Mains adapter", uz: "Tarmoq adapteri" },
  powerAdapterDual: {
    ru: "Сетевое зарядное устройство с двумя разъёмами micro-USB",
    en: "Mains charger with two micro-USB outputs",
    uz: "Ikkita micro-USB chiqishli tarmoq quvvatlagichi",
  },
  headset: { ru: "Гарнитура", en: "Headset", uz: "Garnitura" },
  headsetPtt: {
    ru: "Гарнитура с микрофоном и кнопкой PTT",
    en: "Headset with microphone and PTT button",
    uz: "Mikrofon va PTT tugmali garnitura",
  },
  rsmMic: {
    ru: "Выносной микрофон RSM",
    en: "RSM remote speaker microphone",
    uz: "RSM tashqi mikrofoni",
  },
  lanyard: { ru: "Подвеска", en: "Lanyard", uz: "Bo'yin bog'ichi" },
  strap: { ru: "Ремешок для крепления", en: "Wrist strap", uz: "Mahkamlash tasmasi" },
  battery: { ru: "Аккумулятор", en: "Battery", uz: "Akkumulyator" },
  batteryNiMh800: {
    ru: "Аккумулятор Ni-MH 800 мА·ч",
    en: "Ni-MH battery, 800 mAh",
    uz: "Ni-MH akkumulyator, 800 mA·soat",
  },
  batteryNiMh: { ru: "Аккумулятор Ni-MH", en: "Ni-MH battery", uz: "Ni-MH akkumulyator" },
  batteryLiIon1130: {
    ru: "Аккумулятор Li-Ion 1130 мА·ч",
    en: "Li-Ion battery, 1130 mAh",
    uz: "Li-Ion akkumulyator, 1130 mA·soat",
  },
  batteryLiIon: { ru: "Li-Ion аккумулятор", en: "Li-Ion battery", uz: "Li-Ion akkumulyator" },
  carryCase: { ru: "Переносной чемоданчик", en: "Carry case", uz: "Tashish chemodani" },
  manual: { ru: "Инструкция по эксплуатации", en: "User manual", uz: "Foydalanish qo'llanmasi" },
} satisfies Record<string, L>;

/** One line of the "In the box" list: an item and how many of it ship. */
export type BoxLine = { item: L; qty?: number };

export const box = (item: L, qty?: number): BoxLine => ({ item, qty });

/** "Клипса на пояс — 2 шт" / "Belt clip — 2 pcs" / "Kamarga qisqich — 2 dona" */
export function formatBoxLine(line: BoxLine, lang: Lang): string {
  const name = pick(line.item, lang);
  if (!line.qty) return name;
  const unit = lang === "en" ? "pcs" : lang === "uz" ? "dona" : "шт";
  return `${name} — ${line.qty} ${unit}`;
}

/* ─────────────────────────────────────────────────────────────
   Spec row labels
   ───────────────────────────────────────────────────────────── */

export const SPEC = {
  standard: { ru: "Стандарт", en: "Standard", uz: "Standart" },
  mode: { ru: "Режим работы", en: "Operating mode", uz: "Ishlash rejimi" },
  freq: { ru: "Диапазон частот", en: "Frequency range", uz: "Chastota diapazoni" },
  range: { ru: "Радиус действия", en: "Range", uz: "Ishlash radiusi" },
  power: { ru: "Мощность передатчика", en: "Transmit power", uz: "Uzatgich quvvati" },
  batteryType: { ru: "Тип питания", en: "Power source", uz: "Quvvat manbayi" },
  batteryCapacity: {
    ru: "Ёмкость аккумулятора",
    en: "Battery capacity",
    uz: "Akkumulyator sig'imi",
  },
  batteryLife: {
    ru: "Время работы от аккумулятора",
    en: "Battery life",
    uz: "Akkumulyatordan ishlash vaqti",
  },
  charging: { ru: "Зарядка", en: "Charging", uz: "Quvvatlash" },
  channels: { ru: "Количество каналов", en: "Channels", uz: "Kanallar soni" },
  zones: { ru: "Зоны и каналы", en: "Zones and channels", uz: "Zonalar va kanallar" },
  contacts: { ru: "Контакты и группы", en: "Contacts and groups", uz: "Kontaktlar va guruhlar" },
  tones: { ru: "Тональные сигналы", en: "Tone signalling", uz: "Tonal signallar" },
  callTones: { ru: "Мелодии вызова", en: "Call tones", uz: "Chaqiruv ohanglari" },
  ingress: { ru: "Класс защиты", en: "Ingress protection", uz: "Himoya darajasi" },
  body: { ru: "Корпус", en: "Housing", uz: "Korpus" },
  display: { ru: "Дисплей", en: "Display", uz: "Displey" },
  vox: { ru: "Голосовая активация", en: "Voice activation", uz: "Ovozli aktivatsiya" },
  scanning: { ru: "Сканирование", en: "Scanning", uz: "Skanerlash" },
  encryption: { ru: "Шифрование", en: "Encryption", uz: "Shifrlash" },
  calls: { ru: "Типы вызовов", en: "Call types", uz: "Chaqiruv turlari" },
  management: {
    ru: "Управление радиостанцией",
    en: "Radio management",
    uz: "Radiostansiyani boshqarish",
  },
  loneWorker: {
    ru: "Режим одиночного работника",
    en: "Lone worker mode",
    uz: "Yolg'iz ishchi rejimi",
  },
  buttons: {
    ru: "Программируемые кнопки",
    en: "Programmable buttons",
    uz: "Programmalanadigan tugmalar",
  },
  audioJack: {
    ru: "Разъём для гарнитуры",
    en: "Audio accessory connector",
    uz: "Garnitura uchun ulagich",
  },
  dimensions: { ru: "Размеры (Ш×В×Т)", en: "Dimensions (W×H×D)", uz: "O'lchamlar (K×B×Ch)" },
  weight: { ru: "Вес", en: "Weight", uz: "Vazn" },
  packaging: {
    ru: "Размер упаковки (Ш×В×Г)",
    en: "Packaging (W×H×D)",
    uz: "Qadoq o'lchami (K×B×Ch)",
  },
  kit: { ru: "Раций в комплекте", en: "Radios per kit", uz: "Komplektdagi radiostansiyalar" },
  origin: {
    ru: "Страна производства",
    en: "Country of manufacture",
    uz: "Ishlab chiqarilgan mamlakat",
  },
  warranty: { ru: "Гарантийный срок", en: "Warranty", uz: "Kafolat muddati" },
  extras: { ru: "Дополнительно", en: "Also included", uz: "Qo'shimcha" },
  noise: { ru: "Шумоподавление", en: "Noise suppression", uz: "Shovqinni bostirish" },
  tot: {
    ru: "Ограничение времени передачи",
    en: "Transmit time-out timer",
    uz: "Uzatish vaqti chegarasi",
  },
  calling: { ru: "Стоимость вызовов", en: "Call charges", uz: "Chaqiruvlar narxi" },
} satisfies Record<string, L>;

/* ─────────────────────────────────────────────────────────────
   Recurring spec values
   ───────────────────────────────────────────────────────────── */

export const V = {
  pmr: { ru: "PMR", en: "PMR", uz: "PMR" },
  dmr: { ru: "DMR", en: "DMR", uz: "DMR" },
  freq446: { ru: "446–446.1 МГц", en: "446–446.1 MHz", uz: "446–446.1 MGts" },
  freq4460: { ru: "446.0–446.1 МГц", en: "446.0–446.1 MHz", uz: "446.0–446.1 MGts" },
  analog: { ru: "Аналоговый", en: "Analogue", uz: "Analog" },
  analogDigital: {
    ru: "Аналоговый и цифровой",
    en: "Analogue and digital",
    uz: "Analog va raqamli",
  },
  free: { ru: "Бесплатные вызовы", en: "Free of charge", uz: "Bepul chaqiruvlar" },
  niMhRechargeable: {
    ru: "Перезаряжаемые никель-металлгидридные аккумуляторы",
    en: "Rechargeable nickel-metal hydride batteries",
    uz: "Qayta quvvatlanadigan nikel-metallgidrid akkumulyatorlar",
  },
  liIonRechargeable: {
    ru: "Перезаряжаемые литиево-ионные аккумуляторы",
    en: "Rechargeable lithium-ion batteries",
    uz: "Qayta quvvatlanadigan litiy-ion akkumulyatorlar",
  },
  vox: {
    ru: "VOX — передача с голосовым управлением",
    en: "VOX — voice-operated transmission",
    uz: "VOX — ovoz bilan boshqariladigan uzatish",
  },
  voxHeadset: {
    ru: "VOX через гарнитуру",
    en: "VOX via headset",
    uz: "Garnitura orqali VOX",
  },
  ivox: { ru: "iVOX / VOX", en: "iVOX / VOX", uz: "iVOX / VOX" },
  scanMonitor: {
    ru: "Сканирование и мониторинг каналов",
    en: "Channel scanning and monitoring",
    uz: "Kanallarni skanerlash va monitoring",
  },
  lcdBacklit: {
    ru: "ЖК-дисплей с подсветкой",
    en: "Backlit LCD",
    uz: "Yoritilgan LCD displey",
  },
  usbC: {
    ru: "Через USB-C",
    en: "Over USB-C",
    uz: "USB-C orqali",
  },
  usbCProgramming: {
    ru: "Зарядка и программирование через USB-C",
    en: "Charging and programming over USB-C",
    uz: "USB-C orqali quvvatlash va programmalash",
  },
  tdmaTier2: {
    ru: "TDMA Tier II в конвенциональном режиме, прямая связь TDMA",
    en: "TDMA Tier II conventional, TDMA direct mode",
    uz: "Konvensional rejimda TDMA Tier II, TDMA to'g'ridan-to'g'ri aloqa",
  },
  callsAll: {
    ru: "Индивидуальные, групповые и общие вызовы",
    en: "Individual, group and all-call",
    uz: "Individual, guruh va umumiy chaqiruvlar",
  },
  radioManagement: {
    ru: "Проверка радиостанции, удалённый мониторинг, дистанционное отключение и восстановление",
    en: "Radio check, remote monitor, remote disable and re-enable",
    uz: "Radiostansiyani tekshirish, masofadan monitoring, masofadan o'chirish va tiklash",
  },
  aes256: {
    ru: "Аналоговый режим — скремблер речи; цифровой — шифрование AES-256",
    en: "Analogue — voice scrambler; digital — AES-256 voice encryption",
    uz: "Analog rejim — nutq skrembleri; raqamli — AES-256 shifrlash",
  },
  voiceAnnounce: {
    ru: "Голосовое оповещение о номере зоны и канала",
    en: "Voice announcement of zone and channel number",
    uz: "Zona va kanal raqami haqida ovozli xabar",
  },
  keypadLock: { ru: "Блокировка клавиатуры", en: "Keypad lock", uz: "Klaviatura blokirovkasi" },
  batteryIndicator: {
    ru: "Индикатор заряда батареи",
    en: "Battery level indicator",
    uz: "Batareya zaryadi indikatori",
  },
  roomMonitor: { ru: "Функция Room Monitor", en: "Room Monitor", uz: "Room Monitor funksiyasi" },
  yes: { ru: "Есть", en: "Yes", uz: "Bor" },
  china: { ru: "Китай", en: "China", uz: "Xitoy" },
  months12: { ru: "12 месяцев", en: "12 months", uz: "12 oy" },
  warrantyRadioOnly: {
    ru: "12 месяцев на радиоблок. Гарантия не распространяется на аксессуары и АКБ",
    en: "12 months on the radio unit. Accessories and batteries are not covered",
    uz: "Radioblokka 12 oy. Kafolat aksessuarlar va akkumulyatorlarga tatbiq etilmaydi",
  },
} satisfies Record<string, L>;

/* ─────────────────────────────────────────────────────────────
   Value builders for units
   ───────────────────────────────────────────────────────────── */

export const upToKm = (n: string): L => ({
  ru: `до ${n} км`,
  en: `up to ${n} km`,
  uz: `${n} km gacha`,
});

export const watts = (n: string): L => ({ ru: `${n} Вт`, en: `${n} W`, uz: `${n} Vt` });

export const mah = (n: string): L => ({
  ru: `${n} мА·ч`,
  en: `${n} mAh`,
  uz: `${n} mA·soat`,
});

export const liIon = (n: string): L => ({
  ru: `Аккумулятор Li-Ion ${n} мА·ч`,
  en: `Li-Ion battery, ${n} mAh`,
  uz: `Li-Ion akkumulyator, ${n} mA·soat`,
});

export const liPo = (n: string): L => ({
  ru: `Литий-полимерный аккумулятор ${n} мА·ч`,
  en: `Lithium-polymer battery, ${n} mAh`,
  uz: `Litiy-polimer akkumulyator, ${n} mA·soat`,
});

export const aaa = (n: string): L => ({
  ru: `${n}×AAA`,
  en: `${n}×AAA`,
  uz: `${n}×AAA`,
});

export const hours = (n: string): L => ({
  ru: `~${n} часов`,
  en: `~${n} hours`,
  uz: `~${n} soat`,
});

export const upToHours = (n: string): L => ({
  ru: `до ${n} часов`,
  en: `up to ${n} hours`,
  uz: `${n} soatgacha`,
});

export const mm = (d: string): L => ({ ru: `${d} мм`, en: `${d} mm`, uz: `${d} mm` });

export const grams = (n: string): L => ({ ru: `${n} г`, en: `${n} g`, uz: `${n} g` });

export const cm = (d: string): L => ({ ru: `${d} см`, en: `${d} cm`, uz: `${d} sm` });

export const channels = (n: string): L => ({
  ru: `${n} каналов`,
  en: `${n} channels`,
  uz: `${n} kanal`,
});

export const channelsCodes = (ch: string, codes: string): L => ({
  ru: `${ch} каналов + ${codes} кодов`,
  en: `${ch} channels + ${codes} codes`,
  uz: `${ch} kanal + ${codes} kod`,
});

export const radios = (n: string): L => ({
  ru: `${n} шт`,
  en: `${n} pcs`,
  uz: `${n} dona`,
});

export const callTones = (n: string): L => ({
  ru: `${n} мелодий вызова`,
  en: `${n} call tones`,
  uz: `${n} chaqiruv ohangi`,
});

export const pfb = (n: string): L => ({
  ru: `${n} программируемых функциональных кнопок (PFB)`,
  en: `${n} programmable function buttons (PFB)`,
  uz: `${n} programmalanadigan funksional tugma (PFB)`,
});

/* ─────────────────────────────────────────────────────────────
   Feature bullets

   The vendor sheets list capabilities as a flat bullet list, not as
   label/value pairs. Keeping them separate from `rows` avoids inventing
   labels ("Tone signalling: Keypad lock") that the source never had.
   ───────────────────────────────────────────────────────────── */

export const F = {
  freeCalls: { ru: "Бесплатные вызовы", en: "Free calls", uz: "Bepul chaqiruvlar" },
  vox: {
    ru: "Система передачи сигнала с голосовым управлением VOX",
    en: "VOX voice-operated transmission",
    uz: "VOX ovozli boshqarish tizimi",
  },
  voxHeadset: {
    ru: "Голосовая активация через гарнитуру (VOX)",
    en: "Voice activation via headset (VOX)",
    uz: "Garnitura orqali ovozli aktivatsiya (VOX)",
  },
  ivox: { ru: "Функции iVOX / VOX", en: "iVOX / VOX", uz: "iVOX / VOX funksiyalari" },
  scanMonitor: {
    ru: "Сканирование и мониторинг каналов",
    en: "Channel scanning and monitoring",
    uz: "Kanallarni skanerlash va monitoring",
  },
  roomMonitor: { ru: "Функция Room Monitor", en: "Room Monitor", uz: "Room Monitor funksiyasi" },
  lcdBacklit: {
    ru: "ЖК-дисплей с подсветкой",
    en: "Backlit LCD display",
    uz: "Yoritilgan LCD displey",
  },
  lcd3Backlight: {
    ru: "ЖК-дисплей с 3 видами подсветки",
    en: "LCD with three backlight modes",
    uz: "3 xil yoritishli LCD displey",
  },
  ledDisplay: {
    ru: "Небьющийся сегментированный LED-дисплей",
    en: "Shatterproof segmented LED display",
    uz: "Sinmaydigan segmentli LED displey",
  },
  keypadLock: { ru: "Блокировка клавиатуры", en: "Keypad lock", uz: "Klaviatura blokirovkasi" },
  batteryIndicator: {
    ru: "Индикатор заряда батареи",
    en: "Battery level indicator",
    uz: "Batareya zaryadi indikatori",
  },
  lowBatteryAlert: {
    ru: "Сигнал предупреждения о разряде аккумулятора",
    en: "Low-battery warning tone",
    uz: "Quvvat tugashi haqida ogohlantirish signali",
  },
  headsetJack: {
    ru: "Разъём для гарнитуры",
    en: "Headset connector",
    uz: "Garnitura uchun ulagich",
  },
  niMh: {
    ru: "Перезаряжаемые никель-металлгидридные аккумуляторы",
    en: "Rechargeable nickel-metal hydride batteries",
    uz: "Qayta quvvatlanadigan nikel-metallgidrid akkumulyatorlar",
  },
  liIon: {
    ru: "Перезаряжаемые литиево-ионные аккумуляторы",
    en: "Rechargeable lithium-ion batteries",
    uz: "Qayta quvvatlanadigan litiy-ion akkumulyatorlar",
  },
  vibrate: { ru: "Виброзвонок", en: "Vibrate alert", uz: "Tebranishli chaqiruv" },
  torchAuto: {
    ru: "Встроенный автоматический фонарик",
    en: "Built-in automatic torch",
    uz: "Ichki avtomatik fonar",
  },
  torchLed: { ru: "Светодиодный фонарик", en: "LED torch", uz: "LED fonar" },
  whistleClips: {
    ru: "Клипсы со встроенными свистками",
    en: "Belt clips with integrated whistles",
    uz: "Ichki hushtakli qisqichlar",
  },
  waterproofBody: {
    ru: "Корпус водонепроницаемый, противоударный",
    en: "Waterproof, shock-resistant housing",
    uz: "Suv o'tkazmaydigan, zarbaga chidamli korpus",
  },
  antibacterial: {
    ru: "Антибактериальный корпус",
    en: "Antibacterial housing",
    uz: "Antibakterial korpus",
  },
  antimicrobial: {
    ru: "Корпус из поликарбоната с антимикробным покрытием",
    en: "Polycarbonate housing with antimicrobial coating",
    uz: "Antimikrob qoplamali polikarbonat korpus",
  },
  bigPtt: {
    ru: "Крупная переговорная кнопка по центру корпуса с удобным доступом",
    en: "Large centre-mounted push-to-talk button",
    uz: "Korpus markazidagi yirik so'zlashuv tugmasi",
  },
  easyPairing: {
    ru: "Лёгкое сопряжение раций в группе",
    en: "Easy group pairing",
    uz: "Guruhda ratsiyalarni oson ulash",
  },
  chargingDock: {
    ru: "Зарядная док-станция в комплекте",
    en: "Charging dock included",
    uz: "Komplektda quvvatlash dok-stansiyasi",
  },
  noiseSuppression: { ru: "Шумоподавление", en: "Noise suppression", uz: "Shovqinni bostirish" },
  bgNoise: {
    ru: "Подавление фонового шума",
    en: "Background noise suppression",
    uz: "Fon shovqinini bostirish",
  },
  tot: {
    ru: "Функция TOT — таймер, ограничивающий время передачи",
    en: "TOT — transmit time-out timer",
    uz: "TOT — uzatish vaqtini cheklovchi taymer",
  },
  vfoMr: {
    ru: "Режим работы VFO / MR",
    en: "VFO / MR operating modes",
    uz: "VFO / MR ishlash rejimi",
  },
  tdma: {
    ru: "Поддержка TDMA Tier II в конвенциональном режиме и режим прямой связи TDMA",
    en: "TDMA Tier II conventional support and TDMA direct mode",
    uz: "Konvensional rejimda TDMA Tier II va TDMA to'g'ridan-to'g'ri aloqa rejimi",
  },
  voiceAnnounce: {
    ru: "Голосовое оповещение о номере зоны и канала",
    en: "Voice announcement of zone and channel number",
    uz: "Zona va kanal raqami haqida ovozli xabar",
  },
  callsAll: {
    ru: "Индивидуальные, групповые и общие вызовы",
    en: "Individual, group and all-call",
    uz: "Individual, guruh va umumiy chaqiruvlar",
  },
  radioManagement: {
    ru: "Проверка радиостанции, удалённый мониторинг, дистанционное отключение и восстановление рации",
    en: "Radio check, remote monitor, remote disable and re-enable",
    uz: "Radiostansiyani tekshirish, masofadan monitoring, masofadan o'chirish va tiklash",
  },
  aes256: {
    ru: "Аналоговый режим — скремблер речи; цифровой — шифрование голоса AES-256",
    en: "Analogue mode — voice scrambler; digital — AES-256 voice encryption",
    uz: "Analog rejim — nutq skrembleri; raqamli — AES-256 ovoz shifrlash",
  },
  loneWorker: {
    ru: "Режим работы в одиночку",
    en: "Lone worker mode",
    uz: "Yolg'iz ishlash rejimi",
  },
  usbCharging: {
    ru: "Поддержка зарядки через USB-C",
    en: "USB-C charging",
    uz: "USB-C orqali quvvatlash",
  },
  usbCProgramming: {
    ru: "Зарядка и программирование через USB-C",
    en: "Charging and programming over USB-C",
    uz: "USB-C orqali quvvatlash va programmalash",
  },
} satisfies Record<string, L>;

/** "8 тонов CTCSS и 210 кодов DCS в TX и RX" — the tone/code line varies per model. */
export const toneCodes = (tones: string, codes: string, kind = "CTCSS/DCS"): L => ({
  ru: `${tones} тонов CTCSS и ${codes} кодов DCS в TX и RX`,
  en: `${tones} CTCSS tones and ${codes} DCS codes on TX and RX`,
  uz: `TX va RX da ${tones} CTCSS toni va ${codes} DCS kodi`,
});

export const pfbFeature = (n: string): L => ({
  ru: `${n} программируемых функциональных кнопок (PFB)`,
  en: `${n} programmable function buttons (PFB)`,
  uz: `${n} programmalanadigan funksional tugma (PFB)`,
});

export const audioConnector = (name: string): L => ({
  ru: `Разъём для аудиоаксессуаров ${name}`,
  en: `${name} audio accessory connector`,
  uz: `${name} audio aksessuar ulagichi`,
});

/** The manufacturer's line-of-sight disclaimer, printed under every range figure. */
export const RANGE_NOTE: L = {
  ru: "Указанный радиус действия рассчитан в условиях прямой видимости и при оптимальной погоде. Фактическая дальность зависит от рельефа, погодных условий, электромагнитных помех и физических препятствий и обычно меньше максимально возможного показателя.",
  en: "The stated range assumes line of sight in optimal weather. Actual range depends on terrain, weather, electromagnetic interference and physical obstructions, and is normally shorter than the maximum figure.",
  uz: "Ko'rsatilgan radius to'g'ridan-to'g'ri ko'rinish va qulay ob-havo sharoitida hisoblangan. Haqiqiy masofa relyef, ob-havo, elektromagnit to'siqlar va jismoniy to'siqlarga bog'liq bo'lib, odatda maksimal ko'rsatkichdan kam bo'ladi.",
};
