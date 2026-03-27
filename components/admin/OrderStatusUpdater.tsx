"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { updateOrderStatus } from "@/app/admin/actions";

const STATUSES = [
  "pending",
  "paid",
  "in_production",
  "quality_check",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  in_production: "In Production",
  quality_check: "Quality Check",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-white/10 text-ivory/40",
  paid: "bg-emerald-400/10 text-emerald-400",
  in_production: "bg-amber-400/10 text-amber-400",
  quality_check: "bg-purple-400/10 text-purple-400",
  shipped: "bg-blue-400/10 text-blue-400",
  delivered: "bg-gold/10 text-gold",
  cancelled: "bg-red-400/10 text-red-400",
  refunded: "bg-red-400/10 text-red-400",
};

import type { OrderStatus } from "@/drizzle/schema";

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleUpdate = () => {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, status, trackingNumber || undefined, trackingCarrier || undefined);
        setMessage("Status updated.");
        setTimeout(() => setMessage(""), 3000);
      } catch {
        setMessage("Failed to update.");
      }
    });
  };

  const inputClass = "w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-ivory text-sm focus:border-gold/50 outline-none transition-all";

  return (
    <div className="space-y-4">
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${STATUS_COLORS[currentStatus] || STATUS_COLORS.pending}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${currentStatus === "paid" || currentStatus === "delivered" ? "bg-current" : "bg-current opacity-50"}`} />
        {STATUS_LABELS[currentStatus] || currentStatus}
      </div>

      <div className="space-y-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className={inputClass}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="bg-obsidian text-ivory">
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        {status === "shipped" && (
          <>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Tracking number"
              className={inputClass}
            />
            <input
              type="text"
              value={trackingCarrier}
              onChange={(e) => setTrackingCarrier(e.target.value)}
              placeholder="Carrier (FedEx, UPS...)"
              className={inputClass}
            />
          </>
        )}

        <button
          onClick={handleUpdate}
          disabled={isPending || status === currentStatus}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gold text-obsidian font-bold text-xs uppercase tracking-widest hover:bg-gold-bright transition-all disabled:opacity-30 rounded-lg"
        >
          {isPending ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
          {isPending ? "Updating..." : "Update Status"}
        </button>

        {message && (
          <p className="text-[10px] font-mono text-gold animate-pulse text-center uppercase tracking-widest">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
