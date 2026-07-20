# Agent assignments: boilerplate

Branch: `codex/boilerplate`  
Updated: 2026-07-20  
Status: follow-up hardening in progress

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
| `019f7f68-9504-7cd0-a689-2cb70f403043` | IWSDK/XR implementation expert | `src/xr-support.ts`, `tests/e2e/xr-support.spec.ts` | Unsupported and launch-failure states are user-visible and browser-tested | In progress |
| `019f7f68-bef5-7ad1-bc22-3d62604d4af4` | CI/CD and GitHub Pages expert | `.github/workflows/deploy-pages.yml`, `plans/boilerplate/agent-notes/pages-review.md` | Pages workflow permissions and configuration path are reviewed and corrected | In progress |

## Scope rules

- One active writer owns each path.
- Specialists may read broadly but request out-of-scope edits.
- The orchestrator integrates shared files and resolves blocking findings.
- No implementer is the sole reviewer of its own work.
