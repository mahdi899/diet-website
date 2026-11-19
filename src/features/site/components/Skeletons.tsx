import { motion } from "motion/react";

interface ShimmerBlockProps {
  className?: string;
}

export function ShimmerBlock({ className = "" }: ShimmerBlockProps) {
  return (
    <div
      className={`relative overflow-hidden bg-[#EAE6DC]/75 ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/75 to-transparent"
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          repeat: Infinity,
          duration: 1.65,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

export function FeaturedArticleSkeleton() {
  return (
    <div
      role="status"
      aria-label="در حال بارگذاری مطلب برگزیده"
      className="grid items-center gap-5 overflow-hidden rounded-[2rem] sm:rounded-[2.6rem] border border-[#CFE0D5]/70 bg-[#F3F7F4]/70 p-3.5 sm:p-5 lg:grid-cols-12 lg:gap-8"
    >
      <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-white">
        <ShimmerBlock className="h-full w-full" />
        <div className="absolute top-3 right-3 h-7 w-24 rounded-full bg-white/85" />
      </div>

      <div className="lg:col-span-5 space-y-4 px-2 py-2 sm:px-4">
        <div className="flex items-center gap-2">
          <ShimmerBlock className="h-6 w-20 rounded-full" />
          <ShimmerBlock className="h-6 w-16 rounded-full" />
        </div>

        <div className="space-y-2.5">
          <ShimmerBlock className="h-7 w-11/12 rounded-xl" />
          <ShimmerBlock className="h-7 w-3/4 rounded-xl" />
        </div>

        <div className="space-y-2 pt-1">
          <ShimmerBlock className="h-4 w-full rounded-lg" />
          <ShimmerBlock className="h-4 w-4/5 rounded-lg" />
        </div>

        <div className="pt-2">
          <ShimmerBlock className="h-11 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[#E6E1D6] bg-[#F7F5F0] p-3"
    >
      <div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-white">
          <ShimmerBlock className="h-full w-full" />
          <div className="absolute top-3 right-3 h-6 w-16 rounded-full bg-white/85" />
          <div className="absolute bottom-2.5 left-2.5 h-5 w-14 rounded-full bg-white/75" />
        </div>

        <div className="space-y-2.5 px-2.5 pt-4 pb-2">
          <ShimmerBlock className="h-5 w-11/12 rounded-lg" />
          <ShimmerBlock className="h-5 w-2/3 rounded-lg" />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-[#143326]/8 px-2.5 pt-3 pb-1">
        <ShimmerBlock className="h-4 w-14 rounded-md" />
        <ShimmerBlock className="h-7 w-7 rounded-full" />
      </div>
    </div>
  );
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="در حال بارگذاری مقالات"
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ArticleCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="در حال بارگذاری مقاله"
      className="mx-auto max-w-[1060px] px-4 pt-6 pb-16 sm:px-8 sm:pt-10"
      dir="rtl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShimmerBlock className="h-7 w-20 rounded-full" />
            <ShimmerBlock className="h-7 w-24 rounded-full" />
          </div>
          <ShimmerBlock className="h-5 w-24 rounded-full" />
        </div>

        <ShimmerBlock className="h-9 sm:h-11 w-4/5 rounded-2xl" />

        <div className="flex items-center justify-between rounded-2xl border border-[#E6E1D6] bg-[#F7F5F0] p-3">
          <div className="flex items-center gap-2">
            <ShimmerBlock className="h-8 w-32 rounded-full" />
            <ShimmerBlock className="h-8 w-28 rounded-full" />
          </div>
          <ShimmerBlock className="h-7 w-28 rounded-full" />
        </div>

        <div className="space-y-2 pt-2">
          <ShimmerBlock className="h-4 w-full rounded-lg" />
          <ShimmerBlock className="h-4 w-5/6 rounded-lg" />
        </div>
      </div>

      <div className="my-6 overflow-hidden rounded-[2rem] border border-[#143326]/10 bg-[#F7F5F0] p-2">
        <ShimmerBlock className="h-64 sm:h-96 w-full rounded-[1.5rem]" />
      </div>

      <div className="space-y-3 pt-2">
        <ShimmerBlock className="h-6 w-48 rounded-xl" />
        <ShimmerBlock className="h-4 w-full rounded-lg" />
        <ShimmerBlock className="h-4 w-11/12 rounded-lg" />
        <ShimmerBlock className="h-4 w-3/4 rounded-lg" />
      </div>
    </div>
  );
}

export function PricingCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-col justify-between overflow-hidden rounded-[2rem] sm:rounded-[2.4rem] border ${
        featured
          ? "border-2 border-[#C86446]/45 bg-[#FAF5F2]"
          : "border-[#E6E1D6] bg-[#F7F5F0]"
      } p-3 sm:p-4`}
    >
      <div>
        {/* Photo Skeleton */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] sm:rounded-[1.8rem] bg-white">
          <ShimmerBlock className="h-full w-full" />
          <div className="absolute top-3 right-3 h-7 w-20 rounded-full bg-white/90" />
          {featured && (
            <div className="absolute top-3 left-3 h-7 w-20 rounded-full bg-[#C86446]/30" />
          )}
        </div>

        {/* Title + Price Row */}
        <div className="px-3 pt-5 pb-4 flex items-baseline justify-between border-b border-[#143326]/8">
          <div className="space-y-2">
            <ShimmerBlock className="h-6 w-28 rounded-xl" />
            <ShimmerBlock className="h-3.5 w-16 rounded-md" />
          </div>
          <div className="space-y-1.5 text-left">
            <ShimmerBlock className="h-7 w-28 rounded-xl" />
            <ShimmerBlock className="h-3 w-10 rounded-md mr-auto" />
          </div>
        </div>

        {/* 3 Perk Rows */}
        <div className="px-2 py-4 space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-2xl border border-[#143326]/6 bg-white px-3.5 py-2.5"
            >
              <ShimmerBlock className="h-7 w-7 shrink-0 rounded-lg" />
              <ShimmerBlock className="h-4 w-36 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Pill Skeleton */}
      <div className="pt-2 px-1 pb-1">
        <ShimmerBlock className="h-12 sm:h-14 w-full rounded-full" />
      </div>
    </div>
  );
}

export function PricingGridSkeleton() {
  return (
    <div
      role="status"
      aria-label="در حال آماده‌سازی تعرفه‌ها"
      className="grid gap-5 sm:gap-7 lg:grid-cols-3 lg:items-stretch"
    >
      <PricingCardSkeleton />
      <PricingCardSkeleton featured />
      <PricingCardSkeleton />
    </div>
  );
}
