# Free 3D asset research: concepts 15-20

Access date: **2026-07-20**

Scope: exactly **The Unreliable Stage, Message in a Moon, Second-Hand Sun,
Invisible Zoo Keeper, Origami Rescue, and Size Thief**. Recommendations favor
official Quaternius packs, with one Kenney supporting pack where it is the
cleaner fully free fit. Every recommended asset pack below is verified CC0.

## Shortlist

| # | Concept | Primary pack | Optional supporting pack |
| --- | --- | --- | --- |
| 15 | The Unreliable Stage | Quaternius - Ultimate Animated Character Pack | Quaternius - Ultimate House Interior Pack |
| 16 | Message in a Moon | Quaternius - Ultimate Space Kit | Quaternius - Ultimate Modular Sci-Fi Pack |
| 17 | Second-Hand Sun | Quaternius - Ultimate House Interior Pack | Quaternius - Ultimate Stylized Nature Pack |
| 18 | Invisible Zoo Keeper | Quaternius - Ultimate Animated Animal Pack | Quaternius - Ultimate Stylized Nature Pack |
| 19 | Origami Rescue | Quaternius - Modular Streets Pack | Quaternius - Ultimate Buildings Pack |
| 20 | Size Thief | Quaternius - Ultimate House Interior Pack | Kenney - Furniture Kit |

## 15 - The Unreliable Stage

### Primary: Quaternius - Ultimate Animated Character Pack

- **Official URL:** https://quaternius.com/packs/ultimatedanimatedcharacter.html
- **Verified license:** **CC0 1.0**. The official pack page displays
  `License CC0` and says its assets are free for personal and commercial use.
  Quaternius' FAQ says all models are CC0 and attribution is not required.
- **What it supplies:** 52 low-poly models, described as more than 50 animated
  characters with many animations. Official formats are FBX, OBJ, and Blend.
- **Concept mapping:** Select one strongly readable actor and one mischievous
  stage-manager silhouette. Stock idle, gesture, locomotion, and reaction clips
  can carry the fixed three-beat plot while response cards and set changes alter
  the genre around the actor. Recoloring the same cast between genres reinforces
  the comedy of a production changing faster than its performers can adapt.
- **WebXR and format notes:** Convert only the chosen animated FBX files to GLB
  offline; OBJ cannot preserve skeletal animation. Strip unused clips, limit
  active skinned meshes, verify root motion, and test skeleton/material export
  before committing. Keep the cast at a stable stage distance in XR and use
  authored animation beats rather than ragdolls or full-body physics.

### Optional support: Quaternius - Ultimate House Interior Pack

- **Official URL:** https://quaternius.com/packs/ultimatehomeinterior.html
- **Verified license:** **CC0 1.0**. The official page displays `License CC0`
  and permits personal and commercial use.
- **What it supplies:** 123 house-interior models covering doors, windows,
  kitchen pieces, bathroom pieces, and other furniture. Official formats are
  FBX, OBJ, and Blend.
- **Concept mapping:** A tightly selected prop library can redress the same
  physical stage as a living room, melodrama, farce, or improvised control room.
  Rolling in one unmistakable hero prop per genre is funnier and more legible
  than building several complete environments.
- **WebXR and format notes:** There is no official glTF download, so convert a
  small curated subset to GLB, consolidate materials, and merge noninteractive
  set dressing into one static stage chunk per genre. Preload the few alternate
  chunks and swap visibility between beats; do not stream or instantiate all
  123 models during a performance.

### Still custom

- **Modeling/animation:** The proscenium, curtains, stage-flip mechanism,
  response-card lectern, genre cards, emotional-objective indicators, and any
  signature submarine/western transformations. Stock animation still needs
  bespoke timing and possibly a few reaction clips.
- **Shaders/VFX:** Fast theatrical transitions, spotlight presets, backdrop
  wipes, genre color treatments, readable response previews, and a reduced
  motion mode that uses cuts instead of spinning scenery.
