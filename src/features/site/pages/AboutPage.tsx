import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { InfoTooltip } from "../components/InfoTooltip";
import { useSiteUi } from "../components/SiteFrame";
import { Icon, type IconName } from "../icons";
import { LottieLineIcon } from "../lottieData";
import {
  cardRevealVariants,
  itemRevealVariants,
  revealViewport,
  sectionRevealVariants,
  staggerGridVariants,
} from "../motionVariants";
import { usePageTitle } from "../usePageTitle";

const MotionLink = motion.create(Link);

interface MethodStep {
  num: string;
  title: string;
  tag: string;
  tooltip: string;
  icon: IconName;
  surface: string;
  border: string;
  accent: string;
}

const STEPS: MethodStep[] = [
  {
    num: "۰۱",
    title: "آنالیز هوشمند",
    tag: "بررسی متابولیسم و ذائقه",
    tooltip: "محاسبهٔ دقیق نرخ متابولیسم پایه (BMR)، کالری روزانه (TDEE) و غذاهای موردعلاقهٔ تو.",
    icon: "target100",
    surface: "bg-[#F3F7F4]",
    border: "border-[#CFE0D5]",
    accent: "text-[#143326]",
  },
  {
    num: "۰۲",
    title: "طراحی متخصص",
    tag: "تأیید پزشک تغذیه",
    tooltip: "بازبینی کامل پیش‌نویس هوشمند و تنظیم دقیق درشت‌مغذی‌ها توسط متخصص تغذیه.",
    icon: "specialist",
    surface: "bg-[#FAF5F2]",
    border: "border-[#EED8CE]",
    accent: "text-[#C86446]",
  },
  {
    num: "۰۳",
    title: "کوچ ۲۴ ساعته",
    tag: "همراهی لحظه‌به‌لحظه",
    tooltip: "پاسخ‌گویی آنی در اپ برای جایگزینی وعده‌ها در مهمانی، سفر یا روزهای پرمشغله.",
    icon: "coach24",
    surface: "bg-[#F7F5F0]",
    border: "border-[#E6E1D6]",
    accent: "text-[#143326]",
  },
  {
    num: "۰۴",
    title: "تثبیت ۱۰۰٪",
    tag: "ماندگاری بدون بازگشت",
    tooltip: "پروتکل تثبیت متابولیک در پایان دوره برای جلوگیری از بازگشت وزن.",
    icon: "spark",
    surface: "bg-[#F3F7F4]",
    border: "border-[#CFE0D5]",
    accent: "text-[#1F5E43]",
  },
];

const COMPARISONS = [
  {
    title: "تنوع وعده‌ها",
    oldWay: "برگهٔ کاغذی ثابت و تکراری",
    newWay: "۳ جایگزین آزاد برای هر وعده",
    tooltip: "هر وعده دارای ۳ انتخاب هم‌کالری (پیشنهاد اصلی، جایگزین هوشمند و جایگزین متخصص) است.",
    icon: "bowl" as IconName,
  },
  {
    title: "پشتیبانی دوره",
    oldWay: "بی‌خبری تا ماه بعد",
    newWay: "کوچ اختصاصی ۲۴ ساعته در اپ",
    tooltip: "دسترسی مستقیم به کوچ هوشمند در هر ساعت و ثبت درخواست اصلاح برای متخصص تغذیه.",
    icon: "coach24" as IconName,
  },
  {
    title: "سفرهٔ ایرانی",
    oldWay: "غذاهای رژیمی جدا از خانواده",
    newWay: "تنظیم‌شده با دستپخت خانه",
    tooltip: "تنظیم پیمانه و بشقاب بر اساس خورشت‌ها و پلوهای اصیل ایرانی بدون نیاز به آشپزی جداگانه.",
    icon: "leaf" as IconName,
  },
];

