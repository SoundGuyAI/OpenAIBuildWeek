# Comedy direction - Loop Engineer concept territories

Logical assignment: `DISC-COM-01`

Role: Comedy writer

Deliverable: Optional visual and state-based humor for five converging concept territories.

## Recommendation

Treat comedy as a second, removable channel of feedback. The player should be
able to disable every joke and still see the same goal, test result, cause,
next action, and release state. The safest shared comic system is an
**evidence-gated premature celebration device**: a small prop tries to begin the
victory ritual before all criteria pass, the acceptance gate calmly stops it,
and it finally completes the ritual after a repeatable verified pass.

This makes the system's optimism the butt of the joke, not the player, tester,
requirements, or failed attempt. It also gives the five concepts a family
resemblance without making their fantasies or failure signatures identical.

Recommended comedy amplitude:

| Territory | Comedy level | Primary comic target | Premature-celebration skin |
| --- | --- | --- | --- |
| Orbital / storm machine | Restrained, dry | Overconfident instruments and ceremonial weather machinery | A brass clear-skies pennant or tiny ribbon drone |
| Tomorrow Garden | Warm, gentle | Plants and pollinators responding very literally to inputs | A victory bud that keeps trying to bloom |
| Kaiju or test-kitchen quality lab | Most overt | Grand ceremony applied to exacting quality assurance | An approval stamp, cloche, or ribbon-cutting drone |
| Release train | Brisk, playful | Railway ceremony waiting on dependency evidence | A party caboose with folded bunting |
| Museum of Almosts | Very restrained, wry | Curatorial certainty being revised by evidence | An opening-night ribbon or applause paddle |

## Non-negotiable humor contract

1. **Evidence lands first.** Lock the factual result, failed criterion, trace,
   and comparison overlay before any comic reaction begins.
2. **The joke never changes the answer.** Decorative props cannot resemble a
   pass/fail marker, move a requirement token, obscure a trace, or imply a pass
   when the gate is still closed.
3. **Failure is useful, not humiliating.** No booing, scolding, injury, loss of
   progress, resource fine, mocking animation, or narrator line aimed at the
   player.
4. **One joke per test is enough.** A reaction should last roughly 0.5-1.5
   seconds, never block input, and never delay retry or evidence inspection.
5. **Deterministic state earns the laugh.** The same unchanged setup produces
   the same result and the same small reaction. This reinforces causality
   rather than making the machine seem random.
6. **The final celebration requires verification.** A first partial pass may
   make the celebration prop twitch, but the full payoff occurs only after all
   criteria pass and, where the design requires it, the repeat test also passes.
7. **The humor is optional.** Reduced-motion mode can replace movement with a
   static pose; a low-delight mode can suppress quips and ambient reactions
   without removing any instructional content.
8. **The player keeps dignity and control.** The world is pleased to learn with
   them. It is never waiting to catch them being foolish.

## Shared recurring gag: the Too-Early Ta-Da

Use one small reusable state machine with a different prop skin in each concept.
The gag should live outside the primary status panel and never occupy the
player's interaction target.

| Game state | Prop behavior | Teaching purpose |
| --- | --- | --- |
| Goal not yet framed | Celebration prop is present but visibly latched or folded. | Establishes that success has a gate before the first action. |
| Test begins | Prop makes one hopeful wind-up motion. | Builds anticipation without declaring an outcome. |
| Partial pass or failed criterion | The result appears first; then the prop begins its ceremony and is gently caught by the acceptance interlock. | Makes premature confidence funny while preserving the failed evidence. |
| Evidence inspected | The prop settles and points or faces toward the real failed-state display only if that does not resemble an instruction. | Returns attention to evidence instead of competing with it. |
| Unchanged rerun | It repeats the exact same blocked motion. | Turns reproducibility into a light joke and discourages blind retries without punishment. |
| Evidence-led adjustment | Its wind-up progresses one visible step farther, but it still waits for the gate. | Rewards progress without manufacturing a pass. |
| Verified repeat pass | The latch opens and the complete, short celebration plays. | Makes justified confidence, not mere persistence, the comic payoff. |

