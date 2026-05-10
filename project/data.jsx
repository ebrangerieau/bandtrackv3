// data.jsx — mock content for BandTrack screens

const ME = { name: 'Marc', initial: 'M' };
const GROUP = 'Les Échos du Lundi';

const MEMBERS = [
  { name: 'Marc', you: true,  color: null },
  { name: 'Léa',  you: false, color: '#ec4899' },
  { name: 'Sami', you: false, color: '#22d3ee' },
  { name: 'Inès', you: false, color: '#fbbf24' },
];

// Repertoire songs
const SONGS = [
  // En apprentissage
  { id: 's1', title: 'Black Hole Sun',          author: 'Soundgarden',     status: 'learning',   levels: { Marc: 7, 'Léa': 6, Sami: 5, 'Inès': 7 }, mine: 7, updated: 'il y a 2 h' },
  { id: 's2', title: 'Wicked Game',             author: 'Chris Isaak',     status: 'learning',   levels: { Marc: 5, 'Léa': 7, Sami: 6, 'Inès': 4 }, mine: 5, updated: 'hier' },
  { id: 's3', title: 'Karma Police',            author: 'Radiohead',       status: 'learning',   levels: { Marc: 8, 'Léa': 7, Sami: 8, 'Inès': 6 }, mine: 8, updated: 'il y a 3 j' },
  { id: 's4', title: 'Plug In Baby',            author: 'Muse',            status: 'learning',   levels: { Marc: 4, 'Léa': 5, Sami: 6, 'Inès': 3 }, mine: 4, updated: 'il y a 4 j' },
  { id: 's5', title: 'Dreams',                  author: 'Fleetwood Mac',   status: 'learning',   levels: { Marc: 6, 'Léa': 9, Sami: 7, 'Inès': 8 }, mine: 6, updated: 'il y a 5 j' },
  { id: 's6', title: 'Smells Like Teen Spirit', author: 'Nirvana',         status: 'learning',   levels: { Marc: 9, 'Léa': 8, Sami: 9, 'Inès': 8 }, mine: 9, updated: 'il y a 1 sem' },
  // Prêt à jouer
  { id: 'p1', title: 'Seven Nation Army',       author: 'The White Stripes', status: 'ready',    levels: { Marc: 9, 'Léa': 9, Sami: 10, 'Inès': 9 }, mine: 9 },
  { id: 'p2', title: 'Mr. Brightside',          author: 'The Killers',     status: 'ready',      levels: { Marc: 8, 'Léa': 9, Sami: 8, 'Inès': 9 },  mine: 8 },
  { id: 'p3', title: 'Take Me Out',             author: 'Franz Ferdinand', status: 'ready',      levels: { Marc: 9, 'Léa': 8, Sami: 9, 'Inès': 9 },  mine: 9 },
  { id: 'p4', title: 'Use Somebody',            author: 'Kings of Leon',   status: 'ready',      levels: { Marc: 8, 'Léa': 9, Sami: 8, 'Inès': 8 },  mine: 8 },
  { id: 'p5', title: 'Pumped Up Kicks',         author: 'Foster the People', status: 'ready',    levels: { Marc: 9, 'Léa': 8, Sami: 9, 'Inès': 9 },  mine: 9 },
  { id: 'p6', title: 'Lonely Boy',              author: 'The Black Keys',  status: 'ready',      levels: { Marc: 9, 'Léa': 9, Sami: 8, 'Inès': 9 },  mine: 9 },
  { id: 'p7', title: 'Creep',                   author: 'Radiohead',       status: 'ready',      levels: { Marc: 8, 'Léa': 9, Sami: 9, 'Inès': 8 },  mine: 8 },
  { id: 'p8', title: 'All My Loving',           author: 'The Beatles',     status: 'ready',      levels: { Marc: 9, 'Léa': 9, Sami: 9, 'Inès': 9 },  mine: 9 },
  // Suggestions / idées
  { id: 'i1', title: 'Reptilia',                author: 'The Strokes',     status: 'suggestion', levels: {},                                          mine: 0 },
  { id: 'i2', title: 'Do I Wanna Know?',        author: 'Arctic Monkeys',  status: 'suggestion', levels: {},                                          mine: 0 },
  { id: 'i3', title: 'Heart-Shaped Box',        author: 'Nirvana',         status: 'suggestion', levels: {},                                          mine: 2 },
  // Archivés
  { id: 'a1', title: 'Hotel California',        author: 'Eagles',          status: 'archived',   levels: { Marc: 6, 'Léa': 5, Sami: 6, 'Inès': 5 },   mine: 6 },
];

