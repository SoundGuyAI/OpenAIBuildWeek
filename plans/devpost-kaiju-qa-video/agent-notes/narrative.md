# Narrative and creative direction: Kaiju QA Devpost video

## Creative north star

Tell one tiny rescue story that secretly teaches a professional habit.

The audience should first care about whether the eager baby kaiju can help the
city, then realize that the player's real job is to make its help trustworthy.
Do not open with a definition of Loop Engineering. Let the car, tower, and
ambulance demonstrate the loop; name the practice only after the regression has
made the need for it emotionally obvious.

**Judge-retell sentence:** A baby kaiju rescues a stalled car, knocks over a
fragile tower, gets an over-broad safety rule that blocks an ambulance, then
passes every test after the player replaces that rule with a targeted slow zone.

**Thesis:** The kaiju is not the monster. The regression is.

**Emotional movement:** curiosity -> delight -> useful surprise -> false relief
-> alarm -> insight -> earned confidence.

## Story spine and timing

Target 86-92 seconds. The cold open is a brief flash-forward; after the title,
the story restarts in causal order so the judge can reconstruct it easily.

| Time | Story function | Picture and action | VO purpose | On-screen message |
| --- | --- | --- | --- | --- |
| 0:00-0:06 | Cold open / useful failure | Helmeted baby kaiju proudly lifts a car, turns, and gently topples a clearly toy-like fragile tower. Freeze on its apologetic look; no injury or realistic destruction. | Ask the learner problem in plain language: fast help is not yet safe help. | `A PASS IS NOT PROOF` followed by title `LOOP ENGINEER: KAIJU QA` |
| 0:06-0:12 | Promise | Pull back to reveal the miniature district as a test bench. Three empty scenario sockets become visible: car, tower, ambulance. | Promise the game fantasy: test the tiny monster before it meets the real city. | `STAGE TESTS. CATCH REGRESSIONS. SHIP SAFELY.` |
| 0:12-0:24 | 1. Happy path | Run the stalled-car scenario. The kaiju lifts the car, clears the road, and celebrates. The first path trace appears. | Give the audience a clean win, then qualify it: this proves one case, not readiness. | Large verdict `CAR: PASS`; smaller qualifier `1 OF 3 SCENARIOS` / `PARTIAL PASS` |
| 0:24-0:34 | 2. Edge case | Snap the fragile tower into a scenario socket. Repeat the same behavior; the carried car clips the tower and it folds like a foam model. Preserve the first green path beside the new failed path. | Make failure feel informative rather than punitive: the new test exposed what the happy path could not. | `NEW EDGE CASE`; then `TOWER: FAIL` |
| 0:34-0:44 | 3. Over-broad fix | Apply the tempting rule `FREEZE NEAR BUILDINGS`. Re-run the tower. The kaiju stops well short and the tower remains standing. Give a one-second false victory beat. | Let the audience briefly want to ship, then interrupt that impulse. | `TOWER: PASS`; release control starts to illuminate, then changes to `REGRESSION CHECK REQUIRED` |
| 0:44-0:56 | 4. Ambulance regression | Add the ambulance scenario. Its light flashes and it needs the kaiju to clear the route, but the broad freeze rule locks the kaiju in place. No crash, patient, or injury is shown; urgency comes from motion, clock, and a short impatient honk. | Deliver the memorable reversal: the safety fix protected one test by breaking another. Name the thesis here. | `AMBULANCE: BLOCKED`; then `REGRESSION FOUND` |
| 0:56-1:10 | 5. Targeted correction | Overlay the car, tower, and ambulance paths. The broad freeze region visibly covers too much of the district. Shrink it into a local slow-zone boundary around only the fragile tower. | Explain Loop Engineering through verbs, not a lecture: compare evidence, preserve both criteria, make the smallest safe change. | Progressive chips: `OBSERVE` -> `COMPARE` -> `TARGET`; final rule `SLOW ZONE: TOWER BLOCK ONLY` |
| 1:10-1:22 | 6. Full regression pass and release | Rapid but readable three-test replay: car rescued, tower standing, ambulance moving. All three evidence cards lock into place. The baby kaiju applies an absurdly tiny approval seal with great seriousness. | Make release feel earned by accumulated evidence, not granted by score or optimism. | `3 OF 3 PASS`; then `RELEASE EARNED` |
| 1:22-1:30 | Impact close | Hero view: tabletop test city transitions toward a hopeful real-city silhouette while the three passed scenarios remain visible. End card and truthful disclosure appear. | Name the practice once, connect it to AI-assisted development judgment, and invite replay/classroom use. Mention Codex only if matching process evidence is on screen. | `GOAL -> CHANGE -> EVIDENCE -> ADJUST -> RELEASE`; title/tagline; `Concept visualization` |

