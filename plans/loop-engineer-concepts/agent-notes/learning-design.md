# Learning-design research: Loop Engineering + SDLC

Logical assignment: `DISC-LD-01`  
Research snapshot and source access date: **2026-07-20**  
Audience assumption: a novice or early-career builder who has used AI tools but does not yet reason explicitly about software lifecycle governance.

## Research conclusion and term boundary

As of July 2026, **Loop Engineering is an emerging practitioner term in agentic software development, not a standardized SDLC, formal ISO process, or settled job title**. IBM describes it as an emerging approach organized around goal, action, observation, and adjustment; Addy Osmani's June 2026 article helped popularize the term in software-agent discourse. Current OpenAI engineering material describes the related agent loop and the harness that supplies tools, context, constraints, and feedback. [S1][S2][S3][S4]

For this project, use the following explicit, teachable definition:

> **Loop Engineering is the design and governance of a recurring, goal-driven workflow in which an agent takes bounded action, obtains environment-grounded evidence, and adjusts or exits under defined success, risk, budget, and human-authority conditions.**

This is a project synthesis, not a claimed industry-standard definition. It deliberately adds **governance and exit conditions** to avoid teaching an infinite autonomous retry loop.

### What the phrase may otherwise mean

| Possible meaning | Relationship to this project |
| --- | --- |
| 2026 agentic-software usage | **Intended meaning:** design the goal/action/evidence/adjustment cycle around one or more software agents. [S1][S2] |
| Control or instrumentation engineering | Older feedback-control usage concerns measured process variables, controllers, and loop tuning. It is a useful analogy, but not the topic being taught. [S10] |
| A programming `for`/`while` loop | Not intended; that is a language construct, not a governed engineering workflow. |
| Agile, DevOps, or generic iteration | Related, but too broad. Iteration becomes Loop Engineering here only when the goal, permitted action, observation/evaluator, adjustment rule, and exit boundary are deliberately engineered. |
| SDLC | Different scale. SDLC governs software from conception through operation/support and retirement; engineered loops can run inside every lifecycle phase. [S5][S6] |

A useful adjacent-term distinction is: **prompt engineering** shapes an instruction; **context engineering** shapes what the model can see; **harness engineering** shapes its tools, environment, permissions, and feedback surfaces; **Loop Engineering** shapes recurrence, control flow, evaluation, and termination; **SDLC** shapes the full product lifecycle. [S2][S3][S4]

## The teachable loop

Use the source-aligned four-word loop, with an explicit exit gate:

```text
GOAL -> ACT -> OBSERVE -> ADJUST -+
  ^                              |
  +------------------------------+

At OBSERVE/ADJUST: PASS -> ADVANCE; RISK/UNCERTAINTY -> ESCALATE;
NO PROGRESS OR BUDGET EXHAUSTED -> STOP AND REFRAME.
```

| Step | Learner's question | Required artifact or evidence |
| --- | --- | --- |
| **Goal** | What user outcome matters, what constraints apply, what proves success, and who may decide? | Outcome, acceptance criteria, quality/risk constraints, budget, authority boundary, stop/escalation rule. |
| **Act** | What is the smallest safe, bounded, preferably reversible step that can reduce uncertainty or improve the artifact? | A tool call, experiment, prototype, code/test/design change, review request, deployment, or rollback within scope. |
| **Observe** | What actually happened, and what evidence supports that conclusion? | Tests, evaluator output, diff, logs, traces, telemetry, review, user behavior, or other external state; never only the acting model's confidence. |
| **Adjust** | Given that evidence, what should change next? | Revise the goal, plan, context, tool, implementation, test, guardrail, or lifecycle decision; then repeat, advance, stop, or escalate. |

The conceptual payload is not “keep trying.” It is **make the next action conditional on trustworthy evidence and bounded by a responsible exit**. ReAct is a technical antecedent for interleaving reasoning, action, and environmental observation; Loop Engineering broadens the design problem to the surrounding workflow and governance. [S7]

## Mapping the loop to SDLC

ISO/IEC/IEEE 12207:2026 provides a common software-life-cycle process framework spanning conception, development, operation, support, and retirement. It explicitly allows processes to be used concurrently, iteratively, recursively, and incrementally rather than prescribing one fixed waterfall. The seven stations below are therefore a **game-friendly teaching map**, not a claim that ISO mandates seven phases. [S5]

