# Agent assignments: boilerplate

Branch: `codex/boilerplate`  
Updated: 2026-07-20  
Status: paused for baseline PR

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
| Pending after integration | Independent reviewer | `evidence/boilerplate/review.md` | Diff, tests, evidence, and residual risks reviewed | Pending |

## Scope rules

- One active writer owns each path.
- Specialists may read broadly but request out-of-scope edits.
- The orchestrator integrates shared files and resolves blocking findings.
- No implementer is the sole reviewer of its own work.
