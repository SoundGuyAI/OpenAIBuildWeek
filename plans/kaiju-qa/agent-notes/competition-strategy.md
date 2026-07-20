# Kaiju QA — competition, market, and submission strategy

Research date and official-source access date: **2026-07-20**
Competition: **OpenAI Build Week**
Recommended category: **Education**

## Executive recommendation

Position Kaiju QA as **a three-minute interactive lesson in verifying
AI-assisted changes**, not as a generic software-testing game, a coding puzzle,
or a QA automation product.

The winning sentence is:

> **AI can make a change quickly. Kaiju QA teaches new developers to add the
> edge case, catch the regression, choose the bounded fix, and earn the right to
> ship.**

The submission should make one chain impossible to miss:

`happy path → missing edge case → broad fix → new regression → targeted fix → full-suite gate → release`

That chain is simultaneously the learning outcome, the product experience, the
technical proof, and the novelty story. Protect it before adding city dressing,
particles, extra guardrails, or XR polish.

The current root `README.md` still describes the Hello World boilerplate. That
is a major judging liability until the orchestrator replaces it with a
Kaiju-QA-specific judge path and Codex/GPT-5.6 collaboration record.

## Official requirements that shape the build

The Official Rules control if any overview copy differs. [O1][O2]

| Official requirement | Implementation/submission consequence |
| --- | --- |
| Submission closes **July 21, 2026 at 5:00 p.m. Pacific Time**. | Freeze the core loop early enough to record, upload, verify public playback, and complete the form before the deadline. Do not plan a last-minute three-minute export. |
| Judging runs **July 22 through August 5, 2026, ending at 5:00 p.m. Pacific Time**. | Keep the playable build, repository access, and any credentials free and unrestricted through the end of judging. |
| Stage One is pass/fail for baseline viability: the project must reasonably fit the theme and use the required tools. | The first README screen and the first 20 seconds of narration must explicitly say it was built with **Codex using GPT-5.6** and is an Education project about responsible AI-assisted development. |
| Stage Two uses four **equally weighted** criteria. | Treat each as effectively 25%; do not let spectacle substitute for impact evidence or let process documentation substitute for a coherent game. Tie-breaking starts with the first criterion, Technological Implementation. |
| Submit a working project, one category, and a text description of features and functionality. | The judge path must work without narration, login, backend setup, sample-data import, or a headset. |
| Submit a **public YouTube video shorter than three minutes**. Judges need not watch beyond three minutes. The video must have audio covering what was built and how Codex and GPT-5.6 were used. | Target **2:30–2:40**, use captions as well as narration, and reserve 20–25 seconds for concrete Codex/GPT-5.6 evidence. |
| Provide a code repository URL. It must be public with relevant licensing, or private and shared with `testing@devpost.com` and `build-week-event@openai.com`. | Confirm access in a logged-out/private window. Put the license and asset provenance in the repository before submission. |
| The README must explain Codex collaboration, where Codex accelerated work, where humans made product/engineering/design decisions, and how GPT-5.6 and Codex contributed. | Include one specific accepted Codex contribution and one suggestion that humans rejected or narrowed. This makes the collaboration credible rather than ceremonial. |
| Provide the `/feedback` Codex Session ID for the thread where most core functionality was built. | Capture it before the form closes and place it in the submission form; retain a matching dated collaboration summary in the README. |
| Pre-existing projects are evaluated only on work meaningfully added during the Submission Period, which began **July 13, 2026 at 9:00 a.m. Pacific Time**. | Distinguish boilerplate from Kaiju QA with dated commits, the feature plan, prompt log, and a concise “What we built during Build Week” section. |
| Submission materials must be English or include English translations; third-party code, data, music, trademarks, and assets require authorization. | Use English UI/captions and either original code-native art/audio or an explicit license/provenance register. Do not use recognizable kaiju franchises, logos, or unlicensed music. |

