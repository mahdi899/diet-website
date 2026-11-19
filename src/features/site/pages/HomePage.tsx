import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Icon, type IconName } from "../icons";
import { LottieLineIcon } from "../lottieData";
import {
  cardRevealVariants,
  itemRevealVariants,
  revealViewport,
  sectionRevealVariants,
  staggerGridVariants,
} from "../motionVariants";
import { SmartPlateBuilder } from "../components/SmartPlateBuilder";
import { InteractivePhoneShowcase } from "../components/InteractivePhoneShowcase";
import { TestimonialCarousel } from "../components/TestimonialCarousel";
import { FaqAccordion } from "../components/FaqAccordion";

const ONBOARDING_ROUTE = "/onboarding";
const MotionLink = motion.create(Link);

interface GoalItem {
  id: string;
  label: string;
  badge: string;
  icon: IconName;
  characterImage: string;
  dishImage: string;
  surfaceTint: string;
  borderTint: string;
  accentColor: string;
}

const GOALS: GoalItem[] = [
  {
    id: "loss",
    label: "لاغری",
    badge: "۴ تا ۶ کیلو در ماه",
    icon: "flame",
    characterImage: "/src/assets/images/male_fitness_weight_loss_1794960511652.webp",
    dishImage: "/src/assets/images/goal_weight_loss_dish_1794952765851.webp",
    surfaceTint: "bg-[#FAF5F2]",
    borderTint: "border-[#EEDDD4]",
    accentColor: "text-[#C86446]",
  },
  {
    id: "gain",
    label: "افزایش وزن",
    badge: "پر شدن صورت و حجم",
    icon: "scale",
    characterImage: "/src/assets/images/male_fitness_weight_gain_1794960512384.webp",
    dishImage: "/src/assets/images/goal_muscle_gain_plate_1794952767396.webp",
    surfaceTint: "bg-[#F7F5F0]",
    borderTint: "border-[#E6E1D6]",
    accentColor: "text-[#1F5E43]",
  },
  {
    id: "pregnancy",
    label: "بارداری",
    badge: "سلامت مادر و جنین",
    icon: "leaf",
    characterImage: "/src/assets/images/goal_pregnancy_character.webp",
    dishImage: "/src/assets/images/goal_muscle_gain_plate_1794952767396.webp",
    surfaceTint: "bg-[#F3F7F4]",
    borderTint: "border-[#D8E5DC]",
    accentColor: "text-[#143326]",
  },
  {
    id: "health",
    label: "سلامت بدن",
    badge: "تأمین ویتامین و انرژی",
    icon: "target100",
    characterImage: "/src/assets/images/goal_body_health_character.webp",
    dishImage: "/src/assets/images/hero_persian_healthy_bowl_1794952764202.webp",
    surfaceTint: "bg-[#FAF5F2]",
    borderTint: "border-[#EEDDD4]",
    accentColor: "text-[#C86446]",
  },
];

const PILLARS: {
  icon: IconName;
  title: string;
  tag: string;
  surface: string;
  iconColor: string;
  lottie?: "coach" | "target" | "spark";
}[] = [
  {
    icon: "coach24",
    title: "کوچ ۲۴ ساعته",
    tag: "بالای سرت در اپ",
    surface: "bg-[#F3F7F4] border-[#DCE8E0]",
    iconColor: "text-[#143326]",
    lottie: "coach",
  },
  {
    icon: "specialist",
    title: "متخصص تغذیه",
    tag: "برنامهٔ اختصاصی",
    surface: "bg-[#FAF5F2] border-[#EFE0D8]",
    iconColor: "text-[#C86446]",
  },
  {
    icon: "method",
    title: "متد ۲۰۲۶ دنیا",
    tag: "بدون گرسنگی",
    surface: "bg-[#F7F5F0] border-[#E6E2D8]",
    iconColor: "text-[#143326]",
    lottie: "spark",
  },
  {
    icon: "target100",
    title: "۱۰۰٪ تضمینی",
    tag: "نتیجهٔ قطعی",
    surface: "bg-[#F3F7F4] border-[#DCE8E0]",
    iconColor: "text-[#1F5E43]",
    lottie: "target",
  },
];

