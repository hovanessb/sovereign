"use client";

import React, { useState } from "react";
import { Save, RefreshCw, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createProduct, updateProduct } from "@/app/admin/actions";
import type { ProductFormData } from "@/lib/types";
import type { Category, MetalPurity, Finish, Product, ProductImage } from "@/drizzle/schema";
import { ImageUpload } from "./ImageUpload";

interface ProductFormProps {
  categories: Category[];
  initialData?: Product & { images: ProductImage[] };
}

type FormImage = ProductFormData["images"][number];

const METAL_PURITIES: MetalPurity[] = ["9k", "14k", "18k", "22k", "24k"];
const FINISHES: Finish[] = ["polished", "brushed", "hammered", "sandblasted", "oxidized"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const isEdit = !!initialData;

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [shortDesc, setShortDesc] = useState(initialData?.shortDesc ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? (categories[0]?.id ?? ""));
  const [priceCents, setPriceCents] = useState(initialData?.priceCents ?? 0);
  const [priceId, setPriceId] = useState(initialData?.priceId ?? "");
  const [compareAtCents, setCompareAtCents] = useState(initialData?.compareAtCents ?? 0);
  const [metalPurity, setMetalPurity] = useState<MetalPurity>(initialData?.metalPurity ?? "18k");
  const [finish, setFinish] = useState<Finish>(initialData?.finish ?? "polished");
  const [weightGrams, setWeightGrams] = useState(initialData?.weightGrams ?? "");
  const [stockQuantity, setStockQuantity] = useState(initialData?.stockQuantity ?? 0);
  const [isInfiniteStock, setIsInfiniteStock] = useState(initialData?.isInfiniteStock ?? false);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? "");
  const [images, setImages] = useState<FormImage[]>(
    initialData?.images?.map(img => ({
      url: img.url,
      altText: img.altText ?? "",
      position: img.position,
      width: img.width ?? undefined,
      height: img.height ?? undefined,
    })) ?? []
  );

  React.useEffect(() => {
    if (isEdit && initialData.images) {
      setImages(initialData.images.map(img => ({
        url: img.url,
        altText: img.altText ?? "",
        position: img.position,
        width: img.width ?? undefined,
        height: img.height ?? undefined,
      })));
    }
  }, [isEdit, initialData?.images]); // added .images to dependencies for stability

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) setSlug(slugify(val));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("[ProductForm] Submitting with images:", images);
    setLoading(true);
    setError("");

    const formData: ProductFormData = {
      name,
      slug,
      description,
      shortDesc: shortDesc || undefined,
      categoryId,
      priceCents,
      priceId,
      compareAtCents: compareAtCents || undefined,
      metalPurity,
      finish,
      weightGrams: weightGrams || undefined,
      stockQuantity,
      isInfiniteStock,
      isFeatured,
      isPublished,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      images,
    };

    try {
      if (isEdit && initialData) {
        await updateProduct(initialData.id, formData);
      } else {
        await createProduct(formData);
      }
    } catch (err: unknown) {
      // redirect throws NEXT_REDIRECT which we should not catch
      if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
      setError("Failed to save product. Check all fields and try again.");
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 p-3 rounded-lg text-ivory font-mono text-sm focus:border-gold/50 outline-none transition-all";
  const labelClass = "block font-mono text-[10px] uppercase tracking-widest text-ivory/40 mb-2";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 text-ivory/40 hover:text-white hover:bg-white/5 rounded-md transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="font-spectral text-2xl italic font-bold">
            {isEdit ? "Edit Piece" : "Forge New Piece"}
          </h2>
          <p className="text-sm text-ivory/50 mt-1">
            {isEdit ? "Update the details of this sovereign creation." : "Add a new creation to the vault."}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Identity */}
        <section className="p-8 bg-white/2 border border-white/10 rounded-2xl space-y-6">
          <h3 className="font-spectral text-lg italic font-semibold text-ivory/80">Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. Square Swallow Ring"
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className={inputClass}
                placeholder="square-swallow-ring"
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className={inputClass}
              placeholder="Full product description..."
            />
          </div>
          <div>
            <label className={labelClass}>Short Description</label>
            <input
              type="text"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              maxLength={240}
              className={inputClass}
              placeholder="Brief tagline (max 240 chars)"
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-obsidian text-ivory">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Media */}
        <section className="p-8 bg-white/2 border border-white/10 rounded-2xl space-y-6 text-ivory">
          <h3 className="font-spectral text-lg italic font-semibold text-ivory/80">Media</h3>
          <ImageUpload images={images} onChange={setImages} />
        </section>

        {/* Commerce */}
        <section className="p-8 bg-white/2 border border-white/10 rounded-2xl space-y-6">
          <h3 className="font-spectral text-lg italic font-semibold text-ivory/80">Commerce</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Price (cents)</label>
              <input
                type="number"
                value={priceCents}
                onChange={(e) => setPriceCents(Number(e.target.value))}
                required
                min={0}
                className={inputClass}
                placeholder="e.g. 45000"
              />
              <p className="text-[9px] text-ivory/30 italic mt-1">
                = ${(priceCents / 100).toFixed(2)}
              </p>
            </div>
            <div>
              <label className={labelClass}>Compare-At Price (cents)</label>
              <input
                type="number"
                value={compareAtCents}
                onChange={(e) => setCompareAtCents(Number(e.target.value))}
                min={0}
                className={inputClass}
                placeholder="Original price for strikethrough"
              />
            </div>
            <div>
              <label className={labelClass}>Stripe Price ID</label>
              <input
                type="text"
                value={priceId}
                onChange={(e) => setPriceId(e.target.value)}
                required
                className={inputClass}
                placeholder="price_xxxxxxxxxx"
              />
            </div>
          </div>
        </section>

        {/* Material */}
        <section className="p-8 bg-white/2 border border-white/10 rounded-2xl space-y-6">
          <h3 className="font-spectral text-lg italic font-semibold text-ivory/80">Material</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Metal Purity</label>
              <select
                value={metalPurity}
                onChange={(e) => setMetalPurity(e.target.value as MetalPurity)}
                className={inputClass}
              >
                {METAL_PURITIES.map((p) => (
                  <option key={p} value={p} className="bg-obsidian text-ivory">
                    {p.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Finish</label>
              <select
                value={finish}
                onChange={(e) => setFinish(e.target.value as Finish)}
                className={inputClass}
              >
                {FINISHES.map((f) => (
                  <option key={f} value={f} className="bg-obsidian text-ivory">
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Weight (grams)</label>
              <input
                type="text"
                value={weightGrams}
                onChange={(e) => setWeightGrams(e.target.value)}
                className={inputClass}
                placeholder="e.g. 24.50"
              />
            </div>
          </div>
        </section>

        {/* Inventory & Display */}
        <section className="p-8 bg-white/2 border border-white/10 rounded-2xl space-y-6">
          <h3 className="font-spectral text-lg italic font-semibold text-ivory/80">Inventory & Display</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Stock Quantity</label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                min={0}
                className={inputClass}
              />
            </div>
            <div className="flex items-end gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isInfiniteStock}
                  onChange={(e) => setIsInfiniteStock(e.target.checked)}
                  className="w-4 h-4 accent-gold"
                />
                <span className="text-xs text-ivory/60 group-hover:text-ivory transition-colors">
                  Made-to-Order (∞)
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-gold"
                />
                <span className="text-xs text-ivory/60 group-hover:text-ivory transition-colors">
                  Featured
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-gold"
                />
                <span className="text-xs text-ivory/60 group-hover:text-ivory transition-colors">
                  Published
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* SEO */}
        <section className="p-8 bg-white/2 border border-white/10 rounded-2xl space-y-6">
          <h3 className="font-spectral text-lg italic font-semibold text-ivory/80">SEO</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className={labelClass}>Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                maxLength={120}
                className={inputClass}
                placeholder="Custom page title for search engines"
              />
            </div>
            <div>
              <label className={labelClass}>Meta Description</label>
              <input
                type="text"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                maxLength={200}
                className={inputClass}
                placeholder="Short description for search results"
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 bg-gold text-obsidian font-bold text-xs uppercase tracking-widest hover:bg-gold-bright transition-all disabled:opacity-50 rounded-lg"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {loading ? "Forging..." : isEdit ? "Update Piece" : "Add to Vault"}
        </button>
      </form>
    </div>
  );
}
