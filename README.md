# Scandinavian Chamber Soloists — Website

A single-page marketing site for a chamber-music ensemble based in
Kristiansand, Norway. Glassmorphic design over a dark navy/charcoal
background with a warm brass accent, full English/Norwegian bilingual
support, and several bespoke interactive pieces described below.

## Tech stack

Plain **HTML / CSS / JavaScript** — no build step, no bundler, no
framework, no npm dependencies. Open `index.html` directly in a browser
(or serve the folder with any static file server) and it runs as-is.

Two external services are wired in as backends for dynamic content — see
[Backend configuration](#backend-configuration) below.

## Project structure

```
index.html          Page markup — nav, all five sections, footer,
                     concert-detail modal, lightbox
css/
  styles.css         All styling: design tokens, component styles,
                      responsive breakpoints
scripts/
  data.js            Static content: the EN/NO copy dictionary,
                      musician data, gallery image list
  main.js            Core behavior: language toggle, mobile nav,
                      musician glass-sphere field, parallax,
                      media video + 3D gallery carousel + lightbox
  concerts.js         Concerts grid + detail modal, fetched live from
                      a Google Sheet-backed API (see below)
  contact.js         Contact form submission to a Google Apps Script
                      backend
assets/               Image assets (logo, hero photo, musician
                      portraits, concert artwork, gallery photos)
```

Each script has a single, clear responsibility and only the two feature
files (`concerts.js`, `contact.js`) depend on `main.js` for the shared
`lang` / `DICTIONARY` globals — load order in `index.html` is `data.js` →
`main.js` → `concerts.js` → `contact.js`.

## Page sections

1. **Nav** — fixed frosted-glass bar: logo + wordmark, an Arts Council
   Norway funding credit (icon + real, translatable text, linked out),
   anchor-scroll links to each section, and an EN/NO language toggle.
   Collapses into a hamburger dropdown on tablet/phone widths.
2. **Hero** — full-height glass card with headline, pull-quote, and two
   CTAs, over a large desaturated circular photo of the ensemble.
3. **About** — a bio card next to a mouse-reactive cluster of the 8
   musicians' portraits (see [Interactive features](#interactive-features)).
4. **Concerts** — a grid of up to 3 upcoming concerts, loaded live from a
   spreadsheet; clicking one opens a detail modal.
5. **Media** — a click-to-play YouTube embed plus a 3D coverflow photo
   carousel with a fullscreen lightbox.
6. **Contact** — a message form (posts to a Google Apps Script backend)
   next to address/email/phone details and social links.
7. **Footer** — repeats the Arts Council Norway credit plus a copyright
   line.

## Interactive features

- **Bilingual EN/NO toggle** — every piece of UI copy lives in a
  dictionary in `data.js`, keyed by language; toggling re-renders all
  `data-i18n`-tagged text instantly, no reload.
- **Musician "glass sphere" field** — tracks the cursor over the cluster
  of 8 portraits and drives per-musician scale/translate/glow based on
  proximity, easing back to rest on mouse-leave. A caption below shows
  whichever musician currently has the most influence.
- **Scroll parallax** — a single throttled scroll listener drives
  independent drift on three background glow orbs, the hero photo, and
  the media still image, at different rates. Disabled automatically when
  the OS `prefers-reduced-motion` setting is on.
- **3D gallery carousel + lightbox** — a coverflow-style photo carousel
  (prev/next buttons, dot indicators, click-to-recenter) whose card size
  scales responsively with viewport width; clicking the centered photo
  opens a fullscreen lightbox with its own prev/next/close.
- **Concerts** — fetched from `CONCERTS_API_URL` and capped at 3 entries
  regardless of how many rows the source sheet has. Optional fields
  (subtitle, image, description, programme, ticket link) are hidden
  cleanly when empty rather than leaving gaps. Clicking a card opens an
  accessible detail modal (full-bleed artwork, programme list, tickets
  CTA); a load failure shows an inline, translated error message instead
  of breaking the page.
- **Contact form** — submits to `GOOGLE_WEB_APP_URL` without a page
  reload, disables the button and shows a translated success/error
  message, then resets automatically after a short delay.
- **Accessible by default** — every interactive element (including
  JS-built ones like carousel photos and the video play button) is
  keyboard-reachable with visible focus rings, icon-only controls carry
  `aria-label`s, and modals close via `Escape`/backdrop-click/✕ with
  careful `stopPropagation` handling so clicks inside them don't
  accidentally close them.
- **Responsive** — three tiers (desktop, tablet, phone); tablet gets its
  own grid layouts rather than just a squeezed desktop or a fully
  stacked phone view.

## Backend configuration

Two placeholder URLs need to be filled in with real endpoints before
these features go live:

| File | Constant | Purpose |
|---|---|---|
| `scripts/concerts.js` | `CONCERTS_API_URL` | Google Sheet-backed Web App returning concerts as JSON: `[{ Title, Subtitle, Description, Date, Location, Tickets, Image, Program }, ...]`. `Image` may be a Google Drive share link — it's converted to a direct-viewable URL automatically. `Program` entries can be plain strings or `{ Composer, Piece }` objects. |
| `scripts/contact.js` | `GOOGLE_WEB_APP_URL` | Google Apps Script Web App that accepts the contact form's fields (`name`, `email`, `message`, `source_site`) as a POST and returns `{ status: "success" }` on success. |

Until real URLs are set, concerts will show a translated "couldn't be
loaded" message and the contact form will fail gracefully with the same
pattern.

## Running locally

No install step. Either open `index.html` directly in a browser, or run
any static file server from the project root (e.g. VS Code's Live
Server extension) for the most accurate behavior.
