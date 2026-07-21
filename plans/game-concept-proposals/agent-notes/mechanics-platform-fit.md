# WebXR mechanics and platform-fit exploration

Specialist: WebXR mechanics director
Scope: 20 mechanically distinct concepts for one IWSDK codebase
Design target: a legible first interaction in 20 seconds and a satisfying judged
demo in roughly three minutes

## Working assumptions

- Desktop, touch, and immersive VR are equal product modes. None of the core
  loops require room-scale movement, hand tracking, a microphone, or physics.
- Interactions use IWSDK `Interactable` affordances and gameplay entities made
  with `world.createTransformEntity`. Custom state lives in ECS components and
  systems, with shared assets allocated outside update loops.
- Every concept can run seated. Standing adds embodiment but never gates
  progress. Smooth locomotion is avoided unless it is genuinely central.
- **Loop Engineer** teaches agentic software development across the software
  development life cycle (SDLC) and SDLR through loop engineering. SDLR is the
  project owner's framework term and is not expanded here. The playable loop
  may show specification, bounded delegation, implementation, testing, review,
  evidence, feedback, and iteration without assigning those activities to the
  letters in SDLR.

## Diversity map

| #   | Concept               | Primary genre             | Core verb   | Spatial identity                                 |
| --- | --------------------- | ------------------------- | ----------- | ------------------------------------------------ |
| 1   | Loop Engineer         | Edutainment / systems     | Orchestrate | Agentic SDLC/SDLR loop-engineering workbench     |
| 2   | Echo Cartographer     | Audio exploration puzzle  | Triangulate | Invisible cave revealed by sound                 |
| 3   | Gravity Loom          | Orbital puzzle            | Weave       | Threads bend moving star-seeds                   |
| 4   | Pocket Weather Bureau | Simulation                | Forecast    | Tabletop island under live clouds                |
| 5   | Choir Engine          | Rhythm / automation       | Conduct     | Musical factory responds to cues                 |
| 6   | Museum of Stillness   | Stealth / performance     | Impersonate | Pose among exhibits to evade curators            |
| 7   | Ghostline Dispatcher  | Logistics strategy        | Schedule    | Layered spectral rail network                    |
| 8   | Reverse Archaeology   | Narrative deduction       | Reconstruct | Ruin assembles backward through time             |
| 9   | Shadowwright          | Creation puzzle           | Compose     | Light, sculpture, and projected silhouette       |
| 10  | Minute Garden         | Ecosystem simulation      | Cultivate   | Centuries unfold on a living terrarium           |
| 11  | Portal Paparazzi      | Perspective photography   | Frame       | Camera view joins impossible spaces              |
| 12  | Gesture Linguist      | Language puzzle           | Converse    | Motion glyphs form an alien grammar              |
| 13  | Tiny Treaty Table     | Negotiation strategy      | Bargain     | Promises physically reshape a shared map         |
| 14  | Dream Assembly Line   | Programming / automation  | Author      | Rules route surreal dream ingredients            |
| 15  | The Unreliable Stage  | Comedy performance        | Improvise   | Scenery changes while the scene continues        |
| 16  | Message in a Moon     | Asynchronous relay        | Encode      | Each player inherits another's lunar machine     |
| 17  | Second-Hand Sun       | Temporal puzzle           | Illuminate  | Clock hands move light across one room           |
| 18  | Invisible Zoo Keeper  | Deduction / creature care | Diagnose    | Creatures known only by environmental traces     |
| 19  | Origami Rescue        | Topology puzzle           | Fold        | Creases connect distant parts of a paper world   |
| 20  | Size Thief            | Conservation puzzle       | Transfer    | Scale is a finite resource moved between objects |

---

## 1. Loop Engineer

**Core verb — orchestrate.** The player employs an eager NPC named Patch, who
teaches agentic software development across **SDLC and SDLR** through loop
engineering by becoming the first agent in a small, visible work cell. The
lesson is not a quiz: the player takes a broken toy-delivery feature from
definition and planning through bounded delegation, implementation, testing,
review, evidence, feedback, and iteration.

**First 20 seconds.** Patch points to a smoking conveyor and says, “Employ me;
tell me what done looks like.” The player chooses one of three acceptance cards
(`deliver the blue cube`, `without dropping it`, `under ten seconds`) and docks
it in the active workflow zone. Patch immediately performs the underspecified
version, delivering the wrong cube safely. The funny failure makes
specification useful before terminology is explained.

