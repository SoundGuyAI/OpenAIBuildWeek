# Accessibility, mobile usability, and XR comfort review

Prepared: 2026-07-20
Scope: concept feasibility guidance for desktop, mobile touch, and WebXR
Risk scale: `1` safest / `5` highest comfort or access risk

## Executive recommendation

Prefer concepts built around a stable room-scale or tabletop scene, direct
selection, short rounds, and objects that can be reached through both direct
touch and a ray/pointer. The safest hackathon patterns are **Loop Engineer's
SDLC/SDLR loop-engineering lesson**, tabletop ecosystems, impossible packing,
control-room triage, object assembly, and turn-based alchemy. They preserve
their fantasy across platforms without
requiring continuous locomotion, two-handed input, precise throwing, or audio-
only timing.

Treat the fantasy and rules as the cross-platform contract, not the physical
gesture. A desktop player may drag a part, a mobile player may tap then place
it, and an XR player may grab it; all three are still _assembling the same
machine under the same constraints_. Every essential action needs a selectable
alternative to embodied motion, and XR embodiment should add delight rather
than gate progress.

Avoid making smooth locomotion, rapid head turns, arm-span reach, crouching,
dual-hand coordination, precise throwing, or mandatory beat detection part of
the critical path. These patterns can appear as optional flourishes only after
the stable one-handed path is complete.

## Concept gate: feasibility checklist

Use this before a concept advances. A `no` on any starred item requires a
redesign, not a settings-menu promise.

### Reach, posture, and motor access

- [ ] **All required targets are reachable while seated.*** No required floor
      pickup, overhead hold, turn behind the body, crouch, or full arm extension.
- [ ] The play volume fits inside a forward-facing 120-degree arc by default.
- [ ] Near objects can also be selected at distance with an IWSDK
      `Interactable` ray/pointer.
- [ ] One controller, one hand, mouse-only, keyboard-only, and one-thumb mobile
      paths can complete the critical loop.
- [ ] Two-handed gestures, if offered, have a sequential alternative such as
      select-then-place, lock-then-adjust, or hold-toggle.
- [ ] Precision has adjustable tolerance: generous snap zones, magnetic
      placement, forgiving timing, and no required throwing accuracy.
- [ ] Repetitive gripping can be replaced with grab-toggle or tap-to-hold.
- [ ] Left/right hand preference does not change information or difficulty.
- [ ] Standing and room-scale movement add presence but not exclusive rewards.

### Motion and XR comfort

- [ ] **The complete game works without continuous artificial locomotion.***
- [ ] Camera motion is never triggered by object interaction, failure, or
      celebration; the player owns the camera.
- [ ] Default play uses a stable horizon and a persistent spatial reference.
- [ ] Any optional locomotion offers teleport, snap turn, vignette, speed, and
      dominant-hand settings.
- [ ] Moving platforms, forced acceleration, head-locked particles, large
      flashes, and world rotation are absent from the critical path.
- [ ] Near-field effects do not cross the player's face or spawn inside the
      head. Threats stop outside a configurable personal-space boundary.
- [ ] Required object motion is predictable, slow enough to track, and can be
      paused. Reduced-motion mode removes bobbing, camera shake, and unnecessary
      parallax.
- [ ] The experience supports a 2-3 minute seated session and can be exited at
      any time without losing progress.

### Readability and sensory alternatives

- [ ] **No state, team, danger, or success condition relies on color alone.***
      Pair color with shape, icon, position, pattern, label, or motion.
- [ ] Mobile body text starts at least at 16 CSS px; primary labels and score
      values are larger. Text survives 200% browser zoom without loss of function.
- [ ] XR text is world-locked on stable panels, high contrast, and large enough
      to read from its intended distance; essential text never rides on fast-moving
      objects.
- [ ] Instructions use plain verbs, one action per sentence, illustrations, and
      progressive disclosure. A visible objective persists after onboarding.
- [ ] Captions identify speaker and important non-speech sounds. Rhythm and
      directional audio have visual and optional haptic equivalents.
- [ ] Speech input, spatial audio localization, and hearing are never required.
- [ ] Flashing is avoided; any high-contrast pulse stays below three flashes per
      second and can be disabled.
- [ ] Symbols and icon-only controls have text labels or accessible names.

### Mobile and browser usability

- [ ] **The critical path works in portrait and landscape, or the app provides
      a clear pre-play orientation choice without rotating mid-session.***
