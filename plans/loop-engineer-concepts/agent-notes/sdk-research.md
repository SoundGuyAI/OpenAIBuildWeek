# IWSDK 0.4.2 feasibility research: Loop Engineer concept families

Logical assignment: `DISC-SDK-01`

Role: IWSDK / architecture expert

Research snapshot: **2026-07-20**

Scope: design guidance only; no gameplay implementation

## Executive conclusion

All five provisional concept families can produce a complete 2-3 minute judged
demo in **four focused implementation hours**, but only if they share a strict
technical box:

- one compact, mostly stationary diorama or workbench;
- one primary point/select or grab/place verb plus a prominent **Run Test**
  control;
- a deterministic Goal -> Act -> Observe -> Adjust -> exit state machine;
- no backend, live model call, procedural content dependency, or required
  network request after initial load;
- no dynamic physics and no required locomotion;
- controller ray/select as the XR release baseline, with hand tracking and
  direct near-grab treated as optional polish;
- primitives or one pre-optimized local GLB kit, not an asset-integration
  project; and
- the final 40 minutes reserved for typecheck, build, desktop/touch checks,
  IWER XR checks, console inspection, and fixes.

The safest implementation order is **route rehearsal / controlled simulation /
module assembly**, followed by **optical alignment**, then **forensic evidence
comparison**. The last family is the most distinctive spatially but has the
highest alpha-sorting, state-history, and explanation risk.

| Provisional family | Example narrative territory | Four-hour floor | Feasibility | Main technical risk |
| --- | --- | --- | --- | --- |
| Align and trace | Stormglass | Rotate or place two optics, run two deterministic pulses, compare one prior trace, commit | Green/amber | Quantized manipulation must feel identical with mouse, touch, and XR ray |
| Control variables and simulate | The Tomorrow Garden | Place three care tokens, run two short seasons, compare one ghost result, verify stability | Green | Growth and comparison must use staged transforms, not simulation scope |
| Assemble a requirement pipeline | Galactic Test Kitchen | Fill three slots from five modules, print two samples, satisfy visible requirements, release | Green | Dense labels and snap behavior can consume the polish budget |
| Route and rehearse a release | Sunrise Express | Toggle three switches, run a ghost train through a fixed graph, inspect first failure, dispatch | Green | Familiar node-routing shape needs differentiated evidence and presentation |
| Compare evidence and revise an assumption | The Museum of Almosts | Swap one of three parts, preserve two attempt ghosts, compare evidence, verify and stamp | Amber | Transparent clones, attempt history, and causal readability |

These are technical families, not final game designs. They align with the five
parallel narrative territories available at research time; the integrator can
rename or re-theme them without changing the architecture contracts below.

## Baseline and source-of-truth findings

### What the repository already gives an implementation team

- `package.json` and `package-lock.json` pin `@iwsdk/core`, `@iwsdk/cli`,
  `@iwsdk/reference`, and `@iwsdk/vite-plugin-dev` to **0.4.2**, with
  `three` aliased to `super-three@0.181.0`.
- The current `src/index.ts` already proves the essential shell: `World.create`,
  an immersive-VR offer, browser locomotion bindings, a static
  `LocomotionEnvironment`, `Interactable`, `DistanceGrabbable`, a custom ECS
  component/system, reduced-motion handling, and browser/XR entry and exit UI.
- `src/xr-support.ts` supplies explicit support and launch failure states around
  an IWSDK 0.4.2 limitation: `World.launchXR()` itself returns `void`.
- Vite already provides Quest 3 IWER emulation during development, relative
  production paths, and a static `dist/` output suitable for repository-subpath
  hosting.
- Physics is currently disabled. IWSDK 0.4.2 code-splits Havok when physics is
  false, so keeping it disabled avoids both implementation risk and roughly
  2 MB of physics WASM on first load.

As of the research date, npm reports `@iwsdk/core` **0.4.2** as the latest
published version. The exact npm tarball confirms these usable public surfaces:

- canvas mouse/touch pointer forwarding through `input.canvasPointerEvents`;
- XR ray, grab, and poke input;
- `Interactable` / `RayInteractable`, transient `Hovered` and `Pressed` tags,
  and `Grabbed`;
