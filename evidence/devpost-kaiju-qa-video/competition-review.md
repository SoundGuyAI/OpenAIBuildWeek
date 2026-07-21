# Competition re-review: Devpost Kaiju QA video

Status: **BLOCK — major truthfulness and implementation-evidence remediation passes, but this is not yet a safe final Devpost demo**

Review date: 2026-07-21 UTC  
Reviewer role: independent competition and truthfulness reviewer  
Scope: current 95-second HyperFrames source, storyboard, narration, midpoint
snapshots, asset ledger, CI provenance, verified GitHub commit/run evidence, and
the live OpenAI Build Week rules. No submission, render, local game runtime,
IWSDK, IWER, Vite server, or video-source edit was performed.

## Re-review decision

The remediation materially changes the assessment:

- **Pass:** Kaiju QA is now evidenced as a working, non-trivial browser
  prototype rather than only a design concept.
- **Pass:** GitHub Actions run `29786685632` genuinely succeeded on
  `feature/kaiju-qa` commit
  `2674d397ad8cf88f7739874f22abbeed7640f9d5`.
- **Pass:** The source now uses real game-model, model-test, browser-E2E, commit,
  and CI evidence rather than video-production files as implementation proof.
- **Pass:** Synthetic frames 2–7 now carry a persistent
  `CONCEPT VISUALIZATION - NOT GAMEPLAY CAPTURE` overlay.
- **Pass:** Frame 8 clearly changes its evidence label between working-prototype
  browser captures, committed game evidence, and concept visualization.
- **Still blocking:** the working prototype is shown only through static
  end-state screenshots for roughly four seconds. That verifies output and CI,
  but does not clearly demonstrate a player operating the project.
- **Still blocking:** the animatic reports a `1 OF 3` baseline while the verified
  implementation and its CI screenshot report a baseline with **2 passes and
  the tower untested**. The video and working project should not contradict each
  other on the lesson's first evidence state.

The current cut is truthful enough to use as an internal concept-plus-evidence
trailer. It remains a strict **block** for final submission until the two content
issues above and the delivery/licensing gates below are closed.

## Official sources and access date

The following official pages were reread in their live rendered form on
2026-07-21 UTC:

1. OpenAI Build Week Official Rules: https://openai.devpost.com/rules
2. OpenAI Build Week overview and submission summary:
   https://openai.devpost.com/
3. Official organizer video guidance, published 2026-07-17:
   https://openai.devpost.com/updates/45282-openai-build-week-submissions-are-open-plugin-launch
4. Supported OpenAI API countries and territories, linked by the rules:
   https://platform.openai.com/docs/supported-countries

Verified implementation sources, accessed 2026-07-21 UTC:

5. GitHub Actions run:
   https://github.com/SoundGuyAI/OpenAIBuildWeek/actions/runs/29786685632
6. Verified commit:
   https://github.com/SoundGuyAI/OpenAIBuildWeek/commit/2674d397ad8cf88f7739874f22abbeed7640f9d5
7. Local CI provenance:
   `videos/kaiju-qa-devpost/assets/prototype/CI_PROVENANCE.md`

The Official Rules control if another page or summary conflicts with them. The
rules remain subject to amendment and should be checked again immediately
before submission.

## Official requirements and current status

