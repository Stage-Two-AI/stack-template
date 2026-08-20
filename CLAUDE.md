# <projectnaam>

<!-- Vervang <projectnaam> en de regel hieronder bij het opzetten van een project. -->
<!-- Wat deze app doet, in één zin, vanuit de gebruiker geschreven. -->

## Klaar is

Een taak is klaar als: er een pull request open staat, **álle** checks groen zijn, en
de Vercel-preview-link in de PR-beschrijving staat. Niet eerder. Staat er een check
rood, meld dan wat er nog mist in plaats van "het is af".

## Stack

Vite + React + TypeScript (strict) · Tailwind + shadcn/ui · Supabase (Postgres, auth,
storage, RLS) · React Router · Zod · pnpm. Hosting: Vercel. Fouten: Sentry.
Achtergrond en het waarom: `docs/WERKWIJZE.md`.

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
- **Elke nieuwe tabel krijgt RLS aan, policies én een test** in `tests/rls/` die
  controleert dat gebruiker A niet bij de gegevens van B komt.
- **Wie code wijzigt, wijzigt ook een test.** Bugfix? Eerst een test die de bug
  reproduceert, dan de reparatie.
- **Eén PR = één onderwerp.** Beschrijf wat je gewijzigd hebt en waarom.
- **Pushen naar `main` kan niet en hoeft niet:** deployen gebeurt door te mergen.

## Werkwijzen

Voor de vaste routes zijn er skills, gebruik die in plaats van te improviseren:

- `verder-werken` — iets toevoegen, wijzigen of repareren aan deze app
- `databasewijziging` — een tabel, kolom of policy erbij of anders
- `nieuwe-app-aanvragen` — een compleet nieuwe applicatie

## Wat je niet aanpast

`.github/workflows/`, `.claude/` en `scripts/guard-*` komen uit de gedeelde template
en worden bijgewerkt via een stack-sync pull request. Een hook blokkeert wijzigingen
daaraan. Klopt er iets niet, meld het dan bij Stage Two: dan krijgt elk project de
verbetering, in plaats van dit project alleen.
