# Kaiju QA video — comedy direction

## Comic premise

The kaiju is the straight character: calm, cooperative, safety-conscious, and
precise. It performs the authorized behavior exactly. The comedy comes from
making an incomplete test suite or over-broad rule spatially literal, then
letting the evidence expose the mismatch.

The player and kaiju are collaborators. Use **we** when assigning responsibility
for a weak requirement: the creature did not misunderstand, and the player is
not foolish. A failed test is an efficient discovery that makes the next
decision safer.

Recommended anchor line:

> The kaiju didn't misunderstand. We did.

Recommended end tag:

> In Kaiju QA, the regression is the real monster.

## Recommended beat map

These timings fit a 75–95 second cut. Treat the VO as optional copy, not a
requirement to use every line. Four clear laughs are stronger than continuous
banter.

| Time | Cause and teaching point | Warm visual gag | Optional VO | Clarity requirement |
| --- | --- | --- | --- | --- |
| 0:00–0:07 | The helpful carry path crosses the fragile tower's clearance envelope. | The clearly artificial tower tilts on a safety hinge and stops against a tether. The kaiju calmly checks the marked clearance line instead of reacting theatrically. | “The kaiju followed the instruction perfectly. The instruction was the problem.” | Show the path/tower intersection before or with the tilt. Hold the red **CLEARANCE FAIL** label for at least 1.2 seconds. No crash cut or mystery about the cause. |
| 0:07–0:13 | Failure becomes retained evidence. | The kaiju makes one small, professional “noted” nod and points to the red trace on its clipboard. The test tower resets in the background like stage scenery. | “Good failure. Now we know exactly where the rule breaks.” / “The kaiju didn't misunderstand. We did.” | Keep the trace visible. Do not use an “oops,” sad face, scolding reaction, or laugh track. |
| 0:14–0:25 | The original stalled-car case is only a happy path. | The kaiju lifts the tiny car with exaggerated care and centers it exactly inside a painted parking outline. One neat green check appears; several scenario sockets remain visibly empty. | “A very large helper. A very small sample size.” / “One green check proves a path, not the whole city.” | Empty scenario sockets must remain readable so the joke reinforces incomplete coverage. |
| 0:26–0:38 | Adding the tower reveals the edge case without changing the kaiju's behavior. | A ghost of the successful car path overlays the new tower run. The kaiju follows the same footprints with surveyor-like precision; the tethered tower tilts at the exact intersection. | “Same behavior. New edge case. Much better evidence.” | Label the two runs **SAME BEHAVIOR** and **NEW SCENARIO**. The repeatability is the point. |
| 0:39–0:54 | “Freeze near buildings” fixes the tower but blocks the ambulance. | Every building emits the same visible proximity ring. The kaiju stops with one foot perfectly aligned to the ring, politely raises a “rule says stop” palm, and waits. Behind it, the empty test ambulance's turn signal ticks once. | “The tower passes. The ambulance doesn't. That's a regression—delivered exactly to spec.” / “Good news: the kaiju obeyed. Bad news: so did the traffic.” | Show the rule card, the citywide rings, and the ambulance route intersecting a ring before the punch line lands. No siren, collision, patient, or emergency distress. |
| 0:55–1:08 | The player replaces the citywide freeze rule with one targeted slow zone. | The broad rings collapse into one striped boundary around the fragile tower. Inside it, the kaiju takes one conspicuously measured slow step; immediately outside it, the normal precise stride resumes. | “We don't teach the kaiju a lesson. We make the rule precise.” / “The helper was fine. We narrowed the guardrail.” | Preserve both acceptance criteria onscreen: **TOWER CLEAR** and **AMBULANCE OPEN**. The gag must not cover either label. |
| 1:09–1:20 | The full regression suite passes. | Three scenario cards run in quick succession. The kaiju checks each result on a comically small clipboard, but waits for the final check before reaching for the stamp. | “Tiny change. Full rerun.” / “The biggest creature in the room still waits for every check.” | Use shape plus text, not green alone. Let the final all-pass state breathe for at least one second. |
| 1:21–1:30 | Release is earned by evidence, not optimism. | A large careful claw applies a nail-sized **RELEASE** seal exactly in the center of the card, inspects it for half a beat, then gives a restrained satisfied nod. | “Then—and only then—it earns the tiniest stamp in QA.” / “Small stamp. Earned confidence.” | End the joke before the title/CTA. The final title carries the serious promise: **The regression is the real monster.** |