Do not make the interlock slap, crush, shame, or frighten the prop. The rhythm is
"eager, caught, patiently waiting," not "bad object gets punished."

## Failure-feedback tone and copy grammar

Use calm technical clarity with one optional line of dry warmth. The order is:

1. State what passed and what did not.
2. Point to the visible evidence and preserve the previous attempt.
3. Offer the next valid interaction immediately.
4. Only then add a short quip, visual reaction, or both.

Preferred vocabulary includes **observed**, **not yet verified**, **criterion
missed**, **regression found**, **same result reproduced**, and **ready to
adjust**. Avoid **wrong**, **bad move**, **you failed**, **obvious**, **again?**,
or sarcastic praise.

A useful shared line for an unchanged rerun is:

> Same setup, same result. The test is reproducible.

The sentence is already lightly funny in context, but more importantly it
teaches that a repeat without a changed hypothesis is still evidence rather
than a moral failure.

Example evidence-first pairs:

| Territory | Factual line shown first | Optional second beat |
| --- | --- | --- |
| Storm machine | `Corridor width passed. Crosswind tolerance missed by 18%.` | `The atmosphere has submitted a counterproposal.` |
| Tomorrow Garden | `Root depth passed. Pollination did not run.` | `The pollinator remains professionally on standby.` |
| Quality lab | `Texture passed. Heat limit missed.` | `The garnish has not been implicated.` |
| Release train | `Power car arrived. Timing car missed Station 3.` | `Sunrise remains in rehearsal.` |
| Museum | `Bird shape verified. Flight not observed.` | `The bird remains proudly theoretical.` |

The optional lines should disappear before factual lines are shortened. If a
quip creates translation, layout, or tone trouble, cut it and keep the visual
reaction.

## 1. Orbital / storm machine

### Comic identity

Play the machine as an ancient, exquisitely built public-works instrument that
is slightly too eager to issue a beautiful forecast. The weather is not cruel,
and the courier is never the punchline. Humor comes from ceremony colliding
with measurable atmospheric reality.

### State-based visual beats

- **Before the first test:** the tiny clear-skies pennant is wound tightly
  around its pole behind a visible acceptance latch. A miniature calibration
  satellite checks the same direction twice, with great seriousness.
- **Partial failure:** after the lightning or wind trace and failed criterion
  are visible, the pennant starts to unfurl. The measured crosswind wraps it
  neatly back around the pole. The failed vector stays highlighted and still.
- **Specific regression:** a tiny maintenance satellite opens a dish or
  umbrella shape toward the newly failed vector. It should physically align
  with the trace, making the reaction an optional mnemonic rather than noise.
- **Unchanged rerun:** the satellite follows the identical ghost orbit and
  parks exactly over its previous silhouette. The comic beat is precision, not
  exasperation.
- **Evidence-led improvement:** the pennant gets one turn farther before the
  interlock holds it. The prior storm trace remains available for comparison.

### Celebration beat

On a verified repeat pass, the latch releases, the pennant opens in the stable
airflow, and the maintenance satellite performs one tidy orbit around the
accepted corridor. Then the larger narrative payoff - the storm corridor and
courier passage - proceeds unobstructed. Use a smooth glow or drawn lightning
line, never a flash or strobe.

### Jokes to avoid

- A courier crash, electrocution, screaming, weather casualties, climate
  catastrophe, or a city being endangered for a punchline.
- Mocking meteorologists or treating inaccurate evidence as charming intuition.
- A storm face that lies about the result, random wind changes, or a forecast
  prop that looks like the authoritative pass marker.
- Loud thunder as a fail buzzer, rapid lightning, screen shake, or objects
  flying toward the player's face in XR.
- Dense nautical, orbital, or electrical puns that make the next action harder
  to understand.

## 2. The Tomorrow Garden

### Comic identity

Let the habitat respond with patient literalness. A plant grows exactly toward
the light it was given; a pollinator waits for the flower that actually opened;
water continues only along the route the player configured. The joke is the
system's honest specificity, not that nature is foolish or easily controlled.

