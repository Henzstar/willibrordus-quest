// Verzending naar het live bord (Firebase Realtime Database via REST). Nooit blokkerend; fouten stil.
const WQBoard = (() => {
  'use strict';
  let cfg = null, laatste = 0, wacht = null, laatsteJson = '';
  const actief = () => !!(cfg && cfg.boardEnabled && cfg.firebaseUrl && cfg.eventId);
  const url = id => cfg.firebaseUrl.replace(/\/$/, '') + '/events/' + encodeURIComponent(cfg.eventId) + '/players/' + encodeURIComponent(id) + '.json';
  function pak(S, punten, locatie) {
    return {
      naam: String(S.naam).slice(0, 20), avatar: S.avatar, modus: S.modus, regie: S.regie, punten,
      bezocht: S.bezocht.slice(0, 16), keuzes: S.keuzes, argumenten: S.argumenten, ergernis: S.ergernis.slice(0, 60),
      zelfcheck: S.zelfcheck, agenda: { zelf: S.agenda.zelf.slice(0, 120), org: S.agenda.org.slice(0, 120), eigenaar: S.agenda.eigenaar.slice(0, 40) },
      locatie: locatie || 'buiten', tegel: S.hero, klaarOp: S.klaarOp || null, gestart: S.gestart, fase: S.fase, bijgewerkt: Date.now(),
    };
  }
  function verstuur(S, punten, locatie) {
    if (!actief() || !S) return;
    const body = JSON.stringify(pak(S, punten, locatie));
    if (body === laatsteJson) return;
    const doe = () => {
      laatste = Date.now(); laatsteJson = body;
      try { fetch(url(S.playerId), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {}); } catch (e) { /* stil */ }
    };
    const sinds = Date.now() - laatste;
    if (sinds > 1500) doe(); else { clearTimeout(wacht); wacht = setTimeout(doe, 1500 - sinds); }
  }
  return { init: c => { cfg = c; }, verstuur, actief };
})();
