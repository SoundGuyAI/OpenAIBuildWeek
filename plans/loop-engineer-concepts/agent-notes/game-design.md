# DISC-GD-01 — Loop Engineer game-design concept seeds

- Status: discovery note for orchestrator integration
- Scope: player verbs, learning-through-play, 180-second arcs, cross-platform interaction, failure/recovery, and four-hour scope floors
- Research checked: 2026-07-20

## Design thesis and scope boundary

The shared player promise is: **do not fix every output by hand; design a loop that turns evidence into verified progress and knows when to stop.** Each concept should make the player configure or improve a system, launch an autonomous attempt, read trustworthy feedback, and make a smaller, better-informed next change.

This note proposes game mechanics, not the final curriculum, fiction, visual style guide, asset list, or originality/market verdict. The learning-design specialist should reconcile terminology and assessment detail; the narrative, art, comedy, and market specialists should replace the intentionally broad framing where appropriate.

## Shared learning spine

The concepts use one compressed synthesis rather than presenting SDLC as a one-way conveyor:

`frame target -> configure harness -> run work -> inspect evidence -> revise -> validate/release -> feed learning forward`

| Play beat | Player-visible lesson | SDLC relationship |
| --- | --- | --- |
| Frame target | Define the desired outcome, constraints, acceptance signal, budget, and stop condition before acting. | Requirements and planning |
| Configure harness | Choose the rules, tools, tests, permissions, ownership, or routing that will guide the worker. | Design and architecture |
| Run work | Launch an autonomous attempt instead of manually producing the answer. | Implementation and build |
| Inspect evidence | Read traces, tests, behavior, and user-facing outcomes; a confident-looking result is not proof. | Test and observe |
| Revise | Change the smallest relevant part of the goal, harness, implementation choice, or test based on evidence. | Repair and maintenance |
| Validate and release | Rerun the applicable gates and ship only when measurable acceptance conditions hold. | Release and deployment |
| Feed learning forward | Turn production or player feedback into the next requirement or reusable check. | Operate, learn, and begin the next cycle |

### Shared 180-second teaching rhythm

| Time | Required player experience |
| --- | --- |
| `0:00-0:20` | See a concrete goal and one obvious way to change the system; no spoken explanation required. |
| `0:20-0:45` | Configure one element, launch the loop, and earn a small first success. |
| `0:45-1:20` | Meet a partial failure that produces legible evidence rather than an arbitrary punishment. |
| `1:20-2:05` | Make one evidence-backed revision and compare the new run with the old one. |
| `2:05-2:35` | Choose or satisfy a release gate under a concept-specific pressure. |
| `2:35-3:00` | Resolve, see what was learned, and receive a one-action replay invitation. |

### Shared game rules

- The player may change a goal, constraint, rule, tool, test, route, priority, or stop condition. They may not directly repair the final artifact.
- Every run visibly acts without further input, leaves a compact trace, and either passes, partially passes, or fails for a named reason.
- At least one tempting action should optimize appearance or speed while ignoring the available evidence.
- Failure must preserve the useful evidence, freeze or rewind cleanly, and allow a one-action retry.
- Score quality before speed: acceptance gates passed, regressions avoided, useful evidence captured, and unnecessary interventions minimized.
- The production result must visibly reconnect to the next planning beat so the player understands that release is not the end of the loop.

## Divergence matrix

| Seed | Primary player verb | Spatial structure | Emotional arc | Defining failure mode | Broad aesthetic territory |
| --- | --- | --- | --- | --- | --- |
| **Proof Circuit** | Route and snap | Radial machine around a central worker | Curiosity -> control -> satisfying inevitability | Runaway iteration or false release from a missing gate | Precision kinetic instrument |
| **Tracebreaker** | Scrub and splice | Walkable-looking but stationary temporal helix | Confusion -> suspicion -> causal insight -> vindication | Treating a symptom causes another regression | Forensic monochrome hologram |
| **Eval Garden** | Plant and prune | Transparent spherical terrarium | Nurture -> pride -> doubt -> responsible stewardship | Overfitting to narrow checks creates brittle success | Tactile organic growth system |
| **Merge Metro** | Conduct and sequence | Multi-level tabletop network | Playfulness -> overload -> flow -> exuberance | Conflicting work deadlocks or overwhelms shared gates | Bright toy logistics map |
| **Scope Foundry** | Carve and prioritize | Vertical feature monolith with a backlog orbit | Abundance -> overwhelm -> hard choice -> relief | Scope consumes the deadline before a complete slice ships | Chunky blueprint/construction forms |

