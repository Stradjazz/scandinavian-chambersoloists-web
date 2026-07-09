// Site entry point.

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
    heroQuote: '"A melting pot of talent from all over the world" — the ensemble\'s sound has been called a mini world of stringed instruments.',
    heroQuoteSource: 'EMIL OTTO SYVERTSEN, FÆDRELANDSVENNEN',
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
    heroQuote: '«En smeltedigel av talent fra hele verden» — ensemblets klang er blitt kalt en mini-verden av strengeinstrumenter.',
    heroQuoteSource: 'EMIL OTTO SYVERTSEN, FÆDRELANDSVENNEN',
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

let lang = 'en';

function renderI18n() {
  const dict = DICTIONARY[lang];

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) {
      el.placeholder = dict[key];
    }
  });

  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.getAttribute('data-lang-btn') === lang);
  });

  document.documentElement.lang = lang;
  document.documentElement.setAttribute('data-lang', lang);
}

function setLang(nextLang) {
  if (nextLang === lang) return;
  lang = nextLang;
  renderI18n();
  renderSpheres(currentSphereMouse);
  renderConcertCards();
  if (openConcertId) renderConcertModal(openConcertId);
}

document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
  btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang-btn')));
});

renderI18n();

// ============ ABOUT — musician glass-sphere field ============

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

const sphereField = document.getElementById('sphereField');
const musicianCaptionName = document.getElementById('musicianCaptionName');
const musicianCaptionInstrument = document.getElementById('musicianCaptionInstrument');
let currentSphereMouse = null;

const sphereEls = MUSICIANS.map((musician) => {
  const wrap = document.createElement('div');
  wrap.className = 'musician-sphere';
  wrap.style.left = `${musician.xPct}%`;
  wrap.style.top = `${musician.y}px`;
  wrap.style.width = `${musician.sizePct}%`;

  const clip = document.createElement('div');
  clip.className = 'musician-sphere-clip';

  const photo = document.createElement('img');
  photo.className = 'musician-sphere-photo';
  photo.src = musician.src;
  photo.alt = musician.name;

  const highlight = document.createElement('div');
  highlight.className = 'musician-sphere-highlight';
  const shade = document.createElement('div');
  shade.className = 'musician-sphere-shade';
  const rim = document.createElement('div');
  rim.className = 'musician-sphere-rim';

  clip.append(photo, highlight, shade, rim);
  wrap.append(clip);
  sphereField.append(wrap);

  return { wrap, clip, musician };
});

