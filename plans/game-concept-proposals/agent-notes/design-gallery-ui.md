# Design gallery UI specification

Route: `/designs/`
Implementation target: static HTML, CSS, and progressive-enhancement JavaScript
Source of truth: `docs/design/game-concepts/proposals.json`

## Experience goal

Make twenty distinct game fantasies understandable in under ten seconds, then
let reviewers compare, filter, and shortlist them without losing context. The
page should feel like a premium interactive festival catalogue: dark gallery
walls, luminous exhibit colors, generous imagery, crisp editorial typography,
and playful but restrained motion.

## Information hierarchy

1. **Hero:** eyebrow `WEBXR HACKATHON CONCEPT PORTFOLIO`, headline `Twenty
   worlds. One web codebase.`, one-sentence promise, and links to the proposal
   and PDF. Show a compact desktop/mobile/XR parity braid beside the copy.
2. **Featured concept:** a wide Loop Engineer panel with its visual crop,
   `01`, title, hook, `Orchestrate`, and a four-beat loop. Label it `Hackathon
   anchor`, not `best`, so the remaining concepts retain credibility.
3. **Explore controls:** visible search label, category filter, shortlist-only
   toggle, sort control, result count, and clear action.
4. **Concept atlas:** all twenty cards in canonical order by default.
5. **Decision aids:** shortlist of five, originality map, scope/risk matrix, and
   universal-loop infographic. Present these after the atlas so they support a
   decision instead of delaying discovery.
6. **Footer:** source-document links and a note that every concept is designed
   for desktop, mobile, and immersive XR from one codebase.

## Visual system

- Grounds: ink `#10141D`, raised panel `#171D29`, warm paper `#F4F0E6`, muted
  text `#AEB8C8`. Use a subtle radial glow and fine grain; avoid generic neon
  grids, glass overload, and headset stock imagery.
- Gallery accents follow the existing deck: cyan for systems/social strategy,
  violet for perception/mystery, cobalt for force/world shaping, jade for
  ecology/cycles, and orange for expressive/performance concepts.
- Type: Space Grotesk for display and concept names; Inter for UI and body.
  Use an available system fallback stack if fonts are not bundled. Oversized
  translucent `01-20` numbers provide wayfinding.
- Cards use a 16:10 art crop, 16 px radius, one-pixel colored border, restrained
  shadow, and a solid text surface. Never place paragraph copy over busy art.
- Use native text labels plus simple repository-native SVG icons. Color is never
  the sole carrier of category, shortlist, platform, score, or risk.
- Motion: 160-220 ms opacity/transform transitions, at most 4 px card lift, and
  a single soft border sweep on selection. Disable lift, filtering animation,
  parallax, and smooth scrolling for `prefers-reduced-motion`.

## Responsive layout

- **Desktop, 1200 px and wider:** centered max-width 1440 px; hero in a 7/5
  split; featured concept in a 7/5 image/content split; atlas uses four cards
  per row. Search/filter bar may become sticky after the featured panel.
- **Tablet, 720-1199 px:** two-column hero and featured panel where space
  permits; atlas uses two cards per row; controls wrap into two rows.
- **Mobile, below 720 px:** one column, 16-20 px gutters, one card per row. Art
  precedes text. Controls live in normal flow; category filters use a labelled
  native select rather than a horizontally scrolling chip rail. The featured
  Loop Engineer panel becomes a normal large card, not a viewport-filling ad.
- Support 320 px width with no horizontal page scroll. Interactive targets are
  at least 44 by 44 CSS px. Respect safe-area insets and reserve image aspect
  ratios to prevent layout shift.

## Search, filters, and sorting

- Search title, hook, category, core verb, fantasy, and loop steps. Match
  case-insensitively and normalize punctuation. Debounce only the announcement,
  not visible input response.
- Category options: `All`, `Systems & social`, `Perception & mystery`, `Forces &
  world shaping`, `Ecology & cycles`, and `Expression & performance`. Derive
  exact concept membership at build time from canonical data.