## Seed 1 — Loop Engineer: Proof Circuit

**Core promise:** Build one self-correcting circuit that can transform several flawed artifacts without touching the artifacts yourself.

**Why this is spatial:** The player can read the whole loop at once around a central worker, physically see missing feedback connections, and watch artifacts circulate through repeated passes. XR makes snapping modules into a machine feel embodied; desktop and touch retain the same routing decision.

- **Hook:** A visibly unstable artifact enters a waist-high circular machine. It completes a lap, fails, and starts the same useless lap again while a finite iteration ring drains. One empty socket pulses between `OBSERVE` and `ADJUST`.
- **20-second onboarding:** A ghost hand/path highlights one test module. The player snaps it into the empty socket and presses the only lit `RUN` control. The prompt is action-sized: “Connect proof. Run.”
- **First success by 45 seconds:** The artifact passes through build, fails the new test, is repaired by the worker, passes on its next lap, and exits through the release gate. Feedback states: “You improved the circuit, not the artifact.”
- **Escalation:** Three artifacts arrive with different defects. The player has a limited module budget and must choose a meaningful acceptance test plus a stop gate. A speed-only monitor produces a fast false pass; a circuit without a stop condition burns its remaining laps.
- **Finale:** One launch sends all three artifacts through the configured loop. Failed items visibly recirculate while passing items peel into release lanes, ending in a synchronized three-item release pulse.
- **Win / fail / recovery:** Win when every artifact passes the chosen acceptance gate before the iteration budget ends. Fail by exhausting the budget or releasing a false positive. Freeze the ring with its trace intact; one control returns the modules to their pre-run positions for revision.
- **Replay reason:** Optimize for fewer laps and fewer modules, or solve a remixed set of three defect icons with a different valid circuit.
- **Desktop mapping:** Mouse-drag a module to a socket; click a socket to rotate/remove it; click `RUN`, `PAUSE`, or `RETRY`. Number keys can select modules as an alternate input.
- **Touch mapping:** Drag modules into large sockets, or tap a module then tap a socket; tap the run control. Two-finger orbit is optional, not required for completion.
- **XR mapping:** Grab and snap modules at arm’s reach, then poke or ray-select the run control. Controller ray selection is a complete fallback for seated play and limited reach.
- **Smallest complete four-hour build:** One fixed radial scene; four labeled sockets; three module types (`TEST`, `REPAIR`, `STOP`); three primitive artifacts with deterministic defect flags; one tutorial run; one three-artifact final run; iteration meter; pass/fail/retry; no physics, procedural routing, live model, inventory, or locomotion.
- **Ordered cuts:** Cut decorative machine motion; cut remixed defects; cut pause and module rotation; cut the third artifact; protect the act of configuring one loop that autonomously fails, repairs, validates, and stops.
- **Originality stress-test:** Strip off all software labels. If the result is merely a circuit-routing puzzle, it fails. Preserve the differentiator by requiring one configuration to process multiple unknown artifacts, by scoring autonomous correction rather than path completion, and by making a valid stop condition part of success.

## Seed 2 — Loop Engineer: Tracebreaker

**Core promise:** Dive into the history of a broken release, distinguish cause from symptom, and splice one evidence-backed decision into a better future.

**Why this is spatial:** The run history is a helix of before/after snapshots surrounding a stationary player. Depth separates earlier causes from later symptoms, while pulling time past the body is more memorable in XR than reading a flat log.

