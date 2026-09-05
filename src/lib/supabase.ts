import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { env } from "@/lib/env";

/**
 * De enige Supabase-client van de app. Importeer deze; maak nergens anders een
 * tweede client aan, anders raakt de ingelogde sessie versnipperd.
 */
/**
 * Het schema waar deze app mee praat: `public` bij een eigen database, `api` bij een
 * gedeelde. Welk van de twee het is, staat in stack.config.json en komt via
 * `VITE_SUPABASE_SCHEMA` binnen; `database.types.ts` is voor precies dát ene schema
 * gegenereerd. Die koppeling kan TypeScript niet zelf zien, vandaar deze ene bewuste
 * vernauwing, en geen enkele andere in dit bestand.
 *
 * `SchemaName` leidt hetzelfde af als supabase-js zelf doet: heeft de gegenereerde
 * `Database` een `public`, dan is dat het schema; anders is het het enige andere
 * schema dat erin zit, en dat is bij een gedeelde app per definitie `api`.
 */
type SchemaName = "public" extends keyof Database
  ? "public"
  : Exclude<keyof Database, "__InternalSupabase"> & string;

const SCHEMA = env.VITE_SUPABASE_SCHEMA as SchemaName;

export const supabase = createClient<Database>(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  db: { schema: SCHEMA },
});

export type Item = Database["public"]["Tables"]["items"]["Row"];