## Criterion-by-criterion win strategy

### 1. Technological Implementation — equal weight, first tie-breaker

**Judge question:** How thoroughly and skillfully does the project use Codex?
Does the code show genuine effort and a working, non-trivial implementation?

**Winning implementation:**

- Make the pure TypeScript game model the technical center: explicit scenario
  states, guardrail choices, deterministic outcomes, persistent attempt history,
  full-suite evaluation, and a release transition that is impossible while a
  test is failed or untested.
- Encode the important interaction, not just the animation. The broad
  `FREEZE NEAR BUILDINGS` policy must pass the tower case and fail the ambulance
  case; `SLOW IN STRIPED ZONES` must preserve the baseline and pass the suite.
- Keep rendering as a faithful projection of model state. A judge should be
  able to see that a reproducible rule system—not a timed cutscene—drives every
  result.
- Prove desktop mouse/keyboard and mobile touch through the same semantic
  actions. Preserve the WebXR path, but claim XR support only at the level
  actually exercised and recorded.
- Prefer a small transition/model test plus the planned browser E2E over extra
  decorative content. The most valuable assertions are: broad-fix regression,
  targeted-fix pass, release lock, retry/reset, keyboard path, mobile layout,
  and reduced-motion behavior.

**Judge-facing proof:** architecture diagram or short state table; relevant
source paths; passing `typecheck`, production build, and E2E output; exact
commit; dated Codex session/process record; and one sentence explaining the
human decision to keep outcomes deterministic and model-independent.

**Do not lead with:** file count, agent count, lines of code, or “AI built it.”
Lead with the non-trivial rule interaction and the evidence that it works.

### 2. Design — equal weight

**Judge question:** Is this a complete, coherent, runnable product rather than
a technical proof of concept?

**Winning implementation:**

- A cold player sees the goal, the currently required action, and the release
  state immediately. No presenter should need to explain where to click.
- Use one visual grammar throughout: scenario cards/props, route traces,
  pass/fail/untested badges, a persistent suite board, and a visibly locked or
  unlocked release control.
- Make the regression readable in motion and in a still frame: the tower is
  protected, but the ambulance route is visibly blocked by the same broad
  policy.
- Keep failure kind and recoverable. The player should understand what evidence
  is missing and retry with one action.
- The final guardian transformation should be a payoff for verified release,
  not a disconnected animation. It should not trigger until every authored test
  has run and passed.
- Essential state must have text/icon/shape cues in addition to color. Keyboard
  focus, touch target size, captions, and reduced-motion behavior are product
  coherence, not appendix features.

**Judge-facing proof:** mostly uninterrupted gameplay in the video; one
regression screenshot; one all-pass/release screenshot; desktop and mobile
captures; no console errors; and a 30-second quick-start path at the top of the
README.

### 3. Potential Impact — equal weight

**Judge question:** Does the project make a credible, specific case for a real
problem, a real audience, and a solution demonstrated by the product?

**Winning positioning:**

- **Audience:** first-year CS/software-engineering students, bootcamp learners,
  and career switchers who can ask AI for a change but do not yet have strong
  verification and release judgment. Secondary audience: instructors who need
  a short formative activity.
- **Problem:** fast, plausible AI output encourages novices to accept the happy
  path, patch the visible failure, and stop before checking regressions.
- **Demonstrated learner behavior:** the player adds an edge case before
  changing behavior, sees an over-broad fix break a prior requirement, compares
  evidence, selects the more targeted policy, and releases only after the full
  suite passes.
- **Practical use:** a deterministic three-minute classroom opener, lab
  debrief, or onboarding exercise that works in an ordinary browser.

Add a ten-second debrief after release with three concrete prompts:

1. Which new test exposed the hidden risk?
2. Why did the first fix create a regression?
3. What evidence justified release?

This turns a memorable spectacle into an assessable learning artifact. If no
learner pilot occurs, say **“designed to practice”** and **“demonstrates”**—not
“proven to improve learning.”

