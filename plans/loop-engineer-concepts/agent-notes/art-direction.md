# Art direction and asset research — Loop Engineer

Logical assignment: `DISC-ART-01`  
Role: Art director / asset researcher  
Research date: 2026-07-20  
Deliverable: Five distinct visual systems, one Azure FLUX.2-pro hero prompt brief
per system, and a licensed 3D-asset shortlist that can support a four-hour build.

## Art-direction contract

The five concepts should look unrelated at thumbnail size while sharing one quiet
brand idea: **a physical loop changes from uncertain to verified**. The loop is a
storm lens, a season ring, a recipe pipeline, a railway circuit, or layered
prototype evidence. It is never a floating software flowchart.

- Generated heroes are visual-first and contain **no readable text**. Titles,
  labels, requirements, and infographics belong in HTML/SVG, not in the image.
- Each hero needs a clean, low-detail corner for an external title and must still
  read in a roughly 390 × 220 mobile crop.
- Failure and success are distinguished by shape, motion, and spatial continuity,
  not red/green alone. A fault is broken, branched, stalled, or incomplete; a
  pass is continuous, aligned, moving, or self-sustaining.
- Each runtime proposal uses one compact diorama, one hero machine, five or fewer
  material families, two principal lights, and one restrained state effect.
- Asset packs below are alternatives. Import **one primary pack plus primitives**;
  combining several full packs would lose visual coherence and the four-hour cap.
- No third-party packs were downloaded or redistributed during this design spike.

## Azure FLUX.2-pro production profile

Microsoft documents `FLUX.2-pro` as the Azure/Microsoft Foundry model ID and the
BFL provider-specific route as the path that exposes `seed`, `aspect_ratio`, and
`output_format`. Black Forest Labs recommends a subject + action + style + context
prompt structure and states that FLUX.2 has no separate negative-prompt feature.
Accordingly, every brief below puts the text-free requirement in the main prompt
and adds a human rejection checklist rather than a negative-prompt block.

Recommended generation handling:

- Model/deployment: `FLUX.2-pro` through the BFL provider-specific Azure Foundry
  API.
- Aspect ratio: `16:9`; keep the focal action inside the middle 70% for alternate
  crops.
- Master: request the deployment's lossless/highest-quality supported output,
  archive that result, then locally convert the selected image to an optimized
  WebP for the offline concept book.
- Reproducibility: explore without promising a seed, then record the final seed
  and exact prompt in the image manifest once a composition is selected.
- References: none for the first pass. If later used, references must be
  project-owned, generated for this project, or clearly licensed for that use.
- Selection gate: reject any image with lettering-like marks, logos, signatures,
  UI text, unreadable pseudo-type, extra controls that imply a different mechanic,
  or a composition that becomes ambiguous at card size.

Authoritative model guidance:

- Microsoft Learn, “Deploy and use FLUX models in Microsoft Foundry”:  
  https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-flux
- Black Forest Labs, “Prompting Guide — FLUX.2 [pro] & [max]”:  
  https://docs.bfl.ai/guides/prompting_guide_flux2

## Differentiation at a glance

