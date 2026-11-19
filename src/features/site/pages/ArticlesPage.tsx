import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "../icons";
import { LottieLineIcon } from "../lottieData";
import { ArticleCard, articlePhoto, useMagazine } from "../magazine";
import {
  ArticleGridSkeleton,
  FeaturedArticleSkeleton,
  ShimmerBlock,
} from "../components/Skeletons";
import {
  cardRevealVariants,
  itemRevealVariants,
  revealViewport,
  sectionRevealVariants,
  staggerGridVariants,
} from "../motionVariants";
import { usePageTitle } from "../usePageTitle";

const MotionLink = motion.create(Link);

export default function ArticlesPage() {
  usePageTitle("مقالات | رژیم من");
  const query = useMagazine();
  const [selectedCategory, setSelectedCategory] = useState<string>("همه");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [featuredImgLoaded, setFeaturedImgLoaded] = useState(false);

  const items = query.data ?? [];
  const showSkeleton = query.isLoading && items.length === 0;

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.category)));
    return ["همه", ...unique];
  }, [items]);

  const featuredArticle = items[0];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat = selectedCategory === "همه" || item.category === selectedCategory;
      const q = searchQuery.trim();
      if (!q) return matchesCat;
      const inTitle = item.title.includes(q);
      const inIntro = item.intro.includes(q);
      const inCat = item.category.includes(q);
      return matchesCat && (inTitle || inIntro || inCat);
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="bg-white text-[#14261d] overflow-x-clip" dir="rtl">
      {/* 1. MINIMALIST HEADER + FILTER BAR */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white pt-6 pb-8 sm:pt-10 sm:pb-12"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <motion.div
            variants={itemRevealVariants}
            className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#143326]/12 bg-[#F3F7F4] px-3.5 py-1.5 text-xs font-bold text-[#143326]">
                <LottieLineIcon variant="spark" className="h-5 w-5" />
                <span>نکات کوتاه و کاربردی</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-normal text-[#14261d] sm:text-5xl">
                مجلهٔ تغذیه
              </h1>
            </div>

            {/* Compact Search Input */}
            <label
              className="flex min-h-[46px] w-full md:w-72 items-center gap-2.5 rounded-full border border-[#143326]/14 bg-[#F7F5F0] px-4 py-2 text-sm text-[#14261d] focus-within:border-[#143326]"
              aria-label="جست‌وجو در مقالات"
            >
              <Icon name="search" className="h-4 w-4 shrink-0 text-[#5c6b63]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جست‌وجوی موضوع..."
                className="w-full bg-transparent text-base sm:text-xs font-bold text-[#14261d] placeholder:text-[#5c6b63] focus:outline-none"
              />
            </label>
          </motion.div>

          {/* Category Filter Pills (or Skeleton Pills while loading) */}
          <motion.div
            variants={itemRevealVariants}
            className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar"
            role="tablist"
            aria-label="دسته‌بندی مقالات"
          >
            {showSkeleton
              ? Array.from({ length: 5 }).map((_, i) => (
                  <ShimmerBlock key={i} className="h-11 w-24 shrink-0 rounded-full" />
                ))
              : categories.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <motion.button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedCategory(cat)}
                      className={`min-h-[44px] rounded-full px-4 py-2 text-xs font-extrabold transition-colors whitespace-nowrap ${
                        active
                          ? "bg-[#143326] text-white shadow-[0_8px_20px_rgba(20,51,38,0.18)]"
                          : "border border-[#143326]/10 bg-[#F7F5F0] text-[#5c6b63] hover:bg-[#EFECE4] hover:text-[#14261d]"
                      }`}
                    >
                      {cat}
                    </motion.button>
                  );
                })}
          </motion.div>
        </div>
      </motion.section>

      {/* 2. FEATURED VISUAL CARD OR SKELETON */}
      {selectedCategory === "همه" && !searchQuery.trim() && (
        <motion.section
          variants={sectionRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="bg-white pb-8 sm:pb-12"
          aria-label="مقالهٔ برگزیده"
        >
          <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
            <AnimatePresence mode="wait">
              {showSkeleton ? (
                <motion.div
                  key="featured-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <FeaturedArticleSkeleton />
                </motion.div>
              ) : featuredArticle ? (
                <motion.div
                  key="featured-card"
                  variants={cardRevealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={revealViewport}
                  className="group grid items-center gap-5 overflow-hidden rounded-[2rem] sm:rounded-[2.6rem] border border-[#CFE0D5] bg-[#F3F7F4] p-3.5 sm:p-5 lg:grid-cols-12 lg:gap-8"
                >
                  <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-white">
                    {!featuredImgLoaded && (
                      <ShimmerBlock className="absolute inset-0 h-full w-full" />
                    )}
                    <img
                      referrerPolicy="no-referrer"
                      width={960}
                      height={717}
                      decoding="async"
                      src={articlePhoto(featuredArticle.image)}
                      alt={featuredArticle.title}
                      onLoad={() => setFeaturedImgLoaded(true)}
                      className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
                        featuredImgLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-[#C86446] px-3.5 py-1.5 text-[11px] font-extrabold text-white shadow-sm">
                      <Icon name="spark" className="h-3.5 w-3.5" />
                      <span>مطلب برگزیده</span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4 px-2 py-2 sm:px-4">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#1F5E43]">
                      <span className="rounded-full bg-white px-3 py-1">
                        {featuredArticle.category}
                      </span>
                      {featuredArticle.time ? (
                        <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[#5c6b63] normal-nums">
                          <Icon name="clock" className="h-3.5 w-3.5 text-[#143326]" />
                          {Number(featuredArticle.time).toLocaleString("fa-IR")} دقیقه
                        </span>
                      ) : null}
                    </div>

                    <h2 className="text-xl sm:text-3xl font-extrabold leading-snug text-[#14261d]">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#5c6b63] line-clamp-2">
                      {String(featuredArticle.intro || "").split("\n")[0]}
                    </p>

                    <div className="pt-1">
                      <MotionLink
                        to={"/article?id=" + encodeURIComponent(featuredArticle.id)}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 420, damping: 20 }}
                        className="group/btn inline-flex items-center gap-2.5 rounded-full bg-[#143326] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_12px_26px_rgba(20,51,38,0.18)] transition-colors hover:bg-[#1F5E43] whitespace-nowrap"
                      >
                        <span>مطالعهٔ مقاله</span>
                        <Icon
                          name="arrow"
                          className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-x-1"
                        />
                      </MotionLink>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.section>
      )}

      {/* 3. ARTICLES BENTO GRID OR SKELETON GRID */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white pb-12 sm:pb-16"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <AnimatePresence mode="wait">
            {showSkeleton ? (
              <motion.div
                key="articles-grid-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <ArticleGridSkeleton count={6} />
              </motion.div>
            ) : query.isError ? (
              <motion.div
                key="articles-error"
                variants={itemRevealVariants}
                initial="hidden"
                animate="visible"
                className="rounded-3xl border border-[#E6E1D6] bg-[#FAF5F2] p-8 text-center text-sm font-bold text-[#C86446]"
              >
                دریافت مقالات ممکن نشد.
              </motion.div>
            ) : filteredItems.length === 0 ? (
              <motion.div
                key="articles-empty"
                variants={itemRevealVariants}
                initial="hidden"
                animate="visible"
                className="rounded-[2rem] border border-[#E6E1D6] bg-[#F7F5F0] p-8 text-center"
              >
                <p className="m-0 text-sm font-black text-[#14261d]">
                  مقاله‌ای با این عبارت پیدا نشد.
                </p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelectedCategory("همه");
                    setSearchQuery("");
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#143326] px-5 py-2.5 text-xs font-bold text-white"
                >
                  نمایش همهٔ مقاله‌ها
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="articles-grid"
                layout
                id="article-grid"
                variants={staggerGridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={revealViewport}
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredItems.map((item) => (
                  <ArticleCard key={item.id} item={item} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* 4. MINIMALIST BOTTOM CTA */}
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white pb-16 sm:pb-24"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          <motion.div
            variants={cardRevealVariants}
            className="flex flex-col items-center justify-between gap-5 rounded-[2.2rem] sm:rounded-[2.6rem] border border-[#CFE0D5] bg-[#F3F7F4] px-6 py-8 sm:px-10 sm:py-10 text-center sm:flex-row sm:text-right"
          >
            <div>
              <span className="text-xs font-extrabold text-[#1F5E43]">برنامهٔ ۱۰۰٪ شخصی</span>
              <h2 className="mt-1 text-xl sm:text-3xl font-extrabold text-[#14261d]">
                برنامهٔ غذایی اختصاصی خودت را بساز
              </h2>
            </div>

            <MotionLink
              to="/onboarding"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#143326] px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(20,51,38,0.2)] transition-colors hover:bg-[#1F5E43] whitespace-nowrap"
            >
              <span>دریافت رژیم</span>
              <Icon
                name="arrow"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              />
            </MotionLink>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
