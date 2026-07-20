# Free 3D asset research: concepts 08–14

Access date: **2026-07-20**

Scope: exactly **Reverse Archaeology, Shadowwright, Minute Garden, Portal Paparazzi, Gesture Linguist, Tiny Treaty Table, and Dream Assembly Line**. Every recommended source is an official creator page and explicitly uses Creative Commons CC0. Quaternius MegaKit recommendations refer to the free **Standard** download; those pages state that Standard contains roughly 60–70% of the pack, while paid Source/Pro tiers add the remaining models and engine-specific extras.

## Shortlist

| # | Concept | Primary pack | Optional supporting pack |
| --- | --- | --- | --- |
| 08 | Reverse Archaeology | Quaternius — Ultimate Modular Ruins Pack | Quaternius — Fantasy Props MegaKit |
| 09 | Shadowwright | Quaternius — Platformer Game Kit | Kenney — Prototype Kit |
| 10 | Minute Garden | Quaternius — Stylized Nature MegaKit | Quaternius — Ultimate Crops Pack |
| 11 | Portal Paparazzi | Quaternius — Downtown City MegaKit | Quaternius — Ultimate Monsters |
| 12 | Gesture Linguist | Quaternius — Animated Alien Pack | Quaternius — Universal Animation Library |
| 13 | Tiny Treaty Table | Quaternius — Ultimate Fantasy RTS | Quaternius — 3D Card Kit - Fantasy |
| 14 | Dream Assembly Line | Kenney — Factory Kit | Quaternius — Sci-Fi Essentials Kit |

## 08 — Reverse Archaeology

### Primary: Quaternius — Ultimate Modular Ruins Pack

- **Official URL:** https://quaternius.com/packs/ultimatemodularruins.html
- **Verified license:** **CC0 1.0**. The official page links to the CC0 deed and says the pack is free for personal and commercial projects.
- **What it supplies:** 90 models covering modular ruins and dungeons, props, and an animated character. Official formats are FBX, OBJ, and Blend.
- **Concept fit:** Use the modular walls, floors, openings, rubble, and room dressing to assemble the one ruined investigation chamber. Recombining a small set into intact, damaged, and collapsed arrangements gives the authored rewind states a coherent visual language.
- **WebXR/format notes:** There is no official glTF download, so convert only the selected assets to GLB offline. Bake or consolidate materials, merge static room chunks, generate simple colliders, and keep intact/damaged variants as separate hidden meshes rather than rebuilding geometry during interaction. Do not load all 90 models into the browser.

### Optional support: Quaternius — Fantasy Props MegaKit

- **Official URL:** https://quaternius.com/packs/fantasypropsmegakit.html
- **Verified license:** **CC0 1.0**. The official page explicitly permits personal, educational, and commercial use. The free Standard tier contains 60–70% of the pack.
- **What it supplies:** The catalog contains 211 low-poly medieval props—tools, weapons, vegetables, potions, stalls, chests, furniture, and more—using four shared texture sets. Official formats are FBX, OBJ, Blend, and glTF.
- **Concept fit:** Source secondary lamps, furniture, tools, containers, and clue-room clutter without spending hackathon time on background props. Recolor a tightly selected subset so the hero evidence remains visually dominant.
- **WebXR/format notes:** Start from glTF, retain the shared texture-atlas strategy, and import perhaps 10–20 useful props rather than the entire free subset. Instance repeated clutter and omit paid-tier collision/shader assumptions; create simple browser-side collision proxies only where hands or rays can touch an item.

### Still custom

- **Modeling/animation:** Four hero artifacts with authored intact/damaged state meshes or morph targets, the time ring, evidence pins, and any hand-held inspection affordance.
- **Shaders/VFX:** Translucent prior-state ghosts, local rewind/dissolve, causal-link highlighting, and an accessible non-translucent comparison mode.
- **Audio:** Reversible object foley, clue stingers, room ambience, and distinct confirmation/error cues.

## 09 — Shadowwright

### Primary: Quaternius — Platformer Game Kit