export default function AboutPage() {
  usePageTitle("دربارهٔ ما | رژیم من");
  const { openChat } = useSiteUi();

  return (
    <div className="bg-white text-[#14261d] overflow-x-clip" dir="rtl">
      {/* 1. VISUAL STUDIO HERO */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white pt-2 pb-6 sm:pt-8 sm:pb-16"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <div className="grid items-center gap-5 lg:grid-cols-12 lg:gap-10">
            {/* Right Copy (RTL) */}
            <motion.div
              variants={itemRevealVariants}
              className="lg:col-span-5 space-y-3.5 sm:space-y-6 text-right"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#143326]/12 bg-[#F3F7F4] px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-bold text-[#143326]">
                <LottieLineIcon variant="spark" className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>نسل جدید کلینیک تغذیه</span>
                <InfoTooltip
                  text="ترکیب دقت محاسبات هوشمند درشت‌مغذی‌ها با نظارت مستقیم متخصص تغذیه."
                  label="درباره کلینیک هوشمند"
                  align="center"
                />
              </div>

              <h1 className="text-2xl font-extrabold leading-[1.26] tracking-normal text-[#14261d] sm:text-5xl">
                تخصص پزشکی،{" "}
                <span className="inline sm:block sm:mt-1.5 text-[#C86446]">همراهی ۲۴ ساعته.</span>
              </h1>

              <p className="max-w-md text-xs sm:text-base font-medium leading-relaxed text-[#5c6b63]">
                ترکیب علم متخصصان تغذیه با کوچ هوشمند ۲۴ ساعته برای رسیدن ۱۰۰٪ به وزن دلخواه، با غذاهای سفرهٔ ایرانی.
              </p>

              {/* Compact Stats Row */}
              <motion.div
                variants={staggerGridVariants}
                className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-0.5"
              >
                <motion.div
                  variants={cardRevealVariants}
                  className="rounded-2xl border border-[#143326]/8 bg-[#F7F5F0] p-2.5 sm:p-3 text-center"
                >
                  <div dir="ltr" className="text-base sm:text-xl font-extrabold normal-nums tracking-normal text-[#143326]">+۱۵٬۰۰۰</div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-[#5c6b63]">کاربر موفق</div>
                </motion.div>
                <motion.div
                  variants={cardRevealVariants}
                  className="rounded-2xl border border-[#C86446]/18 bg-[#FAF5F2] p-2.5 sm:p-3 text-center"
                >
                  <div className="text-base sm:text-xl font-extrabold normal-nums tracking-normal text-[#C86446]">۲۴/۷</div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-[#5c6b63]">کوچ آنلاین</div>
                </motion.div>
                <motion.div
                  variants={cardRevealVariants}
                  className="rounded-2xl border border-[#143326]/12 bg-[#F3F7F4] p-2.5 sm:p-3 text-center"
                >
                  <div className="text-base sm:text-xl font-extrabold normal-nums tracking-normal text-[#1F5E43]">۱۰۰٪</div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-[#5c6b63]">تضمین نتیجه</div>
                </motion.div>
              </motion.div>

              {/* Short CTAs */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-0.5">
                <MotionLink
                  to="/onboarding"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 420, damping: 20 }}
                  className="group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#143326] px-6 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-base font-bold text-white shadow-[0_14px_30px_rgba(20,51,38,0.2)] transition-colors hover:bg-[#1F5E43] whitespace-nowrap"
                >
                  <span>دریافت رژیم</span>
                  <Icon
                    name="arrow"
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                  />
                </MotionLink>

                <motion.button
                  type="button"
                  onClick={() => openChat("چطور متخصصان رژیم من برنامه را طراحی می‌کنند؟")}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 420, damping: 20 }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#143326]/14 bg-[#F7F5F0] px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-bold text-[#14261d] transition-colors hover:bg-[#EFECE4] whitespace-nowrap"
                >
                  <Icon name="chat" className="h-4 w-4 text-[#C86446]" />
                  <span>سؤال از مشاور</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Left Studio Character Showcase (RTL) */}
            <motion.div variants={cardRevealVariants} className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2.6rem] border border-[#143326]/10 bg-[#F7F5F0] p-2 sm:p-4 shadow-[0_24px_60px_rgba(20,51,38,0.08)]">
                <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-[1.35rem] sm:rounded-[2rem] bg-white">
                  <img
                    src="/src/assets/images/about_hero_clinic_team_1794961846263.webp"
                    alt="تیم کوچ ورزشی و پزشکان متخصص تغذیه رژیم من"
                    width={960}
                    height={717}
                    fetchPriority="high"
                    decoding="sync"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain object-bottom"
                  />

                  {/* Floating Specialist Badge */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 rounded-2xl border border-[#143326]/10 bg-white/95 px-3 py-2 shadow-md backdrop-blur-md">
                    <LottieLineIcon variant="target" className="h-6 w-6" />
                    <div className="text-right">
                      <div className="text-[11px] sm:text-xs font-extrabold text-[#14261d]">
                        تیم پزشکان و متخصص تغذیه
                      </div>
                      <div className="text-[10px] font-bold text-[#1F5E43]">برنامهٔ ۱۰۰٪ شخصی</div>
                    </div>
                  </div>

                  {/* Floating Bottom Live Coach Pill */}
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-2 rounded-2xl bg-[#143326]/95 px-3.5 py-2 text-white shadow-lg backdrop-blur-md">
                    <LottieLineIcon variant="coach" className="h-6 w-6" />
                    <span className="text-[11px] sm:text-xs font-bold">پشتیبانی زنده در اپلیکیشن</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 2. 4-STEP METHOD BENTO (2x2 on Mobile, 4-col on Desktop) */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white py-4 sm:py-14"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <motion.div
            variants={itemRevealVariants}
            className="mb-4 sm:mb-8 flex items-end justify-between"
          >
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold text-[#C86446]">متد اختصاصی ۲۰۲۶</span>
              <h2 className="mt-0.5 text-xl font-extrabold tracking-normal text-[#14261d] sm:text-3xl">
                ۴ گام تا نتیجهٔ قطعی
              </h2>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#F3F7F4] px-3.5 py-1.5 text-xs font-bold text-[#143326]">
              <Icon name="check" className="h-3.5 w-3.5" />
              <span>بدون گرسنگی</span>
            </span>
          </motion.div>

          <motion.div
            variants={staggerGridVariants}
            className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4"
          >
            {STEPS.map((step) => (
              <motion.div
                key={step.num}
                variants={cardRevealVariants}
                whileHover={{ y: -6 }}
                className={`group flex flex-col justify-between rounded-[1.4rem] sm:rounded-[2rem] border ${step.border} ${step.surface} p-3.5 sm:p-6 transition-shadow hover:shadow-[0_18px_40px_rgba(20,51,38,0.08)]`}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-7">
                  <div
                    className={`flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-white shadow-2xs ${step.accent} transition-transform duration-300 group-hover:scale-108`}
                  >
                    <Icon name={step.icon} className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <InfoTooltip
                      text={step.tooltip}
                      label={`جزئیات ${step.title}`}
                      align="left"
                    />
                    <span className="text-xs sm:text-sm font-extrabold text-[#143326]/40 normal-nums">
                      {step.num}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-extrabold text-[#14261d]">{step.title}</h3>
                  <p className="mt-0.5 text-[11px] sm:text-xs font-bold text-[#5c6b63]">{step.tag}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 3. VISUAL COMPARISON & APP SHOWCASE */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white py-4 sm:py-16"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <div className="grid items-center gap-4 sm:gap-6 rounded-[1.75rem] sm:rounded-[2.8rem] border border-[#E6E1D6] bg-[#F7F5F0] p-3.5 sm:p-8 lg:grid-cols-12 lg:gap-10">
            {/* App & Coach Image */}
            <motion.div
              variants={itemRevealVariants}
              className="lg:col-span-5 overflow-hidden rounded-[1.35rem] sm:rounded-[2rem] bg-white p-1.5 sm:p-2 shadow-sm"
            >
              <img
                src="/src/assets/images/about_comparison_persian_feast_1794961848962.webp"
                alt="کوچ‌های ورزشی رژیم من با برنامه غذایی سفره ایرانی"
                width={960}
                height={717}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="aspect-[16/10] sm:aspect-[4/3] w-full object-contain object-bottom transition-transform duration-700 hover:scale-104"
              />
            </motion.div>

            {/* Minimal Comparison Cards */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <motion.div variants={itemRevealVariants}>
                <span className="text-[11px] sm:text-xs font-extrabold text-[#1F5E43]">تفاوت در عمل</span>
                <h2 className="mt-0.5 text-lg sm:text-3xl font-extrabold tracking-normal text-[#14261d]">
                  چرا رژیم من نتیجه‌بخش است؟
                </h2>
              </motion.div>

              <motion.div
                variants={staggerGridVariants}
                className="grid gap-2.5 sm:gap-3 sm:grid-cols-3"
              >
                {COMPARISONS.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={cardRevealVariants}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    className="flex flex-col justify-between rounded-2xl border border-[#143326]/8 bg-white p-3 sm:p-4 shadow-2xs"
                  >
                    <div>
                      <div className="mb-2 sm:mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:block">
                          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#F3F7F4] text-[#143326]">
                            <Icon name={item.icon} className="h-4 w-4" />
                          </div>
                          <h3 className="text-xs sm:hidden font-black text-[#14261d]">{item.title}</h3>
                        </div>
                        <InfoTooltip
                          text={item.tooltip}
                          label={`توضیحات ${item.title}`}
                          align="left"
                        />
                      </div>
                      <h3 className="hidden sm:block text-sm font-black text-[#14261d]">{item.title}</h3>
                      <div className="mt-1 sm:mt-2.5 rounded-xl bg-[#FAF5F2] px-2.5 py-1.5 text-[11px] font-bold text-[#8a6558] line-through">
                        {item.oldWay}
                      </div>
                    </div>

                    <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 rounded-xl bg-[#F3F7F4] px-2.5 py-1.5 sm:py-2 text-xs font-extrabold text-[#143326]">
                      <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-[#1F5E43]" />
                      <span>{item.newWay}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4. MINIMALIST BOTTOM CTA */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white pt-3 pb-10 sm:pb-24"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <motion.div
            variants={cardRevealVariants}
            className="relative overflow-hidden rounded-[2.2rem] sm:rounded-[2.8rem] bg-[#143326] px-6 py-10 sm:px-12 sm:py-14 text-white shadow-[0_24px_60px_rgba(20,51,38,0.2)]"
          >
            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-right">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-[#E8C5B0]">
                  <Icon name="spark" className="h-3.5 w-3.5" />
                  <span>شروع در ۲ دقیقه</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-normal text-white">
                  آمادهٔ شروع برنامهٔ اختصاصی هستی؟
                </h2>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <MotionLink
                  to="/onboarding"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 420, damping: 20 }}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#C86446] px-8 py-4 text-sm sm:text-base font-bold text-white shadow-[0_14px_30px_rgba(200,100,70,0.35)] transition-colors hover:bg-[#b55538] whitespace-nowrap"
                >
                  <span>دریافت رژیم</span>
                  <Icon
                    name="arrow"
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                  />
                </MotionLink>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
