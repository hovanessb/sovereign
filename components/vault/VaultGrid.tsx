"use client";

import { motion, type Variants } from "framer-motion";
import { ProductCard } from "./ProductCard";
import type { VaultProduct, VaultProps } from "@/lib/types";

const GRID_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

interface VaultGridProps {
  filtered: VaultProduct[];
  stockMap: Record<string, number>;
  onAddToCart: (product: VaultProduct, dynamicPrice: number) => void;
  goldSpot: number;
  settings: VaultProps["settings"];
  onClearFilters: () => void;
}

export function VaultGrid({
  filtered,
  stockMap,
  onAddToCart,
  goldSpot,
  settings,
  onClearFilters,
}: VaultGridProps) {
  return (
    <div className="
      max-w-8xl mx-auto
      px-6 sm:px-10 lg:px-16
      py-14
    ">
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-spectral italic text-2xl text-ash">
            No pieces found for this purity.
          </p>
          <button
            onClick={onClearFilters}
            className="
              mt-6 font-mono text-[10px] tracking-vault uppercase
              text-gold border-b border-gold/40 pb-0.5
              hover:border-gold transition-colors
            "
          >
            View all pieces
          </button>
        </div>
      ) : (
        <motion.div
          variants={GRID_VARIANTS}
          initial="hidden"
          animate="visible"
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-6 sm:gap-8
          "
        >
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              liveStock={stockMap[product.id] ?? product.stockQuantity}
              onAddToCart={onAddToCart}
              goldSpot={goldSpot}
              settings={settings}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
