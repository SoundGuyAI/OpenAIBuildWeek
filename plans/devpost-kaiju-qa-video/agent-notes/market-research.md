# OpenAI Build Week market and submission research

Role: Devpost market researcher  
Verified: 2026-07-20 UTC  
Scope: official competition facts, compliance risks, and recommendations for a
sub-three-minute Kaiju QA demo video. Facts and recommendations are separated
below. This is production guidance, not legal advice.

## Executive decision

**Official fact:** The submission deadline is **Tuesday, July 21, 2026 at
5:00 PM PDT** (8:00 PM EDT; 00:00 UTC on July 22). The official overview and
Official Rules agree. The video must be a public YouTube demo, under three
minutes, with audio explaining both the working project and how Codex and
GPT-5.6 were used.[1][2]

**Recommendation:** Enter **Education**. Kaiju QA's documented primary users
are learners and instructors, and its core outcome is practice in acceptance
criteria, evidence, regression testing, and release judgment. Developer Tools
is a plausible secondary positioning, but it is weaker than the explicit
education audience already documented in the concept.

**Material compliance risk:** The concept worktree describes what Kaiju QA
*will* be and the video plan currently allows a no-capture concept
visualization. A concept animatic can explain the idea, but it is not a safe
substitute for the required demonstration of a working project. The rules say
the project must work as depicted in the video, and judges may choose not to
test it at all.[1] Therefore:

- Use verified capture of the working project for every player-action or
  functionality claim.
- Mark every synthetic, staged, HyperFrames, or generated scene with a
  persistent **"CONCEPT VISUALIZATION - NOT GAMEPLAY"** label.
- If no verified gameplay capture exists, position this render as a **concept
  trailer / edit-ready animatic**, not the final qualifying Devpost demo.
- Obtain actual capture on another machine if necessary; this worktree must not
  launch IWSDK, IWER, WebXR, or a runtime server.

## Official competition facts

### Dates

| Event | Official timing |
| --- | --- |
| Registration | July 9, 2026 at 10:00 AM PT through July 21, 2026 at 5:00 PM PT |
| Submission | July 13, 2026 at 9:00 AM PT through July 21, 2026 at 5:00 PM PT |
| Judging | July 22, 2026 at 10:00 AM PT through August 5, 2026 at 5:00 PM PT |
| Winners | On or around August 12, 2026 at 2:00 PM PT |

Source: Official Rules section 1; the public overview independently displays
"Deadline: Jul 21, 2026 @ 5:00pm PDT."[1][2]

**Recommendation:** Treat **2:00 PM PDT on July 21** as the internal delivery
cutoff. YouTube processing, visibility checks, Devpost form edits, repository
access, and the `/feedback` session ID all need margin. This earlier cutoff is
not an official deadline.

### Categories

The rules require the entrant to choose the category that best aligns with the
project. The four categories are:[1]

1. **Apps for Your Life** - consumer apps for everyday life.
2. **Work and Productivity** - tools that make teams faster or more effective.
3. **Developer Tools** - developer-facing testing, DevOps, agentic workflow,
   and security tools.
4. **Education** - projects that advance AI for students, teachers, or
   educational organizations.

**Recommendation:** Choose **Education** and state the audience concretely:
first-year CS/software-engineering students, bootcamp learners, career
switchers, and instructors. Avoid splitting the pitch between "education game"
and "professional QA tool"; judges should know the category fit in one sentence.

### Demo-video and submission rules

The official requirements are:[1][2]

- Submit a working project built with Codex using GPT-5.6.
- Include a project description and choose one best-fit category.
- Include a **demonstration video shorter than three minutes**. Judges are not
  required to watch beyond three minutes.
- The video must include a **clear demo with audio** covering what was built and
  how Codex and GPT-5.6 were used.
- Upload the video to YouTube, make it publicly visible, and provide its link on
  Devpost.
- Do not include third-party trademarks, copyrighted music, or other protected
  material without permission.
- Provide a repository URL. It may be public with relevant licensing, or private
  and shared with the two judging email addresses named in the rules.
- The README must explain the Codex collaboration: where it accelerated work,
  where humans made product/engineering/design decisions, and how Codex and
  GPT-5.6 contributed.
- Provide the `/feedback` Codex Session ID for the project thread where most
  core functionality was built.
- Provide free, unrestricted access to the working project through the end of
  judging. Judges may evaluate only the description, images, and video rather
  than run the project.
- Submission materials must be in English or include an English translation.

An official organizer update adds two useful clarifications: production polish
is optional, but functionality and the Codex/GPT-5.6 story are not; a basic
screencast with background music alone does not satisfy the requirement. The
same update explicitly permits AI-generated voice-over.[3]

### Judging

