import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Shared Supabase client for storage and realtime.
 * Uses anon key - restricted by RLS policies on the server/DB.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
