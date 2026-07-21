# Visual and asset audit: scenery-hand-interactions

- Role: visual/asset specialist
- Date: 2026-07-21
- Scope: read-only audit of the current scene, shipped/source assets, transforms,
  animation, scale, grounding, and supplied desktop/mobile/MR evidence
- Implementation edits: none

## Executive diagnosis

The user-visible complaint is reproducible in the current hierarchy. The
Quaternius `Dino` mesh is skinned to `CharacterArmature`, but the procedural
helmet and both procedural eyes are siblings of that animated model under the
outer `kaiju` group. They follow authored whole-character translation/scale but
do not follow the animated `Head` bone. The result is a moving body beneath a
static hat and static, oversized eyes. This is most severe during the repeating
`Jump_Land`, `Yes`, `No`, and `Wave` clips.

The scene also ships substantially better semantic assets than it shows. All
three Quaternius vehicle GLBs and the Kenney lever GLB are in the critical
manifest but unused; visible service/route cars and the run-tests lever are
procedural replacements. Imported buildings are used, but `tintModel()` erases
all authored material separation, making them look like single-color blocks.

## Ranked findings and concrete recommendations

### P0 — Bind character accessories to the animated character, not its outer root

Locations/symbols:

- `src/kaiju-qa/scene.ts:1402-1434`: `kaijuAsset`, `kaijuModel`, outer `kaiju`
- `src/kaiju-qa/scene.ts:1436-1476`: `helmet`, eye construction loop
- GLB hierarchy: `CharacterArmature` -> `Root` -> `Body` -> `Hips` ->
  `Abdomen` -> `Torso` -> `Neck` -> `Head`

Evidence:

- `evidence/kaiju-qa/01-desktop.webp` shows white eyeballs approximately the
  width of the muzzle and a helmet visibly separated from the skull.
- `evidence/kaiju-qa/12-task-arrows-fixed.webp` catches the animated head/body
  moving away from the left eye while the eye remains in its outer-root pose.
- `evidence/kaiju-qa/09-mr-controller-drag.webp` and `10-mr-reentry.webp` expose
  the helmet silhouette independently at the bottom edge, making the separation
  especially obvious at close/headset viewpoints.

Recommendation:

1. Remove the two procedural eye assemblies entirely. The Quaternius Dino has
   an authored face and eyelids; duplicating its eyes creates the “popping out”
   effect. If extra expression is required later, use a small matte pupil/eyelid
   detail attached to the actual `Head` bone, not a second eyeball.
2. Resolve `const headBone = kaijuModel.getObjectByName("Head")` after fitting,
   create a named `kaiju-head-accessory-anchor`, and parent the complete helmet
   assembly to that animated node. Calibrate its local transform after the
   skeleton has updated, rather than retaining outer-root coordinates
   `(0, 0.57, 0.005)`.
3. Keep one stable assembly root for dome + brim. The brim must intersect/seat
   against the brow silhouette by roughly 1–2 cm in final scene scale; no visible
   air gap is acceptable from front, three-quarter, side, or overhead views.
4. Reduce the current helmet width from `0.36 m` to approximately `0.28–0.30 m`
   after attachment. The current brim is nearly the full torso/arm silhouette.
   Prefer a low-poly dome (12–16 radial segments) and a shallow rounded/elliptic
   brim over the current glossy-looking hemisphere plus rectangular plank.

Do not “fix” this by copying head position once per frame. Bone parenting is the
durable transform relationship and automatically handles every clip.

### P0 — Stop one-shot emotes from looping as perpetual body bounce

Locations/symbols:

- `src/kaiju-qa/scene.ts:1478-1491`: `AnimationMixer`, `actions`, `playAction`
- `src/kaiju-qa/scene.ts:2576-2580`: `resetKaiju`
- `src/kaiju-qa/scene.ts:2620-2650` area: `setCue`
- `src/kaiju-qa/scene.ts:2702-2723`: cue translation/scale overlays

The GLB contains 14 clips. Three are locomotion/idle candidates (`Idle`, `Walk`,
`Run`); reaction clips should be one-shot. `AnimationAction` defaults to repeat,
and `playAction()` never changes loop mode or returns a reaction to idle.
`Jump_Land` lasts only 0.333 s, yet its `Body.y` spans source units
`0.743..1.410` (about 13 cm after the current approximately 0.20 fit scale).
Repeated indefinitely, that reads exactly as a bouncing body. Even `Walk`
oscillates `Body.y` by about 3 cm at fitted scale; this is appropriate only while
the kaiju is visibly traveling.

