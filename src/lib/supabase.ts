import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { env } from "@/lib/env";

/**
 * De enige Supabase-client van de app. Importeer deze; maak nergens anders een
 * tweede client aan, anders raakt de ingelogde sessie versnipperd.
 */
export const supabase = createClient<Database>(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

export type Item = Database["public"]["Tables"]["items"]["Row"];
