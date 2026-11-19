import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Icon, type IconName } from "../icons";
import { LottieLineIcon } from "../lottieData";

const MotionLink = motion.create(Link);

type AppTabId = "swap" | "coach";

interface MealVariant {
  modeLabel: string;
  shortLabel: string;
  title: string;
  kcal: string;
  protein: string;
  image: string;
  costTag: string;
}

interface MealSlot {
  id: string;
  mealTime: string;
  variants: [MealVariant, MealVariant, MealVariant];
}

const MEAL_SLOTS: MealSlot[] = [
  {
    id: "breakfast",
    mealTime: "صبحانه",
    variants: [
      {
        modeLabel: "پیشنهاد اصلی",
        shortLabel: "اصلی",
        title: "نان سنگک، پنیر و گردو",
        kcal: "۳۴۰ کالری",
        protein: "۱۶ گرم پروتئین",
        image: "/src/assets/images/plate_persian_omelet_sangak_1795045782251.jpg",
        costTag: "سفرهٔ خانه",
      },
      {
        modeLabel: "جایگزین اقتصادی",
        shortLabel: "اقتصادی",
        title: "عدسی داغ با لیمو و نان",
        kcal: "۳۴۰ کالری",
        protein: "۱۹ گرم پروتئین",
        image: "/src/assets/images/plate_adasi_lentil_bowl_1795045783235.jpg",
        costTag: "اقتصادی",
      },
      {
        modeLabel: "جایگزین فوری",
        shortLabel: "فوری",
        title: "املت گوجه با نان سنگک",
        kcal: "۳۴۵ کالری",
        protein: "۱۸ گرم پروتئین",
        image: "/src/assets/images/plate_persian_omelet_sangak_1795045782251.jpg",
        costTag: "۱۰ دقیقه‌ای",
      },
    ],
  },
  {
    id: "lunch",
    mealTime: "ناهار",
    variants: [
      {
        modeLabel: "پیشنهاد اصلی",
        shortLabel: "اصلی",
        title: "زرشک‌پلو با مرغ زعفرانی",
        kcal: "۴۲۵ کالری",
        protein: "۴۱ گرم پروتئین",
        image: "/src/assets/images/plate_zereshk_polo_chicken_1795044185850.jpg",
        costTag: "ناهار خانواده",
      },
      {
        modeLabel: "جایگزین اقتصادی",
        shortLabel: "اقتصادی",
        title: "ماکارونی ایرانی با ته‌دیگ",
        kcal: "۴۲۰ کالری",
        protein: "۳۳ گرم پروتئین",
        image: "/src/assets/images/plate_persian_macaroni_tahdig_1795045783546.jpg",
        costTag: "اقتصادی",
      },
      {
        modeLabel: "جایگزین فوری",
        shortLabel: "فوری",
        title: "کوکو سبزی گردویی با نان",
        kcal: "۴۱۰ کالری",
        protein: "۲۷ گرم پروتئین",
        image: "/src/assets/images/plate_kookoo_sabzi_walnut_1795045786408.jpg",
        costTag: "فوری",
      },
    ],
  },
  {
    id: "dinner",
    mealTime: "شام",
    variants: [
      {
        modeLabel: "پیشنهاد اصلی",
        shortLabel: "اصلی",
        title: "جوجه کباب زعفرانی با گوجه",
        kcal: "۳۸۰ کالری",
        protein: "۴۲ گرم پروتئین",
        image: "/src/assets/images/plate_joojeh_kabab_saffron_1795044188386.jpg",
        costTag: "شام سبک",
      },
      {
        modeLabel: "جایگزین اقتصادی",
        shortLabel: "اقتصادی",
        title: "میرزاقاسمی با تخم‌مرغ",
        kcal: "۳۷۵ کالری",
        protein: "۲۸ گرم پروتئین",
        image: "/src/assets/images/plate_mirza_ghasemi_eggs_1795044188688.jpg",
        costTag: "اقتصادی",
      },
      {
        modeLabel: "جایگزین فوری",
        shortLabel: "فوری",
        title: "خوراک عدس و سیب‌زمینی",
        kcal: "۳۷۰ کالری",
        protein: "۲۵ گرم پروتئین",
        image: "/src/assets/images/plate_adasi_lentil_bowl_1795045783235.jpg",
        costTag: "فوری",
      },
    ],
  },
];

interface CoachScenario {
  id: string;
  label: string;
  question: string;
  coachReply: string;
  actionNote: string;
}

