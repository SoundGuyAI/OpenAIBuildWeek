# Final independent review — scenery-hand-interactions

Reviewed: 2026-07-21
Branch: `fix/scenery-hand-interactions`
Verdict: **Approve with documented device and polish follow-ups**

## Scope and validation

Reviewed `AGENTS.md`, `docs/DEFINITION_OF_DONE.md`, the feature plan and agent
notes, current implementation and tests, browser/XR reports, evidence manifest,
and all four desktop/mobile/IWER captures. No implementation files were edited.

Final validation evidence:

- `npm run typecheck` — passed; independently repeated during re-review.
- `npm run test:model` — 23/23 passed; independently repeated during re-review.
- `npm run build` — passed with the known large-chunk advisory.
- `npm run test:e2e:run` — 6 applicable tests passed and 6 capability/project
  cases were intentionally skipped in 4.2 minutes, with no application console,
  page, request, or HTTP failures.
- IWER browser warning/error query after controller manipulation — `[]`.

## Final blocker resolution

### IWER controller manipulation, capture, and ownership — passed

The focused action trace requested by the prior review is complete:

1. The workbench was placed and confirmed using a controller.
2. The right-controller ray acquired car entity 25 and moved it from
   `[-0.72, 0.055, 0.87]` to its exact authored target
   `[-0.82, 0.055, 0.28]`, proving captured XR motion, root-local projection,
   snapping, and the resulting gameplay transition.
3. The right controller acquired and retained the lever while the left
   controller attempted acquisition, then moved outside the target and
   released. The right owner pulled through threshold and advanced the UI
   exactly once from the baseline step to the highlighted-tower step. This
   proves exclusive ownership, capture beyond collider bounds, lever threshold
   handling, release/return, and single intent dispatch on the available XR
   controller path.
4. `04-iwer-controller-lever.png` shows the resulting post-baseline
   “Add an edge case” state in the live IWER scene.

This closes the last merge blocker. The action trace, live ECS inspection, and
controller result together provide materially stronger evidence than component
registration alone.

### Articulated-hand emulator limitation — documented, non-blocking

Right-hand pinch/move/release and direct fingertip approach/pull/withdraw were
attempted in IWER but did not advance the interaction. That negative result is
consistent with the already documented IWSDK 0.4.2 gamepad/input-source gate;
it is not being misreported as a pass. The application still registers the
lever and other gameplay entities through live `RayInteractable` and
`PokeInteractable` paths and does not filter hand pointer types.

Per the prior review's stated alternative, proving the available controller
path while recording the exact emulator limitation is sufficient for this code
revision. Physical articulated-hand behavior remains an explicit device-gate
follow-up and must not be claimed until exercised on the target headset/browser.

### IWER placement prerequisite — fixed and tested

`isHorizontalPlacementNormal` now accepts either winding of a horizontal plane
normal by testing the absolute normalized dot product against the 20-degree
threshold (`src/kaiju-qa/mr-placement-model.ts`). The model test covers both
`(0, 1, 0)` and `(0, -1, 0)`, the acceptance boundary, steep normals, and zero
vectors. This resolves the emulator placement failure without weakening the
steep-surface guard.

## Other resolved findings

- The Quaternius character now uses its authored face and materials without
  detached procedural eyes or a floating hat.
- Reaction clips are one-shot, and the finished action remains active long
  enough to cross-fade to idle rather than leaving a clamped pose weighted.
- Buildings and the service car use shipped authored models/material separation;
  the labeled lever has a coherent mechanical silhouette and forgiving
  invisible collider.
- Non-screen gameplay manipulation uses captured IWSDK event points, one active
  pointer owner, constrained local movement, and explicit cancellation/release
  during suspension, placement restart, and disposal.
- Feature plan, assignments, acceptance mapping, and correctly encoded evidence
  captures are present.

## Non-blocking follow-ups

### P1 — Physical-headset hand verification

