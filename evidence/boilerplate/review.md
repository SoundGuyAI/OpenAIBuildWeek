# Independent final post-merge review: boilerplate

Branch: `chore/boilerplate-post-merge-review`
PR: #2
Base: `be6dd7136a91d4062ba59c3e0d4c838b1bf21804`
Reviewed evidence head: `dd53a3af83b57c2872bbf6558f05aef33cc38881`
Reviewed: 2026-07-20
Status: **PR #2 changes are safe; product verification remains incomplete**

## Verdict

The committed test/workflow changes are sound and PR #2 is technically clean
and mergeable. It is safe to merge as a review-and-evidence follow-up **after**
the inspected evidence updates, both WebP screenshots, and this review are
committed and CI remains green on that final commit.

Merging PR #2 must not be represented as full boilerplate or release
verification. The captured mobile composition fails, successful XR/device
behavior is untested, and the core movement/manipulation happy path is not yet
demonstrated.

## Severity-ranked findings

### [P1 — product] Mobile initial composition does not show the complete word

`evidence/boilerplate/02-mobile.webp` crops `HELLO WORLD` beyond both horizontal
edges; only the middle portion is visible. The desktop evidence shows the full
word. The fixed camera/word placement in `src/index.ts:160` and
`src/index.ts:201-204` does not adapt composition to the mobile aspect ratio.

The E2E assertion at `tests/e2e/hello-world.spec.ts:78-83` checks DOM overflow,
not whether the WebGL subject fits the viewport, so CI correctly passes while
the player-visible outcome fails. Fix and recapture before calling mobile
browser acceptance complete. This defect does not make the evidence-only PR
unsafe to merge if it remains recorded as a failure.

### [P1 — release evidence] Successful XR and physical-device behavior is unverified

`evidence/boilerplate/xr-qa.md:28-39` records no successful XR session,
reference-space, controller/hand, locomotion, grabbing, exit/re-entry, comfort,
or physical-headset observation. The unsupported and denied-session tests are
useful recovery evidence, but they do not exercise a real session. This leaves
the applicable gates in `docs/DEFINITION_OF_DONE.md:98-101` open.

### [P1 — observational gap] Core movement and letter manipulation are not proven

The browser test boots the scene, toggles motion, checks controls, and captures
screenshots, but it never demonstrates that desktop/mobile movement changes the
view or that a letter can be selected, moved, and released
(`tests/e2e/hello-world.spec.ts:57-102`). The screenshots are initial-state
evidence only. The player promise to “move around and play with” the letters is
therefore not fully verified on browser inputs.

### [P2 — accessibility] The core letter action has no keyboard equivalent

Letters receive only 3D `Interactable` and `DistanceGrabbable` behavior at
`src/index.ts:229-236`; the DOM exposes only a generic labeled scene container
at `index.html:17`. There is no named, focusable, keyboard-operable letter path.
This conflicts with the cross-input and accessibility expectations in
`docs/DEFINITION_OF_DONE.md:25-27` unless an explicit supported-input exception
is approved.

### [P3 — PR hygiene] The PR body still shows screenshot CI as incomplete

PR #2's body leaves the GitHub Actions screenshot-artifact item unchecked even
though run `29751524684` succeeded. Update it so the PR description matches the
evidence and remaining limitations.

## What this follow-up closes

- PR #1 merged to `main`, and Pages run `29748804444` successfully validated and
  deployed commit `be6dd713`; the hosted document and sampled JS, CSS, WASM, and
  worker assets returned HTTP 200.
- PR #2 run `29751524684`, job `88382979088`, passed typecheck, production build,
  and all six desktop/mobile Chromium tests in 53.1 seconds.
- The workflow uploads `test-results/evidence/` on success with missing files as
  an error (`.github/workflows/ci.yml:57-63`). The artifact contains exactly the
  desktop and mobile PNGs; the reviewed WebPs preserve their 1280x720 and
  1082x2202 dimensions.
- `01-desktop.webp` credibly shows the complete word, floor, readable HUD,
  instructions, and controls without obvious clipping.
- Browser, experience-quality, and XR reports now state their evidence
  boundaries instead of treating static implementation as observed behavior.
- Local non-browser validation passed in the required order: typecheck, then
  production build. The build completed with the known large-chunk warning.
  The production dependency audit reported zero high-severity vulnerabilities.

## Engineering assessment

- IWSDK remains pinned to 0.4.2. Three.js classes come from `@iwsdk/core`;
  gameplay objects use `world.createTransformEntity`; interaction uses
  `Interactable`/`DistanceGrabbable`; locomotion uses
  `LocomotionEnvironment`; application physics is disabled.
- The floating ECS system performs no geometry, material, vector, or array
  allocation in its update loop. The static scene does not currently remove
  entities, so no newly introduced disposal defect was found.
- Native buttons, labels, visible focus, status messaging, safe-area offsets,
  and reduced-motion handling are good foundations. The experience review's
  input, reflow, initialization-recovery, and touch-target findings remain open.
- CI has read-only repository permission and the Pages build/deploy permissions
  are separated. No secret or live credential is required. Mutable action major
  tags and the large JS/WASM payload remain non-blocking hardening/performance
  risks.

## Final decision

**PR #2 code/evidence approach: pass.** It safely adds durable remote screenshot
capture and candid review records.

**PR #2 current publication state: conditional pass.** Commit the reviewed
evidence/screenshots/review and confirm green CI on the resulting head before
merge.

**Boilerplate/release verification: fail/incomplete.** Mobile composition is an
observed defect, and successful XR/device plus core interaction evidence is
still missing.
