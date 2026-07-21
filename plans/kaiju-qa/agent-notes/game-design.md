# Game design expert notes: kaiju-qa

Status: complete
Design target: a cold player can understand, test, revise, and release within
three minutes without presenter narration.

## Player fantasy, learning promise, and protected core

The player is the release engineer for a helpful baby kaiju. They are not
fighting the creature or writing code. They stage a miniature city test, read
evidence, choose a bounded behavior guardrail, and decide whether the build has
earned release.

The lesson must be visible through play:

`record a baseline -> add an edge case -> observe failure -> try a broad fix ->
catch a regression -> choose the smallest safe guardrail -> run the full suite
-> release`

Three design pillars should govern implementation and cuts:

1. **Evidence before confidence.** A happy path is recorded as partial coverage,
   never as "safe to ship."
2. **Failure is useful, not punitive.** Every failed run creates persistent,
   inspectable evidence and returns the player to a useful decision.
3. **The player earns the release.** The tutorial creates the regression, but
   it does not select the final answer. The player diagnoses, chooses, reruns,
   and deliberately releases.

The core loop after onboarding is:

`inspect changed evidence -> choose a candidate guardrail -> run all tests ->
compare with the prior attempt -> revise or release`

## Test district and deterministic rule matrix

Use three named acceptance tests. The ambulance must visibly pass before the
broad guardrail is applied; otherwise its later failure is a new edge case, not
a regression.

| Test | Player-facing criterion | Baseline evidence | Essential visual proof |
| --- | --- | --- | --- |
| **Stranded Car** | Deliver the car to the service bay before the response marker expires. | PASS | Car reaches the striped service bay; timer/route endpoint receives a check. |
| **Emergency Lane** | Keep the crossing clear when the ambulance arrives. | PASS | Ambulance crosses without stopping; lane tile receives a check. |
| **Fragile Tower** | Complete the carry route without contacting or tilting the tower. | UNTESTED, then FAIL when staged | Contact marker, tower tilt/crack pose, and an X at the collision point. |

The baseline run can animate the car rescue and ambulance crossing in one short
authored sequence. It records `2 PASS / 1 UNTESTED`, so the first success feels
good while the release gate remains visibly locked.

The implementation should preserve this exact outcome matrix. Numeric timing
thresholds may be tuned, but the pass/fail relationships should not change.

| Candidate behavior | Scope shown on card | Stranded Car | Emergency Lane | Fragile Tower | Teaching result |
| --- | --- | --- | --- | --- | --- |
| **NO GUARDRAIL** | Current behavior | PASS | PASS | FAIL | The happy path is useful but incomplete. |
| **FREEZE NEAR BUILDINGS** | Every building buffer | PASS | **REGRESSION** | PASS | A safe-sounding broad fix changes unrelated behavior. |
| **SLOW WHILE CARRYING** | Every carried object | **REGRESSION** | PASS | PASS | A different broad rule fixes safety but misses the response target. |
| **SLOW IN STRIPED ZONES** | Marked hazard zones only | PASS | PASS | PASS | The smallest contextual change preserves prior behavior. |

Suggested authored timing, only to make the matrix easy to implement: baseline
delivers the car in 5 seconds; `FREEZE NEAR BUILDINGS` delivers in 7 seconds but
occupies the crossing when the ambulance arrives; `SLOW WHILE CARRYING` takes
10 seconds and misses an 8-second response marker; `SLOW IN STRIPED ZONES`
delivers in 7 seconds, clears the crossing, and avoids tower contact. Reuse the
same route splines and alter authored speed/stop poses rather than adding
physics or pathfinding.

## Concrete 180-second beat sheet

The target includes room for one wrong player choice and retry. A correct first
choice should finish early rather than padding the session.

