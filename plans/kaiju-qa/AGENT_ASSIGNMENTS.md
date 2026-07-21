# Agent assignments: kaiju-qa

Branch: `feature/kaiju-qa`
Created: 2026-07-20T21:49:25.986Z
Status: publication freeze; clean PR CI pending

## Orchestrator-only paths

- `docs/conversation/2026-07-20-kaiju-qa.md`
- `plans/kaiju-qa/PLAN.md`
- `plans/kaiju-qa/AGENT_ASSIGNMENTS.md`
- `evidence/kaiju-qa/README.md`
- `src/index.ts`, shared configuration, branch operations, integration, and urgent blockers

## Dispatch table

| Agent ID | Expert role | Exclusive write scope | Depends on | Done when | Status or skip reason |
| --- | --- | --- | --- | --- | --- |
| Russell (`019f8183-d25c-7812-98ee-a426daad85c9`) | Game and tutorial designer | `plans/kaiju-qa/agent-notes/game-design.md` | Logged prompt | Playable beat sheet, agency, recovery, replay, acceptance advice | Complete |
| Zeno (`019f8183-d2c3-7140-a450-30de1045f6cf`) | Devpost/market/marketing strategist | `plans/kaiju-qa/agent-notes/competition-strategy.md` | Logged prompt | Current official criteria, differentiation, claims, demo hooks | Complete |
| Gauss (`019f8183-d386-72b0-b054-ef36e2be9713`) | Education/learning designer | `plans/kaiju-qa/agent-notes/learning-design.md` | Logged prompt | Tutorial scaffolding, transfer objective, debrief, misconceptions | Complete |
| Aristotle (`019f8183-d499-7043-926c-fa0036390ac9`) | Creative director, narrative designer, comedy writer | `plans/kaiju-qa/agent-notes/narrative-comedy.md` | Logged prompt | Final-ready concise copy and kind comedy beats | Complete |
| Sagan (`019f8184-2842-7540-9cfc-ec288eb49dc2`) | Art director and asset/licensing researcher | `plans/kaiju-qa/agent-notes/art-direction.md` | Logged prompt | Code-native visual system, motion, readability, asset guardrails | Complete |
| Tesla (`019f8184-48c2-75f0-9621-c82998aeb019`) | IWSDK/architecture engineer | `plans/kaiju-qa/agent-notes/sdk-research.md` | Logged prompt | Pinned-version-safe patterns, integration API, XR limitations | Complete |
| Mendel (`019f819d-d5bc-79b0-ba99-d4be0d415e73`) | Gameplay/state engineer | `src/kaiju-qa/game-model.ts` | Game + learning notes | Pure deterministic model implements all rules and exposes testable API | Complete after orchestrator integration correction; reassigned after Archimedes did not return a patch |
| Dalton (`019f819d-d893-7bd3-8e71-0a1409025ccb`) | 3D/procedural art engineer | `src/kaiju-qa/scene.ts` | Art + SDK notes | Merge-safe authored tabletop scene exposes render/update API | Complete after orchestrator integration correction; reassigned after Kierkegaard did not return a patch |
| Curie (`019f819d-d623-7140-901e-e5cd0826139d`) | UI/accessibility engineer | `index.html`, `src/styles.css` | Game, learning, writing, art notes | Responsive semantic tutorial/game UI is complete | Complete; reassigned after Popper did not return a patch |
| Jason (`019f81ab-60e5-7c32-a3e2-1af5cbbaa3ba`) | Model/browser test engineer | `tests/model/kaiju-qa-model.test.mjs`, `tests/e2e/hello-world.spec.ts` | Integrated app | Deterministic model passes; authored desktop/mobile loop covers recovery and release | Complete; model 5/5 passed, Playwright execution explicitly deferred |
| Euler (`019f81b0-6938-7ca2-b472-138f301a56b7`) | Independent browser QA | `evidence/kaiju-qa/browser-qa.md` | Integrated build | Static desktop/mobile/test review and runtime gap recorded | Complete; browser execution deferred |
| Cicero (`019f81b0-69ff-7272-bed3-92aba9aa77cf`) | Independent XR reviewer | `evidence/kaiju-qa/xr-qa.md` | Integrated build | Static review complete; runtime gap recorded without running IWSDK | Complete; no XR certification |
| Hypatia (`019f81b0-6986-7081-b28f-9f8aaa102100`) | Experience/accessibility reviewer | `evidence/kaiju-qa/experience-review.md` | Integrated build | Ranked findings and retest criteria documented | Complete; blocking static findings remediated by orchestrator |
| Lovelace (`019f81b4-906c-74a2-bbb7-446a77ff68bf`) | Independent code/product reviewer | `evidence/kaiju-qa/review.md` | Checks and QA evidence | Blocking findings, merge safety, and residual risks documented | Complete; approved static/code-review scope |

