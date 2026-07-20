# Evidence: kaiju-qa

Branch: `feature/kaiju-qa`
Review date: 2026-07-20 UTC
Status: deterministic/static checks pass; browser and XR runtime intentionally deferred

## Build under test

- Build commit: `9cf55998c99b49b69b9f7a08c5220516fa8b4b0d`
- Base: `origin/main` at `effe276bdc3287492a8e273e648b8e930ce8fda8`
- IWSDK: `0.4.2`
- Node: `v22.18.0`
- Operating system: Windows / PowerShell
- Worktree: `C:/UnityProj/OpenAIBuildWeek-kaiju-qa`
- Runtime constraint: no `iwsdk dev`, IWER, Playwright, Vite preview, browser,
  or headset execution was started, per the user's explicit preference to finish
  and publish the PR first.

## Results

| ID | Test | Expected | Observed | Result | Artifact |
| --- | --- | --- | --- | --- | --- |
| 01 | `npm run test:model` | Baseline, edge case, two regressions, stale evidence, targeted pass, release gate, reset, guide, immutability, and retained history are deterministic | 6 tests passed, 0 failed | Pass | `tests/model/kaiju-qa-model.test.mjs` |
| 02 | `npm run typecheck` | All TypeScript, including authored Playwright specs, compiles | Exit 0 | Pass | Command output in task log |
| 03 | `npm run build` | Production static bundle and merged concept book complete | 494 modules transformed; build completed; concept book copied | Pass with existing large-chunk warning | `dist/` (ignored build output) |
| 04 | `git diff --check` | No whitespace errors | No errors | Pass | Git command output |
| 05 | Desktop/mobile Playwright suite | Complete tutorial, wrong-choice recovery, targeted 3/3, release, reset, keyboard focus, mobile layout, reduced motion, XR fallback mocks | Authored and typechecked; not executed locally | Deferred | `tests/e2e/hello-world.spec.ts`, `tests/e2e/xr-support.spec.ts` |
| 06 | Independent browser QA | Review selectors, diagnostics, matrix, and runtime gap | Static review completed; runtime sign-off blocked until CI/stronger machine executes Playwright | Conditional | `browser-qa.md` |
| 07 | Experience/accessibility QA | Review tutorial, agency, copy, keyboard/touch semantics, non-color cues, motion, spectator clarity | Static review completed; false modal, duplicate live region, focus recovery, selected-state, diagnostics, test coverage, and reduced-motion findings were remediated after review | Conditional pending runtime | `experience-review.md` |
| 08 | XR QA | Verify API/lifecycle patterns and document runtime gaps without starting IWSDK | Static API review passed; full XR gameplay/readability/comfort remains uncertified | Conditional | `xr-qa.md` |
| 09 | Independent final review | Review latest diff, plan, QA reports, ownership, and checks | Approved for PR/merge from static code-review scope; no code blocker remains | Pass with runtime gates deferred | `review.md` |

## Acceptance coverage

- Pure state and release rules: model tests.
- Desktop/mobile player path: authored Playwright test; execution deferred.
- Keyboard focus recovery: authored desktop Playwright test; execution deferred.
- Mobile overflow, landscape, tap targets, reduced motion: authored Playwright
  checks; execution deferred.
- Runtime console/page/network cleanliness: broad Playwright diagnostics authored;
  execution deferred.
- XR entry/error path: existing helper preserved and mocked tests authored;
  IWER/headset execution deferred.

## Known limitations

- No desktop/mobile screenshots are claimed in this branch because producing
  them requires the IWSDK-backed browser runtime that the user asked not to run
  on this machine before the PR.
- Browser QA cannot sign off until CI or another machine runs
  `npm run test:e2e:run` after the production build.
- Immersive XR has unlabeled geometric control proxies but no complete readable
  world-space evidence board. Do not market the full game as XR-certified.
- IWER/headset entry, controller rays, exit/re-entry, visibility ordering,
  seated reach, comfort, and performance are untested.
- IWSDK's production bundle still emits a large JavaScript chunk and Havok WASM
  despite physics being disabled. Cold-cache mobile transfer requires runtime
  measurement and future optimization.
- Public deployment, YouTube demo, Codex `/feedback` session ID, and repository
  license remain final Devpost submission tasks outside this feature PR.

## Recommended post-PR runtime gate

On CI or a stronger browser-capable machine:

```bash
npm ci
npx playwright install --with-deps chromium
npm run typecheck
npm run build
npm run test:model
npm run test:e2e:run
```

If that run passes, copy `test-results/evidence/01-desktop.png` and
`02-mobile.png` into this evidence folder (converting to WebP if desired), add
the exact commit/browser/device data, and update the browser/XR reports in a
follow-up commit.