| Concept / system | Dominant silhouette | Materials | Palette | Light / camera | Thumbnail test |
| --- | --- | --- | --- | --- | --- |
| **Stormglass — Tempest Nouveau** | Tall concentric lens inside a vertical tower | Cracked stormglass, oxidized brass, wet slate | `#081B35` navy, `#45D7D0` cyan, `#F36B62` coral, `#B78B45` brass | Lightning rim light; low three-quarter view | A cyan beam threads a brass eye through an indigo storm |
| **Tomorrow Garden — Porcelain Solarpunk** | Circular terrarium with roots spiraling inward | Matte ceramic, seed paper, translucent bioplastic, leaves | `#EAE3CF` warm white, `#78A66A` sage, `#36B9A8` teal, `#F2A46F` apricot, `#8A74BC` lilac | Soft dawn; 35° isometric diorama | A tiny world blooms around one luminous season ring |
| **Galactic Test Kitchen — Astro-Diner Pop** | Horizontal three-stage transparent pipeline | Cream enamel, chrome, clear tubes, soft food forms | `#FFF1D2` cream, `#F05A47` tomato, `#35C6C8` aqua, `#F5B83D` yolk, `#222A3A` ink | Bright counter light; eye-level frontal view | Colorful abstract food travels through a clear space-age printer |
| **Sunrise Express — Celestial Rail Deco** | Radial model railway over a crescent city | Lacquered wood, polished brass, enamel, opal light | `#07152E` midnight, `#F5C45B` sun gold, `#EF6A66` coral, `#E8E1CE` ivory | Pre-dawn edge light; elevated oblique view | A gold ghost train closes a loop and paints dawn across a toy city |
| **Museum of Almosts — Archival Spectralism** | Symmetric plinth surrounded by offset translucent versions | Folded paper, porcelain, graphite, aged wood, projected light | `#D8CCB7` paper, `#2B2928` graphite, `#7ED8D5` ghost cyan, `#8B3F4A` oxblood, `#D99A4E` amber | Quiet spotlights; centered frontal view | Three pale prototypes align and release one paper bird |

These systems should not borrow each other's signatures. Stormglass is not a
cozy brass train set; the Garden has no industrial panels; the Kitchen avoids
generic neon cyberpunk; Sunrise Express avoids storm effects and transparent
science glass; the Museum avoids saturated toy colors and spectacle clutter.

## 1. Stormglass — Tempest Nouveau

### One-glance thesis

An Art Nouveau weather instrument made architectural: the player stands inside
a giant brass eye while lightning exposes the broken route and stormglass turns
the correction into a safe tunnel. It should feel weathered, precise, and
heroic—not steampunk clutter or disaster horror.

### Visual system

- **Shape language:** tall lancet arches, concentric rings, faceted prisms, long
  copper curves, and branching fault traces. Preserve a strong vertical axis.
- **Surface hierarchy:** mostly dark matte slate; brass only on interactable
  frames; glass only on the active lens; cyan emission only on the current test.
- **State grammar:** an untested route is a dim continuous engraving; a failed
  test forks into a coral lightning branch and leaves a faint ghost trail; a
  verified route becomes one stable cyan tunnel with a smooth traveling pulse.
- **Composition:** player/action on the right third, storm and courier route
  sweeping toward center, quiet navy cloud mass at upper left for external copy.
- **Comfort/readability:** lightning is a drawn path with a soft bloom, not a
  full-screen flash. Glass remains translucent rather than refractive enough to
  distort sockets or controls.

### Four-hour smallest-complete art build

1. Block one circular lantern-room platform and three tall arches from primitives.
2. Build the hero machine from three torus rings, one prism, one lever, and two
   copper curve meshes; use at most four opaque materials plus one transparent
   glass material.
3. Use a dark cloud skydome or layered alpha planes, one cyan traveling pulse,
   and one reusable branching fault curve.
4. Add two lights: cool storm rim and warm workbench pool. Bake nothing.
5. Cut first: volumetric clouds, rain particles, glass refraction, animated
   architecture, unique tower rooms, and a modeled courier. A lit glider
   silhouette is enough.

### Azure FLUX.2-pro hero-image prompt brief

**Intent:** Sell the judge-retellable transformation: a visible failed trace is
turned into a safe corridor by one physical prism change.

**Prompt:**

> Wide cinematic 16:9 key art for a polished WebXR puzzle game. Inside the
> lantern room of a towering sky-lighthouse, a lone stormkeeper at a waist-high
> brass-and-crystal lens table rotates one large faceted prism. The machine forms
> a clear circular loop of concentric stormglass rings and curved copper conduits.
> One stable cyan beam threads through the rings and opens a turquoise tunnel in
> a vast indigo cloud sea, while a faint earlier coral lightning branch remains
> visible as the failed test trace. A tiny courier glider approaches the safe
> corridor in the distance. Art Nouveau storm-science fantasy, cracked
> translucent glass, oxidized brass, wet charcoal slate, controlled luminous
> weather, premium stylized 3D concept art, dramatic vertical scale, readable
> silhouettes, low three-quarter camera, focal action on the right third, quiet
> dark cloud negative space in the upper left. Every surface is blank and
> unmarked; the image communicates only through form, color, light, and motion,
> with no written characters, labels, numbers, signs, logos, interface text,
> captions, borders, signatures, or watermarks.

