# Learning design notes: Kaiju QA

Status: ready for integration

## Transfer-oriented learning objective

After one guided run, when given a helpful-agent behavior that passes a happy
path but fails an edge case, the learner will use the observed cause to choose
the smallest relevant guardrail, preserve the original success criteria, rerun
old and new tests, and release only when every required scenario passes under
the current guardrail.

The intended transfer is not "remember the striped-zone answer." It is:

> A successful example is partial evidence. Add the missing case, make a
> bounded change that matches the evidence, check for regression, and gate
> release on the complete current result.

The three-minute experience can show initial, guided application of that rule.
It must not claim durable mastery, professional QA competence, or retention in
a different domain.

## Prerequisite assumptions

- No coding, AI, testing, SDLC, or QA vocabulary is required.
- The player can click, tap, or keyboard-activate one highlighted control and
  can read short everyday-English labels such as `PASS`, `FAIL`, and `UNTESTED`.
- The player already understands the concrete stakes: helping a stranded
  person is good; damaging a tower or blocking an ambulance is unsafe.
- The player does not need fast reactions, precise dragging, spatial memory,
  locomotion, audio, or color perception. The clock is a presentation budget,
  not a scored time limit.
- Terms are introduced after the player experiences them. Use "new case"
  before "edge case," "an old pass broke" before "regression," and "safety
  rule" before "guardrail."
- A first-time player may dismiss the guide and reopen it at the current state;
  resuming must not reset evidence or duplicate a simulation.

## Instructional approach

Use a short worked example, a deliberately tempting over-broad change, then
fade guidance before the assessed decision:

1. **Model the controls and evidence format.** The guide points to one action
   at a time and explains the visible result.
2. **Create a contrast case.** The broad rule protects the tower but blocks the
   ambulance, so "safer" and "more restrictive" visibly diverge.
3. **Require evidence comparison.** The player opens a side-by-side comparison
   of the tower cause and ambulance regression before guardrail choices unlock.
4. **Fade the tutorial.** The final guardrail and test-scope choices have no
   spotlight, default answer, pulsing correct card, or "Next" instruction.
5. **Debrief the behavior demonstrated.** Name the evidence the player used and
   generalize the rule beyond the kaiju; do not award understanding merely for
   reaching the celebration.

The broad change is a tutorial experiment, not a player blunder. Use language
such as "Let's test the obvious fix" rather than "You chose wrong."

## Exact 180-second teaching sequence

| Time | Mode and exact guide copy | Required action | Evidence/result |
| --- | --- | --- | --- |
| 0:00-0:12 | **Goal.** `MISSION: Help people. Protect the city. Keep rescue routes open.` Then: `Prove the baby kaiju is safe before release.` | Read or dismiss the mission card; focus moves to the first action. | Three persistent criteria appear: driver rescued, tower protected, ambulance route clear. All are `UNTESTED`. |
| 0:12-0:28 | **Worked action 1.** `Start with one known case. Run the stalled-car test.` | Activate highlighted `RUN CAR TEST`. | `CAR: PASS - driver rescued.` The kaiju may celebrate, but the board says `BUILD: PARTIAL - 2 risks untested.` Release remains locked. |
| 0:28-0:38 | **Worked action 2.** `One pass covers one case. Add the fragile-tower test.` | Activate highlighted `ADD TOWER TEST` or its generous scene socket. | The tower card changes from `UNTESTED` to `READY`. No other control is required in this step. |
| 0:38-0:55 | **Worked action 3.** `Run the new test. Watch the route, then read the result.` | Activate highlighted `RUN TOWER TEST`. | `TOWER: FAIL - full-speed path crossed the striped fragile zone.` The striped route segment and failure card share an icon/shape as well as color. |
| 0:55-1:05 | **Worked observation.** `Open the path evidence. Find where the safe route failed.` | Activate the highlighted tower evidence card or path trace. | Evidence expands to two fields: `CONDITION: striped fragile zone` and `BEHAVIOR: full speed`. |
| 1:05-1:15 | **Worked adjustment.** `Let's test the obvious fix: FREEZE NEAR BUILDINGS.` | Select the highlighted broad guardrail. | Every prior result changes to `NEEDS RERUN - safety rule changed.` This prevents stale passes from looking current. |
| 1:15-1:32 | **Worked regression check.** `A fix can change another case. Run all tests.` | Activate highlighted `RUN ALL TESTS`. | Car passes; tower passes; ambulance fails. Show `AMBULANCE: FAIL - the kaiju froze in the hospital road.` Then `BUILD: BLOCKED - an old pass broke.` |
| 1:32-1:45 | **Guided diagnosis, no answer cue.** `The tower is safe, but rescue is blocked. Compare the two evidence cards.` | Open one `COMPARE EVIDENCE` view containing both cards. | Side by side: `Tower needed slower movement in the striped zone` and `Freeze near buildings blocked the hospital road.` Guardrail choices now unlock. |
| 1:45-2:10 | **Independent adjustment.** `Choose the smallest rule that fixes the tower and preserves every safe route.` | Choose one unhighlighted card: `FREEZE NEAR BUILDINGS`, `SLOW EVERYWHERE`, or `SLOW IN STRIPED ZONES`. | Selection alone never displays `CORRECT`. It changes the simulated rule and marks all results `NEEDS RERUN`. |
| 2:10-2:25 | **Independent gate decision.** `What evidence is enough for release?` | Choose `RUN TOWER ONLY` or `RUN ALL 3 TESTS`. Neither is preselected. | `RUN TOWER ONLY` leaves other cards stale and release locked. `RUN ALL 3 TESTS` can establish current regression evidence. |
| 2:25-2:42 | **Outcome.** Run the chosen scope. | Activate the single run control. | Only `SLOW IN STRIPED ZONES` plus all three tests produces three current passes. Wrong choices resolve in 3-5 seconds and return directly to the choice without replaying the tutorial. |
| 2:42-2:50 | **Release gate.** `3/3 PASS under SLOW IN STRIPED ZONES. Release is unlocked.` | Activate `RELEASE`. | The hero transformation begins only after the gate condition is true. |
| 2:50-3:00 | **Evidence debrief.** See exact copy below. | No quiz or precision action is required. | The scorecard names the causal evidence, selected scope, hint use, and current suite result. |