- **Hook:** A release at the far end of a timeline fractures. Time freezes and a failure wave travels backward through build, test, design, and goal snapshots, lighting several suspicious nodes rather than handing over the answer.
- **20-second onboarding:** The nearest timeline handle pulses. The player drags time backward, selects a highlighted evidence shard at the failed test, and pins it to the only compatible decision socket. Prompt: “Follow evidence upstream.”
- **First success by 45 seconds:** Replaying that short branch changes the downstream snapshots and restores one broken user outcome. The original trace remains as a faint comparison, making improvement visible.
- **Escalation:** The full incident presents two loud symptoms but one earlier acceptance gap. The player compares a test trace with a user-observation trace, chooses one of three branch points, and swaps one decision token. Fixing the latest red node is fast but causes a new regression.
- **Finale:** The corrected release passes its gates. A production-feedback shard then arcs from the released end back to the initial goal node, physically closing the helix into a loop.
- **Win / fail / recovery:** Win by choosing the earliest supported cause and producing a release with both outcomes intact. Fail after two unsupported splices or one regression at the final gate. Rewind automatically to the last fork while keeping compared traces visible.
- **Replay reason:** Randomize the root cause among three nodes and score evidence inspected, unsupported edits avoided, and distance between symptom and corrected cause.
- **Desktop mapping:** Mouse-wheel or drag the timeline to scrub; click a shard to inspect it; drag it to a branch socket; press or click `REPLAY`.
- **Touch mapping:** Swipe horizontally to scrub, tap evidence, drag the selected shard to a large socket, and tap replay. A tap-to-jump list mirrors the swipe path for accessibility.
- **XR mapping:** Grab the timeline ribbon and pull it through the scene; grab or ray-select an evidence shard; insert it into a branch socket; squeeze the replay trigger. No walking is required.
- **Smallest complete four-hour build:** Seven fixed nodes on a helical path; two trace overlays; three evidence cards; one tutorial branch; one final branch with one decoy symptom; deterministic before/after states; release/fail/retry; no free locomotion, text log parser, procedural incident generation, or full 3D replay.
- **Ordered cuts:** Cut randomized causes; cut animated downstream snapshots; cut the second trace overlay; cut the decoy symptom; protect scrubbing to evidence, changing an upstream decision, and seeing a different validated outcome.
- **Originality stress-test:** If play reduces to “find the red error on a timeline,” it fails. The nearest and loudest error must be a symptom; success must require comparing at least two evidence signals and changing an earlier decision while preserving another working outcome.

## Seed 3 — Loop Engineer: Eval Garden

**Core promise:** Shape the conditions around an autonomous builder so it grows a solution that is resilient, not merely impressive on one test.

**Why this is spatial:** Evaluation beacons surround a branching growth inside a transparent terrarium. Their position and coverage make blind spots tangible; XR lets the player tend the environment without directly puppeteering the growth.

- **Hook:** A seed-worker rapidly grows a bridge toward a glowing need, reaches one visible target, then snaps under an untested side load. The growth rewinds to a seed while an empty probe socket pulses.
- **20-second onboarding:** The player places one highlighted acceptance beacon beside the target and starts growth. Prompt: “Plant a check. Let it grow.”
- **First success by 45 seconds:** The autonomous branch changes direction, touches the beacon, and blooms to mark its first verified requirement. The player never drags or draws the branch itself.
- **Escalation:** A second run grows faster and passes two duplicate beacons, tempting the player to ship. A preview of diverse conditions reveals a coverage shadow. The player must prune one brittle branch and spend the last beacon on a different class of evidence rather than another easy pass.
- **Finale:** The released structure is tested by three short environmental pulses. A resilient build flexes and remains connected; its final seed drops into a new goal socket to imply the next cycle.
- **Win / fail / recovery:** Win when the structure meets the target and survives all distinct probes within the growth budget. Fail when a hidden condition breaks an overfit structure or excessive pruning removes required value. Rewind growth but retain the probe map and highlighted blind spot.
- **Replay reason:** A different hidden condition changes which probe mix is sufficient. Score useful coverage, growth cost, and the number of discarded branches.
- **Desktop mapping:** Drag beacons into the terrarium; click `PRUNE`, then click a branch; click `GROW` or press Space. Camera motion is optional.
- **Touch mapping:** Drag or tap-place beacons; tap prune mode and then the branch; tap grow. Large branch hit regions prevent precision dependence.
- **XR mapping:** Grab and place beacons; ray-select a branch and trigger prune; press a world-space grow control. Optional pinch pruning may be added later, but controllers/rays are the complete baseline.
- **Smallest complete four-hour build:** One fixed terrarium; a scripted branch graph built from primitive segments; three beacon types represented by shape as well as color; one tutorial growth; one overfit final choice; one hidden stress pulse; bloom/break states; result/retry; no procedural botany, fluid simulation, real optimization, physics, or hand tracking requirement.
- **Ordered cuts:** Cut organic animation; cut randomized hidden conditions; cut branch pruning and allow beacon replacement; cut the third probe type; protect autonomous growth that changes only after the player changes evaluation conditions.
- **Originality stress-test:** If the result becomes a generic gardening or bridge-building game, it fails. The player must have no direct growth/build verb: they can only define goals, place checks, inspect failure, and revise the environment that guides the next autonomous run.