**Judge-facing proof:** named audience, observable learning objective, the
in-product debrief, deterministic replay/reset, and a concise instructor-use
scenario. A real pilot quote or completion observation is valuable only if it
actually occurs and is documented.

### 4. Quality of the Idea — equal weight

**Judge question:** How creative and novel is the concept, and how clearly does
it differ from existing concepts?

**Winning differentiation:**

- The player is the quality/release owner, not the kaiju, coder, commander, or
  prompt author.
- The main verb is **stage a test and choose a guardrail**, not write commands,
  connect nodes, build a factory, fight a monster, or chat until an answer
  appears.
- The toy is persistent evidence: routes, coverage, pass/fail state, and prior
  attempts remain visible and comparable.
- The central surprise is causal: a plausible broad fix solves the new test and
  breaks an earlier one.
- The score is justified confidence and the least-risk authored change, not
  throughput, shortest code, fewest pieces, speed, or destruction.
- The climax is an explicit release gate and guardian transformation, giving QA
  a playful hero fantasy that is rarely the center of an educational game.

**Judge-facing proof:** show the broad-fix regression before describing the
genre; compare against categories of familiar games rather than claiming to be
the first or only example.

## Education-track positioning

The official Education description is: projects that specifically push forward
AI for education by helping students, teachers, or educational organizations.
[O1] Kaiju QA should therefore foreground **AI literacy and judgment**, not
generic QA vocabulary.

Recommended submission copy:

- **Project title:** `Kaiju QA`
- **Subtitle:** `A three-minute game about testing AI-assisted change`
- **Tagline:** `Catch the regression. Earn the release.`
- **One-sentence pitch:** `Kaiju QA is a browser-based learning game where new
  developers test a helpful baby kaiju, catch an over-broad fix, and use
  regression evidence to choose the smallest safe guardrail before release.`
- **Problem statement:** `AI can produce a convincing change before a learner
  has learned how to prove that the change preserves every important behavior.`
- **Outcome statement:** `Players practice adding an edge case, reading
  external evidence, protecting prior requirements, and gating release on a
  complete test suite.`

Use “Loop Engineering” as a secondary explanatory frame only after the familiar
problem is clear. Do not require a judge to understand a new industry term in
order to understand the product.

To avoid being mistaken for a Developer Tools entry:

- call it a **learning game** or **interactive lesson**, not a testing platform;
- show learner decisions and debrief questions, not dashboards and integrations;
- name the novice audience in the first paragraph and first 20 seconds;
- explain that the deterministic simulation teaches how to supervise
  AI-assisted work; it does not run production QA or certify real systems.

## Differentiation and collision scan

The concept-branch market scan found promising whitespace at the intersection
of cross-device spatial play, acceptance criteria, regression evidence, and an
explicit release decision. That is a bounded finding, not proof of uniqueness.

