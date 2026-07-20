# Experience-quality review — Loop Engineer concepts

Role: `QA-XP-01` — independent experience-quality reviewer  
Review date: 2026-07-20  
Branch reviewed: `codex/loop-engineer-concepts`  
Disposition: **Not decision-ready for final sign-off; strong enough for a provisional concept selection**

## Scope reviewed

- `docs/design/loop-engineer-concepts/PROPOSALS.md`
- `docs/design/loop-engineer-concepts/index.html` opened directly from `file://`
- All five generated raster images: Stormglass, Tomorrow Garden, Kaiju QA,
  Sunrise Express, and Museum of Almosts
- All three SVGs: learning loop, three-minute demo arc, and four-hour build plan
- Existing desktop and mobile screenshots
- Existing plan, asset plan, learning/comedy/art-direction notes, SDK research,
  and XR review where they affect experience quality or four-hour feasibility

No production files were changed.

## Executive verdict

The proposal has a strong editorial voice, a coherent learning model, polished
art, and five genuinely different player fantasies. The offline HTML is
attractive, semantic, keyboard-operable in the paths checked, reduced-motion
aware, and free of observed offline runtime errors. Kaiju QA is the clearest and
most persuasive concept.

The package is not ready for final decision sign-off because the exact paper
scores are not auditable, all three information-dense SVGs become unreadably
small on a 390 px mobile viewport, the four-hour floors are not fully reconciled
with the SDK/XR research, and the committed browser evidence is incomplete.
These issues do not prevent a provisional creative choice, but they do prevent
the artifact from serving as the final evidence-backed lock document.

## Blocking findings

### B1 — The numerical recommendation is not traceable

`PROPOSALS.md` and the HTML present exact scores of 84–92 and say they come from
the repository's weighted concept matrix. No matrix, weights, criterion-level
scores, or calculation was present in the reviewed files. The qualitative case
for Kaiju QA is good, but the precision of `92` versus `89` is unsupported.

**Impact:** a reviewer cannot audit whether originality, learning clarity,
cross-platform quality, judgeability, and four-hour feasibility were weighted
consistently. This blocks treating the ranking as an evidence-backed decision.

### B2 — Decision-critical SVG text is unreadable on mobile

At 390×844, the SVGs render at approximately:

- learning loop: 370×204 px;
- demo arc: 370×93 px; and
- four-hour build plan: 370×102 px.

Because their viewBoxes are 1200 px wide, much of the source text scales to
roughly 4–10 CSS px. The shapes remain recognizable, but labels and explanatory
copy cannot be comfortably read. Alt text summarizes each image, but it does
not expose all of the diagram content or the detailed build schedule.

**Impact:** this fails the stated mobile-readability goal for key learning and
scope evidence. The diagrams need a mobile reflow, scroll/zoom treatment, or an
equivalent adjacent text version before sign-off.

### B3 — Four-hour scope floors are not canonical across the package

The proposal floors exceed or differ from the safer SDK/XR floors in several
places: three Stormglass prisms versus a two-optic floor, four Garden tokens and
two overlays versus three tokens and one retained result, three Sunrise traces
versus two, and a continuous Museum lens/three references versus a discrete
Compare interaction with at most two visible results.

**Impact:** the concepts are not being compared on a consistently implementable
four-hour baseline. This blocks calling the current score/ranking implementation
ready, although Kaiju QA itself remains plausible with authored poses and paths.

### B4 — Existing browser evidence is incomplete for acceptance sign-off

`browser-qa.md` is still a pending stub. `01-desktop.webp` and
`02-mobile.webp` are useful visual samples, but both center on Kaiju QA and do
not demonstrate the overview diagrams, comparison table, submission section,
keyboard path, reduced motion, or the other four concepts.

**Impact:** this blocks completion evidence, not provisional concept selection.
The Chromium spot checks recorded below reduce uncertainty but do not replace a
completed independent browser-QA report.

## Experience review by area

| Area | Result | Review |
| --- | --- | --- |
| Markdown proposal | Conditional pass | Concise for its breadth, well structured, and easy to compare. Exact scores need their rubric. |
| Offline HTML | Conditional pass | Strong hierarchy, useful shortcuts, shortlist interaction, and clear concept sections. Mobile diagrams are the main failure. |
| Desktop readability | Pass | Generous measure, strong headings, legible cards, and clear image/copy balance in the supplied 1440×900 evidence. |
| Mobile readability | Conditional fail | Main prose and concept cards reflow well with no page-wide horizontal overflow, but diagrams are illegible and the document is about 17,700 px long. |
| Accessibility | Conditional pass | Semantic headings/landmarks, descriptive hero alt text, decorative shortcut thumbnails correctly use empty alt, visible focus, skip link, `aria-pressed`, and an `aria-live` shortlist status were present. |
| Reduced motion | Pass | The media query disables smooth scrolling and effectively removes animation/transition duration. No active content animation was observed. |
| Visual hierarchy | Pass | Cover, overview, concept hero, three-minute loop, build facts, comparison, and submission form a clear editorial sequence. |
| Concept differentiation | Pass with advisory | Verbs, stakes, evidence, and emotional arcs differ well. The shared low-poly tabletop treatment and cyan “ghost evidence” motif make the art family more similar than the copy claims. |
| Learning clarity | Pass | Goal → Act → Observe → Adjust → Gate is explicit and consistently mapped to baseline, scoped change, evidence, regression, and release. Kaiju QA is the clearest transfer example; Museum is the most abstract. |
| Humor tone | Pass | Humor is situational and non-shaming. Kaiju QA's well-intended failures are warm and memorable without making the learner the joke. Other concepts appropriately use lighter wit rather than forced gags. |
| Asset performance | Pass with advisory | Five 1024×768 PNGs total 1,938,501 bytes (about 1.85 MiB); each is below 0.5 MB. Three SVGs total about 12 KB. This is reasonable for an offline book, though all unique images load up front. |
| Four-hour feasibility | Conditional pass | Kaiju QA and Sunrise Express are viable with deterministic authored states. Stormglass VFX/rotation, Garden overlays, and Museum precision/transparency need the documented cuts before implementation. |