Recommendation:

- Loop only `Idle`, `Walk`, and (if ever used) `Run`.
- Set `HitReact`, `No`, `Yes`, `Wave`, and `Jump_Land` to one-shot/clamped playback
  and transition to `Idle` on mixer `finished` or an explicit cue duration.
- For `level-change`, consider `Yes` or a single restrained `Jump_Land`; do not
  loop the 0.333 s landing clip.
- Avoid stacking the clip's vertical body motion with outer-root scale pulses in
  `verified`/`release`. A 3–5% single ease-out scale accent is sufficient; the
  current 7–12% growth becomes toy-like pumping when the clip also repeats.
- Reduced-motion must use a held neutral/recognizable pose, not a permanently
  enlarged character.

### P0 — Replace procedural vehicle stand-ins with the shipped Quaternius vehicles

Locations/symbols:

- `src/kaiju-qa/assets.ts:31-45`: `vehicleCar`, `vehicleSuv`,
  `vehicleEmergency` (all declared critical, none instantiated)
- `src/kaiju-qa/scene.ts:629-652`: `createServiceCar()` procedural spheres/boxes
- `src/kaiju-qa/scene.ts:1678-1685`: `serviceCar`, `propObjects.car`
- `src/kaiju-qa/scene.ts:1987-1999`: route actors clone the same procedural car

Recommendation:

- Use `vehicleCar` for the draggable service-car scenario, `vehicleEmergency`
  for the emergency route, and `vehicleSuv` or `vehicleCar` for the second
  established route. Preserve authored wheel/body/window material separation.
- Put each clone under a stable `vehicle-visual-root`, run `fitObject()` on the
  model, then rotate the visual root by about `Math.PI / 2` if needed so its
  authored +Z length aligns with the route code's +X-forward convention. Verify
  by direction of travel, not by assuming the FBX conversion pivot.
- Suggested final lengths: draggable car `0.34–0.38 m`; route actors
  `0.20–0.24 m`. The source bounds confirm the models are lengthwise in Z
  (`car 4.221`, `emergency 3.730`, `suv 4.209` source units), so fit by intended
  length rather than generic maximum size when clarity matters.
- Keep primitive geometry only for invisible hit targets, sockets, route traces,
  and state glyphs. Visible wheels/body/cab should come from the model.

### P1 — Preserve authored materials on Quaternius buildings

Locations/symbols:

- `src/kaiju-qa/scene.ts:525-540`: `tintModel()`
- `src/kaiju-qa/scene.ts:1182-1196`: `makeBuilding()`

`tintModel()` assigns one color and emissive value to every mesh material. It
therefore removes roof/window/door/facade differentiation. `addWindowGlow()` is
called afterward, but its brightness test now sees the flattened tint rather
than the source colors, so the intended bright-window selection is largely
defeated.

Recommendation:

- Keep original Quaternius materials/colors. If district identification needs a
  tint, adjust only a known facade/accent material or add one small civic-color
  base/plinth; do not recolor every material.
- Apply `addWindowGlow()` before any selective tint, or target named/bright
  materials captured from the original model. Keep emission subtle.
- Fit semantic height explicitly where possible. `fitObject(size)` currently
  fits the maximum of X/Y/Z; that produces inconsistent “size” meaning between
  the tall Flat/Hospital and wide Shop/House.

### P1 — Establish one surface datum and ground every visual root against it

Locations/symbols:

- `src/kaiju-qa/scene.ts:1121-1133`: table edge/surface; tabletop top is `y=0.04`
- `src/kaiju-qa/scene.ts:1182-1285`: buildings, district floors, roads, harbor,
  puddles, beacon
- `src/kaiju-qa/scene.ts:1730-1737`: `propHome`, `propTargets`

Current vertical references contradict one another:

- Tabletop top: `0.04`
- District floor tops: `0.016` (buried below tabletop)
- Road top: `0.0375` (approximately flush)
- Building fitted bottoms: `0.02` (2 cm buried)
- Prop interaction roots: `0.055`; procedural prop minima then hover roughly
  1.5–2.8 cm above the tabletop
