import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Icon } from "../icons";
import { LottieLineIcon } from "../lottieData";
import {
  cardRevealVariants,
  itemRevealVariants,
  revealViewport,
  sectionRevealVariants,
  staggerGridVariants,
} from "../motionVariants";
import { usePageTitle } from "../usePageTitle";
import { useSiteUi } from "../components/SiteFrame";

const TOPICS = [
  "مشاوره پیش از خرید",
  "سؤال از متخصص تغذیه",
  "پشتیبانی اپلیکیشن",
  "پیگیری سفارش",
];

export default function ContactPage() {
  usePageTitle("تماس با ما | رژیم من");
  const { openChat, toast } = useSiteUi();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\s+/g, "");
    if (!fullName.trim()) {
      setFormError("لطفاً نام خودت را وارد کن.");
      return;
    }
    if (!/^09\d{9}$/.test(cleanPhone) && !/^[۰-۹]{11}$/.test(cleanPhone)) {
      setFormError("لطفاً شمارهٔ موبایل ۱۱ رقمی معتبر وارد کن.");
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setFormError("لطفاً پیام کوتاهی بنویس.");
      return;
    }

    setFormError("");
    setSubmitted(true);
    toast("درخواستت ثبت شد. به‌زودی با تو تماس می‌گیریم.");
  };

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
            className="mx-auto max-w-xl text-center space-y-2 mb-5 sm:mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#143326]/12 bg-[#F3F7F4] px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-bold text-[#143326]">
              <LottieLineIcon variant="coach" className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>همراهی بدون وقفه</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-normal text-[#14261d] sm:text-5xl">
              پشتیبانی و مشاوره
            </h1>
          </motion.div>

          {/* 2-Column Visual Bento Grid */}
          <motion.div
            variants={staggerGridVariants}
            className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:items-stretch"
          >
            {/* Right Column (RTL): Studio Concierge Visual + Direct Channels */}
            <motion.div
              variants={cardRevealVariants}
              className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-4"
            >
              {/* Studio Character Showcase */}
              <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2.4rem] border border-[#CFE0D5] bg-[#F3F7F4] p-2 sm:p-3 shadow-[0_18px_45px_rgba(20,51,38,0.07)]">
                <div className="relative aspect-[16/9] sm:aspect-[4/3] w-full overflow-hidden rounded-[1.35rem] sm:rounded-[1.9rem] bg-white">
                  <img
                    src="/src/assets/images/contact_concierge_headset_1794961846867.webp"
                    alt="پشتیبانی ۲۴ ساعته و متخصصان رژیم من"
                    width={960}
                    height={717}
                    fetchPriority="high"
                    decoding="sync"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain object-bottom"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] sm:text-xs font-extrabold text-[#143326] shadow-2xs backdrop-blur-md">
                    <Icon name="check" className="h-3.5 w-3.5 text-[#1F5E43]" />
                    <span>پاسخ‌گویی سریع</span>
                  </div>
                </div>
              </div>

              {/* 2 Compact Direct Action Cards */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                {/* Direct Phone Call */}
                <motion.a
                  href="tel:+989056013977"
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="flex flex-col justify-between rounded-[1.4rem] sm:rounded-[1.6rem] border border-[#E6E1D6] bg-[#F7F5F0] p-3.5 sm:p-5 text-right transition-shadow hover:shadow-md"
                >
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-white text-[#143326] shadow-2xs">
                    <Icon name="phone" className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="mt-2.5 sm:mt-4">
                    <div className="text-[10px] sm:text-[11px] font-bold text-[#5c6b63]">تماس مستقیم (۸ تا ۲۰)</div>
                    <div
                      dir="ltr"
                      className="mt-0.5 text-sm sm:text-lg font-extrabold normal-nums tracking-normal text-[#14261d] text-right"
                    >
                      ۰۹۰۵۶۰۱۳۹۷۷
                    </div>
                  </div>
                </motion.a>

                {/* 24/7 Smart Coach Chat */}
                <motion.button
                  type="button"
                  onClick={() => openChat()}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="flex flex-col justify-between rounded-[1.4rem] sm:rounded-[1.6rem] border border-[#EED8CE] bg-[#FAF5F2] p-3.5 sm:p-5 text-right transition-shadow hover:shadow-md cursor-pointer"
                >
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-white text-[#C86446] shadow-2xs">
                    <Icon name="coach24" className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="mt-2.5 sm:mt-4">
                    <div className="text-[10px] sm:text-[11px] font-bold text-[#8a6558]">پاسخ فوری ۲۴ ساعته</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs sm:text-base font-black text-[#C86446]">
                      <span>گفتگوی آنلاین</span>
                      <Icon name="arrow" className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Left Column (RTL): Minimalist Request Form */}
            <motion.section
              variants={cardRevealVariants}
              aria-labelledby="contact-form-title"
              className="lg:col-span-7 flex flex-col justify-between rounded-[1.75rem] sm:rounded-[2.4rem] border border-[#E6E1D6] bg-[#F7F5F0] p-4 sm:p-8 shadow-[0_18px_45px_rgba(20,51,38,0.05)]"
            >
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 id="contact-form-title" className="text-xl sm:text-2xl font-extrabold text-[#14261d]">
                      درخواست مشاورهٔ تلفنی
                    </h2>
                    <p className="mt-1 text-xs font-bold text-[#5c6b63]">
                      شماره‌ات را بگذار تا مشاوران ما با تو تماس بگیرند.
                    </p>
                  </div>
                  <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#143326] shadow-2xs">
                    <Icon name="chat" className="h-5 w-5" />
                  </div>
                </div>

                {submitted ? (
                  <div className="rounded-[1.6rem] border border-[#CFE0D5] bg-[#F3F7F4] p-6 text-right space-y-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#143326] text-white">
                      <Icon name="check" className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#14261d]">
                      درخواستت ثبت شد، {fullName} عزیز!
                    </h3>
                    <p className="text-xs font-bold leading-relaxed text-[#5c6b63]">
                      تیم پشتیبانی در موضوع «{topic}» با شمارهٔ{" "}
                      <span dir="ltr" className="font-extrabold text-[#143326] normal-nums">
                        {phone}
                      </span>{" "}
                      تماس می‌گیرد.
                    </p>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setSubmitted(false);
                        setMessage("");
                      }}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#143326] px-5 py-2.5 text-xs font-bold text-white"
                    >
                      ارسال پیام جدید
                    </motion.button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Topic Selector Pills */}
                    <div>
                      <span className="mb-2 block text-xs font-extrabold text-[#14261d]">
                        موضوع گفتگو
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {TOPICS.map((item) => {
                          const active = topic === item;
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setTopic(item)}
                              className={`min-h-[44px] rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                                active
                                  ? "bg-[#143326] text-white"
                                  : "bg-white text-[#5c6b63] hover:text-[#14261d]"
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="mb-1.5 block text-xs font-extrabold text-[#14261d]"
                        >
                          نام و نام خانوادگی
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="مثلاً: سارا محمدی"
                          className="min-h-[46px] w-full rounded-2xl border border-[#143326]/10 bg-white px-4 py-3 text-base sm:text-xs font-bold text-[#14261d] placeholder:text-[#8c9891] focus:border-[#143326] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="mb-1.5 block text-xs font-extrabold text-[#14261d]"
                        >
                          شمارهٔ موبایل
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          dir="ltr"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="09123456789"
                          className="min-h-[46px] w-full rounded-2xl border border-[#143326]/10 bg-white px-4 py-3 text-left text-base sm:text-xs font-bold text-[#14261d] normal-nums placeholder:text-[#8c9891] focus:border-[#143326] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-1.5 block text-xs font-extrabold text-[#14261d]"
                      >
                        توضیح کوتاه
                      </label>
                      <textarea
                        id="contact-message"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="هدفت یا سؤالت را کوتاه بنویس..."
                        className="w-full rounded-2xl border border-[#143326]/10 bg-white px-4 py-3 text-base sm:text-xs font-bold text-[#14261d] placeholder:text-[#8c9891] focus:border-[#143326] focus:outline-none"
                      />
                    </div>

                    {formError && (
                      <div className="rounded-2xl border border-[#C86446]/30 bg-[#FAF5F2] px-4 py-2.5 text-xs font-bold text-[#C86446]">
                        {formError}
                      </div>
                    )}

                    <div className="pt-1">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 420, damping: 20 }}
                        className="group flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#143326] px-8 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(20,51,38,0.2)] transition-colors hover:bg-[#1F5E43] whitespace-nowrap"
                      >
                        <span>ارسال درخواست</span>
                        <Icon
                          name="arrow"
                          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                        />
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </motion.section>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