Stage one is pass/fail: the project must be viable, fit the theme, and
reasonably use the required featured tools. Stage-two entries are scored on four
**equally weighted** criteria:[1]

| Criterion | Official question | What the video must prove quickly |
| --- | --- | --- |
| Technological Implementation | How thoroughly and skillfully does the project use Codex, and is the implementation working and non-trivial? | Real interaction, deterministic state/testing behavior, and concrete Codex/GPT-5.6 artifacts rather than generic AI claims. |
| Design | Is it a complete, coherent, runnable product rather than only a technical proof of concept? | One understandable beginning-to-end play loop with readable controls, state, feedback, and release payoff. |
| Potential Impact | Is there a credible, specific real problem and audience, and does the demonstrated solution address it? | Name the learner, show the decision they practice, and use "designed to practice" rather than asserting unmeasured learning gains. |
| Quality of the Idea | Is the concept creative, novel, and meaningfully different from existing concepts? | Make the player-as-QA-engineer role and the physicalized regression the memorable differentiator. |

Tie-breaking starts with the first listed criterion, Technological
Implementation.[1] That makes a concise, evidence-backed Codex/GPT-5.6 segment
more valuable than extra cinematic atmosphere.

## IP and truthfulness constraints

### Official facts

- The project must install/run consistently on its intended platform and
  **function as depicted in the video and text description**.[1]
- If it existed before the submission period, only the meaningful extension
  made during the period is evaluated. Prior and new work must be clearly
  distinguished with dated evidence such as Codex sessions or commits.[1]
- Third-party SDKs, APIs, and data require authorization and compliance with
  their terms and licenses.[1]
- The submission must be the entrant's original work product, be solely owned
  by the entrant/team/organization, and not violate copyright, trademark,
  patent, contract, privacy, publicity, or other rights.[1]
- Open-source components are allowed when their licenses are followed and the
  submission adds to the underlying product.[1]
- The video may contain third-party copyrighted material only with permission;
  this expressly includes music and trademarks.[1]
- Entrants retain IP, while granting the sponsor a non-exclusive judging
  license. The sponsor and Devpost may use contributor names, likenesses,
  voices, and images to promote the hackathon and its results for three years.[1]
- The Official Rules and hackathon website are the source of truth; plugin or
  AI-generated competition guidance does not override them.[1]

### Recommendations for this production

- Prefer original HTML/CSS/SVG visuals, original audio, generated materials
  with confirmed provider rights, or **CC0** assets. Quaternius states on its
  official FAQ that all models are CC0 and may be used in commercial,
  educational, and personal projects without attribution.[4] Still log the
  exact pack URL, asset names, download date, and a saved license record.
- Avoid logos, recognizable branded interfaces, famous character likenesses,
  real product packaging, and branded emergency vehicles. "Kaiju" is a generic
  monster concept; do not imitate a recognizable franchise monster.
- Use no music unless its synchronization/public-video rights are documented.
  The voice-over is required value; music is optional risk.
- AI voice-over is allowed, but do not clone an identifiable person's voice
  without permission. Preserve the provider, voice ID, generation date, and
  terms record.
- For Azure-generated images, preserve prompts, model/provider, generation
  date, and the applicable use terms. Review outputs for accidental brands,
  celebrity likenesses, and copyrighted-character resemblance.
- Keep a shot-level provenance ledger. Each shot should say `actual gameplay`,
  `repository/process evidence`, `original motion graphic`, `CC0 asset`, or
  `generated concept visualization`.

## Recommended 92-second judge cut

The optimal cut is shorter than the rule ceiling. It gives judges a complete
causal story, leaves upload/encoding safety margin, and supports one viewing
without rewinding. Aim for roughly **190-210 spoken words** with burned-in
captions.

| Time | Picture and narration job | Criterion served |
| --- | --- | --- |
| 0:00-0:08 | Open on the fragile tower failure. Ask: "AI can make a change in seconds. Can you prove it is safe?" Show real capture, or visibly label the scene as concept visualization. | Comprehension, idea |
| 0:08-0:15 | State the promise: "Kaiju QA makes regression testing playable. You are the quality engineer, not the monster fighter." | Design, idea |
| 0:15-0:24 | Happy path: the kaiju carries the stalled car; mark it `PARTIAL PASS`, not success. | Design |
| 0:24-0:33 | Add the fragile tower edge case; the same helpful behavior topples it. | Design, impact |
| 0:33-0:43 | Apply the broad "freeze near buildings" fix; the tower survives, but the ambulance is blocked. Let the visual joke land for one beat. | Idea, comprehension |
| 0:43-0:54 | Compare evidence from both runs and place the targeted slow-zone boundary. Show the least-risk change, not unexplained magic. | Technology, education impact |
| 0:54-1:02 | Run the full suite: car, tower, ambulance. Only then stamp release. Recap visually: `GOAL -> CHANGE -> EVIDENCE -> REGRESSION -> RELEASE`. | Design, impact |
| 1:02-1:17 | Show two or three verified artifacts: a Codex planning/session excerpt, the implemented state/test logic, and a passing check or dated commit. Say exactly what Codex/GPT-5.6 did and name one human decision. | Technological implementation |
| 1:17-1:28 | Name the audience and restrained impact: "a short practice space for learners to build verification judgment." If verified, show desktop/mobile/XR parity; otherwise say it is the target, not current fact. | Potential impact |
| 1:28-1:32 | End card: title, category, public demo/repository cue, and any required concept-visualization disclosure. | Recall, compliance |