- `DistanceGrabbable`, `OneHandGrabbable`, and `TwoHandsGrabbable`;
- action-backed locomotion with optional browser bindings;
- `AssetManifest` plus cached GLTF, texture, HDR, and audio loading;
- ECS queries, subscriptions, and `entity.dispose()`; and
- visibility/session state and camera restoration after XR exit.

### Version-drift caution

For implementation, use this priority when sources disagree:

1. the repository lockfile and the **published npm 0.4.2 tarball**;
2. checked-in project architecture rules;
3. official IWSDK documentation at a pinned commit; then
4. current IWSDK `main` source.

The official repository currently labels its package `0.4.2` while containing
post-publish `GrabSystem.forceRelease()` and `getHolderHand()` methods that are
absent from the published npm 0.4.2 declaration file inspected for this note.
Do not plan the four-hour build around those methods. Detect grab state through
the public `Grabbed` tag. Disable or queue Reset/Commit while a piece is held,
then restore transforms after release; if immediate cancellation is truly
required, destroy and recreate the small piece entity rather than deep-importing
IWSDK's private handle implementation.

The npm package marks `Interactable` as a deprecated alias of
`RayInteractable`, while this repository explicitly standardizes on
`Interactable`. Keep the repository convention for the selected concept; any
rename belongs in a deliberate SDK migration, not the game sprint.

## Cross-surface input contract

The release contract should fit **pointer direction plus one primary action**.
Any concept that requires a second simultaneous pointer, precision throwing,
freehand drawing, fast reaction time, or continuous locomotion fails the
four-hour gate.

| Player intent | Desktop | Touch | XR controller baseline | IWSDK path |
| --- | --- | --- | --- | --- |
| Aim / inspect | Mouse pointer; hover is optional feedback | One-finger point/tap; no hover requirement | Right or left controller ray | `Interactable`; react to `Hovered` only as enhancement |
| Activate / choose | Primary click | Tap | Trigger/select on ray | React to `Pressed` query qualification or Object3D `pointerdown`; game logic must not inspect device type |
| Manipulate | Hold and drag, or click source then click destination | One-finger drag, with click-to-place fallback | `DistanceGrabbable` through controller ray | Add `Interactable` plus `DistanceGrabbable`; use `Grabbed` for held/released state |
| Run test / commit / reset | Click a large world-space control; keyboard shortcut optional | Tap the same control | Ray-select the same control | Dedicated interactable entities; do not make DOM-only controls essential in XR |
| Reframe view | Fixed camera; optional reset button | Fixed camera; no drag-to-look conflict | Natural head movement; table remains in front | Move/rotate the diorama instead of requiring player locomotion |

Additional rules:

- Keep every required action one-handed. Two-hand scaling, near-grab, poke, and
  hand tracking may be stretch feedback only.
- If direct one/two-hand grab becomes required, configure
  `grabbing: { useHandPinchForGrab: true }` for hand tracking and test it on a
  physical headset. The default does not map hand pinch to squeeze for those
  grab types.
- Prefer `DistanceGrabbable` for release parity. Use discrete sockets and
  quantize on release; do not expect unconstrained 6DoF placement to be equally
  precise on a phone.
- Every drag family needs a no-drag fallback: click/tap a part, then click/tap a
  highlighted valid destination. This also provides an accessibility path.
- Do not combine object drag with touch camera look on the same canvas. The
  selected concepts should use a fixed browser camera or separate, explicit
  camera controls outside the work surface.
- Pause timers and simulation on `VisibilityState.Hidden` and
  `VisibleBlurred`. `NonImmersive` is the active browser mode, not a pause state.
- Required feedback must be shape/icon/text plus state change; color, sound,
  haptics, and hover may reinforce it but cannot be the sole signal.

## Common ECS and interaction structure

Keep the code smaller than the fiction. A selected concept should need at most
**three shared custom components, two family-specific components, and three
custom systems**.

### Shared entities and components

`LoopSession` singleton component on a root entity:

- `phase`: intro, goal, edit, test, observe, adjust, commit, complete;
- `attempt`: 0-3;
- `budgetRemaining`: small integer, if the design exposes governance;
- `result`: untested, partial, pass, risk, stop, escalate; and
- `interactionLocked`: prevents editing during a short deterministic test.

`Requirement` component on visible goal/evidence entities:

