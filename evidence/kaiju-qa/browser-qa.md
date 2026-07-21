# Browser QA: Kaiju QA playtest remediation

Branch: `feature/kaiju-qa`

Review date: 2026-07-21 UTC

Verdict: **PASS**

## Final execution

The final production build was exercised through installed Chrome in a single
serialized worker. Six applicable tests passed and six cross-project tests were
skipped as expected. Runtime observation hooks reported no application console
errors, uncaught page errors, failed requests, or HTTP responses at or above
400.

The suite uses projected debug coordinates only to locate 3D targets. Every
game action is still performed with real browser input: pointer drags, native
CDP touch events, lever pulls, cartridge drops, and stamp presses. It does not
dispatch reducer intents or mutate game state.

## Covered behavior

- Invalid desktop drops return the prop home and allow an immediate valid retry.
- The complete four-district campaign is playable with real canvas drags,
  hinged lever pulls, cartridge placement, and release stamp presses.
- Fresh lever/stamp actions work even while the previous spring animation is
  completing.
- Native touch places a prop without scrolling the window, document, body, or
  visual viewport.
- Portrait Stage 5 keeps Broad, Alternate, Targeted, and the separate dock
  visible and reachable.
- Unsupported and denied MR entry preserve a clear desktop fallback.
- Desktop WASD/right-drag camera controls are focus-scoped and do not steal
  primary-button object or card drags.

## Deterministic checks

`npm run test:model` passes 22 checks across the campaign reducer, camera
navigation, draggable callout, control-fixture, and MR-placement models.

The focused model coverage verifies:

- camera translation, orbit clamping, reset, and input-conflict guards;
- lever hinge math, spring return, cartridge rack/dock separation, and Stage 5
  spacing;
- card drag constraints, connector endpoints, and recentering;
- MR horizontal-surface thresholds, reticle validity, manual fallback
  transforms, and placed-workbench local/world transforms.

## Fresh artifacts

- `01-desktop.webp`: initial 1440x900 desktop frame.
- `05-desktop-stage5.webp`: Stage 5 rack/dock and failure-causality frame.
- `02-mobile.webp`: 360x740 portrait frame after the mobile FOV/reachability fix.
- `04-campaign-complete.webp`: final four-district completion frame.

## Command record

```powershell
npm run typecheck
npm run test:model
npm run build
$env:KAIJU_QA_BROWSER_CHANNEL='chrome'
npm run test:e2e:run -- --workers=1 --reporter=line
```

The final evidence-only capture reused a no-tab Vite preview at
`http://127.0.0.1:4173/`, launched headless Chrome, captured the four frames,
and closed that browser process immediately.

## Residual boundary

Browser QA certifies desktop and touch behavior. XR placement, controller
manipulation, draggable cards, and session lifecycle are covered separately in
`xr-qa.md`; physical-headset comfort/performance remains untested.