## Seed 4 — Loop Engineer: Merge Metro

**Core promise:** Orchestrate several fast workers by defining ownership, dependencies, and validation flow so parallelism becomes leverage instead of collision.

**Why this is spatial:** A multi-level tabletop network makes independent lanes, shared resources, merge points, and queue pressure readable in one glance. XR turns rule placement into playful conducting without requiring room-scale movement.

- **Hook:** Three worker pods launch at once, race toward one shared merge gate, and lock nose-to-nose. Their work queues stack visibly while an ownership sign flashes blank.
- **20-second onboarding:** The player places one highlighted ownership sign over a lane and flips one dependency gate. The pods reset automatically. Prompt: “Separate work. Order the merge.”
- **First success by 45 seconds:** Two pods complete independent work in parallel, serialize cleanly at the shared gate, pass a test station, and produce one small release.
- **Escalation:** A second feature wave adds a shared-file pod and a slow validation station. The player chooses where to parallelize, where to serialize, and whether to cap work in progress. A speed boost at the wrong lane creates a larger queue rather than progress.
- **Finale:** The final run becomes a synchronized “green wave”: independent pods move together, shared work queues briefly, tests pulse in sequence, and all completed pieces merge into one release without collision.
- **Win / fail / recovery:** Win by releasing all required pieces before the queue meter fills, with no unresolved ownership conflict and every piece validated. Fail on deadlock, queue overflow, or an untested merge. Freeze paths with conflict lines visible; `REPLAN` returns signs and gates while preserving the trace.
- **Replay reason:** Remixed lane blockages and ownership badges support throughput optimization. Score completed value, idle time, queue peak, and conflicts avoided rather than raw pod speed.
- **Desktop mapping:** Drag signs or gate tiles onto sockets; click gates to toggle sequence; click `RUN/PAUSE/REPLAN`. Keyboard focus supports every socket.
- **Touch mapping:** Drag or tap-select/tap-place rule tiles; tap gates and run controls; optional pinch zoom never gates completion.
- **XR mapping:** Grab and place signs at the tabletop, ray-toggle gates, and press the run control. All targets remain reachable seated or standing; no locomotion is needed.
- **Smallest complete four-hour build:** One fixed tabletop; three spline lanes; three primitive pods; two rule types (`OWNER`, `WAIT FOR`); one shared test station; one tutorial release; one final deadlock scenario; deterministic movement; queue/conflict meter; result/retry; no navmesh, free-form drawing, physics collisions, networking, or procedural schedules.
- **Ordered cuts:** Cut remixed blockages; cut pause; cut queue optimization; cut the third pod; protect the choice between parallel independent work and serialized shared work followed by validation.
- **Originality stress-test:** If it reads as an ordinary traffic-management game, it fails. Path speed must not be the main score. Ownership, dependency order, shared-write conflict, and validation status must determine whether the release is correct.

