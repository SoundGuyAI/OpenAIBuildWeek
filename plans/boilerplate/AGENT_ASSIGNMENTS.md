# Agent assignments: boilerplate

Branch: `codex/boilerplate`  
Updated: 2026-07-20  
Status: post-merge non-local review in progress; XR/device QA pending

## Orchestrator-only paths

- `docs/conversation/2026-07-19-bootstrap.md`
- `plans/boilerplate/PLAN.md`
- `plans/boilerplate/AGENT_ASSIGNMENTS.md`
- `evidence/boilerplate/README.md`
- Shared configuration integration, Git operations, commit, push, and PR

## Dispatch table

| Agent ID | Expert role | Exclusive write scope | Finish condition | Status |
| --- | --- | --- | --- | --- |
| `019f7f58-0e31-7321-a7b0-90ccb89e51ca` | Browser E2E | `playwright.config.ts`, `tests/e2e/**`, `scripts/run-e2e.mjs`, `evidence/boilerplate/browser-qa.md`, browser screenshots | Desktop/mobile Chromium pass and runner exits cleanly | Paused; continue after baseline PR on stronger machine |
| `019f7f58-3948-72c2-9765-441faf5b7905` | XR QA | `evidence/boilerplate/xr-qa.md`, VR screenshots | IWER/runtime matrix complete or exact blocker documented | Paused; no runtime started |
| `019f7f58-8872-7471-b807-876e3dc07aa6` | Experience quality | `evidence/boilerplate/experience-review.md` | Ranked accessibility/comfort/performance findings | Paused; preliminary findings captured in orchestrator notes |
| `019f7f5e-c522-7043-ad51-7a64562a97e0` | Experience implementation | `index.html`, `src/**` | Reduced motion and mobile instructions fixed; typecheck/build pass | Complete |
| `019f7f5e-f41d-7381-b973-17fd47da7273` | Independent reviewer | `evidence/boilerplate/review.md` | Diff, tests, evidence, and residual risks reviewed | Complete; follow-up re-review pending |
| `019f7f68-9504-7cd0-a689-2cb70f403043` | IWSDK/XR implementation expert | `src/xr-support.ts`, `tests/e2e/xr-support.spec.ts` | Unsupported and launch-failure states are user-visible and browser-tested | Complete; integrated by orchestrator |
| `019f7f68-bef5-7ad1-bc22-3d62604d4af4` | CI/CD and GitHub Pages expert | `.github/workflows/deploy-pages.yml`, `plans/boilerplate/agent-notes/pages-review.md` | Pages workflow permissions and configuration path are reviewed and corrected | Complete; repository setting remains |
| `019f7f73-a247-7f20-b393-2352835fa446` | Independent follow-up reviewer | `evidence/boilerplate/review.md` | Review commit `53fbef6`, new tests, CI result, workflow, and remaining merge blockers | Complete; draft safe, merge blockers recorded |
| `019f7fe9-eb9a-76b2-9488-80734f5d33a7` | Browser E2E expert | `tests/e2e/hello-world.spec.ts`, `evidence/boilerplate/browser-qa.md` | Add deterministic GitHub Actions desktop/mobile screenshot capture and document its exact coverage without local browser execution | Complete; orchestrator integrated success-artifact upload |
| `019f7fea-1476-73f2-98e8-fdd417655d02` | Experience quality expert | `evidence/boilerplate/experience-review.md` | Static accessibility, comfort, input, and performance review that clearly labels device-dependent gaps | Complete; 3 P1, 6 P2, and 1 P3 findings recorded |
| `019f7fec-d507-7191-bca5-af4fe86246c4` | XR QA expert | `evidence/boilerplate/xr-qa.md` | Audit deterministic XR recovery coverage and record the exact successful-session, IWER, and headset gaps without running a browser | Complete; XR gate remains failed for missing runtime evidence |
| `019f7ffa-718b-7d50-9b1d-a63486c78cf9` | Independent reviewer | `evidence/boilerplate/review.md` | Review the final follow-up diff, CI artifacts, deployment evidence, DoD coverage, and residual XR/device limitations | Complete; PR #2 safe as evidence follow-up, product verification incomplete |

## Post-merge orchestration notes

- Game-design discovery is skipped because this branch changes no mechanic,
  player outcome, or product scope.
- New IWSDK research is skipped because the pinned SDK and production code are
  unchanged; the independent reviewer will still audit existing IWSDK usage.
- XR QA cannot be completed under the user's no-local-browser constraint and no
  connected headset evidence is available. The exact limitation remains in the
  evidence and final review rather than being treated as a pass.
- The orchestrator owns workflow integration, the prompt log, canonical plan,
  assignment manifest, evidence manifest, branch operations, and publication.

## Scope rules

- One active writer owns each path.
- Specialists may read broadly but request out-of-scope edits.
- The orchestrator integrates shared files and resolves blocking findings.
- No implementer is the sole reviewer of its own work.