**Reject if:** it reads as a generic airship, the lens loop is unclear, lightning
fills the frame, the route cannot be distinguished from the failed trace, or any
pseudo-lettering appears on brass plates.

## 2. The Tomorrow Garden — Porcelain Solarpunk

### One-glance thesis

A seedship terrarium presented like a hand-built scientific tea garden. The
system's iterations are layered seasons: ceramic controls stay calm and legible
while roots, water, and pollinators make causality visible. It should feel cared
for and optimistic, never like a sterile biotech lab.

### Visual system

- **Shape language:** nested circles, leaf fans, root spirals, shallow hexagonal
  input tiles, seed-like sockets, and one large glass dome.
- **Surface hierarchy:** warm matte porcelain for controls, soft paper fiber for
  substrate, translucent teal for water, saturated living color only on growth.
- **State grammar:** prior attempts remain as low-opacity lilac plant silhouettes;
  a failed criterion ends in a dry, flooded, or unvisited shape; a verified cycle
  completes one root-to-flower-to-pollinator loop and settles into gentle motion.
- **Composition:** three-quarter isometric tabletop with the gardener's hand or
  small figure at lower left, the habitat centered, and a softly rising planet
  making clean warm space at upper right.
- **Comfort/readability:** growth swaps between authored stages rather than
  continuously scaling meshes through the player. Water and pollinator paths use
  different shapes and motion rhythms as well as color.

### Four-hour smallest-complete art build

1. Make one circular bench, glass dome, substrate disc, three large input tiles,
   and three plant locations.
2. Reuse three authored growth stages per plant; cross-fade or swap them rather
   than simulate vines, fluids, or botany.
3. Draw one root line, one water line, and one pollinator spline; previous cycles
   reuse the same geometry with low opacity.
4. Use one soft key, one planet rim, and a flat pastel background. Limit the
   living set to two plant species and one abstract pollinator.
5. Cut first: procedural growth, swarms, soil simulation, leaf physics, multiple
   domes, detailed ship interiors, and unique models for every season.

### Azure FLUX.2-pro hero-image prompt brief

**Intent:** Show controlled iteration as care: imperfect ghost gardens surround
one small final habitat that can sustain itself.

**Prompt:**

> Wide 16:9 proposal hero for a polished WebXR puzzle game. A circular seedship
> terrarium sits on a waist-high porcelain workbench while a cycle gardener moves
> one warm sun tile into a large seed-shaped socket. Inside the dome, a luminous
> loop connects teal water, curling roots, apricot flowers, and one gentle
> geometric pollinator. Two translucent lilac ghost gardens from earlier seasons
> overlap behind the thriving final growth, making comparison instantly visible.
> Beyond the glass, a new planet rises at dawn. Cozy porcelain solarpunk,
> hand-built scientific diorama, matte warm ceramic, seed paper, translucent
> bioplastic, soft rounded plants, sage green, teal, apricot, lilac, and warm
> ivory, premium stylized 3D illustration, calm 35-degree isometric camera,
> centered habitat with clear negative space in the upper right, readable at
> thumbnail size. All tiles, tags, tools, and ship surfaces are blank and
> unmarked; storytelling is entirely pictorial, with no written characters,
> labels, numbers, signage, logos, interface text, captions, signatures, borders,
> or watermarks.

**Reject if:** it becomes a generic forest, photoreal botanical illustration,
clinical laboratory, or magical spell scene; if ghost attempts are confused with
living plants; or if tile markings resemble text.

## 3. Galactic Test Kitchen — Astro-Diner Pop

### One-glance thesis

A friendly first-contact counter built from 1960s space-diner forms and a
transparent three-stage food pipeline. Requirements become shapes and reactions,
not dense screens. The mood is warm workplace comedy with precise feedback, not
frantic cooking chaos.

