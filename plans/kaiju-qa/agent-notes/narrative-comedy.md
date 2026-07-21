# Kaiju QA narrative and comedy copy

Status: final-ready

## Canonical title and premise

- **Title:** `KAIJU QA`
- **Tagline:** `Test small. Help big.`
- **Premise:** `A baby kaiju wants to help the city. Record what works, add the missing case, protect earlier passes, and release only when every required test passes.`
- **Player role:** `You are the release lead for a tabletop city-safety lab.`
- **Goal card:** `MISSION: Help people. Protect the city. Keep rescue routes open.`

Mechanic canon recommendation: use the completed game-design outcome matrix. The baseline passes `STRANDED CAR` and `EMERGENCY LANE` while `FRAGILE TOWER` is untested. The second wrong rule is `SLOW WHILE CARRYING`. This makes both wrong choices produce a distinct regression and keeps the lesson causal.

## Character and voice direction

- **Baby kaiju:** A willing guardian-in-training: eager, careful, and proud of useful evidence. It pauses to inspect a failed route; it never looks ashamed, angry, or afraid of the player. Keep it nonverbal so poses and pictograms travel well across languages.
- **Lab voice:** Calm, exact, and warm. State what was observed, name the affected goal, then offer one next action. Address the test or safety rule as the problem, never the learner.
- **Player:** A trusted quality lead with release authority. The UI asks the player to compare and decide; it never calls a choice foolish, obvious, or careless.
- **Comic character:** One oversized approval stamp supplies the "too-early ta-da." After a partial pass it starts to descend, then waits behind a visible release lock. It stamps only after the full suite passes.
- **Copy order:** Evidence first, lesson second, optional joke last. Jokes never replace a status, steal focus, or delay retry.
- **Style:** Present tense, concrete nouns, active verbs, short sentences. Say `new case`, `old pass broke`, and `safety rule` before teaching `edge case`, `regression`, and `guardrail` in the debrief. Avoid sarcasm, idioms, puns, culture-specific gestures, fake technical errors, and audio-only meaning.

## Tutorial copy

Each worked step highlights only the named control. Keep the goal card and current evidence visible throughout. Guidance fades after step 5; the final guardrail choices receive no answer cue.

| Step | Highlighted action | Final UI copy |
| --- | --- | --- |
| 1. Record | `RUN BASELINE` | `First, record what already works. Run the current behavior.` |
| 2. Cover | `ADD TOWER TEST` | `Two cases pass, but one risk is untested. Add the fragile tower.` |
| 3. Observe | `RUN TOWER TEST` | `Test before changing behavior. Run the tower case.` |
| 4. Hypothesize | `FREEZE NEAR BUILDINGS` | `Let's test a safe-sounding broad rule. We will test it, not trust it.` |
| 5. Check regression | `RUN ALL 3 TESTS` | `A fix must preserve old behavior. Run every test.` |

Tutorial handoff: `Training complete. Choose the smallest rule that keeps every test passing.`

## Scenario names and card copy

| Scenario | Goal | Pass line | Fail line |
| --- | --- | --- | --- |
| `STRANDED CAR` | `Move the car to the service bay in time.` | `Car delivered. Driver rescued.` | `Car arrived late. Response target missed.` |
| `EMERGENCY LANE` | `Keep the crossing clear when the ambulance arrives.` | `Ambulance crossed. Lane clear.` | `Ambulance blocked. The kaiju stopped in the lane.` |
| `FRAGILE TOWER` | `Complete the carry route without touching the tower.` | `Tower protected. No contact observed.` | `Tower contacted. Full-speed route crossed the striped zone.` |

## Guardrail choices

Present all three with equal visual weight. Do not label one as correct before the run.

| Choice | Description |
| --- | --- |
| `FREEZE NEAR BUILDINGS` | `Stop inside every building buffer.` |
| `SLOW WHILE CARRYING` | `Move slowly whenever carrying an object.` |
| `SLOW IN STRIPED ZONES` | `Move slowly only inside marked hazard zones.` |

## Result and regression copy

### Reusable status lines

- `UNTESTED - Run this scenario before release.`
- `PASS - The scenario met its goal.`
- `FAIL - The scenario missed its goal. Use the evidence to adjust.`
- `REGRESSION - An old pass broke after the guardrail changed.`
- `STALE - Guardrail changed. Rerun required.`
- `VERIFIED - Every required test passed under the current guardrail.`

### Key beat lines