## Scope rules

- Agents are not alone in the repository and must preserve other writers' edits.
- One active writer owns each path; active write scopes never overlap.
- Specialists may read broadly but must request out-of-scope edits.
- Subagents do not create branches, commit, push, merge, or modify manifests.
- The orchestrator updates status and agent IDs after every dispatch/return.
- Implementation and independent review have different owners.

## Redesign iteration assignments

| Agent ID | Expert role | Exclusive write scope | Status |
| --- | --- | --- | --- |
| Ptolemy (`019f8203-f71b-7b43-9a85-98f4780be659`) | Campaign/state engineer | `src/kaiju-qa/game-model.ts`, `tests/model/kaiju-qa-model.test.mjs` | Complete; four-level deterministic campaign, superseded by the neutral-choice refinement now passing 8/8 model tests |
| Linnaeus (`019f8203-a149-7c22-8fc8-5bb9016971b7`) | Narration/audio engineer | `src/kaiju-qa/narration.ts`, `src/kaiju-qa/narration-manifest.ts`, `scripts/generate-narration.mjs`, `docs/assets/AUDIO_CREDITS.md`, `public/audio/narration/` | Complete; 12 Kokoro cues generated and verified |
| Meitner (`019f81ef-348e-7dd0-bf7b-16bcfd582c48`) | Art director and asset researcher | Read-only audit | Complete; Quaternius/Kenney asset and art-bible recommendations delivered |
| Turing (`019f81ef-363c-77e0-af50-3d7d58ddc899`) | IWSDK interaction architect | Read-only audit | Complete; shared pointer/ray direct-manipulation architecture and QA matrix delivered |
| Kuhn (`019f822c-2d5c-7241-84ba-fb311137126a`) | UI/accessibility engineer | `index.html`, `src/styles.css` | Complete; minimal full-screen shell with compact utilities and captions |
| Maxwell (`019f822c-2da9-7ba1-8d63-5cc714b24e89`) | Asset/provenance engineer | `scripts/prepare-kaiju-qa-assets.py`, `public/assets/kaiju-qa/**`, `docs/assets/KAIJU_QA_ASSETS.md` | Complete; 23 GLBs validated, compact Kenney lab set expanded, provenance and FLUX prompt documented; reusable source cache preserved under `source-assets/kaiju-qa/` |
| Orchestrator | Scene/integration owner | `src/kaiju-qa/scene.ts`, `src/kaiju-qa/assets.ts`, `src/kaiju-qa/canvas-panel.ts`, `src/index.ts`, shared HTML/CSS/config, prompt/plan/evidence manifests | Complete pending commit, PR update, and clean CI |
| Helmholtz (`019f827d-cf54-7c23-a5e3-87389607eb8f`) | Browser/touch E2E verifier | `tests/e2e/hello-world.spec.ts`, `evidence/kaiju-qa/browser-qa.md` | Complete; invalid-drop and native CDP touch passed, full real-drag campaign authored for final rerun |
| Fermat (`019f827d-d038-7692-be2b-ab3c25f328de`) | XR controller-ray verifier | `evidence/kaiju-qa/xr-qa.md`, `evidence/kaiju-qa/03-vr.webp` | Complete; Quest 3 IWER controller campaign and exit/re-entry passed; physical headset remains a residual gap |
| Darwin (`019f827d-d2db-7742-b092-4833d4b15616`) | Experience/art/audio reviewer | `evidence/kaiju-qa/experience-review.md` | Complete; prior blockers remediated, pinned-SDK nomenclature finding corrected, conditional approve pending clean CI |
| Poincare (`019f82cb-bee4-7730-b9cd-ebde70c03529`) | Learning-choice engineer | `src/kaiju-qa/game-model.ts`, `tests/model/kaiju-qa-model.test.mjs` | Complete; neutral rule choice and 8/8 model tests |
| Averroes (`019f82d5-129f-7450-a361-56536cefb6cd`) | Causal-visual engineer | `src/kaiju-qa/scene.ts`, `src/kaiju-qa/canvas-panel.ts` | Complete; persistent causal routes/results, neutral cartridges, stronger districts and celebration |
| Orchestrator + Locke (`019f82e7-a628-74e1-bdb2-57f78352dc60`) | Accessible-input/mobile implementation and review | `src/index.ts`, `index.html`, `src/styles.css` (orchestrator); read-only review (Locke) | Complete; keyboard and switch controls, semantic evidence, one live region, mobile utility fixes, and inverse narration action label |
