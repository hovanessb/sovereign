"use client";

import { useTransition } from "react";
import { Edit3, Trash2, ExternalLink, Power, PowerOff } from "lucide-react";
import Link from "next/link";
import { toggleProductPublication, deleteProduct } from "../actions";

export function ProductRowActions({ 
  productId, 
  slug, 
  isPublished 
}: { 
  productId: string; 
  slug: string; 
  isPublished: boolean 
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleProductPublication(productId, !isPublished);
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove this piece from the ledger?")) {
      startTransition(async () => {
        await deleteProduct(productId);
      });
    }
  };

  return (
    <div className={`flex items-center justify-end gap-2 ${isPending ? "opacity-30 cursor-wait" : ""}`}>
      <button 
        onClick={handleToggle}
        title={isPublished ? "Unpublish" : "Publish"}
        className={`p-2 rounded-md transition-all ${isPublished ? "text-emerald-400 hover:bg-emerald-400/10" : "text-ivory/40 hover:text-white hover:bg-white/5"}`}
      >
        {isPublished ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
      </button>
      <button className="p-2 text-ivory/40 hover:text-white hover:bg-white/5 rounded-md transition-all">
        <Edit3 className="w-4 h-4" />
      </button>
      <button 
        onClick={handleDelete}
        className="p-2 text-ivory/40 hover:text-red-400 hover:bg-red-400/5 rounded-md transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <Link href={`/products/${slug}`} target="_blank" className="p-2 text-ivory/40 hover:text-gold hover:bg-gold/5 rounded-md transition-all">
        <ExternalLink className="w-4 h-4" />
      </Link>
    </div>
  );
}
