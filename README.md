# <projectnaam>

<!-- Vervang <projectnaam> en beschrijf in één zin wat deze app doet. -->

## Werk je met Claude? Begin hier

Start je Claude-sessie **in deze map**. Doet je dat niet, dan worden `CLAUDE.md` en de
afspraken in `.claude/` niet geladen en improviseert de agent er zelf iets bij.

```bash
cd <deze map>
claude
```

Vraag daarna gewoon wat je wilt. Voor de vaste routes zijn er skills die vanzelf
gebruikt worden: `verder-werken`, `databasewijziging` en `nieuwe-app-aanvragen`.

## In vijf minuten lokaal draaien

Nodig: [Node 22 of hoger](https://nodejs.org), [pnpm](https://pnpm.io) en
[Docker](https://docs.docker.com/get-started/get-docker/) (die laatste alleen voor de
database).

```bash
pnpm install          # pakketten ophalen
pnpm db:start         # lokale Supabase starten, eerste keer duurt een paar minuten
pnpm env:local        # .env.local en .env.test schrijven
pnpm dev              # app draaien op http://localhost:5173
```

Inloggen kan met een gebruiker die je zelf aanmaakt in Supabase Studio, dat na
`pnpm db:start` bereikbaar is op http://127.0.0.1:54323.

> Werk je aan iets wat je wilt **laten zien**, gebruik dan niet `pnpm dev` maar de
> Vercel-preview van je pull request. Dat is de enige link die een ander kan openen,
> en de enige die bewijst dat de gebouwde versie werkt.

## Hoe werk hier binnenkomt

```
branch maken  →  bouwen + test schrijven  →  PR openen  →  checks groen  →  mergen
```

Mergen is deployen. Er wordt nooit met de hand naar een server of console gedeployed,
en er kan niet rechtstreeks naar `main` gepusht worden, ook niet door de bouwer.

De volledige werkwijze en het waarom staat in [`docs/WERKWIJZE.md`](docs/WERKWIJZE.md).

## De kwaliteitspoort

Draait op elke pull request. Alles moet groen voordat er gemerged kan worden.

| Check | Wat hij bewaakt |
|---|---|
| Typecontrole | de code klopt met zichzelf en met het databaseschema |
| Lint en opmaak | leesbare diffs, geen stijlruzies |
| Unittests | het gedrag dat we hebben vastgelegd |
| Build | het bouwt echt |
| Geheimen | geen sleutel in de repo, en niet in de gedownloade bundel |
| Verstopte typefouten | geen `any` of `@ts-ignore` om een fout weg te drukken |
| Row level security | elke tabel heeft beveiliging én policies |
| Tests bij wijzigingen | wie code wijzigt, wijzigt ook een test |
| Destructieve migraties | dataverlies kan alleen met expliciete bevestiging |
| Types in sync | de gegenereerde databasetypes lopen niet achter |
| RLS-tests | gebruiker A komt echt niet bij de gegevens van B |
| End-to-end | de belangrijkste route door de app werkt in een echte browser |

## Omgevingsvariabelen

Zie [`.env.example`](.env.example): daar staat per variabele waar je de waarde vandaan
haalt. `.env.local` staat niet in git en hoort daar ook nooit in te komen.

## GitHub Actions-secrets

Het enige dat niet als bestand meereist. Voor een nieuw project instellen onder
Settings → Secrets and variables → Actions:

| Secret | Waarvoor |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | migraties toepassen bij een merge naar `main` |
| `SUPABASE_DB_PASSWORD` | idem, als het project daarom vraagt |
| `SUPABASE_PROJECT_REF` | welk Supabase-project het betreft |
| `SENTRY_AUTH_TOKEN` | alleen als je releases automatisch wilt melden |

De tests hebben géén secrets nodig: de CI start een eigen lokale database.

## Waar wat staat

```
src/                     de app
  components/ui/         losse bouwblokken (shadcn/ui, van jou, mag je aanpassen)
  features/              schermen en functionaliteit, per onderwerp
  lib/                   database, omgeving, validatie, hulpjes
supabase/
  migrations/            elke databasewijziging, in volgorde
  functions/             Edge Functions (Deno) voor alles met een geheime sleutel
tests/rls/               beveiligingstests
e2e/                     end-to-end tests
scripts/                 de guards uit de kwaliteitspoort
docs/WERKWIJZE.md        de werkwijze en het waarom
```
