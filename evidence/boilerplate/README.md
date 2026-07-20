# Evidence: boilerplate

Branch: `codex/boilerplate`  
Created: 2026-07-19

## Build under test

- Commit: `53fbef6` (XR and Pages hardening follow-up)
- IWSDK version: 0.4.2
- Automated browser: Playwright Chromium, desktop and Pixel 7 profiles
- Manual browser: Codex in-app Chromium
- Physical headset: not yet tested

## Results

| ID | Test | Expected | Observed | Result | Artifact |
| --- | --- | --- | --- | --- | --- |
| 01 | TypeScript typecheck | No type errors | `npm run typecheck` completed cleanly | Pass | local command output |
| 02 | Production build | Static `dist/` produced | Vite built 493 modules successfully | Pass with chunk-size warning | local command output |
| 03 | Desktop E2E | Scene ready and controls work | GitHub Actions Chromium project passed | Pass | Actions run `29741499653` |
| 04 | Mobile E2E | Touch navigation is visible | GitHub Actions Pixel 7 Chromium project passed | Pass | Actions run `29741499653` |
| 05 | WebXR unavailable/denied | Player gets fallback or retry feedback | Unsupported and denied-launch cases passed on both browser profiles; 6 total tests passed in 50.3s | Pass | Actions run `29741499653` |
| 06 | IWER XR entry/grab | Enter XR and move a letter | Pending | Pending | `03-vr.webp` if supported |

## Known limitations

- Physical Quest verification requires a connected team headset.
- GitHub Pages must be enabled once in repository Settings with GitHub Actions
  as the source before the first deployment can succeed.
- Local Chromium/IWSDK E2E and screenshot capture remain deferred because
  software WebGL and worker teardown overwhelm this VM; GitHub Actions E2E passes.