| Time | Player action and understanding | Game response and spectator read | Recovery |
| --- | --- | --- | --- |
| **0:00-0:08** | Read the mission: prove the helper safe before release. The first action, `RUN BASELINE`, is already highlighted. | Tabletop wakes, three test tiles are visible, and Release reads `LOCKED: 0/3 tested`. | After 5 seconds, pulse Run; after 10 seconds, anchor the first clue to it. |
| **0:08-0:24** | Activate `RUN BASELINE`. Learn that testing starts by recording what already works. | Kaiju moves the stalled car while the ambulance crosses. Board records Car PASS, Emergency PASS, Tower UNTESTED, `Coverage 2/3 - not ready`. | `Skip animation` resolves to the same evidence; interrupted focus pauses safely. |
| **0:24-0:35** | Add the fragile-tower fixture to the only highlighted socket. Learn to add an observable edge case before changing behavior. | Tower snaps into place; its tile changes from UNTESTED to READY. | Click/tap/activate-to-snap is canonical; drag/grab is optional. |
| **0:35-0:48** | Run the new tower test. | Kaiju clips the tower. The scene freezes briefly on the contact marker, then records Tower FAIL without a game-over screen. | A result summary remains until the next action; no reaction-time input is required. |
| **0:48-0:58** | As a guided experiment, select `FREEZE NEAR BUILDINGS`. Learn that a plausible patch is a hypothesis, not proof. | The card shows `Scope: every building`; prior attempts remain in history while the current gate reads STALE. | Guide can be hidden and resumed; no other policy is selected automatically. |
| **0:58-1:15** | Activate `RUN ALL 3 TESTS`. Learn that a fix must preserve earlier behavior. | Tower changes FAIL -> PASS, but ambulance changes PASS -> REGRESSION as the stopped kaiju blocks the crossing. The before/after columns remain visible. | If skipped, jump to the deterministic final poses and populate the same evidence. |
| **1:15-1:25** | Tutorial hands control over: inspect the changed row and policy scopes. | Guide rail changes from `TRAINING` to `YOUR CALL`; the next-candidate selection clears while the Freeze attempt remains in history. All three cards are neutral and enabled. | A persistent Hint button is available, but no automatic selection occurs. |
| **1:25-1:42** | Inspect any test/path in any order and choose a candidate guardrail. | Selecting a test emphasizes its route and criterion; selecting a policy shows its scope and marks evidence `NEEDS RUN`. | If the player does nothing, progressive hints point first to the regression, then to scope. |
| **1:42-1:58** | Activate `RUN ALL 3 TESTS` for the selected candidate. | A fast three-test montage updates one attempt column and the miniature scene. | No policy selected: do not run; focus the policy group and explain what is missing. |
| **1:58-2:10** | Read the result. If wrong, activate `REVISE GUARDRAIL`; if correct, review the 3/3 gate. | Wrong choice names the preserved tests and the single regression. Correct choice changes Release to `READY: 3/3 current tests pass`. | `REVISE GUARDRAIL` returns to choices in one action while retaining all attempt history. |
| **2:10-2:27** | Budgeted retry: choose another policy and rerun. | A second attempt column appears. The scene resets to its start poses, not to the beginning of the tutorial. | After a second wrong choice, give the direct hazard-zone hint. |
| **2:27-2:40** | Confirm that every current test passes and deliberately activate `RELEASE`. | Release is a separate action; stale or prior-attempt passes never unlock it. | If Release is activated while locked, announce the exact missing/failing test and return focus there. |
| **2:40-2:56** | Enjoy the earned hero moment. | Release stamp lands, district lights switch on, and the kaiju takes a guardian pose/scale-up while the report reads `3 PASS / 0 REGRESSIONS / TARGETED CHANGE`. | Reduced-motion mode uses an immediate guardian pose, static badge, and lighting change. |
| **2:56-3:00** | Choose `REVIEW ATTEMPTS` or `RESTART LAB`. | Final frame keeps the kaiju, release stamp, and three green labeled tests legible for a screenshot. | Restart returns to cold load without a page reload. |

