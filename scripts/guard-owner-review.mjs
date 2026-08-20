import { readFileSync } from "node:fs";
import { changedFiles, fail, pass, skip } from "./lib/changed-files.mjs";

/**
 * Op de meeste paden is zelf mergen prima: de checks zijn de reviewer. Maar er zijn
 * paden waar een fout geld of gegevens kost en waar geen test dat afvangt:
 * migraties, inloggen, en de kwaliteitspoort zelf. Daar hoort een mens naar te kijken.
 *
 * GitHub heeft daar CODEOWNERS voor, maar of "require review from Code Owners" echt
 * bijt terwijl het aantal verplichte goedkeuringen op nul staat, is per instelling en
 * per plan verschillend, en GitHub verandert dat soort gedrag. Deze guard maakt het
 * onafhankelijk van die instelling: hij kijkt zélf of er een goedkeuring van een code
 * owner ligt, en faalt anders. Wat écht niet mag gebeuren, hoort in CI.
 */
const CODEOWNERS = ".github/CODEOWNERS";
const API = "https://api.github.com";

const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;
const prNumber = process.env.PR_NUMBER;
const author = process.env.PR_AUTHOR ?? "";

if (!prNumber) skip("geen pull request, dus geen review om te controleren");

const files = changedFiles();
if (files === null) skip("geen basis om mee te vergelijken");

/**
 * CODEOWNERS-patronen omzetten naar een reguliere expressie. Ondersteund wordt de
 * vorm die wij gebruiken: een pad vanaf de wortel, eventueel met * of ** erin, en
 * een afsluitende / voor "alles in deze map".
 */
function naarRegex(patroon) {
  let p = patroon;
  const vanafWortel = p.startsWith("/");
  if (vanafWortel) p = p.slice(1);
  const mapPrefix = p.endsWith("/");
  if (mapPrefix) p = p.slice(0, -1);

  const body = p
    .split("/")
    .map((deel) =>
      deel === "**" ? "§§" : deel.replaceAll(/[.+^${}()|[\]\\]/g, "\\$&").replaceAll("*", "[^/]*"),
    )
    .join("/")
    .replaceAll("§§/", "(?:.*/)?")
    .replaceAll("§§", ".*");

  const staart = mapPrefix ? "/.*" : "(?:$|/.*)";
  return new RegExp(`^${vanafWortel ? "" : "(?:.*/)?"}${body}${staart}`);
}

function leesCodeowners() {
  let inhoud;
  try {
    inhoud = readFileSync(CODEOWNERS, "utf8");
  } catch {
    return null;
  }
  const regels = [];
  for (const regel of inhoud.split("\n")) {
    const schoon = regel.replace(/#.*$/, "").trim();
    if (!schoon) continue;
    const [patroon, ...eigenaren] = schoon.split(/\s+/);
    if (!patroon || eigenaren.length === 0) continue;
    regels.push({ regex: naarRegex(patroon), patroon, eigenaren });
  }
  return regels;
}

const regels = leesCodeowners();
if (regels === null || regels.length === 0) pass("geen CODEOWNERS, geen extra eis");

// CODEOWNERS-semantiek: de láátste regel die matcht bepaalt de eigenaren.
const geraakt = new Map();
for (const bestand of files) {
  let laatste = null;
  for (const regel of regels) {
    if (regel.regex.test(bestand)) laatste = regel;
  }
  if (laatste) geraakt.set(bestand, laatste);
}

if (geraakt.size === 0) pass("deze PR raakt geen pad met een code owner");

async function api(pad) {
  const antwoord = await fetch(`${API}${pad}`, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
    },
  });
  if (!antwoord.ok) {
    throw new Error(`${pad} gaf ${antwoord.status} ${antwoord.statusText}`);
  }
  return antwoord.json();
}

if (!token || !repo) {
  fail("Kan de goedkeuringen niet opvragen.", [
    "GH_TOKEN of GITHUB_REPOSITORY ontbreekt in de omgeving van deze stap.",
    "Zonder die gegevens kan deze guard niets controleren, en dan mag hij niet",
    "vrolijk groen worden: dat zou de bescherming stil uitzetten.",
  ]);
}