### Visual system

- **Shape language:** horizontal capsules, rounded rectangles, clear tubes,
  modular trays, circles, and soft geometric food forms. The pipeline always
  reads left-to-right in desktop art and remains reversible in-world if needed.
- **Surface hierarchy:** cream enamel shell, chrome edges, clear tubes, dark ink
  cavities, and one saturated color per pipeline stage.
- **State grammar:** each guest need has a distinct silhouette slot; a mismatch
  physically diverts or compresses the sample at the relevant stage; a repeated
  pass sends three synchronized pulses into one shared serving loop.
- **Composition:** frontal eye-level counter, chef/action on left, machine across
  the center, three guest silhouettes behind a curved window on right, clean
  cream wall or space gradient at upper left.
- **Tone/readability:** use abstract dumpling, ribbon, orb, and spiral food shapes
  rather than parodying a real cuisine. Guests are respectful graphic silhouettes,
  not caricatures. No slime, gross-out textures, or alarm-red lighting.

### Four-hour smallest-complete art build

1. Block one counter, three rounded module boxes, two clear tubes, one sample
   tray, and one release tray.
2. Use four abstract food meshes and color/material swaps; no authored recipes or
   fluid simulation.
3. Represent guests with three large bust silhouettes or backlit window shapes;
   reactions use pose, eye shape, and matching receptacle geometry, not text.
4. Add one bright counter key and one colored tube light. Animate only a sample
   traveling through three fixed points and a short final flourish.
5. Cut first: articulated alien characters, a modeled dining room, steam/fluid
   effects, utensils, ingredient piles, conveyor physics, and more than three
   requirements.

### Azure FLUX.2-pro hero-image prompt brief

**Intent:** Make “debug dinner from user feedback” obvious in one frame: one
module swap produces a dish that visibly satisfies three different guests.

**Prompt:**

> Wide 16:9 key art for a warm, polished WebXR systems puzzle. At a cheerful
> first-contact space-diner counter, a systems chef slides one rounded module into
> a transparent three-stage food printer. A sample travels through clear tubes as
> distinct tomato, aqua, and golden pulses, emerging as elegant luminous ribbons
> of abstract food that curl into one shared circular serving arrangement. Three
> very different but friendly nonhuman guest silhouettes watch from behind a
> curved dining window, each responding with a clear welcoming pose and matching
> geometric receptacle. Retrofuturist astro-diner pop, cream enamel, chrome trim,
> clear acrylic tubes, soft toy-like food geometry, tomato red, aqua, yolk gold,
> warm cream, and deep ink blue, premium stylized 3D concept art, bright frontal
> counter lighting, eye-level camera, strong horizontal pipeline, crisp readable
> shapes, quiet cream negative space in the upper left. Every panel, tray, apron,
> wall, and machine surface is blank and unmarked; the image contains no written
> characters, labels, numbers, menus, brands, logos, interface text, captions,
> signatures, borders, or watermarks.

**Reject if:** it reads as a restaurant-management game, generic neon cyberpunk,
or a frantic cooking scene; if any guest is a stereotype; if the pipeline stages
cannot be counted; or if food and feedback merge into visual clutter.

## 4. Sunrise Express — Celestial Rail Deco

### One-glance thesis

A midnight conductor operates a precise model railway suspended above a curved,
sleeping city. Testing is a ghost train on the tabletop; release turns that same
verified path into a city-scale ribbon of dawn. The system is toy-like civic
magic, not realistic transit operations.

### Visual system

- **Shape language:** radial rails, crescent districts, fan-shaped switch points,
  stacked train-car silhouettes, and one oversized brass dispatch control.
- **Surface hierarchy:** midnight lacquered wood for the table, ivory track bed,
  polished brass only on switches, opal windows, and gold emission only on tested
  track.
- **State grammar:** rehearsal is a translucent ivory ghost train with a retained
  path ribbon; an unmet dependency stops at a visibly open track shape; a passing
  run completes the ring; release changes the same route from opal to sunrise gold
  as districts wake in sequence.
