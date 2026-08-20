import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { generate, HEADER, TARGET } from "./lib/db-types.mjs";

/**
 * Genereert de databasetypes uit de lokale database en schrijft ze weg met een
 * kop erboven, zodat een lezer meteen ziet dat dit bestand niet met de hand
 * bewerkt hoort te worden. De CI vergelijkt zonder die kop.
 */
let generated;
try {
  generated = generate();
} catch (error) {
  console.error("✗ De types konden niet gegenereerd worden.");
  console.error("  Draait de lokale database? Start hem met `pnpm db:start`.");
  console.error(String(error instanceof Error ? error.message : error));
  process.exit(1);
}

writeFileSync(TARGET, `${HEADER}\n${generated}`);
console.log(`✓ ${TARGET} bijgewerkt. Vergeet niet te committen.`);

// Meteen netjes opmaken, zodat de lint-check er niet over valt.
try {
  execFileSync("pnpm", ["exec", "biome", "format", "--write", TARGET], { stdio: "ignore" });
} catch {
  // Biome slaat dit bestand over in biome.json; niet erg als dit niets doet.
}
