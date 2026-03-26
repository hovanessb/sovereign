/**
 * BARTAMIAN — Home Page (RSC)
 * ─────────────────────────────────────────────────────────────────────────────
 * Server Component: fetches initial products from Supabase + Drizzle,
 * then passes them down to the client Vault component.
 * All other sections are rendered server-side for maximum performance.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getPublishedProducts } from "@/drizzle/data/products";
import { getSiteSettings } from "./admin/actions";
import { getGoldSpotPrice } from "./api/actions/get-gold-spot";

import Hero from "@/components/Hero";
import ProcessGallery from "@/components/ProcessGallery";
import Vault from "@/components/Vault";
import type { VaultProduct } from "@/lib/types";

// ─── Page Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "BARTAMIAN — Uncompromising & Sovereign",
};

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getVaultProducts(): Promise<VaultProduct[]> {
  try {
    const results = await getPublishedProducts();

    return results.map(p => ({
      ...p,
      imageUrls: p.images.map((img: any) => img.url)
    })) as VaultProduct[];
  } catch (error) {
    console.error("[BARTAMIAN] Failed to fetch products:", error);
    return [];
  }
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [initialProducts, goldSpotData, settings] = await Promise.all([
    getVaultProducts(),
    getGoldSpotPrice(),
    getSiteSettings(),
  ]);

  const goldSpot = goldSpotData || 2400; // Fallback to a safe estimate if API fails

  return (
    <main className="bg-obsidian">

      {/* ── 01. The Forge Hero ─────────────────────────────────────────────── */}
      <Hero
        videoSrc="/video/forge-loop.webm"
        posterSrc="/images/hero-poster.jpg"
        brandName="BARTAMIAN"
        slogan="UNCOMPROMISING & SOVEREIGN"
        ctaHref="#vault"
        ctaLabel="Enter the Vault"
        secondaryHref="#process"
        secondaryLabel="The Process"
      />

      {/* ── 02. From the Heat — Process Gallery ────────────────────────────── */}
      <ProcessGallery />

      {/* ── 03. The Vault — Shop Grid ──────────────────────────────────────── */}
      <Vault
        initialProducts={initialProducts}
        goldSpot={goldSpot}
        settings={settings}
      />

    </main>
  );
}