- **Composition:** elevated oblique view so the entire route is legible, conductor
  at lower left, train arc crossing center, dark curved city at the bottom, clean
  predawn sky at upper right.
- **Comfort/readability:** no rapid camera travel or flashing city grid. The hero
  train moves slowly enough to inspect. Car roles differ by silhouette—lamp,
  prism, and clock-like disc—not hue alone.

### Four-hour smallest-complete art build

1. Make one circular dispatch table, six modular track pieces, three switch
   states, a three-car train, and eight repeated district blocks.
2. Use a curve or line strip for the retained rehearsal path; clone the same train
   with transparent material for the ghost run.
3. Light districts by toggling shared emissive materials in sequence. The distant
   city is simple extruded shapes against a curved backdrop.
4. Use one cool predawn ambient and one warm sunrise directional light. Animate
   one train spline and one dispatch control.
5. Cut first: realistic rail signaling, crowds, passengers, detailed stations,
   multiple train routes, physically simulated wheels, moving camera shots, and
   a full orbital city.

### Azure FLUX.2-pro hero-image prompt brief

**Intent:** Capture the proposal's signature transition: a tabletop test route
closes successfully and the released train carries sunrise into the city.

**Prompt:**

> Wide cinematic 16:9 hero image for a polished WebXR puzzle game. A midnight
> release conductor leans over a circular celestial model railway suspended above
> a dark curved city, moving one large brass switch into alignment. A translucent
> ivory rehearsal train has just completed a visible radial loop on the tabletop,
> leaving a precise opal path ribbon. On the same verified route, a small
> three-car release train begins to glow sun-gold and arcs toward the skyline,
> waking crescent-shaped districts in sequence with coral dawn light. Celestial
> railway Art Deco, lacquered midnight-blue wood, polished brass, ivory enamel,
> opal glass, restrained coral and gold illumination, handcrafted civic fairy
> tale, premium stylized 3D concept art, elevated oblique camera, entire route
> readable at a glance, conductor and control at lower left, clean predawn sky
> negative space in the upper right. All tickets, controls, cars, stations, and
> buildings are blank and unmarked; the scene uses no written characters, labels,
> numbers, signs, logos, interface text, captions, signatures, borders, or
> watermarks.

**Reject if:** it looks like a realistic train simulator, holiday train display,
or steampunk storm scene; if the rehearsal path and release train are not
distinct; if the radial switchyard is cropped; or if stations acquire text.

## 5. The Museum of Almosts — Archival Spectralism

### One-glance thesis

A quiet museum mystery rendered in tactile paper, porcelain, and projected cyan
evidence. Failed prototypes do not become debris; they remain as dignified,
offset layers that align around one corrected mechanism and release a paper bird.
The mood is wondrous and reflective, never haunted.

### Visual system

- **Shape language:** a centered plinth, folded planes, elegant crank arcs,
  incomplete circles, offset duplicate silhouettes, and a final wing shape.
- **Surface hierarchy:** warm paper and porcelain on the physical artifact, dark
  graphite architecture, oxblood only on the changed component, translucent cyan
  only on evidence echoes.
- **State grammar:** each test adds one five-second cyan duplicate with a clearly
  missing or misaligned part; selected comparisons hold two echoes at low opacity;
  verification snaps the layers into one complete circle before the paper bird
  unfolds through it.
- **Composition:** centered frontal gallery view with strict symmetry; plinth and
  artifact in the lower middle; echoes fan outward; warm empty wall at upper left
  or right for external copy.
- **Tone/readability:** no cobwebs, horror shadows, spectral people, or antique
  clutter. Contributors are implied through varied tool marks and prototype
  layers, not portraits or generated handwriting.

### Four-hour smallest-complete art build

1. Build one room from floor, back wall, two columns, and one plinth; add a simple
   crank machine from cylinders, folded planes, and one colored component.
2. Author three machine states by toggling or rotating the same six parts. Clone
   them with a cyan transparent material for test echoes.
3. Make the paper bird from fewer than ten flat triangles and animate one short
   unfold/flight arc; a static open bird plus spline motion is acceptable.
