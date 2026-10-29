// Binnentegels (32 x 32): vloerpatronen per gebouwtype, muren met plint en behang, meubels. Geen teksten.
const WQBinnen = (() => {
  'use strict';
  const T = 32, R = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  const P = {
    vloer: '#e9e1d2', vloer2: '#d9d0bf', plank: '#c8a06c', plank2: '#b08a58', plank3: '#d9b47e', lino: '#cfd6cc', lino2: '#bfc7bb', beton: '#c9c6bd', beton2: '#b5b2a8',
    muur: '#d8cfc0', muurTop: '#5a4e46', muurL: '#ece5d8', behang: '#e4d7c3', behang2: '#d7c8b0', plint: '#b9ad9c', kleed: '#b5443a', kleed2: '#8e332a', kleed3: '#d9a441',
    bureau: '#8a5a2b', bureauL: '#b07a3e', scherm: '#3b3f4a', glas: '#5aa7d6', staal: '#aab2bb', stoel: '#3b3f4a', stoelL: '#4f5563', laken: '#f4f4f4', deken: '#2b6cb0', pot: '#a0522d', blad: '#2f7d32', bladL: '#5aa35a', kist: '#d9a441', bord: '#fbfbfb', wit: '#ffffff', ink: '#1a1f1c',
  };
  const VLOER = {
    tegel: (c, sx, sy, x, y) => { R(c, sx, sy, T, T, P.vloer); R(c, sx, sy, T, 1, P.vloer2); R(c, sx, sy, 1, T, P.vloer2); R(c, sx, sy + 16, T, 1, P.vloer2); R(c, sx + 16, sy, 1, T, P.vloer2); if ((x + y) % 2) R(c, sx + 1, sy + 1, 15, 15, '#e3dac9'); },
    hout: (c, sx, sy, x, y) => { R(c, sx, sy, T, T, P.plank); for (let j = 0; j < T; j += 8) { R(c, sx, sy + j, T, 1, P.plank2); R(c, sx, sy + j + 1, T, 1, P.plank3); } const o = (x * 11 + y * 7) % 32; R(c, sx + o, sy + 2, 1, 6, P.plank2); R(c, sx + (o + 17) % 32, sy + 18, 1, 6, P.plank2); },
    lino: (c, sx, sy, x, y) => { R(c, sx, sy, T, T, P.lino); for (let i = 0; i < 10; i++) R(c, sx + ((x * 13 + i * 7) % 31), sy + ((y * 17 + i * 11) % 31), 1, 1, P.lino2); R(c, sx, sy, T, 1, P.lino2); R(c, sx, sy, 1, T, P.lino2); },
    beton: (c, sx, sy, x, y) => { R(c, sx, sy, T, T, P.beton); for (let i = 0; i < 14; i++) R(c, sx + ((x * 5 + i * 9) % 31), sy + ((y * 3 + i * 13) % 31), 1, 1, P.beton2); if ((x + y) % 3 === 0) R(c, sx + 4, sy + 20, 10, 1, P.beton2); },
  };
  const M = {
    d: (c, sx, sy) => { R(c, sx + 2, sy + 10, 28, 16, P.bureau); R(c, sx + 2, sy + 8, 28, 5, P.bureauL); R(c, sx + 4, sy + 26, 4, 4, P.bureau); R(c, sx + 24, sy + 26, 4, 4, P.bureau); R(c, sx + 18, sy + 15, 8, 3, P.bureauL); R(c, sx + 5, sy + 14, 6, 6, '#f4f4f4'); },
    m: (c, sx, sy) => { M.d(c, sx, sy); R(c, sx + 10, sy, 14, 12, P.scherm); R(c, sx + 12, sy + 2, 10, 8, P.glas); R(c, sx + 13, sy + 3, 6, 1, P.wit); R(c, sx + 13, sy + 6, 4, 1, P.wit); R(c, sx + 16, sy + 12, 2, 2, P.scherm); R(c, sx + 13, sy + 14, 8, 1, P.scherm); },
    c: (c, sx, sy) => { R(c, sx + 8, sy + 4, 16, 8, P.stoel); R(c, sx + 6, sy + 12, 20, 12, P.stoelL); R(c, sx + 8, sy + 14, 16, 8, P.stoel); R(c, sx + 8, sy + 24, 4, 4, P.stoel); R(c, sx + 20, sy + 24, 4, 4, P.stoel); R(c, sx + 9, sy + 5, 14, 1, P.stoelL); },
    t: (c, sx, sy) => { R(c, sx, sy + 8, T, 18, P.bureau); R(c, sx, sy + 6, T, 6, P.bureauL); R(c, sx + 2, sy + 7, 28, 1, '#c99052'); },
    b: (c, sx, sy) => { R(c, sx + 4, sy + 2, 24, 28, '#8a5a2b'); R(c, sx + 6, sy + 4, 20, 8, P.laken); R(c, sx + 8, sy + 6, 16, 4, '#e3e3e3'); R(c, sx + 6, sy + 12, 20, 16, P.deken); R(c, sx + 6, sy + 12, 20, 2, '#4f8ad6'); R(c, sx + 8, sy + 18, 16, 1, '#1f5aa0'); },
    p: (c, sx, sy) => { R(c, sx + 10, sy + 18, 12, 12, P.pot); R(c, sx + 8, sy + 16, 16, 4, '#c0633a'); c.fillStyle = P.blad; c.beginPath(); c.arc(sx + 16, sy + 10, 10, 0, 7); c.fill(); c.fillStyle = P.bladL; c.beginPath(); c.arc(sx + 12, sy + 7, 4, 0, 7); c.fill(); R(c, sx + 18, sy + 13, 4, 2, '#2f6b2e'); R(c, sx + 15, sy + 14, 2, 4, '#2f6b2e'); },
    s: (c, sx, sy) => { R(c, sx + 2, sy, 28, 30, P.bureau); R(c, sx + 4, sy + 2, 24, 26, '#6e4520'); [[6, 4, '#c9403a'], [11, 4, '#3b5fa8'], [16, 4, '#e0a84a'], [21, 4, '#2f7d32'], [6, 16, '#f2f2f2'], [12, 16, '#7a3e9d'], [18, 16, '#c9403a'], [23, 16, '#2b6cb0']].forEach(([x, y, col]) => { R(c, sx + x, sy + y, 4, 10, col); R(c, sx + x + 1, sy + y + 2, 1, 6, 'rgba(0,0,0,.25)'); }); R(c, sx + 4, sy + 14, 24, 2, P.bureauL); R(c, sx + 4, sy + 26, 24, 2, P.bureauL); },
    k: (c, sx, sy) => { R(c, sx, sy + 8, T, 20, '#8d949c'); R(c, sx, sy + 6, T, 6, P.staal); R(c, sx + 4, sy + 16, 10, 8, '#6f767e'); R(c, sx + 18, sy + 16, 10, 8, '#6f767e'); R(c, sx + 8, sy + 19, 2, 2, P.staal); R(c, sx + 22, sy + 19, 2, 2, P.staal); R(c, sx + 2, sy + 7, 28, 1, '#d4dae0'); },
    P: (c, sx, sy) => { R(c, sx, sy + 10, T, 12, P.bureauL); R(c, sx, sy + 6, T, 4, P.bureau); R(c, sx, sy + 14, T, 1, P.bureau); R(c, sx + 2, sy + 22, 4, 6, P.bureau); R(c, sx + 26, sy + 22, 4, 6, P.bureau); },
    x: (c, sx, sy) => { R(c, sx + 4, sy + 6, 24, 22, P.kist); R(c, sx + 4, sy + 6, 24, 4, '#f0c35c'); R(c, sx + 6, sy + 16, 20, 2, '#b07a1e'); R(c, sx + 14, sy + 8, 4, 18, '#b07a1e'); R(c, sx + 4, sy + 26, 24, 2, '#b07a1e'); },
    B: (c, sx, sy) => { R(c, sx + 2, sy + 4, 28, 20, P.staal); R(c, sx + 4, sy + 6, 24, 16, P.bord); R(c, sx + 6, sy + 10, 14, 2, '#2b6cb0'); R(c, sx + 6, sy + 14, 18, 2, '#c9403a'); R(c, sx + 6, sy + 18, 10, 2, '#2f7d32'); },
    S: (c, sx, sy) => { R(c, sx, sy, T, T, P.plank2); R(c, sx, sy, T, 4, P.plank); R(c, sx, sy + 28, T, 4, '#8a6a40'); for (let j = 6; j < 28; j += 6) R(c, sx, sy + j, T, 1, '#a07a4a'); },
    o: (c, sx, sy) => { R(c, sx + 2, sy + 4, 28, 26, '#5a3a1e'); for (let i = 0; i < 7; i++) R(c, sx + 4 + i * 4, sy + 2 - (i % 4), 2, 14 + (i % 4), '#c9c9c9'); R(c, sx + 4, sy + 20, 24, 6, '#f4ead8'); for (let i = 6; i < 28; i += 4) R(c, sx + i, sy + 20, 1, 6, P.ink); R(c, sx + 6, sy + 27, 20, 2, '#3a2616'); },
    l: (c, sx, sy) => { R(c, sx + 14, sy + 10, 4, 18, '#3b3f4a'); R(c, sx + 10, sy + 26, 12, 4, '#3b3f4a'); R(c, sx + 8, sy + 2, 16, 10, '#fff7cc'); R(c, sx + 10, sy + 4, 12, 6, '#ffe9a8'); R(c, sx + 8, sy + 12, 16, 1, '#c9b870'); },
    f: (c, sx, sy) => { R(c, sx + 6, sy + 2, 20, 28, '#2a2d35'); R(c, sx + 8, sy + 4, 16, 8, P.glas); R(c, sx + 10, sy + 6, 4, 4, P.wit); R(c, sx + 12, sy + 18, 8, 6, '#f4f4f4'); R(c, sx + 8, sy + 26, 16, 2, '#8d949c'); R(c, sx + 18, sy + 14, 4, 2, '#d65a4a'); R(c, sx + 10, sy + 14, 6, 2, '#7bb661'); },
  };
  function teken(binnen, C) {
    const K = binnen.kaart, W = K[0].length, H = K.length, vloer = VLOER[binnen.vloer] || VLOER.tegel;
    const off = document.createElement('canvas'); off.width = W * T; off.height = H * T;
    const c = off.getContext('2d'); c.imageSmoothingEnabled = false;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const ch = K[y][x], sx = x * T, sy = y * T;
      vloer(c, sx, sy, x, y);
      if (ch === 'r') { R(c, sx, sy, T, T, P.kleed); R(c, sx + 3, sy + 3, 26, 26, P.kleed2); R(c, sx + 6, sy + 6, 20, 20, P.kleed); R(c, sx + 10, sy + 10, 12, 12, P.kleed3); R(c, sx + 13, sy + 13, 6, 6, P.kleed2); }
      if ('#wBq'.includes(ch)) {
        if (y === 0) { R(c, sx, sy, T, T, P.behang); for (let i = 4; i < T; i += 12) for (let j = 10; j < 26; j += 8) { R(c, sx + i, sy + j, 2, 2, P.behang2); R(c, sx + i + 6, sy + j + 4, 1, 1, P.behang2); } R(c, sx, sy, T, 6, P.muurTop); R(c, sx, sy + 6, T, 1, P.muurL); R(c, sx, sy + 26, T, 6, P.plint); R(c, sx, sy + 25, T, 1, '#cbbfa9'); }
        else { R(c, sx, sy, T, T, P.muurTop); R(c, sx + 4, sy + 4, 24, 24, '#6b5d54'); R(c, sx + 6, sy + 6, 20, 1, '#7d6e63'); if (y === H - 1) R(c, sx, sy, T, 4, '#7d6e63'); }
        if (ch === 'w') { R(c, sx + 5, sy + 7, 22, 17, P.wit); R(c, sx + 7, sy + 9, 18, 13, P.glas); R(c, sx + 9, sy + 11, 4, 4, P.wit); R(c, sx + 15, sy + 9, 2, 13, P.wit); R(c, sx + 7, sy + 15, 18, 1, P.wit); R(c, sx + 7, sy + 18, 18, 4, '#7bb661'); R(c, sx + 3, sy + 7, 2, 17, '#c9a24d'); R(c, sx + 27, sy + 7, 2, 17, '#c9a24d'); }
        if (ch === 'B') M.B(c, sx, sy);
        if (ch === 'q') { R(c, sx + 5, sy + 7, 22, 16, '#8a5a2b'); R(c, sx + 7, sy + 9, 18, 12, '#5aa7d6'); R(c, sx + 7, sy + 15, 18, 6, '#7bb661'); R(c, sx + 11, sy + 11, 4, 2, '#fff7cc'); R(c, sx + 18, sy + 13, 4, 4, '#3f7d3a'); R(c, sx + 9, sy + 17, 3, 2, '#a65a3c'); }
      } else if (ch === 'D') { R(c, sx, sy, T, T, P.muurTop); R(c, sx + 4, sy, 24, T, P.vloer); R(c, sx + 6, sy + 12, 20, 16, P.kleed2); R(c, sx + 8, sy + 14, 16, 12, P.kleed); R(c, sx + 4, sy, 2, T, '#7d6e63'); R(c, sx + 26, sy, 2, T, '#7d6e63'); }
      else if (M[ch]) { c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(sx + 4, sy + 26, 26, 4); M[ch](c, sx, sy); }
    }
    return off;
  }
  return { teken, T };
})();
