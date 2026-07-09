# Handoff: Scandinavian Chamber Soloists — Glassmorphic Homepage

## Overview
A single-page marketing site for a chamber-music ensemble. Glassmorphism +
subtle parallax over a deep midnight-blue/charcoal atmosphere with a warm
brass/amber accent, English/Norwegian language toggle, and several bespoke
interactive pieces: a 3D coverflow photo carousel with lightbox, a
mouse-reactive "glass sphere" musician cluster, clickable concert cards that
open a detail modal, and a click-to-play YouTube embed.

## About the Design Files
`design-reference.html` (plus `support.js` and `image-slot.js` in `scripts/`)
is a **design reference**, not production code to copy line-for-line. It was
built in this design tool's own component format (custom `<x-dc>` markup,
`sc-for`/`sc-if` loop/conditional tags, a `DCLogic` class) so it could stream
and preview live — none of that markup or the runtime scripts should be
carried into your codebase. Open it directly in any browser to see and click
through the real, working design (it's fully self-contained).

**Your task:** recreate this design in the target codebase's existing
environment (React, Vue, plain JS — whatever the project already uses) using
its established component patterns, styling approach, and libraries. If no
frontend exists yet, Next.js + Tailwind is a reasonable default (the prompts
below assume that, but adapt freely).

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interaction
behavior in the reference file are final — recreate them precisely rather
than treating them as rough guidance.

## Screens / Views
This is a single scrolling page with five anchored sections plus a fixed nav.

### Sticky nav
- Fixed top, full width, 3-column layout: logo+wordmark (left) · Arts Council
  Norway credit, linked (center) · nav links + EN/NO toggle (right).
- Frosted glass bar: `background: rgba(15,17,26,0.45)`, `backdrop-filter:
  blur(18px) saturate(150%)`, 1px bottom border `rgba(255,255,255,.08)`.
- Logo: `assets/logo-amber.png` (34×34px). Wordmark: Inter 600, 12px,
  letter-spacing .14em, two lines ("SCANDINAVIAN" / "CHAMBER SOLOISTS"),
  color `#f3efe8`.
- Arts Council credit is an **icon + real text**, not one flattened image:
  `assets/arts-council-icon.png` (the diamond mark only, ~20–22px tall) next
  to a text span reading "Supported by Arts Council Norway" (EN) / "Støttet
  af Kulturrådet" (NO) — pulled from the language dictionary so it swaps
  with the EN/NO toggle. The whole thing links to
  `https://www.kulturdirektoratet.no/kulturradet` (new tab).
- Nav links (Home/About/Concerts/Media/Contact — anchor-scroll to section
  ids `#hero #about #concerts #media #contact`): Inter 500, 13px, letter
  spacing .03em, `rgba(243,239,232,.75)` → `#f3efe8` on hover.
- EN/NO toggle: two small pill buttons in a rounded track; active pill filled
  `rgba(212,165,116,.85)` with dark text `#181104`, inactive
  `rgba(243,239,232,.6)` text on transparent.

### #hero
- Full viewport height, centered glass card, `max-width: 760px`, padding
  `64px 56px`.
- Behind the card: a large (`min(60vw,760px)`) circular, desaturated
  (`filter: saturate(0) contrast(1.1)`) ensemble photo
  (`assets/hero-ensemble.jpg`) bleeding off the right edge, opacity .5,
  drifting on scroll (see Parallax below).
- Card content, top to bottom: eyebrow ("SCANDINAVIAN CHAMBER SOLOISTS",
  Inter 500 13px, letter-spacing .16em, color `#d4a574`) → headline
  (Cormorant Garamond 400, 54px/1.2, white) → pull-quote with 2px left
  border in the accent color, attributed source line below it in muted
  ivory → two CTAs (filled accent pill "About the ensemble" scrolling to
  `#about`; outlined ghost pill "See concerts" scrolling to `#concerts`).

### #about
Two-column grid (`1fr 1fr`, 40px gap, `align-items: stretch` so both cards
match height), max-width 1180px, both cards use the shared "glass card"
token (see Design Tokens).

**Left card — "glass sphere" musician cluster** (interactive, described in
full under Interactions & Behavior): eyebrow "THE MUSICIANS"/"MUSIKERE",
then a 380px-tall relative-positioned field containing **8** overlapping
circular portraits at varied sizes (16–27% of the field's width) and
positions, each wrapped in a glass-sphere treatment (specular highlight +
rim shadow overlays — the photo itself is never distorted). Below the
field, a fixed-height caption row shows the currently-hovered musician's
name (Cormorant Garamond 500, 15px) and instrument (Inter 500, 10px,
letter-spacing .1em, accent color) — falls back to the section eyebrow
text when nothing is hovered. The 8 musicians (name / instrument):
Loussine Azizian Idsøe (Violin), Yuka Sato (Violin), Piotr Slowik (Viola),
Anne Camilla Furre Thommesen (Viola), Krisztina Tokaji Eikeset (Cello),
Jasper Havelaar (Cello), Jan Mathiasson (Double Bass), Gunnhild Tønder
(Piano/Harpsichord).

**Right card — bio copy**: eyebrow "WHO WE ARE"/"HVEM ER VI" → heading
(Cormorant Garamond 400, 38px) → two body paragraphs (Inter 400, 16px/1.7,
`rgba(243,239,232,.72)`) → "Get in touch →" text link (accent color,
underlined) scrolling to `#contact`.

### #concerts
Centered eyebrow + heading, then a 3-column grid (28px gap) of clickable
glass cards, one per concert. Each card:
- Artwork image, 100% width × 180px, top corners only rounded (image sits
  above the card's padding).
- Date+time line (accent color, Inter 600 12px), location (muted, Inter
  400 12px), title (Cormorant Garamond 400 22px), subtitle/composer line
  (Inter 400 13px, muted), then a **"Read more →"** affordance (Inter 600
  12px, accent color) making it obvious the card is clickable.
- Hover: `translateY(-4px)` + border brightens to `rgba(212,165,116,.45)`.
- Click opens the concert detail modal (see Interactions).

### #media
Two stacked glass-card blocks inside the section, both max-width 1180px
(both use `box-sizing: border-box` so their padding/border don't push their
visual width past the 1180px cap — see the box-sizing note under Design
Tokens, this tripped us up once during build):

**Block 1 — video + copy**, 1.2fr/1fr grid:
- Left: click-to-play video. At rest, shows a still image
  (`assets/media-still.png`) with a translucent glass play button
  (76px circle, blurred, white triangle) centered over a light dark
  scrim. Clicking swaps in a responsive 16:9 `<iframe>` embedding
  `https://www.youtube-nocookie.com/embed/9v5GQ4DOOHY?autoplay=1&mute=1&rel=0`
  (the `-nocookie` domain + `mute=1` avoid two real issues hit during
  build: a YouTube "error 153" that shows up when the embed is nested
  inside other iframes, and browsers silently blocking unmuted iframe
  autoplay — native YouTube controls let the viewer unmute). Still image
  has a small on-scroll parallax drift.
- Right: eyebrow "WATCH"/"SE VIDEO" → title (Cormorant Garamond 400 30px)
  → body copy → "Watch on YouTube" CTA button linking to
  `https://youtu.be/9v5GQ4DOOHY?si=Y2f6M0QgMsvjc1bP` (new tab).

**Block 2 — 3D gallery carousel**: centered eyebrow "GALLERY"/"GALLERI" +
title, then a coverflow-style carousel (8 photos, `assets/gallery-1.jpg`
through `gallery-8.jpg`) inside a `perspective: 1600px` container. The
active photo sits centered at full scale; others fan out left/right with
decreasing scale, `rotateY` (±32° per step), and opacity, using a smooth
`transition: transform .5s cubic-bezier(.22,.9,.32,1)`. Round prev/next
glass buttons on either side; a row of small dot indicators below (active
dot filled accent color). Clicking the centered photo opens a **fullscreen
lightbox** (dark blurred backdrop, image scaled to fit ~90vw/88vh, prev/
next arrows, close ✕) — clicking a side photo instead just makes it the
new center.

### #contact
Two glass cards, 1.2fr/1fr grid:
- Left: contact form — heading, name input, email input, message textarea,
  filled accent "Send message" button. Inputs: translucent background
  `rgba(255,255,255,.06)`, 1px border `rgba(255,255,255,.15)`, 10px radius.
- Right: address / email / phone, each with an accent-colored all-caps
  label above the value, plus three circular social icon placeholders
  (Facebook/Instagram/YouTube — currently plain "f"/"ig"/"yt" glyphs;
  swap for real icons and real links).

### Footer
Centered column: Arts Council Norway icon+text credit (same link as nav,
same icon+text pattern, slightly dimmer/smaller), then the copyright line,
on a 1px top border.

## Interactions & Behavior

**Language toggle** — EN/NO pill click swaps a `lang` state value; every
piece of UI copy (including concert titles/programmes, musician instrument
labels, and the Arts Council credit line) is pulled from a per-language
dictionary and re-renders immediately, no reload.

**Parallax** — a single `scrollY` value (read via a `scroll` listener,
throttled with `requestAnimationFrame`) drives independent `translateY`
transforms at different multipliers: three background glow "orbs" (0.16,
-0.11, 0.26), the hero photo (0.13), and small ±30px clamped drifts on the
about/media photos as they cross a scroll-position window. Respect
`prefers-reduced-motion` by freezing these.

The page background itself is a **single static (non-scrolling) full-bleed
photo** (`assets/hero-ensemble.jpg`), heavily blurred (`blur(7px)`),
duotoned navy→brass (`grayscale(1)` + a `linear-gradient(135deg, #0b0d14,
#d4a574)` overlay in `mix-blend-mode: color`), at ~22% opacity, sitting
behind the orbs. **Do not give this layer its own scroll-based parallax
transform** — an earlier version tried moving multiple photo layers at
different scroll rates within the fixed background and it looked broken
(hard edges appearing/disappearing as photos slid out of their fade zones).
One static photo is intentional: it gives the `backdrop-filter: blur()`
glass cards something to actually refract, while the orbs supply the
scroll-reactive movement.

**Musician glass-sphere field** — track mouse position relative to the
field container on `mousemove` (also capture the container's live
`clientWidth`, since sphere base positions are defined as percentages of
that width for responsiveness). For each musician, compute distance from
cursor to that musician's base center; convert to a 0–1 "influence" via
`1 - dist/maxDist` (maxDist ≈ 36% of field width) run through a smoothstep
easing. Use influence to drive: scale (`1 + influence*0.65`), a small
translate of the sphere toward the cursor (`delta * influence * 0.38`),
z-index (so the nearest sphere rises above overlapping neighbors), and a
soft accent-colored glow in the box-shadow. The musician with the highest
influence (above a ~0.12 threshold) becomes the one named in the caption
row below the field. All spheres ease back to rest (`transition: transform
.35s`) on mouse-leave.

**3D gallery carousel** — an `activeIndex` state; each image's offset from
active (shortest wrap-around direction) drives translateX/rotateY/scale/
opacity as described above. Clicking the centered image opens the
lightbox at that index; clicking any other visible image just changes
`activeIndex`. Lightbox has its own prev/next (independent of the
carousel's position) and a close button; clicking the dark backdrop also
closes it. **All click targets on the prev/next/close controls must call
`stopPropagation`** so they don't bubble up to the backdrop's close
handler — this was a real bug during build (clicking "next" instantly
closed the whole lightbox/modal because the click bubbled to the
backdrop). Verify this explicitly when you build it.

**Concert cards → detail modal** — clicking a card opens a single-card
modal (no prev/next between concerts — closing and reopening a different
card is expected and intentional, not a missing feature). The modal uses
the concert's image as a **full-bleed background** with a dark linear
gradient over it (`rgba(8,9,14,.55)` at top fading to `rgba(9,10,15,.97)`
at the bottom) so text stays legible — there's no separate image panel.
Content: date+time, title, subtitle, location, description paragraph, and
a "PROGRAMME" list of `composer — piece` rows. Close via the ✕ button or
clicking the backdrop (same stopPropagation caution as the lightbox — the
✕ button sits absolutely positioned as a sibling of the click-to-close
backdrop, so it needs its own stopPropagation too).

**Video play** — clicking the play button swaps the still image for the
iframe embed (one-way; no pause/replay-still control was built, add one if
useful). Autoplay is muted by URL param since browsers block unmuted
iframe autoplay.

## State Management
Minimum state needed to reproduce this page:
- `lang: 'en' | 'no'`
- `scrollY: number` (or handle parallax with CSS scroll-driven animations /
  IntersectionObserver instead, if the target stack prefers that)
- `galleryActiveIndex: number`
- `lightboxIndex: number | null`
- `sphereMouse: { x, y, containerWidth } | null`
- `concertModalIndex: number | null` (or the selected concert object)
- `videoPlaying: boolean`

## Design Tokens

**Colors**
- Background base: `#0b0d14` (near-black navy)
- Background gradient stops: `#1a1f30` → `#0b0d14` → `#07080d`
- Foreground / ivory text: `#f3efe8`
- Accent / brass: `#d4a574` (dark text on filled accent buttons: `#181104`)
- Glass surface: `rgba(255,255,255,0.05)`
- Glass border: `rgba(255,255,255,0.1)`
- Nav bar surface: `rgba(15,17,26,0.45)`

**Glass card recipe** (used for every card/section wrapper):
```css
background: rgba(255,255,255,0.05);
backdrop-filter: blur(16px) saturate(140%);
border: 1px solid rgba(255,255,255,0.1);
border-radius: 24px;
```
Nav bar uses a slightly stronger blur: `blur(18px) saturate(150%)`.

**Box-sizing gotcha (learned the hard way):** every section's outer
`max-width: 1180px` wrapper must be either (a) padding/border-free, with
padding/border living on inner child cards instead, or (b)
`box-sizing: border-box` if the wrapper itself carries padding/border
directly (as the two `#media` blocks do). Mixing content-box wrappers that
carry their own padding with the 1180px cap makes that section's visible
edge extend past every other section's — happened once during build across
the whole page and is an easy regression to reintroduce. Also give any
CSS Grid whose track content might be wide (embedded video/16:9 boxes,
etc.) `grid-template-columns: minmax(0, ...) minmax(0, ...)` rather than
bare fractions — a plain `1fr` track's default `auto` minimum can force
the whole grid wider than its container based on a child's min-content
size.

**Typography**
- Display/headings: "Cormorant Garamond" (400/500/600, italic available) —
  Google Font.
- Body/UI: "Inter" (400/500/600/700) — Google Font.
- Scale used: 54px hero headline, 38px section headings, 30–34px card
  titles, 22px concert card titles, 15–16px body, 12–13px labels/eyebrows
  (all with letter-spacing .04–.16em on all-caps labels).

**Spacing** — sections use 60px top padding / 120–140px bottom padding,
48px horizontal; cards use 28–56px internal padding depending on density;
grid gaps 20–40px.

**Radius** — 24px on all glass cards, 10px on buttons/inputs, 14–18px on
photo tiles, 50% (circular) on avatars/spheres/icon buttons.

## Assets
All in `assets/`, already recolored/cropped for this design:
- `logo-amber.png`, `logo-ivory.png` — the ensemble's violin-mark logo,
  recolored (shape untouched) to brass and ivory respectively, transparent
  background. Currently only `logo-amber.png` is used (nav).
- `arts-council-icon.png` — just the diamond mark, cropped out of the
  original "Supported by Arts Council Norway" lockup and recolored to
  ivory, transparent background. The text is real HTML now (see nav/footer
  spec above), not part of this image.
- `hero-ensemble.jpg` — hero photo, also reused (heavily blurred/duotoned)
  as the page's single static background layer.
- `musician-*.png` (8 files — `pal` is NOT used, leave it out) — circular
  headshots for the About section sphere field.
- `concert-1.jpg`, `concert-2.jpg`, `concert-3.png` — concert artwork.
- `media-still.png` — video still (church performance).
- `gallery-1.jpg` … `gallery-8.jpg` — carousel/gallery photos.

`image-slot.js` and `support.js` are this design tool's own runtime files
(the reference HTML depends on them to open standalone) — **do not port
these into the target codebase**; they exist only so you can preview the
reference file in a browser.

## Files
- `design-reference.html` — the full interactive reference (open directly
  in a browser).
- `scripts/support.js`, `scripts/image-slot.js` — runtime dependencies of
  the reference file only (not for the target codebase).
- `assets/` — every image asset listed above, at final crop/color.
- `claude-code-prompts.md` — a sequential prompt script for implementing
  this design with Claude Code in a real project.
