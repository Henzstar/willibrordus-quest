// Werelden: buiten (landgoed) en binnen (per gebouw). Figuranten lopen heen en weer; NPC's binnen staan met een uitroepteken.
const WQWereld = (() => {
  'use strict';
  const T = 32;
  let C, buiten = null, figuranten = [];

  function maakFiguranten() {
    figuranten = C.figuranten.map(f => ({ ...f, x: f.route[0][0], y: f.route[0][1], px: f.route[0][0] * T, py: f.route[0][1] * T, doel: 1, dir: 'down', frame: 0, wacht: 60, pad: [] }));
  }
  const richting = (dx, dy) => Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
  function beweegFiguranten(t) {
    const [hx, hy] = WQMap.heroTile();
    for (const f of figuranten) {
      const dx = hx - f.x, dy = hy - f.y;
      if (Math.abs(dx) + Math.abs(dy) <= 2 && (dx || dy)) { f.dir = richting(dx, dy); f.kijk = 45; f.frame = 0; continue; }
      if (f.kijk > 0) { f.kijk--; continue; }
      if (f.route.length < 2) continue;
      if (f.wacht > 0) { f.wacht--; f.frame = 0; continue; }
      if (!f.pad.length) { const doel = f.route[f.doel % f.route.length]; f.pad = WQMap.bfs([f.x, f.y], doel) || []; f.doel++; if (!f.pad.length) { f.wacht = 120; continue; } }
      const [nx, ny] = f.pad[0], tx = nx * T, ty = ny * T;
      if (tx !== f.px) { const d = Math.sign(tx - f.px); f.dir = d < 0 ? 'left' : 'right'; f.px += d * 2; }
      else if (ty !== f.py) { const d = Math.sign(ty - f.py); f.dir = d < 0 ? 'up' : 'down'; f.py += d * 2; }
      if (f.px === tx && f.py === ty) { f.x = nx; f.y = ny; f.pad.shift(); if (!f.pad.length) f.wacht = 90 + (t % 60); }
      if (t % 8 === 0) f.frame = (f.frame + 1) % 4;
    }
  }
  function figurantBij(x, y) { return figuranten.find(f => Math.abs(f.x - x) <= 1 && Math.abs(f.y - y) <= 1) || null; }

  function buitenWereld(bezocht, actiefId) {
    if (!buiten) {
      buiten = {
        kaart: C.tilemap, breedte: C.tilemap[0].length, hoogte: C.tilemap.length,
        begaanbaar: new Set(Object.keys(C.legenda).filter(k => C.legenda[k].begaanbaar)),
        offscreen: WQTiles.tekenBuiten(C), overlay: WQTiles.tekenOverlay(C), water: true, bg: '#0f1813', decor: WQDecor,
        lampen: C.props.filter(p => p.type === 'lantaarn').map(p => [p.tegel[0] * T + 22, p.tegel[1] * T + 4]), ramen: WQGebouwen.ramen(),
        sprites: t => { if (buiten.actief) beweegFiguranten(t); const lijst = figuranten.map(f => ({ px: f.px, py: f.py, dir: f.dir, frame: f.pad.length ? f.frame : 0, look: f.look })); if (spook.zichtbaar) { spook.f++; if (spook.tot && t > spook.tot) spook.zichtbaar = false; const [hx, hy] = WQMap.heroTile(), afstand = Math.abs(hx - spook.x) + Math.abs(hy - spook.y), nabij = spook.bij !== 'begraafplaats' ? 1 : Math.max(0, Math.min(1, (3 - afstand) / 2)); if (nabij > 0) lijst.push({ px: spook.x * T, py: spook.y * T - 6 + Math.round(Math.sin(spook.f / 14) * 4), dir: spook.dir, frame: 0, look: C.spook.look, alpha: (0.55 + Math.sin(spook.f / 9) * 0.15) * nabij, zaad: 99 }); } return lijst; },
        markers: () => C.locaties.filter(l => l.id !== 'start' && l.soort !== 'grap').map(l => ({ x: l.tegel[0], y: l.tegel[1], done: buiten.bezocht(l.id), actief: l.id === buiten.actiefId, plek: l.soort === 'plek', dicht: l.id === C.laatste && !buiten.open() })),
      };
      maakFiguranten(); WQDecor.init(C);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { buiten.offscreen = WQTiles.tekenBuiten(C); buiten.ramen = WQGebouwen.ramen(); });
    }
    buiten.bezocht = bezocht; buiten.actiefId = actiefId; buiten.actief = true;
    buiten.open = () => C.locaties.filter(l => l.soort === 'dilemma' || l.soort === 'discussie').every(l => l.id === C.laatste || bezocht(l.id));
    return buiten;
  }
  function binnenWereld(L, gedaan) {
    const b = L.binnen, K = b.kaart;
    let deur = [0, 0];
    K.forEach((row, y) => { const x = row.indexOf('D'); if (x >= 0) deur = [x, y]; });
    const w = {
      kaart: K, breedte: K[0].length, hoogte: K.length, begaanbaar: new Set(C.binnenBegaanbaar),
      offscreen: WQTiles.tekenBinnen(b, C, buiten && buiten.offscreen, L.tegel), water: false, bg: '#0f1813', deur, npc: b.npc, locatie: L,
      sprites: () => { const [hx, hy] = WQMap.heroTile(), dx = hx - b.npc[0], dy = hy - b.npc[1]; const lijst = [{ px: b.npc[0] * T, py: b.npc[1] * T, dir: Math.abs(dx) + Math.abs(dy) <= 2 && (dx || dy) ? richting(dx, dy) : 'down', frame: 0, look: L.npc.look, bubble: gedaan() || L.soort === 'grap' ? null : '!' }]; (b.groep || []).forEach((g, i) => lijst.push({ px: g[0] * T, py: g[1] * T, dir: g[0] < 6 ? 'right' : 'left', frame: 0, look: C.figuranten[i % C.figuranten.length].look, zaad: i + 7 })); return lijst; },
      markers: () => [],
    };
    return w;
  }
  const naastNpc = (w, x, y) => w.npc && Math.abs(w.npc[0] - x) + Math.abs(w.npc[1] - y) === 1;
  // Spook: staat op de begraafplaats tot hij gezien is; daarna verschijnt hij tijdelijk bij een deur.
  const spook = { x: C ? 0 : 0, y: 0, zichtbaar: false, dir: 'down', f: 0, tot: 0, bij: null };
  function spookOpBegraafplaats() { spook.x = C.spook.tegel[0]; spook.y = C.spook.tegel[1]; spook.zichtbaar = true; spook.tot = 0; spook.bij = 'begraafplaats'; }
  function spookBij(x, y, t, id) { spook.x = x; spook.y = y; spook.zichtbaar = true; spook.tot = t + 60 * 14; spook.bij = id; spook.dir = 'down'; }
  function spookWeg() { spook.zichtbaar = false; spook.bij = null; }
  const spookBijTegel = (x, y) => spook.zichtbaar && Math.abs(spook.x - x) + Math.abs(spook.y - y) <= 1;
  return { init: c => { C = c; }, buitenWereld, binnenWereld, naastNpc, figurantBij, figuranten: () => figuranten, buitenActief: v => { if (buiten) buiten.actief = v; }, spookOpBegraafplaats, spookBij, spookWeg, spookBijTegel, spook: () => spook };
})();
