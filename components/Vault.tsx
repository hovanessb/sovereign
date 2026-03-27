"use client";

/**
 * BARTAMIAN — Vault Component
 * ─────────────────────────────────────────────────────────────────────────────
 * The Vault: the shop grid.
 *
 * Architecture:
 *   • Receives products from a Server Component parent (RSC + fetch from Supabase).
 *   • Subscribes to Supabase Realtime for live `stock_quantity` updates.
 *   • Filter bar for metal purity / category (client-side, no full refetch).
 *   • Grid of Product Cards with dynamic pricing and live stock.
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "framer-motion";
import type { MetalPurity } from "@/drizzle/schema";
import type { VaultProduct, VaultProps } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

// ─── Sub-components ────────────────────────────────────────────────────────────
import { VaultHeader } from "./vault/VaultHeader";
import { VaultGrid } from "./vault/VaultGrid";

export default function Vault({ initialProducts, goldSpot, settings }: VaultProps) {
  const [products] = useState<VaultProduct[]>(initialProducts);
  const [stockMap, setStockMap] = useState<Record<string, number>>(
    Object.fromEntries(initialProducts.map((p) => [p.id, p.stockQuantity]))
  );
  const [activeFilter, setActiveFilter] = useState<MetalPurity | "all">("all");
  const addItem = useCartStore((state) => state.addItem);

  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });

  // ── Supabase Realtime — live inventory ─────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel("vault-inventory")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
        },
        (payload) => {
          const updated = payload.new as { id: string; stock_quantity: number };
          setStockMap((prev) => ({
            ...prev,
            [updated.id]: updated.stock_quantity,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── Cart Integration ──────────────────────────────────────────────────────
  const handleAddToCart = useCallback(
    (product: VaultProduct, dynamicPrice: number) => {
      addItem({
        id: product.id,
        priceId: product.priceId,
        name: product.name,
        priceCents: dynamicPrice,
        imageUrl: product.imageUrls[0] || undefined,
        metalPurity: product.metalPurity,
      });
    },
    [addItem]
  );

  // ── Client-side filtering ──────────────────────────────────────────────────
  const filtered =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.metalPurity === activeFilter);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section
      id="vault"
      aria-label="The Vault — BARTAMIAN Collection"
      className="relative bg-obsidian min-h-screen"
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <VaultHeader
        headerRef={headerRef}
        isHeaderInView={isHeaderInView}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      <VaultGrid
        filtered={filtered}
        stockMap={stockMap}
        onAddToCart={handleAddToCart}
        goldSpot={goldSpot}
        settings={settings}
        onClearFilters={() => setActiveFilter("all")}
      />

      {/* ── Bottom border decoration ─────────────────────────────────────────── */}
      <div className="
        max-w-8xl mx-auto
        px-6 sm:px-10 lg:px-16
        pb-20
        flex items-center gap-6
      ">
        <div className="flex-1 h-px bg-linear-to-r from-gold/30 via-gold/10 to-transparent" />
        <span className="font-mono text-[9px] tracking-ultrawide text-gold/30 uppercase shrink-0">
          {filtered.length} {filtered.length === 1 ? "Piece" : "Pieces"} Available
        </span>
        <div className="flex-1 h-px bg-linear-to-l from-gold/30 via-gold/10 to-transparent" />
      </div>
    </section>
  );
}
