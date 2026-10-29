// Personages van 16 x 24 px: vier richtingen, twee loopframes, kapsels en attributen. Gecachet per uiterlijk.
const WQSprites = (() => {
  'use strict';
  const W = 16, H = 24;
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
  // Portret 16 x 16 (geschaald) voor de dialoogbox. m = mond, M = mond open.
  const GEZICHT = [
    '......kkkk......', '....kkhhhhkk....', '...khhhhhhhhk...', '..khhhhhhhhhhk..', '..khhhhhhhhhhk..', '..khhssssssshk..', '..kssssssssssk..', '..ksiwsssswisk..',
    '..kssssssssssk..', '..ksssssssssskk.', '..kssmmmmmmssk..', '...kssssssssk...', '....kssssssk....', '..kkkccccccckkk.', '.kcccccccccccck.', '.kccccCcccccCck.',
  ];
  function portretRaster(look, open) {
    const rows = GEZICHT.map(r => r.split(''));
    const zet = (x, y, ch) => { rows[y][x] = ch; };
    const hoofd = look.hoofd || 'kort';
    if (hoofd === 'lang') for (let y = 5; y <= 11; y++) { zet(2, y, 'h'); zet(13, y, 'h'); zet(1, y, 'k'); zet(14, y, 'k'); }
    if (hoofd === 'knot') { for (let x = 5; x <= 10; x++) zet(x, 0, x === 5 || x === 10 ? 'k' : 'h'); zet(6, 1, 'h'); zet(9, 1, 'h'); }
    if (hoofd === 'bril') { [3, 4, 5, 6, 9, 10, 11, 12].forEach(x => { zet(x, 6, 'k'); zet(x, 8, 'k'); }); [3, 6, 9, 12].forEach(x => zet(x, 7, 'k')); zet(7, 7, 'k'); zet(8, 7, 'k'); }
    if (hoofd === 'helm') { for (let y = 0; y <= 5; y++) for (let x = 0; x < W; x++) if (rows[y][x] === 'h') rows[y][x] = 'H'; for (let x = 2; x <= 13; x++) zet(x, 5, x === 2 || x === 13 ? 'k' : 'H'); }
    if (open) { for (let x = 5; x <= 10; x++) { zet(x, 10, x === 5 || x === 10 ? 'm' : 'M'); zet(x, 11, x === 5 || x === 10 ? 'k' : 'M'); } zet(4, 11, 'k'); zet(11, 11, 'k'); }
    return rows;
  }
  function portret(look, open) {
    const s = 3, cv = document.createElement('canvas'); cv.width = W * s; cv.height = W * s;
    const c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
    const kleur = { ...KLEUR, h: look.haar || '#6b4a2b', c: look.jas || '#2b6cb0', C: donker(look.jas || '#2b6cb0'), m: '#8a4a30', M: '#5a1f1a', H: '#f2c230' };
    const rows = portretRaster(look, open);
    for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) { const ch = rows[y][x]; if (ch === '.' || !kleur[ch]) continue; c.fillStyle = kleur[ch]; c.fillRect(x * s, y * s, s, s); }
    return cv;
  }
  function pas(rows, look, dir) {
    const zet = (x, y, ch) => { if (rows[y] && x >= 0 && x < W) rows[y][x] = ch; };
    const hoofd = look.hoofd || 'kort';
    if (hoofd === 'lang') {
      if (dir === 'down') for (let y = 7; y <= 11; y++) { zet(3, y, 'h'); zet(12, y, 'h'); zet(2, y, 'k'); zet(13, y, 'k'); }
      if (dir === 'side') for (let y = 7; y <= 11; y++) { zet(3, y, 'h'); zet(4, y, 'h'); zet(2, y, 'k'); }
      if (dir === 'up') for (let y = 10; y <= 13; y++) for (let x = 4; x <= 11; x++) zet(x, y, 'h');
    }
    if (hoofd === 'knot') { const bx = dir === 'side' ? 4 : 7; zet(bx, 1, 'k'); zet(bx + 1, 1, 'k'); zet(bx - 1, 2, 'k'); zet(bx, 2, 'h'); zet(bx + 1, 2, 'h'); zet(bx + 2, 2, 'k'); zet(bx, 3, 'h'); zet(bx + 1, 3, 'h'); }
    if (hoofd === 'bril') {
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
  function maak(look, dir, frame) {
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d');
    const kleur = { ...KLEUR, h: look.haar || '#6b4a2b', c: look.jas || '#2b6cb0', C: donker(look.jas || '#2b6cb0'), p: look.broek || '#3b3f4a', H: '#f2c230', M: '#6b4a2b', B: '#8a5a2b', G: '#8d949c', b: '#5aa7d6', F: '#c9a24d' };
    const rows = pas(raster(dir, frame), look, dir);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const ch = rows[y][x]; if (ch === '.' || !kleur[ch]) continue; c.fillStyle = kleur[ch]; c.fillRect(x, y, 1, 1); }
    return cv;
  }
  function donker(hex) {
    const n = parseInt(hex.slice(1), 16), r = Math.max(0, (n >> 16) - 40), g = Math.max(0, ((n >> 8) & 255) - 40), b = Math.max(0, (n & 255) - 40);
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }
  function sprite(look, dir, frame) {
    const d = dir === 'left' || dir === 'right' ? 'side' : dir;
    const key = JSON.stringify([look.haar, look.jas, look.broek, look.hoofd, look.extra, d, frame]);
    if (!cache.has(key)) cache.set(key, maak(look, d, frame));
    return cache.get(key);
  }
  // Tekent een personage met voeten op de onderrand van tegel (x, y) in pixels; schaduw eronder.
  // t = tijd in frames voor idle (ademen, knipperen); zaad spreidt de animatie over personages.
  function draw(c, look, dir, frame, x, y, scale, t, zaad) {
    const s = scale || 1, img = sprite(look, dir, frame), bob = (frame === 1 || frame === 3) ? -1 : 0, tt = (t || 0) + (zaad || 0) * 37;
    c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(x + 8 * s, y + 15 * s, 6 * s, 2.5 * s, 0, 0, 7); c.fill();
    const adem = frame === 0 && (tt % 110) < 8 ? 1 : 0, ox = x, oy = y - 8 * s + bob * s;
    c.save(); if (dir === 'left') { c.translate(x + W * s, 0); c.scale(-1, 1); c.translate(-x, 0); }
    if (adem) { c.drawImage(img, 0, 0, W, 12, ox, oy + s, W * s, 12 * s); c.drawImage(img, 0, 12, W, 12, ox, oy + 12 * s, W * s, 12 * s); }
    else c.drawImage(img, ox, oy, W * s, H * s);
    if (dir === 'down' && frame === 0 && (tt % 170) < 5 && look.hoofd !== 'bril' && look.hoofd !== 'helm') { c.fillStyle = KLEUR.s; c.fillRect(ox + 5 * s, oy + 8 * s + adem * s, s, s); c.fillRect(ox + 10 * s, oy + 8 * s + adem * s, s, s); }
    c.restore();
  }
  function avatarCanvas(look, s) {
    const cv = document.createElement('canvas'); cv.width = W * s; cv.height = H * s;
    const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; c.drawImage(sprite(look, 'down', 0), 0, 0, W * s, H * s);
    return cv;
  }
  return { draw, sprite, avatarCanvas, portret, W, H };
})();
if (typeof module === 'object' && module.exports) module.exports = WQSprites;