- [ ] Primary touch targets are at least 44 by 44 CSS px with spacing that
      prevents accidental activation.
- [ ] Gameplay does not require multi-touch, hover, right-click, long press,
      device motion, or edge gestures that conflict with browser navigation.
- [ ] Dragging has a tap-select/tap-place alternative and does not require the
      player's finger to cover precision feedback.
- [ ] Important controls stay out of notches, browser chrome, and home-indicator
      safe areas. HUD placement adapts to aspect ratio rather than scaling as one
      fixed canvas.
- [ ] Text entry is optional and short; the virtual keyboard never obscures a
      timed task.
- [ ] Pause activates automatically on visibility loss, focus loss, orientation
      change, or XR session interruption.

### Recovery, interruption, and platform parity

- [ ] A persistent reset/recenter control restores view, hand/ray origin, and
      the current puzzle without restarting the whole experience.
- [ ] Undo is available for destructive placement or sequencing mistakes.
- [ ] On XR exit or session loss, the game pauses and resumes in non-XR at a
      stable checkpoint; it does not duplicate entities or advance timers.
- [ ] Re-entry to XR restores the same game state and asks the player to
      recenter before resuming.
- [ ] Tutorial prompts update to the active input method without changing the
      underlying objective.
- [ ] Desktop/mobile players receive equivalent information, scoring, endings,
      and content. XR-only gestures provide expressive shortcuts, not exclusive
      solutions.
- [ ] Unsupported XR is communicated as a normal platform state, with a direct
      path to continue in the browser.

## Cross-platform interaction contract

| Player intent  | Desktop                                   | Mobile                               | XR                                          | Shared access rule                       |
| -------------- | ----------------------------------------- | ------------------------------------ | ------------------------------------------- | ---------------------------------------- |
| Select         | Click or focus + confirm                  | Tap                                  | Ray confirm or direct touch                 | Never require hover or physical contact  |
| Move/place     | Drag or select-then-place                 | Tap-select, ghost preview, tap-place | Grab or ray-drag                            | Snap zones and undo are identical        |
| Rotate/adjust  | Wheel, keys, or visible buttons           | Large `+/-` or rotate buttons        | Wrist motion or buttons                     | Gesture is optional; buttons always work |
| Hold/use tool  | Click toggle or key toggle                | Tap toggle                           | Grip toggle by default                      | No sustained grip requirement            |
| Inspect        | Orbit/pan controls                        | One-finger orbit; UI zoom control    | Head movement; object turntable             | Never require walking around an object   |
| Move viewpoint | Fixed viewpoints or teleport              | Fixed viewpoints or teleport         | Physical lean, teleport, optional snap turn | No continuous movement required          |
| Pause/reset    | Persistent buttons and keyboard shortcuts | Persistent safe-area buttons         | Wrist/menu panel plus controller shortcut   | Available during onboarding and failure  |

## Review of 20 concept families

These are interaction families rather than final names. They are intentionally
different enough to pressure-test the proposal set before the orchestrator
selects canonical concepts.

### 1. Loop Engineer - learn agentic software development through loop engineering

**Pattern:** Turn-based edutainment / process orchestration. The player employs
an eager NPC mentor and learns agentic software development across the software
development life cycle (SDLC) and SDLR through loop engineering: understand a
request, review a plan, assign specialist agents, run tests, inspect evidence,
and use feedback to improve the next iteration.

- **Platform fit:** Desktop uses cards and click/keyboard commands; mobile uses
  a one-column card queue with tap-to-assign; XR uses a seated desk or tabletop
  where cards and evidence objects can be selected by ray or direct grab. Every
  platform presents the same SDLC/SDLR curriculum, decisions, and outcomes.
- **Cognitive access:** Introduce only one new term per step. Present `software
  development life cycle (SDLC)` once with a plain-language example; present
  `SDLR` consistently beside the concrete software task, test, evidence, and
  feedback it governs. Keep a persistent loop-progress diagram with the active
  activity visibly marked, without deriving activities from acronym letters.
  Use worked examples before scoring. Separate
  _the NPC made an incorrect recommendation_ from _the player failed_; allow
  retry, undo, and explanation without time pressure.
- **Readable feedback:** Each agent card needs a role label, icon, short
  capability sentence, and explicit output. Plan status uses numbered stages,
  not color. Evidence review shows `claim -> check -> result` in plain language.
  A transcript/history panel must be pausable, scrollable, and preserved across
  platform changes.