**60-second loop.** Specify an observable target → plan and delegate one bounded
job card to Patch or a specialist bot → press Run → watch implementation as
colored traces and status bubbles → test the result → inspect one captured
failure/evidence card → review and revise the specification or assignment →
rerun. The SDLC timeline and SDLR loop respond only when the player performs
the associated work, not when they recite terminology.

**Feedback.** A live “contract meter” separates outcome, constraints, and proof.
Agent thought is represented only as short player-safe status text (“blocked:
no color rule”), never hidden reasoning. Success produces a green replay trail
and an evidence stamp; failure freezes at the exact handoff and Patch offers one
specific coaching question. A paired SDLC timeline and SDLR loop fill as the
player turns feedback and evidence into a better iteration.

**Controls.** Desktop: point/click cards, drag to stations, Space to run/pause,
mouse orbit. Touch: tap cards, tap a destination rather than precision-drag,
large Run button, one-finger orbit. XR: ray-select distant cards or direct-touch
near cards, place them in waist-height stations, press a large physical Run
plunger; optional two-hand resize of the workbench is decorative.

**Mode.** Seated-first tabletop at 0.8–1.2 m; standing players can walk around
the bench. **Comfort/locomotion:** no required locomotion; snap-turn and bench
rotation expose every side. Keep agent motion within the table and use trails
rather than camera movement.

**Likely IWSDK/ECS.** `TaskCard`, `AcceptanceRule`, `AgentRole`, `RunState`,
`Evidence`, and `LessonBeat` components; card/station `Interactable`s; an
`OrchestrationSystem` that advances deterministic jobs; subscriptions driving
Patch animation, the SDLC timeline, the SDLR loop, and UI; XR session state to
change reach and tooltip placement.

**Hackathon scope.** One conveyor scenario, three acceptance cards, two agent
roles, one intentionally bad run, one corrected run, and a local completion
badge. No live LLM is required; deterministic agent behavior makes the lesson
fast and reliable.

**Concrete 2–3 minute demo arc.** 0:00–0:20 employ Patch and make the
underspecified first attempt. 0:20–0:50 define the outcome, safety, and timing
criteria. 0:50–1:20 plan the work and delegate “identify color” to a scanner bot
and “carry” to Patch. 1:20–1:40 run the implementation; the scanner reports a
blocked handoff because its result was never connected. 1:40–2:05 test the
result, inspect the evidence freeze-frame, and repair the missing handoff.
2:05–2:25 rerun successfully. 2:25–2:45 review the evidence and keep one
improvement; choosing “require proof” stamps a completed agentic SDLC/SDLR
loop-engineering iteration and instantly offers a harder replay seed.

**Biggest technical risk.** The lesson could feel like moving project-management
cards rather than playing. Preserve causality: every card must visibly change
Patch's behavior within seconds, and the first failure must be funny, specific,
and recoverable.

## 2. Echo Cartographer

**Core verb — triangulate.** The world is a dark, invisible cave whose shape is
known only through returning sound. The player builds a temporary map from
echoes, then guides a luminous cave moth to safety.

**First 20 seconds.** Trigger one pulse; expanding rings strike unseen walls and
leave fading points at different depths. Aim a second pulse from another angle
and a doorway resolves between the overlapping returns.

**60-second loop.** Emit a limited pulse → listen/watch return timing → pin two
or three reliable surfaces → infer a passage or hazard → choose the moth's next
waypoint → gain more pulse energy at a resonant crystal. Wrong inference costs
time, not life; the moth backs away and the misleading points dissolve.

**Controls.** Desktop: mouse aim, click pulse, number keys select echo bands,
WASD optional short movement. Touch: drag aim, tap pulse, tap return points to
pin, on-screen step arrows. XR: point a tuning wand and squeeze to pulse; touch
floating returns to pin them. **Mode:** seated or standing. **Comfort:** default
to node-to-node teleport with a vignette-free static camera option; audio cues
also have visual rings and haptics.

**Likely IWSDK/ECS.** `EchoEmitter`, `EchoReturn`, `MappedSurface`, `MothRoute`,
and `PulseBudget`; pooled ring/point entities; `Interactable` pins; deterministic
ray/sample data preauthored for the cave rather than runtime acoustic physics.