- **Audio:** Actor barks, stage-manager voice, audience reactions, genre stings,
  prop foley, and captions or visual equivalents for every required cue.

## 16 - Message in a Moon

### Primary: Quaternius - Ultimate Space Kit

- **Official URL:** https://quaternius.com/packs/ultimatespacekit.html
- **Verified license:** **CC0 1.0**. The official page displays `License CC0`
  and says the assets are free for personal and commercial projects.
- **What it supplies:** 92 animated and textured models for space games,
  including planets, vegetation, characters, enemies, and other celestial
  pieces. Official formats are FBX, OBJ, Blend, and glTF.
- **Concept mapping:** Use one planet or moon form as the pearl relay body and a
  few small celestial assets as orbiting lineage markers. The broad collection
  can quickly establish a friendly miniature solar-system context while the
  actual player-authored light-orbit-chime message remains the focal point.
- **WebXR and format notes:** Start with the supplied glTF files, but import only
  a handful of pieces. Normalize scale and pivots, compress textures, merge
  static orbital dressing, and animate token paths with deterministic transforms
  rather than orbital physics. Keep bright emissive elements bounded to avoid
  bloom discomfort in headsets.

### Optional support: Quaternius - Ultimate Modular Sci-Fi Pack

- **Official URL:** https://quaternius.com/packs/ultimatemodularscifi.html
- **Verified license:** **CC0 1.0**. The official page displays `License CC0`
  and permits personal and commercial use.
- **What it supplies:** 46 modular science-fiction interior assets and props in
  FBX, OBJ, and Blend formats.
- **Concept mapping:** Consoles, panels, sockets, and structural modules can be
  miniaturized into the inherited moon machine's repair bay. One or two familiar
  control shapes make the device feel decipherable without turning the gentle
  relay toy into a generic spaceship corridor.
- **WebXR and format notes:** Convert selected FBX/OBJ pieces to GLB offline.
  Bake a compact atlas, merge decorative panels, and reserve separate ECS
  entities for the three signal-token sockets and the single repair interaction.
  Avoid live screen render targets; use emissive textures or simple UV states.

### Still custom

- **Modeling/animation:** The pearl moon-machine shell, three signal tokens,
  repair socket, lineage ring, share-code object, and a clear visual history of
  prior players' repairs.
- **Shaders/VFX:** Light pulses, orbit trails, chime visualization, message
  playback timeline, repair-state reveal, and accessible shape coding in
  addition to color.
- **Audio:** The composable chime vocabulary, playback/record cues, gentle space
  ambience, repair sounds, and a mute-friendly visual transcription.

## 17 - Second-Hand Sun

### Primary: Quaternius - Ultimate House Interior Pack

- **Official URL:** https://quaternius.com/packs/ultimatehomeinterior.html
- **Verified license:** **CC0 1.0**. The official page displays `License CC0`
  and permits personal and commercial use.
- **What it supplies:** 123 low-poly interior pieces ranging from doors and
  windows to kitchen and bathroom furniture. Official formats are FBX, OBJ, and
  Blend.
- **Concept mapping:** Build one compact impossible room from a door, windows,
  shelving, tables, and a few recognizable objects. Familiar domestic forms make
  the consequences of four authored time/light states easy to read: sleeping,
  waking, aging, growing, opening, or casting a useful shadow.
- **WebXR and format notes:** Convert a small set to GLB offline and prebuild the
  room as a mostly static mesh. Use separate entities only for objects whose
  state or shadow matters. Author four lighting/material presets instead of a
  continuously simulated day-night renderer; this matches the concept's risk
  note and is safer for mobile and standalone XR.

### Optional support: Quaternius - Ultimate Stylized Nature Pack

- **Official URL:** https://quaternius.com/packs/ultimatestylizednature.html
- **Verified license:** **CC0 1.0**. The official page displays `License CC0`
  and permits personal and commercial use.