Editing rule: every shot should communicate one state change. Keep the city and
camera axis stable across the happy path, failed edge case, regression, and
final pass so judges perceive a test loop rather than four unrelated scenes.
Use consistent non-color labels (`PASS`, `FAIL`, `REGRESSION`) in addition to
color.

## Claim-safety matrix

| Status | Safe wording | Wording to avoid until proven |
| --- | --- | --- |
| Concept-only visual | "This concept visualizes..." / "Kaiju QA is designed to..." / "The proposed player loop..." | "Gameplay footage" / "Players can..." / "The game runs..." |
| Working feature with capture and test evidence | "In the current build, the player..." / "The deterministic test reruns all three scenarios..." | Claims broader than the captured/tested behavior |
| Cross-platform target | "Designed for desktop, mobile, and WebXR" | "Runs on desktop, mobile, and WebXR" without verified evidence for all three |
| Learning value | "Designed to practice acceptance criteria and regression judgment" | "Proven to improve learning," "teaches mastery," or quantified gains without a pilot |
| AI behavior | "Preauthored deterministic outcomes make evidence repeatable" | "The kaiju learns/adapts in real time" if no live model does so |
| Codex/GPT-5.6 | "Codex produced X; the team accepted/rejected Y; GPT-5.6 contributed Z" with dated proof | Generic "built by AI" montage or naming tools without evidence |
| Novelty | "Turns test coverage into a miniature city and regression into the core toy" | "First," "only," or "never been done" without defensible market evidence |

## Final pre-upload gate

- [ ] Duration is under 3:00; recommended final duration is 1:25-1:40.
- [ ] YouTube visibility is **Public**, not unlisted/private, and playback works
  in a signed-out window.
- [ ] Voice-over audibly explains what was built and Codex **and** GPT-5.6 use.
- [ ] At least one continuous segment visibly demonstrates the working project.
- [ ] Every non-gameplay mock scene carries the concept disclosure for its full
  duration.
- [ ] Every functionality sentence is backed by capture, repository evidence,
  or a test; otherwise it is phrased as a design target.
- [ ] Education audience, practiced decision, and differentiator are each said
  once in plain English.
- [ ] Third-party assets, music, fonts, voices, and generated images have a
  complete rights/provenance record.
- [ ] No third-party trademarks or recognizable franchise designs appear.
- [ ] Repository access, README collaboration account, setup instructions, and
  `/feedback` Codex Session ID are ready before submitting.
- [ ] Devpost description and video use the same claims and distinguish old work
  from submission-period work.

## Sources and checks

1. [OpenAI Build Week Official Rules](https://openai.devpost.com/rules),
   especially sections 1, 4, 5, 6, 7, and 8. Retrieved 2026-07-20 UTC.
2. [OpenAI Build Week overview and requirements](https://openai.devpost.com/).
   Retrieved 2026-07-20 UTC; deadline and submission summary matched the rules.
3. [Official organizer update: submissions and plugin launch](https://openai.devpost.com/updates/45282-openai-build-week-submissions-are-open-plugin-launch),
   published 2026-07-17. Checked for video-quality and AI voice-over guidance.
4. [Quaternius official FAQ](https://quaternius.com/faq.html). Retrieved
   2026-07-20 UTC; checked the site's CC0/no-attribution statement.
5. Read-only local concept sources checked:
   `PROPOSALS.md` Kaiju QA section (player loop, target, differentiator, and
   implementation intent) and `DEVPOST_SUBMISSION_DRAFT.md` (audience, impact
   claims, platform targets, and truthfulness warning) under
   `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/`.

No IWSDK/IWER/WebXR runtime, game server, build, or browser test was launched.

## Completion summary

- Verified the current official deadline, all four categories, video rules,
  two-stage judging method, equal weighting, tie-break order, IP terms, and the
  requirement that the project function as depicted.
- Recommended Education positioning and a 92-second cut that makes the full
  Kaiju QA regression loop retellable after one viewing.
- Identified concept-only footage as the main submission risk and supplied
  explicit labeling, claim wording, evidence, asset, and pre-upload controls.

