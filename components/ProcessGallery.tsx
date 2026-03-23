"use client";

/**
 * BARTAMIAN — ProcessGallery Component
 * ─────────────────────────────────────────────────────────────────────────────
 * "From the Heat" — raw, industrial documentation of the jewelry-making process.
 *
 * Layout: Asymmetric editorial grid.
 *   • Left column: large hero image + pull quote
 *   • Right column: stacked step cards (numbered, caption, image thumbnail)
 *   • Full-bleed divider section with molten gold stat bar
 *
 * Motion: Each element reveals on scroll via useInView with staggered delays.
 */

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import type { ProcessStep, Stat } from "@/lib/types";
import { getGoldSpotPrice } from "@/app/api/actions/get-gold-spot";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "The Alloy",
    caption:
      "Raw 24k grain is weighed to the milligram and alloyed under 1064°C in a silicon-carbide crucible. No compromises in composition.",
    imageSrc: "/images/process/alloy.webp",
    imageAlt: "Molten gold being poured into a crucible",
  },
  {
    number: "02",
    title: "The Cast",
    caption:
      "Lost-wax centrifugal casting locks every contour of the master model into metal with zero deformation tolerance.",
    imageSrc: "/images/process/cast.webp",
    imageAlt: "Centrifugal casting machine spinning at the forge",
  },
  {
    number: "03",
    title: "The Hand",
    caption:
      "Each piece is filed, hammered, and chased by a single artisan. Machines measure. Hands decide.",
    imageSrc: "/images/process/hand.webp",
    imageAlt: "Artisan's hands working gold with a chasing hammer",
  },
  {
    number: "04",
    title: "The Finish",
    caption:
      "Polishing wheels, burnishers, and 72-hour ultrasonic baths bring the surface to mirror or brushed specification.",
    imageSrc: "/images/process/finish.webp",
    imageAlt: "Gold ring being polished on a lathe wheel",
  },
];

const STATS: Stat[] = [
  { value: "24K", label: "Maximum Purity" },
  { value: "1064°", label: "Melting Point" },
  { value: "72h", label: "Finishing Cycle" },
  { value: "0.01g", label: "Weight Tolerance" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="
      font-mono text-[10px] tracking-ultrawide uppercase
      text-gold opacity-80
    ">
      {children}
    </p>
  );
}