**Hackathon scope.** One three-chamber cave, six discoverable surfaces, one
false echo, and one moth rescue. **Biggest technical risk:** convincing spatial
audio varies by device; visual timing must carry the mechanic independently.

## 3. Gravity Loom

**Core verb — weave.** The player stretches temporary gravity threads between
anchors so drifting star-seeds curve into a target constellation.

**First 20 seconds.** Connect two pulsing anchors. A seed immediately bends
toward the new thread and paints its predicted arc, teaching cause and effect
without text.

**60-second loop.** Inspect incoming trajectories → connect, tighten, or reverse
one gravity thread → run five seconds of orbital motion → collect correctly
seated stars while near misses leave readable trails → reweave with a shrinking
energy budget. Success is a stable, musical constellation rather than a hit
target.

**Controls.** Desktop: click two anchors, wheel changes tension, Space
play/pause. Touch: tap anchor pairs, vertical tension slider, tap timeline. XR:
pinch/trigger two anchors and move hands apart for tension; ray controls offer a
seated equivalent. **Mode:** excellent seated tabletop; standing optional.
**Comfort:** fixed celestial diorama, no locomotion, slow bounded particles, and
reduced-motion mode showing stepped arcs.

**Likely IWSDK/ECS.** `GravityAnchor`, `GravityThread`, `StarSeed`, `Trajectory`,
`ConstellationSocket`, and fixed-step `OrbitSystem`; reusable line geometry and
queries for active seeds. **Hackathon scope:** three puzzle arrangements and
one thread type. **Biggest technical risk:** maintaining deterministic,
understandable trajectories across frame rates; use simplified authored force
fields rather than general physics.

## 4. Pocket Weather Bureau

**Core verb — forecast.** The player runs a tiny weather office above an island,
placing pressure instructions and then living with the forecast.

**First 20 seconds.** A village asks for rain. Draw a short high-to-low pressure
arrow; clouds visibly stream over the fields and a rain gauge rises.

**60-second loop.** Read three competing needs → sketch one pressure front and
set its strength → advance the forecast twelve hours → watch wind, rain, surf,
and temperature propagate → compare predicted and actual results → revise
before the festival begins. There is no perfect weather; the score rewards
transparent tradeoffs and accurate prediction.

**Controls.** Desktop: drag front paths, wheel strength, click forecast clock.
Touch: finger-draw paths with a large strength dial. XR: draw in the air just
above the map or use ray mode; turn a chunky time wheel. **Mode:** seated-first;
standing gives a “weather presenter” viewpoint. **Comfort:** static island,
time-lapse capped to gentle speeds, reduced-motion replaces cloud flow with
contours.

**Likely IWSDK/ECS.** Grid-cell `Humidity`, `Pressure`, `Temperature`, and
`WindVector` data; `WeatherNeed`, `Forecast`, and `SettlementResponse`; a low
resolution deterministic simulation system and instanced/poolable cloud
visuals. **Hackathon scope:** one island, three settlements, two fronts, one
festival deadline. **Biggest technical risk:** making a simplified simulation
legible rather than arbitrary; expose arrows, contours, and before/after
numbers.

## 5. Choir Engine

**Core verb — conduct.** A room-sized machine sings only when its mechanical
sections receive clear musical cues; the player conducts production rather than
playing notes directly.

**First 20 seconds.** Point to the piston section on a glowing beat and cue it
in. Its rhythm powers a conveyor, while an off-beat cue produces an amusing
squeak and a readable early/late marker.

**60-second loop.** Hear a two-bar request → cue two machine sections in order →
hold or cut them at accent beats → watch products flow with the groove → repair
one sync error → finish with a full-ensemble cadence. Accuracy grows the music;
failure thins it without hard-stopping the player.

**Controls.** Desktop: mouse selects section, swipe or arrow keys for cue/hold/
cut, Space calibrates beat. Touch: large section pads and directional swipes.
XR: baton direction plus trigger; accessible ray buttons mirror every gesture.
**Mode:** seated and standing. **Comfort:** no locomotion, generous tempo,
one-handed mode, visual beat lane, haptic and caption alternatives.

**Likely IWSDK/ECS.** `MusicSection`, `CueWindow`, `MachinePhase`, `SongState`,
and sample-accurate scheduler synchronized to a fixed gameplay clock; animation
systems subscribe to musical state. **Hackathon scope:** one 60-second song,
three sections, three cue types. **Biggest technical risk:** audio/visual latency
on mobile and wireless XR; include calibration and wide judgement windows.

