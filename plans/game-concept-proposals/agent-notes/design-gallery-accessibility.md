# Design gallery accessibility and mobile UX checklist

Scope: generated `public/designs/index.html` at `/designs/`
Audience: gallery implementers and independent browser QA
Standard: WCAG 2.2 AA as the minimum shipping bar

## Ship-blocking implementation checklist

### Semantic structure

- [ ] Include a "Skip to designs" link as the first focusable element.
- [ ] Use one `<main>` with one visible `<h1>`; keep heading levels ordered.
- [ ] Mark search/filter controls as a named `<form>` or `<search>` region.
- [ ] Render results as a semantic list; each concept is an `<article>` with a
      heading and a real link or button for its detail action.
- [ ] Use native `<button>`, `<a>`, `<input>`, `<select>`, and `<dialog>` elements;
      do not make generic containers clickable.
- [ ] Give the proposal, PDF, reset, shortlist, and detail controls unique,
      descriptive accessible names. Icon-only controls require visible tooltips
      and accessible names.
- [ ] Expose selected filter and shortlist states programmatically using native
      state or `aria-pressed`; never rely on color alone.
- [ ] Keep source order equal to visual and keyboard order. Do not use positive
      `tabindex` values or CSS reordering that changes reading order.

### Keyboard and focus

- [ ] Every action works with keyboard alone. `Tab` moves between controls;
      `Enter`/`Space` activates buttons; native text/select behavior is retained.
- [ ] Show a persistent, high-contrast `:focus-visible` indicator with at least
      a 2 CSS px outline and sufficient offset. It must remain visible over art.
- [ ] Do not create custom arrow-key grids. Let cards follow document order
      unless a fully tested composite widget is genuinely required.
- [ ] When filtering removes the focused card, move focus to the results heading
      or first remaining result and explain the change in the live status.
- [ ] Sticky headers, drawers, and cookie/UI overlays must not obscure focused
      controls. Focused items should scroll into a visible safe area.
- [ ] On detail close, return focus to the exact card/control that opened it.
- [ ] Never trap focus outside an open modal. Never trap focus on the page when
      no modal is open.

### Concept detail dialog

- [ ] Prefer native `<dialog>` with `showModal()`, a visible close button, an
      accessible name from the concept title, and descriptive content associated
      with the dialog.
- [ ] Move focus into the dialog on open, keep `Tab`/`Shift+Tab` within it, close
      on `Escape`, and restore opener focus on close.
- [ ] Prevent background interaction while open (`inert` via native modality),
      but preserve the user's scroll position when closing.
- [ ] Do not close from clicks inside the panel. Backdrop close, if supported,
      must be forgiving and must not replace the visible close control.
- [ ] Dialog content must reflow at 320 CSS px and 400% zoom without horizontal
      page scrolling. Long content scrolls inside a clearly bounded panel.
- [ ] If scripting or `<dialog>` support is unavailable, each card's title link
      must still reach its full inline detail or a stable fragment on the page.

### Search, filters, results, and shortlist

- [ ] Every input has a persistent visible label. Placeholder text is optional
      help, not the label.
- [ ] Provide a visible "Clear search and filters" control and predictable
      initial state. Browser Back/Forward should not leave controls and results
      contradictory if state is stored in the URL.
- [ ] Put result feedback in one `role="status"` / `aria-live="polite"` region,
      for example: "8 designs shown. Category: puzzle."
- [ ] Debounce search updates and announce only the settled result, not every
      keystroke. Announce filter, clear, shortlist, and zero-result changes.
- [ ] Do not move focus on ordinary result updates. For zero results, keep focus
      in the search/filter control and expose a clear recovery action.
- [ ] Do not use an assertive live region, animated count, or toast for routine
      filtering. Avoid duplicate visual and screen-reader announcements.
- [ ] Shortlist controls state both action and concept, such as "Add Loop
      Engineer to shortlist"; after activation, update name and `aria-pressed`.

### Color, type, motion, and media

- [ ] Meet contrast ratios: 4.5:1 for normal text, 3:1 for large text, and 3:1
      for focus indicators, control boundaries, icons, and meaningful graphics.
- [ ] Convey category, shortlist, and risk with text/icon/shape in addition to
      color. Hover, focus, selected, and disabled states remain distinguishable.
- [ ] Use at least 16 CSS px body text on mobile, comfortable line height, and
      readable line lengths. Text remains usable at 200% zoom and page content
      reflows at 400% zoom.
- [ ] Respect `prefers-reduced-motion: reduce`: remove card lift/tilt, parallax,
      smooth scrolling, animated filtering, and nonessential fades. Never animate
      the viewport or require motion to understand state.
- [ ] Do not autoplay audio or video. Any moving media has pause/stop controls.
- [ ] Give each concept-art image concise alt text describing the concept fantasy
      and meaningful visual content. Do not repeat the adjacent title/hook.
