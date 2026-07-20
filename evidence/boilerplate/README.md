# Evidence: boilerplate

Branch: `codex/boilerplate`  
Created: 2026-07-19

## Build under test

- Merged commit: `be6dd7136a91d4062ba59c3e0d4c838b1bf21804`
- Source PR: #1, merged 2026-07-20 at 13:58:45 UTC
- IWSDK version: 0.4.2
- Automated browser: Playwright Chromium, desktop and Pixel 7 profiles
- Deployment: GitHub Pages run `29748804444`
- Hosted URL: `https://soundguyai.github.io/OpenAIBuildWeek/`
- Manual browser: not run for this post-merge review
- Physical headset: not yet tested

## Results

| ID | Test | Expected | Observed | Result | Artifact |
| --- | --- | --- | --- | --- | --- |
| 01 | TypeScript typecheck | No type errors | `npm run typecheck` completed cleanly | Pass | local command output |
| 02 | Production build | Static `dist/` produced | Vite built 493 modules successfully | Pass with chunk-size warning | local command output |
| 03 | Desktop E2E | Scene reaches ready state and browser controls work | GitHub Actions desktop Chromium project passed on the merged commit | Pass | Actions run `29748804444` |
| 04 | Mobile E2E | Touch navigation is visible and responsive layout does not overflow | GitHub Actions Pixel 7 Chromium project passed on the merged commit | Pass | Actions run `29748804444` |
| 05 | WebXR unavailable/denied | Player gets fallback or retry feedback | Unsupported and denied-launch cases passed on both browser profiles; 6 total tests passed in 44.5s | Pass | Actions run `29748804444` |
| 06 | Pages deployment | Main build publishes through the configured Pages workflow | Build, test, artifact upload, and deployment completed; hosted document returned HTTP 200 | Pass | Actions run `29748804444` |
| 07 | Hosted critical assets | Script, stylesheet, WASM, and worker assets resolve under the repository base path | Document plus six sampled critical assets returned HTTP 200 with expected content types | Pass | Post-merge HTTP verification, 2026-07-20 |
| 08 | Desktop/mobile screenshots | Preserve player-visible desktop and mobile states | Pending follow-up GitHub Actions artifact capture | Pending | `01-desktop.webp`, `02-mobile.webp` |
| 09 | IWER XR entry/grab | Enter XR and move a letter | Not run under the no-local-browser/no-headset constraint | Not run | `xr-qa.md`; future `03-vr.webp` |

## Known limitations

- Physical Quest verification requires a connected team headset.
- Successful XR session setup, scale/origin, locomotion, controller/hand input,
  grabbing, exit, and re-entry remain unverified in IWER and on hardware.
- This post-merge review intentionally does not run Chromium or IWSDK locally.
  GitHub Actions is the authoritative browser runner.
- The initial push-triggered Pages run failed before the repository setting was
  enabled. The subsequent main-branch run `29748804444` passed and deployed the
  merge commit successfully.
- The dependency graph currently has no committed lockfile; installs use the
  declared semver ranges and are not fully reproducible.
