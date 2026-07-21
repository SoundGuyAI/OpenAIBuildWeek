# Film direction — Kaiju QA Devpost concept video

Role: film director  
Format: 1920 × 1080, 16:9, 30 fps  
Target duration: **88 seconds**  
Editorial premise: **The regression is the real monster.**

## Directing thesis

Open on a funny, useful failure before explaining anything: a helmeted baby
kaiju completes the obvious task, then gently topples the fragile test tower.
The film should immediately reframe the incident as evidence, not punishment.
From there, every camera and edit choice must make comparison easy: repeat the
same tabletop angle for each test, retain prior paths, and reserve new angles
for a new kind of reasoning rather than for spectacle.

The emotional arc is **surprise → curiosity → false confidence → recognition →
earned confidence**. The kaiju is a cooperative tester and future guardian, not
a rampaging threat or an incompetent punchline. Scale contrast supplies the
comedy; precise evidence supplies the credibility.

## Camera grammar

- **Master comparison view:** elevated 35-degree three-quarter tabletop view,
  approximately a 50 mm full-frame-equivalent lens. Keep the kaiju center-left,
  the road and scenario props across the center, and the evidence/criteria rail
  on the right. Reuse this exact camera for happy path, tower failure, broad
  fix, and final regression pass so a judge can compare states instantly.
- **Evidence view:** near-orthographic 75–90-degree overhead. Use only for prop
  placement, retained-path comparison, and narrowing the guardrail. This is the
  analytical camera.
- **Consequence view:** stable road-level medium shot, approximately 65 mm, used
  once for the blocked ambulance. A single departure from the master view gives
  the regression weight without turning the film into action coverage.
- **Comedy/closure view:** 85–100 mm macro close-up for the absurdly tiny
  approval seal in the kaiju's large claw. Keep the seal, one eye, and the
  intact city readable in the same composition.
- Maintain left-to-right progress toward release. Do not reverse screen
  direction between reruns. Avoid handheld motion, first-person simulation,
  fast orbiting, crash zooms, or forced-camera XR language.
- Camera moves are limited to slow 3–6% push-ins. The authored state change—not
  camera movement—must carry each reveal.

## Visual hierarchy and frame rules

1. **Primary:** the kaiju's current action or the active scenario prop.
2. **Secondary:** the resulting path plus one criteria state.
3. **Tertiary:** narration captions, disclosure, and short editorial labels.

Use no more than one dominant action and one evidence change per shot. Keep the
lower 16% of frame clear for burned-in captions, the upper-left safe area for
the truthfulness badge, and the upper-right for title/value copy. Generated art
should contain no text; all labels belong in controlled HTML/SVG overlays.

Evidence must remain understandable without color:

- untested = dotted path plus hollow circle;
- pass = continuous rounded path plus check-shaped endpoint;
- fail/regression = broken zigzag path plus triangular endpoint;
- broad guardrail = large translucent amber blanket shape;
- targeted slow zone = narrow cyan double-rail boundary around the tower only.

Use the existing concept palette as a continuity base: mint/cyan evidence,
safety yellow helmet and controls, coral failure accents, teal buildings, and a
dark neutral laboratory background. Never rely on red/green alone.

## Truthfulness disclosure

- At **00:00**, show a high-contrast badge reading
  **“CONCEPT VISUALIZATION · NOT GAMEPLAY CAPTURE”** in the upper-left. Keep the
  full wording through 00:09.
- From 00:09 through every synthetic game-style shot, retain the shorter badge
  **“CONCEPT VISUALIZATION”** in the same position. The final hero frame also
  carries it.
- Shot 12 may be labeled **“ACTUAL PROJECT ARTIFACTS”** only when it uses real
  repository capture. Do not fabricate test dashboards, passed checks, gameplay
  UI, or Codex evidence.
- If verified gameplay later replaces an individual shot, remove the concept
  badge only from that verified capture; do not remove it globally.

## 88-second shot plan