/** Zet @gebruiker en @org/team om in een verzameling gebruikersnamen. */
async function gebruikers(eigenaren) {
  const uit = new Set();
  for (const ruw of eigenaren) {
    const naam = ruw.replace(/^@/, "");
    if (!naam.includes("/")) {
      uit.add(naam.toLowerCase());
      continue;
    }
    const [org, team] = naam.split("/");
    try {
      const leden = await api(`/orgs/${org}/teams/${team}/members?per_page=100`);
      for (const lid of leden) uit.add(lid.login.toLowerCase());
    } catch (error) {
      fail(`Kan de leden van team @${naam} niet opvragen.`, [
        String(error instanceof Error ? error.message : error),
        "",
        "Twee oplossingen:",
        "  - geef de workflow leesrechten op de organisatie, of",
        "  - zet een gebruikersnaam in CODEOWNERS in plaats van een team.",
        "",
        "Deze guard faalt liever dan dat hij een team stilzwijgend overslaat.",
      ]);
    }
  }
  return uit;
}

const vereist = await gebruikers([...new Set([...geraakt.values()].flatMap((r) => r.eigenaren))]);

// De auteur kan zijn eigen PR niet goedkeuren; GitHub staat dat niet toe. Is de auteur
// de enige code owner, dan is er niemand die het kán doen en is de eis zinloos.
const anderen = new Set([...vereist].filter((naam) => naam !== author.toLowerCase()));
if (anderen.size === 0) {
  pass(`de enige code owner van deze paden is de auteur zelf (${author}), niets te vragen`);
}

let beoordelingen;
try {
  beoordelingen = await api(`/repos/${repo}/pulls/${prNumber}/reviews?per_page=100`);
} catch (error) {
  fail("Kan de goedkeuringen van deze pull request niet opvragen.", [
    String(error instanceof Error ? error.message : error),
    "",
    "Controleer of de workflow `pull-requests: read` heeft onder `permissions`.",
    "Deze guard wordt liever rood dan dat hij groen wordt zonder iets gezien te",
    "hebben: dat zou de bescherming stil uitzetten.",
  ]);
}

// Alleen de laatste beoordeling per persoon telt: een goedkeuring die later is
// ingetrokken of veranderd in "wijzigingen gevraagd" is geen goedkeuring meer.
const laatstePer = new Map();
for (const beoordeling of beoordelingen) {
  const wie = beoordeling.user?.login?.toLowerCase();
  if (!wie) continue;
  if (beoordeling.state === "COMMENTED") continue;
  laatstePer.set(wie, beoordeling.state);
}

const goedgekeurdDoor = [...laatstePer.entries()]
  .filter(([wie, staat]) => staat === "APPROVED" && anderen.has(wie))
  .map(([wie]) => wie);

if (goedgekeurdDoor.length > 0) {
  pass(`goedgekeurd door een code owner: ${goedgekeurdDoor.join(", ")}`);
}

const perEigenaar = new Map();
for (const [bestand, regel] of geraakt) {
  const sleutel = regel.eigenaren.join(" ");
  if (!perEigenaar.has(sleutel)) perEigenaar.set(sleutel, []);
  perEigenaar.get(sleutel)?.push(bestand);
}

fail("Deze PR raakt een pad waar iemand naar moet kijken.", [
  ...[...perEigenaar.entries()].flatMap(([eigenaren, bestanden]) => [
    `${eigenaren}:`,
    ...bestanden.map((bestand) => `  - ${bestand}`),
  ]),
  "",
  "Op de meeste paden zijn de checks de reviewer en mag je zelf mergen. Hier niet:",
  "een fout in een migratie, in het inloggen of in de kwaliteitspoort kost geld of",
  "gegevens, en daar is geen test die dat afvangt.",
  "",
  "Wat nu: vraag de eigenaar hierboven om de PR goed te keuren. Daarna wordt deze",
  "check bij de volgende run groen.",
]);
