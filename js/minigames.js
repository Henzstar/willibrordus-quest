// Vier minigames op het kaartcanvas (tijdelijk op dubbele resolutie): noodkoffer, dicteer, bowlen, boogschieten.
const WQMinigames = (() => {
  'use strict';
  let C, cv, ctx, actief = null, klaar = null, raf = 0, oud = null, W = 0, H = 0, tijd = 0;
  const F = px => px + 'px "Press Start 2P", monospace', FB = px => 'bold ' + px + 'px -apple-system, Segoe UI, Roboto, sans-serif';
  const R = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); };
  function tekst(t, x, y, font, col, align) { ctx.font = font; ctx.fillStyle = col || '#eef3ee'; ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, x, y); }
  function regels(t, x, y, font, col, maxW, lh) { ctx.font = font; const w = t.split(' '); let r = '', yy = y; for (const woord of w) { const p = r ? r + ' ' + woord : woord; if (ctx.measureText(p).width > maxW && r) { tekst(r, x, yy, font, col); r = woord; yy += lh; } else r = p; } tekst(r, x, yy, font, col); return yy; }
  function kop(titel, sub) { R(0, 0, W, H, '#15201a'); R(0, 0, W, 22, '#1d6b4f'); tekst(titel, W / 2, 11, F(9), '#fff'); if (sub) tekst(sub, W / 2, H - 10, F(6), '#9fb3a6'); }
  const vul = (t, d) => t.replace(/\{(\w+)\}/g, (m, k) => d[k] != null ? d[k] : m);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function pos(ev) { const r = cv.getBoundingClientRect(); return [(ev.clientX - r.left) * W / r.width, (ev.clientY - r.top) * H / r.height]; }

  // ---------- noodkoffer: Simon-says ----------
  function noodkoffer() {
    const g = C.minigames.noodkoffer, pads = g.stappen.map((s, i) => ({ s, x: (i % 2) * (W / 2) + 6, y: 30 + Math.floor(i / 2) * ((H - 60) / 2), w: W / 2 - 12, h: (H - 60) / 2 - 6, kleur: ['#2b6cb0', '#b5443a', '#e0a84a', '#2f7d32'][i] }));
    let reeks = [], ronde = 0, invoer = 0, fouten = 0, fase = 'toon', toonI = 0, licht = -1, timer = 0, punten = 0;
    const nieuweRonde = () => { ronde++; reeks.push(Math.floor(Math.random() * 4)); if (reeks.length < 2) reeks.push(Math.floor(Math.random() * 4)); fase = 'toon'; toonI = 0; timer = 30; invoer = 0; };
    nieuweRonde();
    return {
      down(x, y) {
        if (fase !== 'invoer') return;
        const i = pads.findIndex(p => x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h); if (i < 0) return;
        licht = i; timer = 10;
        if (i === reeks[invoer]) { invoer++; if (invoer === reeks.length) { punten += g.puntenPerRonde; if (ronde >= g.rondes) return eind({ punten, tekst: vul(g.klaar, { n: ronde }) }); fase = 'pauze'; timer = 40; } }
        else { fouten++; fase = fouten >= 2 ? 'einde' : 'fout'; timer = 50; }
      },
      tick() {
        timer--;
        if (fase === 'toon' && timer <= 0) { if (toonI < reeks.length) { licht = reeks[toonI]; toonI++; timer = 28; } else { licht = -1; fase = 'invoer'; } }
        if (fase === 'toon' && timer === 10) licht = -1;
        if (fase === 'invoer' && timer <= 0) licht = -1;
        if (fase === 'pauze' && timer <= 0) nieuweRonde();
        if (fase === 'fout' && timer <= 0) { fase = 'toon'; toonI = 0; timer = 30; invoer = 0; licht = -1; }
        if (fase === 'einde' && timer <= 0) eind({ punten, tekst: vul(g.klaar, { n: ronde - 1 }) });
      },
      draw() {
        kop(g.titel + ' · ronde ' + ronde + '/' + g.rondes, fase === 'toon' ? 'Kijk...' : fase === 'invoer' ? 'Tik de volgorde na (' + invoer + '/' + reeks.length + ')' : fase === 'fout' ? 'Fout! Nog ' + (2 - fouten) + ' kans' : fase === 'einde' ? 'De nacht is om' : 'Goed!');
        pads.forEach((p, i) => { R(p.x, p.y, p.w, p.h, licht === i ? '#fff' : p.kleur); R(p.x, p.y + p.h - 3, p.w, 3, 'rgba(0,0,0,.3)'); tekst(p.s, p.x + p.w / 2, p.y + p.h / 2, F(7), licht === i ? p.kleur : '#fff'); });
        tekst(punten + ' pt', W - 6, 11, F(7), '#fff', 'right');
      },
    };
  }

  // ---------- dicteer: tik het foute woord ----------
  function dicteer() {
    const g = C.minigames.dicteer, zinnen = g.zinnen.map(z => ({ gesproken: z.gesproken, woorden: z.woorden.map(w => [w[0], w[1]]) }));
    let zi = 0, wi = -1, timer = 20, punten = 0, hits = 0, missers = 0, flits = 0, getikt = false, totaal = zinnen.flatMap(z => z.woorden).filter(w => !w[1]).length;
    const tempo = Math.round(g.tempo / 16.7);
    return {
      down() {
        if (wi < 0 || getikt || zi >= zinnen.length) return;
        getikt = true; const w = zinnen[zi].woorden[wi];
        if (!w[1]) { hits++; punten += g.hit; w[2] = 'goed'; flits = 8; } else { missers++; punten = Math.max(0, punten - g.mis); w[2] = 'mis'; flits = -8; }
      },
      tick() {
        if (zi >= zinnen.length) return;
        timer--;
        if (timer <= 0) { wi++; getikt = false; timer = tempo; if (wi >= zinnen[zi].woorden.length) { zi++; wi = -1; timer = 50; if (zi >= zinnen.length) setTimeout(() => eind({ punten: clamp(punten, 0, 60), tekst: vul(g.klaar, { hits, totaal, missers }) }), 600); } }
        if (flits > 0) flits--; if (flits < 0) flits++;
      },
      draw() {
        kop(g.titel + ' · zin ' + Math.min(zi + 1, zinnen.length) + '/' + zinnen.length, 'Tik als het woord niet klopt');
        if (flits) R(0, 22, W, H - 22, flits > 0 ? 'rgba(123,182,97,.25)' : 'rgba(214,90,74,.3)');
        if (zi >= zinnen.length) return;
        tekst('GEZEGD', W / 2, 34, F(6), '#9fb3a6');
        regels(zinnen[zi].gesproken, W / 2, 48, FB(11), '#eef3ee', W - 16, 13);
        tekst('AI-SAMENVATTING', W / 2, 92, F(6), '#9fb3a6');
        const ws = zinnen[zi].woorden.slice(0, wi + 1); ctx.font = FB(12);
        let x = 10, y = 108; ws.forEach((w, i) => { const tw = ctx.measureText(w[0]).width + 8; if (x + tw > W - 6) { x = 10; y += 18; } const col = w[2] === 'goed' ? '#7bb661' : w[2] === 'mis' ? '#d65a4a' : i === wi ? '#fff7cc' : '#27382f'; R(x - 3, y - 8, tw, 16, col); tekst(w[0], x + tw / 2 - 3, y, FB(12), i === wi || w[2] ? '#1a1f1c' : '#9fb3a6'); x += tw + 2; });
        tekst(punten + ' pt', W - 6, 11, F(7), '#fff', 'right');
      },
    };
  }

  // ---------- bowlen ----------
  function bowlen() {
    const g = C.minigames.bowlen, laanX = 24, laanW = W - 48, baseY = H - 26;
    let worp = 0, fase = 'richting', richting = 0, kracht = 0, osc = 0, bal = null, omver = 0, kegels = [], meld = '', timer = 0, punten = 0;
    const zet = () => { kegels = []; const rijen = [[0], [-1, 1], [-2, 0, 2]]; let n = 0; rijen.forEach((rij, r) => rij.forEach(off => { if (n < 6) kegels.push({ x: W / 2 + off * 11, y: 60 - r * 14, om: false, naam: g.kegels[n++] }); })); };
    zet();
    const eindWorp = () => { timer = 70; fase = 'wacht'; omver += kegels.filter(k => k.om).length; };
    return {
      down() {
        if (fase === 'richting') { richting = Math.sin(osc / 18) * (laanW / 2 - 8); fase = 'kracht'; osc = 0; }
        else if (fase === 'kracht') { kracht = (Math.sin(osc / 14) + 1) / 2; fase = 'rol'; bal = { x: W / 2 + richting, y: baseY, vy: -(1.6 + kracht * 2.6), vx: (Math.abs(kracht - 0.75) > 0.2 ? (richting > 0 ? -1 : 1) * 0.35 : 0) }; }
      },
      tick() {
        osc++;
        if (fase === 'rol' && bal) {
          bal.x += bal.vx; bal.y += bal.vy; bal.vy *= 0.995;
          for (const k of kegels) if (!k.om && Math.hypot(k.x - bal.x, k.y - bal.y) < 9) { k.om = true; meld = k.naam; timer = 40; bal.vx += (bal.x - k.x) * 0.05; for (const b of kegels) if (!b.om && Math.hypot(b.x - k.x, b.y - k.y) < 16 && Math.random() < 0.45 + kracht * 0.4) b.om = true; }
          if (bal.y < 30 || bal.x < laanX || bal.x > laanX + laanW || Math.abs(bal.vy) < 0.3) eindWorp();
        }
        if (meld && --timer <= 0) meld = '';
        if (fase === 'wacht' && --timer <= 0) { worp++; punten = omver * g.puntenPerKegel; if (worp >= g.worpen) return eind({ punten, tekst: vul(g.klaar, { kegels: omver }) }); zet(); fase = 'richting'; osc = 0; bal = null; }
      },
      draw() {
        kop(g.titel + ' · worp ' + Math.min(worp + 1, g.worpen) + '/' + g.worpen, fase === 'richting' ? 'Tik: richting' : fase === 'kracht' ? 'Tik: kracht' : meld || '');
        R(laanX, 26, laanW, H - 46, '#c8a06c'); for (let i = 0; i < laanW; i += 10) R(laanX + i, 26, 1, H - 46, '#b08a58'); R(laanX - 6, 26, 6, H - 46, '#3b3f4a'); R(laanX + laanW, 26, 6, H - 46, '#3b3f4a');
        kegels.forEach(k => { if (k.om) { R(k.x - 6, k.y + 2, 12, 4, '#9fb3a6'); return; } R(k.x - 3, k.y - 8, 6, 16, '#fff'); R(k.x - 3, k.y - 4, 6, 2, '#d65a4a'); R(k.x - 2, k.y - 10, 4, 3, '#fff'); });
        if (fase === 'richting') { const mx = W / 2 + Math.sin(osc / 18) * (laanW / 2 - 8); R(mx - 2, baseY - 10, 4, 20, '#fff7cc'); }
        if (fase === 'kracht') { const k = (Math.sin(osc / 14) + 1) / 2; R(laanX, H - 16, laanW, 8, '#0f1813'); R(laanX, H - 16, laanW * k, 8, k > 0.55 && k < 0.95 ? '#7bb661' : '#e0a84a'); R(laanX + laanW * 0.55, H - 18, 1, 12, '#fff'); R(laanX + laanW * 0.95, H - 18, 1, 12, '#fff'); }
        if (bal) { ctx.fillStyle = '#1a1f1c'; ctx.beginPath(); ctx.arc(bal.x, bal.y, 6, 0, 7); ctx.fill(); ctx.fillStyle = '#2b6cb0'; ctx.beginPath(); ctx.arc(bal.x - 1, bal.y - 1, 4, 0, 7); ctx.fill(); }
        else if (fase !== 'wacht') { ctx.fillStyle = '#2b6cb0'; ctx.beginPath(); ctx.arc(W / 2 + (fase === 'kracht' ? richting : 0), baseY, 6, 0, 7); ctx.fill(); }
        tekst((omver + (fase === 'rol' ? kegels.filter(k => k.om).length : 0)) * g.puntenPerKegel + ' pt', W - 6, 11, F(7), '#fff', 'right');
      },
    };
  }

  // ---------- boogschieten ----------
  function boogschieten() {
    const g = C.minigames.boogschieten, cx = W / 2, cy = H / 2 + 8, rad = Math.min(W, H) / 2 - 30;
    let pijl = 0, vast = false, span = 0, t = 0, kruis = [cx, cy], raken = [], punten = 0, timer = 0, bericht = '';
    const ringen = g.ringen.length;
    return {
      down() { if (pijl < g.pijlen && !vast && !timer) { vast = true; span = 0; } },
      up() {
        if (!vast) return; vast = false;
        const afw = 3 + (vast ? 0 : 0) + Math.random() * 6, hoek = Math.random() * 7; kruis = [kruis[0] + Math.cos(hoek) * afw, kruis[1] + Math.sin(hoek) * afw];
        const d = Math.hypot(kruis[0] - cx, kruis[1] - cy), ring = Math.min(ringen - 1, Math.floor(d / (rad / (ringen - 1))));
        const p = g.ringen[ring] || 0; punten += p; raken.push([kruis[0], kruis[1]]); pijl++; bericht = p ? '+' + p : 'mis'; timer = 50;
        if (pijl >= g.pijlen) setTimeout(() => eind({ punten, tekst: vul(g.klaar, { punten }) }), 900);
      },
      tick() {
        t++; if (timer > 0) timer--;
        const amp = vast ? Math.max(7, 26 - span * 0.3) + Math.max(0, span - 90) * 0.5 : 26; if (vast) span++;
        kruis = [cx + Math.sin(t / 9) * amp + Math.sin(t / 3.7) * amp * 0.3, cy + Math.cos(t / 7) * amp + Math.cos(t / 4.3) * amp * 0.3];
      },
      draw() {
        kop(g.titel + ' · pijl ' + Math.min(pijl + 1, g.pijlen) + '/' + g.pijlen, vast ? 'Loslaten om te schieten' : 'Houd vast om te spannen');
        const kleuren = ['#fff7cc', '#d65a4a', '#2b6cb0', '#1a1f1c', '#fff'];
        for (let i = ringen - 1; i >= 0; i--) { ctx.fillStyle = kleuren[(ringen - 1 - i) % kleuren.length]; ctx.beginPath(); ctx.arc(cx, cy, rad * (i + 1) / ringen, 0, 7); ctx.fill(); }
        ctx.fillStyle = '#e0a84a'; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, 7); ctx.fill();
        tekst('Zweden', cx, cy - rad - 6, F(6), '#9fb3a6'); tekst('onze populatie', cx, cy + rad + 8, F(6), '#9fb3a6');
        raken.forEach(([x, y]) => { R(x - 1, y - 1, 3, 3, '#1a1f1c'); R(x, y - 6, 1, 6, '#8a5a2b'); R(x - 1, y - 8, 3, 2, '#d65a4a'); });
        const [kx, ky] = kruis; ctx.strokeStyle = vast ? '#7bb661' : '#fff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(kx, ky, 6, 0, 7); ctx.stroke(); R(kx - 9, ky, 18, 1, ctx.strokeStyle); R(kx, ky - 9, 1, 18, ctx.strokeStyle);
        if (vast) { R(10, H - 16, 40, 6, '#0f1813'); R(10, H - 16, Math.min(40, span / 90 * 40), 6, span > 90 ? '#d65a4a' : '#7bb661'); }
        if (timer && bericht) tekst(bericht, cx, 34, F(10), '#fff');
        tekst(punten + ' pt', W - 6, 11, F(7), '#fff', 'right');
      },
    };
  }

  const GAMES = { noodkoffer, dicteer, bowlen, boogschieten };
  function onDown(ev) { ev.preventDefault(); const [x, y] = pos(ev); actief && actief.down && actief.down(x, y); }
  function onUp(ev) { ev.preventDefault(); actief && actief.up && actief.up(); }
  function onKey(ev) { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); if (ev.type === 'keydown' && !ev.repeat) actief && actief.down && actief.down(W / 2, H / 2); if (ev.type === 'keyup') actief && actief.up && actief.up(); } }
  function loop() { if (!actief) return; tijd++; actief.tick(); if (!actief) return; actief.draw(); raf = requestAnimationFrame(loop); }
  function eind(res) {
    if (!actief) return; actief = null; cancelAnimationFrame(raf);
    cv.removeEventListener('pointerdown', onDown); cv.removeEventListener('pointerup', onUp); cv.removeEventListener('pointercancel', onUp); document.removeEventListener('keydown', onKey); document.removeEventListener('keyup', onKey);
    cv.width = oud[0]; cv.height = oud[1]; ctx.imageSmoothingEnabled = false;
    const k = klaar; klaar = null; setTimeout(() => k(res), 0);
  }
  function start(id, canvas, cb) {
    cv = canvas; ctx = cv.getContext('2d'); klaar = cb; oud = [cv.width, cv.height]; cv.width = oud[0] * 2; cv.height = oud[1] * 2; W = cv.width; H = cv.height; ctx.imageSmoothingEnabled = false; tijd = 0;
    cv.addEventListener('pointerdown', onDown); cv.addEventListener('pointerup', onUp); cv.addEventListener('pointercancel', onUp); document.addEventListener('keydown', onKey); document.addEventListener('keyup', onKey);
    actief = GAMES[id](); loop();
  }
  return { init: c => { C = c; }, start, bezig: () => !!actief };
})();
