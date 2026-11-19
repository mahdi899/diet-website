import { motion } from "motion/react";

interface LottieIconProps {
  variant: "coach" | "target" | "spark";
  className?: string;
}

/**
 * Razor-sharp Minimalist Line-Art Animated Icons (Coach 24/7 Headset + Live Wave, Target Check, Spark)
 * Built with animated vector paths so they never blur, clip, or look like a generic spinner at any size.
 */
export function LottieLineIcon({ variant, className = "h-6 w-6" }: LottieIconProps) {
  if (variant === "coach") {
    return (
      <motion.div
        whileHover={{ scale: 1.14, rotate: -6 }}
        transition={{ type: "spring", stiffness: 380, damping: 16 }}
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full"
        >
          {/* Headset Band */}
          <path d="M4 12a8 8 0 0 1 16 0" />
          {/* Right & Left Earcups */}
          <rect x="3" y="11.5" width="3.5" height="6" rx="1.75" />
          <rect x="17.5" y="11.5" width="3.5" height="6" rx="1.75" />
          {/* Microphone Boom */}
          <path d="M19 17.5v1a2.5 2.5 0 0 1-2.5 2.5H13" />
          {/* Animated Live Audio Wave Bars in Center */}
          <motion.path
            d="M9.5 13v2"
            stroke="#C86446"
            animate={{ scaleY: [0.6, 1.45, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "9.5px 14px" }}
          />
          <motion.path
            d="M12 11.5v5"
            stroke="#C86446"
            animate={{ scaleY: [1.2, 0.55, 1.2] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            style={{ transformOrigin: "12px 14px" }}
          />
          <motion.path
            d="M14.5 13v2"
            stroke="#C86446"
            animate={{ scaleY: [0.65, 1.4, 0.65] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            style={{ transformOrigin: "14.5px 14px" }}
          />
        </svg>
      </motion.div>
    );
  }

  if (variant === "spark") {
    return (
      <motion.div
        whileHover={{ scale: 1.16, rotate: 15 }}
        transition={{ type: "spring", stiffness: 360, damping: 15 }}
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full"
        >
          <motion.path
            d="M12 3l2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3Z"
            animate={{ scale: [0.92, 1.06, 0.92], rotate: [0, 6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "12px 12px" }}
          />
          <circle cx="12" cy="12" r="1.5" fill="#C86446" stroke="none" />
        </svg>
      </motion.div>
    );
  }

  // variant === "target"
  return (
    <motion.div
      whileHover={{ scale: 1.14, rotate: 8 }}
      transition={{ type: "spring", stiffness: 380, damping: 16 }}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-full w-full"
      >
        <circle cx="12" cy="12" r="9" />
        <motion.circle
          cx="12"
          cy="12"
          r="5.5"
          stroke="#C86446"
          strokeDasharray="6 3"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "12px 12px" }}
        />
        <motion.path
          d="M9.6 12.2l1.7 1.7 3.3-3.5"
          stroke="#1F5E43"
          strokeWidth={2}
          animate={{ scale: [0.95, 1.08, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "12px 12px" }}
        />
      </svg>
    </motion.div>
  );
}