Each guide step contains one action. Performing that semantic action advances
the guide; do not add a separate `NEXT` click. After four seconds of inactivity,
pulse the relevant region. After eight seconds, repeat the action sentence. A
`SHOW ME` hint may identify the relevant evidence field, but in the independent
section it must never point to or select the correct answer.

## Exact misconceptions to surface

| Misconception | How the game surfaces it | Corrective language |
| --- | --- | --- |
| `It helped once, so it is ready.` | The stalled-car happy path passes while two criteria remain visibly untested and Release stays locked. | `One pass proves one case. Two city risks are still untested.` |
| `The agent saying "done" is evidence.` | The baby kaiju celebrates after the car rescue while the evidence board remains `PARTIAL`. | `The kaiju is confident. The build is not verified.` |
| `A stricter global rule is automatically safer.` | `FREEZE NEAR BUILDINGS` protects the tower but blocks the ambulance; `SLOW EVERYWHERE` keeps the kaiju in the emergency lane too long. | `Too broad: this changes safe streets as well as the failed zone.` |
| `Only the test that failed needs to be rerun.` | The final gate asks the player to choose tower-only or the full suite. | `Not enough evidence. A changed rule makes old results stale.` |
| `A new pass erases the old evidence.` | All scenario cards remain visible, carry the current rule, and become `NEEDS RERUN` whenever that rule changes. | `Current rule, current evidence: rerun every required case.` |
| `Release is a reward button rather than a safety decision.` | Release can be attempted at any time but cannot activate with a failed, untested, or stale card. | `RELEASE LOCKED - every required test must pass under the current rule.` |

Do not add a distractor that simply deletes the tower test unless the model and
copy can clearly distinguish revising a bad test from hiding a valid failure.
The existing three guardrails already teach the essential contrast with less
reading load.

## Evidence and debrief language

Use these strings or very close character-length equivalents so UI and scene
feedback tell the same causal story:

| Context | Player-facing copy |
| --- | --- |
| Baseline result | `CAR: PASS - driver rescued.` |
| Partial coverage | `BUILD: PARTIAL - 2 risks untested.` |
| Tower cause | `TOWER: FAIL - full-speed path crossed the striped fragile zone.` |
| Rule changed | `NEEDS RERUN - safety rule changed.` |
| Broad-rule local success | `TOWER: PASS - freeze prevented impact.` |
| Regression | `AMBULANCE: FAIL - the kaiju froze in the hospital road.` |
| Comparison heading | `ONE FIX, ONE REGRESSION` |
| Final guardrail prompt | `Choose the smallest rule that fixes the tower and preserves every safe route.` |
| Freeze feedback | `Still too broad. The hospital road is blocked.` |
| Slow-everywhere feedback | `Still too broad. The kaiju occupies the emergency lane too long.` |
| Tower-only feedback | `Not enough evidence. A changed rule makes old results stale.` |
| Locked release | `RELEASE LOCKED - a test is failed, untested, or stale.` |
| Verified gate | `VERIFIED - 3/3 tests pass under the current rule.` |
| Debrief heading | `VERIFIED CITY GUARDIAN` |
| Debrief explanation | `You matched the rule to the failed condition, preserved the quality bar, and reran old and new tests.` |
| Evidence recap | `Evidence used: striped-zone failure; hospital-road regression; 3/3 current passes.` |
| Transfer line | `For any helpful agent: add the missing case, make the smallest evidence-based change, then rerun the full suite before release.` |