4. Use two warm spotlights and one cyan projector-like fill. Keep the room mostly
   dark graphite so evidence reads without bloom.
5. Cut first: a full museum, readable exhibit labels, human memory characters,
   hand-drawn texture maps, complex paper simulation, many inventions, and long
   holographic cutscenes.

### Azure FLUX.2-pro hero-image prompt brief

**Intent:** Show failure as preserved evidence: three imperfect versions align
into one verified invention and become the final wonder.

**Prompt:**

> Wide 16:9 proposal hero for a quiet, wondrous WebXR systems mystery. In a
> midnight museum gallery, a night conservator turns the crank of a small
> paper-and-porcelain invention on a centered stone plinth. Three translucent cyan
> prototype echoes surround the artifact in precise offset layers, each showing a
> different incomplete circular mechanism. The corrected oxblood component makes
> the layers align into one complete luminous ring, and a folded ivory paper bird
> opens its wings and glides toward the warm gallery light. Archival spectralism,
> tactile folded paper, matte porcelain, graphite metal, aged wood, restrained
> ghost-cyan projection and amber spotlights, premium stylized 3D concept art,
> gentle reflective mood, centered frontal composition, strong symmetry, clear
> silhouettes, quiet warm wall negative space in the upper right. Every plinth,
> display surface, tool, and artifact is blank and unmarked; process history is
> communicated only through layered objects and light, with no written
> characters, labels, numbers, handwriting, signs, logos, interface text,
> captions, signatures, borders, or watermarks.

**Reject if:** it reads as a haunted museum, a lone-genius memorial, or a generic
hologram room; if the three iterations do not visibly differ; if the bird is the
only focal point; or if wall plaques contain pseudo-writing.

## Free / CC-friendly 3D asset candidates

### License keys and constraints

All shortlisted models are CC0, which is deliberately safer for a hackathon than
mixing attribution regimes. Exact license sources:

- **Q0 — Quaternius:** https://quaternius.com/faq.html  
  The FAQ says all models are CC0, free for commercial, educational, and personal
  projects, modifiable, and do not require attribution. CC0 permits copying and
  redistribution. No extra model restriction was found. Keep the downloaded
  license/readme with any selected files and credit “Quaternius” voluntarily.
- **K0 — Kenney:** https://kenney.nl/support  
  The support page says game assets on asset pages are CC0, including commercial
  use, with no attribution required. It explicitly says not to use the Kenney
  logo, which is reserved for official Kenney projects. The CC0 grant covers the
  game assets, not third-party branding that might be shown on the website.
- **P0 — Poly Haven:** https://polyhaven.com/license and
  https://docs.polyhaven.com/en/faq  
  Poly Haven explicitly allows commercial use, no attribution, and redistribution.
  Its FAQ says a redistributor must not claim original authorship or relicense the
  assets; for a sold asset-containing product, it asks publishers to make clear
  that the assets are free/public domain and link back when possible.
- **CC0 deed:** https://creativecommons.org/publicdomain/zero/1.0/  
  This is the common license reference; source pages remain the authority for
  whether each file is actually offered under CC0.

Repository hygiene is stricter than the legal minimum: after concept selection,
vendor only used, optimized meshes and required textures—not untouched full-pack
archives—and retain the source URL, author, license URL, and access date. This is
a size/provenance decision, not an additional license restriction.

### Candidate matrix