- **Official URL:** https://quaternius.com/packs/ultimateplatformer.html
- **Verified license:** **CC0 1.0**. The official page links the license and says the kit is free for personal and commercial projects.
- **What it supplies:** 112 models including a character with 18 animations, enemies, platforms, and other platform-game pieces. Official formats are FBX, OBJ, Blend, and glTF.
- **Concept fit:** The character can prototype the tiny projected traveler, while modular platforms and obstacles can stand in for the shadow-world’s bridge, shelter, and hazard vocabulary. A deliberately limited subset can establish readable cause-and-effect quickly.
- **WebXR/format notes:** Use glTF, trim animation clips to only idle/walk/react, and keep the traveler’s rendered size large enough to avoid subpixel shimmer on mobile. Treat the shadow world as a lightweight scoring representation rather than enabling physics on every platform piece.

### Optional support: Kenney — Prototype Kit

- **Official URL:** https://kenney.nl/assets/prototype-kit
- **Verified license:** **Creative Commons CC0** on the official page.
- **What it supplies:** 145 3D files with variations and animation; official tags include prototype, character, vehicle, wall, and building.
- **Concept fit:** The neutral prototype vocabulary is useful for rapidly testing draggable shadow-casting forms, scale handles, a lamp workbench, and accessibility previews before bespoke cobalt forms are modeled.
- **WebXR/format notes:** The official page does not enumerate interchange formats, so inspect the downloaded archive before choosing the import path and convert the approved subset to GLB offline. Favor low-sided forms, shared materials, and simple grab proxies. Preserve stable object pivots because rotation is the central mechanic.

### Still custom

- **Modeling/animation:** The signature abstract sculpture set, one-handed axis handles, lamp rig, traveler silhouette, and authored shadow-goal regions.
- **Shaders/VFX:** Crisp controllable projection, ink-like shadow treatment, placement preview, and a high-contrast non-shadow accessibility visualization. Do not rely on expensive soft real-time shadows for scoring.
- **Audio:** Lamp hum, grab/rotate ticks, successful projection chimes, and traveler reaction sounds.

## 10 — Minute Garden

### Primary: Quaternius — Stylized Nature MegaKit

- **Official URL:** https://quaternius.com/packs/stylizednaturemegakit.html
- **Verified license:** **CC0 1.0**. The official page explicitly permits personal, educational, and commercial use. The free Standard tier contains 60–70% of the pack.
- **What it supplies:** The catalog reports 116 models: 40 trees, 35 plants and flowers, 27 rocks, plus grass, bushes, and other nature pieces. Official formats are FBX, OBJ, Blend, and glTF.
- **Concept fit:** Build the terrarium, surrounding habitat, and baseline plant families from a single cohesive stylized kit. Color and silhouette variants can communicate habitat differences without photorealistic texture cost.
- **WebXR/format notes:** Use the free glTF subset, aggressively cull unseen foliage, instance repeated plants, and atlas or compress textures. Avoid transparency-heavy grass and per-leaf physics. Keep growth or adaptation changes as discrete mesh swaps between generations so mobile and standalone headsets remain predictable.

### Optional support: Quaternius — Ultimate Crops Pack

- **Official URL:** https://quaternius.com/packs/ultimatecrops.html
- **Verified license:** **CC0 1.0** on the official page.
- **What it supplies:** 102 crop models representing different plants in five stages of growth. Official formats are FBX, OBJ, and Blend.
- **Concept fit:** The staged plants are an immediate visual prototype for generational change and lineage preservation. Recolor or selectively remix stages to show adaptation while the system design is still being tuned.
- **WebXR/format notes:** Convert the chosen crops to GLB offline and normalize pivots/scale across stages to prevent visible popping. Load only a few species and reuse geometry through instancing. Cross-fade sparingly; a short dissolve or discrete step is cheaper than skeletal plant animation.

### Still custom

- **Modeling/animation:** Trait-specific roots, resilient lineage variants, insects or other small species, the terrarium shell, water table, and physical condition dials.
- **Shaders/VFX:** Readable generation transitions, habitat-condition overlays, causal arrows, low-cost wind, and a reduced-motion stepped-time mode.
- **Audio:** Layered habitat ambience, generation-advance cues, event warnings, and species/lineage confirmation sounds.

## 11 — Portal Paparazzi

### Primary: Quaternius — Downtown City MegaKit

