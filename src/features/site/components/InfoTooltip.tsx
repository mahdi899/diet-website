import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface InfoTooltipProps {
  text: string;
  label?: string;
  align?: "center" | "right" | "left";
  accentClass?: string;
}

export function InfoTooltip({
  text,
  label = "اطلاعات بیشتر",
  align = "left",
  accentClass = "text-[#5c6b63] hover:text-[#143326]",
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  const positionClass =
    align === "right"
      ? "right-0"
      : align === "center"
      ? "left-1/2 -translate-x-1/2"
      : "left-0";

  return (
    <span
      ref={wrapperRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`relative inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#143326]/14 bg-[#F7F5F0] transition-colors hover:border-[#143326]/35 hover:bg-white focus:outline-none cursor-help before:content-[''] before:absolute before:-inset-3 ${accentClass}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.85}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 16v-4.5" />
          <path d="M12 8h.01" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 440, damping: 26 }}
            className={`pointer-events-none absolute bottom-full mb-2 z-40 w-52 sm:w-60 rounded-2xl border border-white/12 bg-[#143326] px-3.5 py-2.5 text-right text-[11px] font-bold leading-relaxed text-white shadow-[0_14px_32px_rgba(20,51,38,0.28)] ${positionClass}`}
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
