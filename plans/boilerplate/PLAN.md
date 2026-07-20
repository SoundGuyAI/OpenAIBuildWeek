# Feature plan: boilerplate

Branch: `codex/boilerplate`  
Created: 2026-07-19  
Status: draft PR hardening; physical XR evidence pending

## Player outcome

Open one URL and immediately see an interactive floating 3D “Hello World” that
works in desktop/mobile browsers and can enter VR.

## Acceptance criteria

- [x] IWSDK 0.4.2 TypeScript/Vite project is configured.
- [x] The scene renders 3D block letters spelling “HELLO WORLD.”
- [x] Letters use IWSDK interaction/grabbing components.
- [x] A locomotion floor and desktop/mobile movement affordances exist.
- [x] The page exposes Enter VR, float toggle, and reset controls.
- [x] Unsupported WebXR and denied session launches provide clear fallback and
  retry feedback.
- [x] Feature branch, plan, evidence, design, and conversation conventions exist.
- [x] Pull-request CI and GitHub Pages deployment workflows exist.
- [x] Typecheck and production build pass.
- [x] Desktop/mobile Chromium E2E passes in GitHub Actions.
- [ ] Browser screenshots are captured on a machine with sufficient IWSDK/WebGL
  headroom.
- [ ] XR entry and controller grabbing are verified in IWER or marked with the
  exact remaining limitation.

## Work breakdown

| Task | Owner | Write scope | Done when |
| --- | --- | --- | --- |
| IWSDK project and scene | Orchestrator | root config, `src/` | build is interactive |
| Agent/team harness | Orchestrator | `.agents/`, `docs/`, templates | loop is executable |
| Browser E2E | Browser QA expert | `tests/e2e/`, evidence | desktop/mobile pass |
| XR failure states | IWSDK/XR expert | `src/xr-support.ts`, owned E2E | fallback and retry states pass |
| CI/CD | CI/CD expert | `.github/`, owned note | PR CI and Pages workflow valid |

## Test matrix

| Surface | Scenario | Expected result | Evidence |
| --- | --- | --- | --- |
| Desktop | Load, pause float, reset | Ready state, canvas, controls work | `evidence/boilerplate/` |
| Mobile | Load at Pixel viewport | Touch movement pad is visible | automated E2E |
| Browser without XR | Load or deny XR permission | Clear fallback or retry feedback | automated E2E |
| VR/IWER | Enter session and grab a letter | Session enters; letter follows controller | pending runtime test |

## Risks

- Browser WebGL support varies on CI; Chromium is the required automated target.
- Physical headset testing requires a team member with a WebXR device.
- IWSDK runtime tools are development-only and are excluded from Pages builds.
