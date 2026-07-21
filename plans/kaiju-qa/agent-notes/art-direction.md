# Art direction, motion, and asset policy: Kaiju QA

- Role: art director / motion director / asset and licensing researcher
- Date: 2026-07-20
- Status: implementation-ready discovery note
Protected approach: code-native primitives first; no asset generation or download
was performed for this task.

## Direction in one sentence

Build a matte low-poly **civic testbench**: one friendly, rounded baby kaiju moves
through a crisp rectilinear miniature city while persistent planar evidence makes
every happy path, edge-case failure, regression, and verified fix legible without
needing narration.

The visual story is not “monster destroys city.” It is “a conscientious team
tests a powerful helper before release.” Comedy comes from gentle, authored
misunderstandings and the kaiju's concerned reactions, never from panic, injury,
or uncontrolled destruction.

## Source synthesis and decisions

This direction carries forward the useful parts of the concept proposal and its
Azure FLUX planning image: the tabletop lab, yellow safety helmet, teal/coral/
lime/yellow family, central kaiju silhouette, miniature city, and retained route
echoes. It deliberately does not carry forward the expensive or misleading
parts of the image: robot arms, detailed lab shelves, glossy toy plastic, giant
cinematic eyes, depth-of-field blur, traffic-light-only status, or a dense
background.

Read-only references:

- `plans/kaiju-qa/PLAN.md`
- `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/PROPOSALS.md`
- `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/ASSET_PLAN.md`
- `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/AZURE_FLUX_PROMPTS.md`
- `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/plans/loop-engineer-concepts/agent-notes/art-direction.md`
- `C:/UnityProj/Tmp/Flux-Image-Generation.md`

## Non-negotiable visual contract

1. The protected core is complete with primitive geometry, shared materials, and
   authored poses. It needs no texture, imported model, physics, post-processing,
   backend, or generated image.
2. The kaiju is the only predominantly rounded, organic form. Buildings,
   fixtures, sockets, guardrails, and evidence use straight edges and simple
   geometric profiles. This contrast makes the actor readable immediately.
3. Evidence sits visually above the simulation. A route trace may cross a road,
   but buildings and decoration may never cover a trace, scenario pin, or result
   badge from the default camera.
4. Pass, partial, fail, regression, untested, and current action are never
   color-only. Every state also has a distinct contour, line pattern, endpoint,
   icon, and short DOM label.
5. The camera stays stable during diagnosis. There is no impact shake, whip-pan,
   full-screen flash, uncontrolled toppling, or physics debris.
6. The scene remains understandable with bloom, transparency, shadows, motion,
   and all optional polish disabled.

## Exact palette

All values are sRGB hex. Use the same state colors in the scene and DOM. Scene
materials should remain matte and slightly desaturated; emission is a small
legibility lift, not neon glow.

| Token | Hex | Use | Required non-color pair |
| --- | --- | --- | --- |
| `ink-950` | `#0B1620` | Page/scene background, deep HUD panels | Solid field |
| `ink-800` | `#26363D` | Roads, table edge, dark prop details | Rectilinear mass |
| `paper-100` | `#F6EEDC` | Primary text, tabletop top, kaiju belly | Light matte plane |
| `paper-300` | `#D8D0BE` | Neutral buildings and inactive fixtures | Neutral block |
| `text-muted` | `#B9C6C9` | Secondary DOM copy only | Text label |
| `civic-teal` | `#35A99B` | Kaiju skin, selected city family | Organic actor / civic block |
| `teal-shadow` | `#1E6A66` | Kaiju dorsal plates, teal shadow faces | Dark triangular detail |
| `active-cyan` | `#55D6E2` | Current trace, keyboard focus, tutorial target | Chevron line / double outline |
| `safety-yellow` | `#F2C14E` | Helmet, caution fixtures, slow-zone stripe | Brim / diagonal stripe |
| `pass-lime` | `#A6CF55` | Passing scenario and verified release | Continuous rounded line + check |
| `fail-coral` | `#F06A5D` | Failure and regression | Broken angular line + X/notch |
| `untested-slate` | `#7D8E95` | Untested and inactive evidence | Dotted line + hollow diamond |