- **One-handed/mobile parity:** The whole loop must be completable with taps and
  a single bottom-sheet action area. Replace XR card throwing, physical sorting,
  or simultaneous two-card combination with select-then-assign and visible move
  buttons. Do not require typing prompts during timed play; offer concise prompt
  chips and optional editing.
- **XR comfort:** Keep the NPC and workflow board in the forward arc. The NPC
  stays outside personal space, never teleports behind the player, and uses
  captions plus restrained gestures. Evidence arrives on the board rather than
  flying at the player's face. Seated mode is the default.
- **Fantasy-preserving constraint:** Across platforms, the player is the
  thoughtful lead learning to guide agentic software work across SDLC and SDLR
  by choosing, reviewing, testing, and explaining. XR adds spatial organization
  and character presence, not a different curriculum or grading model.
- **Primary risks:** Acronym/jargon overload, dense text, chat-log scrolling,
  unclear distinction between simulation and real agent behavior, and an NPC
  whose animation or voice steals attention from instructions.
- **Required safeguards:** Plain-language glossary, read-aloud optionality,
  captions, adjustable text size, no timer in learning mode, stage-by-stage
  replay, explicit outcome explanation, and a `show me why` action.
- **Risk:** `1/5` if card-based and turn-based; `3/5` if built around free-form
  prompting, voice recognition, or fast real-agent outputs.

### 2. Tabletop ecosystem caretaker

**Pattern:** Nudge water, light, terrain, and creatures in a living diorama.

- Stable tabletop, ray access, large tools, and turn-based growth make this
  excellent for seated, one-handed play. Mobile can use tap-select/tap-place;
  XR can grab tools. Show health with posture, icon, and pattern as well as
  color. Avoid requiring the player to walk around the table; add rotate-world
  buttons and fixed viewpoints.
- **Risk:** `1/5`.

### 3. Snap-together impossible machine

**Pattern:** Assemble whimsical parts and watch a short chain reaction.

- Strong parity through drag/tap-place/grab and generous sockets. Every part
  should have a unique silhouette and labeled function. Provide auto-orient,
  ghost previews, undo, and a one-button test run. Chain reactions should pause
  before replay and avoid camera shake or loud-only causality cues.
- **Risk:** `1/5`.

### 4. Control-room crisis triage

**Pattern:** Prioritize alarms and route limited resources in one cockpit.

- Seated and one-handed by nature, with high demo legibility. Controls need
  icons, labels, shape coding, large activation zones, and confirmation for
  destructive actions. Never convey urgency through flashing and audio alone.
  Include a no-timer/story mode because divided attention is the main barrier.
- **Risk:** `1/5` mechanically; `2/5` cognitively if the HUD becomes dense.

### 5. Impossible packing puzzle

**Pattern:** Fit odd artifacts into a transforming container.

- Fixed scene and object manipulation are comfortable. Mobile needs explicit
  rotation controls so multi-touch is unnecessary; XR needs ray-based distant
  manipulation and snap assistance. Use texture/silhouette matches instead of
  color-only fit hints. Avoid physics instability and time pressure.
- **Risk:** `1/5`.

### 6. Turn-based kitchen alchemy

**Pattern:** Combine ingredients to discover visual transformations.

- One-handed selection and sequencing work everywhere. Recipes should use
  icons, text, quantity, and shape; sizzling or pitch cannot be the only timing
  cue. Keep stations within a forward semicircle and bring ingredients to the
  player instead of requiring room traversal. Offer step undo and recipe recall.
- **Risk:** `1/5`.

### 7. Perspective alignment mystery

**Pattern:** Align separated objects from the correct viewpoint to reveal clues.

- The fantasy depends on viewpoint but must not require body contortion. Offer
  selectable camera anchors on desktop/mobile and teleport markers in XR, plus
  an object-rotation alternative. Snap near correct alignment and add non-color
  edge cues. Avoid sudden scene-scale changes after solving.
- **Risk:** `2/5`; rises to `4/5` if physical leaning or walking is required.

### 8. Shadow-puppet story director

**Pattern:** Arrange characters and lights to make readable shadow scenes.

- Comfortable if all composition happens on a fixed stage. Mobile requires
  tap-place and visible depth controls; XR can grab but should not require two
  hands to hold a light and puppet together. Narration needs captions and visual
  beat markers. Low-vision mode should show object outlines and a non-shadow
  preview of the target tableau.
- **Risk:** `2/5` due to contrast and vision dependence.

### 9. Constellation weaving

