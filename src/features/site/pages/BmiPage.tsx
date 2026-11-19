import { motion } from "motion/react";
import { BmiCalculator } from "../components/BmiCalculator";
import { LottieLineIcon } from "../lottieData";
import {
  itemRevealVariants,
  revealViewport,
  sectionRevealVariants,
} from "../motionVariants";
import { usePageTitle } from "../usePageTitle";

export default function BmiPage() {
  usePageTitle("محاسبه BMI | رژیم من");

  return (
    <div className="bg-white text-[#14261d] overflow-x-clip" dir="rtl">
      <motion.section
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="bg-white pt-5 pb-16 sm:pt-10 sm:pb-24"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
          {/* Ultra-Minimal Header */}
          <motion.div
            variants={itemRevealVariants}
            className="mx-auto max-w-md text-center space-y-2 mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#143326]/12 bg-[#F3F7F4] px-3.5 py-1 text-xs font-bold text-[#143326]">
              <LottieLineIcon variant="target" className="h-4 w-4" />
              <span>آنالیز رایگان</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-normal text-[#14261d] sm:text-4xl">
              محاسبهٔ هوشمند BMI
            </h1>
          </motion.div>

          {/* 3-Step Interactive Calculator Stage */}
          <BmiCalculator />
        </div>
      </motion.section>
    </div>
  );
}
