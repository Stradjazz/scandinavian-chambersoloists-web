# Claude Code prompts — implement the glassmorphic homepage

Run these one at a time in Claude Code (VS Code), reviewing the diff after
each before moving to the next. Point Claude Code at this handoff folder
first so it can read `README.md`, `design-reference.html`, and `assets/`.

**Stack note:** originally written against a Next.js + TypeScript + Tailwind
scaffold. This machine has no Node.js available, so the project is instead
plain **static HTML/CSS/JS** — `index.html` at the root, `css/styles.css`,
`scripts/main.js` (+ `scripts/data.js` once concert/musician/i18n data
exists), and images served straight from `assets/` (no `public/` build
convention, no bundler, no TypeScript — just open `index.html` in a
browser). Every prompt below has been adapted to that structure. Where the
original said "component," "React state," or a Tailwind utility, read it as
"a DOM element," "a plain JS variable," or "a CSS class/custom property."

---

### 0. Orient
```
Read README.md and open design-reference.html in a browser preview. This
is a design reference for a chamber-music ensemble's homepage — read the
whole README before writing any code, it documents exact colors, type
scale, spacing, and every interaction, plus a few gotchas we hit while
building it (box-sizing, stopPropagation, parallax). Do not copy markup
out of design-reference.html directly — it's written in a proprietary
component format for a design tool, not real HTML/React. Summarize the
page structure back to me in a few sentences before we start building.
```

### 1. Scaffold ✅ (done)
```
Create a plain static index.html with five semantic sections in source
order: <section id="hero">, <section id="about">, <section id="concerts">,
<section id="media">, <section id="contact">, plus a fixed <nav> above
them and a <footer> after them. Link css/styles.css and scripts/main.js.
Add `scroll-behavior: smooth` globally in the CSS. Reference images
directly from assets/ (no copy step needed — there's no public/ build
convention). No visual styling yet beyond enough padding to see each
section as you scroll — skeleton only.
```

### 2. Tokens & fonts
```
Add CSS custom properties to css/styles.css's :root matching README's
Design Tokens section exactly: --color-bg #0b0d14, --color-fg #f3efe8,
--color-accent #d4a574 (with --color-accent-ink #181104 as the "on-accent"
text color for filled accent buttons), --color-glass-surface
rgba(255,255,255,0.05), --color-glass-border rgba(255,255,255,0.1). Load
"Cormorant Garamond" (400/500/600, italic) and "Inter" (400–700) via a
Google Fonts <link> in index.html's <head>. Add a reusable `.glass` CSS
class implementing the glass card recipe from the README —
background/backdrop-filter/border/24px radius — since nearly every
section wrapper uses it. Note the box-sizing gotcha in the README: any
wrapper that carries its own padding/border directly (rather than putting
padding on an inner child) MUST be box-sizing: border-box, or it'll render
wider than sibling sections using the same max-width.
```

### 3. Nav
```
Build the fixed nav per README: 3-column layout — logo+wordmark (left),
Arts Council Norway credit (center), nav links + EN/NO toggle (right).
Frosted glass bar per the spec.

The Arts Council credit is an icon + REAL TEXT, not a flattened image:
assets/arts-council-icon.png next to a text span whose content comes from
a language dictionary ("Supported by Arts Council Norway" in English,
"Støttet af Kulturrådet" in Norwegian). The whole thing links to
https://www.kulturdirektoratet.no/kulturradet in a new tab.

Nav links anchor-scroll to #hero/#about/#concerts/#media/#contact. EN/NO
is a segmented pill toggle; wire it in scripts/main.js to a simple module-
level `lang` variable (or a `data-lang` attribute on <html>) for now —
clicking a pill updates it and re-renders any elements tagged with a
data-i18n attribute by looking up their key in a small en/no object. We'll
fill in the full dictionary in a later step, but get this credit line's
two strings working now since it's a good test case.
```

### 4. Hero
```
Build #hero exactly per README: full-height centered glass card with
eyebrow, serif headline, accent-bordered pull-quote + attribution, two
CTAs. Behind the card, a large circular desaturated photo
(assets/hero-ensemble.jpg) bleeding off the right edge at 50% opacity.
Don't wire scroll parallax yet — static position is fine for this step.
```

