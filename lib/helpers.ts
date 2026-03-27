import type { MetalPurity } from "@/drizzle/schema";
import { number } from "framer-motion";

// lib/gold-pricing.ts

const TROY_OZ_TO_GRAMS = 31.1035;

const PURITY_RATIOS = {
  "9k": 9 / 24,
  "14k": 14 / 24,
  "18k": 18 / 24,
  "22k": 22 / 24,
  "24k": 24 / 24,
} as const;

const GOLD_LOSS_FACTOR = 1.05; // 5% manufacturing loss (polishing, casting sprues, etc.)

export function calcMaterialCost(
  spotPricePerOz: number,
  purity: keyof typeof PURITY_RATIOS,
  weightGrams: number
): number {
  const gramPrice = spotPricePerOz / TROY_OZ_TO_GRAMS;
  // Factor in manufacturing loss (standard boutique practice)
  return (gramPrice * PURITY_RATIOS[purity] * weightGrams) * GOLD_LOSS_FACTOR;
}

export function calcRetailPrice(
  spotPricePerOz: number,
  purity: keyof typeof PURITY_RATIOS,
  weightGrams: number,
  makingChargePerGram = 25,   // default artisan labor rate
  marginMultiplier = 2.5      // luxury markup
): number {
  const material = calcMaterialCost(spotPricePerOz, purity, weightGrams);
  const making = makingChargePerGram * weightGrams;

  // Final retail value in USD
  const rawRetailUSD = (material + making) * marginMultiplier;
  // Convert to cents (integer) and round to the nearest $5 (500 cents) for premium feel
  const cents = Math.round(rawRetailUSD * 100);
  return Math.ceil(cents / 500) * 500;
}

export function formatPrice(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export const PURITY_LABELS: Record<MetalPurity, string> = {
  "9k": "9K",
  "14k": "14K",
  "18k": "18K",
  "22k": "22K",
  "24k": "24K",
};

export const LOW_STOCK_THRESHOLD = 3;