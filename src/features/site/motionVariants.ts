import type { Variants } from "motion/react";

export const revealViewport = {
  once: true,
  amount: 0.15,
  margin: "0px 0px -36px 0px",
} as const;

export const sectionRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.56,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
};

export const staggerGridVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

export const itemRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const cardRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 310,
      damping: 26,
    },
  },
};