| Collision cluster | Risk to Kaiju QA | Design/marketing defense |
| --- | --- | --- |
| **Programming puzzles** such as *Human Resource Machine*, *Lightbot*, and *CodeCombat* [C1–C3] | Command cards, tiled movement, or typed code would make the game read as another learn-to-code puzzle. | Never show an instruction list or code editor as the core interaction. The player authors tests/constraints and evaluates behavior. |
| **Factory, node, and signal games** such as *Factorio* and *The Signal State* [C4][C5] | Colored flows, cables, ports, or throughput scoring would erase the QA fantasy. | Use a civic miniature, scenario props, route evidence, and a release seal. Score suite coverage and preserved behavior. |
| **Prompt/challenge games** such as *Gandalf* [C6] | “Try another prompt until the AI behaves” is a saturated and weaker lesson. | There is no chat-box win condition. The player changes a bounded policy only after adding and reading tests. |
| **Clean diorama iteration games** such as *Poly Bridge 3* and *Mini Motorways* [C7][C8] | The tabletop city and replayed routes may initially read as a physics or traffic optimization puzzle. | Put explicit `BASELINE`, `EDGE CASE`, `REGRESSION`, `FULL SUITE`, and `RELEASE LOCKED` language in the hero frame. Avoid freeform road building or physics scoring. |
| **QA/testing platforms for games** such as Regression Games [C9] | The name “Kaiju QA” could sound like a commercial automated-testing tool. | Say “interactive lesson” in the subtitle. Show a learner choosing among authored guardrails, not a test-generation dashboard. |
| **Generic AI tutor/quiz demos** | Education entries often explain concepts through chat or multiple choice, which can make any instructional project look interchangeable. | Lead with the consequential animated regression. The answer is embodied in system behavior, not revealed by a tutor. |
| **Kaiju combat/pet fantasy** | A cute monster thumbnail may be read as a creature game with education added later. | The suite board, scenario fixtures, blocked ambulance, route traces, and release seal must share the frame with the kaiju. Never use combat, health bars, feeding, or destruction as the reward. |

Defensible concept fingerprint:

- **Role:** QA/release owner
- **Verb:** stage test → inspect trace → authorize bounded guardrail
- **Object:** a helpful but unsafe behavior
- **Failure signature:** one fix passes a new case and regresses an old case
- **Memory:** persistent scenario coverage and prior routes
- **Success metric:** all authored requirements preserved
- **Climax:** release unlocks the city guardian

If any of those are removed, the pitch becomes easier to confuse with a generic
kaiju game, coding game, or simulation puzzle.

## Thumbnail and first-ten-seconds hook

### Hero thumbnail

Use an actual gameplay capture, not concept art. The strongest frame is the
broad-fix regression:

- center: baby kaiju paused inside a large visible freeze boundary;
- one side: fragile tower upright with a clear `PASS` shield;
- other side: ambulance blocked behind the same boundary with a `FAIL` route
  marker and striped emergency lane;
- top or lower-third suite strip: `TOWER ✓  AMBULANCE ✕  RELEASE LOCKED`;
- thumbnail text, at most four words: **`ONE FIX. NEW FAILURE.`**

The image must still read when small and in grayscale. Use labels, symbols,
route shape, and barrier geometry in addition to red/green.

### First 10 seconds of the video

| Time | Picture | Audio/caption |
| --- | --- | --- |
| 0:00–0:02 | Kaiju safely moves a stalled car; one test turns to partial pass. | `Helpful on the happy path.` |
| 0:02–0:05 | A fragile-tower fixture appears; the same route visibly topples or threatens it. | `Unsafe at the edge.` |
| 0:05–0:08 | The broad freeze policy protects the tower but blocks the ambulance. | `The obvious fix breaks rescue.` |
| 0:08–0:10 | Freeze on the suite board and locked release; title appears. | **“AI can make the change. Can you prove it is safe to ship?”** |

Do not open on the title, team introduction, code, menus, or a slow orbit of the
city. The regression is the marketing asset.

## Judge-ready claims and required proof

Use these only when the proof exists.

| Safe claim | Minimum proof before using it |
| --- | --- |
| `A deterministic three-minute learning game about verifying AI-assisted change.` | Timed cold-start playthrough under three minutes; deterministic replay; Education framing in product and README. |
| `Players catch an over-broad fix through regression evidence and release only after the full suite passes.` | Visible ambulance regression, persistent suite state, targeted-policy pass, and enforced release lock. |
| `The same complete lesson works with mouse/keyboard and mobile touch from one browser codebase.` | Recorded desktop and mobile completion, keyboard E2E, responsive screenshot, and no critical console/network errors. |
| `The critical lesson needs no account, backend, or live model call after the page loads.` | Network inspection and successful fresh-session run; no hidden dependency on remote APIs or downloaded runtime content. Do not call this “offline” unless offline loading is tested. |
| `Kaiju QA includes keyboard, non-color status cues, captions, and reduced-motion behavior.` | Each feature implemented and independently exercised; avoid “fully accessible” or compliance claims without a formal audit. |
| `Codex with GPT-5.6 accelerated planning, implementation, testing, and review while humans owned scope, learning goals, and release decisions.` | Dated prompt/session evidence, feature plan, commits, test artifacts, named examples of acceleration, and at least one human correction/rejection. |
| `WebXR-capable` or `works in VR.` | Actual IWER/headset entry, interaction, exit/re-entry, and evidence. If runtime verification remains deferred, say only that the existing WebXR entry path was preserved and do not feature XR in the headline. |

