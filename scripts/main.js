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
