// State machine: start → landgoed → gebouw (binnen) → dialoog → keuze → gevolg → minigame → kaart → ... → zelfcheck → agenda → einde.
(() => {
  'use strict';
  const U = WQUi, M = WQMap, C = CONTENT, X = WQSfx, W = WQWereld, SC = WQScore, MG = WQMinigames, MZ = WQMuziek, $ = U.$;
  const OPSLAG = 'wq.save.v3', GEBOUWEN = C.locaties.slice(1), KAARTEN = GEBOUWEN.filter(l => l.soort === 'dilemma').length;
  let S = null, bezig = false, verderHandler = null, avatarKeuze = C.avatars[0], binnen = null, huidig = null, netBuiten = false, wachtVoorwerp = null;

  // ---------- state en opslag ----------
  function nieuweState(naam, modus, avatar) {
    return {
      versie: 3, naam, modus, avatar, regie: C.regieStart, bezocht: [], keuzes: {}, argumenten: {}, ergernis: '',
      punten: { dilemma: {}, minigame: {}, discussie: {} }, tijdbonus: 0,
      zelfcheck: C.zelfcheck.items.map(() => false), zelfcheckGedaan: false, agendaGedaan: false,
      agenda: { zelf: '', zelfKaart: null, org: '', orgIndex: null, orgVrij: '', eigenaar: C.agenda.eigenaren[0] },
      hero: C.locaties[0].tegel.slice(), binnenIn: null, fase: 'kaart', gezien: [], playerId: Math.random().toString(36).slice(2, 10), gestart: Date.now(), klaarOp: null,
    };
  }
  function bewaar() { try { localStorage.setItem(OPSLAG, JSON.stringify(S)); } catch (e) { /* privémodus */ } WQBoard.verstuur(S, SC.totaal(S), binnen && huidig ? huidig.id : 'buiten'); }
  function laad() { try { const s = JSON.parse(localStorage.getItem(OPSLAG)); return s && s.versie === 3 ? s : null; } catch (e) { return null; } }
  function wis() { try { localStorage.removeItem(OPSLAG); } catch (e) { /* niets */ } }
  const profiel = () => C.profielen.find(p => S.regie >= p.min && S.regie <= p.max) || C.profielen[0];
  const bezocht = id => S.bezocht.includes(id);
  const avatarVan = id => C.avatars.find(a => a.id === id) || C.avatars[0];
  const kaarten = () => S.bezocht.map(id => C.locaties.find(l => l.id === id)).filter(l => l.kaart).map(l => l.kaart);
  const volgende = () => { const id = C.route.find(i => !bezocht(i)); return id ? C.locaties.find(l => l.id === id) : null; };
  const VRAAG = l => l.soort === 'dilemma' || l.soort === 'discussie';
  const allesKlaar = () => GEBOUWEN.every(l => !VRAAG(l) || bezocht(l.id));
  const teGaan = () => GEBOUWEN.filter(l => VRAAG(l) && l.id !== C.laatste && !bezocht(l.id)).length;
  function hud() {
    const n = teGaan();
    U.hud({ naam: S.naam, punten: SC.totaal(S), kaarten: kaarten().length, totaal: KAARTEN, regie: S.regie, profiel: profiel().kort, kaartKnop: n ? vul(C.teksten.kaartKnop, { n }) : C.teksten.kaartKnopKlaar });
  }
  // Overzichtskaart: het hele landgoed met knipperende, stuiterende markers op de plekken die nog een vraag hebben.
  let overzichtRaf = 0;
  function toonOverzicht() {
    if (!S) return;
    const cv = $('overzichtCanvas'), c = cv.getContext('2d'), w = W.buitenWereld(bezocht, null), T = M.T;
    c.imageSmoothingEnabled = false; $('overzichtUitleg').textContent = C.teksten.kaartUitleg; U.menu(false); $('overzicht').hidden = false;
    let t = 0;
    const teken = () => {
      t++; c.drawImage(w.offscreen, 0, 0); if (w.overlay) c.drawImage(w.overlay, 0, 0);
      const [hx, hy] = binnen && huidig ? huidig.tegel : M.heroTile();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(hx * T + 16, hy * T + 16, 30 + Math.sin(t / 6) * 6, 0, 7); c.fill(); c.fillStyle = '#d65a4a'; c.beginPath(); c.arc(hx * T + 16, hy * T + 16, 20, 0, 7); c.fill();
      for (const L of GEBOUWEN) {
        if (!VRAAG(L) || bezocht(L.id)) continue;
        const x = L.tegel[0] * T + 16, dicht = L.id === C.laatste && teGaan() > 0, y = L.tegel[1] * T - 10 - (dicht ? 0 : Math.abs(Math.sin(t / 9)) * 30);
        if (!dicht && Math.floor(t / 14) % 3 === 0) continue;
        c.save(); c.translate(x, y); c.scale(9, 9);
        c.fillStyle = dicht ? '#6b7280' : '#fff7cc'; c.fillRect(-4, -10, 8, 8); c.fillRect(-1, -2, 2, 3);
        c.fillStyle = dicht ? '#e0a84a' : '#d65a4a'; c.fillRect(-2, -8, 4, 4); if (dicht) { c.fillStyle = '#1a1f1c'; c.fillRect(-1, -7, 2, 2); }
        c.restore();
        c.font = '26px "Press Start 2P", monospace'; c.textAlign = 'center'; c.fillStyle = '#1a1f1c'; c.fillText((L.kortenaam || L.naam).split('[')[0].trim(), x + 2, y - 104 + 2); c.fillStyle = dicht ? '#9fb3a6' : '#fff7cc'; c.fillText((L.kortenaam || L.naam).split('[')[0].trim(), x, y - 104);
      }
      overzichtRaf = requestAnimationFrame(teken);
    };
    teken();
  }
  function sluitOverzicht() { cancelAnimationFrame(overzichtRaf); $('overzicht').hidden = true; }

  // ---------- start ----------
  function startScherm() {
    U.kaartZichtbaar(false); U.toon('s-start');
    $('verderBtn').hidden = !laad();
    $('startTekst').textContent = C.locaties[0].intro[0];
    U.avatars(C.avatars, av => WQSprites.avatarCanvas(av, 2), avatarKeuze.id, av => { avatarKeuze = av; X.tik(); });
  }
  function begin(state, nieuw) {
    S = state; M.setLook(avatarVan(S.avatar)); bewaar();
    if (S.fase !== 'kaart' && !nieuw) return hervat();
    U.kaartZichtbaar(true);
    if (S.binnenIn && !nieuw) { huidig = C.locaties.find(l => l.id === S.binnenIn); naarBinnen(huidig, S.hero); vrij(); return; }
    naarBuiten(S.hero);
    if (nieuw) { bezig = true; zeg(C.locaties[0].npc, C.locaties[0].intro, vrij); } else vrij();
  }
  function hervat() {
    if (S.fase === 'zelfcheck') return zelfcheck(() => { S.fase = 'agenda'; bewaar(); agenda(); });
    if (S.fase === 'agenda') return agenda();
    if (S.fase === 'einde') return einde();
    U.kaartZichtbaar(true); vrij();
  }

  // ---------- werelden ----------
  function naarBuiten(pos, vanuit) {
    const vorige = huidig;
    binnen = null; huidig = null; S.binnenIn = null;
    if (!S.gezien.includes('spook')) W.spookOpBegraafplaats(); else W.spookWeg();
    if (vorige && S.gezien.includes('spook') && C.spook.fluister[vorige.id] && S.punten.dilemma[vorige.id] != null && S.punten.dilemma[vorige.id] < 30 && !S.gezien.includes('spook:' + vorige.id)) {
      const [dx, dy] = pos, buur = [[1, 0], [-1, 0], [0, 1]].map(([a, b]) => [dx + a, dy + b]).find(([x, y]) => M.walkable(x, y));
      if (buur) W.spookBij(buur[0], buur[1], M.tijd(), vorige.id);
    }
    M.setWereld(W.buitenWereld(bezocht, volgende() && volgende().id), pos[0], pos[1]); M.setHero(pos[0], pos[1], 'down');
    U.locatie(C.teksten.landgoed); U.praatKnop(false); hud(); muziekBuiten(pos[0], pos[1]);
  }
  function naarBinnen(L, pos) {
    huidig = L; binnen = W.binnenWereld(L, () => bezocht(L.id)); W.buitenActief(false); S.binnenIn = L.id;
    const p = pos || [binnen.deur[0], binnen.deur[1] - 1];
    M.setWereld(binnen, p[0], p[1]); M.setHero(p[0], p[1], 'up'); S.hero = p.slice(); bewaar();
    U.locatie(L.kortenaam || L.naam); U.praatKnop(W.naastNpc(binnen, p[0], p[1])); hud(); MZ.speel(L.muziek || 'kantoor');
  }
  function muziekBuiten(x, y) { const P = C.locaties.find(l => l.soort === 'plek'); const bij = P && Math.abs(x - P.tegel[0]) <= 4 && Math.abs(y - P.tegel[1]) <= 3; MZ.speel(bij ? P.muziek : C.locaties[0].muziek); }
  function vrij() {
    bezig = false; verderHandler = null;
    if (S.fase !== 'kaart') return hervat();
    const v = volgende();
    U.hint(binnen ? (bezocht(huidig.id) || S.gezien.includes(huidig.id) ? C.teksten.alGedaanHint : C.teksten.praatHint) : (v ? C.teksten.loopHint : C.teksten.alles));
    hud();
  }
  function aankomst(x, y) {
    S.hero = [x, y]; bewaar();
    if (bezig) return;
    if (binnen) {
      if (binnen.kaart[y][x] === 'D') { bezig = true; M.transition(() => { const L = huidig; naarBuiten(L.tegel); netBuiten = true; vrij(); naControle(); }); return; }
      if (wachtVoorwerp) { const v = wachtVoorwerp; wachtVoorwerp = null; if (Math.abs(v.x - x) + Math.abs(v.y - y) <= 1) return toonVoorwerp(v.ch); }
      const naast = W.naastNpc(binnen, x, y); U.praatKnop(naast);
      if (naast && !bezocht(huidig.id)) gesprek(huidig);
      return;
    }
    if (W.spookBijTegel(x, y)) return spookScene();
    const L = GEBOUWEN.find(l => l.tegel[0] === x && l.tegel[1] === y);
    if (L && L.soort === 'grap' && !netBuiten) {
      if (S.gezien.includes(L.id)) { bezig = true; M.stop(); U.dialoog(L.npc, { tekst: L.nogmaals }); verderHandler = () => { netBuiten = true; vrij(); }; return; }
      bezig = true; M.transition(() => { naarBinnen(L); U.dialoog(L.npc, { tekst: L.intro[0], knop: 'A · EH, SORRY' }); verderHandler = () => { S.gezien.push(L.id); bewaar(); bezig = true; M.transition(() => { naarBuiten(L.tegel); netBuiten = true; vrij(); }); }; });
      return;
    }
    if (L && L.soort === 'plek' && !L.binnen) {
      if (!S.gezien.includes(L.id)) { S.gezien.push(L.id); bewaar(); bezig = true; M.stop(); zeg(L.npc, L.intro, vrij); }
      muziekBuiten(x, y); return;
    }
    if (L && !netBuiten) {
      const rest = GEBOUWEN.filter(l => l.id !== L.id && VRAAG(l) && !bezocht(l.id)).length;
      if (L.id === C.laatste && rest > 0) { bezig = true; M.stop(); U.dialoog(L.npc, { tekst: vul(C.teksten.koepelDicht, { n: rest }) }); verderHandler = () => { netBuiten = true; vrij(); }; return; }
      if (L.id === C.laatste && !S.gezien.includes('koepelOpen')) { S.gezien.push('koepelOpen'); bewaar(); bezig = true; M.stop(); U.dialoog(L.npc, { tekst: C.teksten.koepelOpen }); verderHandler = () => { bezig = true; M.transition(() => { naarBinnen(L); vrij(); }); }; return; }
      bezig = true; M.transition(() => { naarBinnen(L); vrij(); }); return;
    }
    netBuiten = false; hud(); muziekBuiten(x, y);
  }
  function naControle() {
    if (!allesKlaar() || S.fase !== 'kaart') return;
    bezig = true; U.dialoog(C.locaties[0].npc, { tekst: C.teksten.naAlles, knop: 'A · NAAR DE ZELFCHECK' });
    verderHandler = () => { S.fase = 'zelfcheck'; bewaar(); zelfcheck(() => { S.fase = 'agenda'; bewaar(); agenda(); }); };
  }
  function praat() {
    if (bezig || !binnen) return;
    const [x, y] = M.heroTile(); if (!W.naastNpc(binnen, x, y)) return;
    if (!bezocht(huidig.id)) return gesprek(huidig);
    bezig = true;
    if (huidig.soort === 'plek') { U.dialoog(huidig.npc, { tekst: huidig.intro[huidig.intro.length - 1] }); verderHandler = vrij; return; }
    U.dialoog(huidig.npc, { tekst: huidig.soort === 'dilemma' ? C.teksten.alBezocht : C.teksten.alGedaan });
    if (huidig.kaart) U.kaart(huidig.kaart, kaarten().indexOf(huidig.kaart) + 1, KAARTEN);
    verderHandler = vrij;
  }
  function spookScene() {
    const sp = W.spook(), npc = { naam: C.spook.naam, rol: C.spook.rol, look: C.spook.look };
    bezig = true; M.stop();
    if (sp.bij === 'begraafplaats') { zeg(npc, C.spook.intro, () => { S.gezien.push('spook'); bewaar(); W.spookWeg(); U.dialoog(npc, { tekst: C.spook.tot }); verderHandler = vrij; }); return; }
    const id = sp.bij; U.dialoog(npc, { tekst: C.spook.fluister[id] }); S.gezien.push('spook:' + id); bewaar();
    verderHandler = () => { W.spookWeg(); U.dialoog(npc, { tekst: C.teksten.spookWeg }); verderHandler = vrij; };
  }
  function toonVoorwerp(ch) {
    const v = C.voorwerpen[ch]; if (!v) return;
    bezig = true; M.stop(); U.dialoog({ naam: v.naam, rol: C.teksten.voorwerp }, { tekst: v.tekst }); verderHandler = vrij;
  }
  function praatFigurant(f) {
    bezig = true; M.stop(); f.teller = (f.teller || 0) + 1;
    U.dialoog({ naam: f.naam, rol: f.rol }, { tekst: f.regels[(f.teller - 1) % f.regels.length] }); verderHandler = vrij;
  }

  // ---------- dialoog ----------
  function zeg(npc, regels, klaar) {
    let i = 0;
    const stap = () => { if (i >= regels.length) return klaar(); U.dialoog(npc, { tekst: regels[i++] }); verderHandler = stap; };
    stap();
  }
  function verder() {
    if (U.maakAf()) return;
    if (!verderHandler) return;
    const f = verderHandler; verderHandler = null; X.tik(); f();
  }
  const vul = (t, d) => t.replace(/\{(\w+)\}/g, (m, k) => d[k] != null ? d[k] : m);

  // ---------- gebouw ----------
  function gesprek(L) {
    bezig = true; M.stop(); U.praatKnop(false);
    if (L.soort === 'plek') return zeg(L.npc, L.intro, () => { if (!bezocht(L.id)) S.bezocht.push(L.id); bewaar(); vrij(); });
    zeg(L.npc, L.intro, () => (L.soort === 'dilemma' ? dilemma(L) : discussie(L)));
  }
  function dilemma(L) {
    U.dialoog(L.npc, { tekst: L.dilemma.vraag, zonderKnop: true, naTypen: () => U.keuzes(L.dilemma.opties, (i, o) => kies(L, i, o)) });
  }
  function kies(L, i, o) {
    S.keuzes[L.id] = i; S.punten.dilemma[L.id] = o.punten; S.regie = Math.max(0, Math.min(100, S.regie + o.effect)); bewaar(); hud();
    if (o.effect > 0) X.omhoog(); else if (o.effect < 0) { X.omlaag(); M.schud(14); } else X.tik();
    U.effect(o.punten, o.effect); $('dVerder').hidden = false; U.typ(o.gevolg);
    verderHandler = () => naKeuze(L);
  }
  function naKeuze(L) {
    const op = L.opdracht;
    if (op && (!op.alleenTeam || S.modus === 'team')) {
      U.dialoog(L.npc, { tekst: op.tekst }); U.opdracht(op.maxTekens, S.ergernis);
      verderHandler = () => { S.ergernis = $('dOpdrachtVeld').value.trim().slice(0, op.maxTekens); bewaar(); naOpdracht(L); };
    } else naOpdracht(L);
  }
  function naOpdracht(L) { if (L.minigame) minigame(L); else geefKaart(L); }
  function minigame(L) {
    const mg = C.minigames[L.minigame];
    U.dialoog(L.npc, { tekst: vul(C.teksten.minigameStart, mg), knop: 'A · SPELEN' });
    verderHandler = () => {
      U.toon(null); M.setPaused(true); $('loc').hidden = true; MZ.speel('minigame');
      MG.start(L.minigame, M.canvas(), res => {
        M.setPaused(false); $('loc').hidden = false; MZ.speel(L.muziek || 'kantoor'); S.punten.minigame[L.id] = res.punten; bewaar(); hud(); X.kaart();
        U.dialoog(L.npc, { tekst: res.tekst + ' ' + vul(C.teksten.minigameKlaar, res) });
        verderHandler = () => geefKaart(L);
      });
    };
  }
  function geefKaart(L) {
    if (!bezocht(L.id)) S.bezocht.push(L.id);
    bewaar(); hud(); X.kaart();
    U.dialoog(L.npc, { tekst: C.teksten.kaartGevonden, knop: 'A · VERDER' });
    U.kaart(L.kaart, kaarten().length, KAARTEN);
    verderHandler = L.id === C.laatste ? () => agendaVraag(L) : vrij;
  }
  function agendaVraag(L) {
    const A = S.agenda, av = L.agendaVraag;
    if (!av) { bezig = false; return naControle(); }
    U.dialoog(L.npc, { tekst: av.vraag, zonderKnop: true, naTypen: () => U.keuzes(C.agenda.organisatieOpties, i => { A.orgIndex = i; A.org = C.agenda.organisatieOpties[i]; bewaar(); U.dialoog(L.npc, { tekst: av.vrij }); U.argument(120, A.orgVrij || ''); verderHandler = () => { A.orgVrij = $('dArgumentVeld').value.trim().slice(0, 120); bewaar(); U.dialoog(L.npc, { tekst: av.na }); verderHandler = () => { bezig = false; naControle(); }; }; }) });
  }
  function discussie(L) {
    U.dialoog(L.npc, { tekst: L.discussie.vraag, zonderKnop: true, naTypen: () => U.keuzes(L.discussie.opties, i => { S.keuzes[L.id] = i; bewaar(); argument(L); }) });
  }
  function argument(L) {
    U.dialoog(L.npc, { tekst: L.discussie.argument }); U.argument(120, S.argumenten[L.id]);
    const klaar = () => {
      const a = $('dArgumentVeld').value.trim().slice(0, 120);
      if (!a) { U.typ(C.teksten.argumentLeeg); verderHandler = klaar; return; }
      S.argumenten[L.id] = a; S.punten.discussie[L.id] = C.score.discussie; if (!bezocht(L.id)) S.bezocht.push(L.id); bewaar(); hud(); X.kaart();
      U.dialoog(L.npc, { tekst: L.discussie.na });
      verderHandler = () => { U.dialoog(L.npc, { tekst: vul(C.teksten.discussieBedankt, { punten: C.score.discussie }) }); verderHandler = vrij; };
    };
    verderHandler = klaar;
  }

  // ---------- zelfcheck, agenda, einde ----------
  function zelfcheck(daarna) {
    U.kaartZichtbaar(false); U.toon('s-zelfcheck');
    $('zcVraag').textContent = C.zelfcheck.vraag; $('zcNa').hidden = true; $('zcVerder').textContent = 'A · VERDER';
    U.vinkLijst('zcLijst', C.zelfcheck.items, 'checkbox', 'zc', S.zelfcheck, (i, v) => { S.zelfcheck[i] = v; bewaar(); });
    $('zcVerder').onclick = () => {
      if ($('zcNa').hidden) { $('zcNa').textContent = C.zelfcheck.na; $('zcNa').hidden = false; S.zelfcheckGedaan = true; bewaar(); $('zcNa').scrollIntoView({ block: 'nearest' }); return; }
      daarna();
    };
  }
  function agenda() {
    U.kaartZichtbaar(false); U.toon('s-agenda'); $('agFout').hidden = true;
    const A = S.agenda, titels = kaarten().map(k => k.titel);
    $('agZelfVraag').textContent = C.agenda.zelfVraag; $('agOrgVraag').textContent = C.agenda.organisatieVraag;
    U.vinkLijst('agZelfLijst', titels, 'radio', 'agZelf', A.zelfKaart, i => { A.zelfKaart = i; $('agZelfVrij').value = ''; bewaar(); });
    if (!titels.length) $('agZelfLijst').appendChild(U.el('p', 'note', C.teksten.nogGeenKaarten));
    $('agZelfVrij').value = A.zelfKaart == null ? A.zelf : ''; $('agZelfVrij').maxLength = C.agenda.zelfMax;
    $('agZelfVrij').oninput = () => { if ($('agZelfVrij').value) { A.zelfKaart = null; document.querySelectorAll('input[name=agZelf]').forEach(r => { r.checked = false; }); } };
    const orgKlaar = !!A.org; $('agOrgVraag').hidden = orgKlaar; $('agOrgLijst').hidden = orgKlaar; $('agOrgVrij').hidden = orgKlaar;
    U.vinkLijst('agOrgLijst', C.agenda.organisatieOpties, 'radio', 'agOrg', A.orgIndex, i => { A.orgIndex = i; $('agOrgVrij').value = ''; bewaar(); });
    $('agOrgVrij').value = A.orgIndex == null ? A.org : '';
    $('agOrgVrij').oninput = () => { if ($('agOrgVrij').value) { A.orgIndex = null; document.querySelectorAll('input[name=agOrg]').forEach(r => { r.checked = false; }); } };
    U.selectVul('agEigenaar', C.agenda.eigenaren, A.eigenaar);
    $('agTerug').onclick = () => { leesAgenda(); hervatNaMenu(); };
    $('agKlaar').onclick = () => {
      leesAgenda();
      if (!A.zelf) { $('agFout').textContent = C.teksten.agendaLeeg; $('agFout').hidden = false; return; }
      S.agendaGedaan = true; if (allesKlaar() && !S.klaarOp) S.klaarOp = Date.now(); S.fase = 'einde'; bewaar(); X.kaart(); einde();
    };
  }
  function leesAgenda() {
    const A = S.agenda;
    A.zelf = A.zelfKaart != null ? kaarten()[A.zelfKaart].titel : $('agZelfVrij').value.trim().slice(0, C.agenda.zelfMax);
    if (!$('agOrgLijst').hidden) A.org = A.orgIndex != null ? C.agenda.organisatieOpties[A.orgIndex] : $('agOrgVrij').value.trim().slice(0, 120);
    A.eigenaar = $('agEigenaar').value; bewaar();
  }
  function einde() {
    U.kaartZichtbaar(false); U.toon('s-einde'); $('kopregel').hidden = false; MZ.speel('einde');
    const p = profiel(), A = S.agenda;
    $('eProfiel').textContent = p.naam.toUpperCase(); $('eNaam').textContent = S.naam;
    $('ePunten').textContent = SC.totaal(S); $('eRegie').textContent = S.regie;
    U.scoreTabel('eScore', SC.delen(S), SC.labels(), SC.maxVoor);
    const b = $('eAgenda'); b.innerHTML = '';
    b.appendChild(U.el('span', 'kop', 'IK PAK ZELF OP')); b.appendChild(U.el('p', null, A.zelf || '—'));
    b.appendChild(U.el('span', 'kop', 'GGZ NHN MOET AAN DE SLAG MET')); b.appendChild(U.el('p', null, (A.org || '—') + (A.orgVrij ? ' · ' + A.orgVrij : '')));
    b.appendChild(U.el('span', 'kop', 'EIGENAAR')); b.appendChild(U.el('p', null, A.eigenaar || '—'));
    if (S.ergernis) { b.appendChild(U.el('span', 'kop', 'ERGERNIS UIT DE ZAAL')); b.appendChild(U.el('p', null, S.ergernis)); }
    U.kaartenLijst('eKaartenLijst', kaarten(), KAARTEN, C.teksten.nogGeenKaarten);
    $('eVerderBtn').hidden = allesKlaar();
  }
  function opnieuw() { if (!window.confirm(C.teksten.wissen)) return; MZ.stop(); wis(); S = null; bezig = false; verderHandler = null; binnen = null; startScherm(); }

  // ---------- menu ----------
  function openMenu() { if (!S) return; $('mFps').textContent = M.fps() + ' fps'; $('mGeluid').textContent = 'GELUID: ' + (X.isAan() ? 'AAN' : 'UIT'); $('mMuziek').textContent = 'MUZIEK: ' + (MZ.isAan() ? 'AAN' : 'UIT'); U.menu(true); }
  function hervatNaMenu() {
    if (S.fase === 'einde') return einde();
    if (S.fase === 'agenda') return agenda();
    if (S.fase === 'zelfcheck') return zelfcheck(() => { S.fase = 'agenda'; bewaar(); agenda(); });
    U.kaartZichtbaar(true); if (bezig && verderHandler) U.toon('s-dialoog'); else vrij();
  }
  function toonKaarten() { U.kaartenLijst('kaartenLijst', kaarten(), KAARTEN, C.teksten.nogGeenKaarten); U.toon('s-kaarten'); $('kaartenTerug').onclick = hervatNaMenu; }

  // ---------- invoer ----------
  function init() {
    W.init(C); SC.init(C); MG.init(C); WQBoard.init(typeof CONFIG === 'object' ? CONFIG : null); M.init($('kaart')); M.setOnArrive(aankomst);
    M.setAvond(() => { if (!S) return 0; const min = (Date.now() - S.gestart) / 60000; return Math.max(0, Math.min(1, (min - 10) / 10)); });
    $('startBtn').addEventListener('click', () => {
      const w = U.startWaarden(); const naam = w.naam || (w.modus === 'solo' ? 'speler' : 'team');
      wis(); begin(nieuweState(naam, w.modus, avatarKeuze.id), true);
    });
    $('verderBtn').addEventListener('click', () => { const s = laad(); if (s) begin(s, false); });
    $('dVerder').addEventListener('click', verder);
    $('dTekst').addEventListener('click', () => { if (U.isTypend()) U.maakAf(); else if (!$('dVerder').hidden) verder(); });
    $('praat').addEventListener('click', praat);
    $('kaart').addEventListener('click', ev => {
      if (bezig || !S || S.fase !== 'kaart') return;
      const [x, y] = M.tileFromEvent(ev);
      if (binnen) {
        if (binnen.npc[0] === x && binnen.npc[1] === y) {
          const [hx, hy] = M.heroTile();
          if (W.naastNpc(binnen, hx, hy)) return praat();
          const buur = [[0, 1], [1, 0], [-1, 0], [0, -1]].map(([dx, dy]) => [x + dx, y + dy]).find(([bx, by]) => M.walkable(bx, by));
          if (buur) M.walkTo(buur[0], buur[1]); return;
        }
        const ch = binnen.kaart[y] && binnen.kaart[y][x];
        if (ch && C.voorwerpen[ch]) {
          const [hx, hy] = M.heroTile();
          if (Math.abs(hx - x) + Math.abs(hy - y) <= 1) return toonVoorwerp(ch);
          const buur = [[0, 1], [1, 0], [-1, 0], [0, -1]].map(([dx, dy]) => [x + dx, y + dy]).find(([bx, by]) => M.walkable(bx, by));
          if (buur) { wachtVoorwerp = { x, y, ch }; M.walkTo(buur[0], buur[1]); } return;
        }
        M.walkTo(x, y); return;
      }
      if (W.spookBijTegel(x, y)) { const [hx, hy] = M.heroTile(); if (Math.abs(hx - x) + Math.abs(hy - y) <= 2) return spookScene(); }
      const f = W.figurantBij(x, y);
      if (f && f.x === x && f.y === y) { const [hx, hy] = M.heroTile(); if (Math.abs(hx - x) + Math.abs(hy - y) <= 2) return praatFigurant(f); }
      if (M.walkTo(x, y, 40)) { U.locatie(C.teksten.onderweg); U.praatKnop(false); }
    });
    $('menuBtn').addEventListener('click', openMenu);
    $('hudKaart').addEventListener('click', toonOverzicht);
    $('overzichtSluit').addEventListener('click', sluitOverzicht);
    $('mSluit').addEventListener('click', () => U.menu(false));
    $('mKaarten').addEventListener('click', () => { U.menu(false); toonKaarten(); });
    $('mZelfcheck').addEventListener('click', () => { U.menu(false); zelfcheck(hervatNaMenu); });
    $('mAgenda').addEventListener('click', () => { U.menu(false); agenda(); });
    $('mMuziek').addEventListener('click', () => { MZ.zet(!MZ.isAan()); $('mMuziek').textContent = 'MUZIEK: ' + (MZ.isAan() ? 'AAN' : 'UIT'); });
    $('mGeluid').addEventListener('click', () => { X.zet(!X.isAan()); $('mGeluid').textContent = 'GELUID: ' + (X.isAan() ? 'AAN' : 'UIT'); });
    $('mOpnieuw').addEventListener('click', () => { U.menu(false); opnieuw(); });
    $('opnieuwBtn').addEventListener('click', opnieuw);
    $('eAgendaBtn').addEventListener('click', () => { S.fase = 'agenda'; bewaar(); agenda(); });
    $('eVerderBtn').addEventListener('click', () => { S.fase = 'kaart'; bewaar(); U.kaartZichtbaar(true); vrij(); });
    document.addEventListener('keydown', ev => {
      if (!S || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); if (!$('s-dialoog').hidden) verder(); else if (!$('praat').hidden) praat(); return; }
      const d = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[ev.key];
      if (d && !bezig && S.fase === 'kaart' && !$('screen').hidden) { ev.preventDefault(); M.stepDir(d[0], d[1]); }
    });
    startScherm();
  }
  document.addEventListener('DOMContentLoaded', init);
  // Alleen voor tests: zet de held bij een deur en loop erop af.
  window.WQGame = { naar(id) { const L = C.locaties.find(l => l.id === id); if (!S || bezig) return false; if (binnen) return false; M.setHero(L.tegel[0], L.tegel[1], 'down'); netBuiten = false; return M.walkTo(L.tegel[0], L.tegel[1]); }, state: () => S, binnen: () => binnen };
})();
