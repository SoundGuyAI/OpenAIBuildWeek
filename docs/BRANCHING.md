# Branching and release workflow

`main` is always the latest reviewed, deployable build. GitHub Pages deploys only
from `main`.

The orchestrator owns all branch creation, switching, syncing, and merge work.
Subagents work inside the assigned feature workspace and do not create nested
branches or merge feature branches into one another.

## Branch names

- `feature/<slug>` — player-facing work
- `fix/<slug>` — defect correction
- `chore/<slug>` — maintenance and tooling
- `codex/<slug>` — initial agent-created infrastructure branches

Use lowercase kebab case. A feature branch starts from `main`, not from another
feature branch.

## Branch/plan/evidence invariant

Every player-facing feature must have all of the following with the same slug
before implementation begins:

| Artifact | Required value |
| --- | --- |
| Branch | `feature/<slug>` |
| Canonical plan | `plans/<slug>/PLAN.md` |
| Agent ownership | `plans/<slug>/AGENT_ASSIGNMENTS.md` |
| Specialist notes | `plans/<slug>/agent-notes/` |
| Evidence manifest | `evidence/<slug>/README.md` |
| QA/review reports | Files under `evidence/<slug>/` |

Fixes and chores also need a matching plan and evidence folder when they change
player behavior, runtime behavior, deployment, or shared architecture. Do not
reuse another feature's plan or evidence folder.

## Feature setup

```bash
# First append the exact prompt to docs/conversation/.
git switch main
git pull --ff-only
npm run feature:new -- magnetic-grab
```

The helper requires a clean worktree, verifies that local `main` is not behind
its configured upstream, rejects existing branches/folders, and creates the
branch plus matching plan, ownership, specialist-note, evidence, QA, and review
files. It intentionally does not fetch, pull, commit, push, or open a PR.

After generation, fill `PLAN.md` and `AGENT_ASSIGNMENTS.md` before dispatching
subagents or changing feature code. The assignment manifest must give every
active agent a disjoint write scope. The orchestrator retains the prompt log,
canonical manifests, shared files, integration, and urgent blockers.

If the helper reports that `main` is behind, run `git pull --ff-only` and retry.
If no upstream is configured, the helper can only validate the local branch;
record that limitation in the plan.

## Merge policy

- Prefer squash merge for a clean hackathon history.
- Require CI and one independent review.
- Require browser desktop/mobile evidence and applicable XR evidence.
- Require the prompt log, plan, ownership manifest, and evidence manifest to be
  current.
- Resolve or explicitly defer every review finding.
- Delete the branch after merge.
- Verify the Pages deployment after changes that affect routing, assets, startup,
  browser permissions, or XR entry.