| Concept | Candidate and exact source URL | License | Fast use / caveat |
| --- | --- | --- | --- |
| Stormglass | Quaternius, **Steampunk Turret Pack** — 37 models, FBX/OBJ/Blend: https://quaternius.com/packs/turretpack.html | Q0 | Best primary source for compact brass machine bodies. Use one turret chassis as the lens base; do not import 37 variants. Recolor and remove weapon silhouette so the fantasy reads as maintenance, not combat. |
| Stormglass | Quaternius, **Modular Dungeons Pack** — 48 models, FBX/OBJ/Blend: https://quaternius.com/packs/modulardungeon.html | Q0 | Fast arches and stone shell. Select two wall/arch pieces only; a full dungeon would muddy the vertical lighthouse read. |
| Stormglass | Kenney, **Castle Kit** — 75 3D files: https://kenney.nl/assets/castle-kit | K0 | Cleaner fallback tower shell with material variations. Do not use Kenney branding. |
| Stormglass | Poly Haven, **Modular Industrial Pipes 01** — 12K triangles: https://polyhaven.com/a/modular_industrial_pipes_01 | P0 | Optional single focal valve/pipe cluster. Downscale textures and inspect draw calls; avoid if conversion/optimization exceeds 20 minutes. |
| Tomorrow Garden | Quaternius, **Ultimate Crops Pack** — 102 models in five growth stages, FBX/OBJ/Blend: https://quaternius.com/packs/ultimatecrops.html | Q0 | Strongest mechanic fit: swap authored growth stages instead of procedural growth. Pick two crop families and three stages each. |
| Tomorrow Garden | Quaternius, **Ultimate Stylized Nature Pack** — 63 models, including glTF: https://quaternius.com/packs/ultimatestylizednature.html | Q0 | Good primary backdrop/rocks/trees with a web-friendly format. Keep only a small canopy and two rock forms so the terrarium remains readable. |
| Tomorrow Garden | Kenney, **Nature Kit** — 330 3D files: https://kenney.nl/assets/nature-kit | K0 | Broad fallback with simple silhouettes. The large count is a browsing risk; preselect no more than eight meshes. Do not use Kenney branding. |
| Galactic Test Kitchen | Quaternius, **Ultimate Food Pack** — 103 models, FBX/OBJ/Blend: https://quaternius.com/packs/ultimatefood.html | Q0 | Use a few neutral ingredients or serving forms, then recolor into fictional food. Avoid assembling a recognizable real-world cuisine as the alien joke. |
| Galactic Test Kitchen | Quaternius, **Ultimate Modular Sci-Fi Pack** — 46 models, FBX/OBJ/Blend: https://quaternius.com/packs/ultimatemodularscifi.html | Q0 | Best machine-shell fallback. Select blank wall/cabinet pieces and overlay project materials; reject any detail that suggests weapons or a command bridge. |
| Galactic Test Kitchen | Kenney, **Food Kit** — 200 3D files: https://kenney.nl/assets/food-kit | K0 | Very fast readable food silhouettes. Use as geometry ingredients, not cultural caricature. Do not use Kenney branding. |
| Galactic Test Kitchen | Kenney, **Factory Kit** — 140 3D files, variations and animation: https://kenney.nl/assets/factory-kit | K0 | Conveyor and machine modules can establish the three-stage pipeline quickly. Import only one belt/module family and recolor into cream astro-diner enamel. |
| Sunrise Express | Quaternius, **Modular Train Pack** — 15 models, FBX/OBJ/Blend: https://quaternius.com/packs/modulartrain.html | Q0 | Smallest, safest primary pack. Enough for a train silhouette without asset browsing overhead; custom track can remain primitive curves. |
| Sunrise Express | Quaternius, **Ultimate Space Kit** — 92 models, including glTF: https://quaternius.com/packs/ultimatespacekit.html | Q0 | Optional planets, stars, and orbital accents. Use at most one planet and a few background shapes; do not turn the proposal into a spaceship game. |
| Sunrise Express | Kenney, **Train Kit** — 100 3D transport files: https://kenney.nl/assets/train-kit | K0 | Broader fallback for tracks, train, tram, and trolley forms. Choose one train family and remove realistic rail-signage details. Do not use Kenney branding. |
| Museum of Almosts | Quaternius, **Ultimate House Interior Pack** — 123 models, FBX/OBJ/Blend: https://quaternius.com/packs/ultimatehomeinterior.html | Q0 | Source for restrained plinth-adjacent furniture and workshop residue. Use two props at most; build gallery walls and the hero artifact from primitives. |
| Museum of Almosts | Kenney, **Furniture Kit** — 140 3D files: https://kenney.nl/assets/furniture-kit | K0 | Clean fallback benches, tables, and lamps. Recolor into paper/graphite/wood palette and avoid filling the room. Do not use Kenney branding. |
| Museum of Almosts | Poly Haven, **Circuit Board** — 14K triangles: https://polyhaven.com/a/circuit_board | P0 | Optional internal component for one prototype, not a room-scale asset. Use a low texture resolution or flat material; the source model is more detailed than the four-hour visual target needs. |

