import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon, type IconName } from "../icons";
import { LottieLineIcon } from "../lottieData";

interface SuccessStory {
  id: string;
  name: string;
  age: string;
  city: string;
  beforeLabel: string;
  afterLabel: string;
  resultBadge: string;
  duration: string;
  quote: string;
  image: string;
  icon: IconName;
  surface: string;
  border: string;
  accentText: string;
  pillBg: string;
}

const STORIES: SuccessStory[] = [
  {
    id: "story-loss",
    name: "مهسا راد",
    age: "۳۸ ساله",
    city: "تهران",
    beforeLabel: "قبل · ۷۸ کیلو",
    afterLabel: "بعد · ۶۷ کیلو",
    resultBadge: "۱۱ کیلو کاهش وزن",
    duration: "در ۶۰ روز",
    quote: "با همون دستپخت خونه و بدون حذف برنج، خیلی راحت سبک شدم.",
    image: "/src/assets/images/real_ba_loss_woman_38.webp",
    icon: "flame",
    surface: "bg-[#FAF5F2]",
    border: "border-[#EED8CE]",
    accentText: "text-[#C86446]",
    pillBg: "bg-[#C86446]",
  },
  {
    id: "story-muscle",
    name: "امیرحسین فرهمند",
    age: "۴۲ ساله",
    city: "شیراز",
    beforeLabel: "قبل · ۸۶ کیلو",
    afterLabel: "بعد · ۷۸ کیلو",
    resultBadge: "چربی‌سوزی و فرم ورزشی",
    duration: "در ۶۰ روز",
    quote: "شکمم کامل جمع شد و انرژی روزانه‌ام زمین تا آسمون فرق کرده.",
    image: "/src/assets/images/real_ba_muscle_man_42.webp",
    icon: "muscle",
    surface: "bg-[#F3F7F4]",
    border: "border-[#CFE0D5]",
    accentText: "text-[#143326]",
    pillBg: "bg-[#143326]",
  },
  {
    id: "story-gain",
    name: "سینا کاظمی",
    age: "۳۴ ساله",
    city: "اصفهان",
    beforeLabel: "قبل · ۵۹ کیلو",
    afterLabel: "بعد · ۶۶ کیلو",
    resultBadge: "۷ کیلو افزایش وزن سالم",
    duration: "در ۴۵ روز",
    quote: "صورتم پر شد و بدون اینکه شکم بیارم، حجم و وزن عالی گرفتم.",
    image: "/src/assets/images/real_ba_gain_man_34.webp",
    icon: "scale",
    surface: "bg-[#F7F5F0]",
    border: "border-[#E6E1D6]",
    accentText: "text-[#1F5E43]",
    pillBg: "bg-[#1F5E43]",
  },
  {
    id: "story-shape",
    name: "نگین محمدی",
    age: "۴۶ ساله",
    city: "مشهد",
    beforeLabel: "قبل · ۷۶ کیلو",
    afterLabel: "بعد · ۶۸ کیلو",
    resultBadge: "۸ کیلو کاهش و تثبیت",
    duration: "در ۵۰ روز",
    quote: "حتی تو مهمونی‌ها کوچ فوری جایگزین می‌داد و وزنم اصلاً برنگشت.",
    image: "/src/assets/images/real_ba_shape_woman_46.webp",
    icon: "target100",
    surface: "bg-[#F3F7F4]",
    border: "border-[#CFE0D5]",
    accentText: "text-[#143326]",
    pillBg: "bg-[#1F5E43]",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    scale: 0.98,
  }),
};

