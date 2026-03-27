"use client";

import type { MetalPurity } from "@/drizzle/schema";
import { PURITY_LABELS } from "@/lib/helpers";

export const PURITY_FILTERS: Array<MetalPurity | "all"> = ["all", "14k", "18k", "22k", "24k"];

export function FilterBar({
  active,
  onChange,
}: {
  active: MetalPurity | "all";
  onChange: (f: MetalPurity | "all") => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter by metal purity"
      className="
        flex items-center gap-1 sm:gap-2
        p-1
        border border-gold-subtle
        bg-obsidian-100/60
        backdrop-blur-sm
        overflow-x-auto scrollbar-none
      "
    >
      {PURITY_FILTERS.map((f) => {
        const isActive = active === f;
        return (
          <button
            key={f}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(f)}
            className={`
              shrink-0
              px-4 py-2
              font-mono text-[10px] tracking-vault uppercase
              transition-all duration-300
              ${isActive
                ? "bg-gold-linear bg-size-[200%_auto] text-obsidian shadow-gold-sm"
                : "text-ash hover:text-ivory"
              }
            `}
          >
            {f === "all" ? "All Pieces" : PURITY_LABELS[f]}
          </button>
        );
      })}
    </div>
  );
}
