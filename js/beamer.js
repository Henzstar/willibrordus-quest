// Live bord: kaart met teams, ranglijst, keuzes per dilemma, discussie en plenaire agenda. Leest Firebase via EventSource, terugval polling.
(() => {
  'use strict';
  const C = CONTENT, $ = id => document.getElementById(id), q = new URLSearchParams(location.search);
  const eventId = q.get('event') || CONFIG.eventId, baseUrl = (q.get('db') || CONFIG.firebaseUrl || '').replace(/\/$/, '');
  const LOC = Object.fromEntries(C.locaties.map(l => [l.id, l]));
  const DILEMMA = C.locaties.filter(l => l.soort === 'dilemma'), DISCUSSIE = C.locaties.filter(l => l.soort === 'discussie');
  const ALLE = C.locaties.filter(l => l.soort === 'dilemma' || l.soort === 'discussie').map(l => l.id);
  let spelers = {}, tab = 'kaart', es = null, poll = null, wereld = null;

  // ---------- data ----------
  function tijdbonussen() {
    const klaar = Object.values(spelers).filter(p => p.klaarOp && ALLE.every(id => (p.bezocht || []).includes(id))).sort((a, b) => a.klaarOp - b.klaarOp);
    const uit = {}; klaar.forEach((p, i) => { uit[p.id] = C.score.tijdbonus[i] != null ? C.score.tijdbonus[i] : C.score.tijdbonusRest; }); return uit;
  }
  function ranglijst() {
    const tb = tijdbonussen();
    return Object.values(spelers).map(p => ({ ...p, bonus: tb[p.id] || 0, totaal: (p.punten || 0) + (tb[p.id] || 0), kaarten: (p.bezocht || []).filter(id => LOC[id] && LOC[id].kaart).length }))
      .sort((a, b) => b.totaal - a.totaal || (a.klaarOp || Infinity) - (b.klaarOp || Infinity) || a.naam.localeCompare(b.naam));
  }
  function zet(path, data) {
    const delen = path.split('/').filter(Boolean);
    if (!delen.length) { spelers = {}; if (data && data.players) Object.entries(data.players).forEach(([id, p]) => { spelers[id] = { ...p, id }; }); return; }
    if (delen[0] !== 'players') return;
    const id = delen[1];
    if (delen.length === 2) { if (data) spelers[id] = { ...(spelers[id] || {}), ...data, id }; else delete spelers[id]; return; }
    let o = spelers[id] = spelers[id] || { id, naam: '?' };
    for (let i = 2; i < delen.length - 1; i++) o = o[delen[i]] = o[delen[i]] || {};
    o[delen[delen.length - 1]] = data;
  }
  function verbind() {
    if (!baseUrl || !eventId) { $('status').textContent = 'Geen bord geconfigureerd (js/config.js). De kaart werkt wel.'; return; }
    const url = baseUrl + '/events/' + encodeURIComponent(eventId) + '.json';
    try {
      es = new EventSource(url);
      es.addEventListener('put', e => { const d = JSON.parse(e.data); zet(d.path, d.data); teken(); });
      es.addEventListener('patch', e => { const d = JSON.parse(e.data); Object.entries(d.data || {}).forEach(([k, v]) => zet(d.path.replace(/\/$/, '') + '/' + k, v)); teken(); });
      es.onopen = () => { $('status').textContent = 'Live · ' + eventId; if (poll) { clearInterval(poll); poll = null; } };
      es.onerror = () => { $('status').textContent = 'Verbinding kwijt, polling · ' + eventId; if (!poll) poll = setInterval(haal, 5000); };
    } catch (e) { poll = setInterval(haal, 5000); }
    haal();
    async function haal() { try { const r = await fetch(url); const d = await r.json(); zet('/', d); teken(); } catch (e) { /* stil */ } }
  }

  // ---------- kaart ----------
  function teamSprites() {
    return Object.values(spelers).map(p => {
      const L = LOC[p.locatie]; const tegel = L && L.id !== 'start' ? L.tegel : (p.tegel || C.locaties[0].tegel);
      const av = C.avatars.find(a => a.id === p.avatar) || C.avatars[0];
      return { px: tegel[0] * 16, py: tegel[1] * 16, dir: 'down', frame: 0, look: av, naam: p.naam };
    });
  }
  function tekenLabels() {
    const ov = $('labels'), cv = $('kaart'); ov.width = cv.width; ov.height = cv.height; const c = ov.getContext('2d');
    c.clearRect(0, 0, ov.width, ov.height); c.font = '6px "Press Start 2P", monospace'; c.textAlign = 'center'; c.textBaseline = 'bottom';
    const perTegel = {};
    for (const s of teamSprites()) { const k = s.px + ',' + s.py; perTegel[k] = (perTegel[k] || 0) + 1; const w = c.measureText(s.naam).width + 4; const y = s.py - 10 - (perTegel[k] - 1) * 8; c.fillStyle = 'rgba(15,24,19,.8)'; c.fillRect(s.px + 8 - w / 2, y - 7, w, 8); c.fillStyle = '#fff7cc'; c.fillText(s.naam, s.px + 8, y); }
  }

  // ---------- panelen ----------
  const el = (tag, cls, tekst) => { const e = document.createElement(tag); if (cls) e.className = cls; if (tekst != null) e.textContent = tekst; return e; };
  function tekenRanglijst() {
    const box = $('rang'); box.innerHTML = '';
    const lijst = ranglijst();
    if (!lijst.length) { box.appendChild(el('p', 'note', 'Nog geen teams. Zodra een team start, verschijnt het hier.')); return; }
    lijst.forEach((p, i) => {
      const r = el('div', 'rij' + (p.klaarOp ? ' klaar' : ''));
      r.appendChild(el('b', 'nr', String(i + 1)));
      const av = C.avatars.find(a => a.id === p.avatar) || C.avatars[0]; r.appendChild(WQSprites.avatarCanvas(av, 2));
      const t = el('div', 'tekst'); t.appendChild(el('div', 'naam', p.naam)); t.appendChild(el('div', 'sub', (LOC[p.locatie] ? (LOC[p.locatie].kortenaam || LOC[p.locatie].naam) : 'op het landgoed') + ' · kaarten ' + p.kaarten + '/8' + (p.bonus ? ' · tijdbonus +' + p.bonus : ''))); r.appendChild(t);
      r.appendChild(el('b', 'pt', String(p.totaal))); box.appendChild(r);
    });
  }
  function balkjes(box, titel, items, tot) {
    box.appendChild(el('h3', null, titel));
    items.forEach(([label, n]) => { const r = el('div', 'balk'); const l = el('span', 'label', label); const b = el('span', 'bar'); const i = el('i'); i.style.width = (tot ? Math.round(n / tot * 100) : 0) + '%'; b.appendChild(i); r.appendChild(l); r.appendChild(b); r.appendChild(el('span', 'n', String(n))); box.appendChild(r); });
  }
  function tekenDilemmas() {
    const box = $('paneel'); box.innerHTML = '';
    const ps = Object.values(spelers);
    DILEMMA.forEach(L => { const tel = L.dilemma.opties.map((o, i) => [o.tekst, ps.filter(p => p.keuzes && p.keuzes[L.id] === i).length]); const tot = tel.reduce((a, b) => a + b[1], 0); if (!tot) return; balkjes(box, (L.kortenaam || L.naam) + ': ' + L.dilemma.vraag, tel, tot); });
    if (!box.children.length) box.appendChild(el('p', 'note', 'Nog geen keuzes.'));
  }
  function tekenDiscussie() {
    const box = $('paneel'); box.innerHTML = '';
    const ps = Object.values(spelers);
    DISCUSSIE.forEach(L => { const tel = L.discussie.opties.map((o, i) => [o, ps.filter(p => p.keuzes && p.keuzes[L.id] === i).length]); const tot = tel.reduce((a, b) => a + b[1], 0); if (!tot) return; balkjes(box, (L.kortenaam || L.naam) + ': ' + L.discussie.vraag, tel, tot); const ul = el('ul', 'argumenten'); ps.filter(p => p.argumenten && p.argumenten[L.id]).forEach(p => ul.appendChild(el('li', null, p.naam + ': ' + p.argumenten[L.id]))); box.appendChild(ul); });
    if (!box.children.length) box.appendChild(el('p', 'note', 'Nog geen discussie gevoerd.'));
  }
  function tekenAgenda() {
    const box = $('paneel'); box.innerHTML = '';
    const ps = Object.values(spelers).filter(p => p.agenda && (p.agenda.org || p.agenda.zelf));
    const tel = (f) => { const m = {}; ps.forEach(p => { const k = f(p); if (k) m[k] = (m[k] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]); };
    const org = tel(p => p.agenda.org), eig = tel(p => p.agenda.eigenaar);
    balkjes(box, C.agenda.organisatieVraag, org, org.reduce((a, b) => a + b[1], 0));
    balkjes(box, 'Eigenaar', eig, eig.reduce((a, b) => a + b[1], 0));
    const zc = C.zelfcheck.items.map((t, i) => [t, Object.values(spelers).filter(p => p.zelfcheck && p.zelfcheck[i]).length]);
    balkjes(box, 'Zelfcheck: ' + C.zelfcheck.vraag, zc, Object.values(spelers).length);
    box.appendChild(el('h3', null, 'Wat ik zelf oppak'));
    const ul = el('ul', 'argumenten'); ps.filter(p => p.agenda.zelf).forEach(p => ul.appendChild(el('li', null, p.naam + ': ' + p.agenda.zelf))); box.appendChild(ul);
    box.appendChild(el('h3', null, 'Ergernissen uit de zaal'));
    const ul2 = el('ul', 'argumenten'); Object.values(spelers).filter(p => p.ergernis).forEach(p => ul2.appendChild(el('li', null, p.naam + ': ' + p.ergernis))); box.appendChild(ul2);
    if (!ps.length) box.appendChild(el('p', 'note', 'Nog geen agenda ingevuld.'));
  }
  function teken() {
    tekenRanglijst(); tekenLabels();
    $('kaartvak').hidden = tab !== 'kaart'; $('paneel').hidden = tab === 'kaart';
    if (tab === 'dilemma') tekenDilemmas(); if (tab === 'discussie') tekenDiscussie(); if (tab === 'agenda') tekenAgenda();
    document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('actief', b.dataset.tab === tab));
  }

  // ---------- klok en start ----------
  function klok() {
    const k = $('klok'), minuten = parseInt(q.get('min'), 10), eind = minuten > 0 ? Date.now() + minuten * 60000 : null, pad = n => String(n).padStart(2, '0');
    const tik = () => { if (!eind) { const d = new Date(); k.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()); return; } const rest = Math.max(0, Math.round((eind - Date.now()) / 1000)); k.textContent = pad(Math.floor(rest / 60)) + ':' + pad(rest % 60); k.className = 'klok' + (rest === 0 ? ' om' : rest < 300 ? ' bijna' : ''); };
    tik(); setInterval(tik, 1000);
  }
  function init() {
    $('titel').textContent = C.titel; $('ondertitel').textContent = C.ondertitel;
    $('url').textContent = (q.get('url') || location.href.replace(/beamer\.html.*$/, '')).replace(/^https?:\/\//, '');
    WQWereld.init(C); WQMap.init($('kaart'), { fullMap: true });
    wereld = WQWereld.buitenWereld(() => false, null); const fig = wereld.sprites; wereld.sprites = t => fig(t).concat(teamSprites());
    WQMap.setWereld(wereld, C.locaties[0].tegel[0], C.locaties[0].tegel[1]); WQMap.setHeroVisible(false);
    document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab; teken(); }));
    document.addEventListener('keydown', e => { const m = { 1: 'kaart', 2: 'dilemma', 3: 'discussie', 4: 'agenda' }[e.key]; if (m) { tab = m; teken(); } });
    klok(); verbind(); teken(); setInterval(tekenLabels, 1000);
  }
  document.addEventListener('DOMContentLoaded', init);
})();
