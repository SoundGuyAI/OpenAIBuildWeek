# Evidence: Kaiju QA

Branch: `feature/kaiju-qa`

Review date: 2026-07-21 UTC

Status: PR feedback and route-layering follow-up complete locally; push and CI are the final gate

## Build under test

- Merge base: `origin/main` at `effe276bdc3287492a8e273e648b8e930ce8fda8`
- Pre-remediation branch head: `f0ee2a3c5f8d819e7ee80d3fb7a93d4f17d4925a`
- IWSDK: `0.4.2`
- Browser preview: `http://127.0.0.1:4173/`, started without opening a tab
- XR verification: Quest 3 IWER using `immersive-ar`
- Worktree: `C:/UnityProj/OpenAIBuildWeek-kaiju-qa`

## Remediation delivered

- Full-bleed desktop composition with a larger workbench, WASD movement,
  right-button camera look, and Reset View.
- One upright, hinged, labeled **RUN TESTS** lever; a separate release stamp;
  a three-slot cartridge rack; and a distinct installation dock.
- Direct grab, move, and release interaction shared by pointer, native touch,
  keyboard/switch access, and XR rays.
- Draggable instruction, evidence, release, and result cards with live target
  connectors and recentering.
- `immersive-ar` passthrough mode with horizontal-surface placement, red invalid
  and cyan valid placement feedback, anchoring, manual fallback controls, no XR
  laboratory backdrop, and campaign-preserving exit/re-entry.
- A nine-stage tutorial followed by three transfer districts, authored motion,
  particles, Quaternius/Kenney assets, a documented FLUX backdrop, and offline
  Kokoro narration.

## Validation results

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run test:model` | Pass, 23/23 |
| `npm run build` | Pass; existing IWSDK large-chunk warning only |
| Serialized desktop/mobile browser E2E | Pass, 6 applicable tests and 6 expected project skips |
| Browser runtime cleanliness | No application console errors, page errors, request failures, or HTTP failures |
| Quest 3 IWER MR placement | Pass for `immersive-ar`, hit test, plane detection, valid/invalid feedback, placement, and anchoring |
| Quest 3 IWER manipulation/lifecycle | Pass for controller object movement, card dragging/connectors, exit/re-entry, and single-root preservation |

## Visual evidence

| Artifact | Dimensions | What it proves |
| --- | ---: | --- |
| `01-desktop.webp` | 1440x900 | Fresh full-bleed initial desktop composition, modeled assets, cards, evidence board, direct-manipulation target, shading, and backdrop |
| `02-mobile.webp` | 360x740 | Fresh portrait framing with the complete workbench, readable coaching/caption, and secondary utility controls |
| `03-vr.webp` | 800x800 | Confirmed MR workbench state in Quest 3 IWER with the flat laboratory backdrop suppressed |
| `04-campaign-complete.webp` | 1440x900 | Fresh Storm Shift completion, final evidence, celebration state, and four-district release |
| `05-desktop-stage5.webp` | 1440x900 | Training Stage 5 with three separate rack slots, a separate empty dock, readable rule scopes, route failure, and no right-side overlap |
| `06-mr-placement-invalid.webp` | 800x800 | Red placement reticle on an invalid steep surface |
| `07-mr-placement-valid.webp` | 800x800 | Cyan placement reticle on a horizontal surface |
| `08-mr-card-drag.webp` | 800x800 | XR card dragging with a live connector and controller ray |
| `09-mr-controller-drag.webp` | 800x800 | XR controller manipulation after workbench placement |
| `10-mr-reentry.webp` | 800x800 | MR re-entry with one persistent workbench and preserved tutorial state |
| `11-route-layering-fixed.webp` | 1208x602 | School Crossing route ribbons obey depth and disappear behind the kaiju/buildings instead of drawing over them |

All committed images are WebP files below 120 KB. Temporary PNGs, traces, and
browser-session state remain ignored under `output/playwright/`.

## Known boundaries

- IWER proves WebXR behavior against a Quest 3 emulator profile; it does not
  certify physical-headset comfort, optics, reach, tracking, or performance.
- IWER renders a neutral room proxy rather than a real camera feed. The
  production session requests `immersive-ar`, uses alpha blending, and removes
  the desktop backdrop when the runtime supplies passthrough.
- Public deployment, the Devpost submission, and a physical Quest device pass
  remain outside this gameplay PR.

## Reproduction

```powershell
npm ci
npm run typecheck
npm run test:model
npm run build
$env:KAIJU_QA_BROWSER_CHANNEL='chrome'
npm run test:e2e:run -- --workers=1 --reporter=line
```

`npm run dev` is intentionally no-open. Use `npm run dev:open` only when an
explicit browser tab is desired.