- **What it supplies:** 63 textured nature assets, including more than 60 nature
  pieces with seamless textures and normal maps. Official formats are FBX, OBJ,
  Blend, and glTF.
- **Concept mapping:** Select a flower, plant, and perhaps one rock or branch to
  create the living shadow puzzle and visible growth states. The stylized forms
  suit the miniature-clock fantasy and are easier to read than realistic foliage
  at phone and headset resolutions.
- **WebXR and format notes:** Begin with glTF, simplify or replace transparent
  foliage, and keep only the hero plant's growth-state meshes. Swap authored
  stages or use a short dissolve rather than skeletal plant animation. Disable
  shadow casting on decorative foliage; only the puzzle silhouette needs a
  controlled shadow.

### Still custom

- **Modeling/animation:** The miniature sun, giant clock hands, time pins,
  four-state hero objects, pearl keyhole, and exact shadow-catching geometry.
- **Shaders/VFX:** Deterministic shadow projection, authored sunlight presets,
  state-transition dissolves, time preview ghosts, and a high-contrast fallback
  that communicates solutions without relying only on real-time shadows.
- **Audio:** Clock ticks, time-state transitions, plant/object awakenings, puzzle
  confirmation, and a reduced-repetition mix for comfort.

## 18 - Invisible Zoo Keeper

### Primary: Quaternius - Ultimate Animated Animal Pack

- **Official URL:** https://quaternius.com/packs/ultimateanimatedanimals.html
- **Verified license:** **CC0 1.0**. The official page displays `License CC0`
  and says the models are free for personal and commercial use.
- **What it supplies:** 12 animated animals, each with more than 12 animations,
  including walk, jump, gallop, kick, attack, and death. Official formats are
  FBX, OBJ, Blend, and glTF.
- **Concept mapping:** A hidden animated animal can drive trace emitters,
  displaced foliage, food removal, temperature events, and spatial audio without
  ever rendering its body. One second animal supplies a contrasting evidence
  profile. A silhouette or refractive outline of the stock model can support the
  final welfare reveal without showing an ordinary opaque creature.
- **WebXR and format notes:** Prefer the animated glTF, strip violent or unused
  clips, and render no hidden skin until the reveal. Parent lightweight evidence
  anchors to a small number of bones or to a simplified authored path; do not
  run collision on the full invisible mesh. Limit simultaneous skinned animals
  and verify animation cost on a representative phone.

### Optional support: Quaternius - Ultimate Stylized Nature Pack

- **Official URL:** https://quaternius.com/packs/ultimatestylizednature.html
- **Verified license:** **CC0 1.0**. The official page displays `License CC0`
  and permits personal and commercial use.
- **What it supplies:** 63 textured nature assets with seamless textures and
  normal maps in FBX, OBJ, Blend, and glTF formats.
- **Concept mapping:** Use plants, rocks, grass, and habitat dressing to create
  the enclosure's evidence surfaces. A small number of movable foliage variants
  can show bent grass or nesting disturbance while the rest remains static.
- **WebXR and format notes:** Use glTF, instance repeated plants, atlas textures,
  and avoid transparency-heavy grass. Keep most vegetation noninteractive and
  swap between authored undisturbed/disturbed versions only where evidence is
  generated. Use simple floor and enclosure colliders rather than foliage mesh
  collision.

### Still custom

- **Modeling/animation:** Species-specific footprints, nests, food and care
  tokens, thermometer/scanner tools, habitat controls, evidence markers, and the
  final outline treatment. Stock animal behavior will still need authored paths.
- **Shaders/VFX:** Frost, warmth, displaced-particle trails, refractive shimmer,
  readable scent/sound direction, evidence freshness, and a nontransparent
  accessibility outline.
- **Audio:** Creature movement and feeding reactions, habitat ambience, scanner
  cues, welfare feedback, captions, and visualized sound direction.

