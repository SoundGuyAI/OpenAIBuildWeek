# XR QA — Loop Engineer concept proposals

Role: `QA-XR-01`  
Review date: 2026-07-20  
Artifact type: docs-only design review  
Disposition: **Conditional pass for concept comparison; no runtime XR certification**

## Scope and execution status

Reviewed:

- `AGENTS.md`
- `plans/loop-engineer-concepts/PLAN.md`
- `docs/design/loop-engineer-concepts/PROPOSALS.md`
- `plans/loop-engineer-concepts/agent-notes/sdk-research.md`
- root `index.html`
- `docs/design/loop-engineer-concepts/index.html`, the offline concept book

Runtime, IWER, and physical-headset execution are **not applicable until a
concept is selected and implemented**. This branch contains no concept gameplay
to enter, manipulate, pause, or re-enter in XR. The existing root `index.html`
is the IWSDK Hello World shell, not evidence for any proposed mechanic. Its DOM
buttons and WASD/touch locomotion affordances must not be counted as in-headset
controls or as proof of stationary concept behavior.

This review therefore assesses whether each design can plausibly satisfy the
published IWSDK 0.4.2 contract and identifies the exact gates for the later
implementation branch.

## XR baseline applied

The selected implementation must use controller ray/select as the release
baseline. Direct grab, hand tracking, poke, haptics, and two-handed interaction
may be optional polish only. Required movable objects should use
`Interactable` plus `DistanceGrabbable`, discrete sockets/orientations, and a
select-object/select-destination fallback. Normal interaction must not use a
hand-written `Raycaster`.

Play must be seated/standing stationary, with required targets approximately
0.6–2.5 m in front of the player, between waist and eye height, never requiring
reach behind or below the player. Critical targets need an approximately 6 cm
minimum dimension or a generous invisible proxy. Goal, evidence, and
Run/Retry/Commit/Reset controls must exist in world space because the browser DOM
HUD is not an XR interface.

Required state must use shape/icon/short text and persistent state changes, not
color, opacity, sound, haptics, or hover alone. Tests and animations must pause
on hidden/blurred visibility state. XR exit/re-entry must preserve the legal
session state without duplicated timers, listeners, traces, or input locks.
Physics should remain disabled, outcomes deterministic, and all gameplay scene
objects should be created through `world.createTransformEntity` with Three.js
imports coming from `@iwsdk/core`.

## Concept-by-concept review

### 1. Stormglass — amber

**Controls and parity.** Horizontal drag and controller-ray rotation are not
inherently equivalent. The XR-safe interpretation is ray-select/ray-grab with
three discrete orientations, quantized on release, plus select-to-cycle as the
fallback. Direct near-grab must remain optional. Test and Commit must be large
world-space ray controls.

**Stationary comfort, reach, and targets.** A fixed lens table is appropriate
for seated play if every prism and control is placed in the forward reach band.
Thin prism geometry needs a simple proxy hit volume. Route evidence must be
visible from the default head pose; leaning may improve the view but cannot
reveal a required clue. Lightning must be slow, localized, and non-strobing,
with no full-field flash, camera shake, or moving horizon.

**State visibility and session lifecycle.** The current route, retained route,
two criteria, selected orientation, and Commit eligibility need distinct
line/shape/attempt cues on an in-world board. A route trace must remain after
motion stops. Exiting XR during a pulse or airship sequence must pause it and
return to the same attempt without replaying or duplicating the trace.

**Four-hour feasibility.** Feasible only with authored beam segments and a
lookup table. The proposal's three prisms exceed the SDK research floor of two
optics, so the third prism is polish until the 30-minute cross-input prototype
passes. If ray rotation differs across surfaces or feels unstable, the required
interaction must become select-to-cycle. No volumetric storm is on the critical
path.

### 2. The Tomorrow Garden — amber

**Controls and parity.** Care tokens should ray-grab into large discrete sockets;
select-token/select-slot must provide the no-drag path. Plant inspection or
pruning should be a single ray press on a generous proxy, not a near-hand
gesture. Run Season must be an in-world control shared by all surfaces.

**Stationary comfort, reach, and targets.** The planter, every care slot, and
every required plant must be visible from the default seated pose. Foliage may
not hide a clue or force reaching into/around the planter. Growth can add depth,
but required interpretation cannot depend on leaning or viewing from behind.

**State visibility and session lifecycle.** Current and prior seasons need
shape/icon labels and an attempt number. Opacity alone is insufficient. If the
ghost garden is not immediately readable, use outlines, height markers, or
solid side-by-side miniatures. Reduced motion must shorten or skip growth and
pollinator travel. Exit/re-entry during a season must pause the authored
timeline and resume the same attempt without double-advancing growth state.

