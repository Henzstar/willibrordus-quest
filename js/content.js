// Alle teksten en data van Willibrordus Quest. Geen logica.
// Tekst met [TJEERD: ...] wordt later door Tjeerd ingevuld; laat die plekken letterlijk staan.
const CONTENT = {
  titel: 'Willibrordus Quest',
  ondertitel: 'Wie stuurt?',
  organisatie: 'GGZ Noord-Holland-Noord',

  // Tilemap: 64 kolommen bij 36 rijen, noord is boven. Naar de plattegrond van Landgoed Willibrordus (nummer 11 = begraafplaats).
  tilemap: [
    '................................................................',
    '================================================================',
    '.=..WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW...................WW.=',
    '.=...........................SSSSSSSSSSS....BB.BB.BB........WW.=',
    '.=...T.......................SNNSNNNSNNS..T.BB.BB.BB........WW.=',
    '.=.T.TTT.BBB....BBBBB..BB....SNNNNNNNNNS.T..BBBBBBBB........WW.=',
    '.=.TTT.T.BBBBBBBBBBBB..BB.TT.SNNNNNNNNNS.T..BBBBBBBB.GGGG...WW.=',
    '.=.T.TT..BBBBBBBBBBBBBBBB.TT.SNNNNNNNNNS.T..BBBBBBBB.GGGG...WW.=',
    '.=.TTTTT.BBBBBBBBBBBBBBBB....SNNNNNNNNNS....BBBBBBBB.GGGG...WW.=',
    '.=.TTTTT.BBBBBBBBBBBBBBBB..T.SNNNNNNNNNS....BBBBBBBB.GGGG...WW.=',
    '.=...T.......-.......-.......SSSSSSSSSSS================-==++++=',
    '.=.....=-=============================-==...............-.BBWW.=',
    '.=...TT.-BBBBBBB.PPPPPPP............BB-.HHHHHHH...BBBBBB-.BBWW.=',
    '.=..T.T.-BBBBBBB.PPPPPPP...T.T..T.T.BB-.HCCCCCH...BBBBBB-PP.WW.=',
    '.=......-..BBBBB.......-..............--------H...BBBBBB-PP.WW.=',
    '.=-------------------------------------.HCCCCCH...BBBBBB-...WW.=',
    '.=.............-.......-WW............-.HHHHHHH...BBBBBB-.BBWW.=',
    '.=..BBBBBBBOO..-.......-WW............-------------------.BBWW.=',
    '.=WWBBBBBBBOO..-.BBBBB.-WW......BBBBB.-.DDDDDDD.........-.BBWW.=',
    '.=WWBBBBBBBKKK.-.BBBBB.-WW......BBBBBP-.DDDDDDD......PP.-...WW.=',
    '.=..BBBBBBBKKK.-.BBBBB.-WW.BBBBBBBBBBP-.BB.B.BBHHHHHHHHH-FFFWW.=',
    '.=..BBBBBBBKKK.-.BBBBB.-WW.BBBBBBBBBB.-.BBBBBBBAAAAAAAAA-FFFWW.=',
    '.=WWBBBBBBB.-..-.BBBBB.-WW.BBWWWBBBBB.-.BBBBBBBAAAAAAAAA-FFFWW.=',
    '.=WWBBBBBBB.-..-...-...-.T.BBWWW..-...-.BBBBBBBAAAAAAAAA-FFFWW.=',
    '.=..BBBBBBB-----------.-..T.-...T.-...-.BBBBBBBAAAAAAAAA-FFFWW.=',
    '.=..BBBBBBB..........-.-....-.....-...-....-...AAAAAAAAA-FFFWW.=',
    '.=.T......-.PPP....T.------------------------------------...WW.=',
    '.=.TT...BBBBBBB.T.TTT.....BBBBBBBB..............BBBBBBB.....WW.=',
    '.=.TTTT.BBBBBBB.TTT.T.....BBBBBBBB....TTTT..TTT.BBBBBBB.....WW.=',
    '.=.TT.T.BBBBBBB.T.........BBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWW.=',
    '.=.TTTT...-....T.T...........-.WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW.=',
    '.=..TTT.BBBBBB..TT.---BBB---------..BBBBBBBBB..TTT...T......WW.=',
    '.=.T....BBBBBB..TT.-..BBB...........BBBBBBBBB....TT.T.......WW.=',
    '.=......BBBBBB..TWW+WWBBB...........BBBBBBBBB....TTTT.......WW.=',
    '.=........-......WW+WW............................T............=',
    '.====================..........................................=',
  ],

  legenda: {
    '=': { naam: 'asfalt', begaanbaar: true },
    '-': { naam: 'pad', begaanbaar: true },
    '.': { naam: 'gras', begaanbaar: true },
    'P': { naam: 'parkeren', begaanbaar: true },
    'S': { naam: 'bouwzand', begaanbaar: true },
    'T': { naam: 'boom', begaanbaar: false },
    'W': { naam: 'water', begaanbaar: false },
    'B': { naam: 'gebouw', begaanbaar: false },
    'K': { naam: 'Cultuurkoepel', begaanbaar: false },
    'G': { naam: 'witte hal / kas', begaanbaar: false },
    'N': { naam: 'nieuwbouw', begaanbaar: false },
    'F': { naam: 'akker', begaanbaar: false },
    'A': { naam: 'sportveld', begaanbaar: true },
    '+': { naam: 'brug', begaanbaar: true },
    'H': { naam: 'heg', begaanbaar: false },
    'C': { naam: 'graven', begaanbaar: false },
    'D': { naam: 'dierenweide', begaanbaar: false },
    'O': { naam: 'fontein', begaanbaar: false },
  },

  // Binnenkaarten (vloer: tegel, hout, lino of beton): # muur, w raam, . vloer, _ hout, r kleed (begaanbaar), D deur (uitgang), d bureau, m bureau met scherm,
  // c stoel, t tafel, b bed, p plant, s kast, k balie/aanrecht, P bank, x kist, B whiteboard, S podium, o orgel, l lamp, f koffieautomaat, q schilderij (op de bovenmuur). Alles behalve . _ r D blokkeert.
  binnenLegenda: { '#': 'muur', 'w': 'raam', 'q': 'schilderij', '.': 'vloer', '_': 'hout', 'r': 'kleed', 'D': 'deur', 'd': 'bureau', 'm': 'scherm', 'c': 'stoel', 't': 'tafel', 'b': 'bed', 'p': 'plant', 's': 'kast', 'k': 'balie', 'P': 'bank', 'x': 'kist', 'B': 'whiteboard', 'S': 'podium', 'o': 'orgel', 'l': 'lamp', 'f': 'koffie', 'F': 'portret Freud', 'J': 'portret Jos Brinkmann', 'U': 'buste Willibrordus', 'V': 'VR-bril', 'Z': 'bierposter', 'R': 'kledingrek' },
  binnenBegaanbaar: ['.', '_', 'r', 'D'],

  // Straatnamen als kleine labels; richting h = horizontaal, v = verticaal; tegel = ankertegel.
  straten: [
    { naam: 'Kanaalweg', tegel: [28, 1], richting: 'h' },
    { naam: 'Kennemerstraatweg', tegel: [1, 26], richting: 'v' },
    { naam: 'De Strandwal', tegel: [25, 11], richting: 'h' },
    { naam: 'De Bullaan', tegel: [41, 10], richting: 'h' },
    { naam: 'Rosendaal', tegel: [63, 20], richting: 'v' },
    { naam: 'De Olvendijk', tegel: [17, 15], richting: 'h' },
    { naam: 'Het Landpad', tegel: [23, 19], richting: 'v' },
    { naam: 'De Hooge Venne', tegel: [38, 20], richting: 'v' },
    { naam: 'De Overtoom', tegel: [24, 26], richting: 'h' },
    { naam: 'Het Kerkpad', tegel: [15, 18], richting: 'v' },
    { naam: 'Het Dije', tegel: [8, 12], richting: 'v' },
    { naam: 'De Kroft', tegel: [22, 31], richting: 'h' },
    { naam: 'Ypesteinerlaan', tegel: [6, 35], richting: 'h' },
    { naam: 'Begraafplaats (11)', tegel: [40, 17], richting: 'h' },
    { naam: 'Sportveld', tegel: [49, 23], richting: 'h' },
    { naam: 'Dierenweide', tegel: [47, 18], richting: 'h' },
    { naam: 'Evenementenveld', tegel: [25, 19], richting: 'h' },
  ],

  // Naamborden op gebouwen zonder deur-locatie (tegel = onderste gevelrij).
  borden: [
    { tegel: [51, 16], naam: 'Maatwerk' },
    { tegel: [58, 18], naam: 'De Trog' },
    { tegel: [10, 29], naam: 'Kapelbuurt' },
    { tegel: [37, 13], naam: 'Nr 10' },
  ],

  // Losse decoratie buiten: type en tegel.
  props: [
    { type: 'lantaarn', tegel: [10, 15] }, { type: 'lantaarn', tegel: [18, 15] }, { type: 'lantaarn', tegel: [26, 15] }, { type: 'lantaarn', tegel: [34, 15] }, { type: 'lantaarn', tegel: [42, 17] }, { type: 'lantaarn', tegel: [50, 17] },
    { type: 'lantaarn', tegel: [14, 24] }, { type: 'lantaarn', tegel: [30, 26] }, { type: 'lantaarn', tegel: [40, 26] }, { type: 'lantaarn', tegel: [50, 26] }, { type: 'lantaarn', tegel: [38, 12] }, { type: 'lantaarn', tegel: [23, 17] },
    { type: 'bank', tegel: [9, 16] }, { type: 'bank', tegel: [16, 16] }, { type: 'bank', tegel: [37, 21] }, { type: 'bank', tegel: [46, 19] }, { type: 'bank', tegel: [2, 17] }, { type: 'bank', tegel: [44, 15] }, { type: 'bank', tegel: [57, 19] }, { type: 'bank', tegel: [26, 23] },
    { type: 'bloemen', tegel: [12, 16] }, { type: 'bloemen', tegel: [16, 11] }, { type: 'bloemen', tegel: [25, 10] }, { type: 'bloemen', tegel: [40, 11] }, { type: 'bloemen', tegel: [52, 11] }, { type: 'bloemen', tegel: [14, 25] }, { type: 'bloemen', tegel: [33, 24] }, { type: 'bloemen', tegel: [45, 26] }, { type: 'bloemen', tegel: [7, 26] }, { type: 'bloemen', tegel: [31, 31] }, { type: 'bloemen', tegel: [57, 15] },
    { type: 'fontein', tegel: [16, 25] },
    { type: 'picknick', tegel: [48, 19] }, { type: 'picknick', tegel: [20, 17] }, { type: 'prullenbak', tegel: [14, 16] }, { type: 'prullenbak', tegel: [36, 24] }, { type: 'bushalte', tegel: [2, 14] },
    { type: 'auto', tegel: [17, 12], kleur: '#c9403a' }, { type: 'auto', tegel: [19, 12], kleur: '#3b5fa8' }, { type: 'auto', tegel: [22, 13], kleur: '#e8e8e8' }, { type: 'auto', tegel: [20, 13], kleur: '#55585e' }, { type: 'auto', tegel: [12, 26], kleur: '#2f7d32' }, { type: 'auto', tegel: [14, 27], kleur: '#e0a84a' }, { type: 'auto', tegel: [57, 13], kleur: '#c9403a' }, { type: 'auto', tegel: [36, 20], kleur: '#3b5fa8' },
    { type: 'kraan', tegel: [39, 4] }, { type: 'fietsen', tegel: [16, 12] }, { type: 'fietsen', tegel: [10, 11] }, { type: 'fietsen', tegel: [52, 17] }, { type: 'bord', tegel: [2, 16] }, { type: 'bord', tegel: [39, 12] }, { type: 'bord', tegel: [27, 25] },
  ],

  // Figuranten buiten: staan stil of lopen heen en weer over een route (begaanbare tegels).
  figuranten: [
    { naam: 'Ans', rol: 'cliëntenraad', look: { haar: '#d9d2c5', jas: '#b5443a', broek: '#3b3f4a', hoofd: 'kort' }, route: [[6, 15], [22, 15]], regels: [
      'Jullie praten vanavond over ons. Praat ook met ons.',
      'Mijn dossier is van mij. Dat is geen mening, dat is de wet.',
      'Ik wil de samenvatting lezen voordat jij hem tekent. Mag dat?',
      'Beeldbellen is fijn. Als ik het zelf kies.',
      'Als het EPD eruit ligt, lig ik er ook uit. Weet jij dan nog wat ik slik?',
      'Ben je al bij de begraafplaats geweest? Achter De Hooge Venne, nummer 11 op de plattegrond.',
    ] },
    { naam: 'Kees', rol: 'tuinman', look: { haar: '#6b4a2b', jas: '#2f7d32', broek: '#5a4632', hoofd: 'kort' }, route: [[41, 11], [50, 11]], regels: ['De heggen groeien harder dan de ICT-projecten. Maar die knip ik tenminste zelf.', 'De begraafplaats ligt hier achter de heg. Het hek zit aan de kant van De Hooge Venne.'] },
    { naam: 'Mo', rol: 'cliënt', look: { haar: '#1a1f1c', jas: '#6b7280', broek: '#3b3f4a', hoofd: 'knot' }, route: [[17, 16]], regels: ['Ik zit hier elke dag even. Het portaal zegt dat ik vandaag een afspraak heb. Niemand anders weet dat.'] },
    { naam: 'Bep', rol: 'portier', look: { haar: '#9fb3a6', jas: '#c9a24d', broek: '#3b3f4a', hoofd: 'bril' }, route: [[2, 15]], regels: ['De kaartknop boven in beeld laat zien waar nog vragen wachten. De Cultuurkoepel gaat als laatste open.'] },
    { naam: 'Riet', rol: 'vrijwilliger begraafplaats', look: { haar: '#f2f2f2', jas: '#4a4a4a', broek: '#2a2d35', hoofd: 'knot' }, route: [[44, 14]], regels: ['Hier liggen de mensen die hier woonden toen er nog geen dossier was. Alleen een naam en een nummer.'] },
    { naam: 'Daan', rol: 'verpleegkundige', look: { haar: '#6b4a2b', jas: '#f4f4f4', broek: '#3b3f4a', hoofd: 'kort' }, route: [[38, 18], [38, 25]], regels: ['Drie keer inloggen voor één recept. Ik tel het niet meer.'] },
    { naam: 'Sanne', rol: 'aios', look: { haar: '#e0a84a', jas: '#2b6cb0', broek: '#3b3f4a', hoofd: 'lang' }, route: [[9, 11], [30, 11]], regels: ['Ik heb vanmorgen de samenvatting gewoon getekend. Ja, ik weet het.'] },
    { naam: 'Piet', rol: 'cliënt, hardloper', look: { haar: '#1a1f1c', jas: '#e0a84a', broek: '#2a2d35', hoofd: 'kort' }, route: [[22, 26], [55, 26], [56, 12], [41, 10], [38, 15], [23, 15], [23, 25]], regels: ['Twee kilometer per rondje. Als het portaal net zo snel was als ik.'] },
  ],

  // Avatars: de perk doet niets, behalve lachen.
  avatars: [
    { id: 'aios', naam: 'De aios', perk: 'Perk: koffie telt als maaltijd. Doet verder niets.', jas: '#2b6cb0', haar: '#6b4a2b', broek: '#3b3f4a', hoofd: 'kort' },
    { id: 'psychiater', naam: 'De psychiater', perk: 'Perk: zucht met gezag. Geen effect op de score.', jas: '#1d6b4f', haar: '#9fb3a6', broek: '#2a2d35', hoofd: 'bril' },
    { id: 'vs', naam: 'De verpleegkundig specialist', perk: 'Perk: weet waar de formulieren liggen. Niemand vraagt het.', jas: '#b5443a', haar: '#1a1f1c', broek: '#3b3f4a', hoofd: 'lang' },
    { id: 'ondersteuner', naam: 'De ondersteuner', perk: 'Perk: heeft de agenda van iedereen. Behalve die van zichzelf.', jas: '#7a3e9d', haar: '#e0a84a', broek: '#3b3f4a', hoofd: 'knot' },
  ],

  profielen: [
    { min: 0, max: 34, naam: 'Speelbal', kort: 'Speelbal' },
    { min: 35, max: 64, naam: 'Meebeweger', kort: 'Meebeweger' },
    { min: 65, max: 84, naam: 'Stuurman of Stuurvrouw', kort: 'Stuurman/vrouw' },
    { min: 85, max: 100, naam: 'Kapitein', kort: 'Kapitein' },
  ],
  regieStart: 50,

  // Punten. Tijdbonus wordt alleen door het bord toegekend (fase 2), op volgorde van afronden.
  score: {
    max: 1000, kaart: 15, discussie: 25, minigameMax: 60, dilemmaMax: 50, zelfcheck: 25, agenda: 40,
    tijdbonus: [100, 80, 60, 40, 20], tijdbonusRest: 10,
    labels: { dilemma: 'Dilemma’s', kaart: 'Kaarten', minigame: 'Minigames', discussie: 'Discussie', zelfcheck: 'Zelfcheck', agenda: 'Agenda', tijd: 'Tijdbonus (via het bord)' },
  },

  // Aanbevolen route over het landgoed (ids van locaties).
  route: ['keuken', 'bestuur', 'poli', 'hic', 'venne', 'kwekerij', 'opname', 'olvendijk', 'team', 'olvendijk79', 'koepel'],
  laatste: 'koepel',

  // Locaties: tegel = deur (begaanbare tegel onder het gebouw). soort: dilemma, discussie, plek of grap. binnen: binnenkaart, start en npc-positie.
  locaties: [
    {
      id: 'start', naam: 'Hoofdingang', functie: 'start', tegel: [3, 15], soort: 'start', muziek: 'landgoed',
      npc: { naam: 'Bep', rol: 'portier', kleur: '#c9a24d', look: { haar: '#9fb3a6', jas: '#c9a24d', broek: '#3b3f4a', hoofd: 'bril' } },
      intro: [
        'Welkom op het landgoed. Je loopt vanavond over het hele terrein. Overal wacht een keuze. Je regie-meter laat zien of je stuurt, of gestuurd wordt.',
        'Tik op de kaart om te lopen. Bij een deur ga je naar binnen. De Cultuurkoepel gaat als laatste open. Wissel per gebouw wie de telefoon vasthoudt; de anderen eten.',
      ],
    },
    {
      id: 'keuken', naam: 'Keuken met Karakter', functie: 'restaurant', thema: 'werklast begint bij registratie', tegel: [13, 15], soort: 'dilemma', minigame: 'dicteer', muziek: 'restaurant',
      npc: { naam: 'Sam', rol: 'aios, bord bitterballen', kleur: '#2b6cb0', look: { haar: '#6b4a2b', jas: '#2b6cb0', broek: '#3b3f4a', hoofd: 'kort', extra: 'bord' } },
      binnen: { vloer: 'tegel', kaart: ['#w#q#Z###w#q#', '#kkkkkf.....#', '#...........#', '#.tt..tt..tt#', '#.cc..cc..cc#', '#.........pl#', '#.tt.....tt.#', '#.cc.....cc.#', '######D######'], start: [6, 7], npc: [6, 2] },
      intro: ['Acht gesprekken gehad, nul rapportages af. De AI-samenvattingen staan klaar. Eentje zit me dwars.'],
      dilemma: {
        vraag: 'In de AI-samenvatting van een gesprek staat: ‘cliënt overweegt te stoppen met lithium’. Dat heb jij niet gehoord. De rest klopt. Wat doe je?',
        opties: [
          { tekst: 'De zin schrappen en tekenen. Jij was erbij; jij weet wat er gezegd is.', punten: 15, effect: 0, gevolg: 'Verdedigbaar, maar je weet niet waar de zin vandaan kwam. Als de opname het wél bevat, heb je een signaal gemist en daarna gewist.' },
          { tekst: 'De opname op dat punt terugluisteren, dan pas schrappen of laten staan, en de correctie als correctie vastleggen.', punten: 50, effect: 10, gevolg: 'De cliënt zei ‘ik overweeg soms om met alles te stoppen’. Het model maakte er lithium van. Jij maakt er een suïcidaliteitsvraag voor morgen van.' },
          { tekst: 'De samenvatting ongetekend als concept laten staan tot je de cliënt morgen hebt gesproken.', punten: 0, effect: -10, gevolg: 'Een ongetekend concept met ‘stoppen met lithium’ staat vannacht in het dossier van de dienstdoende. Die leest het als feit.' },
          { tekst: 'De zin laten staan met de toevoeging ‘AI-gegenereerd, niet geverifieerd’.', punten: 30, effect: 5, gevolg: 'Eerlijk, maar een dossier is geen plek voor onbevestigde beweringen. Verantwoordelijkheid voor wat erin staat kun je niet delegeren aan een disclaimer.' },
        ],
      },
      kaart: {
        titel: 'Een AI-samenvatting is een concept. Jij leest, corrigeert en tekent.',
        tekst: 'Spraakgestuurd rapporteren bij GGZ NHN: [TJEERD: cijfers die publiek mogen, bijv. aantal behandelaren in de startfase en het aandeel dat meer werkplezier ervaart]. Twijfel je aan een zin, luister terug. Ongetekende concepten zijn voor collega’s niet van feiten te onderscheiden.',
        bron: 'GGZ NHN, startfase spraakgestuurd rapporteren 2026; WGBO art. 7:454 (dossierplicht).',
      },
    },
    {
      id: 'koepel', naam: 'Cultuurkoepel', functie: 'grote bijeenkomsten', thema: 'wie stuurt bij ons', tegel: [12, 22], soort: 'dilemma', muziek: 'koepel',
      npc: { naam: 'Henk', rol: 'voorzitter van een stuurgroep, bril, stapel papier', kleur: '#6b7280', look: { haar: '#9fb3a6', jas: '#6b7280', broek: '#2a2d35', hoofd: 'bril', extra: 'papier' } },
      binnen: { vloer: 'hout', kaart: ['#w#qw#U#wq#w#', '#..o.SSS.o..#', '#...........#', '#PPP..r..PPP#', '#PPP..r..PPP#', '#PPP..r..PPP#', '#s.........s#', '#p....r....p#', '######D######'], start: [6, 7], npc: [6, 2] },
      intro: [
        'Hier werd vroeger gebeden. Nu vergaderen we.',
        'Over elk digitaal initiatief in deze organisatie wordt ergens besloten. De vraag is of jij aan die tafel zit.',
      ],
      dilemma: {
        vraag: 'Je vakgroep wil een AI-scribe uitproberen die een collega elders ‘fantastisch’ vindt. De leverancier biedt drie maanden gratis, ‘geen contract nodig’. De stuurgroep digitalisering vergadert over zes weken. Wat doe je?',
        opties: [
          { tekst: 'Starten. Drie maanden gratis is een pilot, geen implementatie.', punten: 0, effect: -10, gevolg: 'Een pilot met echte cliëntgegevens is een verwerking. Gratis betekent dat er geen verwerkersovereenkomst is, en dus geen grondslag.' },
          { tekst: 'Starten met fictieve casussen zonder cliëntgegevens, en intussen aanmelden bij de stuurgroep.', punten: 50, effect: 10, gevolg: 'Je leert in zes weken of het werkt, zonder risico. En je komt bij de stuurgroep met ervaring in plaats van een folder.' },
          { tekst: 'Aanmelden bij de stuurgroep en zes weken wachten.', punten: 30, effect: 5, gevolg: 'Netjes, maar je komt met lege handen. De stuurgroep zet het op de lijst, achter drie andere initiatieven.' },
          { tekst: 'De CMIO vragen om een versnelde beoordeling buiten de stuurgroep om.', punten: 15, effect: 0, gevolg: 'De CMIO kan adviseren, niet besluiten. Een route langs de stuurgroep heen is precies wat de stuurgroep moet voorkomen.' },
        ],
      },
      opdracht: {
        alleenTeam: true, maxTekens: 60,
        tekst: 'Vraag iemand in de zaal die je niet kent: welke digitale ergernis zou jij als eerste oplossen? Schrijf het antwoord hier in vijf woorden.',
      },
      agendaVraag: {
        vraag: 'Laatste vraag, voor het bord: waar moet GGZ NHN als eerste mee aan de slag?',
        vrij: 'En in jullie eigen woorden, één zin (mag leeg blijven):',
        na: 'Genoteerd. Dat gaat naar het bord, naast wat de andere teams kozen.',
      },
      kaart: {
        titel: 'Regie is een plek aan tafel, plus iets te zeggen hebben.',
        tekst: 'Bij GGZ NHN loopt elk digitaal of AI-initiatief via de stuurgroep digitalisering [TJEERD: naam en route bevestigen]. De medische staf zit daar aan tafel via de CMIO. Proefdraaien zonder cliëntgegevens mag altijd; met cliëntgegevens pas na verwerkersovereenkomst en DPIA.',
        bron: 'GGZ NHN, governance digitalisering; AVG art. 28 en 35.',
      },
    },
    {
      id: 'poli', naam: '[TJEERD: gebouw voor de beslisondersteuning, bijv. de polikliniek]', kortenaam: 'Polikliniek [TJEERD]', functie: '[TJEERD: functie]', thema: 'de computer denkt mee', tegel: [21, 10], soort: 'dilemma', muziek: 'kantoor',
      npc: { naam: 'Lars', rol: 'accountmanager van een leverancier, strak pak, laptop', kleur: '#4a4a4a', look: { haar: '#1a1f1c', jas: '#2a2d35', broek: '#2a2d35', hoofd: 'kort', extra: 'laptop' } },
      binnen: { vloer: 'lino', kaart: ['##w#q#w#F#w##', '#s..mdm..s.V#', '#...ccc.....#', '#...........#', '#c.........c#', '#t...r.....t#', '#c.........c#', '#p.f.....s.p#', '######D######'], start: [6, 7], npc: [6, 3] },
      intro: ['Onze beslisondersteuning is CE-gemarkeerd en draait op de actuele G-standaard. Kijk, bij deze cliënt zegt hij: geen interactie.'],
      dilemma: {
        vraag: 'Het systeem zegt ‘geen interactie’ bij een cliënt op clozapine die vandaag ciprofloxacine krijgt. Jij meent je te herinneren dat ciprofloxacine de clozapinespiegel fors verhoogt. Wat doe je?',
        opties: [
          { tekst: 'Het systeem volgen. Het is CE-gemarkeerd en bevat de actuele G-standaard.', punten: 0, effect: -10, gevolg: 'Je herinnering klopt. CE betekent dat het product doet wat de fabrikant claimt, niet dat de kennisbank in deze versie compleet is. Automation bias heet dat.' },
          { tekst: 'Zelf checken in het Farmacotherapeutisch Kompas, de spiegel controleren, en de ontbrekende interactie melden bij apotheek en leverancier als incident met een medisch hulpmiddel.', punten: 50, effect: 10, gevolg: 'Spiegel 1,2 mg/l. Dosis aangepast. De melding leidt tot een update bij alle instellingen die dit systeem gebruiken.' },
          { tekst: 'Zelf checken en de dosis aanpassen. Het systeem is niet jouw verantwoordelijkheid.', punten: 30, effect: 5, gevolg: 'Goed voor deze cliënt. De volgende collega krijgt hetzelfde foute advies. Fouten in een medisch hulpmiddel melden hoort bij het werk.' },
          { tekst: 'De apotheek bellen en het advies negeren tot zij het bevestigen.', punten: 15, effect: 0, gevolg: 'Veilig, maar traag en afhankelijk. De bron waar je zelf bij kunt heb je niet gebruikt, en gemeld heb je ook niet.' },
        ],
      },
      kaart: {
        titel: 'De mens blijft in de lus. Dat is geen slogan maar een werkwijze.',
        tekst: 'Beslisondersteuning is een medisch hulpmiddel. CE-markering zegt iets over het beoogd gebruik, niet over volledigheid of validatie op onze populatie. Afwijken mag, vastleggen moet, en fouten melden hoort bij het gebruik.',
        bron: 'MDR (EU 2017/745) art. 87 (vigilantie); Federatie Medisch Specialisten (2026), paragraaf 4.4.',
      },
    },
    {
      id: 'team', naam: 'De Teamkamer', functie: '[TJEERD: naam en functie van dit gebouw]', thema: 'de digitale collega', tegel: [28, 24], soort: 'discussie', muziek: 'kantoor',
      npc: { naam: 'Mila', rol: 'regiebehandelaar', kleur: '#7a3e9d', look: { haar: '#1a1f1c', jas: '#7a3e9d', broek: '#3b3f4a', hoofd: 'lang' } },
      binnen: { vloer: 'hout', kaart: ['#w#q#B#J#qw##', '#...........#', '#.cttttttc..#', '#.c......c..#', '#.cttttttc..#', '#...........#', '#s.......m.f#', '#p...V.....p#', '######D######'], start: [6, 7], npc: [6, 1] },
      intro: [
        'Vanaf volgend jaar zit er een AI-assistent vast in ons MDO. Hij leest het dossier, vat samen, stelt voor. Hij praat mee.',
        'Niemand heeft gevraagd of wij dat willen. Maar nu hij er is: hoe werk je samen met een collega die nooit slaapt en nooit aansprakelijk is?',
      ],
      discussie: {
        vraag: 'Wat is jullie eerste eis aan de digitale collega?',
        opties: [
          'Hij spreekt pas als iemand het hem vraagt.',
          'Alles wat hij inbrengt is zichtbaar in het dossier, met bron en datum.',
          'Hij heeft geen stem over vrijheidsbeperking en medicatie.',
          'Eerst een jaar proefdraaien met een mens als schaduw.',
        ],
        argument: 'Jullie argument, in één zin:',
        na: 'Hier is geen goed antwoord. Wel een vraag die eraan komt. Het bord laat straks zien wat de andere teams kozen.',
      },
    },
    {
      id: 'hic', naam: 'Nieuwbouw HIC', functie: 'high intensive care (in aanbouw)', thema: '2030', tegel: [34, 10], soort: 'dilemma', minigame: 'noodkoffer', muziek: 'bouw',
      npc: { naam: 'Jij, 2030', rol: 'jijzelf, helm op', kleur: '#e0a84a', look: { haar: '#e0a84a', jas: '#e0a84a', broek: '#3b3f4a', hoofd: 'helm' } },
      binnen: { vloer: 'beton', kaart: ['##w###w###w##', '#x.b..b..b.x#', '#..........x#', '#.....md....#', '#x.......V..#', '#.b..b..b...#', '#x.......xx.#', '#...........#', '######D######'], start: [6, 7], npc: [6, 4] },
      intro: [
        'Dit gebouw staat er dan allang. De rapportage schrijft zichzelf en jij tekent. De beslisondersteuning is gevalideerd op onze mensen. De staf beslist mee over elk systeem.',
        'Maar eerst: het is 2030, 02.40 uur op de HIC, en het EPD is onbereikbaar. ICT zegt: storing, geen prognose. Twee cliënten zijn vanavond opgenomen; één moet om 03.00 uur medicatie.',
      ],
      dilemma: {
        vraag: 'Wat doe je als eerste?',
        opties: [
          { tekst: 'De noodprocedure starten: [TJEERD: wat de noodprocedure bij EPD-uitval is].', punten: 50, effect: 10, gevolg: 'Binnen vijf minuten heb je de medicatielijsten van 22.00 uur. De twee nieuwe opnames staan op de papieren overdracht van de avonddienst.' },
          { tekst: 'De read-only noodkopie op de laptop van de teamleider openen.', punten: 30, effect: 5, gevolg: 'Die bestaat, maar is van 22.00 uur en de teamleider is naar huis met de laptop. [TJEERD: klopt dit met de echte noodvoorziening? Pas aan.]' },
          { tekst: 'De apotheek-app op je telefoon gebruiken om de medicatie op te zoeken.', punten: 0, effect: -10, gevolg: 'De apotheek-app toont verstrekkingen, niet wat op de afdeling is toegediend of vanavond gewijzigd. Je doseert op basis van een ander systeem.' },
          { tekst: 'Wachten op ICT en de verpleging intussen uit het hoofd laten werken.', punten: 15, effect: 0, gevolg: 'Na veertig minuten belt ICT terug. De nieuwe opnames kent niemand uit het hoofd.' },
        ],
      },
      kaart: {
        titel: 'Niet óf, maar wanneer. Ken de noodprocedure.',
        tekst: 'Z-CERT, het expertisecentrum voor cybersecurity in de zorg, zegt het al jaren: de vraag is niet of een zorginstelling wordt geraakt, maar wanneer. Weten waar de noodkopie staat en wie hem mag openen hoort bij professioneel handelen.',
        bron: 'Federatie Medisch Specialisten (2026), paragraaf 4.5; NEN 7510 (bedrijfscontinuïteit).',
      },
    },
    {
      id: 'opname', naam: 'Spreekkamer 4', functie: '[TJEERD: naam en functie van dit gebouw]', thema: 'de cliënt neemt op', tegel: [43, 25], soort: 'discussie', muziek: 'spreekkamer',
      npc: { naam: 'Dennis', rol: 'cliënt, 34, telefoon op tafel', kleur: '#2f5f8f', look: { haar: '#1a1f1c', jas: '#2f5f8f', broek: '#3b3f4a', hoofd: 'kort', extra: 'telefoon' } },
      binnen: { vloer: 'tegel', kaart: ['##w##q#F##w##', '#s.........s#', '#....dm.....#', '#....c......#', '#...........#', '#....c......#', '#...........#', '#p...r.....l#', '######D######'], start: [6, 7], npc: [5, 4] },
      intro: [
        'Ik neem dit gesprek op. Voor mezelf, zodat ik het thuis nog eens kan horen. Vorige keer wist ik de helft niet meer.',
        'En ik wil niet dat jullie het opnemen. Dat ding op tafel gaat uit.',
      ],
      discussie: {
        vraag: 'Wat doe je?',
        opties: [
          'Prima. Hij mag opnemen voor eigen gebruik. Ik neem niet op en schrijf zelf.',
          'Prima, als ik dan ook mag opnemen. Dan hebben we allebei hetzelfde.',
          'Liever niet. Ik bied aan dat hij de samenvatting krijgt om thuis te lezen.',
          'Eerst vragen waarom hij het wil. Daarna beslissen we samen.',
        ],
        argument: 'Jullie argument, in één zin:',
        na: 'Een cliënt mag een gesprek voor eigen gebruik opnemen, ook zonder jouw toestemming. Openbaar maken mag niet zonder instemming. Jij mag vragen het te horen te krijgen. [TJEERD: bron KNMG-handreiking opnemen van gesprekken controleren]',
      },
    },
    {
      id: 'kwekerij', naam: 'Kwekerij', functie: 'werkplek voor mensen met afstand tot de arbeidsmarkt', thema: 'digitaal waar het kan', tegel: [54, 10], soort: 'dilemma', minigame: 'bowlen', muziek: 'kas',
      npc: { naam: 'Joop', rol: 'medewerker kwekerij, modder aan de handen', kleur: '#2f7d32', look: { haar: '#6b4a2b', jas: '#2f7d32', broek: '#5a4632', hoofd: 'kort', extra: 'modder' } },
      binnen: { vloer: 'beton', kaart: ['#wwwwwwwwwww#', '#pp.pp.pp.pp#', '#...........#', '#pp.pp.pp.pp#', '#...........#', '#pp.pp.pp.pp#', '#x........kk#', '#x.........l#', '######D######'], start: [6, 7], npc: [6, 4] },
      intro: ['Ik werk hier drie dagen in de week. Sinds een jaar doe ik mijn afspraken met de SPV via beeldbellen. Gaat prima, zeg ik dan.'],
      dilemma: {
        vraag: 'Joop (laaggeletterd) komt al een jaar trouw naar zijn beeldbelafspraken en zegt dat het ‘prima’ gaat. Zijn werkbegeleider meldt je dat hij de afspraken alleen haalt omdat zij naast hem zit en inlogt. Wat doe je?',
        opties: [
          { tekst: 'Niets. Hij komt, hij is tevreden, de begeleider helpt. Dat is hybride zorg.', punten: 15, effect: 0, gevolg: 'Joop heeft geen eigen regie over zijn zorg; de begeleider wel. Valt zij uit, dan valt hij uit. Je hebt een afhankelijkheid gebouwd en het hybride genoemd.' },
          { tekst: 'Terug naar fysieke afspraken. Beeldbellen is duidelijk niets voor hem.', punten: 30, effect: 5, gevolg: 'Joop vindt het beeldbellen zelf prettig: geen reis, geen wachtkamer. Je neemt hem iets af omdat de ondersteuning niet klopte.' },
          { tekst: 'Met Joop en de begeleider bespreken wat hij zelf kan leren, een digicoach inschakelen, en één op de drie afspraken fysiek doen.', punten: 50, effect: 10, gevolg: 'Joop belt na twee maanden zelf in. De fysieke afspraak blijft voor wat je op een scherm niet ziet.' },
          { tekst: 'De SPV vragen de afspraken voortaan in de kwekerij te doen, tijdens werktijd, met de begeleider erbij.', punten: 0, effect: -10, gevolg: 'Praktisch, maar zijn werkgever en collega’s zitten nu in zijn behandeling. De begeleider is niet zijn behandelaar en heeft geen rol in zijn dossier.' },
        ],
      },
      kaart: {
        titel: 'Digitaal waar het kan, fysiek waar het moet. En eigen regie waar het kan.',
        tekst: 'Ongeveer één op de vijf Nederlanders heeft moeite met digitale middelen; in onze populatie meer. Hybride zorg is maatwerk per cliënt: wie helpt, wat leert hij zelf, en wat blijft fysiek. Een helper is geen behandelaar.',
        bron: 'Federatie Medisch Specialisten (2026), paragraaf 4.2 en bijlage 1.',
      },
    },
    {
      id: 'bestuur', naam: 'Het Bestuursgebouw', functie: '[TJEERD: naam en functie van dit gebouw]', thema: 'de klacht van twintig pagina’s', tegel: [13, 10], soort: 'discussie', muziek: 'kantoor',
      npc: { naam: 'Ingrid', rol: 'klachtenfunctionaris, dikke map', kleur: '#8a6d3b', look: { haar: '#8a6d3b', jas: '#a0522d', broek: '#2a2d35', hoofd: 'lang', extra: 'map' } },
      binnen: { vloer: 'hout', kaart: ['##w#J#w#U#w##', '#...........#', '#.cttttttc..#', '#.c......c..#', '#.cttttttc..#', '#...........#', '#.md....s..f#', '#s.........p#', '######D######'], start: [6, 7], npc: [6, 1] },
      intro: [
        'Er ligt een klacht van een cliënt. Twintig pagina’s, 43 klachtpunten, geschreven met AI. Over jouw behandeling.',
        'De geneesheer-directeur zegt: als ik dit moet beantwoorden ben ik een dag kwijt aan dossieronderzoek. Niet beantwoorden mag niet. Wettelijk is er geen grens aan een klacht.',
      ],
      discussie: {
        vraag: 'Wat doe je als behandelaar?',
        opties: [
          'Punt voor punt beantwoorden, met hulp van de eigen AI-assistent en het dossier.',
          'Eerst de cliënt uitnodigen: wat zit er echt achter? Daarna pas schrijven.',
          'Terugleggen bij de cliënt: noem de drie punten die er voor jou het meest toe doen.',
          'Een vaste werkwijze afspreken voor AI-geschreven klachten, met de klachtenfunctionaris en de cliëntenraad.',
        ],
        argument: 'Jullie argument, in één zin:',
        na: 'Dit verzoek ligt nu echt bij GGZ NHN. Een cliënt die AI gebruikt om zich uit te drukken is niet het probleem. Hoe wij daarop antwoorden, is wel onze vraag.',
      },
    },
    {
      id: 'olvendijk', naam: 'De Olvendijk', functie: '[TJEERD: functie]', thema: 'het dossier gaat de deur niet uit', tegel: [34, 23], soort: 'dilemma', muziek: 'kantoor',
      npc: { naam: 'Fatima', rol: 'functionaris gegevensbescherming, koffie', kleur: '#7a3e9d', look: { haar: '#1a1f1c', jas: '#7a3e9d', broek: '#3b3f4a', hoofd: 'lang', extra: 'koffie' } },
      binnen: { vloer: 'lino', kaart: ['##w#q#F###w##', '#s.s....mdm.#', '#...........#', '#.mdm.......#', '#...c.....s.#', '#...........#', '#f.......r..#', '#p.......s.p#', '######D######'], start: [6, 7], npc: [6, 2] },
      intro: ['Mooi gebouw, hè. Hier staan onze servers niet. Die staan ergens anders. En vanmiddag is de eigen AI-assistent in storing, hoor ik.'],
      dilemma: {
        vraag: 'Je wilt een ontslagbrief laten herschrijven. De AI-assistent van GGZ NHN is in storing. Een collega appt: ‘de betaalde ChatGPT-versie van de vakgroep heeft een zero-data-retention-contract, die gebruik ik gewoon’. Wat doe je?',
        opties: [
          { tekst: 'Gebruiken. Een contract zonder dataretentie dekt het.', punten: 15, effect: 0, gevolg: 'Geen dataretentie is niet hetzelfde als een verwerkersovereenkomst met GGZ NHN, een DPIA en opname in het verwerkingsregister. Het contract staat op naam van de vakgroep, niet van de verwerkingsverantwoordelijke.' },
          { tekst: 'Gebruiken, maar eerst naam, geboortedatum en BSN weghalen.', punten: 0, effect: -10, gevolg: 'Pseudonimiseren is niet anonimiseren: een casus van vierhonderd woorden is herleidbaar. Het blijft een verwerking van bijzondere persoonsgegevens zonder grondslag.' },
          { tekst: 'De brief vandaag zelf schrijven of een dag wachten, en de storing melden bij functioneel beheer.', punten: 50, effect: 10, gevolg: 'De brief gaat een dag later. De melding maakt zichtbaar dat de storing werk kost, en dat telt bij de volgende capaciteitsbeslissing.' },
          { tekst: 'De FG vragen om een eenmalige uitzondering voor vandaag.', punten: 30, effect: 5, gevolg: 'De FG kan geen uitzondering geven op de AVG. Wel vertelt ze je in één minuut waarom de vakgroepversie niet mag. Je hebt een uur verloren, maar niets gelekt.' },
        ],
      },
      kaart: {
        titel: 'Nooit cliëntgegevens in AI-tools zonder verwerkersovereenkomst van GGZ NHN.',
        tekst: 'Toegestaan: [TJEERD: welke tools zijn toegestaan voor cliëntgegevens en welke niet]. Een contract op naam van een vakgroep, ‘geen dataretentie’ of pseudonimiseren verandert daar niets aan. De Federatie: voorkom het uploaden van patiëntdata naar openbare online tools.',
        bron: 'AVG art. 4, 9 en 28; Federatie Medisch Specialisten, De rol van de medisch specialist in het digitale tijdperk (2026), bijlage 2.',
      },
    },
    {
      id: 'venne', naam: 'De Hooge Venne', functie: 'forensische psychiatrie', thema: 'het algoritme heeft een mening', tegel: [47, 10], soort: 'dilemma', minigame: 'boogschieten', muziek: 'kliniek',
      npc: { naam: 'Nadia', rol: 'forensisch psycholoog', kleur: '#b5443a', look: { haar: '#1a1f1c', jas: '#b5443a', broek: '#2a2d35', hoofd: 'knot' } },
      binnen: { vloer: 'lino', kaart: ['#w###q#F###w#', '#..s.....s..#', '#...........#', '#.mdm...P...#', '#..c........#', '#...........#', '#p.......xx.#', '#s.........l#', '######D######'], start: [6, 7], npc: [4, 5] },
      intro: [
        'Welkom in de forensische kliniek. Hier beslissen we over vrijheid.',
        'Het risicotaxatie-algoritme zegt vandaag ‘hoog’. Mijn HKT-R zegt ‘matig’. De leverancier stuurt een AUC van 0,78 uit een Canadese validatiestudie mee.',
      ],
      dilemma: {
        vraag: 'De rechter wil morgen jouw advies. Algoritme: hoog. Jouw gestructureerde oordeel: matig. Wat schrijf je?',
        opties: [
          { tekst: 'Het algoritme volgen. Een AUC van 0,78 is beter dan de meeste klinische oordelen.', punten: 0, effect: -10, gevolg: 'Een AUC uit Canada zegt niets over kalibratie bij deze populatie, en ‘hoog’ zonder kalibratie is geen kans maar een etiket. Je advies is nu dat van een leverancier.' },
          { tekst: 'Je eigen oordeel schrijven en het algoritme buiten het rapport houden: niet gevalideerd op onze populatie.', punten: 15, effect: 0, gevolg: 'Klinisch verdedigbaar, maar het instrument is in gebruik en de uitkomst staat in het dossier. Wat de rechter niet weet, komt bij de verdediging vandaan.' },
          { tekst: 'Beide uitkomsten rapporteren, uitleggen waarom je afwijkt, de beperkte validatie benoemen, en de discrepantie melden bij de beheerder.', punten: 50, effect: 10, gevolg: 'De rechter krijgt een mens met een spoor. De beheerder krijgt een casus voor de validatie die er nog niet is.' },
          { tekst: 'Het midden kiezen: ‘matig tot hoog’.', punten: 30, effect: 5, gevolg: 'Dat is geen weging maar een compromis. Een oordeel middelen met een niet-gevalideerd instrument verdunt jouw taxatie zonder dat iemand weet waarom.' },
        ],
      },
      kaart: {
        titel: 'Een algoritme dat beslissingen ondersteunt, is een medisch hulpmiddel.',
        tekst: 'Vraag altijd: op welke populatie is het gevalideerd en gekalibreerd, wat is het beoogd gebruik, en hoe meld ik afwijkingen. Een AUC elders is geen validatie hier. Jij blijft verantwoordelijk, ook voor wat je weglaat.',
        bron: 'MDR (EU 2017/745); Federatie Medisch Specialisten (2026), competentie 2 en 3.',
      },
    },
    {
      id: 'olvendijk79', naam: 'Olvendijk 79', functie: '[TJEERD: functie]', thema: 'de cliënt vraagt wat je doet', tegel: [29, 30], soort: 'dilemma', muziek: 'spreekkamer',
      npc: { naam: 'Willem', rol: 'cliënt, 58, zorgmachtiging', kleur: '#8a6d3b', look: { haar: '#9fb3a6', jas: '#8a6d3b', broek: '#3b3f4a', hoofd: 'kort' } },
      binnen: { vloer: 'tegel', kaart: ['##w#q#F###w##', '#s.........p#', '#....dm.....#', '#....c......#', '#...........#', '#.....c.....#', '#...........#', '#p....r...sl#', '######D######'], start: [6, 7], npc: [6, 4] },
      intro: ['Neemt dat ding ons gesprek op? Doe maar hoor. Maakt mij niet uit.'],
      dilemma: {
        vraag: 'Willem (58) is opgenomen met een zorgmachtiging. Je wilt het gesprek laten samenvatten door de AI-tool. Hij zegt: ‘doe maar, maakt mij niet uit’. Wat doe je?',
        opties: [
          { tekst: 'Opnemen. Hij heeft toestemming gegeven.', punten: 15, effect: 0, gevolg: '‘Maakt mij niet uit’ is geen geïnformeerde toestemming: je hebt niet uitgelegd wat het doet. En bij dwang hoort de afweging over wilsbekwaamheid ter zake expliciet te zijn.' },
          { tekst: 'Niet opnemen. Bij dwang is toestemming per definitie niet vrij.', punten: 30, effect: 5, gevolg: 'Te streng. Een zorgmachtiging maakt iemand niet wilsonbekwaam voor alles. Je ontzegt hem een keuze die hij misschien goed kan maken, en jezelf een werkend hulpmiddel.' },
          { tekst: 'Uitleggen wat er met de opname gebeurt, checken of hij het begrijpt, en de afweging over wilsbekwaamheid ter zake kort vastleggen voordat je opneemt.', punten: 50, effect: 10, gevolg: 'Willem begrijpt het en wil het. Jij hebt het vastgelegd. Als de klachtencommissie er ooit naar vraagt, staat het er.' },
          { tekst: 'Opnemen zonder vragen. De samenvatting valt onder de dossierplicht en daar is geen toestemming voor nodig.', punten: 0, effect: -10, gevolg: 'De dossierplicht dekt jouw aantekening, niet een audio-opname via een derde partij. Daar is een grondslag en informatie voor nodig. [TJEERD: de GGZ NHN-afspraak over toestemming en opname]' },
        ],
      },
      kaart: {
        titel: 'Leg uit wat AI doet, en dat de cliënt nee mag zeggen. Ook bij dwang.',
        tekst: 'Competentie 4 van de Federatie: informeer cliënten en naasten helder over het gebruik van AI. Bij dwang, wilsonbekwaamheid of crisis geldt extra zorgvuldigheid en leg je de afweging vast: [TJEERD: de GGZ NHN-afspraak over toestemming en opname].',
        bron: 'Federatie Medisch Specialisten, Competentieset Verantwoord gebruik van AI in de zorg (2026); Wvggz art. 1:5 (wilsbekwaamheid ter zake).',
      },
    },
    {
      id: 'begraafplaats', naam: 'Begraafplaats', kortenaam: 'Begraafplaats (11)', functie: 'begraafplaats van het landgoed, nummer 11 op de plattegrond', tegel: [43, 14], soort: 'plek', muziek: 'begraafplaats',
      npc: { naam: 'Riet', rol: 'vrijwilliger begraafplaats', kleur: '#4a4a4a', look: { haar: '#f2f2f2', jas: '#4a4a4a', broek: '#2a2d35', hoofd: 'knot' } },
      intro: [
        'Hier liggen de mensen die hier woonden toen er nog geen dossier was. Alleen een naam en een nummer op een steen.',
        'Wat jij vandaag over iemand vastlegt, blijft langer dan jij. Schrijf alsof die persoon meeleest. Dat is geen AI-regel, dat is fatsoen.',
      ],
    },
    {
      id: 'winkel', naam: 'Maatwerk Circulair', functie: 'kledingwinkel van Maatwerk, rechtsonder in het gebouw tegenover De Trog', tegel: [55, 17], soort: 'plek', muziek: 'kas',
      npc: { naam: 'Carla', rol: 'medewerker Maatwerk Circulair', kleur: '#c9403a', look: { haar: '#e0a84a', jas: '#c9403a', broek: '#3b3f4a', hoofd: 'lang' } },
      binnen: { vloer: 'hout', kaart: ['#w#q##Z##q#w#', '#R.R.R.R.R.R#', '#...........#', '#R.R.....R.R#', '#....kk.....#', '#R.R.....R.R#', '#...........#', '#p.R.R.R.R.l#', '######D######'], start: [6, 7], npc: [6, 3] },
      intro: [
        'Welkom bij Maatwerk Circulair. Tweedehands, uitgezocht en gerepareerd door mensen die hier werken. De Trog zit aan de overkant, als je trek hebt.',
        'Hier gaat niets de deur uit zonder dat iemand ernaar gekeken heeft. Dat zou met gegevens ook moeten, zei de FG laatst. Ze kocht een jas.',
      ],
    },
    {
      id: 'groep', naam: 'Groepsruimte', kortenaam: 'Nr 8', functie: 'groepstherapie (gesloten groep)', tegel: [19, 23], soort: 'grap', muziek: 'spreekkamer',
      npc: { naam: 'Therapeut', rol: 'groepstherapeut, armen over elkaar', kleur: '#2f5f8f', look: { haar: '#6b4a2b', jas: '#2f5f8f', broek: '#2a2d35', hoofd: 'bril' } },
      binnen: { vloer: 'hout', kaart: ['#w#q#####q#w#', '#..c.....c..#', '#.c...r...c.#', '#.....r.....#', '#.c...r...c.#', '#..c.....c..#', '#s.........p#', '#...........#', '######D######'], start: [6, 7], npc: [6, 3],
        groep: [[3, 1], [9, 1], [2, 2], [10, 2], [2, 4], [10, 4], [3, 5], [9, 5]] },
      intro: ['Dit is een gesloten groep. Dit is níet de digitale werksessie. Eruit, alsjeblieft.'],
      nogmaals: 'Nee. Nog steeds een gesloten groep.',
    },
  ],

  // Spook: broeder Anselmus. Op de begraafplaats een scène; later verschijnt hij bij een deur als je daar een zwakke keuze maakte.
  spook: {
    naam: 'Broeder Anselmus', rol: 'broeder van het gesticht, overleden 1931', tegel: [41, 14],
    look: { haar: '#dfe7ee', jas: '#c9d4dc', broek: '#aab8c2', hoofd: 'kort' },
    intro: [
      'Jij kunt mij zien. Dat kan niet iedereen.',
      'Ik heb hier veertig jaar mensen verzorgd. Wij schreven weinig op. Wat wij opschreven, was voor altijd. Er staat nog een boek in de kelder van het hoofdgebouw met één regel per mens.',
      'Jij schrijft meer dan wij. Dat is beter. Maar lees je het ook terug? Ik loop nog wat rond. Als je iets doet wat ik niet begrijp, hoor je me.',
    ],
    fluister: {
      keuken: 'Ik las ooit ‘onrustig’ over een man die alleen maar kou had. Dat woord bleef veertig jaar staan.',
      olvendijk: 'Wij hadden één boek en één sleutel. Jullie hebben er duizend. Wie heeft de sleutel?',
      olvendijk79: 'Toestemming vragen aan iemand die niet weg mag. Dat deden wij nooit. Daar schaam ik me nog voor.',
      venne: 'Over vrijheid beslissen op gezag van iets wat je niet begrijpt. Dat deden wij ook. Het heette toen God.',
      poli: 'Een hulpmiddel dat niet tegengesproken wordt, is een meester.',
      kwekerij: 'Joop had vroeger een naam die wij voor hem kozen. Laat hem nu zelf kiezen.',
      hic: 'Het licht viel hier vaker uit dan jullie denken. We hadden kaarsen én een lijst.',
      koepel: 'In deze koepel werd gezongen. Nu wordt er besloten. Zorg dat je in de zaal zit.',
    },
    tot: 'Je hebt hem gezien. Hij volgt je niet, hij luistert mee.',
  },

  // Voorwerpen in kamers: tik erop. Letter = teken in de binnenkaart.
  voorwerpen: {
    F: { naam: 'Portret van Freud', tekst: 'Sigmund Freud, op elke afdeling een exemplaar. Hij schreef alles op. Met de hand. Zonder verwerkersovereenkomst.' },
    J: { naam: 'Portret van Jos Brinkmann', tekst: 'Jos Brinkmann. Hij kijkt vriendelijk, maar hij kijkt wel. [TJEERD: onderschrift naar wens]' },
    U: { naam: 'Buste van Sint Willibrordus', tekst: 'Willibrordus, missionaris, naamgever van het landgoed. Verliet zijn land om anderen te overtuigen. Had geen e-learning nodig.' },
    V: { naam: 'VR-brilset', tekst: 'Een VR-bril voor exposuretherapie. Werkt pas als iemand hem ook aanzet, oplaadt en de updates doet. Raad eens wie.' },
    Z: { naam: 'Poster Sancti Adalberti', tekst: 'Sancti Adalberti, het laatste wonder van Adelbert, gebrouwen in Egmond. Hangt hier om redenen die niemand meer kan uitleggen.' },
    s: { naam: 'Boekenkast', tekst: 'DSM-5-TR, de Richtlijn Suïcidaal gedrag, drie jaargangen Tijdschrift voor Psychiatrie en één roman die niemand terugbrengt.' },
    R: { naam: 'Kledingrek', tekst: 'Tweedehands, gewassen, hersteld, geprijsd. Elke jas heeft een vorige eigenaar. Elke jas is anoniem.' },
    o: { naam: 'Orgel', tekst: 'Het orgel van de koepel. Klinkt nog. Niemand weet meer wie de sleutel van de klep heeft.' },
    B: { naam: 'Whiteboard', tekst: 'Zes competenties, drie pijlen, één vraagteken. Van de laatste vergadering.' },
  },

  // Minigames. Punten hooguit 60 per spel.
  minigames: {
    noodkoffer: {
      titel: 'Noodkoffer', uitleg: 'Het EPD ligt eruit. Onthoud de volgorde van de noodprocedure en tik hem na. Elke ronde wordt langer; twee fouten en de nacht is om.',
      stappen: ['Papieren lijst', 'Noodlaptop', 'ICT bellen', 'GD informeren'], rondes: 6, puntenPerRonde: 10,
      klaar: 'Je kende de procedure tot stap {n}. [TJEERD: de echte stappen van de noodprocedure invullen in content.js]',
    },
    dicteer: {
      titel: 'Lees het na', uitleg: 'Links wat er gezegd is, rechts de AI-samenvatting. Eén woord wijkt af. Tik erop. De klok loopt: sneller is meer punten, een misser kost punten.',
      rondes: [
        { gesproken: 'Cliënt slaapt beter sinds de dosering is verhoogd. Geen bijwerkingen gemeld. Stemming licht verbeterd, nog geen plannen voor werk. Partner komt volgende keer mee.', samenvatting: 'Cliënt slaapt beter sinds de dosering is verlaagd. Geen bijwerkingen gemeld. Stemming licht verbeterd, nog geen plannen voor werk. Partner komt volgende keer mee.', fout: 'verlaagd.' },
        { gesproken: 'Geen suïcidale gedachten, wel somber over de scheiding. Alcoholgebruik twee glazen per avond, zegt hij. Vervolgafspraak over twee weken bij de verpleegkundig specialist.', samenvatting: 'Geen suïcidale gedachten, wel somber over de scheiding. Alcoholgebruik twee glazen per week, zegt hij. Vervolgafspraak over twee weken bij de verpleegkundig specialist.', fout: 'week,' },
        { gesproken: 'Medicatie besproken: clozapine ongewijzigd, spiegel vorige week in orde. Cliënt wil stoppen met roken en vraagt om begeleiding. Rookstop beïnvloedt de spiegel wel; extra controle afgesproken.', samenvatting: 'Medicatie besproken: clozapine ongewijzigd, spiegel vorige week in orde. Cliënt wil stoppen met roken en vraagt om begeleiding. Rookstop beïnvloedt de spiegel niet; extra controle afgesproken.', fout: 'niet;' },
      ],
      puntenPerRonde: 20, puntenAftrekPerSeconde: 2, minimumBijGoed: 4, misser: 4, maxSeconden: 15,
      klaar: '{goed} van de {totaal} fouten gevonden in {tijd} seconden. Nalezen is werk.',
    },
    bowlen: {
      titel: 'Ergernis-bowlen', uitleg: 'Twee worpen. Tik om de richting te kiezen, tik nog eens voor de kracht. De kegels zijn digitale ergernissen.',
      kegels: ['Dubbel inloggen', 'Wachtwoord verlopen', 'Pop-up', 'Printer offline', 'Zelfde vraag, vier keer', 'Update om 8.00 uur'], worpen: 2, puntenPerKegel: 5,
      klaar: '{kegels} ergernissen omver. Was het altijd maar zo simpel.',
    },
    boogschieten: {
      titel: 'Validatie-boog', uitleg: 'Drie pijlen. Houd vast om te spannen, laat los om te schieten. De roos is onze populatie; de buitenste ring is Zweden.',
      pijlen: 3, ringen: [20, 15, 10, 5, 0],
      klaar: '{punten} punten met drie pijlen. Elders bewezen telt hier niet.',
    },
  },

  // Korte teksten rond de spelloop.
  teksten: {
    kaartGevonden: 'Je hebt een kaart gevonden.',
    alBezocht: 'Hier ben je al geweest. De kaart staat in je overzicht.',
    alGedaan: 'Jullie hebben hier al gesproken. Het argument staat op het bord.',
    naAlles: 'Alle gebouwen gehad. Nog twee stappen: de zelfcheck en de agenda.',
    naarBinnen: 'Naar binnen',
    koepelDicht: 'De koepel gaat pas open als je de rest van het landgoed gezien hebt. Nog {n} te gaan.',
    koepelOpen: 'Alles gezien. De koepel is open. Dit is de laatste halte.',
    praat: 'A · PRAAT',
    volgende: 'VOLGENDE',
    kaartKnop: 'KAART · NOG {n} TE GAAN',
    kaartKnopKlaar: 'KAART · ALLES GEDAAN, NAAR DE KOEPEL',
    kaartUitleg: 'Knipperend: hier wacht nog een vraag. Grijs met slot: de Cultuurkoepel gaat als laatste open.',
    alles: 'Alles bezocht',
    minigameStart: 'Even iets anders. {titel}: {uitleg}',
    minigameKlaar: 'Dat levert {punten} punten op.',
    discussieBedankt: 'Genoteerd. Dit levert {punten} punten op, welke keuze jullie ook maakten.',
    landgoed: 'Landgoed',
    loopHint: 'Tik op de kaart om te lopen. Bij een deur ga je naar binnen. Figuranten kun je aanspreken.',
    praatHint: 'Loop naar de persoon met het uitroepteken en druk op A · PRAAT, of tik op de persoon.',
    alGedaanHint: 'Hier ben je klaar. Loop naar de deur onderaan om naar buiten te gaan.',
    onderweg: 'Onderweg',
    wissen: 'Alles wissen en opnieuw beginnen?',
    agendaLeeg: 'Kies een kaart of schrijf iets in eigen woorden.',
    voorwerp: 'VOORWERP',
    spookWeg: 'De broeder is weg. Alleen de kou bleef even hangen.',
    argumentLeeg: 'Schrijf eerst jullie argument in één zin.',
    nogGeenKaarten: 'Nog geen kaarten. Bezoek een gebouw.',
  },

  zelfcheck: {
    vraag: 'Waar geef je jezelf (of je team) nu een 7 of hoger?',
    items: [
      'Begrijpt de basisprincipes van AI.',
      'Beoordeelt AI-uitvoer kritisch op betrouwbaarheid en klinische relevantie.',
      'Waarborgt veiligheid en kwaliteit bij het gebruik van AI.',
      'Informeert cliënten en naasten helder over AI.',
      'Werkt effectief samen in het AI-ecosysteem.',
      'Integreert ethische en juridische overwegingen.',
    ],
    na: 'Dit zijn de zes AI-competenties van de Federatie Medisch Specialisten (januari 2026). AI-geletterdheid is sinds februari 2025 ook een plicht onder de AI-verordening. Een e-learning volgt [TJEERD: datum en voor wie].',
  },

  agenda: {
    zelfVraag: 'Wat pak jij zelf op in de komende drie maanden?',
    zelfMax: 120,
    organisatieVraag: 'Waar moet GGZ NHN mee aan de slag, en wie?',
    organisatieOpties: [
      'AI-geletterdheid voor alle psychiaters en aios regelen',
      'Een aanspreekpunt digitalisering per divisie of vakgroep',
      'Cliëntinformatie over AI en opname van gesprekken vaststellen',
      'De noodprocedure bij uitval jaarlijks oefenen',
      'Spraakgestuurd rapporteren opschalen',
      'Beslisondersteuning pas invoeren na validatie op onze populatie',
      'De staf zichtbaar aan tafel bij elk digitaal besluit',
      'Een werkwijze voor AI-geschreven klachten, samen met de cliëntenraad',
      '[TJEERD: aanvullen]',
    ],
    eigenaren: [
      'medische staf',
      'stuurgroep digitalisering',
      'AI-team',
      'EPD-regiegroep',
      'raad van bestuur en directie',
      'ikzelf',
    ],
  },
};
if (typeof module === 'object' && module.exports) module.exports = CONTENT;
