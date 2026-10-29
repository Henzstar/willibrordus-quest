// Werelden: buiten (landgoed) en binnen (per gebouw). Figuranten lopen heen en weer; NPC's binnen staan met een uitroepteken.
const WQWereld = (() => {
  'use strict';
  const T = 16;
  let C, buiten = null, figuranten = [];

  function maakFiguranten() {
    figuranten = C.figuranten.map(f => ({ ...f, x: f.route[0][0], y: f.route[0][1], px: f.route[0][0] * T, py: f.route[0][1] * T, doel: 1, dir: 'down', frame: 0, wacht: 60, pad: [] }));
  }
  function beweegFiguranten(t) {
    for (const f of figuranten) {
      if (f.route.length < 2) continue;
      if (f.wacht > 0) { f.wacht--; f.frame = 0; continue; }
      if (!f.pad.length) { const doel = f.route[f.doel % f.route.length]; f.pad = WQMap.bfs([f.x, f.y], doel) || []; f.doel++; if (!f.pad.length) { f.wacht = 120; continue; } }
      const [nx, ny] = f.pad[0], tx = nx * T, ty = ny * T;
      if (tx !== f.px) { const d = Math.sign(tx - f.px); f.dir = d < 0 ? 'left' : 'right'; f.px += d; }
      else if (ty !== f.py) { const d = Math.sign(ty - f.py); f.dir = d < 0 ? 'up' : 'down'; f.py += d; }
      if (f.px === tx && f.py === ty) { f.x = nx; f.y = ny; f.pad.shift(); if (!f.pad.length) f.wacht = 90 + (t % 60); }
      if (t % 12 === 0) f.frame = 1 - f.frame;
    }
  }
  function figurantBij(x, y) { return figuranten.find(f => Math.abs(f.x - x) <= 1 && Math.abs(f.y - y) <= 1) || null; }

  function buitenWereld(bezocht, actiefId) {
    if (!buiten) {
      buiten = {
        kaart: C.tilemap, breedte: C.tilemap[0].length, hoogte: C.tilemap.length,
        begaanbaar: new Set(Object.keys(C.legenda).filter(k => C.legenda[k].begaanbaar)),
        offscreen: WQTiles.tekenBuiten(C), water: true, bg: '#0f1813', decor: WQDecor,
        sprites: t => { if (buiten.actief) beweegFiguranten(t); return figuranten.map(f => ({ px: f.px, py: f.py, dir: f.dir, frame: f.pad.length ? f.frame : 0, look: f.look })); },
        markers: () => C.locaties.filter(l => l.id !== 'start').map(l => ({ x: l.tegel[0], y: l.tegel[1], done: buiten.bezocht(l.id), actief: l.id === buiten.actiefId })),
      };
      maakFiguranten(); WQDecor.init(C);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { buiten.offscreen = WQTiles.tekenBuiten(C); });
    }
    buiten.bezocht = bezocht; buiten.actiefId = actiefId; buiten.actief = true;
    return buiten;
  }
  function binnenWereld(L, gedaan) {
    const b = L.binnen, K = b.kaart;
    let deur = [0, 0];
    K.forEach((row, y) => { const x = row.indexOf('D'); if (x >= 0) deur = [x, y]; });
    const w = {
      kaart: K, breedte: K[0].length, hoogte: K.length, begaanbaar: new Set(C.binnenBegaanbaar),
      offscreen: WQTiles.tekenBinnen(b, C), water: false, bg: '#0f1813', deur, npc: b.npc, locatie: L,
      sprites: () => [{ px: b.npc[0] * T, py: b.npc[1] * T, dir: 'down', frame: 0, look: L.npc.look, bubble: gedaan() ? null : '!' }],
      markers: () => [],
    };
    return w;
  }
  const naastNpc = (w, x, y) => w.npc && Math.abs(w.npc[0] - x) + Math.abs(w.npc[1] - y) === 1;
  return { init: c => { C = c; }, buitenWereld, binnenWereld, naastNpc, figurantBij, figuranten: () => figuranten, buitenActief: v => { if (buiten) buiten.actief = v; } };
})();