### State-based visual beats

- **Before the first test:** the victory bud peeks one petal through a closed
  verification collar, then settles when it notices the other criteria are
  still dim.
- **Partial failure:** after root, moisture, and pollination results appear, the
  bud starts to bloom on the passing side only, then pauses at the failed icon.
  A pollinator may hover at the closed flower and calmly return to its standby
  perch.
- **Overwater result:** projected droplets queue in a visible catch reservoir
  after the soil limit is reached. This is a harmless simulation and directly
  mirrors the flow evidence; do not show a drowning creature or suffering
  plant.
- **Unchanged rerun:** the ghost vine follows the same curl and stops at the same
  marker. A new `reproduced` notch may appear beside the attempt history.
- **Evidence-led improvement:** the new root or leaf silhouette diverges from
  the ghost at the adjusted variable, while the victory bud waits.

### Celebration beat

After a stable repeat season, the verification collar opens and the victory bud
completes its bloom, revealing the accepted-cycle emblem in its center. One
pollinator makes a single loop around the emblem while the larger terrarium
grows into the self-sustaining landscape. Reduced-motion mode swaps the loop
for a landed pose and static emblem.

### Jokes to avoid

- Plant or animal death, wilted-body humor, drowning, starvation, pesticides,
  or guilt aimed at the player.
- Treating ecological needs, caretakers, or environmental collapse as trivial.
- Random "moody plant" behavior that breaks the visible input-to-result logic.
- Body, reproduction, pollen, manure, or gross-out jokes.
- Suggesting a real ecosystem can be solved by one clever slider setting; keep
  the fiction explicitly a stylized training terrarium.

## 3. Kaiju or test-kitchen quality lab

### Shared comic identity

The most comic territory should still be the most exact about requirements.
Play grand scale and ceremony against sober quality assurance: an enormous
tester waits for a tiny measurement, or an elaborate serving ritual waits for
one mundane heat criterion. The reaction comes after the instrumented result
and always agrees with it.

Choose one skin for the final concept. Combining a kaiju, alien guests, a food
printer, and a general lab in the same three-minute demo would dilute both the
joke and the learning model.

### Kaiju quality-lab option

- The kaiju is a cooperative expert tester, not a rampaging obstacle. It handles
  miniature instruments with comically excessive care and gives precise
  pictogram feedback.
- A giant approval stamp begins descending after a partial pass; the acceptance
  interlock stops it a safe distance above the sample. On an unchanged rerun it
  stops at the identical height.
- When one requirement fails, the kaiju places one enormous but exact marker
  beside that criterion, then waits. The marker must not cover the measurement
  or become the only explanation.
- On verified success, the kaiju applies an absurdly tiny `approved` seal with
  one claw, then carefully rings a lab bell. Captions and a visual pulse make
  the bell optional.

Avoid city destruction, frightened civilians, roaring at the player, nuclear
trauma, body-size jokes, incompetent-monster jokes, and caricatures drawn from
Japanese language or culture. Scale contrast is enough; destruction is not
needed.

### Test-kitchen option

- A serving cloche rises one centimeter on a partial pass and is calmly pulled
  shut by the acceptance latch. The factual reaction panel remains visible
  beside it.
- A garnish arm may continue presenting one immaculate garnish while a heat or
  texture criterion fails. It retracts only after the panel states the cause,
  yielding the optional line `The garnish has not been implicated.`
- Guest reactions stay consistent and requirement-specific. Antennae, eyes, or
  posture can echo a pictogram only after that pictogram is locked on the panel.
  No reaction may require the player to infer an unknown cultural preference.
- An unchanged recipe prints the same sample and receives a second stamp aligned
  exactly over the first, turning reproducibility into the joke.
- On a verified repeat pass, the cloche opens fully, the three acceptance stamps
  land in sequence, and the luminous recipe can perform the larger constellation
  or shared-table celebration.

Avoid mocking real cuisines, accents, bodies, eating styles, dietary needs, or
allergies. Avoid gross-out food, poisoning, hunger, vomiting, "war caused by bad
dinner," or guests whose communication is funny because it is unfamiliar.

