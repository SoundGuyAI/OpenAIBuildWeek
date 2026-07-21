# Agent assignments: scenery-hand-interactions

Branch: `fix/scenery-hand-interactions`
Created: 2026-07-21
Status: implementation, QA, and independent re-review complete

## Orchestrator-only paths

- `docs/conversation/2026-07-20-kaiju-qa.md`
- `plans/scenery-hand-interactions/PLAN.md`
- `plans/scenery-hand-interactions/AGENT_ASSIGNMENTS.md`
- `evidence/scenery-hand-interactions/README.md`
- `src/kaiju-qa/scene.ts`, `src/kaiju-qa/assets.ts`, `src/index.ts`
- Shared configuration, integration, branch operations, and final acceptance

## Dispatch table

| Agent | Role | Exclusive write scope | Deliverable | Status |
| --- | --- | --- | --- | --- |
| Visual specialist | Visual/asset specialist | `plans/scenery-hand-interactions/agent-notes/visual-audit.md` | Ranked scene/model/transform audit | Complete |
| XR specialist | IWSDK hand-interaction specialist | `plans/scenery-hand-interactions/agent-notes/xr-audit.md` | Hand/controller input and collider audit | Complete |
| Control implementer | Physical-control implementer | `src/kaiju-qa/control-fixtures.ts`, `tests/model/control-fixtures.test.mjs` | Robust lever fixture and focused tests | Complete |
| Browser QA | Browser QA | `evidence/scenery-hand-interactions/browser-qa.md`, screenshots | Independent desktop/mobile runtime verification | Complete — conditional visual pass |
| XR QA | XR/reviewer | `evidence/scenery-hand-interactions/xr-qa.md` | Independent hand/controller review | Complete — IWER smoke plus documented headset gap |
| Independent reviewer | Final reviewer | `evidence/scenery-hand-interactions/review.md` | Independent code/evidence acceptance | Complete — approved with documented follow-ups |

## Scope rules

- Agents preserve concurrent edits and write only inside their exclusive scope.
- Agents do not create branches, commit, merge, or edit orchestrator-owned files.
- Implementation and independent review remain separate roles.