- **Official URL:** https://quaternius.com/packs/downtowncitymegakit.html
- **Verified license:** **CC0 1.0**. The official page explicitly permits personal, educational, and commercial use. The free Standard tier contains 60–70% of the pack.
- **What it supplies:** 315 modular environment pieces for Boston/NYC-style city blocks, shared optimized texture sets, and seven example buildings. Official formats are FBX, Blend, and glTF. Engine-specific fake interiors, wear controls, bevel effects, and authored collisions are Source-tier extras, not assumptions for the free browser build.
- **Concept fit:** Assemble one compact plaza, rooftop, street edge, and puddle location from a consistent kit. The large modular vocabulary allows three fixed photo vantages to look meaningfully different without building three maps.
- **WebXR/format notes:** Use the free glTF subset and ship a preassembled, aggressively culled plaza rather than runtime modular construction. Bake lighting where practical, use simple box colliders only around player-relevant surfaces, and keep distant façades merged. Recreate any desired fake-window effect as a deliberately cheap web shader instead of depending on paid engine files.

### Optional support: Quaternius — Ultimate Monsters

- **Official URL:** https://quaternius.com/packs/ultimatemonsters.html
- **Verified license:** **CC0 1.0**. The official page says the pack is free for personal and commercial projects.
- **What it supplies:** 50 fully animated monsters. The official pack metadata lists FBX, OBJ, Blend, and glTF.
- **Concept fit:** Use one strongly silhouetted creature as the first celebrity-subject prototype and reserve a few others for background posters or future briefs. Stock animation can validate timing, framing, and capture scoring before the signature creature exists.
- **WebXR/format notes:** Import one creature, remove unused animation clips, reduce skin influences where safe, and test GPU skinning on mobile. Keep the subject outside the near field in XR and use authored animation beats rather than physics. Avoid combining multiple animated monsters in the hackathon scene.

### Still custom

- **Modeling/animation:** The moon-whale or other signature celebrity creature, camera/viewfinder, puddle portal frame, photo brief props, and bespoke breach/performance animation.
- **Shaders/VFX:** Portal compositing or second-camera-plane illusion, stable viewfinder, screenshot feedback, moon/puddle treatment, and a reduced-effects fallback.
- **Audio:** Shutter and focus cues, creature performance sounds, city ambience, brief countdown, and successful-composition sting.

## 12 — Gesture Linguist

### Primary: Quaternius — Animated Alien Pack

- **Official URL:** https://quaternius.com/packs/animatedalien.html
- **Verified license:** **CC0 1.0**. The official page says the pack is free for personal and commercial projects.
- **What it supplies:** The page reports two models and a cute animated alien. Official formats are FBX, OBJ, and Blend.
- **Concept fit:** The friendly alien is an appropriate first conversation partner for a comic misunderstanding loop. Its stock animation can cover idle or broad reactions while spatial-language tracing is implemented independently.
- **WebXR/format notes:** Convert the animated FBX to GLB offline, strip unused clips, and keep the NPC at a comfortable fixed distance. Validate animation, material, and skeleton conversion early; OBJ is not suitable for the animated version. Facial nuance and hand articulation should not be assumed from this small pack.

### Optional support: Quaternius — Universal Animation Library

- **Official URL:** https://quaternius.com/packs/universalanimationlibrary.html
- **Verified license:** **CC0 1.0** on the official page. The free Standard
  download contains roughly 60–70% of the catalog; the complete catalog and
  source-tier files are paid.
- **What it supplies:** The complete catalog advertises more than 120
  animations on a universal humanoid rig. Treat the free Standard archive as a
  subset whose exact clips and formats must be inspected after download; do not
  assume the advertised Blend source files or every named emote are included.
- **Concept fit:** If the downloaded free subset contains suitable reactions,
  use a small selection as timing/reference material for a humanoid proxy.
  Greeting, confusion, approval, rejection, and correction are desired roles,
  not promises about specific clips in the free archive.
- **WebXR/format notes:** Import only verified clips from the free Standard
  archive and normalize them to GLB as needed. The library is a universal
  **humanoid** rig, while the Animated Alien skeleton may differ; test
  retargeting before committing and do not promise direct compatibility. If
  retargeting costs more than a short bespoke clip set, use the library only as
  animation reference.

### Still custom

- **Modeling/animation:** Articulated alien hands or expressive appendages, facial reactions, spatial trace panel, depth guides, and the small set of authored language gestures.
- **Shaders/VFX:** Depth- and direction-coded trails, tempo markers, tolerant recognition feedback, semantic room reactions, and color-independent shape coding.
- **Audio:** Alien phonemes, contextual reaction voices, trace rhythm cues, and success/correction sounds with visual equivalents for every essential cue.

## 13 — Tiny Treaty Table

### Primary: Quaternius — Ultimate Fantasy RTS

