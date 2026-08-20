import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

/**
 * Schrijft .env.local (voor de app) en .env.test (voor de RLS-tests) op basis van
 * de draaiende lokale Supabase. Beide bestanden staan in .gitignore.
 *
 * De service role key komt alleen in .env.test terecht, nooit in een VITE_-variabele:
 * die zou anders in de bundel belanden.
 */
let raw;
try {
  raw = execFileSync("pnpm", ["exec", "supabase", "status", "-o", "env"], { encoding: "utf8" });
} catch {
  console.error("✗ Kon de status van de lokale Supabase niet ophalen.");
  console.error("  Start hem eerst met `pnpm db:start`.");
  process.exit(1);
}

const values = new Map();
for (const line of raw.split("\n")) {
  const match = /^([A-Z_]+)="?([^"]*)"?$/.exec(line.trim());
  if (match?.[1] && match[2] !== undefined) values.set(match[1], match[2]);
}

const apiUrl = values.get("API_URL");
const anonKey = values.get("ANON_KEY");
const serviceRoleKey = values.get("SERVICE_ROLE_KEY");

if (!apiUrl || !anonKey || !serviceRoleKey) {
  console.error("✗ De statusuitvoer bevatte niet alle verwachte waarden.");
  process.exit(1);
}

writeFileSync(
  ".env.local",
  `# Automatisch geschreven door \`pnpm env:local\`. Niet committen.\nVITE_SUPABASE_URL=${apiUrl}\nVITE_SUPABASE_ANON_KEY=${anonKey}\n`,
);

const testEnv = [
  "# Automatisch geschreven door `pnpm env:local`. Niet committen.",
  "# Alleen voor de RLS-tests en de end-to-end test: deze sleutel gaat langs alle",
  "# beveiliging heen en hoort dus nooit in een VITE_-variabele.",
  `SUPABASE_URL=${apiUrl}`,
  `SUPABASE_ANON_KEY=${anonKey}`,
  `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`, // guard-secrets:allow
  "",
].join("\n");

writeFileSync(".env.test", testEnv);

console.log("✓ .env.local en .env.test geschreven op basis van de lokale Supabase");
