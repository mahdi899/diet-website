import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { InfoTooltip } from "../components/InfoTooltip";
import { ShimmerBlock } from "../components/Skeletons";
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

interface PlanPerk {
  label: string;
  icon: IconName;
  tooltip: string;
}

interface PlanItem {
  key: string;
  name: string;
  duration: string;
  badge?: string;
  badgeIcon?: IconName;
  price: string;
  dailyCost: string;
  dailyCompare: string;
  image: string;
  featured: boolean;
  cardSurface: string;
  cardBorder: string;
  accentText: string;
  btnClass: string;
  icon: IconName;
  perks: PlanPerk[];
}

const PLANS: PlanItem[] = [
  {
    key: "start",
    name: "پلن شروع",
    duration: "۱۵ روزه",
    price: "۱٬۲۹۰٬۰۰۰",
    dailyCost: "روزی ۸۶٬۰۰۰ تومان",
    dailyCompare: "کمتر از یک میان‌وعده بیرون",
    image: "/src/assets/images/real_plan_start_15d_1794961796046.webp",
    featured: false,
    cardSurface: "bg-[#F7F5F0]",
    cardBorder: "border-[#E6E1D6]",
    accentText: "text-[#143326]",
    btnClass:
      "bg-[#143326] text-white hover:bg-[#1F5E43] shadow-[0_12px_26px_rgba(20,51,38,0.16)]",
    icon: "leaf",
    perks: [
      {
        label: "برنامهٔ اختصاصی متخصص",
        icon: "specialist",
        tooltip: "تنظیم کالری و درشت‌مغذی‌ها (BMR/TDEE) و تأیید نهایی توسط متخصص تغذیه.",
      },
      {
        label: "۳ جایگزین (اقتصادی و مجلسی)",
        icon: "bowl",
        tooltip: "امکان جابه‌جایی آنی هر وعده با ۳ غذای هم‌کالری اقتصادی یا مجلسی از سفرهٔ ایرانی.",
      },
      {
        label: "لیست خرید هفتگی اقتصادی",
        icon: "check",
        tooltip: "محاسبهٔ خودکار مقدار دقیق مواد اولیهٔ موردنیاز هفته متناسب با بودجهٔ خانوار.",
      },
    ],
  },
  {
    key: "companion",
    name: "پلن همراه",
    duration: "۳۰ روزه",
    badge: "محبوب‌ترین",
    badgeIcon: "flame",
    price: "۱٬۹۹۰٬۰۰۰",
    dailyCost: "روزی ۶۶٬۰۰۰ تومان",
    dailyCompare: "کمتر از یک فنجان قهوه در روز",
    image: "/src/assets/images/real_plan_companion_30d_1794961796182.webp",
    featured: true,
    cardSurface: "bg-[#FAF5F2]",
    cardBorder: "border-[#C86446]",
    accentText: "text-[#C86446]",
    btnClass:
      "bg-[#C86446] text-white hover:bg-[#b55538] shadow-[0_14px_30px_rgba(200,100,70,0.28)]",
    icon: "coach24",
    perks: [
      {
        label: "کوچ اختصاصی ۲۴ ساعته",
        icon: "coach24",
        tooltip: "پاسخ‌گویی آنی در تمام ساعات شبانه‌روز برای مدیریت مهمانی، سفر و ریزه‌خواری.",
      },
      {
        label: "۲ نوبت اصلاح برنامه",
        icon: "spark",
        tooltip: "بازنگری و تغییر کامل وعده‌ها توسط متخصص تغذیه در طول دوره بدون هزینهٔ اضافه.",
      },
      {
        label: "۱۰۰۰ غذای اقتصادی و خانگی",
        icon: "bowl",
        tooltip: "امکان انتخاب بین غذاهای اقتصادی دم‌دستی (املت، عدسی، کوکو) یا مجلسی در هر وعده.",
      },
    ],
  },
  {
    key: "vip",
    name: "پلن VIP",
    duration: "۹۰ روزه",
    badge: "خصوصی",
    badgeIcon: "crown",
    price: "۸٬۹۹۰٬۰۰۰",
    dailyCost: "روزی ۹۹٬۰۰۰ تومان",
    dailyCompare: "کلینیک خصوصی در جیب شما",
    image: "/src/assets/images/real_plan_vip_90d_1794961801753.webp",
    featured: false,
    cardSurface: "bg-[#F3F7F4]",
    cardBorder: "border-[#CFE0D5]",
    accentText: "text-[#1F5E43]",
    btnClass:
      "bg-[#143326] text-white hover:bg-[#1F5E43] shadow-[0_12px_26px_rgba(20,51,38,0.18)]",
    icon: "target100",
    perks: [
      {
        label: "نظارت مستقیم متخصص ارشد",
        icon: "specialist",
        tooltip: "پایش هفتگی روند متابولیسم و تنظیم تخصصی درشت‌مغذی‌ها توسط سرتیم تغذیه.",
      },
      {
        label: "۳ جلسه مشاورهٔ آنلاین",
        icon: "phone",
        tooltip: "جلسات خصوصی بررسی پیشرفت و رفع استپ وزنی در پایان هر ماه.",
      },
      {
        label: "برنامهٔ تثبیت ۱۰۰٪ وزن",
        icon: "target100",
        tooltip: "پروتکل بازگشت تدریجی کالری (Reverse Dieting) برای ماندگاری دائمی وزن هدف.",
      },
    ],
  },
];

