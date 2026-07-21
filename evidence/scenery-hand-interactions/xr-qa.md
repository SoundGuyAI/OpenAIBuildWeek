# XR and hand-interaction QA — scenery-hand-interactions

Reviewed: 2026-07-21
Branch: `fix/scenery-hand-interactions`
SDK: `@iwsdk/core` / `@iwsdk/xr-input` 0.4.2
Role: independent XR/hand QA; no implementation files were changed

## Verdict

**Static implementation review: pass with runtime conditions.** The P0 issues
from the XR audit are addressed in the gameplay manipulation path: non-screen
motion uses the captured IWSDK event point, direct poke and ray interaction are
registered on the same ECS entities, one pointer owns a manipulation at a time,
and active capture is cancelled during suspension, placement restart, and
disposal. The lever has a suitably forgiving dedicated target.

**IWER session and ECS registration smoke: pass.** Runtime evidence obtained by
the orchestrator after the initial static pass shows an IWSDK/IWER Meta Quest 3
runtime connected, `xr enter` succeeding, hand tracking present in the session
features, and both controllers and hands reported connected. Runtime ECS
inspection found `prop-car` entity 25, `run-tests-lever` entity 33, and
`release-stamp` entity 34 active with `Transform`, `LevelTag`, `RayInteractable`,
and `PokeInteractable`. This proves that representative gameplay entities are
registered in the live immersive session through both IWSDK interaction paths.

**IWER right-controller core manipulation: pass for the exercised path.** A
right-controller select confirmed placement on a valid horizontal reticle. A
right-controller ray then acquired car entity 25 at local
`[-0.72, 0.055, 0.87]`, moved it, and released it snapped exactly to
`[-0.82, 0.055, 0.28]`. Next, the right controller held the lever while the left
controller attempted acquisition; the right owner retained control while moving
outside the hit target. After the competing attempt released, the right owner
pulled through the threshold and released. The UI advanced exactly once from
“Record the baseline” to the “Add fragile…” / “Add an edge case” step with the
tower highlighted. The browser
warn/error query returned an empty result. This certifies controller placement,
ray acquisition, captured motion outside the collider, representative drop
snap, lever threshold/release, exclusive lever ownership, and single intent on
the exercised IWER path.

**IWER articulated-hand manipulation: attempted but not actionable.** Hand mode
was tested separately using hand-right `set-select-value` pinch with
move/release, and with direct fingertip approach/pull/withdraw. Neither advanced
the lever. The live application entities still expose both `RayInteractable`
and `PokeInteractable`; the observed limit is consistent with the pinned IWSDK
0.4.2 hand-ray gamepad gate and this emulator session not producing an
actionable hand pointer for either attempt. It is not evidence of successful
hand manipulation.

**Full XR/physical-hand acceptance: not certified.** Remaining controls, full
left-controller operation, cancellation across session exit/re-entry, and a
real headset were not exercised. In particular, emulator input-source presence
does not prove physical-hand behavior. The physical Quest/headset hand path
remains a required device follow-up.

Runtime image: [`03-iwer.png`](./03-iwer.png), an 800 × 800, 8-bit RGB,
non-interlaced PNG (112 KB). Visual inspection shows the workbench placement
step inside the Meta Quest 3 emulator with both controller models visible. It is
valid session/placement smoke evidence, not proof of a completed manipulation.

Controller action image: [`04-iwer-controller-lever.png`](./04-iwer-controller-lever.png),
an 800 × 800, 8-bit RGB, non-interlaced PNG (95 KB). Visual inspection shows the
placed workbench after the lever action with the “Add an edge case” instruction
visible and the tower target highlighted. The exact-once transition and input
sequence are supported by the accompanying live runtime inspection, not by the
still image alone.

## Code verification

### Gameplay manipulation entities

- `registerManipulation` creates every prop/fixture, rule cartridge, lever, and
  stamp with `world.createTransformEntity`, then adds both `RayInteractable` and
  `PokeInteractable` (`src/kaiju-qa/scene.ts:2167-2169`). This places the same
  entity hierarchy in IWSDK's ray and touch descendant sets; there is no custom
  raycaster or competing grabbable component.
- The event guard is input-agnostic. It rejects non-primary buttons only for
  `screen-*` pointers and otherwise admits IWSDK `ray` and `touch` events that
  provide the normal `ray` and `point` fields (`scene.ts:2194-2203`). There is no
  controller-only pointer-type filter.
