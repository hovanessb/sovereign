import { db } from "../action";
import { products, categories, productImages } from "../schema";
import { count, eq, and, lte, ilike, or, desc, asc } from "drizzle-orm";
import type { ProductFormData } from "@/lib/types";

export async function getProducts(filter?: { q?: string }) {
  const searchFilter = filter?.q
    ? or(
        ilike(products.name, `%${filter.q}%`),
        ilike(products.slug, `%${filter.q}%`)
      )
    : undefined;

  return await db.query.products.findMany({
    where: searchFilter,
    with: {
      category: true,
      images: {
        limit: 1,
        orderBy: (images, { asc }) => [asc(images.position)],
      },
    },
    orderBy: [desc(products.createdAt)],
  });
}

export async function getProductById(id: string) {
  return await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      images: true,
    },
  });
}

export async function getProductCount() {
  const [result] = await db.select({ value: count() }).from(products);
  return result.value;
}

export async function getLowStockCount() {
  const [result] = await db.select({ value: count() }).from(products).where(
    and(
      lte(products.stockQuantity, 3),
      eq(products.isInfiniteStock, false),
      eq(products.isPublished, true)
    )
  );
  return result.value;
}

export async function getCategories() {
  return await db.query.categories.findMany({
    orderBy: [asc(categories.name)],
  });
}

export async function createProduct(data: ProductFormData) {
  console.log(`[DAL] Creating product with ${data.images?.length || 0} images`);
  
  return await db.transaction(async (tx) => {
    const result = await tx.insert(products).values({
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDesc: data.shortDesc || null,
      categoryId: data.categoryId,
      priceCents: data.priceCents,
      priceId: data.priceId,
      compareAtCents: data.compareAtCents || null,
      metalPurity: data.metalPurity,
      finish: data.finish,
      weightGrams: data.weightGrams || null,
      stockQuantity: data.stockQuantity,
      isInfiniteStock: data.isInfiniteStock,
      isFeatured: data.isFeatured,
      isPublished: data.isPublished,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    }).returning();

    const product = result[0];

    if (data.images && data.images.length > 0) {
      await tx.insert(productImages).values(
        data.images.map((img) => ({
          productId: product.id,
          url: img.url,
          altText: img.altText || null,
          position: img.position,
          width: img.width || null,
          height: img.height || null,
        }))
      );
    }

    return result;
  });
}

export async function updateProduct(id: string, data: ProductFormData) {
  console.log(`[DAL] Updating product ${id} with ${data.images?.length || 0} images`);

  return await db.transaction(async (tx) => {
    const result = await tx.update(products)
      .set({
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDesc: data.shortDesc || null,
        categoryId: data.categoryId,
        priceCents: data.priceCents,
        priceId: data.priceId,
        compareAtCents: data.compareAtCents || null,
        metalPurity: data.metalPurity,
        finish: data.finish,
        weightGrams: data.weightGrams || null,
        stockQuantity: data.stockQuantity,
        isInfiniteStock: data.isInfiniteStock,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    // Sync images: Delete existing and re-insert
    await tx.delete(productImages).where(eq(productImages.productId, id));

    if (data.images && data.images.length > 0) {
      await tx.insert(productImages).values(
        data.images.map((img) => ({
          productId: id,
          url: img.url,
          altText: img.altText || null,
          position: img.position,
          width: img.width || null,
          height: img.height || null,
        }))
      );
    }

    return result;
  });
}

export async function deleteProduct(id: string) {
  return await db.delete(products).where(eq(products.id, id)).returning();
}

export async function toggleProductPublication(id: string, isPublished: boolean) {
  return await db.update(products)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
}

export async function getPublishedProducts() {
  return await db.query.products.findMany({
    where: eq(products.isPublished, true),
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.position)],
      },
      category: true,
    },
    orderBy: [desc(products.isFeatured), asc(products.sortOrder)],
  });
}