export function HomePage() {
  const [activeGoal, setActiveGoal] = useState<GoalItem>(GOALS[0]);
  const coachSectionRef = useRef<HTMLElement | null>(null);
  const [isCoachVisible, setIsCoachVisible] = useState(false);

  useEffect(() => {
    const node = coachSectionRef.current;
    if (!node || isCoachVisible) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsCoachVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsCoachVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "180px 0px", threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isCoachVisible]);

  return (
    <div className="bg-white text-[#14261d] max-w-full overflow-x-clip" dir="rtl">
      {/* 1. HERO SECTION */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="relative bg-white pt-2 pb-6 sm:pt-8 sm:pb-16 lg:pt-12 lg:pb-20 [contain:layout_paint]"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <div className="grid items-center gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-12">
            {/* Right Column: Headline + 4-Col Goal Switcher + Single Clean CTA */}
            <motion.div
              variants={itemRevealVariants}
              className="lg:col-span-6 min-w-0 space-y-3.5 sm:space-y-7 text-right"
            >
              {/* Kicker Pill (CSS selector 2) with crisp Headset+Wave line-art icon & hover lift */}
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="group inline-flex max-w-full items-center gap-2 rounded-full border border-[#143326]/12 bg-[#F3F7F4] px-3.5 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-bold text-[#143326] transition-colors hover:border-[#C86446]/40 hover:bg-[#FAF5F2] cursor-default"
              >
                <LottieLineIcon variant="coach" className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-[#143326]" />
                <span className="truncate">متخصص تغذیه + کوچ ۲۴ ساعته</span>
              </motion.div>

              {/* Refined Typography Headline */}
              <div className="space-y-1.5">
                <h1 className="text-[1.75rem] font-extrabold leading-[1.26] tracking-normal text-[#14261d] sm:text-5xl lg:text-[3.2rem]">
                  هر هدفی داری،{" "}
                  <span className="inline sm:block sm:mt-1.5 text-[#1F5E43]">
                    این‌بار <span className="text-[#C86446]">۱۰۰٪</span> می‌رسی!
                  </span>
                </h1>
              </div>

              {/* MOBILE VISUAL STAGE (< lg) */}
              <div className="relative lg:hidden [contain:layout_paint]">
                <div
                  className={`relative overflow-hidden rounded-[1.6rem] border ${activeGoal.borderTint} ${activeGoal.surfaceTint} p-1.5 transition-colors duration-300`}
                >
                  <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-white">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeGoal.characterImage}
                        src={activeGoal.characterImage}
                        alt={activeGoal.label}
                        width={960}
                        height={717}
                        fetchPriority="high"
                        decoding="sync"
                        referrerPolicy="no-referrer"
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="h-full w-full object-contain object-bottom"
                      />
                    </AnimatePresence>

                    {/* Overlaid Top-Right Coach Chip */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full border border-[#143326]/10 bg-white/95 px-3 py-1 text-[11px] font-bold text-[#143326] shadow-2xs backdrop-blur-md">
                      <LottieLineIcon variant="coach" className="h-4 w-4 text-[#143326]" />
                      <span>کوچ ۲۴/۷</span>
                    </div>

                    {/* Overlaid Bottom-Left Food Thumbnail */}
                    <div className="absolute bottom-2.5 left-2.5 flex max-w-[calc(100%-1.25rem)] items-center gap-2 rounded-2xl border border-[#143326]/10 bg-white/95 p-1.5 pr-3 shadow-2xs backdrop-blur-md">
                      <span className="truncate text-[11px] font-bold text-[#14261d]">
                        {activeGoal.badge}
                      </span>
                      <img
                        src={activeGoal.dishImage}
                        alt={activeGoal.label}
                        width={960}
                        height={717}
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 shrink-0 rounded-xl object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-Column Minimalist Line-Art Goal Dock with Spring Hover Animations */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
                {GOALS.map((g) => {
                  const selected = activeGoal.id === g.id;
                  return (
                    <motion.button
                      key={g.id}
                      type="button"
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      onClick={() => setActiveGoal(g)}
                      className={`group flex min-w-0 min-h-[44px] flex-col items-center justify-center gap-1.5 sm:gap-2 overflow-hidden rounded-2xl border py-2.5 px-1 sm:p-3.5 text-center transition-colors cursor-pointer ${
                        selected
                          ? "border-[#143326] bg-[#F3F7F4] shadow-[0_12px_28px_rgba(20,51,38,0.1)]"
                          : "border-[#143326]/10 bg-[#FAF9F6] hover:border-[#C86446]/45 hover:bg-[#FAF5F2] hover:shadow-[0_10px_22px_rgba(200,100,70,0.08)]"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 ${
                          selected
                            ? "border-[#143326] bg-[#143326] text-white"
                            : "border-[#143326]/8 bg-white text-[#143326] group-hover:border-[#C86446]/30 group-hover:text-[#C86446]"
                        }`}
                      >
                        <Icon name={g.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <span className="max-w-full truncate text-[11px] sm:text-xs font-bold text-[#14261d]">
                        {g.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Single Clean Primary Button with Framer Motion Hover Scaling */}
              <div className="pt-1">
                <MotionLink
                  to={ONBOARDING_ROUTE}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 420, damping: 20 }}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#143326] px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-[0_14px_30px_rgba(20,51,38,0.2)] transition-colors hover:bg-[#1F5E43] hover:shadow-[0_18px_36px_rgba(31,94,67,0.28)] whitespace-nowrap"
                >
                  <span>دریافت رژیم {activeGoal.label}</span>
                  <Icon
                    name="arrow"
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5"
                  />
                </MotionLink>
              </div>
            </motion.div>

            {/* Left Column (Desktop Stage — lg:block) */}
            <div className="relative hidden lg:block lg:col-span-6 min-w-0">
              <div className="relative mx-auto max-w-[520px]">
                {/* Character Portrait Card */}
                <div
                  className={`group relative overflow-hidden rounded-[2.6rem] border ${activeGoal.borderTint} ${activeGoal.surfaceTint} p-3.5 shadow-[0_24px_60px_rgba(20,51,38,0.07)] transition-all duration-500 hover:shadow-[0_28px_70px_rgba(20,51,38,0.12)] [contain:layout_paint]`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-white">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeGoal.characterImage}
                        src={activeGoal.characterImage}
                        alt={activeGoal.label}
                        width={960}
                        height={717}
                        fetchPriority="high"
                        decoding="sync"
                        referrerPolicy="no-referrer"
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="h-full w-full object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
                      />
                    </AnimatePresence>

                    <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-[#143326]/10 bg-white/95 px-4 py-2 text-xs font-bold text-[#14261d] shadow-sm backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                      <Icon name={activeGoal.icon} className={`h-4 w-4 ${activeGoal.accentColor}`} />
                      <span>{activeGoal.label}</span>
                      <span className="text-[#C86446]">·</span>
                      <span className={activeGoal.accentColor}>{activeGoal.badge}</span>
                    </div>
                  </div>
                </div>

                {/* Floating 24/7 Coach Badge (CSS selector 1) */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                  className="group absolute -top-3 right-0 xl:-right-3 z-10 flex items-center gap-3 rounded-2xl border border-[#143326]/10 bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_16px_35px_rgba(20,51,38,0.1)] transition-colors hover:border-[#C86446]/40 cursor-default"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#143326]/8 bg-[#F3F7F4] text-[#143326] transition-colors group-hover:bg-[#FAF5F2]">
                    <LottieLineIcon variant="coach" className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#14261d]">کوچ ۲۴ ساعته</div>
                    <div className="text-[11px] font-bold text-[#C86446]">پاسخگویی آنی</div>
                  </div>
                </motion.div>

                {/* Floating Matching Food Thumbnail */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                  className="group absolute -bottom-4 left-0 xl:-left-3 z-10 flex items-center gap-3 rounded-2xl border border-[#143326]/10 bg-white/95 backdrop-blur-md p-2.5 pr-4 shadow-[0_16px_35px_rgba(20,51,38,0.1)] transition-colors hover:border-[#1F5E43]/40 cursor-default"
                >
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#14261d]">سفرهٔ ایرانی</div>
                    <div className="text-[11px] font-bold text-[#1F5E43]">برنامهٔ اختصاصی</div>
                  </div>
                  <img
                    src={activeGoal.dishImage}
                    alt="غذای رژیمی"
                    width={960}
                    height={717}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-13 w-13 rounded-xl object-cover transition-transform duration-300 group-hover:scale-108"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. 4 MINIMAL LINE-ART PILLARS (CSS selector 3 is item 0's icon box) */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white py-3 sm:py-12 [contain:layout_paint]"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <div className="grid grid-cols-2 gap-2 sm:gap-5 lg:grid-cols-4">
            {PILLARS.map((item) => (
              <motion.div
                key={item.title}
                variants={cardRevealVariants}
                whileHover={{ y: -6, scale: 1.015 }}
                className={`group flex min-w-0 items-center sm:flex-col sm:text-center gap-2 sm:gap-3 rounded-2xl sm:rounded-3xl border ${item.surface} p-2.5 sm:p-6 transition-shadow duration-300 hover:border-[#C86446]/40 hover:shadow-[0_18px_38px_rgba(20,51,38,0.08)] cursor-default [contain:layout_paint]`}
              >
                <div
                  className={`flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-[#143326]/8 bg-white ${item.iconColor} transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:border-[#C86446]/30 group-hover:shadow-sm`}
                >
                  {item.lottie ? (
                    <LottieLineIcon variant={item.lottie} className="h-5 w-5 sm:h-7 sm:w-7" />
                  ) : (
                    <Icon name={item.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-base font-extrabold text-[#14261d] truncate transition-colors group-hover:text-[#143326]">
                    {item.title}
                  </h3>
                  <span className={`block mt-0.5 text-[10px] sm:text-xs font-bold truncate ${item.iconColor}`}>
                    {item.tag}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 3. 4 CHARACTER GOAL CARDS */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white py-4 sm:py-16 [contain:layout_paint]"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <motion.div
            variants={itemRevealVariants}
            className="mb-3.5 sm:mb-8 flex items-center justify-between gap-3"
          >
            <h2 className="text-lg font-extrabold text-[#14261d] sm:text-3xl">هدفت چیه؟</h2>
            <MotionLink
              to={ONBOARDING_ROUTE}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className="group inline-flex items-center gap-1.5 rounded-full border border-[#143326]/15 bg-white px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-[#143326] transition-colors hover:bg-[#143326] hover:text-white whitespace-nowrap"
            >
              <span>دریافت برنامه</span>
              <Icon
                name="arrow"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
              />
            </MotionLink>
          </motion.div>

          <motion.div
            variants={staggerGridVariants}
            className="grid grid-cols-2 gap-2 sm:gap-5 lg:grid-cols-4"
          >
            {GOALS.map((card) => (
              <motion.div key={card.id} variants={cardRevealVariants} whileHover={{ y: -8 }} className="min-w-0">
                <Link
                  to={ONBOARDING_ROUTE}
                  className={`group flex min-w-0 flex-col overflow-hidden rounded-[1.4rem] sm:rounded-[2rem] border ${card.borderTint} ${card.surfaceTint} p-1.5 sm:p-2.5 transition-all duration-300 hover:border-[#C86446]/50 hover:shadow-[0_22px_48px_rgba(20,51,38,0.1)] [contain:layout_paint]`}
                >
                  {/* Character Image */}
                  <div className="relative aspect-[16/11] sm:aspect-[4/3] overflow-hidden rounded-[1.1rem] sm:rounded-[1.5rem] bg-white">
                    <img
                      src={card.characterImage}
                      alt={card.label}
                      width={960}
                      height={717}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain object-bottom transition-transform duration-700 group-hover:scale-106"
                    />
                    <div
                      className={`absolute top-2.5 right-2.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-[#143326]/8 bg-white/95 ${card.accentColor} backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
                    >
                      <Icon name={card.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </div>

                  {/* Compact Footer */}
                  <div className="flex items-center justify-between gap-1.5 px-2 pt-2.5 pb-1 sm:p-3.5">
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-base font-extrabold text-[#14261d] truncate">
                        {card.label}
                      </h3>
                      <span
                        className={`block text-[10px] sm:text-xs font-bold truncate ${card.accentColor}`}
                      >
                        {card.badge}
                      </span>
                    </div>
                    <span className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-[#143326]/10 bg-white text-[#143326] transition-all duration-300 group-hover:-translate-x-1 group-hover:bg-[#143326] group-hover:text-white">
                      <Icon name="arrow" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 4. 24/7 COACH + SPECIALIST DARK SHOWCASE (Lazy-loaded via IntersectionObserver & Contained) */}
      <section ref={coachSectionRef} className="bg-white py-4 sm:py-16 overflow-hidden [contain:layout_paint]">
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          {isCoachVisible ? (
            <motion.div
              variants={sectionRevealVariants}
              initial="hidden"
              animate="visible"
              className="group/darkcard relative"
            >
              {/* Outer subtle forest & mint glow halo constrained within viewport bounds */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 sm:-inset-2 rounded-[1.85rem] sm:rounded-[3.1rem] bg-gradient-to-br from-[#1F5E43]/22 via-[#C5E4B0]/14 to-[#C86446]/16 opacity-60 blur-xl sm:blur-2xl transition-all duration-500 group-hover/darkcard:opacity-95 group-hover/darkcard:blur-2xl sm:group-hover/darkcard:blur-3xl"
              />
              <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2.8rem] border border-[#C5E4B0]/25 bg-[#0E241B] p-3.5 sm:p-8 md:p-12 text-white shadow-[0_24px_64px_rgba(14,36,27,0.28),0_0_36px_rgba(31,94,67,0.16)] transition-all duration-500 group-hover/darkcard:border-[#C5E4B0]/45 group-hover/darkcard:shadow-[0_32px_88px_rgba(14,36,27,0.38),0_0_56px_rgba(197,228,176,0.22)] [contain:content]">
                {/* Subtle ambient lighting on dark canvas */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-28 -right-24 h-72 w-72 rounded-full bg-[#1F5E43]/35 blur-3xl transition-opacity duration-500 group-hover/darkcard:opacity-95"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#C86446]/18 blur-3xl transition-opacity duration-500 group-hover/darkcard:opacity-95"
                />

                <div className="relative grid items-center gap-3.5 sm:gap-6 lg:grid-cols-12 lg:gap-8">
                  {/* Right Column: Compact Inline Header on Mobile + Benefits + CTAs */}
                  <div className="lg:col-span-5 min-w-0 space-y-3 sm:space-y-5 text-right">
                    <div className="flex min-w-0 items-center gap-2.5 sm:block sm:space-y-4">
                      <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border border-[#C5E4B0]/25 bg-[#143326] text-[#C5E4B0]">
                        <LottieLineIcon variant="coach" className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>

                      <h2 className="min-w-0 text-lg font-extrabold leading-[1.3] tracking-normal text-white sm:text-4xl">
                        کوچ و متخصص،{" "}
                        <span className="inline sm:mt-1.5 sm:block text-[#C5E4B0]">
                          همیشه بالای سرته!
                        </span>
                      </h2>
                    </div>

                    <ul className="space-y-1.5 sm:space-y-2.5">
                      {[
                        { icon: "bowl" as IconName, text: "برنامهٔ غذایی اختصاصی با سفرهٔ ایرانی" },
                        { icon: "target100" as IconName, text: "پیگیری روزانهٔ پیشرفت تا وزن هدف" },
                        { icon: "specialist" as IconName, text: "پشتیبانی تخصصی و ۲۴ ساعته در اپ" },
                      ].map((benefit) => (
                        <li
                          key={benefit.text}
                          className="flex min-w-0 items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-bold text-white/95"
                        >
                          <span className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border border-[#C5E4B0]/25 bg-[#143326] text-[#C5E4B0] shadow-2xs">
                            <Icon name={benefit.icon} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </span>
                          <span className="min-w-0 break-words leading-snug">{benefit.text}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 pt-0.5">
                      <MotionLink
                        to={ONBOARDING_ROUTE}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 420, damping: 20 }}
                        className="group inline-flex min-w-0 min-h-[44px] sm:min-h-[48px] items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#C86446] px-3 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_14px_30px_rgba(200,100,70,0.34)] transition-colors hover:bg-[#d96b43] whitespace-nowrap"
                      >
                        <span className="truncate">دریافت رژیم</span>
                        <Icon
                          name="arrow"
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
                        />
                      </MotionLink>

                      <div className="relative inline-flex w-full sm:w-auto min-w-0">
                        <motion.span
                          aria-hidden="true"
                          animate={{ scale: [1, 1.04, 1], opacity: [0.55, 0.08, 0.55] }}
                          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                          className="pointer-events-none absolute inset-0 rounded-full border border-[#C5E4B0]/55"
                        />
                        <MotionLink
                          to="/contact"
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(197, 228, 176, 0.22)",
                              "0 0 18px 2px rgba(197, 228, 176, 0.28)",
                              "0 0 0 0 rgba(197, 228, 176, 0.22)",
                            ],
                          }}
                          whileHover={{ scale: 1.04, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{
                            boxShadow: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
                            scale: { type: "spring", stiffness: 420, damping: 20 },
                            y: { type: "spring", stiffness: 420, damping: 20 },
                          }}
                          className="group relative inline-flex w-full sm:w-auto min-w-0 min-h-[44px] sm:min-h-[48px] items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-[#C5E4B0]/40 bg-[#143326] px-3 sm:px-6 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-[#D8E9C9] transition-colors hover:border-[#C5E4B0]/70 hover:bg-[#194030] hover:text-white whitespace-nowrap"
                        >
                          <Icon
                            name="chat"
                            className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#C5E4B0] transition-transform duration-300 group-hover:scale-110"
                          />
                          <span className="truncate">شروع مشاوره</span>
                        </MotionLink>
                      </div>
                    </div>
                  </div>

                  {/* Left Column: 2-Column Side-by-Side Portrait Cards on Both Mobile & Desktop */}
                  <div className="lg:col-span-7 min-w-0 grid grid-cols-2 gap-2 sm:gap-4">
                    {/* Coach Card */}
                    <div className="group min-w-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/12 bg-[#143326] p-1.5 sm:p-2 transition-all duration-300 hover:-translate-y-1 hover:border-[#C5E4B0]/35 [contain:layout_paint]">
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-white">
                        <img
                          src="/src/assets/images/home_coach_live_support_1794961838974.webp"
                          alt="همراهی کوچ‌های ورزشی ۲۴ ساعته در اپلیکیشن رژیم من"
                          width={960}
                          height={717}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-1 px-1 pt-2 pb-0.5 sm:px-2.5 sm:pt-2.5 sm:pb-1">
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-xs font-extrabold text-white truncate">
                            تیم کوچ ورزشی
                          </div>
                          <div className="text-[9px] sm:text-[10px] font-bold text-[#C5E4B0] truncate">
                            همراهی ۲۴ ساعته در اپ
                          </div>
                        </div>
                        <span className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0E241B] text-[#C5E4B0]">
                          <Icon name="coach24" className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Specialist Doctors Card */}
                    <div className="group min-w-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/12 bg-[#143326] p-1.5 sm:p-2 transition-all duration-300 hover:-translate-y-1 hover:border-[#C5E4B0]/35 [contain:layout_paint]">
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-white">
                        <img
                          src="/src/assets/images/home_doctors_meal_design_1794961844022.webp"
                          alt="طراحی برنامه غذایی سفره ایرانی توسط پزشکان متخصص تغذیه"
                          width={960}
                          height={717}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-1 px-1 pt-2 pb-0.5 sm:px-2.5 sm:pt-2.5 sm:pb-1">
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-xs font-extrabold text-white truncate">
                            پزشکان و متخصص تغذیه
                          </div>
                          <div className="text-[9px] sm:text-[10px] font-bold text-[#F2A488] truncate">
                            تنظیم و بازبینی اختصاصی
                          </div>
                        </div>
                        <span className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0E241B] text-[#F2A488]">
                          <Icon name="specialist" className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div
              aria-hidden="true"
              className="min-h-[300px] sm:min-h-[380px] w-full rounded-[1.75rem] sm:rounded-[2.8rem] border border-[#C5E4B0]/15 bg-[#0E241B]/90 animate-pulse [contain:content]"
            />
          )}
        </div>
      </section>

      {/* 5. SMART PLATE BUILDER */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white py-4 sm:py-12 [contain:layout_paint]"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <SmartPlateBuilder />
        </div>
      </motion.section>

      {/* 5.5. INTERACTIVE APP SHOWCASE (3 Meal Alternatives + 24/7 Coach Simulator) */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white py-4 sm:py-12 [contain:layout_paint]"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <InteractivePhoneShowcase />
        </div>
      </motion.section>

      {/* 6. MINIMALIST SUCCESS STORIES CAROUSEL */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white py-4 sm:py-12 [contain:layout_paint]"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <TestimonialCarousel />
        </div>
      </motion.section>

      {/* 7. MINIMALIST FAQ ACCORDION */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white py-4 sm:py-12 [contain:layout_paint]"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <FaqAccordion />
        </div>
      </motion.section>

      {/* 8. REFINED FINAL CTA */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white pt-3 pb-8 sm:pb-18 [contain:layout_paint]"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <motion.div
            variants={cardRevealVariants}
            className="flex flex-col items-center justify-between gap-4 sm:gap-5 rounded-[2rem] sm:rounded-[2.4rem] bg-[#143326] px-5 py-7 text-center text-white sm:flex-row sm:px-12 sm:py-10 sm:text-right [contain:content]"
          >
            <div className="flex min-w-0 flex-col items-center gap-3.5 sm:flex-row">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-white text-[#143326]">
                <LottieLineIcon variant="target" className="h-8 w-8" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold tracking-normal text-white sm:text-3xl">
                  این‌بار ۱۰۰٪ به هدفت می‌رسی!
                </h2>
                <p className="mt-0.5 text-xs font-bold text-white/75">
                  متخصص تغذیه + کوچ ۲۴ ساعته
                </p>
              </div>
            </div>

            <MotionLink
              to={ONBOARDING_ROUTE}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#C86446] px-8 py-3.5 text-sm sm:text-base font-bold text-white shadow-[0_12px_28px_rgba(200,100,70,0.3)] transition-colors hover:bg-[#b55538] hover:shadow-[0_16px_34px_rgba(200,100,70,0.4)] whitespace-nowrap"
            >
              <span>دریافت رژیم</span>
              <Icon
                name="arrow"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5"
              />
            </MotionLink>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

export default HomePage;