### Asset-selection recommendation

If one proposal is selected for a four-hour prototype, use this order:

1. Prefer the Quaternius candidate whose silhouettes directly express the
   mechanic: Crops for Garden, Modular Train for Sunrise Express, and Steampunk
   Turret as a repurposed chassis for Stormglass.
2. Use Kenney when a broader but visually consistent fallback is needed, especially
   Food/Factory for the Kitchen and Furniture for the Museum.
3. Use Poly Haven only as a single hero accent after checking texture size,
   triangle count, material count, and mobile/WebXR cost. Its realism can clash
   with the low-poly packs unless flattened into the chosen palette.
4. If importing, converting, or cleaning an asset takes more than 20 minutes,
   replace it with primitives. The proposal's loop-state transformation matters
   more than prop density.

## Integration assumptions and risks

- The five art systems are paired to the narrative concepts currently recorded
  in `plans/loop-engineer-concepts/agent-notes/narrative.md`. If game-design
  integration swaps mechanics between fantasies, preserve the visual identity
  and remap only the interactable hero prop.
- The final curriculum vocabulary is still owned by learning design. These images
  intentionally avoid labels so later terminology changes do not invalidate art.
- FLUX.2-pro can still hallucinate pseudo-writing despite an explicit text-free
  prompt. A generated image is not accepted until a human checks all panels,
  tags, tickets, architecture, clothing, and edge details at 100% zoom.
- Transparent glass, alpha ghosts, and bloom are the highest shared WebXR risks.
  Cap transparent layers, avoid screen-sized alpha planes, and test mobile fill
  rate before preserving atmospheric effects.
- Quaternius and Kenney packs have intentionally simple styles but do not
  automatically share scale, pivots, materials, or glTF availability. The plan
  assumes one primary pack per concept and a short conversion pass where glTF is
  absent.
- CC0 minimizes licensing friction but does not remove provenance duties. Record
  the exact downloaded archive/version and keep its bundled license file when an
  asset is eventually added to the repository.

## Sources checked

All web sources below were accessed 2026-07-20.

- Microsoft Learn FLUX deployment/use documentation:  
  https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-flux
- Black Forest Labs FLUX.2 prompting guide:  
  https://docs.bfl.ai/guides/prompting_guide_flux2
- Quaternius FAQ/license statement: https://quaternius.com/faq.html
- Quaternius asset pages:  
  https://quaternius.com/packs/turretpack.html  
  https://quaternius.com/packs/modulardungeon.html  
  https://quaternius.com/packs/ultimatecrops.html  
  https://quaternius.com/packs/ultimatestylizednature.html  
  https://quaternius.com/packs/ultimatefood.html  
  https://quaternius.com/packs/ultimatemodularscifi.html  
  https://quaternius.com/packs/modulartrain.html  
  https://quaternius.com/packs/ultimatespacekit.html  
  https://quaternius.com/packs/ultimatehomeinterior.html
- Kenney support/license statement: https://kenney.nl/support
- Kenney asset pages:  
  https://kenney.nl/assets/castle-kit  
  https://kenney.nl/assets/nature-kit  
  https://kenney.nl/assets/food-kit  
  https://kenney.nl/assets/factory-kit  
  https://kenney.nl/assets/train-kit  
  https://kenney.nl/assets/furniture-kit
- Poly Haven license and redistribution FAQ:  
  https://polyhaven.com/license  
  https://docs.polyhaven.com/en/faq
- Poly Haven model pages:  
  https://polyhaven.com/a/modular_industrial_pipes_01  
  https://polyhaven.com/a/circuit_board
- Creative Commons CC0 deed:  
  https://creativecommons.org/publicdomain/zero/1.0/