## 19 - Origami Rescue

### Primary: Quaternius - Modular Streets Pack

- **Official URL:** https://quaternius.com/packs/modularstreets.html
- **Verified license:** **CC0 1.0**. The official page displays `License CC0`
  and says the assets are free for personal and commercial use.
- **What it supplies:** 25 modular street assets, including roads that can be
  combined into a city. Official formats are FBX, OBJ, and Blend.
- **Concept mapping:** Flatten and simplify a few road modules into the paper
  world's safe routes, intersections, river crossings, and shelter approach.
  Assign road chunks to rigid fold panels so each legal crease rewrites the
  route graph while preserving a coherent low-poly city language.
- **WebXR and format notes:** Convert chosen modules to GLB offline, normalize
  thickness and pivots, and merge each panel's static road art. Parent visual
  chunks to a small set of rigid hinged panels rather than deforming road meshes.
  Keep navigation as an authored graph; do not use continuous physics or runtime
  navmesh rebuilding for folded routes.

### Optional support: Quaternius - Ultimate Buildings Pack

- **Official URL:** https://quaternius.com/packs/ultimatetexturedbuildings.html
- **Verified license:** **CC0 1.0**. The official page displays `License CC0`
  and permits personal and commercial use.
- **What it supplies:** 76 modular building models with alternate atlas textures
  for changing palettes. Official formats are FBX, OBJ, and Blend.
- **Concept mapping:** Select a few simple building silhouettes for rooftops,
  shelters, and landmarks, then flatten colors and exaggerate folds to make them
  feel cut from paper. Palette atlases can distinguish safe, stranded, and hazard
  districts without bespoke architecture.
- **WebXR and format notes:** Convert only the chosen buildings to GLB, remove
  unseen backs/interiors where safe, and merge noninteractive structures by fold
  panel. Buildings should not have individual physics bodies. Keep roof markers
  and citizens as separate interactable/readable entities with generous ray and
  touch targets.

### Still custom

- **Modeling/animation:** Fold panels and crease hinges, paper edge treatment,
  citizens, fire escape, river and shelter pieces, pin handles, route markers,
  and commemorative final fold pattern.
- **Shaders/VFX:** Paper fibers, crease highlighting, legal-fold preview, route
  connectivity, panel-safe shadows, and stepped reduced-motion folding.
- **Audio:** Paper folds, pin clicks, route validation, citizen movement and
  rescue reactions, hazard cues, and success flourish.

## 20 - Size Thief

### Primary: Quaternius - Ultimate House Interior Pack

- **Official URL:** https://quaternius.com/packs/ultimatehomeinterior.html
- **Verified license:** **CC0 1.0**. The official page displays `License CC0`
  and permits personal and commercial use.
- **What it supplies:** 123 low-poly interior models, including doors, windows,
  kitchen furniture, bathroom furniture, and other domestic objects. Official
  formats are FBX, OBJ, and Blend.
- **Concept mapping:** Doors, furniture, and recognizable household props give
  the scale-transfer mechanic an immediately legible test room. Choose five
  objects with very different silhouettes and obvious functional thresholds,
  then author donor/receiver relationships around them.
- **WebXR and format notes:** Convert the five approved objects and room shell to
  GLB offline. Scaling a rendered mesh is cheap, but collision and interaction
  affordances should move between authored tiers rather than scale without
  bounds. Never scale the player camera, XR origin, or whole world. Recompute or
  swap simple collider proxies only when a threshold is crossed.

### Optional support: Kenney - Furniture Kit

- **Official URL:** https://kenney.nl/assets/furniture-kit
- **Verified license:** **Creative Commons CC0** on the official asset page.
  Kenney's support page says all game assets on its asset pages are public-domain
  licensed CC0 and attribution is not required.
- **What it supplies:** 140 3D files tagged for furniture and interiors,
  including tables, chairs, beds, and related pieces.
