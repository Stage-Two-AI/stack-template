import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

/**
 * De gegenereerde databasetypes zijn de brug tussen je database en je code.
 * Lopen ze uit de pas, dan denkt TypeScript dat een kolom bestaat die er niet
 * meer is, en faalt je app pas in productie in plaats van in de CI.
 *
 * De Supabase CLI zit als devDependency in package.json, dus iedereen (en de CI)
 * genereert met exact dezelfde versie. Dat is geen detail: een andere CLI-versie
 * geeft een andere opmaak en dus een valse mismatch.
 */
const TARGET = "src/lib/database.types.ts";

let generated;
try {
  generated = execFileSync("pnpm", ["exec", "supabase", "gen", "types", "typescript", "--local"], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
} catch (error) {
  console.error("✗ De types konden niet gegenereerd worden.");
  console.error("  Draait de lokale database? Start hem met `pnpm db:start`.");
  console.error(String(error instanceof Error ? error.message : error));
  process.exit(1);
}

const committed = readFileSync(TARGET, "utf8");
const normalise = (text) => text.replaceAll("\r\n", "\n").trim();

if (normalise(generated) === normalise(committed)) {
  console.log(`✓ ${TARGET} loopt gelijk met het databaseschema`);
  process.exit(0);
}

console.error(`\n✗ ${TARGET} loopt niet gelijk met het databaseschema.\n`);
console.error("  Draai `pnpm db:types` en commit het resultaat.\n");
console.error("  Dit is wat er gegenereerd wordt:\n");
console.error("----- BEGIN GEGENEREERDE TYPES -----");
console.error(generated);
console.error("----- EINDE GEGENEREERDE TYPES -----");
process.exit(1);