## Step-by-step tutorial contract

The tutorial is a guided experiment, not the whole game. It should end by about
75 seconds and leave the final diagnosis to the player.

| Step | Functional copy target | Only highlighted action | Completion event | Why it matters |
| --- | --- | --- | --- | --- |
| **1. Record** | `First, record what already works. Run the current build.` | `RUN BASELINE` | Baseline animation resolves and two PASS tiles appear. | Establishes evidence before changes. |
| **2. Cover** | `One happy path is not coverage. Add the fragile tower.` | Tower fixture / highlighted socket | Tower snaps into the socket and becomes READY. | Teaches deliberate edge-case staging. |
| **3. Observe** | `Test before changing behavior. Run the tower case.` | `RUN TOWER TEST` | Contact pose resolves and Tower becomes FAIL. | Makes the failure observable and non-punitive. |
| **4. Hypothesize** | `Try this safe-sounding broad rule. We will test it, not trust it.` | `FREEZE NEAR BUILDINGS` | Candidate is selected; prior attempts stay intact and the current gate becomes STALE. | Frames a patch as a hypothesis. |
| **5. Regress** | `A fix must preserve old behavior. Run every test.` | `RUN ALL 3 TESTS` | Tower passes and Emergency Lane becomes REGRESSION. | Demonstrates regression with before/after proof. |
| **Handoff** | `Training complete. Choose the smallest rule that keeps every test passing.` | None; all policy/evidence controls unlock | Player inspects or selects any policy. | Marks the transition to meaningful agency. |

Tutorial behavior requirements:

- Keep each prompt to one instruction plus one reason, ideally 18 words or
  fewer. Results stay visible, so the player does not have to memorize prose.
- Do not use a generic `Next` button. The highlighted game action advances the
  step after its authored result settles.
- `HIDE GUIDE` removes callouts but does not fast-forward or change state.
  `SHOW GUIDE` resumes at the current state and never repeats completed actions.
- The progress rail reads `1/5` through `5/5`, then changes to `YOUR CALL`.
- Tutorial highlights may dim unrelated controls visually, but Help, audio,
  reduced motion, reset, and focus recovery remain available.
- If a player activates a valid future control early, explain the current
  prerequisite and move focus/highlight back; do not erase progress.
- The guide must not reveal `SLOW IN STRIPED ZONES` as the answer. It may teach
  the principle of comparing scope only after the regression is visible.

## Meaningful player agency after the tutorial

The independent phase begins at the regression, not after the correct answer.
To keep it meaningfully player-controlled:

- Unlock all three policy cards at once with neutral styling and deterministic
  order. Do not put a green halo, recommendation badge, or default selection on
  the targeted option.
- Let the player inspect Car, Emergency Lane, or Tower evidence in any order.
  Inspection should show the criterion, baseline result, current result, and
  the relevant route/contact marker.
- Make policy scope explicit rather than hiding it behind flavor text. The
  reasoning challenge is to connect the regression to scope, not to guess an
  arbitrary designer answer.
- Treat a selected policy as a candidate. Changing it leaves historical attempt
  columns intact but marks the current release gate STALE until a new full-suite
  run completes.
- Give both wrong policies distinct, understandable consequences. A wrong
  choice should teach why it is too broad, not merely flash `incorrect`.
- Preserve attempt history as compact columns or cards. At minimum show policy
  name plus Car/Tower/Emergency outcomes; route ghost overlays are optional.
- Permit the player to rerun an unchanged candidate, but warn first:
  `Nothing changed; this will reproduce the same evidence.` Offer
  `REVIEW POLICIES` as the primary action and `RUN AGAIN` as the secondary.
- After release, `REVIEW ATTEMPTS` lets a curious player compare the broad and
  targeted outcomes. `RESTART LAB` is the immediate replay path.

