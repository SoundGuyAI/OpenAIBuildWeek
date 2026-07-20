# Feature plan: kaiju-qa

Branch: `feature/kaiju-qa`
Created: 2026-07-20T21:49:25.986Z
Status: ready for draft PR; browser/XR runtime gates deferred by owner constraint

## Player outcome

In a playful three-minute tabletop simulation, a first-time learner follows a
step-by-step tutorial, catches a baby kaiju's edge-case failure and regression,
then chooses the smallest safe guardrail and releases a verified city guardian.

## Source prompt

- Exact request and follow-up: `docs/conversation/2026-07-20-kaiju-qa.md`
- Read-only concept reference:
  `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/PROPOSALS.md`
- Competition: OpenAI Build Week, Education category.

## Learning spine

1. **Goal** — help stranded people without damaging the city or blocking rescue.
2. **Act** — run the current behavior or authorize one bounded guardrail.
3. **Observe** — inspect the route, scenario result, and persistent test evidence.
4. **Adjust** — add an edge case or select a more targeted guardrail.
5. **Gate** — run the full regression suite, then release only when every test passes.

The tutorial demonstrates the controls and the first over-broad change. The
player-controlled game loop begins at diagnosis: compare evidence, choose among
guardrails, rerun the suite, and decide whether the build is safe to release.

## Acceptance criteria

- [ ] A cold player sees the goal and first highlighted action immediately and
  can advance the tutorial without presenter narration.
- [ ] Tutorial steps are explicit, single-action, dismissible, and resumable;
  each step highlights one relevant control and explains why the action matters.
- [ ] The authored baseline shows the kaiju safely moving a stalled car while
  the ambulance lane stays clear, records two passes plus one untested tower,
  and remains visibly partial rather than declaring the build ready.
- [ ] Adding the fragile-tower scenario and rerunning produces an obvious,
  non-punitive failure with persistent evidence.
- [ ] The broad `FREEZE NEAR BUILDINGS` guardrail protects the tower but blocks
  an ambulance, making the regression legible in motion, shape, text, and color.
- [ ] The player then chooses among three neutral guardrail options. `FREEZE
  NEAR BUILDINGS` regresses the ambulance, `SLOW WHILE CARRYING` regresses the
  timed rescue, and only `SLOW IN STRIPED ZONES` preserves both earlier passes.
- [ ] Invalid or incomplete choices explain what evidence is missing and allow
  one-action retry without reloading or replaying the whole tutorial.
- [ ] A passing suite unlocks a separate Release action and a celebratory hero
  transformation; release cannot occur while any scenario is failing or untested.
- [ ] Desktop mouse/keyboard and mobile touch expose the same rules, decisions,
  evidence, retry, reset, and result. Keyboard focus and visible focus states work.
- [ ] Essential state is never color-only; every pass/fail/untested state also
  uses icon, label, shape, and/or motion.
- [ ] Reduced-motion users receive authored state transitions without camera
  motion, shaking, or rapid animation.
- [ ] The critical path is deterministic, local, static-host compatible, and
  requires no account, backend, model call, downloaded asset, or physics.
- [ ] The existing WebXR entry/recovery path remains available. Runtime/IWER and
  physical-headset verification are explicitly deferred unless the user approves it.

## Non-goals

- Live GPT/model inference, free-form prompting, procedural city generation, or networking.
- Destruction physics, navmesh/pathfinding, continuous locomotion, or room-scale play.
- A large external asset pack; the protected core uses original primitive geometry.
- Multiple levels, progression economy, leaderboard, combat, or fail-state humiliation.
- Starting the IWSDK dev runtime, IWER, or a headset session on this machine without approval.

## Architecture and API choices

- Preserve IWSDK `0.4.2`, Vite, and the existing robust XR support helper.
- Keep gameplay rules in a pure TypeScript state machine so the most important
  educational transitions are deterministic and testable independently of rendering.
- Build the miniature city and kaiju from shared primitive geometries/materials
  through `world.createTransformEntity`; use authored interpolation/state poses,
  not physics.
- Add new feature modules under `src/kaiju-qa/`; keep `src/index.ts`,
  `index.html`, and `src/styles.css` as the only shared integration surfaces.
- Use semantic DOM controls as the reliable desktop/mobile interaction layer,
  with large targets, keyboard support, live regions, and responsive layout.
- Preserve visible attempt history in the scene and HUD. Use short labels and a
  five-step loop rail so spectators can understand the lesson at thumbnail size.
- Use no external art for the merge-safe core. If a later polish pass imports
  CC0 or generated assets, it must add source/license/provenance records first.

## Work breakdown