**Four-hour feasibility.** Deterministic transform/material swaps are viable.
The proposal's four tokens and two overlays exceed the research floor of three
tokens and one retained result; the smallest complete XR build should use the
research floor until readability and frame budget are proven. Procedural
growth, fluid, weather, and nested transparent gardens are out of scope.

### 3. Kaiju QA — green with conditions

**Controls and parity.** Scenario props and the slow-zone boundary should use
ray-grab to generous sockets with select-prop/select-socket fallback. The kaiju
path is likely too thin to target directly, so inspection needs a wider
invisible proxy or a separate evidence marker. Run and Release must be large
world-space buttons. Direct grab and physical destruction are not required.

**Stationary comfort, reach, and targets.** The complete district and every
socket must fit on a forward tabletop. The finale may scale or animate the
kaiju, but must not scale/move the player, force the camera, or fill the view
with abrupt motion. All authored failures must remain inside the diorama.

**State visibility and session lifecycle.** Each scenario requires a persistent
shape-coded path, short scenario label, pass/fail/regression marker, and a
visible all-tests gate. Red/green may reinforce these cues but cannot carry
them. Reduced motion must allow immediate authored state changes instead of the
full walk/collapse/scale-up sequence. Exit/re-entry must preserve placed props,
attempt history, and current path progress without replaying a failure or
awarding Release twice.

**Four-hour feasibility.** This is the strongest XR candidate if all outcomes
are authored and physics remains disabled. Four buildings, two props, three
paths, and one pose/scale finale are plausible with primitives or prepared
assets. Creature rig/animation integration is optional; fixed poses and root
motion are the shippable fallback.

### 4. Sunrise Express — green with conditions

**Controls and parity.** Binary ray-toggle switches provide the clearest parity
of the five concepts. The quality gate should also snap between authored states,
not require free rotation. Rehearsal and Dispatch must be in-world ray controls,
and every switch needs a generous hit proxy.

**Stationary comfort, reach, and targets.** The fixed route graph must be readable
from one seated/standing viewpoint. Train motion should remain localized to the
table, at a fixed pausable speed, with no camera movement or moving horizon.
Head movement may provide delight but cannot be required to discover the first
failed dependency.

**State visibility and session lifecycle.** Cars/stations need shape identity,
short labels, and explicit gate state. A failed rehearsal must leave a suspended
trace and prominent stop marker after motion ends. Exit/re-entry during a train
run must pause normalized route progress and resume the same attempt without
spawning another train or trace.

**Four-hour feasibility.** A pre-authored adjacency table is safely within the
budget; a graph editor, pathfinding, collision, or train physics is not. The
proposal displays three ghost traces while the SDK note caps retained evidence
at two. The XR floor must retain at most two visible traces and use two authored
route arrays if generalized routing grows beyond the 30-minute prototype.

### 5. The Museum of Almosts — amber; interaction decision required

**Controls and parity.** The proposal currently says to move a lens and align an
expected silhouette. Continuous 6DoF lens alignment is not an acceptable
required baseline for controller ray, touch, and mouse parity. The selected
implementation must make the lens snap among discrete compare positions or
replace alignment with a Compare toggle/side-by-side view. Replacement parts
use one socket and a select-part/select-socket fallback. The crank must also
support a ray press; wrist rotation or direct grab cannot be mandatory.

**Stationary comfort, reach, and targets.** The plinth, parts, lens positions,
and crank must remain in the forward waist-to-eye band. The lens may not force
the player to crouch, peer behind the artifact, or hold an arm extended while
reading evidence. Comparison animations must stay under five seconds and be
skippable.

**State visibility and session lifecycle.** Expected/current/prior artifacts
need distinct solid line style or shape, attempt numbers, and a short mismatch
cue. Opacity alone is insufficient. No more than two prior outcomes should be
visible together. Solid side miniatures are the mandatory fallback for alpha
sorting or causal ambiguity. Exit/re-entry must preserve installed part,
Compare mode, and snapshots without duplicating clones or mutating shared GLTF
materials.

**Four-hour feasibility.** Feasible only after the continuous-alignment
ambiguity is removed. Three translucent reference meshes plus a large lens are
above the safer research floor; use two comparison results and pre-created
poses. If the 30-minute IWER graybox does not make cause/effect legible, switch
to solid side-by-side miniatures or do not select this concept.

## Blocking design issues

There is **no blocker to accepting this branch as a docs-only comparison
artifact**. There are, however, implementation-start blockers that must be
resolved in the selected concept's plan:

1. **Museum lens alignment:** it cannot remain a required continuous precision
   gesture. Lock discrete positions or a Compare toggle before implementation.
2. **Stormglass rotation:** define the finite orientation set and select-to-cycle
   fallback before treating ray rotation as cross-surface parity.
