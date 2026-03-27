"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProductFormData } from "@/lib/types";

// Import from the new Data Access Layer
import * as productsData from "@/drizzle/data/products";
import * as ordersData from "@/drizzle/data/orders";
import * as settingsData from "@/drizzle/data/settings";
import { supabase } from "@/lib/supabase";
import type { OrderStatus } from "@/drizzle/schema";

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
  status: OrderStatus,
  trackingNumber?: string,
  trackingCarrier?: string
) {
  await ordersData.updateOrderStatus(orderId, status, trackingNumber, trackingCarrier);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

// ─── Media Upload ─────────────────────────────────────────────────────────────

export async function uploadProductImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return { url: publicUrl };
}