Rules:

- `pass-lime` and `fail-coral` never touch without an `ink-950` or `paper-100`
  separator.
- `active-cyan` means “look here / this is happening now,” not success.
- `safety-yellow` is caution and character identity, not pass/fail.
- DOM text on `ink-950` uses `paper-100`; `untested-slate` is not body text.
- No additional saturated accent is introduced without removing one above.

## Material and lighting recipes

- Primitive surfaces: `flatShading: true`, `metalness: 0`, roughness `0.72–0.9`.
- Tabletop and paper surfaces: roughness `0.9`; no texture or normal map.
- Evidence: roughness `0.45`, emissive color equal to base color at intensity
  `0.12–0.2`; no bloom required.
- Helmet: roughness `0.62`; it may be slightly smoother than the body but never
  glossy.
- Core transparency budget is zero. If a retained prior trace must fade, prefer
  a darker opaque material. Alpha is a last resort, capped under Performance.
- Use one warm directional key (`#FFE1A6`) with shadows and one cool ambient fill
  (`#9ECBC8`) without shadows. No animated lights, point-light beacons, reflection
  probes, or baked lightmaps.
- Background is a solid `ink-950`. The lab is implied by the table and HUD, not a
  modeled room.
- UI panels use an opaque `ink-950`/`ink-800` fill and a one-pixel border. Avoid
  `backdrop-filter`, large blurred shadows, glassmorphism, and animated gradients.

## Code-native geometry system

Use shared low-segment `BoxGeometry`, `CylinderGeometry`, `ConeGeometry`,
`SphereGeometry`, and small custom wedge/strip buffers imported from
`@iwsdk/core`. Parent articulated pieces under groups and animate transforms;
do not require a skeleton.

### Baby kaiju

- Overall tabletop height: `0.42 m`; width including arms: `0.31 m`.
- Proportion by height: head/helmet `34%`, torso `42%`, legs/feet `24%`.
- Build from one faceted head ellipsoid, one pear-shaped torso, a small muzzle,
  two short arms, two planted feet, a three-segment tapered tail, and exactly
  three triangular dorsal plates.
- Helmet dome plus brim extends `10–12%` beyond the head width. The helmet is the
  strongest silhouette cue after the tail and dorsal plates.
- Eyes are matte dark discs no larger than `8%` of head width. Avoid giant glossy
  eyes, visible teeth, claws, spikes aimed forward, armor, or a combat stance.
- Neutral pose leans forward by `4°`, hands visible, feet apart. Concern pose
  turns the head and opens the hands; it never cowers or appears punished.
- Budget: under `700` visible triangles, at most `12` draw parts, four shared
  materials (`civic-teal`, `teal-shadow`, `paper-100`, `safety-yellow`).

### City and scenario props

- Use four building silhouettes only: flat roof, stepped roof, wedge roof, and
  fragile tower. Each ordinary building is one or two meshes and under `120`
  triangles. Windows are a few dark inset blocks, never repeated texture grids.
- Ordinary building heights use `0.24`, `0.31`, and `0.38 m`. The fragile tower
  is `0.56 m`, at least `2.1×` the median neighboring building, with three
  visibly offset tiers and a wide top. It must look precarious before it moves.
- The tower pivots as one authored group into a visible safety cradle. No pieces
  detach, fall off the table, or use physics.
- Stalled car: compact two-box profile, `0.18 m` long, low roof, four shared dark
  wheels. Ambulance: `0.25 m` long, taller rear box, wedge cab, and one roof
  beacon. Do not use a medical cross, writing, brands, or real vehicle livery.
- Scenario sockets are `0.26 m` wide shallow hexagonal pads with a raised key
  shape. Occupied sockets lower by `0.012 m`; no precision placement is implied.
- Broad `FREEZE NEAR BUILDINGS`: a full circular fence/ring around the building
  cluster with evenly spaced square posts. It must visibly block more space than
  the tower requires.