| # | Time | Dur. | Picture, framing, and action | Voice-over purpose | Graphics / transition |
| --- | --- | ---: | --- | --- | --- |
| 1 | 00:00–00:04 | 4s | **Cold open, master-to-medium.** Begin mid-action: the helmeted baby kaiju carefully carries a stalled car to safety. Its shoulder or tail lightly catches the fragile block tower; the blocks tumble inside the obvious tabletop test bed. The kaiju looks to the evidence rail, curious rather than ashamed. | State the learner problem immediately: AI-assisted change is fast; proving it did not break something else is hard. | Full concept disclosure appears on frame one. Let one block fall toward lens, then hold 6–8 frames on impact. Dry toy-block clatter; no roar or disaster alarm. |
| 2 | 00:04–00:09 | 5s | A falling square block lands flat and becomes the title tile while the test district resets behind it. Reveal the intact tabletop and the cooperative kaiju in one clean wide. | Name the promise by second nine: this concept visualization makes quality engineering the game. | Match cut block → title tile. Title: **LOOP ENGINEER: KAIJU QA**. Subline: **The regression is the real monster.** Full disclosure remains. |
| 3 | 00:09–00:15 | 6s | **Master comparison view.** Three observable criteria resolve on the right as icon/label pairs: help the stalled car, protect the fragile tower, keep the ambulance route clear. Only the car test is staged; the other two sockets are visibly empty. | Introduce the loop: define success, stage a test, run it, read the evidence. | Short labels may appear one at a time. Disclosure shortens to **CONCEPT VISUALIZATION**. Use a restrained criteria-rail build, not a dense HUD. |
| 4 | 00:15–00:21 | 6s | Same master. The kaiju carries the car; a continuous path draws behind it and the car criterion passes. A comically oversized approval stamp begins descending, but an interlock stops it above the release tile because coverage is incomplete. | Explain that a happy path is useful evidence, not production readiness. | Exact spatial continuity from shot 3. Soft path pulse; interlock click. Do not cut away before the stopped stamp is understood. |
| 5 | 00:21–00:27 | 6s | **Overhead evidence view.** A pointer/hand places the fragile block tower into a generous test socket. Its criterion changes from hollow to armed. The retained car path stays visible at low opacity. | Make the player verb concrete: add an edge case before changing behavior. | Match the tower's screen position to its position in the master. A socket ripple replaces any generic “whoosh.” |
| 6 | 00:27–00:34 | 7s | Return to the **identical master angle**. The kaiju repeats the helpful route, carries the car, and gently nudges the tower. Blocks fall; the path endpoint becomes a broken zigzag/triangle while the earlier car pass remains visible. | Land the central insight: same behavior, broader test, new evidence. | State-match cut from the prior successful run. Hold at least 1.2 seconds on the simultaneous car pass + tower fail before moving on. |
| 7 | 00:34–00:41 | 7s | **Overhead into master.** A broad amber “freeze near buildings” guardrail blooms across most of the district. On rerun, the kaiju stops early and the tower remains upright. The oversized approval stamp descends farther, tempting a premature celebration. | Show the plausible bad fix: it satisfies the new test by overreaching. | Use the amber boundary itself as a wipe into the rerun. At the final second, J-cut a small ambulance chirp before the vehicle appears. |
| 8 | 00:41–00:48 | 7s | **Road-level consequence view.** The ambulance enters with a clear right-of-way pulse, then stops at the over-broad zone. Cut or rack focus to the criteria rail: tower passes; ambulance route breaks. | Say the word **regression** plainly. The fix protected one criterion and violated another. | No crash, panic, or siren barrage. Use a restrained stop, broken-lane shape, and one factual regression marker. End on a two-state split: tower standing / ambulance blocked. |
| 9 | 00:48–00:55 | 7s | **Overhead evidence view.** Show the car, tower, and ambulance paths together. The broad amber blanket contracts into a narrow cyan slow-zone boundary hugging only the fragile tower corner; unaffected roadway becomes visibly clear. | Explain diagnosis: compare evidence, preserve both criteria, make the least-risk targeted change. | Retained paths align rather than swirl. Transition with a clean geometric mask following the shrinking boundary. |
| 10 | 00:55–01:05 | 10s | **Full regression suite in the locked master view.** Three 3-second state-match beats: stalled car helped; tower remains upright as the kaiju slows locally; ambulance continues through the open lane. Final second: all three shapes join a complete evidence loop and the release gate unlocks. | Make the judge able to retell the suite: car helped, tower safe, ambulance moving—now release is earned. | Keep camera fixed and use only three decisive cuts. Each result gets a readable hold; do not compress this into a frantic montage. |
| 11 | 01:05–01:11 | 6s | **Cross-device concept triptych.** The same prop-place/run/inspect action appears in three synchronized framings: pointer, touch, and XR ray. Use neutral device silhouettes with no brands. | State the truthful design claim: the same decision model is designed for desktop, mobile, and WebXR. | On-screen wording must be **“Designed for desktop · mobile · WebXR”**, not “available on,” unless verified later. Concept badge stays visible. |
| 12 | 01:11–01:18 | 7s | **Straight-on actual artifact capture.** Move through real prompt log → `PLAN.md` acceptance criteria → specialist assignment/evidence files. If later available, substitute a verified test result for one card. | Explain the Codex contribution factually: turning the brief into acceptance criteria, parallel specialist work, and reviewable evidence while humans own scope and taste. | Label **ACTUAL PROJECT ARTIFACTS** only for genuine capture. Use three clean crops and one linear arrow; no fake terminal animation or green checks. |
| 13 | 01:18–01:28 | 10s | **Memorable final image.** Return to a polished high-oblique hero tableau: tower upright, ambulance moving, car safely carried, and all three shape-coded traces forming one luminous loop. Slow push to the kaiju delicately applying an absurdly tiny approval seal with one claw; it carefully taps a lab bell. Hold the final composition for the last 2 seconds. | Close on impact: learners practice the judgment around AI-assisted change—build fast, prove safe, release with evidence. | Title in upper-right: **KAIJU QA**. Final line: **Build fast. Prove safe. Release with evidence.** Keep the concept badge. Optional subline: **A Loop Engineer learning game concept.** |

