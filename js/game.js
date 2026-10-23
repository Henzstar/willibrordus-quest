// State machine: start → kaart → gebouw → dialoog → keuze → gevolg → kaart-overzicht → zelfcheck → agenda → einde.
(() => {
  'use strict';
  const U = WQUi, M = WQMap, C = CONTENT, X = WQSfx, $ = U.$;
  const OPSLAG = 'wq.save.v1', TOTAAL = C.locaties.length - 1;
  const GEBOUWEN = C.locaties.slice(1);
  let S = null, bezig = false, verderHandler = null, vorigScherm = 's-nav', avatarKeuze = C.avatars[0];

  // ---------- state en opslag ----------
  function nieuweState(naam, modus, avatar) {
    return {
      versie: 1, naam, modus, avatar, regie: C.regieStart, bezocht: [], keuzes: {}, ergernis: '',
      zelfcheck: C.zelfcheck.items.map(() => false), zelfcheckGedaan: false,
      agenda: { zelf: '', zelfKaart: null, org: '', orgIndex: null, eigenaar: C.agenda.eigenaren[0] },
      hero: C.locaties[0].tegel.slice(), fase: 'kaart', playerId: Math.random().toString(36).slice(2, 10), gestart: Date.now(),
    };
  }
  function bewaar() { try { localStorage.setItem(OPSLAG, JSON.stringify(S)); } catch (e) { /* privémodus */ } }
  function laad() { try { const s = JSON.parse(localStorage.getItem(OPSLAG)); return s && s.versie === 1 ? s : null; } catch (e) { return null; } }
  function wis() { try { localStorage.removeItem(OPSLAG); } catch (e) { /* niets */ } }
  const profiel = () => C.profielen.find(p => S.regie >= p.min && S.regie <= p.max) || C.profielen[0];
  const bezocht = id => S.bezocht.includes(id);
  const avatarVan = id => C.avatars.find(a => a.id === id) || C.avatars[0];
  const kaarten = () => S.bezocht.map(id => C.locaties.find(l => l.id === id).kaart);
  function hud() { U.hud(S.naam, S.regie, S.bezocht.length, TOTAAL, profiel().kort); }

  // ---------- start ----------
  function startScherm() {
    U.kaartZichtbaar(false); $('kopregel').hidden = false; U.toon('s-start');
    const opgeslagen = laad();
    $('verderBtn').hidden = !opgeslagen;
    $('startTekst').textContent = C.locaties[0].intro[0];
    U.avatars(C.avatars, av => M.avatarCanvas(av, 3), avatarKeuze.id, av => { avatarKeuze = av; X.tik(); });
  }
  function begin(state, nieuw) {
    S = state; M.setAvatar(avatarVan(S.avatar)); M.setHero(S.hero[0], S.hero[1]);
    $('kopregel').hidden = true; bewaar();
    if (nieuw) { U.kaartZichtbaar(true); hud(); bezig = true; zeg(C.locaties[0].npc, C.locaties[0].intro, naarKaart); }
    else hervat();
  }
  function hervat() {
    if (S.fase === 'zelfcheck') return zelfcheck(() => { S.fase = 'agenda'; bewaar(); agenda(); });
    if (S.fase === 'agenda') return agenda();
    if (S.fase === 'einde') return einde();
    U.kaartZichtbaar(true); hud(); naarKaart();
  }

  // ---------- dialoog ----------
  function zeg(npc, regels, klaar) {
    let i = 0;
    const stap = () => {
      if (i >= regels.length) return klaar();
      U.dialoog(npc, { tekst: regels[i++] }); verderHandler = stap;
    };
    stap();
  }
  function verder() {
    if (U.maakAf()) return;
    if (!verderHandler) return;
    const f = verderHandler; verderHandler = null; X.tik(); f();
  }

  // ---------- kaart ----------
  function naarKaart() {
    bezig = false; S.fase = 'kaart'; bewaar();
    const L = C.locaties.find(l => l.tegel[0] === S.hero[0] && l.tegel[1] === S.hero[1]);
    U.locatie(L ? (L.kortenaam || L.naam) : C.teksten.landgoed);
    U.nav(GEBOUWEN, bezocht, loop, C.teksten.waarheen); vorigScherm = 's-nav';
  }
  function loop(L) {
    if (bezig || M.isMoving()) return;
    if (!M.walkTo(L.tegel[0], L.tegel[1])) return;
    U.locatie('→ ' + (L.kortenaam || L.naam)); U.toon(null);
  }
  function aankomst(x, y) {
    S.hero = [x, y]; bewaar();
    const L = C.locaties.find(l => l.tegel[0] === x && l.tegel[1] === y);
    if (!L) return naarKaart();
    bezig = true; U.locatie(L.kortenaam || L.naam);
    if (L.id === 'start') return zeg(L.npc, [L.intro[1]], naarKaart);
    if (bezocht(L.id)) {
      U.dialoog(L.npc, { tekst: C.teksten.alBezocht, knop: 'A · TERUG NAAR DE KAART' });
      U.kaart(L.kaart, S.bezocht.indexOf(L.id) + 1, TOTAAL); verderHandler = naarKaart; return;
    }
    zeg(L.npc, L.intro, () => dilemma(L));
  }
  function dilemma(L) {
    U.dialoog(L.npc, { tekst: L.dilemma.vraag, zonderKnop: true, naTypen: () => U.keuzes(L.dilemma.opties, (i, o) => kies(L, i, o)) });
  }
  function kies(L, i, o) {
    S.keuzes[L.id] = i; S.regie = Math.max(0, Math.min(100, S.regie + o.effect)); bewaar(); hud();
    if (o.effect > 0) X.omhoog(); else if (o.effect < 0) X.omlaag(); else X.tik();
    U.effect(o.effect); $('dVerder').hidden = false; U.typ(o.gevolg);
    verderHandler = () => naKeuze(L);
  }
  function naKeuze(L) {
    const op = L.opdracht;
    if (op && (!op.alleenTeam || S.modus === 'team')) {
      U.dialoog(L.npc, { tekst: op.tekst }); U.opdracht(op.maxTekens, S.ergernis);
      verderHandler = () => { S.ergernis = U.opdrachtWaarde().slice(0, op.maxTekens); geefKaart(L); };
    } else geefKaart(L);
  }
  function geefKaart(L) {
    if (!bezocht(L.id)) S.bezocht.push(L.id);
    bewaar(); hud(); X.kaart();
    U.dialoog(L.npc, { tekst: C.teksten.kaartGevonden, knop: 'A · TERUG NAAR DE KAART' });
    U.kaart(L.kaart, S.bezocht.length, TOTAAL);
    verderHandler = () => {
      if (S.bezocht.length < TOTAAL) return naarKaart();
      U.dialoog(L.npc, { tekst: C.teksten.naAlleKaarten, knop: 'A · NAAR DE ZELFCHECK' });
      verderHandler = () => { S.fase = 'zelfcheck'; bewaar(); zelfcheck(() => { S.fase = 'agenda'; bewaar(); agenda(); }); };
    };
  }

  // ---------- zelfcheck ----------
  function zelfcheck(daarna) {
    U.kaartZichtbaar(false); U.toon('s-zelfcheck');
    $('zcVraag').textContent = C.zelfcheck.vraag; $('zcNa').hidden = true; $('zcVerder').textContent = 'A · VERDER';
    U.vinkLijst('zcLijst', C.zelfcheck.items, 'checkbox', 'zc', S.zelfcheck, (i, v) => { S.zelfcheck[i] = v; bewaar(); });
    $('zcVerder').onclick = () => {
      if ($('zcNa').hidden) { $('zcNa').textContent = C.zelfcheck.na; $('zcNa').hidden = false; $('zcVerder').textContent = 'A · VERDER'; S.zelfcheckGedaan = true; bewaar(); $('zcNa').scrollIntoView({ block: 'nearest' }); return; }
      daarna();
    };
  }

  // ---------- agenda ----------
  function agenda() {
    U.kaartZichtbaar(false); U.toon('s-agenda'); $('agFout').hidden = true;
    const A = S.agenda, titels = kaarten().map(k => k.titel);
    $('agZelfVraag').textContent = C.agenda.zelfVraag; $('agOrgVraag').textContent = C.agenda.organisatieVraag;
    U.vinkLijst('agZelfLijst', titels, 'radio', 'agZelf', A.zelfKaart, i => { A.zelfKaart = i; $('agZelfVrij').value = ''; bewaar(); });
    if (!titels.length) $('agZelfLijst').appendChild(U.el('p', 'note', C.teksten.nogGeenKaarten));
    $('agZelfVrij').value = A.zelfKaart == null ? A.zelf : ''; $('agZelfVrij').maxLength = C.agenda.zelfMax;
    $('agZelfVrij').oninput = () => { if ($('agZelfVrij').value) { A.zelfKaart = null; document.querySelectorAll('input[name=agZelf]').forEach(r => { r.checked = false; }); } };
    U.vinkLijst('agOrgLijst', C.agenda.organisatieOpties, 'radio', 'agOrg', A.orgIndex, i => { A.orgIndex = i; $('agOrgVrij').value = ''; bewaar(); });
    $('agOrgVrij').value = A.orgIndex == null ? A.org : '';
    $('agOrgVrij').oninput = () => { if ($('agOrgVrij').value) { A.orgIndex = null; document.querySelectorAll('input[name=agOrg]').forEach(r => { r.checked = false; }); } };
    U.selectVul('agEigenaar', C.agenda.eigenaren, A.eigenaar);
    $('agTerug').onclick = () => { leesAgenda(); hervatNaMenu(); };
    $('agKlaar').onclick = () => {
      leesAgenda();
      if (!A.zelf || !A.org) { $('agFout').textContent = C.teksten.agendaLeeg; $('agFout').hidden = false; return; }
      S.fase = 'einde'; bewaar(); X.kaart(); einde();
    };
  }
  function leesAgenda() {
    const A = S.agenda;
    A.zelf = A.zelfKaart != null ? kaarten()[A.zelfKaart].titel : $('agZelfVrij').value.trim().slice(0, C.agenda.zelfMax);
    A.org = A.orgIndex != null ? C.agenda.organisatieOpties[A.orgIndex] : $('agOrgVrij').value.trim().slice(0, 120);
    A.eigenaar = $('agEigenaar').value; bewaar();
  }

  // ---------- einde ----------
  function einde() {
    U.kaartZichtbaar(false); U.toon('s-einde'); $('kopregel').hidden = false;
    const p = profiel(), A = S.agenda;
    $('eProfiel').textContent = p.naam.toUpperCase(); $('eNaam').textContent = S.naam;
    $('eRegie').textContent = S.regie; $('eKaarten').textContent = S.bezocht.length + ' / ' + TOTAAL;
    const b = $('eAgenda'); b.innerHTML = '';
    b.appendChild(U.el('span', 'kop', 'IK PAK ZELF OP')); b.appendChild(U.el('p', null, A.zelf || '—'));
    b.appendChild(U.el('span', 'kop', 'GGZ NHN MOET AAN DE SLAG MET')); b.appendChild(U.el('p', null, A.org || '—'));
    b.appendChild(U.el('span', 'kop', 'EIGENAAR')); b.appendChild(U.el('p', null, A.eigenaar || '—'));
    if (S.ergernis) { b.appendChild(U.el('span', 'kop', 'ERGERNIS UIT DE ZAAL')); b.appendChild(U.el('p', null, S.ergernis)); }
    U.kaartenLijst('eKaartenLijst', kaarten(), TOTAAL);
    $('eVerderBtn').hidden = S.bezocht.length >= TOTAAL;
  }
  function opnieuw() { if (!window.confirm(C.teksten.wissen)) return; wis(); S = null; bezig = false; verderHandler = null; startScherm(); }

  // ---------- menu ----------
  function openMenu() { if (!S) return; $('mGeluid').textContent = 'GELUID: ' + (X.isAan() ? 'AAN' : 'UIT'); U.menu(true); }
  function zichtbaarScherm() { return ['s-dialoog', 's-nav', 's-kaarten', 's-zelfcheck', 's-agenda', 's-einde'].find(id => !$(id).hidden) || 's-nav'; }
  function hervatNaMenu() {
    if (S.fase === 'einde') return einde();
    if (S.fase === 'agenda') return agenda();
    if (S.fase === 'zelfcheck') return zelfcheck(() => { S.fase = 'agenda'; bewaar(); agenda(); });
    U.kaartZichtbaar(true); hud(); U.toon(vorigScherm === 's-dialoog' ? 's-dialoog' : 's-nav');
  }
  function toonKaarten() {
    vorigScherm = zichtbaarScherm(); U.kaartenLijst('kaartenLijst', kaarten(), TOTAAL); U.toon('s-kaarten');
    $('kaartenTerug').onclick = () => { if (S.fase === 'kaart') U.toon(vorigScherm); else hervatNaMenu(); };
  }

  // ---------- invoer ----------
  function init() {
    M.init($('kaart'), C); M.setOnArrive(aankomst); M.setVisited(bezocht);
    $('startBtn').addEventListener('click', () => {
      const w = U.startWaarden(); const naam = w.naam || (w.modus === 'solo' ? 'speler' : 'team');
      wis(); begin(nieuweState(naam, w.modus, avatarKeuze.id), true);
    });
    $('verderBtn').addEventListener('click', () => { const s = laad(); if (s) begin(s, false); });
    $('dVerder').addEventListener('click', verder);
    $('dTekst').addEventListener('click', () => { if (U.isTypend()) U.maakAf(); else if (!$('dVerder').hidden) verder(); });
    $('kaart').addEventListener('click', ev => {
      if (bezig || !S) return;
      const [x, y] = M.tileFromEvent(ev), L = M.locatieBij(x, y, 1);
      if (L) return loop(L);
      if (M.walkable(x, y) && M.walkTo(x, y)) { U.locatie(C.teksten.onderweg); U.toon(null); }
    });
    $('menuBtn').addEventListener('click', openMenu);
    $('mSluit').addEventListener('click', () => U.menu(false));
    $('mKaarten').addEventListener('click', () => { U.menu(false); toonKaarten(); });
    $('mZelfcheck').addEventListener('click', () => { U.menu(false); vorigScherm = zichtbaarScherm(); zelfcheck(hervatNaMenu); });
    $('mAgenda').addEventListener('click', () => { U.menu(false); vorigScherm = zichtbaarScherm(); agenda(); });
    $('mGeluid').addEventListener('click', () => { X.zet(!X.isAan()); $('mGeluid').textContent = 'GELUID: ' + (X.isAan() ? 'AAN' : 'UIT'); });
    $('mOpnieuw').addEventListener('click', () => { U.menu(false); opnieuw(); });
    $('opnieuwBtn').addEventListener('click', opnieuw);
    $('eAgendaBtn').addEventListener('click', () => { S.fase = 'agenda'; bewaar(); $('kopregel').hidden = true; agenda(); });
    $('eVerderBtn').addEventListener('click', () => { S.fase = 'kaart'; bewaar(); $('kopregel').hidden = true; U.kaartZichtbaar(true); hud(); naarKaart(); });
    document.addEventListener('keydown', ev => {
      if (!S || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
      if (ev.key === 'Enter' || ev.key === ' ') { if (!$('s-dialoog').hidden) { ev.preventDefault(); verder(); } return; }
      const d = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[ev.key];
      if (d && !bezig && S.fase === 'kaart' && !$('screen').hidden) { ev.preventDefault(); if (M.stepDir(d[0], d[1])) U.toon(null); }
    });
    startScherm();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
