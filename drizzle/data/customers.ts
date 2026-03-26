import { db } from "../action";
import { sql } from "drizzle-orm";

export type CustomerStats = {
  [key: string]: any;
  guest_email: string | null;
  shipping_name: string | null;
  shipping_city: string | null;
  shipping_country: string | null;
  order_count: number;
  total_spent: number;
  last_order: string;
}

export async function getCustomers() {
  // Aggregate customer data from orders (since profiles are auth-managed)
  const customers = await db.execute<CustomerStats>(sql`
    SELECT
      guest_email,
      shipping_name,
      shipping_city,
      shipping_country,
      COUNT(*)::int as order_count,
      COALESCE(SUM(total_cents), 0)::int as total_spent,
      MAX(created_at)::text as last_order
    FROM orders
    GROUP BY guest_email, shipping_name, shipping_city, shipping_country
    ORDER BY MAX(created_at) DESC
  `);

  return customers;
}