- [ ] Use `alt=""` for decorative crops, textures, and repeated thumbnails.
      Infographics need a short accessible summary adjacent to or linked from
      the image; do not place paragraphs into `alt`.
- [ ] Preserve meaningful content when images fail or are blocked: title, hook,
      category, loop, platform support, and detail link remain visible.

### Touch and narrow screens

- [ ] Interactive targets are at least 44 by 44 CSS px, with enough separation
      to avoid accidental activation. This includes chips, close, shortlist,
      pagination, and clear-search controls.
- [ ] The complete gallery works with tap alone: no hover-only content, drag,
      double-tap, long press, pinch, or precision pointer requirement.
- [ ] At 320 CSS px wide, use one content column, wrap chips/labels, keep controls
      inside the viewport, and avoid horizontal page scrolling.
- [ ] Make the filter area a normal-flow section or an accessible disclosure;
      do not consume most of a phone viewport with a permanently sticky toolbar.
- [ ] Respect safe-area insets and browser chrome. Fixed controls must not cover
      content, the focused element, or the dialog close button.
- [ ] Support portrait and landscape without losing state. Do not force device
      orientation or reload on rotation.
- [ ] Use responsive image dimensions and reserve aspect-ratio space to prevent
      layout shifts. Lazy-loaded images must not delay access to card text.
- [ ] Search uses an appropriate input type/mode, but submission and clearing do
      not depend on a mobile keyboard-specific key.

### No-JavaScript and failure behavior

- [ ] Generate all 20 concept cards and essential details into the initial HTML;
      JavaScript enhances filtering and dialogs but does not fetch core content.
- [ ] With JavaScript disabled, every concept, image alternative, platform note,
      and stable detail fragment remains readable in canonical order.
- [ ] The Markdown proposal and PDF are ordinary links and remain downloadable
      without JavaScript. Links must identify the format where useful.
- [ ] Hide enhancement-only controls when JavaScript is unavailable; do not show
      inert search, filter, shortlist, or modal buttons.
- [ ] If enhancement initialization fails, leave the static card list visible
      and log the failure without replacing content with a blank/error screen.

## Browser QA acceptance cases

Run against the production build, not only the development server. A failure in
cases 1-8 blocks publication; record browser/version, viewport, and evidence.

1. **Semantic scan:** Verify one `h1`, ordered headings, landmarks, named form,
   list/articles, unique control names, meaningful image alternatives, and no
   serious/critical axe violations.
2. **Keyboard-only:** Starting at the URL bar, use `Tab`, `Shift+Tab`,
   `Enter`, `Space`, and `Escape` to search, filter, shortlist, open/close a
   detail, clear state, and reach proposal/PDF links. Confirm visible focus and
   logical order throughout.
3. **Dialog:** Open a detail from a middle card. Confirm initial focus, modal
   containment, background inertness, Escape/close behavior, scroll preservation,
   and focus restoration to the opener.
4. **Dynamic announcements:** With a screen reader, search to several results,
   apply a filter, create zero results, clear, and toggle shortlist. Confirm one
   concise settled announcement per action and no focus theft.
5. **Mobile reflow:** Test 320x568, 360x800, and 390x844 in portrait plus one
   landscape viewport. Confirm no horizontal page scroll, clipped controls,
   covered content, hover dependency, or target smaller than 44x44 CSS px.
6. **Zoom and text:** At 200% browser zoom and 400% reflow, complete search,
   filtering, card detail, and download navigation without lost content or
   two-dimensional page scrolling.
7. **Color and forced modes:** Check automated contrast, then inspect focus,
   selected chips, shortlist, risk, and controls in high contrast/forced-colors.
   Confirm state is understandable without color.
8. **Reduced motion:** Emulate `prefers-reduced-motion: reduce`; confirm card,
   filter, dialog, and scroll transitions become instant or nonessential motion
   is removed with no loss of feedback.
9. **No JavaScript:** Disable JavaScript and reload. Confirm all 20 concepts and
   stable detail content are available, enhancement-only controls are absent,
   images have alternatives, and Markdown/PDF links work.
10. **Resilience:** Block one image and simulate an enhancement-script error.
    Confirm readable cards remain, reserved media space prevents disruptive
    shifts, and the page never becomes blank or unusable.
11. **Touch:** On a real or emulated touch device, operate every control with one
    finger, rotate once, dismiss the keyboard, and confirm state is retained.
12. **Regression browsers:** Exercise current Chromium desktop/mobile and one
    additional engine (Firefox or WebKit/Safari); document any `<dialog>`, focus,
    download, or sticky-layout differences.

## Required evidence

- Desktop and mobile screenshots showing focus, filtered results, zero-results
  recovery, open detail, reduced-motion state, and no-JS rendering.
- Browser QA report containing axe results, keyboard trace, screen-reader/live-
  region observations, tested viewports, contrast findings, and known gaps.
- Any physical-device or assistive-technology gap must be explicit; emulation
  must not be presented as real mobile or screen-reader certification.
