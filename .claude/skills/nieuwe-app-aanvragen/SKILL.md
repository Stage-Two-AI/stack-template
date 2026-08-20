---
name: nieuwe-app-aanvragen
description: Een nieuwe applicatie aanvragen bij Stage Two - het idee scherp krijgen en er een complete aanvraag van maken. Gebruik dit wanneer iemand een nieuwe app, een nieuw werktuig of een losstaand nieuw systeem wil, dus niet een uitbreiding van deze app.
---

# Een nieuwe app aanvragen

Deze repo is één app. Een **nieuwe** app krijgt een eigen repo, een eigen database en
een eigen omgeving, en die worden door Stage Two opgezet. Dat is geen formaliteit: de
accounts komen op naam van de klant te staan, de beveiligingsregels moeten kloppen
vanaf dag één, en dat is werk dat je niet vanuit een bestaande repo kunt doen.

Wat je hier wél doet: het idee scherp krijgen en er een complete aanvraag van maken.
Dat scheelt een gespreksronde en meestal een week.

## Eerst: is het wel een nieuwe app?

Ga dit langs voordat je verdergaat.

| Signaal | Waarschijnlijk |
|---|---|
| Dezelfde mensen, dezelfde gegevens, een scherm erbij | **uitbreiding** van deze app |
| Andere gebruikers, of gegevens die niets met elkaar te maken hebben | nieuwe app |
| Moet vindbaar zijn in Google | nieuwe app (publieke site, ander framework) |
| "Kan dit er ook nog bij?" | vaak uitbreiding |

Is het een uitbreiding? Gebruik dan de skill `verder-werken` en stop hier.

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
5. **Moet het koppelen met iets bestaands?** Boekhouding, CRM, een machine, een
   bestaande app. Noem het systeem bij naam.
6. **Wat is de eerste versie waar iemand echt iets aan heeft?** Niet de eindversie:
   het kleinste ding dat op maandag al gebruikt zou worden.
7. **Wanneer is het nodig, en waarom dan?** Een echte aanleiding (een seizoen, een
   verhuizing, een audit) is bruikbaarder dan een datum.

## De aanvraag indienen

Vat het samen in bovenstaande zeven kopjes, schrijf het naar een bestand, en mail dat
naar **info@stagetwo.nl** met als onderwerp "Nieuwe app: <korte naam>".

Zet in de mail ook wie de contactpersoon is en wanneer je het nodig hebt. Stage Two
neemt daarna contact op om de aanvraag door te nemen.

## Wat er daarna gebeurt

Stage Two zet de omgeving op: repo, database, hosting, foutbewaking, de
kwaliteitspoort en de afspraken. Dat duurt kort. Je krijgt een repo terug die al
goed staat, met dezelfde werkwijze als deze, zodat je er meteen in kunt.

Begin dus **niet** alvast zelf met bouwen in een losse map: dat werk kan niet
overgezet worden naar de nieuwe omgeving zonder alles opnieuw te doen.