### 5. About — bio card + musician sphere field
```
Build #about as a 2-column equal-height grid. Right card: bio copy exactly
per README (eyebrow/heading/two paragraphs/text-link CTA to #contact).

Left card is the harder one — a mouse-reactive "glass sphere" cluster of
the 8 musician photos (assets/musician-*.png — do NOT include a 9th,
"pal", it's unused) listed in the README with their instruments. Model
the 8 musicians as a plain JS array of objects (name, instrumentEn,
instrumentNo, src, xPct, y, sizePct) in scripts/data.js. Follow the
README's Interactions & Behavior section precisely, implemented with
direct DOM/style manipulation (no framework, no virtual DOM):
- Each musician has a base position defined as a PERCENTAGE of the
  field's live width (not fixed px) plus a fixed px vertical position
  against the field's fixed height, so it stays responsive. Add a
  mousemove listener on the field element, reading cursor position AND
  the field's current clientWidth on every move.
- Compute per-musician "influence" (0–1) from distance to cursor,
  smoothstepped, and use it to set inline styles driving: scale, a small
  translate toward the cursor, z-index, and a soft accent-glow
  box-shadow.
- Each sphere is a photo wrapped in overlay gradients that fake a glass
  sphere (specular highlight radial-gradient + under-rim shadow
  radial-gradient + inset rim light) — the photo itself must never be
  visually distorted, only the overlays create the "glass" look.
- Below the field, a caption row shows the name+instrument of whichever
  musician currently has the highest influence (falls back to a default
  "THE MUSICIANS" label when nothing is hovered) — update its
  textContent directly on mousemove.
- Ease everything back to rest on mouse-leave with a ~0.35s CSS
  transition (set via the .glass-sphere class, not inline, so it applies
  consistently).
```

### 6. Concerts
```
Build #concerts: centered eyebrow+heading, then a 3-column grid of
clickable glass cards using assets/concert-1.jpg, concert-2.jpg,
concert-3.png. Each card: artwork, date+time, location, title, subtitle,
and a "Read more →" affordance so it's obvious the card is clickable.
Hover lifts the card (-4px) and brightens its border.

Model concert data as a plain array of objects in scripts/data.js (id,
image, title, subtitle, date, time, location, description, programme:
array of {composer, piece}) — per the README, this will later come from
an API, so keep these fields flat and independent rather than
pre-formatting strings. Seed it with the 3 concerts described in the
README (7 Sayings / Stabat Mater / Tall Ships Races), matching the
programme line counts (3, 5, 4 respectively).

Clicking a card opens a detail modal: build/inject its markup into a
container element (or toggle a hidden template) with the concert's image
as a full-bleed background and the dark gradient overlay described in the
README (so text stays readable with NO separate image panel), then
date/time, title, subtitle, location, description, and a "PROGRAMME" list
of "composer — piece" rows. Single card only — no prev/next between
concerts, that's intentional. Close via ✕ or clicking the backdrop; make
sure the click listeners on the ✕ AND anywhere inside the card call
stopPropagation() so they don't bubble to the backdrop's close handler —
we hit this exact bug during the original build (clicking a control
instantly closed the whole modal) so please verify it explicitly, e.g.
with a quick manual click-test after building it.
```

### 7. Media — video + gallery
```
Build #media in two stacked glass blocks (both need box-sizing:
border-box on their outer max-width wrapper — see README's box-sizing
gotcha):

Block 1 (1.2fr/1fr grid, columns should use minmax(0, ...fr) not bare
fractions so the embedded video can't force the grid wider than its
container): left side starts showing assets/media-still.png with a
centered translucent glass play button; clicking it (via a click
listener) replaces the still image element with a responsive 16:9
<iframe> pointing at
https://www.youtube-nocookie.com/embed/9v5GQ4DOOHY?autoplay=1&mute=1&rel=0
— use the -nocookie domain and keep mute=1: during the original build the
regular youtube.com/embed domain threw a YouTube "error 153" (a
referrer/embed-restriction issue that surfaces when the embed is nested
inside other iframes), and unmuted autoplay gets silently blocked by
browsers regardless of the autoplay param. The native YouTube controls
let the viewer unmute after it starts. Right side: eyebrow/title/body copy
and a "Watch on YouTube" button linking to
https://youtu.be/9v5GQ4DOOHY?si=Y2f6M0QgMsvjc1bP in a new tab.

Block 2: a 3D coverflow-style carousel using assets/gallery-1.jpg through
gallery-8.jpg inside a perspective(1600px) container. Track a plain JS
`activeIndex` variable; on change, loop over the image elements and set
each one's transform (translateX/rotateY ±32° per step/scale/opacity)
based on its offset from active, with a smooth cubic-bezier CSS
transition doing the animating. Round prev/next glass buttons + dot
indicators update activeIndex and re-run that loop. Clicking the centered
image opens a fullscreen lightbox (own prev/next + close, backdrop-click-
to-close, its own independent index variable); clicking any other visible
image just re-centers the carousel on it instead. Same stopPropagation
caution as the concert modal — verify it.
```