function renderSpheres(mouse) {
  const fieldWidth = sphereField.clientWidth || 520;
  const maxDist = fieldWidth * 0.36;
  let bestIndex = -1;
  let bestInfluence = 0;

  const influences = sphereEls.map(({ musician }, index) => {
    const bx = (musician.xPct / 100) * fieldWidth;
    const by = musician.y;
    let influence = 0;
    let dx = 0;
    let dy = 0;
    if (mouse) {
      dx = mouse.x - bx;
      dy = mouse.y - by;
      const dist = Math.sqrt(dx * dx + dy * dy);
      influence = smoothstep(Math.max(0, 1 - dist / maxDist));
    }
    if (influence > bestInfluence) {
      bestInfluence = influence;
      bestIndex = index;
    }
    return { dx, dy, influence };
  });

  sphereEls.forEach(({ wrap, clip }, index) => {
    const { dx, dy, influence } = influences[index];
    const scale = 1 + influence * 0.65;
    const tx = (dx * influence * 0.38).toFixed(1);
    const ty = (dy * influence * 0.38).toFixed(1);
    const z = Math.round(influence * 200) + index;

    wrap.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(${scale.toFixed(3)})`;
    wrap.style.zIndex = z;

    const glow = influence > 0.05
      ? `, 0 0 ${Math.round(influence * 46)}px rgba(212,165,116,${(influence * 0.55).toFixed(2)})`
      : '';
    clip.style.boxShadow = `0 10px 26px rgba(0,0,0,.45), inset 0 1px 1px rgba(255,255,255,.15)${glow}`;
    clip.style.borderColor = `rgba(255,255,255,${(0.15 + influence * 0.2).toFixed(2)})`;
  });

  const active = bestIndex >= 0 && bestInfluence > 0.12 ? sphereEls[bestIndex].musician : null;
  if (active) {
    musicianCaptionName.textContent = active.name;
    musicianCaptionInstrument.textContent = lang === 'no' ? active.instrumentNo : active.instrumentEn;
  } else {
    musicianCaptionName.textContent = DICTIONARY[lang].musiciansKicker;
    musicianCaptionInstrument.textContent = '';
  }
}

sphereField.addEventListener('mousemove', (e) => {
  const rect = sphereField.getBoundingClientRect();
  currentSphereMouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  renderSpheres(currentSphereMouse);
});

sphereField.addEventListener('mouseleave', () => {
  currentSphereMouse = null;
  renderSpheres(null);
});

renderSpheres(null);

// ============ CONCERTS — cards + detail modal ============

const concertsGrid = document.getElementById('concertsGrid');
const concertModalBackdrop = document.getElementById('concertModalBackdrop');
const concertModalImage = document.getElementById('concertModalImage');
const concertModalDate = document.getElementById('concertModalDate');
const concertModalTitle = document.getElementById('concertModalTitle');
const concertModalSubtitle = document.getElementById('concertModalSubtitle');
const concertModalLocation = document.getElementById('concertModalLocation');
const concertModalDescription = document.getElementById('concertModalDescription');
const concertModalProgramme = document.getElementById('concertModalProgramme');
const concertModalClose = document.getElementById('concertModalClose');
let openConcertId = null;

function renderConcertCards() {
  concertsGrid.innerHTML = '';

  CONCERTS[lang].forEach((concert) => {
    const card = document.createElement('div');
    card.className = 'concert-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');

    const image = document.createElement('img');
    image.className = 'concert-card-image';
    image.src = concert.image;
    image.alt = concert.title;

    const body = document.createElement('div');
    body.className = 'concert-card-body';

    const datetime = document.createElement('div');
    datetime.className = 'concert-card-datetime';
    datetime.textContent = `${concert.date} · ${concert.time}`;

    const location = document.createElement('div');
    location.className = 'concert-card-location';
    location.textContent = concert.location;

    const title = document.createElement('div');
    title.className = 'concert-card-title';
    title.textContent = concert.title;

    const subtitle = document.createElement('div');
    subtitle.className = 'concert-card-subtitle';
    subtitle.textContent = concert.subtitle;

    const more = document.createElement('div');
    more.className = 'concert-card-more';
    more.innerHTML = `<span>${DICTIONARY[lang].concertReadMore}</span><span>→</span>`;

    body.append(datetime, location, title, subtitle, more);
    card.append(image, body);
    concertsGrid.append(card);

    card.addEventListener('click', () => openConcertModal(concert.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openConcertModal(concert.id);
      }
    });
  });
}

function renderConcertModal(id) {
  const concert = CONCERTS[lang].find((c) => c.id === id);
  if (!concert) return;

  concertModalImage.src = concert.image;
  concertModalImage.alt = concert.title;
  concertModalDate.textContent = `${concert.date} · ${concert.time}`;
  concertModalTitle.textContent = concert.title;
  concertModalSubtitle.textContent = concert.subtitle;
  concertModalLocation.textContent = concert.location;
  concertModalDescription.textContent = concert.description;

  concertModalProgramme.innerHTML = '';
  concert.programme.forEach((p) => {
    const row = document.createElement('div');
    row.className = 'programme-row';
    row.innerHTML = `<span class="programme-composer">${p.composer}</span><span class="programme-sep">—</span><span>${p.piece}</span>`;
    concertModalProgramme.append(row);
  });
}

function openConcertModal(id) {
  openConcertId = id;
  renderConcertModal(id);
  concertModalBackdrop.hidden = false;
}

function closeConcertModal() {
  openConcertId = null;
  concertModalBackdrop.hidden = true;
}

concertModalBackdrop.addEventListener('click', closeConcertModal);
concertModalClose.addEventListener('click', (e) => {
  e.stopPropagation();
  closeConcertModal();
});
concertModalBackdrop.querySelector('.concert-modal').addEventListener('click', (e) => {
  e.stopPropagation();
});

renderConcertCards();

// ============ MEDIA — video ============

const mediaVideoFrame = document.getElementById('mediaVideoFrame');
const mediaVideoPoster = document.getElementById('mediaVideoPoster');
const VIDEO_EMBED_URL = 'https://www.youtube-nocookie.com/embed/9v5GQ4DOOHY?autoplay=1&mute=1&rel=0';

function playVideo() {
  const iframe = document.createElement('iframe');
  iframe.src = VIDEO_EMBED_URL;
  iframe.title = 'Scandinavian Chamber Soloists — video';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  mediaVideoFrame.replaceChild(iframe, mediaVideoPoster);
}

mediaVideoPoster.addEventListener('click', playVideo, { once: true });

// ============ MEDIA — 3D gallery carousel ============

const galleryTrack = document.getElementById('galleryTrack');
const galleryDotsWrap = document.getElementById('galleryDots');
const galleryPrevBtn = document.getElementById('galleryPrevBtn');
const galleryNextBtn = document.getElementById('galleryNextBtn');
let galleryActive = 0;

const galleryItemEls = GALLERY_IMAGES.map((src, i) => {
  const item = document.createElement('div');
  item.className = 'gallery-item';

  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  item.append(img);
  galleryTrack.append(item);

  item.addEventListener('click', () => {
    if (i === galleryActive) {
      openLightbox(i);
    } else {
      galleryGoTo(i);
    }
  });

  return item;
});

const galleryDotEls = GALLERY_IMAGES.map((_, i) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'gallery-dot';
  dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
  dot.addEventListener('click', () => galleryGoTo(i));
  galleryDotsWrap.append(dot);
  return dot;
});

function renderGallery() {
  const n = GALLERY_IMAGES.length;

  galleryItemEls.forEach((item, i) => {
    let offset = i - galleryActive;
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;
    const abs = Math.abs(offset);
    const visible = abs <= 3;

    const translateX = offset * 190;
    const rotateY = offset * -32;
    const scale = abs === 0 ? 1 : Math.max(0.55, 1 - abs * 0.16);
    const opacity = visible ? Math.max(0, 1 - abs * 0.32) : 0;
    const zIndex = 100 - abs;

    item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`;
    item.style.opacity = opacity;
    item.style.zIndex = zIndex;
    item.style.pointerEvents = visible ? 'auto' : 'none';
  });

  galleryDotEls.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === galleryActive);
  });
}

