export const dynamic = "force-dynamic";

import React from "react";
import { getProductById, getCategories } from "@/drizzle/data/products";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, allCategories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <ProductForm
      categories={allCategories}
      initialData={product as any}
    />
  );
}