## 6. Museum of Stillness

**Core verb — impersonate.** The player is a runaway exhibit that crosses a
museum by matching nearby art whenever the curator looks over.

**First 20 seconds.** A spotlight begins to sweep. Copy the silhouette shown on
an empty plinth before it reaches you; the curator nods at the “new sculpture”
and walks past.

**60-second loop.** Study a room's three poses → move during safe shadow beats →
choose a plinth and adopt its pose/token → hold while scrutiny passes → spend
earned applause on one decoy movement → reach the service door. Detection
starts a comic critique and rewinds only to the prior plinth.

**Controls.** Desktop: WASD between marked nodes; keys 1–3 select poses; hold
Space to freeze. Touch: tap destination nodes, tap pose silhouette, hold Freeze.
XR: physically approximate a simple upper-body pose or choose its accessible
ray icon; release trigger to freeze. **Mode:** seated pose set and standing pose
set are equivalent. **Comfort:** node movement or teleport only, no forced
camera, no crouching required, clear gaze cone.

**Likely IWSDK/ECS.** `ExhibitPose`, `CuratorGaze`, `Suspicion`, `SafePlinth`,
`MovementWindow`, and a state-machine system; optional headset/controller pose
classification uses broad thresholds. **Hackathon scope:** one gallery, three
poses, two gaze patterns, one decoy. **Biggest technical risk:** physical pose
recognition must never be mandatory or finicky; icon selection is the canonical
input and body matching awards flair only.

## 7. Ghostline Dispatcher

**Core verb — schedule.** The player routes ghost trains through a station where
platforms exist in overlapping decades and passengers can board only in the
year they remember.

**First 20 seconds.** Slide one departure token onto the 1984 layer; a waiting
ghost boards and the train passes harmlessly through a modern obstruction.

**60-second loop.** Read passenger era/destination → assign a train to one of
three time layers → reserve crossings on a shared clock → run ten seconds →
pause at a conflict or missed connection → alter one slot and continue. A clean
chain makes the station chime; a collision becomes a harmless temporal knot the
player untangles.

**Controls.** Desktop: click route, drag timetable token, wheel changes layer.
Touch: tap route endpoints and time slot; vertical layer tabs avoid tiny drags.
XR: ray-select tracks, place chunky time tokens, rotate a layer dial. **Mode:**
seated tabletop or standing room map. **Comfort:** fixed overview, no train-ride
camera, reduced-motion uses schematic train markers.

**Likely IWSDK/ECS.** `Train`, `PassengerDemand`, `TrackSegment`, `EraLayer`,
`Reservation`, `Conflict`; discrete-tick scheduler and route query. **Hackathon scope:**
six segments, three trains, five passenger groups, three eras.
**Biggest technical risk:** timetable complexity; each turn should expose at
most one new conflict and offer an automatic “why blocked?” trace.

## 8. Reverse Archaeology

**Core verb — reconstruct.** The player receives a pristine object from the
future and works backward through its damage to discover what civilization made
it and why it mattered.

**First 20 seconds.** Scrub a time ring backward: a crack closes, ash rises into
a lamp, and a hidden inscription becomes readable. Pin the moment as evidence.

**60-second loop.** Inspect a present clue → rewind one object's local timeline
→ choose which causal event preceded it → pin a relationship on the evidence
spiral → watch the reconstructed room update → question the resulting
assumption. Incorrect causality creates a visibly impossible overlap, then
returns the clue for another interpretation.

**Controls.** Desktop: mouse orbit/inspect, wheel scrubs time, click pins.
Touch: one-finger orbit, large time slider, tap evidence. XR: hold an artifact
and rotate a separate time dial, or use rays for both. **Mode:** seated museum
desk; standing optional. **Comfort:** object-local animation only, no camera
movement, slow rewind and photosensitive-safe dissolve option.

**Likely IWSDK/ECS.** `Artifact`, `TimelineState`, `CausalLink`, `EvidencePin`,
`Hypothesis`, and deterministic timeline playback; Interactable inspection
points. **Hackathon scope:** one room, four artifacts, one twist, two valid
interpretations. **Biggest technical risk:** authored state transitions and
story clarity are content-heavy; prioritize one dense chain over many objects.

## 9. Shadowwright

**Core verb — compose.** Build a three-dimensional abstract sculpture whose
shadow completes a living two-dimensional scene.

