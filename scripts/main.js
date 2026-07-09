// Site entry point.

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
    const isActive = btn.getAttribute('data-lang-btn') === lang;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
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

// ============ MOBILE NAV ============

const siteNav = document.getElementById('siteNav');
const navToggle = document.getElementById('navToggle');
const navToggleIcon = document.getElementById('navToggleIcon');
const navMenu = document.getElementById('navMenu');

function setNavOpen(open) {
  siteNav.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggleIcon.className = open ? 'mdi mdi-close' : 'mdi mdi-menu';
}

navToggle.addEventListener('click', () => {
  setNavOpen(!siteNav.classList.contains('is-open'));
});

navMenu.addEventListener('click', (e) => {
  if (e.target.closest('a')) setNavOpen(false);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setNavOpen(false);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 860) setNavOpen(false);
});

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
mediaVideoPoster.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    playVideo();
  }
}, { once: true });

// ============ MEDIA — 3D gallery carousel ============

const galleryTrack = document.getElementById('galleryTrack');
const galleryDotsWrap = document.getElementById('galleryDots');
const galleryPrevBtn = document.getElementById('galleryPrevBtn');
const galleryNextBtn = document.getElementById('galleryNextBtn');
let galleryActive = 0;

const galleryItemEls = GALLERY_IMAGES.map((src, i) => {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.setAttribute('role', 'button');

  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  item.append(img);
  galleryTrack.append(item);

  const activate = () => {
    if (i === galleryActive) {
      openLightbox(i);
    } else {
      galleryGoTo(i);
    }
  };

  item.addEventListener('click', activate);
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
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

// Desktop card is 260x340 with a 190px translateX step per offset; below
// that, shrink all three together (keeping the same ratios) so the
// coverflow still fits and reads cleanly on narrow viewports.
function getGalleryCardSize() {
  const vw = window.innerWidth;
  const width = vw <= 640 ? 160 : vw <= 1024 ? 200 : 260;
  return {
    width,
    height: Math.round((width * 340) / 260),
    step: Math.round((width * 190) / 260),
  };
}

function renderGallery() {
  const n = GALLERY_IMAGES.length;
  const { width, height, step } = getGalleryCardSize();
  galleryTrack.style.setProperty('--gallery-card-w', `${width}px`);
  galleryTrack.style.setProperty('--gallery-card-h', `${height}px`);

  galleryItemEls.forEach((item, i) => {
    let offset = i - galleryActive;
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;
    const abs = Math.abs(offset);
    const visible = abs <= 3;

    const translateX = offset * step;
    const rotateY = offset * -32;
    const scale = abs === 0 ? 1 : Math.max(0.55, 1 - abs * 0.16);
    const opacity = visible ? Math.max(0, 1 - abs * 0.32) : 0;
    const zIndex = 100 - abs;

    item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`;
    item.style.opacity = opacity;
    item.style.zIndex = zIndex;
    item.style.pointerEvents = visible ? 'auto' : 'none';
    item.tabIndex = visible ? 0 : -1;
    item.setAttribute('aria-label', offset === 0 ? `Photo ${i + 1} of ${n}, open in lightbox` : `Show photo ${i + 1} of ${n}`);
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

let galleryResizeTimeout = null;
window.addEventListener('resize', () => {
  clearTimeout(galleryResizeTimeout);
  galleryResizeTimeout = setTimeout(renderGallery, 150);
});

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
