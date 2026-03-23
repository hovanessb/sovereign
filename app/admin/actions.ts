"use server";

import { db } from "@/drizzle/action";
import { products } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleProductPublication(id: string, isPublished: boolean) {
  await db
    .update(products)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(products.id, id));
  
  revalidatePath("/admin/products");
  revalidatePath("/vault");
}

export async function deleteProduct(id: string) {
  // Note: productImages has cascade delete in schema
  await db.delete(products).where(eq(products.id, id));
  
  revalidatePath("/admin/products");
  revalidatePath("/vault");
}
