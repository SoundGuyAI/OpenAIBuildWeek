# Kaiju QA

**Test small. Help big.**

[Play the public build](https://soundguyai.github.io/OpenAIBuildWeek/) ·
[View the repository](https://github.com/SoundGuyAI/OpenAIBuildWeek)

Built for the **Education** category of OpenAI Build Week. The reusable IWSDK
boilerplate was scaffolded during the event, and the Kaiju QA concept, campaign,
interaction model, tests, art integration, and submission media were created on
July 20–21, 2026. Dated commits and the append-only prompt logs distinguish the
game work from the initial shell.

Kaiju QA is a tactile educational game about verifying AI-assisted changes. A
well-meaning baby kaiju can solve the obvious problem, but each district hides
an edge case. Players stage fixtures, pull a physical test lever, move rule
cartridges into a dock, compare persistent evidence, and stamp a release only
after the complete suite passes.

The same interaction language runs from one IWSDK web codebase:

- desktop: point, drag, place, pull, and press with the mouse, with focus-scoped
  WASD/right-drag camera movement and Reset View;
- mobile: touch, move, and release directly on the 3D scene;
- XR/MR: place the workbench on a horizontal surface, then point a controller
  ray, hold trigger to grab, move, and release.

Gameplay never depends on a separate desktop-only menu. The small HTML layer is
limited to captions, narration/replay, reset, reduced motion, and XR entry.
Instruction and evidence cards can be moved out of the way directly, while live
connector lines keep each card associated with its world target.

## The learning arc

Training Yard teaches nine single-action stages with a world-space pop-up,
animated arrow, glowing source object, and matching destination:

1. Move the service car into its street socket.
2. Pull the lever to record a baseline.
3. Add the fragile tower edge case.
4. Test before changing behavior.
5. Install an intentionally over-broad rule.
6. Rerun old tests and catch the regression.
7. Replace it with the targeted rule.
8. Verify the whole suite under the current change.
9. Press the release stamp only when every result is fresh and passing.

Three transfer levels then remove most of the hand-holding:

- **School Crossing** — protect walkers without blocking emergency access.
- **Harbor Load** — stabilize heavy cargo without slowing the whole harbor.
- **Storm Shift** — handle active rain without regressing rescue routes.

Wrong drops return safely home. Wrong rules produce useful evidence instead of
a game-over screen, so recovery is one physical action away.

## Visual and audio direction

- Animated Quaternius Dino with its authored face and materials kept as one
  coherent skeletal assembly.
- Quaternius buildings and vehicles plus Kenney Factory Kit lab machinery.
- Stage-specific scenery, lighting, shadows, emissive feedback, particles,
  authored motion, and an optional Azure FLUX laboratory backdrop.
- Twelve offline Kokoro narration cues with synchronized captions, mute,
  replay, autoplay unlock, and visibility pause.
- A readable world-space evidence board and tutorial panel that remain part of
  the 3D experience rather than a detached dashboard.

All imported and generated assets are documented in
[`docs/assets/KAIJU_QA_ASSETS.md`](docs/assets/KAIJU_QA_ASSETS.md). Audio
provenance is in [`docs/assets/AUDIO_CREDITS.md`](docs/assets/AUDIO_CREDITS.md).

## Quick start

Requirements: Node.js 24 recommended by `.nvmrc` (22.12+ is also supported by
`package.json`) and a current Chromium browser.

```bash
npm ci
npm run build
npm run preview
```

Open <http://127.0.0.1:4173/>.

For the IWSDK development runtime:

```bash
npm run dev
```

This starts IWSDK in the foreground without opening a browser tab. Use
`npm run dev:open` when one automatic tab is desired.

## Validation

Use the smallest gate that matches the change:

```bash
npm run test:fast          # normal edit loop: typecheck + 23 model tests
npm run test:e2e:smoke     # browser/input smoke, about 30 seconds locally
npm run test:preflight     # build + browser smoke before a demo checkpoint
npm run test:e2e:campaign  # full four-district desktop journey
npm run check              # complete release/merge gate
```

The full campaign is intentionally not the inner-loop test: it exercises every
district and takes several minutes. Run it before merge, release, or a serious
demo rehearsal; use the fast/model and smoke tiers after ordinary code edits.
The E2E runner automatically reuses an existing preview at port 4173.

The pure model suite verifies the deterministic four-level campaign, stale
evidence, wrong-rule regressions, targeted recovery, level gates, resets, and
immutability. Browser tests exercise real canvas drags rather than mutating game
state through a debug shortcut. Detailed desktop, touch, XR, accessibility, and
review evidence lives in [`evidence/kaiju-qa`](evidence/kaiju-qa).

## Technical design

- A pure TypeScript reducer owns campaign rules, attempts, evidence freshness,
  tutorial progression, and release eligibility.
- IWSDK `RayInteractable` entities provide shared pointer, touch, and XR-ray input.
- Screen pointers derive a live camera ray from the current pointer position;
  XR continues to use the controller-provided ray.
- `immersive-ar` placement uses hit test, horizontal-plane validation, optional
  anchoring, and a manual translation/height/yaw fallback when MR capabilities
  are unavailable.
- Gameplay entities are created through the IWSDK world and use authored
  movement rather than physics or locomotion.
- Rendering is a projection of deterministic state; animation cannot decide a
  pass, failure, regression, or release.
- The shipped game is static-host compatible and requires no account, backend,
  network model call, or runtime speech service.

## Why it fits an education demo

Kaiju QA turns an abstract engineering habit into a memorable physical loop:
the happy path is not enough, a fix can break old behavior, evidence becomes
stale after a change, and release is a gate backed by a complete current test
suite. The first district provides scaffolding; the next three ask learners to
transfer the same reasoning to new contexts.

The feature plan and specialist notes live in
[`plans/kaiju-qa`](plans/kaiju-qa). The full user request and follow-up decisions
are preserved in [`docs/conversation/2026-07-20-kaiju-qa.md`](docs/conversation/2026-07-20-kaiju-qa.md).

## How Codex and GPT-5.6 were used

GPT-5.6 was used through Codex as a build-time collaborator rather than as a
runtime dependency. Codex helped turn the initial learning goal into observable
acceptance criteria, research IWSDK constraints, implement the deterministic
campaign model and cross-device interaction layer, author regression and
browser tests, review failures, and prepare the submission video and evidence.

The human owner retained the product and release decisions. They selected Kaiju
QA from the Loop Engineer concepts, required a step-by-step tactile tutorial,
rejected the cluttered first layout, directed the full-bleed workbench and
camera controls, requested passthrough placement and draggable evidence cards,
and required follow-up fixes for road layering and task-arrow alignment before
release. Codex accelerated iteration; the owner decided what deserved to ship.

The collaboration record is intentionally inspectable:

- prompt and decision history:
  [`docs/conversation/2026-07-20-kaiju-qa.md`](docs/conversation/2026-07-20-kaiju-qa.md);
- acceptance criteria, risks, architecture, and specialist assignments:
  [`plans/kaiju-qa`](plans/kaiju-qa);
- desktop, mobile, XR, accessibility, and independent review evidence:
  [`evidence/kaiju-qa`](evidence/kaiju-qa); and
- dated implementation history in Git, including the Kaiju QA commits made
  during the July 13–21 submission period.

## Submission and judge access

- Public playable build:
  <https://soundguyai.github.io/OpenAIBuildWeek/>
- Final 95.1-second narrated video master:
  [`videos/kaiju-qa-devpost/renders/video.mp4`](videos/kaiju-qa-devpost/renders/video.mp4)
- Paste-ready Devpost copy, compliance audit, gallery PNGs, and final manual
  checklist:
  [`docs/submission/DEVPOST_KAIJU_QA_SUBMISSION.md`](docs/submission/DEVPOST_KAIJU_QA_SUBMISSION.md)
- Asset and audio provenance:
  [`docs/assets/KAIJU_QA_ASSETS.md`](docs/assets/KAIJU_QA_ASSETS.md) and
  [`docs/assets/AUDIO_CREDITS.md`](docs/assets/AUDIO_CREDITS.md)

A physical-headset comfort/performance pass and formal assistive-technology
campaign remain useful follow-up work. The demonstrated desktop and mobile
browser paths, plus the recorded IWER controller path, are the bounded claims
supported by the current evidence.
