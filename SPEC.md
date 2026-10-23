# Willibrordus Quest, ondertitel "Wie stuurt?"

Kleine, publiek gehoste browsergame. Eerste gebruik: live werksessie 9 november 2026, circa 40 psychiaters, aios en ondersteuners van GGZ Noord-Holland-Noord, in teams, met live scorebord op groot scherm. Daarna verspreid en solo gespeeld (12 tot 15 minuten). Vervangt een lezing van 60 minuten: "Wat elke psychiater moet weten over digitalisering".

## Vaststaande keuzes
- Hosting: GitHub Pages vanaf de root. Alle paden relatief (`./js/...`), nooit absoluut.
- Eén spel, twee labels: "Als team" of "Alleen". Enig verschil: het scorebord toont de naam; de zaalopdracht in de Cultuurkoepel verschijnt alleen bij "Als team".
- Live bord in fase 2 via Firebase Realtime Database zonder SDK (REST schrijven, SSE lezen). Zonder config of netwerk werkt de game volledig, alleen zonder bord.
- Landgoed Willibrordus, Heiloo. Bekend: De Hooge Venne = forensische psychiatrie; Cultuurkoepel = grote bijeenkomsten; Kwekerij = werkplek voor mensen met afstand tot de arbeidsmarkt; nieuwbouw = HIC. Overige functies: `[TJEERD: volgt]`.
- GGZ NHN bij naam. Geen echte collega's; NPC's zijn archetypen. Geen links naar app-groepen.

## Doel en omstandigheden
- Enthousiasmeren, kennis overbrengen (één moet-weten-kaart per gebouw), hoop geven, verbinden. Uitkomst per team: agenda (wat pak ik zelf op; waar moet GGZ NHN mee aan de slag, met eigenaar) voor de plenaire wrap-up.
- 9 november: restaurant, walking dinner, rumoer. Eén telefoon per team ("de navigator"), rollen wisselen per gebouw. Hotspot-internet. Facilitator met microfoon, groot scherm met bord.
- Taal: Nederlands, spreektaal, droog, humor uit herkenbare situaties, geen jargon zonder uitleg.

## Techniek (fase 1)
Statische webapp, geen build, geen npm-dependencies, geen frameworks, geen TypeScript, geen externe afbeeldingen. Mobile-first (portrait 360 tot 430 px), ook desktop. Onder 300 KB, laadt in één seconde op 4G, werkt na laden offline. Voortgang in localStorage.

