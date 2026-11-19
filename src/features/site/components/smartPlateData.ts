export type FoodCategory = "budget" | "polo" | "khoresht" | "kabab" | "seafood" | "traditional";

export type FilterGroupId = "all" | "budget" | "polo_khoresht" | "kabab_seafood";

export interface FilterGroupOption {
  id: FilterGroupId;
  label: string;
  mobileLabel: string;
  matches: (cat: FoodCategory) => boolean;
}

export const SMART_PLATE_FILTERS: FilterGroupOption[] = [
  {
    id: "all",
    label: "همه (+۱۰۰۰)",
    mobileLabel: "همه",
    matches: () => true,
  },
  {
    id: "budget",
    label: "اقتصادی و فوری",
    mobileLabel: "اقتصادی",
    matches: (cat) => cat === "budget" || cat === "traditional",
  },
  {
    id: "polo_khoresht",
    label: "پلو و خورش",
    mobileLabel: "پلو و خورش",
    matches: (cat) => cat === "polo" || cat === "khoresht",
  },
  {
    id: "kabab_seafood",
    label: "کباب و دریایی",
    mobileLabel: "کباب و ماهی",
    matches: (cat) => cat === "kabab" || cat === "seafood",
  },
];

export interface BaseDishTemplate {
  name: string;
  category: FoodCategory;
  categoryLabel: string;
  image: string;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

export interface OrbitFoodItem extends BaseDishTemplate {
  index: number;
  code: string;
  ringIndex: number;
  angleRad: number;
  xPct: number;
  yPct: number;
  launchOffsetX: number;
  launchOffsetY: number;
}

export interface CategoryRadialTheme {
  id: FoodCategory;
  label: string;
  primaryStop: string;
  secondaryStop: string;
  outerStop: string;
  haloBorder: string;
  accentHex: string;
}

export const CATEGORY_RADIAL_THEMES: Record<FoodCategory, CategoryRadialTheme> = {
  budget: {
    id: "budget",
    label: "اقتصادی و دم‌دستی",
    primaryStop: "rgba(240, 152, 72, 0.44)",
    secondaryStop: "rgba(225, 118, 68, 0.20)",
    outerStop: "rgba(251, 244, 236, 0)",
    haloBorder: "rgba(224, 122, 48, 0.48)",
    accentHex: "#D46A28",
  },
  polo: {
    id: "polo",
    label: "پلو و چلوی زعفرانی",
    primaryStop: "rgba(235, 168, 84, 0.42)",
    secondaryStop: "rgba(217, 107, 67, 0.18)",
    outerStop: "rgba(251, 244, 236, 0)",
    haloBorder: "rgba(217, 130, 43, 0.45)",
    accentHex: "#C87A28",
  },
  khoresht: {
    id: "khoresht",
    label: "خورش‌های اصیل",
    primaryStop: "rgba(200, 100, 70, 0.38)",
    secondaryStop: "rgba(232, 165, 130, 0.18)",
    outerStop: "rgba(251, 244, 236, 0)",
    haloBorder: "rgba(200, 100, 70, 0.45)",
    accentHex: "#C86446",
  },
  kabab: {
    id: "kabab",
    label: "کباب و گریل رژیمی",
    primaryStop: "rgba(214, 114, 82, 0.40)",
    secondaryStop: "rgba(240, 180, 120, 0.18)",
    outerStop: "rgba(251, 244, 236, 0)",
    haloBorder: "rgba(214, 114, 82, 0.45)",
    accentHex: "#B85638",
  },
  seafood: {
    id: "seafood",
    label: "دریایی و خوراک سالم",
    primaryStop: "rgba(230, 148, 96, 0.40)",
    secondaryStop: "rgba(242, 196, 152, 0.18)",
    outerStop: "rgba(251, 244, 236, 0)",
    haloBorder: "rgba(217, 122, 68, 0.45)",
    accentHex: "#C46B3B",
  },
  traditional: {
    id: "traditional",
    label: "سنتی و آش ایرانی",
    primaryStop: "rgba(196, 125, 92, 0.38)",
    secondaryStop: "rgba(228, 178, 145, 0.18)",
    outerStop: "rgba(251, 244, 236, 0)",
    haloBorder: "rgba(184, 108, 74, 0.45)",
    accentHex: "#A85D3B",
  },
};

export function getCategoryRadialTheme(category: FoodCategory): CategoryRadialTheme {
  return CATEGORY_RADIAL_THEMES[category] ?? CATEGORY_RADIAL_THEMES.budget;
}

export function toPersianDigits(num: number): string {
  const digits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(num)
    .split("")
    .map((c) => digits[Number(c)] ?? c)
    .join("");
}

export const DISH_TEMPLATES: BaseDishTemplate[] = [
  {
    name: "املت گوجه سنتی بازاری با نان سنگک و ریحان",
    category: "budget",
    categoryLabel: "اقتصادی و فوری",
    image: "/src/assets/images/plate_persian_omelet_sangak_1795045782251.jpg",
    kcal: 365,
    proteinG: 26,
    carbsG: 34,
    fatG: 12,
    proteinPct: 38,
    carbsPct: 42,
    fatPct: 20,
  },
  {
    name: "زرشک‌پلو مجلسی با فیله مرغ زعفرانی",
    category: "polo",
    categoryLabel: "پلوهای زعفرانی",
    image: "/src/assets/images/plate_zereshk_polo_chicken_1795044185850.jpg",
    kcal: 425,
    proteinG: 41,
    carbsG: 37,
    fatG: 11,
    proteinPct: 46,
    carbsPct: 37,
    fatPct: 17,
  },
  {
    name: "عدسی سنتی با گلپر، روغن زیتون بکر و لیمو ترش",
    category: "budget",
    categoryLabel: "اقتصادی و فوری",
    image: "/src/assets/images/plate_adasi_lentil_bowl_1795045783235.jpg",
    kcal: 340,
    proteinG: 24,
    carbsG: 42,
    fatG: 9,
    proteinPct: 36,
    carbsPct: 47,
    fatPct: 17,
  },
  {
    name: "خورش قورمه‌سبزی جاافتاده با گوشت لخم",
    category: "khoresht",
    categoryLabel: "خورش‌های اصیل",
    image: "/src/assets/images/plate_ghormeh_sabzi_stew_1795044187091.jpg",
    kcal: 415,
    proteinG: 37,
    carbsG: 35,
    fatG: 13,
    proteinPct: 43,
    carbsPct: 37,
    fatPct: 20,
  },
  {
    name: "کوکو سبزی گردویی تنوری با زرشک و گوجه",
    category: "budget",
    categoryLabel: "اقتصادی و فوری",
    image: "/src/assets/images/plate_kookoo_sabzi_walnut_1795045786408.jpg",
    kcal: 355,
    proteinG: 23,
    carbsG: 31,
    fatG: 14,
    proteinPct: 35,
    carbsPct: 41,
    fatPct: 24,
  },
  {
    name: "جوجه کباب فیله زعفرانی با لیمو ترش تازه",
    category: "kabab",
    categoryLabel: "کباب و گریل",
    image: "/src/assets/images/plate_joojeh_kabab_saffron_1795044188386.jpg",
    kcal: 410,
    proteinG: 44,
    carbsG: 32,
    fatG: 11,
    proteinPct: 49,
    carbsPct: 33,
    fatPct: 18,
  },
  {
    name: "ماکارونی ایرانی کم‌روغن با ته‌دیگ سیب‌زمینی",
    category: "budget",
    categoryLabel: "اقتصادی و محبوب",
    image: "/src/assets/images/plate_persian_macaroni_tahdig_1795045783546.jpg",
    kcal: 420,
    proteinG: 33,
    carbsG: 45,
    fatG: 11,
    proteinPct: 39,
    carbsPct: 44,
    fatPct: 17,
  },
  {
    name: "میرزاقاسمی اصیل گیلانی با گوجه کبابی و تخم‌مرغ",
    category: "budget",
    categoryLabel: "اقتصادی و سنتی",
    image: "/src/assets/images/plate_mirza_ghasemi_eggs_1795044188688.jpg",
    kcal: 380,
    proteinG: 29,
    carbsG: 35,
    fatG: 13,
    proteinPct: 39,
    carbsPct: 40,
    fatPct: 21,
  },
  {
    name: "عدس‌پلو با کشمش پلویی، خرما و کوفته‌ریزه",
    category: "budget",
    categoryLabel: "اقتصادی و مقوی",
    image: "/src/assets/images/plate_adas_polo_dates_1795044191710.jpg",
    kcal: 430,
    proteinG: 38,
    carbsG: 40,
    fatG: 12,
    proteinPct: 42,
    carbsPct: 40,
    fatPct: 18,
  },
  {
    name: "باقلاپلو با ماهیچه لطیف و زعفران",
    category: "polo",
    categoryLabel: "پلوهای زعفرانی",
    image: "/src/assets/images/plate_baghali_polo.webp",
    kcal: 450,
    proteinG: 43,
    carbsG: 36,
    fatG: 12,
    proteinPct: 47,
    carbsPct: 36,
    fatPct: 17,
  },
  {
    name: "ته‌چین مرغ قالبی با برشتگی زعفرانی",
    category: "polo",
    categoryLabel: "پلوهای زعفرانی",
    image: "/src/assets/images/plate_tahchin_saffron.webp",
    kcal: 435,
    proteinG: 38,
    carbsG: 39,
    fatG: 12,
    proteinPct: 43,
    carbsPct: 39,
    fatPct: 18,
  },
  {
    name: "خورش فسنجان ملس با فیله مرغ و گردو",
    category: "khoresht",
    categoryLabel: "خورش‌های اصیل",
    image: "/src/assets/images/plate_fesenjan_walnut.webp",
    kcal: 440,
    proteinG: 36,
    carbsG: 30,
    fatG: 17,
    proteinPct: 41,
    carbsPct: 34,
    fatPct: 25,
  },
  {
    name: "کباب ترش و باقلاقاتق اصیل گیلانی",
    category: "kabab",
    categoryLabel: "کباب و گریل",
    image: "/src/assets/images/plate_shomali_dish.webp",
    kcal: 420,
    proteinG: 39,
    carbsG: 31,
    fatG: 13,
    proteinPct: 45,
    carbsPct: 36,
    fatPct: 19,
  },
  {
    name: "قلیه ماهی بوشهری و میگو پلو زعفرانی",
    category: "seafood",
    categoryLabel: "دریایی و سالم",
    image: "/src/assets/images/plate_southern_seafood.webp",
    kcal: 395,
    proteinG: 42,
    carbsG: 28,
    fatG: 11,
    proteinPct: 49,
    carbsPct: 32,
    fatPct: 19,
  },
  {
    name: "آش رشته اصیل ایرانی با کشک و نعناداغ",
    category: "traditional",
    categoryLabel: "اقتصادی و سنتی",
    image: "/src/assets/images/plate_ash_reshteh.webp",
    kcal: 365,
    proteinG: 27,
    carbsG: 41,
    fatG: 10,
    proteinPct: 36,
    carbsPct: 46,
    fatPct: 18,
  },
  {
    name: "سبزی‌پلو با ماهی تنوری و لیمو تازه",
    category: "seafood",
    categoryLabel: "دریایی و سالم",
    image: "/src/assets/images/goal_weight_loss_dish_1794952765851.webp",
    kcal: 390,
    proteinG: 41,
    carbsG: 27,
    fatG: 12,
    proteinPct: 48,
    carbsPct: 31,
    fatPct: 21,
  },
];

// Curated authentic dishes directly from the user's 1..998 food names catalog
export const CATEGORY_FOOD_NAMES: Record<FoodCategory, string[]> = {
  budget: [
    "املت گوجه سنتی بازاری با نان بربری و ریحان",
    "عدسی سنتی با گلپر، روغن زیتون بکر و لیمو ترش",
    "کوکو سبزی گردویی با زرشک مجلسی",
    "کوکو سیب‌زمینی پخته کم‌روغن با گوجه و خیارشور خونگی",
    "ماکارونی ایرانی با ته‌دیگ سیب‌زمینی",
    "دمپختک دمی گوجه سنتی با سیب‌زمینی",
    "خوراک لوبیاچیتی با قارچ و روغن زیتون",
    "نیمرو عسلی در روغن زیتون با نان جو و سبزی خوردن",
    "نان سنگک تازه با پنیر لیقوان و گردوی تویسرکان",
    "کتلت گوشت مامان‌پز تنوری بدون روغن",
    "فلافل ترد خانگی در ایرفرایر با ادویه اهوازی",
    "یتیمچه بادمجان و کدو سنتی کم‌روغن",
    "استانبولی پلو با تکه‌های سینه مرغ و گوجه فرنگی",
    "نرگسی اسفناج با تخم‌مرغ و نان سنگک",
    "اشکنه اصفهانی با شنبلیله و نان تازه",
    "کله جوش اصفهانی با گردو و نعناداغ",
    "بورانی اسفناج کم‌چرب با تخم‌مرغ نیمرو و نان جو",
    "خوراک کله‌گنجشکی سنتی با سیب‌زمینی نگینی",
    "کوکو کدو سبز با پنیر فتا و شوید",
    "دمی بلغور گندم و عدس سنتی روستایی",
  ],
  polo: [
    "زرشک‌پلو مجلسی با فیله مرغ زعفرانی",
    "باقلاپلو با ماهیچه لطیف و آب پیاز زعفرانی",
    "ته‌چین مرغ قالبی با برشتگی زعفرانی",
    "عدس‌پلو با کشمش پلویی، خرما و کوفته‌ریزه",
    "لوبیاپلو شیرازی با گوشت تکه‌ای و دارچین",
    "کلم‌پلو شیرازی با کوفته قلقلی و سبزی‌های معطر",
    "آلبالوپلو با فیله مرغ زعفرانی و خلال پسته",
    "مرصع‌پلو و رنگارنگ",
    "ماش‌پلو با گوشت بوقلمون چرخ‌کرده و شوید",
    "رشته‌پلو سنتی با گوشت قلقلی و خرما",
    "استانبولی پلو با تکه‌های سینه مرغ و گوجه فرنگی",
    "ته‌چین اسفناج و فیله مرغ",
    "هویج‌پلو تبریزی با فیله مرغ و خلال پسته",
    "والک‌پلو بهاره تهرانی با فیله مرغ",
    "قنبرپلو شیرازی با رب انار و گردو",
    "قابلی پلو خراسانی با هویج و کشمش",
    "کته برنج قهوه‌ای با مرغ زعفرانی",
    "قیمه نثار سنتی قزوین با گوشت راسته و خلال پسته",
    "شله بریان با زیره اصفهان",
    "سیب‌پلو کرمانشاهی با گوشت",
  ],
  khoresht: [
    "خورش قورمه‌سبزی جاافتاده با گوشت لخم و لیمو عمانی",
    "خورش قیمه سنتی با خلال سیب‌زمینی تنوری برشته",
    "خورش فسنجان ملس با فیله مرغ و دانه انار",
    "خورش کرفس کم‌روغن با نعنا و جعفری و فیله مرغ",
    "خورش قیمه بادمجان کم‌روغن با غوره",
    "خورش بامیه خوزستانی با سیر و تمبر هندی",
    "خورش آلو اسفناج مجلسی با گوشت راسته",
    "خورش خلال بادام مجلسی کرمانشاهی با زرشک سیاه",
    "خورش به و آلو سنتی اصفهان با دارچین",
    "خورش ریواس بهاره ترش و ملس",
    "خورش اناربیج گیلانی با کوفته‌ریزه و گردو",
    "خورش کدو سبز با گوجه تازه و غوره",
    "خورش هویج و آلو تبریزی زعفرانی",
    "باقلاقاتوق اصیل گیلانی با شوید تازه و تخم‌مرغ عسلی",
    "ترش تره گیلانی با سبزی‌های معطر و آب نارنج",
    "مرغ ترش گیلانی",
    "خورشت آلو مسما",
    "خورش سیرقلیه",
    "خورش کنگر آذربایجان",
    "خورش غوره مسما",
  ],
  kabab: [
    "جوجه کباب فیله زعفرانی با لیمو ترش تازه",
    "کباب کوبیده زعفرانی با گوجه کبابی و سماق",
    "کباب برگ راسته گوسفندی لطیف",
    "جوجه کباب ترش گیلانی با رب انار و گردو",
    "کباب چنجه ماستی با راسته گوساله لخم",
    "کباب تابه‌ای با سس گوجه فرنگی تازه",
    "کباب شیشلیک با گوجه کبابی",
    "جوجه کباب ماستی لاری با لیمو و پاپریکا",
    "کباب بختیاری دورنگ",
    "پلا کباب با اشپل و باقلا",
    "کباب کاسه‌ای اردبیل",
    "کباب بناب ساطوری",
    "دنده کباب کرمانشاهی با نان سنگک",
    "کباب چنجه مشهدی با پیاز و لیمو",
    "کباب تابه‌ای با گوجه فرنگی پخته و کته زعفرانی",
    "کباب برگ سلطانی با چلو زعفرانی و گوجه",
    "گمج کباب با گوشت گوساله و انار ترش",
    "شامی کباب بروجردی با سس انار ترش",
    "کتلت گوشت مامان‌پز تنوری بدون روغن",
    "تاس‌کباب سنتی با به، هویج، آلو و گوشت تکه‌ای",
  ],
  seafood: [
    "سبزی‌پلو با ماهی قزل‌آلا تنوری و لیمو",
    "میگو پلو زعفرانی بوشهری با گشنیز و تمبر هندی",
    "قلیه ماهی بوشهری با ماهی شیر و تمبر هندی",
    "قلیه میگو تند خوزستانی با سیر فراوان",
    "دمپخت ماهی بوشهری",
    "هواری پلو ماهی هرمزگان",
    "هزاری پلو میگو هرمزگان",
    "شوید پلو با تن ماهی کم‌نمک",
    "خوراک دوپیازه میگو بوشهری با سیب‌زمینی",
    "ماهی صبور شکم‌پر کبابی با حشو تمبر هندی",
    "ماهی کباب فیله سنگسر با ادویه گرم جنوبی",
    "ماهی سوف کبابی انزلی",
    "ماهی سرخو سوخاری در فر",
    "ماهی حواسیل تنوری",
    "ماهی برشته هرمزگانی",
    "کوفته میگو بندری",
    "ماهی فیبیج",
    "میگو پلو بوشهری با گشنیز و شنبلیله",
    "ترشی انبه بندری با چلو میگو",
    "برنج دیشو با ماهی برشته",
  ],
  traditional: [
    "میرزاقاسمی اصیل گیلانی با گوجه کبابی دودی و تخم‌مرغ",
    "آش رشته اصیل ایرانی با کشک و نعناداغ",
    "کشک بادمجان مجلسی کم‌روغن با نعناداغ و گردو",
    "کوفته تبریزی مجلسی با آلو، گردو و تخم‌مرغ",
    "دلمه برگ مو تبریزی با چاشنی ملس سرکه شیره",
    "دیزی سنگی با ترشی و سبزی خوردن",
    "آش دوغ اردبیل با کوفته‌ریزه و سیر تازه",
    "آش شله‌قلمکار سنتی با گوشت لخم ریش‌شده",
    "کوکو سبزی گردویی با زرشک مجلسی",
    "حلیم بادمجان اصفهان",
    "کله جوش اصفهانی",
    "آش شولی یزد",
    "خوراک لوبیاچیتی با قارچ و روغن زیتون",
    "یتیمچه بادمجان و کدو سنتی کم‌روغن",
    "دلمه فلفل دلمه‌ای رنگی شکم‌پر",
    "سوپ جو قرمز با فیله مرغ، هویج و جعفری",
    "نرگسی اسفناج",
    "بورانی اسفناج کم‌چرب با تخم‌مرغ نیمرو و نان جو",
    "عدسی سنتی با گلپر، روغن زیتون بکر و لیمو ترش",
    "کال‌کباب اصیل با بادمجان کبابی و چوچاق",
  ],
};

// 4 Concentric Orbital Rings totaling 100 circular food items (14 + 22 + 28 + 36 = 100)
export const ORBIT_RINGS_CONFIG = [
  {
    ringIndex: 0,
    count: 14,
    diameterPct: 54,
    durationSec: 38,
    direction: "cw" as const,
    circleSizeClass: "h-5.5 w-5.5 sm:h-7 sm:w-7",
  },
  {
    ringIndex: 1,
    count: 22,
    diameterPct: 71,
    durationSec: 52,
    direction: "ccw" as const,
    circleSizeClass: "h-5 w-5 sm:h-6.5 sm:w-6.5",
  },
  {
    ringIndex: 2,
    count: 28,
    diameterPct: 88,
    durationSec: 68,
    direction: "cw" as const,
    circleSizeClass: "h-4.5 w-4.5 sm:h-5.5 sm:w-5.5",
  },
  {
    ringIndex: 3,
    count: 36,
    diameterPct: 105,
    durationSec: 86,
    direction: "ccw" as const,
    circleSizeClass: "h-4 w-4 sm:h-5 sm:w-5",
  },
];

export const ORBIT_FOODS_100: OrbitFoodItem[] = (() => {
  const list: OrbitFoodItem[] = [];
  let globalIdx = 0;

  for (const ring of ORBIT_RINGS_CONFIG) {
    for (let i = 0; i < ring.count; i++) {
      const index = globalIdx++;
      const base = DISH_TEMPLATES[(index * 5 + ring.ringIndex * 3) % DISH_TEMPLATES.length];
      const namePool = CATEGORY_FOOD_NAMES[base.category];
      const dishName = namePool[index % namePool.length];

      const angleOffset = (ring.ringIndex * Math.PI) / 7;
      const angleRad = (i / ring.count) * Math.PI * 2 + angleOffset;
      const xPct = 50 + 50 * Math.cos(angleRad);
      const yPct = 50 + 50 * Math.sin(angleRad);

      const radiusPx = (ring.diameterPct / 100) * 135;
      const launchOffsetX = Math.round(Math.cos(angleRad) * radiusPx);
      const launchOffsetY = Math.round(Math.sin(angleRad) * radiusPx);
      const kcalOffset = ((index * 13) % 36) - 18;

      const proteinPct = Math.min(56, Math.max(30, base.proteinPct + ((index % 5) - 2)));
      const carbsPct = Math.min(50, Math.max(24, base.carbsPct + (((index + 2) % 5) - 2)));
      const fatPct = Math.max(14, 100 - proteinPct - carbsPct);

      list.push({
        ...base,
        name: dishName,
        index,
        code: `#${toPersianDigits(1 + ((index * 9) % 998))}`,
        ringIndex: ring.ringIndex,
        angleRad,
        xPct,
        yPct,
        launchOffsetX,
        launchOffsetY,
        kcal: base.kcal + kcalOffset,
        proteinPct,
        carbsPct,
        fatPct,
        proteinG: Math.max(22, base.proteinG + ((index % 5) - 2)),
        carbsG: Math.max(22, base.carbsG + (((index + 2) % 5) - 2)),
        fatG: Math.max(8, base.fatG + ((index % 3) - 1)),
      });
    }
  }
  return list;
})();