Total planned duration: **88 seconds**.

## Pacing and narration constraints

- Target **175–195 spoken words**, approximately 132–145 wpm after pauses.
  Favor short declarative sentences and leave silence on the tower fall, the
  ambulance stop, and the tiny seal.
- By 00:09 the viewer must know both the problem and the promise. By 00:34 the
  viewer must understand “happy path is not coverage.” By 00:48 the word
  “regression” must have been spoken. By 01:05 the complete corrected suite must
  be legible.
- Burn in English captions, maximum two lines and roughly 42 characters per
  line. Keep each caption on screen long enough to read; never place a new
  sentence over the exact frame of a visual reveal.
- The first act cuts quickly (4–6 seconds), the diagnosis settles into 7-second
  comparisons, and the final proof gets 10 seconds. This shift from surprise to
  deliberation mirrors the lesson.
- Use J-cuts and state-match cuts, not glitch, whip, spin, or generic trailer
  transitions. The audience should feel that the evidence changed while the
  experiment stayed controlled.

## Editorial guardrails

- Do not depict a real city being destroyed, frightened civilians, weapons,
  roaring, or a humiliated kaiju. The tower is a reversible block fixture in a
  lab district.
- Do not obscure the evidence with reaction shots, particles, bloom, captions,
  or an oversized joke. The factual state lands first; the comic reaction comes
  second.
- Do not imply live AI behavior, implemented gameplay, passed tests, or shipping
  status unless a verified capture supports the exact claim.
- Avoid third-party logos, device brands, copyrighted music, and UI that looks
  copied from a commercial game. Cleared/CC0 sound and original graphics only.
- Preserve one kaiju design, helmet, palette, tabletop layout, and light
  direction across all generated or composited shots. Continuity matters more
  than adding visual variety.

## Production handoff

- Build shots 3, 4, 6, 7, and 10 from one locked master composition with
  state-layer swaps. This both lowers production risk and makes the comparison
  pedagogically stronger.
- Build shots 5 and 9 from one overhead composition. Build shots 1 and 13 from
  the same hero assets at different crop/lens treatments.
- The one essential bespoke angle is shot 8, the blocked ambulance consequence.
  If schedule compresses, retain this angle and cut animation complexity
  elsewhere.
- Export a clean still from the final two-second hold as the likely Devpost
  thumbnail: giant careful claw, tiny seal, intact tower, moving ambulance, and
  complete evidence loop.

## Completion summary

Created a complete 88-second, 16:9 directing plan with a cold open, locked
comparison grammar, cause-and-effect transitions, disclosure strategy, visual
hierarchy, narration pace, all required Kaiju QA loop beats, cross-device and
Codex-process placement, and a thumbnail-ready final image.

### Sources reviewed

- `C:/UnityProj/OpenAIBuildWeek-devpost-kaiju-qa-video/AGENTS.md`
- `C:/UnityProj/OpenAIBuildWeek-devpost-kaiju-qa-video/plans/devpost-kaiju-qa-video/PLAN.md`
- `C:/UnityProj/OpenAIBuildWeek-devpost-kaiju-qa-video/plans/devpost-kaiju-qa-video/AGENT_ASSIGNMENTS.md`
- `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/PROPOSALS.md` — Kaiju QA section
- `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/assets/kaiju-qa.png`
- `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/DEVPOST_SUBMISSION_DRAFT.md`
- `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/ASSET_PLAN.md`
- `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/plans/loop-engineer-concepts/agent-notes/comedy.md` — Kaiju quality-lab option

### Checks performed

- Added shot durations and verified they total exactly **88 seconds**, inside the
  required 75–95 second window.
- Verified the sequence includes happy path, fragile-tower edge case, over-broad
  fix, ambulance regression, targeted slow zone, full regression pass, and
  release.
- Verified the first nine seconds communicate both the learner problem and the
  Kaiju QA promise.
- Verified every synthetic game-style shot has explicit concept-visualization
  disclosure and that process claims require actual repository capture.
- Performed a Markdown structure/readability review only. No IWSDK, IWER,
  browser, XR runtime, dev server, build, render, branch, commit, or push command
  was run.

### Changed path

- `plans/devpost-kaiju-qa-video/agent-notes/film-direction.md`