## Demo evidence plan

Target runtime: **2:35**, leaving safety margin below the official three-minute
limit.

| Time | Required evidence |
| --- | --- |
| 0:00–0:10 | The hook above: happy path, edge failure, broad-fix regression, locked release. |
| 0:10–0:22 | Name the audience and problem: novice AI-assisted developers need practice verifying plausible changes. Show the goal and test board, not slides. |
| 0:22–1:22 | Mostly uninterrupted player journey: run baseline, add tower case, inspect failure, select broad guardrail, discover blocked ambulance. Let the game prove coherence. |
| 1:22–1:52 | Compare evidence, choose targeted striped-zone policy, rerun full suite, unlock release. |
| 1:52–2:07 | Guardian payoff plus debrief. Quick desktop/keyboard/mobile proof; include XR only if actually verified. |
| 2:07–2:30 | Show repository evidence: pure model, regression/release-gate test, build/E2E result, plan/prompt history. Narrate exactly how Codex and GPT-5.6 accelerated work and where humans made or corrected decisions. |
| 2:30–2:35 | Return to hero frame, playable URL/project name, and one-line Education impact. |

Recording rules:

- Use actual build footage and normal-speed interaction; no mockup presented as
  gameplay.
- Narration must explicitly say both **Codex** and **GPT-5.6**.
- Add burned-in or YouTube captions, but do not rely on captions instead of the
  required audio.
- Keep UI text large enough for a judge watching in an embedded player.
- Avoid copyrighted music, franchise references, long architecture slides, and
  sped-up coding montages.

## README and repository proof plan

Recommended README order:

1. **Playable URL + hero image + 30-second quick start.** State the tested
   browser/device and exact commit.
2. **What Kaiju QA is.** One paragraph with learner, problem, interaction, and
   outcome.
3. **Judge path.** Six numbered actions from `Run baseline` to `Release`, plus
   reset/retry controls.
4. **What the player learns.** Observable behavior, not a vocabulary list.
5. **Feature and platform matrix.** Desktop, keyboard, mobile, reduced motion,
   and only the XR status actually tested.
6. **Technical implementation.** Pure state model, deterministic authored
   simulation, persistent attempt evidence, release gate, IWSDK rendering, and
   semantic DOM controls.
7. **Verification.** Exact commands and results for `npm run typecheck`,
   `npm run build`, and `npm run test:e2e:run`; link the critical E2E spec and
   evidence captures.
8. **How Codex + GPT-5.6 were used.** Where they accelerated discovery,
   implementation, testing, and review; key human decisions; one rejected or
   narrowed suggestion; main `/feedback` session ID in the submission form.
9. **Built during the submission period.** Separate pre-existing IWSDK
   boilerplate from Kaiju QA work with dates/commits.
10. **Accessibility and limitations.** Concrete implemented behaviors; disclose
    untested headset/runtime status rather than implying certification.
11. **Assets, licenses, and provenance.** Include code, fonts, music/audio,
    generated imagery, and third-party asset licenses.

Minimum evidence set for the submission package:

- public deployed URL tested from a logged-out browser;
- public YouTube URL tested in a logged-out browser;
- final commit SHA and submission-period commit history;
- `01-desktop.webp`, `02-mobile.webp`, a regression hero frame, and an all-pass
  release frame;
