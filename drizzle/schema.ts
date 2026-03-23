/**
 * BARTAMIAN — Database Schema
 * ─────────────────────────────────────────────────────────────────────────────
 * Engine:  Drizzle ORM + Supabase Postgres
 * Pattern: Normalized relational model with UUID primary keys.
 *
 * Tables:
 *   categories    – Product taxonomy (rings, chains, pendants…)
 *   products      – The Vault. Every piece BARTAMIAN has ever forged.
 *   product_images– Ordered image gallery per product.
 *   orders        – Customer purchase records linked to Stripe sessions.
 *   order_items   – Line items joining orders to products.
 *   profiles      – Extended Supabase auth.users metadata.
 */

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  integer,
  bigint,
  boolean,
  numeric,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────────────────────────

/** ISO metal purity standards used across all BARTAMIAN pieces. */
export const metalPurityEnum = pgEnum("metal_purity", [
  "9k",   // 375‰ — entry
  "14k",  // 585‰ — standard
  "18k",  // 750‰ — premium
  "22k",  // 916‰ — high
  "24k",  // 999‰ — pure sovereign
]);

/** Finish applied to the raw cast piece. */
export const finishEnum = pgEnum("finish", [
  "polished",
  "brushed",
  "hammered",
  "sandblasted",
  "oxidized",
]);

/** Fulfillment lifecycle. */
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "in_production",   // the forge is working
  "quality_check",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

// ─── Profiles ────────────────────────────────────────────────────────────────

/**
 * Mirrors Supabase auth.users (1-to-1).
 * Created automatically via a Supabase DB trigger on auth.users insert.
 */
export const profiles = pgTable(
  "profiles",
  {
    id:          uuid("id").primaryKey(),            // FK → auth.users.id
    displayName: text("display_name"),
    avatarUrl:   text("avatar_url"),
    phone:       varchar("phone", { length: 32 }),
    shippingAddress: text("shipping_address"),       // JSON string for simplicity; expand to JSONB if needed
    stripeCustomerId: varchar("stripe_customer_id", { length: 64 }).unique(),
    createdAt:   timestamp("created_at", { withTimezone: true })
                   .notNull()
                   .defaultNow(),
    updatedAt:   timestamp("updated_at", { withTimezone: true })
                   .notNull()
                   .defaultNow()
                   .$onUpdate(() => sql`now()`),
  },
  (t) => [
    uniqueIndex("profiles_stripe_customer_id_idx").on(t.stripeCustomerId),
  ]
);

// ─── Categories ──────────────────────────────────────────────────────────────

export const categories = pgTable(
  "categories",
  {
    id:          uuid("id").primaryKey().defaultRandom(),
    name:        varchar("name", { length: 80 }).notNull(),
    slug:        varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    sortOrder:   integer("sort_order").notNull().default(0),
    createdAt:   timestamp("created_at", { withTimezone: true })
                   .notNull()
                   .defaultNow(),
  },
  (t) => [
    uniqueIndex("categories_slug_idx").on(t.slug),
  ]
);

// ─── Products ─────────────────────────────────────────────────────────────────

/**
 * The Vault — every piece BARTAMIAN offers.
 *
 * `priceId` is the Stripe Price ID (price_xxxxxxxxxx).
 * `weightGrams` enables precise pricing adjustments and shipping calculation.
 * `metalPurity` + `finish` define the material identity of the piece.
 * `stockQuantity` drives the real-time inventory counter (Supabase Realtime).
 * `isFeatured` surfaces pieces in the hero gallery and editorial sections.
 */