**Pattern:** Connect stars into structures that animate into myths.

- Point-and-connect maps cleanly across inputs and can be one-handed. Nodes need
  large hit regions, labels on focus, undo, and an alternative list view for
  players who cannot trace spatial layouts. Keep the star field world-locked;
  no rotating sky or forced upward neck posture.
- **Risk:** `2/5`.

### 10. Archive detective

**Pattern:** Inspect a compact evidence room and link clues into a theory.

- Use fixed viewpoints and an accessible evidence inventory so walking and
  visual hunting are optional. All tiny markings need zoom, text description,
  and high-contrast inspect mode. Mobile should never require pixel hunting.
  Provide a clue list and progressive hints to reduce memory load.
- **Risk:** `2/5`; cognitive/visual access is the main concern.

### 11. Portal parcel routing

**Pattern:** Aim paired portals to send packages through a compact factory.

- Preserve parity by selecting portal endpoints rather than requiring physical
  throws. Trajectories need previews, slow-motion, and replay controls. The
  camera remains fixed while parcels move. Distinguish destinations through
  shape and labels as well as color.
- **Risk:** `2/5`; `4/5` if timing and throwing become mandatory.

### 12. Time-freeze rescue tableau

**Pattern:** Pause a frozen accident, reposition a few objects, then resume.

- Turn-based setup is comfortable and naturally interruption-safe. Provide
  timeline scrubbing via large buttons, not a precision slider alone. Warn
  before resuming motion, keep the camera stationary, and offer reduced-speed
  playback. Failure should freeze into an explainable state rather than reset
  explosively.
- **Risk:** `2/5`.

### 13. Creature swarm conductor

**Pattern:** Place beacons and gestures to guide a flock through patterns.

- One-handed beacon placement should be the canonical input; broad XR gestures
  are expressive shortcuts. Swarm goals need shape trails and waypoint icons,
  not color or audio direction alone. Cap particle count and visual density;
  include pause, speed control, and reduced-motion mode.
- **Risk:** `2/5`; visual overload can raise it to `3/5`.

### 14. Sonic cartography

**Pattern:** Map an unseen space by emitting pulses and interpreting echoes.

- The core fantasy risks excluding deaf/hard-of-hearing players and players
  sensitive to audio. Every echo requires synchronized expanding geometry,
  captions, directional arrows, and optional haptics. Do not make stereo
  localization or pitch discrimination required. Offer a persistent map rather
  than forcing short-term auditory memory.
- **Risk:** `3/5` even with strong alternatives; `5/5` if audio-only.

### 15. Spatial rhythm sculptor

**Pattern:** Catch or redirect music beats to shape a sculpture.

- Provide a visual timing lane, beat-window adjustment, practice speed, and
  non-rhythmic creative mode. Mobile uses tap targets rather than swipes across
  the screen; XR supports ray selection instead of arm-span catches. Never
  require hearing, two hands, or full-body movement to finish.
- **Risk:** `3/5`; timing, fatigue, audio access, and visual density compound.

### 16. Zero-gravity salvage

**Pattern:** Recover and sort meaningful objects from a drifting room.

- Keep the player stationary and bring objects through a bounded work volume;
  do not simulate player drift or world roll. Use grab rays, object recall, and
  a stable horizon grid. Mobile/desktop can orbit the scene while the camera's
  up direction remains fixed. Reduce floating debris and disable bobbing.
- **Risk:** `3/5`; `5/5` if the player locomotes freely in six degrees.

### 17. Giant caretaker

**Pattern:** A huge gentle creature asks the player to clean, heal, or decorate
one body area at a time.

- Scale creates an XR hero moment but can demand overhead reach and close
  proximity. Present each task on a height-adjustable platform and duplicate it
  as a miniature workstation. Keep the creature outside personal space and ask
  consent before it approaches. Mobile needs clear camera anchors.
- **Risk:** `3/5` due to scale, reach, and proximity.

### 18. Dream-room repair

**Pattern:** Rearrange impossible architecture to calm a shifting dream.

- Visual transformations must not rotate the player's world or move the camera.
  Apply changes in discrete, previewed steps with a stable floor and horizon.
  Use reduced-motion crossfades and a `return room to neutral` control. Mobile
  gets fixed viewpoints and direct object controls.
- **Risk:** `4/5`; world transformation is inherently comfort-sensitive.

### 19. Micro-sport trick challenge

**Pattern:** Perform compact tosses, ricochets, or paddle shots for score.

