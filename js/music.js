// Chiptune-muziek via WebAudio: een kleine sequencer met per gebied een eigen deuntje. Standaard aan, uit te zetten in het menu.
const WQMuziek = (() => {
  'use strict';
  // Tokens per kanaal: noot (C4, F#3), '-' rust, '~' aanhouden. Drums: k kick, s snare, h hihat, '-' niets. stap = beats per token.
  const TRACKS = {
    landgoed: { bpm: 118, stap: 0.5, lead: 'E5 ~ G5 ~ A5 ~ G5 E5 D5 ~ E5 ~ C5 ~ ~ - E5 ~ G5 ~ B5 ~ A5 G5 E5 ~ D5 ~ C5 ~ ~ -', bass: 'C3 - G3 - A2 - E3 - F2 - C3 - G2 - G3 - C3 - G3 - A2 - E3 - F2 - F3 - G2 - B2 -', arp: 'C4 E4 G4 E4 A3 C4 E4 C4 F3 A3 C4 A3 G3 B3 D4 B3 C4 E4 G4 E4 A3 C4 E4 C4 F3 A3 C4 A3 G3 B3 D4 B3', drums: 'k - h - s - h - k - h - s - h h k - h - s - h - k - h - s - h h' },
    restaurant: { bpm: 108, stap: 0.5, lead: 'A4 C5 E5 ~ D5 C5 A4 ~ G4 B4 D5 ~ C5 B4 G4 ~ F4 A4 C5 ~ E5 ~ D5 C5 E4 G4 B4 ~ C5 ~ ~ -', bass: 'A2 - E3 - G2 - D3 - F2 - C3 - E2 - E3 - A2 - E3 - G2 - D3 - F2 - C3 - E2 - G#2 -', arp: 'A3 C4 E4 C4 G3 B3 D4 B3 F3 A3 C4 A3 E3 G#3 B3 G#3 A3 C4 E4 C4 G3 B3 D4 B3 F3 A3 C4 A3 E3 G#3 B3 G#3', drums: 'k - h h s - h - k - h h s - h h k - h h s - h - k - h h s - h -' },
    kantoor: { bpm: 88, stap: 0.5, lead: 'E4 ~ ~ G4 ~ ~ A4 ~ ~ ~ G4 ~ E4 ~ ~ - D4 ~ ~ E4 ~ ~ C4 ~ ~ ~ ~ ~ - - - -', bass: 'A2 - - - A2 - - - F2 - - - F2 - - - C3 - - - C3 - - - G2 - - - G2 - - -', arp: 'A3 C4 E4 - C4 E4 A4 - F3 A3 C4 - A3 C4 F4 - C4 E4 G4 - E4 G4 C5 - G3 B3 D4 - B3 D4 G4 -', drums: 'k - - - h - - - k - - - h - - - k - - - h - - - k - - h h - - -' },
    kliniek: { bpm: 100, stap: 0.5, lead: 'D5 ~ ~ ~ F5 ~ E5 ~ D5 ~ ~ ~ - - - - C5 ~ ~ ~ D5 ~ A4 ~ Bb4 ~ ~ ~ A4 ~ ~ -', bass: 'D2 - D2 - D2 - D2 - Bb1 - Bb1 - Bb1 - Bb1 - C2 - C2 - C2 - C2 - A1 - A1 - A1 - A1 -', arp: 'D3 F3 A3 F3 D3 F3 A3 F3 Bb2 D3 F3 D3 Bb2 D3 F3 D3 C3 E3 G3 E3 C3 E3 G3 E3 A2 C#3 E3 C#3 A2 C#3 E3 C#3', drums: 'k - - h k - - h k - - h k - s h k - - h k - - h k - - h k - s s' },
    kas: { bpm: 96, stap: 0.5, lead: 'G4 ~ B4 ~ D5 ~ ~ ~ E5 ~ D5 ~ B4 ~ ~ ~ C5 ~ B4 ~ A4 ~ ~ ~ G4 ~ ~ ~ ~ ~ ~ -', bass: 'G2 - - - D3 - - - E2 - - - B2 - - - C3 - - - G2 - - - D3 - - - G2 - - -', arp: 'G3 B3 D4 B3 G3 B3 D4 B3 E3 G3 B3 G3 E3 G3 B3 G3 C4 E4 G4 E4 C4 E4 G4 E4 D4 F#4 A4 F#4 D4 F#4 A4 F#4', drums: '- - h - - - h - - - h - - - h - - - h - - - h - - - h - - - h -' },
    bouw: { bpm: 128, stap: 0.5, lead: 'E5 E5 - E5 G5 - E5 - D5 D5 - D5 E5 - D5 - C5 C5 - C5 D5 - C5 - B4 ~ ~ ~ - - - -', bass: 'E2 E2 E3 E2 E2 E2 E3 E2 D2 D2 D3 D2 D2 D2 D3 D2 C2 C2 C3 C2 C2 C2 C3 C2 B1 B1 B2 B1 B1 B1 B2 B1', arp: '- E4 - G4 - E4 - B4 - D4 - F#4 - D4 - A4 - C4 - E4 - C4 - G4 - B3 - D4 - B3 - F#4', drums: 'k h h h s h h h k h h h s h k k k h h h s h h h k h h h s h s s' },
    spreekkamer: { bpm: 80, stap: 0.5, lead: 'C5 ~ ~ ~ E5 ~ ~ ~ D5 ~ ~ B4 ~ ~ ~ ~ A4 ~ ~ ~ C5 ~ ~ ~ B4 ~ ~ ~ G4 ~ ~ ~', bass: 'C3 - - - - - - - G2 - - - - - - - A2 - - - - - - - E2 - - - - - - -', arp: 'C4 E4 G4 E4 C4 E4 G4 E4 B3 D4 G4 D4 B3 D4 G4 D4 A3 C4 E4 C4 A3 C4 E4 C4 E3 G3 B3 G3 E3 G3 B3 G3', drums: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -' },
    koepel: { bpm: 66, stap: 1, lead: 'C5 ~ E5 ~ G5 ~ ~ ~ F5 ~ E5 ~ D5 ~ ~ ~ E5 ~ G5 ~ C6 ~ ~ ~ B5 ~ G5 ~ C5 ~ ~ ~', bass: 'C2 ~ ~ ~ G2 ~ ~ ~ F2 ~ ~ ~ G2 ~ ~ ~ C2 ~ ~ ~ E2 ~ ~ ~ G2 ~ ~ ~ C2 ~ ~ ~', arp: 'E3 ~ G3 ~ B3 ~ G3 ~ A3 ~ C4 ~ B3 ~ D4 ~ C4 ~ E4 ~ G4 ~ E4 ~ D4 ~ G4 ~ E4 ~ C4 ~', drums: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', orgel: true },
    begraafplaats: { bpm: 60, stap: 1, lead: 'A4 ~ ~ ~ C5 ~ B4 ~ A4 ~ ~ ~ - - - - E4 ~ ~ ~ G4 ~ F4 ~ E4 ~ ~ ~ - - - -', bass: 'A2 ~ ~ ~ ~ ~ ~ ~ F2 ~ ~ ~ ~ ~ ~ ~ C3 ~ ~ ~ ~ ~ ~ ~ E2 ~ ~ ~ ~ ~ ~ ~', arp: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', drums: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -' },
    minigame: { bpm: 150, stap: 0.5, lead: 'C5 E5 G5 E5 C5 E5 G5 A5 F5 A5 C6 A5 G5 ~ E5 ~ D5 F5 A5 F5 D5 F5 A5 B5 G5 B5 D6 B5 C6 ~ ~ -', bass: 'C2 C3 C2 C3 C2 C3 C2 C3 F2 F3 F2 F3 G2 G3 G2 G3 D2 D3 D2 D3 D2 D3 D2 D3 G2 G3 G2 G3 C2 C3 C2 C3', arp: 'E4 - G4 - E4 - G4 - A4 - C5 - B4 - D5 - F4 - A4 - F4 - A4 - B4 - D5 - E5 - G5 -', drums: 'k h s h k h s h k h s h k h s s k h s h k h s h k h s h k k s s' },
    einde: { bpm: 112, stap: 0.5, lead: 'C5 ~ C5 ~ C5 ~ E5 ~ G5 ~ ~ ~ E5 ~ G5 ~ C6 ~ ~ ~ ~ ~ ~ ~ B5 ~ C6 ~ ~ ~ ~ ~', bass: 'C2 - G2 - C2 - G2 - C2 - G2 - E2 - G2 - C3 - G2 - E2 - G2 - G2 - G2 - C2 - - -', arp: 'E4 G4 C5 G4 E4 G4 C5 G4 E4 G4 C5 G4 G4 B4 D5 B4 C5 E5 G5 E5 C5 E5 G5 E5 D5 F5 G5 F5 E5 G5 C6 -', drums: 'k - s - k - s - k - s - k k s - k - s - k - s - k - s - k k s s' },
  };
  let ac = null, master = null, aan = true, huidig = null, timer = null, stapIndex = 0, volgende = 0, noise = null, fadeTimer = null;
  const NOTEN = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function freq(tok) { const m = /^([A-G])(#|b)?(\d)$/.exec(tok); if (!m) return 0; const n = NOTEN[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (parseInt(m[3], 10) + 1) * 12; return 440 * Math.pow(2, (n - 69) / 12); }
  function maak() {
    if (ac) return;
    ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
    noise = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate); const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  function toon(type, f, t, duur, vol, orgel) {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + (orgel ? 0.08 : 0.01)); g.gain.exponentialRampToValueAtTime(orgel ? vol * 0.8 : vol * 0.3, t + duur * 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + duur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + duur + 0.02);
  }
  function drum(ch, t) {
    if (ch === 'k') { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15); o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.16); }
    else { const s = ac.createBufferSource(), g = ac.createGain(), fl = ac.createBiquadFilter(); s.buffer = noise; fl.type = 'highpass'; fl.frequency.value = ch === 'h' ? 7000 : 1800; g.gain.setValueAtTime(ch === 'h' ? 0.08 : 0.25, t); g.gain.exponentialRampToValueAtTime(0.001, t + (ch === 'h' ? 0.04 : 0.12)); s.connect(fl); fl.connect(g); g.connect(master); s.start(t); s.stop(t + 0.15); }
  }
  function plan() {
    const tr = TRACKS[huidig]; if (!tr) return;
    const sec = 60 / tr.bpm * tr.stap, kanalen = { lead: tr.lead.split(' '), bass: tr.bass.split(' '), arp: tr.arp.split(' '), drums: tr.drums.split(' ') };
    const len = kanalen.lead.length;
    while (volgende < ac.currentTime + 0.25) {
      const i = stapIndex % len, t = volgende;
      const speel = (naam, type, vol, oct) => { const tok = kanalen[naam][i % kanalen[naam].length]; if (!tok || tok === '-' || tok === '~') return; let n = 1; while (kanalen[naam][(i + n) % kanalen[naam].length] === '~') n++; toon(type, freq(tok) * (oct || 1), t, sec * n * 0.95, vol, tr.orgel); };
      speel('lead', tr.orgel ? 'sine' : 'square', tr.orgel ? 0.12 : 0.07); speel('bass', 'triangle', 0.16); speel('arp', tr.orgel ? 'sine' : 'square', tr.orgel ? 0.07 : 0.025);
      const d = kanalen.drums[i % kanalen.drums.length]; if (d && d !== '-') drum(d, t);
      stapIndex++; volgende += sec;
    }
  }
  function speel(key) {
    if (!TRACKS[key] || key === huidig) return;
    huidig = key; stapIndex = 0;
    if (!aan) return;
    try { maak(); } catch (e) { return; }
    if (ac.state === 'suspended') ac.resume();
    volgende = ac.currentTime + 0.05;
    master.gain.cancelScheduledValues(ac.currentTime); master.gain.setValueAtTime(master.gain.value, ac.currentTime); master.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.15); master.gain.linearRampToValueAtTime(0.5, ac.currentTime + 0.6);
    if (!timer) timer = setInterval(() => { if (aan && huidig) plan(); }, 60);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } if (master) master.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.3); huidig = null; }
  function zet(v) {
    aan = !!v; try { localStorage.setItem('wq.muziek', aan ? '1' : '0'); } catch (e) { /* niets */ }
    if (!aan) { if (timer) { clearInterval(timer); timer = null; } if (master) master.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.2); }
    else if (huidig) { const k = huidig; huidig = null; speel(k); }
  }
  try { aan = localStorage.getItem('wq.muziek') !== '0'; } catch (e) { /* standaard aan */ }
  return { speel, stop, zet, isAan: () => aan, huidig: () => huidig, tracks: () => Object.keys(TRACKS) };
})();