| Teaching phase | Goal | Act | Observe | Adjust or exit |
| --- | --- | --- | --- | --- |
| **1. Conceive & plan** | Establish the user problem, value, feasibility, stakeholders, risk, and authority. | Research, interview, estimate, prototype, prioritize. | Stakeholder evidence, feasibility results, risk and cost signals. | Refine scope, fund, defer, or stop. |
| **2. Specify** | Turn needs into testable functional and quality outcomes. | Write requirements, examples, acceptance criteria, threat/abuse cases. | Reviews expose ambiguity, conflict, missing users, or untestable language. | Clarify, split, reprioritize, or approve. |
| **3. Design** | Choose a solution and verification strategy that satisfy constraints. | Model architecture, UX, data, interfaces, controls, and tests. | Design review, prototype results, threat model, accessibility/performance analysis. | Revise the design or advance with recorded tradeoffs. |
| **4. Build & integrate** | Produce the smallest useful increment without violating constraints. | Implement, generate, configure, integrate, document. | Diffs, compiler/linter output, unit/integration checks, dependency evidence. | Fix, replan, revert, or send to verification. |
| **5. Verify & validate** | Establish that the increment is built correctly **and** solves the intended problem. | Run automated checks, exploratory/browser/XR QA, security and user validation. | Defects, acceptance results, usability, accessibility, performance, and security evidence. | Repair, redesign, accept known risk through the proper human gate, or reject. |
| **6. Release & operate** | Deliver safely and achieve the intended real-world outcome. | Package, deploy, migrate, enable, monitor, support. | Deployment health, telemetry, incidents, user outcomes, cost and reliability. | Roll back, tune, patch, change backlog, or continue service. |
| **7. Maintain & retire** | Sustain value safely or end the system responsibly. | Correct, adapt, upgrade, migrate, archive, remove access/data/resources. | Vulnerabilities, support burden, usage, compliance, replacement readiness, disposal evidence. | Continue, replace, or retire with verified cleanup. |

Two rules must remain visible in the game:

1. **The loop is nested, not substituted.** Each SDLC phase contains many Goal-Act-Observe-Adjust loops, and evidence may legitimately send work backward or forward across phases.
2. **Quality and security are cross-cutting.** NIST's SSDF is designed to be integrated into whichever SDLC is used; security is not a one-time “test phase” at the end. Its Prepare, Protect, Produce, and Respond practice groups also reinforce that post-release response belongs in the model. [S6]

## Misconceptions to surface and correct

| Misconception | Corrective model / game cue |
| --- | --- |
| “Loop Engineering is the new official SDLC.” | Show an inner four-station loop physically nested inside an outer lifecycle ring; label the term “emerging practice.” |
| “A clever one-shot prompt is a loop.” | A prompt card alone cannot power the machine; the player must also connect evidence, adjustment, and exit sockets. |
| “Retrying the same action is improvement.” | An unchanged retry produces the same deterministic failure and a “no new evidence” signal. |
| “The agent saying ‘done’ proves success.” | Self-report does not open the exit. A test, review, telemetry, or user-outcome token must satisfy the acceptance gate. |
| “Passing unit tests means the product is done.” | The gate has separate user-outcome, safety/security, accessibility/comfort, and operational signals appropriate to the scenario. |
| “SDLC means one-way waterfall.” | The outer ring supports backflow and parallel illuminated stations; observed evidence can return the artifact to specify, design, or build. [S5] |
| “Deployment is the end.” | A post-release signal creates an Operate/Maintain decision and can trigger rollback, patching, or retirement. |
| “More autonomy is always better.” | Scope, budget, risk, and authority tokens constrain action; uncertainty or high-impact decisions require a human escalation gate. |
| “Changing the success criterion after a failure is adjustment.” | Distinguish valid goal refinement from silently lowering a safety or quality bar to manufacture a pass. |
| “The fastest player understands best.” | Score evidence use and decision quality, not motor speed or raw completion time. |

## Learning objectives and assessment signals

Use an evidence-centered design structure: make a learner claim, elicit behavior in a task, and record the behavior that would warrant the claim. [S9]

By the end of the 180-second experience, the player should be able to:

