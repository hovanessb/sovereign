export const dynamic = "force-dynamic";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, ExternalLink } from "lucide-react";
import { db } from "@/drizzle/action";
import { products, categories } from "@/drizzle/schema";
import { formatPrice } from "@/lib/helpers";
import { desc, eq } from "drizzle-orm";

import { ProductRowActions } from "./RowActions";

export default async function AdminProductsPage() {
  const allProducts = await db.query.products.findMany({
    with: {
      category: true,
      images: {
        limit: 1,
        orderBy: (images, { asc }) => [asc(images.position)],
      },
    },
    orderBy: [desc(products.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-spectral text-2xl italic font-bold">The Vault Management</h2>
          <p className="text-sm text-ivory/50 mt-1">Configure your sovereign inventory and pricing.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gold text-obsidian font-bold text-xs uppercase tracking-widest hover:bg-gold-bright transition-colors">
          <Plus className="w-4 h-4" />
          Add New Piece
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/40" />
          <input 
            type="text" 
            placeholder="Search the vault..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-ivory focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white/2 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Product</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Details</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Stock</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Price</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {allProducts.map((p) => (
              <tr key={p.id} className="hover:bg-white/3 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-14 bg-black border border-white/10 overflow-hidden shrink-0">
                      {p.images[0] ? (
                        <Image 
                          src={p.images[0].url} 
                          alt={p.name} 
                          fill 
                          sizes="48px"
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-ivory/20">No Img</div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-spectral font-bold italic">{p.name}</h4>
                      <p className="text-xs text-ivory/40 font-mono mt-0.5">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <span className="inline-block px-1.5 py-0.5 bg-white/5 text-[9px] uppercase font-bold tracking-widest text-ivory/60 border border-white/10">
                      {p.metalPurity}
                    </span>
                    <p className="text-xs text-ivory/40">{p.category?.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                     <span className={`text-sm font-mono ${p.stockQuantity <= 3 ? "text-gold font-bold" : "text-ivory"}`}>
                       {p.isInfiniteStock ? "∞" : p.stockQuantity}
                     </span>
                   </div>
                </td>
                <td className="px-6 py-4 text-sm font-mono">
                  {formatPrice(p.priceCents)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${p.isPublished ? "bg-emerald-400/10 text-emerald-400" : "bg-white/10 text-ivory/40"}`}>
                    <div className={`w-1 h-1 rounded-full ${p.isPublished ? "bg-emerald-400" : "bg-ivory/40"}`} />
                    {p.isPublished ? "Live" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <ProductRowActions 
                    productId={p.id} 
                    slug={p.slug} 
                    isPublished={p.isPublished} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
