# Free 3D asset recommendations: concepts 01-07

Research scope: free, redistribution-safe starting assets for the first seven
WebXR concepts. Quaternius is preferred where it provides a close fit, followed
by Kenney and one independently hosted CC0 pack. All recommendations below were
checked against the publisher's current official page on 2026-07-20.

## Shared WebXR import guidance

- Treat every pack as source material, not as a reason to ship its whole
  archive. Import only the models used in the vertical slice.
- Normalize runtime assets to glTF 2.0/GLB. Quaternius pages list the available
  source formats per pack; when a pack lacks glTF, convert selected FBX/OBJ
  models in Blender, apply transforms, remove unused nodes, and export GLB.
- Prefer one atlas or a small set of shared materials per scene. Merge static
  scenery by material and instance repeated props where interaction does not
  require separate meshes.
- Author simple interaction colliders instead of using rendered meshes as
  colliders. Keep decorative objects out of ECS interaction queries.
- Test texture dimensions, transparency overdraw, skinning cost, and draw calls
  on a mobile-class browser before multiplying an asset across the scene.
- Keep a local copy of each downloaded license/README beside imported assets,
  even though all selections below are CC0 and require no attribution.

## 01. Loop Engineer

### Primary: Quaternius Ultimate Modular Sci-Fi Pack

- **Official URL:** https://quaternius.com/packs/ultimatemodularscifi.html
- **Verified license:** CC0. The pack page labels the pack `License CC0` and
  states that its models are free for personal and commercial projects;
  Quaternius' FAQ states that all models are CC0 and need no attribution.
- **What it supplies:** A large modular science-fiction interior set with
  environment pieces and props in FBX, OBJ, and Blend formats.
- **Concept mapping:** Reframe corridor modules and consoles as the tabletop's
  planning, delegation, implementation, test, and review stations. Repeated
  wall/floor parts can become bounded agent lanes, while props make the
  abstract software workflow feel like a readable operating room.
- **WebXR and format notes:** Convert only the chosen pieces to GLB. Collapse
  non-interactive station dressing into a few static batches, keep the task
  cube/cards separate as IWSDK `Interactable` entities, and replace complex
  imported collisions with boxes. Reuse one recolorable material family so the
  station state changes do not multiply materials.
- **Still custom:** The hired mentor NPC; task cards and red task cube; the SDLC
  timeline; the deliberately unexpanded SDLR feedback loop; evidence panels;
  readable station labels; success/failure animation; hologram/flow shaders;
  tutorial voice, UI cues, and feedback audio.

### Optional support: Quaternius Ultimate Animated Character Pack

- **Official URL:** https://quaternius.com/packs/ultimatedanimatedcharacter.html
- **Verified license:** CC0. The official page labels the pack `License CC0`
  and says the 50+ animated characters are free for personal and commercial
  use; the Quaternius FAQ confirms no attribution is required.
- **What it supplies:** More than 50 animated low-poly characters with multiple
  animations, in FBX, OBJ, and Blend formats.
- **Concept mapping:** Select one silhouette for the mentor and a few visually
  distinct characters for specialist agents. Color coding can distinguish
  planner, implementer, tester, browser QA, and reviewer roles without bespoke
  character production.
- **WebXR and format notes:** Export only selected characters and clips to GLB;
  strip unused bones and animation tracks. Keep one mentor skinned and animate
  distant specialists sparingly or bake them into simple state poses. Confirm
  skeleton scale and clip names before integration.
- **Still custom:** Role-specific wardrobe or badges, mentor facial feedback,
  pointing/teaching gestures tied to stations, and any lip sync.

## 02. Echo Cartographer

### Primary: Kenney Modular Cave Kit

- **Official URL:** https://kenney.nl/assets/modular-cave-kit
- **Verified license:** Creative Commons CC0, as stated on the official asset
  page.
- **What it supplies:** 40 modular, low-poly cave assets with color variations,
  intended to form connected cave spaces.
- **Concept mapping:** Build the three-chamber hackathon map from a small set of
  repeated cave segments. The modular boundaries provide authored surfaces for
  reliable echo returns, hidden openings, and one intentionally false echo.
- **WebXR and format notes:** The official listing confirms the asset count and
  CC0 license but does not enumerate archive formats on-page; inspect the
  download and normalize chosen pieces to GLB. Merge unseen cave dressing, but
  retain separate low-detail proxy surfaces for pulse intersections. Avoid
  dynamic shadows in darkness; the echo visualization should provide the scene
  readability.
- **Still custom:** The luminous moth, tuning wand, waypoint pins, pulse rings,
  triangulation markers, temporary reveal material, false-echo behavior,
  spatial pulse/return audio, captions, and haptic timing.

