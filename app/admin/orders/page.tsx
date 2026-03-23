export const dynamic = "force-dynamic";

import React from "react";
import { Search, Eye, Truck, CheckCircle2, Clock } from "lucide-react";
import { db } from "@/drizzle/action";
import { orders } from "@/drizzle/schema";
import { formatPrice } from "@/lib/helpers";
import { desc } from "drizzle-orm";

export default async function AdminOrdersPage() {
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-spectral text-2xl italic font-bold">Order Fulfillment</h2>
        <p className="text-sm text-ivory/50 mt-1">Track and manage customer acquisitions.</p>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/40" />
          <input 
            type="text" 
            placeholder="Search orders (ID, email, name)..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-ivory focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/2 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Order ID</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Customer</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Total</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {allOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-ivory/30 italic">
                  No orders found in the ledger.
                </td>
              </tr>
            ) : (
              allOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/3 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-gold">#{order.id.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{order.shippingName || order.guestEmail}</p>
                      <p className="text-[10px] text-ivory/40 uppercase tracking-wider">{order.shippingCity}, {order.shippingCountry}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-ivory/60">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">
                    {formatPrice(order.totalCents)}
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-ivory/40 hover:text-white hover:bg-white/5 rounded-md transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-white/10 text-ivory/40",
    paid: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
    shipped: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
    delivered: "bg-gold/10 text-gold border border-gold/20",
    cancelled: "bg-red-400/10 text-red-400 border border-red-400/20",
  };

  const icons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-3 h-3" />,
    paid: <CheckCircle2 className="w-3 h-3" />,
    shipped: <Truck className="w-3 h-3" />,
    delivered: <CheckCircle2 className="w-3 h-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${styles[status] || styles.pending}`}>
      {icons[status]}
      {status}
    </span>
  );
}