Bestanden:
- `index.html` (één pagina; schermen via JS)
- `css/style.css`
- `js/config.js` (eventId, firebaseUrl, boardEnabled; fase 1 leeg)
- `js/content.js` (alle teksten, gebouwen, dilemma's, kaarten, tilemap, legenda; geen logica)
- `js/map.js` (tilemap op canvas, camera volgt held, BFS-looppad, markers)
- `js/game.js` (state machine: start → kaart → gebouw → dialoog → keuze → gevolg → kaart-overzicht → zelfcheck → agenda → einde)
- `js/ui.js` (dialoogbox met typewriter, keuzeknoppen, HUD, schermen)
- `js/sfx.js` (optioneel, WebAudio-bliepjes, standaard uit)
- `beamer.html` (fase 1: kaart, klok, URL)
- `SPEC.md`, `CLAUDE.md`, `README.md`, `test/content.test.mjs` (node:test)

Stijlreferentie: `ref/demo.html` (palet, HUD, dialoogbox, markers, lopen, drie scènes). Stijl overnemen, code verbeteren.

## Schermen
1. Start: titel, "Nieuw spel", naam (max 20), "Als team"/"Alleen", 4 avatars (pixelsprites, elk een perk van één regel zonder effect). "Verder spelen" als er een opgeslagen spel is.
2. Kaart: tilemap, camera volgt held, tik op marker of kies uit "Waarheen?"; BFS over begaanbare tegels. Bezochte gebouwen krijgen een vinkje. HUD: naam, regie-meter (0 tot 100, start 50), kaarten x/8.
3. Gebouw: NPC-dialoog (2 tot 4 regels, typewriter, tik of "A"), dilemma met 3 opties (tikdoelen min. 48 px), gevolg met effect, dan moet-weten-kaart (titel, 2 tot 3 regels, bron). Cultuurkoepel: extra zaalopdracht met tekstveld.
4. Zelfcheck (na achtste gebouw of via menu): zes AI-competenties van de Federatie als vinkjes, geen goed/fout.
5. Agenda: "Wat pak jij zelf op in de komende drie maanden?" (één verzamelde kaart of vrije tekst, max 120) en "Waar moet GGZ NHN mee aan de slag, en wie?" (lijst of vrije tekst, plus eigenaar).
6. Einde: profiel op regie (0 tot 34 Speelbal, 35 tot 64 Meebeweger, 65 tot 84 Stuurman of Stuurvrouw, 85 tot 100 Kapitein), score, kaarten, agenda, groot en fotografeerbaar. Knop "Opnieuw".

Besturing: tik of klik; desktop ook pijltjestoetsen en Enter als "A". Geen d-pad.

## Visuele stijl
SNES-achtig, top-down, 16 x 16 px tegels, integer-opschaling, `image-rendering: pixelated`. Alles procedureel op canvas; sprites als 16 regels met één teken per pixel plus palet. Palet: gras `#7bb661`, donker gras `#5e9a4a`, pad `#d9c38a`, asfalt `#6b7280`, water `#5aa7d6`, boomkroon `#3f7d3a`, stam `#6b4a2b`, dak `#8b5e3c`, muur `#e8dcc5`, zand `#e0cfa0`, nieuwbouw `#f4f1ea`, kas `#dbe8f0`, akker `#a9b46a`, koepel `#c9a24d`, accent `#1d6b4f`, tekst `#1a1f1c`. Titels en HUD in Press Start 2P (Google Fonts, fallback monospace); dialoog en keuzes in systeem-sans-serif, min. 16 px. Dialoogbox onder de kaart met naamplaatje. Held 2 loopframes, water wisselt tint, markers wippen. Geluid uit.

## Kaart
Tilemap 48 x 22. Legenda: `=` asfalt, `-` pad, `.` gras, `P` parkeren, `S` bouwzand (begaanbaar); `T` boom, `W` water, `B` gebouw, `K` Cultuurkoepel, `G` kas, `N` nieuwbouw, `F` akker (blokkerend). Noord boven. Tilemap letterlijk in `js/content.js` (en in `ref/demo.html`). Benadering; later vervangen op basis van de officiële plattegrond.

Straatnamen als labels: Kanaalweg (rij 0), De Strandwal (rij 7 west), De Bullaan (rij 7 oost), Rosendaal (kolom 47), De Olvendijk (rij 10), Het Landpad (kolom 16), De Hooge Venne (diagonaal), De Overtoom (rij 17), Het Kerkpad (kolom 10), De Beuk (kolom 34), De Kroft (rij 21).

Locaties (marker op begaanbare tegel naast gebouw; NPC op tegel ernaast):
0 Hoofdingang (start) (14,10) · 1 Keuken met Karakter (8,10) · 2 De Olvendijk (21,10) `[TJEERD: functie]` · 3 Olvendijk 79 (27,17) `[TJEERD: functie]` · 4 De Hooge Venne (27,9) · 5 `[TJEERD: gebouw beslisondersteuning]` tegel `[TJEERD]` · 6 Cultuurkoepel (7,13) · 7 Kwekerij (40,8) · 8 Nieuwbouw HIC (24,6).

## Spelregels
- Regie start op 50. Opties: +10, 0 of −10 (één keer −15, één keer +5). Effect na keuze met één regel gevolg; nooit "goed/fout" maar "wat er dan gebeurt".
- Elk gebouw levert één kaart op, ongeacht de keuze. Kaarten terug te lezen via menu.
- Geen tijdsdruk, geen rondes. Agenda op elk moment via menu. Zelfcheck telt niet mee.

## Inhoud
Alle teksten staan letterlijk in de startopdracht en worden letterlijk overgenomen in `js/content.js` (alleen typografie en lengte aanpassen bij een volle box). Schema per gebouw: `{ id, naam, functie, tegel:[x,y], npc:{naam, rol, kleur}, intro:[regels], dilemma:{vraag, opties:[{tekst, effect, gevolg}]}, kaart:{titel, tekst, bron}, opdracht? }`. Alle `[TJEERD: ...]`-plekken blijven letterlijk staan.

Gebouwen en thema's: 1 Keuken (werklast begint bij registratie, NPC Sam) · 2 Olvendijk (dossier gaat de deur niet uit, Fatima) · 3 Olvendijk 79 (cliënt vraagt wat je doet, Willem) · 4 Hooge Venne (algoritme heeft een mening, Nadia) · 5 `[TJEERD]` (computer denkt mee, Lars) · 6 Cultuurkoepel (wie stuurt bij ons, Henk; zaalopdracht max 60 tekens) · 7 Kwekerij (digitaal waar het kan, Joop) · 8 HIC (2030, EPD-uitval, jijzelf). Start: Bep, portier.

Zelfcheck: zes vinkjes (basisprincipes AI; AI-uitvoer kritisch beoordelen; veiligheid en kwaliteit; cliënten informeren; samenwerken in AI-ecosysteem; ethisch en juridisch), tekst erna over de Federatie-competenties (januari 2026), AI-verordening (februari 2025) en e-learning `[TJEERD: datum en voor wie]`.

Agenda-lijst organisatie: AI-geletterdheid regelen; aanspreekpunt digitalisering per divisie of vakgroep; cliëntinformatie over AI en opname vaststellen; noodprocedure jaarlijks oefenen; spraakgestuurd rapporteren opschalen; beslisondersteuning pas na validatie; staf aan tafel bij elk digitaal besluit; `[TJEERD: aanvullen]`. Eigenaar: medische staf; stuurgroep digitalisering; AI-team; EPD-regiegroep; raad van bestuur en directie; ikzelf.

## Fase 2: live bord (aparte sessie)
- Firebase Realtime Database (Europa), regels in `firebase.rules.json`. Geen SDK: `fetch` PUT/PATCH op `/events/{eventId}/players/{playerId}.json`; bord leest via `EventSource` (`Accept: text/event-stream`), terugval polling 5 s.
- Game stuurt bij start, elk afgerond gebouw, zelfcheck en agenda één klein JSON-object: naam, avatar, regie, bezochte gebouwen, keuzes per dilemma, ergernis, agenda. Nooit blokkerend; fouten stil negeren.
- `beamer.html?event=<id>`: kaart schermvullend met avatar per team bij laatst bezochte gebouw; ranglijst op regie en kaarten; verdeling keuzes per dilemma; na "afronden" de agenda's geteld (organisatie-items, eigenaren, ergernissen, voornemens). Aftelklok `&min=30`, game-URL groot.
- Regels: schrijven alleen onder bekend eventId met `.validate` op veldnamen en lengtes; lezen vrij. README: tien regels over de Firebase-console en de twee waarden in `js/config.js`.

## Werkwijze
Bouwvolgorde, één commit per stap: (1) content.js met tilemap en negen locaties plus test; (2) map.js; (3) game.js en ui.js met start, kaart en één gebouw; (4) alle gebouwen, zelfcheck, agenda, einde, localStorage; (5) beamer.html fase 1; (6) README en smoke test.
Bestanden onder 400 regels (content.js mag langer). Geen refactors of extra features zonder vraag. Hooguit één vraag per keer.
Testen: `node --check` op elk JS-bestand; `node --test test/` (22 rijen van 48 tekens, elke locatietegel begaanbaar en bereikbaar vanaf start, unieke ids, elk dilemma 3 opties met effect, elk gebouw een kaart). Handmatig via `python3 -m http.server 8000`.

## Definition of done (fase 1)
Speelbaar op iPhone en Android in Safari en Chrome, portrait; onder 300 KB; acht gebouwen plus start, zelfcheck en agenda met de teksten uit de opdracht; herladen verliest geen voortgang; beamer.html toont kaart, klok en URL; alle `[TJEERD: ...]`-plekken letterlijk in content.js; README beschrijft starten, testen, deployen en waar teksten te wijzigen zijn.