- stable requirement ID;
- current state: untested, pass, fail, regression, blocked; and
- non-color cue or icon variant.

`ChangeOption` component on modules, switches, lenses, or evidence choices:

- effect/variant ID;
- selected or installed state; and
- optional compatible socket ID.

Built-in input components:

- `Interactable` on ray/canvas-selectable roots;
- `DistanceGrabbable` only on objects that genuinely move or rotate;
- `Hovered`, `Pressed`, and `Grabbed` treated as framework-owned transient
  state; never add them manually.

### Shared systems

1. **LoopFlowSystem** owns legal phase transitions, attempt count, test lock,
   pass/partial/fail, commit, reset, and visibility pause.
2. **FamilySimulationSystem** computes the deterministic result from compact
   component data. No live AI/model output should certify a pass.
3. **FeedbackSystem** reacts to requirement/result changes and updates meshes,
   traces, icons, audio triggers, and the DOM/in-world summary only when state
   changes.

Use query membership and `qualify`/`disqualify` subscriptions instead of
manually maintained entity arrays. Store reusable scratch vectors, materials,
geometries, paths, and lookup tables outside `update()`. Use a single session
entity rather than a large JavaScript controller object that duplicates ECS
state. Import Three.js classes from `@iwsdk/core`, never directly from `three`,
and create every gameplay scene object through `world.createTransformEntity`
rather than `world.scene.add`.

### UI choice for the sprint

The core package includes spatial UI, but this repository does not install the
UIKitML Vite plugin. Adding a new UI toolchain inside the four-hour sprint is a
poor trade. Use:

- semantic DOM HUD and instructions for browser/mobile;
- one simple in-world status board for XR, built from icons, geometry, and a
  `CanvasTexture` refreshed only when content changes; and
- large in-world Run/Commit/Reset controls shared by all surfaces.

Do not put paragraphs or code in XR. Keep visible labels to short verbs and let
the attempt trace or state transformation carry the explanation.

## Asset-loading strategy

1. **Mechanics first:** implement all required interaction and evidence with
   IWSDK/Three primitives and shared geometries/materials.
2. **One art kit maximum:** if a licensed asset pack is selected, extract only
   the environment shell and 3-6 hero props into local `public/` assets. Do not
   load from Quaternius or another third-party host at runtime.
3. **GLB only for the timed build:** use already optimized GLB files. The repo
   does not currently include IWSDK's GLTF optimizer plugin, so plugin adoption,
   format conversion, and texture rebaking are pre-sprint work or cuts.
4. **Manifest priorities:** mark only the work surface and required hero parts
   `critical`; mark optional ambience/audio `background`. `World.create()` waits
   for all critical assets.
5. **Clone safely:** in npm 0.4.2 `AssetManager.getGLTF(key)` returns a fresh
   object-tree clone by default while sharing geometry/material/animation data.
   Create each placed copy through `world.createTransformEntity`.
6. **Graceful failure:** optional decor and audio may disappear without blocking
   the loop. If a critical model fails, replace it with the primitive graybox
   rather than preventing play.
7. **License evidence:** store source URL, author, license, and modification note
   beside the selected asset before public release.

Project guardrails, not claimed SDK limits:

- critical compressed assets: **4 MB or less**;
- total compressed runtime assets: **12 MB or less**;
- textures: 1K preferred, 2K maximum for one hero texture;
- short audio: no more than three effects plus one optional ambience loop; and
- no HDR environment map unless it is already small and demonstrably worth the
  load/GPU cost.

## Performance and comfort limits

The following are conservative acceptance budgets for the first complete build,
not hardware maximums. Relax only after measuring on the release headset and
phone.

### Rendering and update budget

- XR target: **72 Hz** (13.9 ms frame interval); desktop target: 60 fps; mobile
  floor: stable 30 fps with responsive input.
- Maximum initial scene: 75 visible draw calls, 150k visible triangles, 24
  active interactables, and 40 independently moving objects. Each proposed
  floor below is substantially smaller.
- Use zero or one shadow-casting directional light. Prefer baked/emissive cues,
  simple materials, gradient background, and a small number of transparent
  surfaces.
- No per-frame geometry creation, material creation, texture upload, DOM canvas
  redraw, array rebuilding, or asset loading.
