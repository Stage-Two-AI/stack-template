import { execFileSync } from "node:child_process";

export const TARGET = "src/lib/database.types.ts";

export const HEADER = [
  "// GEGENEREERD BESTAND, niet met de hand aanpassen.",
  "// Opnieuw genereren na een migratie: `pnpm db:types` (met `pnpm db:start` actief).",
  "// De CI controleert of dit bestand nog gelijkloopt met het databaseschema.",
].join("\n");

/** Genereert de types uit de dráaiende lokale database. */
export function generate() {
  return execFileSync("pnpm", ["exec", "supabase", "gen", "types", "typescript", "--local"], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
}

/** Haalt de kop met commentaarregels weg, zodat we alleen de inhoud vergelijken. */
export function stripHeader(text) {
  const lines = text.replaceAll("\r\n", "\n").split("\n");
  let start = 0;
  while (start < lines.length) {
    const line = lines[start]?.trim() ?? "";
    if (line === "" || line.startsWith("//")) start += 1;
    else break;
  }
  return lines.slice(start).join("\n").trim();
}