- Targeted `SLOW IN STRIPED ZONES`: a narrow `0.28 m` road corridor using
  alternating `safety-yellow` and `paper-100` diagonal chevrons. It never wraps
  an entire building or intersects the ambulance lane.

### Shape hierarchy

At the default camera, preserve these silhouette priorities:

1. helmet + tail + three dorsal plates = kaiju;
2. tall offset stack = fragile tower;
3. long high-roof vehicle + beacon = ambulance;
4. full perimeter posts = over-broad freeze policy;
5. narrow striped road patch = targeted slow policy;
6. continuous/broken route ribbons = evidence, not roads.

If a prop cannot be named from its silhouette in solid black, simplify it before
adding color or detail.

## Tabletop composition

Use a rounded rectangular plinth, not a circular arena, so the two paths and
their regression can be compared side by side.

- Local tabletop footprint: `2.8 m × 1.8 m`; surface thickness `0.10 m`.
- XR surface height: `0.78 m`; center approximately `1.3 m` in front of the
  standing origin. All required interaction stays within a `1.05 m` horizontal
  reach or is available through ray/DOM controls.
- Main road runs from local `(-1.15, +0.52)` through `(0, +0.05)` to
  `(+1.10, -0.42)` in X/Z. It creates a readable diagonal instead of a flat
  side-on lane.
- Kaiju starts at `(0.00, +0.30)` in X/Z. Stalled car is near
  `(-0.72, +0.40)`, fragile tower near `(+0.72, -0.12)`, and ambulance lane near
  `(-0.76, -0.38)`.
- Put the two scenario sockets along the near edge at Z `+0.68`. Put the compact
  three-row evidence rail along the far edge at Z `-0.72`.
- Keep the kaiju near the optical center, tower in the upper-right quadrant, and
  ambulance in the left-middle quadrant. Shift the whole table about `8%` right
  on wide desktop layouts to reserve the upper-left for the HUD.
- No required prop may sit beneath the top `34%` of a narrow mobile viewport.
  On mobile, pull the camera back and lower the table in frame rather than
  scaling individual props inconsistently.
- Non-XR starting camera target: table center at Y `0.78`, perspective FOV `38°`
  desktop and `46°` mobile, elevated three-quarter angle of roughly `32°`.
- Do not move the camera between test runs. The final release may use one optional
  `4%` push-in; reduced motion removes it.

## Evidence traces and state grammar

Evidence is the game's second hero. Keep at most three retained attempts:
baseline, broad-guardrail regression, and targeted fix.

- Build each route as one flat strip mesh or one set of shared thin segments,
  raised `0.018 m` above the road to prevent z-fighting.
- World-space trace width: `0.045 m`; direction chevron every `0.18–0.22 m`.
- Current run: `active-cyan`, solid chevrons, animated from origin to endpoint.
- Untested: `untested-slate`, spaced dots, hollow diamond endpoint.
- Partial pass: `safety-yellow`, continuous line that ends in a half-filled hex.
- Pass: `pass-lime`, continuous rounded line, check-shaped endpoint, one gentle
  outward confirmation pulse.
- Fail: `fail-coral`, angular broken line with a visible gap before an X endpoint.
- Regression: `fail-coral`, double-line return hook ending at a notched square;
  the evidence row also says `REGRESSION`, so it cannot be mistaken for the
  tower's original failure.
- A tower impact adds a small four-point coral “contact star” fixed at the bump
  location. It is a diagnostic marker, not an explosion.
- A blocked ambulance ends at a square barrier glyph with two short skid marks.
  No siren flash is required.
- Prior traces become darker opaque variants, never disappear, and are selected
  by clicking/tapping/raying the matching evidence row. Selection raises the
  trace by `0.008 m` and applies a cyan keyline.
- The evidence rail uses the same endpoint shapes, a two-to-four-word label, and
  scenario silhouette. Do not use miniature charts or red/green bulbs alone.

## Tutorial highlighting

One tutorial step highlights one actionable target. Never show two competing
halos.

### World target

