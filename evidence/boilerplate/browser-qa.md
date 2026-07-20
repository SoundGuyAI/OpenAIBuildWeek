# Browser QA: boilerplate

Branch: `chore/boilerplate-post-merge-review`
Deployed base commit: `be6dd7136a91d4062ba59c3e0d4c838b1bf21804`
Status: remote screenshot capture implemented; final artifacts pending follow-up CI

## Environment

- Runner: GitHub Actions `ubuntu-latest`
- Node: `.nvmrc` (Node 24)
- Browser: Playwright Chromium
- Projects: Desktop Chrome and Pixel 7 emulation
- Successful main deployment run: `29748804444`
- Validation job: `88373560719`
- Publish job: `88374012610`

## Prior successful main deployment

GitHub Actions run `29748804444` executed against merged `main` commit
`be6dd7136a91d4062ba59c3e0d4c838b1bf21804` on 2026-07-20. Its validation
job passed dependency installation, TypeScript typecheck, the production Vite
build, and the desktop/mobile Chromium E2E suite. The publish job then deployed
the Pages artifact successfully.

The run did not preserve browser screenshots. The existing workflow's
Playwright artifact step was failure-only and was skipped because validation
passed.

## Remote-CI evidence procedure

`tests/e2e/hello-world.spec.ts` now captures one viewport screenshot after all
existing ready-state, control, responsive-layout, and runtime-error assertions
have passed, and before the test navigates to `about:blank` for deterministic
worker teardown:

- Desktop Chrome writes `test-results/evidence/01-desktop.png`.
- Pixel 7 emulation writes `test-results/evidence/02-mobile.png`.

Motion is paused by the existing control test before capture, and Playwright
also disables CSS animations for the screenshot. The test uses Playwright's
native PNG output; exact filenames are stable across CI retries, so a successful
follow-up run produces a single canonical desktop/mobile pair.

To preserve the generated files, the orchestrator must add or update a GitHub
Actions artifact step to upload `test-results/evidence/` on successful runs.
After that workflow integration, run the two configured Chromium projects and
download the PNG files. The orchestrator will convert them to
`evidence/boilerplate/01-desktop.webp` and
`evidence/boilerplate/02-mobile.webp` to match the repository evidence
convention.

## Automated coverage

| Surface | Validation | Result |
| --- | --- | --- |
| Desktop | IWSDK ready state, visible scene container, HUD control availability, desktop instructions, motion toggle, no captured runtime or critical asset-loading errors | Passed on merged `main` in run `29748804444` |
| Mobile | IWSDK ready state, visible scene container, four-button touch navigation, responsive layout, no horizontal overflow, no captured runtime or critical asset-loading errors | Passed on merged `main` in run `29748804444` |
| WebXR unavailable | Enter VR is disabled with clear desktop/touch fallback guidance | Passed on desktop and mobile profiles in run `29748804444` |
| WebXR denied | Enter VR becomes a retry control with permission guidance | Passed on desktop and mobile profiles in run `29748804444` |
| Screenshot capture | Deterministic desktop/mobile PNG files after successful assertions | Implemented; pending follow-up CI run and artifact upload |

## What the screenshots will prove

The remote screenshots will establish the player-visible state produced by the
tested build at the configured desktop and Pixel 7 emulation viewports after
IWSDK reports ready and the float control is paused. Together with the existing
assertions, they provide evidence that expected controls and instructions are
present, the scene container is visible, the mobile layout does not overflow,
and no captured console, page, or critical document/script/style request error
occurred before capture.

They do not establish manual visual quality, text legibility, animation quality,
real touch behavior, physical-phone safe areas, other browser engines, GPU and
device performance, successful WebXR entry, controller/hand interaction,
locomotion comfort, grabbing, exit/re-entry, or physical-headset behavior.

## Local execution constraint

Per the post-merge review constraint, this task does not invoke Playwright,
Chromium, the page, or a browser locally. Only non-browser static checks are run
in this worktree; their exact commands and outcomes are recorded after
validation.

## Non-browser validation

- `npm run typecheck` — Pass (exit code 0); `tsc --noEmit` reported no
  diagnostics on 2026-07-20.
- Playwright, Chromium, and the page were not invoked locally.

## Pending artifacts

- Remote `01-desktop.png` and `02-mobile.png` from the follow-up CI run
- Converted repository evidence: `01-desktop.webp` and `02-mobile.webp`
- Successful CI artifact containing `test-results/evidence/`
- VR/IWER and physical-headset evidence in `xr-qa.md`
