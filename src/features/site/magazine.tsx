import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Icon } from "./icons";
import { ShimmerBlock } from "./components/Skeletons";
import { cardRevealVariants, revealViewport } from "./motionVariants";

const MotionLink = motion.create(Link);

export interface ArticleSection {
  heading: string;
  body: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  image: number;
  time?: number | string;
  intro: string;
  sections?: ArticleSection[];
}

const studioPhotos = [
  "/src/assets/images/magazine_clinical_nutrition_1794962111617.webp",
  "/src/assets/images/hero_persian_healthy_bowl_1794952764202.webp",
  "/src/assets/images/magazine_hydration_wellness_1794962108355.webp",
  "/src/assets/images/goal_weight_loss_dish_1794952765851.webp",
  "/src/assets/images/bmi_result_ideal_fitness_1794962103381.webp",
  "/src/assets/images/goal_muscle_gain_plate_1794952767396.webp",
];

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isArticleSlug(slug: string) {
  return slugPattern.test(slug);
}

export function articlePhoto(index: number) {
  return studioPhotos[index % studioPhotos.length] ?? studioPhotos[0];
}

export async function loadMagazine(): Promise<ArticleItem[]> {
  const response = await fetch("/magazine.json");
  if (!response.ok) throw new Error("دریافت مقالات ممکن نشد.");
  const body = (await response.json()) as { items?: ArticleItem[] };
  return body.items ?? [];
}

export function useMagazine() {
  return useQuery({ queryKey: ["magazine"], queryFn: loadMagazine, staleTime: 60_000 });
}

export async function loadArticle(slug: string): Promise<ArticleItem> {
  const items = await loadMagazine();
  const found = items.find((item) => item.id === slug);
  if (found) return found;
  throw new Error("مقاله پیدا نشد.");
}

export function emphasize(text: string): ReactNode[] {
  return text.split(/«([^»]+)»/).map((part, index) =>
    index % 2 === 1 ? <strong key={index}>«{part}»</strong> : part
  );
}

export function ArticleParagraphs({
  text,
  className = "article-para",
}: {
  text: string;
  className?: string;
}) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  return paragraphs.map((paragraph, index) => (
    <p key={index} className={className}>
      {emphasize(paragraph)}
    </p>
  ));
}

export function ArticleCard({
  item,
  showIntro = false,
}: {
  item: ArticleItem;
  showIntro?: boolean;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <MotionLink
      to={"/article?id=" + encodeURIComponent(item.id)}
      variants={cardRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[#E6E1D6] bg-[#F7F5F0] p-3 transition-shadow duration-300 hover:border-[#143326]/20 hover:shadow-[0_22px_50px_rgba(20,51,38,0.1)]"
    >
      <div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-white">
          {!imgLoaded && <ShimmerBlock className="absolute inset-0 h-full w-full" />}
          <img
            loading="lazy"
            decoding="async"
            width={960}
            height={717}
            referrerPolicy="no-referrer"
            src={articlePhoto(item.image)}
            alt={item.title}
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-106 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold text-[#143326] shadow-2xs backdrop-blur-md">
            {item.category}
          </div>
          {item.time ? (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-[#143326]/88 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md normal-nums">
              <Icon name="clock" className="h-3 w-3" />
              <span>{Number(item.time).toLocaleString("fa-IR")} دقیقه</span>
            </div>
          ) : null}
        </div>

        <div className="px-2.5 pt-4 pb-2">
          <h3 className="text-base sm:text-lg font-extrabold leading-snug text-[#14261d] transition-colors group-hover:text-[#1F5E43] line-clamp-2">
            {item.title}
          </h3>
          {showIntro ? (
            <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#5c6b63] line-clamp-1">
              {String(item.intro || "").split("\n")[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-[#143326]/8 px-2.5 pt-3 pb-1 text-xs font-extrabold text-[#143326]">
        <span>مطالعه</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#143326] transition-colors group-hover:bg-[#143326] group-hover:text-white">
          <Icon name="arrow" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        </span>
      </div>
    </MotionLink>
  );
}
