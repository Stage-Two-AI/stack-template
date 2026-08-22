import { readFileSync } from "node:fs";

/**
 * De keuzes uit `stack.config.json`, met een standaard voor projecten die dat
 * bestand nog niet hebben. Die standaard is bewust `database: true`: een bestaand
 * project dat op deze versie van de stack overstapt, moet niet ineens zijn
 * migraties en RLS-controles kwijtraken omdat er een bestand ontbreekt.
 *
 * Voor een níeuw project zet `bin/nieuw-project.sh` hem juist op `false`, want daar
 * is "geen database tenzij" de bedoelde standaard.
 */
const STANDAARD = { database: true };

export function stackConfig() {
  try {
    const gelezen = JSON.parse(readFileSync("stack.config.json", "utf8"));
    return { ...STANDAARD, ...gelezen };
  } catch {
    return STANDAARD;
  }
}

export function heeftDatabase() {
  return stackConfig().database !== false;
}
