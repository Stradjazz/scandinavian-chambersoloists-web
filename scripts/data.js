// Static content data — musicians, concerts, gallery, etc.

// base layout: xPct/sizePct are % of the field's live width (responsive); y is px against the fixed-height field
const MUSICIANS = [
  { name: 'Loussine Azizian Idsøe', instrumentEn: 'VIOLIN', instrumentNo: 'FIOLIN', src: 'assets/musician-loussine.png', xPct: 42, y: 165, sizePct: 27 },
  { name: 'Yuka Sato', instrumentEn: 'VIOLIN', instrumentNo: 'FIOLIN', src: 'assets/musician-yuka.png', xPct: 71, y: 80, sizePct: 19 },
  { name: 'Piotr Slowik', instrumentEn: 'VIOLA', instrumentNo: 'BRATSJ', src: 'assets/musician-piotr.png', xPct: 19, y: 65, sizePct: 17 },
  { name: 'Anne Camilla Furre Thommesen', instrumentEn: 'VIOLA', instrumentNo: 'BRATSJ', src: 'assets/musician-annecamilla.png', xPct: 12, y: 230, sizePct: 21 },
  { name: 'Krisztina Tokaji Eikeset', instrumentEn: 'CELLO', instrumentNo: 'CELLO', src: 'assets/musician-krisztina.png', xPct: 62, y: 260, sizePct: 22 },
  { name: 'Jasper Havelaar', instrumentEn: 'CELLO', instrumentNo: 'CELLO', src: 'assets/musician-jasper.png', xPct: 87, y: 195, sizePct: 18 },
  { name: 'Jan Mathiasson', instrumentEn: 'DOUBLE BASS', instrumentNo: 'KONTRABASS', src: 'assets/musician-jan.png', xPct: 38, y: 310, sizePct: 20 },
  { name: 'Gunnhild Tønder', instrumentEn: 'PIANO/HARPSICHORD', instrumentNo: 'PIANO/CEMBALO', src: 'assets/musician-gunnhild.png', xPct: 89, y: 320, sizePct: 16 },
];

// structured per-concert data — each field (image, title, subtitle, date, time,
// location, description, programme) is kept flat/independent so it can later be
// swapped for a 1:1 API response shape.
const CONCERTS_EN = [
  {
    id: 'concert-1',
    image: 'assets/concert-1.jpg',
    title: 'The Seven Sayings',
    subtitle: 'J. Haydn — The Seven Last Words of Christ',
    date: '18 April 2026',
    time: '6:00 pm',
    location: 'Kristiansand Cathedral, Norway',
    description: 'A meditation for Good Friday: Haydn\'s string-quartet reflections on Christ\'s final words, performed in the resonant nave of Kristiansand Cathedral.',
    programme: [
      { composer: 'J. Haydn', piece: 'The Seven Last Words of Christ' },
      { composer: 'G. Fauré', piece: 'Après un rêve' },
      { composer: 'S. Barber', piece: 'Adagio for Strings' },
    ],
  },
  {
    id: 'concert-2',
    image: 'assets/concert-2.jpg',
    title: 'Stabat Mater',
    subtitle: 'G. Pergolesi — Stabat Mater',
    date: '18 April 2026',
    time: '8:00 pm',
    location: 'Lillesand Kirke',
    description: 'Pergolesi\'s final masterwork paired with a selection of baroque laments, featuring soprano and alto soloists alongside the ensemble.',
    programme: [
      { composer: 'G. Pergolesi', piece: 'Stabat Mater' },
      { composer: 'A. Vivaldi', piece: 'Nulla in mundo pax sincera' },
      { composer: 'T. Albinoni', piece: 'Adagio in G minor' },
      { composer: 'H. Purcell', piece: "Dido's Lament" },
      { composer: 'J.S. Bach', piece: 'Erbarme dich' },
    ],
  },
  {
    id: 'concert-3',
    image: 'assets/concert-3.png',
    title: 'Tall Ships Races',
    subtitle: 'Vivaldi & Grieg — Midnight Concert',
    date: '31 July 2026',
    time: 'Midnight',
    location: 'Odderøya, Kristiansand',
    description: 'A midnight concert on the harbour in connection with the Tall Ships Races, pairing Italian baroque with Norwegian romanticism under open sky.',
    programme: [
      { composer: 'A. Vivaldi', piece: 'The Four Seasons: Summer' },
      { composer: 'E. Grieg', piece: 'Holberg Suite' },
      { composer: 'J. Sibelius', piece: 'Valse Triste' },
      { composer: 'O. Respighi', piece: 'Ancient Airs and Dances' },
    ],
  },
];

const CONCERTS_NO = [
  {
    id: 'concert-1',
    image: 'assets/concert-1.jpg',
    title: 'De syv ord',
    subtitle: 'J. Haydn — Jesu syv siste ord på korset',
    date: '18. april 2026',
    time: '18:00',
    location: 'Kristiansand Domkirke',
    description: 'En langfredagsmeditasjon: Haydns strykekvartettrefleksjoner over Kristi siste ord, fremført i Kristiansand Domkirkes klangfulle kirkerom.',
    programme: [
      { composer: 'J. Haydn', piece: 'Jesu syv siste ord på korset' },
      { composer: 'G. Fauré', piece: 'Après un rêve' },
      { composer: 'S. Barber', piece: 'Adagio for strykere' },
    ],
  },
  {
    id: 'concert-2',
    image: 'assets/concert-2.jpg',
    title: 'Stabat Mater',
    subtitle: 'G. Pergolesi — Stabat Mater',
    date: '18. april 2026',
    time: '20:00',
    location: 'Lillesand Kirke',
    description: 'Pergolesis siste mesterverk sammen med et utvalg barokke klagesanger, med sopran- og altsolister sammen med ensemblet.',
    programme: [
      { composer: 'G. Pergolesi', piece: 'Stabat Mater' },
      { composer: 'A. Vivaldi', piece: 'Nulla in mundo pax sincera' },
      { composer: 'T. Albinoni', piece: 'Adagio i g-moll' },
      { composer: 'H. Purcell', piece: 'Didos klagesang' },
      { composer: 'J.S. Bach', piece: 'Erbarme dich' },
    ],
  },
  {
    id: 'concert-3',
    image: 'assets/concert-3.png',
    title: 'Tall Ships Races',
    subtitle: 'Vivaldi og Grieg — Midnattskonsert',
    date: '31. juli 2026',
    time: 'Midnatt',
    location: 'Odderøya, Kristiansand',
    description: 'En midnattskonsert på havnen i forbindelse med Tall Ships Races, som forener italiensk barokk med norsk romantikk under åpen himmel.',
    programme: [
      { composer: 'A. Vivaldi', piece: 'De fire årstider: Sommer' },
      { composer: 'E. Grieg', piece: 'Holbergsuiten' },
      { composer: 'J. Sibelius', piece: 'Valse Triste' },
      { composer: 'O. Respighi', piece: 'Antikke danser og arier' },
    ],
  },
];

const CONCERTS = { en: CONCERTS_EN, no: CONCERTS_NO };

const GALLERY_IMAGES = [
  'assets/gallery-1.jpg',
  'assets/gallery-2.jpg',
  'assets/gallery-3.png',
  'assets/gallery-4.jpeg',
  'assets/gallery-5.jpg',
  'assets/gallery-6.jpg',
  'assets/gallery-7.jpg',
  'assets/gallery-8.jpg',
];
