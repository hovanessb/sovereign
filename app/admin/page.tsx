export const dynamic = "force-dynamic";

import React from "react";
import { Package, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react";
import { getProductCount, getLowStockCount } from "@/drizzle/data/products";
import { getOrderCount, getTotalRevenue } from "@/drizzle/data/orders";
import { formatPrice } from "@/lib/helpers";
import { getSiteSettings } from "@/app/admin/actions";
import { SettingsForm } from "@/components/SettingsForm";

export default async function AdminDashboardPage() {
  const productCount = await getProductCount();
  const orderCount = await getOrderCount();
  const settings = await getSiteSettings();
  const revenueTotal = await getTotalRevenue();
  const lowStockCount = await getLowStockCount();

  const stats = [
    {
      label: "Total Products",
      value: productCount,
      icon: <Package className="w-5 h-5" />,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Pending Orders",
      value: orderCount,
      icon: <ShoppingCart className="w-5 h-5" />,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      label: "Total Revenue",
      value: formatPrice(revenueTotal),
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Low Stock Items",
      value: lowStockCount,
      icon: <AlertCircle className="w-5 h-5" />,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white/2 border border-white/10 rounded-xl space-y-4">
            <div className={`p-3 rounded-lg w-fit ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-ivory/50 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-spectral font-bold mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-white/2 border border-white/10 rounded-2xl space-y-6">
          <h3 className="font-spectral text-xl italic font-semibold">Recent Activity</h3>
          <div className="space-y-4">
            <ActivityItem
              title="New Order Received"
              description="Order #8B-9122 by hovaness@bartamian.com"
              time="2 hours ago"
            />
            <ActivityItem
              title="Product Stock Alert"
              description="Square Swallow Ring 18k is down to 3 pieces."
              time="5 hours ago"
              critical
            />
            <ActivityItem
              title="Payment Confirmed"
              description="Transaction PI_82711 processed via Stripe."
              time="Yesterday"
            />
          </div>
        </div>

        <div className="p-8 bg-gold/5 border border-gold/20 rounded-2xl flex flex-col justify-center items-center text-center space-y-4">
          <Hammer className="w-12 h-12 text-gold animate-forge-pulse" />
          <h3 className="font-spectral text-2xl italic font-bold text-gold">The Forge is Active</h3>
          <p className="text-ivory/60 max-w-xs text-sm leading-relaxed">
            System monitors are operational. Inventory is synced with Supabase Realtime.
          </p>
        </div>
      </div>

      {/* Global Strategy Section */}
      <SettingsForm initialSettings={{
        makingChargePerGram: settings.makingChargePerGram,
        marginMultiplier: settings.marginMultiplier
      }} />
    </div>
  );
}

function Hammer({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0-.83-.83-.83-2.17 0-3L12 9" />
      <path d="M17.64 15 22 10.64" />
      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6l-.86.86c-.85 0-1.65.33-2.25.93h0l-1.25 1.25" />
      <path d="m15 12-4-4" />
      <path d="m11 8 8 8" />
    </svg>
  );
}

function ActivityItem({ title, description, time, critical }: { title: string; description: string; time: string; critical?: boolean }) {
  return (
    <div className="flex gap-4 items-start p-3 hover:bg-white/5 transition-colors rounded-lg group">
      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${critical ? "bg-gold animate-pulse" : "bg-white/20"}`} />
      <div>
        <h4 className="text-sm font-medium text-ivory/90">{title}</h4>
        <p className="text-xs text-ivory/50 mt-0.5">{description}</p>
        <span className="text-[10px] text-ivory/30 uppercase tracking-widest mt-2 inline-block">{time}</span>
      </div>
    </div>
  );
}