| Requirement | Current official requirement, faithfully summarized | Current evidence | Result |
| --- | --- | --- | --- |
| Deadline | Submit by July 21, 2026 at 5:00 p.m. Pacific Time (July 22 at 00:00 UTC). Judging runs July 22 through August 5. | No final upload is recorded. | Pending / time-critical |
| Entrant eligibility | An individual must be of legal majority where they reside and be in a supported, non-excluded territory. Teams and organizations require an authorized eligible representative. | Not assessable from the video package. | Unverified external gate |
| Required project | Build a project with Codex and GPT-5.6 in one best-fit category. | Feature branch, model, tests, UI, CI, and browser evidence now establish a real Kaiju QA implementation. | **Pass for project existence** |
| New or extended work | New work must be created during the submission period, or a pre-existing project must be meaningfully extended with dated Codex/GPT-5.6 evidence. | Kaiju QA feature records and the verified commit are dated 2026-07-20, within the submission period. | Pass for dated implementation evidence; model/session provenance remains an external gate |
| Functionality | The project must install/run consistently on its intended platform and behave as depicted in the video or description. | Production build and desktop/mobile Chromium E2E passed. The central loop is exercised. One baseline-count contradiction remains between animatic and implementation. | **Partial; block until claims align** |
| Category | Choose the single category that best fits. Education covers students, teachers, and educational organizations. | The mechanic and README fit Education. The narration still does not name the learner/educator audience. | Category fit pass; impact message incomplete |
| Video duration | Demonstration video must be shorter than three minutes; judges need not watch beyond three minutes. | Source duration is 95 seconds. | Pass at source level |
| Clear demo and audio | The video must provide a clear demo with audio explaining what was built and how Codex and GPT-5.6 were used. | Audio names the build process and both required tools; frame 8 shows verified implementation evidence. The only direct prototype imagery is static end-state screenshots, not an observable interaction sequence. | Audio/process pass; **clear-demo block** |
| Video delivery | Upload the video publicly to YouTube and link it in the Devpost form. | No rendered MP4 or public YouTube URL is present. | **Block before submission** |
| Video IP | Third-party trademarks, copyrighted music, and other protected material require permission. | First-party CI screenshots are fully traced. Other media provenance gaps remain. | **Block pending rights evidence** |
| Repository | Provide a public repository with relevant licensing, or a private repository shared with both official judging addresses. | Repository exists; final visibility/licensing/share decision is not evidenced here. | Unverified external gate |
| README | Explain Codex acceleration, human product/engineering/design decisions, and the contribution of Codex and GPT-5.6. | The verified commit's README now contains a concrete collaboration account and explicit human constraints/narrowing decisions. | Pass for content; final repository access still pending |
| Codex session | Provide the `/feedback` session ID for the thread where most core functionality was built. | No qualifying session ID is included in this package. | Unverified external gate |
| Judge access | Keep a working project free and unrestricted through the end of judging; judges may rely only on submitted media instead of testing it. | CI proves buildability, but no public demo/test-build URL is recorded. | Unverified external gate |
| Language | Submission materials must be English or include English translations. | Narration, captions, and source copy are English. | Pass |

The organizer update still expressly permits recorded or AI-assisted
voice-over. It also says the video must show the project working and that a
music-only screencast is insufficient. The Kokoro narration is acceptable in
format once its usage-rights record is complete.

## Independent CI and implementation verification

The new implementation evidence is authentic and internally consistent:

