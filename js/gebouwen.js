// Gevels, daken en de Cultuurkoepel, getekend over de voetafdruk in de tilemap.
const WQGebouwen = (() => {
  'use strict';
  const T = 16;
  const R = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  const STIJL = {
    B: { dak: '#8b5e3c', dakD: '#6e4a2f', dakL: '#a5734a', muur: '#e8dcc5', muurD: '#d4c5a6', steen: '#dccfb4', plint: '#b9a98a', raam: '#5aa7d6', kozijn: '#fbfbfb', deur: '#5a3a1e', deurL: '#7a5230' },
    N: { dak: '#cfcac0', dakD: '#a9a39a', dakL: '#e3dfd6', muur: '#f4f1ea', muurD: '#dcd7cd', steen: '#ebe7df', plint: '#b8b2a7', raam: '#7ab8e0', kozijn: '#8d949c', deur: '#3b3f4a', deurL: '#5a606c' },
    G: { dak: '#c7dbe7', dakD: '#9fb9c9', dakL: '#e6f0f6', muur: '#dbe8f0', muurD: '#b8ccd8', steen: '#dbe8f0', plint: '#8d949c', raam: '#dbe8f0', kozijn: '#f4f8fa', deur: '#8d949c', deurL: '#aab2bb' },
  };
  let deuren = new Set();

  function dak(c, s, sx, sy, boven, links, rechts, ch) {
    R(c, sx, sy, T, T, s.dak);
    if (ch === 'G') { for (let i = 0; i < T; i += 8) { R(c, sx + i, sy, 1, T, s.kozijn); R(c, sx, sy + i, T, 1, s.kozijn); } R(c, sx + 2, sy + 2, 3, 1, s.dakL); R(c, sx + 10, sy + 10, 3, 1, s.dakL); }
    else if (ch === 'N') { for (let i = 0; i < 6; i++) R(c, sx + ((i * 7) % 15) + 1, sy + ((i * 5) % 13) + 1, 1, 1, s.dakD); }
    else { for (let j = 0; j < T; j += 4) { R(c, sx, sy + j + 3, T, 1, s.dakD); for (let i = (j / 4) % 2 ? 0 : 4; i < T; i += 8) R(c, sx + i, sy + j, 1, 3, s.dakD); } R(c, sx + 1, sy + 1, 2, 1, s.dakL); R(c, sx + 9, sy + 5, 2, 1, s.dakL); }
    if (!boven) { R(c, sx, sy, T, 2, s.dakD); R(c, sx, sy + 2, T, 1, s.dakL); if (ch === 'B' && ((sx * 7 + sy * 13) % 5 === 0)) { R(c, sx + 10, sy - 4, 4, 7, '#6e4a2f'); R(c, sx + 9, sy - 5, 6, 2, '#4e351f'); R(c, sx + 11, sy - 3, 2, 1, '#8b5e3c'); } }
    if (ch === 'B' && boven && ((sx * 3 + sy * 11) % 7 === 0)) { R(c, sx + 4, sy + 3, 8, 9, s.dakD); R(c, sx + 5, sy + 5, 6, 6, s.muur); R(c, sx + 6, sy + 6, 4, 4, s.raam); R(c, sx + 3, sy + 2, 10, 2, s.dakL); }
    if (!links) R(c, sx, sy, 1, T, s.dakD); if (!rechts) R(c, sx + 15, sy, 1, T, s.dakD);
  }
  function gevel(c, s, sx, sy, links, rechts, ch, deur) {
    R(c, sx, sy, T, T, s.muur);
    if (ch === 'B') for (let j = 2; j < 14; j += 3) { R(c, sx, sy + j, T, 1, s.steen); for (let i = (j / 3) % 2 ? 2 : 6; i < T; i += 8) R(c, sx + i, sy + j - 2, 1, 2, s.steen); }
    R(c, sx, sy, T, 2, s.muurD); R(c, sx, sy + 14, T, 2, s.plint);
    if (deur) {
      R(c, sx + 4, sy + 4, 8, 11, '#2a1f14'); R(c, sx + 5, sy + 5, 6, 10, s.deur); R(c, sx + 5, sy + 5, 2, 10, s.deurL); R(c, sx + 9, sy + 9, 1, 1, '#f2c230');
      R(c, sx + 3, sy + 3, 10, 1, s.kozijn); R(c, sx + 2, sy + 15, 12, 1, '#9c8c70'); R(c, sx + 12, sy + 6, 3, 4, '#1d6b4f'); R(c, sx + 13, sy + 7, 1, 2, '#7bb661'); R(c, sx + 1, sy + 4, 2, 2, '#ffe9a8');
      if (ch === 'N') { R(c, sx + 5, sy + 5, 6, 6, '#7ab8e0'); R(c, sx + 8, sy + 5, 1, 10, s.kozijn); }
    } else if (ch === 'G') { R(c, sx, sy + 2, T, 12, s.raam); for (let i = 0; i < T; i += 8) R(c, sx + i, sy + 2, 1, 12, s.kozijn); R(c, sx, sy + 8, T, 1, s.kozijn); R(c, sx + 2, sy + 4, 2, 1, '#f4f8fa'); }
    else if (ch === 'N') { R(c, sx + 1, sy + 3, 14, 9, s.kozijn); R(c, sx + 2, sy + 4, 12, 7, s.raam); R(c, sx + 8, sy + 4, 1, 7, s.kozijn); R(c, sx + 3, sy + 5, 2, 2, '#bfe0f2'); }
    else { [2, 9].forEach((i, k) => { const warm = ((sx * 5 + sy * 3 + k) % 4 === 0); R(c, sx + i, sy + 4, 5, 8, s.kozijn); R(c, sx + i + 1, sy + 5, 3, 6, warm ? '#f6dc8c' : s.raam); R(c, sx + i + 1, sy + 5, 1, 2, warm ? '#fff4c2' : '#bfe0f2'); if (!warm && k === 1) R(c, sx + i + 3, sy + 5, 1, 6, '#f4f4f4'); R(c, sx + i, sy + 12, 5, 1, s.plint); R(c, sx + i - 1, sy + 13, 7, 1, s.muurD); }); R(c, sx + 7, sy + 1, 2, 1, s.steen); }
    if (!links) R(c, sx, sy, 1, T, s.muurD); if (!rechts) R(c, sx + 15, sy, 1, T, s.muurD);
  }
  function koepel(c, x0, y0, w, h) {
    // Kruisvormig gebouw met groene koperen koepel en lantaarn, getekend over de voetafdruk (w x h tegels), 8 px extra naar boven.
    const sx = x0 * T, sy = y0 * T - 8, W = w * T, H = h * T + 8, cx = sx + W / 2;
    const steen = '#a65a3c', steenD = '#8a4a30', steenL = '#c27a58', koper = '#7fae93', koperD = '#5f8a72', koperL = '#a7cbb5', ink = '#1a1f1c';
    R(c, sx, sy + 26, W, H - 26, steen);
    for (let j = 29; j < H - 2; j += 3) { R(c, sx, sy + j, W, 1, steenD); for (let i = (j / 3) % 2 ? 1 : 5; i < W; i += 8) R(c, sx + i, sy + j - 2, 1, 2, steenD); }
    R(c, sx, sy + 26, W, 2, steenL); R(c, sx, sy + H - 2, W, 2, '#5a3a28');
    // zijbeuken
    R(c, sx - 6, sy + 36, 6, H - 36, steen); R(c, sx + W, sy + 36, 6, H - 36, steen); R(c, sx - 6, sy + 36, 6, 2, steenL); R(c, sx + W, sy + 36, 6, 2, steenL);
    R(c, sx - 6, sy + H - 2, 6, 2, '#5a3a28'); R(c, sx + W, sy + H - 2, 6, 2, '#5a3a28');
    // boogramen
    [sx + 6, sx + W - 12].forEach(rx => { c.fillStyle = '#f4ead8'; c.fillRect(rx, sy + 34, 6, 12); c.beginPath(); c.arc(rx + 3, sy + 34, 3, Math.PI, 0); c.fill(); R(c, rx + 1, sy + 34, 4, 11, '#5aa7d6'); R(c, rx + 2, sy + 35, 1, 3, '#bfe0f2'); });
    // portaal met zuilen en trap
    R(c, cx - 9, sy + 30, 18, 20, steenD); R(c, cx - 8, sy + 31, 16, 1, steenL);
    c.fillStyle = '#2a1f14'; c.fillRect(cx - 4, sy + 36, 8, 14); c.beginPath(); c.arc(cx, sy + 36, 4, Math.PI, 0); c.fill();
    R(c, cx - 3, sy + 38, 2, 12, '#5a3a1e'); R(c, cx + 1, sy + 38, 2, 12, '#5a3a1e'); R(c, cx, sy + 44, 1, 1, '#f2c230');
    [cx - 8, cx + 6].forEach(zx => { R(c, zx, sy + 33, 2, 17, '#f4ead8'); R(c, zx - 1, sy + 32, 4, 2, '#f4ead8'); R(c, zx + 1, sy + 34, 1, 15, '#d8cbb0'); });
    R(c, cx - 10, sy + H - 1, 20, 1, '#d8cbb0');
    // tamboer en koepel
    R(c, sx + 4, sy + 20, W - 8, 8, '#f4ead8'); for (let i = sx + 6; i < sx + W - 4; i += 5) R(c, i, sy + 22, 2, 4, '#5aa7d6'); R(c, sx + 4, sy + 20, W - 8, 1, '#d8cbb0');
    c.fillStyle = koperD; c.beginPath(); c.ellipse(cx, sy + 21, W / 2 - 2, 15, 0, Math.PI, 0); c.fill();
    c.fillStyle = koper; c.beginPath(); c.ellipse(cx - 1, sy + 21, W / 2 - 4, 13, 0, Math.PI, 0); c.fill();
    c.fillStyle = koperL; c.beginPath(); c.ellipse(cx - 6, sy + 19, 6, 6, 0, Math.PI, 0); c.fill();
    for (let i = -16; i <= 16; i += 8) R(c, cx + i, sy + 10, 1, 11, koperD);
    R(c, sx + 2, sy + 20, W - 4, 2, koperD);
    // lantaarn met kruis
    R(c, cx - 3, sy + 2, 6, 5, '#f4ead8'); R(c, cx - 2, sy + 3, 1, 3, '#5aa7d6'); R(c, cx + 1, sy + 3, 1, 3, '#5aa7d6'); R(c, cx - 4, sy + 1, 8, 1, koperD);
    c.fillStyle = koper; c.beginPath(); c.ellipse(cx, sy + 1, 4, 3, 0, Math.PI, 0); c.fill();
    R(c, cx, sy - 5, 1, 5, ink); R(c, cx - 1, sy - 4, 3, 1, ink);
    c.fillStyle = 'rgba(20,40,20,.25)'; c.fillRect(sx - 6, sy + H, W + 12, 3);
  }
  function teken(c, C) {
    const MAP = C.tilemap, MW = MAP[0].length, MH = MAP.length;
    deuren = new Set(C.locaties.filter(l => l.id !== 'start').map(l => l.tegel[0] + ',' + (l.tegel[1] - 1)));
    const at = (x, y) => (MAP[y] && MAP[y][x]) || '.';
    let kStart = null;
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      const ch = at(x, y);
      if (ch === 'K') { if (!kStart) kStart = [x, y]; continue; }
      if (!STIJL[ch]) continue;
      const s = STIJL[ch], boven = at(x, y - 1) === ch, onder = at(x, y + 1) === ch, links = at(x - 1, y) === ch, rechts = at(x + 1, y) === ch;
      if (onder) dak(c, s, x * T, y * T, boven, links, rechts, ch);
      else gevel(c, s, x * T, y * T, links, rechts, ch, deuren.has(x + ',' + y));
      if (!onder) c.fillStyle = 'rgba(20,40,20,.22)', c.fillRect(x * T, (y + 1) * T, T, 3);
    }
    if (kStart) {
      let w = 0, h = 0; while (at(kStart[0] + w, kStart[1]) === 'K') w++; while (at(kStart[0], kStart[1] + h) === 'K') h++;
      koepel(c, kStart[0], kStart[1], w, h);
    }
  }
  return { teken };
})();
