# <projectnaam>

<!-- Vervang <projectnaam> en de regel hieronder bij het opzetten van een project.
     Alles boven de markering hoort bij dít project en wordt door de stack-sync
     nooit overschreven. -->

<!-- Wat deze app doet, in één zin, vanuit de gebruiker geschreven. -->

<!-- stack:begin -->
<!-- Alles hieronder komt uit stack-template en wordt bijgewerkt via een
     stack-sync pull request. Wijzig het niet hier; meld het bij Stage Two. -->

## Klaar is

Een taak is klaar als: er een pull request open staat, **álle** checks groen zijn, en
de Vercel-preview-link in de PR-beschrijving staat. Niet eerder. Staat er een check
rood, meld dan wat er nog mist in plaats van "het is af".

## Stack

Vite + React + TypeScript (strict) · Tailwind + shadcn/ui · React Router · Zod · pnpm.
Hosting: Vercel. Fouten: Sentry. Achtergrond en het waarom: `docs/WERKWIJZE.md`.

**De database is een keuze, geen gegeven.** In `stack.config.json` staat of deze app
Supabase (Postgres, auth, storage, RLS) gebruikt. Staat `database` op `false`, dan draait
de app alleen op Vercel: geen migraties, geen RLS-tests, geen databasejob in CI, en de
`pnpm db:*`-commando's hieronder zijn niet van toepassing. Zet hem niet op eigen houtje om;
`docs/WERKWIJZE.md` beschrijft wanneer een database nodig wordt en wat er dan moet gebeuren.

## Commando's

| Commando | Wat het doet |
|---|---|
| `pnpm check` | typecontrole, lint, unittests en guards in één keer |
| `pnpm build` | productiebuild |
| `pnpm test` | unittests |
| `pnpm db:start` | lokale Supabase starten (eerste keer duurt even) |
| `pnpm env:local` | `.env.local` en `.env.test` schrijven op basis van die database |
| `pnpm db:reset` | lokale database opnieuw opbouwen uit alle migraties |
| `pnpm db:types` | databasetypes genereren na een migratie |
| `pnpm test:rls` | beveiligingstests (database moet draaien) |
| `pnpm test:e2e` | end-to-end test in een echte browser |

## Waar wat staat

```
src/components/ui/     losse bouwblokken (shadcn/ui, staan in deze repo, mag je aanpassen)
src/features/          schermen en functionaliteit, per onderwerp
src/lib/               database, omgeving, validatie, hulpjes
supabase/migrations/   elke databasewijziging, in volgorde
supabase/functions/    Edge Functions (Deno) voor alles met een geheime sleutel
tests/rls/             beveiligingstests
e2e/                   end-to-end tests
scripts/               de guards uit de kwaliteitspoort
```

## Regels

- **Previews gaan via de Vercel-preview van de PR.** Zet geen dev-server op localhost
  op om werk te laten zien. Een hook blokkeert `pnpm dev` om die reden.
- **Geen `any`, geen `@ts-ignore`, geen `as unknown as`, geen non-null `!`.** Los de
  echte typefout op. Een groene build met verstopte fouten is erger dan een rode.
- **Databasetypes komen uit `pnpm db:types`**, nooit met de hand verzonnen. Klaagt
  TypeScript over een kolom, dan is het antwoord de typegeneratie, niet een `any`.
- **Invoer van buiten** (formulieren, webhooks, API's) valideer je met Zod.
- **Secrets nooit in de app-bundel.** Alleen de Supabase anon key mag in een
  `VITE_`-variabele; die is expres publiek en wordt door RLS beschermd. Alles met een
  geheime sleutel gaat naar een Supabase Edge Function.
- **`supabase/functions/` draait op Deno**, de rest op Node en in de browser. Imports
  zijn niet uitwisselbaar tussen die twee, en die map valt buiten `tsconfig.json`.
- **Databasewijzigingen altijd als migratie** in `supabase/migrations/`, nooit
  handmatig in de Supabase-console. Draai daarna `pnpm db:types` en commit het resultaat.
- **Elke nieuwe tabel krijgt RLS aan, een `grant` én policies**, plus een test in
  `tests/rls/` die controleert dat gebruiker A niet bij de gegevens van B komt.
- **Heeft de app geen database, verzin er dan geen.** Blijvende gegevens gaan naar Vercel
  Blob, terugkerende taken naar Vercel Cron. Merk je dat je daar een database in aan het
  namaken bent, dan is dat het signaal om `database` om te zetten, niet om door te
  modderen.
- **Wie code wijzigt, wijzigt ook een test.** Bugfix? Eerst een test die de bug
  reproduceert, dan de reparatie.
- **Eén PR = één onderwerp.** Beschrijf wat je gewijzigd hebt en waarom.
- **Pushen naar `main` kan niet en hoeft niet:** deployen gebeurt door te mergen.
- **Migraties zijn aanvullend.** Voeg een kolom toe in de ene PR en gebruik hem in de
  volgende; gooi een kolom pas weg als niets hem meer aanroept.

## Werkwijzen

Voor de vaste routes zijn er skills, gebruik die in plaats van te improviseren:

- `verder-werken`: iets toevoegen, wijzigen of repareren aan deze app
- `databasewijziging`: een tabel, kolom of policy erbij of anders
- `nieuwe-app-aanvragen`: een compleet nieuwe applicatie

## Wat je niet aanpast

`.github/workflows/`, `.claude/`, `scripts/` en `docs/WERKWIJZE.md` komen uit de
gedeelde template en worden bijgewerkt via een stack-sync pull request. Een hook
blokkeert wijzigingen daaraan. Klopt er iets niet, meld het dan bij Stage Two: dan
krijgt elk project de verbetering, in plaats van dit project alleen.

<!-- stack:end -->
