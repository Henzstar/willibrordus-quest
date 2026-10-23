# Willibrordus Quest · Wie stuurt?

Kleine browsergame voor de werksessie van 9 november 2026 (GGZ NHN) en daarna voor solo-spel. Statische site zonder build-stap en zonder dependencies. Zie `SPEC.md` voor de opdracht en `CLAUDE.md` voor de projectregels.

## Lokaal starten
```
python3 -m http.server 8000
```
Open daarna `http://localhost:8000/` (de game) of `http://localhost:8000/beamer.html?min=30` (het scherm met kaart, aftelklok en URL). Op een telefoon in hetzelfde netwerk: gebruik het IP-adres van je computer in plaats van `localhost`.

## Testen
```
node --check js/*.js
node --test
```
De test controleert de tilemap (22 rijen van 48 tekens), of elke locatie begaanbaar en bereikbaar is, unieke ids, drie opties met effect per dilemma en een kaart per gebouw. Handmatig doorspelen gaat via de server hierboven.

## Deployen op GitHub Pages
1. Repo op GitHub: Settings → Pages → Source "Deploy from a branch", branch `main`, map `/ (root)`.
2. Na een push naar `main` staat de game binnen een minuut op `https://<gebruiker>.github.io/willibrordus-quest/`.
3. Het bord staat op dezelfde plek onder `beamer.html`. Alle paden zijn relatief, dus de submap is geen probleem.

## Waar staat wat
- `js/content.js`: alle teksten, gebouwen, dilemma's, kaarten, zelfcheck, agenda-lijsten, tilemap, straatnamen en avatars. Alleen hier teksten wijzigen.
- `js/config.js`: eventId, firebaseUrl en boardEnabled voor het live bord (fase 2). Nu leeg.
- `js/map.js`: kaart, camera, looppad, sprites. `js/game.js`: spelloop en opslag. `js/ui.js`: schermen en dialoogbox. `js/sfx.js`: geluid (standaard uit).
- `css/style.css`: stijl. `ref/demo.html`: de oorspronkelijke stijlreferentie.
- `test/content.test.mjs`: de test.

## Nog in te vullen door Tjeerd
Zoek in `js/content.js` op `TJEERD`. Open plekken: functie van De Olvendijk en Olvendijk 79; het gebouw voor de beslisondersteuning (nu id `poli`, tegel 13,4, naam met placeholder); cijfers spraakgestuurd rapporteren; toegestane AI-tools; wat er met opgenomen audio gebeurt; de afspraak over toestemming en opname; de naam en route van de stuurgroep; de noodprocedure bij EPD-uitval; datum en doelgroep van de e-learning; aanvulling op de agenda-lijst.

## Spelverloop
Start (naam, team of alleen, avatar) → kaart → acht gebouwen met elk een dilemma en een moet-weten-kaart → zelfcheck → agenda → eindscherm met profiel, score, kaarten en agenda. Voortgang staat in localStorage; herladen verliest niets. Het menu (knop in de HUD) geeft kaarten, zelfcheck, agenda, geluid en opnieuw beginnen. Op desktop: pijltjestoetsen lopen, Enter is "A".

## Fase 2 (volgt)
Live bord via Firebase Realtime Database zonder SDK. Tjeerd maakt het project aan en zet twee waarden in `js/config.js`. De details komen in deze README bij oplevering van fase 2.
