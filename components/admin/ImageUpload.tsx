"use client";

import React, { useRef, useState } from "react";
import { Upload, X, GripVertical, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadProductImage } from "@/app/admin/actions";
import Image from "next/image";

import type { ProductFormData } from "@/lib/types";

type ProductImage = ProductFormData["images"][number];

interface ImageUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const { url } = await uploadProductImage(formData);

        newImages.push({
          url,
          altText: "",
          position: newImages.length,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Make sure the 'product-images' bucket exists and you have the SUPABASE_SERVICE_ROLE_KEY set.");
      }
    }

    onChange(newImages);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index).map((img, i) => ({
      ...img,
      position: i,
    }));
    onChange(newImages);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === images.length - 1) return;

    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];

    // Update positions
    const correctedImages = newImages.map((img, i) => ({ ...img, position: i }));
    onChange(correctedImages);
  };

  const updateAltText = (index: number, text: string) => {
    const newImages = [...images];
    newImages[index].altText = text;
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block font-mono text-[10px] uppercase tracking-widest text-ivory/40">
          Product Gallery
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-[10px] uppercase tracking-wider text-ivory/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
          {uploading ? "Uploading..." : "Add Images"}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          multiple
          accept="image/*"
          className="hidden"
        />
      </div>

      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-2xl bg-white/2 hover:bg-white/5 hover:border-white/10 cursor-pointer transition-all group"
        >
          <ImageIcon className="w-8 h-8 text-ivory/10 group-hover:text-gold/40 transition-colors mb-4" />
          <p className="text-xs text-ivory/30 group-hover:text-ivory/50">
            No images yet. Click to upload from the forge.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {images.map((image, index) => (
            <div
              key={image.url}
              className="flex items-center gap-4 p-4 bg-white/2 border border-white/10 rounded-xl group hover:border-gold/30 transition-all"
            >
              <div className="flex flex-col gap-1 items-center text-ivory/20">
                <button
                  type="button"
                  onClick={() => moveImage(index, "up")}
                  className="hover:text-gold transition-colors disabled:opacity-30"
                  disabled={index === 0}
                >
                  <GripVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-obsidian border border-white/10">
                <Image
                  src={image.url}
                  alt={image.altText || "Product preview"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={image.altText || ""}
                  onChange={(e) => updateAltText(index, e.target.value)}
                  placeholder="Alt text (e.g. Front view showing swallow detail)"
                  className="w-full bg-transparent border-none p-0 text-xs text-ivory/70 placeholder:text-ivory/20 focus:ring-0"
                />
                <p className="text-[9px] text-ivory/30 uppercase tracking-widest mt-1">
                  Position: {index === 0 ? "PRIMARY (COVER)" : index + 1}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-2 text-ivory/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
