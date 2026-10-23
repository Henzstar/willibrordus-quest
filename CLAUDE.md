# Projectregels Willibrordus Quest

Zie `SPEC.md` voor de volledige opdracht. Deze regels gelden voor elke sessie.

## Techniek
- Geen dependencies, geen npm, geen build-stap, geen bundler, geen frameworks, geen TypeScript.
- Geen externe afbeeldingen; alle graphics procedureel op canvas. Enige externe bron: Google Fonts (Press Start 2P), met fallback.
- Alle paden relatief (`./js/...`, `./css/...`); nooit absoluut. De site draait op GitHub Pages onder een submap.
- Totale omvang onder 300 KB. Werkt offline na laden. Voortgang in localStorage.
- Bestanden onder 400 regels; `js/content.js` mag langer.

## Bestandsindeling
`index.html`, `css/style.css`, `js/config.js`, `js/content.js`, `js/map.js`, `js/game.js`, `js/ui.js`, `js/sfx.js`, `beamer.html`, `test/content.test.mjs`, `README.md`, `SPEC.md`, `CLAUDE.md`. Stijlreferentie in `ref/demo.html` (niet wijzigen).

## Inhoud
- Alle teksten (dialogen, dilemma's, kaarten, lijsten, tilemap, legenda, straatnamen) staan alleen in `js/content.js`. Geen teksten in game.js, ui.js of index.html, behalve knoplabels van de interface.
- Teksten letterlijk uit SPEC/opdracht overnemen. Alle `[TJEERD: ...]`-plekken blijven letterlijk staan tot Tjeerd ze invult.
- Nederlands, spreektaal, droog. Geen echte namen van collega's.

## Werkwijze
- Eén commit per stap, Nederlandse commitboodschap in de vorm "Stap n: ...".
- Geen refactors en geen extra features zonder vraag. Hooguit één vraag per keer, alleen als een keuze het ontwerp raakt.
- Korte antwoorden in de chat. Nooit hele bestanden in de chat herhalen; verwijs naar bestand en regel.
- Voor elke commit: `node --check js/*.js` en `node --test`. Handmatig testen via `python3 -m http.server 8000`. Geen screenshot-loops.