## Recommended English voice-over

Read warmly and confidently with a dry smile, approximately 145-155 words per
minute. Leave breathing room for the tower fold, ambulance honk, and approval
stamp. The performance should admire the kaiju and gently question the team's
assumptions; never make the creature the butt of the joke.

> This tiny kaiju has one very big instruction: help everyone. But fast help is
> not always safe help.
>
> Welcome to Kaiju QA, where you test the tiny monster before it meets the real
> city.
>
> First run: a stalled car. Lift, carry, road clear. Pass! Well... partial pass.
> One happy path is not proof.
>
> So we add an edge case: a fragile tower. Same helpful kaiju. Same behavior.
> Very different result. That failure is useful evidence.
>
> The obvious fix is to freeze near buildings. Tower saved. Ship it?
>
> Not yet. Our next test is an ambulance, and the new safety rule has frozen the
> rescue. The kaiju is not the monster. The regression is.
>
> Now we compare every path. We keep the car rescue, protect the tower, and
> replace the city-wide freeze with one targeted slow zone.
>
> Run the full suite: car rescued, tower standing, ambulance moving. Three tests.
> Three passes. Now the release stamp means something.
>
> That is Loop Engineering: set a goal, make a bounded change, observe evidence,
> and adjust without losing what already worked. Kaiju QA turns AI-era release
> judgment into a game you can see, practice, and remember.

This draft is about 190 spoken words. At the recommended pace plus planned
reaction pauses, it should land near 82-88 seconds. If process proof must appear
in the same cut, shorten the final two sentences and reserve 6-8 seconds for:

> Our Codex workflow follows the same loop: explicit goals, scoped changes,
> tests, evidence, and independent review.

Use that optional line only when the corresponding repository artifacts are
shown and the statement is accurate for the final submission.

## On-screen message hierarchy

The visual evidence should do most of the teaching. Captions transcribe the VO;
they are not a second presentation layer.

1. **Immediate consequence:** the moving scene must answer “what just happened?”
   before any text does. Car moves, tower folds, ambulance stops, then the label
   confirms it.
2. **Run verdict:** one dominant status at a time: `PARTIAL PASS`, `TOWER: FAIL`,
   `REGRESSION FOUND`, or `RELEASE EARNED`. Pair color with an icon and word so
   meaning never depends on red/green alone.
3. **Accumulated coverage:** keep a compact three-row card for Car, Tower, and
   Ambulance. Never erase prior results; the growing record is the lesson.
4. **Current decision:** show only the rule or boundary the player is changing.
   Contrast `FREEZE NEAR BUILDINGS` with `SLOW ZONE: TOWER BLOCK ONLY` spatially,
   not through a paragraph.
5. **Loop vocabulary:** reveal one short chip when the action embodies it:
   `GOAL`, `CHANGE`, `OBSERVE`, `ADJUST`, `RELEASE`. Do not display the full loop
   diagram until the closing synthesis.
6. **Captions and disclosure:** burned-in captions sit in a consistent safe-area
   band. `Concept visualization` must be readable at the opening or remain as a
   discreet persistent label; repeat it on the end card.

Limit non-caption text to roughly seven words per message. Avoid placing a
headline, verdict, rule name, loop chip, and subtitle in the same visual zone.
When the ambulance regression lands, clear everything except the scene,
`AMBULANCE: BLOCKED`, and the caption carrying “The regression is.”

## Retellability devices

- **Three nouns:** Car, Tower, Ambulance. Introduce and test them in that order.
- **Three evidence rows:** each scenario retains its last result across every
  run; the audience can see the suite grow from one to three.