Do not add a score based on speed or number of failures. The useful result is a
release report: coverage, regressions, and change scope. If a light mastery
badge is desired, award `TARGETED FIX` only after 3/3 current tests pass.

## Evidence and feedback language

Use the same five status terms everywhere: `UNTESTED`, `PASS`, `FAIL`,
`REGRESSION`, and `STALE`. `REGRESSION` means a criterion that passed on a prior
build and fails on the current candidate; do not use it as a synonym for any
failure.

Each essential outcome should appear in at least three channels:

- **Scene:** authored pose/path, such as tower contact or blocked ambulance.
- **Evidence board:** explicit status label and before/after arrow.
- **Control state:** coverage count and Release lock reason.
- **Optional reinforcement:** short sound and haptic, never the sole cue.

Recommended non-color encoding:

| Status | Shape/pattern | Text/motion treatment |
| --- | --- | --- |
| UNTESTED | Open square with dash | `UNTESTED`; no pulse after onboarding. |
| PASS | Solid circle with check | `PASS`; one calm settle pulse. |
| FAIL | Octagon with X | `FAIL`; contact/timeout marker remains in scene. |
| REGRESSION | Split diamond with down arrow | `PASS -> REGRESSION`; prior result remains beside it. |
| STALE | Hatched square with refresh arrow | `STALE - rerun required`; Release locks immediately. |

The tower failure may be funny, but keep it toy-like: a tilt, cardboard crack,
or warning flag rather than distress or realistic destruction. The kaiju should
look surprised and ready to try again, not ashamed.

## Success, failure, retry, reset, and release behavior

### Success

- A suite succeeds only when all three current tests have run under the current
  selected policy and all three pass.
- The pass state unlocks a separate Release action; it does not auto-release.
- The release summary must name the evidence: `3/3 passed`, `0 regressions`,
  and `scope: striped hazard zones only`.
- The hero moment keeps the evidence board visible so spectacle does not erase
  the reason release was earned.

### Failure and invalid states

- There is no game-over state. A failed test returns to diagnosis with the
  failed criterion, cause, and attempt history visible.
- Running without a selected candidate does not animate. Focus the policy group
  and announce `Choose one guardrail before running the suite.`
- Release remains visible but locked. Its adjacent reason should say exactly
  `1 regression`, `1 untested test`, or `results stale`, not a generic error.
- A repeated unchanged run is allowed after a warning; deterministic replay can
  be useful for learning and demos.
- During simulation, disable conflicting policy changes but provide
  `SKIP ANIMATION`. Skipping commits the same deterministic result.

### Retry and reset

- `REVISE GUARDRAIL` is the one-action retry: it resets scene poses, reopens the
  three choices, and retains the failed attempt and evidence.
- Do not require replaying tutorial steps, replacing the tower, or reloading the
  page after a wrong choice.
- `RESTART LAB` is a full reset available from Help/pause and the result screen.
  Protect it with a brief confirmation only while progress exists.
- If the tab is hidden, input focus is lost, or a headset is removed during a
  run, pause at a checkpoint. On return offer `RESUME RUN` and `SHOW RESULT`;
  either path must produce one result, never duplicate or lose an attempt.

### Release

- Release eligibility is computed only from the latest complete suite for the
  currently selected policy. Earlier green attempts cannot satisfy the gate.
- Any scenario or policy change immediately makes evidence STALE and relocks
  Release.
- If XR entry is denied or unavailable, the desktop/mobile release path remains
  complete; XR is a presentation mode, not a different rule set.
- Hero motion should be authored and camera-stable. In XR, avoid scaling the
  whole world around the player; scale/pose the kaiju on the table or reveal a
  guardian hologram at a comfortable distance.

## Desktop, mobile, and XR semantic mappings

The semantic intent, labels, state transitions, and outcomes must be identical
across modes. Direct manipulation can be offered as delight, but no required
action may be drag-only, precision-only, two-handed, or dependent on locomotion.