**First 20 seconds.** Rotate one simple arch under a lamp; its shadow becomes a
bridge and a tiny projected traveler immediately crosses it.

**60-second loop.** Read the projected character's need → choose one of a few
primitive forms → orient, scale, or light it → preview the shadow's function →
let the character test it → keep successful forms as part of an evolving
silhouette. Near matches animate differently, encouraging expressive solutions
rather than pixel perfection.

**Controls.** Desktop: click object, drag rotation gizmo, wheel scale, keys
switch object/light. Touch: tap selection, two-finger rotate/scale, light dial.
XR: direct or ray manipulation with axis handles; one-handed accessible mode.
**Mode:** seated or standing. **Comfort:** fixed workbench, no locomotion,
high-contrast shadow and outline modes.

**Likely IWSDK/ECS.** `ShadowPrimitive`, `LightRig`, `ProjectionGoal`,
`CharacterNeed`, `SilhouetteScore`; render-target or simplified landmark
comparison rather than expensive per-pixel scoring. **Hackathon scope:** one
light, five primitives, three story beats. **Biggest technical risk:** accurate
cross-device shadow scoring; use broad anchor regions and author forgiving
solutions.

## 10. Minute Garden

**Core verb — cultivate.** The player steers a tiny ecosystem across centuries
by changing one environmental condition per generation, then watches species
adapt beyond direct control.

**First 20 seconds.** Raise the water table; time accelerates and a plant's roots
visibly shorten while a marsh insect arrives. A lineage card explains the
tradeoff in one sentence.

**60-second loop.** Read a looming climate event → alter one condition (water,
shade, wind, or soil) → advance a generation → observe population and trait
changes → preserve one lineage seed → respond to the next event. Success is
resilience and diversity, not a single optimal species.

**Controls.** Desktop: click plot, wheel condition dial, Space advances. Touch:
tap plot and use large radial sliders. XR: point at plots and turn physical
dials around the terrarium. **Mode:** seated tabletop or standing. **Comfort:**
static camera; time-lapse can be stepped; no flicker or swarming near the face.

**Likely IWSDK/ECS.** `Species`, `Trait`, `HabitatCell`, `Population`,
`ClimateEvent`, and generation-step simulation; pooled representative creature
entities separate visuals from population data. **Hackathon scope:** three
species, four traits, three generations, two events. **Biggest technical risk:**
emergence can look random; show causal arrows from environmental change to
trait payoff.

## 11. Portal Paparazzi

**Core verb — frame.** Photograph impossible celebrity creatures by aligning
separate spaces inside a camera frame, where composition temporarily becomes
physical truth.

**First 20 seconds.** Move the camera until a rooftop moon appears inside a
street puddle portal; press the shutter and a moon-whale breaches through the
completed frame.

**60-second loop.** Receive a visual brief → scout from two or three fixed
vantage nodes → align foreground, portal, and subject → trigger the subject's
behavior at the right beat → take the photo → get immediate composition,
timing, and weirdness ratings → choose a new brief modifier.

**Controls.** Desktop: mouse camera, WASD/node keys, click shutter, wheel zoom.
Touch: gyroscope optional; drag camera, tap vantage, pinch zoom, shutter button.
XR: hold a virtual camera or use a fixed viewfinder panel; trigger shutter.
**Mode:** seated and standing. **Comfort:** teleport among fixed tripods, stable
viewfinder, no forced zoom; disable gyro by default on mobile.

**Likely IWSDK/ECS.** `PhotoBrief`, `SubjectBeat`, `PortalPair`, `VantageNode`,
`CompositionAnchor`, `CapturedPhoto`; camera/render target and landmark-based
scoring. **Hackathon scope:** one plaza, one creature, three briefs, three
vantages. **Biggest technical risk:** render-target portals and screenshot
performance; fake the portal with a second camera plane if needed.

## 12. Gesture Linguist

**Core verb — converse.** Learn an alien language whose words are paths,
directions, rhythm, and distance—not spoken sounds—and use it to solve a social
misunderstanding.

**First 20 seconds.** An alien traces “hello” as a slow triangle toward itself.
Copy the path; it blooms green. Reverse the direction and it becomes the
playfully scandalized “goodbye.”

