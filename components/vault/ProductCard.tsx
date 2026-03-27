"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice, PURITY_LABELS, LOW_STOCK_THRESHOLD, calcRetailPrice } from "@/lib/helpers";
import type { VaultProduct, VaultProps } from "@/lib/types";

export const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ProductCard({
  product,
  liveStock,
  onAddToCart,
  goldSpot,
  settings,
}: {
  product: VaultProduct;
  liveStock: number;
  onAddToCart: (product: VaultProduct, dynamicPrice: number) => void;
  goldSpot: number;
  settings: VaultProps["settings"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [index, setIndex] = useState(0);
  const isOutOfStock = !product.isInfiniteStock && liveStock === 0;
  const isLowStock = !product.isInfiniteStock && liveStock > 0 && liveStock <= LOW_STOCK_THRESHOLD;

  // Calculate dynamic retail price based on current market + atelier settings
  const dynamicPriceCents = calcRetailPrice(
    goldSpot,
    product.metalPurity,
    Number(product.weightGrams) || 0,
    settings.makingChargePerGram,
    Number(settings.marginMultiplier)
  );

  const hasMultipleImages = product.imageUrls.length > 1;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasMultipleImages) return;
    setIndex((prev) => (prev + 1) % product.imageUrls.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasMultipleImages) return;
    setIndex((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
  };

  return (
    <motion.div
      ref={ref}
      variants={CARD_VARIANTS}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="
        group
        relative flex flex-col
        bg-obsidian-200
        border border-gold-subtle
        hover:border-gold/40
        shadow-card
        transition-all duration-500
        hover:shadow-gold-sm
      "
    >
      {/* ── Image Slider (Infinite & Peeking) ─────────────────────────────── */}
      <div className="relative aspect-4/5 overflow-hidden bg-obsidian-300 px-6 sm:px-0">
        <motion.div
          animate={{ x: `calc(-${index * 100}% )` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500;
            if (swipe) {
              if (offset.x > 0) prevImage();
              else nextImage();
            }
          }}
          className="flex w-full h-full cursor-pointer"
          onClick={() => nextImage()}
        >
          {product.imageUrls.length > 0 ? (
            product.imageUrls.map((url, idx) => (
              <div
                key={url}
                className="
                  relative 
                  min-w-full h-full 
                  px-2 sm:px-0 
                  transition-opacity duration-500
                "
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={url}
                    alt={`${product.name} - view ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    className={`
                      object-cover
                      grayscale group-hover:grayscale-0
                      scale-100 group-hover:scale-110
                      transition-all duration-1000 ease-cinematic
                      pointer-events-none
                      ${index === idx ? "opacity-100 scale-100" : "opacity-40 sm:opacity-100 scale-95"}
                    `}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-[9px] tracking-ultrawide text-gold/30 uppercase">
                Image Forthcoming
              </span>
            </div>
          )}
        </motion.div>

        {/* Navigation Arrows (Desktop/Tablet) */}
        {hasMultipleImages && !isOutOfStock && (
          <>
            <button
              onClick={(e) => prevImage(e)}
              className="
                absolute left-2 top-1/2 -translate-y-1/2
                z-20 p-2
                hidden sm:flex items-center justify-center
                bg-obsidian/40 backdrop-blur-sm
                text-gold hover:text-white
                opacity-0 group-hover:opacity-100
                transition-all duration-300
                border border-gold/10
              "
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => nextImage(e)}
              className="
                absolute right-2 top-1/2 -translate-y-1/2
                z-20 p-2
                hidden sm:flex items-center justify-center
                bg-obsidian/40 backdrop-blur-sm
                text-gold hover:text-white
                opacity-0 group-hover:opacity-100
                transition-all duration-300
                border border-gold/10
              "
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Pagination Dots (Mobile/Tablet) */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 p-1 rounded-full bg-black/20 backdrop-blur-[2px]">
            {product.imageUrls.map((_, idx) => (
              <div
                key={idx}
                className={`
                  w-1.5 h-1.5 rounded-full transition-all duration-300
                  ${idx === index ? "bg-gold w-4" : "bg-white/20"}
                `}
              />
            ))}
          </div>
        )}

        {/* Overlay gradient */}
        <div className="
          absolute inset-0 pointer-events-none
          bg-linear-to-t from-obsidian-200/90 via-obsidian-200/20 to-transparent
          z-10
        " />

        {/* Purity badge */}
        <div className="
          absolute top-3 right-3
          px-2 py-1
          border border-gold/40
          bg-obsidian/70 backdrop-blur-sm
          z-20
        ">
          <span className="font-mono text-[9px] tracking-widest text-gold uppercase">
            {PURITY_LABELS[product.metalPurity]}
          </span>
        </div>

        {/* Out-of-stock band */}
        {isOutOfStock && (
          <div className="
            absolute inset-0
            bg-obsidian/60 backdrop-blur-[2px]
            flex items-center justify-center
            z-30
          ">
            <span className="
              font-mono text-[10px] tracking-vault uppercase
              text-ash border border-charcoal-muted
              px-4 py-2
            ">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── Card Body ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Name */}
        <div>
          <h3 className="
            font-spectral italic font-semibold
            text-lg text-ivory
            leading-tight
            group-hover:text-transparent
            group-hover:bg-clip-text group-hover:bg-gold-linear
            group-hover:bg-size-[200%_auto]
            transition-all duration-500
          ">
            {product.name}
          </h3>
          {product.shortDesc && (
            <p className="
              font-geist font-light
              text-[12px] text-ash
              mt-1 leading-snug
              line-clamp-2
            ">
              {product.shortDesc}
            </p>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="
              font-mono text-base text-gold tracking-price
            ">
              {formatPrice(dynamicPriceCents)}
            </p>
            {product.compareAtCents && (
              <p className="font-mono text-[10px] text-ash line-through mt-0.5">
                {formatPrice(product.compareAtCents)}
              </p>
            )}
          </div>
          {product.weightGrams && (
            <p className="font-mono text-[10px] text-ash tracking-widest">
              {product.weightGrams}g
            </p>
          )}
        </div>

        {/* Low stock warning */}
        {isLowStock && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="
              font-mono text-[9px] tracking-vault uppercase
              text-gold animate-forge-pulse
            "
          >
            Only {liveStock} remaining
          </motion.p>
        )}

        {/* CTA */}
        <button
          onClick={() => !isOutOfStock && onAddToCart(product, dynamicPriceCents)}
          disabled={isOutOfStock}
          aria-label={`Acquire ${product.name}`}
          className="
            mt-1
            w-full py-3
            font-geist font-medium
            text-[11px] tracking-vault uppercase
            border border-gold/30
            text-ivory
            hover:bg-gold-linear hover:bg-size-[200%_auto]
            hover:text-obsidian hover:border-transparent
            hover:shadow-gold-sm
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-300
            relative overflow-hidden
          "
        >
          {isOutOfStock ? (
            "Sold Out"
          ) : (
            "Acquire"
          )}
        </button>
      </div>
    </motion.div>
  );
}