- Harbor water top: `0.0245` and dock bottom: `0.015`, both substantially buried

Recommendation:

- Introduce one named `TABLETOP_SURFACE_Y = 0.04` datum.
- Give each imported/procedural visible model a wrapper whose local bounding-box
  minimum is normalized to `y=0`; place that wrapper at the datum plus only a
  `0.001–0.003 m` anti-z-fight offset. Keep interaction roots at their required
  drag-plane height by offsetting the visual child, not by visually floating it.
- Use overlays for district ground/water at `0.042–0.045`, or omit a district
  slab when the neutral tabletop is intended. Raise the harbor water/dock as a
  coherent pair.
- Leave road slabs flush or use thin inset decals. Buildings may sink at most
  2–3 mm to hide imperfect bases, never 2 cm.
- On every placement and return animation, verify contact shadows stay connected
  to tires/feet/base; a shadow separated from the object is a failing condition.

### P1 — Use the Kenney lever visual that is already shipped, while retaining a robust interaction rig

Locations/symbols:

- `src/kaiju-qa/assets.ts:51-55`: `labLever` declared but unused
- `src/kaiju-qa/control-fixtures.ts`: `createRunTestsLever()` is wholly procedural
- `src/kaiju-qa/scene.ts:2481-2508`: fixture placement/interaction wrapper

The shipped `lever-single.glb` is a semantic two-part model (`lever-single` base
plus `handle`) with `toggle-on`, `toggle-off`, and `toggle` clips. It will read
more intentionally than the current large pipe/ball silhouette.

Recommendation:

- Preferred visual approach: keep the tested authored fixture root, hinge math,
  label, and invisible forgiving hit target, but mount the Kenney lever base and
  handle as its visual shell. Drive its handle from the same normalized lever
  progress; do not run a second independent GLB animation during grab.
- If loader ownership makes that coupling too broad for this feature, restyle
  the procedural fixture to the Kenney proportions and palette, and remove
  `labLever` from `critical` rather than preloading an unused model.
- The label should remain a separate, front-facing plate. It must not float in
  front of, clip through, or visually become part of the movable handle.

### P2 — Replace only primitives whose silhouette fails to explain their purpose

Locations/symbols:

- `src/kaiju-qa/scene.ts:609-702`: `createTower`, `createCrosswalk`,
  `createCargo`, `createRainModule`
- `src/kaiju-qa/scene.ts:1691-1727`: rule cartridges

Recommended asset/primitive boundary:

- **Replace:** heavy cargo's plain yellow cube with the available Kenney
  `box-wide.glb` or `box-large.glb` from the committed Factory Kit source (add it
  to the prepared public subset/manifest first). Keep only thin procedural bands
  if they communicate secure/failed load state.
- **Improve or replace:** the six loose blocks in `createTower()` read as debris.
  Prefer one Quaternius building visual under a custom “fragile tower” wrapper,
  or build a coherent offset-tier tower with a continuous central core/base so
  it reads as architecture before it tilts.
- **Keep intentional primitives:** road slabs, crosswalk stripes, socket/halo,
  route ribbons, result glyphs, cartridge encoding, invisible interaction
  volumes, and simple rain puddles. Their geometry directly communicates system
  state and is clearer than decorative assets.
- **Simplify:** tutorial arrows currently combine an imported Kenney arrow with
  a procedural cone/stem (`scene.ts:1336-1400`), producing a doubled arrow seen
  in Stage 5. Choose one arrow silhouette per target. Prefer the imported arrow
  alone with a short, restrained vertical bob.

The full committed Kenney source contains 143 GLBs, but only 15 are in the
public audited subset. Do not load source paths at runtime. Promote only the
specific asset(s) selected above through `prepare-kaiju-qa-assets.py`, the public
manifest, credits/checksums, and `KAIJU_QA_ASSETS`.

### P2 — Reduce visual competition around the character and controls

Evidence and locations:

- `evidence/kaiju-qa/05-desktop-stage5.webp` and
  `12-task-arrows-fixed.webp` show three cartridge cards, two oversized arrows,
  large route X/check glyphs, a CONTACT badge, the evidence panel, character,
  buildings, dock, and lever all competing in the center-right half.
