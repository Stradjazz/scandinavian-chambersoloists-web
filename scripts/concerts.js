// Concerts — cards + detail modal, backed by a Google Sheet Web App.
// Relies on `lang` and `DICTIONARY` from main.js, so this must load after it.

// Google Sheet-backed Web App URL that serves the concerts list as a JSON
// array of { Title, Subtitle, Description, Date, Location, Tickets, Image,
// Program } rows.
const CONCERTS_API_URL = 'PASTE_YOUR_CONCERTS_WEB_APP_URL_HERE';

const concertsGrid = document.getElementById('concertsGrid');
const concertModalBackdrop = document.getElementById('concertModalBackdrop');
const concertModalImage = document.getElementById('concertModalImage');
const concertModalDate = document.getElementById('concertModalDate');
const concertModalTitle = document.getElementById('concertModalTitle');
const concertModalSubtitle = document.getElementById('concertModalSubtitle');
const concertModalLocation = document.getElementById('concertModalLocation');
const concertModalDescription = document.getElementById('concertModalDescription');
const concertModalProgrammeWrap = document.getElementById('concertModalProgrammeWrap');
const concertModalProgramme = document.getElementById('concertModalProgramme');
const concertModalTickets = document.getElementById('concertModalTickets');
const concertModalClose = document.getElementById('concertModalClose');
const CONCERTS_MAX_VISIBLE = 3;
let openConcertId = null;
let concertsData = [];
let concertsLoadFailed = false;

// Converts a Google Drive share link (.../file/d/FILE_ID/view or
// ?id=FILE_ID) into a direct-viewable image URL. Falls back to the raw
// value for anything that isn't a recognized Drive link (e.g. already a
// plain image URL), so this stays a no-op for non-Drive sources.
function driveImageUrl(url) {
  if (!url) return '';
  const match = url.match(/\/d\/([\w-]{10,})/) || url.match(/[?&]id=([\w-]{10,})/);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
}

function normalizeProgrammeEntry(entry) {
  if (typeof entry === 'string') return { composer: '', piece: entry };
  return {
    composer: entry.Composer || entry.composer || '',
    piece: entry.Piece || entry.piece || '',
  };
}

function normalizeConcert(row, index) {
  return {
    id: `concert-${index}`,
    title: row.Title || '',
    subtitle: row.Subtitle || '',
    description: row.Description || '',
    date: row.Date || '',
    location: row.Location || '',
    tickets: row.Tickets || '',
    image: driveImageUrl(row.Image || ''),
    programme: Array.isArray(row.Program) ? row.Program.map(normalizeProgrammeEntry) : [],
  };
}

function renderConcertsMessage(text) {
  concertsGrid.innerHTML = '';
  const message = document.createElement('div');
  message.className = 'concerts-message';
  message.textContent = text;
  concertsGrid.append(message);
}

function renderConcertCards() {
  concertsGrid.innerHTML = '';

  concertsData.forEach((concert) => {
    const card = document.createElement('div');
    card.className = 'concert-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');

    if (concert.image) {
      const image = document.createElement('img');
      image.className = 'concert-card-image';
      image.src = concert.image;
      image.alt = concert.title;
      card.append(image);
    }

    const body = document.createElement('div');
    body.className = 'concert-card-body';

    const datetime = document.createElement('div');
    datetime.className = 'concert-card-datetime';
    datetime.textContent = concert.date;
    body.append(datetime);

    if (concert.location) {
      const location = document.createElement('div');
      location.className = 'concert-card-location';
      location.textContent = concert.location;
      body.append(location);
    }

    const title = document.createElement('div');
    title.className = 'concert-card-title';
    title.textContent = concert.title;
    body.append(title);

    if (concert.subtitle) {
      const subtitle = document.createElement('div');
      subtitle.className = 'concert-card-subtitle';
      subtitle.textContent = concert.subtitle;
      body.append(subtitle);
    }

    const more = document.createElement('div');
    more.className = 'concert-card-more';
    more.innerHTML = `<span>${DICTIONARY[lang].concertReadMore}</span><span>→</span>`;
    body.append(more);

    card.append(body);
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
  const concert = concertsData.find((c) => c.id === id);
  if (!concert) return;

  concertModalImage.hidden = !concert.image;
  concertModalImage.src = concert.image;
  concertModalImage.alt = concert.title;

  concertModalDate.textContent = concert.date;
  concertModalTitle.textContent = concert.title;

  concertModalSubtitle.hidden = !concert.subtitle;
  concertModalSubtitle.textContent = concert.subtitle;

  concertModalLocation.hidden = !concert.location;
  concertModalLocation.textContent = concert.location;

  concertModalDescription.hidden = !concert.description;
  concertModalDescription.textContent = concert.description;

  concertModalProgrammeWrap.hidden = concert.programme.length === 0;
  concertModalProgramme.innerHTML = '';
  concert.programme.forEach((p) => {
    const row = document.createElement('div');
    row.className = 'programme-row';
    row.innerHTML = p.composer
      ? `<span class="programme-composer">${p.composer}</span><span class="programme-sep">—</span><span>${p.piece}</span>`
      : `<span>${p.piece}</span>`;
    concertModalProgramme.append(row);
  });

  concertModalTickets.hidden = !concert.tickets;
  concertModalTickets.href = concert.tickets || '#';
  concertModalTickets.textContent = DICTIONARY[lang].concertsTicketsCta;
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

function refreshConcertsUI() {
  if (concertsLoadFailed) {
    renderConcertsMessage(DICTIONARY[lang].concertsLoadError);
  } else {
    renderConcertCards();
  }
  if (openConcertId) renderConcertModal(openConcertId);
}

async function loadConcerts() {
  renderConcertsMessage(DICTIONARY[lang].concertsLoading);
  try {
    const response = await fetch(CONCERTS_API_URL);
    if (!response.ok) throw new Error(`Concerts request failed: ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Unexpected concerts response shape');

    concertsLoadFailed = false;
    concertsData = data.slice(0, CONCERTS_MAX_VISIBLE).map(normalizeConcert);
    renderConcertCards();
  } catch (err) {
    concertsLoadFailed = true;
    renderConcertsMessage(DICTIONARY[lang].concertsLoadError);
  }
}

function initConcerts() {
  loadConcerts();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initConcerts);
} else {
  initConcerts();
}
