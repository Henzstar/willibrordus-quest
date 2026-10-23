// Korte WebAudio-bliepjes. Standaard uit; aan te zetten via het menu. Geen bestanden.
const WQSfx = (() => {
  'use strict';
  let aan = false, ac = null;
  function toon(freq, duur, type) {
    if (!aan) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type || 'square'; o.frequency.value = freq;
      g.gain.value = 0.04; g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duur);
      o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + duur);
    } catch (e) { /* geen geluid is geen probleem */ }
  }
  return {
    isAan: () => aan,
    zet: v => { aan = !!v; if (aan) toon(660, 0.08); },
    tik: () => toon(880, 0.04),
    stap: () => toon(220, 0.03, 'triangle'),
    omhoog: () => { toon(523, 0.1); setTimeout(() => toon(784, 0.15), 90); },
    omlaag: () => { toon(392, 0.12); setTimeout(() => toon(262, 0.2), 100); },
    kaart: () => { toon(659, 0.08); setTimeout(() => toon(880, 0.08), 80); setTimeout(() => toon(1175, 0.16), 160); },
  };
})();