**60-second loop.** Observe a two-part gesture in context → infer one grammar
rule → answer by tracing a path and selecting tempo → see the alien act out its
interpretation → correct one parameter → add the learned glyph to a phrase.
Errors produce literal, comedic misunderstandings rather than a red X.

**Controls.** Desktop: hold mouse to trace, wheel sets depth, number keys tempo.
Touch: finger trace on a depth-layered panel, tempo buttons. XR: controller or
hand ray traces in reachable space; panel mode supports limited mobility.
**Mode:** seated/standing. **Comfort:** no locomotion, traces stay below eye
level, no rapid arm motions, remappable one-handed input.

**Likely IWSDK/ECS.** `GestureStroke`, `GrammarRule`, `PhraseIntent`,
`AlienResponse`, `KnownGlyph`; path resampling and tolerant shape/direction/
tempo classifier. **Hackathon scope:** four glyphs, two grammar rules, one
three-turn conversation. **Biggest technical risk:** recognition frustration;
score semantic dimensions independently and show which dimension was heard.

## 13. Tiny Treaty Table

**Core verb — bargain.** Three miniature nations share one physical map. Every
promise the player makes becomes a visible bridge, border, pipeline, or taboo
that changes the strategic terrain.

**First 20 seconds.** Promise river access to the desert nation; a blue route
appears, its trust rises, and the downstream orchard immediately loses water.
The cost of diplomacy is spatially obvious.

**60-second loop.** Hear two petitions → draft one promise with beneficiary,
resource, and duration → preview its map consequence → accept a counteroffer or
revise → advance one season → resolve who prospered and who remembers the
promise. The goal is a survivable coalition, not universal happiness.

**Controls.** Desktop: click nation/resource/duration, hover previews, confirm.
Touch: tap three large treaty clauses; tap map overlays. XR: place chunky clause
tiles into a treaty frame using direct touch or rays. **Mode:** seated tabletop;
standing optional. **Comfort:** fixed map and snap rotation, no locomotion.

**Likely IWSDK/ECS.** `Faction`, `ResourceFlow`, `Promise`, `Trust`, `Season`,
`MapConsequence`; deterministic resolution and subscriptions updating borders
and reactions. **Hackathon scope:** three factions, two resources, three rounds,
six authored petitions. **Biggest technical risk:** too much text; represent
each deal as three icons and make every consequence animate on the map.

## 14. Dream Assembly Line

**Core verb — author.** Program a surreal factory by placing simple if/then
rules that transform dream ingredients into a sleeper's requested dream.

**First 20 seconds.** Set “IF object is noisy, THEN wrap in cloud.” A clanging
alarm clock enters, gets cloud-wrapped, and floats quietly into the dream jar.

**60-second loop.** Read a dream request → inspect incoming oddities → place or
reorder two rule modules → run the belt → watch each item expose the rule it
matched → catch an exception → patch with one new condition → ship the dream.
Unexpected but harmless outputs earn creativity stamps.

**Controls.** Desktop: click condition/action tiles, drag order, Space run/pause.
Touch: tap tiles into numbered slots and use move arrows. XR: snap large rule
blocks into a vertical rack; ray mode keeps everything reachable. **Mode:**
seated or standing. **Comfort:** stationary factory, moderate belt speed,
reduced-motion step execution.

**Likely IWSDK/ECS.** `DreamItem` trait components, `RuleCondition`,
`RuleAction`, `RuleOrder`, `DreamRequest`, `RuleTrace`; a deterministic rules
engine separated from visual item entities. **Hackathon scope:** six item traits,
six rule blocks, two requests. **Biggest technical risk:** rules can become
opaque; every item must display the exact matched rule and before/after traits.

## 15. The Unreliable Stage

**Core verb — improvise.** Perform a tiny play while a mischievous stage manager
changes the set, genre, and emotional objective mid-scene.

**First 20 seconds.** Choose one of three reactions to “confess your secret.”
Halfway through, the living-room set rotates into a submarine; the same line
must now be delivered as a captain.

**60-second loop.** Accept a role and objective → respond to an actor's prompt
with a line/gesture card → adapt when scenery or genre flips → keep one story
fact consistent → land the scene's ending pose. The audience rewards commitment,
callbacks, and recovery, not acting accuracy.

**Controls.** Desktop: keys 1–3 select responses; mouse gesture strokes add
delivery. Touch: response cards plus swipe gestures. XR: point to a response or
perform a simple flourish; optional microphone is explicitly out of scope.
**Mode:** seated mode frames the player as director/puppeteer; standing mode
puts them on stage. **Comfort:** no locomotion, scenery moves around a stable
floor horizon, transitions fade rather than spin.

