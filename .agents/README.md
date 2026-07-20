# Expert subagent role library

The user has explicitly requested dedicated expert subagents whenever practical.
For every nontrivial feature, the orchestrator should maximize useful specialist
delegation while retaining branch control, integration, shared files, and urgent
blockers.

## Default dispatch policy

Do not ask whether a specialist is strictly necessary. Ask whether the work can
be bounded, independently verified, and given a disjoint write scope. If yes,
delegate it. Record a specific reason in
`plans/<slug>/AGENT_ASSIGNMENTS.md` whenever an applicable role is skipped.

The default roster is:

1. Game design expert for player intent and observable acceptance criteria.
2. IWSDK/architecture expert for unfamiliar or consequential SDK choices.
3. One implementation expert per independent source-code slice.
4. Browser E2E expert for desktop and mobile interaction.
5. XR QA expert for 3D, input, locomotion, interaction, UI, audio, or session
   behavior.
6. Experience quality expert when accessibility, comfort, motion, audio, or
   performance deserves focused review.
7. Independent reviewer after implementation and evidence are complete.

Small features may use fewer agents only when the assignment manifest explains
why the omitted expertise would not improve the outcome. An unavailable agent
does not erase the role: the orchestrator executes its checklist sequentially
and records the limitation.

## Assignment contract

Before dispatch, every assignment must state:

- Agent ID and expert role
- Inputs and acceptance criteria
- Exclusive file or directory write scope
- Read-only context
- Concrete deliverable and completion signal
- Dependencies and whether it may run in parallel
- Commands or manual checks the agent must report

One active writer owns each path. Prefer file-level ownership. Directory-level
ownership is allowed only when two agents cannot create or edit the same file.
Agents may read broadly, but an out-of-scope edit requires orchestrator approval
and an updated assignment before the edit occurs.

The orchestrator exclusively owns the active conversation log, canonical
`PLAN.md`, `AGENT_ASSIGNMENTS.md`, evidence manifest, branch operations, shared
configuration, integration, and urgent blockers. Specialists write separate
notes or reports so parallel work cannot collide with those shared files.

## Recommended execution waves

1. Intake: orchestrator logs the prompt and creates branch/plan/evidence.
2. Discovery: game design, SDK research, and relevant experience specialists run
   in parallel and write separate notes.
3. Build: implementation experts work in parallel on disjoint code and tests.
4. Integration: orchestrator combines slices and resolves cross-cutting issues.
5. Verification: browser E2E and XR QA run independently, in parallel when the
   runtime permits it, and write separate evidence reports.
6. Review: an independent reviewer checks the actual diff, plan, tests, and
   evidence. The orchestrator owns fixes and re-verification.

Do not assign one agent to “build and test the whole feature.” Do not duplicate
the same task across agents “for safety.” Parallelism comes from decomposing the
feature into distinct expert outcomes.

## Role cards

- `roles/orchestrator.md`
- `roles/game-designer.md`
- `roles/sdk-researcher.md`
- `roles/implementation.md`
- `roles/browser-e2e.md`
- `roles/xr-qa.md`
- `roles/experience-quality.md`
- `roles/reviewer.md`