## Browser and interaction observations completed

- Chromium opened the HTML from `file://` at 1440×900 and 390×844.
- Nine local requests were observed: the HTML plus five PNGs and three SVGs.
  No external runtime request, console error, page error, or failed request was
  observed.
- The 390 px layout had no document-level horizontal overflow. The top
  navigation intentionally scrolls horizontally.
- The first keyboard focus was the visible skip link with a 4 px high-contrast
  outline. Activating it moved navigation into main-content links.
- Keyboard activation of the Kaiju QA shortlist changed `aria-pressed` to
  `true`, updated the button label, and updated the polite live region.
- With reduced motion enabled, smooth scrolling became `auto` and transition
  duration was effectively zero.

## Asset-by-asset visual review

- **Stormglass:** cinematic and readable, with excellent prism/airship focus.
  The luminous route resembles a rail track, creating some overlap with
  Sunrise Express and slightly weakening the optical-calibration idea.
- **The Tomorrow Garden:** calm, inviting, and clearly distinct. The robot is a
  strong focal point, but it competes with the plants, and the pale prior-growth
  silhouettes may be too low contrast to communicate comparison in play.
- **Kaiju QA:** strongest one-glance concept. The safety helmet, miniature city,
  lab arms, and path barriers immediately communicate playful testing. The
  precise regression is not fully visible in the still, but the fantasy and
  tone are instantly understood.
- **Sunrise Express:** excellent release spectacle and the clearest retained
  “ghost run.” It also most visibly risks reading as a familiar train-routing or
  logistics puzzle rather than quality engineering.
- **The Museum of Almosts:** elegant, original, and emotionally polished. The
  magnified node-like object does not clearly explain the bird's mismatch, so
  the evidence interaction still carries the highest explanation burden.
- **Learning-loop SVG:** accurate and clear at full size; strongest explanation
  of the inner loop nested in SDLC. Mobile scaling is blocking.
- **Demo-arc SVG:** clear progression and excellent “demo budget, not dexterity
  score” framing. Mobile scaling is blocking.
- **Four-hour SVG:** sensible prioritization and a protected 40-minute
  validation reserve. Mobile scaling is blocking, and its floor should be
  reconciled with the SDK plan.

## Advisory findings

1. Mobile top-nav links are approximately 37 px high, below the project's 44 px
   touch-target preference. Several source/footer links are smaller. They pass
   a basic 24 px target threshold but should be enlarged for comfortable touch.
2. The 718 px-wide mobile nav is scrollable but has no strong visual cue that
   more items exist offscreen. The supplied mobile screenshot visibly clips the
   next label.
3. The mobile comparison table also relies on horizontal scrolling. A short
   “swipe to compare” cue or stacked summary would improve discoverability.
4. All five unique PNGs are requested on initial load. Lazy-loading concept
   heroes below the overview, or converting after visual comparison, would
   reduce first-view decode work; current size is still acceptable offline.
5. The shared low-poly diorama composition gives the set brand coherence but
   reduces aesthetic divergence. Preserve each concept's silhouette, evidence
   language, and palette if a second art pass occurs.
6. Museum of Almosts should not be treated as the safest four-hour backup until
   the lens becomes a discrete Compare action. Sunrise Express is the lower-risk
   delivery backup, though it is less original.

## Decision and concept selection

**Decision-ready:** **No** for final sign-off. Resolve B1–B4 before using this as
the canonical implementation-lock artifact. The content is, however, strong
enough to make a provisional selection.

**Selected concept:** **Kaiju QA.** It has the clearest causal learning chain,
best first-screenshot comprehension, safest humor, strongest visual hierarchy,
and a cross-platform verb that can be implemented with sockets and authored
paths. The four-hour version should use primitive/prepared assets, fixed poses
or simple root motion, no destruction physics, one fragile-tower edge case, one
ambulance regression, one slow-zone fix, and one compact release finale.

For pure delivery certainty, **Sunrise Express** is the runner-up. Museum of
Almosts remains the originality runner-up, not the implementation-risk runner-up.

## Limitations / checks not run

Work stopped at the user's request. The following were not run and are not
claimed as verified:

- NVDA, VoiceOver, or another screen-reader pass;
- axe, Lighthouse, or another automated accessibility audit;
- 200%/400% zoom and text-only reflow;
- Firefox, Safari/iOS, or physical Android/iOS device testing;
- color-vision simulation or instrumented contrast audit;
- CPU/network throttling, decode profiling, or memory profiling;
- external-link availability checks; and
- print/PDF rendering.
