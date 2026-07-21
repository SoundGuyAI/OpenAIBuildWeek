# Kaiju QA

**Test small. Help big.**

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

- Animated and recolored Quaternius kaiju with an authored safety helmet.
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

```bash
npm run typecheck
npm run test:model
npm run build
npm run test:e2e:run
```

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

## Remaining release work outside this PR

- A physical-headset comfort/performance pass remains valuable even after IWER
  controller verification.
- Public deployment, demo video, final Devpost copy, and repository-wide license
  selection are submission tasks rather than gameplay implementation.
