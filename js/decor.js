// Bewegende decoratie buiten: vlinders, vogels, blaadjes, eenden, auto's, rook. Alleen tekenen; geen spelregels.
const WQDecor = (() => {
  'use strict';
  const T = 16;
  let C, MAP, MW, MH, items = [], vogels = [], klaar = false;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const R = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); };
  const tegels = ch => { const out = []; for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (MAP[y][x] === ch) out.push([x, y]); return out; };

  function init(content) {
    C = content; MAP = C.tilemap; MW = MAP[0].length; MH = MAP.length; items = []; vogels = [];
    // vlinders bij bloemperken
    C.props.filter(p => p.type === 'bloemen').forEach((p, i) => { if (i % 2) return; items.push({ soort: 'vlinder', x: p.tegel[0] * T + 8, y: p.tegel[1] * T + 4, ax: p.tegel[0] * T + 8, ay: p.tegel[1] * T + 4, f: rnd(0, 100), kleur: i % 4 ? '#f6d44c' : '#f2f2f2' }); });
    // blaadjes bij bomen (klein aantal)
    tegels('T').filter((t, i) => i % 23 === 0).forEach(([x, y]) => items.push({ soort: 'blad', x: x * T + 8, y: y * T + 4, bx: x * T + 8, by: y * T + 4, f: rnd(0, 200) }));
    // eenden op het water
    const water = tegels('W').filter(([x, y]) => y > 0 && MAP[y - 1][x] === 'W' && MAP[y + 1] && MAP[y + 1][x] === 'W');
    for (let i = 0; i < 6 && water.length; i++) { const [x, y] = water[Math.floor(rnd(0, water.length))]; items.push({ soort: 'eend', x: x * T + 4, y: y * T + 6, d: Math.random() < 0.5 ? 1 : -1, f: rnd(0, 100) }); }
    // auto's op de Kanaalweg en de Kennemerstraatweg
    items.push({ soort: 'auto', x: 0, y: 0 * T + 2, d: 1, as: 'h', snel: 0.9, kleur: '#c9403a' });
    items.push({ soort: 'auto', x: MW * T, y: 0 * T + 7, d: -1, as: 'h', snel: 0.7, kleur: '#e8e8e8' });
    items.push({ soort: 'auto', x: 1 * T + 2, y: MH * T, d: -1, as: 'v', snel: 0.6, kleur: '#3b5fa8' });
    items.push({ soort: 'auto', x: 63 * T + 7, y: 0, d: 1, as: 'v', snel: 0.5, kleur: '#55585e' });
    // rook uit schoorstenen (vaste plekken)
    [[9, 18], [23, 27], [36, 13]].forEach(([x, y]) => items.push({ soort: 'rook', x: x * T + 12, y: y * T - 4, f: rnd(0, 60) }));
    klaar = true;
  }
  function vogel(t) {
    if (t % 420 === 0) { const y = rnd(2, MH - 4) * T; vogels.push({ x: -20, y, vy: rnd(-0.2, 0.2), f: 0, n: 3 }); }
    vogels = vogels.filter(v => v.x < MW * T + 40);
  }
  function update(t) {
    if (!klaar) return;
    vogel(t);
    for (const v of vogels) { v.x += 1.3; v.y += v.vy; v.f++; }
    for (const it of items) {
      it.f = (it.f || 0) + 1;
      if (it.soort === 'vlinder') { it.x = it.ax + Math.sin(it.f / 23) * 14 + Math.sin(it.f / 7) * 3; it.y = it.ay + Math.cos(it.f / 17) * 8 - 6; }
      else if (it.soort === 'blad') { if (it.f % 240 === 0) { it.x = it.bx; it.y = it.by; } it.y += 0.25; it.x += Math.sin(it.f / 11) * 0.5; }
      else if (it.soort === 'eend') { it.x += it.d * 0.15; const tx = Math.floor((it.x + 4) / T), ty = Math.floor(it.y / T); if (!MAP[ty] || MAP[ty][tx] !== 'W' || (it.d > 0 && MAP[ty][tx + 1] !== 'W') || (it.d < 0 && MAP[ty][tx - 1] !== 'W')) it.d = -it.d; }
      else if (it.soort === 'auto') { if (it.as === 'h') { it.x += it.d * it.snel; if (it.x > MW * T + 20) it.x = -20; if (it.x < -20) it.x = MW * T + 20; } else { it.y += it.d * it.snel; if (it.y > MH * T + 20) it.y = -20; if (it.y < -20) it.y = MH * T + 20; } }
    }
  }
  function teken(c, camX, camY, t, laag) {
    if (!klaar) return;
    const zicht = (x, y) => x > camX - 40 && x < camX + c.canvas.width + 40 && y > camY - 40 && y < camY + c.canvas.height + 40;
    for (const it of items) {
      if (!zicht(it.x, it.y)) continue;
      const sx = it.x - camX, sy = it.y - camY;
      if (laag === 'onder') {
        if (it.soort === 'eend') { R(c, sx, sy + 1, 7, 4, '#5a4632'); R(c, sx + (it.d > 0 ? 5 : -1), sy - 2, 3, 4, '#2f6b2e'); R(c, sx + (it.d > 0 ? 7 : -2), sy - 1, 2, 1, '#e0a84a'); R(c, sx + 1, sy + 5, 5, 1, 'rgba(255,255,255,.35)'); }
        else if (it.soort === 'auto') { if (it.as === 'h') { R(c, sx, sy, 14, 7, it.kleur); R(c, sx + 3, sy + 1, 3, 2, '#9fd0ff'); R(c, sx + 8, sy + 1, 3, 2, '#9fd0ff'); R(c, sx + 1, sy + 6, 3, 2, '#1a1f1c'); R(c, sx + 10, sy + 6, 3, 2, '#1a1f1c'); } else { R(c, sx, sy, 7, 14, it.kleur); R(c, sx + 1, sy + 3, 2, 3, '#9fd0ff'); R(c, sx + 1, sy + 8, 2, 3, '#9fd0ff'); R(c, sx + 6, sy + 1, 2, 3, '#1a1f1c'); R(c, sx + 6, sy + 10, 2, 3, '#1a1f1c'); } }
      } else {
        if (it.soort === 'vlinder') { const open = Math.floor(it.f / 6) % 2; R(c, sx - 2, sy, open ? 2 : 1, 2, it.kleur); R(c, sx + 1, sy, open ? 2 : 1, 2, it.kleur); R(c, sx, sy, 1, 3, '#1a1f1c'); }
        else if (it.soort === 'blad') { R(c, sx, sy, 2, 1, '#c9843a'); R(c, sx + 1, sy + 1, 1, 1, '#a9632a'); }
        else if (it.soort === 'rook') { for (let i = 0; i < 4; i++) { const p = ((it.f + i * 15) % 60) / 60; c.fillStyle = 'rgba(230,230,230,' + (0.5 - p * 0.5) + ')'; c.beginPath(); c.arc(sx + Math.sin((it.f + i * 15) / 9) * 3 + p * 4, sy - p * 18, 1.5 + p * 3, 0, 7); c.fill(); } }
      }
    }
    if (laag === 'boven') for (const v of vogels) { const sx = v.x - camX, sy = v.y - camY; if (!zicht(v.x, v.y)) continue; const w = Math.floor(v.f / 8) % 2; for (let i = 0; i < v.n; i++) { const ox = i * 9, oy = (i % 2) * 4; R(c, sx + ox, sy + oy + (w ? 1 : 0), 2, 1, '#1a1f1c'); R(c, sx + ox + 2, sy + oy + (w ? 0 : 1), 2, 1, '#1a1f1c'); R(c, sx + ox + 4, sy + oy + (w ? 1 : 0), 2, 1, '#1a1f1c'); c.fillStyle = 'rgba(20,40,20,.15)'; c.fillRect(sx + ox, sy + oy + 24, 6, 2); } }
  }
  return { init, update, teken };
})();