| ID | Observable learning objective | Assessment task | Positive signal |
| --- | --- | --- | --- |
| **LO1: Distinguish** | Identify Loop Engineering as a governed agent workflow rather than a code loop, one-shot prompt, or replacement SDLC. | Choose the correct diagram/example during the opening and final retrieval beat. | Selects the nested governed loop and rejects “prompt only” and “infinite retry.” |
| **LO2: Frame** | Construct a usable goal with measurable evidence and an exit/escalation boundary. | Place outcome, acceptance, constraint, and exit tokens into the Goal station. | Goal states a user outcome; acceptance is observable; safety/quality is not omitted; exit is bounded. |
| **LO3: Diagnose and adjust** | Use observation evidence to choose a causally relevant next action. | Inspect a failed run and choose among targeted repair, unchanged retry, or lowering the bar. | Opens/collects the failed evidence, selects the matching repair, and preserves valid acceptance criteria. |
| **LO4: Map lifecycle** | Locate loop work in the relevant SDLC phase and recognize that release is not completion of the lifecycle. | Route a post-release incident token on the outer ring. | Places it in Release/Operate or Maintain, then chooses monitor, rollback, patch, or escalation as evidence warrants. |
| **LO5: Govern exit** | Decide when to continue, advance, stop, or escalate. | Respond to a passing gate and later to a risk/authority boundary. | Stops/advances after all criteria pass; escalates rather than improvising beyond authority or budget. |

Score each objective `2 = independent`, `1 = after a contextual hint`, `0 = not demonstrated`. A practical **lesson-success** threshold is 8/10 with at least 1 point on LO2, LO3, and LO5. Do not call this three-minute result mastery: durable mastery requires a later, novel transfer scenario. Critical anti-signals are knowingly bypassing a safety failure, repeatedly acting without observing, silently weakening acceptance criteria, or continuing an unbounded loop after the exit condition.

Recommended telemetry is semantic rather than movement-based: `goal_has_measurable_outcome`, `exit_rule_set`, `failure_evidence_inspected`, `adjustment_matches_evidence`, `criterion_weakened`, `exit_choice`, `incident_phase_choice`, `escalated_at_authority_boundary`, and hint count.

## 180-second experiential lesson for a 3D game

### Spatial grammar

Use one compact, seated-friendly room: a central agent core, four reachable stations labeled **Goal / Act / Observe / Adjust**, and an outer illuminated floor or wall ring for the seven SDLC phases. The same semantic actions map to XR grab/place/press, desktop point/click/keyboard, and touch tap/drag. Keep labels to short phrases, pair color with shape/icon/audio, caption narration, and never require fast locomotion.

The sample artifact is a small delivery bot carrying a medical cell. Its acceptance gate is “reach the bay in 10 seconds or less with zero collisions.” The theme can be reskinned without changing the learning evidence.

| Time | Player experience and feedback | Learning evidence captured |
| --- | --- | --- |
| **0–15 s — Hook / halt** | A bot powered only by a vague “make it work” card repeats a failed route and sparks. The player presses **Halt**. The room reveals four disconnected loop stations. | Preconception signal: halt versus blind retry; LO1 baseline. |
| **15–40 s — Goal** | The player snaps in an outcome token, the two observable acceptance tokens, a bounded retry/budget token, and an escalation token. The acceptance gate becomes physically visible before any change is made. | LO2: measurable outcome, quality constraint, and exit boundary. |
| **40–65 s — Act** | The player authorizes one scoped route-optimizer change from the agent rather than a full rebuild. The changed route is highlighted, and an undo token remains visible. | Bounded/reversible action; scope discipline supporting LO5. |
| **65–90 s — Observe** | The test chamber runs deterministically: time is green at 7 seconds, but collision is red. The adjustment controls remain locked until the player collects or opens the collision evidence shard. | LO3: evidence inspected; distinguishes partial success from acceptance. |
| **90–120 s — Adjust** | Choices are: add obstacle sensing and rerun, repeat unchanged, or remove the collision criterion. The causal repair advances. Wrong choices produce a five-second diagnostic response without a punitive full reset. | LO3: adjustment matches evidence; criterion was or was not weakened. |
| **120–142 s — Re-run / exit** | The second run passes both criteria. The player chooses **Advance/Stop**; “keep looping” is available as a misconception distractor. | LO5: exits when evidence satisfies the goal. |
| **142–165 s — SDLC transfer** | The bot is released; live telemetry reveals overheating. The outer lifecycle ring lights up. The player routes the incident to Release/Operate or Maintain and selects rollback/escalation rather than “project done.” | LO4 and LO5: post-release lifecycle mapping and governed response. |
| **165–180 s — Retrieval / debrief** | Labels briefly fade. The player places four icons in order and completes: “The loop runs ___ every SDLC phase.” A compact scorecard names the evidence used, not just the final win. | LO1 transfer plus immediate explanatory feedback. |

**Total: 180 seconds.** The clock is a presentation budget, not a motor-speed penalty. Hints should pause or soften pacing, and every essential visual state needs text/audio equivalence.

### Why this flow is educationally credible

