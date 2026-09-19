# Een nieuwe app aanvragen

Deze repo is één app. Een **nieuwe** app krijgt een eigen repo en een eigen omgeving, en
die worden door Stage Two opgezet. Dat is geen formaliteit: de accounts komen op naam van
de klant te staan, de beveiligingsregels moeten kloppen vanaf dag één, en dat is werk dat
je niet vanuit een bestaande repo kunt doen.

Of die nieuwe app ook een **eigen database** krijgt, of de gegevens van een bestaande app
gebruikt, beslist Stage Two aan de hand van de antwoorden hieronder. Vraag 2 en 5 gaan
daarover. Je hoeft die afweging niet zelf te maken, je hoeft hem alleen te beantwoorden.

Wat je hier wél doet: het idee scherp krijgen en er een complete aanvraag van maken.
Dat scheelt een gespreksronde en meestal een week.

## Eerst: is het wel een nieuwe app?

Ga dit langs voordat je verdergaat.

| Signaal | Waarschijnlijk |
|---|---|
| Dezelfde mensen, dezelfde gegevens, een scherm erbij | **uitbreiding** van deze app |
| Dezelfde mensen en gegevens, maar echt een eigen werktuig | nieuwe app op de bestaande gegevens |
| Andere gebruikers, of gegevens die niets met elkaar te maken hebben | nieuwe app met eigen gegevens |
| Moet vindbaar zijn in Google | nieuwe app (publieke site, ander framework) |
| "Kan dit er ook nog bij?" | vaak uitbreiding |

Is het een uitbreiding? Volg dan de route `docs/routes/verder-werken.md` en stop hier.

## De aanvraag

Werk deze punten samen met de aanvrager uit. Vraag door tot elk punt een concreet
antwoord heeft; "dat zien we later wel" is het duurste antwoord in dit lijstje.

1. **Wat kan iemand straks dat nu niet kan?** Eén zin, in gewone taal, vanuit de
   gebruiker geschreven.
2. **Wie gaat het gebruiken?** Aantal mensen, en of het personeel is of ook mensen
   van buiten. Dit bepaalt de hele beveiligingsopzet.
3. **Moet het vindbaar zijn in Google of in een linkpreview?** Dit bepaalt de
   frameworkkeuze en is achteraf duur om te wijzigen.
4. **Welke gegevens gaan erin?** En specifiek: staan er persoonsgegevens in, of
   gegevens van klanten van de klant?
5. **Gaat deze app over gegevens die er al zijn?** Dus: over dezelfde planten, orders,
   voorraad, klanten of projecten waar een bestaande app al over gaat? Noem die app bij
   naam. Antwoord je hier ja, dan krijgt de nieuwe app **geen eigen database**: ze gebruikt
   die van de bestaande app. Dat is goedkoper, en belangrijker: het voorkomt dat dezelfde
   voorraad op twee plekken staat en uit elkaar gaat lopen.
6. **Moet het koppelen met iets bestaands buiten de eigen apps?** Boekhouding, CRM, een
   machine, een webshop. Noem het systeem bij naam.
7. **Wat is de eerste versie waar iemand echt iets aan heeft?** Niet de eindversie:
   het kleinste ding dat op maandag al gebruikt zou worden.
8. **Wanneer is het nodig, en waarom dan?** Een echte aanleiding (een seizoen, een
   verhuizing, een audit) is bruikbaarder dan een datum.

## De aanvraag indienen

Vat het samen in bovenstaande acht kopjes, schrijf het naar een bestand, en mail dat
naar **info@stagetwo.nl** met als onderwerp "Nieuwe app: <korte naam>".

Zet in de mail ook wie de contactpersoon is en wanneer je het nodig hebt. Stage Two
neemt daarna contact op om de aanvraag door te nemen.

## Wat er daarna gebeurt

Stage Two zet de omgeving op: een nieuwe repo als kopie van de openbare stack-template
(github.com/Stage-Two-AI/stack-template), de juiste databasestand (eigen of gedeeld),
hosting, foutbewaking, de kwaliteitspoort, de afspraken en de Stage Two-plugin voor
Claude Code. Dat duurt kort. Je krijgt een repo terug die al goed staat, met dezelfde
werkwijze als deze, zodat je er meteen in kunt.

Begin dus **niet** alvast zelf met bouwen in een losse map: dat werk kan niet
overgezet worden naar de nieuwe omgeving zonder alles opnieuw te doen.