- **Concept mapping:** Use its clean, toy-like furniture silhouettes as
  additional size donors, receivers, steps, barriers, or reach extenders when
  the Quaternius room lacks the exact gameplay shape needed. Keep one art family
  dominant and rematerial the support pieces for cohesion.
- **WebXR and format notes:** The official page does not enumerate interchange
  formats, so inspect the downloaded archive and convert the selected files to
  GLB offline. Consolidate materials and use authored small/medium/large collider
  proxies. Test ray, touch, and grab targets at every scale tier; a visible tiny
  object may still need a minimum-size invisible interaction volume.

### Still custom

- **Modeling/animation:** The brass siphon, giant key, threshold-marked doorway,
  size reservoir, transfer links, scale gauges, and bespoke state variants where
  simple uniform scaling would break function or silhouette.
- **Shaders/VFX:** Visible conserved-size flow, donor/receiver highlighting,
  threshold previews, bounded scale transition, and non-color state indicators.
- **Audio:** Transfer pump, object growth/shrink layers, threshold snaps,
  insufficient-size feedback, route opening, and haptic-equivalent timing cues.

## Cross-pack WebXR ingestion rules

- Archive the exact downloaded pack and record its source URL, download date,
  license file, selected filenames, and archive hash in the project asset
  manifest, even though attribution is not legally required for CC0 assets.
- Prefer official glTF/GLB when offered. Convert FBX/OBJ/Blend-only assets to
  GLB offline and visually verify scale, pivots, normals, materials, skeletons,
  animation clips, and alpha behavior after conversion.
- Import only the models and animation clips used by the hackathon slice. Do not
  ship complete 50-140-model archives merely because they are free.
- Consolidate materials, compress textures with KTX2 when the measured build
  supports it, instance repeated scenery, and merge static meshes by material.
- Keep interaction and collision proxies simple. Render meshes should not become
  automatic physics meshes, especially on mobile and standalone headsets.
- Budget skinned meshes, transparent surfaces, dynamic lights, shadow casters,
  draw calls, triangle counts, and texture memory on the lowest target device.
- Create gameplay scene objects through IWSDK ECS APIs and `Interactable`; asset
  provenance does not override the repository's IWSDK architecture rules.

## License policy for candidate free-asset sites

This is a production checklist, not legal advice. Preserve the downloaded
license and provenance record even when the source uses CC0.

| Source | Site-wide CC0 or per-asset? | Working policy |
| --- | --- | --- |
| **Quaternius** | **Site-wide for its models.** The official FAQ says all models are CC0, can be used in commercial, educational, and personal projects, and need no attribution. Individual pack pages also display `License CC0`. | Safe default for the project's 3D source library. Verify that a newer MegaKit's free Standard download contains the specific model wanted; paid Source/Pro extras do not change the CC0 license but may change what is included in the free download. |
| **Kenney** | **Site-wide for game assets on Kenney asset pages.** The support page says all game assets on those pages are public-domain licensed CC0 and attribution is not required. | Treat `/assets/...` listings as CC0, retain the included license, and do not assume the same statement covers Kenney software, tools, logos, or unrelated products. |
| **Poly Haven** | **Site-wide for assets.** Its license page says all HDRIs, textures, and 3D models are CC0. | No attribution requirement, but record the asset page and version. Check resolution, texture memory, and polygon cost because photoreal assets may be too heavy for WebXR without optimization. |
| **Poly Pizza** | **Per asset, not site-wide CC0.** Its Terms say users must follow the Creative Commons license that applies at download; model pages/API expose the specific license, which may be CC0 or an attribution license such as CC-BY. | Capture the exact model page, creator, title, license version, attribution text, and download date. Do not infer a bundle's or neighbor asset's license. Prefer CC0 for hackathon speed; if CC-BY is used, ship a complete credits record. |
| **OpenGameArt** | **Per submission, not site-wide CC0.** Its FAQ documents multiple supported licenses, including CC0, CC-BY, CC-BY-SA, OGA-BY, and GPL. A multilicense submission lets the user follow one listed license. | Check every submission and every included file. Prefer CC0 or clearly manageable OGA-BY/CC-BY; review share-alike, DRM, GPL, and attribution obligations before import. Save the asset page and license snapshot because listings can add or change options, while a license already received is irrevocable. |