### Shared failure tone

The inspector or guest is delighted to provide good evidence. A failed sample
earns a precise response, not disgust. The warmest possible read is: "Useful
test; now we know exactly what to change."

## 4. Release train

### Comic identity

Use the earnest ceremony of a model railway preparing to deliver something as
impossibly important as sunrise. Dependencies, not railway workers or transit
users, create the comedy. The train is never endangered; every failed route is
a rehearsal.

### State-based visual beats

- **Before the first test:** the party caboose waits in a siding with bunting
  folded and a tiny ceremonial triangle poised but silent.
- **Partial failure:** the ghost train stops at the first unmet dependency and
  leaves its path suspended. Only then does the party caboose roll forward a
  few centimeters, meet the closed release signal, and reverse neatly into the
  siding.
- **Missed dependency:** the uncoupled requirement car remains visibly at its
  station and rotates one large shape marker toward the failed route. No sad
  face or stranded-passenger fiction is needed.
- **Unchanged rerun:** the new ghost train parks exactly over the prior path and
  the station clock adds a `reproduced` notch. Optional line: `A punctual train
  to the same result.`
- **Evidence-led improvement:** the previously stranded dependency car couples
  with a satisfying visual click while the final dispatch control stays locked.

### Celebration beat

After the complete rehearsal passes, the dispatch punch unlocks. The party
caboose couples last, its bunting opens, and the player commits the release. The
model train can then become the city-scale sunrise train, with districts waking
in the verified order. The comic prop is finished before the hero train crosses
the skyline so it does not compete with the main payoff.

### Jokes to avoid

- Derailments, collisions, passengers in danger, darkened hospitals, or
  infrastructure failure used as slapstick.
- Mocking transit workers, late public transport, labor action, overtime, or
  software crunch.
- A hard timer, frantic conductor, or repeated whistle that pressures players
  who need more reading or interaction time.
- Rail jargon, scheduling puns, or tiny timetables that are difficult to
  localize or read on mobile and in XR.
- Audio-only arrival/departure cues or red/green-only signals.

## 5. The Museum of Almosts

### Comic identity

Keep this humor affectionate and sparse. Dry curatorial language can become
more honest as evidence accumulates, while the prototypes remain respected
work by a collective. The joke is institutional certainty meeting a machine
that has one more useful thing to teach.

### State-based visual beats

- **Before the first test:** an opening-night ribbon inches toward the plinth,
  but its acceptance reel keeps it visibly outside the work area.
- **Partial failure:** the half-formed paper bird lands safely. The placard first
  updates with the factual state, such as `Shape verified. Flight not observed.`
  Only then may a tiny applause paddle rise halfway and lower again.
- **New evidence:** the placard replaces one confident but unsupported word with
  a more precise one. Keep all required text on the real evidence panel; the
  exhibit label is flavor.
- **Unchanged rerun:** the same translucent half-bird aligns with the prior
  ghost. The attempt label gains `reproduced`, treating repeatability as useful
  rather than treating the prototype as ridiculous.
- **Evidence-led improvement:** contributor labels or prototype arrows turn
  toward the shared mismatch, but do not solve it for the player.

### Celebration beat

On verification, the opening ribbon finally spans the exhibit, the paper bird
completes its flight, and contributor stamps appear around the final blueprint.
Finish with the existing archival idea: `Verified, with history preserved.` The
old attempts remain visible as honored layers of the result, not debris swept
away for a victory scene.

### Jokes to avoid

- Calling the makers, prototypes, art, or research "failures" as a put-down.
- Haunted-house cues, jump scares, death or grief jokes, cursed objects, or a
  lone mad-genius stereotype.
- Mocking museums, old people, conservators, accessibility devices, or
  unfamiliar cultural objects.
- Vandalism, theft, colonial-collection humor, or treating conservation rules as
  pointless bureaucracy.
- Opaque curator jargon that hides the requirement or makes uncertainty seem
  pretentious rather than productive.

## Accessibility, comfort, and localization cautions

