# <projectnaam>

<!-- Vervang <projectnaam> en de regel hieronder bij het opzetten van een project.
     Alles boven de markering hoort bij dít project en wordt door de stack-sync
     nooit overschreven. -->

<!-- Wat deze app doet, in één zin, vanuit de gebruiker geschreven. -->

<!-- Heeft deze app een database? Noem hier dan het Supabase-project dat de
     testdatabase is (naam en ref): waar de Vercel-preview naar wijst en waar je
     lokaal tegenaan mag kijken. Nooit het productieproject. Bijvoorbeeld:
     - Testdatabase (preview en lokaal kijken): Supabase-project `<naam>-test` (ref `<ref>`). -->

<!-- stack:begin -->
<!-- Alles hieronder komt uit stack-template en wordt bijgewerkt via een
     stack-sync pull request. Wijzig het niet hier; meld het bij Stage Two. -->

Dit bestand geldt voor **elke** agent die in deze repo werkt: Claude Code, Codex, Cursor,
Copilot of een mens zonder agent. Er is geen tweede set afspraken ergens anders.

## Klaar is

Een taak is klaar als: er een pull request open staat, **álle** checks groen zijn, en
de Vercel-preview-link in de PR-beschrijving staat. Niet eerder. Staat er een check
rood, meld dan wat er nog mist in plaats van "het is af".

## Stack

Vite + React + TypeScript (strict) · Tailwind + shadcn/ui · React Router · Zod · pnpm.
Hosting: Vercel. Fouten: Sentry. Achtergrond en het waarom: `docs/WERKWIJZE.md`.

**De database is een keuze, geen gegeven.** In `stack.config.json` staat `database`, en
die heeft drie standen:

| Stand | Wat dat betekent |
|---|---|
| `false` | geen database. De app draait alleen op Vercel; de `pnpm db:*`-commando's zijn niet van toepassing |
| `"gedeeld"` | de app gebruikt de database van een **andere** app, via haar contract (het schema `api`). Geen migraties, geen deploy naar Supabase, geen eigen RLS-tests |
| `true` | de app bezit haar eigen database. De hele laag doet mee |

De regel erachter: **precies één repo mag naar een database schrijven.** Twee repo's die
allebei migraties pushen naar hetzelfde Supabase-project lopen vast, want de toegepaste
migraties worden in de database zelf bijgehouden. Staat deze app op `"gedeeld"`, dan hoort
een schemawijziging thuis in de repo van de eigenaar, en blokkeert `guard:migrations` elke
migratie die hier terechtkomt.

Zet de stand niet op eigen houtje om; `docs/WERKWIJZE.md` beschrijft wanneer welke stand
geldt en wat er dan moet gebeuren.

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
docs/routes/           de vaste routes, stap voor stap (zie Werkwijzen)
```

## Regels

- **Previews gaan via de Vercel-preview van de PR.** Zet geen dev-server op localhost
  op om werk te laten zien. `pnpm dev` weigert om die reden; het is geen storing.
  Voor jezelf kijken tijdens het bouwen mag wél, expliciet met `STACK_ALLOW_DEV=1`
  ervoor en nooit tegen productie: volg `docs/routes/lokaal-kijken.md`.
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
- **Gebruikt deze app een gedeelde database** (`"database": "gedeeld"`), schrijf dan hier
  géén migratie. Het schema is van een andere repo. Je praat uitsluitend met het schema
  `api`: views om te lezen, functies om te schrijven. Mis je daar iets, dan is dat een
  wijziging aan het contract en dus een aanvraag bij de eigenaar, geen bestand hier.
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
- **Niet met de hand deployen** (`vercel deploy`, `supabase db push`, `supabase link`).
  Deployen doet GitHub Actions bij een merge; een handmatige ingreep laat de repo uit de
  pas lopen met de werkelijkheid.
- **Migraties zijn aanvullend.** Voeg een kolom toe in de ene PR en gebruik hem in de
  volgende; gooi een kolom pas weg als niets hem meer aanroept.

## Werkwijzen

Voor de vaste routes staat een stappenplan in `docs/routes/`. Lees het bestand **vóórdat**
je begint en loop de stappen in volgorde af, in plaats van te improviseren:

- `docs/routes/verder-werken.md`: iets toevoegen, wijzigen of repareren aan deze app.
  Dit is de route voor vrijwel elk verzoek, ook een kleinigheid.
- `docs/routes/databasewijziging.md`: een tabel, kolom of policy erbij of anders
- `docs/routes/nieuwe-app-aanvragen.md`: een compleet nieuwe applicatie
- `docs/routes/lokaal-kijken.md`: de app op je eigen computer zien terwijl je bouwt,
  inclusief wat daarvoor geïnstalleerd moet zijn en welke database je gebruikt

In Claude Code zijn dezelfde routes ook als skill beschikbaar onder dezelfde naam; die
skills verwijzen naar deze bestanden, er is maar één tekst.

## Wat je niet aanpast

`.github/workflows/`, `.claude/`, `scripts/`, `docs/WERKWIJZE.md`, `docs/routes/` en dit
bestand onder de markering komen uit de gedeelde template en worden bijgewerkt via een
stack-sync pull request. De check `guard:template` laat een PR die eraan komt rood staan;
in Claude Code houdt een hook de wijziging al bij de toetsaanslag tegen. Klopt er iets
niet, meld het dan bij Stage Two: dan krijgt elk project de verbetering, in plaats van
dit project alleen.

<!-- stack:end -->