- Do not change mesh topology while it is interactable; IWSDK computes mesh BVHs
  for ray input. Move/rotate/scale existing roots instead.
- Pool transient pulses, train cars, particles, and evidence ghosts. Cap retained
  attempt history at three.
- Keep physics false. Use sockets, bounds/proximity checks, fixed paths, and
  lookup tables instead of collision simulation.
- If the target session supports it, request 72 Hz and use renderer foveation
  during XR; absence of either capability must not break play.

### Comfort and accessibility budget

- Default to seated/standing stationary play. Put required interaction roughly
  0.6-2.5 m in front of the player and around waist-to-eye height.
- Minimum critical XR target dimension: about 6 cm with generous invisible hit
  volume. Minimum touch control target: 44 CSS px.
- No forced camera movement, camera shake, artificial roll, moving horizon,
  strobing lightning, or mandatory reach behind/below the player.
- No required smooth locomotion. If a later concept truly needs travel, add a
  static `LocomotionEnvironment` and default to teleport plus snap turn. Do not
  spend the four-hour concept build on browser touch-look or smooth-locomotion
  comfort tuning.
- Offer a recenter/reset-table action, one-action retry, reduced motion, captions
  or text equivalents, and no motor-speed scoring.
- Test exit/re-entry. IWSDK 0.4.2 restores the browser camera after XR exit, but
  the game state and input lock still need explicit verification.

## Four-hour implementation budget

This budget starts **after** the concept is locked, dependencies are installed,
and any external art has been selected, licensed, and optimized.

| Elapsed | Work | Exit condition |
| --- | --- | --- |
| 0:00-0:15 | Run existing baseline; lock smallest complete acceptance criteria | Current scene builds and target input surfaces are known |
| 0:15-0:45 | Family-specific risk prototype | The hardest interaction/effect works on desktop, touch emulation, and IWER, or the fallback is chosen |
| 0:45-1:15 | Shared session state and input wiring | One legal edit, Run Test, result, and reset path exist |
| 1:15-2:25 | Family mechanic and deterministic result | Two attempts produce different, causally readable evidence |
| 2:25-2:55 | Commit/release ending and one transfer/regression beat | Complete 2-3 minute arc has a beginning and ending |
| 2:55-3:20 | Feedback, readable controls, reduced motion, audio-independent cues | First-time path is understandable without narration |
| 3:20-4:00 | Typecheck, build, desktop/mobile/IWER exercise, console/network inspection, fixes | No blocking failures; known physical-headset gap recorded |

Kill or simplify at minute 45 if the core prototype is not reliable. Do not
borrow the validation reserve to rescue an ambitious mechanic.

## Family 1: Align and trace (Stormglass territory)

### Smallest complete build

- One vertical lens table, two movable/rotatable optical parts, and one test
  lever.
- Three discrete orientations or sockets per part; no continuous optical
  solver.
- Test 1 clears one requirement and exposes a second fault.
- Test 2 produces a stable path; one prior trace remains visible for comparison.
- Commit opens the corridor through a deterministic mesh/material transition.

### IWSDK/ECS mapping

- `OpticPart { variant, orientationIndex, installedSocket }`
- `OpticSocket { socketId, acceptsMask }`
- `TraceSegment { attempt, state, revealOrder }`
- `Interactable + DistanceGrabbable` on each optic; constrain movement or use
  `MovementMode.RotateAtSource` for a fixed lens.
- `Pressed` on the test lever; `Grabbed` disqualification triggers quantization
  to the nearest legal orientation/socket.
- Compute outcomes from a tiny lookup table. Reveal pre-created emissive beam
  segments in sequence instead of ray tracing, volumetric shaders, or particles.

### Input, comfort, and performance contract

- Desktop/touch: drag a lens or select it and tap a highlighted orientation.
- XR: ray-grab and rotate; direct near-grab is optional.
- Pulse speed must be slow and non-strobing; no full-field lightning flash.
- Cap at two optics, eight beam segments, one retained trace, and no transparent
  storm volume on the critical path.

### 30-minute risk prototype and kill condition

Prototype one rotate-only lens, release quantization, and a three-segment trace
on mouse, touch, and IWER controller ray. If release orientation differs by more
than one legal step across inputs or feels unstable, replace free rotation with
tap/select-to-cycle discrete orientations. If the trace is not readable without
effects, cut the vertical storm shell and keep a clear tabletop path.

