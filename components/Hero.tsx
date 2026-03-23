"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import type { HeroProps } from "@/lib/types";

import HeroBackground from "./hero/HeroBackground";
import HeroTypography from "./hero/HeroTypography";

export default function Hero({
  videoSrc = "/video/forge-loop.webm",
  posterSrc = "/images/hero-poster.webp",
  brandName = "BARTAMIAN",
  slogan = "UNCOMPROMISING & SOVEREIGN",
  ctaHref = "#vault",
  ctaLabel = "Enter the Vault",
  secondaryHref = "#process",
  secondaryLabel = "The Process",
}: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true });

  // ── Parallax ──────────────────────────────────────────────────────────────
  const { scrollY } = useScroll();

  const rawVideoY = useTransform(scrollY, [0, 900], [0, 260]);
  const videoY = useSpring(rawVideoY, { stiffness: 60, damping: 22 });

  const rawTextY = useTransform(scrollY, [0, 600], [0, -80]);
  const textY = useSpring(rawTextY, { stiffness: 60, damping: 22 });

  const rawOverlayOpacity = useTransform(scrollY, [0, 400], [0, 0.55]);
  const overlayOpacity = useSpring(rawOverlayOpacity, { stiffness: 80, damping: 30 });

  const rawScrollCueOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="BARTAMIAN — Hero"
      className="relative flex flex-col sm:block sm:h-screen min-h-[680px] max-h-[1200px] overflow-hidden bg-obsidian"
    >
      {/* ── Background Layer ────────────────────────────────────────────────── */}
      <div className="relative h-[55vh] sm:absolute sm:inset-0 overflow-hidden">
        <HeroBackground
          videoSrc={videoSrc}
          posterSrc={posterSrc}
          videoY={videoY}
          overlayOpacity={overlayOpacity}
        />
      </div>

      {/* ── Typography Layer ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center py-12 sm:absolute sm:inset-0 sm:py-0 pointer-events-none">
        <div className="pointer-events-auto">
          <HeroTypography
            textY={textY}
            isInView={isInView}
            brandName={brandName}
            slogan={slogan}
            ctaHref={ctaHref}
            ctaLabel={ctaLabel}
            secondaryHref={secondaryHref}
            secondaryLabel={secondaryLabel}
          />
        </div>
      </div>

      {/* ── Scroll Cue ─────────────────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: rawScrollCueOpacity }}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <p className="font-mono text-[9px] tracking-ultrawide text-ash/60 uppercase">Scroll</p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-8 bg-linear-to-b from-gold/50 to-transparent"
        />
      </motion.div>

      {/* ── Corner Marks ────────────────────────────────────────────────────── */}
      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((corner) => {
        const positions: Record<string, string> = {
          "top-left": "top-8 left-8",
          "top-right": "top-8 right-8",
          "bottom-left": "bottom-8 left-8",
          "bottom-right": "bottom-8 right-8",
        };
        const borders: Record<string, string> = {
          "top-left": "border-t border-l",
          "top-right": "border-t border-r",
          "bottom-left": "border-b border-l",
          "bottom-right": "border-b border-r",
        };
        return (
          <motion.div
            key={corner}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className={`absolute ${positions[corner]} w-5 h-5 ${borders[corner]} border-gold/30`}
          />
        );
      })}
    </section>
  );
}