// Average level for a song (0–10), as a number
const avgLevel = (song) => {
  const v = Object.values(song.levels);
  if (!v.length) return 0;
  return v.reduce((a, b) => a + b, 0) / v.length;
};

// Activity feed (dashboard)
const ACTIVITY = [
  { kind: 'status', who: 'Léa',  text: 'a passé Karma Police en En apprentissage', time: 'il y a 2 h',  type: 'learning' },
  { kind: 'add',    who: 'Sami', text: 'a ajouté Reptilia aux idées',              time: 'hier',         type: 'suggestion' },
  { kind: 'status', who: 'Inès', text: 'a marqué Take Me Out comme Prêt à jouer', time: 'il y a 2 j',   type: 'ready' },
  { kind: 'gig',    who: 'Marc', text: 'a créé la prestation La Cantine',          time: 'il y a 3 j',   type: 'accent' },
  { kind: 'note',   who: 'Léa',  text: 'a modifié la note de Wicked Game',         time: 'il y a 4 j',   type: 'accent3' },
];

// Detail track for the fiche écran
const FOCUS_SONG = SONGS.find((s) => s.id === 's1'); // Black Hole Sun
const COLLECTIVE_NOTE = {
  text: 'Intro à la guitare puis batterie qui rentre au refrain. On ralentit le pont — Léa fait l\'arrangement vocal.',
  author: 'Léa',
  time: 'il y a 2 j',
};
const MY_NOTES = 'Travailler le riff principal en barré. Pédale wah au solo (cf. timestamp 2:14). Garder le tempo ~52 bpm — pas d\'accélération sur le pont.';

// Prestations
const GIGS = [
  { id: 'g1', name: 'La Cantine du Faubourg',  date: '22 mai',  weekday: 'Sam.', when: 'à venir', dDay: 12, place: 'Lyon · Croix-Rousse',  setlist: 12, ready: 9,  duration: 75 },
  { id: 'g2', name: 'Festival des Voûtes',     date: '14 juin', weekday: 'Sam.', when: 'à venir', dDay: 35, place: 'Villeurbanne',         setlist: 14, ready: 8,  duration: 90 },
  { id: 'g3', name: 'Open Stage Le Sirius',    date: '04 juil.', weekday: 'Ven.', when: 'à venir', dDay: 55, place: 'Lyon · Confluence',   setlist: 10, ready: 6,  duration: 60 },
  { id: 'p1', name: 'Anniv. surprise Camille', date: '12 avril', weekday: 'Sam.', when: 'passée', dDay: -28, place: 'Vaulx-en-Velin',      setlist: 14, ready: 14, duration: 90 },
  { id: 'p2', name: 'Café Le Rhinocéros',      date: '01 mars',  weekday: 'Sam.', when: 'passée', dDay: -70, place: 'Lyon · Guillotière',  setlist: 11, ready: 11, duration: 60 },
];

const NEXT_GIG = GIGS[0];

Object.assign(window, {
  ME, GROUP, MEMBERS, SONGS, ACTIVITY, FOCUS_SONG, COLLECTIVE_NOTE, MY_NOTES, GIGS, NEXT_GIG,
  avgLevel,
});