- `PokeInteractable` is meaningful under 0.4.2, not metadata: `InputSystem`
  registers these roots in `scene.touchDescendants`, and `MultiPointer` gives
  direct touch priority over grab and ray. The SDK touch pointer uses the hand
  index-tip space, auto-selects at 2 cm, and applies enter/exit hysteresis. Its
  sphere pointer events expose `point`, `pointerPosition`, `pointerQuaternion`,
  and a derived `ray`, so they satisfy the scene event parser.
- Draggable information cards remain `RayInteractable` only
  (`scene.ts:1464-1468`). They are statically eligible for controller-trigger
  and articulated-hand ray pinch/select; they do not claim direct fingertip
  poke support.

### Non-screen projection

- For every gameplay manipulation, `ray` and `touch` movement copies
  `pointerEvent.point`; only `screen-*` input reconstructs a camera ray and
  intersects the authored plane (`scene.ts:2173-2193`). The sampled world point
  is transformed through the workbench root before the initial offset and
  constrained object position are applied (`scene.ts:2227-2247`). This removes
  the plane-parallel controller/hand-ray failure called out in the audit and is
  compatible with a translated, rotated, or uniformly scaled MR root.
- Under pointer capture, pmndrs/IWSDK 0.4.2 updates a ray capture's point at the
  held distance and updates a touch capture's point from fingertip motion. That
  makes `event.point` the correct public event-level sample for both routes.
- Cards still use their camera-facing ray plane. That path was outside the
  gameplay projection remediation and remains a runtime check: near-parallel
  hand/controller rays could still stall a card drag until proven otherwise.

### Ownership and cleanup

- `activePointerId !== null` prevents a second controller, hand, or poke pointer
  from taking ownership; move and release are owner-only
  (`scene.ts:2197-2200`, `2237-2242`, `2249-2255`). Pointer capture is taken on
  the dedicated event target, so leaving the collider while held should not
  lose the interaction (`scene.ts:2234`).
- Normal `pointerup` and `pointercancel` clear owner/drag state; cancel returns
  the object without dispatching an intent (`scene.ts:2249-2264`). In the SDK,
  `Pointer.up()`/`cancel()` may clear internal capture immediately before the
  corresponding event, so the handler's guarded release is correctly
  idempotent.
- `cancelActiveManipulation` explicitly releases capture when it is still held,
  clears ownership, and begins return (`scene.ts:267-279`). It is used for
  session/app suspension (`scene.ts:2709-2724`), placement restart
  (`scene.ts:2773-2786`), and disposal before listeners/entities/resources are
  removed (`scene.ts:2857-2877`). This addresses stale capture across those
  lifecycle transitions.

### Lever target

- The dedicated invisible hit target is `0.36 × 0.54 × 0.36` local units,
  centered at local Y `0.35`, enclosing the `0.115`-radius grip and stem
  (`src/kaiju-qa/control-fixtures.ts:20-26`, `336-359`). At the default 0.25 MR
  scale it is approximately `9 × 13.5 × 9 cm`, large enough for controller and
  hand rays while remaining separated from the stamp and rule dock in the
  authored layout.
- The hit mesh is invisible, non-shadowing, and is the actual named capture
  target. The fixture test verifies its dimensions, placement, interaction-mode
  metadata, and exclusive-capture label. Those tests validate construction,
  not live XR routing.

### Placement prerequisite

- The initial IWER placement path required accepting valid horizontal normals
  with either plane winding. `isHorizontalPlacementNormal` now uses the absolute
  normalized dot product against world up, so both `(0, 1, 0)` and
  `(0, -1, 0)` qualify while surfaces beyond the 20-degree limit remain invalid
  (`src/kaiju-qa/mr-placement-model.ts:3-12`).
- `tests/model/mr-placement.test.mjs:27-49` covers upward and downward normals,
  the 19/21-degree threshold boundary, a vertical normal, and a zero vector.
  With that prerequisite fixed, live right-controller selects confirmed the
  workbench on the cyan horizontal reticle.

### Articulated-hand ray caveat in pinned IWSDK

- `handTracking: true` is requested and `RayInteractable` uses the same
  `MultiPointer` ray `selectStart`/`selectEnd` lifecycle for controller trigger
  and primary-hand pinch/select. `useHandPinchForGrab: true` is not what makes
  these controls work: the controls have no grabbable components and their
  constrained manipulation remains the sole owner.