const COACH_SCENARIOS: CoachScenario[] = [
  {
    id: "budget",
    label: "غذای اقتصادی",
    question: "مرغ و گوشت تو خونه ندارم، ناهار اقتصادی چی بخورم؟",
    coachReply:
      "وعده ناهارت رو در اپ روی «جایگزین اقتصادی» گذاشتم: یک بشقاب ماکارونی کم‌روغن یا املت گوجه با سنگک بخور. دقیقاً همون ۴۲۰ کالریه!",
    actionNote: "جایگزینی خودکار در برنامه",
  },
  {
    id: "party",
    label: "مهمانی شب",
    question: "امشب مهمونی قورمه‌سبزی داریم، رژیمم خراب می‌شه؟",
    coachReply:
      "اصلاً! ۶ قاشق برنج + ۴ قاشق قورمه‌سبزی کم‌روغن بخور. کالری عصرونه‌ات رو بالانس کردم تا فردا هم وزنت پایین بیاد.",
    actionNote: "بالانس هوشمند کالری روزانه",
  },
  {
    id: "craving",
    label: "هوس شیرینی",
    question: "عصری هوس شیرینی کردم، چی بخورم؟",
    coachReply:
      "یک فنجون چای دارچینی با ۲ عدد خرما و ۳ مغز گردو بخور؛ قند خونت رو سریع تنظیم می‌کنه.",
    actionNote: "پاسخ‌گویی آنی ۲۴ ساعته",
  },
];

interface FeatureItem {
  id: string;
  icon: IconName;
  badge: string;
  title: string;
  subtitle: string;
  linkedTab: AppTabId;
}

const FEATURES: FeatureItem[] = [
  {
    id: "alternatives",
    icon: "bowl",
    badge: "اقتصادی · فوری",
    title: "۳ جایگزین آزاد برای هر وعده",
    subtitle:
      "هر زمان مواد اولیه نداشتی، با یک لمس وعده‌ات را با املت، عدسی، کوکو یا ماکارونی عوض کن.",
    linkedTab: "swap",
  },
  {
    id: "coach",
    icon: "coach24",
    badge: "پاسخ‌گویی آنی",
    title: "کوچ ۲۴ ساعته برای مهمانی و هوس",
    subtitle:
      "هر ساعتی از شبانه‌روز پیام بده؛ کوچ بلافاصله جایگزین دقیق همان لحظه را بهت می‌گوید.",
    linkedTab: "coach",
  },
  {
    id: "specialist",
    icon: "specialist",
    badge: "بدون ترازو",
    title: "تنظیم متخصص با سفرهٔ ایرانی",
    subtitle:
      "بدون نیاز به ترازوی آشپزخانه؛ همهٔ اندازه‌ها با قاشق، کف دست و لیوان است.",
    linkedTab: "swap",
  },
];