function StepCard({ step, index }: { step: ProcessStep; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="
        group
        relative flex gap-5
        border-b border-gold-subtle
        pb-7 last:border-0 last:pb-0
      "
    >
      {/* Step number */}
      <div className="
        flex-shrink-0
        w-9 h-9
        border border-gold/25
        flex items-center justify-center
      ">
        <span className="font-mono text-[10px] text-gold tracking-widest">
          {step.number}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="
          font-spectral font-semibold italic
          text-lg text-ivory
          mb-1.5
          group-hover:text-gold
          transition-colors duration-300
        ">
          {step.title}
        </h3>
        <p className="font-geist font-light text-md text-ash leading-relaxed">
          {step.caption}
        </p>
      </div>

      {/* Thumbnail */}
      <div className="
        flex-shrink-0 relative
        w-20 h-20 sm:w-24 sm:h-24
        overflow-hidden
        border border-gold-subtle
        group-hover:border-gold/40
        transition-colors duration-300
      ">
        <Image
          src={step.imageSrc}
          alt={step.imageAlt}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          sizes="96px"
        />
        {/* Gold tint overlay on hover */}
        <div className="
          absolute inset-0
          bg-gold/0 group-hover:bg-gold/10
          transition-colors duration-500
        " />
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProcessGallery() {
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const isHeroInView = useInView(heroImageRef, { once: true, margin: "-100px" });
  const areStatsInView = useInView(statsRef, { once: true, margin: "-60px" });

  useEffect(() => {
    getGoldSpotPrice()
      .then(setGoldPrice)
      .catch((err) => console.error("Error fetching gold spot:", err));
  }, []);

  // Parallax for the hero image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const heroImgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  // Combine static stats with live gold price
  const displayStats = [
    ...STATS,
    ...(goldPrice ? [{ value: `$${goldPrice.toLocaleString()}`, label: "Live Gold Spot (oz)" }] : []),
  ];

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-label="From the Heat — The BARTAMIAN Process"
      className="relative bg-obsidian overflow-hidden"
    >
      {/* ── Section Header ──────────────────────────────────────────────────── */}
      <div className="
        max-w-8xl mx-auto
        px-6 sm:px-10 lg:px-16
        pt-28 pb-16
        border-b border-gold-subtle
      ">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <SectionLabel>The Process · From Ore to Object</SectionLabel>
            <h2 className="
              font-spectral font-bold italic
              text-headline text-ivory
              tracking-tight mt-3
            ">
              From the Heat
            </h2>
          </div>
          <p className="
            font-geist font-light
            text-md text-ash
            max-w-xs leading-relaxed
            sm:text-right
          ">
            Every BARTAMIAN piece begins the same way — inside a furnace reaching
            temperatures that would unmake lesser ambitions.
          </p>
        </div>
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────────────── */}
      <div className="
        max-w-8xl mx-auto
        px-6 sm:px-10 lg:px-16
        py-16
        grid grid-cols-1 lg:grid-cols-2
        gap-12 lg:gap-20
        items-start
      ">
        {/* Left — Hero image + pull quote */}
        <div ref={heroImageRef} className="relative">
          {/* Main hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="
              relative aspect-3/4
              overflow-hidden
              border border-gold-subtle
            "
          >
            <motion.div
              style={{ y: heroImgY }}
              className="absolute inset-[-5%] will-change-transform"
            >
              <Image
                src="/images/process/hero-forge.webp"
                alt="Artisan at the forge — molten gold being handled"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </motion.div>

            {/* Gold overlay gradient */}
            <div className="
              absolute inset-0
              bg-linear-to-t from-obsidian/80 via-transparent to-transparent
            " />

            {/* Corner marks */}
            {(["tl", "tr", "bl", "br"] as const).map((c) => (
              <motion.div
                key={c}
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ delay: 1, duration: 0.8 }}
                className={`
                  absolute w-4 h-4
                  border-gold/50
                  ${c === "tl" ? "top-4 left-4 border-t border-l" : ""}
                  ${c === "tr" ? "top-4 right-4 border-t border-r" : ""}
                  ${c === "bl" ? "bottom-4 left-4 border-b border-l" : ""}
                  ${c === "br" ? "bottom-4 right-4 border-b border-r" : ""}
                `}
              />
            ))}
          </motion.div>

          {/* Pull quote */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="
              mt-8
              pl-5
              border-l-2 border-gold/50
            "
          >
            <p className="
              font-spectral italic font-light
              text-lg sm:text-xl
              text-ivory/90
              leading-snug
            ">
              "We do not make jewelry. We forge sovereignty — one gram at a time."
            </p>
            <footer className="mt-3">
              <cite className="
                font-mono not-italic
                text-[10px] tracking-vault uppercase text-gold opacity-70
              ">
                — Hovaness Bartamian, Master Goldsmith
              </cite>
            </footer>
          </motion.blockquote>
        </div>

        {/* Right — Process step cards */}
        <div className="flex flex-col gap-7 lg:pt-4">
          <SectionLabel>Four Stages · No Shortcuts</SectionLabel>

          <div className="flex flex-col gap-7">
            {STEPS.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Bar ───────────────────────────────────────────────────────── */}
      <div
        ref={statsRef}
        className="
          border-t border-gold-subtle
          bg-obsidian-200/60
          backdrop-blur-sm
        "
      >
        <div className="
          max-w-8xl mx-auto
          px-6 sm:px-10 lg:px-16
          py-12
          grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5
          gap-8
        ">
          {displayStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={areStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-center"
            >
              <p className="
                font-spectral italic font-bold
                text-3xl sm:text-4xl
                text-transparent bg-clip-text bg-gold-linear
                bg-[length:200%_auto]
              ">
                {stat.value}
              </p>
              <p className="
                font-mono text-[9px] sm:text-[10px]
                tracking-vault uppercase text-ash mt-2
              ">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
