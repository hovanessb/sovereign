"use client";

import React, { useState } from "react";
import { Save, RefreshCw } from "lucide-react";
import { updateSiteSettings } from "@/app/admin/actions";

interface SettingsFormProps {
  initialSettings: {
    makingChargePerGram: number;
    marginMultiplier: string;
  };
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [makingCharge, setMakingCharge] = useState(initialSettings.makingChargePerGram);
  const [multiplier, setMultiplier] = useState(initialSettings.marginMultiplier);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateSiteSettings({
        makingChargePerGram: Number(makingCharge),
        marginMultiplier: multiplier,
      });
      setMessage("Pricing strategy updated successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Failed to update settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white/2 border border-white/10 rounded-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-spectral text-xl italic font-semibold text-ivory">Global Pricing Strategy</h3>
        {message && (
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold animate-pulse">
            {message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-ivory/40">
            Artisan Making Charge ($/g)
          </label>
          <input
            type="number"
            value={makingCharge}
            step="1"
            onChange={(e) => setMakingCharge(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-ivory font-geist-mono focus:border-gold/50 outline-none transition-all"
          />
          <p className="text-[9px] text-ivory/30 italic">Flat rate added per gram of gold.</p>
        </div>

        <div className="space-y-2">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-ivory/40">
            Luxury Margin Multiplier
          </label>
          <input
            type="number"
            step="0.01"
            value={multiplier}
            onChange={(e) => setMultiplier(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-ivory font-geist-mono focus:border-gold/50 outline-none transition-all"
          />
          <p className="text-[9px] text-ivory/30 italic">Applied to (Material + Making) cost.</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-4 bg-gold text-obsidian font-bold text-xs uppercase tracking-widest hover:bg-gold-bright transition-all disabled:opacity-50"
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {loading ? "Forging Changes..." : "Secure New Strategy"}
      </button>
    </form>
  );
}
