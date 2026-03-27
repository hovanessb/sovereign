import { db } from "../action";
import { orders } from "../schema";
import { count, eq, ilike, or, desc, sql } from "drizzle-orm";

export async function getOrders(filter?: { q?: string }) {
  const searchFilter = filter?.q
    ? or(
        ilike(orders.shippingName, `%${filter.q}%`),
        ilike(orders.guestEmail, `%${filter.q}%`),
        ilike(orders.id, `%${filter.q}%`)
      )
    : undefined;

  return await db.query.orders.findMany({
    where: searchFilter,
    orderBy: [desc(orders.createdAt)],
  });
}

export async function getOrderById(id: string) {
  return await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: {
        with: {
          product: true,
        },
      },
      profile: true,
    },
  });
}

export async function getOrderCount() {
  const [result] = await db.select({ value: count() }).from(orders);
  return result.value;
}

export async function getTotalRevenue() {
  const [result] = await db.select({
    total: sql<number>`COALESCE(SUM(total_cents), 0)`
  }).from(orders).where(eq(orders.status, "paid"));
  
  return (result.total as number) || 0;
}

import type { OrderStatus } from "../schema";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  trackingCarrier?: string
) {
  const now = new Date();
  const updateData: Partial<typeof orders.$inferInsert> = {
    status,
    updatedAt: now,
  };

  if (status === "paid") updateData.paidAt = now;
  if (status === "shipped") {
    updateData.shippedAt = now;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (trackingCarrier) updateData.trackingCarrier = trackingCarrier;
  }
  if (status === "delivered") updateData.deliveredAt = now;

  return await db.update(orders)
    .set(updateData)
    .where(eq(orders.id, orderId))
    .returning();
}