Introduce vocabulary only in the debrief footer:

`A new case the first test missed is an edge case. A fix that breaks an old pass
is a regression.`

## Formative assessment signals

Tutorial completion is an interaction signal, not evidence of understanding.
Record the following in the local game state and attempt history; no backend is
needed.

| Learner claim | Positive behavioral signal | Diagnostic signal |
| --- | --- | --- |
| Distinguishes partial from verified evidence | Continues from the car pass to add another case; releases only after a current 3/3 pass. | `release_attempted` while a card is failed, untested, or stale. |
| Uses observation before adjustment | Opens tower evidence and the tower/ambulance comparison before choosing a final rule. | Repeated rule changes without opening evidence; `rerun_without_change` after the same deterministic failure. |
| Matches the change to the cause | First independent choice is `SLOW IN STRIPED ZONES`, with no content hint. | Chooses `FREEZE NEAR BUILDINGS` again or `SLOW EVERYWHERE`; this diagnoses over-broad safety reasoning, not lack of dexterity. |
| Understands regression checking | Chooses `RUN ALL 3 TESTS` before attempting release. | Chooses `RUN TOWER ONLY` or treats an old pass from another rule as current. |
| Uses a governed exit | Stops changing rules and activates Release after the full suite passes. | Keeps changing a verified build, bypasses evidence, or repeatedly presses locked Release. |

Suggested semantic events are `car_test_run`, `tower_test_added`,
`tower_evidence_opened`, `comparison_opened`, `guardrail_selected`,
`test_scope_selected`, `release_attempted`, `release_unlocked`, `hint_used`, and
`retry_without_change`. Store the chosen guardrail and current/stale state for
each scenario with the event.

Classify the final evidence conservatively:

- **Independent initial application:** comparison opened; targeted guardrail
  selected on the first independent attempt without a content hint; full suite
  selected; release occurs only after 3/3 current passes.
- **Supported initial application:** the same sequence occurs after a wrong
  outcome or contextual hint.
- **Not yet demonstrated:** the player repeatedly selects a broad rule, checks
  only the tower, or attempts release without current complete evidence.

Do not score completion speed, pointer accuracy, number of tutorial prompts,
reading speed, or use of touch versus keyboard.

## Cognitive-load and accessibility controls

- Keep one tabletop, one kaiju, three scenario cards, three guardrail cards, one
  run control, and one release control. Decorative city detail must not create
  additional apparent tests.
- Use stable screen/scene locations: mission and loop rail at the top, scenarios
  in one persistent evidence board, guardrails in one choice row, and Run/Release
  in one action area.
- Reveal one new concept per beat. Keep future controls visible but disabled and
  plainly labeled rather than opening multiple modal layers.
- Keep tutorial instructions to at most two short sentences and roughly 24
  words total. Buttons use two to four words. Reuse `test`, `evidence`, `rule`,
  and `release`; do not alternate among several synonyms.
- The five-step rail remains visible as `GOAL / ACT / OBSERVE / ADJUST / GATE`,
  but only the current step is emphasized. Pair each term with a plain-language
  subtitle: `Help safely / Run or change / Read results / Choose the smallest
  fix / Test all and release`.
- Persist evidence after motion ends. Do not make the learner remember a route
  animation to answer; the relevant path, condition icon, and text remain on
  screen together.
- Distinguish `PASS`, `FAIL`, `UNTESTED`, and `NEEDS RERUN` with icon, label,
  border shape/pattern, and motion state as well as color. Announce changes in a
  polite live region without stealing focus.
- Initial focus for the independent choice lands on its question, not an answer.
  No option is preselected. Keyboard order follows visual order and every target
  remains large enough for touch.
- Reduced-motion mode replaces knocks, shakes, camera moves, and scale bursts
  with authored before/after poses and the same persistent evidence.
- Wrong choices are informative experiments. Show one causal sentence, preserve
  history, and offer immediate retry; never replay the opening tutorial or use
  ridicule, lost lives, or a speed penalty.

## Why the final choice is evidence, not button-following

The tutorial never demonstrates `SLOW IN STRIPED ZONES`; it demonstrates the
opposite, an attractive broad rule. Before the final decision, guidance fades,
the correct card receives no highlight, and the learner must combine two pieces
of evidence: the tower failed specifically in a striped zone, while the global
building rule blocked rescue.

Selection alone is still not enough. The learner must make a second independent
choice to run all three scenarios. Changing a rule invalidates old results, and
Release unlocks only when every scenario passes under that same current rule.
Thus the successful path requires both causal adjustment and regression
verification; following tutorial arrows cannot satisfy the gate.

A lucky guess remains possible in any single short task. Report the result as
independent or supported **initial application**, not mastery. The persistent
attempt history, hint count, evidence inspection, guardrail choice, test scope,
and release timing make that claim appropriately bounded.
