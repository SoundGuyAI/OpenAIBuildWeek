# XR interaction audit — IWSDK 0.4.2

Audited 2026-07-21 against the pinned installed packages (`@iwsdk/core` and
`@iwsdk/xr-input` 0.4.2), `src/index.ts`, `src/kaiju-qa/scene.ts`,
`src/kaiju-qa/control-fixtures.ts`, `src/kaiju-qa/draggable-callout.ts`, and the
current model/E2E tests. The IWSDK runtime was not running (`npm run dev:status`:
`running: false`, `browserConnected: false`), so the findings below are static
API/code findings; the runtime checklist remains required.

## Pinned-version behavior that matters

- `RayInteractable` is the correct component for the existing mouse/touch,
  controller-trigger ray, and articulated-hand pinch/select ray path. IWSDK's
  `InputSystem` places these entities in `scene.rayDescendants`; the XR
  `MultiPointer` drives the ray sub-pointer with `selectStart`/`selectEnd` and
  locks the selected pointer until release.
- `features.grabbing.useHandPinchForGrab: true` does **not** make a
  `RayInteractable` a grab target. In 0.4.2 it forwards a primary hand's select
  edges as squeeze events to the `grab` sub-pointer, whose candidates are only
  `OneHandGrabbable`/`TwoHandsGrabbable` entities. None of the game controls has
  either component, so this option is currently irrelevant to them.
- Do not add `OneHandGrabbable` or `DistanceGrabbable` to these same transform
  entities as a quick fix. The 0.4.2 `GrabSystem` binds its own handle, changes
  pointer-type filtering, and mutates transforms independently. That would
  compete with the game's pointer capture, axis constraints, snapping, intent
  dispatch, and spring return. Keep one owner: the current custom constrained
  manipulation driven by IWSDK pointer events.
- `PokeInteractable` is a separate direct fingertip/controller-touch path. The
  controls do not currently opt into it. That is acceptable for the stated
  pinch/select criterion, but direct finger poke must not be claimed or marked
  passed unless it is deliberately added and tested.

## Findings and minimal safe changes

### P0 — XR motion projection is not robust enough for lever/stamp/object drags

All gameplay controls are registered as `RayInteractable`, have explicit
pointer capture, and accept IWSDK event pointer types without screen-only
filtering. That wiring is sound. The weakness is the drag projection:

- props, cartridges, and the lever project the captured ray onto the tabletop
  plane;
- the stamp projects onto a fixed world-space vertical plane; and
- cards project onto a camera-facing plane.

A controller or hand ray can be nearly parallel to the tabletop/vertical plane.
`Ray.intersectPlane()` then returns no point (or an unstable distant point), so
the pointer remains captured but motion stalls or jumps. The lever is the most
exposed because success requires 0.14 local units of Z travel while an MR root
is scaled to 0.25.

Minimal 0.4.2-safe repair in `scene.ts`:

1. Extend the local event shape with `point: Vector3` (present on
   `@pmndrs/pointer-events` events used by IWSDK).
2. Keep the existing reconstructed ray/plane path for `screen-*` events to
   preserve desktop/mobile behavior.
3. For non-screen `ray` events, derive the drag sample from `event.point` after
   capture, transform it into `root` local space, apply the initial offset, and
   then let the existing per-kind axis clamps enforce tabletop, lever-Z, and
   stamp-Y motion. IWSDK 0.4.2's patched ray pointer-capture path updates
   `event.point` at the held ray distance, so this avoids plane-parallel failure
   without touching private input APIs.
4. If direct `touch` is later added, branch on `event.pointerType === "touch"`
   and use `event.pointerPosition`/`event.point` rather than an orientation ray.

Apply the same non-screen `event.point` principle to draggable cards if runtime
testing shows hand-ray card motion stalling; their camera-facing plane is less
risky than the lever plane and should be changed only with regression coverage.

### P0 — Release/cancel ownership needs a single reusable cleanup operation

Per-object ownership is correctly exclusive: `activePointerId !== null` rejects
a second hand/controller, and movement/release events are accepted only from
the owner. Pointer capture on the dedicated hit mesh keeps the owner stable
outside the collider. Normal `pointerup` and `pointercancel` release correctly.

However, `setSuspended(true)` clears `dragging` and `activePointerId` without
explicitly releasing the captured pointer, and `dispose()` removes listeners
without first cancelling/releasing an active capture. IWSDK generally clears a
capture when its pointer is disabled, but relying on lifecycle ordering risks a
stale capture across visibility/session transitions.

Minimal repair: factor one `cancelActiveManipulation(meta)` helper that checks
`hasPointerCapture`, releases the recorded pointer ID, clears owner/drag state,
and begins return. Call it from `pointercancel`, suspension, placement restart,
and disposal. Do not synthesize an intent on cancellation. Add a pure/narrow
ownership test for second-pointer rejection and owner-only release.

### P1 — Hit targets are mostly adequate; preserve/verify the upgraded lever

- Current lever collider: `0.36 × 0.54 × 0.36`, centered at local Y `0.35`,
  surrounding the `0.115`-radius knob and stem. At MR scale 0.25 this is about
  `9 × 13.5 × 9 cm`, a reasonable controller/hand-ray target. It is an
  invisible, non-shadowing mesh and is the capture target. Preserve these
  dimensions or larger unless overlap testing shows it occludes a neighbor.