- It begins with a concrete failure, requires active decisions, supplies timely targeted feedback, and offers an immediate corrected attempt. The IES/WWC technology-learning guide specifically supports simulations, self-regulated learning prompts, and timely feedback. [S8]
- The forced partial failure makes acceptance criteria and observation consequential; it is not a decorative quiz after the mechanic.
- The final post-release incident is a near-transfer task: the player must apply the loop at a different lifecycle point rather than merely repeat the same route puzzle.
- The claim/task/evidence links above follow evidence-centered assessment design, so completion animation alone is not treated as proof of learning. [S9]

## Assumptions and risks for integration

### Assumptions

- “Loop Engineering” is intended in the July 2026 agentic-software sense described by IBM/Addy Osmani, not industrial control-loop design.
- The concept book needs one shared learning spine that can be reskinned across five mechanically distinct proposals.
- The three-minute experience provides introductory recognition and guided application, not professional SDLC competency.
- One deterministic failure and one post-release transfer decision are more teachable and judgeable than a broad lecture covering every SDLC artifact.

### Risks

- **Term instability:** the phrase is weeks old and may change meaning or lose adoption. Keep the dated definition and recheck S1–S4 before public submission.
- **False standardization:** do not imply ISO, NIST, OpenAI, or IBM has established “Loop Engineer” as a certified role or universal method.
- **Rigid phase misconception:** a circular visual can still imply one fixed order; animate backflow, concurrency, and phase-local loops.
- **Automation bias:** a charming agent character can make self-assertion feel authoritative. Require external evidence and visible human authority boundaries.
- **Assessment overclaim:** a successful guided run is evidence of initial understanding only. Preserve telemetry and add a novel follow-up scenario if claiming retention or mastery.
- **Cognitive/visual overload:** four loop stations plus seven lifecycle phases can become label-heavy. Keep the outer ring dim until the transfer beat and use progressive disclosure.
- **Accessibility distortion:** a timed judged demo can accidentally reward dexterity. Use equivalent controls, generous targets, captions, non-color cues, and no score for movement speed.

## Sources

All sources were accessed **2026-07-20**.

- **[S1]** Ivan Belcic and Cole Stryker, **“What Is Loop Engineering?”** IBM Think, published 2026-07-17. https://www.ibm.com/think/topics/loop-engineering
- **[S2]** Addy Osmani, **“Beyond Prompt Engineering: The Rise of Context Engineering & Loop Engineering.”** Addy Osmani, published 2026-06-07. https://addyosmani.com/blog/loop-engineering/
- **[S3]** Michael Bolin, **“Unrolling the Codex agent loop.”** OpenAI, published 2026-01-23. https://openai.com/index/unrolling-the-codex-agent-loop/
- **[S4]** OpenAI, **“Harness engineering: leveraging Codex in an agent-first world.”** OpenAI, published 2026-02-11. https://openai.com/index/harness-engineering/
- **[S5]** **ISO/IEC/IEEE 12207:2026, “Systems and software engineering — Software life cycle processes.”** International Organization for Standardization / IEC / IEEE, published 2026-04. https://www.iso.org/standard/90219.html
- **[S6]** Murugiah Souppaya, Karen Scarfone, and Donna Dodson, **NIST SP 800-218, “Secure Software Development Framework (SSDF) Version 1.1: Recommendations for Mitigating the Risk of Software Vulnerabilities.”** National Institute of Standards and Technology, published 2022-02-03. https://csrc.nist.gov/pubs/sp/800/218/final
- **[S7]** Shunyu Yao et al., **“ReAct: Synergizing Reasoning and Acting in Language Models.”** International Conference on Learning Representations (ICLR) / OpenReview, 2023. https://openreview.net/forum?id=WE_vluYUL-X
- **[S8]** Nada Dabbagh et al., **“Using Technology to Support Postsecondary Student Learning: A Practice Guide for College and University Administrators, Advisors, and Faculty.”** What Works Clearinghouse, Institute of Education Sciences, U.S. Department of Education, published 2019-05. https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/wwc-using-tech-postsecondary.pdf
- **[S9]** Robert J. Mislevy, Russell G. Almond, and Janice F. Lukas, **“A Brief Introduction to Evidence-Centered Design.”** Educational Testing Service Research Report RR-03-16, published 2003. https://www.ets.org/research/policy_research_reports/publications/report/2003/hsgs.html
- **[S10]** Jon Monsen, **“Fundamentals of PID Control.”** International Society of Automation, published 2023-06-26. https://www.isa.org/intech-home/2023/june-2023/features/fundamentals-pid-control