## Seed 5 — Loop Engineer: Scope Foundry

**Core promise:** Carve an overflowing request into the smallest complete, testable slice and stop the builder at “accepted” before scope consumes the release.

**Why this is spatial:** Features arrive as a vertical monolith whose dependency seams, weight, and incomplete base are visible. Removing scope changes the silhouette immediately, and XR makes the act of placing work into a deliberate backlog physically legible.

- **Hook:** A builder extrudes feature blocks faster than a deadline ring can accommodate. The monolith grows upward, wobbles, and displays many shiny capabilities but no complete path from user goal to release.
- **20-second onboarding:** One optional block pulses beside a visible backlog zone. The player removes it, places it in backlog, and pulls `BUILD`. Prompt: “Cut one extra. Complete one slice.”
- **First success by 45 seconds:** A compact vertical slice—goal, behavior, test, and release base—locks together and earns one acceptance seal. The backlogged block remains visible as future work rather than being destroyed.
- **Escalation:** New feedback offers three attractive feature blocks, while the current slice exposes one failing acceptance seam. The player must fund the evidenced repair, reject unrelated additions, and choose a measurable stop condition. Removing a dependency-critical block creates a hollow “fast” build that fails validation.
- **Finale:** As the deadline ring closes, the player commits `SHIP`. A complete slice compresses into a stable release and the backlog rotates into the starting plan for a future loop. An over-scoped or hollow build remains visibly unfinished.
- **Win / fail / recovery:** Win by shipping one end-to-end slice that satisfies the selected acceptance target before budget expires. Fail when time runs out, a required dependency is missing, or the player ships without a passing test. Freeze the monolith, show the missing seam, and restore the last pre-build arrangement on retry.
- **Replay reason:** Randomized dependencies and feedback cards permit several valid minimum slices. Score accepted value, unused budget, rejected distraction, and completeness—not the number of features retained.
- **Desktop mapping:** Drag blocks between the monolith and backlog; click dependency seams to inspect them; click `BUILD`, `TEST`, and `SHIP`. A list view offers keyboard-only block movement.
- **Touch mapping:** Drag blocks to the backlog, or tap a block and tap its destination; tap build/test/ship. Long-press is not required.
- **XR mapping:** Grab and snap blocks between the stack and backlog; ray-select seams; pull the build lever and press ship. A ray-only mode avoids throwing and supports seated play.
- **Smallest complete four-hour build:** One fixed stack of eight snapped cubes; `MUST`/`OPTIONAL` shapes; two visible dependency seams; one backlog zone; one tutorial cut; one feedback-and-repair choice; scripted deadline; build/test/ship states; result/retry; scripted wobble instead of physics; no economy, text-heavy backlog, procedural architecture, or multiple stakeholder simulations.
- **Ordered cuts:** Cut randomized dependencies; cut animated extrusion; cut the feedback-card choice; cut the separate test control by auto-testing on build; protect selecting an acceptance target, cutting optional scope, retaining a complete end-to-end slice, and explicitly stopping to ship.
- **Originality stress-test:** If it is “Jenga with project-management labels,” it fails. Merely removing blocks cannot win: the player must preserve a complete goal-to-release slice, respond to observed test evidence, and choose a stopping condition while tempting but unsupported features continue to appear.

## Cross-platform, accessibility, and comfort baseline

- Design every scene for a fixed seated or standing origin with no required smooth locomotion, artificial turning, crouching, throwing, or two-handed gesture.
- Keep no more than five actionable targets visible at once during onboarding and provide controller-ray, mouse, touch, and keyboard paths to the same intent.
- Pair color with icon, shape, motion state, and short text. Essential success/failure information cannot depend on audio or haptics.
- Pause countdown pressure while the player is inactive during onboarding. At 5 seconds, pulse the current affordance; at 10 seconds, draw a ghost path; at 20 seconds, offer one-tap assisted placement without completing the later decision.
- Use large snap zones and tap-select/tap-place alternatives so touch players do not need precise 3D dragging.
- Respect reduced motion by replacing rapid travel, breakage, and camera movement with state fades and persistent before/after traces.
- Keep retry in the same spatial context; never send a failed player through a title screen or repeat the onboarding unless requested.

