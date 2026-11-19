import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { Icon, type IconName } from "../icons";
import { LottieLineIcon } from "../lottieData";

const MotionLink = motion.create(Link);

type Gender = "female" | "male";
type StepState = "input" | "analyzing" | "result";

interface BmiResultProfile {
  key: "underweight" | "normal" | "overweight" | "obese";
  statusLabel: string;
  goalTitle: string;
  rateBadge: string;
  accentText: string;
  pillBg: string;
  surface: string;
  border: string;
  icon: IconName;
  characterImage: string;
  dishImage: string;
}

function getBmiProfile(bmi: number): BmiResultProfile {
  if (bmi < 18.5) {
    return {
      key: "underweight",
      statusLabel: "کمبود وزن",
      goalTitle: "افزایش وزن و حجم",
      rateBadge: "+۳ تا ۴ کیلو در ماه",
      accentText: "text-[#1F5E43]",
      pillBg: "bg-[#1F5E43]",
      surface: "bg-[#F3F7F4]",
      border: "border-[#CFE0D5]",
      icon: "scale",
      characterImage: "/src/assets/images/bmi_underweight_gain_pose_1794962140576.webp",
      dishImage: "/src/assets/images/goal_muscle_gain_plate_1794952767396.webp",
    };
  }
  if (bmi < 25) {
    return {
      key: "normal",
      statusLabel: "وزن ایده‌آل",
      goalTitle: "فرم‌دهی و تثبیت ۱۰۰٪",
      rateBadge: "تثبیت و عضله‌سازی",
      accentText: "text-[#143326]",
      pillBg: "bg-[#143326]",
      surface: "bg-[#F3F7F4]",
      border: "border-[#CFE0D5]",
      icon: "target100",
      characterImage: "/src/assets/images/bmi_ideal_shaping_pose_1794962143162.webp",
      dishImage: "/src/assets/images/hero_persian_healthy_bowl_1794952764202.webp",
    };
  }
  if (bmi < 30) {
    return {
      key: "overweight",
      statusLabel: "اضافه وزن",
      goalTitle: "کاهش وزن هوشمند",
      rateBadge: "۴ تا ۶ کیلو در ماه",
      accentText: "text-[#C86446]",
      pillBg: "bg-[#C86446]",
      surface: "bg-[#FAF5F2]",
      border: "border-[#EED8CE]",
      icon: "flame",
      characterImage: "/src/assets/images/bmi_result_body_analysis_1794962102772.webp",
      dishImage: "/src/assets/images/goal_weight_loss_dish_1794952765851.webp",
    };
  }
  return {
    key: "obese",
    statusLabel: "اضافه وزن بالا",
    goalTitle: "کاهش وزن تخصصی",
    rateBadge: "۵ تا ۷ کیلو در ماه",
    accentText: "text-[#C86446]",
    pillBg: "bg-[#C86446]",
    surface: "bg-[#FAF5F2]",
    border: "border-[#EED8CE]",
    icon: "specialist",
    characterImage: "/src/assets/images/bmi_obese_medical_care_1794962172830.webp",
    dishImage: "/src/assets/images/goal_weight_loss_dish_1794952765851.webp",
  };
}

const ANALYSIS_STEPS = [
  "بررسی شاخص تودهٔ بدنی...",
  "محاسبهٔ محدودهٔ وزن طلایی...",
  "انتخاب بهترین متد تغذیه...",
];