- Workflow: `Pull request CI`, run `29786685632` (#13).
- Trigger/branch: pull request on `feature/kaiju-qa`.
- Head commit:
  `2674d397ad8cf88f7739874f22abbeed7640f9d5`.
- Job: `Typecheck, build, and browser E2E`.
- Conclusion: success, completed 2026-07-20 at 23:18:12 UTC.
- Successful steps include typecheck, production build, Chromium dependency
  installation, desktop/mobile Chromium E2E, and evidence upload.
- Artifact: `browser-evidence-29786685632-1`, ID `8478733358`, recorded digest
  `sha256:c702a872b924b478a4a3f4d52081272dd8f8f01c23239882ee4aa839bd903716`.
- Local desktop screenshot SHA-256:
  `ea8d71e3bcb07b91b05f1a613184867b286ee5dddecf313c9750542e1909ce56`.
- Local mobile screenshot SHA-256:
  `aaffb073883a1f42c13dfbb530eaf4d370424d4e822cad9d364df2eea0f2b529`.

The local screenshot hashes match `CI_PROVENANCE.md`; the run, head SHA,
artifact ID, artifact digest, and successful steps match GitHub metadata.

The verified commit also contains:

- `src/kaiju-qa/game-model.ts`: a deterministic state machine with baseline,
  tower failure, broad-regression, stale-evidence, targeted-pass, and release
  gating behavior;
- `tests/model/kaiju-qa-model.test.mjs`: six deterministic model tests; and
- `tests/e2e/hello-world.spec.ts`: a real browser interaction path that clicks
  through baseline, tower failure, broad ambulance regression, another wrong
  guardrail, targeted 3/3 pass, release, reset, desktop keyboard behavior, and
  mobile layout/reduced-motion checks while collecting runtime/network errors.

This resolves the previous finding that the video had no evidence of a working
project or non-trivial implementation.

## Clear-demo assessment

Frame 8 now opens with approximately four seconds of real CI screenshots under
`CI BROWSER CAPTURE - WORKING PROTOTYPE`, followed by committed code/test/CI
evidence. This is credible proof that the project built and reached the shown
release state.

It is not yet a sufficiently clear **demonstration** for a strict reading of
the official requirement:

- both images are static end states;
- no pointer, tap, keyboard action, state transition, regression, correction,
  or release action is visibly performed in the actual prototype;
- the interactive sequence viewers see in frames 2–7 remains an explicitly
  disclosed reconstruction; and
- a judge cannot distinguish from the video alone whether the screenshots came
  before or after a human/automated interaction without relying on the labels
  and CI metadata.

The CI run proves that those interactions occurred. The video still needs to
**show** at least one of them. The smallest sufficient repair is an 8–15 second
screen recording from the built prototype—local, remote, or CI-recorded—that
shows an input and its resulting state change. The strongest sequence is:

1. broad guardrail selected;
2. ambulance changes to `REGRESSION` and Release stays locked;
3. targeted striped-zone guardrail selected;
4. the suite changes to 3/3 pass; and
5. Release becomes enabled and is activated.

That clip can replace part of the reconstruction or the current screenshot
stage and does not require starting IWSDK/IWER on this machine.

## Judging-criteria coverage

Stage One is pass/fail for viability, theme fit, and reasonable use of required
featured tools. The verified implementation and CI make Stage One viability
substantially stronger, but the final submission still needs the required demo
and access materials.

Stage Two uses four equally weighted criteria. Tie-breaking begins with
Technological Implementation.

| Criterion | Current coverage | Assessment |
| --- | --- | --- |
| Technological Implementation | The video now names both required tools and shows a committed deterministic model, six model tests, exact commit/run identity, successful production CI, and desktop/mobile evidence. GitHub verification supports every displayed implementation artifact. | **Strong evidence; clear-demo execution still missing** |
| Design | The story remains coherent from partial evidence through regression, diagnosis, rerun, and release. The real prototype screenshots show a runnable product UI rather than only a technical proof of concept. | Strong, subject to correcting the baseline-count mismatch |
| Potential Impact | The mechanic visibly teaches acceptance criteria, bounded changes, regression judgment, and evidence-based release. The spoken cut still does not name the early-learner/teacher audience or classroom/replay use. | Good mechanism; underspecified audience |
| Quality of the Idea | Test coverage as a miniature city, the player as QA engineer, the regression as monster, and the tiny earned release stamp remain distinctive and highly retellable. | Strong |

## GPT-5.6 and Codex messaging

Current narration says GPT-5.6 and Codex shaped scoped plans, tests, and review.
That sentence now has meaningful visual support from the real model, test suite,
CI run, and feature README. The README also identifies explicit human product
constraints and suggestions that were intentionally narrowed.

Assessment:

- **Official video minimum:** likely pass, because audio covers both required
  tools and frame 8 shows concrete implementation outputs.
- **Truthfulness:** the CI proves the outputs, but does not by itself prove the
  model/version used to create them. Preserve the `/feedback` session and dated
  collaboration records as the source of that claim.
- **Competitive strength:** add one short human-decision example to the audio if
  timing permits. For example, Codex proposed broader spectacle; the team kept
  deterministic rules and a bounded release gate. This is a scoring improvement,
  not the remaining clear-demo blocker.

## Educational impact and novelty

The video makes the central lesson easy to retell: one successful case is not
coverage, a broad fix can regress an earlier requirement, and release is gated
by current evidence. The verified implementation now shows that this lesson is
encoded in an actual deterministic product rather than only a storyboard.

The remaining impact gap is audience specificity. A short line such as
`Kaiju QA gives early software learners a safe place to practice regression
judgment` would improve Education scoring without claiming measured learning
gains. This is non-blocking.

Novelty remains strong. Avoid unsupported first/only/unprecedented claims.

## Truthfulness and claim alignment

### Resolved

- `index.html` now overlays `CONCEPT VISUALIZATION - NOT GAMEPLAY CAPTURE` from
  9 to 78 seconds, covering reconstructed frames 2–7.
- Contact-sheet inspection confirms the disclosure appears on each sampled
  reconstructed frame.
- Frame 8 uses stage-specific labels:
  `CI BROWSER CAPTURE - WORKING PROTOTYPE`,
  `COMMITTED GAME EVIDENCE - 2674D39`, and then
  `CONCEPT VISUALIZATION - NOT GAMEPLAY CAPTURE`.
- The displayed paths `src/kaiju-qa/game-model.ts` and
  `tests/model/kaiju-qa-model.test.mjs`, the six-test claim, commit, CI run, and
  pass status all match verified repository evidence.
- `The working prototype completes the release loop` is supported by the E2E
  path and release-state screenshots.
- The cut does not claim XR runtime certification. The verified evidence is
  specifically desktop/mobile Chromium.

### Still blocking

The reconstructed happy-path frame presents `PARTIAL PASS - 1 OF 3` and the
narration calls it one happy path. The actual model's baseline records:

- car: pass;
- emergency lane/ambulance: pass; and
- fragile tower: untested.

The CI desktop screenshot also visibly lists `Baseline — 2 pass`. This creates
an avoidable contradiction within the same video. Because the rules require
the project to function as depicted, reconcile the animatic to the implemented
baseline—preferably `PARTIAL PASS - 2 OF 3 / TOWER UNTESTED`—or change the
implementation and tests to match the intended one-pass lesson.

The persistent disclosure is a real improvement, but its source styling is
only 12 px at 1920×1080 and appears very small in the contact sheet. The full
opening disclosure and stage labels preserve honesty, so this is not a separate
blocker; increasing the persistent label size and moving it into a safer title
margin would reduce YouTube/mobile readability risk.

## Licensing and IP review

New passes:

- The CI desktop/mobile captures are first-party project evidence.
- Their exact run, branch, commit, artifact ID/digest, file hashes, acquisition
  date, use, and disclosure are recorded.
- No third-party product UI or trademark is visible in the captures.

Existing passes remain:

- The reconstruction is original HTML/CSS/SVG.
- No Quaternius asset or music bed is used.
- Included fonts retain SIL Open Font License files and hashes.
- The Azure hero shows no obvious logo, watermark, celebrity, or recognizable
  franchise character.

Unresolved rights-evidence gates:

1. The Azure FLUX hero row still does not retain/link the applicable Azure/model
   output-use terms or generation record supporting public promotional use.
2. The Kokoro-82M `am_michael` row still lacks model/voice source, version,
   license, and public/promotional-use terms.
3. The SFX record still provides a generic Pixabay library/license statement
   rather than exact per-file source pages, uploaders, or download records.

These are provenance gaps, not findings of infringement. They remain release
blocks because the official rules require ownership or permission.

## Closing CTA

The closing remains judge-retellable and should be preserved:

- goal → change → evidence → gate;
- the regression is the real monster; and
- a Loop Engineer proves a change deserves to ship.

The newly verified evidence makes the slogan more credible. An audience line
belongs immediately before the slogan; the slogan itself does not need more
words.

## Blocking findings

### Video-content blockers

1. **No moving working-project demo:** verified static screenshots and CI prove
   the product exists, but do not visibly demonstrate a user action and result.
2. **Baseline contradiction:** the animatic says 1/3 while the implemented and
   CI-verified baseline is 2 passes plus one untested case.

### Delivery and rights blockers

3. **No final delivery artifact:** no rendered/probed MP4 or publicly visible
   YouTube URL exists yet.
4. **Incomplete rights provenance:** Azure output terms, Kokoro model/voice
   terms, and exact SFX origins remain unrecorded.
5. **Submission gates remain external:** entrant eligibility, final repository
   visibility/license or judge sharing, public free project access, and the core
   `/feedback` session ID are not evidenced as complete.

## Non-blocking findings

- The earlier no-working-project blocker is resolved.
- The earlier trailer-artifacts-versus-game-artifacts blocker is resolved.
- The earlier missing frames 2–7 disclosure blocker is resolved.
- Source duration is 95 seconds, 1920×1080 at 30 fps, with English narration
  and burned-in captions.
- AI-assisted narration is allowed by official organizer guidance.
- Desktop/mobile CI, deterministic model behavior, six model tests, and the
  complete browser interaction path are credible and well sourced.
- Frame 8's evidence-stage labeling is unusually clear and truthful.
- Education remains the best-fit category.
- Naming the learner audience would materially improve Potential Impact.
- The 12 px persistent disclosure should be enlarged for YouTube/mobile
  legibility.
- XR remains honestly deferred and is not implied by the new CI evidence.

## Release recommendation

**Do not submit the current source as the final Devpost demo.** The previous
concept/implementation truthfulness problems are mostly resolved; the remaining
minimum content repair is small but important.

Before final release:

1. Replace or supplement the static CI screenshot stage with 8–15 seconds of
   actual prototype screen recording showing input → regression → targeted fix
   → 3/3/release.
2. Reconcile `1 OF 3` with the implemented `2 pass / tower untested` baseline.
3. If time permits, name the learner audience and one concrete human/Codex
   decision in narration.
4. Close the Azure, Kokoro, and SFX provenance gaps.
5. Render and probe the final MP4, upload it publicly to YouTube, verify
   signed-out playback, and recheck the live rules before the July 21, 2026
   5:00 p.m. PT deadline.
6. Complete the external repository/license/access, eligibility, and
   `/feedback` gates.
7. Run one final independent review against the rendered—not source-only—cut.