## Observable acceptance criteria for any selected seed

1. A cold player performs the core verb by 20 seconds and sees an autonomous first success by 45 seconds without presenter narration.
2. The player changes the loop or its harness at least twice and can visually compare evidence from two runs.
3. Directly manipulating the final artifact cannot satisfy the win condition.
4. One seductive but unsupported choice creates a legible, recoverable concept-specific failure.
5. The experience reaches a clear release/fail result and one-action retry within 180 seconds.
6. Desktop, touch, and XR preserve the same goal, decision, rule, evidence, and score even when gestures differ.
7. The minimum build uses one fixed scene, deterministic local logic, primitive geometry, no backend, and no live model dependency.
8. The selected concept remains recognizably distinct after its software vocabulary and broad aesthetic labels are removed.

## Assumptions, questions, and risks

### Assumptions

- “Built using Codex and GPT-5.6” describes the production workflow; the judged game does not require a live model call on its critical path.
- The target player understands ordinary ideas such as goal, test, evidence, retry, and release, but may have no software-engineering background.
- The four-hour estimate starts from the repository’s working IWSDK boilerplate and uses scripted state changes rather than general simulation.

### Product questions, highest impact first

1. Must the game teach a named canonical Loop Engineering model, or may it teach the operational pattern and reveal terminology at the result screen?
2. Is the primary judging audience expected to be software practitioners, general players, or both? This controls vocabulary density and how abstract the metaphors may be.
3. Is deterministic simulation acceptable, or must a real Codex run appear during the demo? A live run changes reliability, timing, privacy, and offline scope.
4. Should score emphasize engineering quality alone or also invite an arcade-style leaderboard? The latter may accidentally reward rushing over evidence.

### Risks and game-design responses

| Risk | Impact | Response |
| --- | --- | --- |
| The emerging term “Loop Engineering” is interpreted differently across sources. | High | Keep the mechanic grounded in goal, autonomous action, evidence, revision, validation, and stopping; let DISC-LD-01 own canonical wording. |
| The metaphor is fun but obscures the actual engineering lesson. | High | Keep the same seven spine icons and a one-line debrief across all concepts; require players to act on evidence rather than labels alone. |
| The first run feels like a scripted tutorial rather than agency. | High | Put the first meaningful tradeoff immediately after the 45-second success and make its consequences visible before the finale. |
| XR embodiment creates interaction that touch cannot express. | Medium | Make each decision socket-based and completable through ray or tap-select/tap-place; embodiment adds tactility, not extra rules. |
| Four hours is consumed by simulation, physics, or procedural content. | High | Use deterministic state graphs, scripted motion, one scene, one tutorial scenario, and one final scenario. |
| Time pressure punishes reading or motor differences. | Medium | Freeze pressure during onboarding, offer progressive hints, and score quality before speed. |

## Source basis and handoff boundary

These sources anchor only the shared mechanical spine; DISC-LD-01 should provide the canonical teaching model and final citations.

- OpenAI, [Build iterative repair loops with Codex](https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex), 2026-05-11: current closed-loop pattern of review, focused repair, validation, and repetition.
- OpenAI, [Build an Agent Improvement Loop with Traces, Evals, and Codex](https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop), 2026-05-12: traces and feedback become reusable evaluations and concrete harness changes.
- OpenAI, [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/), 2026-02-11: the engineer specifies intent and builds environments and feedback loops that make agent work reliable.
- NIST CSRC, [Software Development Life Cycle glossary](https://csrc.nist.gov/glossary/term/software_development_life_cycle), accessed 2026-07-20: SDLC as a methodology for designing, creating, and maintaining software.
- IBM, [What is loop engineering?](https://www.ibm.com/think/topics/loop-engineering), 2026-07-17: current cross-check framing around goal, action, observation, and adjustment with verifiable stopping criteria.
