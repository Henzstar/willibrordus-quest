// Punten: telt op uit de state. Tijdbonus komt van het bord (fase 2) en staat hier alleen als label.
const WQScore = (() => {
  'use strict';
  let C;
  function delen(S) {
    const s = C.score, som = o => Object.values(o || {}).reduce((a, b) => a + b, 0);
    const kaarten = S.bezocht.filter(id => C.locaties.find(l => l.id === id && l.soort === 'dilemma')).length;
    return {
      dilemma: som(S.punten.dilemma), kaart: kaarten * s.kaart, minigame: som(S.punten.minigame), discussie: som(S.punten.discussie),
      zelfcheck: S.zelfcheckGedaan ? s.zelfcheck : 0, agenda: S.agendaGedaan ? s.agenda : 0, tijd: S.tijdbonus || 0,
    };
  }
  const totaal = S => Object.values(delen(S)).reduce((a, b) => a + b, 0);
  const maxVoor = { dilemma: () => 8 * C.score.dilemmaMax, kaart: () => 8 * C.score.kaart, minigame: () => 4 * C.score.minigameMax, discussie: () => 3 * C.score.discussie, zelfcheck: () => C.score.zelfcheck, agenda: () => C.score.agenda, tijd: () => C.score.tijdbonus[0] };
  return { init: c => { C = c; }, delen, totaal, maxVoor: k => maxVoor[k](), labels: () => C.score.labels };
})();
