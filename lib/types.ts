import type { Product, SiteSettings, MetalPurity, Finish } from "@/drizzle/schema";

export interface VaultProduct extends Product {
  /** All image URLs for the product, ordered by position. */
  imageUrls: string[];
}

export interface VaultProps {
  /** Initial products fetched server-side. */
  initialProducts: VaultProduct[];
  /** Current gold spot price from API ($/oz). */
  goldSpot: number;
  /** Global atelier pricing settings. */
  settings: SiteSettings;
}

export interface HeroProps {
  /** Public path to the looping forge video (WebM preferred, MP4 fallback). */
  videoSrc?:    string;
  posterSrc?:   string;
  /** Override the brand name displayed. Defaults to "BARTAMIAN". */
  brandName?:   string;
  slogan?:      string;
  /** CTA href for the primary button. */
  ctaHref?:     string;
  ctaLabel?:    string;
  secondaryHref?:  string;
  secondaryLabel?: string;
}

export interface ProcessStep {
  number:   string;
  title:    string;
  caption:  string;
  imageSrc: string;
  imageAlt: string;
}

export interface Stat {
  value: string;
  label: string;
}

// ─── Admin Types ──────────────────────────────────────────────────────────────

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  categoryId: string;
  priceCents: number;
  priceId: string;
  compareAtCents?: number;
  metalPurity: MetalPurity;
  finish: Finish;
  weightGrams?: string;
  stockQuantity: number;
  isInfiniteStock: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
  images: {
    url: string;
    altText?: string;
    position: number;
    width?: number;
    height?: number;
  }[];
}