export const products = pgTable(
  "products",
  {
    id:             uuid("id").primaryKey().defaultRandom(),
    categoryId:     uuid("category_id")
                      .notNull()
                      .references(() => categories.id, { onDelete: "restrict" }),

    // Identity
    name:           varchar("name", { length: 120 }).notNull(),
    slug:           varchar("slug", { length: 140 }).notNull().unique(),
    description:    text("description").notNull(),
    shortDesc:      varchar("short_desc", { length: 240 }),

    // Commerce
    priceId:        varchar("price_id", { length: 64 }).notNull(),   // Stripe Price ID
    priceCents:     bigint("price_cents", { mode: "number" }).notNull(), // stored in lowest denomination (USD cents)
    compareAtCents: bigint("compare_at_cents", { mode: "number" }), // original / crossed-out price

    // Material
    metalPurity:    metalPurityEnum("metal_purity").notNull(),
    finish:         finishEnum("finish").notNull().default("polished"),
    weightGrams:    numeric("weight_grams", { precision: 8, scale: 2 }), // e.g. "24.50"

    // Inventory
    stockQuantity:  integer("stock_quantity").notNull().default(0),
    isInfiniteStock: boolean("is_infinite_stock").notNull().default(false), // for made-to-order

    // Display
    isFeatured:     boolean("is_featured").notNull().default(false),
    isPublished:    boolean("is_published").notNull().default(false),
    sortOrder:      integer("sort_order").notNull().default(0),

    // SEO
    metaTitle:      varchar("meta_title", { length: 120 }),
    metaDescription: varchar("meta_description", { length: 200 }),

    // Audit
    createdAt:      timestamp("created_at", { withTimezone: true })
                      .notNull()
                      .defaultNow(),
    updatedAt:      timestamp("updated_at", { withTimezone: true })
                      .notNull()
                      .defaultNow()
                      .$onUpdate(() => sql`now()`),
  },
  (t) => [
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_category_id_idx").on(t.categoryId),
    index("products_is_published_idx").on(t.isPublished),
    index("products_is_featured_idx").on(t.isFeatured),
  ]
);

// ─── Product Images ──────────────────────────────────────────────────────────

/**
 * Ordered gallery of images for each product.
 * Stored in Supabase Storage; `url` is the public CDN URL.
 * `position` = 0 is the hero/primary image shown in the vault grid.
 */
export const productImages = pgTable(
  "product_images",
  {
    id:        uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
                 .notNull()
                 .references(() => products.id, { onDelete: "cascade" }),
    url:       text("url").notNull(),
    altText:   varchar("alt_text", { length: 200 }),
    position:  integer("position").notNull().default(0),
    width:     integer("width"),
    height:    integer("height"),
    createdAt: timestamp("created_at", { withTimezone: true })
                 .notNull()
                 .defaultNow(),
  },
  (t) => [
    index("product_images_product_id_idx").on(t.productId),
  ]
);

// ─── Orders ──────────────────────────────────────────────────────────────────

/**
 * One record per completed checkout session.
 * `stripeSessionId` and `stripePaymentIntentId` are both stored for
 * webhook reconciliation and refund flows.
 */
export const orders = pgTable(
  "orders",
  {
    id:                    uuid("id").primaryKey().defaultRandom(),
    profileId:             uuid("profile_id")
                             .references(() => profiles.id, { onDelete: "set null" }),

    // Stripe references
    stripeSessionId:       varchar("stripe_session_id", { length: 128 }).unique(),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 128 }).unique(),

    // Financials
    subtotalCents:         bigint("subtotal_cents", { mode: "number" }).notNull(),
    shippingCents:         bigint("shipping_cents", { mode: "number" }).notNull().default(0),
    taxCents:              bigint("tax_cents",      { mode: "number" }).notNull().default(0),
    totalCents:            bigint("total_cents",    { mode: "number" }).notNull(),
    currency:              varchar("currency", { length: 3 }).notNull().default("usd"),

    // Status
    status:                orderStatusEnum("status").notNull().default("pending"),

    // Shipping
    shippingName:          text("shipping_name"),
    shippingLine1:         text("shipping_line1"),
    shippingLine2:         text("shipping_line2"),
    shippingCity:          text("shipping_city"),
    shippingState:         text("shipping_state"),
    shippingPostal:        varchar("shipping_postal",  { length: 20 }),
    shippingCountry:       varchar("shipping_country", { length: 2 }),
    trackingNumber:        varchar("tracking_number",  { length: 128 }),
    trackingCarrier:       varchar("tracking_carrier", { length: 64 }),

    // Guest checkout email (populated when profileId is null)
    guestEmail:            varchar("guest_email", { length: 255 }),

    // Audit
    paidAt:                timestamp("paid_at",     { withTimezone: true }),
    shippedAt:             timestamp("shipped_at",  { withTimezone: true }),
    deliveredAt:           timestamp("delivered_at",{ withTimezone: true }),
    createdAt:             timestamp("created_at",  { withTimezone: true })
                             .notNull()
                             .defaultNow(),
    updatedAt:             timestamp("updated_at",  { withTimezone: true })
                             .notNull()
                             .defaultNow()
                             .$onUpdate(() => sql`now()`),
  },
  (t) => [
    index("orders_profile_id_idx").on(t.profileId),
    index("orders_status_idx").on(t.status),
    uniqueIndex("orders_stripe_session_id_idx").on(t.stripeSessionId),
  ]
);