## Source audit

Every URL in this section was opened directly on its official domain on
**2026-07-20**. Pack names, counts, formats, and license claims were taken from
the source page rather than a search-result snippet or third-party mirror.

| Official source | Directly verified facts |
| --- | --- |
| https://quaternius.com/faq.html | HTTP 200; says assets may be used free in commercial, educational, and personal projects; all models are CC0; attribution is unnecessary. |
| https://quaternius.com/packs/ultimatedanimatedcharacter.html | HTTP 200; “Ultimate Animated Character Pack”; 52 models; FBX/OBJ/Blend; `License CC0`; page describes 50+ animated characters. |
| https://quaternius.com/packs/ultimatehomeinterior.html | HTTP 200; “Ultimate House Interior Pack”; 123 models; FBX/OBJ/Blend; `License CC0`; page lists doors, windows, kitchen and bathroom furniture. |
| https://quaternius.com/packs/ultimatespacekit.html | HTTP 200; “Ultimate Space Kit”; 92 models; FBX/OBJ/Blend/glTF; `License CC0`; page lists planets, vegetation, animated characters, enemies, and more. |
| https://quaternius.com/packs/ultimatemodularscifi.html | HTTP 200; “Ultimate Modular Sci-Fi Pack”; 46 models; FBX/OBJ/Blend; `License CC0`; page describes modular sci-fi interiors and props. |
| https://quaternius.com/packs/ultimatestylizednature.html | HTTP 200; “Ultimate Stylized Nature Pack”; 63 models; FBX/OBJ/Blend/glTF; `License CC0`; page describes 60+ nature assets with seamless textures and normal maps. |
| https://quaternius.com/packs/ultimateanimatedanimals.html | HTTP 200; “Ultimate Animated Animal Pack”; 12 models; FBX/OBJ/Blend/glTF; `License CC0`; page says every animal has 12+ animations. |
| https://quaternius.com/packs/modularstreets.html | HTTP 200; “Modular Streets Pack”; 25 models; FBX/OBJ/Blend; `License CC0`; page describes combinable city roads. |
| https://quaternius.com/packs/ultimatetexturedbuildings.html | HTTP 200; “Ultimate Buildings Pack”; 76 models; FBX/OBJ/Blend; `License CC0`; page describes modular buildings with alternate atlas textures. |
| https://kenney.nl/assets/furniture-kit | HTTP 200; “Furniture Kit”; 140 3D files; tags include furniture, interior, table, chair, and bed; official page states Creative Commons CC0. |
| https://kenney.nl/support | HTTP 200; says all game assets on Kenney asset pages are public-domain licensed CC0 and attribution is not required. |
| https://polyhaven.com/license | HTTP 200; says all Poly Haven HDRIs, textures, and 3D models are licensed CC0. |
| https://poly.pizza/docs/tos | HTTP 200; says use of another user's content must follow the Creative Commons license that applies at download. |
| https://opengameart.org/content/faq | HTTP 200; documents CC0, CC-BY, CC-BY-SA, OGA-BY, and GPL options, their differing obligations, and the rule for multilicensed submissions. |

### Audit cautions

- Recheck the official source page and the license bundled in the download at
  the moment an asset is imported.
- CC0 does not grant rights to third-party trademarks, copyrighted characters,
  or other material that an uploader did not have authority to release.
- Keep downloaded source archives out of the production bundle. Commit only the
  optimized runtime subset plus a provenance/license manifest unless the team's
  repository policy explicitly requires source archives.