## Family 2: Control variables and simulate (Tomorrow Garden territory)

### Smallest complete build

- Three large care tokens or tiles feeding light, water, and pollination slots.
- Two plant/species groups with three authored growth states each.
- Two short season runs: the first passes one criterion and reveals a dependency;
  the second verifies a stable habitat.
- One translucent previous-result silhouette and a compact pass/regression board.

### IWSDK/ECS mapping

- `CareToken { effectId, magnitude }`
- `CareSlot { variableId, currentEffect }`
- `Organism { speciesId, growthStage, healthState }`
- `SeasonSnapshot { attempt, resultMask }`
- Tokens use `Interactable + DistanceGrabbable` with sockets; Run Season is a
  separate `Interactable` control.
- `SeasonSystem` reads a small deterministic table and lerps existing transforms,
  opacity, and emissive intensity through authored stages. No fluid, root,
  weather, or procedural plant simulation.

### Input, comfort, and performance contract

- All required observation must be visible from the default camera/head pose;
  leaning gives a better view but no hidden required clue.
- Use shape and icon changes alongside color. Growth can be shortened or skipped
  under reduced motion.
- Cap at 12 visible growth meshes per current garden and 12 for one ghost. Share
  geometry; use a small number of cloned materials for ghost opacity.

### 30-minute risk prototype and kill condition

Create one token-to-slot interaction and animate two primitive plants through
three states while one prior state remains translucent. Test the overlay on a
phone-sized viewport and in IWER. If transparency causes sorting/readability
problems, replace the 3D ghost with an outline ring, height marker, or side-by-
side thumbnail board. If authored growth states take more than 20 minutes,
reduce to scale/leaf-count changes on primitives.

## Family 3: Assemble a requirement pipeline (Galactic Test Kitchen territory)

### Smallest complete build

- Three pipeline slots, five available modules, three guest requirement cards,
  one Sample control, and one locked Release control.
- The first sample passes some requirements and gives one precise failure.
- One module swap fixes the failure but may expose a deterministic regression.
- A repeated passing sample unlocks Release and runs the same three visible
  stages at hero scale.

### IWSDK/ECS mapping

- `PipelineSlot { index, acceptsMask, installedModule }`
- `ProcessModule { moduleId, effectMask }`
- `Requirement { guestId, criterionId, requiredMask, state }`
- `SampleResult { attempt, producedMask }`
- Modules use `Interactable + DistanceGrabbable`; sockets and snap feedback are
  shared with the align family.
- `PipelineTestSystem` evaluates bitmasks and updates a fixed reaction grid.
  Keep guest animation to icon/face state swaps or one short authored reaction.

### Input, comfort, and performance contract

- Desktop/touch fallback is select module -> select valid slot. No precision
  tube insertion or timed chopping/pouring.
- The reaction panel must remain readable at phone width and 1.5-2 m in XR; use
  one icon and one short phrase per criterion.
- Cap at five movable modules, three slots, six criteria, and one sample object.

### 30-minute risk prototype and kill condition

Prototype module select/drag, socket highlight, release snap, and a six-cell
reaction matrix. If snap consumes more than the prototype window, ship click-to-
place as the primary interaction and retain drag only as polish. If the panel
cannot be read without text density, reduce each guest to one required and one
regression criterion.

## Family 4: Route and rehearse a release (Sunrise Express territory)

### Smallest complete build

- A fixed tabletop graph of five or six track segments and three large switches.
- Two requirement-bearing cars or stations represented by distinct shapes, not
  only colors.
- A deterministic ghost rehearsal that stops at the first unmet dependency and
  leaves its route trace suspended.
- A second passing rehearsal unlocks one Dispatch control and dawn transition.

### IWSDK/ECS mapping

- `RouteSwitch { switchId, branchA, branchB, selectedBranch }`
- `TrackSegment { segmentId, nextA, nextB, requirementMask }`
- `TrainState { segmentId, progress, carriedMask }`
- `RehearsalTrace { attempt, segmentMask }`
- Switches are `Interactable`; a press rotates/toggles between two authored
  states. Do not make track pieces freely draggable.
