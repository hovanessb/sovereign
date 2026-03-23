/**
 * BARTAMIAN — Drizzle DB Client
 * ─────────────────────────────────────────────────────────────────────────────
 * Initializes a singleton Drizzle client connected to Supabase Postgres
 * via the `postgres` driver (node-postgres compatible, edge-safe with neon).
 *
 * Connection strategy:
 *   • In development: uses a direct connection pool (faster, no cold starts).
 *   • In production (Vercel serverless/edge): uses a connection pooler
 *     (Supabase Pooler on port 6543, session mode) to avoid exhausting
 *     Postgres connection limits.
 *
 * Usage:
 *   import { db } from "@/db";
 *   const products = await db.select().from(productsTable);
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// ─── Connection URL ───────────────────────────────────────────────────────────

/**
 * Use the Supabase connection pooler in production to survive serverless cold
 * starts and high concurrency. In local dev, use the direct URL for DX speed.
 *
 * Set both in .env.local:
 *   DATABASE_URL            = postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
 *   DATABASE_URL_DIRECT     = postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
 */
const connectionString =
    process.env.NODE_ENV === "production"
        ? process.env.DATABASE_URL!          // pooler (port 6543)
        : process.env.DATABASE_URL_DIRECT!;  // direct (port 5432)

// ─── Postgres Driver ──────────────────────────────────────────────────────────

/**
 * Singleton pattern for the database client to prevent connection leaks
 * during Next.js Hot Module Replacement (HMR) in development.
 */
declare global {
  // eslint-disable-next-line no-var
  var postgresClient: ReturnType<typeof postgres> | undefined;
}

const client = global.postgresClient || postgres(connectionString, {
    prepare: false,
    max: process.env.NODE_ENV === "production" ? 1 : 10,
});

if (process.env.NODE_ENV !== "production") {
    global.postgresClient = client;
}

// ─── Drizzle Instance ─────────────────────────────────────────────────────────

export const db = drizzle(client, {
    schema,
    logger: process.env.NODE_ENV === "development",
});

// Re-export schema types for convenience
export * from "./schema";