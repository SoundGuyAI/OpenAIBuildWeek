# Kaiju QA

**Test small. Help big.**

Kaiju QA is a three-minute educational game about verifying AI-assisted
changes. A helpful baby kaiju passes the happy path, fails a new edge case, and
then exposes a regression when the first safety rule is too broad. The player
uses persistent evidence to choose a targeted guardrail, reruns the complete
suite, and releases only after every current test passes.

The project targets the OpenAI Build Week **Education** category and is built
with TypeScript, Vite, and Meta's Immersive Web SDK from one browser codebase.

## 30-second quick start

Requirements: Node.js 24 (see `.nvmrc`) and a current Chromium-based browser.

```bash
npm ci
npm run build
npm run preview
```

Open <http://127.0.0.1:4173/>. This production-preview path does not start the
IWSDK development server.

## Judge/player path

1. **Run baseline** to record the stalled-car rescue and clear ambulance lane.
2. **Add the fragile tower** to cover the missing city risk.
3. **Run the tower test** and inspect where the full-speed route failed.
4. **Test the broad guardrail** and catch the ambulance regression.
5. **Choose a guardrail** and rerun all three scenarios.
6. **Release** only after the latest complete suite reports 3/3 passes.

Wrong choices are useful experiments, not game-over states. `REVISE GUARDRAIL`
returns directly to diagnosis while preserving prior evidence.

## What the player practices

- A successful example is partial evidence, not release confidence.
- Add the missing case before changing behavior.
- A fix can break an earlier pass; that is a regression.
- Match the change to the observed condition instead of applying a global rule.
- Rerun old and new tests under the current change before release.
- Treat release as an evidence gate, not a celebration button.

The game demonstrates introductory application of these ideas; it does not
claim professional QA mastery or measured learning gains.

## Controls and access

- **Desktop:** mouse or keyboard (`Tab`, arrow keys where applicable,
  `Enter`/`Space`).
- **Mobile:** large touch controls expose the same decisions and evidence.
- **Reduced motion:** honors the system preference and an in-product motion
  control; causality remains visible through authored poses and labels.
- **WebXR:** the existing IWSDK immersive-VR entry and recovery path is
  preserved. Runtime/IWER/headset interaction is not certified in this branch
  because the implementation request explicitly prioritized a finished PR over
  starting IWSDK on this machine.

Essential status uses text, icon/shape, border/pattern, and color. The critical
browser path requires no account, backend, live model call, or downloaded game
asset after the page has loaded.

## Technical design

- A pure TypeScript state model owns scenario outcomes, stale evidence,
  attempt history, release eligibility, reset, and tutorial progression.
- IWSDK renders one fixed low-poly tabletop built from shared primitive
  geometry and authored poses—no physics, pathfinding, or destruction sim.
- Semantic DOM controls are the accessible desktop/mobile source of intent.
- Rendering is a projection of deterministic state; animation cannot decide
  whether a scenario passed.
- Release is a separate transition and is rejected while any required result is
  failed, untested, or stale.

Feature planning, specialist notes, and acceptance criteria live in
[`plans/kaiju-qa`](plans/kaiju-qa). Verification records live in
[`evidence/kaiju-qa`](evidence/kaiju-qa).

## How Codex and GPT-5.6 were used

Codex converted the request into an isolated worktree/feature branch, observable
acceptance criteria, disjoint implementation slices, and a validation/evidence
plan. Dedicated agents contributed game design, learning design, competition
strategy, narrative/comedy, art direction, IWSDK architecture, implementation,
browser QA, experience review, and independent review.

Human product constraints remained explicit:

- choose Kaiju QA from the concept worktree;
- make the tutorial unusually easy to follow;
- preserve a meaningful player decision after guided instruction;
- avoid starting IWSDK/IWER on this machine without approval;
- prioritize a mergeable finished PR over local XR certification;
- use licensed or generated art only when it materially improves the core.

The implementation intentionally narrowed several tempting suggestions: no
live model call, no physics destruction, no large asset pack, no speed score,
and no unverified XR marketing claim.

## Validation

Run checks in repository order:

```bash
npm run typecheck
npm run build
npm run test:e2e:run
```

The browser suite exercises desktop and mobile Chromium against the production
build and records evidence under `test-results/evidence/`.

## Asset and license policy

The protected game scene is original code-native geometry with no external
runtime art, music, fonts, or generated images. The Azure FLUX concept image in
the separate concept worktree remains planning material and is not presented as
gameplay.

Optional future polish may use verified CC0 Quaternius assets or Azure FLUX only
after preserving the exact source/license or generation provenance. Repository
licensing for competition submission remains a project-owner decision and must
be confirmed before the final Devpost form is submitted.

## Known limitations

- IWER and physical-headset interaction, comfort, re-entry, and performance are
  not runtime-tested in this branch.
- A final public gameplay URL, YouTube demo, Codex `/feedback` session ID, and
  repository license still belong to the submission/release checklist.
- Browser evidence describes the exact devices and commands actually tested;
  the project does not claim universal device support.
