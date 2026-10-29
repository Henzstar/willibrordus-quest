// Buitentegels met autotiling, decoratie en binnentegels. Alles procedureel; geen afbeeldingen.
const WQTiles = (() => {
  'use strict';
  const T = 16;
  const PAL = {
    gras: '#7bb661', gras2: '#6aa352', gras3: '#8cc46f', pad: '#d9c38a', pad2: '#c4ad77', padRand: '#b89b63', padLicht: '#e6d4a3',
    asfalt: '#6b7280', asfalt2: '#9aa3ad', stoep: '#a3aab3', water: '#5aa7d6', water2: '#8cc5e8', waterDiep: '#4a93c2', schuim: '#cfe9f7',
    kroon: '#3f7d3a', kroonD: '#2f6b2e', kroonL: '#5aa35a', stam: '#6b4a2b', stamD: '#4e351f',
    zand: '#e0cfa0', zand2: '#cdb985', hek: '#8d949c', akker: '#a9b46a', akker2: '#8f9a52', akker3: '#c3cc80', hout: '#8a5a2b', houtL: '#b07a3e',
    ink: '#1a1f1c', wit: '#ffffff', lamp: '#ffe9a8', bloem1: '#f2f2f2', bloem2: '#f6d44c', bloem3: '#e86f9a', aarde: '#4e6b3a',
    vloer: '#e9e1d2', vloer2: '#d9d0bf', plank: '#c8a06c', plank2: '#b08a58', muur: '#d8cfc0', muurTop: '#5a4e46', muurL: '#ece5d8', kleed: '#b5443a', kleed2: '#8e332a',
    heg: '#2f6b2e', hegL: '#4c9448', hegD: '#1f4d20', steen: '#9aa3ad', steenL: '#c3c9d1', steenD: '#6f767e', veld: '#8cc46f', veld2: '#7bb661', brug: '#a9774a', brug2: '#8a5a2b', behang: '#e4d7c3', behang2: '#d7c8b0',
    bureau: '#8a5a2b', bureauL: '#b07a3e', scherm: '#3b3f4a', glas: '#5aa7d6', staal: '#aab2bb', stoel: '#3b3f4a', laken: '#f4f4f4', deken: '#2b6cb0', pot: '#a0522d', blad: '#2f7d32', kist: '#d9a441', bord: '#fbfbfb',
  };
  const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;
  const R = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  // Autotiling: randen (dik px) en afgeronde hoeken op de zijden waar de buur niet bij dezelfde groep hoort.
  // zelfde(dx, dy) zegt of de buur meedoet. kleur = randkleur, dik = dikte. Binnenhoeken krijgen een stipje.
  function randen(c, sx, sy, zelfde, kleur, dik) {
    const N = zelfde(0, -1), Z = zelfde(0, 1), W = zelfde(-1, 0), O = zelfde(1, 0);
    if (!N) R(c, sx, sy, T, dik, kleur); if (!Z) R(c, sx, sy + T - dik, T, dik, kleur);
    if (!W) R(c, sx, sy, dik, T, kleur); if (!O) R(c, sx + T - dik, sy, dik, T, kleur);
    const hoek = (hx, hy) => { R(c, sx + hx, sy + hy, 2, 2, kleur); };
    if (!N && !W) { hoek(0, 0); R(c, sx + dik, sy + dik, 1, 1, kleur); } if (!N && !O) { hoek(T - 2, 0); R(c, sx + T - dik - 1, sy + dik, 1, 1, kleur); }
    if (!Z && !W) { hoek(0, T - 2); R(c, sx + dik, sy + T - dik - 1, 1, 1, kleur); } if (!Z && !O) { hoek(T - 2, T - 2); R(c, sx + T - dik - 1, sy + T - dik - 1, 1, 1, kleur); }
    if (N && W && !zelfde(-1, -1)) R(c, sx, sy, dik, dik, kleur); if (N && O && !zelfde(1, -1)) R(c, sx + T - dik, sy, dik, dik, kleur);
    if (Z && W && !zelfde(-1, 1)) R(c, sx, sy + T - dik, dik, dik, kleur); if (Z && O && !zelfde(1, 1)) R(c, sx + T - dik, sy + T - dik, dik, dik, kleur);
  }
  // Gras dat over de rand van een verharding groeit: losse groene pixels aan de kant van het gras.
  function grasrand(c, sx, sy, zelfde, h) {
    const p = (x, y) => { R(c, sx + x, sy + y, 1, 1, (h >> (x + y)) & 1 ? PAL.gras : PAL.gras2); };
    if (!zelfde(0, -1)) for (let i = (h & 3); i < T; i += 3 + (h & 1)) { p(i, 0); if ((h >> i) & 1) p(i, 1); }
    if (!zelfde(0, 1)) for (let i = ((h >> 2) & 3); i < T; i += 3 + ((h >> 1) & 1)) { p(i, 15); if ((h >> i) & 2) p(i, 14); }
    if (!zelfde(-1, 0)) for (let i = ((h >> 4) & 3); i < T; i += 4) { p(0, i); if ((h >> i) & 4) p(1, i); }
    if (!zelfde(1, 0)) for (let i = ((h >> 6) & 3); i < T; i += 4) { p(15, i); if ((h >> i) & 8) p(14, i); }
  }

  // ---------- buiten ----------
  function tekenGrond(c, MAP, x, y, sx, sy) {
    const ch = MAP[y][x], at = (dx, dy) => (MAP[y + dy] && MAP[y + dy][x + dx]) || 'T';
    const h = hash(x, y);
    R(c, sx, sy, T, T, PAL.gras);
    if (ch === '.' || ch === 'T' || ch === 'H' || ch === 'C') {
      for (let i = 0; i < 5; i++) { const px = (h >> (i * 4)) & 15, py = (h >> (i * 4 + 2)) & 15; R(c, sx + px, sy + py, i % 3 ? 1 : 2, 1, i % 2 ? PAL.gras2 : PAL.gras3); }
      if (h % 7 === 0 && ch === '.') { R(c, sx + 6, sy + 9, 1, 3, PAL.gras2); R(c, sx + 8, sy + 8, 1, 4, PAL.gras2); R(c, sx + 10, sy + 10, 1, 2, PAL.gras2); R(c, sx + 7, sy + 8, 1, 1, PAL.gras3); }
      if (h % 19 === 0 && ch === '.') { R(c, sx + 4, sy + 5, 2, 2, PAL.bloem1); R(c, sx + 11, sy + 10, 2, 2, PAL.bloem2); R(c, sx + 5, sy + 7, 1, 2, PAL.gras2); }
      if (h % 31 === 0 && ch === '.') { R(c, sx + 9, sy + 4, 2, 2, PAL.bloem3); R(c, sx + 3, sy + 11, 2, 2, PAL.bloem2); }
      if (h % 53 === 0 && ch === '.') { R(c, sx + 11, sy + 12, 3, 2, '#d9c38a'); R(c, sx + 12, sy + 11, 1, 1, '#d9c38a'); }
      const nat = (dx, dy) => at(dx, dy) === 'W';
      if (nat(0, -1)) R(c, sx, sy, T, 2, PAL.zand); if (nat(0, 1)) R(c, sx, sy + 14, T, 2, PAL.zand); if (nat(-1, 0)) R(c, sx, sy, 2, T, PAL.zand); if (nat(1, 0)) R(c, sx + 14, sy, 2, T, PAL.zand);
      if (ch === 'H') { const zh = (dx, dy) => at(dx, dy) === 'H'; R(c, sx, sy, T, T, PAL.heg); for (let i = 0; i < 6; i++) R(c, sx + 1 + ((h >> i) & 7) * 2, sy + 2 + ((h >> (i + 3)) & 7), 2, 1, PAL.hegL); randen(c, sx, sy, zh, PAL.hegD, 2); if (!zh(0, -1)) R(c, sx + 2, sy + 2, T - 4, 1, PAL.hegL); R(c, sx, sy + 15, T, 1, 'rgba(20,40,20,.35)'); }
      if (ch === 'C') { const gx = 3 + (h % 3), gy = 3 + ((h >> 2) % 2); R(c, sx + gx, sy + gy + 1, 7, 9, PAL.steenD); R(c, sx + gx, sy + gy, 7, 9, PAL.steen); R(c, sx + gx + 1, sy + gy + 1, 5, 7, PAL.steenL); if (h % 2) { R(c, sx + gx + 3, sy + gy - 2, 1, 4, PAL.steen); R(c, sx + gx + 2, sy + gy - 1, 3, 1, PAL.steen); } R(c, sx + gx + 2, sy + gy + 3, 3, 1, PAL.steenD); if (h % 3 === 0) R(c, sx + gx + 7, sy + 11, 2, 2, PAL.bloem3); if (h % 3 === 1) R(c, sx + gx - 1, sy + 11, 2, 2, PAL.bloem2); }
      return;
    }
    if (ch === 'A') { R(c, sx, sy, T, T, (x + y) % 2 ? PAL.veld : PAL.veld2); const a = (dx, dy) => at(dx, dy) === 'A'; if (!a(0, -1)) R(c, sx, sy + 1, T, 1, PAL.wit); if (!a(0, 1)) R(c, sx, sy + 14, T, 1, PAL.wit); if (!a(-1, 0)) R(c, sx + 1, sy, 1, T, PAL.wit); if (!a(1, 0)) R(c, sx + 14, sy, 1, T, PAL.wit); return; }
    if (ch === '+') { R(c, sx, sy, T, T, PAL.brug); for (let j = 0; j < T; j += 4) R(c, sx, sy + j, T, 1, PAL.brug2); R(c, sx, sy, T, 2, PAL.brug2); R(c, sx, sy + 14, T, 2, PAL.brug2); R(c, sx + 2, sy, 1, T, PAL.stamD); R(c, sx + 13, sy, 1, T, PAL.stamD); return; }
    const hard = k => '-=PS+'.includes(k);
    if (ch === '-' || ch === 'S') {
      R(c, sx, sy, T, T, ch === '-' ? PAL.pad : PAL.zand);
      for (let i = 0; i < 3; i++) { const px = (h >> (i * 5)) & 15, py = (h >> (i * 5 + 3)) & 15; R(c, sx + px, sy + py, 2, 1, ch === '-' ? PAL.pad2 : PAL.zand2); }
      R(c, sx + 3, sy + 2, 1, 1, PAL.padLicht); if (ch === '-' && h % 11 === 0) { R(c, sx + 9, sy + 6, 2, 2, PAL.padLicht); R(c, sx + 12, sy + 12, 2, 1, PAL.padRand); }
      if (ch === '-' && h % 29 === 0) R(c, sx + 5, sy + 10, 2, 2, '#c9843a');
      const zh = (dx, dy) => hard(at(dx, dy)) || 'BKGN'.includes(at(dx, dy));
      randen(c, sx, sy, zh, ch === '-' ? PAL.padRand : PAL.hek, 1);
      if (ch === '-') { const zl = (dx, dy) => zh(dx, dy); if (!zl(0, -1)) R(c, sx + 1, sy + 1, T - 2, 1, PAL.padLicht); if (!zl(-1, 0)) R(c, sx + 1, sy + 1, 1, T - 2, PAL.padLicht); grasrand(c, sx, sy, (dx, dy) => zh(dx, dy) || at(dx, dy) !== '.', h); }
      if (ch === 'S') { // bouwhek: palen langs de rand
        if (!hard(at(0, -1))) for (let i = 1; i < T; i += 5) R(c, sx + i, sy, 1, 3, PAL.hek);
        if (!hard(at(0, 1))) for (let i = 1; i < T; i += 5) R(c, sx + i, sy + 13, 1, 3, PAL.hek);
      }
    } else if (ch === '=' || ch === 'P') {
      R(c, sx, sy, T, T, PAL.asfalt);
      if (ch === '=') {
        const horiz = at(-1, 0) === '=' || at(1, 0) === '=';
        if (horiz && at(0, -1) !== '=' && at(0, 1) !== '=') R(c, sx + 2, sy + 7, 7, 2, PAL.asfalt2);
        else if (!horiz) R(c, sx + 7, sy + 2, 2, 7, PAL.asfalt2);
        randen(c, sx, sy, (dx, dy) => hard(at(dx, dy)), PAL.stoep, 2);
        if (h % 41 === 0) { R(c, sx + 5, sy + 5, 6, 6, '#5a606c'); R(c, sx + 6, sy + 6, 4, 4, '#777e8a'); R(c, sx + 7, sy + 7, 2, 2, '#5a606c'); }
      } else { R(c, sx + 15, sy, 1, T, PAL.wit); if (at(0, 1) === 'P') R(c, sx, sy + 15, T, 1, PAL.wit); if (at(0, -1) !== 'P') R(c, sx, sy, T, 1, PAL.wit); }
    } else if (ch === 'W') {
      R(c, sx, sy, T, T, (h % 5 === 0) ? PAL.waterDiep : PAL.water);
    } else if (ch === 'F') {
      R(c, sx, sy, T, T, PAL.akker);
      for (let i = 1; i < T; i += 4) { R(c, sx + i, sy, 1, T, PAL.akker2); for (let j = (h >> 3) & 3; j < T; j += 4) R(c, sx + i + 1, sy + j, 1, 1, PAL.akker3); }
      const hekje = (dx, dy, hx, hy, w, hh) => { if (at(dx, dy) === '.' || at(dx, dy) === '-') { R(c, sx + hx, sy + hy, w, hh, PAL.hout); } };
      hekje(0, -1, 0, 1, T, 1); hekje(0, 1, 0, 13, T, 1); hekje(-1, 0, 1, 0, 1, T); hekje(1, 0, 14, 0, 1, T);
      if (at(0, -1) === '.') for (let i = 2; i < T; i += 6) R(c, sx + i, sy, 1, 3, PAL.houtL);
      if (at(0, 1) === '.') for (let i = 2; i < T; i += 6) R(c, sx + i, sy + 12, 1, 3, PAL.houtL);
    }
  }
  function tekenWater(c, MAP, x, y, sx, sy, t) {
    const at = (dx, dy) => (MAP[y + dy] && MAP[y + dy][x + dx]) || 'W';
    R(c, sx, sy, T, T, (hash(x, y) % 5 === 0) ? PAL.waterDiep : PAL.water);
    const o = Math.floor(t / 12) % 16;
    c.fillStyle = PAL.water2;
    c.fillRect(sx + ((o + x * 3) % 16), sy + 5, 4, 1); c.fillRect(sx + ((o + 8 + y * 5) % 16), sy + 11, 3, 1);
    const zw = (dx, dy) => at(dx, dy) === 'W';
    randen(c, sx, sy, zw, PAL.zand2, 2); randen(c, sx, sy, zw, PAL.schuim, 1);
    c.fillStyle = PAL.schuim;
    if (!zw(0, -1)) c.fillRect(sx + ((o >> 2) % 4) * 4, sy + 2, 2, 1); if (!zw(0, 1)) c.fillRect(sx + 3 + ((o >> 2) % 3) * 4, sy + 13, 2, 1);
  }
  // Bomen: de stam en de onderkant van de kroon staan in de grondlaag; de bovenkroon in de overlaylaag (valt vóór de held).
  function tekenBoom(c, x, y, sx, sy, laag) {
    const h = hash(x, y), r = 7 + (h % 2), ox = (h >> 2) % 2, groot = h % 3 === 0;
    if (laag === 'grond') { c.fillStyle = 'rgba(20,40,20,.28)'; c.beginPath(); c.ellipse(sx + 9 + ox, sy + 14, 7, 3, 0, 0, 7); c.fill(); }
    if (h % 5 === 0) { // naaldboom
      if (laag === 'grond') { R(c, sx + 7 + ox, sy + 11, 2, 4, PAL.stam); return; }
      [[10, 9, 7], [8, 5, 6], [6, 1, 5], [4, -3, 5]].forEach(([w, yy, hh], i) => { c.fillStyle = i % 2 ? PAL.kroonD : PAL.kroon; c.beginPath(); c.moveTo(sx + 8 + ox, sy + yy - 2); c.lineTo(sx + 8 + ox - w / 2 - 1, sy + yy + hh); c.lineTo(sx + 8 + ox + w / 2 + 1, sy + yy + hh); c.closePath(); c.fill(); });
      R(c, sx + 6 + ox, sy + 2, 1, 1, PAL.kroonL); R(c, sx + 5 + ox, sy + 6, 1, 1, PAL.kroonL); R(c, sx + 7 + ox, sy - 1, 1, 1, PAL.kroonL);
      return;
    }
    if (laag === 'grond') { R(c, sx + 7 + ox, sy + 8, 3, 7, PAL.stam); R(c, sx + 9 + ox, sy + 8, 1, 7, PAL.stamD); R(c, sx + 6 + ox, sy + 14, 1, 1, PAL.stamD); return; }
    const cy = sy + (groot ? 2 : 4), rr = groot ? r + 1 : r;
    c.fillStyle = PAL.kroonD; c.beginPath(); c.arc(sx + 8 + ox, cy + 1, rr, 0, 7); c.fill();
    c.fillStyle = PAL.kroon; c.beginPath(); c.arc(sx + 8 + ox, cy, rr - 1, 0, 7); c.fill();
    c.fillStyle = PAL.kroonL; c.beginPath(); c.arc(sx + 6 + ox, cy - 2, rr - 4, 0, 7); c.fill();
    R(c, sx + 10 + ox, cy - 4, 1, 1, PAL.kroonL); R(c, sx + 5 + ox, cy + 2, 1, 1, PAL.kroonL); R(c, sx + 11 + ox, cy + 3, 2, 1, PAL.kroonD);
    if (h % 7 === 0) { R(c, sx + 4 + ox, cy + 1, 1, 1, PAL.bloem3); R(c, sx + 11 + ox, cy - 1, 1, 1, PAL.bloem3); }
    return;
  }
  const PROPS = {
    lantaarn: (c, sx, sy) => { R(c, sx + 10, sy + 3, 2, 12, '#3b3f4a'); R(c, sx + 8, sy, 6, 4, '#2a2d35'); R(c, sx + 9, sy + 1, 4, 2, PAL.lamp); R(c, sx + 9, sy + 14, 4, 1, '#2a2d35'); },
    bank: (c, sx, sy) => { R(c, sx + 2, sy + 6, 12, 3, PAL.houtL); R(c, sx + 2, sy + 9, 12, 2, PAL.hout); R(c, sx + 3, sy + 11, 2, 3, PAL.stamD); R(c, sx + 11, sy + 11, 2, 3, PAL.stamD); R(c, sx + 2, sy + 3, 12, 2, PAL.houtL); R(c, sx + 3, sy + 5, 1, 1, PAL.stamD); R(c, sx + 12, sy + 5, 1, 1, PAL.stamD); },
    bloemen: (c, sx, sy) => { R(c, sx + 2, sy + 4, 12, 9, PAL.aarde); R(c, sx + 3, sy + 5, 10, 7, '#5a7a44'); [[4, 6, PAL.bloem1], [8, 5, PAL.bloem2], [11, 7, PAL.bloem3], [6, 9, PAL.bloem2], [10, 10, PAL.bloem1]].forEach(([x, y, col]) => R(c, sx + x, sy + y, 2, 2, col)); },
    auto: (c, sx, sy, p) => { R(c, sx + 1, sy + 5, 14, 8, PAL.ink); R(c, sx + 2, sy + 4, 12, 8, p.kleur || '#c9403a'); R(c, sx + 4, sy + 5, 3, 3, PAL.glas); R(c, sx + 9, sy + 5, 3, 3, PAL.glas); R(c, sx + 2, sy + 12, 3, 2, PAL.ink); R(c, sx + 11, sy + 12, 3, 2, PAL.ink); R(c, sx + 3, sy + 10, 10, 1, 'rgba(255,255,255,.25)'); },
    kraan: (c, sx, sy) => { R(c, sx + 6, sy - 28, 3, 44, '#f2c230'); for (let j = -26; j < 14; j += 4) R(c, sx + 7, sy + j, 1, 2, '#9c7a12'); R(c, sx - 12, sy - 30, 40, 2, '#f2c230'); R(c, sx + 20, sy - 28, 1, 10, PAL.ink); R(c, sx + 19, sy - 18, 3, 2, PAL.ink); R(c, sx + 4, sy + 12, 8, 4, '#9c7a12'); },
    fietsen: (c, sx, sy) => { for (let i = 0; i < 3; i++) { const bx = sx + 1 + i * 5; c.strokeStyle = '#3b3f4a'; c.lineWidth = 1; c.beginPath(); c.arc(bx + 1.5, sy + 11.5, 2, 0, 7); c.stroke(); c.beginPath(); c.arc(bx + 4.5, sy + 11.5, 2, 0, 7); c.stroke(); R(c, bx + 2, sy + 7, 2, 2, '#b5443a'); } },
    prullenbak: (c, sx, sy) => { R(c, sx + 5, sy + 6, 6, 8, '#3b5fa8'); R(c, sx + 4, sy + 5, 8, 2, '#2a4480'); R(c, sx + 6, sy + 8, 1, 4, '#5a7fd0'); },
    picknick: (c, sx, sy) => { R(c, sx + 1, sy + 5, 14, 4, PAL.houtL); R(c, sx + 1, sy + 9, 14, 1, PAL.hout); R(c, sx + 1, sy + 1, 14, 2, PAL.houtL); R(c, sx + 1, sy + 12, 14, 2, PAL.houtL); R(c, sx + 4, sy + 9, 2, 4, PAL.stamD); R(c, sx + 10, sy + 9, 2, 4, PAL.stamD); },
    fontein: (c, sx, sy) => { c.fillStyle = PAL.steen; c.beginPath(); c.ellipse(sx + 8, sy + 9, 7, 5, 0, 0, 7); c.fill(); c.fillStyle = PAL.water; c.beginPath(); c.ellipse(sx + 8, sy + 9, 5, 3, 0, 0, 7); c.fill(); R(c, sx + 7, sy + 3, 2, 6, PAL.steenD); R(c, sx + 6, sy + 2, 4, 2, PAL.steenL); },
    bushalte: (c, sx, sy) => { R(c, sx + 2, sy + 2, 12, 2, '#3b3f4a'); R(c, sx + 2, sy + 4, 1, 10, '#3b3f4a'); R(c, sx + 13, sy + 4, 1, 10, '#3b3f4a'); R(c, sx + 3, sy + 4, 10, 6, 'rgba(180,220,240,.5)'); R(c, sx + 4, sy + 10, 8, 2, PAL.houtL); },
    bord: (c, sx, sy) => { R(c, sx + 7, sy + 6, 2, 9, PAL.stamD); R(c, sx + 2, sy + 1, 12, 7, PAL.houtL); R(c, sx + 3, sy + 2, 10, 5, PAL.wit); R(c, sx + 4, sy + 3, 6, 1, PAL.ink); R(c, sx + 4, sy + 5, 8, 1, PAL.ink); },
  };
  function tekenLabel(c, straat) {
    const [x, y] = straat.tegel;
    c.save(); c.font = '5px "Press Start 2P", monospace'; c.textBaseline = 'middle';
    const w = c.measureText(straat.naam).width + 6;
    if (straat.richting === 'v') { c.translate(x * T + 8, y * T); c.rotate(Math.PI / 2); } else c.translate(x * T, y * T + 8);
    R(c, 0, -4, w, 8, 'rgba(15,24,19,.45)'); c.fillStyle = PAL.wit; c.fillText(straat.naam, 3, 1); c.restore();
  }
  function tekenBuiten(C) {
    const MAP = C.tilemap, MW = MAP[0].length, MH = MAP.length;
    const off = document.createElement('canvas'); off.width = MW * T; off.height = MH * T;
    const c = off.getContext('2d'); c.imageSmoothingEnabled = false;
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) tekenGrond(c, MAP, x, y, x * T, y * T);
    // grondschaduw van gebouwen (zuid en oost)
    c.fillStyle = 'rgba(20,40,20,.22)';
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      const ch = MAP[y][x]; if (!'BKGN'.includes(ch)) continue;
      if (MAP[y + 1] && !'BKGN'.includes(MAP[y + 1][x])) c.fillRect(x * T + 2, (y + 1) * T, T, 4);
      if (!'BKGN'.includes(MAP[y][x + 1] || 'B') && MAP[y][x + 1]) c.fillRect((x + 1) * T, y * T + 4, 3, T);
    }
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (MAP[y][x] === 'T') tekenBoom(c, x, y, x * T, y * T, 'grond');
    WQGebouwen.teken(c, C);
    for (const p of C.props) if (PROPS[p.type]) PROPS[p.type](c, p.tegel[0] * T, p.tegel[1] * T, p);
    for (const s of C.straten) tekenLabel(c, s);
    return off;
  }
  // Overlaylaag: boomkronen, getekend ná de sprites zodat de held erachter kan lopen.
  function tekenOverlay(C) {
    const MAP = C.tilemap, MW = MAP[0].length, MH = MAP.length;
    const off = document.createElement('canvas'); off.width = MW * T; off.height = MH * T;
    const c = off.getContext('2d'); c.imageSmoothingEnabled = false;
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (MAP[y][x] === 'T') tekenBoom(c, x, y, x * T, y * T, 'kroon');
    return off;
  }

  // ---------- binnen ----------
  const MEUBEL = {
    d: (c, sx, sy) => { R(c, sx + 1, sy + 5, 14, 8, PAL.bureau); R(c, sx + 1, sy + 4, 14, 3, PAL.bureauL); R(c, sx + 2, sy + 13, 2, 2, PAL.bureau); R(c, sx + 12, sy + 13, 2, 2, PAL.bureau); },
    m: (c, sx, sy) => { MEUBEL.d(c, sx, sy); R(c, sx + 5, sy, 7, 6, PAL.scherm); R(c, sx + 6, sy + 1, 5, 4, PAL.glas); R(c, sx + 7, sy + 2, 3, 1, PAL.wit); R(c, sx + 8, sy + 6, 1, 1, PAL.scherm); },
    c: (c, sx, sy) => { R(c, sx + 4, sy + 2, 8, 4, PAL.stoel); R(c, sx + 3, sy + 6, 10, 6, '#4f5563'); R(c, sx + 4, sy + 12, 2, 2, PAL.stoel); R(c, sx + 10, sy + 12, 2, 2, PAL.stoel); },
    t: (c, sx, sy) => { R(c, sx, sy + 4, 16, 9, PAL.bureau); R(c, sx, sy + 3, 16, 3, PAL.bureauL); },
    b: (c, sx, sy) => { R(c, sx + 2, sy + 1, 12, 14, '#8a5a2b'); R(c, sx + 3, sy + 2, 10, 4, PAL.laken); R(c, sx + 4, sy + 3, 8, 2, '#e3e3e3'); R(c, sx + 3, sy + 6, 10, 8, PAL.deken); R(c, sx + 3, sy + 6, 10, 1, '#4f8ad6'); },
    p: (c, sx, sy) => { R(c, sx + 5, sy + 9, 6, 6, PAL.pot); R(c, sx + 4, sy + 8, 8, 2, '#c0633a'); c.fillStyle = PAL.blad; c.beginPath(); c.arc(sx + 8, sy + 5, 5, 0, 7); c.fill(); R(c, sx + 5, sy + 3, 2, 2, PAL.kroonL); R(c, sx + 9, sy + 6, 2, 1, PAL.kroonD); },
    s: (c, sx, sy) => { R(c, sx + 1, sy, 14, 15, PAL.bureau); R(c, sx + 2, sy + 1, 12, 13, '#6e4520'); [[3, 2, '#c9403a'], [6, 2, '#3b5fa8'], [9, 2, '#e0a84a'], [3, 8, '#2f7d32'], [7, 8, '#f2f2f2'], [10, 8, '#7a3e9d']].forEach(([x, y, col]) => R(c, sx + x, sy + y, 2, 5, col)); R(c, sx + 2, sy + 7, 12, 1, PAL.bureauL); },
    k: (c, sx, sy) => { R(c, sx, sy + 4, 16, 10, '#8d949c'); R(c, sx, sy + 3, 16, 3, PAL.staal); R(c, sx + 2, sy + 8, 5, 4, '#6f767e'); R(c, sx + 9, sy + 8, 5, 4, '#6f767e'); },
    P: (c, sx, sy) => { R(c, sx, sy + 5, 16, 6, PAL.houtL); R(c, sx, sy + 3, 16, 2, PAL.bureau); R(c, sx + 1, sy + 11, 2, 3, PAL.bureau); R(c, sx + 13, sy + 11, 2, 3, PAL.bureau); },
    x: (c, sx, sy) => { R(c, sx + 2, sy + 3, 12, 11, PAL.kist); R(c, sx + 2, sy + 3, 12, 2, '#f0c35c'); R(c, sx + 3, sy + 8, 10, 1, '#b07a1e'); R(c, sx + 7, sy + 4, 2, 9, '#b07a1e'); },
    B: (c, sx, sy) => { R(c, sx + 1, sy + 2, 14, 10, PAL.staal); R(c, sx + 2, sy + 3, 12, 8, PAL.bord); R(c, sx + 3, sy + 5, 7, 1, '#2b6cb0'); R(c, sx + 3, sy + 7, 9, 1, '#c9403a'); R(c, sx + 3, sy + 9, 5, 1, '#2f7d32'); },
    S: (c, sx, sy) => { R(c, sx, sy, 16, 16, PAL.plank2); R(c, sx, sy, 16, 2, PAL.plank); R(c, sx, sy + 14, 16, 2, '#8a6a40'); },
    o: (c, sx, sy) => { R(c, sx + 1, sy + 2, 14, 13, '#5a3a1e'); for (let i = 0; i < 6; i++) R(c, sx + 2 + i * 2, sy + 1 - (i % 3), 1, 7 + (i % 3), '#c9c9c9'); R(c, sx + 2, sy + 10, 12, 3, '#f4ead8'); R(c, sx + 3, sy + 10, 1, 3, '#1a1f1c'); R(c, sx + 7, sy + 10, 1, 3, '#1a1f1c'); R(c, sx + 11, sy + 10, 1, 3, '#1a1f1c'); },
    l: (c, sx, sy) => { R(c, sx + 7, sy + 5, 2, 9, '#3b3f4a'); R(c, sx + 5, sy + 13, 6, 2, '#3b3f4a'); R(c, sx + 4, sy + 1, 8, 5, '#fff7cc'); R(c, sx + 5, sy + 2, 6, 3, '#ffe9a8'); },
    f: (c, sx, sy) => { R(c, sx + 3, sy + 1, 10, 14, '#2a2d35'); R(c, sx + 4, sy + 2, 8, 4, '#5aa7d6'); R(c, sx + 5, sy + 3, 2, 2, '#fff'); R(c, sx + 6, sy + 9, 4, 3, '#f4f4f4'); R(c, sx + 4, sy + 13, 8, 1, '#8d949c'); R(c, sx + 9, sy + 7, 2, 1, '#d65a4a'); },
  };
  function tekenBinnen(binnen, C) {
    const K = binnen.kaart, W = K[0].length, H = K.length;
    const off = document.createElement('canvas'); off.width = W * T; off.height = H * T;
    const c = off.getContext('2d'); c.imageSmoothingEnabled = false;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const ch = K[y][x], sx = x * T, sy = y * T;
      R(c, sx, sy, T, T, PAL.vloer); R(c, sx, sy, T, 1, PAL.vloer2); R(c, sx, sy, 1, T, PAL.vloer2);
      if (ch === '_') { R(c, sx, sy, T, T, PAL.plank); for (let j = 0; j < T; j += 4) R(c, sx, sy + j, T, 1, PAL.plank2); R(c, sx + ((x * 7) % 16), sy + 2, 1, 2, PAL.plank2); }
      if (ch === 'r') { R(c, sx, sy, T, T, PAL.kleed); R(c, sx + 2, sy + 2, 12, 12, PAL.kleed2); R(c, sx + 4, sy + 4, 8, 8, PAL.kleed); }
      if (ch === '#' || ch === 'w' || ch === 'B' || ch === 'q') {
        if (y === 0) { R(c, sx, sy, T, T, PAL.behang); for (let i = 2; i < T; i += 6) for (let j = 5; j < 13; j += 4) R(c, sx + i, sy + j, 1, 1, PAL.behang2); R(c, sx, sy, T, 3, PAL.muurTop); R(c, sx, sy + 13, T, 3, '#b9ad9c'); R(c, sx, sy + 3, T, 1, PAL.muurL); R(c, sx, sy + 12, T, 1, '#cbbfa9'); }
        else { R(c, sx, sy, T, T, PAL.muurTop); R(c, sx + 2, sy + 2, 12, 12, '#6b5d54'); if (y === H - 1) R(c, sx, sy, T, 2, '#7d6e63'); }
        if (ch === 'w') { R(c, sx + 3, sy + 4, 10, 8, PAL.wit); R(c, sx + 4, sy + 5, 8, 6, PAL.glas); R(c, sx + 5, sy + 6, 2, 2, PAL.wit); R(c, sx + 8, sy + 5, 1, 6, PAL.wit); }
        if (ch === 'B') MEUBEL.B(c, sx, sy);
        if (ch === 'q') { R(c, sx + 3, sy + 4, 10, 8, '#8a5a2b'); R(c, sx + 4, sy + 5, 8, 6, '#5aa7d6'); R(c, sx + 4, sy + 8, 8, 3, '#7bb661'); R(c, sx + 6, sy + 6, 2, 1, '#fff7cc'); R(c, sx + 9, sy + 7, 2, 2, '#3f7d3a'); }
      } else if (ch === 'D') { R(c, sx, sy, T, T, PAL.muurTop); R(c, sx + 2, sy, 12, T, PAL.vloer); R(c, sx + 3, sy + 6, 10, 8, PAL.kleed2); R(c, sx + 4, sy + 7, 8, 6, PAL.kleed); }
      else if (MEUBEL[ch]) MEUBEL[ch](c, sx, sy);
    }
    return off;
  }
  return { T, PAL, hash, tekenBuiten, tekenOverlay, tekenWater, tekenBinnen, R, randen };
})();
