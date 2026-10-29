// Schermen, dialoogbox met typewriter, keuzeknoppen, HUD. Geen spelregels en geen teksten (behalve knoplabels).
const WQUi = (() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const SCHERMEN = ['s-start', 's-hint', 's-dialoog', 's-kaarten', 's-zelfcheck', 's-agenda', 's-einde'];
  let typer = null, volleTekst = '', naTypen = null, mond = null, portretLook = null;

  function toon(id) { SCHERMEN.forEach(s => { $(s).hidden = s !== id; }); if (id && id !== 's-dialoog' && id !== 's-hint') window.scrollTo(0, 0); }
  function kaartZichtbaar(v) { $('screen').hidden = !v; $('hud').hidden = !v; $('kopregel').hidden = v; }
  function el(tag, cls, tekst) { const e = document.createElement(tag); if (cls) e.className = cls; if (tekst != null) e.textContent = tekst; return e; }

  // ---------- typewriter ----------
  function typ(tekst, klaar) {
    stopTypen(); const box = $('dTekst'); box.textContent = ''; volleTekst = tekst; naTypen = klaar || null;
    const snel = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (snel) { box.textContent = tekst; const f = naTypen; naTypen = null; f && f(); return; }
    let i = 0; praat();
    typer = setInterval(() => {
      i += 1; box.textContent = tekst.slice(0, i);
      if (i >= tekst.length) { clearInterval(typer); typer = null; mondDicht(); const f = naTypen; naTypen = null; f && f(); }
    }, 16);
  }
  function stopTypen() { if (typer) { clearInterval(typer); typer = null; } mondDicht(); }
  function mondDicht() { if (mond) { clearInterval(mond); mond = null; } tekenPortret(false); }
  function tekenPortret(open) { const box = $('dPortret'); if (!portretLook) { box.hidden = true; return; } box.hidden = false; box.innerHTML = ''; box.appendChild(WQSprites.portret(portretLook, open)); }
  function praat() { mondDicht(); let open = false; mond = setInterval(() => { open = !open; tekenPortret(open); }, 140); }
  function maakAf() {
    if (!typer) return false;
    stopTypen(); $('dTekst').textContent = volleTekst; const f = naTypen; naTypen = null; f && f(); return true;
  }

  // ---------- dialoogbox ----------
  function dialoog(npc, opties) {
    opties = opties || {};
    toon('s-dialoog');
    $('dNpc').textContent = npc.naam.toUpperCase(); $('dRol').textContent = npc.rol || ''; $('dRol').hidden = !npc.rol; portretLook = npc.look || null; tekenPortret(false);
    ['dEffect', 'dKaart', 'dKeuzes', 'dOpdracht', 'dArgument'].forEach(id => { $(id).hidden = true; });
    $('dVerder').hidden = !!opties.zonderKnop; $('dVerder').textContent = opties.knop || 'A · VERDER';
    typ(opties.tekst || '', opties.naTypen);
    $('s-dialoog').scrollIntoView({ block: 'nearest' });
  }
  function keuzes(lijst, kies) {
    const box = $('dKeuzes'); box.innerHTML = ''; box.hidden = false;
    lijst.forEach((o, i) => {
      const b = el('button', 'btn choice', typeof o === 'string' ? o : o.tekst); b.type = 'button';
      b.addEventListener('click', () => { Array.from(box.children).forEach(c => { c.disabled = true; }); b.classList.add('gekozen'); kies(i, o); });
      box.appendChild(b);
    });
    box.lastChild.scrollIntoView({ block: 'nearest' });
  }
  function effect(punten, regie) {
    const e = $('dEffect'); e.textContent = '+' + punten + ' PUNTEN · ' + (regie > 0 ? '+' : '') + regie + ' REGIE';
    e.className = 'effect ' + (regie > 0 ? 'up' : regie < 0 ? 'down' : 'flat'); e.hidden = false;
  }
  function kaartHtml(kaart, nummer, totaal, klein) {
    const c = el('div', 'card' + (klein ? ' klein' : ''));
    c.appendChild(el('span', 'kop', 'MOET-WETEN-KAART ' + nummer + '/' + totaal));
    c.appendChild(el('h3', null, kaart.titel)); c.appendChild(el('p', null, kaart.tekst));
    c.appendChild(el('div', 'bron', 'Bron: ' + kaart.bron));
    return c;
  }
  function kaart(k, nummer, totaal) { const d = $('dKaart'); d.innerHTML = ''; d.appendChild(kaartHtml(k, nummer, totaal)); d.hidden = false; }
  function veld(boxId, veldId, tellerId, max, waarde) {
    const v = $(veldId); v.maxLength = max; v.value = waarde || ''; $(boxId).hidden = false;
    const tel = () => { $(tellerId).textContent = v.value.length + ' / ' + max; };
    v.oninput = tel; tel(); setTimeout(() => v.focus(), 50);
  }
  const opdracht = (max, waarde) => veld('dOpdracht', 'dOpdrachtVeld', 'dOpdrachtTeller', max, waarde);
  const argument = (max, waarde) => veld('dArgument', 'dArgumentVeld', 'dArgumentTeller', max, waarde);

  // ---------- HUD ----------
  function hud(d) {
    $('hudNaam').textContent = d.naam; $('hudPunten').textContent = d.punten; $('hudKaarten').textContent = d.kaarten + ' / ' + d.totaal;
    $('hudBar').style.width = d.regie + '%'; $('hudProfiel').textContent = d.profiel;
    $('hudKompas').textContent = d.kompas || '';
  }
  function locatie(tekst) { $('loc').textContent = tekst; }
  function praatKnop(v) { $('praat').hidden = !v; }
  function hint(tekst) { $('hintTekst').textContent = tekst; toon('s-hint'); }

  // ---------- start ----------
  function avatars(lijst, maakCanvas, gekozenId, kies) {
    const box = $('avatars'); box.innerHTML = '';
    lijst.forEach(av => {
      const b = el('button', 'btn avatar' + (av.id === gekozenId ? ' gekozen' : '')); b.type = 'button';
      b.appendChild(maakCanvas(av)); b.appendChild(el('div', null, av.naam)); b.appendChild(el('div', 'perk', av.perk));
      b.addEventListener('click', () => { Array.from(box.children).forEach(c => c.classList.remove('gekozen')); b.classList.add('gekozen'); kies(av); });
      box.appendChild(b);
    });
  }
  function startWaarden() {
    const modus = document.querySelector('input[name=modus]:checked');
    return { naam: $('naam').value.trim().slice(0, 20), modus: modus ? modus.value : 'team' };
  }

  // ---------- lijsten ----------
  function vinkLijst(boxId, items, type, naam, gekozen, bij) {
    const box = $(boxId); box.innerHTML = '';
    items.forEach((tekst, i) => {
      const l = el('label', 'pill'); const inp = el('input'); inp.type = type; inp.name = naam; inp.value = String(i);
      inp.checked = type === 'checkbox' ? !!gekozen[i] : gekozen === i;
      inp.addEventListener('change', () => bij(i, inp.checked));
      l.appendChild(inp); l.appendChild(el('span', null, tekst)); box.appendChild(l);
    });
  }
  function selectVul(id, items, gekozen) {
    const s = $(id); s.innerHTML = '';
    items.forEach(t => { const o = el('option', null, t); o.value = t; s.appendChild(o); });
    if (gekozen) s.value = gekozen;
  }
  function kaartenLijst(boxId, kaarten, totaal, leegTekst) {
    const box = $(boxId); box.innerHTML = '';
    kaarten.forEach((k, i) => box.appendChild(kaartHtml(k, i + 1, totaal, true)));
    if (!kaarten.length) box.appendChild(el('p', 'note', leegTekst));
  }
  function scoreTabel(boxId, delen, labels, maxVoor) {
    const box = $(boxId); box.innerHTML = '';
    Object.keys(delen).forEach(k => {
      const r = el('div', 'scorerij'); r.appendChild(el('span', null, labels[k])); r.appendChild(el('b', null, delen[k] + ' / ' + maxVoor(k))); box.appendChild(r);
    });
  }
  function menu(open) { $('menu').hidden = !open; }

  return { $, el, toon, kaartZichtbaar, typ, maakAf, isTypend: () => !!typer, dialoog, keuzes, effect, kaart, opdracht, argument, hud, locatie, praatKnop, hint, avatars, startWaarden, vinkLijst, selectVul, kaartenLijst, scoreTabel, menu };
})();
