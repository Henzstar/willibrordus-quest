// Buitentegels (32 x 32) met autotiling, decoratie en binnentegels. Alles procedureel; geen afbeeldingen.
const WQTiles = (() => {
  'use strict';
  const T = 32;
  const PAL = {
    gras: '#7bb661', gras2: '#6aa352', gras3: '#8cc46f', gras4: '#5e9a4a', pad: '#d9c38a', pad2: '#c4ad77', padRand: '#b89b63', padLicht: '#e6d4a3',
    asfalt: '#6b7280', asfalt2: '#9aa3ad', asfaltD: '#5c626e', stoep: '#a3aab3', stoepD: '#8a9099', water: '#5aa7d6', water2: '#8cc5e8', waterDiep: '#4a93c2', schuim: '#cfe9f7',
    kroon: '#3f7d3a', kroonD: '#2f6b2e', kroonL: '#5aa35a', kroonXL: '#78bd6e', herfst: '#d08a3a', herfstD: '#a9632a', herfstL: '#e8b24a', herfstXL: '#f2d27a', geel: '#c9b43a', geelD: '#9c8a2a', geelL: '#e0cf5a', blad: '#c9843a', bladD: '#a9632a', tak: '#5a4632', stam: '#6b4a2b', stamD: '#4e351f', stamL: '#8a6a3f',
    zand: '#e0cfa0', zand2: '#cdb985', hek: '#8d949c', akker: '#a9b46a', akker2: '#8f9a52', akker3: '#c3cc80', hout: '#8a5a2b', houtL: '#b07a3e',
    ink: '#1a1f1c', wit: '#ffffff', lamp: '#ffe9a8', bloem1: '#f2f2f2', bloem2: '#f6d44c', bloem3: '#e86f9a', bloem4: '#7a9bff', aarde: '#4e6b3a',
    heg: '#2f6b2e', hegL: '#4c9448', hegD: '#1f4d20', steen: '#9aa3ad', steenL: '#c3c9d1', steenD: '#6f767e', veld: '#8cc46f', veld2: '#7bb661', brug: '#a9774a', brug2: '#8a5a2b',
    vloer: '#e9e1d2', vloer2: '#d9d0bf', plank: '#c8a06c', plank2: '#b08a58', lino: '#cfd6cc', lino2: '#bfc7bb', beton: '#c9c6bd', beton2: '#b5b2a8', muur: '#d8cfc0', muurTop: '#5a4e46', muurL: '#ece5d8', behang: '#e4d7c3', behang2: '#d7c8b0', kleed: '#b5443a', kleed2: '#8e332a',
    bureau: '#8a5a2b', bureauL: '#b07a3e', scherm: '#3b3f4a', glas: '#5aa7d6', staal: '#aab2bb', stoel: '#3b3f4a', laken: '#f4f4f4', deken: '#2b6cb0', pot: '#a0522d', blad: '#2f7d32', kist: '#d9a441', bord: '#fbfbfb',
  };
  const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;
  const R = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  function randen(c, sx, sy, zelfde, kleur, dik) {
    const N = zelfde(0, -1), Z = zelfde(0, 1), W = zelfde(-1, 0), O = zelfde(1, 0), d = dik;
    if (!N) R(c, sx, sy, T, d, kleur); if (!Z) R(c, sx, sy + T - d, T, d, kleur);
    if (!W) R(c, sx, sy, d, T, kleur); if (!O) R(c, sx + T - d, sy, d, T, kleur);
    const hoek = (hx, hy) => { R(c, sx + hx, sy + hy, d + 2, d + 2, kleur); };
    if (!N && !W) { hoek(0, 0); R(c, sx + d + 2, sy + d, 1, 1, kleur); R(c, sx + d, sy + d + 2, 1, 1, kleur); }
    if (!N && !O) { hoek(T - d - 2, 0); R(c, sx + T - d - 3, sy + d, 1, 1, kleur); R(c, sx + T - d - 1, sy + d + 2, 1, 1, kleur); }
    if (!Z && !W) { hoek(0, T - d - 2); R(c, sx + d + 2, sy + T - d - 1, 1, 1, kleur); R(c, sx + d, sy + T - d - 3, 1, 1, kleur); }
    if (!Z && !O) { hoek(T - d - 2, T - d - 2); R(c, sx + T - d - 3, sy + T - d - 1, 1, 1, kleur); R(c, sx + T - d - 1, sy + T - d - 3, 1, 1, kleur); }
    if (N && W && !zelfde(-1, -1)) R(c, sx, sy, d, d, kleur); if (N && O && !zelfde(1, -1)) R(c, sx + T - d, sy, d, d, kleur);
    if (Z && W && !zelfde(-1, 1)) R(c, sx, sy + T - d, d, d, kleur); if (Z && O && !zelfde(1, 1)) R(c, sx + T - d, sy + T - d, d, d, kleur);
  }
  function grasrand(c, sx, sy, zelfde, h) {
    const p = (x, y, k) => { R(c, sx + x, sy + y, 1 + (k & 1), 1, (h >> (x + y)) & 1 ? PAL.gras : PAL.gras2); };
    if (!zelfde(0, -1)) for (let i = (h & 3); i < T; i += 3 + (h & 1)) { p(i, 0, i); if ((h >> (i & 15)) & 1) p(i, 1, i); if ((h >> (i & 15)) & 2) p(i + 1, 2, 0); }
    if (!zelfde(0, 1)) for (let i = ((h >> 2) & 3); i < T; i += 3 + ((h >> 1) & 1)) { p(i, 31, i); if ((h >> (i & 15)) & 2) p(i, 30, i); }
    if (!zelfde(-1, 0)) for (let i = ((h >> 4) & 3); i < T; i += 4) { p(0, i, 0); if ((h >> (i & 15)) & 4) p(1, i, 0); }
    if (!zelfde(1, 0)) for (let i = ((h >> 6) & 3); i < T; i += 4) { p(31, i, 0); if ((h >> (i & 15)) & 8) p(30, i, 0); }
  }
  function bloem(c, x, y, col) { R(c, x, y - 1, 1, 1, col); R(c, x - 1, y, 3, 1, col); R(c, x, y + 1, 1, 1, col); R(c, x, y, 1, 1, PAL.bloem2); R(c, x, y + 2, 1, 2, PAL.gras4); }

  // ---------- grond ----------
  function tekenGrond(c, MAP, x, y, sx, sy) {
    const ch = MAP[y][x], at = (dx, dy) => (MAP[y + dy] && MAP[y + dy][x + dx]) || 'T', h = hash(x, y);
    R(c, sx, sy, T, T, PAL.gras);
    if ('.THC'.includes(ch)) {
      for (let i = 0; i < 9; i++) { const px = (h >> (i * 3)) & 31, py = (h >> (i * 3 + 5)) & 31; R(c, sx + px, sy + py, i % 3 ? 1 : 2, 1, i % 2 ? PAL.gras2 : PAL.gras3); }
      if (h % 5 === 0 && ch === '.') { const tx = 4 + (h & 15), ty = 8 + ((h >> 4) & 15); R(c, sx + tx, sy + ty, 1, 5, PAL.gras4); R(c, sx + tx + 2, sy + ty - 2, 1, 7, PAL.gras4); R(c, sx + tx + 4, sy + ty + 1, 1, 4, PAL.gras4); R(c, sx + tx + 1, sy + ty - 1, 1, 1, PAL.gras3); R(c, sx + tx + 3, sy + ty - 3, 1, 1, PAL.gras3); }
      if (h % 13 === 0 && ch === '.') { bloem(c, sx + 6 + (h & 7), sy + 8, PAL.bloem1); bloem(c, sx + 20, sy + 18 + (h & 3), PAL.bloem3); }
      if (h % 29 === 0 && ch === '.') { bloem(c, sx + 14, sy + 12, PAL.bloem4); bloem(c, sx + 24, sy + 24, PAL.bloem1); }
      if (h % 47 === 0 && ch === '.') { R(c, sx + 20, sy + 24, 7, 3, '#d9c38a'); R(c, sx + 22, sy + 22, 3, 2, '#d9c38a'); R(c, sx + 21, sy + 27, 5, 1, PAL.pad2); }
      if (ch === '.') for (let i = 0; i < ((h >> 7) % 3); i++) { const lx = (h >> (i * 5 + 1)) & 31, ly = (h >> (i * 5 + 9)) & 31; R(c, sx + lx, sy + ly, 3, 2, i % 2 ? PAL.blad : PAL.geel); R(c, sx + lx + 1, sy + ly - 1, 1, 1, PAL.bladD); }
      const nat = (dx, dy) => at(dx, dy) === 'W';
      if (nat(0, -1)) R(c, sx, sy, T, 4, PAL.zand); if (nat(0, 1)) R(c, sx, sy + 28, T, 4, PAL.zand); if (nat(-1, 0)) R(c, sx, sy, 4, T, PAL.zand); if (nat(1, 0)) R(c, sx + 28, sy, 4, T, PAL.zand);
      if (ch === 'H') { const zh = (dx, dy) => at(dx, dy) === 'H'; R(c, sx, sy, T, T, PAL.heg); for (let i = 0; i < 14; i++) R(c, sx + 2 + ((h >> i) & 7) * 4, sy + 3 + ((h >> (i + 3)) & 7) * 3, 3, 2, (i & 1) ? PAL.hegL : PAL.hegD); randen(c, sx, sy, zh, PAL.hegD, 3); if (!zh(0, -1)) R(c, sx + 4, sy + 3, T - 8, 2, PAL.hegL); R(c, sx, sy + 30, T, 2, 'rgba(20,40,20,.35)'); }
      if (ch === 'C') { const gx = 6 + (h % 5), gy = 6 + ((h >> 2) % 3); R(c, sx + gx + 1, sy + gy + 2, 14, 18, PAL.steenD); R(c, sx + gx, sy + gy, 14, 18, PAL.steen); R(c, sx + gx + 2, sy + gy + 2, 10, 14, PAL.steenL); c.fillStyle = PAL.steen; c.beginPath(); c.arc(sx + gx + 7, sy + gy, 7, Math.PI, 0); c.fill(); R(c, sx + gx + 4, sy + gy + 6, 6, 1, PAL.steenD); R(c, sx + gx + 4, sy + gy + 9, 6, 1, PAL.steenD); R(c, sx + gx + 5, sy + gy + 12, 4, 1, PAL.steenD); if (h % 2) { R(c, sx + gx + 6, sy + gy - 8, 2, 8, PAL.steen); R(c, sx + gx + 4, sy + gy - 6, 6, 2, PAL.steen); } R(c, sx + gx - 2, sy + gy + 18, 18, 2, PAL.steenD); if (h % 3 === 0) bloem(c, sx + gx + 16, sy + gy + 20, PAL.bloem3); if (h % 3 === 1) bloem(c, sx + gx - 3, sy + gy + 20, PAL.bloem2); }
      return;
    }
    const hard = k => '-=PS+'.includes(k);
    if (ch === 'D') {
      R(c, sx, sy, T, T, '#8fb86a'); for (let i = 0; i < 8; i++) R(c, sx + ((h >> i) & 31), sy + ((h >> (i + 5)) & 31), 2, 1, i % 2 ? PAL.gras2 : '#a9774a');
      if (h % 4 === 0) { c.fillStyle = '#8a6a3f'; c.beginPath(); c.ellipse(sx + 16, sy + 20, 9, 4, 0, 0, 7); c.fill(); }
      const d = (dx, dy) => at(dx, dy) === 'D';
      const paal = (x, y) => { R(c, sx + x, sy + y, 3, 8, PAL.hout); R(c, sx + x, sy + y, 1, 8, PAL.houtL); };
      if (!d(0, -1)) { R(c, sx, sy + 3, T, 2, PAL.houtL); R(c, sx, sy + 8, T, 2, PAL.houtL); paal(2, 0); paal(17, 0); }
      if (!d(0, 1)) { R(c, sx, sy + 23, T, 2, PAL.houtL); R(c, sx, sy + 28, T, 2, PAL.houtL); paal(2, 21); paal(17, 21); }
      if (!d(-1, 0)) { R(c, sx + 2, sy, 2, T, PAL.houtL); R(c, sx + 7, sy, 2, T, PAL.houtL); }
      if (!d(1, 0)) { R(c, sx + 23, sy, 2, T, PAL.houtL); R(c, sx + 28, sy, 2, T, PAL.houtL); }
      if (!d(-1, 0) && !d(0, -1)) { R(c, sx + 6, sy + 10, 14, 10, PAL.stamD); R(c, sx + 4, sy + 8, 18, 3, PAL.hout); R(c, sx + 8, sy + 13, 4, 7, '#2a1f14'); }
      return;
    }
    if (ch === 'O') {
      R(c, sx, sy, T, T, PAL.gras); const ox = at(-1, 0) === 'O' ? 0 : 32, oy = at(0, -1) === 'O' ? 0 : 32; // kwadrant van de 2 x 2 fontein
      const cx = sx + (ox ? 32 : 0), cy = sy + (oy ? 32 : 0);
      c.save(); c.beginPath(); c.rect(sx, sy, T, T); c.clip();
      c.fillStyle = PAL.steen; c.beginPath(); c.ellipse(cx, cy, 30, 24, 0, 0, 7); c.fill();
      c.fillStyle = PAL.steenL; c.beginPath(); c.ellipse(cx, cy - 2, 28, 21, 0, 0, 7); c.fill();
      c.fillStyle = PAL.water; c.beginPath(); c.ellipse(cx, cy, 24, 17, 0, 0, 7); c.fill();
      c.fillStyle = PAL.water2; c.beginPath(); c.ellipse(cx - 6, cy - 4, 8, 3, 0, 0, 7); c.fill();
      c.fillStyle = PAL.steenD; c.beginPath(); c.ellipse(cx, cy + 2, 7, 4, 0, 0, 7); c.fill(); R(c, cx - 3, cy - 14, 6, 16, PAL.steenD); R(c, cx - 6, cy - 16, 12, 3, PAL.steenL); R(c, cx - 2, cy - 13, 1, 12, PAL.steenL);
      c.restore(); return;
    }
    if (ch === 'A') { R(c, sx, sy, T, T, (x + y) % 2 ? PAL.veld : PAL.veld2); for (let i = 0; i < 6; i++) R(c, sx + ((h >> i) & 31), sy + ((h >> (i + 4)) & 31), 1, 1, PAL.gras3); const a = (dx, dy) => at(dx, dy) === 'A'; if (!a(0, -1)) R(c, sx, sy + 2, T, 2, PAL.wit); if (!a(0, 1)) R(c, sx, sy + 28, T, 2, PAL.wit); if (!a(-1, 0)) R(c, sx + 2, sy, 2, T, PAL.wit); if (!a(1, 0)) R(c, sx + 28, sy, 2, T, PAL.wit); return; }
    if (ch === '+') { R(c, sx, sy, T, T, PAL.brug); for (let j = 0; j < T; j += 6) R(c, sx, sy + j, T, 1, PAL.brug2); R(c, sx, sy, T, 3, PAL.brug2); R(c, sx, sy + 29, T, 3, PAL.brug2); R(c, sx + 4, sy, 2, T, PAL.stamD); R(c, sx + 26, sy, 2, T, PAL.stamD); R(c, sx + 3, sy + 1, 1, T - 2, PAL.stamL); return; }
    if (ch === '-' || ch === 'S') {
      R(c, sx, sy, T, T, ch === '-' ? PAL.pad : PAL.zand);
      for (let i = 0; i < 7; i++) { const px = (h >> (i * 4)) & 31, py = (h >> (i * 4 + 3)) & 31; R(c, sx + px, sy + py, 2 + (i & 1), 1, ch === '-' ? PAL.pad2 : PAL.zand2); if (i % 3 === 0) R(c, sx + px, sy + py - 1, 1, 1, PAL.padLicht); }
      if (ch === '-' && h % 11 === 0) { R(c, sx + 18, sy + 12, 3, 3, PAL.padLicht); R(c, sx + 19, sy + 13, 1, 1, PAL.pad2); R(c, sx + 24, sy + 24, 3, 2, PAL.padRand); }
      if (ch === '-') for (let i = 0; i < ((h >> 9) % 4); i++) { const lx = (h >> (i * 4 + 2)) & 31, ly = (h >> (i * 4 + 11)) & 31; R(c, sx + lx, sy + ly, 3, 2, i % 2 ? PAL.blad : PAL.geelD); R(c, sx + lx + 1, sy + ly - 1, 1, 1, PAL.bladD); }
      const zh = (dx, dy) => hard(at(dx, dy)) || 'BKGN'.includes(at(dx, dy));
      randen(c, sx, sy, zh, ch === '-' ? PAL.padRand : PAL.hek, 2);
      if (ch === '-') { if (!zh(0, -1)) R(c, sx + 2, sy + 2, T - 4, 1, PAL.padLicht); if (!zh(-1, 0)) R(c, sx + 2, sy + 2, 1, T - 4, PAL.padLicht); grasrand(c, sx, sy, (dx, dy) => zh(dx, dy) || at(dx, dy) !== '.', h); }
      if (ch === 'S') { if (!zh(0, -1)) for (let i = 2; i < T; i += 10) R(c, sx + i, sy, 2, 6, PAL.hek); if (!zh(0, 1)) for (let i = 2; i < T; i += 10) R(c, sx + i, sy + 26, 2, 6, PAL.hek); }
    } else if (ch === '=' || ch === 'P') {
      R(c, sx, sy, T, T, PAL.asfalt);
      for (let i = 0; i < 5; i++) R(c, sx + ((h >> i) & 31), sy + ((h >> (i + 5)) & 31), 1, 1, PAL.asfaltD);
      if (ch === '=') {
        const horiz = at(-1, 0) === '=' || at(1, 0) === '=';
        if (horiz && at(0, -1) !== '=' && at(0, 1) !== '=') R(c, sx + 4, sy + 15, 14, 3, PAL.asfalt2); else if (!horiz) R(c, sx + 15, sy + 4, 3, 14, PAL.asfalt2);
        randen(c, sx, sy, (dx, dy) => hard(at(dx, dy)), PAL.stoep, 3); randen(c, sx, sy, (dx, dy) => hard(at(dx, dy)), PAL.stoepD, 1);
        if (h % 41 === 0) { R(c, sx + 10, sy + 10, 12, 12, PAL.asfaltD); R(c, sx + 12, sy + 12, 8, 8, '#777e8a'); for (let j = 13; j < 20; j += 2) R(c, sx + 13, sy + j, 6, 1, PAL.asfaltD); }
      } else { R(c, sx + 30, sy, 2, T, PAL.wit); if (at(0, 1) === 'P') R(c, sx, sy + 30, T, 2, PAL.wit); if (at(0, -1) !== 'P') R(c, sx, sy, T, 2, PAL.wit); }
    } else if (ch === 'W') { R(c, sx, sy, T, T, (h % 5 === 0) ? PAL.waterDiep : PAL.water); }
    else if (ch === 'F') {
      R(c, sx, sy, T, T, PAL.akker);
      for (let i = 2; i < T; i += 8) { R(c, sx + i, sy, 2, T, PAL.akker2); for (let j = (h >> 3) & 7; j < T; j += 8) { R(c, sx + i + 2, sy + j, 3, 2, PAL.akker3); R(c, sx + i + 3, sy + j - 1, 1, 1, PAL.kroonL); } }
      const hekje = (dx, dy, hx, hy, w, hh) => { if (at(dx, dy) === '.' || at(dx, dy) === '-') R(c, sx + hx, sy + hy, w, hh, PAL.hout); };
      hekje(0, -1, 0, 2, T, 2); hekje(0, 1, 0, 27, T, 2); hekje(-1, 0, 2, 0, 2, T); hekje(1, 0, 28, 0, 2, T);
      if (at(0, -1) === '.') for (let i = 4; i < T; i += 12) R(c, sx + i, sy, 2, 6, PAL.houtL); if (at(0, 1) === '.') for (let i = 4; i < T; i += 12) R(c, sx + i, sy + 25, 2, 6, PAL.houtL);
    }
  }
  function tekenWater(c, MAP, x, y, sx, sy, t) {
    const at = (dx, dy) => (MAP[y + dy] && MAP[y + dy][x + dx]) || 'W', zw = (dx, dy) => at(dx, dy) === 'W', o = Math.floor(t / 10) % 32;
    R(c, sx, sy, T, T, (hash(x, y) % 5 === 0) ? PAL.waterDiep : PAL.water);
    c.fillStyle = PAL.water2; c.fillRect(sx + ((o + x * 5) % 32), sy + 9, 8, 2); c.fillRect(sx + ((o + 16 + y * 7) % 32), sy + 22, 6, 2); c.fillRect(sx + ((o * 2 + x * 3) % 32), sy + 16, 3, 1);
    randen(c, sx, sy, zw, PAL.zand2, 4); randen(c, sx, sy, zw, PAL.schuim, 2);
    const hl = hash(x, y); if (hl % 7 === 0 && zw(0, -1) && zw(0, 1)) { c.fillStyle = PAL.kroon; c.beginPath(); c.ellipse(sx + 10 + (hl & 7), sy + 12 + ((hl >> 3) & 7), 6, 4, 0, 0, 7); c.fill(); c.fillStyle = PAL.kroonL; c.beginPath(); c.ellipse(sx + 20 + (hl & 3), sy + 20, 5, 3, 0, 0, 7); c.fill(); R(c, sx + 9 + (hl & 7), sy + 10 + ((hl >> 3) & 7), 2, 2, PAL.bloem3); R(c, sx + 21, sy + 19, 1, 1, PAL.bloem2); }
    c.fillStyle = PAL.schuim; if (!zw(0, -1)) c.fillRect(sx + ((o >> 1) % 6) * 5, sy + 4, 3, 1); if (!zw(0, 1)) c.fillRect(sx + 5 + ((o >> 1) % 5) * 5, sy + 27, 3, 1);
  }
  // Bomen: stam in de grondlaag, kroon in de overlaylaag (valt vóór de held).
  function tekenBoom(c, x, y, sx, sy, laag) {
    const h = hash(x, y), ox = (h >> 2) % 3, groot = h % 3 === 0, r = (groot ? 16 : 14) + (h % 2), sz = (h >> 6) % 10;
    const K = sz < 3 ? { d: PAL.kroonD, m: PAL.kroon, l: PAL.kroonL, xl: PAL.kroonXL } : sz < 6 ? { d: PAL.herfstD, m: PAL.herfst, l: PAL.herfstL, xl: PAL.herfstXL } : sz < 8 ? { d: PAL.geelD, m: PAL.geel, l: PAL.geelL, xl: PAL.herfstXL } : null;
    if (laag === 'grond') { c.fillStyle = 'rgba(20,40,20,.28)'; c.beginPath(); c.ellipse(sx + 18 + ox, sy + 28, 14, 6, 0, 0, 7); c.fill(); }
    if (h % 5 === 0) { // naaldboom
      if (laag === 'grond') { R(c, sx + 14 + ox, sy + 22, 4, 9, PAL.stam); R(c, sx + 17 + ox, sy + 22, 1, 9, PAL.stamD); return; }
      [[22, 16, 14], [18, 8, 12], [14, 0, 10], [9, -7, 9]].forEach(([w, yy, hh], i) => { c.fillStyle = i % 2 ? PAL.kroonD : PAL.kroon; c.beginPath(); c.moveTo(sx + 16 + ox, sy + yy - 3); c.lineTo(sx + 16 + ox - w / 2, sy + yy + hh); c.lineTo(sx + 16 + ox + w / 2, sy + yy + hh); c.closePath(); c.fill(); R(c, sx + 12 + ox, sy + yy + hh - 3, 2, 1, PAL.kroonL); });
      R(c, sx + 13 + ox, sy + 4, 2, 1, PAL.kroonXL); R(c, sx + 11 + ox, sy + 12, 2, 1, PAL.kroonL); R(c, sx + 15 + ox, sy - 3, 1, 1, PAL.kroonXL);
      return;
    }
    if (laag === 'grond') { R(c, sx + 13 + ox, sy + 16, 6, 15, PAL.stam); R(c, sx + 17 + ox, sy + 16, 2, 15, PAL.stamD); R(c, sx + 13 + ox, sy + 17, 1, 12, PAL.stamL); R(c, sx + 11 + ox, sy + 28, 3, 3, PAL.stam); R(c, sx + 18 + ox, sy + 29, 3, 2, PAL.stamD); return; }
    const cx = sx + 16 + ox, cy = sy + (groot ? 4 : 8);
    if (!K) { // kale boom: takken
      c.strokeStyle = PAL.tak; c.lineWidth = 2; c.lineCap = 'round';
      [[0, -14, -9, -24], [0, -14, 8, -25], [0, -10, -13, -14], [0, -10, 12, -12], [-9, -24, -14, -30], [8, -25, 13, -31], [0, -14, 1, -30]].forEach(([x0, y0, x1, y1]) => { c.beginPath(); c.moveTo(cx + x0, sy + 20 + y0); c.lineTo(cx + x1, sy + 20 + y1); c.stroke(); });
      c.lineWidth = 1; [[-13, -14, -17, -19], [12, -12, 17, -17], [1, -30, -3, -36], [1, -30, 5, -35]].forEach(([x0, y0, x1, y1]) => { c.beginPath(); c.moveTo(cx + x0, sy + 20 + y0); c.lineTo(cx + x1, sy + 20 + y1); c.stroke(); });
      for (let i = 0; i < 5; i++) R(c, cx - 12 + ((h >> (i * 3)) % 24), sy - 8 + ((h >> (i * 3 + 2)) % 20), 2, 1, i % 2 ? PAL.blad : PAL.geel);
      return;
    }
    c.fillStyle = K.d; c.beginPath(); c.arc(cx, cy + 2, r, 0, 7); c.fill();
    c.fillStyle = K.m; c.beginPath(); c.arc(cx, cy, r - 2, 0, 7); c.fill();
    c.fillStyle = K.l; c.beginPath(); c.arc(cx - 4, cy - 4, r - 7, 0, 7); c.fill();
    c.fillStyle = K.xl; c.beginPath(); c.arc(cx - 6, cy - 7, r - 11, 0, 7); c.fill();
    for (let i = 0; i < 8; i++) { const a = (h >> i) & 7, bx = cx - r + 4 + ((h >> (i * 2)) % (r * 2 - 8)), by = cy - r + 4 + ((h >> (i * 2 + 5)) % (r * 2 - 8)); R(c, bx, by, 2, 1, a & 1 ? K.l : K.d); }
    if (sz >= 3 && (h >> 4) % 3 === 0) { c.fillStyle = PAL.gras; c.beginPath(); c.arc(cx + 6, cy + 4, 4, 0, 7); c.fill(); R(c, cx + 4, cy + 3, 1, 3, PAL.tak); R(c, cx + 7, cy + 1, 3, 1, PAL.tak); }
    if (sz < 3 && h % 7 === 0) { R(c, cx - 7, cy + 2, 2, 2, PAL.bloem3); R(c, cx + 5, cy - 3, 2, 2, PAL.bloem3); }
  }
  // ---------- auto's (bovenaanzicht, neus naar beneden) ----------
  const tint = (hex, d) => { const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.min(255, v + d)); return '#' + ((f(n >> 16) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).padStart(6, '0'); };
  const rond = (c, x, y, w, h, r, col) => { c.fillStyle = col; c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); c.fill(); };
  function tekenAuto(c, sx, sy, p) {
    const model = p.model || 'hatch', kleur = p.kleur || '#c9403a', D = tint(kleur, -45), L = tint(kleur, 40), rijen = model === 'volvo' ? 2 : (p.rijen || 1);
    const w = model === 'smart' ? 18 : model === 'volvo' ? 26 : 24, h = model === 'smart' ? 22 : model === 'volvo' ? 48 : rijen === 2 ? 38 : 28;
    const x0 = sx + ((T - w) >> 1), y0 = sy + ((rijen * T - h) >> 1), cx = x0 + w / 2;
    c.fillStyle = 'rgba(0,0,0,.28)'; c.beginPath(); c.ellipse(cx + 2, y0 + h / 2 + 3, w / 2 + 3, h / 2 + 1, 0, 0, 7); c.fill();
    // wielen (buiten de carrosserie) met velg
    const wl = model === 'volvo' ? 11 : 8, wy1 = y0 + 5, wy2 = y0 + h - 5 - wl;
    [[x0 - 2, wy1], [x0 + w - 1, wy1], [x0 - 2, wy2], [x0 + w - 1, wy2]].forEach(([x, y]) => { R(c, x, y, 3, wl, PAL.ink); R(c, x + 1, y + 2, 1, wl - 4, '#6a6f78'); });
    // carrosserie met ronde hoeken
    rond(c, x0 - 1, y0 - 1, w + 2, h + 2, 4, PAL.ink); rond(c, x0, y0, w, h, 3, kleur);
    R(c, x0 + 1, y0 + 1, 2, h - 2, L); R(c, x0 + w - 3, y0 + 1, 2, h - 2, D);
    if (model === 'smart') {
      // tridion-cel in zilver, dak open: stoelen en opgevouwen kap zichtbaar
      R(c, x0 + 1, y0 + 4, w - 2, h - 9, '#c8ccd0'); R(c, x0 + 3, y0 + 6, w - 6, h - 13, '#2a2d35');
      R(c, x0 + 3, y0 + 6, w - 6, 3, PAL.ink); R(c, x0 + 4, y0 + 6, w - 8, 1, '#4a4f5a');
      [[x0 + 4, y0 + 10], [x0 + w - 9, y0 + 10]].forEach(([x, y]) => { R(c, x, y, 5, 5, '#3b3f4a'); R(c, x + 1, y, 3, 1, '#5a606c'); R(c, x + 1, y + 3, 3, 2, '#4a4f5a'); });
      R(c, x0 + 3, y0 + h - 9, w - 6, 4, PAL.glas); R(c, x0 + 4, y0 + h - 8, 3, 1, PAL.wit); R(c, x0 + 3, y0 + h - 10, w - 6, 1, '#c8ccd0');
      R(c, x0 + 2, y0 + h - 3, 3, 2, PAL.lamp); R(c, x0 + w - 5, y0 + h - 3, 3, 2, PAL.lamp); R(c, x0 + 2, y0 + 1, 3, 2, '#d65a4a'); R(c, x0 + w - 5, y0 + 1, 3, 2, '#d65a4a');
      R(c, x0 - 2, y0 + h - 11, 2, 3, PAL.ink); R(c, x0 + w, y0 + h - 11, 2, 3, PAL.ink);
      R(c, cx - 3, y0 + h - 1, 6, 1, PAL.wit);
      return;
    }
    const daklen = model === 'volvo' ? h - 24 : h - 20, dak0 = y0 + 9;
    // achterruit, dak, voorruit, motorkap
    R(c, x0 + 3, y0 + 3, w - 6, 5, PAL.glas); R(c, x0 + 4, y0 + 4, 2, 1, PAL.wit); R(c, x0 + 3, y0 + 8, w - 6, 1, D);
    R(c, x0 + 3, dak0, w - 6, daklen, L); R(c, x0 + 3, dak0, w - 6, 1, tint(kleur, 70)); R(c, x0 + 3, dak0 + daklen - 1, w - 6, 1, D);
    R(c, x0 + 2, dak0 + 2, 1, daklen - 4, PAL.glas); R(c, x0 + w - 3, dak0 + 2, 1, daklen - 4, PAL.glas);
    if (model === 'volvo') { R(c, x0 + 4, dak0 + 1, 1, daklen - 2, '#3b3f4a'); R(c, x0 + w - 5, dak0 + 1, 1, daklen - 2, '#3b3f4a'); R(c, x0 + 3, y0 + 2, w - 6, 7, '#1f2a33'); R(c, x0 + 4, y0 + 3, 2, 1, PAL.wit); }
    const vr = dak0 + daklen; R(c, x0 + 2, vr, w - 4, 7, PAL.glas); R(c, x0 + 3, vr + 1, 4, 2, PAL.wit); R(c, x0 + w - 6, vr + 2, 2, 3, 'rgba(255,255,255,.35)'); R(c, x0 + 2, vr, w - 4, 1, PAL.ink);
    R(c, x0 + 2, vr + 7, w - 4, h - (vr + 7 - y0) - 3, kleur); R(c, x0 + 4, vr + 8, 1, h - (vr + 8 - y0) - 4, L); R(c, x0 + w - 5, vr + 8, 1, h - (vr + 8 - y0) - 4, D);
    if (model === 'volvo') { R(c, cx - 1, vr + 8, 2, 6, D); R(c, cx - 5, y0 + h - 5, 10, 2, '#1f2a33'); R(c, cx - 4, y0 + h - 4, 8, 1, '#5a606c'); }
    // koplampen, achterlichten, spiegels, kenteken
    R(c, x0 + 2, y0 + h - 4, 4, 2, PAL.lamp); R(c, x0 + w - 6, y0 + h - 4, 4, 2, PAL.lamp); R(c, x0 + 3, y0 + h - 4, 1, 1, PAL.wit);
    R(c, x0 + 2, y0 + 1, 4, 2, '#d65a4a'); R(c, x0 + w - 6, y0 + 1, 4, 2, '#d65a4a'); R(c, x0 + 2, y0 + h - 2, w - 4, 1, D);
    R(c, x0 - 2, vr + 1, 2, 3, PAL.ink); R(c, x0 + w, vr + 1, 2, 3, PAL.ink); R(c, x0 - 2, vr + 1, 2, 1, kleur); R(c, x0 + w, vr + 1, 2, 1, kleur);
    R(c, cx - 4, y0 + h - 1, 8, 1, PAL.wit); R(c, cx - 4, y0, 8, 1, PAL.wit);
  }
  // ---------- decoratie ----------
  const PROPS = {
    lantaarn: (c, sx, sy) => { R(c, sx + 20, sy + 6, 4, 22, '#3b3f4a'); R(c, sx + 21, sy + 7, 1, 20, '#5a606c'); R(c, sx + 16, sy, 12, 8, '#2a2d35'); R(c, sx + 18, sy + 2, 8, 5, PAL.lamp); R(c, sx + 19, sy + 3, 2, 2, PAL.wit); R(c, sx + 17, sy + 28, 10, 3, '#2a2d35'); R(c, sx + 21, sy - 2, 2, 2, '#2a2d35'); },
    bank: (c, sx, sy) => { R(c, sx + 4, sy + 12, 24, 3, PAL.houtL); R(c, sx + 4, sy + 16, 24, 3, PAL.houtL); R(c, sx + 4, sy + 15, 24, 1, PAL.hout); R(c, sx + 4, sy + 19, 24, 2, PAL.hout); R(c, sx + 6, sy + 21, 3, 6, PAL.stamD); R(c, sx + 23, sy + 21, 3, 6, PAL.stamD); R(c, sx + 4, sy + 6, 24, 3, PAL.houtL); R(c, sx + 4, sy + 9, 24, 1, PAL.hout); R(c, sx + 6, sy + 10, 2, 2, PAL.stamD); R(c, sx + 24, sy + 10, 2, 2, PAL.stamD); },
    bloemen: (c, sx, sy) => { R(c, sx + 3, sy + 7, 26, 20, PAL.aarde); R(c, sx + 5, sy + 9, 22, 16, '#5a7a44'); [[8, 12, PAL.bloem1], [16, 11, PAL.bloem2], [23, 14, PAL.bloem3], [11, 19, PAL.bloem2], [20, 21, PAL.bloem1], [15, 16, PAL.bloem4], [25, 20, PAL.bloem3]].forEach(([x, y, col]) => bloem(c, sx + x, sy + y, col)); R(c, sx + 3, sy + 25, 26, 2, '#3f5a2f'); },
    auto: (c, sx, sy, p) => tekenAuto(c, sx, sy, p),
    kraan: (c, sx, sy) => { R(c, sx + 12, sy - 56, 6, 88, '#f2c230'); for (let j = -52; j < 28; j += 8) { R(c, sx + 14, sy + j, 2, 4, '#9c7a12'); R(c, sx + 12, sy + j + 4, 6, 1, '#9c7a12'); } R(c, sx - 24, sy - 60, 80, 4, '#f2c230'); R(c, sx - 24, sy - 56, 80, 1, '#9c7a12'); R(c, sx + 40, sy - 56, 2, 20, PAL.ink); R(c, sx + 38, sy - 36, 6, 4, PAL.ink); R(c, sx + 8, sy + 24, 16, 8, '#9c7a12'); R(c, sx + 16, sy - 64, 4, 8, '#f2c230'); R(c, sx + 17, sy - 68, 2, 4, '#d65a4a'); },
    fietsen: (c, sx, sy) => { for (let i = 0; i < 3; i++) { const bx = sx + 2 + i * 10; c.strokeStyle = '#3b3f4a'; c.lineWidth = 1.5; c.beginPath(); c.arc(bx + 3, sy + 23, 4, 0, 7); c.stroke(); c.beginPath(); c.arc(bx + 9, sy + 23, 4, 0, 7); c.stroke(); c.beginPath(); c.moveTo(bx + 3, sy + 23); c.lineTo(bx + 6, sy + 15); c.lineTo(bx + 9, sy + 23); c.stroke(); R(c, bx + 4, sy + 13, 4, 2, '#b5443a'); R(c, bx + 8, sy + 12, 3, 1, '#3b3f4a'); } },
    bord: (c, sx, sy) => { R(c, sx + 14, sy + 12, 4, 18, PAL.stamD); R(c, sx + 15, sy + 13, 1, 16, PAL.stamL); R(c, sx + 4, sy + 2, 24, 14, PAL.houtL); R(c, sx + 6, sy + 4, 20, 10, PAL.wit); R(c, sx + 8, sy + 6, 12, 2, PAL.ink); R(c, sx + 8, sy + 10, 16, 2, PAL.ink); R(c, sx + 4, sy + 15, 24, 1, PAL.hout); },
    prullenbak: (c, sx, sy) => { R(c, sx + 10, sy + 12, 12, 16, '#3b5fa8'); R(c, sx + 8, sy + 10, 16, 4, '#2a4480'); R(c, sx + 12, sy + 16, 2, 8, '#5a7fd0'); R(c, sx + 11, sy + 28, 10, 2, '#2a4480'); },
    picknick: (c, sx, sy) => { R(c, sx + 2, sy + 10, 28, 8, PAL.houtL); R(c, sx + 2, sy + 18, 28, 2, PAL.hout); R(c, sx + 2, sy + 2, 28, 4, PAL.houtL); R(c, sx + 2, sy + 24, 28, 4, PAL.houtL); R(c, sx + 8, sy + 18, 3, 8, PAL.stamD); R(c, sx + 21, sy + 18, 3, 8, PAL.stamD); },
    fontein: (c, sx, sy) => { c.fillStyle = PAL.steen; c.beginPath(); c.ellipse(sx + 16, sy + 18, 14, 10, 0, 0, 7); c.fill(); c.fillStyle = PAL.water; c.beginPath(); c.ellipse(sx + 16, sy + 18, 10, 6, 0, 0, 7); c.fill(); R(c, sx + 14, sy + 6, 4, 12, PAL.steenD); R(c, sx + 12, sy + 4, 8, 4, PAL.steenL); R(c, sx + 10, sy + 16, 3, 1, PAL.schuim); R(c, sx + 19, sy + 19, 3, 1, PAL.schuim); },
    bushalte: (c, sx, sy) => { R(c, sx + 4, sy + 4, 24, 4, '#3b3f4a'); R(c, sx + 4, sy + 8, 2, 20, '#3b3f4a'); R(c, sx + 26, sy + 8, 2, 20, '#3b3f4a'); R(c, sx + 6, sy + 8, 20, 12, 'rgba(180,220,240,.5)'); R(c, sx + 8, sy + 20, 16, 4, PAL.houtL); },
  };
  function tekenLabel(c, straat) {
    const [x, y] = straat.tegel;
    c.save(); c.font = '7px "Press Start 2P", monospace'; c.textBaseline = 'middle';
    const w = c.measureText(straat.naam).width + 8;
    if (straat.richting === 'v') { c.translate(x * T + 16, y * T); c.rotate(Math.PI / 2); } else c.translate(x * T, y * T + 16);
    R(c, 0, -6, w, 12, 'rgba(15,24,19,.5)'); R(c, 0, -6, w, 1, 'rgba(255,255,255,.25)'); c.fillStyle = PAL.wit; c.fillText(straat.naam, 4, 1); c.restore();
  }
  function tekenBuiten(C) {
    const MAP = C.tilemap, MW = MAP[0].length, MH = MAP.length;
    const off = document.createElement('canvas'); off.width = MW * T; off.height = MH * T;
    const c = off.getContext('2d'); c.imageSmoothingEnabled = false;
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) tekenGrond(c, MAP, x, y, x * T, y * T);
    c.fillStyle = 'rgba(20,40,20,.22)';
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      const ch = MAP[y][x]; if (!'BKGN'.includes(ch)) continue;
      if (MAP[y + 1] && !'BKGN'.includes(MAP[y + 1][x])) c.fillRect(x * T + 4, (y + 1) * T, T, 8);
      if (MAP[y][x + 1] && !'BKGN'.includes(MAP[y][x + 1])) c.fillRect((x + 1) * T, y * T + 8, 6, T);
    }
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (MAP[y][x] === 'T') tekenBoom(c, x, y, x * T, y * T, 'grond');
    for (const p of C.props) if (PROPS[p.type]) PROPS[p.type](c, p.tegel[0] * T, p.tegel[1] * T, p);
    WQGebouwen.teken(c, C);
    for (const s of C.straten) tekenLabel(c, s);
    return off;
  }
  function tekenOverlay(C) {
    const MAP = C.tilemap, MW = MAP[0].length, MH = MAP.length;
    const off = document.createElement('canvas'); off.width = MW * T; off.height = MH * T;
    const c = off.getContext('2d'); c.imageSmoothingEnabled = false;
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (MAP[y][x] === 'T') tekenBoom(c, x, y, x * T, y * T, 'kroon');
    return off;
  }
  return { T, PAL, hash, tekenBuiten, tekenOverlay, tekenWater, R, randen, bloem, tekenBinnen: (b, C, buiten, deur) => WQBinnen.teken(b, C, buiten, deur) };
})();