- Cyan segmented ring at `1.18×` the target footprint, `0.025 m` high.
- One solid triangular pointer floats `0.12 m` above the target and points down.
- Standard motion: ring breathes from scale `1.00` to `1.06` over `1.2 s`
  using ease-in-out sine; pointer moves only `0.018 m`.
- Reduced motion: static ring and pointer at full intensity.
- The target's own material does not flash or change to pass/fail colors.

### DOM target

- `3 px` `active-cyan` outline, `4 px` offset, plus a persistent textual cue such
  as `Next action` in the tutorial card.
- Keyboard focus uses a double cyan/paper outline and must remain distinguishable
  when the same control is also the tutorial target.
- Minimum target is `48 × 48 CSS px`; primary Run/Retry/Release controls are at
  least `52 px` high.
- The five-step Goal → Act → Observe → Adjust → Gate rail uses numbered circles,
  short words, and a connecting line. Current is cyan with an arrow notch;
  completed is lime with a check; future is a hollow slate circle.
- Do not dim or blur the whole scene. Non-target controls may reduce to `72%`
  opacity, but evidence and kaiju action stay readable.

## Authored animation beats

All outcomes are deterministic transform animation. Use `easeOutCubic` for
arrivals, `easeInOutSine` for travel, and linear interpolation for trace reveal.
Avoid spring, elastic, or bounce easing; anticipation/overshoot never exceeds
`4%` of the moved distance.

| Beat | Standard authored motion | Duration | Reduced-motion equivalent |
| --- | --- | ---: | --- |
| Idle | `±0.008 m` breathing, `3°` tail sway, occasional blink; no scene motion | `3.2 s` loop | Static neutral pose; optional infrequent blink only |
| Baseline / stalled car | `180 ms` lean, `900 ms` four-step walk, `300 ms` lift, `700 ms` carry, `300 ms` place; cyan trace writes behind, then resolves to partial yellow | `2.7–2.9 s` | Three held poses (reach, carry, placed) cross-fade in `120 ms`; full route appears at once |
| Fragile tower failure | Walk to marker, shoulder/tail contact, tower rotates `14°` into cradle over `320 ms`; kaiju turns back with open hands; contact star and broken trace appear | `2.0–2.2 s` | Tower switches directly to braced tilted pose; kaiju switches to concern pose; fail trace and label appear together |
| Broad freeze regression | Perimeter posts rise `0.08 m`; kaiju stops before tower, tower row passes; ambulance travels, brakes with a `4°` nose dip at barrier, regression hook appears | `2.2–2.5 s` | Show raised perimeter, stopped kaiju, blocked ambulance, pass and regression endpoints as a static comparison |
| Targeted slow zone | Stripe tiles unfold from road, kaiju's gait slows `35%` only inside corridor, clears tower, ambulance crosses unaffected; two pass endpoints resolve | `2.3–2.6 s` | Stripe corridor appears; kaiju and ambulance jump between start/end key poses; both pass endpoints appear without travel |
| Full suite | Three evidence rows confirm in order with `350 ms` spacing; release control unlocks after the third row | `1.2–1.5 s` | All rows update in one state change; release control becomes enabled with text/live-region announcement |
| Release / guardian | Circular plinth keyline lights, kaiju scales `1.00→1.16`, three dorsal plates light rear-to-front, chest shield tile unfolds, guardian stance holds; optional `4%` camera push | `1.5–1.8 s` | Apply final hero pose, lit plates, shield tile, and verified ring immediately; no scale, camera move, particles, or traveling light |

Global reduced-motion rules:

- Respect `prefers-reduced-motion: reduce` and the in-product motion toggle.
- Disable idle loops, trace drawing, camera movement, tower travel, vehicle travel,
  scale-up, confetti, and repeated pulses.
- Preserve causality with storyboard poses, endpoint geometry, labels, and a
  single opacity cross-fade no longer than `120 ms`.
- Never remove result persistence, focus treatment, live-region copy, or the
  release gate when motion is reduced.

## Spectator-thumbnail test

Run this test on the first failure, regression, targeted-fix, and release frames.

1. Capture at `1280 × 720`, then inspect at `320 × 180` and `160 × 90` without
   zooming.
