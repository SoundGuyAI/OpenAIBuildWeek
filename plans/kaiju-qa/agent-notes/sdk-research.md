# IWSDK 0.4.2 architecture: Kaiju QA

Status: implementation-ready static guidance; no runtime certification

Snapshot: 2026-07-20

## Decision

Use three boundaries:

- src/kaiju-qa/game-model.ts: pure deterministic rules and release gate.
- src/kaiju-qa/scene.ts: one-time IWSDK entity construction and authored
  presentation.
- src/index.ts: World/XR startup, DOM wiring, visibility wiring, and one shared
  dispatch function.

The smallest safe core is discrete selection plus Run/Retry/Release. It needs no
physics, locomotion, required grabbing, live model call, random outcome,
pathfinding, or creature rig.

## Pinned 0.4.2 facts

- package.json and the installed @iwsdk/core package are 0.4.2.
- World.create owns the update/render loop. Do not add another
  requestAnimationFrame loop.
- world.createTransformEntity(object, { parent }) is public and adds Transform;
  non-persistent entities are attached to the active level.
- RayInteractable and Pressed are public in 0.4.2. Interactable is the exact
  deprecated alias of RayInteractable and is the repository-required spelling.
- InputSystem adds/removes Pressed; application code must not manage it.
- Canvas pointer forwarding is enabled for non-XR browser pointer/touch input by
  default. XR rays use the same interactable roots.
- GrabSystem 0.4.2 does not expose forceRelease/getHolderHand. Avoid those APIs.
- world.visibilityState reports XR session visibility, not ordinary browser-tab
  visibility. Browser suspension also needs document.visibilityState.
- entity.dispose recursively disposes descendant geometry/materials/textures.
  It is unsafe for an individual entity that shares those resources.
- World.launchXR/exitXR return void. Preserve the existing src/xr-support.ts
  wrapper rather than replacing the session path.

Primary local evidence:

- node_modules/@iwsdk/core/dist/ecs/world.d.ts and world.js
- node_modules/@iwsdk/core/dist/input/state-tags.d.ts
- node_modules/@iwsdk/core/dist/input/input-system.js
- node_modules/@iwsdk/core/dist/input/canvas-pointer-system.d.ts
- node_modules/@iwsdk/core/dist/grab/grab-system.d.ts
- node_modules/@iwsdk/core/dist/init/world-initializer.js
- node_modules/elics/lib/query.d.ts

## Pure model seam

The model imports no IWSDK, Three.js, DOM, time, or randomness.

Recommended exports:

    export type KaijuQaAction =
      | { type: "advance-tutorial" }
      | { type: "add-fragile-tower" }
      | { type: "select-guardrail"; id: GuardrailId }
      | { type: "run-suite" }
      | { type: "presentation-complete"; id: number }
      | { type: "retry" }
      | { type: "release" }
      | { type: "reset" };

    export interface KaijuQaTransition {
      state: KaijuQaState;
      cue: SceneCue;
      presentationId: number | null;
      rejection?: string;
    }

    export function createInitialKaijuQaState(): KaijuQaState;
    export function transitionKaijuQa(
      state: KaijuQaState,
      action: KaijuQaAction,
    ): KaijuQaTransition;
    export function deriveKaijuQaView(state: KaijuQaState): KaijuQaView;

Required invariants:

- Baseline: stalled car passes, suite remains partial.
- Added tower without guardrail: tower fails.
- FREEZE NEAR BUILDINGS: tower passes, ambulance regresses.
- SLOW IN STRIPED ZONES: complete suite passes.
- Release is separate, one-shot, and legal only after the latest complete pass.
- Run/Release duplicates and stale presentation-complete IDs are no-ops.
- Retry cancels only transient presentation/lock and preserves useful evidence.
- Reset returns the canonical initial state and invalidates stale presentation
  IDs.

## Scene module API

Use this narrow public contract:

    import type { World } from "@iwsdk/core";
    import type {
      KaijuQaAction,
      KaijuQaView,
      SceneCue,
    } from "./game-model.js";

    export interface KaijuQaPresentation {
      view: KaijuQaView;
      cue: SceneCue;
      presentationId: number | null;
    }

    export interface KaijuQaScene {
      present(value: KaijuQaPresentation): void;
      setSuspended(suspended: boolean): void;
      setReducedMotion(reduced: boolean): void;
      resetView(): void;
      dispose(): void;
    }

    export function createKaijuQaScene(
      world: World,
      options: {
        dispatch: (action: KaijuQaAction) => void;
        reducedMotion: boolean;
      },
    ): KaijuQaScene;

