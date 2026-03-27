"use client";

import { motion } from "framer-motion";
import { FilterBar } from "./FilterBar";
import type { MetalPurity } from "@/drizzle/schema";

interface VaultHeaderProps {
  headerRef: React.RefObject<HTMLDivElement | null>;
  isHeaderInView: boolean;
  activeFilter: MetalPurity | "all";
  onFilterChange: (filter: MetalPurity | "all") => void;
}

export function VaultHeader({
  headerRef,
  isHeaderInView,
  activeFilter,
  onFilterChange,
}: VaultHeaderProps) {
  return (
    <div
      ref={headerRef}
      className="
        max-w-8xl mx-auto
        px-6 sm:px-10 lg:px-16
        pt-28 pb-12
        border-b border-gold-subtle
      "
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
        {/* Left — heading */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="font-mono text-[10px] tracking-ultrawide uppercase text-gold opacity-80"
          >
            The Vault · Current Collection
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="
              font-spectral font-bold italic
              text-headline text-ivory
              tracking-tight mt-3
            "
          >
            Sovereign Pieces
          </motion.h2>
        </div>

        {/* Right — filter bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeaderInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <FilterBar active={activeFilter} onChange={onFilterChange} />
        </motion.div>
      </div>
    </div>
  );
}
