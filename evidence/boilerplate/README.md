# Evidence: boilerplate

Branch: `codex/boilerplate`  
Created: 2026-07-19

## Build under test

- Commit: `29c507b` (first follow-up; XR/Pages hardening pending)
- IWSDK version: 0.4.2
- Automated browser: Playwright Chromium, desktop and Pixel 7 profiles
- Manual browser: Codex in-app Chromium
- Physical headset: not yet tested

## Results

| ID | Test | Expected | Observed | Result | Artifact |
| --- | --- | --- | --- | --- | --- |
| 01 | TypeScript typecheck | No type errors | `npm run typecheck` completed cleanly | Pass | local command output |
| 02 | Production build | Static `dist/` produced | Vite built 492 modules successfully | Pass with chunk-size warning | local command output |
| 03 | Desktop E2E | Scene ready and controls work | GitHub Actions Chromium project passed | Pass | Actions run `29740887111` |
| 04 | Mobile E2E | Touch navigation is visible | GitHub Actions Pixel 7 Chromium project passed | Pass | Actions run `29740887111` |
| 05 | WebXR unavailable/denied | Player gets fallback or retry feedback | Deterministic Playwright coverage added; remote run pending | Pending | `tests/e2e/xr-support.spec.ts` |
| 06 | IWER XR entry/grab | Enter XR and move a letter | Pending | Pending | `03-vr.webp` if supported |

## Known limitations

- Physical Quest verification requires a connected team headset.
- GitHub Pages must be enabled once in repository Settings with GitHub Actions
  as the source before the first deployment can succeed.
- Local Chromium/IWSDK E2E and screenshot capture remain deferred because
  software WebGL and worker teardown overwhelm this VM; GitHub Actions E2E passes.