export function InteractivePhoneShowcase() {
  const [activeTab, setActiveTab] = useState<AppTabId>("swap");
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(null);
  const [variantIndices, setVariantIndices] = useState<Record<string, number>>({
    breakfast: 0,
    lunch: 1,
    dinner: 0,
  });
  const [activeScenarioId, setActiveScenarioId] = useState<string>("budget");

  const cycleMealVariant = (mealId: string) => {
    setVariantIndices((prev) => ({
      ...prev,
      [mealId]: ((prev[mealId] ?? 0) + 1) % 3,
    }));
  };

  const setSpecificVariant = (mealId: string, idx: number) => {
    setVariantIndices((prev) => ({
      ...prev,
      [mealId]: idx,
    }));
  };

  const activeScenario =
    COACH_SCENARIOS.find((s) => s.id === activeScenarioId) ?? COACH_SCENARIOS[0];

  return (
    <div className="overflow-hidden rounded-[1.85rem] sm:rounded-[2.6rem] border border-[#143326]/12 bg-[#F3F7F4] p-4 sm:p-7 md:p-9 [contain:content]">
      <div className="grid items-center gap-5 lg:grid-cols-12 lg:gap-9">
        {/* RIGHT COLUMN (RTL): Minimalist Copy + Hover-Reveal Feature Cards */}
        <div className="min-w-0 lg:col-span-5 space-y-3.5 sm:space-y-5 text-right">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#143326]/12 bg-white px-3.5 py-1 text-[11px] sm:text-xs font-bold text-[#143326]">
            <LottieLineIcon variant="spark" className="h-4 w-4" />
            <span>۹۴٪ تداوم کاربران تا پایان دوره</span>
          </div>

          <h2 className="text-xl font-extrabold leading-[1.32] tracking-normal text-[#14261d] sm:text-3xl md:text-4xl">
            نه کالری‌شماریِ خسته‌کننده،{" "}
            <span className="block mt-0.5 text-[#C86446]">
              نه غذاهای گران و عجیب!
            </span>
          </h2>

          {/* Minimal Hover/Tap Accordion Feature Cards (Subtitle opens on hover or tap) */}
          <div className="space-y-2">
            {FEATURES.map((feature) => {
              const isOpen = expandedFeatureId === feature.id;

              return (
                <div
                  key={feature.id}
                  onMouseEnter={() => {
                    setExpandedFeatureId(feature.id);
                    setActiveTab(feature.linkedTab);
                  }}
                  onMouseLeave={() => setExpandedFeatureId(null)}
                  onClick={() => {
                    setExpandedFeatureId((prev) =>
                      prev === feature.id ? null : feature.id
                    );
                    setActiveTab(feature.linkedTab);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setExpandedFeatureId((prev) =>
                        prev === feature.id ? null : feature.id
                      );
                      setActiveTab(feature.linkedTab);
                    }
                  }}
                  className={`group cursor-pointer rounded-2xl border transition-all duration-250 p-3 sm:p-3.5 ${
                    isOpen
                      ? "border-[#C86446]/45 bg-white shadow-[0_14px_30px_rgba(20,51,38,0.08)]"
                      : "border-[#143326]/8 bg-white/85 hover:bg-white hover:border-[#143326]/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-250 ${
                          isOpen
                            ? "bg-[#C86446] text-white"
                            : "bg-[#FAF5F2] text-[#C86446] group-hover:bg-[#C86446] group-hover:text-white"
                        }`}
                      >
                        <Icon name={feature.icon} className="h-4.5 w-4.5" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#14261d] whitespace-nowrap">
                        {feature.title}
                      </h3>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="hidden sm:inline-block rounded-full bg-[#F3F7F4] px-2.5 py-0.5 text-[10px] font-bold text-[#1F5E43] whitespace-nowrap">
                        {feature.badge}
                      </span>
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F7F4] text-[#143326] transition-transform duration-250 ${
                          isOpen ? "rotate-180 bg-[#FAF5F2] text-[#C86446]" : ""
                        }`}
                      >
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        >
                          <path
                            d="M5.5 7.75L10 12.25L14.5 7.75"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="desc"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pt-2.5 pr-11 text-[11px] sm:text-xs font-medium leading-6 text-[#5c6b63]">
                          {feature.subtitle}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="pt-0.5">
            <MotionLink
              to="/onboarding"
              whileHover={{ scale: 1.03, y: -1.5 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className="group inline-flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#143326] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_12px_26px_rgba(20,51,38,0.18)] transition-colors hover:bg-[#1F5E43] whitespace-nowrap"
            >
              <span>شروع آنالیز و دریافت برنامه</span>
              <Icon
                name="arrow"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              />
            </MotionLink>
          </div>
        </div>

        {/* LEFT COLUMN (RTL): Clean Mobile-Friendly Live App Simulator */}
        <div className="min-w-0 lg:col-span-7">
          <div className="mx-auto max-w-[540px] overflow-hidden rounded-[1.5rem] sm:rounded-[2.1rem] border border-[#143326]/14 bg-white shadow-[0_20px_50px_rgba(20,51,38,0.09)]">
            {/* Simulator Top Bar */}
            <div className="flex items-center justify-between gap-2 bg-[#143326] px-3.5 py-2.5 sm:px-5 sm:py-3 text-white">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-white/12 text-[#C5E4B0]">
                  <Icon name="phone" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <span className="whitespace-nowrap text-xs sm:text-sm font-extrabold">
                  اپ رژیم من
                </span>
              </div>

              {/* 2-Tab Interactive Switcher */}
              <div
                role="tablist"
                aria-label="امکانات اپلیکیشن رژیم من"
                className="flex shrink-0 items-center gap-1 rounded-full bg-[#0E241B] p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "swap"}
                  onClick={() => setActiveTab("swap")}
                  className={`rounded-full px-2.5 sm:px-3 py-1 text-[11px] font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === "swap"
                      ? "bg-[#C86446] text-white"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  ۳ جایگزین وعده
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "coach"}
                  onClick={() => setActiveTab("coach")}
                  className={`rounded-full px-2.5 sm:px-3 py-1 text-[11px] font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === "coach"
                      ? "bg-[#C86446] text-white"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  کوچ ۲۴/۷
                </button>
              </div>
            </div>

            {/* Simulator Body */}
            <div className="p-3 sm:p-5">
              <AnimatePresence mode="wait">
                {activeTab === "swap" ? (
                  <motion.div
                    key="tab-swap"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2.5"
                  >
                    {MEAL_SLOTS.map((slot) => {
                      const activeIdx = variantIndices[slot.id] ?? 0;
                      const currentVariant = slot.variants[activeIdx];

                      return (
                        <div
                          key={slot.id}
                          className="rounded-2xl border border-[#143326]/10 bg-[#FAF9F6] p-2.5 sm:p-3 transition-colors hover:border-[#C86446]/40"
                        >
                          {/* Top Row: Meal Time + 3 Compact Mode Pills */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-xs font-black text-[#143326]">
                                {slot.mealTime}
                              </span>
                              <span aria-hidden="true" className="text-[#5c6b63]">
                                ·
                              </span>
                              <span className="truncate text-[10px] sm:text-[11px] font-bold text-[#C86446]">
                                {currentVariant.costTag}
                              </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                              {slot.variants.map((v, idx) => {
                                const selected = activeIdx === idx;
                                return (
                                  <button
                                    key={v.modeLabel}
                                    type="button"
                                    onClick={() => setSpecificVariant(slot.id, idx)}
                                    className={`rounded-lg px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
                                      selected
                                        ? "bg-[#143326] text-white"
                                        : "bg-white text-[#5c6b63] border border-[#143326]/10 hover:text-[#14261d]"
                                    }`}
                                  >
                                    <span className="sm:hidden">{v.shortLabel}</span>
                                    <span className="hidden sm:inline">{v.modeLabel}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Bottom Row: Dish Image + Name + Swap Button */}
                          <div className="flex items-center justify-between gap-2.5">
                            <div className="flex min-w-0 items-center gap-2.5">
                              <img
                                src={currentVariant.image}
                                alt={currentVariant.title}
                                width={56}
                                height={56}
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-xl object-cover border border-[#143326]/10 bg-white"
                              />
                              <div className="min-w-0">
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={currentVariant.title}
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -5 }}
                                    transition={{ duration: 0.15 }}
                                    className="truncate text-xs sm:text-sm font-black text-[#14261d]"
                                  >
                                    {currentVariant.title}
                                  </motion.div>
                                </AnimatePresence>
                                <div className="mt-0.5 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#5c6b63]">
                                  <span>{currentVariant.kcal}</span>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-[#1F5E43]">{currentVariant.protein}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => cycleMealVariant(slot.id)}
                              title="تعویض غذا"
                              className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#C86446]/30 bg-[#FAF5F2] px-2.5 py-1.5 text-[11px] font-extrabold text-[#C86446] transition-colors hover:bg-[#C86446] hover:text-white cursor-pointer whitespace-nowrap"
                            >
                              <Icon name="spark" className="h-3.5 w-3.5" />
                              <span>تعویض</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="tab-coach"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {/* Scenario Selector Buttons */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {COACH_SCENARIOS.map((s) => {
                        const active = activeScenarioId === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setActiveScenarioId(s.id)}
                            className={`rounded-xl py-2 px-2 text-[11px] sm:text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap text-center ${
                              active
                                ? "bg-[#143326] text-white"
                                : "bg-[#F3F7F4] text-[#14261d] hover:bg-[#E4EFE8]"
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Chat Thread */}
                    <div className="rounded-2xl border border-[#143326]/10 bg-[#FAF9F6] p-3.5 space-y-2.5">
                      <div className="mr-auto max-w-[90%] rounded-2xl rounded-tl-xs bg-white border border-[#143326]/10 px-3.5 py-2.5 text-xs font-bold text-[#14261d] shadow-2xs">
                        {activeScenario.question}
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeScenario.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.16 }}
                          className="ml-auto max-w-[94%] rounded-2xl rounded-tr-xs border border-[#1F5E43]/25 bg-[#F3F7F4] px-3.5 py-3 text-xs leading-6 font-bold text-[#14261d]"
                        >
                          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-black text-[#1F5E43]">
                            <Icon name="coach24" className="h-3.5 w-3.5" />
                            <span>کوچ ۲۴ ساعته:</span>
                          </div>
                          <p>{activeScenario.coachReply}</p>
                        </motion.div>
                      </AnimatePresence>

                      <div className="flex items-center gap-1.5 pt-0.5 text-[11px] font-extrabold text-[#C86446]">
                        <Icon name="check" className="h-3.5 w-3.5 shrink-0" />
                        <span>{activeScenario.actionNote}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
