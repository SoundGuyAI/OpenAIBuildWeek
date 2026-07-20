# Independent follow-up review: boilerplate

Branch: `codex/boilerplate`
PR: #1 (draft)
Baseline commit: `17762c9d0a6108ba5dd4b8163f0dd38f20e67c93`
Reviewed commit: `53fbef6689522f1e56f06b04aaae4697c535ffe6`
Reviewed: 2026-07-20
Status: **safe to continue as a draft; not ready to merge**

## Gate decision

No finding blocks keeping PR #1 open, sharing it with the team, or adding more
follow-up commits. The follow-up range resolves the earlier source-level XR
feedback gap and hardens the Pages workflow. Pull-request CI is green at the
reviewed commit.

The PR is **not merge-ready**. GitHub Pages is not enabled and the required
player-visible browser/XR evidence is incomplete.

## Review scope and method

- Reviewed the committed diff `17762c9..53fbef6` against `AGENTS.md`,
  `plans/boilerplate/PLAN.md`, `docs/DEFINITION_OF_DONE.md`, IWSDK 0.4.2
  conventions, accessibility/comfort, security, CI/CD, and existing evidence.
- Inspected the committed blobs rather than unrelated working-tree changes.
- Compared `src/xr-support.ts` with IWSDK 0.4.2's installed session launch,
  reference-space fallback, camera restore, and cleanup path.
- Did not treat internal agent assignments or compaction material as product
  prompts and found no prompt-log issue in the reviewed range.

## Confirmed validation

- GitHub Actions run `29741499653`, job `88349070024`, completed successfully for
  commit `53fbef6`. It passed the locked install, TypeScript typecheck,
  production build, and all six Playwright cases across desktop and mobile
  Chromium.
- Independent local validation passed in the required order:
  `npm run typecheck`, then `npm run build`.
- The production build transformed 493 modules and completed successfully. It
  continues to report the known chunk-size warning, with approximately 1.69 MB
  of minified application JavaScript and a 2.09 MB Havok WASM asset.
- `npm audit --audit-level=high` reported zero known vulnerabilities.
- A tracked-file scan found no common access-token or private-key signatures.
- The GitHub Pages API still returns HTTP 404 for this repository, confirming
  that the site has not been enabled.
- After this review, the orchestrator updated the evidence manifest, browser-QA
  report, assignments, conversation outcome, and draft PR body for commit
  `53fbef6` and run `29741499653`.

## Resolved findings from the prior review

### XR unsupported and request-failure feedback: resolved

`src/xr-support.ts` now checks immersive-VR support, distinguishes unavailable,
support-check failure, permission/security failure, request failure, and setup
failure states, and provides visible disabled or retryable UI. `src/index.ts`
integrates checking, launching, active, exit, and retry states without removing
the desktop/mobile path.

The launch helper follows IWSDK 0.4.2's exported session-init and
reference-space helpers, sets the renderer session, restores the browser camera
on exit, clears `world.session`, and ends a partially configured session on
setup failure. The two deterministic Playwright scenarios verify unsupported
and denied-session behavior in both configured browser projects.

### Pages workflow permissions and failure mode: resolved in code

`.github/workflows/deploy-pages.yml` now uses explicit job-level permissions,
requires `main`, verifies that Pages is configured for GitHub Actions, validates
typecheck/build/E2E before artifact upload, and reserves `pages: write` plus
`id-token: write` for the deploy job. Current referenced Pages action major tags
exist, and `configure-pages` is explicitly prevented from trying unsupported
automatic enablement with the default token.

The repository setting itself remains a merge blocker below.

## Blocking findings before ready/merge

### [P1] GitHub Pages is still disabled

The repository Pages API returns HTTP 404. The hardened workflow will now fail
early with a useful message, but merging to `main` before an administrator sets
**Settings -> Pages -> Source -> GitHub Actions** will still produce a failed
deployment and no hosted game URL.

Enable Pages, run the deployment workflow from `main`, and verify the published
URL from a fresh browser session before declaring the hosting acceptance
criterion complete.

### [P1] Required browser interaction and XR evidence is incomplete

The green Playwright run is reliable automated evidence for boot, responsive
controls, reduced-motion toggling, unsupported WebXR, and denied-session retry
feedback. It is not proof that HELLO WORLD is visibly rendered, movement changes
the player/camera, reset restores state, pointer/touch input moves a letter, or a
real/emulated XR session can enter, grab, exit, and re-enter.

No desktop, mobile, or VR screenshot is checked in, and no `xr-qa.md` report is
present. The plan correctly leaves screenshots and XR verification open. Run
the remaining browser QA on the stronger machine, run IWER/runtime or headset
QA, record any physical-headset limitation precisely, and add the required
artifacts before merge.

## Non-blocking risks and follow-ups

- [P2] `launchImmersiveVr` intentionally mirrors IWSDK's launch sequence because
  IWSDK 0.4.2's `World.launchXR()` returns `void`. The implementation is aligned
  with the pinned SDK, but this duplication is an upgrade hazard. Re-review or
  remove it when changing IWSDK versions.
- [P2] Deterministic tests cover unsupported support checks and a rejected
  session request, but not successful renderer session setup, setup failure,
  session end, or re-entry. The required XR QA is the release gate for those
  paths.
- [P2] The build still ships a large JavaScript chunk and Havok WASM despite
  application physics being disabled. Measure startup and memory on the
  release-gate phone and headset before feature freeze.
- [P2] The three HUD buttons shrink to a 38 px minimum height on coarse/mobile
  layouts. The 52 px movement controls are appropriately larger, but the HUD
  targets should be checked on the release-gate phone for reliable touch use.
- [P2] GitHub Actions use mutable major-version tags rather than immutable commit
  SHAs. Permissions are appropriately narrow, so this is a supply-chain
  hardening opportunity rather than a draft blocker.
- [P3] The shared disabled-button style uses a wait cursor even for the permanent
  `VR unavailable` state. A state-specific cursor would communicate the result
  more accurately.
- [P2] `scripts/run-e2e.mjs` cleans up during normal completion but has no
  explicit SIGINT/SIGTERM cleanup path; an interrupted local run can leave the
  preview process behind, especially on Windows.

## IWSDK, accessibility, security, and CI/CD assessment

- IWSDK remains pinned to `0.4.2`; Three.js classes come from `@iwsdk/core`.
- Gameplay objects use `world.createTransformEntity`; interaction uses
  `Interactable` and `DistanceGrabbable`; locomotion uses
  `LocomotionEnvironment`; application physics remains disabled.
- The floating behavior uses an ECS query without hot-loop geometry, material,
  or vector allocation. The new reduced-motion listener disables floating by
  default when the preference is active and preserves a user's manual pause.
- Desktop and mobile instructions are mode-appropriate, controls have accessible
  names, XR state changes use the existing status region, and failure text
  preserves the non-XR recovery path.
- Pull-request CI has read-only repository permission. Pages build and deploy
  permissions are separated and least-privilege for their responsibilities.
- No production secret or live-service credential is required.

## Final verdict

**Draft-PR safety: pass.** Commit `53fbef6` is a sound follow-up and its CI is
green.

**Merge readiness: fail pending external/configuration and evidence work.** Keep
PR #1 in draft until Pages is enabled and verified, browser screenshots and
interaction evidence are captured, XR entry/grab/exit/re-entry is tested or its
hardware gap is explicitly accepted.