- Prop colliders are `0.42 m` cubes before MR scale (about `10.5 cm` each in
  MR). Cartridge colliders are `0.54 × 0.34 × 0.38` (about
  `13.5 × 8.5 × 9.5 cm`). Stamp collider is `0.32 × 0.38 × 0.32` (about
  `8 × 9.5 × 8 cm`). These are usable ray targets, but must be checked from both
  hands after placement and must not overlap adjacent enabled controls.
- The game enables only the expected gameplay target, substantially reducing
  overlap/occlusion ambiguity. Draggable informational cards remain enabled and
  may sit in front of controls; runtime ray testing must verify their layout
  does not steal hits.
- Invisible hit meshes are currently assigned the same pointer order as all
  visible descendants. They enclose their visible assemblies, so they should
  normally be the nearest hit. Verify the pointerdown event target in IWER; if a
  decorative descendant wins, give only the dedicated hit mesh a higher
  `pointerEventsOrder` or handle `pointerdown` at the entity root. Do not enlarge
  every descendant or add a second raycaster.

### P1 — Articulated-hand support is ray pinch/select, not proven near grab

`handTracking: true` is requested and both controller and hand sources feed the
same IWSDK ray pointer. On a conforming 0.4.2 runtime, a primary articulated
hand with select edges can start/hold/release the existing custom drag. The
application does not inspect controller-only pointer types, so no app-side
event filter blocks it.

The remaining compatibility risk is inside the pinned input runtime:
`XRInputManager.updatePointers()` marks a source connected only when it exposes
a gamepad and a `StatefulGamepad` was created. Physical-hand verification is
therefore mandatory; if a target headset exposes hand input without that
gamepad shape, this cannot be safely repaired by reaching into private
`MultiPointer` methods. Record it as a pinned-SDK/runtime gap and use controller
rays until a dedicated SDK upgrade/fix is approved.

### P1 — Current automated tests do not certify XR interaction

- `tests/e2e/hello-world.spec.ts` exercises mouse drags and one native Chromium
  touch drag. It does not generate IWSDK `ray` events, two-pointer contention,
  session interruption during capture, or hand pinch/select.
- `tests/model/control-fixtures.test.mjs` checks lever geometry, collider
  metadata, angles, and rack spacing, but `userData.interactionModes` is only a
  label—it does not prove IWSDK routing.
- There is no focused test for pointer ownership, cancellation cleanup, XR
  point-based projection, or lever threshold behavior under a scaled/rotated
  workbench.

Recommended narrow tests: extract pure helpers for pointer eligibility,
owner acquire/release, and local constrained sample application. Cover
`screen-touch`, `ray`, and `touch` event kinds; second-pointer rejection;
owner-only move/release; cancellation; root scale/rotation; lever Z clamp and
threshold; stamp Y clamp and threshold. Browser E2E should remain the desktop
and native-touch regression gate; IWER/physical headset remains the XR gate.

## Runtime test checklist

1. Run `npm run dev:status`; start the IWSDK dev runtime only if it is not
   already running. Confirm one browser/runtime connection and no duplicate
   server.
2. Enter immersive AR in Quest 3 IWER. Place, rotate, and confirm the workbench;
   inspect that `RayInteractable` entities appear in the ray descendant set and
   that no control has a grabbable component/handle competing with custom drag.
3. With the right controller ray/trigger, complete: fixture/prop drag and snap,
   lever pull past threshold and release, all three cartridge grabs and dock
   drops, stamp press, instruction/evidence/route/release card drag. Repeat with
   the left controller.
4. For every control, start on the center and then near each collider edge.
   Move outside the collider while held and release. Expect continuous motion,
   exactly one intent, and either snap or spring return—no loss, jump, or double
   dispatch.
5. Hold the lever with one controller; attempt to acquire it with the other.
   The first owner must retain it. Release the non-owner first, then the owner;
   the lever must trigger at most once and return home. Repeat for cartridge,
   prop/fixture, stamp, and a draggable card.
6. During an active grab, obscure the controller, switch input source, blur the
   session, exit XR, and re-enter. Expect cancellation, released capture, return
   home, and immediate reacquisition after re-entry.
7. Switch IWER to articulated hands. With each hand independently, aim the hand
   ray and pinch/select to repeat the full control list. Verify pointer type
   `ray`, down/move/up delivery, capture continuity, and no controller-only
   assumptions. Test slow pinches, brief pinches, and release while outside the
   collider.
8. If the emulator can synthesize direct fingertip touch, confirm it is not
   advertised as supported unless `PokeInteractable` was deliberately added.
   If added, test finger approach/withdrawal hysteresis and ensure a touch does
   not steal an active ray selection.
9. Repeat after moving/rotating the MR workbench and from front, left, and right
   viewpoints. Specifically hold the controller ray nearly parallel to the
   tabletop while pulling the lever; motion must remain continuous.
10. Exit and re-enter XR after completing an action. Confirm state persists,
    current target alone is enabled, rays/cursors recover, and console/page/
    network logs contain no pointer-capture, BVH, or input-source errors.
11. Capture `03-vr.webp` plus an XR report stating controller coverage, IWER hand
    coverage, physical-headset hand coverage, and any exact untested gap.

## Acceptance recommendation

Do not mark the articulated-hand/controller criterion complete until the P0
projection and capture-cleanup issues are addressed and the runtime checklist
passes. Keep `RayInteractable` as the single interaction route; treat
`useHandPinchForGrab` as unrelated unless the feature is intentionally redesigned
around SDK grabbable components in a separate change.