- **Official URL:** https://quaternius.com/packs/ultimatefantasyrts.html
- **Verified license:** **CC0 1.0**. The official page says the pack is free for personal and commercial projects.
- **What it supplies:** 128 models, including buildings at different evolution stages and nature assets. Official formats are FBX, OBJ, Blend, and glTF.
- **Concept fit:** Create three miniature settlements with distinct recolors, then use evolution-stage buildings and nature pieces to show seasonal consequences. The RTS scale reads naturally on a seated tabletop and supports visible before/after state changes.
- **WebXR/format notes:** Start from glTF, instance repeated buildings and trees, and use a small number of shared materials. Merge noninteractive settlement dressing, keep interactive sites as separate ECS entities, and exaggerate silhouettes because tiny details disappear on phones and headset displays.

### Optional support: Quaternius — 3D Card Kit - Fantasy

- **Official URL:** https://quaternius.com/packs/3dcardkitfantasy.html
- **Verified license:** **CC0 1.0**. The official page explicitly permits personal, educational, and commercial use. The free Standard tier contains 60–70% of the pack.
- **What it supplies:** 50 fully modeled fantasy card scenes covering spells, abilities, heroes, elements, enemies, and objects, intended for digital or tabletop board games. Official formats are FBX, OBJ, Blend, and glTF.
- **Concept fit:** Repurpose selected miniature scenes as petition illustrations, treaty-clause iconography, faction markers, or chunky physical tokens. They can make abstract promises readable before bespoke UI art is ready.
- **WebXR/format notes:** Use the free glTF subset as a source library, not 50 simultaneously rendered dioramas. Flatten complex scenes into baked icon renders where interaction is not required; reserve true 3D for a handful of clause tiles. Simplify colliders and enlarge touch/ray targets beyond the visible token.

### Still custom

- **Modeling/animation:** Three faction identities, river/orchard terrain, bridges, waterways and borders that visibly instantiate promises, plus readable clause tiles and treaty frame.
- **Shaders/VFX:** Territory overlays, consequence preview ghosts, persistent promise topology, season change, and color-blind-safe faction patterns.
- **Audio:** Short petition voices or barks, clause snap/confirm sounds, map-transformation cues, seasonal ambience, and coalition-state feedback.

## 14 — Dream Assembly Line

### Primary: Kenney — Factory Kit

- **Official URL:** https://kenney.nl/assets/factory-kit
- **Verified license:** **Creative Commons CC0** on the official page.
- **What it supplies:** 140 3D files with variations and animation. Official tags are conveyor, belt, industrial, warehouse, and factory. The page records version 3.0 as a complete remake dated 2026-05-01.
- **Concept fit:** It directly covers the conveyor and industrial shell needed to test ordered rule modules, object movement, pause/run behavior, and visible machine stages. Its neutral geometry leaves room for surreal ingredients to carry the identity.
- **WebXR/format notes:** The official page does not enumerate interchange formats, so inspect the downloaded archive and convert the approved subset to GLB offline. Build the belt motion as deterministic object transforms rather than full rigid-body simulation, merge static warehouse dressing, and limit animated machinery to the few stations that communicate rule execution.

### Optional support: Quaternius — Sci-Fi Essentials Kit

- **Official URL:** https://quaternius.com/packs/scifiessentialskit.html
- **Verified license:** **CC0 1.0**. The official page explicitly permits personal, educational, and commercial use. The free Standard tier contains 60–70% of the pack.
- **What it supplies:** 65 futuristic assets including animated robot enemies, textured guns, animated screens, crates, and other sci-fi essentials. Official formats are FBX, OBJ, Blend, and glTF.
- **Concept fit:** Animated screens, crates, and robots can dress rule stations and create a readable machine-operator character without building every prop. Avoid the weapons unless transformed into unmistakably nonviolent dream-factory tools.
- **WebXR/format notes:** Use the free glTF subset, strip unused robot clips, and consolidate screen materials. Prefer emissive textures or simple UV animation over multiple live render targets. Keep every rule module’s visual state deterministic and legible from desktop, phone, and seated XR distances.

### Still custom

- **Modeling/animation:** Chunky if/then rule blocks, alarm clocks, clouds and other dream ingredients, exception pieces, transformation machines, bottled dreams, and final product animations.
- **Shaders/VFX:** Step-by-step rule-match traces, before/after trait visualization, cloud/dream transformations, and a reduced-motion execution mode.
- **Audio:** Conveyor and machine loops, per-rule match cues, exception/error sounds, surreal transformations, pause/step feedback, and a quiet-mode mix.