function galleryGoTo(i) {
  const n = GALLERY_IMAGES.length;
  galleryActive = ((i % n) + n) % n;
  renderGallery();
}

galleryPrevBtn.addEventListener('click', () => galleryGoTo(galleryActive - 1));
galleryNextBtn.addEventListener('click', () => galleryGoTo(galleryActive + 1));

renderGallery();

// ============ LIGHTBOX ============

const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const lightboxFrame = lightboxBackdrop.querySelector('.lightbox-frame');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
const lightboxNextBtn = document.getElementById('lightboxNextBtn');
let lightboxIndex = null;

function renderLightbox() {
  lightboxImage.src = GALLERY_IMAGES[lightboxIndex];
}

function openLightbox(i) {
  lightboxIndex = i;
  renderLightbox();
  lightboxBackdrop.hidden = false;
}

function closeLightbox() {
  lightboxIndex = null;
  lightboxBackdrop.hidden = true;
}

function lightboxGoTo(delta) {
  const n = GALLERY_IMAGES.length;
  lightboxIndex = ((lightboxIndex + delta) % n + n) % n;
  renderLightbox();
}

lightboxBackdrop.addEventListener('click', closeLightbox);
lightboxFrame.addEventListener('click', (e) => e.stopPropagation());
lightboxClose.addEventListener('click', (e) => {
  e.stopPropagation();
  closeLightbox();
});
lightboxPrevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  lightboxGoTo(-1);
});
lightboxNextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  lightboxGoTo(1);
});

// ============ PARALLAX ============

const orbSlowEl = document.getElementById('orbSlow');
const orbMedEl = document.getElementById('orbMed');
const orbFastEl = document.getElementById('orbFast');
const heroPhotoEl = document.querySelector('.hero-photo');
const mediaPhotoEl = document.getElementById('mediaVideoPhoto');
const parallaxEls = [orbSlowEl, orbMedEl, orbFastEl, heroPhotoEl, mediaPhotoEl];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updateParallax() {
  const y = window.scrollY;
  orbSlowEl.style.transform = `translateY(${y * 0.16}px)`;
  orbMedEl.style.transform = `translateY(${y * -0.11}px)`;
  orbFastEl.style.transform = `translateY(${y * 0.26}px)`;
  heroPhotoEl.style.transform = `translateY(${y * 0.13}px)`;
  mediaPhotoEl.style.transform = `translateY(${clamp((y - 1400) * 0.05, -30, 30)}px)`;
}

let parallaxRaf = null;

function onParallaxScroll() {
  if (parallaxRaf) return;
  parallaxRaf = requestAnimationFrame(() => {
    parallaxRaf = null;
    updateParallax();
  });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setParallaxEnabled(enabled) {
  window.removeEventListener('scroll', onParallaxScroll);
  if (enabled) {
    window.addEventListener('scroll', onParallaxScroll, { passive: true });
    updateParallax();
  } else {
    parallaxEls.forEach((el) => {
      el.style.transform = '';
    });
  }
}

setParallaxEnabled(!prefersReducedMotion.matches);
prefersReducedMotion.addEventListener('change', (e) => setParallaxEnabled(!e.matches));