**Likely IWSDK/ECS.** `SceneFact`, `ActorPrompt`, `PlayerResponse`, `GenreRule`,
`SetState`, `AudienceReaction`; authored beat graph with combinatorial response
tags. **Hackathon scope:** one three-beat scene, two set flips, nine response
cards. **Biggest technical risk:** branching content explosion; keep a fixed
spine and vary delivery/context instead of plot topology.

## 16. Message in a Moon

**Core verb — encode.** Each player inherits a tiny broken moon machine modified
by a previous player, learns what they were trying to communicate, then makes
one change for the next visitor.

**First 20 seconds.** Press Play and watch the inherited machine animate a short
sequence of light, orbit, and chime. Choose which of three meanings it conveys;
the sender's intended icon is then revealed.

**60-second loop.** Decode the prior sequence → repair one broken step → choose
a new simple intent (welcome, warning, question, celebration) → arrange three
signal beats → test readability against a simulated observer → export a compact
share code or local handoff. The machine accumulates a visible lineage of prior
contributors.

**Controls.** Desktop: click timeline cells, choose signal, drag order. Touch:
tap large beats and reorder arrows. XR: place light/orbit/chime tokens around the
moon; rays support seated play. **Mode:** seated/standing. **Comfort:** fixed
diorama, bounded slow orbit, reduced-motion schematic mode.

**Likely IWSDK/ECS.** `SignalBeat`, `MessageIntent`, `MachinePart`, `Lineage`,
`ShareSeed`; deterministic serializer to URL-safe code/local storage, no server
required for the demo. **Hackathon scope:** three signal types, four intents,
one inherited seed, copy/paste share code. **Biggest technical risk:** true
asynchronous continuity normally needs backend/community moderation; pitch the
share-code relay as the smallest complete version.

## 17. Second-Hand Sun

**Core verb — illuminate.** The player controls a room's miniature sun with the
hands of a giant clock. Objects age, wake, grow, or cast useful light only during
their correct time windows.

**First 20 seconds.** Turn the minute hand to dawn; a flower opens and its shadow
reveals a hidden keyhole. Turn too far and the flower closes, showing that time
is position, not a rewind button.

**60-second loop.** Inspect three time-sensitive objects → set hour and minute
hands → lock one object's state with a limited memory pin → advance another
time window → use the new light/shadow/age relationship → reach the room's
evening arrangement. Contradictions cause the memory pin to pop free, preserving
the causal rule.

**Controls.** Desktop: drag clock hands, click memory pins, keys step minutes.
Touch: large clock dial and tap pins. XR: turn reachable clock hands or use ray
handles. **Mode:** seated and standing. **Comfort:** fixed room/diorama, no
locomotion, slow lighting transitions, no rapid day/night flashing.

**Likely IWSDK/ECS.** `TimeSensitive`, `TimeWindow`, `MemoryPin`, `LightState`,
`PuzzleDependency`; discrete time-state system rather than continuous full scene
simulation. **Hackathon scope:** one room, four time states, three objects, two
pins. **Biggest technical risk:** lighting changes may be costly or inconsistent;
use authored material/light presets and baked-looking shadow proxies.

## 18. Invisible Zoo Keeper

**Core verb — diagnose.** Care for animals that cannot be seen directly. Their
footprints, displaced foliage, sounds, food choices, and nesting patterns reveal
what they are and what they need.

**First 20 seconds.** Offer two foods. One vanishes with a cold shimmer while
the other remains; the habitat thermometer drops, revealing a shy frost grazer
without showing its body.

**60-second loop.** Observe three traces → form a species/need hypothesis → make
one habitat adjustment or offer one enrichment → wait for the response → update
the field guide → prepare the enclosure for night. Wrong care creates a clear,
non-punitive counter-trace and the animal stays safe.

**Controls.** Desktop: click evidence, choose care card, mouse orbit. Touch: tap
traces and large care icons. XR: point a scanner at traces and place care tokens;
direct handling is unnecessary. **Mode:** seated enclosure diorama or standing.
**Comfort:** fixed viewpoint, optional snap rotation, captions and visualized
sound direction ensure audio is not required.

