# Agent assignments: devpost-kaiju-qa-video

Branch: `codex/devpost-kaiju-qa-video`  
Status: final review and PR preparation

## Orchestrator-only paths

- `docs/conversation/2026-07-20-devpost-kaiju-qa-video.md`
- `plans/devpost-kaiju-qa-video/PLAN.md`
- `plans/devpost-kaiju-qa-video/AGENT_ASSIGNMENTS.md`
- `evidence/devpost-kaiju-qa-video/README.md`
- Shared HyperFrames files under `videos/kaiju-qa-devpost/`
- Branch/worktree operations, integration, rendering, and urgent blockers

## Discovery and review assignments

| Agent ID | Role | Exclusive write scope | Deliverable | Status |
| --- | --- | --- | --- | --- |
| `019f8176-bea3-7eb3-9070-0b8b66b2b568` | Devpost market researcher | `plans/devpost-kaiju-qa-video/agent-notes/market-research.md` | Current official constraints, judging strategy, and video implications | Complete |
| `019f8176-c1cb-7071-ade9-8fed7c64153c` | Film director | `plans/devpost-kaiju-qa-video/agent-notes/film-direction.md` | Shot grammar, pacing, transitions, and 16:9 staging | Complete |
| `019f8176-c613-73f0-a986-27eb87ff3906` | Narrative/creative director | `plans/devpost-kaiju-qa-video/agent-notes/narrative.md` | Judge-retellable story spine and emotional arc | Complete |
| `019f8176-ca78-7470-85af-afcff42d1a1b` | Comedy writer | `plans/devpost-kaiju-qa-video/agent-notes/comedy.md` | Warm, precise gags that never obscure evidence | Complete |
| `019f8176-cf2c-74f3-b095-b1dafc80cff7` | Art director and asset/licensing researcher | `plans/devpost-kaiju-qa-video/agent-notes/art-direction.md` | Visual system, asset shortlist, licensing guardrails, Flux prompts | Complete |
| `019f8176-d808-73f1-a5df-18f3f994855f` | Marketing/copy strategist | `plans/devpost-kaiju-qa-video/agent-notes/marketing.md` | Hook, value proposition, CTA, judge-criteria coverage | Complete |
| `019f8182-103b-7353-b544-ee5d5ac67157` | Voice and sound director | `plans/devpost-kaiju-qa-video/agent-notes/audio-direction.md` | Voice profile, read pacing, music/SFX plan, mix targets | Complete |
| `019f8182-1671-77e0-95ef-8ac07830ee46` | HyperFrames production specialist | `plans/devpost-kaiju-qa-video/agent-notes/hyperframes-production.md` | Workflow-specific technical plan and Windows risks | Complete |
| `019f81f8-5c26-7753-8dad-323af73260c8` (Archimedes) | Competition reviewer | `evidence/devpost-kaiju-qa-video/competition-review.md` | Rules/judging/truthfulness review after draft | Final rendered-master pass |
| `019f81f8-5486-7d23-92b1-b2263d906cd1` (Dewey) | Visual QA reviewer | `evidence/devpost-kaiju-qa-video/visual-review.md` | Contact-sheet and render review | Final rendered-master pass |
| `019f81f8-5736-7a02-b5b0-49d38ad04411` (Feynman) | Audio QA reviewer | `evidence/devpost-kaiju-qa-video/audio-review.md` | Voice/caption timing and final mix review | Final technical pass |
| `019f834f-118e-73f2-8eaf-f66477417f2c` (Confucius) | Independent reviewer | `evidence/devpost-kaiju-qa-video/review.md` | Full diff, evidence, licensing, and delivery review | Complete; master approved, publication tasks identified |

## Frame worker assignments

Each worker owns exactly one file and may not edit shared project files.

| Agent ID | Frame | Exclusive write scope | Deliverable | Status |
| --- | --- | --- | --- | --- |
| `019f81a2-e830-7833-ba94-5b7d9faadc66` (Aristotle) | 01 - hook | `videos/kaiju-qa-devpost/compositions/frames/01-fast-help.html` | Animated concept/title reveal | Complete |
| `019f81c2-45a4-73e1-9ce7-e619c3dc8243` (Tesla; retry after `019f81a2-ea69-7fe0-8780-e50347b541a2` timed out) | 02 - happy path | `videos/kaiju-qa-devpost/compositions/frames/02-happy-path.html` | Animated partial-pass test | Complete |
| `019f81a2-ecf5-7c43-8da9-029cda01a906` (Noether) | 03 - edge case | `videos/kaiju-qa-devpost/compositions/frames/03-edge-case.html` | Animated tower failure comparison | Complete |
| `019f81a2-eff0-7a50-b55e-210292760a49` (Turing) | 04 - broad fix | `videos/kaiju-qa-devpost/compositions/frames/04-broad-fix.html` | Animated false-resolution test | Complete |
| `019f81a2-f2e4-7c81-a4c1-6519a16ac8a7` (Hume) | 05 - regression | `videos/kaiju-qa-devpost/compositions/frames/05-regression.html` | Animated ambulance regression thesis | Complete |
| `019f81c2-470f-7443-86e5-a6ef58639fea` (Poincare; retry after `019f81a2-f5c9-7bb0-9456-4859d6491b79` timed out) | 06 - targeted fix | `videos/kaiju-qa-devpost/compositions/frames/06-targeted-fix.html` | Animated bounded correction | Complete |
| `019f81c2-4925-7db2-b124-7cf0fa5ee296` (Meitner; retry after `019f81aa-f6ed-7273-be14-84d5b7687a46` timed out) | 07 - earned release | `videos/kaiju-qa-devpost/compositions/frames/07-release-earned.html` | Animated three-pass release gate | Complete |
| Orchestrator inline fallback after `019f81ac-ab87-78a0-94c4-c382081d1ff2` and `019f81c2-4be8-7a60-83bf-0866a36e1e37` timed out | 08 - close | `videos/kaiju-qa-devpost/compositions/frames/08-prove-it.html` | Animated process proof and final lockup | Complete |

## Explicitly skipped repository roles

- IWSDK architecture/runtime specialist: no SDK or game code changes are in
  scope, and the user explicitly prohibited launching IWSDK on this machine.
- XR QA: no runtime/3D/XR state changes are made; record this as not applicable
  in evidence rather than launching IWER or a headset workflow.
- Game browser E2E: replaced by HyperFrames composition/render QA because this
  branch changes only video artifacts. Existing remote CI evidence from the
  game branch is reused, and the moving demo is recorded by a workflow-dispatch
  runner rather than by starting IWSDK locally.

## Scope rules

- One active writer per path; agents read broadly but write only their assigned file.
- Agents do not create branches, commit, push, or edit the prompt log.
- The concept worktree is read-only.
- Implementation/frame workers and reviewers are different agents.