| Player intent | Desktop mouse/keyboard | Mobile/touch | XR controllers | Hands, if later supported | Shared confirmation |
| --- | --- | --- | --- | --- | --- |
| Inspect a test or route | Click the test tile; Tab then Enter/Space; arrow keys may move within the tile group. | Tap the test tile; expanded details appear in the same panel, not a hover state. | Aim ray at the world-space test tile and press trigger. | Point/pinch the tile. | Selected tile gains a thick outline; criterion and prior/current results are announced/shown. |
| Stage the fragile tower | Click the fixture or focus it and press Enter/Space; it snaps to the only valid socket. Optional pointer drag may also work. | Tap fixture to snap; optional forgiving drag uses a large magnetic socket. | Ray-select fixture then socket, or direct-grab and release over the generous socket. | Pinch fixture and release over socket; select-to-snap remains fallback. | Socket fills, placement sound/caption fires, Tower changes UNTESTED -> READY. |
| Select a guardrail | Native radio-card behavior: click, or focus group and use arrows/Space. | Tap a full-width card; no small checkbox target. | Ray + trigger on a world-space radio card. | Point/pinch card. | Card states selected policy and scope; evidence becomes STALE/NEEDS RUN. |
| Run a test/suite | Click semantic button; Tab + Enter/Space. | Tap the sticky primary button. | Ray + trigger on the large Run panel button. | Point/pinch button. | Button becomes `RUNNING`; scene and evidence rail show the same ordered test montage. |
| Skip authored motion | Click/focus `SKIP ANIMATION`. | Tap secondary button beside progress. | Ray + trigger. | Point/pinch. | Jumps to final poses and identical evidence without dropping a test. |
| Revise after failure | Activate `REVISE GUARDRAIL`. | Tap bottom-sheet primary action. | Ray + trigger on result panel. | Point/pinch. | Scene resets to ready poses; attempt history remains. |
| Release | Activate focusable Release control when ready. | Tap Release after the 3/3 summary. | Ray + trigger on the stamped Release panel. | Point/pinch. | Same gate validation, release report, guardian pose, and replay options. |
| Help/pause/reset | Help button; Escape opens pause/help without discarding state. | Persistent Help icon in safe area. | Menu button or world-space Help panel; no locomotion required. | Wrist/menu gesture only if reliable; world panel fallback. | Current objective, guide toggle, audio/motion settings, and Restart are available. |

Interaction layout recommendations:

- No required camera movement. Desktop orbit, mobile swipe orbit, and XR
  head/lean inspection may be optional, but every required target and status is
  readable from the default view.
- Desktop/mobile use semantic DOM controls backed by the same game state. XR
  world-space controls should mirror the same labels and intent IDs rather than
  creating an XR-only mechanic.
- Minimum DOM target is 44 by 44 CSS pixels with visible focus. XR targets
  should be roughly 4 cm at one meter / at least 2.5 degrees of visual angle,
  with generous ray hit volumes.
- Keep required actions one-handed. Controller handedness changes ray origin,
  not layout or rule meaning.
- Support seated and standing XR at a fixed tabletop height/recenter point. No
  smooth locomotion, snap turn, room-scale reach, or crouching is required.
- On narrow mobile screens, keep the miniature in the upper region and use a
  bottom sheet for guide/evidence/cards. Avoid horizontal card carousels and
  keep Run/Retry above the safe-area inset.

## Progressive hints and stuck-player recovery

Hints are based on meaningful inactivity, not a countdown the player can fail.
Inspecting evidence, selecting a card, or running a test resets the hint timer;
mere pointer movement does not.

