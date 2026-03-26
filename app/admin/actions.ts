"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProductFormData } from "@/lib/types";

// Import from the new Data Access Layer
import * as productsData from "@/drizzle/data/products";
import * as ordersData from "@/drizzle/data/orders";
import * as settingsData from "@/drizzle/data/settings";

export type { ProductFormData };

export async function toggleProductPublication(id: string, isPublished: boolean) {
  await productsData.toggleProductPublication(id, isPublished);
  revalidatePath("/admin/products");
  revalidatePath("/vault");
}

export async function deleteProduct(id: string) {
  await productsData.deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/vault");
}

export async function getSiteSettings() {
  return await settingsData.getSiteSettings();
}

export async function updateSiteSettings(data: {
  makingChargePerGram: number;
  marginMultiplier: string;
}) {
  await settingsData.updateSiteSettings(data);
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

// ─── Product CRUD ─────────────────────────────────────────────────────────────

export async function createProduct(data: ProductFormData) {
  await productsData.createProduct(data);
  revalidatePath("/admin/products");
  revalidatePath("/vault");
  redirect("/admin/products");
}

export async function updateProduct(id: string, data: ProductFormData) {
  await productsData.updateProduct(id, data);
  revalidatePath("/admin/products");
  revalidatePath("/vault");
  redirect("/admin/products");
}

// ─── Order Status ─────────────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string,
  trackingCarrier?: string
) {
  await ordersData.updateOrderStatus(orderId, status, trackingNumber, trackingCarrier);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