3. **Canonical floor drift:** reconcile the proposal with the SDK floor before
   scheduling four hours: Stormglass two required optics, Garden three required
   tokens/one prior result, Sunrise at most two retained traces, and Museum at
   most two visible prior outcomes.
4. **Shared XR UI/lifecycle specification:** the selected plan must explicitly
   include an in-world goal/result board, world-space Run/Retry/Commit/Reset,
   target/reach placement, recenter/reset-table behavior, visibility pausing,
   and XR exit/re-entry semantics. The current DOM shell does not satisfy these
   requirements in headset.

## Exact XR acceptance gates for the implementation branch

1. **Public IWSDK 0.4.2 gate:** implementation uses installed 0.4.2 public APIs,
   `Interactable`, ECS queries/subscriptions, `world.createTransformEntity`, and
   imports from `@iwsdk/core`; it does not depend on unpublished
   `GrabSystem.forceRelease()` or a hand-written gameplay `Raycaster`.
2. **Unified controller gate:** every essential action works with either Quest
   controller through ray/select in IWER. No required action depends on hand
   tracking, near grab, haptics, two hands, throwing, freehand drawing, or motor
   speed.
3. **Manipulation parity gate:** each movable/rotatable item has finite legal
   sockets or orientations, deterministic release quantization, and the same
   possible outcomes on desktop, touch, and XR. A select-object/select-target or
   select-to-cycle fallback completes the loop without dragging.
4. **World-space control gate:** headset users can read the goal, attempt,
   requirement states, current result, and Commit eligibility and can activate
   Run, Retry, Commit/Release, and Reset/Recenter without the DOM HUD.
5. **Target and reach gate:** all required targets are approximately 6 cm or
   have equivalent proxy volumes; all are usable from a seated default pose in
   the 0.6–2.5 m forward, waist-to-eye region. No required target or clue is
   behind, below, occluded, or reachable only by leaning.
6. **Stationary comfort gate:** the full loop completes with no locomotion,
   forced camera motion, shake, artificial roll, moving horizon, strobe, or
   mandatory extended reach. Local motion is pausable/skippable and reduced
   motion preserves all evidence and timing-independent outcomes.
7. **Evidence legibility gate:** within two seconds of the first failed test,
   the next relevant change is identifiable without narration. Pass, fail,
   regression, blocked, selected, and retained-attempt states use shape/icon/
   short text plus state change; color, opacity, sound, haptics, and hover are
   supplemental only.
8. **Visibility gate:** entering hidden or visible-blurred state pauses timers,
   deterministic simulations, and animation progress. Returning resumes one
   legal attempt without skipped gates, double advancement, duplicate traces,
   or accumulated listeners.
9. **Exit/re-entry gate:** test XR exit and re-entry while idle, while an object
   is grabbed, during a test animation, after a failed attempt, and after
   completion. Placements, attempt history, evidence, and release state remain
   coherent; no object stays permanently `Grabbed`, no input lock remains stuck,
   no entity/timer is duplicated, browser camera restoration succeeds, and the
   table can be recentered. Reset/Commit remains disabled while `Grabbed` rather
   than relying on an unpublished force-release method.
10. **Determinism and physics gate:** repeated identical inputs produce identical
    evidence. Physics remains disabled; paths, growth, destruction, snapping,
    and comparison use authored poses, fixed paths, sockets, masks, or lookup
    tables.
11. **Performance gate:** with all required interactables and retained evidence
    visible, IWER shows responsive ray input, no accumulating console warnings,
    no per-frame object/material/geometry allocation, and no unbounded entity or
    trace growth. The build targets 72 Hz XR and records actual physical-headset
    frame/thermal results when headset testing becomes available.
12. **Concept risk gate at 30/45 minutes:** exercise the selected concept's
    riskiest interaction in desktop pointer, touch emulation, and IWER controller
    ray by minute 30. At minute 45, choose the documented fallback or cut; do not
    consume the final 40-minute validation reserve rescuing continuous
    manipulation, transparency, asset rigs, effects, or generalized path code.
13. **Independent XR evidence gate:** after typecheck, build, and browser E2E,
    XR QA records IWER entry, both-controller ray behavior, the complete
    Run/Retry/Commit loop, visibility pause, exit/re-entry cases, console state,
    and screenshots/video. Physical Quest testing remains a declared release
    gap until actually performed; the implementation must not claim headset
    comfort certification without it.

## Conclusion

Kaiju QA and Sunrise Express have the clearest controller-ray parity and lowest
stationary-comfort risk. Stormglass and Tomorrow Garden are viable with the
documented input/history cuts. Museum of Almosts remains a credible backup only
after its lens interaction is converted from continuous alignment to discrete
comparison. None of these findings constitute runtime certification; that work
begins only on the selected implementation branch.
