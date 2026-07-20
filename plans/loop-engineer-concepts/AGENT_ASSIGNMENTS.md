# Agent assignments — Loop Engineer concepts

One active writer owns each path. The orchestrator alone owns the prompt log, this manifest, `PLAN.md`, the final proposal files, shared configuration, integration, branch operations, and the evidence manifest.

| Logical ID | Role | Exclusive write scope | Deliverable / finish condition | Dependencies | Status |
| --- | --- | --- | --- | --- | --- |
| DISC-GD-01 · `019f811a-0e8a-74a0-8ce2-554d34117853` | Game design expert | `plans/loop-engineer-concepts/agent-notes/game-design.md` | Five divergent mechanic seeds and a common 180-second learning arc | Intake only | Complete |
| DISC-LD-01 · `019f811a-0f4f-7630-98fb-04f53b65fe8b` | Learning-design researcher | `plans/loop-engineer-concepts/agent-notes/learning-design.md` | Sourced Loop Engineering + SDLC teaching model and assessment beats | Intake only | Complete |
| DISC-MR-01 · `019f811a-115a-7963-9d4a-c252a1d4b8b4` | Market/originality researcher | `plans/loop-engineer-concepts/agent-notes/market-research.md` | Comparable-game scan, collision risks, and differentiation rules | Intake only | Complete |
| DISC-SDK-01 · `019f811a-141b-7f53-94df-30203f9cb221` | IWSDK/architecture expert | `plans/loop-engineer-concepts/agent-notes/sdk-research.md` | Four-hour feasibility, IWSDK mappings, and risk cuts | Intake only | Complete |
| DISC-ART-01 · `019f811a-1781-70a3-8c12-7398d5faeb32` | Art director / asset researcher | `plans/loop-engineer-concepts/agent-notes/art-direction.md` | Five visual systems, Flux prompt briefs, and licensed asset candidates | Intake only | Complete |
| DISC-NAR-01 · `019f811a-2379-7bb3-8a71-d52e4e085795` | Narrative creative director | `plans/loop-engineer-concepts/agent-notes/narrative.md` | Five distinct fantasies, stakes, and beginning/escalation/ending beats | Intake only | Complete |
| DISC-COM-01 · `019f8121-ad74-7582-86cc-ecdb0c4f4999` | Comedy writer | `plans/loop-engineer-concepts/agent-notes/comedy.md` | Optional humor system, readable gags, and tone guardrails per concept | Intake only | Complete |
| DISC-MKT-01 · `019f8121-ae45-7181-90c6-f7f97c50c82d` | Devpost marketing strategist | `plans/loop-engineer-concepts/agent-notes/devpost-strategy.md` | Current official requirements, judging story, and submission-document outline | Intake only | Complete |
| BUILD-HTML-01 · `019f812d-3411-7751-a751-d11f939ede4c` | Offline-document implementation expert, then orchestrator fallback | `docs/design/loop-engineer-concepts/index.html` | Self-contained concept book matching the integrated Markdown and local assets | Integrated proposal + assets | Complete — agent stalled; orchestrator reclaimed ownership and finished |
| QA-BROWSER-01 · `019f815b-55c3-7b20-9659-f6fc2740101f`; final rerun `019f816d-b80b-7df3-9a94-3d8fdd6ebf7c` | Browser QA expert | `evidence/loop-engineer-concepts/browser-qa.md`, `01-desktop.webp`, `02-mobile.webp` | Desktop/mobile/offline/accessibility report using numbered artifacts | Integrated HTML | Complete — PASS after final score/mobile-diagram changes |
| QA-XR-01 · `019f815b-5695-7401-b67e-92285b2759a7` | XR QA expert | `evidence/loop-engineer-concepts/xr-qa.md` | Review proposed XR interaction/comfort mappings; record runtime as not applicable | Integrated proposal | Complete — conditional design-feasibility pass; runtime certification deferred |
| QA-XP-01 · `019f815b-5824-70e0-8a96-b0759f1751e0` | Experience-quality expert | `evidence/loop-engineer-concepts/experience-review.md` | Visual hierarchy, accessibility, clarity, comfort, performance review | Integrated deliverables | Complete — four blockers found; all resolved and closed by final review |
| REVIEW-01 · `019f817d-511f-7321-860f-08dc69dee0ee` | Independent reviewer | `evidence/loop-engineer-concepts/review.md` | Diff/plan/research/evidence review with blocking findings clearly marked | All validation evidence | Complete — APPROVE, no blocking findings |
| FOLLOWUP-LINK-01 · orchestrator | Shared HUD/build integration | `index.html`, `src/styles.css`, `package.json`, `scripts/copy-concept-book.mjs` | Add an accessible concept-book button and preserve its path in `dist` | Published concept book | Complete — static verification only; user deferred runtime testing |
| FOLLOWUP-REVIEW-01 · `019f818e-5fdc-7470-8e02-d9eda121ff47` | Independent static reviewer | Read-only follow-up diff | Verify source/build link parity, semantics, styling, mobile wrapping, and cross-platform copy behavior without runtime execution | Follow-up integration | Complete — APPROVE, no blocking issues |

## Skipped roles

- Runtime gameplay implementation agents are deferred because this branch intentionally produces design artifacts only.
- Physical-headset QA is deferred until one concept is selected and implemented.
- A separate implementation agent was not dispatched for the one-link follow-up
  because it is an urgent, tightly coupled edit across shared HUD and build
  integration files, which remain orchestrator-owned. Browser and IWSDK runtime
  QA are deferred by explicit user request due to VM resource limits.
