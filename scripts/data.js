// Static content data — musicians, concerts, gallery, etc.

// en/no UI copy dictionary. Tag translatable elements with data-i18n="key"
// (or data-i18n-placeholder="key" for inputs) — renderI18n() in main.js
// walks these and sets textContent/placeholder from DICTIONARY[lang][key].
const DICTIONARY = {
  en: {
    navHome: 'Home',
    navAbout: 'About',
    navConcerts: 'Concerts',
    navMedia: 'Media',
    navContact: 'Contact',
    supportedBy: 'Supported by Arts Council Norway',
    heroKicker: 'SCANDINAVIAN CHAMBER SOLOISTS',
    heroTitle: 'Chamber music of international dimensions',
    heroCta1: 'About the ensemble',
    heroCta2: 'See concerts',
    aboutKicker: 'WHO WE ARE',
    aboutTitle: 'Musicians from five countries, one Kristiansand stage',
    aboutBody1: 'Scandinavian Chamber Soloists is a Kristiansand-based ensemble comprised of musicians from Norway, Sweden, the Netherlands, Armenia and Japan.',
    aboutBody2: 'Founded and led by violinist Loussine Azizian Idsøe, the ensemble has toured Norway and Denmark to critical acclaim since its 2019 debut.',
    aboutCta: 'Get in touch',
    musiciansKicker: 'THE MUSICIANS',
    concertsKicker: "WHAT'S NEXT",
    concertsTitle: 'Upcoming concerts',
    concertReadMore: 'Read more',
    concertsTicketsCta: 'Get tickets',
    concertsLoading: 'Loading concerts…',
    concertsLoadError: "Concerts couldn't be loaded right now — please check back soon.",
    mediaKicker: 'WATCH',
    mediaTitle: "Piazzolla's Spring, live in Trinitatis Church",
    mediaBody: 'Recorded live in Copenhagen, February 2020. The full performance features on our debut album.',
    mediaCta: 'Watch on YouTube',
    galleryKicker: 'GALLERY',
    galleryTitle: "From Grundtvig's Church, Copenhagen",
    contactTitle: 'Drop us a message',
    contactName: 'Your name',
    contactEmail: 'Email address',
    contactMessage: 'Message',
    contactSend: 'Send message',
    contactAddressLabel: 'ADDRESS',
    contactEmailLabel: 'EMAIL',
    contactPhoneLabel: 'PHONE',
    contactSuccess: 'Thanks — your message has been sent.',
    contactError: 'Something went wrong sending your message. Please try again or email us directly.',
  },
  no: {
    navHome: 'Hjem',
    navAbout: 'Om',
    navConcerts: 'Konserter',
    navMedia: 'Media',
    navContact: 'Kontakt',
    supportedBy: 'Støttet af Kulturrådet',
    heroKicker: 'SCANDINAVIAN CHAMBER SOLOISTS',
    heroTitle: 'Kammermusikk av internasjonal klasse',
    heroCta1: 'Om ensemblet',
    heroCta2: 'Se konserter',
    aboutKicker: 'HVEM ER VI',
    aboutTitle: 'Musikere fra fem land, én scene i Kristiansand',
    aboutBody1: 'Scandinavian Chamber Soloists er et ensemble med musikere fra Norge, Sverige, Nederland, Armenia og Japan, med base i Kristiansand.',
    aboutBody2: 'Ensemblet er etablert og ledet av fiolinist Loussine Azizian Idsøe, og har turnert i Norge og Danmark med stor suksess siden debuten i 2019.',
    aboutCta: 'Ta kontakt',
    musiciansKicker: 'MUSIKERE',
    concertsKicker: 'KOMMENDE',
    concertsTitle: 'Kommende konserter',
    concertReadMore: 'Les mer',
    concertsTicketsCta: 'Kjøp billetter',
    concertsLoading: 'Laster konserter…',
    concertsLoadError: 'Kunne ikke laste konserter akkurat nå — prøv igjen senere.',
    mediaKicker: 'SE VIDEO',
    mediaTitle: 'Piazzollas Vår, live i Trinitatis Kirke',
    mediaBody: 'Live-versjon spilt inn i København, februar 2020. Hele fremføringen finnes på vårt debutalbum.',
    mediaCta: 'Se på YouTube',
    galleryKicker: 'GALLERI',
    galleryTitle: 'Fra Grundtvigskirken, København',
    contactTitle: 'Send oss en melding',
    contactName: 'Navnet ditt',
    contactEmail: 'Email adresse',
    contactMessage: 'Beskjed',
    contactSend: 'Sende',
    contactAddressLabel: 'ADRESSE',
    contactEmailLabel: 'EMAIL',
    contactPhoneLabel: 'TELEFON',
    contactSuccess: 'Takk — meldingen din er sendt.',
    contactError: 'Noe gikk galt under sending. Prøv igjen eller send oss en e-post direkte.',
  },
};

// Hero pull-quotes, rotated by scripts/main.js. Wording/source is a direct
// press citation — kept verbatim per language, not paraphrased.
const HERO_QUOTES = [
  {
    textEn: '"Chamber music of international dimensions"',
    textNo: '"Kammermusikk av internasjonal klasse"',
    source: 'EMIL OTTO SYVERTSEN, FÆDRELANDSVENNEN',
  },
  {
    textEn: '"A melting pot of talent from all over the world, a mini-FN with stringed instruments"',
    textNo: '"en smeltedigel af talent fra hele verden, et mini-FN med strenge instrumenter"',
    source: 'AVISEN.NU',
  },
  {
    textEn: '"Loussine Azizian, the Danish-Armenian violinist, stole the spotlight with her dazzling technique and emotional playing. She has a sound that can make one think, \'Is it a Stradivarius or just pure, unadulterated talent?\'"',
    textNo: '"Loussine Azizian, den dansk-armenske violinist, stjal spotlightet med sin blændende teknik og følelsesladede spil. Hun har en klang, der kan få en til at tænke, \'Er det en Stradivarius eller bare ren, uforfalsket talent?\'"',
    source: 'AVISEN.NU',
  },
];

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

// Concert data now comes live from CONCERTS_API_URL (see main.js) instead
// of being hardcoded here — a Google Sheet-backed endpoint returning an
// array of { Title, Subtitle, Description, Date, Location, Tickets,
// Image, Program } rows.

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