- passing check output and the browser E2E covering wrong-choice recovery and
  release gating;
- current browser/device matrix and known limitations;
- asset/license/provenance register;
- Codex/GPT-5.6 collaboration narrative and `/feedback` session ID;
- repository permissions verified for both judge addresses if private.

## Risky claims and framing to avoid

- **“The first,” “the only,” “unlike any game,” or exhaustive uniqueness.** The
  scan is bounded and is not trademark or market clearance.
- **“Proven learning gains,” “teaches mastery,” or “makes students safer.”** No
  efficacy claim without a real documented study or pilot.
- **“Professional QA training” or “production certification.”** This is an
  introductory authored practice experience.
- **“The AI kaiju learns” or “powered by live GPT.”** Outcomes are deterministic
  and preauthored; that is a reliability advantage, not something to obscure.
- **“The smallest safe fix” as a universal optimization claim.** Say “the most
  targeted of the authored options” unless minimality is formally defined.
- **“Fully accessible,” “WCAG compliant,” or equivalent certification.** Name
  the actual keyboard, motion, caption, contrast, and non-color behaviors tested.
- **“Works on every device,” “full cross-platform parity,” or “VR-ready.”** List
  exact tested surfaces. Preserve but do not market unverified XR.
- **“Offline.”** “No account, backend, or live model call on the critical path”
  is safer unless cold offline loading is tested.
- **“Built entirely by AI.”** It weakens the ownership story and contradicts
  the required explanation of human decisions.
- **“Original assets”** if any third-party or generated assets remain. Name
  provenance and licenses precisely.
- **“Loop Engineering is an industry standard.”** Present it as the project’s
  memorable frame for a familiar evidence-and-release discipline.
- Any recognizable franchise name, kaiju character silhouette, logo,
  copyrighted music, or mockup shown without being labeled as concept material.

## Highest-priority implementation asks

1. Make the **broad-fix ambulance regression** unmistakable in motion and in one
   thumbnail-sized still.
2. Enforce and visibly explain the **full-suite release lock** in the game model,
   UI, animation, and E2E.
3. Add the short **post-release debrief** so the Education outcome is assessable
   rather than inferred.
4. Replace the boilerplate README with a **judge-first playable path and
   Codex/GPT-5.6 proof record** before visual polish expands.
5. Record only verified platform claims; prioritize a flawless desktop/mobile
   judge path over unverified XR marketing.

## Sources

Official competition sources, accessed **2026-07-20**:

- **[O1] OpenAI Build Week overview and category/submit/criteria page:**
  <https://openai.devpost.com/>
- **[O2] OpenAI Build Week Official Rules:**
  <https://openai.devpost.com/rules>

Comparable-product sources, accessed **2026-07-20**:

- **[C1] Human Resource Machine:**
  <https://tomorrowcorporation.com/humanresourcemachine>
- **[C2] Lightbot:** <https://lightbot.com/>
- **[C3] CodeCombat:** <https://codecombat.com/>
- **[C4] Factorio:** <https://www.factorio.com/>
- **[C5] The Signal State:** <https://signalstate.io/>
- **[C6] Gandalf:** <https://www.lakera.ai/gandalf>
- **[C7] Poly Bridge 3:** <https://www.polybridge3.com/>
- **[C8] Mini Motorways:**
  <https://dinopoloclub.com/games/mini-motorways/>
- **[C9] Regression Games:** <https://regression.gg/>

Internal read-only research basis:

- `docs/design/loop-engineer-concepts/DEVPOST_SUBMISSION_DRAFT.md` on
  `codex/loop-engineer-concepts`
- `docs/design/loop-engineer-concepts/PROPOSALS.md` on
  `codex/loop-engineer-concepts`
- `plans/loop-engineer-concepts/agent-notes/market-research.md` on
  `codex/loop-engineer-concepts`
