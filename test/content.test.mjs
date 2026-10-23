import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const C = require('../js/content.js');
const MAP = C.tilemap;
const W = 48, H = 22;
const walk = (x, y) => y >= 0 && y < H && x >= 0 && x < W && C.legenda[MAP[y][x]].begaanbaar;
const DILEMMA = C.locaties.filter(l => l.soort === 'dilemma');
const DISCUSSIE = C.locaties.filter(l => l.soort === 'discussie');

function reachable(from, isWalk) {
  const seen = new Set([from.join(',')]);
  const q = [from];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
      if (isWalk(nx, ny) && !seen.has(k)) { seen.add(k); q.push([nx, ny]); }
    }
  }
  return seen;
}

test('tilemap is 22 rijen van 48 tekens met bekende tekens', () => {
  assert.equal(MAP.length, H);
  for (const row of MAP) {
    assert.equal(row.length, W, row);
    for (const ch of row) assert.ok(C.legenda[ch], 'onbekend teken ' + ch);
  }
});

test('twaalf locaties met unieke ids: start, acht dilemma, drie discussie', () => {
  assert.equal(C.locaties.length, 12);
  assert.equal(C.locaties[0].id, 'start');
  assert.equal(DILEMMA.length, 8);
  assert.equal(DISCUSSIE.length, 3);
  assert.equal(new Set(C.locaties.map(l => l.id)).size, 12);
  assert.deepEqual([...C.route].sort(), C.locaties.slice(1).map(l => l.id).sort());
});

test('elke deur is begaanbaar, bereikbaar vanaf de start en ligt onder een gebouw', () => {
  const seen = reachable(C.locaties[0].tegel, walk);
  for (const l of C.locaties) {
    const [x, y] = l.tegel;
    assert.ok(walk(x, y), l.id + ' deur niet begaanbaar');
    assert.ok(seen.has(x + ',' + y), l.id + ' niet bereikbaar');
    if (l.id !== 'start') assert.ok('BKGN'.includes(MAP[y - 1][x]), l.id + ' deur niet onder een gebouw');
  }
  for (const f of C.figuranten) for (const t of f.route) assert.ok(walk(...t), f.naam + ' route niet begaanbaar');
  for (const p of C.props) { const [x, y] = p.tegel; assert.ok(x >= 0 && x < W && y >= 0 && y < H, p.type + ' buiten de kaart'); }
});

test('elke binnenkaart is rechthoekig, met één deur, bereikbare NPC-buur en begaanbare start', () => {
  for (const l of C.locaties.slice(1)) {
    const b = l.binnen, bw = b.kaart[0].length;
    assert.ok(b && b.kaart.length >= 6, l.id + ' zonder binnenkaart');
    for (const row of b.kaart) { assert.equal(row.length, bw, l.id); for (const ch of row) assert.ok(C.binnenLegenda[ch] !== undefined, l.id + ' onbekend teken ' + ch); }
    const deuren = b.kaart.join('').split('D').length - 1;
    assert.equal(deuren, 1, l.id + ' deuren');
    const isWalk = (x, y) => y >= 0 && y < b.kaart.length && x >= 0 && x < bw && C.binnenBegaanbaar.includes(b.kaart[y][x]);
    assert.ok(isWalk(...b.start), l.id + ' start niet begaanbaar');
    const seen = reachable(b.start, isWalk);
    const [nx, ny] = b.npc;
    assert.ok(isWalk(nx, ny), l.id + ' npc niet op vloer');
    const buur = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => seen.has((nx + dx) + ',' + (ny + dy)));
    assert.ok(buur, l.id + ' npc niet bereikbaar');
  }
});

test('dilemma: vier opties met punten en effect, kaart met bron; discussie: vier opties en natekst', () => {
  for (const l of DILEMMA) {
    assert.equal(l.dilemma.opties.length, 4, l.id);
    const punten = l.dilemma.opties.map(o => o.punten);
    assert.ok(punten.includes(C.score.dilemmaMax), l.id + ' zonder beste optie');
    assert.ok(punten.includes(0), l.id + ' zonder slechtste optie');
    for (const o of l.dilemma.opties) {
      assert.ok(o.tekst && o.gevolg, l.id + ' optie onvolledig');
      assert.equal(typeof o.effect, 'number'); assert.equal(typeof o.punten, 'number');
      assert.ok(o.punten >= 0 && o.punten <= C.score.dilemmaMax);
    }
    assert.ok(l.kaart && l.kaart.titel && l.kaart.tekst && l.kaart.bron, l.id + ' kaart onvolledig');
    if (l.minigame) assert.ok(C.minigames[l.minigame], l.id + ' onbekende minigame');
  }
  for (const l of DISCUSSIE) {
    assert.equal(l.discussie.opties.length, 4, l.id);
    assert.ok(l.discussie.vraag && l.discussie.argument && l.discussie.na, l.id);
    assert.ok(!l.kaart && !l.minigame);
  }
  for (const l of C.locaties.slice(1)) {
    assert.ok(l.npc && l.npc.naam && l.npc.rol && l.npc.look, l.id + ' npc onvolledig');
    assert.ok(l.intro.length >= 1 && l.intro.length <= 4, l.id + ' intro');
  }
});

test('score telt op tot het maximum; minigames compleet', () => {
  const s = C.score, mg = C.minigames;
  const totaal = 8 * s.dilemmaMax + 8 * s.kaart + 4 * s.minigameMax + 3 * s.discussie + s.zelfcheck + s.agenda + s.tijdbonus[0];
  assert.equal(totaal, s.max);
  assert.equal(Object.keys(mg).length, 4);
  assert.equal(mg.noodkoffer.rondes * mg.noodkoffer.puntenPerRonde, s.minigameMax);
  assert.equal(mg.dicteer.zinnen.flatMap(z => z.woorden).filter(w => !w[1]).length * mg.dicteer.hit, s.minigameMax);
  assert.equal(mg.bowlen.kegels.length * mg.bowlen.worpen * mg.bowlen.puntenPerKegel, s.minigameMax);
  assert.equal(mg.boogschieten.pijlen * mg.boogschieten.ringen[0], s.minigameMax);
  assert.equal(C.zelfcheck.items.length, 6);
  assert.equal(C.avatars.length, 4);
  for (let i = 1; i < C.profielen.length; i++) assert.equal(C.profielen[i].min, C.profielen[i - 1].max + 1);
});