- `RouteSystem` follows a pre-authored adjacency table. Move the train root along
  cached points; reveal cached trace segments. No spline editor, pathfinding,
  train physics, or collision.

### Input, comfort, and performance contract

- Same tap/select verb on every surface; strongest mobile parity of the five.
- Rehearsal speed is fixed and pausable; the trace remains after motion stops.
- Cap at three switches, six segments, one moving train root, and two retained
  traces. Avoid a generic orange/gray factory or throughput score.

### 30-minute risk prototype and kill condition

Build a six-node adjacency table, three toggles, one moving marker, and a visible
first-failure stop. Pause/resume correctly across page/XR visibility changes. If
the route is not understandable at thumbnail size, simplify to four segments
and enlarge the failure marker. If path code needs a generalized graph engine,
replace it with two authored route arrays.

## Family 5: Compare evidence and revise an assumption (Museum territory)

### Smallest complete build

- One artifact plinth, one replaceable slot, three candidate parts, one Test
  control, and one Compare control.
- Three attempts maximum. Each attempt produces a short, deterministic partial
  transformation and preserves one evidence marker.
- Compare shows at most two prior outcomes simultaneously and exposes the shared
  mistaken assumption.
- The final test verifies the behavior and transforms the exhibit; a stamp or
  card records the attempt history.

### IWSDK/ECS mapping

- `PrototypePart { variantId, evidenceMask, installed }`
- `ArtifactState { behaviorMask, currentVariant }`
- `AttemptRecord { attempt, behaviorMask, evidenceMask }`
- `EvidenceGhost { attempt, visible, displayMode }`
- Parts use `Interactable + DistanceGrabbable` and one socket. Test/Compare are
  interactable buttons.
- Preserve history as compact masks on three fixed snapshot entities. Clone or
  reveal pre-created ghost geometry; do not serialize arbitrary scene graphs.

### Input, comfort, and performance contract

- Compare is a toggle, not a required two-handed alignment gesture. XR depth
  helps, but desktop/touch receive the same side-by-side or overlay evidence.
- Ghosts need distinct line style/shape and attempt number, not opacity/color
  alone. Keep each memory animation under five seconds and skippable.
- Cap at three parts, three snapshots, and two visible ghosts. Avoid nested
  transparency and large transparent surfaces.

### 30-minute risk prototype and kill condition

Create one primitive artifact with two result variants and two retained ghost
snapshots. Toggle overlay/side-by-side presentation on mobile and IWER. Verify
that material changes on a ghost do not mutate the current artifact through
shared GLTF materials. If alpha sorting or causal comparison is unclear, use
solid miniatures on two side plinths instead of overlays. If attempt history
requires a generic replay system, store only result masks and authored poses.

## Cross-family prototype gates

Before selecting a concept for implementation, run these in order:

1. **Unified input gate:** one interactable control and one draggable/rotatable
   object work with desktop pointer, touch emulation, and IWER controller ray.
2. **Release-state gate:** the app detects press and grab release through public
   `Pressed`/`Grabbed` state and performs one deterministic snap or toggle.
3. **Evidence gate:** the first failed test visibly identifies the next relevant
   change in under two seconds without narration.
4. **Visibility gate:** tests pause on hidden/blurred state and do not duplicate
   timers or input listeners after XR exit/re-entry.
5. **Performance gate:** the graybox holds target frame rate with all planned
   interactables and retained evidence visible; no per-frame allocations or
   console warnings accumulate.
6. **Cut gate:** at minute 45, choose keep, fallback input, or family replacement.

## Integration assumptions and risks

### Assumptions

- Four hours means one expert implementation pass on this functioning boilerplate,
  after concept lock and asset preparation; it does not include research,
  licensing, asset conversion, deployment, or submission writing.
- Controller-based Quest 3 IWER interaction is available. Physical-headset
  comfort, hand tracking, controller haptics, and thermal behavior remain release
  gaps until tested separately.
- The selected game uses deterministic authored outcomes. GPT/Codex may help
  build the game, but a live model is not in the play loop or acceptance gate.
- The parallel learning-design note supplies the canonical Goal/Act/Observe/
  Adjust/exit semantics; this note only maps them to IWSDK structures.
- The parallel narrative territories are provisional coordination inputs, not
  architecture requirements.

