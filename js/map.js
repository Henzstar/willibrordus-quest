// Wereld op canvas: camera die de held volgt, BFS-looppad, markers, sprites en overgangen. Werelden komen uit tiles.js en interior.js.
const WQMap = (() => {
  'use strict';
  const T = 16;
  let cv, ctx, scale = 2, VW = 11, VH = 11, fullMap = false, t = 0, running = false, paused = false;
  let wereld = null; // { kaart, breedte, hoogte, begaanbaar:Set, offscreen, water:bool, sprites:fn, markers:fn, bg }
  const hero = { x: 0, y: 0, px: 0, py: 0, dir: 'down', frame: 0, look: {}, zichtbaar: true };
  let path = [], moving = false, onArrive = null, speed = 1, fade = { a: 0, richting: 0, cb: null }, bubbles = () => [];

  const tileAt = (x, y) => (wereld && wereld.kaart[y] && wereld.kaart[y][x]) || null;
  const walkable = (x, y) => { const ch = tileAt(x, y); return ch !== null && wereld.begaanbaar.has(ch); };

  function fit() {
    if (fullMap && wereld) { VW = wereld.breedte; VH = wereld.hoogte; }
    else {
      const w = cv.parentElement.clientWidth || 360;
      scale = w >= 480 ? 3 : 2;
      VW = Math.max(10, Math.min(16, Math.floor(w / (scale * T)))); VH = 11;
    }
    cv.width = VW * T; cv.height = VH * T;
    if (!fullMap) cv.style.width = (VW * T * scale) + 'px';
    ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
  }
  function camera() {
    const mw = wereld.breedte * T, mh = wereld.hoogte * T;
    const cx = mw <= VW * T ? (mw - VW * T) / 2 : Math.max(0, Math.min(mw - VW * T, hero.px - VW * T / 2 + 8));
    const cy = mh <= VH * T ? (mh - VH * T) / 2 : Math.max(0, Math.min(mh - VH * T, hero.py - VH * T / 2 + 8));
    return [Math.round(cx), Math.round(cy)];
  }
  function drawMarker(c, sx, sy, m) {
    const bob = Math.round(Math.sin(t / 12) * 2);
    if (m.done) {
      c.fillStyle = '#1d6b4f'; c.fillRect(sx + 4, sy - 13 + bob, 8, 8);
      c.fillStyle = '#fff'; c.fillRect(sx + 6, sy - 9 + bob, 1, 2); c.fillRect(sx + 7, sy - 8 + bob, 1, 2); c.fillRect(sx + 8, sy - 9 + bob, 1, 2); c.fillRect(sx + 9, sy - 10 + bob, 1, 2);
    } else {
      c.fillStyle = m.actief ? '#fff' : '#fff7cc'; c.fillRect(sx + 5, sy - 15 + bob, 6, 6); c.fillRect(sx + 7, sy - 9 + bob, 2, 3);
      c.fillStyle = m.actief ? '#d65a4a' : '#1a1f1c'; c.fillRect(sx + 7, sy - 13 + bob, 2, 2);
    }
  }
  function drawBubble(c, sx, sy, tekst) {
    const bob = Math.round(Math.sin(t / 10) * 1);
    c.fillStyle = '#fff'; c.fillRect(sx + 4, sy - 20 + bob, 8, 8); c.fillRect(sx + 7, sy - 12 + bob, 2, 2);
    c.fillStyle = '#1a1f1c'; c.fillRect(sx + 7, sy - 18 + bob, 2, 4); c.fillRect(sx + 7, sy - 13 + bob, 2, 1);
    if (tekst === '?') { c.fillStyle = '#fff'; c.fillRect(sx + 7, sy - 18 + bob, 2, 4); c.fillStyle = '#1a1f1c'; c.fillRect(sx + 6, sy - 18 + bob, 4, 1); c.fillRect(sx + 9, sy - 17 + bob, 1, 1); c.fillRect(sx + 7, sy - 16 + bob, 2, 1); c.fillRect(sx + 7, sy - 14 + bob, 1, 1); }
  }
  function step() {
    if (!moving || !path.length) return;
    const [nx, ny] = path[0], tx = nx * T, ty = ny * T;
    if (tx !== hero.px) { const d = Math.sign(tx - hero.px); hero.dir = d < 0 ? 'left' : 'right'; hero.px += speed * d; }
    else if (ty !== hero.py) { const d = Math.sign(ty - hero.py); hero.dir = d < 0 ? 'up' : 'down'; hero.py += speed * d; }
    if (hero.px === tx && hero.py === ty) { hero.x = nx; hero.y = ny; path.shift(); }
    if (t % 10 === 0) hero.frame = 1 - hero.frame;
    if (!path.length) { moving = false; hero.frame = 0; if (onArrive) onArrive(hero.x, hero.y); }
  }
  function render() {
    if (!running) return;
    t++;
    if (!paused) step();
    if (fade.richting) { fade.a = Math.max(0, Math.min(1, fade.a + fade.richting * 0.08)); if (fade.a === 1 && fade.richting > 0) { const cb = fade.cb; fade.cb = null; fade.richting = -1; cb && cb(); } if (fade.a === 0 && fade.richting < 0) fade.richting = 0; }
    if (!paused && wereld && cv.offsetParent !== null) {
      const [camX, camY] = camera();
      ctx.fillStyle = wereld.bg || '#0f1813'; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(wereld.offscreen, -camX, -camY);
      if (wereld.water) {
        const tx0 = Math.max(0, Math.floor(camX / T)), ty0 = Math.max(0, Math.floor(camY / T));
        for (let y = ty0; y <= Math.min(wereld.hoogte - 1, ty0 + VH); y++) for (let x = tx0; x <= Math.min(wereld.breedte - 1, tx0 + VW); x++) {
          if (wereld.kaart[y][x] === 'W') WQTiles.tekenWater(ctx, wereld.kaart, x, y, x * T - camX, y * T - camY, t);
        }
      }
      if (wereld.decor) { wereld.decor.update(t); wereld.decor.teken(ctx, camX, camY, t, 'onder'); }
      const lijst = wereld.sprites ? wereld.sprites(t).slice() : [];
      if (hero.zichtbaar) lijst.push({ px: hero.px, py: hero.py, dir: hero.dir, frame: moving ? hero.frame : 0, look: hero.look });
      lijst.sort((a, b) => a.py - b.py);
      for (const s of lijst) { WQSprites.draw(ctx, s.look, s.dir || 'down', s.frame || 0, s.px - camX, s.py - camY); if (s.bubble) drawBubble(ctx, s.px - camX, s.py - camY, s.bubble); }
      for (const m of (wereld.markers ? wereld.markers() : [])) drawMarker(ctx, m.x * T - camX, m.y * T - camY, m);
      for (const b of bubbles()) drawBubble(ctx, b.x * T - camX, b.y * T - camY, b.tekst);
      if (wereld.decor) wereld.decor.teken(ctx, camX, camY, t, 'boven');
    }
    if (fade.a > 0) { ctx.fillStyle = 'rgba(15,24,19,' + fade.a + ')'; ctx.fillRect(0, 0, cv.width, cv.height); }
    requestAnimationFrame(render);
  }
  function bfs(from, to) {
    const MW = wereld.breedte, key = (x, y) => y * MW + x, prev = new Map(), q = [from];
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
  function init(canvas, opties) { cv = canvas; fullMap = !!(opties && opties.fullMap); window.addEventListener('resize', () => { if (wereld) fit(); }); if (!running) { running = true; requestAnimationFrame(render); } }
  function setWereld(w, startX, startY) { wereld = w; fit(); setHero(startX, startY); }
  function setHero(x, y, dir) { hero.x = x; hero.y = y; hero.px = x * T; hero.py = y * T; path = []; moving = false; if (dir) hero.dir = dir; }
  function walkTo(x, y, maxLen) {
    if (!walkable(x, y)) return false;
    const p = bfs([hero.x, hero.y], [x, y]);
    if (!p || (maxLen && p.length > maxLen)) return false;
    path = p; moving = p.length > 0;
    if (!moving && onArrive) onArrive(hero.x, hero.y);
    return true;
  }
  function stepDir(dx, dy) { if (moving) return false; hero.dir = dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down'; return walkTo(hero.x + dx, hero.y + dy, 1); }
  function tileFromEvent(ev) {
    const rect = cv.getBoundingClientRect(), sx = cv.width / rect.width, sy = cv.height / rect.height, [camX, camY] = camera();
    return [Math.floor(((ev.clientX - rect.left) * sx + camX) / T), Math.floor(((ev.clientY - rect.top) * sy + camY) / T)];
  }
  function transition(cb) { fade.richting = 1; fade.cb = cb; }
  function richtingNaar(x, y) { const dx = x - hero.x, dy = y - hero.y; if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return ''; const a = Math.atan2(-dy, dx); const pijlen = ['O', 'NO', 'N', 'NW', 'W', 'ZW', 'Z', 'ZO']; return pijlen[Math.round(((a + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 4)) % 8]; }
  return {
    init, setWereld, setHero, walkTo, stepDir, tileFromEvent, bfs, walkable, transition, richtingNaar,
    setLook: l => { hero.look = l; }, setHeroVisible: v => { hero.zichtbaar = v; }, setOnArrive: f => { onArrive = f; }, setBubbles: f => { bubbles = f; },
    setPaused: v => { paused = v; }, isMoving: () => moving, heroTile: () => [hero.x, hero.y], heroDir: () => hero.dir, stop: () => { path = []; moving = false; hero.frame = 0; },
    canvas: () => cv, ctx: () => ctx, T,
  };
})();
