import type { Product, SiteSettings } from "@/drizzle/schema";

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
