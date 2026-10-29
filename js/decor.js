// Bewegende decoratie buiten: vlinders, vogels, blaadjes, eenden, auto's, rook. Alleen tekenen; geen spelregels.
const WQDecor = (() => {
  'use strict';
  const T = 32;
  let C, MAP, MW, MH, items = [], vogels = [], klaar = false;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const R = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); };
  const tegels = ch => { const out = []; for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (MAP[y][x] === ch) out.push([x, y]); return out; };

  function init(content) {
    C = content; MAP = C.tilemap; MW = MAP[0].length; MH = MAP.length; items = []; vogels = [];
    // vlinders bij bloemperken
    C.props.filter(p => p.type === 'bloemen').forEach((p, i) => { if (i % 2) return; items.push({ soort: 'vlinder', x: p.tegel[0] * T + 8, y: p.tegel[1] * T + 4, ax: p.tegel[0] * T + 8, ay: p.tegel[1] * T + 4, f: rnd(0, 100), kleur: i % 4 ? '#f6d44c' : '#f2f2f2' }); });
    // blaadjes bij bomen (klein aantal)
    tegels('T').filter((t, i) => i % 9 === 0).forEach(([x, y]) => items.push({ soort: 'blad', x: x * T + 8, y: y * T + 4, bx: x * T + 8, by: y * T + 4, f: rnd(0, 200), kleur: Math.random() < 0.5 ? '#c9843a' : '#c9b43a' }));
    // eenden op het water
    const water = tegels('W').filter(([x, y]) => y > 0 && MAP[y - 1][x] === 'W' && MAP[y + 1] && MAP[y + 1][x] === 'W');
    for (let i = 0; i < 6 && water.length; i++) { const [x, y] = water[Math.floor(rnd(0, water.length))]; items.push({ soort: 'eend', x: x * T + 4, y: y * T + 6, d: Math.random() < 0.5 ? 1 : -1, f: rnd(0, 100) }); }
    // auto's op de Kanaalweg en de Kennemerstraatweg
    items.push({ soort: 'auto', x: 0, y: 0 * T + 4, d: 1, as: 'h', snel: 0.9, kleur: '#c9403a' });
    items.push({ soort: 'auto', x: MW * T, y: 0 * T + 16, d: -1, as: 'h', snel: 0.7, kleur: '#e8e8e8' });
    items.push({ soort: 'auto', x: 1 * T + 4, y: MH * T, d: -1, as: 'v', snel: 0.6, kleur: '#3b5fa8' });
    items.push({ soort: 'auto', x: 63 * T + 16, y: 0, d: 1, as: 'v', snel: 0.5, kleur: '#55585e' });
    // mist bij de begraafplaats en stof bij de bouwplaats
    const plek = C.locaties.find(l => l.soort === 'plek');
    if (plek) for (let i = 0; i < 7; i++) items.push({ soort: 'mist', x: (plek.tegel[0] - 3 + rnd(0, 6)) * T, y: (plek.tegel[1] - 2 + rnd(0, 4)) * T, ax: (plek.tegel[0] - 3) * T, f: rnd(0, 300), w: rnd(18, 34) });
    const zand = tegels('S'); for (let i = 0; i < 10 && zand.length; i++) { const [x, y] = zand[Math.floor(rnd(0, zand.length))]; items.push({ soort: 'stof', x: x * T + rnd(0, 16), y: y * T + rnd(0, 16), bx: x * T, f: rnd(0, 100) }); }
    // dieren in de dierenweide
    const weide = tegels('D');
    if (weide.length) {
      const xs = weide.map(t => t[0]), ys = weide.map(t => t[1]);
      const grens = { x0: Math.min(...xs) * T + 8, x1: (Math.max(...xs) + 1) * T - 12, y0: Math.min(...ys) * T + 10, y1: (Math.max(...ys) + 1) * T - 10 };
      ['kip', 'kip', 'kip', 'kip', 'geit', 'geit', 'schaap', 'schaap'].forEach((soort, i) => items.push({ soort, x: rnd(grens.x0, grens.x1), y: rnd(grens.y0, grens.y1), grens, d: Math.random() < 0.5 ? 1 : -1, f: rnd(0, 200), wacht: rnd(0, 120), vx: 0, vy: 0 }));
    }
    // fonteinspray
    tegels('O').forEach(([x, y], i) => { if (MAP[y][x - 1] === 'O' || MAP[y - 1][x] === 'O') return; for (let k = 0; k < 10; k++) items.push({ soort: 'spuit', x: x * T + 32, y: y * T + 18, bx: x * T + 32, by: y * T + 18, f: k * 6, k }); });
    // rook uit schoorstenen (vaste plekken)
    [[9, 18], [23, 27], [36, 13]].forEach(([x, y]) => items.push({ soort: 'rook', x: x * T + 24, y: y * T - 10, f: rnd(0, 60) }));
    klaar = true;
  }
  function vogel(t) {
    if (t % 420 === 0) { const y = rnd(2, MH - 4) * T; vogels.push({ x: -20, y, vy: rnd(-0.2, 0.2), f: 0, n: 3 }); }
    vogels = vogels.filter(v => v.x < MW * T + 40);
  }
  function update(t) {
    if (!klaar) return;
    vogel(t);
    for (const v of vogels) { v.x += 2.2; v.y += v.vy; v.f++; }
    for (const it of items) {
      it.f = (it.f || 0) + 1;
      if (it.soort === 'vlinder') { it.x = it.ax + Math.sin(it.f / 23) * 28 + Math.sin(it.f / 7) * 6; it.y = it.ay + Math.cos(it.f / 17) * 16 - 12; }
      else if (it.soort === 'blad') { if (it.f % 240 === 0) { it.x = it.bx; it.y = it.by; } it.y += 0.5; it.x += Math.sin(it.f / 11) * 1; }
      else if (it.soort === 'eend') { it.x += it.d * 0.3; const tx = Math.floor((it.x + 4) / T), ty = Math.floor(it.y / T); if (!MAP[ty] || MAP[ty][tx] !== 'W' || (it.d > 0 && MAP[ty][tx + 1] !== 'W') || (it.d < 0 && MAP[ty][tx - 1] !== 'W')) it.d = -it.d; }
      else if (it.soort === 'kip' || it.soort === 'geit' || it.soort === 'schaap') {
        if (it.wacht > 0) { it.wacht--; }
        else { if (it.f % 60 === 0) { it.vx = (Math.random() - 0.5) * (it.soort === 'kip' ? 0.8 : 0.4); it.vy = (Math.random() - 0.5) * 0.3; if (Math.random() < 0.4) it.wacht = rnd(40, 160); } it.x += it.vx; it.y += it.vy; if (it.vx) it.d = it.vx > 0 ? 1 : -1; }
        if (it.x < it.grens.x0) { it.x = it.grens.x0; it.vx = Math.abs(it.vx); } if (it.x > it.grens.x1) { it.x = it.grens.x1; it.vx = -Math.abs(it.vx); } if (it.y < it.grens.y0) { it.y = it.grens.y0; it.vy = Math.abs(it.vy); } if (it.y > it.grens.y1) { it.y = it.grens.y1; it.vy = -Math.abs(it.vy); }
      }
      else if (it.soort === 'spuit') { const p = (it.f % 70) / 70; it.x = it.bx + (it.k - 4.5) * 2.2 * p; it.y = it.by - 28 * Math.sin(p * Math.PI) + p * 6; }
      else if (it.soort === 'mist') { it.x += 0.25; if (it.x > it.ax + 7 * T) it.x = it.ax - it.w * 2; }
      else if (it.soort === 'stof') { it.x += 1.2 + Math.sin(it.f / 9) * 0.6; it.y += Math.sin(it.f / 5) * 0.4; if (it.x > it.bx + 5 * T) it.x = it.bx - 16; }
      else if (it.soort === 'auto') { if (it.as === 'h') { it.x += it.d * it.snel * 2; if (it.x > MW * T + 20) it.x = -20; if (it.x < -20) it.x = MW * T + 20; } else { it.y += it.d * it.snel * 2; if (it.y > MH * T + 20) it.y = -20; if (it.y < -20) it.y = MH * T + 20; } }
    }
  }
  function teken(c, camX, camY, t, laag) {
    if (!klaar) return;
    const zicht = (x, y) => x > camX - 40 && x < camX + c.canvas.width + 40 && y > camY - 40 && y < camY + c.canvas.height + 40;
    for (const it of items) {
      if (!zicht(it.x, it.y)) continue;
      c.save(); c.translate(it.x - camX, it.y - camY); c.scale(2, 2);
      const sx = 0, sy = 0;
      if (laag === 'onder') {
        if (it.soort === 'kip') { const pik = Math.floor(it.f / 12) % 4 === 0 && it.wacht > 0; R(c, sx + 1, sy + 2, 5, 4, it.k ? '#8a5a2b' : '#f4f4f4'); R(c, sx + (it.d > 0 ? 5 : 0), sy + (pik ? 3 : 1), 2, 2, '#f4f4f4'); R(c, sx + (it.d > 0 ? 7 : -1), sy + (pik ? 4 : 2), 1, 1, '#e0a84a'); R(c, sx + (it.d > 0 ? 5 : 1), sy + (pik ? 2 : 0), 1, 1, '#d65a4a'); R(c, sx + 2, sy + 6, 1, 2, '#e0a84a'); R(c, sx + 4, sy + 6, 1, 2, '#e0a84a'); if (it.wacht === 0 && Math.floor(it.f / 8) % 2) { R(c, sx + 2, sy + 6, 1, 1, '#8fb86a'); } }
        else if (it.soort === 'geit') { R(c, sx, sy + 2, 10, 5, '#d9d2c5'); R(c, sx + (it.d > 0 ? 8 : -2), sy, 4, 4, '#d9d2c5'); R(c, sx + (it.d > 0 ? 10 : -2), sy - 2, 1, 2, '#8a6a3f'); R(c, sx + (it.d > 0 ? 9 : -1), sy - 1, 1, 1, '#8a6a3f'); R(c, sx + (it.d > 0 ? 9 : -1), sy + 1, 1, 1, '#1a1f1c'); R(c, sx + 1, sy + 7, 1, 3, '#8a6a3f'); R(c, sx + 4, sy + 7, 1, 3, '#8a6a3f'); R(c, sx + 7, sy + 7, 1, 3, '#8a6a3f'); R(c, sx + (it.d > 0 ? -1 : 10), sy + 2, 1, 2, '#d9d2c5'); }
        else if (it.soort === 'schaap') { c.fillStyle = '#f4f4f4'; c.beginPath(); c.ellipse(sx + 5, sy + 4, 6, 4, 0, 0, 7); c.fill(); R(c, sx + (it.d > 0 ? 9 : -2), sy + 2, 3, 4, '#2a2d35'); R(c, sx + (it.d > 0 ? 10 : -1), sy + 3, 1, 1, '#f4f4f4'); R(c, sx + 2, sy + 7, 1, 3, '#2a2d35'); R(c, sx + 7, sy + 7, 1, 3, '#2a2d35'); R(c, sx + 2, sy + 1, 2, 1, '#e3e3e3'); }
        else if (it.soort === 'eend') { R(c, sx, sy + 1, 7, 4, '#5a4632'); R(c, sx + (it.d > 0 ? 5 : -1), sy - 2, 3, 4, '#2f6b2e'); R(c, sx + (it.d > 0 ? 7 : -2), sy - 1, 2, 1, '#e0a84a'); R(c, sx + 1, sy + 5, 5, 1, 'rgba(255,255,255,.35)'); }
        else if (it.soort === 'kip' || it.soort === 'geit' || it.soort === 'schaap') {
        if (it.wacht > 0) { it.wacht--; }
        else { if (it.f % 60 === 0) { it.vx = (Math.random() - 0.5) * (it.soort === 'kip' ? 0.8 : 0.4); it.vy = (Math.random() - 0.5) * 0.3; if (Math.random() < 0.4) it.wacht = rnd(40, 160); } it.x += it.vx; it.y += it.vy; if (it.vx) it.d = it.vx > 0 ? 1 : -1; }
        if (it.x < it.grens.x0) { it.x = it.grens.x0; it.vx = Math.abs(it.vx); } if (it.x > it.grens.x1) { it.x = it.grens.x1; it.vx = -Math.abs(it.vx); } if (it.y < it.grens.y0) { it.y = it.grens.y0; it.vy = Math.abs(it.vy); } if (it.y > it.grens.y1) { it.y = it.grens.y1; it.vy = -Math.abs(it.vy); }
      }
      else if (it.soort === 'spuit') { const p = (it.f % 70) / 70; it.x = it.bx + (it.k - 4.5) * 2.2 * p; it.y = it.by - 28 * Math.sin(p * Math.PI) + p * 6; }
      else if (it.soort === 'mist') { it.x += 0.12; if (it.x > it.ax + 7 * T) it.x = it.ax - it.w; }
      else if (it.soort === 'stof') { it.x += 0.6 + Math.sin(it.f / 9) * 0.3; it.y += Math.sin(it.f / 5) * 0.2; if (it.x > it.bx + 5 * T) it.x = it.bx - 8; }
      else if (it.soort === 'auto') { if (it.as === 'h') { R(c, sx, sy, 14, 7, it.kleur); R(c, sx + 3, sy + 1, 3, 2, '#9fd0ff'); R(c, sx + 8, sy + 1, 3, 2, '#9fd0ff'); R(c, sx + 1, sy + 6, 3, 2, '#1a1f1c'); R(c, sx + 10, sy + 6, 3, 2, '#1a1f1c'); } else { R(c, sx, sy, 7, 14, it.kleur); R(c, sx + 1, sy + 3, 2, 3, '#9fd0ff'); R(c, sx + 1, sy + 8, 2, 3, '#9fd0ff'); R(c, sx + 6, sy + 1, 2, 3, '#1a1f1c'); R(c, sx + 6, sy + 10, 2, 3, '#1a1f1c'); } }
      } else {
        if (it.soort === 'spuit') { const p = (it.f % 70) / 70; c.fillStyle = 'rgba(220,240,255,' + (0.9 - p * 0.6) + ')'; c.fillRect(sx, sy, 2, 2); c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(sx, sy - 1, 1, 1); }
        else if (it.soort === 'vlinder') { const open = Math.floor(it.f / 6) % 2; R(c, sx - 2, sy, open ? 2 : 1, 2, it.kleur); R(c, sx + 1, sy, open ? 2 : 1, 2, it.kleur); R(c, sx, sy, 1, 3, '#1a1f1c'); }
        else if (it.soort === 'blad') { const w = Math.floor(it.f / 7) % 2; R(c, sx, sy, w ? 3 : 2, 1, it.kleur || '#c9843a'); R(c, sx + 1, sy + 1, 1, 1, '#a9632a'); }
        else if (it.soort === 'kip' || it.soort === 'geit' || it.soort === 'schaap') {
        if (it.wacht > 0) { it.wacht--; }
        else { if (it.f % 60 === 0) { it.vx = (Math.random() - 0.5) * (it.soort === 'kip' ? 0.8 : 0.4); it.vy = (Math.random() - 0.5) * 0.3; if (Math.random() < 0.4) it.wacht = rnd(40, 160); } it.x += it.vx; it.y += it.vy; if (it.vx) it.d = it.vx > 0 ? 1 : -1; }
        if (it.x < it.grens.x0) { it.x = it.grens.x0; it.vx = Math.abs(it.vx); } if (it.x > it.grens.x1) { it.x = it.grens.x1; it.vx = -Math.abs(it.vx); } if (it.y < it.grens.y0) { it.y = it.grens.y0; it.vy = Math.abs(it.vy); } if (it.y > it.grens.y1) { it.y = it.grens.y1; it.vy = -Math.abs(it.vy); }
      }
      else if (it.soort === 'spuit') { const p = (it.f % 70) / 70; it.x = it.bx + (it.k - 4.5) * 2.2 * p; it.y = it.by - 28 * Math.sin(p * Math.PI) + p * 6; }
      else if (it.soort === 'mist') { c.fillStyle = 'rgba(235,240,245,' + (0.12 + Math.sin(it.f / 40) * 0.05) + ')'; c.beginPath(); c.ellipse(sx, sy, it.w, 5, 0, 0, 7); c.fill(); }
        else if (it.soort === 'stof') { R(c, sx, sy, 2, 1, 'rgba(224,207,160,.8)'); R(c, sx - 3, sy + 1, 2, 1, 'rgba(224,207,160,.5)'); }
        else if (it.soort === 'rook') { for (let i = 0; i < 4; i++) { const p = ((it.f + i * 15) % 60) / 60; c.fillStyle = 'rgba(230,230,230,' + (0.5 - p * 0.5) + ')'; c.beginPath(); c.arc(sx + Math.sin((it.f + i * 15) / 9) * 3 + p * 4, sy - p * 18, 1.5 + p * 3, 0, 7); c.fill(); } }
      }
      c.restore();
    }
    if (laag === 'boven') for (const v of vogels) { if (!zicht(v.x, v.y)) continue; c.save(); c.translate(v.x - camX, v.y - camY); c.scale(2, 2); const w = Math.floor(v.f / 8) % 2; for (let i = 0; i < v.n; i++) { const ox = i * 9, oy = (i % 2) * 4; R(c, ox, oy + (w ? 1 : 0), 2, 1, '#1a1f1c'); R(c, ox + 2, oy + (w ? 0 : 1), 2, 1, '#1a1f1c'); R(c, ox + 4, oy + (w ? 1 : 0), 2, 1, '#1a1f1c'); c.fillStyle = 'rgba(20,40,20,.15)'; c.fillRect(ox, oy + 24, 6, 2); } c.restore(); }
  }
  return { init, update, teken };
})();
