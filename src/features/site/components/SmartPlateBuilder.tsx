import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Icon } from "../icons";
import { LottieLineIcon } from "../lottieData";
import {
  ORBIT_FOODS_100,
  ORBIT_RINGS_CONFIG,
  SMART_PLATE_FILTERS,
  getCategoryRadialTheme,
  toPersianDigits,
  type FilterGroupId,
} from "./smartPlateData";

const MotionLink = motion.create(Link);

export function SmartPlateBuilder() {
  const [activeFilter, setActiveFilter] = useState<FilterGroupId>("all");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scanningIndex, setScanningIndex] = useState<number | null>(null);
  const [isSmartSelecting, setIsSmartSelecting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [centerImageLoaded, setCenterImageLoaded] = useState(false);
  const timersRef = useRef<number[]>([]);

  const clearScanTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    const readyTid = window.setTimeout(() => {
      setIsReady(true);
    }, 320);
    return () => {
      window.clearTimeout(readyTid);
      clearScanTimers();
    };
  }, [clearScanTimers]);

  const currentFilterObj = useMemo(
    () => SMART_PLATE_FILTERS.find((f) => f.id === activeFilter) ?? SMART_PLATE_FILTERS[0],
    [activeFilter]
  );

  const selectedFood = useMemo(
    () => ORBIT_FOODS_100[selectedIndex] ?? ORBIT_FOODS_100[0],
    [selectedIndex]
  );

  useEffect(() => {
    setCenterImageLoaded(false);
    const img = new Image();
    img.src = selectedFood.image;
    if (img.complete) {
      setCenterImageLoaded(true);
    } else {
      img.onload = () => setCenterImageLoaded(true);
      img.onerror = () => setCenterImageLoaded(true);
    }
  }, [selectedFood.image]);

  const radialTheme = useMemo(
    () => getCategoryRadialTheme(selectedFood.category),
    [selectedFood.category]
  );

  // "Smart Selection" Animation across the 100 orbiting circles filtered by category
  const runSmartSelection = useCallback(
    (targetFilterId: FilterGroupId = activeFilter) => {
      clearScanTimers();
      setIsSmartSelecting(true);

      const filterDef =
        SMART_PLATE_FILTERS.find((f) => f.id === targetFilterId) ?? SMART_PLATE_FILTERS[0];
      const pool = ORBIT_FOODS_100.filter((item) => filterDef.matches(item.category));
      const candidates = pool.filter((item) => item.index !== selectedIndex);
      const safePool = candidates.length > 0 ? candidates : ORBIT_FOODS_100;

      const hops = 7;
      for (let step = 0; step < hops; step++) {
        const delay = step * 60;
        const tid = window.setTimeout(() => {
          const hopItem = safePool[Math.floor(Math.random() * safePool.length)];
          setScanningIndex(hopItem.index);
        }, delay);
        timersRef.current.push(tid);
      }

      const finalTid = window.setTimeout(() => {
        const winner = safePool[Math.floor(Math.random() * safePool.length)];
        setScanningIndex(null);
        setSelectedIndex(winner.index);
        setIsSmartSelecting(false);
      }, hops * 60 + 35);
      timersRef.current.push(finalTid);
    },
    [activeFilter, clearScanTimers, selectedIndex]
  );

  const handleFilterClick = (filterId: FilterGroupId) => {
    setActiveFilter(filterId);
    runSmartSelection(filterId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-[1.85rem] sm:rounded-[2.6rem] border border-[#E5D3C3] bg-[#FBF4EC] p-4 sm:p-7 md:p-9 shadow-[0_20px_50px_rgba(180,120,85,0.08)] [contain:content]"
    >
      {/* Ambient Warm Background Wash across the unified card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#F3DFCE]/65 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#F5E4D4]/75 blur-3xl"
      />

      {/* CLEAN HEADER: Title + Category Filter Tabs (including Budget Foods) + Smart Selection Button */}
      <div className="relative z-10 flex flex-col gap-3 border-b border-[#E6D5C5]/75 pb-3.5 sm:flex-row sm:items-center sm:justify-between sm:pb-4">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl border border-[#E2CEBC] bg-[#F4E7DA] text-[#C86446]">
              <LottieLineIcon variant="target" className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-base font-extrabold text-[#14261d] sm:text-2xl whitespace-nowrap">
              بشقاب هوشمند
            </h3>
          </div>

          {/* Mobile Smart Selection CTA */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => runSmartSelection(activeFilter)}
            disabled={!isReady}
            className="sm:hidden inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#C86446] px-3.5 py-2 text-xs font-bold text-white shadow-[0_10px_22px_rgba(200,100,70,0.24)] transition-colors hover:bg-[#B55437] disabled:opacity-60 cursor-pointer whitespace-nowrap"
          >
            <Icon
              name="spark"
              className={`h-3.5 w-3.5 ${isSmartSelecting ? "animate-spin" : ""}`}
            />
            <span>انتخاب هوشمند</span>
          </motion.button>
        </div>

        {/* Category Filter Tabs (همه، اقتصادی و فوری، پلو و خورش، کباب و دریایی) + Desktop Smart Selection */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div
            role="tablist"
            aria-label="فیلتر دسته‌بندی غذاهای بشقاب هوشمند"
            className="grid w-full sm:w-auto grid-cols-4 gap-1 rounded-full border border-[#E2CEBC] bg-[#F4E7DA]/85 p-1"
          >
            {SMART_PLATE_FILTERS.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleFilterClick(f.id)}
                  className={`min-h-[34px] sm:min-h-[36px] rounded-full px-1.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap text-center ${
                    isActive
                      ? "bg-[#143326] text-white shadow-2xs"
                      : "text-[#6E5A4F] hover:text-[#14261d]"
                  }`}
                >
                  <span className="sm:hidden">{f.mobileLabel}</span>
                  <span className="hidden sm:inline">{f.label}</span>
                </button>
              );
            })}
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => runSmartSelection(activeFilter)}
            disabled={!isReady}
            className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#C86446] px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_22px_rgba(200,100,70,0.24)] transition-colors hover:bg-[#B55437] disabled:opacity-60 cursor-pointer whitespace-nowrap"
          >
            <Icon
              name="spark"
              className={`h-4 w-4 ${isSmartSelecting ? "animate-spin" : ""}`}
            />
            <span>انتخاب هوشمند</span>
          </motion.button>
        </div>
      </div>

      {/* UNIFIED SINGLE-SURFACE STAGE: Right = Orbiting Plate Showcase, Left = Dish Info & Macros */}
      <AnimatePresence mode="wait">
        {!isReady ? (
          <motion.div
            key="smart-plate-skeleton"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            aria-busy="true"
            aria-label="در حال آماده‌سازی بشقاب هوشمند"
            className="relative z-10 mt-4 sm:mt-6 grid items-center gap-5 sm:gap-7 lg:grid-cols-12"
          >
            {/* Orbit Skeleton */}
            <div className="min-w-0 lg:col-span-7">
              <div className="relative mx-auto flex h-[290px] sm:h-[370px] w-full max-w-[540px] items-center justify-center overflow-hidden rounded-[1.6rem] sm:rounded-[2.2rem]">
                {[54, 71, 88, 105].map((diameter, idx) => (
                  <div
                    key={diameter}
                    style={{ width: `${diameter}%` }}
                    className={`pointer-events-none absolute top-1/2 left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border ${
                      idx % 2 === 0
                        ? "border-[#C86446]/16"
                        : "border-dashed border-[#8C6D58]/16"
                    }`}
                  />
                ))}
                <div className="relative flex h-28 w-28 sm:h-44 sm:w-44 items-center justify-center rounded-full border-4 border-white/80 bg-[#F3E4D5] shadow-[0_14px_32px_rgba(140,85,55,0.12)] animate-pulse">
                  <Icon name="bowl" className="h-9 w-9 text-[#C86446]/50" />
                </div>
              </div>
            </div>

            {/* Info & Macro Skeleton */}
            <div className="min-w-0 flex flex-col justify-between gap-4 sm:gap-5 lg:col-span-5 lg:pr-4 lg:border-r lg:border-[#E6D5C5]/80">
              <div className="space-y-2 flex flex-col items-center lg:items-start">
                <div className="h-3.5 w-32 rounded-full bg-[#EFE0D0] animate-pulse" />
                <div className="h-6 w-56 rounded-full bg-[#EAD8C6] animate-pulse" />
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center rounded-2xl bg-[#F4E7DA]/80 px-2 py-3 sm:py-3.5"
                  >
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-4 border-[#E5D2C0] animate-pulse" />
                    <div className="mt-2 h-3 w-12 rounded-full bg-[#E8D5C4] animate-pulse" />
                    <div className="mt-1.5 h-3.5 w-10 rounded-full bg-[#E2CCB8] animate-pulse" />
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-1">
                <div className="h-2 w-full rounded-full bg-[#EAD9C8] animate-pulse" />
                <div className="h-11 sm:h-12 w-full rounded-full bg-[#143326]/20 animate-pulse" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="smart-plate-stage"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mt-4 sm:mt-6 grid items-center gap-5 sm:gap-7 lg:grid-cols-12"
          >
            {/* RIGHT COLUMN (RTL): 4 CONCENTRIC ROTATING ORBITS ON THE SAME WARM CARD SURFACE */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="min-w-0 lg:col-span-7"
            >
              <div className="relative mx-auto h-[290px] sm:h-[370px] w-full max-w-[540px] overflow-hidden rounded-[1.6rem] sm:rounded-[2.2rem] [contain:layout_paint]">
                {/* Soft, Pulsing Radial Gradient Background behind the orbiting animation that changes hue based on central food category */}
                <motion.div
                  aria-hidden="true"
                  animate={{
                    scale: [0.94, 1.12, 0.94],
                    opacity: [0.74, 1, 0.74],
                    background: `radial-gradient(circle at 50% 50%, ${radialTheme.primaryStop} 0%, ${radialTheme.secondaryStop} 44%, ${radialTheme.outerStop} 74%)`,
                  }}
                  transition={{
                    scale: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
                    background: { duration: 0.9, ease: "easeOut" },
                  }}
                  className="pointer-events-none absolute inset-0"
                />

                {/* Subtle Orbital Track Guide Circles */}
                {ORBIT_RINGS_CONFIG.map((ring) => (
                  <div
                    key={`track-${ring.ringIndex}`}
                    aria-hidden="true"
                    style={{
                      width: `${ring.diameterPct}%`,
                    }}
                    className={`pointer-events-none absolute top-1/2 left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border ${
                      ring.ringIndex % 2 === 0
                        ? "border-[#C86446]/18"
                        : "border-dashed border-[#8C6D58]/16"
                    }`}
                  />
                ))}

                {/* Smart Selection Radar Ripple */}
                <AnimatePresence>
                  {isSmartSelecting && (
                    <motion.div
                      key="smart-radar-wave"
                      initial={{ scale: 0.25, opacity: 0.85 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                      className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#C86446] shadow-[0_0_28px_rgba(200,100,70,0.35)]"
                    />
                  )}
                </AnimatePresence>

                {/* 4 CONCENTRIC ROTATING ORBITAL RINGS (100 Circular Food Photos) */}
                {ORBIT_RINGS_CONFIG.map((ring) => {
                  const ringItems = ORBIT_FOODS_100.filter(
                    (item) => item.ringIndex === ring.ringIndex
                  );
                  const spinSpeed = isSmartSelecting ? ring.durationSec * 0.35 : ring.durationSec;
                  const orbitAnimName = ring.direction === "cw" ? "orbit-cw" : "orbit-ccw";
                  const counterSpinName =
                    ring.direction === "cw" ? "counter-spin-ccw" : "counter-spin-cw";

                  return (
                    <div
                      key={`orbit-ring-${ring.ringIndex}`}
                      style={{
                        width: `${ring.diameterPct}%`,
                        animation: `${orbitAnimName} ${spinSpeed}s linear infinite`,
                      }}
                      className="pointer-events-none absolute top-1/2 left-1/2 aspect-square"
                    >
                      {ringItems.map((item) => {
                        const isSelected = item.index === selectedIndex;
                        const isScanningThis = item.index === scanningIndex;
                        const matchesFilter = currentFilterObj.matches(item.category);

                        return (
                          <div
                            key={item.index}
                            style={{
                              top: `${item.yPct}%`,
                              left: `${item.xPct}%`,
                            }}
                            className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
                          >
                            <motion.button
                              type="button"
                              onClick={() => {
                                clearScanTimers();
                                setScanningIndex(null);
                                setIsSmartSelecting(false);
                                setSelectedIndex(item.index);
                              }}
                              title={item.name}
                              aria-label={item.name}
                              initial={{ scale: 0.85, opacity: 0 }}
                              animate={{
                                scale: isScanningThis
                                  ? 1.75
                                  : isSelected
                                  ? 0.2
                                  : matchesFilter
                                  ? 1
                                  : 0.72,
                                opacity: isScanningThis
                                  ? 1
                                  : isSelected
                                  ? 0.1
                                  : matchesFilter
                                  ? 0.95
                                  : 0.28,
                              }}
                              whileHover={{
                                scale: 1.55,
                                opacity: 1,
                                zIndex: 30,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 22,
                              }}
                              style={{
                                animation: `${counterSpinName} ${spinSpeed}s linear infinite`,
                              }}
                              className={`relative block rounded-full p-[1.5px] transition-shadow cursor-pointer ${
                                ring.circleSizeClass
                              } ${
                                isScanningThis
                                  ? "z-30 bg-[#C86446] ring-2 ring-white shadow-[0_0_18px_rgba(200,100,70,0.65)]"
                                  : matchesFilter
                                  ? "bg-white/95 border border-[#D8C2AE] shadow-[0_4px_10px_rgba(120,80,50,0.14)] hover:ring-2 hover:ring-[#C86446]"
                                  : "bg-[#F3E4D5] border border-[#E5D3C3]"
                              }`}
                            >
                              <img
                                src={item.image}
                                alt=""
                                width={64}
                                height={64}
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                className="h-full w-full rounded-full object-cover pointer-events-none"
                              />
                            </motion.button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Soft Radial Center Cushion so the enlarged center plate stands out cleanly */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,244,236,0.55)_0%,rgba(251,244,236,0.18)_32%,transparent_62%)]"
                />

                {/* CENTER SPOTLIGHT: Clean Circular Plate Without Extra Text Chips */}
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={selectedFood.index}
                      initial={{
                        scale: 0.16,
                        opacity: 0,
                        x: selectedFood.launchOffsetX,
                        y: selectedFood.launchOffsetY,
                        rotate: -18,
                      }}
                      animate={{
                        scale: isSmartSelecting ? 0.88 : 1,
                        opacity: isSmartSelecting ? 0.7 : 1,
                        x: 0,
                        y: 0,
                        rotate: 0,
                      }}
                      exit={{
                        scale: 0.16,
                        opacity: 0,
                        rotate: 15,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 290,
                        damping: 23,
                        mass: 0.85,
                      }}
                      className="pointer-events-auto relative flex flex-col items-center"
                    >
                      {/* Subtle Warm Halo tightly hugging the Center Plate */}
                      <motion.div
                        aria-hidden="true"
                        initial={{ scale: 1, opacity: 0.65 }}
                        animate={{
                          scale: [1, 1.045, 1],
                          opacity: [0.65, 0.22, 0.65],
                        }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                        style={{ borderColor: radialTheme.haloBorder }}
                        className="pointer-events-none absolute -inset-1 sm:-inset-2 rounded-full border-[1.5px]"
                      />

                      <motion.button
                        type="button"
                        onClick={() => runSmartSelection(activeFilter)}
                        title={selectedFood.name}
                        aria-label={`بشقاب انتخاب‌شده: ${selectedFood.name} - کلیک برای انتخاب هوشمند بعدی`}
                        whileHover={{
                          scale: 1.07,
                          boxShadow:
                            "0 28px 60px rgba(140, 75, 45, 0.34), 0 0 28px rgba(200, 100, 70, 0.22)",
                        }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 340, damping: 20 }}
                        className="group relative h-28 w-28 sm:h-44 sm:w-44 overflow-hidden rounded-full border-4 border-white bg-white p-1 shadow-[0_18px_42px_rgba(140,85,55,0.22)] cursor-pointer"
                      >
                        {!centerImageLoaded && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-1 flex items-center justify-center rounded-full bg-[#F3E4D5] animate-pulse"
                          >
                            <Icon name="bowl" className="h-7 w-7 text-[#C86446]/45" />
                          </span>
                        )}
                        <img
                          src={selectedFood.image}
                          alt={selectedFood.name}
                          width={640}
                          height={640}
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onLoad={() => setCenterImageLoaded(true)}
                          className={`h-full w-full rounded-full object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:drop-shadow-[0_10px_18px_rgba(120,65,35,0.28)] ${
                            centerImageLoaded ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* LEFT COLUMN (RTL): SEAMLESS TYPOGRAPHY & MACRO BALANCE ON THE SAME WARM CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="min-w-0 flex flex-col justify-between gap-4 sm:gap-5 lg:col-span-5 lg:pr-4 lg:border-r lg:border-[#E6D5C5]/80"
            >
              {/* Selected Dish Name & Clean Unboxed Category Metadata */}
              <div className="space-y-1.5 text-center lg:text-right">
                <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-[#8A5A40]">
                  <span>{selectedFood.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-extrabold text-[#C86446]">
                    {toPersianDigits(selectedFood.kcal)} کالری
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.h4
                    key={selectedFood.name}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.18 }}
                    className="text-base sm:text-xl font-black leading-snug text-[#14261d]"
                  >
                    {selectedFood.name}
                  </motion.h4>
                </AnimatePresence>
              </div>

              {/* 3 Clean Macro Ring Gauges integrated harmoniously on the warm card */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  {
                    key: "protein",
                    label: "پروتئین",
                    grams: selectedFood.proteinG,
                    pct: selectedFood.proteinPct,
                    stroke: "#1F5E43",
                    text: "text-[#1F5E43]",
                  },
                  {
                    key: "carbs",
                    label: "کربوهیدرات",
                    grams: selectedFood.carbsG,
                    pct: selectedFood.carbsPct,
                    stroke: "#C86446",
                    text: "text-[#C86446]",
                  },
                  {
                    key: "fat",
                    label: "چربی سالم",
                    grams: selectedFood.fatG,
                    pct: selectedFood.fatPct,
                    stroke: "#D9822B",
                    text: "text-[#B86818]",
                  },
                ].map((m) => {
                  const radius = 19;
                  const circumference = 2 * Math.PI * radius;
                  const dashOffset = circumference - (m.pct / 100) * circumference;

                  return (
                    <div
                      key={m.key}
                      className="flex flex-col items-center justify-center rounded-2xl bg-[#F4E7DA]/75 px-2 py-3 sm:py-3.5 text-center transition-colors hover:bg-[#EFE0D0]"
                    >
                      <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 46 46">
                          <circle
                            cx="23"
                            cy="23"
                            r={radius}
                            fill="none"
                            stroke="rgba(140,100,75,0.14)"
                            strokeWidth="4"
                          />
                          <motion.circle
                            cx="23"
                            cy="23"
                            r={radius}
                            fill="none"
                            stroke={m.stroke}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: dashOffset }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                          />
                        </svg>
                        <span
                          className={`absolute text-[11px] sm:text-xs font-black tabular-nums ${m.text}`}
                        >
                          {toPersianDigits(m.pct)}٪
                        </span>
                      </div>

                      <span className="mt-1.5 text-[11px] sm:text-xs font-extrabold text-[#14261d]">
                        {m.label}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#14261d] tabular-nums">
                        {toPersianDigits(m.grams)}{" "}
                        <span className="text-[10px] font-bold text-[#6E5A4F]">گرم</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Balanced Macro Bar + Primary Action Button */}
              <div className="space-y-3 pt-1">
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#EAD9C8] gap-0.5">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${selectedFood.proteinPct}%` }}
                    transition={{ duration: 0.45 }}
                    className="h-full rounded-r-full bg-[#1F5E43]"
                  />
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${selectedFood.carbsPct}%` }}
                    transition={{ duration: 0.45 }}
                    className="h-full bg-[#C86446]"
                  />
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${selectedFood.fatPct}%` }}
                    transition={{ duration: 0.45 }}
                    className="h-full rounded-l-full bg-[#D9822B]"
                  />
                </div>

                <MotionLink
                  to="/onboarding"
                  whileHover={{ scale: 1.02, y: -1.5 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 420, damping: 20 }}
                  className="group flex w-full min-h-[44px] sm:min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#143326] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_12px_26px_rgba(20,51,38,0.18)] transition-colors hover:bg-[#1F5E43] whitespace-nowrap"
                >
                  <span>دریافت برنامه غذایی اختصاصی</span>
                  <Icon
                    name="arrow"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:-translate-x-1"
                  />
                </MotionLink>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