- `src/kaiju-qa/scene.ts:1336-1400`, `1663-1676`, `1881-2000` control several of
  those always-on-top shapes/cards.

Recommendation:

- Keep exactly one dominant action cue. Reduce arrow world height/width by
  roughly 25–35%, eliminate the doubled imported+primitive silhouette, and avoid
  placing it over the kaiju's face or helmet.
- Scale result glyphs relative to their route actor/building rather than the
  character; the current failure X can be taller than the kaiju torso.
- Keep decorative robot arms at the table perimeter, but ensure no required XR
  grab target sits behind their silhouettes from a normal standing approach.
- On portrait mobile, prioritize character + current prop + destination; panels
  can remain reduced/repositioned, but the world should not shrink until the
  kaiju face and control silhouettes become unreadable as in
  `evidence/kaiju-qa/02-mobile.webp`.

## Asset-use audit

| Family | Shipped | Currently visible/used | High-value remediation |
| --- | ---: | --- | --- |
| Quaternius character | 1 | `kaiju` | Keep model; remove duplicate eyes; bone-bind helmet |
| Quaternius buildings | 4 | All four | Preserve authored materials; normalize semantic height/grounding |
| Quaternius vehicles | 3 | None | Replace procedural service/route cars with car/emergency/SUV |
| Kenney lab public subset | 15 | Arrow, button, crane-magnet, robot-arm A/B, scanner, screen | Add lever visual; retain current meaningful dressing |
| Kenney public but unused | 8 | Lever, crane, warning, two indicators, machine, cog, conveyor | Do not add decoration merely to consume assets |
| Kenney committed source | 143 GLBs | Not runtime assets | Promote one cargo crate only if selected and documented |

## Visual acceptance checks

### Character attachment and motion

- At idle for 10 seconds, the authored face is unobstructed; there is one set of
  eyes, both eyes remain inside the face silhouette, and no helmet/body gap is
  visible.
- Capture front, 45-degree, side, and overhead frames during `Idle`, `Walk`,
  `HitReact`, `No`, `Yes`, `Wave`, and `Jump_Land`. Helmet/head separation must
  remain under 2 mm in scene scale; no accessory may lag or intersect the face.
- Leave each non-idle cue active for 5 seconds. It plays once and settles to
  idle; `Jump_Land` does not repeat.
- Feet/contact shadow remain planted during idle and after every one-shot cue.
  During locomotion, body travel and foot cycle agree directionally.
- Reduced-motion has no looped bounce, repeated scale pulse, or detached
  accessory.

### Scene coherence and assets

- Every visible car has an authored body, windows, and wheels and can be named
  as car/SUV/emergency from silhouette alone. Each points along its route.
- Buildings retain roof/window/door/facade contrast; no entire building is a
  single flat tint.
- In all four districts, inspect near/far/side views: bases, tires, props,
  harbor dock, water, roads, controls, and cards have no unexplained hover,
  tabletop clipping, or contradictory scale.
- The fragile tower reads as one structure before failure and tilts as one
  assembly. Heavy cargo reads as cargo before its label is read.
- Exactly one arrow silhouette marks the current object and one marks its
  destination; neither obscures the kaiju face or adjacent grab target.

### Desktop, mobile, and XR framing

- Desktop 1440x900 and 1920x1080: kaiju + current action target remain the first
  silhouette read; route/result graphics do not cover the character or controls.
- Mobile 390x844 and 430x932: character face, current prop, destination, and
  active control remain visually distinguishable without zooming.
- XR/IWER and physical-headset spot check: walk around at least 90 degrees and
  view from seated and standing heights. No flat accessory billboard effect,
  hidden grab target, submerged district surface, or floating base appears.
- Capture one motion frame per character cue plus one grounded overview per
  district; static initial-load evidence alone is insufficient to certify the
  attachment fix.

## Suggested implementation order

1. Remove duplicate eyes, bone-bind and resize helmet, and make emotes one-shot.
2. Establish the tabletop datum and normalize visible roots to it.
3. Swap procedural cars for the three shipped Quaternius vehicle roles.
4. Preserve building materials and simplify doubled arrows/result clutter.
5. Integrate the Kenney lever visual and optionally one promoted cargo crate.
6. Run desktop/mobile visual QA, then independent XR motion/grounding QA.
