import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Loader2, MessageSquarePlus, Sparkles } from "lucide-react";
import { Icon } from "../icons";
import {
  ArticleCard,
  ArticleParagraphs,
  articlePhoto,
  isArticleSlug,
  loadArticle,
  useMagazine,
} from "../magazine";
import { ArticleDetailSkeleton, ShimmerBlock } from "../components/Skeletons";
import { usePageTitle } from "../usePageTitle";
import { useSiteUi } from "../components/SiteFrame";

const MotionLink = motion.create(Link);

interface AiArticleSummary {
  bullets: string[];
  actionStep: string;
}

export default function ArticlePage() {
  const [params] = useSearchParams();
  const slug = params.get("id") ?? "";
  const validSlug = isArticleSlug(slug);
  const magazine = useMagazine();
  const query = useQuery({
    queryKey: ["article", slug],
    enabled: validSlug,
    queryFn: () => loadArticle(slug),
    staleTime: 60_000,
  });
  const article = query.data;
  const { toast, openChat } = useSiteUi();
  const [progress, setProgress] = useState(0);
  const [largeFont, setLargeFont] = useState(false);
  const [summary, setSummary] = useState<AiArticleSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [coverLoaded, setCoverLoaded] = useState(false);

  usePageTitle(article ? article.title + " | مجلهٔ رژیم من" : "جزئیات مقاله | رژیم من");

  useEffect(() => {
    setSummary(null);
    setSummaryError("");
    setCoverLoaded(false);
  }, [slug]);

  useEffect(() => {
    const content = document.querySelector("#article-content");
    if (!content) return;
    const update = () => {
      const box = content.getBoundingClientRect();
      const value = Math.min(
        1,
        Math.max(0, (100 - box.top) / Math.max(1, box.height - window.innerHeight / 2))
      );
      setProgress(value);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [article?.id]);

  if (!validSlug || query.isError) {
    return (
      <div className="mx-auto max-w-[1220px] px-4 py-16 text-center" dir="rtl">
        <p className="text-base font-bold text-[#14261d]">مقاله پیدا نشد.</p>
        <MotionLink
          to="/articles"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#143326] px-6 py-3 text-xs font-bold text-white"
        >
          بازگشت به مجله
        </MotionLink>
      </div>
    );
  }
  if (query.isLoading || !article) {
    return <ArticleDetailSkeleton />;
  }

  const handleSummarize = async () => {
    if (loadingSummary || summary) return;
    setLoadingSummary(true);
    setSummaryError("");
    try {
      const fullText = [
        article.intro,
        ...(article.sections ?? []).map((s) => `${s.heading}\n${s.body}`),
      ].join("\n\n");
      const res = await fetch("/api/article-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: article.title, content: fullText }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "خطا در خلاصه‌سازی مقاله");
      }
      setSummary(data as AiArticleSummary);
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : "خطا در دریافت خلاصه هوشمند");
    } finally {
      setLoadingSummary(false);
    }
  };

  const related = (magazine.data ?? []).filter((item) => item.id !== article.id).slice(0, 3);

  return (
    <div className="bg-white text-[#14261d]" dir="rtl">
      <div
        className="reading-progress"
        aria-hidden="true"
        style={{ width: progress * 100 + "%" }}
      />

      <div className="mx-auto max-w-[1060px] px-4 pt-6 pb-12 sm:px-8 sm:pt-10">
        {/* Back Link + Category */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-extrabold">
              <span
                id="article-category"
                className="rounded-full bg-[#F3F7F4] px-3.5 py-1.5 text-[#143326]"
              >
                {article.category}
              </span>
              <span
                id="article-time"
                className="flex items-center gap-1 rounded-full bg-[#F7F5F0] px-3 py-1.5 text-[#5c6b63] normal-nums"
              >
                <Icon name="clock" className="h-3.5 w-3.5 text-[#143326]" />
                {Number(article.time ?? 5).toLocaleString("fa-IR")} دقیقه مطالعه
              </span>
            </div>

            <Link
              to="/articles"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-extrabold text-[#143326] hover:text-[#C86446]"
            >
              <span>همهٔ مقاله‌ها</span>
              <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
          </div>

          <h1
            id="article-title"
            className="text-2xl sm:text-4xl font-extrabold leading-snug text-[#14261d]"
          >
            {article.title}
          </h1>

          {/* Compact Reader Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E6E1D6] bg-[#F7F5F0] p-3">
            <div className="flex flex-wrap items-center gap-2">
              <motion.button
                type="button"
                onClick={handleSummarize}
                disabled={loadingSummary}
                whileHover={{ scale: 1.03, y: -1.5 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#143326] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1F5E43] disabled:opacity-50 whitespace-nowrap"
              >
                {loadingSummary ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>در حال خلاصه‌سازی...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{summary ? "خلاصهٔ هوشمند" : "خلاصهٔ ۳۰ ثانیه‌ای"}</span>
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03, y: -1.5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  openChat(
                    `درباره مقاله «${article.title}» سؤال دارم. چطور نکاتش را در برنامه‌ام اجرا کنم؟`
                  )
                }
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[#143326]/12 bg-white px-4 py-2 text-xs font-bold text-[#14261d] transition hover:bg-[#F3F7F4] whitespace-nowrap"
              >
                <MessageSquarePlus className="h-3.5 w-3.5 text-[#C86446]" />
                <span>پرسش از مشاور</span>
              </motion.button>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5c6b63]">
              <span>متن:</span>
              <button
                type="button"
                onClick={() => setLargeFont(false)}
                className={`min-h-[40px] rounded-full px-3.5 py-1.5 font-bold transition ${
                  !largeFont ? "bg-[#143326] text-white" : "bg-white hover:text-[#14261d]"
                }`}
              >
                عادی
              </button>
              <button
                type="button"
                onClick={() => setLargeFont(true)}
                className={`min-h-[40px] rounded-full px-3.5 py-1.5 font-bold transition ${
                  largeFont ? "bg-[#143326] text-white" : "bg-white hover:text-[#14261d]"
                }`}
              >
                درشت
              </button>
            </div>
          </div>

          {summaryError && (
            <div className="rounded-2xl border border-[#C86446]/30 bg-[#FAF5F2] p-3 text-xs font-bold text-[#C86446]">
              {summaryError}
            </div>
          )}

          {summary && (
            <div className="rounded-[1.6rem] border border-[#CFE0D5] bg-[#F3F7F4] p-5 text-right">
              <div className="mb-2 flex items-center gap-2 text-xs font-extrabold text-[#143326]">
                <Sparkles className="h-4 w-4 text-[#C86446]" />
                <span>خلاصهٔ کلیدی مقاله</span>
              </div>
              <ul className="m-0 space-y-1.5 pr-5 text-xs font-medium leading-7 text-[#14261d]">
                {summary.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="mt-3 border-t border-[#143326]/10 pt-2.5 text-xs font-bold text-[#1F5E43]">
                <strong>قدم عملی:</strong> {summary.actionStep}
              </div>
            </div>
          )}

          <div id="article-intro" className="text-sm sm:text-base leading-8 text-[#46564e]">
            <ArticleParagraphs text={article.intro} />
          </div>
        </header>

        {/* Cover Image with Progressive Skeleton */}
        <div className="my-6 overflow-hidden rounded-[2rem] border border-[#143326]/10 bg-[#F7F5F0] p-2">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-white">
            {!coverLoaded && <ShimmerBlock className="h-72 sm:h-96 w-full" />}
            <img
              id="article-cover"
              width={960}
              height={717}
              decoding="async"
              referrerPolicy="no-referrer"
              src={articlePhoto(article.image)}
              alt={article.title}
              onLoad={() => setCoverLoaded(true)}
              className={`max-h-[420px] w-full rounded-[1.5rem] object-cover transition-opacity duration-500 ${
                coverLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
              }`}
            />
          </div>
        </div>

        {/* Reading Layout */}
        <div className="reading-layout">
          <aside className="toc">
            <h3>سرفصل‌ها</h3>
            <div id="toc-links">
              {article.sections?.map((section, index) => (
                <a key={section.heading} href={"#part-" + index}>
                  {section.heading}
                </a>
              ))}
            </div>
          </aside>

          <article
            className="article-body"
            style={largeFont ? { fontSize: "17.5px" } : undefined}
          >
            <div id="article-content">
              {article.sections?.map((section, index) => (
                <div key={section.heading}>
                  <h2 id={"part-" + index}>{section.heading}</h2>
                  <div className="article-section-text">
                    <ArticleParagraphs text={section.body} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E6E1D6] bg-[#F7F5F0] p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#143326] text-white">
                  <Icon name="leaf" className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs font-extrabold text-[#14261d]">تیم علمی رژیم من</div>
                  <div className="text-[11px] font-bold text-[#5c6b63]">بررسی‌شده توسط متخصص تغذیه</div>
                </div>
              </div>
              <motion.button
                id="share"
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  navigator.clipboard.writeText(location.href).then(
                    () => toast("لینک مقاله کپی شد"),
                    () => toast("آدرس مقاله را کپی کن.")
                  );
                }}
                className="min-h-[44px] rounded-full border border-[#143326]/15 bg-white px-4 py-2 text-xs font-bold text-[#143326]"
              >
                کپی لینک
              </motion.button>
            </div>
          </article>
        </div>
      </div>

      {/* Related Articles */}
      <section className="mx-auto max-w-[1220px] px-4 pb-12 sm:px-8 md:px-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#14261d]">مطالب مرتبط</h2>
          <Link
            className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-extrabold text-[#143326]"
            to="/articles"
          >
            <span>همهٔ مقاله‌ها</span>
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" id="related-posts">
          {related.map((item) => (
            <ArticleCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-[1220px] px-4 pb-16 sm:px-8 sm:pb-24 md:px-12">
        <div className="flex flex-col items-center justify-between gap-5 rounded-[2.2rem] bg-[#143326] px-6 py-8 sm:px-10 sm:py-10 text-center text-white sm:flex-row sm:text-right">
          <div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              برنامهٔ اختصاصی خودت را دریافت کن
            </h2>
          </div>
          <MotionLink
            to="/onboarding"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#C86446] px-7 py-3.5 text-sm font-bold text-white shadow-lg whitespace-nowrap"
          >
            <span>دریافت رژیم</span>
            <Icon
              name="arrow"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
            />
          </MotionLink>
        </div>
      </section>
    </div>
  );
}
