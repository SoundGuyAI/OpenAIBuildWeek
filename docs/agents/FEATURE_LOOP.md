# Feature orchestration loop

This is the reusable loop for turning a conversational feature request into a
reviewed, tested branch through aggressive expert delegation. The orchestrator
owns integration and urgent blockers; specialists own bounded, disjoint outputs.

## 0. Intake and log

Before implementation or delegation, append the user's prompt verbatim to the
active file in `docs/conversation/`. Log follow-ups, corrections, constraints,
and approvals as separate entries. Record the timestamp, current branch, links
to supplied references, and secrets that were intentionally redacted.

The orchestrator is the only writer to the active conversation log. Subagents
return summaries to the orchestrator instead of editing the log concurrently.

Summarize the desired player outcome in one sentence. List assumptions. Ask only
questions whose answers would materially change scope or architecture; place
the rest in `docs/design/OPEN_QUESTIONS.md` and proceed with a reversible default.

## 1. Create the feature workspace

From a clean, current `main`:

```bash
npm run feature:new -- <feature-slug>
```

This creates the following matching workspace:

- `feature/<feature-slug>`
- `plans/<feature-slug>/PLAN.md`
- `plans/<feature-slug>/AGENT_ASSIGNMENTS.md`
- `plans/<feature-slug>/agent-notes/`
- `evidence/<feature-slug>/README.md`
- Separate browser, XR, experience, and review report stubs

Treat branch + plan folder + evidence folder as one invariant. If any slug does
not match, stop before changing feature code. Only the orchestrator creates or
switches branches.

## 2. Plan before editing

The orchestrator fills the plan with:

- Player story and non-goals
- Observable acceptance criteria
- Architecture/API choices and sources
- Work breakdown with file ownership and dependency order
- Risks and rollback strategy
- Desktop, mobile, browser E2E, and XR test cases
- Evidence required for review

Fill `AGENT_ASSIGNMENTS.md` before dispatch. Every row needs an agent ID, role,
exclusive write scope, deliverable, dependency, finish condition, and status.
The orchestrator owns `PLAN.md` and integrates specialist notes into it.

If the feature is too large for one PR, split it into independently playable
vertical slices. Do not hide scope inside vague tasks.

## 3. Dispatch expert subagents by default

For every bounded task, prefer a dedicated expert. Skip an applicable role only
when `AGENT_ASSIGNMENTS.md` records a concrete reason. The normal roster is:

| Phase | Expert role | Exclusive default output |
| --- | --- | --- |
| Discovery | Game design | `plans/<slug>/agent-notes/game-design.md` |
| Discovery | IWSDK/architecture | `plans/<slug>/agent-notes/sdk-research.md` |
| Build | Implementation | Assigned source files and owned narrow tests |
| Verification | Browser E2E | Owned Playwright spec, `browser-qa.md`, desktop/mobile artifacts |
| Verification | XR QA | `xr-qa.md` and VR artifacts |
| Verification | Experience quality | `experience-review.md` |
| Quality gate | Independent reviewer | `review.md` |

Use multiple implementation experts whenever the feature has independent code
slices. Do not assign one agent the whole feature. Do not let an implementer act
as the only reviewer or QA authority for its own work.

### Write-scope protocol

- One active writer owns each path. Prefer file-level ownership.
- No two active agents may edit the same file, including manifests and shared
  configuration.
- Specialists may read the full repository but write only their assigned paths.
- A needed out-of-scope change is a request to the orchestrator, not an edit.
- The orchestrator exclusively owns the prompt log, `PLAN.md`,
  `AGENT_ASSIGNMENTS.md`, evidence `README.md`, branch operations, shared config,
  integration files, and urgent blockers.
- Update assignments before transferring ownership from one agent to another.

### Parallel execution waves

1. Run game-design and SDK research specialists in parallel when both apply.
2. Integrate their findings into the plan and lock implementation scopes.
3. Run disjoint implementation slices in parallel.
4. Integrate centrally and complete deterministic checks.
5. Run browser E2E and XR QA independently and in parallel when runtime state
   permits; add experience-quality review when relevant.
6. Run the independent reviewer only after the integrated diff and evidence are
   ready.

If a subagent is unavailable, the orchestrator executes that role card
sequentially and records the limitation. Never duplicate the same task across
agents “for safety.”

## 4. Implement and integrate

Agents report changed paths, exact checks, observed results, assumptions, and
risks. The orchestrator verifies scope compliance, reviews each patch, applies
shared-file changes, resolves integration gaps, and keeps the plan current.
Record decisions that change product or architecture in
`docs/design/DECISIONS.md`.

For IWSDK changes, prefer live scene/ECS inspection over guessing. Warm the local
reference corpus with `npm run reference:warmup` when semantic SDK lookup is
needed and the cache is not ready.

## 5. Verification ladder

Run the cheapest deterministic checks first:

```bash
npm run typecheck
npm run build
npm run test:e2e:run
```

Then have independent QA specialists perform interaction testing:

1. Desktop Chromium at a normal laptop viewport: load, focus, keyboard, pointer,
   resize, and the full affected player loop.
2. Mobile Chromium profile: touch controls, orientation/resize, readable UI, and
   the full affected player loop.
3. WebXR via IWER/runtime: enter, verify scale/origin, exercise both controllers
   or hands, move/interact, inspect scene/ECS state, exit, and re-enter.
4. Physical headset for device-only behavior, when available.

Review browser console errors, page errors, and failed requests. A screenshot is
evidence of state, not proof that an interaction works; pair it with an automated
assertion or a recorded manual procedure and result.

## 6. Evidence

Place artifacts under `evidence/<feature-slug>/` and update the manifest with:

- Commit SHA and branch
- Environment/browser/device
- Command or manual test performed
- Expected and observed result
- Screenshot/video filename
- Known limitations

Specialists write separate `browser-qa.md`, `xr-qa.md`,
`experience-review.md`, and `review.md` files. Only the orchestrator updates the
evidence `README.md`, preventing concurrent manifest edits.

Use numbered filenames so reviewers can follow the test story.

## 7. Independent review and PR

The reviewer checks the actual diff, prompt, plan, ownership manifest, tests, and
evidence. The reviewer writes findings but does not fix them. The orchestrator
assigns fixes to the appropriate implementation expert, integrates them, and
reruns affected checks. The PR template must be fully completed. CI must pass
before merging to `main`.

After merge, GitHub Pages deploys the latest `main`. Verify the deployed page and
record deployment-only issues as a new fix branch.