function PlanCard({ plan }: { plan: PlanItem }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.article
      variants={cardRevealVariants}
      whileHover={{ y: -8 }}
      className={`group relative flex flex-col justify-between rounded-[1.75rem] sm:rounded-[2.4rem] border ${
        plan.featured
          ? "border-2 border-[#C86446] shadow-[0_24px_60px_rgba(200,100,70,0.12)]"
          : `${plan.cardBorder} shadow-[0_16px_40px_rgba(20,51,38,0.06)]`
      } ${plan.cardSurface} p-2.5 sm:p-4 transition-shadow duration-300 hover:shadow-[0_28px_65px_rgba(20,51,38,0.12)]`}
    >
      <div>
        {/* Custom Studio Character + App Screen Photo with 16:9 Mobile / 4:3 Desktop Framing */}
        <div className="relative aspect-[16/9] sm:aspect-[4/3] w-full overflow-hidden rounded-[1.35rem] sm:rounded-[1.8rem] bg-white">
          {!imgLoaded && <ShimmerBlock className="absolute inset-0 h-full w-full" />}
          <img
            src={plan.image}
            alt={plan.name}
            width={960}
            height={717}
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-contain object-bottom transition-all duration-700 group-hover:scale-104 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Featured / VIP Icon Badge (Small corner circle, unobtrusive) */}
          {plan.badge && plan.badgeIcon && (
            <div
              title={plan.badge}
              aria-label={plan.badge}
              className={`absolute top-2.5 left-2.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${
                plan.featured ? "bg-[#C86446]" : "bg-[#143326]"
              }`}
            >
              <Icon name={plan.badgeIcon} className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </div>
          )}
        </div>

        {/* Plan Title + Duration Pill + Price + Daily Cost Psychology Anchor */}
        <div className="px-2.5 pt-3.5 pb-3 sm:px-3 sm:pt-4.5 sm:pb-3.5 border-b border-[#143326]/8 space-y-2.5">
          {/* Row 1: Plan Name + Clean Duration Pill (no longer covering the photo) & Full Price */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-lg sm:text-xl font-black text-[#14261d] whitespace-nowrap">
                {plan.name}
              </h2>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#143326]/12 bg-white px-2.5 py-0.5 text-[11px] font-extrabold text-[#14261d]">
                <Icon name={plan.icon} className={`h-3 w-3 ${plan.accentText}`} />
                <span>{plan.duration}</span>
              </span>
            </div>

            <div className="flex shrink-0 items-baseline gap-1 text-left">
              <div
                dir="ltr"
                className="inline-flex items-baseline text-xl sm:text-2xl font-black tracking-normal leading-none normal-nums text-[#14261d] whitespace-nowrap"
              >
                {plan.price.split("٬").map((group, idx) => (
                  <span key={idx} className="inline-flex items-baseline">
                    {idx > 0 && (
                      <span className="mx-[1px] text-[0.7em] font-semibold text-[#5c6b63]">
                        ,
                      </span>
                    )}
                    <span>{group}</span>
                  </span>
                ))}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#5c6b63]">
                تومان
              </span>
            </div>
          </div>

          {/* Row 2: Daily Cost Breakdown Pill */}
          <div className="flex items-center justify-between gap-2 rounded-xl border border-[#143326]/6 bg-white/90 px-3 py-1.5 text-[11px]">
            <span className={`shrink-0 font-black tabular-nums whitespace-nowrap ${plan.accentText}`}>
              {plan.dailyCost}
            </span>
            <span className="font-bold text-[#5c6b63] whitespace-nowrap">
              {plan.dailyCompare}
            </span>
          </div>
        </div>

        {/* 3 Minimalist Line-Art Perks with Subtle Hover Tooltips */}
        <div className="px-1.5 py-2.5 sm:px-2 sm:py-4 space-y-1.5 sm:space-y-2.5">
          {plan.perks.map((perk) => (
            <div
              key={perk.label}
              className="flex items-center justify-between gap-2 rounded-xl sm:rounded-2xl border border-[#143326]/6 bg-white px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm font-bold text-[#14261d] transition-transform duration-300 group-hover:-translate-x-0.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg bg-[#FAF9F6] ${plan.accentText}`}
                >
                  <Icon name={perk.icon} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <span className="truncate">{perk.label}</span>
              </div>

              <InfoTooltip
                text={perk.tooltip}
                label={`توضیحات ${perk.label}`}
                align="left"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Short Animated CTA */}
      <div className="pt-1 px-1 pb-0.5 sm:pt-2 sm:pb-1">
        <MotionLink
          to={`/onboarding?plan=${plan.key}`}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 420, damping: 20 }}
          className={`group/btn flex w-full min-h-[44px] items-center justify-center gap-2 rounded-full py-3 sm:py-4 text-xs sm:text-base font-bold transition-colors whitespace-nowrap ${plan.btnClass}`}
        >
          <span>دریافت {plan.name}</span>
          <Icon
            name="arrow"
            className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-x-1.5"
          />
        </MotionLink>
      </div>
    </motion.article>
  );
}

