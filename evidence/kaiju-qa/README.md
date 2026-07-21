# Evidence: kaiju-qa

Branch: `feature/kaiju-qa`
Review date: 2026-07-20/21 UTC
Status: tactile redesign publication-frozen; clean serialized PR CI is the remaining merge gate

## Build under test

- Base: `origin/main` at `effe276bdc3287492a8e273e648b8e930ce8fda8`
- IWSDK: `0.4.2`
- Runtime: `https://localhost:8081/` through the IWSDK development server
- Worktree: `C:/UnityProj/OpenAIBuildWeek-kaiju-qa`
- Final publication target: draft PR #5

## Implemented proof points

- One direct-manipulation path for screen pointers, native touch, and XR rays.
- Invalid-drop recovery, physical test lever, rule cartridge dock, and release stamp.
- Nine-stage Training Yard tutorial and three transfer districts.
- Persistent world-space evidence board, instruction pop-up, arrow, sockets,
  authored animation, particles, lighting, and stage-specific scenery.
- Animated Quaternius hero, Quaternius city/vehicle assets, Kenney Factory Kit
  lab props, and a documented Azure FLUX laboratory backdrop.
- Reusable Kenney/Quaternius download sources and license records under
  `source-assets/kaiju-qa/`; the machine-specific download virtualenv is ignored.
- Twelve offline Kokoro narration WAVs with captions, mute, replay, unlock, and
  visibility pause.

## Validation results

| ID | Check | Expected | Current result | Artifact |
| --- | --- | --- | --- | --- |
| 01 | `npm run typecheck` | TypeScript and test sources compile | Pass after final source cleanup | Command output |
| 02 | `npm run test:model` | Campaign, tutorial, regressions, recovery, gates, reset, and immutability are deterministic | Pass, 8/8 | `tests/model/kaiju-qa-model.test.mjs` |
| 03 | `npm run build` | Production bundle and concept book complete | Pass on the publication-frozen source; existing IWSDK large-chunk warning remains | `dist/` (ignored) |
| 04 | `git diff --check` | No whitespace errors | Pass; line-ending conversion warnings only | Git output |
| 05 | Desktop/touch Playwright | Actual canvas interactions complete recovery and campaign; native touch does not scroll | Conditional pass: invalid-drop and native-touch/no-scroll observed; complete real-drag campaign passed earlier; clean final reporter delegated to PR CI | `browser-qa.md` |
| 06 | IWER XR | Controller ray can grab, move, release, operate lever/stamp, and re-enter | Pass in Quest 3 IWER; physical headset remains untested | `xr-qa.md` |
| 07 | Experience review | Tutorial, visual, audio, motion, accessibility, and fun-factor have no blocker | Conditional approve; no source/experience blocker, clean CI required | `experience-review.md` |
| 08 | Independent final review | Diff, tests, evidence, merge safety, and residual risks approved | Conditional approve; merge/public release waits for clean CI | `review.md` |

## Visual evidence

| Artifact | What it proves |
| --- | --- |
| `01-desktop.webp` | Desktop composition, modeled assets, world-space tutorial, evidence board, direct-manipulation staging, shadows, and lab backdrop |
| `02-mobile.webp` | Portrait camera framing, readable coaching/caption, visible draggable objects, and secondary utility controls |
| `03-vr.webp` | IWER/XR session evidence when controller capture succeeds |
| `04-campaign-complete.webp` | Storm Shift completion, final evidence board, celebration state, and four-district completion |

All committed screenshots are below 2 MB. Generated browser traces, temporary
screenshots, and `.playwright-cli/` state remain ignored.

## Known boundaries

- IWER can validate WebXR session and controller plumbing but cannot certify
  physical headset comfort, reach, tracking quality, or device performance.
- IWSDK still emits Havok WASM and a large JavaScript chunk even though gameplay
  physics is disabled. This is a known SDK/bundle optimization opportunity.
- Public deployment, demo video, final Devpost submission copy, and a
  repository-wide license choice are outside this gameplay PR.

## Reproduction

```bash
npm ci
npm run typecheck
npm run test:model
npm run build
npm run test:e2e:run
```

For local XR verification, start `npm run dev`, confirm `npm run dev:status`,
enter IWER with a Quest 3 profile, then follow the exact controller commands and
limitations recorded in `xr-qa.md`.
