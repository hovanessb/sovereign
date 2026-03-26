export const dynamic = "force-dynamic";

import React from "react";
import { Users } from "lucide-react";
import { getCustomers } from "@/drizzle/data/customers";
import { formatPrice } from "@/lib/helpers";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-spectral text-2xl italic font-bold">Customers</h2>
        <p className="text-sm text-ivory/50 mt-1">
          Patrons who have placed orders with the atelier.
        </p>
      </div>

      <div className="bg-white/2 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Customer</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Location</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Orders</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Total Spent</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-ivory/30">
                    <Users className="w-8 h-8" />
                    <p className="italic">No customers found yet.</p>
                  </div>
                </td>
              </tr>
            ) : (
              customers.map((c, i) => (
                <tr key={i} className="hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{c.shipping_name || "—"}</p>
                      <p className="text-[10px] text-gold font-mono mt-0.5">
                        {c.guest_email || "No email"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-ivory/60">
                    {c.shipping_city && c.shipping_country
                      ? `${c.shipping_city}, ${c.shipping_country}`
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono">{c.order_count}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">
                    {formatPrice(c.total_spent)}
                  </td>
                  <td className="px-6 py-4 text-xs text-ivory/60">
                    {c.last_order
                      ? new Date(c.last_order).toLocaleDateString()
                      : "—"}
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
