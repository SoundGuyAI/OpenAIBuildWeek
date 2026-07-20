# Browser QA — Loop Engineer concept book

QA role: `QA-BROWSER-01` (independent browser QA)  
Run completed: `2026-07-20T21:42:10.861Z`  
Branch: `codex/loop-engineer-concepts`  
Worktree: `C:\UnityProj\OpenAIBuildWeek-loop-engineer-concepts`  
Artifact: `docs/design/loop-engineer-concepts/index.html`

## Disposition

**PASS.** The current offline concept book passed the requested desktop and
mobile Chromium rerun. It opened directly through `file://` while the browser
context was offline, all five concepts plus the comparison and submission
areas were inspected, the revised paper scores recalculated correctly, and the
mobile diagrams remained usable through contained horizontal scrolling plus
complete text alternatives.

There were no external runtime requests, failed requests, non-success
responses, console messages, page errors, broken images, missing image `alt`
attributes, duplicate IDs, unresolved fragment targets, or document-wide
horizontal overflow.

## Environment and method

- Windows host; installed Playwright Chromium `143.0.7499.4`.
- Desktop profile: `1440×900`, DPR 1, mouse and keyboard.
- Mobile profile: `390×844`, DPR 1, mobile/touch Chromium emulation.
- URL: `file:///C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/index.html`.
- Both contexts used `context.setOffline(true)` before navigation.
- One in-memory Node script imported the repository's installed `playwright`
  and `sharp` modules, ran both profiles, and overwrote the two WebP captures.
  No server, repository gameplay E2E, or new test file was used.
- Listeners captured `request`, `response`, `requestfailed`, `console`, and
  `pageerror` events throughout navigation, reload, and interaction checks.

Representative runtime setup:

```js
const { chromium } = await import("playwright");
const sharp = (await import("sharp")).default;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width, height }, ...profile });
await context.setOffline(true);
await page.goto(fileUrl, { waitUntil: "load" });
```

## Results

| Check | Observed result | Status |
| --- | --- | --- |
| Direct offline load | Both exact viewport profiles loaded the HTML and all local assets through `file://`. | PASS |
| Runtime network health | Nine unique resources were requested: the document and eight local image/SVG assets. HTTP(S)/WSS requests: 0; failures: 0; bad responses: 0. | PASS |
| Browser diagnostics | Console messages: 0; uncaught page errors: 0. | PASS |
| Five concepts | Exactly Stormglass, The Tomorrow Garden, Kaiju QA, Sunrise Express, and The Museum of Almosts were present with five shortlist controls. | PASS |
| Section inspection | Overview, all five concepts, Compare, and Submit were individually scrolled into view and exposed their expected headings in both profiles. | PASS |
| Navigation | All eight sticky-navigation destinations produced the expected fragment on desktop click and mobile tap. All 20 internal links resolved to existing targets. | PASS |
| Images and structure | 14 images loaded with non-zero dimensions; 0 broken images, 0 missing `alt` attributes, 0 duplicate IDs, one H1. | PASS |
| Latest paper scoring | The visible formula is `(score ÷ 5) × weight`. Independent recalculation matched both tables: Stormglass 87, Tomorrow Garden 84, Kaiju QA 92, Sunrise Express 86, Museum of Almosts 89. | PASS |
| Mobile diagram treatment | Each of the three diagram containers measured 370 px wide with 900 px scroll content. Learning-loop, three-minute-arc, and four-hour-schedule text alternatives were present. Horizontal panning worked without widening the document. | PASS |
| Comparison tables on mobile | The two tables stayed inside 370/332 px containers with local scroll widths of 820/841 px. | PASS |
| Document-wide overflow | Desktop root/body: `1440/1440`; mobile root/body: `390/390` client/scroll width. The mobile nav, diagrams, and tables scroll only inside their intended containers. | PASS |
| Submission area | Submission heading, seven checklist items, and five research-source links were present. | PASS |
| Shortlist behavior | Kaiju QA selected, persisted after reload, was replaced by Museum, then cleared and stayed clear after reload in both profiles. Stored value, `aria-pressed`, button text, and live status agreed. | PASS |
| Keyboard and skip link | First Tab focused `Skip to proposals` with a 4 px solid outline; Enter reached `#main`. Forty sequential focus positions were traversed with visible outlines and without focus falling to `body`/`html`. Repeated locator labels are expected because multiple links share destinations. Space activated Kaiju QA and set `aria-pressed="true"`. | PASS |
| Reduced motion | Runtime emulation matched `prefers-reduced-motion: reduce`; computed scroll behavior was `auto`, transition/animation duration was `0.001ms`, and button hover transform was `none`. | PASS |
| Screenshot review | Desktop capture clearly shows the comparison and expanded auditable score matrix. Mobile capture shows the updated full-size learning diagram in its contained horizontal inspection viewport. | PASS |

## Local request inventory

- `index.html`
- `assets/kaiju-qa.png`
- `assets/learning-loop.svg`
- `assets/demo-arc.svg`
- `assets/stormglass.png`
- `assets/tomorrow-garden.png`
- `assets/sunrise-express-v2.png`
- `assets/museum-of-almosts.png`
- `assets/four-hour-build.svg`

Every observed resource used the `file://` scheme.

## Refreshed artifacts

| File | Dimensions | Bytes | Modified UTC | SHA-256 |
| --- | ---: | ---: | --- | --- |
| `01-desktop.webp` | 1440×900 | 67,224 | `2026-07-20T21:41:09.124Z` | `A59A0BA5E2BC76D8BD7AA046A15F042D6ACBB59E5913B234622D39BFCA5FB439` |
| `02-mobile.webp` | 390×844 | 28,190 | `2026-07-20T21:42:04.143Z` | `DB38C4040200A0493CD3E46892101B58FB76EAB8D0519EC0A566C24C1408C466` |

## Limitations

- Mobile coverage is Chromium emulation, not a physical Android or iOS device.
- Firefox, Safari, and physical touch-target ergonomics were not certified.
- The screenshots are focused viewport evidence of the latest score and mobile
  diagram changes, not full-page captures of the entire long document.
- This is a docs-only artifact review. Repository gameplay E2E and physical XR
  runtime testing were intentionally outside this bounded rerun.

## Final pass/fail

**PASS — no blocking browser defect found in the requested offline desktop or
mobile artifact.**
