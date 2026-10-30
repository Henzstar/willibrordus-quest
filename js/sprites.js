// Personages: 16 x 24 ontwerp, opgeschaald naar 32 x 48 met EPX (scale2x) plus detailpixels (ooglicht, mond, schaduw, zoom). Gecachet per uiterlijk. Portretten 32 x 32.
const WQSprites = (() => {
  'use strict';
  const W = 16, H = 24, SW = 32, SH = 48;
  // k lijn, s huid, h haar, c jas, C jas donker, p broek, e schoen, i oog, . leeg
  const DOWN = [
    '................', '................', '.....kkkkkk.....', '....khhhhhhk....', '...khhhhhhhhk...', '...khhhhhhhhk...', '...khhsssshhk...', '...kssssssssk...',
    '...ksissssisk...', '...kssssssssk...', '....kssssssk....', '.....kssssk.....', '....kccccccck...', '...kcccccccck...', '...kcCccccCck...', '...ksccccccsk...',
    '....kccccccck...', '....kccccccck...', '....kppppppk....', '....kppkkppk....', '....kppkkppk....', '....kppkkppk....', '....keekkeek....', '....kkkkkkkk....',
  ];
  const UP = DOWN.map((r, i) => (i >= 6 && i <= 11) ? r.replace(/[si]/g, 'h') : r).map((r, i) => i === 14 ? '...kcccCCcccck..'.slice(0, 16) : r);
  const SIDE = [
    '................', '................', '.....kkkkkk.....', '....khhhhhhk....', '...khhhhhhhhk...', '...khhhhhhhhk...', '...khhhhsssk....', '...khhsssssk....',
    '...khhsssisk....', '...khhsssssk....', '....khssssk.....', '.....kssssk.....', '.....kcccck.....', '....kccccccck...', '....kcCcccCck...', '....kscccccsk...',
    '.....kcccck.....', '.....kcccck.....', '.....kppppk.....', '.....kppppk.....', '.....kppppk.....', '.....kppppk.....', '.....keeeek.....', '.....kkkkkk.....',
  ];
  const STAP = {
    down: ['....kppkkppk....', '....kppkkppk....', '....keekkppk....', '....kkkkkeek....', '.........kkkk...'],
    side: ['.....kppppk.....', '....kppk.kppk...', '....kppk.kppk...', '....keek.keek...', '....kkkk.kkkk...'],
  };
  const BASIS = { down: DOWN, up: UP, side: SIDE };
  const KLEUR = { k: '#1a1f1c', s: '#f1c9a5', e: '#2a2d35', i: '#1a1f1c', w: '#ffffff' };
  const cache = new Map();

  function raster(dir, frame) {
    const rows = BASIS[dir].map(r => r.split(''));
    if (frame === 1 || frame === 3) { const st = STAP[dir === 'up' ? 'down' : dir]; for (let i = 0; i < 5; i++) rows[19 + i] = (frame === 3 ? st[i].split('').reverse().join('') : st[i]).split(''); }
    return rows;
  }
  // Portret 32 x 32 voor dialoogbox en startscherm: vormen (ovaal hoofd, oren, schouders) worden gebinariseerd naar het pixelraster,
  // daarna komen haar (per kapsel), wenkbrauwen, ogen met oogwit en lichtje, neus, mond (dicht of open), bril en schaduwzijde.
  let tmp = null;
  function vorm(G, ch, fn) {
    if (!tmp) { tmp = document.createElement('canvas'); tmp.width = 32; tmp.height = 32; }
    const c = tmp.getContext('2d'); c.clearRect(0, 0, 32, 32); c.fillStyle = '#000'; c.beginPath(); fn(c); c.fill();
    const d = c.getImageData(0, 0, 32, 32).data;
    for (let i = 0; i < 1024; i++) if (d[i * 4 + 3] > 127) G[i >> 5][i & 31] = ch;
  }
  const ovaal = (x, y, rx, ry) => c => c.ellipse(x, y, rx, ry, 0, 0, 7);
  const veelhoek = pts => c => { c.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(q => c.lineTo(q[0], q[1])); c.closePath(); };
  function portretRaster(look, open) {
    const G = Array.from({ length: 32 }, () => Array(32).fill('.'));
    const zet = (x, y, ch) => { if (y >= 0 && y < 32 && x >= 0 && x < 32) G[y][x] = ch; };
    const vul = (x0, y0, w, h, ch) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) zet(x, y, ch); };
    const hoofd = look.hoofd || 'kort', bril = !!look.bril || hoofd === 'bril';
    vorm(G, 'k', veelhoek([[1, 32], [8, 26], [13, 25], [19, 25], [24, 26], [31, 32]])); vorm(G, 'c', veelhoek([[3, 32], [9, 27], [13, 26], [19, 26], [23, 27], [29, 32]]));
    vorm(G, 'C', veelhoek([[12, 26], [20, 26], [16, 31]])); vorm(G, 'w', veelhoek([[14, 26], [18, 26], [16, 29]]));
    vul(13, 21, 6, 6, 'n');
    vorm(G, 'k', ovaal(8, 14, 2.5, 3.5)); vorm(G, 'k', ovaal(24, 14, 2.5, 3.5)); vorm(G, 'n', ovaal(8, 14, 1.5, 2.5)); vorm(G, 'n', ovaal(24, 14, 1.5, 2.5));
    vorm(G, 'k', ovaal(16, 14, 8.5, 10.5)); vorm(G, 's', ovaal(16, 14, 7.5, 9.5));
    for (let y = 8; y <= 21; y++) for (let x = 21; x < 24; x++) if (G[y][x] === 's') zet(x, y, 'n');
    for (let x = 12; x < 20; x++) for (let y = 21; y < 24; y++) if (G[y][x] === 's') zet(x, y, 'n');
    // haar: alles binnen het hoofdovaal boven de haarlijn; kapsels verschillen in haarlijn, zijkanten en wat er buiten het hoofd valt
    const zijkant = x => x < 10 || x > 21;
    const lijn = x => hoofd === 'bob' ? (zijkant(x) ? 20 : 10) : hoofd === 'lang' ? (zijkant(x) ? 99 : 9) : hoofd === 'knot' ? 8 : (zijkant(x) ? 13 : 9);
    if (hoofd === 'helm') { vorm(G, 'k', ovaal(16, 8, 9.5, 6)); vorm(G, 'H', ovaal(16, 8, 8.5, 5)); vul(6, 10, 20, 2, 'H'); vul(5, 10, 1, 2, 'k'); vul(26, 10, 1, 2, 'k'); vul(6, 12, 20, 1, 'k'); vul(8, 6, 6, 1, 'L'); }
    else {
      for (let y = 4; y < 24; y++) for (let x = 7; x < 25; x++) if ((G[y][x] === 's' || G[y][x] === 'n') && y < lijn(x)) zet(x, y, 'h');
      if (hoofd === 'lang') { vul(6, 10, 3, 17, 'h'); vul(23, 10, 3, 17, 'h'); vul(5, 10, 1, 17, 'k'); vul(26, 10, 1, 17, 'k'); vul(6, 27, 3, 1, 'k'); vul(23, 27, 3, 1, 'k'); zet(6, 9, 'k'); zet(25, 9, 'k'); }
      if (hoofd === 'bob') { vul(6, 9, 3, 11, 'h'); vul(23, 9, 3, 11, 'h'); vul(5, 9, 1, 11, 'k'); vul(26, 9, 1, 11, 'k'); vul(6, 20, 3, 1, 'k'); vul(23, 20, 3, 1, 'k'); zet(6, 8, 'k'); zet(25, 8, 'k'); [11, 14, 18, 21].forEach(x => zet(x, 10, 'h')); }
      if (hoofd === 'knot') { vorm(G, 'k', ovaal(16, 3, 4.5, 3)); vorm(G, 'h', ovaal(16, 3, 3.5, 2)); zet(14, 2, 'L'); zet(15, 2, 'L'); }
      vul(11, 5, 5, 1, 'L'); zet(10, 6, 'L'); zet(16, 5, 'L');
    }
    // wenkbrauwen, ogen, neus, mond
    vul(11, 10, 3, 1, 'b'); vul(18, 10, 3, 1, 'b'); zet(14, 10, 'n'); zet(17, 10, 'n');
    vul(11, 12, 4, 2, 'w'); vul(17, 12, 4, 2, 'w'); vul(12, 12, 2, 2, 'i'); vul(18, 12, 2, 2, 'i'); zet(12, 12, 'W'); zet(18, 12, 'W');
    vul(11, 11, 4, 1, 'k'); vul(17, 11, 4, 1, 'k');
    vul(16, 13, 1, 4, 'n'); zet(15, 17, 'n'); zet(17, 17, 'n'); zet(17, 16, 'n');
    if (open) { vul(13, 19, 6, 3, 'M'); vul(14, 18, 4, 1, 'M'); vul(14, 22, 4, 1, 'M'); vul(14, 19, 4, 1, 'w'); zet(12, 19, 'm'); zet(19, 19, 'm'); }
    else { vul(13, 19, 6, 1, 'm'); zet(12, 18, 'm'); zet(19, 18, 'm'); vul(13, 20, 6, 1, 'n'); }
    if (bril) {
      for (let y = 11; y <= 15; y++) for (let x = 10; x <= 21; x++) if (G[y][x] === 's' || G[y][x] === 'n' || G[y][x] === 'h') zet(x, y, 'g');
      for (let x = 10; x <= 21; x++) { zet(x, 11, 'k'); zet(x, 15, 'k'); } for (let y = 11; y <= 15; y++) { zet(10, y, 'k'); zet(15, y, 'k'); zet(16, y, 'k'); zet(21, y, 'k'); }
      zet(9, 12, 'k'); zet(22, 12, 'k'); zet(8, 12, 'k'); zet(23, 12, 'k'); zet(11, 12, 'W'); zet(20, 14, 'W');
    }
    return G;
  }
  function portret(look, open, schaal) {
    const s = schaal || 2, cv = document.createElement('canvas'); cv.width = 32 * s; cv.height = 32 * s;
    const c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
    const haar = look.haar || '#6b4a2b', jas = look.jas || '#2b6cb0', huid = look.huid || KLEUR.s;
    const kleur = { ...KLEUR, s: huid, n: donker(huid), h: haar, L: lichter(haar), b: donker(haar), c: jas, C: donker(jas), m: '#8a4a30', M: '#5a1f1a', H: '#f2c230', W: '#ffffff', g: lichter(huid), i: look.ogen || (parseInt(haar.slice(1), 16) % 2 ? '#3b5fa8' : '#4a2e1a') };
    const rows = portretRaster(look, open);
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) { const ch = rows[y][x]; if (ch === '.' || !kleur[ch]) continue; c.fillStyle = kleur[ch]; c.fillRect(x * s, y * s, s, s); }
    return cv;
  }
  function pas(rows, look, dir) {
    const zet = (x, y, ch) => { if (rows[y] && x >= 0 && x < W) rows[y][x] = ch; };
    const hoofd = look.hoofd || 'kort', bril = !!look.bril || hoofd === 'bril';
    if (hoofd === 'bob') {
      if (dir === 'down') for (let y = 7; y <= 10; y++) { zet(3, y, 'h'); zet(12, y, 'h'); zet(2, y, 'k'); zet(13, y, 'k'); }
      if (dir === 'side') for (let y = 7; y <= 10; y++) { zet(3, y, 'h'); zet(4, y, 'h'); zet(2, y, 'k'); }
      if (dir === 'up') for (let y = 10; y <= 11; y++) for (let x = 4; x <= 11; x++) zet(x, y, 'h');
    }
    if (hoofd === 'lang') {
      if (dir === 'down') for (let y = 7; y <= 11; y++) { zet(3, y, 'h'); zet(12, y, 'h'); zet(2, y, 'k'); zet(13, y, 'k'); }
      if (dir === 'side') for (let y = 7; y <= 11; y++) { zet(3, y, 'h'); zet(4, y, 'h'); zet(2, y, 'k'); }
      if (dir === 'up') for (let y = 10; y <= 13; y++) for (let x = 4; x <= 11; x++) zet(x, y, 'h');
    }
    if (hoofd === 'knot') { const bx = dir === 'side' ? 4 : 7; zet(bx, 1, 'k'); zet(bx + 1, 1, 'k'); zet(bx - 1, 2, 'k'); zet(bx, 2, 'h'); zet(bx + 1, 2, 'h'); zet(bx + 2, 2, 'k'); zet(bx, 3, 'h'); zet(bx + 1, 3, 'h'); }
    if (bril) {
      if (dir === 'down') { for (let x = 4; x <= 11; x++) zet(x, 8, 'k'); zet(5, 8, 'w'); zet(6, 8, 'w'); zet(9, 8, 'w'); zet(10, 8, 'w'); }
      if (dir === 'side') { zet(7, 8, 'k'); zet(8, 8, 'w'); zet(9, 8, 'w'); zet(10, 8, 'k'); }
    }
    if (hoofd === 'helm') { for (let y = 2; y <= 6; y++) for (let x = 0; x < W; x++) if (rows[y][x] === 'h') rows[y][x] = 'H'; for (let x = 3; x <= 13; x++) if (rows[6][x] !== '.') zet(x, 6, 'H'); zet(2, 6, 'k'); zet(13, 6, 'k'); }
    const extra = look.extra;
    if (extra === 'modder') for (const y of [15]) for (let x = 0; x < W; x++) if (rows[y][x] === 's') rows[y][x] = 'M';
    const hand = dir === 'side' ? 11 : 12;
    if (extra === 'bord' && dir !== 'up') { for (let x = hand - 1; x <= hand + 3; x++) zet(x, 15, 'w'); zet(hand, 14, 'B'); zet(hand + 2, 14, 'B'); zet(hand - 2, 15, 'k'); zet(hand + 4, 15, 'k'); }
    if (extra === 'papier' && dir !== 'up') for (let y = 13; y <= 16; y++) for (let x = hand; x <= hand + 3; x++) zet(x, y, y === 13 ? 'k' : 'w');
    if (extra === 'laptop' && dir !== 'up') { for (let x = hand - 1; x <= hand + 3; x++) { zet(x, 14, 'G'); zet(x, 15, 'G'); } zet(hand, 15, 'b'); zet(hand + 1, 15, 'b'); }
    if (extra === 'telefoon' && dir !== 'up') for (let y = 13; y <= 16; y++) { zet(hand + 1, y, 'k'); zet(hand + 2, y, y === 13 || y === 16 ? 'k' : 'b'); zet(hand + 3, y, 'k'); }
    if (extra === 'koffie' && dir !== 'up') { for (let y = 14; y <= 16; y++) { zet(hand + 1, y, 'w'); zet(hand + 2, y, 'w'); } zet(hand + 3, 15, 'k'); zet(hand, 14, 'k'); zet(hand + 1, 13, 'k'); }
    if (extra === 'map' && dir !== 'up') for (let y = 13; y <= 16; y++) for (let x = hand; x <= hand + 3; x++) zet(x, y, (y === 13 || x === hand) ? 'k' : 'F');
    return rows;
  }
  // EPX/scale2x: verdubbelt het raster en rondt trappen af op basis van de buren.
  function scale2x(rows) {
    const h = rows.length, w = rows[0].length, uit = [];
    const g = (x, y) => (y < 0 || y >= h || x < 0 || x >= w) ? '.' : rows[y][x];
    for (let y = 0; y < h; y++) { const r1 = [], r2 = []; for (let x = 0; x < w; x++) {
      const P = g(x, y), A = g(x, y - 1), B = g(x + 1, y), C = g(x - 1, y), D = g(x, y + 1);
      let e0 = P, e1 = P, e2 = P, e3 = P;
      if (C === A && C !== D && A !== B) e0 = A; if (A === B && A !== C && B !== D) e1 = B; if (D === C && D !== B && C !== A) e2 = C; if (B === D && B !== A && D !== C) e3 = D;
      r1.push(e0, e1); r2.push(e2, e3); } uit.push(r1, r2); }
    return uit;
  }
  // Detailpixels op het 32 x 48-raster: ooglicht, mond, haarlicht, schaduwzijde van jas en broek, zoom, schoenzolen.
  function detail(rows, dir, look) {
    const zet = (x, y, ch) => { if (rows[y] && x >= 0 && x < SW && rows[y][x] !== '.' ) rows[y][x] = ch; };
    const is = (x, y, ch) => rows[y] && rows[y][x] === ch;
    for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
      const ch = rows[y][x];
      if (ch === 'i') { if (is(x + 1, y, 'i') && !is(x, y - 1, 'i')) zet(x + 1, y, 'w'); }
      if (ch === 'c' && (is(x + 1, y, 'k') || is(x + 2, y, 'k')) && !is(x - 1, y, 'k')) zet(x, y, 'C');
      if (ch === 'p' && (is(x + 1, y, 'k') || is(x + 2, y, 'k'))) zet(x, y, 'q');
      if (ch === 'h' && is(x - 1, y, 'k') && y < 12 && !is(x, y - 1, 'k')) zet(x, y, 'L');
      if (ch === 'e' && is(x, y + 1, 'k')) zet(x, y, 'E');
    }
    if (dir === 'down') { for (let x = 13; x <= 18; x++) if (is(x, 19, 's')) zet(x, 19, 'o'); if (is(15, 20, 's')) zet(15, 20, 'o'); if (is(16, 20, 's')) zet(16, 20, 'o'); }
    if (dir === 'side') { for (let x = 16; x <= 18; x++) if (is(x, 19, 's')) zet(x, 19, 'o'); }
    for (let x = 0; x < SW; x++) if (is(x, 36, 'p') || is(x, 36, 'q')) zet(x, 36, 'K');
    if (look.hoofd !== 'helm') for (let x = 8; x <= 12; x++) if (is(x, 7, 'h')) zet(x, 7, 'L');
    return rows;
  }
  function maak(look, dir, frame) {
    const cv = document.createElement('canvas'); cv.width = SW; cv.height = SH;
    const c = cv.getContext('2d');
    const jas = look.jas || '#2b6cb0', broek = look.broek || '#3b3f4a', haar = look.haar || '#6b4a2b';
    const kleur = { ...KLEUR, s: look.huid || KLEUR.s, h: haar, L: lichter(haar), c: jas, C: donker(jas), p: broek, q: donker(broek), K: '#2a1f14', E: '#111', o: '#c98a6a', H: '#f2c230', M: '#6b4a2b', B: '#8a5a2b', G: '#8d949c', b: '#5aa7d6', F: '#c9a24d' };
    const rows = detail(scale2x(pas(raster(dir, frame), look, dir)), dir, look);
    for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) { const ch = rows[y][x]; if (ch === '.' || !kleur[ch]) continue; c.fillStyle = kleur[ch]; c.fillRect(x, y, 1, 1); }
    return cv;
  }
  function lichter(hex) {
    const n = parseInt(hex.slice(1), 16), r = Math.min(255, (n >> 16) + 45), g = Math.min(255, ((n >> 8) & 255) + 45), b = Math.min(255, (n & 255) + 45);
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }
  function donker(hex) {
    const n = parseInt(hex.slice(1), 16), r = Math.max(0, (n >> 16) - 40), g = Math.max(0, ((n >> 8) & 255) - 40), b = Math.max(0, (n & 255) - 40);
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }
  function sprite(look, dir, frame) {
    const d = dir === 'left' || dir === 'right' ? 'side' : dir;
    const key = JSON.stringify([look.haar, look.jas, look.broek, look.hoofd, look.bril, look.huid, look.extra, d, frame]);
    if (!cache.has(key)) cache.set(key, maak(look, d, frame));
    return cache.get(key);
  }
  // Tekent een personage met voeten op de onderrand van tegel (x, y) in pixels; schaduw eronder.
  // t = tijd in frames voor idle (ademen, knipperen); zaad spreidt de animatie over personages.
  function draw(c, look, dir, frame, x, y, scale, t, zaad) {
    const s = scale || 1, img = sprite(look, dir, frame), bob = (frame === 1 || frame === 3) ? -2 : 0, tt = (t || 0) + (zaad || 0) * 37;
    c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(x + 16 * s, y + 30 * s, 12 * s, 5 * s, 0, 0, 7); c.fill();
    const adem = frame === 0 && (tt % 110) < 8 ? 1 : 0, ox = x, oy = y - 16 * s + bob * s;
    c.save(); if (dir === 'left') { c.translate(x + SW * s, 0); c.scale(-1, 1); c.translate(-x, 0); }
    if (adem) { c.drawImage(img, 0, 0, SW, 24, ox, oy + s, SW * s, 24 * s); c.drawImage(img, 0, 24, SW, 24, ox, oy + 24 * s, SW * s, 24 * s); }
    else c.drawImage(img, ox, oy, SW * s, SH * s);
    if (dir === 'down' && frame === 0 && (tt % 170) < 5 && !look.bril && look.hoofd !== 'bril' && look.hoofd !== 'helm') { c.fillStyle = look.huid || KLEUR.s; c.fillRect(ox + 10 * s, oy + 16 * s + adem * s, 2 * s, 2 * s); c.fillRect(ox + 20 * s, oy + 16 * s + adem * s, 2 * s, 2 * s); }
    c.restore();
  }
  function avatarCanvas(look, s) {
    const cv = document.createElement('canvas'); cv.width = SW * s; cv.height = SH * s;
    const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; c.drawImage(sprite(look, 'down', 0), 0, 0, SW * s, SH * s);
    return cv;
  }
  return { draw, sprite, avatarCanvas, portret, W: SW, H: SH };
})();
if (typeof module === 'object' && module.exports) module.exports = WQSprites;