### Optional support: Quaternius Ultimate Stylized Nature Pack

- **Official URL:** https://quaternius.com/packs/ultimatestylizednature.html
- **Verified license:** CC0. The pack page labels the pack `License CC0` and
  states that its 60+ assets are free for personal and commercial projects.
- **What it supplies:** More than 60 textured nature assets with seamless
  textures and normal maps in FBX, OBJ, glTF, and Blend formats.
- **Concept mapping:** Use selected rocks, plants, and natural details to break
  up repeated cave modules and create recognizable triangulation landmarks.
  Sparse vegetation can also distinguish safe, wet, and dangerous chambers.
- **WebXR and format notes:** Start from the supplied glTF version. Downscale
  normal maps and textures for the dark scene, atlas small props, and use
  instancing for repeated rocks/plants. Do not spend fill rate on details that
  are invisible between pulses.
- **Still custom:** Bioluminescent texture variants, echo-reactive emission,
  authored acoustic metadata, and pulse-driven reveal masks.

## 03. Gravity Loom

### Primary: Quaternius Ultimate Space Kit

- **Official URL:** https://quaternius.com/packs/ultimatespacekit.html
- **Verified license:** CC0. The official pack is labeled `License CC0`, and
  its page says the models are free for personal and commercial projects.
- **What it supplies:** A broad low-poly space collection with planets,
  vegetation, animated characters, enemies, and other space-game assets in
  FBX, OBJ, glTF, and Blend formats.
- **Concept mapping:** Planets, celestial props, and selected alien flora can
  form the fixed tabletop sky, visual anchors, and decorative constellation
  vocabulary. Small planet-like objects can be rescaled into star-seeds.
- **WebXR and format notes:** Use the glTF source and import a very small subset.
  Replace any high-detail planet materials with simple baked textures; instance
  star-seed meshes; and render prediction arcs and gravity threads as custom
  lightweight geometry rather than importing more meshes. Keep simulation
  state deterministic and independent of render frame rate.
- **Still custom:** Loom anchors, tension handles, gravity threads, predicted
  orbit ribbons, stable-orbit scoring, constellation glyphs, emissive musical
  state shader, hand/controller affordances, and all adaptive music/audio.

### Optional support: Kenney Space Kit

- **Official URL:** https://kenney.nl/assets/space-kit
- **Verified license:** Creative Commons CC0, as stated on the official asset
  page.
- **What it supplies:** 150 low-poly space assets tagged for planets, ships,
  and space scenes.
- **Concept mapping:** Use structural pieces, rocks, ores, or compact space
  props as alternate loom anchors and puzzle landmarks. Its simpler shapes can
  bridge the style gap when a clear gameplay silhouette matters more than a
  decorative celestial model.
- **WebXR and format notes:** The official listing does not enumerate formats
  on-page; normalize selected models to GLB. Prefer a handful of shared-color
  variants and instance recurring anchor parts. Do not ship the full pack.
- **Still custom:** The same interactive loom system remains bespoke; this pack
  should provide silhouettes, not replace thread or trajectory rendering.

## 04. Pocket Weather Bureau

### Primary: Quaternius Ultimate Nature Pack

- **Official URL:** https://quaternius.com/packs/ultimatenature.html
- **Verified license:** CC0, explicitly shown on the official pack page. The
  source also says the pack is free for personal and commercial projects.
- **What it supplies:** 150 low-poly nature models in FBX, OBJ, and Blend
  formats.
- **Concept mapping:** Select terrain dressing, trees, rocks, crops, and plants
  for the tiny island's farm, surf edge, village surroundings, and festival
  site. Seasonal/color variants can make forecast consequences immediately
  visible.
- **WebXR and format notes:** Convert selected assets to GLB and build one small
  island rather than a broad landscape. Instance plants and trees, merge static
  clusters, use a shared atlas, and cap visible foliage. Prefer authored wet,
  dry, healthy, and storm-damaged variants over expensive dynamic vegetation.
- **Still custom:** Island terrain/topology, village and festival landmarks,
  pressure-front handles and spline, forecast clock, causal arrows and values,
  water/surf treatment, crop-state variants, weather simulation, rain/wind
  effects, reduced-motion contours, and weather/settlement audio.

### Optional support: Quaternius Modular Platformer Pack

- **Official URL:** https://quaternius.com/packs/modularplatformer.html
- **Verified license:** CC0, explicitly shown on the official page; the page
  also permits personal and commercial use.
- **What it supplies:** 53 modular platformer assets including clouds, simple
  trees, stairs, crates, collectibles, and related props in FBX, OBJ, and Blend
  formats.