export default function PricingPage() {
  usePageTitle("تعرفه‌ها | رژیم من");
  const [mobileFilter, setMobileFilter] = useState<string>("all");

  const visiblePlans =
    mobileFilter === "all" ? PLANS : PLANS.filter((p) => p.key === mobileFilter);

  return (
    <div className="bg-white text-[#14261d] overflow-x-clip" dir="rtl">
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white pt-3 pb-10 sm:pt-10 sm:pb-24"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          {/* Minimalist Header */}
          <motion.div
            variants={itemRevealVariants}
            className="mx-auto max-w-xl text-center space-y-2 sm:space-y-3 mb-4 sm:mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#143326]/12 bg-[#F3F7F4] px-3.5 py-1 sm:px-4 sm:py-1.5 text-xs font-bold text-[#143326]">
              <LottieLineIcon variant="target" className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>تضمین ۱۰۰٪ نتیجه</span>
              <InfoTooltip
                text="پشتیبانی کامل تا رسیدن به وزن هدف و ضمانت بازگشت وجه طبق شرایط سایت."
                label="توضیحات تضمین نتیجه"
                align="center"
              />
            </div>
            <h1 className="text-2xl font-extrabold tracking-normal text-[#14261d] sm:text-5xl">
              انتخاب پلن اختصاصی
            </h1>
          </motion.div>

          {/* Mobile Quick Plan Switcher (< lg) so mobile users can compare without scrolling */}
          <div className="mb-4 grid grid-cols-4 gap-1 rounded-full border border-[#143326]/10 bg-[#F7F5F0] p-1 lg:hidden">
            {[
              { id: "all", label: "همه" },
              { id: "start", label: "۱۵ روزه" },
              { id: "companion", label: "۳۰ روزه" },
              { id: "vip", label: "۹۰ روزه" },
            ].map((tab) => {
              const active = mobileFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMobileFilter(tab.id)}
                  className={`min-h-[38px] rounded-full px-2 py-1.5 text-[11px] font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-[#143326] text-white shadow-2xs"
                      : "text-[#5c6b63] hover:text-[#14261d]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 3 Visual Plan Cards */}
          <motion.div
            variants={staggerGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="grid gap-4 sm:gap-7 lg:grid-cols-3 lg:items-stretch"
          >
            {visiblePlans.map((plan) => (
              <PlanCard key={plan.key} plan={plan} />
            ))}
          </motion.div>

          {/* Minimalist Guarantee Banner below plans with scroll-reveal */}
          <motion.div
            variants={itemRevealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="mt-6 sm:mt-12 flex flex-wrap items-center justify-between gap-3 sm:gap-4 rounded-[1.5rem] sm:rounded-[1.8rem] border border-[#CFE0D5] bg-[#F3F7F4] px-4 py-3.5 sm:px-8 sm:py-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#143326] shadow-2xs">
                <Icon name="check" className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#14261d]">
                    <span>ضمانت بازگشت وجه و پشتیبانی ۲۴ ساعته</span>
                    <InfoTooltip
                      text="در صورت عدم رضایت از برنامهٔ اولیه، تا ۷ روز امکان لغو و بازگشت وجه وجود دارد."
                      label="شرایط ضمانت بازگشت وجه"
                      align="center"
                    />
                  </div>
                  <div className="text-[11px] font-bold text-[#5c6b63]">
                    فعال‌سازی آنی برنامه بلافاصله پس از تکمیل پرسش‌نامه
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/refund"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-extrabold text-[#143326] transition-colors hover:bg-[#143326] hover:text-white"
            >
              <span>شرایط ضمانت</span>
              <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