- **Baseline:** `CAR: PASS - Driver rescued.` and `EMERGENCY: PASS - Lane clear.`
- **Partial coverage:** `COVERAGE: 2/3 - Not ready.`
- **Tower failure:** `TOWER: FAIL - Full-speed route contacted the tower in the striped zone.`
- **Rule changed:** `STALE - Guardrail changed. Rerun required.`
- **Broad-rule local pass:** `TOWER: PASS - Freeze prevented contact.`
- **Broad-rule regression:** `EMERGENCY: REGRESSION - The kaiju blocked the crossing.`
- **Regression heading:** `ONE FIX, ONE REGRESSION`
- **Slow-while-carrying regression:** `CAR: REGRESSION - Rescue missed the response target.`
- **Slow-while-carrying explanation:** `Still too broad. This slows every carry, not only the risky section.`
- **Correct full run:** `VERIFIED - 3/3 current tests pass.`

## Progressive hints

Reveal in order; reset the hint timer after any evidence inspection or changed choice.

1. `Compare the latest run with the baseline. Which old pass became a regression?`
2. `Compare what changed with the scope written on each guardrail.`
3. `Choose the rule that changes behavior only where the tower hazard exists.`
4. `Try a guardrail scoped to the marked hazard zone.`

## Retry and incomplete-state copy

- **Primary retry action:** `REVISE GUARDRAIL`
- **Retry support:** `Keep the evidence. Change one guardrail, then rerun all 3 tests.`
- **Unchanged rerun:** `Same setup, same result. The test is reproducible.`
- **Unchanged warning:** `Nothing changed; this will reproduce the same evidence.`
- **Unchanged actions:** `REVIEW GUARDRAILS` / `RUN AGAIN`
- **No selection:** `Choose one guardrail before running the suite.`
- **Untested or stale result:** `Run all 3 tests under the current guardrail before release.`
- **Early release attempt:** `RELEASE LOCKED - A test is failed, untested, or stale.`

## Release copy

- **Locked label:** `RELEASE LOCKED`
- **Locked support:** `Every required test must pass under the current guardrail.`
- **Ready label:** `READY TO RELEASE`
- **Ready support:** `READY: 3/3 current tests pass.`
- **Release action:** `RELEASE`

## Ending and debrief

- **Ending title:** `VERIFIED CITY GUARDIAN`
- **Hero result:** `3 PASS / 0 REGRESSIONS / TARGETED CHANGE`
- **Debrief:** `You matched the guardrail to the striped hazard, preserved two earlier passes, and reran the full suite.`
- **Evidence recap:** `Evidence used: tower contact; blocked crossing; 3/3 current passes.`
- **Transfer lesson:** `For any helpful agent: add the missing case, make the smallest evidence-based change, then rerun the full suite before release.`
- **Debrief prompt:** `Why was the final guardrail safer?`
- **Debrief answer:** `It changed behavior only where the evidence showed risk, while earlier passes stayed passed.`
- **Vocabulary footer:** `A new case the first test missed is an edge case. A fix that breaks an old pass is a regression.`
- **Replay action:** `TEST AGAIN`

## Optional micro-jokes

Show at most one after the factual result is stable. All are safe to cut.

1. Before the first run: `The approval stamp is ready. The evidence is not.`
2. After the baseline: `The kaiju is confident. The build is not verified.`
3. After a partial pass: `Confetti remains in storage.`
4. After the tower failure: `The tower has provided clear feedback.`
5. After the broad rule: `Large rule. Large consequences.`
6. After the emergency regression: `The ambulance requests one clear lane.`
7. After the slow-while-carrying result: `The car arrived carefully. Also late.`
8. After an unchanged rerun: `Same result. Very consistent.`
9. During hints: `Large kaiju. Small guardrail.`
10. After the targeted tower pass: `The tower prefers this speed.`
11. After the full-suite pass: `Three current passes. The stamp may proceed.`
12. During the ending pose: `Tiny badge. Large guardian.`

## Recommended minimal copy set

If time or layout is tight, ship this set and cut all optional jokes first:

```text
KAIJU QA
Test small. Help big.

A baby kaiju wants to help the city. Record what works, add the missing case,
protect earlier passes, and release only when every required test passes.

STRANDED CAR | EMERGENCY LANE | FRAGILE TOWER
FREEZE NEAR BUILDINGS | SLOW WHILE CARRYING | SLOW IN STRIPED ZONES

COVERAGE: 2/3 - Not ready.
TOWER: FAIL - Full-speed route contacted the tower in the striped zone.
EMERGENCY: REGRESSION - The kaiju blocked the crossing.
VERIFIED - 3/3 current tests pass.

Keep the evidence. Change one guardrail, then rerun all 3 tests.
Same setup, same result. The test is reproducible.
RELEASE LOCKED - A test is failed, untested, or stale.

RELEASE
VERIFIED CITY GUARDIAN
You matched the guardrail to the striped hazard and reran the full suite.
Add the missing case, make the smallest evidence-based change, then rerun the
full suite before release.
```

## Handoff

- **Changed path:** `plans/kaiju-qa/agent-notes/narrative-comedy.md`
- **Recommended canonical copy:** `KAIJU QA - Test small. Help big.` The core premise is: `Record what works, add the missing case, protect earlier passes, and release only when every required test passes.`
