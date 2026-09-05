#!/usr/bin/env node
/**
 * Onderschept tool-aanroepen van de agent vóórdat ze uitgevoerd worden.
 *
 * Het onderliggende principe: een afspraak die de agent moet ónthouden, breekt
 * uiteindelijk. Een afspraak die de tooling afdwingt, niet. Dit bestand staat
 * daarom in de repo en geldt dus automatisch ook voor de Claude-sessies van de
 * klant, zonder dat iemand iets hoeft te installeren.
 *
 * Dit is de aansluiting van Claude Code op de afspraken in AGENTS.md. Er staat hier
 * geen enkele regel die niet óók zonder deze hook wordt afgedwongen: `pnpm dev`
 * weigert zelf (scripts/dev.mjs), pushen naar main en force-pushen weigert de
 * ruleset, en wijzigingen aan de beschermde paden laat `guard:template` rood staan.
 * Deze hook maakt dat alleen eerder merkbaar: bij de toetsaanslag in plaats van
 * bij een rode check. Een andere agent zonder hooks mist dus geen afspraak, alleen
 * de snelheid waarmee hij hem hoort.
 *
 * Bewust openlaten kan met de omgevingsvariabele STACK_ALLOW_POLICY_EDIT=1,
 * voor wanneer je met opzet aan het vangnet zelf werkt.
 */

const BASH_RULES = [
  {
    re: /\b(?:pnpm|npm|yarn|bun)\s+(?:run\s+)?dev\b|\bvite\s*$|\bvite\s+(?!build|preview)/,
    reason: [
      "Geen dev-server om werk te laten zien.",
      "",
      "Previews gaan via de Vercel-preview van je pull request: dat is de enige",
      "omgeving die de klant kan openen en die is wat er ook echt live gaat.",
      "Zie docs/WERKWIJZE.md, hoofdstuk Werkafspraken.",
      "",
      "Wil je iets controleren zonder browser? Draai `pnpm test` of `pnpm test:e2e`.",
    ].join("\n"),
  },
  {
    re: /git\s+push\b[^&|;]*\b(?:main|master)\b/,
    reason: [
      "Rechtstreeks naar main pushen kan niet, en hoeft niet.",
      "",
      "Alles gaat via een pull request, ook het werk van de bouwer. Deployen = mergen.",
      "Maak een branch, open een PR en laat de checks hun werk doen.",
    ].join("\n"),
  },
  {
    re: /git\s+push\b[^&|;]*(?:--force\b|--force-with-lease\b|\s-f\b)/,
    reason: [
      "Force pushen is uitgezet op deze repo.",
      "",
      "Het herschrijft historie die anderen al hebben opgehaald. Los het op met een",
      "extra commit of een revert.",
    ].join("\n"),
  },
  {
    re: /\b(?:vercel|wrangler)\s+(?:deploy|--prod)|\bsupabase\s+(?:db\s+push|functions\s+deploy|link)\b/,
    reason: [
      "Niet met de hand deployen of aan de database van een omgeving zitten.",
      "",
      "Deployen gebeurt door te mergen: Actions past de migraties toe en Vercel zet",
      "de nieuwe versie neer. Een handmatige ingreep laat de repo uit de pas lopen",
      "met de werkelijkheid, en dan is de historie waardeloos.",
      "",
      "Databasewijziging nodig? Schrijf een migratie in supabase/migrations/.",
      "Lokaal uitproberen mag wel: `pnpm db:start` en `pnpm db:reset`.",
    ].join("\n"),
  },
];

const PROTECTED_PATHS = [
  { prefix: ".github/workflows/", what: "de kwaliteitspoort" },
  { prefix: ".github/CODEOWNERS", what: "de lijst van wie een melding krijgt" },
  { prefix: ".claude/", what: "de afspraken voor de agent" },
  { prefix: "scripts/guard-", what: "een guard-script" },
  { prefix: "scripts/check-", what: "een controlescript" },
  { prefix: "scripts/lib/", what: "gedeelde code van de guards" },
  { prefix: "scripts/write-db-types", what: "de typegeneratie" },
  { prefix: "scripts/dev.mjs", what: "de rem op de dev-server" },
  { prefix: "docs/WERKWIJZE.md", what: "de werkwijze" },
  { prefix: "docs/routes/", what: "een vaste route" },
  { prefix: "CLAUDE.md", what: "de aansluiting op AGENTS.md" },
];

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

let raw = "";
for await (const chunk of process.stdin) raw += chunk;

let payload;
try {
  payload = JSON.parse(raw);
} catch {
  process.exit(0); // geen geldige invoer: nooit in de weg lopen
}

const toolName = payload.tool_name ?? "";
const input = payload.tool_input ?? {};

if (toolName === "Bash" && typeof input.command === "string") {
  for (const rule of BASH_RULES) {
    if (rule.re.test(input.command)) deny(rule.reason);
  }
}

if (["Write", "Edit", "NotebookEdit"].includes(toolName) && typeof input.file_path === "string") {
  if (process.env.STACK_ALLOW_POLICY_EDIT === "1") process.exit(0);

  const relative = input.file_path.replace(`${process.cwd()}/`, "");
  for (const path of PROTECTED_PATHS) {
    if (relative.startsWith(path.prefix)) {
      deny(
        [
          `Dit bestand hoort bij ${path.what} en wordt niet per project gewijzigd.`,
          "",
          `Bestand: ${relative}`,
          "",
          "Deze bestanden komen uit stack-template en worden bijgewerkt via een",
          "stack-sync pull request, zodat elk project dezelfde afspraken houdt.",
          "Wijzig je het hier, dan laat de check guard:template de PR rood staan",
          "en wordt het bij de volgende sync overschreven.",
          "",
          "Klopt er echt iets niet? Meld het bij Stage Two, dan passen we het",
          "in de template aan en krijgt iedereen de verbetering.",
        ].join("\n"),
      );
    }
  }
}

process.exit(0);