2. After two seconds, a viewer should be able to point to the kaiju, fragile
   tower, ambulance, active/retained route, and current result shape.
3. At `320 × 180`, kaiju height is at least `42 px`, fragile tower at least
   `34 px`, trace at least `3 px`, and each result endpoint at least `16 px`.
4. In grayscale, the viewer must still distinguish current, pass, fail, and
   untested by line pattern and endpoint shape.
5. With DOM copy blurred or covered, the regression frame must still show “tower
   protected, ambulance blocked,” and the fix frame must show “narrow zone,
   both routes clear.”
6. The final frame must read as a verified guardian, not a larger threat: planted
   feet, open chest, lit shield/check ring, intact city, no low-angle menace.

If the test fails, remove background props, windows, particles, and secondary
buildings before enlarging the HUD or adding glow. The kill check from the
proposal remains valid: if the kaiju and tower failure do not read in the first
30-minute graybox, simplify silhouettes immediately.

## Performance budget

These are peak visible targets for the complete scene, including retained
evidence. The hard cap is a stop-and-simplify trigger, not a target.

| Metric | Target | Hard cap |
| --- | ---: | ---: |
| Visible triangles | `≤12,000` | `25,000` |
| Draw calls | `≤28` | `45` |
| Visible mesh objects | `≤55` | `80` |
| Transform entities | `≤70` | `110` |
| Shared materials | `≤10` | `14` |
| Transparent draw calls | `0` | `4` |
| Retained route traces | `3` | `3` |
| Trace segments per route | `≤18` | `24` |
| Shadow-casting lights | `1` | `1` |
| Other real-time lights | `1` ambient | `1` ambient |
| Shadow map | `1024²` | `1024²` |
| Runtime textures in protected core | `0` | `0` |
| Optional imported texture budget | `1 × 1024²` atlas | `2 × 1024²` |
| Simultaneous active tweens | `≤8` | `12` |

Runtime targets and implementation rules:

- Aim for stable `60 fps` non-XR and headset refresh (`72 fps` minimum target)
  with p95 frame time under `16.7 ms` and `13.9 ms` respectively on the intended
  test devices.
- Share geometry/material instances. Do not create vectors, colors, geometries,
  materials, or arrays inside per-frame update loops.
- Update only the active authored beat. Sleeping props and retained traces do
  not need per-frame work.
- Keep physics, navmesh, skeletal animation, bloom, SSAO, depth-of-field,
  reflection probes, realtime refraction, volumetrics, and screen-space particles
  disabled.
- Merge or minimize repeated decorative windows. If draw calls exceed target,
  remove windows and lab dressing before evidence or scenario props.
- Any optional asset pass must remain under `5 MB` compressed project payload and
  pass the same thumbnail/performance checks before retention.

## Optional CC0 polish, only after the core passes

The concept `ASSET_PLAN.md` lists Quaternius candidates including Ultimate
Monsters, Cute Monsters, Simple Buildings, Downtown City Mega Kit, Cars, and
Turret Pack. Treat these as candidates, not pre-approved files. The official
Quaternius FAQ is the license source to re-check at import time:
`https://quaternius.com/faq.html`; retain the applicable CC0 reference:
`https://creativecommons.org/publicdomain/zero/1.0/`.

Policy:

1. Import nothing until primitive gameplay, reduced motion, browser tests, and
   the spectator-thumbnail test pass.
2. Use at most one source pack in a polish pass and replace only one category:
   kaiju **or** one background building family **or** one vehicle. Never combine
   full packs.
3. Prefer a single Quaternius monster only if it preserves the helmet/tail/three-
   plate silhouette and stays within the triangle/material budgets. Animation or
   cleanup taking over `20 minutes` is an automatic rejection.
4. City and vehicle packs may supply one or two silhouettes only. Strip logos,
   writing, weapons, unrelated fixtures, colliders, extra materials, and unused
   textures. Turret Pack geometry may be repurposed only as unmistakably non-
   weapon lab furniture.