If the final edit needs a Codex/process beat, let the release stamp begin to
descend while one checklist item is still empty; it pauses without touching the
card, the evidence file receives its final check, and only then does the stamp
land. This is a two-second visual button, not a claim that the tool made the
release decision.

## Preferred VO fragments

Use only the lines that leave room for the technical explanation. The strongest
set is:

1. “The kaiju followed the instruction perfectly. The instruction was the problem.”
2. “A very large helper. A very small sample size.”
3. “The tower passes. The ambulance doesn't. That's a regression.”
4. “We don't teach the kaiju a lesson. We make the rule precise.”
5. “Tiny change. Full rerun. Earned confidence.”
6. “In Kaiju QA, the regression is the real monster.”

Useful alternates for a shorter or less comic read:

- “Perfect compliance. Incomplete coverage.”
- “Same behavior. New evidence.”
- “The helper was precise; the guardrail wasn't.”
- “One fix is not a release. The full suite decides.”
- “Failure isn't the punishment. It's the clue.”

Avoid sarcastic “congratulations,” “whoops,” “bad kaiju,” “user error,” or any
line that makes a judge spend time decoding whether the creature, player, or
rule caused the result.

## Visual and editing rules

- Show cause first, then deliver the joke. The viewer should see the relevant
  path, boundary, or criterion 6–12 frames before the comic reaction or VO tag.
- Keep each comic reaction under roughly 1.5 seconds. The evidence receives the
  longer hold.
- Use one recurring behavior—calmly checking the rule card or clipboard—to make
  the kaiju's precision unmistakable across all runs.
- Make the tabletop a visibly safe test environment: hinged or holographic
  fixtures, safety tethers, reset marks, and no population.
- Prefer quiet, tactile sounds: soft fixture click, single turn-signal tick,
  pencil check, boundary chime, and satisfying stamp thunk. Avoid explosions,
  screams, impact booms, alarms, or urgent sirens.
- Burn the technical terms into captions: **happy path**, **edge case**,
  **regression**, **targeted slow zone**, and **full regression pass**. Never
  replace a required term with a punch line.
- Keep the concept-visualization disclosure legible. Humor must not imply that
  mock scenes are captured gameplay.

## Safety and tone guardrails

- Never punish, scold, restrain, frighten, or embarrass the kaiju. It is a
  trusted teammate following the current contract.
- Do not infantilize it: no baby talk, pacifier, tantrum, clumsy slapstick,
  oversized diaper, or “cute because incompetent” behavior. If other materials
  call it a baby kaiju, VO should simply say **kaiju** or **city helper**.
- Do not humiliate the player. The narrator owns the gap collectively with
  “we,” and praises the act of adding coverage.
- No destruction spectacle. The tower is a reusable test fixture that tilts or
  folds safely; it never shatters, crushes anything, or suggests casualties.
- The ambulance is an unoccupied scenario prop. Its blocked route demonstrates
  a criterion failure without a crash, patient, panic, or delayed-rescue joke.
- No Godzilla references, franchise imitation, faux Japanese accent, cultural
  caricature, or geographic city stereotype. “Kaiju” describes the creature;
  culture is never the punch line.
- Humor must work muted and without color perception. Pair every state with
  text, shape, motion, and a persistent evidence trace.
- Keep the narrator warm and observational, never smug. The emotional movement
  is curiosity → recognition → confidence, not chaos → ridicule → rescue.

## Source basis

- `AGENTS.md`
- `plans/devpost-kaiju-qa-video/PLAN.md`
- `plans/devpost-kaiju-qa-video/AGENT_ASSIGNMENTS.md`
- Read-only concept source:
  `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/PROPOSALS.md`
  (Kaiju QA section)
- Read-only submission source:
  `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/DEVPOST_SUBMISSION_DRAFT.md`
  (project description, learning evidence, challenges, and demo storyboard)

## Completion summary

Delivered an eight-beat comedy map for a 75–95 second narrated video, optional
VO lines and alternates, cause-first timing guidance, accessible visual/SFX
gags, and explicit safety/tone rules. The recommendations keep the kaiju
competent and cooperative, make the requirement/test suite the comic target,
and turn both the fragile-tower failure and ambulance regression into readable,
useful evidence.