### Risks

- **Published-package/source drift:** current official source may advertise API
  not present in the npm tarball. Validate against installed declarations before
  coding.
- **Drag parity:** unconstrained 3D dragging is less precise on touch. Every
  concept needs discrete destinations and select/place fallback.
- **XR UI readability:** DOM overlays disappear in headset. Preserve one simple
  in-world goal/result board and world-space controls.
- **Transparency:** garden and museum ghost overlays can trigger depth sorting
  and readability issues. Side-by-side solid miniatures are the mandatory
  fallback.
- **Pointer BVH cost:** many complex interactable mesh hierarchies increase
  raycast setup and refresh cost. Put interaction on simple roots or invisible
  proxy meshes and keep the active set small.
- **Asset time sink:** imported packs can bring excessive meshes, materials,
  animations, textures, and unclear scale. The primitive graybox must remain a
  shippable visual fallback.
- **Comfort overreach:** smooth locomotion, forced camera motion, flashing hero
  effects, and reach-heavy layouts can invalidate an otherwise functional demo.
- **Originality collision:** module pipelines and route graphs are technically
  safe but market-familiar. Evidence comparison, bounded governance, and the
  release/rollback decision must be mechanically visible, not decorative text.

## Sources and checks used

All web/npm sources were accessed **2026-07-20**.

### Repository sources

- `AGENTS.md`
- `plans/loop-engineer-concepts/PLAN.md`
- `plans/loop-engineer-concepts/AGENT_ASSIGNMENTS.md`
- `docs/architecture/IWSDK.md`
- `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`
- `src/index.ts`, `src/floating-word.ts`, `src/xr-support.ts`
- Coordination inputs read only:
  `plans/loop-engineer-concepts/agent-notes/learning-design.md`,
  `market-research.md`, and `narrative.md`

### Authoritative IWSDK sources

- npm package metadata and exact published tarball:
  <https://www.npmjs.com/package/@iwsdk/core/v/0.4.2>
  (`npm view @iwsdk/core@0.4.2`, `npm pack @iwsdk/core@0.4.2`; tarball
  integrity `sha512-AM4REL7dHO0FZLtnW8YfM8NXZyJ34i3J+DaNSfnqCviv3tZsSkvp0D/uqoFyI3HMrOjGZjwZSZS6nVkdHSE99w==`).
- Exact npm declarations inspected for world options, input actions, state tags,
  grab components, assets, locomotion, ECS world/system/entity, UI, and audio.
- Official IWSDK built-in interactions guide at pinned source commit:
  <https://github.com/facebook/immersive-web-sdk/blob/496f3f8be8d7c8b0222fba574db504fe6ac0ba77/docs/guides/06-built-in-interactions.md>
- Official external-assets guide at the same commit:
  <https://github.com/facebook/immersive-web-sdk/blob/496f3f8be8d7c8b0222fba574db504fe6ac0ba77/docs/guides/04-external-assets.md>
- Official locomotion comfort guidance:
  <https://github.com/facebook/immersive-web-sdk/blob/496f3f8be8d7c8b0222fba574db504fe6ac0ba77/docs/concepts/locomotion/slide.md>
- Official IWSDK architecture/planning guidance at the same commit:
  <https://github.com/facebook/immersive-web-sdk/blob/496f3f8be8d7c8b0222fba574db504fe6ac0ba77/.claude/skills/iwsdk-planner/SKILL.md>
- Official package changelog/source used only to identify source drift:
  <https://github.com/facebook/immersive-web-sdk/blob/496f3f8be8d7c8b0222fba574db504fe6ac0ba77/packages/core/CHANGELOG.md>

### Checks performed for this docs-only assignment

- Confirmed the requested worktree and branch with `git status --short --branch`.
- Confirmed exact dependency versions in both package manifest and lockfile.
- Confirmed npm reports 0.4.2 as the latest published core version on the
  research date.
- Downloaded the npm tarball to a temporary directory and inspected public
  declarations/implementation without modifying repository dependencies.
- Compared the published tarball to current official source where behavior was
  uncertain.
- No gameplay code, package file, branch, commit, or runtime configuration was
  changed. Full typecheck/build/E2E are intentionally left to the integrator
  because this assignment changes only a Markdown research note.
