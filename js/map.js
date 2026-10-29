// Wereld op canvas: camera die de held volgt, BFS-looppad, markers, sprites en overgangen. Werelden komen uit tiles.js en interior.js.
const WQMap = (() => {
  'use strict';
  const T = 16;
  let cv, ctx, scale = 2, VW = 11, VH = 11, fullMap = false, t = 0, running = false, paused = false;
  let wereld = null; // { kaart, breedte, hoogte, begaanbaar:Set, offscreen, water:bool, sprites:fn, markers:fn, bg }
  const hero = { x: 0, y: 0, px: 0, py: 0, dir: 'down', frame: 0, look: {}, zichtbaar: true };
  let path = [], moving = false, onArrive = null, speed = 1, fade = { a: 0, richting: 0, cb: null }, bubbles = () => [];
  let cam = { x: 0, y: 0, snap: true }, schud = 0, avondFn = () => 0, iris = { fase: 0, r: 0, cb: null };

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
  function doel() {
    const mw = wereld.breedte * T, mh = wereld.hoogte * T;
    const cx = mw <= VW * T ? (mw - VW * T) / 2 : Math.max(0, Math.min(mw - VW * T, hero.px - VW * T / 2 + 8));
    const cy = mh <= VH * T ? (mh - VH * T) / 2 : Math.max(0, Math.min(mh - VH * T, hero.py - VH * T / 2 + 8));
    return [cx, cy];
  }
  function camera() {
    const [dx, dy] = doel();
    if (cam.snap) { cam.x = dx; cam.y = dy; cam.snap = false; }
    else { cam.x += (dx - cam.x) * 0.18; cam.y += (dy - cam.y) * 0.18; if (Math.abs(dx - cam.x) < 0.5) cam.x = dx; if (Math.abs(dy - cam.y) < 0.5) cam.y = dy; }
    let sx = 0, sy = 0; if (schud > 0) { schud--; sx = (Math.random() - 0.5) * 4; sy = (Math.random() - 0.5) * 3; }
    return [Math.round(cam.x + sx), Math.round(cam.y + sy)];
  }
  // Avondlaag: blauwe tint, gloed om lantaarns, verlichte ramen. f = 0 (dag) tot 1 (avond).
  function avond(c, camX, camY, f) {
    if (f <= 0 || !wereld.lampen) return;
    c.fillStyle = 'rgba(18,28,70,' + (0.38 * f) + ')'; c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    c.save(); c.globalCompositeOperation = 'lighter';
    for (const [lx, ly] of wereld.lampen) { const x = lx - camX, y = ly - camY; if (x < -40 || y < -40 || x > c.canvas.width + 40 || y > c.canvas.height + 40) continue; const g = c.createRadialGradient(x, y, 2, x, y, 30); g.addColorStop(0, 'rgba(255,220,140,' + (0.55 * f) + ')'); g.addColorStop(1, 'rgba(255,200,100,0)'); c.fillStyle = g; c.fillRect(x - 30, y - 30, 60, 60); }
    c.fillStyle = 'rgba(255,215,120,' + (0.55 * f) + ')';
    for (const [rx, ry, rw, rh] of (wereld.ramen || [])) { const x = rx - camX, y = ry - camY; if (x < -20 || y < -20 || x > c.canvas.width + 20 || y > c.canvas.height + 20) continue; c.fillRect(x, y, rw, rh); }
    c.restore();
  }
  function tekenIris(c) {
    if (!iris.fase) return;
    const cx = hero.px - cam.x + 8, cy = hero.py - cam.y + 4, max = Math.hypot(c.canvas.width, c.canvas.height);
    if (iris.fase === 1) { iris.r -= max / 14; if (iris.r <= 0) { iris.r = 0; const cb = iris.cb; iris.cb = null; iris.fase = 2; cb && cb(); } }
    else { iris.r += max / 14; if (iris.r >= max) { iris.fase = 0; return; } }
    c.save(); c.beginPath(); c.rect(0, 0, c.canvas.width, c.canvas.height); c.arc(cx, cy, Math.max(0, iris.r), 0, Math.PI * 2, true); c.fillStyle = '#0f1813'; c.fill('evenodd'); c.restore();
  }
  function drawMarker(c, sx, sy, m) {
    const bob = Math.round(Math.sin(t / 12) * 2);
    if (m.dicht && !m.done) { c.fillStyle = '#6b7280'; c.fillRect(sx + 5, sy - 15 + bob, 6, 6); c.fillRect(sx + 7, sy - 9 + bob, 2, 3); c.fillStyle = '#e0a84a'; c.fillRect(sx + 6, sy - 13 + bob, 4, 3); c.fillStyle = '#1a1f1c'; c.fillRect(sx + 7, sy - 12 + bob, 2, 1); return; }
    if (m.plek) { c.fillStyle = m.done ? '#9fb3a6' : '#f2f2f2'; c.fillRect(sx + 7, sy - 15 + bob, 2, 8); c.fillRect(sx + 5, sy - 13 + bob, 6, 2); return; }
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
    if (t % 7 === 0) hero.frame = (hero.frame + 1) % 4;
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
      lijst.forEach((s, i) => { WQSprites.draw(ctx, s.look, s.dir || 'down', s.frame || 0, s.px - camX, s.py - camY, 1, t, s.zaad != null ? s.zaad : i); if (s.bubble) drawBubble(ctx, s.px - camX, s.py - camY, s.bubble); });
      if (wereld.overlay) ctx.drawImage(wereld.overlay, -camX, -camY);
      if (moving && hero.zichtbaar && tileAt(hero.x, hero.y) === '.' && wereld.overlay) { for (let i = 0; i < 3; i++) { const k = (t * 7 + i * 31) % 16; ctx.fillStyle = i % 2 ? '#5e9a4a' : '#8cc46f'; ctx.fillRect(hero.px - camX + 2 + ((k * 5 + i * 3) % 12), hero.py - camY + 12 - (k % 5), 1, 1); } }
      for (const m of (wereld.markers ? wereld.markers() : [])) drawMarker(ctx, m.x * T - camX, m.y * T - camY, m);
      for (const b of bubbles()) drawBubble(ctx, b.x * T - camX, b.y * T - camY, b.tekst);
      if (wereld.decor) wereld.decor.teken(ctx, camX, camY, t, 'boven');
      avond(ctx, camX, camY, avondFn());
      tekenIris(ctx);
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
  function setWereld(w, startX, startY) { wereld = w; fit(); setHero(startX, startY); cam.snap = true; }
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
  function transition(cb) { if (iris.fase) { fade.richting = 1; fade.cb = cb; return; } iris.fase = 1; iris.r = Math.hypot(cv.width, cv.height); iris.cb = cb; }
  function richtingNaar(x, y) { const dx = x - hero.x, dy = y - hero.y; if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return ''; const a = Math.atan2(-dy, dx); const pijlen = ['O', 'NO', 'N', 'NW', 'W', 'ZW', 'Z', 'ZO']; return pijlen[Math.round(((a + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 4)) % 8]; }
  return {
    init, setWereld, setHero, walkTo, stepDir, tileFromEvent, bfs, walkable, transition, richtingNaar,
    setLook: l => { hero.look = l; }, setHeroVisible: v => { hero.zichtbaar = v; }, setOnArrive: f => { onArrive = f; }, setBubbles: f => { bubbles = f; },
    setPaused: v => { paused = v; }, isMoving: () => moving, schud: n => { schud = n || 12; }, setAvond: f => { avondFn = f; }, heroTile: () => [hero.x, hero.y], heroDir: () => hero.dir, stop: () => { path = []; moving = false; hero.frame = 0; },
    canvas: () => cv, ctx: () => ctx, T,
  };
})();