- IWSDK 0.4.2 currently sets a primary input source `connected` for pointer
  processing only when the source exposes a gamepad and a `StatefulGamepad` is
  created. Therefore hand-ray pinch/select is only statically supported for
  runtimes that expose that gamepad shape. A physical headset must prove the
  target browser/runtime does so; this cannot be certified from code or browser
  mouse/touch tests.

## Controller and hand test matrix

| Surface/input | Required exercise | Status in this pass |
| --- | --- | --- |
| IWER Meta Quest 3 session | Connect runtime, enter XR, request hand tracking | **Pass** — connected; `xr enter` succeeded; hand-tracking feature present |
| IWER input-source presence | Confirm controllers and articulated hands connect | **Pass** — both reported connected; action results are separated below |
| IWER ECS interaction registration | Inspect representative prop, lever, and stamp | **Pass** — entities 25/33/34 active with Transform + LevelTag + RayInteractable + PokeInteractable |
| IWER placement | Confirm on valid horizontal reticle with controller selects | **Pass** — right-controller selects confirmed placement after the two-winding normal fix |
| IWER right controller ray/trigger | Prop/fixture snap, each cartridge, lever threshold/release, stamp, every draggable card | **Partial pass** — car exact snap and lever threshold/release passed; remaining props, cartridges, stamp, and cards not run |
| IWER left controller ray/trigger | Same sequence, including edge hits and release outside target | **Partial** — competing lever acquisition attempted; full left-controller sequence not run |
| IWER two-controller ownership | Hold with one side, attempt acquire/release with the other; exactly one intent | **Pass for lever** — right retained ownership against left attempt, moved outside, and dispatched exactly once on right release |
| IWER right articulated hand ray/pinch | Full gameplay controls and cards; slow/brief pinch and outside release | **Attempted, no action** — `set-select-value` pinch plus move/release did not advance lever |
| IWER left articulated hand ray/pinch | Same sequence and pointer-type/event continuity | Not run — hand presence only |
| IWER direct fingertip poke | Lever, cartridges/fixtures, and stamp; touch must not steal an active ray | **Attempted, no action** — right fingertip approach/pull/withdraw did not advance lever; PokeInteractable registration is live |
| IWER transformed workbench | Repeat from front/left/right after translate, rotate, and scale; include nearly parallel ray | Code path reviewed; not run |
| IWER lifecycle | Move outside while held; cancel/switch source; exit/re-enter XR; reacquire | **Partial pass** — outside-collider controller capture passed; cancellation and exit/re-entry not run |
| IWER console | Query browser warnings and errors after actions | **Pass** — empty result |
| Physical headset controllers | Both hands/controllers, edge acquisition, continuous capture, no duplicate intent | Not run |
| Physical headset articulated hands | Ray pinch/select and direct poke on the target headset/browser | Not run — mandatory gap |

For manipulation certification, confirm the event target is the dedicated hit
mesh, capture pointer event/type and intent traces, watch console/page logs for
pointer-capture/BVH/input-source errors, and save action evidence in addition to
the placement image. Controller and articulated-hand coverage must be reported
separately.

## Exact residual gap

The connected IWER session, hand-tracking feature, controller/hand presence,
representative ECS registration, horizontal placement, right-controller car
snap, outside-collider lever capture, two-controller lever ownership, exact-once
lever intent, and clean browser log are proven. The separately attempted IWER
hand pinch/select and direct fingertip paths did not produce an actionable hand
pointer or advance the lever.

The application path is live and correctly exposes `RayInteractable` plus
`PokeInteractable`; the exact remaining hand limitation is that IWSDK 0.4.2
gates pointer processing on a gamepad-backed primary input source, while this
IWER hand mode did not produce an actionable hand pointer through either
attempt. A physical headset/browser may expose different input-source behavior,
so physical ray pinch/select and direct poke remain mandatory device follow-up,
not an emulator-certified pass or a justified application-side workaround.
Remaining controller gaps are the unexercised props/cartridges/stamp/cards, full
left-controller parity, session cancellation/re-entry, transformed-workbench
angles, and the near-parallel card drag. Report the current state as
**IWER controller core path certified; emulator-hand and physical-hand paths not
certified**.
