# Evidence: boilerplate

Branch: `codex/boilerplate`  
Created: 2026-07-19

## Build under test

- Commit: baseline commit pending
- IWSDK version: 0.4.2
- Automated browser: Playwright Chromium, desktop and Pixel 7 profiles
- Manual browser: Codex in-app Chromium
- Physical headset: not yet tested

## Results

| ID | Test | Expected | Observed | Result | Artifact |
| --- | --- | --- | --- | --- | --- |
| 01 | TypeScript typecheck | No type errors | `npm run typecheck` completed cleanly | Pass | local command output |
| 02 | Production build | Static `dist/` produced | Vite built 492 modules successfully | Pass with chunk-size warning | local command output |
| 03 | Desktop E2E | Scene ready and controls work | Visual rendering and isolated assertions observed; full package-script run is too resource-intensive on this VM | Deferred | run on stronger machine |
| 04 | Mobile E2E | Touch navigation is visible | Not completed on this VM | Deferred | run on stronger machine |
| 05 | IWER XR entry/grab | Enter XR and move a letter | Pending | Pending | `02-vr.png` if supported |

## Known limitations

- Physical Quest verification requires a connected team headset.
- Full Chromium/IWSDK E2E is intentionally deferred to another machine because
  software WebGL and worker teardown overwhelm this VM.
