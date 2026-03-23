import { useEffect, useState } from "react";
import { motion, MotionValue } from "framer-motion";
import { CONTAINER_VARIANTS, FADE_UP, REVEAL_LINE, LETTER_SHIMMER } from "./animations";

interface HeroTypographyProps {
  textY: MotionValue<number>;
  isInView: boolean;
  brandName: string;
  slogan: string;
  ctaHref: string;
  ctaLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}

export default function HeroTypography({
  textY, isInView, brandName, slogan, ctaHref, ctaLabel, secondaryHref, secondaryLabel
}: HeroTypographyProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.div
      style={{ y: isMobile ? 0 : textY }}
      className="relative z-10 flex flex-col items-center text-center px-6 sm:px-10 will-change-transform"
    >
      <motion.div
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-col items-center gap-6 sm:gap-8"
      >
        <motion.p variants={FADE_UP} className="font-mono text-[10px] sm:text-[11px] tracking-ultrawide text-gold uppercase opacity-80">
          Atelier · Est. MMXVIII · Pure Gold
        </motion.p>

        <motion.div variants={FADE_UP} className="w-px h-10 bg-linear-to-b from-transparent via-gold/50 to-transparent" aria-hidden="true" />

        <motion.div variants={LETTER_SHIMMER} className="overflow-hidden">
          <motion.h1 className="font-spectral font-bold text-5xl sm:text-display tracking-sovereign uppercase leading-none select-none bg-clip-text text-transparent bg-gold-linear bg-[length:200%_auto] animate-shimmer">
            {brandName}
          </motion.h1>
        </motion.div>

        <motion.div variants={REVEAL_LINE} className="w-64 sm:w-80 h-px bg-linear-to-r from-transparent via-gold to-transparent shadow-gold-sm" aria-hidden="true" />

        <motion.p variants={FADE_UP} className="font-geist font-light text-[10px] sm:text-[12px] md:text-[13px] tracking-ultrawide text-ash uppercase max-w-sm sm:max-w-none">
          {slogan}
        </motion.p>

        <motion.div variants={FADE_UP} className="w-px h-6 bg-linear-to-b from-transparent via-gold/20 to-transparent" aria-hidden="true" />

        <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-6 sm:mt-2">
          {/* Primary CTA */}
          <a
            href={ctaHref}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 sm:py-3.5 font-geist font-medium text-[11px] tracking-vault uppercase text-obsidian bg-gold-linear bg-[length:200%_auto] hover:animate-shimmer transition-shadow duration-300 shadow-gold-sm hover:shadow-gold-md before:absolute before:inset-0 before:border before:border-gold-bright/30"
          >
            <span>{ctaLabel}</span>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
              <path d="M1 5h12M8 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {/* Divider dot */}
          <span className="hidden sm:block w-1 h-1 rounded-full bg-gold/30" aria-hidden="true" />

          {/* Secondary CTA */}
          <a
            href={secondaryHref}
            className="group inline-flex items-center gap-2 px-6 py-3 sm:px-0 sm:py-0 font-geist font-light text-[11px] tracking-vault uppercase text-ash hover:text-ivory transition-colors duration-300 border-b border-transparent hover:border-gold/40 pb-0.5"
          >
            {secondaryLabel}
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