Contract:

- Call createKaijuQaScene exactly once after World.create resolves.
- present is idempotent by view revision/presentation ID.
- Scene code presents view state; it never calculates scenario outcomes or
  release eligibility.
- In-world controls dispatch the same KaijuQaAction values as DOM controls.
- Scene animation may dispatch only presentation-complete with its active ID.
- Retry/reset/XR re-entry never recreate the root, systems, entities, resources,
  or listeners.
- resetView only recenters the table/player-camera presentation. Game reset is a
  separate model action.
- dispose is final teardown only, never retry.

## Safe RayInteractable/Pressed pattern

Use Interactable when adding the component because AGENTS.md requires it.
In shipped 0.4.2 it is the same component object as RayInteractable.

Recommended control system:

    const ControlAction = {
      Run: "run-suite",
      Retry: "retry",
      Release: "release",
      Reset: "reset",
    } as const;

    const KaijuControl = createComponent("KaijuControl", {
      action: {
        type: Types.Enum,
        enum: ControlAction,
        default: ControlAction.Run,
      },
    });

    class KaijuControlSystem extends createSystem({
      pressedControls: {
        required: [Interactable, Pressed, KaijuControl],
      },
    }) {
      init() {
        this.cleanupFuncs.push(
          this.queries.pressedControls.subscribe("qualify", (entity) => {
            const action = entity.getValue(KaijuControl, "action");
            dispatchControlAction(action);
          }),
        );
      }
    }

Why this is safe:

- Pressed qualification occurs once when InputSystem adds the tag on pointer
  down.
- It does not execute once per frame while held.
- The returned unsubscribe function is cleaned up with the system.
- Application code never adds/removes Pressed.

Guardrails:

- The reducer still rejects duplicate/illegal actions.
- Do not wait for Pressed removal to unlock game state; session loss could occur
  before pointer-up.
- Use simple generous proxy meshes for controls. InputSystem builds mesh BVHs,
  so do not rebuild interactable geometry/topology during play.
- Required XR controls must be controller-ray usable. Hand tracking, poke,
  near-grab, haptics, and two-handed gestures are optional only.

## createTransformEntity hierarchy

Create one root:

    const rootObject = new Group();
    rootObject.name = "KaijuQaRoot";
    const rootEntity = world.createTransformEntity(rootObject);

Create each independently animated or interactive semantic object under it:

    const towerObject = buildTowerObject(resources);
    towerObject.name = "FragileTower";
    const towerEntity = world.createTransformEntity(towerObject, {
      parent: rootEntity,
    });

Recommended entity roots:

- tabletop/district;
- kaiju;
- stalled car;
- ambulance;
- fragile tower;
- pre-authored route/trace groups;
- scenario evidence markers;
- each world-space action button;
- finale effect root.

A static compound building may contain Mesh children assembled with Group.add
before its root becomes an entity. Any child needing independent transform,
visibility, interaction, or lifetime gets its own createTransformEntity call.

Never use world.scene.add for gameplay roots. Do not mark the gameplay root
persistent; normal XR exit/re-entry does not unload the active level.

## Geometry/material reuse

Allocate once during scene creation:

- one unit BoxGeometry reused via scale for buildings, roads, vehicles, buttons,
  and evidence tiles where silhouettes permit;
- a small fixed set of additional primitive geometries for kaiju/route shapes;
- a finite material palette for neutral, selected, pass, fail, regression,
  route, kaiju, and finale states;
- scratch Vector3/Quaternion/Color objects outside update;
- all route segments, evidence slots, and expected attempt traces.

State changes should swap pre-created material references. Do not mutate one
shared material when only one object should change.

Preallocate the expected attempt/evidence slots. Retry and rerun update existing
objects; they do not create entities, geometries, materials, textures, canvas
labels, or listeners.

World-space buttons should be simple fixed box/proxy hierarchies with
Interactable. The critical path does not need DistanceGrabbable.

Resource lifecycle:

- Retry/reset: mutate existing objects only; call neither destroy nor dispose.
- Final teardown: unsubscribe first, destroy owned entities child-to-root
  without recursive resource disposal, then dispose each unique shared
  geometry/material/texture exactly once.
