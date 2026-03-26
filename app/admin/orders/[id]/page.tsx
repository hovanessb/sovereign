export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Package, MapPin, CreditCard, Truck } from "lucide-react";
import { getOrderById } from "@/drizzle/data/orders";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/helpers";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 text-ivory/40 hover:text-white hover:bg-white/5 rounded-md transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="font-spectral text-2xl italic font-bold">
            Order <span className="font-mono text-gold">#{order.id.slice(0, 8).toUpperCase()}</span>
          </h2>
          <p className="text-sm text-ivory/50 mt-1">
            Placed {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Line Items */}
          <section className="p-8 bg-white/2 border border-white/10 rounded-2xl space-y-6">
            <h3 className="font-spectral text-lg italic font-semibold text-ivory/80 flex items-center gap-2">
              <Package className="w-4 h-4 text-gold" /> Items
            </h3>
            <div className="divide-y divide-white/10">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-[10px] text-ivory/40 uppercase tracking-wider mt-0.5">
                      {item.metalPurity.toUpperCase()} · Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">{formatPrice(item.lineTotalCents)}</p>
                    <p className="text-[10px] text-ivory/40 font-mono">{formatPrice(item.unitPriceCents)} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-ivory/60">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(order.subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-sm text-ivory/60">
                <span>Shipping</span>
                <span className="font-mono">{formatPrice(order.shippingCents)}</span>
              </div>
              <div className="flex justify-between text-sm text-ivory/60">
                <span>Tax</span>
                <span className="font-mono">{formatPrice(order.taxCents)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-2">
                <span>Total</span>
                <span className="font-mono text-gold">{formatPrice(order.totalCents)}</span>
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="p-8 bg-white/2 border border-white/10 rounded-2xl space-y-4">
            <h3 className="font-spectral text-lg italic font-semibold text-ivory/80 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" /> Shipping Address
            </h3>
            <div className="text-sm space-y-1 text-ivory/70">
              <p className="font-medium text-ivory">{order.shippingName}</p>
              <p>{order.shippingLine1}</p>
              {order.shippingLine2 && <p>{order.shippingLine2}</p>}
              <p>
                {order.shippingCity}, {order.shippingState} {order.shippingPostal}
              </p>
              <p className="uppercase tracking-wider text-xs text-ivory/40">{order.shippingCountry}</p>
            </div>
            {order.trackingNumber && (
              <div className="mt-4 p-3 bg-blue-400/10 border border-blue-400/20 rounded-lg text-sm">
                <div className="flex items-center gap-2 text-blue-400">
                  <Truck className="w-4 h-4" />
                  <span className="font-mono text-xs">
                    {order.trackingCarrier && `${order.trackingCarrier}: `}{order.trackingNumber}
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <section className="p-6 bg-white/2 border border-white/10 rounded-2xl space-y-4">
            <h3 className="font-spectral text-lg italic font-semibold text-ivory/80">Status</h3>
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
          </section>

          {/* Payment */}
          <section className="p-6 bg-white/2 border border-white/10 rounded-2xl space-y-4">
            <h3 className="font-spectral text-lg italic font-semibold text-ivory/80 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gold" /> Payment
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-ivory/60">
                <span>Currency</span>
                <span className="uppercase font-mono">{order.currency}</span>
              </div>
              {order.stripePaymentIntentId && (
                <div className="flex justify-between text-ivory/60">
                  <span>Payment Intent</span>
                  <span className="font-mono text-xs text-ivory/40 truncate max-w-[160px]">
                    {order.stripePaymentIntentId}
                  </span>
                </div>
              )}
              {order.paidAt && (
                <div className="flex justify-between text-ivory/60">
                  <span>Paid At</span>
                  <span className="text-xs">{new Date(order.paidAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </section>

          {/* Customer */}
          <section className="p-6 bg-white/2 border border-white/10 rounded-2xl space-y-4">
            <h3 className="font-spectral text-lg italic font-semibold text-ivory/80">Customer</h3>
            <div className="space-y-2 text-sm text-ivory/70">
              {order.profile ? (
                <>
                  <p className="font-medium text-ivory">{order.profile.displayName ?? "Unnamed"}</p>
                  {order.profile.phone && <p>{order.profile.phone}</p>}
                </>
              ) : (
                <p className="italic text-ivory/40">Guest Checkout</p>
              )}
              {order.guestEmail && (
                <p className="font-mono text-xs text-gold">{order.guestEmail}</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