// ─── Order Items ─────────────────────────────────────────────────────────────

/**
 * Line items within each order.
 * `unitPriceCents` is snapshotted at purchase time—product prices can change.
 */
export const orderItems = pgTable(
  "order_items",
  {
    id:             uuid("id").primaryKey().defaultRandom(),
    orderId:        uuid("order_id")
                      .notNull()
                      .references(() => orders.id, { onDelete: "cascade" }),
    productId:      uuid("product_id")
                      .references(() => products.id, { onDelete: "set null" }),

    // Snapshot (preserved even if product is deleted/edited)
    productName:    varchar("product_name", { length: 120 }).notNull(),
    metalPurity:    metalPurityEnum("metal_purity").notNull(),
    unitPriceCents: bigint("unit_price_cents", { mode: "number" }).notNull(),
    quantity:       integer("quantity").notNull().default(1),
    lineTotalCents: bigint("line_total_cents", { mode: "number" }).notNull(),

    createdAt:      timestamp("created_at", { withTimezone: true })
                      .notNull()
                      .defaultNow(),
  },
  (t) => [
    index("order_items_order_id_idx").on(t.orderId),
    index("order_items_product_id_idx").on(t.productId),
  ]
);

// ─── Site Settings ───────────────────────────────────────────────────────────

/**
 * Global configuration for the atelier.
 * Controls pricing logic and other site-wide constants.
 */
export const siteSettings = pgTable(
  "site_settings",
  {
    id:                  uuid("id").primaryKey().defaultRandom(),
    makingChargePerGram: integer("making_charge_per_gram").notNull().default(25),
    marginMultiplier:    numeric("margin_multiplier", { precision: 4, scale: 2 })
                           .notNull()
                           .default("2.5"),
    updatedAt:           timestamp("updated_at", { withTimezone: true })
                           .notNull()
                           .defaultNow()
                           .$onUpdate(() => sql`now()`),
  }
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields:     [products.categoryId],
    references: [categories.id],
  }),
  images:     many(productImages),
  orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields:     [productImages.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  profile: one(profiles, {
    fields:     [orders.profileId],
    references: [profiles.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields:     [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields:     [orderItems.productId],
    references: [products.id],
  }),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
  orders: many(orders),
}));

// ─── Type Exports ────────────────────────────────────────────────────────────

export type Profile      = typeof profiles.$inferSelect;
export type NewProfile   = typeof profiles.$inferInsert;

export type Category     = typeof categories.$inferSelect;
export type NewCategory  = typeof categories.$inferInsert;

export type Product      = typeof products.$inferSelect;
export type NewProduct   = typeof products.$inferInsert;

export type ProductImage    = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;

export type Order        = typeof orders.$inferSelect;
export type NewOrder     = typeof orders.$inferInsert;

export type OrderItem    = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type SiteSettings    = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;

export type MetalPurity  = (typeof metalPurityEnum.enumValues)[number];
export type Finish       = (typeof finishEnum.enumValues)[number];
export type OrderStatus  = (typeof orderStatusEnum.enumValues)[number];
