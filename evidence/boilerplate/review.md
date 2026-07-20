# Independent review: boilerplate

Branch: `codex/boilerplate`  
PR: #1 (draft)  
Baseline commit: `17762c9d0a6108ba5dd4b8163f0dd38f20e67c93`  
Reviewed: 2026-07-20  
Status: **safe to continue as a draft; changes required before ready/merge**

## Gate decision

No finding blocks keeping PR #1 open as the requested baseline draft or adding
reviewed follow-up commits. The branch is **not ready to merge**: CI/CD setup has
one deployment blocker, the player-facing XR failure path is incomplete, and
required interaction/XR evidence is still missing.

## Confirmed validation

- GitHub Actions run `29740056164` passed `npm ci`, typecheck, production build,
  desktop Chromium, and mobile Chromium: **2 tests passed in 18.8 seconds**.
- The current uncommitted experience changes also passed local
  `npm run typecheck` and `npm run build` in the required order.
- The production build still reports a chunk-size warning.
- Full E2E was not rerun locally, honoring the decision to avoid sustained
  IWSDK/software-WebGL load on this VM.
- `npm audit` reported zero known vulnerabilities, and no tracked secret-like
  credential files were found by the review scan.

## Blocking findings before ready/merge

### [P1] GitHub Pages is not currently deployable

The repository Pages endpoint returned HTTP 404 during review, indicating that
Pages is not enabled/configured yet. In addition,
`.github/workflows/deploy-pages.yml:9-10` grants the build job only
`contents: read`, while that job executes `actions/configure-pages` at lines
57-58. The `pages: write` and `id-token: write` permissions at lines 81-83 apply
only to the later deploy job. The configure action does not automatically enable
an unconfigured site with the default `GITHUB_TOKEN`.

Before merging, enable Pages with **GitHub Actions** as its source and ensure the
job running `configure-pages` has the required Pages permission, or move that
step into a correctly permissioned job. Otherwise the first push to `main` can
pass build/E2E and still fail before publishing the requested site.

### [P1] XR entry has no unsupported/failure state

`src/index.ts:263-278` always enables **Enter VR** after world startup and calls
`world.launchXR()` without first checking immersive-session support or providing
user-visible failure/recovery feedback. On a browser without usable WebXR, the
control can do nothing or leave the page claiming it is ready. This violates the
Definition of Done requirement for invalid/failure/retry behavior and leaves a
visible platform promise unreliable.

Add a support check and a clear disabled/unavailable or failure status, then
cover that path in browser tests. Actual enter/exit/re-entry remains part of XR
QA.

### [P1] The passing E2E suite is a smoke test, not proof of the core interaction

`tests/e2e/hello-world.spec.ts:32-75` proves IWSDK reaches its ready marker, the
controls are present, the float button changes text, and mobile layout exposes
four buttons. It does not prove that HELLO WORLD is visibly rendered, desktop or
touch movement changes the player/camera, reset restores state, pointer/touch
interaction moves a letter, or XR entry/grabbing works. The plan explicitly
requires load/pause/reset on desktop and movement/grabbing across platforms.

The GitHub Actions pass is valuable and should be recorded, but it must not be
represented as completion of the full player-facing acceptance criteria.

### [P1] Required interaction and XR evidence is absent

The evidence manifest and browser-QA report now record the successful baseline
GitHub Actions run. No desktop, mobile, or VR screenshot is checked in, and the
automated browser checks do not yet prove movement, reset, or grabbing.
`plans/boilerplate/PLAN.md` correctly leaves screenshots and XR verification
open.

The user's decision permits publishing a draft and doing validation elsewhere;
it does not implicitly waive the repository merge rule that required evidence
must exist. Add interaction screenshots/reports from the stronger machine before
ready/merge.

## Deferred validation, explicitly allowed for the draft

- Browser QA on a stronger machine: visibly confirm the letters, desktop
  keyboard movement, touch movement, pointer/touch interaction, reset behavior,
  responsive/orientation behavior, and console/network cleanliness.
- XR QA in IWER/runtime: enter, scale/origin, locomotion, controller/hand reach,
  grab/release, exit, and re-entry. Record the physical-headset gap if hardware
  is unavailable.
- Capture `01-desktop.webp`, `02-mobile.webp`, and `03-vr.webp` where applicable.
- Push the current reduced-motion/mobile-instruction changes and require the
  resulting CI run to pass; the existing green run covers only the committed
  baseline.

## Non-blocking findings and residual risks

- [P2] The build emits a chunk warning and includes approximately 1.68 MB of
  minified application JavaScript plus a 2.09 MB Havok WASM asset even though
  application physics is disabled. Measure startup on the release-gate phone
  and headset; document acceptance or reduce the payload before feature freeze.
- [P2] `scripts/run-e2e.mjs` cleans up normally, but it has no explicit
  SIGINT/SIGTERM cleanup path. An interrupted local run can leave preview state
  behind, especially on Windows. This does not affect the confirmed normal CI
  path.
- [P2] The boilerplate assignment table lacks the dependency/skip-reason detail
  required by the reusable feature-loop template, and historical orchestrator
  implementation ownership is not accompanied by reasons for skipping
  applicable implementation/research specialists. Correct this as workflow
  documentation, without rewriting history.

## IWSDK, CI, and security review

- IWSDK is pinned to `0.4.2`; Three.js classes are imported through
  `@iwsdk/core`.
- Scene/gameplay objects use `world.createTransformEntity`; interaction uses
  `Interactable` plus `DistanceGrabbable`; locomotion uses
  `LocomotionEnvironment`; physics remains disabled.
- The floating system uses an ECS query and does not allocate objects in its hot
  update loop. Permanent scene resources do not currently require removal-time
  disposal.
- Pull-request CI uses read-only repository permission and successfully ran the
  locked install, build, and both Chromium projects. Deployment permissions are
  isolated, subject to the Pages blocker above.
- No application secrets or live-service credentials are required by the
  production path.

## Follow-up commit verdict

**Yes, a follow-up commit is safe on this draft PR.** The active user prompt is
already present in the append-only log, and the current source changes are
narrowly scoped and pass typecheck/build. Push them to trigger fresh remote E2E.
Keep PR #1 in draft
and do not merge until the Pages, XR-support feedback, interaction evidence, and
XR QA blockers above are resolved or explicitly accepted by the human owner in
the documented merge gate.