## Cross-pack WebXR ingestion rules

- Download and archive the exact free pack version used; do not rely on live URLs during builds.
- Prefer official glTF/GLB where supplied. Convert FBX/OBJ/Blend-only assets to GLB offline, then visually compare materials, pivots, scale, animation, and normals.
- Import only the selected models and animation clips. A CC0 catalog of hundreds of models is not a reason to ship the full archive.
- Consolidate materials, use KTX2 texture compression where the build pipeline supports it, consider mesh compression after measuring decode cost, and generate simple interaction/collision proxies.
- Keep static environment meshes separate from interactive ECS entities only where interaction requires it. Instance repeated foliage, buildings, props, and tokens.
- Audit draw calls, texture memory, triangle counts, skinned meshes, transparent surfaces, and real-time lights on a representative phone and standalone headset before art lock.
- Retain a `LICENSE`/source manifest in the project even for CC0 assets so provenance and replacement decisions remain reviewable.

## Source audit

All URLs below were opened successfully on **2026-07-20** and resolved to the official creator domain. License claims were read from each pack page, not inferred from third-party mirrors.

| Official source | Directly verified page facts |
| --- | --- |
| https://quaternius.com/packs/ultimatemodularruins.html | HTTP 200; “Ultimate Modular Ruins Pack”; 90 models; FBX/OBJ/Blend; CC0 link and commercial-use statement. |
| https://quaternius.com/packs/fantasypropsmegakit.html | HTTP 200; “Fantasy Props MegaKit”; 211 models; FBX/OBJ/Blend/glTF; CC0; free Standard tier states 60–70%. |
| https://quaternius.com/packs/ultimateplatformer.html | HTTP 200; “Platformer Game Kit”; 112 models; FBX/OBJ/Blend/glTF; CC0 link and commercial-use statement. |
| https://kenney.nl/assets/prototype-kit | HTTP 200; “Prototype Kit”; 145 files; 3D, animation and variations; Creative Commons CC0. |
| https://quaternius.com/packs/stylizednaturemegakit.html | HTTP 200; “Stylized Nature MegaKit”; 116 models; FBX/OBJ/Blend/glTF; CC0; free Standard tier states 60–70%. |
| https://quaternius.com/packs/ultimatecrops.html | HTTP 200; “Ultimate Crops Pack”; 102 models; FBX/OBJ/Blend; CC0. |
| https://quaternius.com/packs/downtowncitymegakit.html | HTTP 200; “Downtown City MegaKit”; 315 models; FBX/Blend/glTF; CC0; free Standard tier states 60–70%. |
| https://quaternius.com/packs/ultimatemonsters.html | HTTP 200; “Ultimate Monsters”; 50 models; FBX/OBJ/Blend/glTF; CC0 link and commercial-use statement. |
| https://quaternius.com/packs/animatedalien.html | HTTP 200; “Animated Alien Pack”; two models; FBX/OBJ/Blend; CC0 link and commercial-use statement. |
| https://quaternius.com/packs/universalanimationlibrary.html | HTTP 200; “Universal Animation Library”; complete catalog advertises 120+ animations; CC0; free Standard tier states 60–70%, while complete/source contents are paid and must not be attributed to the free archive without inspection. |
| https://quaternius.com/packs/ultimatefantasyrts.html | HTTP 200; “Ultimate Fantasy RTS”; 128 models; FBX/OBJ/Blend/glTF; CC0 link and commercial-use statement. |
| https://quaternius.com/packs/3dcardkitfantasy.html | HTTP 200; “3D Card Kit - Fantasy”; 50 models; FBX/OBJ/Blend/glTF; CC0; free Standard tier states 60–70%. |
| https://kenney.nl/assets/factory-kit | HTTP 200; “Factory Kit”; 140 files; 3D, animation and variations; Creative Commons CC0; version 3.0 dated 2026-05-01. |
| https://quaternius.com/packs/scifiessentialskit.html | HTTP 200; “Sci-Fi Essentials Kit”; 65 models; FBX/OBJ/Blend/glTF; CC0; free Standard tier states 60–70%. |

No third-party marketplace mirror is required for these recommendations. Recheck the source page and downloaded license at the moment an asset is imported, then record the actual pack version/archive hash in the project asset manifest.