export function TestimonialCarousel() {
  const [[activeIndex, direction], setPage] = useState<[number, number]>([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const total = STORIES.length;
  const current = STORIES[activeIndex];

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(([prev]) => [(prev + newDirection + total) % total, newDirection]);
    },
    [total]
  );

  const selectIndex = (targetIdx: number) => {
    if (targetIdx === activeIndex) return;
    setPage([targetIdx, targetIdx > activeIndex ? 1 : -1]);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      paginate(1);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [isPaused, paginate]);

  return (
    <div
      className="relative [contain:layout_paint]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Minimal Header + Controls */}
      <div className="mb-3 sm:mb-6 flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:block sm:space-y-1">
          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#143326]/12 bg-[#F3F7F4] px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-[#143326]">
            <LottieLineIcon variant="target" className="h-4 w-4 shrink-0" />
            <span className="truncate">نتایج واقعی کاربران</span>
          </div>
          <h2 className="truncate text-sm font-extrabold tracking-normal text-[#14261d] sm:text-3xl">
            قبل و بعدِ اعضای رژیم من
          </h2>
        </div>

        {/* Minimal Prev/Next Pill Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <motion.button
            type="button"
            aria-label="تجربه قبلی"
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => paginate(-1)}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#143326]/14 bg-[#F7F5F0] text-[#14261d] transition-colors hover:bg-[#143326] hover:text-white cursor-pointer"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
          </motion.button>
          <motion.button
            type="button"
            aria-label="تجربه بعدی"
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => paginate(1)}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#143326]/14 bg-[#F7F5F0] text-[#14261d] transition-colors hover:bg-[#143326] hover:text-white cursor-pointer"
          >
            <Icon name="arrow" className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Main Carousel Stage */}
      <div
        className={`relative overflow-hidden rounded-[1.6rem] sm:rounded-[2.4rem] border ${current.border} ${current.surface} p-3 sm:p-6 transition-colors duration-500 shadow-[0_18px_46px_rgba(20,51,38,0.06)] [contain:content]`}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 340, damping: 30 },
              opacity: { duration: 0.22 },
              scale: { duration: 0.22 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x > 60) {
                paginate(1);
              } else if (info.offset.x < -60) {
                paginate(-1);
              }
            }}
            className="grid items-center gap-3.5 sm:gap-7 lg:grid-cols-12"
          >
            {/* Right Column (RTL): Side-by-Side Before & After Portrait */}
            <div className="lg:col-span-6 min-w-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem] border border-[#143326]/10 bg-white shadow-2xs [contain:layout_paint]">
                <img
                  src={current.image}
                  alt={`قبل و بعد ${current.name}`}
                  width={960}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-top select-none pointer-events-none"
                />

                {/* Right Half Badge: BEFORE (قبل) */}
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 inline-flex max-w-[calc(50%-0.65rem)] items-center gap-1 rounded-full bg-[#14261d]/82 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-extrabold text-white backdrop-blur-md normal-nums">
                  <span className="truncate">{current.beforeLabel}</span>
                </div>

                {/* Left Half Badge: AFTER (بعد) */}
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 inline-flex max-w-[calc(50%-0.65rem)] items-center gap-1 rounded-full bg-[#143326] px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-extrabold text-[#C5E4B0] shadow-sm backdrop-blur-md normal-nums">
                  <Icon name="check" className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-[#C5E4B0]" />
                  <span className="truncate">{current.afterLabel}</span>
                </div>
              </div>
            </div>

            {/* Left Column (RTL): Concise Non-Repetitive Story Details */}
            <div className="lg:col-span-6 min-w-0 flex flex-col justify-between space-y-3 sm:space-y-5 px-1 sm:px-3">
              {/* Single Result + Duration Row (stated only once) */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full ${current.pillBg} px-3.5 py-1 text-xs font-extrabold text-white shadow-2xs normal-nums`}
                >
                  <Icon name={current.icon} className="h-3.5 w-3.5 shrink-0" />
                  <span>{current.resultBadge}</span>
                </span>
                <span className="rounded-full border border-[#143326]/10 bg-white px-3 py-1 text-xs font-bold text-[#4a5a51] normal-nums">
                  {current.duration}
                </span>
              </div>

              {/* Short, Natural User Quote */}
              <blockquote className="m-0 text-sm sm:text-xl lg:text-2xl font-extrabold leading-relaxed text-[#14261d]">
                «{current.quote}»
              </blockquote>

              {/* Clean Member Identity + Pagination Dots (Zero duplicate avatar or repeated goal text) */}
              <div className="flex items-center justify-between gap-2 border-t border-[#143326]/10 pt-2.5 sm:pt-4">
                <div className="flex min-w-0 items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-extrabold text-[#14261d] normal-nums">
                  <span className="truncate">{current.name}</span>
                  <span className="shrink-0 text-[#143326]/30">·</span>
                  <span className="truncate font-bold text-[#5c6b63]">{current.age}، {current.city}</span>
                </div>

                {/* Quick Story Selector Dots */}
                <div
                  className="flex shrink-0 items-center gap-0.5"
                  role="tablist"
                  aria-label="انتخاب تجربه کاربر"
                >
                  {STORIES.map((story, idx) => {
                    const active = idx === activeIndex;
                    return (
                      <button
                        key={story.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-label={`تجربه ${story.name}`}
                        onClick={() => selectIndex(idx)}
                        className="flex min-h-[40px] min-w-[26px] items-center justify-center px-1 cursor-pointer"
                      >
                        <span
                          className={`block h-2.5 rounded-full transition-all duration-300 ${
                            active
                              ? "w-7 bg-[#143326]"
                              : "w-2.5 bg-[#143326]/22 hover:bg-[#143326]/45"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
