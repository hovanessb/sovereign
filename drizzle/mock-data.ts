import { db } from "./action";
import {
  categories,
  products,
  productImages,
} from "./schema";

/**
 * Mock Data Seed Script for BARTAMIAN — The Vault
 * Run this with: `bun run drizzle/mock-data.ts` (after adjusting your db import)
 * 
 * ARCHITECTURE NOTE:
 * While the image URLs below currently point to your local Next.js `/images/products/` directory 
 * to work out-of-the-box for local development, the BEST architecture for production is 
 * to upload these exact files to Supabase Storage. 
 * Once uploaded, you would simply replace the `url` fields below with the 
 * public Supabase Storage CDN URLs (e.g., https://[project].supabase.co/storage/v1/object/public/products/...).
 */

async function seed() {
  console.log("Seeding categories...");

  // 1. Create a Category
  const [ringsCategory] = await db
    .insert(categories)
    .values({
      name: "Rings",
      slug: "rings",
      description: "Forged sovereign rings, crafted with absolute precision.",
      sortOrder: 1,
    })
    .returning();

  console.log("Seeding products...");

  // 2. Create Products
  const newProducts = await db
    .insert(products)
    .values([
      {
        categoryId: ringsCategory.id,
        name: "Round Swallow Ring 18k",
        slug: "round-swallow-ring-18k",
        description: "A masterful round signet featuring the iconic swallow motif, forged in brilliant 18k gold.",
        shortDesc: "18k Gold Round Swallow Signet",
        priceId: "price_mock_round18k", // Replace with actual Stripe price_id later
        priceCents: 125000, // $1,250.00
        compareAtCents: 150000,
        metalPurity: "18k",
        finish: "polished",
        weightGrams: "24.50",
        stockQuantity: 5,
        isFeatured: true,
        isPublished: true,
        sortOrder: 1,
      },
      {
        categoryId: ringsCategory.id,
        name: "Square Swallow Ring 18k",
        slug: "square-swallow-ring-18k",
        description: "A striking square signet bearing the swallow emblem, providing a modern geometric take on classic sovereignty.",
        shortDesc: "18k Gold Square Swallow Signet",
        priceId: "price_mock_square18k", // Replace with actual Stripe price_id later
        priceCents: 135000, // $1,350.00
        compareAtCents: 160000,
        metalPurity: "18k",
        finish: "brushed",
        weightGrams: "28.00",
        stockQuantity: 3,
        isFeatured: true,
        isPublished: true,
        sortOrder: 2,
      },
    ])
    .returning();

  const roundRing = newProducts.find((p) => p.slug === "round-swallow-ring-18k")!;
  const squareRing = newProducts.find((p) => p.slug === "square-swallow-ring-18k")!;

  console.log("Seeding product images...");

  // 3. Create Product Images 
  // (Position 0 is the primary/hero image. Subsequent numbers are gallery images)
  await db.insert(productImages).values([
    // Round Ring Images
    {
      productId: roundRing.id,
      url: "/images/products/round-swallow-ring-18k.webp",
      altText: "Round Swallow Ring 18k - Main View",
      position: 0,
    },
    {
      productId: roundRing.id,
      url: "/images/products/round-swallow-ring-18k-hand1.webp",
      altText: "Round Swallow Ring 18k - On Hand Profile",
      position: 1,
    },
    {
      productId: roundRing.id,
      url: "/images/products/round-swallow-ring-18k-hand2.webp",
      altText: "Round Swallow Ring 18k - On Hand Top View",
      position: 2,
    },

    // Square Ring Images
    {
      productId: squareRing.id,
      url: "/images/products/square-swallow-ring-18k.webp",
      altText: "Square Swallow Ring 18k - Main View",
      position: 0,
    },
    {
      productId: squareRing.id,
      url: "/images/products/square-swallow-ring-18k-hand-model-1.webp",
      altText: "Square Swallow Ring 18k - On Hand Profile",
      position: 1,
    },
    {
      productId: squareRing.id,
      url: "/images/products/square-swallow-ring-18k-hand-model-2.webp",
      altText: "Square Swallow Ring 18k - On Hand Top View",
      position: 2,
    },
  ]);

  console.log("Seed completed successfully. The Vault is ready.");
}

seed().catch((err) => {
  console.error("Failed to seed database:", err);
  process.exit(1);
});
