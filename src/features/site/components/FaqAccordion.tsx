import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSiteUi } from "./SiteFrame";
import { Icon, type IconName } from "../icons";
import { LottieLineIcon } from "../lottieData";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tag: string;
  icon: IconName;
  accentText: string;
  activeSurface: string;
  activeBorder: string;
}

const FAQS: FaqItem[] = [
  {
    id: "faq-persian-food",
    question: "غذاهای رژیم با سفرهٔ خانواده فرق داره؟",
    answer: "نه؛ تمام وعده‌ها با غذاهای معمولی سفرهٔ ایرانی و ۳ جایگزین آزاد تنظیم می‌شوند.",
    tag: "سفرهٔ ایرانی",
    icon: "bowl",
    accentText: "text-[#143326]",
    activeSurface: "bg-[#F3F7F4]",
    activeBorder: "border-[#CFE0D5]",
  },
  {
    id: "faq-coach-24",
    question: "کوچ ۲۴ ساعته چطور در طول روز همراهمه؟",
    answer: "هر ساعت در اپ پیام بدهی، کوچ اختصاصی فوری پاسخ می‌دهد و جایگزین وعده را برایت می‌چیند.",
    tag: "پشتیبانی ۲۴/۷",
    icon: "coach24",
    accentText: "text-[#C86446]",
    activeSurface: "bg-[#FAF5F2]",
    activeBorder: "border-[#EED8CE]",
  },
  {
    id: "faq-specialist-edit",
    question: "امکان تغییر برنامه توسط متخصص وجود داره؟",
    answer: "بله؛ متخصص تغذیه برنامه را بازبینی می‌کند و هر زمان لازم باشد برایت اصلاح می‌کند.",
    tag: "بازبینی متخصص",
    icon: "specialist",
    accentText: "text-[#1F5E43]",
    activeSurface: "bg-[#F3F7F4]",
    activeBorder: "border-[#CFE0D5]",
  },
  {
    id: "faq-guarantee",
    question: "چقدر طول می‌کشه به وزن هدفم برسم؟",
    answer: "به‌طور میانگین ۴ تا ۶ کیلو در ماه بدون گرسنگی و با برنامهٔ تثبیت ۱۰۰٪ وزن.",
    tag: "تضمین ۱۰۰٪",
    icon: "target100",
    accentText: "text-[#C86446]",
    activeSurface: "bg-[#FAF5F2]",
    activeBorder: "border-[#EED8CE]",
  },
];

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);
  const { openChat } = useSiteUi();

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="grid items-start gap-3.5 sm:gap-6 lg:grid-cols-12 lg:gap-10">
      {/* Right Column (RTL): Compact Single-Row Header on Mobile + Full Column on Desktop */}
      <div className="lg:col-span-4 flex items-center justify-between gap-3 lg:block lg:space-y-4 text-right">
        <div className="space-y-1 sm:space-y-2">
          <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#143326]/12 bg-[#F3F7F4] px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-[#143326]">
            <LottieLineIcon variant="spark" className="h-4 w-4" />
            <span>شفاف و کوتاه</span>
          </div>

          <h2 className="text-lg font-black tracking-tight text-[#14261d] sm:text-3xl">
            سؤالات پرتکرار
          </h2>

          <p className="hidden lg:block text-xs sm:text-sm font-bold leading-relaxed text-[#5c6b63]">
            هر سؤال دیگه‌ای داری، کوچ هوشمند همین الان آنلاین پاسخ می‌ده.
          </p>
        </div>

        <div className="shrink-0 lg:pt-1">
          <motion.button
            type="button"
            onClick={() => openChat("سلام، دربارهٔ نحوهٔ دریافت برنامه و کوچ ۲۴ ساعته سؤال دارم.")}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="inline-flex min-h-[40px] sm:min-h-[44px] items-center gap-1.5 sm:gap-2 rounded-full border border-[#143326]/14 bg-[#F7F5F0] px-3.5 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-[#14261d] transition-colors hover:border-[#C86446]/45 hover:bg-[#FAF5F2] cursor-pointer whitespace-nowrap"
          >
            <Icon name="chat" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#C86446]" />
            <span>پرسش از کوچ آنلاین</span>
          </motion.button>
        </div>
      </div>

      {/* Left Column (RTL): Clean Line-Art Accordion Stack */}
      <div className="lg:col-span-8 space-y-2 sm:space-y-3">
        {FAQS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <motion.div
              key={item.id}
              layout
              transition={{ layout: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
              className={`overflow-hidden rounded-[1.25rem] sm:rounded-[1.8rem] border transition-colors duration-300 ${
                isOpen
                  ? `${item.activeBorder} ${item.activeSurface} shadow-[0_14px_34px_rgba(20,51,38,0.06)]`
                  : "border-[#E6E1D6] bg-[#F7F5F0]/80 hover:border-[#143326]/20 hover:bg-[#F7F5F0]"
              }`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center justify-between gap-2.5 px-3.5 py-3 sm:px-5 sm:py-4 text-right cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Minimalist Line-Art Icon Box */}
                  <div
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${
                      isOpen
                        ? "border-[#143326]/12 bg-white shadow-2xs " + item.accentText
                        : "border-[#143326]/8 bg-white text-[#143326]"
                    }`}
                  >
                    <Icon name={item.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>

                  <span className="text-xs sm:text-base font-extrabold text-[#14261d] leading-snug">
                    {item.question}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`hidden sm:inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold ${item.accentText}`}
                  >
                    {item.tag}
                  </span>

                  {/* Animated Line-Art Plus/Minus Indicator */}
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 360, damping: 24 }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                      isOpen
                        ? "border-[#143326] bg-[#143326] text-white"
                        : "border-[#143326]/12 bg-white text-[#143326]"
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M6 12h12" />
                      {!isOpen && <path d="M12 6v12" />}
                    </svg>
                  </motion.span>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-4 pb-4 pt-0.5 sm:px-5 sm:pb-5 sm:pr-16">
                      <p className="m-0 text-xs sm:text-sm font-bold leading-relaxed text-[#46564e]">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