**Likely IWSDK/ECS.** Hidden `CreatureProfile`, `Trace`, `Need`, `CareAction`,
`HabitatState`, `FieldGuide`; response system emits pooled trace entities based
on profile and state. **Hackathon scope:** one enclosure, two possible species,
five trace types, three care actions. **Biggest technical risk:** players may
feel deprived by never seeing the animal; a successful ending can reveal only
its luminous outline while preserving the fantasy.

## 19. Origami Rescue

**Core verb — fold.** Rescue tiny paper citizens by folding their flat world so
distant roads, rivers, and buildings become adjacent in three dimensions.

**First 20 seconds.** Pull one marked crease upward; a stranded rooftop touches
a fire-escape island and the first citizen walks across the new seam.

**60-second loop.** Read where citizens need to go → choose one legal crease →
preview which edges will meet → fold and pin it → run the citizens' paths →
unpin or layer a second fold to bypass a hazard → flatten the completed page to
see the route drawn as a commemorative pattern.

**Controls.** Desktop: click crease, drag fold angle, click pin, Space run.
Touch: tap crease and use a large angle slider; tap pin. XR: lift a crease handle
with one hand and pin with the other, with one-handed ray/slider fallback.
**Mode:** seated tabletop strongly supported; standing optional. **Comfort:** no
locomotion, fold motion slows near the viewer, no geometry intersects the head,
reduced-motion uses stepwise fold states.

**Likely IWSDK/ECS.** `PaperRegion`, `Crease`, `FoldState`, `EdgeConnection`,
`CitizenRoute`, `FoldPin`; authored hinge transforms and graph reconnection,
not deformable physics. **Hackathon scope:** one page, three creases, four
regions, two citizens. **Biggest technical risk:** dynamic mesh folding and path
topology; use rigid pre-cut panels with authored hinges and recompute a small
connectivity graph.

## 20. Size Thief

**Core verb — transfer.** Size is conserved: the player can siphon scale from
one object and give it to another, changing function without creating or
destroying total volume.

**First 20 seconds.** Drain size from an enormous locked key into a tiny door.
The key becomes usable while the door grows into a passage, teaching both sides
of the transfer in one action.

**60-second loop.** Inspect a room's scale relationships → connect a donor and
receiver → preview their functional thresholds → transfer a measured amount →
use the changed objects to open a route → recover or redistribute size before
the final balance gate. Overshooting causes a comic but reversible function
change, never physics chaos.

**Controls.** Desktop: click donor then receiver, wheel amount, hold to transfer.
Touch: tap pair and drag a central amount slider. XR: ray-select pair and squeeze
a pump handle; optional two-hand distance gesture is flair only. **Mode:** seated
and standing. **Comfort:** fixed puzzle room or tabletop miniature, teleport
nodes if room-scale view is used, gradual bounded scaling, no world/camera
scaling.

**Likely IWSDK/ECS.** `Scalable`, `SizeReservoir`, `FunctionalThreshold`,
`TransferLink`, `PuzzleGate`; deterministic scalar accounting, visual transform
system, and subscriptions for state changes. Avoid live rigid-body physics.
**Hackathon scope:** one room, five scalable objects, three thresholds, two
solutions. **Biggest technical risk:** collision and interaction affordances
breaking as objects scale; snap among authored scale tiers even if the meter
appears continuous.

## Mechanics-director shortlist notes

- **Strongest learning/demo clarity:** Loop Engineer (agentic SDLC/SDLR through
  loop engineering), Shadowwright, Size Thief,
  Origami Rescue, and Echo Cartographer. Each produces an immediate visible
  consequence from one action.
- **Strongest “only better in spatial computing” identity:** Shadowwright,
  Gravity Loom, Gesture Linguist, and Origami Rescue.
- **Safest cross-platform implementation:** Loop Engineer (agentic SDLC/SDLR
  loop engineering), Tiny Treaty Table,
  Dream Assembly Line, Ghostline Dispatcher, and Second-Hand Sun because their
  canonical input is discrete and ray/tap friendly.
- **Highest prototype-first risks:** Portal Paparazzi (portals/render targets),
  Choir Engine (latency), Echo Cartographer (spatial audio), and Museum of
  Stillness (pose recognition). Each includes a non-XR fallback that should be
  treated as the canonical mechanic during the hackathon.
- **Best asynchronous seed:** Message in a Moon. The share-code implementation
  proves the relay fantasy without making backend deployment a prerequisite.
