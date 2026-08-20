import { readFileSync } from "node:fs";
import { changedFiles, fail, pass, pullRequestBody, skip } from "./lib/changed-files.mjs";

/**
 * De migratiepijplijn is het enige onderdeel van deze stack dat data onherstelbaar
 * kan vernietigen: een merge-knop die `drop column` op productie uitvoert. Deze
 * guard zorgt dat dat nooit per ongeluk gebeurt.
 *
 * Bevestigen doe je met de regel `Bevestigd: destructieve migratie` in de PR-tekst.
 */
const DESTRUCTIVE = [
  { name: "drop table", re: /\bdrop\s+table\b/i },
  { name: "drop column", re: /\bdrop\s+column\b/i },
  { name: "drop schema", re: /\bdrop\s+schema\b/i },
  { name: "drop database", re: /\bdrop\s+database\b/i },
  { name: "truncate", re: /\btruncate\b/i },
  {
    name: "delete zonder where",
    re: /\bdelete\s+from\s+[^;]*?;/i,
    guard: (m) => !/\bwhere\b/i.test(m),
  },
  { name: "drop policy", re: /\bdrop\s+policy\b/i },
  { name: "row level security uitzetten", re: /\bdisable\s+row\s+level\s+security\b/i },
  { name: "type van een kolom wijzigen", re: /\balter\s+column\b[^;]*\btype\b/i },
];

const CONFIRMATION = /^\s*Bevestigd:\s*destructieve migratie\s*$/im;

/** Haalt SQL-commentaar weg, zodat een voorbeeld in commentaar geen alarm geeft. */
function stripComments(sql) {
  return sql.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\n]*/g, " ");
}

const files = changedFiles();
if (files === null) skip("geen basis om mee te vergelijken");

const migrations = files.filter((file) => /^supabase\/migrations\/.*\.sql$/.test(file));
if (migrations.length === 0) pass("geen migraties gewijzigd");

const findings = [];
for (const file of migrations) {
  let sql;
  try {
    sql = stripComments(readFileSync(file, "utf8"));
  } catch {
    continue; // bestand is hernoemd of verwijderd
  }
  for (const rule of DESTRUCTIVE) {
    const match = rule.re.exec(sql);
    if (!match) continue;
    if (rule.guard && !rule.guard(match[0])) continue;
    findings.push(`${file}: ${rule.name}`);
  }
}

if (findings.length === 0) pass(`${migrations.length} migratie(s) gewijzigd, niets destructiefs`);

if (CONFIRMATION.test(pullRequestBody())) {
  console.log("✓ destructieve migratie, expliciet bevestigd in de PR-tekst:");
  for (const finding of findings) console.log(`  - ${finding}`);
  process.exit(0);
}

fail("Deze PR bevat een migratie die data of beveiliging kan vernietigen.", [
  ...findings.map((finding) => `- ${finding}`),
  "",
  "Controleer eerst:",
  "  - staan de back-ups aan en is de laatste back-up recent?",
  "  - is dit op productie ook echt de bedoeling, of alleen in jouw testomgeving?",
  "  - kan het ook zonder dataverlies (kolom leeg laten in plaats van weggooien)?",
  "",
  "Weet je het zeker? Zet dan deze regel exact zo in de PR-tekst:",
  "",
  "Bevestigd: destructieve migratie",
]);