- Sort options: `Curated order` (default), `Highest wow`, `Most feasible`, and
  `Title A-Z`. Do not imply that a calculated sort is an objective ranking.
- `Shortlist only` shows the five established candidates: Loop Engineer,
  Gravity Loom, Tiny Treaty Table, Origami Rescue, and Invisible Zoo Keeper.
- Keep state in query parameters (`q`, `category`, `sort`, `shortlist`) so views
  can be shared and Back/Forward remains coherent. `Clear` restores canonical
  order and all concepts.
- Display `20 designs shown` in a polite live-status region. Zero results retain
  the user's query, explain that nothing matched, and provide a visible reset.

## Concept card

First-read content, in order:

1. concept number, category label, and shortlist toggle;
2. art crop with meaningful alt text;
3. title, core verb, and hook;
4. four compact loop beats connected by arrows;
5. text-labelled Desktop, Mobile, and XR parity row;
6. `View concept` action.

Keep the collapsed card to roughly 45 words. Show scores as labelled values
(`Wow 5/5`, `Feasibility 4/5`), never unexplained pips. Cards are semantic
`article` elements; only real buttons and links are interactive. Hover must not
reveal essential information.

## Detail interaction

- `View concept` opens a native modal `<dialog>` on enhanced clients and links
  to a stable inline fragment without JavaScript.
- Desktop dialog: max-width 1040 px, two columns, bounded internal scrolling.
  Mobile dialog: near-full-screen sheet with a persistent visible close button.
- Detail order: title/hook, signature visual, fantasy, first 20 seconds, four-
  beat loop, platform controls, comfort/accessibility, differentiation,
  comparable, scope, technical risk, and scores.
- Preserve the originating gallery scroll position, close on Escape, contain
  focus while open, and restore focus to the exact opener. Do not require
  backdrop clicking or gestures.
- Shortlist toggles use `aria-pressed`, persist in `localStorage`, and say the
  action plus concept name. Treat the established five as editorial shortlist
  badges; let users create a separate personal shortlist without overwriting it.

## Loop Engineer prominence

- Give Loop Engineer the only full-width featured panel and the first card in
  the atlas. Use cyan, the circular red task-loop area of plate 01, and a subtle
  clockwise path motif to communicate orchestration.
- Its featured copy must clearly say: `Learn agentic software development
  across SDLC and SDLR through loop engineering.` Keep SDLR unexpanded.
- Visualize the four canonical beats as tangible stations: define, delegate,
  implement/test, review/iterate. Emphasize the employed NPC mentor and visible
  evidence handoff, not abstract code or an all-knowing AI.
- Limit special treatment to placement, scale, and one `Hackathon anchor` label.
  It receives the same card anatomy, shortlist control, detail depth, and score
  treatment as every other concept. The five gallery color families and equal
  card sizes keep the portfolio diverse rather than subordinate.

## Static implementation notes

- Generate all twenty articles and stable detail sections into the initial
  HTML from `proposals.json`; JavaScript enhances search, sorting, shortlist,
  and dialogs but never fetches core content.
- Reuse the five WebP plates with per-card `object-position` values rather than
  duplicating large files. Supply `width`, `height`, `loading="lazy"` below the
  fold, and concise concept-specific alt text. The hero and Loop Engineer image
  may load eagerly.
- Embed or link the five existing SVG infographics. Each needs an adjacent short
  text summary; do not rely on SVG labels alone.
- With JavaScript disabled, hide enhancement-only controls and leave all twenty
  concepts, their details, and source-document links readable in canonical
  order.
- Minimum acceptance: useful first viewport at 390x844 and 1440x900; complete
  keyboard operation; visible focus; no layout shift from images; no horizontal
  overflow at 320 px; filters and dialogs survive Back/Forward; reduced-motion,
  high-contrast, image-failure, and no-JavaScript states remain usable.
