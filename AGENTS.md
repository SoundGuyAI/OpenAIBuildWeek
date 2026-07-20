# Agent instructions for the IWSDK game

This repository is designed for a human-led, expert-agent-assisted hackathon
workflow. Read this file before planning, delegating, or changing code.

## Mission

Build a polished game that runs from one web codebase in desktop and mobile
browsers and in WebXR headsets. Preserve a fast, reviewable iteration loop:
small feature branches, written acceptance criteria, specialist implementation,
browser/XR verification, and durable evidence.

## Source of truth

- Product direction: `docs/design/`
- Architecture and SDK notes: `docs/architecture/`
- Feature plan: `plans/<feature-slug>/PLAN.md`
- Agent ownership: `plans/<feature-slug>/AGENT_ASSIGNMENTS.md`
- Feature evidence: `evidence/<feature-slug>/README.md`
- User prompts and decisions: `docs/conversation/`
- Orchestration loop: `docs/agents/FEATURE_LOOP.md`

If these conflict, pause and record a decision in `docs/design/DECISIONS.md`.

## Non-negotiable orchestration defaults

- Log every user prompt verbatim before implementation or delegation. Follow-up
  prompts, corrections, constraints, and approvals are separate log entries.
- Every player-facing feature uses its own `feature/<slug>` branch and matching
  `plans/<slug>/` and `evidence/<slug>/` folders. Do not begin feature code until
  all three exist.
- Dedicated expert subagents are the default, not an exception. Dispatch every
  bounded specialist task that can improve speed or quality without creating
  conflicting ownership. Record a concrete reason when an applicable role is
  not used.
- The orchestrator owns the branch, prompt log, canonical plan, shared files,
  integration, dependency ordering, urgent blockers, and final acceptance.
- One active writer owns each path. Agent assignments must list disjoint write
  scopes and a concrete deliverable before work starts. Agents may read broadly
  but must not edit outside their scope.
- Browser QA and XR QA are independent verification roles. An implementation
  agent may add narrow tests, but it does not certify its own feature.
- Keep integration and genuinely urgent blocking work with the orchestrator.
  Do not turn the orchestrator into the default implementation agent.

## Required feature workflow

1. Append the exact user request to the active file in `docs/conversation/`.
2. Start from a clean, current `main` and run
   `npm run feature:new -- <feature-slug>`.
3. Confirm the branch, plan folder, evidence folder, assignment manifest, and QA
   report stubs all use the same slug.
4. Convert the request into observable acceptance criteria, non-goals,
   architecture choices, risks, and a desktop/mobile/browser-E2E/XR test matrix.
5. Dispatch discovery specialists in parallel where useful: game design,
   IWSDK/architecture research, and experience quality. Their findings go into
   separate agent-note files; the orchestrator integrates them into `PLAN.md`.
6. Split implementation into the smallest independent vertical slices that
   still produce meaningful results. Give each implementation agent exclusive
   source and test paths.
7. Integrate centrally. The orchestrator resolves cross-cutting edits, shared
   configuration, merge conflicts, and urgent blockers.
8. Run validation in the required order: typecheck, build, then browser E2E.
9. Have the browser QA specialist exercise desktop and mobile behavior, inspect
   console/page/network failures, and save evidence.
10. Have the XR QA specialist use IWSDK IWER/runtime tools for any 3D, input,
    locomotion, grabbing, UI, audio, or session-state change. Record physical
    headset gaps explicitly.
11. Run an independent review against the plan, diff, tests, evidence, IWSDK
    rules, accessibility, performance, and Definition of Done.
12. Fix blocking findings, rerun affected checks, complete the log and evidence,
    then open a PR. Merge to `main` only after CI and review pass.

See `.agents/README.md` for the role roster and
`docs/agents/FEATURE_LOOP.md` for the dispatch protocol.

## Delegation contract

The normal roster for a player-facing feature is:

| Role | Default use | Exclusive output |
| --- | --- | --- |
| Game design expert | Every new mechanic or player-facing behavior | `plans/<slug>/agent-notes/game-design.md` |
| IWSDK/architecture expert | Any unfamiliar SDK, ECS, WebXR, rendering, or deployment behavior | `plans/<slug>/agent-notes/sdk-research.md` |
| Implementation expert(s) | One per independent code slice | Explicit source paths plus owned tests |
| Browser E2E expert | Every player-facing feature | Owned Playwright spec, browser report, desktop/mobile evidence |
| XR QA expert | Every feature touching 3D or XR-relevant state | XR report and VR evidence |
| Experience quality expert | UI, motion, comfort, audio, accessibility, or performance risk | `evidence/<slug>/experience-review.md` |
| Independent reviewer | Every feature before PR | `evidence/<slug>/review.md` |

Multiple implementation agents are encouraged when their write scopes are
disjoint. No agent may be the sole implementer and sole reviewer. If an expert
cannot be dispatched, the orchestrator follows that role card sequentially and
records the limitation in `AGENT_ASSIGNMENTS.md` and the evidence manifest.

## IWSDK rules

- Current pinned SDK: `0.4.2`; upgrade only in a dedicated dependency branch.
- Import Three.js classes from `@iwsdk/core`, not directly from `three`, to avoid
  duplicate Three.js instances.
- Create scene objects through `world.createTransformEntity`; do not use
  `world.scene.add` for gameplay entities.
- Use `Interactable` for pointer/touch/XR ray interaction. Do not hand-roll a
  `Raycaster` for normal interaction.
- Locomotion requires a `LocomotionEnvironment` or physics collision surface.
- Keep physics disabled unless the feature genuinely needs it.
- Allocate vectors, materials, and geometries outside hot `update()` loops.
- Use ECS queries and subscriptions; do not manually maintain entity arrays.
- Dispose entities with GPU resources when removing them permanently.
- Desktop/mobile behavior is part of the product, not a fallback.

## Validation order

Always run checks in this order:

```bash
npm run typecheck
npm run build
npm run test:e2e:run
```

`npm run test:e2e` performs the build first for local convenience.

For XR testing, first check whether the IWSDK runtime is already connected. Do
not start duplicate dev servers. Enter XR, inspect scene/ECS state, exercise the
applicable controllers and hands, test exit/re-entry, and capture evidence.

## Branch and evidence conventions

- Feature branch: `feature/<kebab-case-slug>`
- Fix branch: `fix/<kebab-case-slug>`
- Boilerplate/infrastructure branch: `codex/<slug>` or `chore/<slug>`
- Plan and evidence folders use only the slug, without the branch prefix.
- Screenshots: `01-desktop.webp`, `02-mobile.webp`, `03-vr.webp`, and so on.
- Keep screenshots under 2 MB each when practical.

Subagents do not create additional feature branches or merge feature branches
into one another. The orchestrator owns branch operations. Merge reviewed work
to `main`, then create the next feature branch from the updated `main`.

## Conversation logging

Conversation logs are append-only. The orchestrator is the only writer to the
active log. Store the user's exact prompt, timestamp, branch, outcome summary,
decisions, resulting files, and follow-up questions. Never include secrets,
tokens, private keys, hidden system/developer instructions, chain-of-thought, or
unrelated personal data.

## Completion contract

A feature is not done because the code compiles. It is done when the acceptance
criteria, automated checks, desktop/mobile interaction, relevant XR interaction,
evidence, documentation, accessibility, regression review, and prompt log are
complete. See `docs/DEFINITION_OF_DONE.md`.