5. A page saying “CC0” is not enough by itself. Preserve the exact source page,
   downloaded archive name/version, archive SHA-256, access/download date,
   author, license name and URL, bundled license/readme, selected source files,
   modifications, converter and version, final output paths, triangle count,
   material/texture count, and voluntary credit decision.
6. Vendor only the optimized files actually used. Do not commit untouched pack
   archives. Reject any file with unclear authorship, missing license evidence,
   third-party trademarks, or a recognizable copyrighted character.

## Optional FLUX polish, only with explicit approval and provenance

- The existing `assets/kaiju-qa.png` in the concept worktree is planning evidence,
  not a runtime asset and not an implemented-game screenshot. Do not use it to
  imply shipped gameplay.
- Generated imagery is unnecessary for the protected core. If explicitly
  approved later, restrict it to non-critical marketing art or one optional flat
  backdrop/decal that the game can remove without affecting comprehension.
- Use only project-owned, project-generated, or clearly licensed references. Do
  not imitate a named living artist, franchise, studio style, copyrighted
  monster, logo, or real person's likeness.
- Record provider, deployment/model (`FLUX.2-pro` if still selected), exact
  prompt, reference inputs and their rights, requested dimensions, seed when
  surfaced, UTC generation time, raw-output SHA-256, provider terms/license
  snapshot, human selection reason, pseudo-text/logo review, edits/conversions,
  final file SHA-256, and every repository/output path.
- Reject lettering-like marks, signatures, logos, unreadable UI, extra controls,
  weapons, destruction spectacle, or a composition that fails the thumbnail
  test. Label all proposal/marketing images as concept art until replaced by
  real captures.

## Cut order and implementation acceptance

Cut in this order if time or performance is tight:

1. release particles and camera push;
2. secondary windows and lab fixtures;
3. transparent prior-trace fade;
4. extra building variety;
5. optional imported/generated polish;
6. walk-cycle detail, replacing it with authored key poses.

Never cut the kaiju/tower/ambulance silhouettes, three retained evidence states,
shape-coded endpoints, targeted stripe zone, tutorial target, reduced-motion
equivalents, or verified release pose.

Implementation is visually ready when the graybox passes the `160 × 90`
spectator test, all six evidence states remain distinct in grayscale, the full
animation and reduced-motion storyboard communicate the same causal sequence,
and the scene stays within the hard performance caps with zero external assets.

## Implementation tokens

```ts
export const KAIJU_QA_ART_TOKENS = {
  palette: {
    ink950: "#0B1620",
    ink800: "#26363D",
    paper100: "#F6EEDC",
    paper300: "#D8D0BE",
    textMuted: "#B9C6C9",
    civicTeal: "#35A99B",
    tealShadow: "#1E6A66",
    activeCyan: "#55D6E2",
    safetyYellow: "#F2C14E",
    passLime: "#A6CF55",
    failCoral: "#F06A5D",
    untestedSlate: "#7D8E95",
  },
  world: {
    tableWidthM: 2.8,
    tableDepthM: 1.8,
    tableThicknessM: 0.1,
    tableSurfaceHeightM: 0.78,
    kaijuHeightM: 0.42,
    traceWidthM: 0.045,
    traceLiftM: 0.018,
    scenarioSocketWidthM: 0.26,
    slowZoneWidthM: 0.28,
  },
  camera: {
    desktopFovDeg: 38,
    mobileFovDeg: 46,
    elevationDeg: 32,
    desktopStageShiftPercent: 8,
    releasePushPercent: 4,
  },
  motionMs: {
    micro: 120,
    fast: 180,
    prop: 320,
    confirmStep: 350,
    travel: 900,
    idleLoop: 3200,
    release: 1700,
  },
  performance: {
    targetTriangles: 12000,
    hardTriangles: 25000,
    targetDrawCalls: 28,
    hardDrawCalls: 45,
    hardVisibleMeshes: 80,
    hardMaterials: 14,
    hardTransparentDraws: 4,
    hardRouteCount: 3,
    hardTraceSegmentsPerRoute: 24,
    hardActiveTweens: 12,
    shadowMapSize: 1024,
  },
} as const;
```
