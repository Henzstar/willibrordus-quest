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
- `js/content.js`: alle teksten, gebouwen, dilemma's (vier opties met punten), discussiescènes, kaarten, binnenkaarten, minigame-teksten, score-opzet, zelfcheck, agenda-lijsten, tilemap, straatnamen, decoratie, figuranten en avatars. Alleen hier teksten wijzigen.
- `js/config.js`: eventId, firebaseUrl en boardEnabled voor het live bord (fase 2). Nu leeg.
- `js/tiles.js`: terrein, decoratie en binnentegels. `js/gebouwen.js`: gevels, daken en de Cultuurkoepel. `js/sprites.js`: personages. `js/map.js`: camera, looppad, overgangen. `js/interior.js`: buiten- en binnenwerelden, figuranten. `js/minigames.js`: noodkoffer, dicteer-ritme, bowlen, boogschieten. `js/score.js`: punten. `js/game.js`: spelloop en opslag. `js/ui.js`: schermen en dialoogbox. `js/sfx.js`: geluid (standaard uit).
- `css/style.css`: stijl. `ref/demo.html`: de oorspronkelijke stijlreferentie.
- `test/content.test.mjs`: de test.

## Nog in te vullen door Tjeerd
Zoek in `js/content.js` op `TJEERD`. Open plekken: functie van De Olvendijk en Olvendijk 79; het gebouw voor de beslisondersteuning (id `poli`, deur op tegel 7,6); naam en functie van de Teamkamer, Spreekkamer 4 en het Bestuursgebouw; cijfers spraakgestuurd rapporteren; toegestane AI-tools; wat er met opgenomen audio gebeurt; de afspraak over toestemming en opname; de naam en route van de stuurgroep; de noodprocedure bij EPD-uitval (ook de vier stappen in de minigame noodkoffer); de bron van de KNMG-handreiking over opnemen; datum en doelgroep van de e-learning; aanvulling op de agenda-lijst.

## Spelverloop
Start (naam, team of alleen, avatar) → landgoed (open wereld naar de officiële plattegrond, met de begraafplaats als nummer 11) → elf gebouwen in vrije volgorde: acht met een dilemma (vier opties, punten 50/30/15/0) en een moet-weten-kaart, drie discussiescènes zonder goed antwoord (keuze plus argument), vier minigames. De Cultuurkoepel gaat pas open als de rest gedaan is en is de finale → zelfcheck → agenda → eindscherm met profiel, punten, kaarten en agenda. Je loopt zelf over het terrein (tik in beeld, of pijltjestoetsen), gaat bij een deur naar binnen en praat met de persoon met het uitroepteken (A · PRAAT, Enter, of tik op de persoon). Het kompas in de HUD wijst de aanbevolen volgende stop. Voortgang staat in localStorage; herladen verliest niets.

## Punten (maximaal 1000)
Dilemma's 8 × 50, kaarten 8 × 15, minigames 4 × 60, discussie 3 × 25, zelfcheck 25, agenda 40, tijdbonus 100/80/60/40/20 en daarna 10 op volgorde van afronden. De tijdbonus wordt alleen door het bord toegekend (fase 2) en alleen als alles is doorlopen.

## Live bord (fase 2)
Het bord (`beamer.html`) toont de kaart met elk team bij zijn laatste locatie, de ranglijst met tijdbonus, en met de toetsen 1 tot 4 (of de knoppen onderin) de keuzes per dilemma, de discussies met argumenten, en de plenaire agenda: organisatie-items en eigenaren geteld, zelfcheck, voornemens en ergernissen als lijst. Zonder configuratie werkt de game gewoon; het bord toont dan alleen de kaart.

Wat Tjeerd in de Firebase-console doet (tien regels):
1. Ga naar https://console.firebase.google.com en maak een project (naam vrij, Analytics uit).
2. Kies in het menu Build → Realtime Database → Create database, locatie `europe-west1` (België), start in locked mode.
3. Open het tabblad Rules, plak de inhoud van `firebase.rules.json`, klik Publish.
4. Kopieer de database-URL bovenaan het tabblad Data (vorm: `https://<naam>-default-rtdb.europe-west1.firebasedatabase.app`).
5. Zet in `js/config.js`: `firebaseUrl` op die URL, `eventId` op een korte naam zoals `9nov` (alleen kleine letters, cijfers en streepjes) en `boardEnabled: true`. Commit en push.
6. Open op het grote scherm `beamer.html?min=30` (of `?event=9nov&min=30`); de status onderin zegt "Live".
7. Laat elk team de game-URL openen; bij de start verschijnt het team op het bord.
8. Tijdbonus kent het bord toe op volgorde van afronden (alleen als alle gebouwen zijn gedaan).
9. Na de sessie: in de Rules alle `.write` op `false` zetten en publiceren, of de database leegmaken.
10. Wil je een tweede sessie, gebruik dan een nieuwe `eventId`.

De game stuurt per team één klein JSON-object (naam, avatar, regie, punten, bezochte gebouwen, keuzes, argumenten, ergernis, zelfcheck, agenda, locatie). Geen andere gegevens. Verzenden blokkeert nooit; fouten worden stil genegeerd.

## Muziek
Chiptune per gebied via WebAudio (`js/music.js`), standaard aan, uit te zetten in het menu. De keuze wordt onthouden.
