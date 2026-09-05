# <projectnaam>

<!-- Vervang <projectnaam> en schrijf hieronder in één zin wat deze app doet,
     in gewone taal, vanuit de gebruiker. -->

## Wat je hier vindt

Dit is de werkplaats van deze applicatie. Alles wat de app doet staat hier, en elke
wijziging die ooit gemaakt is, is hier terug te vinden.

Je hoeft geen programmeur te zijn om hier te werken. Je beschrijft in gewone taal wat
je wilt, je AI-assistent maakt de wijziging, en een reeks automatische controles kijkt
mee voordat er iets live gaat. Die controles zijn je vangnet: ze zijn er zodat je kunt
experimenteren zonder iets kapot te kunnen maken.

Welke assistent je gebruikt maakt niet uit: Claude Code, Codex, Cursor, Copilot of een
andere. De afspraken staan in `AGENTS.md`, en dat bestand lezen ze allemaal. De
controles zijn voor iedereen hetzelfde.

## Beginnen

Open je assistent **in deze map**. Dat is belangrijk: alleen dan leest hij de afspraken
die bij dit project horen. Doe je het ergens anders, dan verzint hij zijn eigen werkwijze.

```
cd <deze map>
claude        # of: codex, cursor, ... wat je ook gebruikt
```

Vraag daarna gewoon wat je wilt, bijvoorbeeld "kun je een filter op datum toevoegen aan
het overzicht". De vaste route staat in `docs/routes/verder-werken.md`; je assistent
hoort die zelf te pakken. Doet hij dat niet, zeg dan: "volg de route in
docs/routes/verder-werken.md".

## Hoe een wijziging live komt

Altijd via dezelfde vijf stappen. Ook voor een komma, en ook als Stage Two het doet.

1. **Een aftakking maken.** Je werkt aan een kopie, niet aan de live versie. Er kan dus
   niets misgaan terwijl je bezig bent.
2. **De wijziging maken**, met een test erbij die vastlegt wat er nu anders is.
3. **Een voorstel openen** (een "pull request"). Dat is de plek waar je ziet wat er
   precies verandert.
4. **De controles laten draaien.** Ze moeten allemaal groen zijn. Rood betekent: er is
   iets mis, en het gaat niet live.
5. **Op de knop Merge drukken.** Dat is het moment dat het live gaat. Er is verder geen
   knop en geen handeling nodig.

Bij stap 3 krijg je een **preview-link**: een echte, werkende versie van de app met
jouw wijziging erin, die je kunt openen en aan een collega kunt sturen. Gebruik altijd
die link om iets te laten zien, nooit een adres dat met `localhost` begint. Dat laatste
werkt alleen op de computer waar het draait.

## De controles, in gewone taal

Ze draaien vanzelf zodra je een voorstel opent. Duurt bij elkaar een paar minuten.

| Wat er gecontroleerd wordt | Waarom |
|---|---|
| Klopt de code met zichzelf | de meeste fouten vallen hier al door de mand |
| Is de opmaak netjes | zodat je kunt zien wat er echt verandert |
| Doen de bestaande functies het nog | voorkomt dat een nieuwe wens iets ouds sloopt |
| Bouwt de app echt | een app die niet bouwt, gaat ook niet live |
| Staat er geen wachtwoord of sleutel in | dit is de gevaarlijkste fout die er bestaat |
| Zijn er geen fouten weggemoffeld | een groene controle mag niet gekocht zijn |
| Is elke tabel afgeschermd | anders kan iemand bij gegevens van een ander |
| Zit er een test bij je wijziging | anders kijkt er niemand meer mee |
| Gaan er geen gegevens verloren | verwijderen kan alleen als je het bewust bevestigt |
| Zijn de gedeelde afspraken ongemoeid | anders heeft dit project stilletjes andere regels dan de rest |
| Klopt de app nog met de database | voorkomt fouten die pas live zichtbaar zouden zijn |
| Werkt de belangrijkste route nog | inloggen, iets toevoegen, het terugzien |

**Staat er iets rood?** Vraag je assistent wat er misgaat en om het op te lossen. Zet
een controle nooit uit om verder te kunnen. Ze staan er juist voor de momenten dat je
haast hebt.

## Als je iets nodig hebt

- **Een wijziging aan deze app**: gewoon vragen; de route staat in
  `docs/routes/verder-werken.md`.
- **Een compleet nieuwe app**: vraag je assistent om de aanvraag met je uit te werken
  langs `docs/routes/nieuwe-app-aanvragen.md`, dan komt hij bij Stage Two terecht. Een
  nieuwe app krijgt een eigen werkplaats, dus die kun je niet vanuit deze map beginnen.
- **Iets aan de instellingen, toegang of een rekening**: dat regelt Stage Two.

## Voor wie het naadje van de kous wil

- De volledige werkwijze en het waarom van elke keuze: [`docs/WERKWIJZE.md`](docs/WERKWIJZE.md)
- De afspraken zoals elke assistent ze leest: [`AGENTS.md`](AGENTS.md)
- De vaste routes, stap voor stap: [`docs/routes/`](docs/routes/)

## Zelf op je computer draaien (optioneel)

Alleen nodig als je zonder internet wilt kunnen werken of iets wilt uitproberen zonder
er een voorstel van te maken. Je hebt [Node](https://nodejs.org),
[pnpm](https://pnpm.io) en [Docker](https://docs.docker.com/get-started/get-docker/)
nodig. Lukt het niet in tien minuten, vraag het dan aan Stage Two in plaats van door te
worstelen.

```
pnpm install                  # eenmalig, haalt alles op wat de app nodig heeft
pnpm db:start                 # start een database op je eigen computer
pnpm env:local                # zet de instellingen goed
STACK_ALLOW_DEV=1 pnpm dev    # de app draait nu op http://localhost:5173
```

Dat `STACK_ALLOW_DEV=1` ervoor is geen vergissing: zonder die variabele weigert `pnpm dev`.
Dat is zo omdat een adres op je eigen computer nooit de manier is om werk te laten zien;
daarvoor is de preview-link. Voor jezelf even kijken mag natuurlijk wel.