- **One repeated question:** use “Ship it?” after the happy path or false fix,
  then answer “Not yet” until the complete suite passes.
- **One memorable line:** “The kaiju is not the monster. The regression is.” Use
  it once, at the ambulance reveal, and let the image carry the callback later.
- **One transformation:** the broad city-wide freeze field visibly shrinks into
  the targeted tower slow zone. This is the clearest image of bounded change.
- **One earned ritual:** the tiny release stamp is funny because the evidence
  panel is now complete. Do not use it as a generic victory animation earlier.

## Tone and comedy guardrails

- The baby kaiju is eager, competent within its instruction, and emotionally
  legible. The system failed to specify and test enough; the creature did not
  behave maliciously.
- Make the tower a reversible toy/foam object. Failure should produce an “oh!”
  and a laugh, not disaster imagery.
- The ambulance beat needs urgency without distress. Use a blocked route,
  blinking icon, timer, or dry honk; do not imply a patient was harmed.
- The false-success beat should last long enough for the audience to accept the
  bad fix. The regression is funnier and more educational when viewers briefly
  share the mistaken confidence.
- Avoid developer jargon in VO: no “overfitting,” “acceptance-criteria matrix,”
  or “state-machine transition.” Those ideas remain visible in the action.
- Avoid portraying repeated prompting as foolish. The contrast is constructive:
  generation creates possibilities; evidence earns decisions.

## Educational payload without a lecture

Each beat teaches exactly one idea:

| Beat | What the viewer should infer |
| --- | --- |
| Happy path | A successful example is not full coverage. |
| Edge case | Add a test that can reveal a hidden risk before changing behavior. |
| Over-broad fix | A fix can satisfy the visible case while changing too much. |
| Ambulance regression | Re-run other important scenarios before release. |
| Targeted slow zone | Preserve what worked and change only the causal boundary. |
| Release | Shipping is a decision supported by the whole evidence set. |

Only after those inferences are visible should the final VO name Loop
Engineering. The closing loop graphic is a recap of what the viewer just saw,
not prerequisite theory.

## Handoff recommendations

- Film direction should preserve causal continuity: each new prop enters the
  same tabletop, and old path evidence stays visible. Do not cut to unrelated
  abstract diagrams during the regression.
- Art direction should make the car, fragile tower, ambulance, broad freeze
  field, and targeted slow zone readable as silhouettes at phone size.
- Comedy should concentrate on the kaiju's proud reactions, the dry ambulance
  honk, and the tiny release stamp; no extra gag may obscure a verdict.
- Marketing copy should use the promise “Test the tiny monster before it meets
  the real city” and reserve “The regression is the real monster” for the story
  payoff rather than the opening title.
- Audio should punctuate evidence changes, then get out of the way. Silence for
  half a beat before `REGRESSION FOUND` will make the reversal land.
- The final edit should remain truthful: if the visuals are authored concept
  scenes rather than captured gameplay, label them as concept visualization and
  avoid control/input claims that are not demonstrated.

## Source basis

- `AGENTS.md` in the assigned video worktree.
- `plans/devpost-kaiju-qa-video/PLAN.md` in the assigned video worktree.
- Read-only concept source
  `docs/design/loop-engineer-concepts/PROPOSALS.md`, especially the Kaiju QA
  pitch, 180-second loop, cross-platform contract, and Devpost-strength notes.
- Read-only concept source
  `docs/design/loop-engineer-concepts/DEVPOST_SUBMISSION_DRAFT.md`, especially
  the learner problem, submission positioning, impact limits, and demo-video
  requirements.
- Read-only concept source
  `docs/design/loop-engineer-concepts/index.html`, Kaiju QA presentation section.

## Completion summary

Delivered a 90-second judge-retellable story architecture, a production-ready
English VO draft, an on-screen information hierarchy, emotional/comedy
guardrails, and role-specific handoff guidance. The recommended story preserves
the locked sequence—happy path, edge case, over-broad fix, ambulance regression,
targeted slow-zone correction, full-suite release—while teaching Loop
Engineering through visible cause and effect rather than exposition.