- Never call entity.dispose on one entity in a shared-resource pool.

## Deterministic authored animation

The model decides outcomes before animation starts. The scene only reveals them.

Use fixed named tracks:

- baseline-partial;
- tower-failure;
- ambulance-regression;
- targeted-pass;
- release-finale.

Each track uses cached points/poses and normalized progress inside one IWSDK
system:

    elapsed = Math.min(duration, elapsed + Math.min(delta, 0.05));
    const t = duration === 0 ? 1 : elapsed / duration;

Rules:

- no physics, randomness, setInterval, second requestAnimationFrame loop, or
  unscoped timeout chain;
- no vector/array/material/geometry allocation in update;
- a new presentation ID cancels the old track and first applies the canonical
  pose derived from the new view;
- suspension freezes elapsed;
- reduced motion applies the same final pose/evidence immediately;
- completion dispatches once with the active presentation ID;
- capped delta prevents resume from skipping the evidence beat.

## DOM, lifecycle, and reset

DOM is the accessible browser/mobile control layer: native buttons, keyboard
focus, disabled states, live status, visible focus, and at least 44 CSS-pixel
touch targets. DOM dispatches model actions; it does not mutate scene state.

If XR gameplay is claimed, the essential Run/Add Scenario/Guardrail/Retry/
Release/Reset controls and a compact goal/result board must also exist in world
space. DOM overlays must be assumed absent in immersive XR.

Create state, scene, systems, subscriptions, and listeners once. Use one shared
dispatch pipeline:

    action
      -> transitionKaijuQa
      -> deriveKaijuQaView
      -> render DOM
      -> scene.present

Retry:

- cancels active presentation through a new revision/ID;
- restores canonical poses;
- preserves attempt evidence;
- does not reload, recreate World, or re-register anything.

Reset:

- performs the model reset and canonical scene pose reset;
- remains separate from resetView/recenter.

Visibility must combine browser and XR state:

    const xrPaused =
      world.visibilityState.value === VisibilityState.Hidden ||
      world.visibilityState.value === VisibilityState.VisibleBlurred;
    const pagePaused = document.visibilityState !== "visible";
    scene.setSuspended(xrPaused || pagePaused);

Subscribe once to world.visibilityState and document visibilitychange.
VisibilityState.NonImmersive is active browser mode, not paused.

XR exit/re-entry:

- preserve src/xr-support.ts;
- never rebuild model/scene on Visible or NonImmersive changes;
- session entry/exit changes input/presentation only, not game state;
- do not hold a model lock until Pressed release;
- verify re-entry at runtime before claiming reliability.

## Smallest merge-safe integration edit

Only src/index.ts needs shared integration after the two modules land:

1. Preserve World.create, xr-support.ts usage, error handling, and
   data-iwsdk-ready behavior.
2. Remove Hello World/FloatingWord-specific construction and imports.
3. Import the model reducer/view functions and createKaijuQaScene.
4. Create one state variable and one dispatch function.
5. Wire semantic DOM and scene controls to that dispatch function.
6. Forward reduced-motion and combined browser/XR suspension once.

No package, lockfile, Vite, XR helper, external asset, or new UI-toolchain
change is required.

## Static validation completed

- npm run typecheck: PASS.
- Production Vite build redirected outside the repository: PASS, 493 modules.
- The unchanged baseline emitted its existing large-chunk warning and emitted
  code-split Havok files despite physics: false. Build output alone cannot prove
  whether those files are fetched at runtime.
- Browser E2E, preview, iwsdk dev, reference tools, IWER, and headset execution
  were not run.

## Explicit no-runtime-certification gaps

Static inspection/typecheck/build cannot certify:

- immersive session entry on the target browser/headset;
- left/right controller-ray activation of world-space controls;
- physical mobile touch accuracy;
- Pressed cleanup or duplicate prevention across actual XR session loss;
- browser camera restoration after session end;
- document/XR visibility event ordering;
- exit/re-entry during animation, failure, retry, and release;
- in-headset board readability, target reach, reduced-motion comfort, or 72 Hz
  performance;
- hand-tracking/layers negotiation;
- runtime network loading of code-split Havok assets.

Until authorized IWER and physical-headset checks run, the valid conclusion is:

> The design uses the inspected public IWSDK 0.4.2 API and preserves the
> existing XR entry architecture. XR gameplay, lifecycle, comfort, readability,
> and performance are not runtime-certified.