| Context | After 5 seconds | After 10 seconds | After 20 seconds |
| --- | --- | --- | --- |
| Tutorial action | Pulse/outline only the required target; no new prose. | Add one reasoned clue, e.g. `Record the current behavior before changing it.` | Give the direct action, e.g. `Activate RUN BASELINE below.` `SHOW ME` scrolls/focuses the target but never activates it. |
| Tower placement | Pulse fixture and socket with matching pattern. | `Add a risky situation before choosing a fix.` | `Activate the tower card; it will snap into the striped socket.` |
| Post-tutorial diagnosis | Outline the `PASS -> REGRESSION` Emergency row. | `Compare what changed with the scope written on each policy.` | `Choose the rule that changes behavior only where the tower hazard exists.` |
| After `SLOW WHILE CARRYING` fails | Immediately mark Car as the only regression and show its response marker. | `This rule slows every rescue, not just the risky section.` | `Try a policy scoped to the marked hazard zone.` |
| After repeated unchanged run | Show `Same policy + same tests = same evidence.` | Focus `REVIEW POLICIES`. | Offer the direct scope hint; never auto-select. |

Also provide a persistent `HINT` action that advances one hint level on demand.
Hints must not steal keyboard focus, cover the selected evidence, repeatedly
spam a screen reader live region, or rely on audio.

## Accessibility, comfort, and inclusive tutorial requirements

- Essential state is never color-only. Pair every state with the exact label,
  icon/shape, route pattern, and persistent evidence row described above.
- Keep body text at least 16 CSS pixels on mobile, use WCAG AA contrast, allow
  browser zoom, and avoid placing essential text over the animated scene.
- All required controls are reachable in a logical keyboard order with a strong
  visible focus indicator. Radio cards use normal group semantics; buttons use
  accessible names matching visible labels.
- Announce concise state changes in a polite live region, for example:
  `Emergency Lane changed from pass to regression. Release locked.` Do not
  narrate every animation frame.
- Provide a DOM/text evidence summary equivalent to route colors and 3D poses
  so screen-reader and low-vision players can complete the reasoning loop.
- No player decision is timed. In-world response markers judge the simulated
  policy, not the player's reaction speed.
- Reduced-motion mode removes camera moves, shake, rapid scale changes,
  confetti, and repeated pulses. Authored poses snap/fade in under 200 ms, and
  the release hero moment becomes a static guardian pose plus badge/lighting.
- Essential audio has an on-screen equivalent. Provide mute; use captions such
  as `ambulance horn - lane blocked` only as reinforcement.
- Avoid flashes, realistic destruction, and high-frequency alarm sounds. One
  brief toy-like wobble is enough to communicate tower contact.
- Preserve state when orientation changes, the tab hides, XR focus changes, or
  tracking is temporarily lost. Pause motion and require an explicit resume.
- Support one-handed play, either controller hand, seated XR, and no required
  reach outside a comfortable central interaction cone.
- Tutorial prompts use plain language and one concept at a time. Technical
  vocabulary (`baseline`, `edge case`, `regression`, `release gate`) appears
  beside the visible event that defines it, not in a pre-game glossary.

## Ordered cut ladder

Cut from the top first. Each cut must leave the complete educational arc and
same semantic controls intact.

1. **Decorative spectacle:** confetti, particles, crowd props, animated skyline,
   extra camera framing, dynamic music layers.
2. **Optional sensory polish:** haptics, voiced lines, secondary sound effects,
   kaiju reaction variations. Keep visual labels and mute-independent feedback.
3. **Input embellishments:** direct drag physics, hand tracking, mobile drag,
   optional orbit controls. Keep select-to-snap, semantic buttons, and XR ray.
4. **Stretch content:** a fourth guardrail, mastery score, alternate tower prop,
   or extra replay challenge. Keep the required three policy choices.
5. **Rich comparison visuals:** animated route ghosts and multiple scene
   overlays. Keep compact attempt columns, prior/current labels, and the contact
   marker.
6. **Hero animation complexity:** replace scale-up/city transformation with a
   stable guardian pose, release stamp, district lights, and final evidence
   report. Do not remove the separate Release action or clear ending.
