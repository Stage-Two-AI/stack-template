import { z } from "zod";

/**
 * Omgevingsvariabelen worden hier één keer gevalideerd, bij het opstarten van de app.
 * Zo krijg je een begrijpelijke foutmelding in plaats van een `undefined` die pas
 * drie schermen verderop stukloopt.
 *
 * Alles met de prefix VITE_ zit in de gedownloade bundel en is dus publiek.
 * Zet hier nooit een geheime sleutel neer; zie docs/WERKWIJZE.md.
 */
const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().min(1, "VITE_SUPABASE_URL ontbreekt"),
  VITE_SUPABASE_ANON_KEY: z.string().min(20, "VITE_SUPABASE_ANON_KEY ontbreekt of is te kort"),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `- ${issue.message}`).join("\n");
  throw new Error(
    `De omgevingsvariabelen kloppen niet:\n${details}\n\nKopieer .env.example naar .env.local en vul de waarden in, of draai \`pnpm env:local\` als je lokaal met Supabase werkt.`,
  );
}

export const env = parsed.data;