- **Concept mapping:** The cloud models are useful, inexpensive forecast tokens;
  crates and collectibles can become bureau supplies, festival markers, or
  visible need indicators. Use the simple clouds as readable pressure outcomes,
  not as a volumetric weather system.
- **WebXR and format notes:** Convert a few models to GLB, instance clouds, and
  use unlit or lightly shaded materials. Keep transparent cloud layers shallow
  to avoid mobile overdraw; opaque stylized clouds are preferable.
- **Still custom:** Cloud-flow animation, front deformation, precipitation,
  island-scale shadows, forecast UI, and any physically suggestive weather
  transitions.

## 05. Choir Engine

### Primary: Kenney Factory Kit

- **Official URL:** https://kenney.nl/assets/factory-kit
- **Verified license:** Creative Commons CC0, as stated on the official asset
  page.
- **What it supplies:** 140 factory/warehouse assets tagged for conveyor belts
  and industrial scenes, with variations and animation support.
- **Concept mapping:** Conveyors, industrial modules, and animated machinery can
  become the three performing sections: piston rhythm, belt pulse, and product
  cadence. The kit is a strong visual foundation for a one-song factory stage.
- **WebXR and format notes:** The official listing does not enumerate archive
  formats on-page; normalize chosen assets to GLB. Retain separate meshes only
  for moving machine sections. Merge static warehouse dressing, simplify
  colliders, share materials, and drive all visual timing from the audio clock
  rather than frame-counted animation.
- **Still custom:** Conducting baton and accessible ray controls; cue/hold/cut
  indicators; expressive pistons, bells, and squeak states where the pack lacks
  them; beat-grid emission shader; latency calibration; haptics; captions; and
  the complete synchronized musical score and machine sound set.

### Optional support: iPoly3D Concert Pack on Poly Pizza

- **Official URL:** https://poly.pizza/bundle/Concert-Pack-ag2DBgUKV5
- **Verified license:** Public Domain (CC0), as stated on the bundle page.
- **What it supplies:** 13 low-poly concert/music/festival models downloadable
  in FBX and glTF.
- **Concept mapping:** Borrow recognizable stage, speaker, microphone, or
  instrument silhouettes to make each machine section read as a choir voice.
  These props can turn the factory's final cadence into a visible performance.
- **WebXR and format notes:** Prefer the glTF download. Inspect each model's
  material count before use because the bundle comes from a different artist;
  recolor or rematerial it to the Factory Kit palette and batch static stage
  dressing.
- **Still custom:** Mechanical instrument hybrids, factory-specific moving
  parts, beat-reactive materials, and all production-ready audio.

## 06. Museum of Stillness

### Primary: Quaternius Background Posed Humans Pack

- **Official URL:** https://quaternius.com/packs/backgroundposedhumans.html
- **Verified license:** CC0. The official page labels the pack `License CC0`
  and says the models are free for personal and commercial projects.
- **What it supplies:** 20 differently posed human models with eight hairstyles
  in FBX, OBJ, and Blend formats.
- **Concept mapping:** Recolor the static humans as stone, bronze, or painted
  exhibits. Their existing silhouettes provide the pose vocabulary the runaway
  sculpture studies and impersonates, while hairstyle variants prevent every
  gallery bay from feeling identical.
- **WebXR and format notes:** Convert selected poses to GLB, remove unnecessary
  interior geometry, and merge distant exhibits by gallery bay. For the player,
  swap among a small set of pose meshes or retarget a custom rig; do not load
  all 20 at once. Use authored low-cost spotlight cones instead of many shadowed
  lights.
- **Still custom:** The runaway sculpture's transition/pose system, curator and
  gaze logic, gallery shell, plinths and labels, spotlight beam, shadow-beat
  route, decoy, freeze feedback, accessible pose icons, footsteps, curator
  reactions, and stealth audio.

### Optional support: Kenney Furniture Kit

- **Official URL:** https://kenney.nl/assets/furniture-kit
- **Verified license:** Creative Commons CC0, as stated on the official asset
  page.
- **What it supplies:** 140 low-poly furniture and interior-prop assets.
- **Concept mapping:** Use benches, tables, lamps, shelving, and simple interior
  props to furnish gallery bays and build plinth-like silhouettes. Sparse props
  create cover and help players identify safe movement nodes.
- **WebXR and format notes:** The official page does not enumerate formats;
  normalize the selected models to GLB. Limit the palette, merge non-interactive
  furniture, instance repeated benches/lamps, and omit unseen undersides.
- **Still custom:** Museum architecture and exhibit-specific frames/plinths may
  still need simple bespoke meshes; the animated curator is not supplied by
  this pack.