- Keep the factual result in persistent text plus shape/icon state. Color and
  comic animation are reinforcement only.
- Do not trigger humor until screen-reader/live-region result text and the
  visual evidence are stable. Decorative quips should not repeatedly announce
  or steal focus.
- All reaction props need a static reduced-motion pose. Avoid bounce loops,
  camera shake, rapid scale changes, face-level fly-bys, flashes, or sudden
  spatial audio in XR.
- Do not require the player to notice a small background gag. At mobile size,
  decorative reactions may be simplified or omitted rather than shrunk into
  unreadable detail.
- Captions must identify meaningful sounds, but no joke or state can depend on
  hearing a bell, whistle, sigh, thunderclap, or musical sting.
- Avoid sarcasm, idioms, homophones, technical in-jokes, rhyme-dependent copy,
  and culture-specific gestures. A nod, wink, thumbs-up, red/green light, or
  facial expression cannot be the sole read.
- Budget at least 30-40% text expansion. Quips should be one short sentence and
  wrap independently below the factual result, never inside it.
- Localize factual copy and optional comic copy as separate strings so the joke
  can be replaced, shortened, or omitted without touching the result logic.
- Do not use invented alien speech, accents, or nonsense glyphs where the player
  needs to understand a requirement.
- Offer a low-delight or reduced-reaction presentation path if implementation
  allows it. The default should already be calm enough for repeated testing.

## Global jokes to avoid

- "Skill issue," booing, laugh tracks, score loss, shame badges, or a companion
  expressing disappointment in the player.
- "Works on my machine," `404`, blue-screen, bug-swatting, hacker-terminal, or
  sentient-AI cliches unless a final concept finds a genuinely new use for them.
- Changing or deleting an acceptance criterion to make the machine pass, then
  presenting that as clever.
- Treating testers, users, safety review, accessibility, security, or rollback
  as annoying obstacles to shipping.
- A fake pass, deceptive button, unreadable error, hidden evidence, random
  failure, or joke animation that resembles system state.
- Injury, poison, ecological harm, transit disaster, city destruction, or
  damaged cultural objects as failure spectacle.
- Corporate-crunch satire in which exhaustion is normal, expected, or the price
  of competence.
- Confetti, applause, or triumph music on a partial pass. The recurring gag may
  prepare to celebrate, but full celebration belongs to verified success.

## Scope and cut ladder

For a four-hour prototype, implement at most one reusable celebration prop with
four poses: `latched`, `hopeful`, `caught`, and `verified`. Add one deterministic
failure reaction and one final payoff per concept. Reuse existing result-state
signals rather than creating a parallel comedy state system.

Cut in this order if time, performance, or clarity is at risk:

1. Ambient idle reactions.
2. Optional text quips.
3. Secondary character reactions.
4. Intermediate celebration-prop poses.
5. The recurring prop itself.

Never cut factual evidence, persistent attempt history, the retry path, reduced
motion, or the verified final state in order to preserve a joke.

## Handoff

- **Changed path:** `plans/loop-engineer-concepts/agent-notes/comedy.md`
- **Checks:** Reviewed `AGENTS.md`, `PLAN.md`, `AGENT_ASSIGNMENTS.md`, and all
  current agent notes; checked the note for all five territories, recurring
  gag, failure tone, celebration beats, accessibility/localization cautions,
  and jokes to avoid. Required headings are present and the file has zero
  trailing-whitespace lines. Runtime tests are not applicable to this assigned
  documentation note.
- **Assumptions:** The five names and exact mechanics remain provisional;
  Stormglass maps to the orbital/storm territory, Sunrise Express maps to the
  release-train territory, and the quality-lab territory will choose either the
  kaiju or test-kitchen skin rather than combining both. Humor is optional and
  may be reduced independently of evidence or assessment.
- **Risks:** Too much character animation could obscure evidence, make the five
  concepts feel tonally alike, exceed the four-hour scope, or create XR comfort
  and localization costs. The strongest mitigation is one short reaction after
  result lock, with the restrained storm and museum concepts allowed to remain
  nearly joke-free.
