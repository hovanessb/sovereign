"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/helpers";
import { useCartStore } from "@/lib/store";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem } = useCartStore();

  // Hydration fix for Zustand + Next.js
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  const totalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

  return (
    <>
      {/* Floating Cart Button (visible out of drawer) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 p-3 bg-obsidian border border-white/10 rounded-full shadow-2xl hover:border-gold/50 transition-colors group"
      >
        <ShoppingCart className="w-5 h-5 text-ivory group-hover:text-gold transition-colors" />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold text-obsidian text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {items.reduce((sum, i) => sum + i.quantity, 0)}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-obsidian border-l border-white/10 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="font-spectral text-2xl italic tracking-wide text-ivory">Your Vault</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-ivory/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <ShoppingCart className="w-12 h-12 text-white/20" />
                    <p className="font-geist text-ivory/60">Your vault is currently empty.</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border border-white/5 bg-white/2">
                      <div className="relative w-20 h-24 shrink-0 bg-black">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <span className="text-xs text-ivory/40">No Image</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="font-spectral text-lg leading-tight">{item.name}</h3>
                          <p className="text-xs text-gold/80 mt-1 uppercase tracking-widest">{item.metalPurity}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <p className="font-geist-mono text-sm">{formatPrice(item.priceCents)}</p>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-white/20">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-white/10 text-ivory/70 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-geist-mono text-xs">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-white/10 text-ivory/70 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-ivory/40 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer / Checkout */}
              {items.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-black/40">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-geist text-ivory/70 uppercase tracking-widest text-xs">Subtotal</span>
                    <span className="font-geist-mono text-xl">{formatPrice(totalCents)}</span>
                  </div>
                  <button className="w-full py-4 bg-white text-black hover:bg-ivory transition-colors font-spectral text-lg tracking-wide uppercase">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