### 8. Contact + footer
```
Build #contact: two glass cards (form left, contact info + social icons
right) per the README. Wire the form's submit event listener to
preventDefault() and console.log the field values for now. Build the
footer: centered Arts Council Norway icon+text credit (same icon + 
language-dependent text pattern as the nav, same link) above the
copyright line, 1px top border.
```

### 9. Background + parallax
```
Add a single static (non-scrolling) full-bleed background photo behind
the whole page: assets/hero-ensemble.jpg, heavily blurred (blur(7px)),
duotoned navy→brass via grayscale(1) + a
linear-gradient(135deg, #0b0d14, #d4a574) overlay in mix-blend-mode:
color, at ~22% opacity. This sits behind the 3 floating glow "orbs" so
the glass cards' backdrop-filter has real imagery to refract.

IMPORTANT: do NOT give this background photo its own scroll-linked
parallax transform. An earlier version tried multiple photo layers each
moving at different scroll rates and it looked broken — hard edges
appeared where each photo's fade zone ended, and getting the direction/
rate right so the image didn't just slide off and reveal blank gradient
was fiddly and never looked "natural." One static photo behind everything
is the intentional final call.

DO add scroll-linked parallax in scripts/main.js: a single
requestAnimationFrame-throttled scroll listener reading window.scrollY,
driving translateY (via element.style.transform) at different
multipliers on: the 3 background glow orbs (0.16, -0.11, 0.26), the hero
photo (0.13), and small ±30px clamped drifts on the about/media photos as
they cross a scroll-position window. Respect prefers-reduced-motion
(matchMedia) by freezing these transforms when set. Scroll-driven CSS
animations or IntersectionObserver are fine substitutes for the JS scroll
listener if you'd rather — behavior should match, mechanism doesn't have
to.
```

### 10. Bilingual copy (i18n)
```
Extract all UI copy (nav, hero, about, concerts kicker/labels, media,
gallery, contact, footer, the Arts Council credit line) plus the concert
data and musician name/instrument labels into an en/no dictionary object
in scripts/data.js — no framework, just plain JS. Tag translatable
elements with a data-i18n="key" attribute; on language toggle, walk all
[data-i18n] elements and set textContent from dictionary[lang][key].
Wire the nav's EN/NO toggle to swap the active language everywhere
instantly, no reload — including concert titles/programmes, instrument
labels, and the Arts Council credit text, which all differ per language
in the reference. Re-run the concert-card and musician-caption render
logic after a language switch too, since those aren't plain data-i18n
text nodes.
```

### 11. Accessibility & polish pass
```
Audit the full page: text contrast over the glass cards against the dark
background (WCAG AA), keyboard focus rings on every interactive element
(nav links, language pills, carousel/lightbox/modal controls, form
fields, buttons), aria-labels on icon-only buttons (social icons, play
button, carousel arrows, modal/lightbox close buttons), and a solid-color
fallback background wherever backdrop-filter isn't supported
(@supports not (backdrop-filter: blur(1px))). Verify with DevTools that
the parallax orbs and sphere-field transforms are composited
(transform-only, no layout thrash) while scrolling/hovering. Also do a
final pass checking every section's outer wrapper renders at the same
visible width (the box-sizing gotcha from the README) — measure with
getBoundingClientRect if unsure.
```

---

**Tip:** if a step produces something that doesn't match
`design-reference.html`, open the reference file side-by-side and ask
Claude Code to diff its output against it directly rather than re-reading
prose — the file is real, clickable HTML.
