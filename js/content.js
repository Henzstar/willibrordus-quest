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
    '......BBB.BBB.B..B..SNNSSNNSSFFFFBBBB.GGGG.FFFF=',
    '..............BBBB..SSSSSSSSSFFFF.....GGGG.....=',
    '......==========================================',
    '......=BBB..PPPPPPTTTTTTBBB........TTTTT-TTTTTT=',
    '..BBTTTBBB..PPPPPPTTTTTTBBB-.......TTTBBBBTTTTT=',
    '..BBTTT--------------------T-TTTTTTTTTBBBBTTTTT=',
    '..BBTTTTTT-.TTTT-..BBBBBTTTTT-TTTTTTTTBBBBTTTTT=',
    '.WBBTTTTTT-.TTTT-..BBBBBTTTTTT-TTTTTTTTTTTTTTTT=',
    '.WBBKKK----TTTTT-.TTTTT.TTTTTTT----TTTTTTTTTTTT=',
    '..BBKKKTTT-TTTTT-.TTTTT..TTTBBBBBB-.FFFFFFTTTTT=',
    '..BBBTTTTT-TTTTT-.TTTTT..TTTB.BBBB-.FFFFFFTTTTT=',
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

  // Straatnamen als kleine labels; richting h = horizontaal, v = verticaal; tegel = linkerboven-ankertegel.
  straten: [
    { naam: 'Kanaalweg', tegel: [20, 0], richting: 'h' },
    { naam: 'De Strandwal', tegel: [8, 7], richting: 'h' },
    { naam: 'De Bullaan', tegel: [34, 7], richting: 'h' },
    { naam: 'Rosendaal', tegel: [47, 12], richting: 'v' },
    { naam: 'De Olvendijk', tegel: [15, 10], richting: 'h' },
    { naam: 'Het Landpad', tegel: [16, 12], richting: 'v' },
    { naam: 'De Hooge Venne', tegel: [29, 11], richting: 'h' },
    { naam: 'De Overtoom', tegel: [14, 17], richting: 'h' },
    { naam: 'Het Kerkpad', tegel: [10, 13], richting: 'v' },
    { naam: 'De Beuk', tegel: [34, 14], richting: 'v' },
    { naam: 'De Kroft', tegel: [4, 21], richting: 'h' },
  ],

  // Avatars: de perk doet niets, behalve lachen.
  avatars: [
    { id: 'aios', naam: 'De aios', perk: 'Perk: koffie telt als maaltijd. Doet verder niets.', jas: '#2b6cb0', haar: '#6b4a2b' },
    { id: 'psychiater', naam: 'De psychiater', perk: 'Perk: zucht met gezag. Geen effect op de score.', jas: '#1d6b4f', haar: '#9fb3a6' },
    { id: 'vs', naam: 'De verpleegkundig specialist', perk: 'Perk: weet waar de formulieren liggen. Niemand vraagt het.', jas: '#b5443a', haar: '#1a1f1c' },
    { id: 'ondersteuner', naam: 'De ondersteuner', perk: 'Perk: heeft de agenda van iedereen. Behalve die van zichzelf.', jas: '#7a3e9d', haar: '#e0a84a' },
  ],

  profielen: [
    { min: 0, max: 34, naam: 'Speelbal', kort: 'Speelbal' },
    { min: 35, max: 64, naam: 'Meebeweger', kort: 'Meebeweger' },
    { min: 65, max: 84, naam: 'Stuurman of Stuurvrouw', kort: 'Stuurman/vrouw' },
    { min: 85, max: 100, naam: 'Kapitein', kort: 'Kapitein' },
  ],

  regieStart: 50,

  // Locaties: tegel = begaanbare tegel naast het gebouw (marker); npcTegel = tegel ernaast.
  locaties: [
    {
      id: 'start', naam: 'Hoofdingang', functie: 'start', tegel: [14, 10], npcTegel: [13, 10],
      npc: { naam: 'Bep', rol: 'portier', kleur: '#c9a24d' },
      intro: [
        'Welkom op het landgoed. Je loopt vanavond langs acht gebouwen. Overal wacht een keuze. Je regie-meter laat zien of je stuurt, of gestuurd wordt.',
        'Kies je bestemming op de kaart. Wissel per gebouw wie de telefoon vasthoudt; de anderen eten.',
      ],
    },
    {
      id: 'keuken', naam: 'Keuken met Karakter', functie: 'restaurant', thema: 'werklast begint bij registratie', tegel: [8, 10], npcTegel: [9, 10],
      npc: { naam: 'Sam', rol: 'aios, bord bitterballen', kleur: '#2b6cb0' },
      intro: ['Acht gesprekken gehad, nul rapportages geschreven. Het is 17.30 uur. Jij ook?'],
      dilemma: {
        vraag: 'Hoe krijg je de rapportages vanavond af?',
        opties: [
          { tekst: 'Na het eten alles uit het hoofd tikken.', effect: -10, gevolg: 'Om 19.40 uur klaar. Twee gesprekken zijn al vervaagd, de verzekeraar leest later ‘medicatie besproken’.' },
          { tekst: 'Spraakgestuurd rapporteren gebruiken en de samenvatting nalezen voordat je tekent.', effect: 10, gevolg: 'Om 18.05 uur klaar. Je haalt twee verkeerde interpretaties uit de samenvatting. Dat is precies je werk.' },
          { tekst: 'Vragen of de verpleegkundig specialist het voor je doet.', effect: 0, gevolg: 'Taken kun je herschikken, verantwoordelijkheid niet. En de VS heeft ook acht gesprekken gehad.' },
        ],
      },
      kaart: {
        titel: 'Werklast begint bij de registratie.',
        tekst: 'Spraakgestuurd rapporteren bij GGZ NHN: [TJEERD: cijfers die publiek mogen, bijv. aantal behandelaren in de startfase en het aandeel dat meer werkplezier ervaart]. Een AI-samenvatting is een concept. Jij leest, corrigeert en tekent.',
        bron: 'GGZ NHN, startfase spraakgestuurd rapporteren 2026.',
      },
    },
    {
      id: 'olvendijk', naam: 'De Olvendijk', functie: '[TJEERD: functie]', thema: 'het dossier gaat de deur niet uit', tegel: [21, 10], npcTegel: [22, 10],
      npc: { naam: 'Fatima', rol: 'functionaris gegevensbescherming, koffie', kleur: '#7a3e9d' },
      intro: ['Mooi gebouw, hè. Hier staan onze servers niet. Die staan ergens anders. Weet jij waar jouw gegevens staan als je op een knop drukt?'],
      dilemma: {
        vraag: 'Je moet een ingewikkelde brief aan de huisarts schrijven. Je wilt hulp van AI.',
        opties: [
          { tekst: 'Dossier kopiëren naar een gratis AI-app op je telefoon. Even snel.', effect: -15, gevolg: 'De tekst staat nu op een server buiten Europa, zonder verwerkersovereenkomst. Dit is een datalek, ook al merkt niemand het.' },
          { tekst: 'De AI-assistent gebruiken die GGZ NHN heeft ingericht en die binnen de eigen omgeving draait.', effect: 10, gevolg: 'De brief staat in tien minuten. De gegevens blijven waar ze horen.' },
          { tekst: 'Het AI-team vragen wat mag.', effect: 5, gevolg: 'Je krijgt dezelfde dag antwoord. En je naam staat nu op de lijst van mensen die meedenken.' },
        ],
      },
      kaart: {
        titel: 'Nooit cliëntgegevens in openbare AI-tools.',
        tekst: 'Alleen tools met een verwerkersovereenkomst, binnen de GGZ NHN-omgeving: [TJEERD: welke tools zijn toegestaan voor cliëntgegevens en welke niet]. De Federatie zegt het ook: voorkom het uploaden van patiëntdata naar openbare online tools.',
        bron: 'AVG; Federatie Medisch Specialisten, De rol van de medisch specialist in het digitale tijdperk (2026), bijlage 2.',
      },
    },
    {
      id: 'olvendijk79', naam: 'Olvendijk 79', functie: '[TJEERD: functie]', thema: 'de cliënt vraagt wat je doet', tegel: [27, 17], npcTegel: [26, 17],
      npc: { naam: 'Willem', rol: 'cliënt, 58, komt voor een controle', kleur: '#8a6d3b' },
      intro: ['Neemt dat ding ons gesprek op? Wat gebeurt daar dan mee?'],
      dilemma: {
        vraag: 'Wat zeg je tegen Willem?',
        opties: [
          { tekst: 'Nee hoor, dat is alleen een hulpmiddel.', effect: -10, gevolg: 'Het klopt niet en Willem voelt dat. Vertrouwen is het enige instrument dat je niet kunt vervangen.' },
          { tekst: 'Ja. Het gesprek wordt omgezet in een samenvatting die ik nalees. [TJEERD: wat er met de audio gebeurt en hoe lang die bewaard blijft]. Je mag nee zeggen, dan schrijf ik zelf.', effect: 10, gevolg: 'Willem zegt ja. Hij vraagt of hij de samenvatting mag lezen. Goede vraag.' },
          { tekst: 'Ik zet het uit, dan hebben we er geen gedoe mee.', effect: 0, gevolg: 'Geen gedoe, geen samenvatting, en Willem weet nog steeds niet wat dat ding doet.' },
        ],
      },
      kaart: {
        titel: 'Leg uit wat AI doet, en dat de cliënt nee mag zeggen.',
        tekst: 'Competentie 4 van de Federatie: informeer cliënten en naasten helder over het gebruik van AI. Bij dwang, wilsonbekwaamheid of crisis geldt extra zorgvuldigheid: [TJEERD: de GGZ NHN-afspraak over toestemming en opname].',
        bron: 'Federatie Medisch Specialisten, Competentieset Verantwoord gebruik van AI in de zorg (2026).',
      },
    },
    {
      id: 'venne', naam: 'De Hooge Venne', functie: 'forensische psychiatrie', thema: 'het algoritme heeft een mening', tegel: [27, 9], npcTegel: [28, 9],
      npc: { naam: 'Nadia', rol: 'forensisch psycholoog', kleur: '#b5443a' },
      intro: [
        'Welkom in de forensische kliniek. Hier beslissen we over vrijheid.',
        'Sinds kort helpt een algoritme mee met de risicotaxatie. Het zegt vandaag: hoog risico op recidive.',
      ],
      dilemma: {
        vraag: 'De rechter wil morgen jouw advies. Wat doe je?',
        opties: [
          { tekst: 'Overnemen. Het model heeft duizenden dossiers gezien.', effect: -10, gevolg: 'Je weet niet op welke populatie het model is getraind, en of het ooit is gevalideerd op mensen zoals hier. Je advies is nu het advies van een leverancier.' },
          { tekst: 'Negeren. Risicotaxatie is klinisch werk.', effect: 0, gevolg: 'Kan. Maar als het model structureel onzin zegt, hoort iemand dat te melden. Ook negeren is een keuze.' },
          { tekst: 'Wegen tegen je eigen taxatie, en in het advies uitleggen waarom je meegaat of afwijkt.', effect: 10, gevolg: 'De rechter krijgt een advies met een mens erachter, en een spoor van hoe het tot stand kwam.' },
        ],
      },
      kaart: {
        titel: 'Een algoritme dat beslissingen ondersteunt, is een medisch hulpmiddel.',
        tekst: 'Vraag altijd drie dingen: op welke populatie is het gevalideerd, wat is het beoogd gebruik, en hoe meld ik fouten. Jij blijft verantwoordelijk.',
        bron: 'MDR (EU 2017/745); Federatie Medisch Specialisten (2026), competentie 2 en 3.',
      },
    },
    {
      id: 'poli', naam: '[TJEERD: gebouw voor de beslisondersteuning, bijv. de polikliniek]', kortenaam: 'Polikliniek [TJEERD]', functie: '[TJEERD: functie]', thema: 'de computer denkt mee', tegel: [13, 4], npcTegel: [12, 4],
      npc: { naam: 'Lars', rol: 'accountmanager van een leverancier, strak pak, laptop', kleur: '#4a4a4a' },
      intro: ['Onze beslisondersteuning draait al in Zweden en het Verenigd Koninkrijk. Jullie zijn bijna aan de beurt. Kijk, hij stelt nu voor om de medicatie aan te passen.'],
      dilemma: {
        vraag: 'Het systeem adviseert een medicatiewijziging bij een cliënt die je al jaren kent. Wat doe je?',
        opties: [
          { tekst: 'Volgen. Het systeem heeft meer data gezien dan ik.', effect: -10, gevolg: 'Je hebt niet gecheckt of het model is gevalideerd op een populatie als de onze. Automation bias heet dat.' },
          { tekst: 'Negeren. Ik heb er niets aan.', effect: 0, gevolg: 'Als het advies onzin was, hoort de leverancier dat te weten. Melden hoort bij het werk.' },
          { tekst: 'Wegen tegen wat ik weet, en vastleggen waarom ik afwijk.', effect: 10, gevolg: 'Dit is hoe het bedoeld is: de mens in de lus, met een spoor in het dossier.' },
        ],
      },
      kaart: {
        titel: 'De mens blijft in de lus. Dat is geen slogan maar een werkwijze.',
        tekst: 'Beslisondersteuning is pas bruikbaar als hij gevalideerd is op onze populatie, uitlegbaar is en fouten gemeld kunnen worden. Elders bewezen betekent hier nog niets.',
        bron: 'Federatie Medisch Specialisten (2026), paragraaf 4.4.',
      },
    },
    {
      id: 'koepel', naam: 'Cultuurkoepel', functie: 'grote bijeenkomsten', thema: 'wie stuurt bij ons', tegel: [7, 13], npcTegel: [8, 13],
      npc: { naam: 'Henk', rol: 'voorzitter van een stuurgroep, bril, stapel papier', kleur: '#6b7280' },
      intro: [
        'Hier werd vroeger gebeden. Nu vergaderen we.',
        'Over elk digitaal initiatief in deze organisatie wordt ergens besloten. De vraag is of jij aan die tafel zit.',
      ],
      dilemma: {
        vraag: 'Je team wil zelf een AI-abonnement afsluiten om sneller te werken. Wat doe je?',
        opties: [
          { tekst: 'Gewoon doen. Vragen is vertragen.', effect: -10, gevolg: 'Over drie maanden hebben vijf teams vijf tools, geen verwerkersovereenkomst en niemand die weet wat er met de data gebeurt.' },
          { tekst: 'Het initiatief aanmelden bij de stuurgroep digitalisering, via de CMIO of de staf.', effect: 10, gevolg: 'Het duurt zes weken. Daarna mag het, met afspraken, en twee andere teams kunnen het meteen ook gebruiken.' },
          { tekst: 'Wachten tot het bestuur iets regelt.', effect: -10, gevolg: 'Dit is de speelbal-optie. Er gebeurt iets, zonder jou.' },
        ],
      },
      opdracht: {
        alleenTeam: true,
        maxTekens: 60,
        tekst: 'Vraag iemand in de zaal die je niet kent: welke digitale ergernis zou jij als eerste oplossen? Schrijf het antwoord hier in vijf woorden.',
      },
      kaart: {
        titel: 'Regie is een plek aan tafel, plus iets te zeggen hebben.',
        tekst: 'Bij GGZ NHN loopt elk digitaal of AI-initiatief via de stuurgroep digitalisering [TJEERD: naam en route bevestigen]. De medische staf zit daar aan tafel via de CMIO. Jouw route: zeg het tegen je vertegenwoordiger.',
        bron: 'GGZ NHN, governance digitalisering.',
      },
    },
    {
      id: 'kwekerij', naam: 'Kwekerij', functie: 'werkplek voor mensen met afstand tot de arbeidsmarkt', thema: 'digitaal waar het kan', tegel: [40, 8], npcTegel: [39, 8],
      npc: { naam: 'Joop', rol: 'medewerker kwekerij, modder aan de handen', kleur: '#2f7d32' },
      intro: ['Ik werk hier drie dagen in de week. Ik heb een telefoon, maar dat portaal van jullie, daar kom ik niet in.'],
      dilemma: {
        vraag: 'Je wilt Joops controleafspraken voortaan via beeldbellen en het cliëntportaal doen. Wat doe je?',
        opties: [
          { tekst: 'Doorzetten. Digitaal is de norm, hij leert het wel.', effect: -10, gevolg: 'Joop komt twee keer niet opdagen. Niet uit onwil; hij kwam er niet in.' },
          { tekst: 'Samen kijken wat werkt: fysiek waar het moet, digitaal waar het kan, en iemand die hem helpt met het portaal.', effect: 10, gevolg: 'Joop belt nu zelf, met hulp van de digicoach. De controle op locatie blijft.' },
          { tekst: 'Alles bij het oude laten. Digitaal is niets voor onze mensen.', effect: 0, gevolg: 'Veilig voor Joop, maar de collega’s die wél digitaal kunnen, verliezen een optie. En de wachtlijst blijft.' },
        ],
      },
      kaart: {
        titel: 'Digitaal waar het kan, fysiek waar het moet.',
        tekst: 'Ongeveer één op de vijf Nederlanders heeft moeite met digitale middelen; in onze populatie meer. Hybride zorg is maatwerk per cliënt, met een analoog alternatief dat blijft bestaan.',
        bron: 'Federatie Medisch Specialisten (2026), paragraaf 4.2 en bijlage 1.',
      },
    },
    {
      id: 'hic', naam: 'Nieuwbouw HIC', functie: 'high intensive care (in aanbouw)', thema: '2030', tegel: [24, 6], npcTegel: [23, 6],
      npc: { naam: 'Jij, 2030', rol: 'jijzelf, helm op', kleur: '#e0a84a' },
      intro: [
        'Dit gebouw staat er dan allang. De rapportage schrijft zichzelf en jij tekent. De beslisondersteuning is gevalideerd op onze mensen. De staf beslist mee over elk systeem. De tijd die vrijkomt gaat naar de cliënt bij wie het ingewikkeld is.',
        'Maar eerst: het is 2030, het is nacht op de HIC, en het EPD ligt eruit.',
      ],
      dilemma: {
        vraag: 'Wat doe je als eerste?',
        opties: [
          { tekst: 'Wachten op ICT.', effect: -10, gevolg: 'Na veertig minuten belt ICT terug. Je weet nog steeds niet wie er vannacht op de afdeling liggen en wat ze slikken.' },
          { tekst: 'De noodprocedure starten: [TJEERD: wat de noodprocedure bij EPD-uitval is].', effect: 10, gevolg: 'Je hebt binnen vijf minuten overzicht. Dat kon alleen omdat je de procedure kende.' },
          { tekst: 'Een collega bellen die het misschien weet.', effect: 0, gevolg: 'De collega weet het ook niet. Jullie bedenken samen dat dit geoefend had moeten worden.' },
        ],
      },
      kaart: {
        titel: 'Niet óf, maar wanneer. Ken de noodprocedure.',
        tekst: 'Z-CERT, het expertisecentrum voor cybersecurity in de zorg, zegt het al jaren: de vraag is niet of een zorginstelling wordt geraakt, maar wanneer. Weten wat je doet bij uitval hoort bij professioneel handelen.',
        bron: 'Federatie Medisch Specialisten (2026), paragraaf 4.5.',
      },
    },
  ],

  // Korte teksten rond de spelloop.
  teksten: {
    kaartGevonden: 'Je hebt een kaart gevonden.',
    alBezocht: 'Hier ben je al geweest. De kaart staat in je overzicht.',
    naAlleKaarten: 'Acht kaarten. Nog twee stappen: de zelfcheck en de agenda.',
    waarheen: 'Waarheen?',
    onderweg: 'Onderweg',
    landgoed: 'Landgoed',
    wissen: 'Alles wissen en opnieuw beginnen?',
    agendaLeeg: 'Vul beide vragen in, of kies iets uit de lijst.',
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
