"use client";

import { useEffect, useRef } from "react";
import { motion, MotionValue } from "framer-motion";

interface HeroBackgroundProps {
  videoSrc: string;
  posterSrc: string;
  videoY: MotionValue<number>;
  overlayOpacity: MotionValue<number>;
}

export default function HeroBackground({ videoSrc, posterSrc, videoY, overlayOpacity }: HeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure video plays silently on mobile (autoplay policy)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.play().catch(() => {/* autoplay blocked — poster remains visible */});
  }, []);

  return (
    <>
      {/* ── Video Layer ────────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: videoY }}
        className="absolute inset-0 will-change-transform"
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover object-center scale-[1.08]"
          aria-hidden="true"
        >
          <source src={videoSrc.replace(".webm", ".mp4")} type="video/mp4" />
        </video>
      </motion.div>

      {/* ── Static Overlay Stack ───────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-obsidian/55" />
        <div className="absolute inset-0 bg-edge-vignette" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-obsidian via-obsidian/80 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-obsidian/60 to-transparent" />
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-obsidian" />
      </div>

      {/* ── Forge Glow — atmospheric bottom light ──────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-72 bg-gradient-radial rounded-full blur-[80px] opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(255,106,0,0.45) 0%, rgba(201,146,42,0.2) 50%, transparent 80%)" }}
      />
    </>
  );
}