## 07. Ghostline Dispatcher

### Primary: Quaternius Modular Train Pack

- **Official URL:** https://quaternius.com/packs/modulartrain.html
- **Verified license:** CC0, explicitly shown on the official pack page; the
  page also permits personal and commercial use.
- **What it supplies:** 15 animated, textured train models in FBX, OBJ, and
  Blend formats.
- **Concept mapping:** Assign visually distinct locomotives/cars to the three
  decades, then recolor them into spectral era variants. A small train set is
  enough for the scoped three-train timetable and makes schedule conflicts
  readable from a fixed overview.
- **WebXR and format notes:** Convert only the needed train configurations to
  GLB. Merge each non-articulated train into as few skinned/animated meshes as
  practical, share materials across era variants, and animate along authored
  paths. Use simple route proxies and avoid per-wheel physics.
- **Still custom:** The three-era station, six track segments, route graph,
  passenger groups, timetable tokens, era dial/tabs, reservation overlays,
  ghost transparency/dissolve and memory trails, departure/re-entry states,
  train movement logic, announcements, rail audio, and reduced-motion markers.

### Optional support: Kenney Train Kit

- **Official URL:** https://kenney.nl/assets/train-kit
- **Verified license:** Creative Commons CC0, as stated on the official asset
  page.
- **What it supplies:** 100 low-poly train-themed assets.
- **Concept mapping:** Use track, platform, signal, station, or rolling-stock
  pieces from the kit to fill infrastructure gaps around the Quaternius trains.
  The larger asset count is useful for building three visibly different era
  layers without custom-modeling every sign and platform detail.
- **WebXR and format notes:** The official page does not enumerate formats;
  inspect the archive and normalize selected meshes to GLB. Keep the network
  schematic: instance track units, merge platform dressing, and use color and
  emission rather than geometry duplication to show era availability.
- **Still custom:** Temporal variants, spectral passengers, readable timetable
  UI, route/reservation logic, era transitions, and ghost/train audio remain
  bespoke.

## Source audit

Access date for every source below: **2026-07-20**.

| Source | Official URL verified | License evidence used |
| --- | --- | --- |
| Quaternius FAQ | https://quaternius.com/faq.html | States all models are CC0, free for commercial, educational, and personal projects, with no attribution required. |
| Ultimate Modular Sci-Fi Pack | https://quaternius.com/packs/ultimatemodularscifi.html | Page marks `License CC0`; page permits personal and commercial use. |
| Ultimate Animated Character Pack | https://quaternius.com/packs/ultimatedanimatedcharacter.html | Page marks `License CC0`; page permits personal and commercial use. |
| Modular Cave Kit | https://kenney.nl/assets/modular-cave-kit | Official Kenney listing states Creative Commons CC0. |
| Ultimate Stylized Nature Pack | https://quaternius.com/packs/ultimatestylizednature.html | Page marks `License CC0`; page permits personal and commercial use. |
| Ultimate Space Kit | https://quaternius.com/packs/ultimatespacekit.html | Page marks `License CC0`; page permits personal and commercial use. |
| Space Kit | https://kenney.nl/assets/space-kit | Official Kenney listing states Creative Commons CC0. |
| Ultimate Nature Pack | https://quaternius.com/packs/ultimatenature.html | Page marks `License CC0`; page permits personal and commercial use. |
| Modular Platformer Pack | https://quaternius.com/packs/modularplatformer.html | Page marks `License CC0`; page permits personal and commercial use. |
| Factory Kit | https://kenney.nl/assets/factory-kit | Official Kenney listing states Creative Commons CC0. |
| Concert Pack | https://poly.pizza/bundle/Concert-Pack-ag2DBgUKV5 | Bundle page states Public Domain (CC0). |
| Background Posed Humans Pack | https://quaternius.com/packs/backgroundposedhumans.html | Page marks `License CC0`; page permits personal and commercial use. |
| Furniture Kit | https://kenney.nl/assets/furniture-kit | Official Kenney listing states Creative Commons CC0. |
| Modular Train Pack | https://quaternius.com/packs/modulartrain.html | Page marks `License CC0`; page permits personal and commercial use. |
| Train Kit | https://kenney.nl/assets/train-kit | Official Kenney listing states Creative Commons CC0. |

### Audit cautions

- The recommendations point to publisher/source pages, not third-party mirrors.
- The asset licenses do not automatically cover trademarks or third-party
  content added later by the project; preserve provenance for project-created
  textures, fonts, audio, and generated art separately.
- A future download should be rechecked if a source page changes. Record the
  downloaded archive name, checksum, access date, and included license file in
  the repository's eventual asset manifest.
