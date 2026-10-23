import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const C = require('../js/content.js');
const MAP = C.tilemap;
const W = 48, H = 22;
const walk = (x, y) => y >= 0 && y < H && x >= 0 && x < W && C.legenda[MAP[y][x]].begaanbaar;

function reachable(from) {
  const seen = new Set([from.join(',')]);
  const q = [from];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
      if (walk(nx, ny) && !seen.has(k)) { seen.add(k); q.push([nx, ny]); }
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

test('negen locaties met unieke ids, start eerst', () => {
  assert.equal(C.locaties.length, 9);
  assert.equal(C.locaties[0].id, 'start');
  const ids = new Set(C.locaties.map(l => l.id));
  assert.equal(ids.size, 9);
});

test('elke locatietegel is begaanbaar en bereikbaar vanaf de start', () => {
  const start = C.locaties[0].tegel;
  const seen = reachable(start);
  for (const l of C.locaties) {
    assert.ok(walk(...l.tegel), l.id + ' tegel niet begaanbaar');
    assert.ok(seen.has(l.tegel.join(',')), l.id + ' niet bereikbaar');
    assert.equal(Math.abs(l.npcTegel[0] - l.tegel[0]) + Math.abs(l.npcTegel[1] - l.tegel[1]), 1, l.id + ' npc niet naast de marker');
  }
});

test('elk gebouw heeft een dilemma met 3 opties met effect, en een kaart met bron', () => {
  for (const l of C.locaties.slice(1)) {
    assert.ok(l.dilemma && l.dilemma.vraag, l.id + ' zonder vraag');
    assert.equal(l.dilemma.opties.length, 3, l.id);
    for (const o of l.dilemma.opties) {
      assert.ok(o.tekst && o.gevolg, l.id + ' optie onvolledig');
      assert.equal(typeof o.effect, 'number', l.id + ' effect ontbreekt');
      assert.ok(Math.abs(o.effect) <= 15);
    }
    assert.ok(l.kaart && l.kaart.titel && l.kaart.tekst && l.kaart.bron, l.id + ' kaart onvolledig');
    assert.ok(l.npc && l.npc.naam && l.npc.rol && l.npc.kleur, l.id + ' npc onvolledig');
    assert.ok(l.intro.length >= 1 && l.intro.length <= 4, l.id + ' intro');
  }
});

test('zelfcheck, agenda, avatars en profielen zijn compleet', () => {
  assert.equal(C.zelfcheck.items.length, 6);
  assert.equal(C.avatars.length, 4);
  assert.equal(C.agenda.eigenaren.length, 6);
  assert.ok(C.agenda.organisatieOpties.length >= 7);
  assert.equal(C.profielen[0].min, 0);
  assert.equal(C.profielen[C.profielen.length - 1].max, 100);
  for (let i = 1; i < C.profielen.length; i++) assert.equal(C.profielen[i].min, C.profielen[i - 1].max + 1);
});
