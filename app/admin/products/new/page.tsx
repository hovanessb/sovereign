export const dynamic = "force-dynamic";

import React from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/drizzle/data/products";

export default async function NewProductPage() {
  const allCategories = await getCategories();

  return <ProductForm categories={allCategories} />;
}
