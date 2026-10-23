// Schermen, dialoogbox met typewriter, keuzeknoppen, HUD. Geen spelregels en geen teksten (behalve knoplabels).
const WQUi = (() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const SCHERMEN = ['s-start', 's-dialoog', 's-nav', 's-kaarten', 's-zelfcheck', 's-agenda', 's-einde'];
  let typer = null, volleTekst = '', naTypen = null;

  function toon(id) { SCHERMEN.forEach(s => { $(s).hidden = s !== id; }); if (id !== 's-dialoog' && id !== 's-nav') window.scrollTo(0, 0); }
  function kaartZichtbaar(v) { $('screen').hidden = !v; $('hud').hidden = !v; }
  function el(tag, cls, tekst) { const e = document.createElement(tag); if (cls) e.className = cls; if (tekst != null) e.textContent = tekst; return e; }

  // ---------- typewriter ----------
  function typ(tekst, klaar) {
    stopTypen(); const box = $('dTekst'); box.textContent = ''; volleTekst = tekst; naTypen = klaar || null;
    const snel = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (snel) { box.textContent = tekst; const f = naTypen; naTypen = null; f && f(); return; }
    let i = 0;
    typer = setInterval(() => {
      i += 1; box.textContent = tekst.slice(0, i);
      if (i >= tekst.length) { clearInterval(typer); typer = null; const f = naTypen; naTypen = null; f && f(); }
    }, 16);
  }
  function stopTypen() { if (typer) { clearInterval(typer); typer = null; } }
  // Rondt het typen af. Geeft true als er nog getypt werd (dan telt de tik niet als "verder").
  function maakAf() {
    if (!typer) return false;
    stopTypen(); $('dTekst').textContent = volleTekst; const f = naTypen; naTypen = null; f && f(); return true;
  }

  // ---------- dialoogbox ----------
  function dialoog(npc, opties) {
    opties = opties || {};
    toon('s-dialoog');
    $('dNpc').textContent = npc.naam.toUpperCase(); $('dRol').textContent = npc.rol || ''; $('dRol').hidden = !npc.rol;
    $('dEffect').hidden = true; $('dKaart').hidden = true; $('dKeuzes').hidden = true; $('dOpdracht').hidden = true;
    $('dVerder').hidden = !!opties.zonderKnop; $('dVerder').textContent = opties.knop || 'A · VERDER';
    typ(opties.tekst || '', opties.naTypen);
  }
  function keuzes(lijst, kies) {
    const box = $('dKeuzes'); box.innerHTML = ''; box.hidden = false;
    lijst.forEach((o, i) => {
      const b = el('button', 'btn choice', o.tekst); b.type = 'button';
      b.addEventListener('click', () => { Array.from(box.children).forEach(c => { c.disabled = true; }); b.classList.add('gekozen'); kies(i, o); });
      box.appendChild(b);
    });
    box.lastChild.scrollIntoView({ block: 'nearest' });
  }
  function effect(n) {
    const e = $('dEffect'); e.textContent = (n > 0 ? '+' : '') + n + ' REGIE';
    e.className = 'effect ' + (n > 0 ? 'up' : n < 0 ? 'down' : 'flat'); e.hidden = false;
  }
  function kaartHtml(kaart, nummer, totaal, klein) {
    const c = el('div', 'card' + (klein ? ' klein' : ''));
    c.appendChild(el('span', 'kop', 'MOET-WETEN-KAART ' + nummer + '/' + totaal));
    c.appendChild(el('h3', null, kaart.titel)); c.appendChild(el('p', null, kaart.tekst));
    c.appendChild(el('div', 'bron', 'Bron: ' + kaart.bron));
    return c;
  }
  function kaart(k, nummer, totaal) { const d = $('dKaart'); d.innerHTML = ''; d.appendChild(kaartHtml(k, nummer, totaal)); d.hidden = false; }
  function opdracht(max, waarde) {
    const v = $('dOpdrachtVeld'); v.maxLength = max; v.value = waarde || ''; $('dOpdracht').hidden = false;
    const tel = () => { $('dOpdrachtTeller').textContent = v.value.length + ' / ' + max; };
    v.oninput = tel; tel(); setTimeout(() => v.focus(), 50);
  }
  function opdrachtWaarde() { return $('dOpdrachtVeld').value.trim(); }

  // ---------- HUD en navigatie ----------
  function hud(naam, regie, kaarten, totaal, profiel) {
    $('hudNaam').textContent = naam; $('hudKaarten').textContent = kaarten + ' / ' + totaal;
    $('hudBar').style.width = regie + '%'; $('hudProfiel').textContent = profiel;
  }
  function locatie(tekst) { $('loc').textContent = tekst; }
  function nav(locaties, bezocht, kies, kop) {
    const d = $('dest'); d.innerHTML = ''; $('navKop').textContent = kop;
    locaties.forEach(l => {
      const klaar = bezocht(l.id);
      const b = el('button', 'btn' + (klaar ? ' done' : ''), (klaar ? '✓ ' : '') + (l.kortenaam || l.naam)); b.type = 'button';
      b.addEventListener('click', () => kies(l)); d.appendChild(b);
    });
    toon('s-nav');
  }

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

  // ---------- lijsten met vinkjes of rondjes ----------
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
  function kaartenLijst(boxId, kaarten, totaal) {
    const box = $(boxId); box.innerHTML = '';
    kaarten.forEach((k, i) => box.appendChild(kaartHtml(k, i + 1, totaal, true)));
    if (!kaarten.length) box.appendChild(el('p', 'note', 'Nog geen kaarten. Bezoek een gebouw.'));
  }
  function menu(open) { $('menu').hidden = !open; }

  return { $, el, toon, kaartZichtbaar, typ, maakAf, isTypend: () => !!typer, dialoog, keuzes, effect, kaart, opdracht, opdrachtWaarde, hud, locatie, nav, avatars, startWaarden, vinkLijst, selectVul, kaartenLijst, menu };
})();
