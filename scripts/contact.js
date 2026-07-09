// Contact form — submits to a Google Apps Script Web App backend.
// Relies on `lang` and `DICTIONARY` from main.js, so this must load after it.

// Google Apps Script Web App deployment URL for the contact form backend.
const GOOGLE_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby51d0M66IBsSBRO-VVD7GW1OFjWltPEo8LG1_4R_eVeoIVHYMjEdgcmlKqFr3iKt8q/exec';

const contactForm = document.getElementById('contactForm');
const contactSubmitBtn = contactForm.querySelector('.contact-submit');
const contactFormStatus = document.getElementById('contactFormStatus');
const CONTACT_RESET_DELAY_MS = 10000;
let contactResetTimeoutId = null;

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  clearTimeout(contactResetTimeoutId);

  contactSubmitBtn.disabled = true;
  contactSubmitBtn.textContent = 'Sending...';
  contactFormStatus.textContent = '';
  contactFormStatus.classList.remove('is-error');

  const formData = new FormData(contactForm);

  fetch(GOOGLE_WEB_APP_URL, {
    method: 'POST',
    body: new URLSearchParams(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status !== 'success') {
        throw new Error(data.message || 'Submission failed');
      }
      contactForm.reset();
      contactFormStatus.textContent = DICTIONARY[lang].contactSuccess;
    })
    .catch(() => {
      contactFormStatus.classList.add('is-error');
      contactFormStatus.textContent = DICTIONARY[lang].contactError;
      alert(DICTIONARY[lang].contactError);
    })
    .finally(() => {
      contactResetTimeoutId = setTimeout(() => {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.textContent = DICTIONARY[lang].contactSend;
        contactFormStatus.textContent = '';
        contactFormStatus.classList.remove('is-error');
        contactResetTimeoutId = null;
      }, CONTACT_RESET_DELAY_MS);
    });
});