Run controller ray, hand pinch/select, and direct poke on the target physical
headset/browser, specifically checking the pinned 0.4.2 hand-source gamepad
shape. Record pointer type, capture continuity, lever threshold, outside
release, and re-entry. Until then, describe articulated-hand support as
implemented but device-unverified.

### P1 — Complete remaining XR interaction breadth

The focused IWER proof covers prop snapping, lever manipulation, two-controller
contention, outside release, and clean intent dispatch. Cartridge, stamp,
draggable-card, cancellation/re-entry, and near-parallel card-ray behavior were
not all exercised in XR. These remain release-hardening tests rather than merge
blockers because they share the verified interaction infrastructure and the
full browser campaign passes.

### P1 — Portrait composition

`02-mobile.jpg` keeps UI and targets reachable but compresses the diorama into a
narrow band with substantial dead space. A tighter portrait camera or less
persistent world-card coverage would improve character, prop, socket, and lever
legibility. Native touch directly covers the first prop; add native-touch lever,
cartridge, and stamp tests when broadening mobile evidence.

### P1 — Reduced-motion skeletal reactions

Reduced motion suppresses procedural bobbing/pulsing but retains full skeletal
reaction clips. Consider idle or restrained reaction alternatives for a
stronger comfort mode. No locomotion or camera motion was introduced.

### P2 — Later-stage visual proof and remaining primitives

The visual captures emphasize Training Stage 1. A later district, cartridge,
stamp, or post-reaction frame would strengthen the polish record. Roads,
sockets, state marks, and invisible hit volumes are appropriate primitives;
the lever, tower, and cargo can adopt more shipped assets later if that improves
silhouette without destabilizing the tested rig.

## IWSDK, performance, and accessibility assessment

- **IWSDK rules:** pass. Scene/gameplay objects use
  `world.createTransformEntity`, interactions use IWSDK components, Three types
  come from `@iwsdk/core`, no custom gameplay raycaster or competing grabbable
  owner was added, and physics/locomotion remain appropriately disabled.
- **Ownership and lifecycle:** pass. The IWER contention/outside-release trace
  validates the static exclusive-owner and pointer-capture design on controller
  input; cancellation and disposal paths explicitly release ownership.
- **Resources and hot loops:** pass with advisory. Update loops reuse temporary
  objects, owned GPU resources/entities are disposed, shared imported geometry
  is retained correctly, and no runtime errors were observed. The production
  main chunk remains large and weakest-device busy-scene performance is not
  recorded.
- **Accessibility:** pass with follow-ups. Browser semantics, keyboard-accessible
  alternate actions, labels, non-color-only state marks, narration controls,
  and reduced-motion toggle remain available. Portrait scale and skeletal
  reduced-motion behavior are the principal polish gaps.

## Acceptance assessment

- Character coherence and animation lifecycle: **pass**.
- Scenery/asset coherence and grounding: **pass**.
- Desktop campaign and lever behavior: **pass**.
- Mobile campaign/reachability: **pass with framing and native-touch breadth
  follow-ups**.
- Lever collider, capture, exclusive ownership, outside release, threshold,
  and single dispatch: **pass in IWER controller trace**.
- Live IWER Ray/Poke ECS registration: **pass**.
- IWER articulated-hand manipulation: **attempted but unavailable due to the
  documented pinned-runtime limitation**.
- Physical-headset articulated-hand behavior: **explicitly unclaimed device
  follow-up**.

## Final verdict

**Approved for integration with documented follow-ups.** The user's primary
complaints are addressed: the kaiju is one coherent authored character rather
than bouncing detached parts; scenery and controls read as an intentional
miniature lab; the lever is understandable and forgiving; browser desktop and
mobile behavior remains green; and the available IWER controller path now
proves real grab, snap, contention, outside release, lever threshold, and
exactly-once progression without runtime errors. The failed IWER hand synthesis
is honestly bounded to the pinned SDK/emulator limitation, with live Ray/Poke
application paths present and physical-hand verification carried as a named
device follow-up rather than an unsupported claim.
