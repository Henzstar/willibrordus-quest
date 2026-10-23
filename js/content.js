// Alle teksten en data van Willibrordus Quest. Geen logica.
// Tekst met [TJEERD: ...] wordt later door Tjeerd ingevuld; laat die plekken letterlijk staan.
const CONTENT = {
  titel: 'Willibrordus Quest',
  ondertitel: 'Wie stuurt?',
  organisatie: 'GGZ Noord-Holland-Noord',

  // Tilemap: 48 kolommen bij 22 rijen, noord is boven.
  tilemap: [
    '================================================',
    '..WWWWWWWWWWWWWWWWWWWWWWWWWWWWW.........=..FFFF=',
    '....................SSSSSSSSSFFFF...TTT.=..FFFF=',
    '......BBB.BBB.BBBB..SNNSSNNSSFFFFBBBBTT.=..FFFF=',
    '.......BBBBB..B..B..SNNNNNNSSFFFFBBBB.GGGG.FFFF=',
    '......BBB.BBB.B..B..SNNNNNNSSFFFFBBBB.GGGG.FFFF=',
    '..............BBBB..SSSSSSSSSFFFF.....GGGG.....=',
    '......==========================================',
    '......=BBB..PPPPPPTTTTTTBBB........TTTTT-TTTTTT=',
    '..BBTTTBBB..PPPPPPTTTTTTBBB-.......TTTBBBBTTTTT=',
    '..BBTTT--------------------T-TTTTTTTTTBBBBTTTTT=',
    '..BBTTTTTT-.TTTT-..BBBBBTTTTT-TTTTTTTTBBBBTTTTT=',
    '.WBBKKKTTT-.TTTT-..BBBBBTTTTTT-TTTTTTTTTTTTTTTT=',
    '.WBBKKK----TTTTT-------TTTTTTTT----TTTTTTTTTTTT=',
    '..BBKKKTTT-TTTTT-.TTTTT..TTTBBBBBB-.FFFFFFTTTTT=',
    '..BBB------TTTTT-.TTTTT..TTTB.BBBB-.FFFFFFTTTTT=',
    '..BBTTTTTT-TTTTT-.TTTTT..TTTBBBBBB-.FFFFFFTTTTT=',
    '..TTTTTTTT--------------------BBBB-.FFFFFFTTTTT=',
    '..TTTTTTTTTTTTT..........TTT......-.FFFFFFTTTTT=',
    '..TTTTTTTTTTTTTBBB....WWWWWWWWWWWWWWWWWWW.TTTTT=',
    '...............BBB....B..B..B..B..B..B..B.TBTTT=',
    '=====================..........................=',
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
  },

  // Binnenkaarten: # muur, w raam, . vloer, _ hout, r kleed (begaanbaar), D deur (uitgang), d bureau, m bureau met scherm,
  // c stoel, t tafel, b bed, p plant, s kast, k balie/aanrecht, P bank, x kist, B whiteboard, S podium. Alles behalve . _ r D blokkeert.
  binnenLegenda: { '#': 'muur', 'w': 'raam', '.': 'vloer', '_': 'hout', 'r': 'kleed', 'D': 'deur', 'd': 'bureau', 'm': 'scherm', 'c': 'stoel', 't': 'tafel', 'b': 'bed', 'p': 'plant', 's': 'kast', 'k': 'balie', 'P': 'bank', 'x': 'kist', 'B': 'whiteboard', 'S': 'podium' },
  binnenBegaanbaar: ['.', '_', 'r', 'D'],

  // Straatnamen als kleine labels; richting h = horizontaal, v = verticaal; tegel = ankertegel.
  straten: [
    { naam: 'Kanaalweg', tegel: [20, 0], richting: 'h' },
    { naam: 'De Strandwal', tegel: [8, 7], richting: 'h' },
    { naam: 'De Bullaan', tegel: [34, 7], richting: 'h' },
    { naam: 'Rosendaal', tegel: [47, 12], richting: 'v' },
    { naam: 'De Olvendijk', tegel: [11, 10], richting: 'h' },
    { naam: 'Het Landpad', tegel: [16, 14], richting: 'v' },
    { naam: 'De Hooge Venne', tegel: [34, 15], richting: 'v' },
    { naam: 'De Overtoom', tegel: [12, 17], richting: 'h' },
    { naam: 'Het Kerkpad', tegel: [10, 14], richting: 'v' },
    { naam: 'De Beuk', tegel: [31, 13], richting: 'h' },
    { naam: 'De Kroft', tegel: [4, 21], richting: 'h' },
  ],

  // Losse decoratie buiten: type en tegel.
  props: [
    { type: 'lantaarn', tegel: [10, 10] }, { type: 'lantaarn', tegel: [18, 10] }, { type: 'lantaarn', tegel: [23, 10] },
    { type: 'lantaarn', tegel: [16, 13] }, { type: 'lantaarn', tegel: [16, 17] }, { type: 'lantaarn', tegel: [27, 13] },
    { type: 'bank', tegel: [11, 11] }, { type: 'bank', tegel: [17, 12] }, { type: 'bank', tegel: [33, 9] }, { type: 'bank', tegel: [1, 11] },
    { type: 'bloemen', tegel: [10, 9] }, { type: 'bloemen', tegel: [13, 5] }, { type: 'bloemen', tegel: [37, 6] }, { type: 'bloemen', tegel: [29, 8] },
    { type: 'bloemen', tegel: [23, 13] }, { type: 'bloemen', tegel: [35, 18] }, { type: 'bloemen', tegel: [14, 18] },
    { type: 'auto', tegel: [12, 8], kleur: '#c9403a' }, { type: 'auto', tegel: [14, 8], kleur: '#3b5fa8' }, { type: 'auto', tegel: [16, 9], kleur: '#e8e8e8' }, { type: 'auto', tegel: [13, 9], kleur: '#55585e' },
    { type: 'kraan', tegel: [28, 2] }, { type: 'fietsen', tegel: [15, 9] }, { type: 'bord', tegel: [15, 11] },
  ],

  // Figuranten buiten: staan stil of lopen heen en weer over een route (begaanbare tegels).
  figuranten: [
    { naam: 'Ans', rol: 'cliëntenraad', look: { haar: '#d9d2c5', jas: '#b5443a', broek: '#3b3f4a', hoofd: 'kort' }, route: [[10, 10], [19, 10]], regels: [
      'Jullie praten vanavond over ons. Praat ook met ons.',
      'Mijn dossier is van mij. Dat is geen mening, dat is de wet.',
      'Ik wil de samenvatting lezen voordat jij hem tekent. Mag dat?',
      'Beeldbellen is fijn. Als ik het zelf kies.',
      'Als het EPD eruit ligt, lig ik er ook uit. Weet jij dan nog wat ik slik?',
    ] },
    { naam: 'Kees', rol: 'tuinman', look: { haar: '#6b4a2b', jas: '#2f7d32', broek: '#5a4632', hoofd: 'kort' }, route: [[36, 6], [33, 6]], regels: ['De heggen groeien harder dan de ICT-projecten. Maar die knip ik tenminste zelf.'] },
    { naam: 'Mo', rol: 'cliënt', look: { haar: '#1a1f1c', jas: '#6b7280', broek: '#3b3f4a', hoofd: 'knot' }, route: [[17, 12]], regels: ['Ik zit hier elke dag even. Het portaal zegt dat ik vandaag een afspraak heb. Niemand anders weet dat.'] },
    { naam: 'Bep', rol: 'portier', look: { haar: '#9fb3a6', jas: '#c9a24d', broek: '#3b3f4a', hoofd: 'bril' }, route: [[13, 10]], regels: ['Kies een gebouw op de kaart. Het kompas in de HUD wijst de aanbevolen volgende stop.'] },
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
  route: ['keuken', 'koepel', 'poli', 'team', 'hic', 'opname', 'kwekerij', 'bestuur', 'olvendijk', 'venne', 'olvendijk79'],

  // Locaties: tegel = deur (begaanbare tegel onder het gebouw). soort: dilemma of discussie. binnen: binnenkaart, start en npc-positie.
  locaties: [
    {
      id: 'start', naam: 'Hoofdingang', functie: 'start', tegel: [14, 10], soort: 'start',
      npc: { naam: 'Bep', rol: 'portier', kleur: '#c9a24d' },
      intro: [
        'Welkom op het landgoed. Je loopt vanavond langs het hele terrein. Overal wacht een keuze. Je regie-meter laat zien of je stuurt, of gestuurd wordt.',
        'Tik op de kaart om te lopen. Bij een deur ga je naar binnen. Wissel per gebouw wie de telefoon vasthoudt; de anderen eten.',
      ],
    },
    {
      id: 'keuken', naam: 'Keuken met Karakter', functie: 'restaurant', thema: 'werklast begint bij registratie', tegel: [8, 10], soort: 'dilemma', minigame: 'dicteer',
      npc: { naam: 'Sam', rol: 'aios, bord bitterballen', kleur: '#2b6cb0', look: { haar: '#6b4a2b', jas: '#2b6cb0', broek: '#3b3f4a', hoofd: 'kort', extra: 'bord' } },
      binnen: { kaart: ['#####w#####', '#kkkk.....#', '#.........#', '#.tt..tt..#', '#.cc..cc..#', '#.........#', '#.tt..tt.p#', '#####D#####'], start: [5, 6], npc: [5, 2] },
      intro: ['Acht gesprekken gehad, nul rapportages geschreven. Het is 17.30 uur. Jij ook?'],
      dilemma: {
        vraag: 'Hoe krijg je de rapportages vanavond af?',
        opties: [
          { tekst: 'Na het eten alles uit het hoofd tikken, kort en bondig.', punten: 15, effect: 0, gevolg: 'Om 19.40 uur klaar. Twee gesprekken zijn al vervaagd. Kort is niet hetzelfde als juist.' },
          { tekst: 'Spraakgestuurd rapporteren gebruiken. De samenvatting staat er al, dus tekenen en door.', punten: 0, effect: -10, gevolg: 'Om 17.50 uur klaar. In één samenvatting staat ‘medicatie gestopt’ waar ‘overwogen’ werd gezegd. Dat staat nu in het dossier, met jouw handtekening.' },
          { tekst: 'Spraakgestuurd rapporteren gebruiken en elke samenvatting nalezen en corrigeren voordat je tekent.', punten: 50, effect: 10, gevolg: 'Om 18.20 uur klaar. Je haalt twee verkeerde interpretaties uit de samenvattingen. Dat is precies je werk.' },
          { tekst: 'De verpleegkundig specialist vragen de helft te doen. Jullie waren er allebei bij.', punten: 30, effect: 5, gevolg: 'Taken kun je verdelen, de verantwoordelijkheid voor jouw beoordeling niet. En de VS had ook acht gesprekken.' },
        ],
      },
      kaart: {
        titel: 'Werklast begint bij de registratie.',
        tekst: 'Spraakgestuurd rapporteren bij GGZ NHN: [TJEERD: cijfers die publiek mogen, bijv. aantal behandelaren in de startfase en het aandeel dat meer werkplezier ervaart]. Een AI-samenvatting is een concept. Jij leest, corrigeert en tekent.',
        bron: 'GGZ NHN, startfase spraakgestuurd rapporteren 2026.',
      },
    },
    {
      id: 'koepel', naam: 'Cultuurkoepel', functie: 'grote bijeenkomsten', thema: 'wie stuurt bij ons', tegel: [5, 15], soort: 'dilemma',
      npc: { naam: 'Henk', rol: 'voorzitter van een stuurgroep, bril, stapel papier', kleur: '#6b7280', look: { haar: '#9fb3a6', jas: '#6b7280', broek: '#2a2d35', hoofd: 'bril', extra: 'papier' } },
      binnen: { kaart: ['##w##w##w##', '#...SSS...#', '#.........#', '#PPP...PPP#', '#.........#', '#PPP...PPP#', '#p.......p#', '#####D#####'], start: [5, 6], npc: [5, 2] },
      intro: [
        'Hier werd vroeger gebeden. Nu vergaderen we.',
        'Over elk digitaal initiatief in deze organisatie wordt ergens besloten. De vraag is of jij aan die tafel zit.',
      ],
      dilemma: {
        vraag: 'Je team wil zelf een AI-abonnement afsluiten om sneller te werken. Wat doe je?',
        opties: [
          { tekst: 'Gewoon doen. Vragen is vertragen.', punten: 0, effect: -10, gevolg: 'Over drie maanden hebben vijf teams vijf tools, geen verwerkersovereenkomst en niemand die weet wat er met de data gebeurt.' },
          { tekst: 'Eerst drie maanden proefdraaien met geanonimiseerde teksten, daarna aanmelden.', punten: 30, effect: 5, gevolg: 'Een proef zonder afspraken is gewoon gebruik. Maar je hebt na drie maanden wel iets om mee aan tafel te komen.' },
          { tekst: 'Het initiatief aanmelden bij de stuurgroep digitalisering, via de CMIO of de staf.', punten: 50, effect: 10, gevolg: 'Het duurt zes weken. Daarna mag het, met afspraken, en twee andere teams kunnen het meteen ook gebruiken.' },
          { tekst: 'Wachten tot het bestuur iets regelt.', punten: 15, effect: 0, gevolg: 'Dit is de speelbal-optie. Er gebeurt iets, zonder jou: twee andere teams gaan intussen zelf aan de slag.' },
        ],
      },
      opdracht: {
        alleenTeam: true, maxTekens: 60,
        tekst: 'Vraag iemand in de zaal die je niet kent: welke digitale ergernis zou jij als eerste oplossen? Schrijf het antwoord hier in vijf woorden.',
      },
      kaart: {
        titel: 'Regie is een plek aan tafel, plus iets te zeggen hebben.',
        tekst: 'Bij GGZ NHN loopt elk digitaal of AI-initiatief via de stuurgroep digitalisering [TJEERD: naam en route bevestigen]. De medische staf zit daar aan tafel via de CMIO. Jouw route: zeg het tegen je vertegenwoordiger.',
        bron: 'GGZ NHN, governance digitalisering.',
      },
    },
    {
      id: 'poli', naam: '[TJEERD: gebouw voor de beslisondersteuning, bijv. de polikliniek]', kortenaam: 'Polikliniek [TJEERD]', functie: '[TJEERD: functie]', thema: 'de computer denkt mee', tegel: [7, 6], soort: 'dilemma',
      npc: { naam: 'Lars', rol: 'accountmanager van een leverancier, strak pak, laptop', kleur: '#4a4a4a', look: { haar: '#1a1f1c', jas: '#2a2d35', broek: '#2a2d35', hoofd: 'kort', extra: 'laptop' } },
      binnen: { kaart: ['##w#####w##', '#s..mdm..s#', '#...ccc...#', '#.........#', '#c.......c#', '#t.......t#', '#p.......p#', '#####D#####'], start: [5, 6], npc: [5, 3] },
      intro: ['Onze beslisondersteuning draait al in Zweden en het Verenigd Koninkrijk. Jullie zijn bijna aan de beurt. Kijk, hij stelt nu voor om de medicatie aan te passen.'],
      dilemma: {
        vraag: 'Het systeem adviseert een medicatiewijziging bij een cliënt die je al jaren kent. Wat doe je?',
        opties: [
          { tekst: 'Volgen. Het systeem heeft meer data gezien dan ik.', punten: 0, effect: -10, gevolg: 'Je hebt niet gecheckt of het model is gevalideerd op een populatie als de onze. Automation bias heet dat.' },
          { tekst: 'Lars vragen naar de validatiestudie en tot die tijd het advies negeren.', punten: 30, effect: 5, gevolg: 'Goede vraag. Lars komt erop terug. Intussen verschijnt het advies wel bij al je collega’s, en niemand meldt wat.' },
          { tekst: 'Wegen tegen wat ik weet, vastleggen waarom ik afwijk, en de afwijking melden bij de leverancier.', punten: 50, effect: 10, gevolg: 'Dit is hoe het bedoeld is: de mens in de lus, met een spoor in het dossier en een signaal naar de maker.' },
          { tekst: 'Negeren. Ik heb er niets aan.', punten: 15, effect: 0, gevolg: 'Als het advies onzin was, hoort de leverancier dat te weten. Melden hoort bij het werk.' },
        ],
      },
      kaart: {
        titel: 'De mens blijft in de lus. Dat is geen slogan maar een werkwijze.',
        tekst: 'Beslisondersteuning is pas bruikbaar als hij gevalideerd is op onze populatie, uitlegbaar is en fouten gemeld kunnen worden. Elders bewezen betekent hier nog niets.',
        bron: 'Federatie Medisch Specialisten (2026), paragraaf 4.4.',
      },
    },
    {
      id: 'team', naam: 'De Teamkamer', functie: '[TJEERD: naam en functie van dit gebouw]', thema: 'de digitale collega', tegel: [15, 7], soort: 'discussie',
      npc: { naam: 'Mila', rol: 'regiebehandelaar', kleur: '#7a3e9d', look: { haar: '#1a1f1c', jas: '#7a3e9d', broek: '#3b3f4a', hoofd: 'lang' } },
      binnen: { kaart: ['##w##B##w##', '#.........#', '#.ctttttc.#', '#.c.....c.#', '#.ctttttc.#', '#.........#', '#p.m.....p#', '#####D#####'], start: [5, 6], npc: [5, 1] },
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
      id: 'hic', naam: 'Nieuwbouw HIC', functie: 'high intensive care (in aanbouw)', thema: '2030', tegel: [24, 6], soort: 'dilemma', minigame: 'noodkoffer',
      npc: { naam: 'Jij, 2030', rol: 'jijzelf, helm op', kleur: '#e0a84a', look: { haar: '#e0a84a', jas: '#e0a84a', broek: '#3b3f4a', hoofd: 'helm' } },
      binnen: { kaart: ['##w##w##w##', '#x.......x#', '#.b..b..b.#', '#.........#', '#x..md....#', '#.......xx#', '#.........#', '#####D#####'], start: [5, 6], npc: [5, 3] },
      intro: [
        'Dit gebouw staat er dan allang. De rapportage schrijft zichzelf en jij tekent. De beslisondersteuning is gevalideerd op onze mensen. De staf beslist mee over elk systeem. De tijd die vrijkomt gaat naar de cliënt bij wie het ingewikkeld is.',
        'Maar eerst: het is 2030, het is nacht op de HIC, en het EPD ligt eruit.',
      ],
      dilemma: {
        vraag: 'Wat doe je als eerste?',
        opties: [
          { tekst: 'Wachten op ICT.', punten: 0, effect: -10, gevolg: 'Na veertig minuten belt ICT terug. Je weet nog steeds niet wie er vannacht op de afdeling liggen en wat ze slikken.' },
          { tekst: 'De verpleegkundige vragen de medicatie uit het hoofd op te schrijven, en zo de nacht door.', punten: 30, effect: 5, gevolg: 'Het werkt vannacht. Maar twee cliënten zijn vandaag opgenomen en die kent niemand uit het hoofd. Daar is de noodprocedure voor.' },
          { tekst: 'Een collega bellen die het misschien weet.', punten: 15, effect: 0, gevolg: 'De collega weet het ook niet. Jullie bedenken samen dat dit geoefend had moeten worden.' },
          { tekst: 'De noodprocedure starten: [TJEERD: wat de noodprocedure bij EPD-uitval is].', punten: 50, effect: 10, gevolg: 'Je hebt binnen vijf minuten overzicht. Dat kon alleen omdat je de procedure kende.' },
        ],
      },
      kaart: {
        titel: 'Niet óf, maar wanneer. Ken de noodprocedure.',
        tekst: 'Z-CERT, het expertisecentrum voor cybersecurity in de zorg, zegt het al jaren: de vraag is niet of een zorginstelling wordt geraakt, maar wanneer. Weten wat je doet bij uitval hoort bij professioneel handelen.',
        bron: 'Federatie Medisch Specialisten (2026), paragraaf 4.5.',
      },
    },
    {
      id: 'opname', naam: 'Spreekkamer 4', functie: '[TJEERD: naam en functie van dit gebouw]', thema: 'de cliënt neemt op', tegel: [34, 6], soort: 'discussie',
      npc: { naam: 'Dennis', rol: 'cliënt, 34, telefoon op tafel', kleur: '#2f5f8f', look: { haar: '#1a1f1c', jas: '#2f5f8f', broek: '#3b3f4a', hoofd: 'kort', extra: 'telefoon' } },
      binnen: { kaart: ['##w#####w##', '#s.......s#', '#...dm....#', '#...c.....#', '#.........#', '#...c.....#', '#p.......p#', '#####D#####'], start: [5, 6], npc: [4, 4] },
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
      id: 'kwekerij', naam: 'Kwekerij', functie: 'werkplek voor mensen met afstand tot de arbeidsmarkt', thema: 'digitaal waar het kan', tegel: [40, 7], soort: 'dilemma', minigame: 'bowlen',
      npc: { naam: 'Joop', rol: 'medewerker kwekerij, modder aan de handen', kleur: '#2f7d32', look: { haar: '#6b4a2b', jas: '#2f7d32', broek: '#5a4632', hoofd: 'kort', extra: 'modder' } },
      binnen: { kaart: ['#wwwwwwwww#', '#pp.pp.pp.#', '#.........#', '#pp.pp.pp.#', '#.........#', '#pp.pp.pp.#', '#x.......k#', '#####D#####'], start: [5, 6], npc: [6, 4] },
      intro: ['Ik werk hier drie dagen in de week. Ik heb een telefoon, maar dat portaal van jullie, daar kom ik niet in.'],
      dilemma: {
        vraag: 'Je wilt Joops controleafspraken voortaan via beeldbellen en het cliëntportaal doen. Wat doe je?',
        opties: [
          { tekst: 'Doorzetten. Digitaal is de norm, hij leert het wel.', punten: 0, effect: -10, gevolg: 'Joop komt twee keer niet opdagen. Niet uit onwil; hij kwam er niet in.' },
          { tekst: 'Joop een tablet van de afdeling meegeven, met een handleiding.', punten: 30, effect: 5, gevolg: 'Goede bedoeling. Na twee weken ligt de tablet in de la. Niemand heeft het samen met hem gedaan.' },
          { tekst: 'Alles bij het oude laten. Digitaal is niets voor onze mensen.', punten: 15, effect: 0, gevolg: 'Veilig voor Joop, maar de collega’s die wél digitaal kunnen, verliezen een optie. En de wachtlijst blijft.' },
          { tekst: 'Samen kijken wat werkt: fysiek waar het moet, digitaal waar het kan, en een digicoach voor het portaal.', punten: 50, effect: 10, gevolg: 'Joop belt nu zelf, met hulp van de digicoach. De controle op locatie blijft.' },
        ],
      },
      kaart: {
        titel: 'Digitaal waar het kan, fysiek waar het moet.',
        tekst: 'Ongeveer één op de vijf Nederlanders heeft moeite met digitale middelen; in onze populatie meer. Hybride zorg is maatwerk per cliënt, met een analoog alternatief dat blijft bestaan.',
        bron: 'Federatie Medisch Specialisten (2026), paragraaf 4.2 en bijlage 1.',
      },
    },
    {
      id: 'bestuur', naam: 'Het Bestuursgebouw', functie: '[TJEERD: naam en functie van dit gebouw]', thema: 'de klacht van twintig pagina’s', tegel: [25, 10], soort: 'discussie',
      npc: { naam: 'Ingrid', rol: 'klachtenfunctionaris, dikke map', kleur: '#8a6d3b', look: { haar: '#8a6d3b', jas: '#a0522d', broek: '#2a2d35', hoofd: 'lang', extra: 'map' } },
      binnen: { kaart: ['##w##w##w##', '#.........#', '#.ctttttc.#', '#.c.....c.#', '#.ctttttc.#', '#.........#', '#pmd...s.p#', '#####D#####'], start: [5, 6], npc: [5, 1] },
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
      id: 'olvendijk', naam: 'De Olvendijk', functie: '[TJEERD: functie]', thema: 'het dossier gaat de deur niet uit', tegel: [21, 13], soort: 'dilemma',
      npc: { naam: 'Fatima', rol: 'functionaris gegevensbescherming, koffie', kleur: '#7a3e9d', look: { haar: '#1a1f1c', jas: '#7a3e9d', broek: '#3b3f4a', hoofd: 'lang', extra: 'koffie' } },
      binnen: { kaart: ['##w##w##w##', '#s.s...mdm#', '#.........#', '#.mdm.....#', '#...c.....#', '#.........#', '#p.......p#', '#####D#####'], start: [5, 6], npc: [5, 2] },
      intro: ['Mooi gebouw, hè. Hier staan onze servers niet. Die staan ergens anders. Weet jij waar jouw gegevens staan als je op een knop drukt?'],
      dilemma: {
        vraag: 'Je moet een ingewikkelde brief aan de huisarts schrijven. Je wilt hulp van AI.',
        opties: [
          { tekst: 'Naam en geboortedatum weghalen en de tekst in een gratis AI-app plakken. Zo is het anoniem.', punten: 0, effect: -10, gevolg: 'Zonder naam is een levensverhaal nog steeds herleidbaar. De tekst staat nu op een server buiten Europa, zonder verwerkersovereenkomst. Dit is een datalek, ook al merkt niemand het.' },
          { tekst: 'De AI-assistent gebruiken die GGZ NHN heeft ingericht, en de brief zelf nalezen.', punten: 50, effect: 10, gevolg: 'De brief staat in tien minuten. De gegevens blijven waar ze horen, en jij blijft de auteur.' },
          { tekst: 'De betaalde versie van een bekende AI-app gebruiken. Die traint niet op je gegevens.', punten: 15, effect: 0, gevolg: 'Niet trainen is iets anders dan niet opslaan. Zonder verwerkersovereenkomst met GGZ NHN mag het nog steeds niet.' },
          { tekst: 'Het AI-team vragen wat mag, en de brief vandaag nog zelf schrijven.', punten: 30, effect: 5, gevolg: 'Je krijgt dezelfde dag antwoord: de eigen assistent. Volgende keer ben je sneller. En je naam staat nu op de lijst van mensen die meedenken.' },
        ],
      },
      kaart: {
        titel: 'Nooit cliëntgegevens in openbare AI-tools.',
        tekst: 'Alleen tools met een verwerkersovereenkomst, binnen de GGZ NHN-omgeving: [TJEERD: welke tools zijn toegestaan voor cliëntgegevens en welke niet]. De Federatie zegt het ook: voorkom het uploaden van patiëntdata naar openbare online tools.',
        bron: 'AVG; Federatie Medisch Specialisten, De rol van de medisch specialist in het digitale tijdperk (2026), bijlage 2.',
      },
    },
    {
      id: 'venne', naam: 'De Hooge Venne', functie: 'forensische psychiatrie', thema: 'het algoritme heeft een mening', tegel: [31, 18], soort: 'dilemma', minigame: 'boogschieten',
      npc: { naam: 'Nadia', rol: 'forensisch psycholoog', kleur: '#b5443a', look: { haar: '#1a1f1c', jas: '#b5443a', broek: '#2a2d35', hoofd: 'knot' } },
      binnen: { kaart: ['#w#######w#', '#..s...s..#', '#.........#', '#.mdm.....#', '#..c....P.#', '#.........#', '#p......xx#', '#####D#####'], start: [5, 6], npc: [3, 5] },
      intro: [
        'Welkom in de forensische kliniek. Hier beslissen we over vrijheid.',
        'Sinds kort helpt een algoritme mee met de risicotaxatie. Het zegt vandaag: hoog risico op recidive.',
      ],
      dilemma: {
        vraag: 'De rechter wil morgen jouw advies. Wat doe je?',
        opties: [
          { tekst: 'Overnemen. Het model heeft duizenden dossiers gezien.', punten: 0, effect: -10, gevolg: 'Je weet niet op welke populatie het model is getraind, en of het ooit is gevalideerd op mensen zoals hier. Je advies is nu het advies van een leverancier.' },
          { tekst: 'Het advies volgen, en in het rapport vermelden dat een algoritme is gebruikt.', punten: 30, effect: 5, gevolg: 'Transparant, maar je hebt niets gewogen. De rechter krijgt een leverancier met een voetnoot.' },
          { tekst: 'Negeren. Risicotaxatie is klinisch werk.', punten: 15, effect: 0, gevolg: 'Kan. Maar als het model structureel onzin zegt, hoort iemand dat te melden. Ook negeren is een keuze.' },
          { tekst: 'Wegen tegen je eigen taxatie, en in het advies uitleggen waarom je meegaat of afwijkt.', punten: 50, effect: 10, gevolg: 'De rechter krijgt een advies met een mens erachter, en een spoor van hoe het tot stand kwam.' },
        ],
      },
      kaart: {
        titel: 'Een algoritme dat beslissingen ondersteunt, is een medisch hulpmiddel.',
        tekst: 'Vraag altijd drie dingen: op welke populatie is het gevalideerd, wat is het beoogd gebruik, en hoe meld ik fouten. Jij blijft verantwoordelijk.',
        bron: 'MDR (EU 2017/745); Federatie Medisch Specialisten (2026), competentie 2 en 3.',
      },
    },
    {
      id: 'olvendijk79', naam: 'Olvendijk 79', functie: '[TJEERD: functie]', thema: 'de cliënt vraagt wat je doet', tegel: [16, 21], soort: 'dilemma',
      npc: { naam: 'Willem', rol: 'cliënt, 58, komt voor een controle', kleur: '#8a6d3b', look: { haar: '#9fb3a6', jas: '#8a6d3b', broek: '#3b3f4a', hoofd: 'kort' } },
      binnen: { kaart: ['##w#####w##', '#s.......p#', '#...dm....#', '#...c.....#', '#.........#', '#....c....#', '#p........#', '#####D#####'], start: [5, 6], npc: [5, 4] },
      intro: ['Neemt dat ding ons gesprek op? Wat gebeurt daar dan mee?'],
      dilemma: {
        vraag: 'Wat zeg je tegen Willem?',
        opties: [
          { tekst: 'Nee hoor, dat is alleen een hulpmiddel.', punten: 0, effect: -10, gevolg: 'Het klopt niet en Willem voelt dat. Vertrouwen is het enige instrument dat je niet kunt vervangen.' },
          { tekst: 'Ja. Het gesprek wordt omgezet in een samenvatting die ik nalees. [TJEERD: wat er met de audio gebeurt en hoe lang die bewaard blijft]. Je mag nee zeggen, dan schrijf ik zelf.', punten: 50, effect: 10, gevolg: 'Willem zegt ja. Hij vraagt of hij de samenvatting mag lezen. Goede vraag.' },
          { tekst: 'Ja, dat hoort tegenwoordig bij het dossier. Het is goed beveiligd.', punten: 15, effect: 0, gevolg: 'Het hoort niet verplicht bij het dossier en Willem mag weigeren. Beveiligd klinkt goed, maar beantwoordt zijn vraag niet.' },
          { tekst: 'Ik zet het uit, dan hebben we er geen gedoe mee.', punten: 30, effect: 5, gevolg: 'Geen gedoe, geen samenvatting. Willem weet nog steeds niet wat dat ding doet, en jij typt vanavond.' },
        ],
      },
      kaart: {
        titel: 'Leg uit wat AI doet, en dat de cliënt nee mag zeggen.',
        tekst: 'Competentie 4 van de Federatie: informeer cliënten en naasten helder over het gebruik van AI. Bij dwang, wilsonbekwaamheid of crisis geldt extra zorgvuldigheid: [TJEERD: de GGZ NHN-afspraak over toestemming en opname].',
        bron: 'Federatie Medisch Specialisten, Competentieset Verantwoord gebruik van AI in de zorg (2026).',
      },
    },
  ],

  // Minigames. Punten hooguit 60 per spel.
  minigames: {
    noodkoffer: {
      titel: 'Noodkoffer', uitleg: 'Het EPD ligt eruit. Onthoud de volgorde van de noodprocedure en tik hem na. Elke ronde wordt langer; twee fouten en de nacht is om.',
      stappen: ['Papieren lijst', 'Noodlaptop', 'ICT bellen', 'GD informeren'], rondes: 6, puntenPerRonde: 10,
      klaar: 'Je kende de procedure tot stap {n}. [TJEERD: de echte stappen van de noodprocedure invullen in content.js]',
    },
    dicteer: {
      titel: 'Dicteer-ritme', uitleg: 'Boven staat wat er gezegd is. Daaronder verschijnt de AI-samenvatting, woord voor woord. Tik op het woord dat niet klopt. Tik je op een goed woord, dan kost dat punten.',
      hit: 12, mis: 6, tempo: 900,
      zinnen: [
        { gesproken: 'Slaapt beter sinds de nieuwe dosering.', woorden: [['Slaapt', true], ['slechter', false], ['sinds', true], ['de', true], ['nieuwe', true], ['dosering.', true]] },
        { gesproken: 'Geen suïcidale gedachten, wel somber.', woorden: [['Geen', true], ['suïcidale', true], ['gedachten,', true], ['niet', false], ['somber.', true]] },
        { gesproken: 'Vervolgafspraak over twee weken met de VS.', woorden: [['Vervolgafspraak', true], ['over', true], ['twee', true], ['maanden', false], ['met', true], ['de', true], ['VS.', true]] },
        { gesproken: 'Medicatie besproken, dosering niet gewijzigd.', woorden: [['Medicatie', true], ['besproken,', true], ['dosering', true], ['verhoogd.', false]] },
        { gesproken: 'Partner komt volgende keer mee.', woorden: [['Partner', true], ['komt', true], ['volgende', true], ['keer', true], ['niet', false], ['mee.', true]] },
      ],
      klaar: '{hits} van de {totaal} fouten gevonden, {missers} keer een goed woord aangetikt. Nalezen is werk.',
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
    praat: 'A · PRAAT',
    volgende: 'VOLGENDE',
    alles: 'Alles bezocht',
    minigameStart: 'Even iets anders. {titel}: {uitleg}',
    minigameKlaar: 'Dat levert {punten} punten op.',
    discussieBedankt: 'Genoteerd. Dit levert {punten} punten op, welke keuze jullie ook maakten.',
    landgoed: 'Landgoed',
    onderweg: 'Onderweg',
    wissen: 'Alles wissen en opnieuw beginnen?',
    agendaLeeg: 'Vul beide vragen in, of kies iets uit de lijst.',
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
