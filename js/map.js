// Tilemap-rendering op canvas, camera die de held volgt, BFS-looppad, markers en sprites.
// Gebruik: WQMap.init(canvas, CONTENT, opties) en daarna WQMap.walkTo(x, y) enz. Geen teksten hier.
const WQMap = (() => {
  'use strict';
  const T = 16;
  const PAL = {
    gras: '#7bb661', gras2: '#5e9a4a', pad: '#d9c38a', pad2: '#c4ad77', asfalt: '#6b7280', asfalt2: '#9aa3ad',
    water: '#5aa7d6', water2: '#8cc5e8', water3: '#4a93c2', kroon: '#3f7d3a', kroon2: '#5aa35a', stam: '#6b4a2b',
    dak: '#8b5e3c', dak2: '#6e4a2f', muur: '#e8dcc5', muur2: '#c9b89b', zand: '#e0cfa0', zand2: '#cdb985',
    nieuw: '#f4f1ea', nieuw2: '#cfcac0', nieuwDak: '#e8e3d8', kas: '#dbe8f0', kas2: '#b8ccd8', kasDak: '#c7dbe7',
    akker: '#a9b46a', akker2: '#8f9a52', koepel: '#c9a24d', koepel2: '#a8843a', parkeer: '#9aa3ad', streep: '#e6e9ec',
    raam: '#5aa7d6', ink: '#1a1f1c', accent: '#1d6b4f', wit: '#ffffff', kaart: '#fff7cc', grijs: '#9fb3a6',
  };
  // Sprite: 16 regels, één teken per pixel. k = lijn, s = huid, h = haar, c = jas, p = broek, w = wit, . = leeg.
  const SPR = { k: PAL.ink, s: '#f1c9a5', p: '#3b3f4a', w: PAL.wit };
  const BODY = [
    '....kkccccck....', '...kccccccccck..', '...kckccccckck..', '...ksckccckcsk..', '....kccccccck...',
    '....kppkkppk....', '....kppk.kppk...', '....kkkk.kkkk...', '................',
  ];
  const BODY2 = BODY.slice(0, 6).concat(['...kppk...kppk..', '...kkkk...kkkk..', '................']);
  const HEADS = {
    kort: ['......kkkk......', '.....khhhhk.....', '....khhhhhhk....', '....khsssshk....', '....kskssksk....', '....kssssssk....', '.....kssssk.....'],
    lang: ['......kkkk......', '.....khhhhk.....', '....khhhhhhk....', '....khhsshhk....', '....khkssksk....', '....khsssshk....', '....khksskhk....'],
    knot: ['.....kkkkkk.....', '....khhhhhhk....', '....khhhhhhk....', '....khsssshk....', '....kskssksk....', '....kssssssk....', '.....kssssk.....'],
    bril: ['......kkkk......', '.....khhhhk.....', '....kssssssk....', '....kssssssk....', '....kkkskkkk....', '....kssssssk....', '.....kssssk.....'],
  };
  const HEADSTYLES = ['kort', 'lang', 'knot', 'bril'];
  const spriteCache = new Map();

  let C, MAP, MW, MH, WALK, cv, ctx, off, scale = 2, VW = 16, VH = 10, fullMap = false, t = 0, running = false;
  const hero = { x: 0, y: 0, px: 0, py: 0, dir: 1, frame: 0, jas: PAL.accent, haar: PAL.stam, hoofd: 'kort', zichtbaar: true };
  let path = [], moving = false, onArrive = null, visited = () => false, extraSprites = () => [], speed = 2;

  const tileAt = (x, y) => (y < 0 || y >= MH || x < 0 || x >= MW) ? 'T' : MAP[y][x];
  const walkable = (x, y) => WALK.has(tileAt(x, y));

  function frames(hoofd) {
    const key = hoofd;
    if (!spriteCache.has(key)) spriteCache.set(key, [HEADS[hoofd].concat(BODY), HEADS[hoofd].concat(BODY2)]);
    return spriteCache.get(key);
  }
  function drawSprite(c, hoofd, f, sx, sy, jas, haar, flip, s) {
    s = s || 1;
    const rows = frames(hoofd)[f];
    for (let y = 0; y < 16; y++) {
      const row = rows[y];
      for (let x = 0; x < 16; x++) {
        const ch = row[x];
        if (ch === '.') continue;
        c.fillStyle = ch === 'c' ? jas : ch === 'h' ? haar : SPR[ch];
        c.fillRect(sx + (flip ? 15 - x : x) * s, sy + y * s, s, s);
      }
    }
  }

  function drawTile(c, ch, x, y, sx, sy) {
    const r = (a, b, w, h, col) => { c.fillStyle = col; c.fillRect(sx + a, sy + b, w, h); };
    const above = tileAt(x, y - 1), left = tileAt(x - 1, y), right = tileAt(x + 1, y);
    r(0, 0, T, T, PAL.gras);
    if (ch === '.') { if ((x * 7 + y * 13) % 5 === 0) r(4, 6, 2, 1, PAL.gras2); if ((x * 3 + y * 11) % 7 === 0) r(10, 11, 1, 2, PAL.gras2); }
    else if (ch === 'T') { r(7, 10, 2, 5, PAL.stam); c.fillStyle = PAL.kroon; c.beginPath(); c.arc(sx + 8, sy + 7, 6, 0, 7); c.fill(); r(5, 4, 2, 2, PAL.kroon2); r(4, 7, 1, 1, PAL.kroon2); }
    else if (ch === '=') { r(0, 0, T, T, PAL.asfalt); if (left === '=' || right === '=') r(2, 7, 5, 2, PAL.asfalt2); else r(7, 2, 2, 5, PAL.asfalt2); }
    else if (ch === '-') { r(0, 0, T, T, PAL.pad); r(3, 4, 2, 1, PAL.pad2); r(10, 11, 2, 1, PAL.pad2); r(12, 3, 1, 1, PAL.pad2); }
    else if (ch === 'W') { r(0, 0, T, T, PAL.water); }
    else if (ch === 'S') { r(0, 0, T, T, PAL.zand); r(3, 3, 1, 1, PAL.zand2); r(11, 8, 2, 1, PAL.zand2); r(6, 13, 1, 1, PAL.zand2); }
    else if (ch === 'F') { r(0, 0, T, T, PAL.akker); for (let i = 1; i < 16; i += 4) r(i, 0, 1, T, PAL.akker2); }
    else if (ch === 'P') { r(0, 0, T, T, PAL.parkeer); r(0, 7, T, 1, PAL.streep); r(7, 0, 1, T, PAL.streep); }
    else if (ch === 'K') {
      if (above !== 'K') { c.fillStyle = PAL.koepel; c.beginPath(); c.arc(sx + 8, sy + 16, 9, Math.PI, 0); c.fill(); r(3, 15, 10, 1, PAL.koepel2); }
      else { r(0, 0, T, T, PAL.koepel); r(0, 0, T, 2, PAL.koepel2); r(6, 6, 4, 5, PAL.raam); }
    }
    else if (ch === 'B' || ch === 'N' || ch === 'G') {
      const dak = ch === 'B' ? PAL.dak : ch === 'N' ? PAL.nieuwDak : PAL.kasDak;
      const dak2 = ch === 'B' ? PAL.dak2 : ch === 'N' ? PAL.nieuw2 : PAL.kas2;
      const muur = ch === 'B' ? PAL.muur : ch === 'N' ? PAL.nieuw : PAL.kas;
      if (above !== ch) { r(0, 0, T, T, dak); r(0, 0, T, 3, dak2); r(0, 14, T, 2, dak2); }
      else { r(0, 0, T, T, muur); r(3, 4, 3, 5, PAL.raam); r(10, 4, 3, 5, PAL.raam); r(0, 14, T, 2, PAL.muur2); if (ch === 'G') { r(0, 8, T, 1, PAL.kas2); r(8, 0, 1, T, PAL.kas2); } }
    }
  }

  function drawWater(c, x, y, sx, sy) {
    const o = Math.floor(t / 20) % 4;
    c.fillStyle = (Math.floor(t / 40) % 2) ? PAL.water : PAL.water3;
    c.fillRect(sx, sy, T, T);
    c.fillStyle = PAL.water2;
    c.fillRect(sx + (2 + o + x) % 12, sy + 4, 5, 1);
    c.fillRect(sx + (9 + o + y) % 12, sy + 11, 4, 1);
  }

  function drawLabel(c, straat) {
    const [x, y] = straat.tegel;
    c.save();
    c.font = '7px "Press Start 2P", monospace';
    c.textBaseline = 'middle';
    const w = c.measureText(straat.naam).width + 6;
    if (straat.richting === 'v') { c.translate(x * T + 8, y * T); c.rotate(Math.PI / 2); }
    else c.translate(x * T, y * T + 8);
    c.fillStyle = 'rgba(15,24,19,.55)'; c.fillRect(0, -5, w, 10);
    c.fillStyle = PAL.wit; c.fillText(straat.naam, 3, 1);
    c.restore();
  }

  function buildOffscreen() {
    off = document.createElement('canvas'); off.width = MW * T; off.height = MH * T;
    const c = off.getContext('2d'); c.imageSmoothingEnabled = false;
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) drawTile(c, MAP[y][x], x, y, x * T, y * T);
    for (const s of C.straten) drawLabel(c, s);
  }

  function fit() {
    if (fullMap) { VW = MW; VH = MH; }
    else {
      const w = cv.parentElement.clientWidth || 360;
      scale = w >= 480 ? 3 : 2;
      VW = Math.max(10, Math.min(MW, Math.floor(w / (scale * T))));
      VH = 10;
    }
    cv.width = VW * T; cv.height = VH * T;
    if (!fullMap) cv.style.width = (VW * T * scale) + 'px';
    ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
  }

  function camera() {
    const cx = Math.max(0, Math.min(MW * T - VW * T, hero.px - VW * T / 2 + 8));
    const cy = Math.max(0, Math.min(MH * T - VH * T, hero.py - VH * T / 2 + 8));
    return [Math.round(cx), Math.round(cy)];
  }

  function drawMarker(c, sx, sy, done, actief) {
    const bob = Math.round(Math.sin(t / 12) * 2);
    if (done) {
      c.fillStyle = PAL.accent; c.fillRect(sx + 4, sy - 13 + bob, 8, 8);
      c.fillStyle = PAL.wit; c.fillRect(sx + 6, sy - 9 + bob, 1, 2); c.fillRect(sx + 7, sy - 8 + bob, 1, 2); c.fillRect(sx + 8, sy - 9 + bob, 1, 2); c.fillRect(sx + 9, sy - 10 + bob, 1, 2);
    } else {
      c.fillStyle = actief ? PAL.wit : PAL.kaart; c.fillRect(sx + 5, sy - 15 + bob, 6, 6); c.fillRect(sx + 7, sy - 9 + bob, 2, 3);
      c.fillStyle = PAL.ink; c.fillRect(sx + 7, sy - 13 + bob, 2, 2);
    }
  }

  function step() {
    if (!moving || !path.length) return;
    const [nx, ny] = path[0], tx = nx * T, ty = ny * T;
    if (tx !== hero.px) { hero.dir = Math.sign(tx - hero.px); hero.px += speed * hero.dir; }
    else if (ty !== hero.py) hero.py += speed * Math.sign(ty - hero.py);
    if (hero.px === tx && hero.py === ty) { hero.x = nx; hero.y = ny; path.shift(); }
    if (t % 8 === 0) hero.frame = 1 - hero.frame;
    if (!path.length) { moving = false; hero.frame = 0; if (onArrive) onArrive(hero.x, hero.y); }
  }

  function render() {
    if (!running) return;
    t++;
    step();
    if (cv.offsetParent !== null) {
      const [camX, camY] = camera();
      ctx.drawImage(off, -camX, -camY);
      const tx0 = Math.floor(camX / T), ty0 = Math.floor(camY / T);
      for (let y = ty0; y <= Math.min(MH - 1, ty0 + VH); y++) for (let x = tx0; x <= Math.min(MW - 1, tx0 + VW); x++) {
        if (MAP[y][x] === 'W') drawWater(ctx, x, y, x * T - camX, y * T - camY);
      }
      for (const L of C.locaties) {
        const [mx, my] = L.tegel;
        drawSprite(ctx, L.hoofd || 'kort', 0, L.npcTegel[0] * T - camX, L.npcTegel[1] * T - camY, L.npc.kleur, PAL.stam, true);
        if (L.id !== 'start') drawMarker(ctx, mx * T - camX, my * T - camY, visited(L.id), path.length && path[path.length - 1][0] === mx && path[path.length - 1][1] === my);
      }
      for (const s of extraSprites()) drawSprite(ctx, s.hoofd || 'kort', 0, s.x * T - camX, s.y * T - camY, s.jas, s.haar || PAL.stam, false);
      if (hero.zichtbaar) drawSprite(ctx, hero.hoofd, moving ? hero.frame : 0, hero.px - camX, hero.py - camY, hero.jas, hero.haar, hero.dir < 0);
    }
    requestAnimationFrame(render);
  }

  function bfs(from, to) {
    const key = (x, y) => y * MW + x, prev = new Map(), q = [from];
    prev.set(key(from[0], from[1]), null);
    while (q.length) {
      const [x, y] = q.shift();
      if (x === to[0] && y === to[1]) break;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (!walkable(nx, ny) || prev.has(key(nx, ny))) continue;
        prev.set(key(nx, ny), [x, y]); q.push([nx, ny]);
      }
    }
    if (!prev.has(key(to[0], to[1]))) return null;
    const out = []; let cur = to;
    while (cur && !(cur[0] === from[0] && cur[1] === from[1])) { out.unshift(cur); cur = prev.get(key(cur[0], cur[1])); }
    return out;
  }

  // ---------- publieke API ----------
  function init(canvas, content, opties) {
    C = content; MAP = C.tilemap; MW = MAP[0].length; MH = MAP.length;
    WALK = new Set(Object.keys(C.legenda).filter(k => C.legenda[k].begaanbaar));
    cv = canvas; fullMap = !!(opties && opties.fullMap);
    C.locaties.forEach((L, i) => { L.hoofd = HEADSTYLES[i % HEADSTYLES.length]; });
    fit(); buildOffscreen();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildOffscreen);
    window.addEventListener('resize', fit);
    const s = C.locaties[0].tegel; setHero(s[0], s[1]);
    if (!running) { running = true; requestAnimationFrame(render); }
  }
  function setHero(x, y) { hero.x = x; hero.y = y; hero.px = x * T; hero.py = y * T; path = []; moving = false; }
  function setAvatar(av) { hero.jas = av.jas; hero.haar = av.haar; hero.hoofd = av.hoofd || HEADSTYLES[C.avatars.indexOf(av) % 4] || 'kort'; }
  function walkTo(x, y) {
    if (!walkable(x, y)) return false;
    const p = bfs([hero.x, hero.y], [x, y]);
    if (!p) return false;
    path = p; moving = p.length > 0;
    if (!moving && onArrive) onArrive(hero.x, hero.y);
    return true;
  }
  function stepDir(dx, dy) { if (moving) return false; return walkTo(hero.x + dx, hero.y + dy); }
  function tileFromEvent(ev) {
    const rect = cv.getBoundingClientRect(), sx = cv.width / rect.width, sy = cv.height / rect.height;
    const [camX, camY] = camera();
    return [Math.floor(((ev.clientX - rect.left) * sx + camX) / T), Math.floor(((ev.clientY - rect.top) * sy + camY) / T)];
  }
  function locatieBij(x, y, afstand) {
    return C.locaties.find(L => L.id !== 'start' && Math.abs(L.tegel[0] - x) <= afstand && Math.abs(L.tegel[1] - y) <= afstand) || null;
  }
  function avatarCanvas(av, s) {
    const c = document.createElement('canvas'); c.width = 16 * s; c.height = 16 * s;
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    drawSprite(x, av.hoofd || HEADSTYLES[C.avatars.indexOf(av) % 4] || 'kort', 0, 0, 0, av.jas, av.haar, false, s);
    return c;
  }
  return {
    init, setHero, setAvatar, walkTo, stepDir, tileFromEvent, locatieBij, avatarCanvas, bfs, walkable,
    isMoving: () => moving, heroTile: () => [hero.x, hero.y],
    setOnArrive: f => { onArrive = f; }, setVisited: f => { visited = f; }, setExtraSprites: f => { extraSprites = f; },
    setHeroVisible: v => { hero.zichtbaar = v; }, T, PAL,
  };
})();
if (typeof module === 'object' && module.exports) module.exports = WQMap;