- Physical skill does not transfer evenly between mouse, touch, and tracked
  hands. Use aim previews, power buttons, generous timing, seated reach zones,
  and an accuracy-assist mode. Never require a real throwing release, rapid arm
  motion, or room-scale retrieval. Offer turn-based target puzzles as parity.
- **Risk:** `4/5` because motor access and input fairness are central.

### 20. Escape-the-wave chase

**Pattern:** Move through a changing environment while a threat advances.

- This is the least suitable hackathon pattern. Continuous locomotion, urgency,
  rear threats, camera turning, and mobile virtual sticks create comfort and
  access barriers. A viable redesign uses stationary safe nodes, teleport-only
  turns, forward-facing threats, no jump scares, pause-anytime play, and a
  strategic route-choice mode with identical outcomes.
- **Risk:** `5/5`; do not select unless locomotion is removed from the core.

## Ranking

### Safest hackathon implementation

1. **Loop Engineer** - its SDLC/SDLR loop-engineering curriculum is stable,
   turn-based, one-handed, and low motion; success depends mainly on information
   design and consistent terminology across platforms.
2. **Tabletop ecosystem caretaker** - strong seated parity and forgiving pace.
3. **Impossible packing puzzle** - tiny ruleset and direct manipulation with
   easy tap-place fallback.
4. **Snap-together impossible machine** - clear visual loop and generous snap
   assistance.
5. **Control-room crisis triage** - fixed posture and spectator-readable state,
   provided density and flashing are controlled.
6. **Turn-based kitchen alchemy** - accessible sequencing with strong visual
   feedback.
7. **Time-freeze rescue tableau** - interruption-safe and no live locomotion.
8. **Constellation weaving** - simple pointer mechanic; needs neck-posture and
   low-vision care.

### Moderate risk, feasible with explicit safeguards

9. Perspective alignment mystery
10. Shadow-puppet story director
11. Archive detective
12. Portal parcel routing
13. Creature swarm conductor
14. Sonic cartography
15. Spatial rhythm sculptor

### Highest comfort/accessibility risk

16. **Zero-gravity salvage** - vection and horizon instability.
17. **Giant caretaker** - reach, scale, proximity, and camera framing.
18. **Dream-room repair** - world motion and disorientation.
19. **Micro-sport trick challenge** - motor demand and platform input inequity.
20. **Escape-the-wave chase** - locomotion sickness, urgency, rear awareness,
    and virtual-control burden.

## Proposal-wide design constraints

1. Design the smallest complete game for **seated, forward-facing, one-handed
   play first**. Standing, two-hand, hand-tracking, and room-scale behaviors are
   enhancements.
2. Keep essential interactions between waist and shoulder height and within a
   comfortable forward arc. Provide ray access and height calibration.
3. Use **select -> preview -> confirm -> undo** as the universal manipulation
   grammar. Direct grab, drag, and gestures may accelerate it.
4. Preserve identical goals, rules, information, scoring, content, and endings
   across platforms. Permit different controls where device strengths differ.
5. Prefer fixed scenes, tabletop worlds, discrete viewpoints, and teleport over
   smooth locomotion. Never animate the player's camera for spectacle.
6. Keep each round pausable and checkpointed. Treat tab hiding, phone rotation,
   headset removal, XR exit, controller loss, and browser interruption as normal
   states.
7. Establish a visual-language budget before art production: high-contrast
   text, shape-plus-color state coding, subtitles, reduced motion, scalable HUD,
   and low-vision outlines.
8. Put reset, recenter, pause, input help, text size, handedness, grab-toggle,
   reduced motion, and audio/caption controls in the first usable build.
9. Test mobile with one thumb and XR while seated before polishing embodied
   gestures. If either path cannot finish the core loop, the concept is not yet
   cross-platform.
10. Market the shared fantasy honestly: “build,” “teach,” “conduct,” or “solve
    anywhere,” not “identical controls everywhere.”

## Minimum concept-card fields for the final proposal

Every proposal card should expose these items visually, not bury them in prose:

- posture icon: seated-first / standing-optional;
- hands icon: one hand / two hands optional;
- movement icon: stationary / teleport / optional locomotion;
- primary input trio: mouse, one-thumb touch, controller/hand ray;
- comfort risk `1-5` and the single biggest mitigation;
- sensory alternatives: captions, visual audio cues, shape-plus-color coding;
- reset/recenter and interruption behavior;
- one sentence explaining how the fantasy remains the same on all platforms.