7. **Animation complexity:** reduce each scenario to authored start/end poses
   and a short tween/montage. Do not change the deterministic outcome matrix.

Never cut the baseline partial pass, prior ambulance pass, tower edge-case
failure, broad-fix ambulance regression, three neutral guardrail choices,
targeted passing policy, persistent attempt evidence, one-action revise path,
full-suite release gate, or desktop/mobile semantic parity. Cutting any of
those changes the concept rather than merely reducing scope.

## Acceptance recommendations

Add or preserve these observable checks during integration and QA:

1. A cold player can state the mission and activate the first meaningful action
   within 10 seconds; the first success resolves by 30 seconds.
2. The baseline visibly records Car PASS and Emergency Lane PASS while Tower is
   UNTESTED, and Release remains locked for incomplete coverage.
3. Staging and running the tower produces a persistent, non-physics Tower FAIL
   with a visible criterion and contact marker.
4. The tutorial contains exactly five guided actions, each with one highlighted
   target, a short reason, and no generic Next click. Hiding/showing the guide
   preserves state and resumes at the current step.
5. `FREEZE NEAR BUILDINGS` changes Tower FAIL -> PASS and Emergency PASS ->
   REGRESSION in scene, text, shape/pattern, and the attempt history.
6. Post-tutorial policy cards are all enabled, neutrally styled, and expose
   scope. None is preselected or visually marked correct.
7. `SLOW WHILE CARRYING` produces a distinct Stranded Car regression;
   `SLOW IN STRIPED ZONES` is the only 3/3 passing candidate.
8. Changing policy marks previous results STALE and immediately relocks
   Release. Only the latest complete suite for that policy can unlock it.
9. A failed suite returns to policy choice through one `REVISE GUARDRAIL`
   action without replaying tutorial, re-placing content, reloading, or losing
   prior attempts.
10. The critical path fits 180 seconds with one wrong policy and retry; a correct
    first choice finishes early and still reaches a clear release/replay state.
11. Release is a deliberate separate action, cannot occur with fail/untested/
    stale evidence, and leaves the final evidence readable throughout the hero
    moment.
12. Mouse, keyboard, touch, and XR controller-ray mappings invoke the same
    intent IDs and game-model transitions. No required action is hover-only,
    drag-only, precision-only, two-handed, or locomotion-dependent.
13. Keyboard-only and touch players can inspect every criterion, choose every
    policy, run, revise, release, review attempts, and restart.
14. Every essential outcome remains understandable with color disabled, audio
    muted, and reduced motion enabled. Screen-reader output identifies the
    changed test and Release lock reason.
15. Hints progress at approximately 5/10/20 seconds, reset on meaningful action,
    never auto-select a policy, never steal focus, and can be requested manually.
16. Skipping animation, losing page/XR focus, or resuming after interruption
    produces exactly one deterministic attempt result and never corrupts the
    release gate.
17. No random outcomes, physics destruction, pathfinding, network call, account,
    or live model response is required for the complete loop.

## Integration assumptions and recommendations

- Final character name and comedy copy can change during narrative integration;
  preserve the functional labels, result vocabulary, and outcome matrix.
- Treat `RUN BASELINE`, `RUN TOWER TEST`, `RUN ALL 3 TESTS`,
  `REVISE GUARDRAIL`, and `RELEASE` as semantic intent labels even if the final
  visual copy is shortened.
- The safest scope floor is three test clips using shared route geometry and
  four authored policy timing/pose profiles. Do not introduce collision physics
  to make the tower or ambulance outcomes emerge dynamically.
- XR controller-ray semantics should be designed now, but runtime/IWER and
  physical-headset validation remain explicitly deferred under the current
  feature constraint.
- The most important graybox review is not visual polish: verify that a viewer
  can identify the prior ambulance PASS, the later REGRESSION, and the reason
  the striped-zone rule is narrower from a single default camera angle.