export function BmiCalculator() {
  const [step, setStep] = useState<StepState>("input");
  const [gender, setGender] = useState<Gender>("female");
  const [height, setHeight] = useState<number>(166);
  const [weight, setWeight] = useState<number>(72);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (step !== "analyzing") return;
    setProgress(0);
    const start = performance.now();
    const duration = 1650;

    let rafId = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed < duration) {
        rafId = requestAnimationFrame(tick);
      } else {
        setStep("result");
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [step]);

  const analysis = useMemo(() => {
    const hMeters = height / 100;
    const rawBmi = weight / (hMeters * hMeters);
    const bmi = Math.round(rawBmi * 10) / 10;

    const minIdeal = Math.round(18.5 * hMeters * hMeters);
    const maxIdeal = Math.round(24.9 * hMeters * hMeters);

    let diffChip = "در محدودهٔ طلایی";
    if (weight > maxIdeal) {
      diffChip = `${(weight - maxIdeal).toLocaleString("fa-IR")} کیلو کاهش تا هدف`;
    } else if (weight < minIdeal) {
      diffChip = `${(minIdeal - weight).toLocaleString("fa-IR")} کیلو افزایش تا هدف`;
    }

    const gaugePercent = Math.min(95, Math.max(5, ((rawBmi - 14) / (36 - 14)) * 100));

    return {
      bmi,
      minIdeal,
      maxIdeal,
      diffChip,
      gaugePercent,
      profile: getBmiProfile(bmi),
    };
  }, [height, weight]);

  const { profile } = analysis;
  const activeStepText =
    ANALYSIS_STEPS[Math.min(ANALYSIS_STEPS.length - 1, Math.floor((progress / 100) * ANALYSIS_STEPS.length))];

  return (
    <div className="mx-auto max-w-[640px]">
      <AnimatePresence mode="wait">
        {/* STAGE 1: MINIMALIST INPUT CARD */}
        {step === "input" && (
          <motion.div
            key="bmi-input-stage"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[1.8rem] sm:rounded-[2.6rem] border border-[#E6E1D6] bg-[#F7F5F0] p-4 sm:p-8 shadow-[0_24px_60px_rgba(20,51,38,0.07)]"
          >
            {/* Top Gender Switcher */}
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white text-[#143326] shadow-2xs">
                  <Icon name="scale" className="h-4 w-4" />
                </div>
                <span className="text-xs sm:text-base font-black text-[#14261d]">مشخصات من</span>
              </div>

              <div
                className="inline-flex rounded-full border border-[#143326]/10 bg-white p-1"
                role="group"
                aria-label="جنسیت"
              >
                {(
                  [
                    { id: "female", label: "خانم" },
                    { id: "male", label: "آقا" },
                  ] as const
                ).map((g) => {
                  const active = gender === g.id;
                  return (
                    <motion.button
                      key={g.id}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setGender(g.id)}
                      className={`min-h-[38px] sm:min-h-[40px] rounded-full px-4 sm:px-5 py-1 sm:py-1.5 text-xs font-extrabold transition-colors cursor-pointer ${
                        active
                          ? "bg-[#143326] text-white shadow-2xs"
                          : "text-[#5c6b63] hover:text-[#14261d]"
                      }`}
                    >
                      {g.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 2 Side-by-Side Visual Sliders (Height & Weight) on both Mobile & Desktop */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              {/* Height Card */}
              <div className="rounded-[1.4rem] sm:rounded-[1.8rem] border border-[#143326]/8 bg-white p-3 sm:p-5 text-center space-y-3 sm:space-y-4">
                <span className="block text-[11px] sm:text-xs font-extrabold text-[#5c6b63]">قد (سانتی‌متر)</span>

                <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="کاهش قد"
                    onClick={() => setHeight((h) => Math.max(140, h - 1))}
                    className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-[#F3F7F4] text-base sm:text-lg font-extrabold text-[#143326] hover:bg-[#143326] hover:text-white transition-colors cursor-pointer"
                  >
                    −
                  </motion.button>

                  <motion.div
                    key={height}
                    initial={{ scale: 0.94 }}
                    animate={{ scale: 1 }}
                    className="min-w-[54px] sm:min-w-[82px] text-2xl sm:text-4xl font-extrabold normal-nums tracking-normal text-[#143326]"
                  >
                    {height.toLocaleString("fa-IR")}
                  </motion.div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="افزایش قد"
                    onClick={() => setHeight((h) => Math.min(210, h + 1))}
                    className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-[#F3F7F4] text-base sm:text-lg font-extrabold text-[#143326] hover:bg-[#143326] hover:text-white transition-colors cursor-pointer"
                  >
                    +
                  </motion.button>
                </div>

                <input
                  type="range"
                  min={140}
                  max={210}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  aria-label="قد"
                  className="h-2 sm:h-2.5 w-full cursor-pointer appearance-none rounded-full bg-[#EAE6DC] accent-[#143326]"
                />
              </div>

              {/* Weight Card */}
              <div className="rounded-[1.4rem] sm:rounded-[1.8rem] border border-[#143326]/8 bg-white p-3 sm:p-5 text-center space-y-3 sm:space-y-4">
                <span className="block text-[11px] sm:text-xs font-extrabold text-[#5c6b63]">وزن (کیلوگرم)</span>

                <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="کاهش وزن"
                    onClick={() => setWeight((w) => Math.max(35, w - 1))}
                    className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-[#FAF5F2] text-base sm:text-lg font-extrabold text-[#C86446] hover:bg-[#C86446] hover:text-white transition-colors cursor-pointer"
                  >
                    −
                  </motion.button>

                  <motion.div
                    key={weight}
                    initial={{ scale: 0.94 }}
                    animate={{ scale: 1 }}
                    className="min-w-[54px] sm:min-w-[82px] text-2xl sm:text-4xl font-extrabold normal-nums tracking-normal text-[#C86446]"
                  >
                    {weight.toLocaleString("fa-IR")}
                  </motion.div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="افزایش وزن"
                    onClick={() => setWeight((w) => Math.min(160, w + 1))}
                    className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-[#FAF5F2] text-base sm:text-lg font-extrabold text-[#C86446] hover:bg-[#C86446] hover:text-white transition-colors cursor-pointer"
                  >
                    +
                  </motion.button>
                </div>

                <input
                  type="range"
                  min={35}
                  max={160}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  aria-label="وزن"
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#EAE6DC] accent-[#C86446]"
                />
              </div>
            </div>

            {/* Primary Trigger Button */}
            <div className="mt-4 sm:mt-6">
              <motion.button
                type="button"
                onClick={() => setStep("analyzing")}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
                className="group flex w-full min-h-[46px] items-center justify-center gap-2.5 rounded-full bg-[#143326] py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-[0_16px_34px_rgba(20,51,38,0.22)] transition-colors hover:bg-[#1F5E43] cursor-pointer"
              >
                <LottieLineIcon variant="spark" className="h-5 w-5 text-white" />
                <span>محاسبه و آنالیز هوشمند</span>
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5"
                />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STAGE 2: ANIMATED SMART ANALYSIS LOADING */}
        {step === "analyzing" && (
          <motion.div
            key="bmi-analyzing-stage"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28 }}
            className="flex flex-col items-center justify-center rounded-[2.2rem] sm:rounded-[2.6rem] border border-[#CFE0D5] bg-[#F3F7F4] px-6 py-12 sm:py-16 text-center shadow-[0_24px_60px_rgba(20,51,38,0.08)]"
          >
            {/* Animated Circular Scanner Ring */}
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#DCE8E0"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#143326"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * progress) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold normal-nums text-[#143326]">
                  {progress.toLocaleString("fa-IR")}٪
                </span>
              </div>
            </div>

            <motion.p
              key={activeStepText}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 text-sm sm:text-base font-black text-[#14261d]"
            >
              {activeStepText}
            </motion.p>

            <div className="mt-2 flex items-center gap-2 text-xs font-bold text-[#5c6b63]">
              <span>قد {height.toLocaleString("fa-IR")}</span>
              <span>·</span>
              <span>وزن {weight.toLocaleString("fa-IR")}</span>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: MINIMALIST VISUAL RESULT CARD */}
        {step === "result" && (
          <motion.div
            key="bmi-result-stage"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={`overflow-hidden rounded-[2.2rem] sm:rounded-[2.6rem] border ${profile.border} ${profile.surface} p-4 sm:p-6 shadow-[0_24px_60px_rgba(20,51,38,0.1)]`}
          >
            {/* Top Character + Score Visual Bento */}
            <div className="grid items-center gap-4 sm:grid-cols-12">
              {/* Studio Character Portrait */}
              <div className="relative aspect-[4/3] w-full sm:col-span-5 overflow-hidden rounded-[1.6rem] bg-white">
                <img
                  src={profile.characterImage}
                  alt={profile.goalTitle}
                  width={960}
                  height={717}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain object-bottom"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold text-[#14261d] shadow-2xs backdrop-blur-md">
                  <Icon name={profile.icon} className={`h-3.5 w-3.5 ${profile.accentText}`} />
                  <span>{profile.statusLabel}</span>
                </div>
                <img
                  src={profile.dishImage}
                  alt={profile.goalTitle}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="absolute bottom-2.5 left-2.5 h-11 w-11 rounded-xl border-2 border-white object-cover shadow-sm"
                />
              </div>

              {/* Minimal Metrics & Gauge */}
              <div className="sm:col-span-7 space-y-4 px-1">
                {/* Score + Goal Title */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#5c6b63]">برنامهٔ پیشنهادی تو</span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#14261d]">
                      {profile.goalTitle}
                    </h2>
                  </div>

                  <div className="rounded-2xl border border-[#143326]/10 bg-white px-4 py-2.5 text-center shadow-2xs">
                    <span className="block text-[10px] font-extrabold text-[#5c6b63]">BMI</span>
                    <span className={`text-2xl font-extrabold normal-nums ${profile.accentText}`}>
                      {analysis.bmi.toLocaleString("fa-IR")}
                    </span>
                  </div>
                </div>

                {/* Animated Spectrum Bar */}
                <div className="rounded-2xl bg-white p-3.5 border border-[#143326]/8 space-y-2">
                  <div
                    className="relative h-2.5 w-full rounded-full bg-gradient-to-l from-[#C86446] via-[#1F5E43] to-[#8AB89E]"
                    dir="ltr"
                  >
                    <motion.div
                      initial={{ left: "10%" }}
                      animate={{ left: `${analysis.gaugePercent}%` }}
                      transition={{ type: "spring", stiffness: 280, damping: 22 }}
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-3 border-white bg-[#14261d] shadow-md"
                    />
                  </div>
                  <div className="grid grid-cols-4 text-center text-[10px] font-bold text-[#5c6b63]">
                    <span>کمبود</span>
                    <span className="font-extrabold text-[#1F5E43]">ایده‌آل</span>
                    <span>اضافه وزن</span>
                    <span className="text-[#C86446]">بالا</span>
                  </div>
                </div>

                {/* 2 Ultra-Short Metric Pills */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-2xl bg-white p-3 border border-[#143326]/8">
                    <span className="block text-[10px] font-bold text-[#5c6b63]">وزن طلایی قد تو</span>
                    <span className="mt-0.5 block text-xs sm:text-sm font-extrabold text-[#143326] normal-nums">
                      {analysis.minIdeal.toLocaleString("fa-IR")} تا{" "}
                      {analysis.maxIdeal.toLocaleString("fa-IR")} کیلو
                    </span>
                  </div>
                  <div className="rounded-2xl bg-white p-3 border border-[#143326]/8">
                    <span className="block text-[10px] font-bold text-[#5c6b63]">هدف دوره</span>
                    <span className={`mt-0.5 block text-xs sm:text-sm font-black ${profile.accentText}`}>
                      {analysis.diffChip}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Primary CTA + Recalculate */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-[#143326]/8 pt-4">
              <MotionLink
                to={`/onboarding?bmi=${analysis.bmi}`}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
                className="group flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#143326] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_14px_30px_rgba(20,51,38,0.2)] transition-colors hover:bg-[#1F5E43] whitespace-nowrap"
              >
                <span>دریافت رژیم ({profile.rateBadge})</span>
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                />
              </MotionLink>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setStep("input")}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#143326]/14 bg-white px-5 py-3.5 text-xs font-extrabold text-[#14261d] transition-colors hover:bg-[#F7F5F0] cursor-pointer whitespace-nowrap"
              >
                <span>محاسبهٔ مجدد</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