| Task | Owner/agent | Write scope | Depends on | Done when |
| --- | --- | --- | --- | --- |
| Game/tutorial design | discovery-game-design | `plans/kaiju-qa/agent-notes/game-design.md` | Logged prompt | Beat sheet, decisions, recovery, and acceptance advice are concrete |
| Competition/market strategy | discovery-competition | `plans/kaiju-qa/agent-notes/competition-strategy.md` | Logged prompt | Judging fit, differentiation, demo hooks, and claim guardrails are documented |
| Learning design | discovery-learning | `plans/kaiju-qa/agent-notes/learning-design.md` | Logged prompt | Tutorial and debrief teach transfer, not vocabulary recall |
| Narrative/comedy | discovery-writing | `plans/kaiju-qa/agent-notes/narrative-comedy.md` | Logged prompt | Short final copy is funny, kind, and instructional |
| Art direction | discovery-art | `plans/kaiju-qa/agent-notes/art-direction.md` | Logged prompt | Code-native scene language, palette, motion, and asset policy are defined |
| IWSDK architecture | discovery-sdk | `plans/kaiju-qa/agent-notes/sdk-research.md` | Logged prompt | Safe APIs, integration seams, and deferred XR risks are documented |
| Pure game model | implementation-model | `src/kaiju-qa/game-model.ts` | Integrated discovery | State transitions and guardrail outcomes implement the learning spine |
| Procedural 3D scene | implementation-scene | `src/kaiju-qa/scene.ts` | Integrated discovery | Tabletop, kaiju, scenarios, evidence traces, and authored poses are exposed via a small API |
| UI structure and visual system | implementation-ui | `index.html`, `src/styles.css` | Integrated discovery | Responsive tutorial/game HUD and accessible controls are complete |
| App integration | orchestrator | `src/index.ts`, shared config, plan/evidence manifests | Model, scene, UI | Full loop runs and existing XR support is preserved |
| Browser automation | browser-test-author | `tests/e2e/kaiju-qa.spec.ts` | Integrated app | Happy path, wrong-choice recovery, release gate, keyboard, and mobile layout are asserted |
| Independent browser QA | browser-qa | `evidence/kaiju-qa/browser-qa.md`, screenshots | Build + tests | Desktop/mobile path and diagnostics are independently reviewed |
| Experience review | experience-qa | `evidence/kaiju-qa/experience-review.md` | Integrated build | Accessibility, tutorial clarity, motion, performance, and spectator legibility are ranked |
| XR review | xr-qa | `evidence/kaiju-qa/xr-qa.md` | Integrated build | Static review completed and runtime gap recorded without starting IWSDK |
| Independent review | final-reviewer | `evidence/kaiju-qa/review.md` | Checks + evidence | Diff, plan, ownership, risks, and merge safety are reviewed |

## Test matrix

| Surface | Scenario | Expected result | Evidence |
| --- | --- | --- | --- |
| Desktop Chromium | Complete tutorial, induce regression, choose targeted guardrail, release | Full deterministic arc passes with no runtime/critical request errors | Playwright + `01-desktop.webp` |
| Desktop keyboard | Tab/Enter/Space through every required control, use retry/reset | Visible focus and same semantic loop without pointer | Playwright assertions |
| Mobile Chromium | Complete the same loop at touch viewport, rotate/resize once | Large controls, readable evidence, no horizontal overflow | Playwright + `02-mobile.webp` |
| Reduced motion | Emulate `prefers-reduced-motion: reduce` and complete a run | No shakes/rapid motion; outcomes remain clear | Playwright assertion |
| VR/IWER | Static API/interaction review only in this PR | Existing entry path preserved; runtime validation marked deferred by user constraint | `xr-qa.md` |

## Risks and rollback

- **IWSDK runtime is intentionally not started.** Mitigate with pure model tests,
  TypeScript/build checks, browser automation where feasible, and a clear XR gap.
- **Browser E2E may still initialize IWSDK indirectly.** If it materially lags the
  machine, stop before runtime tests, preserve build evidence, push the PR, and
  record the deferred command rather than violating the user's priority.
- **Tutorial can become a click-through lecture.** Keep each step under two short
  sentences, attach it to an observable scene change, and give the player the
  final diagnosis/guardrail choice.
- **3D spectacle can obscure the lesson.** Protect the evidence board, route
  traces, scenario labels, and release gate before particles or decorative props.
- **Shared-file conflicts.** New logic and scene code live in feature-specific
  modules; shared edits are limited to the app entry, HTML, CSS, and one new spec.
- **Rollback/cut ladder:** remove particles and decorative city props; simplify
  animation to pose changes; reduce wrong guardrails from three to two; never cut
  baseline, edge case, regression, targeted fix, full-suite gate, tutorial, or retry.

## Review checklist

- [x] Prompt and assumptions logged
- [x] Agent scopes remained disjoint or were explicitly reassigned
- [x] Typecheck
- [x] Deterministic model tests (6/6)
- [x] Production build
- [ ] Browser E2E — authored and typechecked; execution deferred to CI/stronger machine
- [x] Desktop/mobile runtime evidence limitation recorded explicitly
- [x] XR static review and runtime limitation recorded
- [x] Evidence manifest complete
- [x] Independent review complete; no code blocker remains
- [ ] Draft PR opened from `feature/kaiju-qa` to `main`
