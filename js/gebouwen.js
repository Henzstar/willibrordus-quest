// Gebouwen als geheel: per samenhangend blok een gevelstijl, naambord, luifel, regenpijpen, schoorstenen; steigers bij nieuwbouw, planten in de kas; Cultuurkoepel apart.
const WQGebouwen = (() => {
  'use strict';
  const T = 32;
  const R = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;
  const STIJL = [
    { naam: 'klassiek', dak: '#5f3d2e', dakD: '#452a1f', dakL: '#7a4f3c', muur: '#a65a3c', muurD: '#8a4a30', steen: '#b8704f', plint: '#5a3a28', raam: '#5aa7d6', kozijn: '#f4ead8', deur: '#3a2616', deurL: '#5a3a1e', boog: true },
    { naam: 'beige', dak: '#8b5e3c', dakD: '#6e4a2f', dakL: '#a5734a', muur: '#e8dcc5', muurD: '#d4c5a6', steen: '#dccfb4', plint: '#b9a98a', raam: '#5aa7d6', kozijn: '#fbfbfb', deur: '#5a3a1e', deurL: '#7a5230', boog: false },
    { naam: 'grijs', dak: '#6b6f78', dakD: '#50545c', dakL: '#8a8f99', muur: '#d8d4cc', muurD: '#bdb8ae', steen: '#cfcac0', plint: '#8d949c', raam: '#7ab8e0', kozijn: '#3b3f4a', deur: '#2a2d35', deurL: '#4a4f5a', boog: false },
  ];
  const NIEUW = { naam: 'nieuw', dak: '#cfcac0', dakD: '#a9a39a', dakL: '#e3dfd6', muur: '#f4f1ea', muurD: '#dcd7cd', steen: '#ebe7df', plint: '#b8b2a7', raam: '#7ab8e0', kozijn: '#8d949c', deur: '#3b3f4a', deurL: '#5a606c', boog: false };
  const KAS = { naam: 'kas', dak: '#c7dbe7', dakD: '#9fb9c9', dakL: '#e6f0f6', muur: '#dbe8f0', muurD: '#b8ccd8', steen: '#dbe8f0', plint: '#8d949c', raam: '#dbe8f0', kozijn: '#f4f8fa', deur: '#8d949c', deurL: '#aab2bb', boog: false };
  let ramen = [], namen = {};

  // ---------- blokken ----------
  function blokken(MAP) {
    const MW = MAP[0].length, MH = MAP.length, gezien = new Set(), uit = [];
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      const ch = MAP[y][x]; if (!'BNG'.includes(ch) || gezien.has(y * MW + x)) continue;
      const tiles = [], q = [[x, y]]; gezien.add(y * MW + x);
      while (q.length) { const [cx, cy] = q.pop(); tiles.push([cx, cy]); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (MAP[ny] && MAP[ny][nx] === ch && !gezien.has(ny * MW + nx)) { gezien.add(ny * MW + nx); q.push([nx, ny]); } } }
      const xs = tiles.map(t => t[0]), ys = tiles.map(t => t[1]);
      uit.push({ ch, tiles, x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys), stijl: ch === 'N' ? NIEUW : ch === 'G' ? KAS : STIJL[hash(Math.min(...xs), Math.min(...ys)) % 3] });
    }
    return uit;
  }

  // ---------- dak en gevel per tegel ----------
  function dak(c, s, sx, sy, boven, links, rechts, ch, x, y) {
    R(c, sx, sy, T, T, s.dak);
    if (ch === 'G') { for (let i = 0; i < T; i += 16) { R(c, sx + i, sy, 2, T, s.kozijn); R(c, sx, sy + i, T, 2, s.kozijn); } R(c, sx + 4, sy + 4, 6, 2, s.dakL); R(c, sx + 20, sy + 20, 6, 2, s.dakL); R(c, sx + 6, sy + 6, 2, 2, '#f4f8fa'); c.fillStyle = 'rgba(47,125,50,.35)'; c.beginPath(); c.arc(sx + 10, sy + 24, 6, 0, 7); c.arc(sx + 24, sy + 26, 5, 0, 7); c.fill(); }
    else if (ch === 'N') { for (let i = 0; i < 14; i++) R(c, sx + ((i * 7 + x * 3) % 31) + 1, sy + ((i * 5 + y * 5) % 29) + 1, 1, 1, s.dakD); R(c, sx + 6, sy + 10, 8, 1, s.dakL); }
    else { for (let j = 0; j < T; j += 8) { R(c, sx, sy + j + 6, T, 2, s.dakD); for (let i = (j / 8) % 2 ? 0 : 8; i < T; i += 16) { R(c, sx + i, sy + j, 2, 6, s.dakD); R(c, sx + i + 2, sy + j + 1, 1, 1, s.dakL); } } R(c, sx + 3, sy + 2, 3, 1, s.dakL); R(c, sx + 19, sy + 10, 3, 1, s.dakL); R(c, sx + 11, sy + 26, 3, 1, s.dakL); }
    if (!boven) { R(c, sx, sy, T, 4, s.dakD); R(c, sx, sy + 4, T, 2, s.dakL); }
    if (!links) R(c, sx, sy, 2, T, s.dakD); if (!rechts) R(c, sx + 30, sy, 2, T, s.dakD);
  }
  function raam(c, s, rx, ry, w, h, warm) {
    R(c, rx - 1, ry - 1, w + 2, h + 2, s.kozijn); R(c, rx, ry, w, h, warm ? '#f6dc8c' : s.raam);
    R(c, rx + w / 2 - 1, ry, 1, h, s.kozijn); R(c, rx, ry + h / 2 - 1, w, 1, s.kozijn);
    R(c, rx + 1, ry + 1, 2, 3, warm ? '#fff4c2' : '#bfe0f2'); if (!warm) R(c, rx + w - 3, ry + 2, 1, h - 4, 'rgba(255,255,255,.5)');
    R(c, rx - 2, ry + h + 1, w + 4, 2, s.plint); R(c, rx - 1, ry + h + 3, w + 2, 1, s.muurD);
    if (s.boog) { c.fillStyle = s.kozijn; c.beginPath(); c.arc(rx + w / 2, ry - 1, w / 2 + 1, Math.PI, 0); c.fill(); c.fillStyle = s.raam; c.beginPath(); c.arc(rx + w / 2, ry, w / 2 - 1, Math.PI, 0); c.fill(); }
    if (!warm) ramen.push([rx, ry, w, h]);
  }
  function gevel(c, s, sx, sy, links, rechts, ch, deur) {
    R(c, sx, sy, T, T, s.muur);
    if (s.naam === 'klassiek') for (let j = 4; j < 28; j += 4) { R(c, sx, sy + j, T, 1, s.muurD); for (let i = (j / 4) % 2 ? 3 : 11; i < T; i += 16) R(c, sx + i, sy + j - 3, 1, 3, s.muurD); if (j % 8 === 4) R(c, sx + ((j * 5) % 27), sy + j - 2, 4, 1, s.steen); }
    if (s.naam === 'beige') for (let j = 5; j < 28; j += 6) { R(c, sx, sy + j, T, 1, s.steen); for (let i = (j / 6) % 2 ? 4 : 12; i < T; i += 16) R(c, sx + i, sy + j - 5, 1, 5, s.steen); }
    if (s.naam === 'grijs') { R(c, sx, sy + 15, T, 1, s.steen); R(c, sx + 15, sy, 1, T, s.steen); R(c, sx + 2, sy + 2, 12, 1, 'rgba(255,255,255,.2)'); }
    R(c, sx, sy, T, 4, s.muurD); R(c, sx, sy + 4, T, 2, s.dakD); R(c, sx, sy + 5, T, 1, s.dakL); R(c, sx, sy + 28, T, 4, s.plint); R(c, sx, sy + 27, T, 1, s.muurD);
    if (deur) {
      R(c, sx + 7, sy + 8, 18, 22, '#2a1f14'); R(c, sx + 9, sy + 10, 14, 20, s.deur); R(c, sx + 9, sy + 10, 5, 20, s.deurL); R(c, sx + 11, sy + 12, 3, 6, '#2a1f14'); R(c, sx + 18, sy + 12, 3, 6, '#2a1f14'); R(c, sx + 11, sy + 21, 3, 6, '#2a1f14'); R(c, sx + 18, sy + 21, 3, 6, '#2a1f14'); R(c, sx + 19, sy + 19, 2, 2, '#f2c230');
      if (s.boog) { c.fillStyle = '#2a1f14'; c.beginPath(); c.arc(sx + 16, sy + 9, 9, Math.PI, 0); c.fill(); c.fillStyle = '#5aa7d6'; c.beginPath(); c.arc(sx + 16, sy + 9, 6, Math.PI, 0); c.fill(); }
      R(c, sx + 4, sy + 30, 24, 2, '#9c8c70'); R(c, sx + 6, sy + 31, 20, 1, '#7d6e50');
      R(c, sx + 2, sy + 10, 4, 4, '#ffe9a8'); R(c, sx + 26, sy + 10, 4, 4, '#ffe9a8'); R(c, sx + 3, sy + 14, 2, 2, '#2a2d35'); R(c, sx + 27, sy + 14, 2, 2, '#2a2d35');
      if (ch === 'N') { R(c, sx + 9, sy + 10, 14, 10, '#7ab8e0'); R(c, sx + 15, sy + 10, 2, 20, s.kozijn); }
    } else if (ch === 'G') { R(c, sx, sy + 6, T, 22, s.raam); for (let i = 0; i < T; i += 16) R(c, sx + i, sy + 6, 2, 22, s.kozijn); R(c, sx, sy + 16, T, 2, s.kozijn); c.fillStyle = 'rgba(47,125,50,.55)'; c.beginPath(); c.arc(sx + 8, sy + 24, 6, 0, 7); c.arc(sx + 23, sy + 22, 7, 0, 7); c.fill(); R(c, sx + 6, sy + 26, 2, 2, '#e86f9a'); R(c, sx + 24, sy + 24, 2, 2, '#f6d44c'); R(c, sx + 14, sy + 25, 2, 2, '#f2f2f2'); }
    else if (ch === 'N') { R(c, sx + 2, sy + 6, 28, 18, s.kozijn); R(c, sx + 4, sy + 8, 24, 14, s.raam); R(c, sx + 15, sy + 8, 2, 14, s.kozijn); R(c, sx + 6, sy + 10, 4, 4, '#bfe0f2'); ramen.push([sx + 4, sy + 8, 24, 14]); }
    else { [4, 19].forEach((i, k) => raam(c, s, sx + i, sy + 10, 9, 14, ((sx * 5 + sy * 3 + k) % 4 === 0))); }
    if (!links) R(c, sx, sy, 2, T, s.muurD); if (!rechts) R(c, sx + 30, sy, 2, T, s.muurD);
  }
  function naambord(c, s, sx, sy, naam) {
    c.save(); c.font = '7px "Press Start 2P", monospace'; c.textBaseline = 'middle'; c.textAlign = 'center';
    const w = Math.min(c.measureText(naam).width + 10, 200);
    R(c, sx + 16 - w / 2, sy - 11, w, 12, s.naam === 'grijs' ? '#1a1f1c' : '#2a1f14'); R(c, sx + 16 - w / 2, sy - 11, w, 1, '#f2c230'); R(c, sx + 16 - w / 2, sy, w, 1, 'rgba(0,0,0,.3)');
    c.fillStyle = '#fff7cc'; c.fillText(naam, sx + 16, sy - 5); c.restore();
  }
  function luifel(c, s, sx, sy) { R(c, sx + 2, sy + 24, 28, 6, s.dakD); R(c, sx + 2, sy + 24, 28, 2, s.dakL); for (let i = 4; i < 30; i += 6) R(c, sx + i, sy + 26, 3, 4, s.dakL); R(c, sx, sy + 30, 32, 2, 'rgba(0,0,0,.25)'); }
  function steiger(c, sx, sy, onderkant) { for (let i = 2; i < T; i += 14) { R(c, sx + i, sy, 2, T, '#8d949c'); R(c, sx + i, sy, 1, T, '#aab2bb'); } R(c, sx, sy + 12, T, 4, '#c8a06c'); R(c, sx, sy + 15, T, 1, '#8a5a2b'); if (onderkant) { R(c, sx, sy + 28, T, 4, '#c8a06c'); R(c, sx, sy + 31, T, 1, '#8a5a2b'); } R(c, sx + 4, sy + 2, 10, 2, '#f2c230'); R(c, sx + 14, sy + 2, 10, 2, '#1a1f1c'); }

  // ---------- koepel ----------
  function koepel(c, x0, y0, w, h) {
    c.save(); c.scale(2, 2); const t16 = 16;
    const sx = x0 * t16, sy = y0 * t16 - 8, W = w * t16, H = h * t16 + 8, cx = sx + W / 2;
    const steen = '#a65a3c', steenD = '#8a4a30', steenL = '#c27a58', koper = '#7fae93', koperD = '#5f8a72', koperL = '#a7cbb5', ink = '#1a1f1c';
    R(c, sx, sy + 26, W, H - 26, steen);
    for (let j = 29; j < H - 2; j += 3) { R(c, sx, sy + j, W, 1, steenD); for (let i = (j / 3) % 2 ? 1 : 5; i < W; i += 8) R(c, sx + i, sy + j - 2, 1, 2, steenD); }
    R(c, sx, sy + 26, W, 2, steenL); R(c, sx, sy + H - 2, W, 2, '#5a3a28');
    R(c, sx - 6, sy + 36, 6, H - 36, steen); R(c, sx + W, sy + 36, 6, H - 36, steen); R(c, sx - 6, sy + 36, 6, 2, steenL); R(c, sx + W, sy + 36, 6, 2, steenL);
    R(c, sx - 6, sy + H - 2, 6, 2, '#5a3a28'); R(c, sx + W, sy + H - 2, 6, 2, '#5a3a28');
    [sx + 6, sx + W - 12].forEach(rx => { c.fillStyle = '#f4ead8'; c.fillRect(rx, sy + 34, 6, 12); c.beginPath(); c.arc(rx + 3, sy + 34, 3, Math.PI, 0); c.fill(); R(c, rx + 1, sy + 34, 4, 11, '#5aa7d6'); R(c, rx + 2, sy + 35, 1, 3, '#bfe0f2'); ramen.push([rx + 1, sy + 34, 4, 11]); });
    R(c, cx - 9, sy + 30, 18, 20, steenD); R(c, cx - 8, sy + 31, 16, 1, steenL);
    c.fillStyle = '#2a1f14'; c.fillRect(cx - 4, sy + 36, 8, 14); c.beginPath(); c.arc(cx, sy + 36, 4, Math.PI, 0); c.fill();
    R(c, cx - 3, sy + 38, 2, 12, '#5a3a1e'); R(c, cx + 1, sy + 38, 2, 12, '#5a3a1e'); R(c, cx, sy + 44, 1, 1, '#f2c230');
    [cx - 8, cx + 6].forEach(zx => { R(c, zx, sy + 33, 2, 17, '#f4ead8'); R(c, zx - 1, sy + 32, 4, 2, '#f4ead8'); R(c, zx + 1, sy + 34, 1, 15, '#d8cbb0'); });
    R(c, cx - 10, sy + H - 1, 20, 1, '#d8cbb0');
    R(c, sx + 4, sy + 20, W - 8, 8, '#f4ead8'); for (let i = sx + 6; i < sx + W - 4; i += 5) R(c, i, sy + 22, 2, 4, '#5aa7d6'); R(c, sx + 4, sy + 20, W - 8, 1, '#d8cbb0');
    c.fillStyle = koperD; c.beginPath(); c.ellipse(cx, sy + 21, W / 2 - 2, 15, 0, Math.PI, 0); c.fill();
    c.fillStyle = koper; c.beginPath(); c.ellipse(cx - 1, sy + 21, W / 2 - 4, 13, 0, Math.PI, 0); c.fill();
    c.fillStyle = koperL; c.beginPath(); c.ellipse(cx - 6, sy + 19, 6, 6, 0, Math.PI, 0); c.fill();
    for (let i = -16; i <= 16; i += 8) R(c, cx + i, sy + 10, 1, 11, koperD);
    R(c, sx + 2, sy + 20, W - 4, 2, koperD);
    R(c, cx - 3, sy + 2, 6, 5, '#f4ead8'); R(c, cx - 2, sy + 3, 1, 3, '#5aa7d6'); R(c, cx + 1, sy + 3, 1, 3, '#5aa7d6'); R(c, cx - 4, sy + 1, 8, 1, koperD);
    c.fillStyle = koper; c.beginPath(); c.ellipse(cx, sy + 1, 4, 3, 0, Math.PI, 0); c.fill();
    R(c, cx, sy - 5, 1, 5, ink); R(c, cx - 1, sy - 4, 3, 1, ink);
    c.restore();
    // extra detail op volle resolutie: voegen in de koepel, spijlen in de ramen, treden
    const X = x0 * T, Y = y0 * T - 16, WW = w * T, CX = X + WW / 2;
    for (let i = -28; i <= 28; i += 4) R(c, CX + i, Y + 22, 1, 20, 'rgba(95,138,114,.5)');
    [X + 13, X + WW - 23].forEach(rx => { R(c, rx + 5, Y + 68, 1, 22, '#f4ead8'); R(c, rx + 1, Y + 76, 9, 1, '#f4ead8'); });
    R(c, CX - 20, Y + h * T + 14, 40, 2, '#d8cbb0'); R(c, CX - 24, Y + h * T + 16, 48, 2, '#c9bca0');
    naambord(c, STIJL[0], CX - 16, Y + 60, 'Cultuurkoepel');
  }

  // ---------- hoofdroutine ----------
  function teken(c, C) {
    const MAP = C.tilemap, MW = MAP[0].length, MH = MAP.length;
    ramen = []; namen = {};
    C.locaties.filter(l => l.binnen).forEach(l => { namen[l.tegel[0] + ',' + (l.tegel[1] - 1)] = (l.kortenaam || l.naam).split('[')[0].trim(); });
    const borden = {}; (C.borden || []).forEach(b => { borden[b.tegel[0] + ',' + b.tegel[1]] = b.naam; });
    const at = (x, y) => (MAP[y] && MAP[y][x]) || '.';
    for (const b of blokken(MAP)) {
      const s = b.stijl, ch = b.ch, deuren = [];
      for (const [x, y] of b.tiles) {
        const boven = at(x, y - 1) === ch, onder = at(x, y + 1) === ch, links = at(x - 1, y) === ch, rechts = at(x + 1, y) === ch, sx = x * T, sy = y * T;
        if (onder) dak(c, s, sx, sy, boven, links, rechts, ch, x, y);
        else { const deur = !!namen[x + ',' + y]; gevel(c, s, sx, sy, links, rechts, ch, deur); if (deur) deuren.push([x, y]); if (borden[x + ',' + y]) naambord(c, s, sx, sy + 4, borden[x + ',' + y]); if (!links) { R(c, sx + 1, sy + 6, 2, 22, s.dakD); R(c, sx + 1, sy + 6, 1, 22, s.dakL); } if (!rechts) { R(c, sx + 29, sy + 6, 2, 22, s.dakD); R(c, sx + 29, sy + 6, 1, 22, s.dakL); } }
        if (!boven && ch === 'B' && (x - b.x0) % 5 === 2) { R(c, sx + 20, sy - 8, 8, 14, s.dakD); R(c, sx + 18, sy - 10, 12, 3, '#3a2a20'); R(c, sx + 22, sy - 6, 4, 2, s.dakL); R(c, sx + 21, sy - 1, 1, 6, s.dakL); }
        if (ch === 'N') steiger(c, sx, sy, !onder);
      }
      for (const [x, y] of deuren) { const boven = at(x, y - 1) === ch; if (boven) luifel(c, s, x * T, (y - 1) * T); naambord(c, s, x * T, y * T + (boven ? -4 : 4), namen[x + ',' + y]); }
    }
    let kStart = null;
    for (let y = 0; y < MH && !kStart; y++) for (let x = 0; x < MW; x++) if (at(x, y) === 'K') { kStart = [x, y]; break; }
    if (kStart) { let w = 0, h = 0; while (at(kStart[0] + w, kStart[1]) === 'K') w++; while (at(kStart[0], kStart[1] + h) === 'K') h++; koepel(c, kStart[0], kStart[1], w, h); }
  }
  return { teken, ramen: () => ramen };
})();
