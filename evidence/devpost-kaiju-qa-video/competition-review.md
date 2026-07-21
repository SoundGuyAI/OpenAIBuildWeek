# Final competition review: Devpost Kaiju QA rendered master

Status: **PASS — RENDERED VIDEO MASTER APPROVED; SUBMISSION BLOCKED ONLY ON EXTERNAL GATES**

Review date: 2026-07-21 UTC  
Reviewer role: independent competition and truthfulness reviewer  
Scope: actual rendered master `videos/kaiju-qa-devpost/renders/video.mp4`,
rendered-master contact sheet and proof frames, final media probe and loudness
measurement, remote working-demo provenance, implementation CI, asset-rights
records, and current OpenAI Build Week rules. No submission, upload, IWSDK,
IWER, Vite server, or local game runtime was launched.

## Decisive outcome

The actual encoded master passes final competition review:

1. The 95.1-second MP4 is a complete, decodable H.264/AAC master at 1920×1080
   and 30 fps with normalized, untruncated narration.
2. The real 8.166667-second browser demonstration survives final encoding and
   visibly shows the baseline, broad-guardrail ambulance regression, targeted
   slow-zone correction, 3/3 rerun, and earned release.
3. Frame 2 truthfully ends at `2 OF 3 / TOWER UNTESTED`, matching the working
   implementation and CI evidence.
4. Concept reconstructions and the working browser capture remain explicitly
   and correctly distinguished in the rendered frames.
5. The final asset ledger and provenance support every retained visual and
   audio source; the master contains no music or third-party SFX.

No unresolved video, audio, duration, clear-demo, truthfulness, or
rights/provenance blocker was found. Submission is still blocked on public
YouTube delivery, free judge access to the working project, repository
visibility/licensing or judge sharing, the core Codex `/feedback` session ID,
entrant/team eligibility, and completing the Devpost form before the deadline.

## Official sources and access date

The following official pages were reread in their live rendered form on
2026-07-21 at 06:17 UTC:

1. OpenAI Build Week Official Rules: https://openai.devpost.com/rules
2. OpenAI Build Week overview: https://openai.devpost.com/
3. Official organizer video guidance, published 2026-07-17:
   https://openai.devpost.com/updates/45282-openai-build-week-submissions-are-open-plugin-launch
4. Supported OpenAI API countries and territories:
   https://platform.openai.com/docs/supported-countries

Verified implementation/capture/render sources:

5. Implementation CI run:
   https://github.com/SoundGuyAI/OpenAIBuildWeek/actions/runs/29786685632
6. Working-demo capture run:
   https://github.com/SoundGuyAI/OpenAIBuildWeek/actions/runs/29791302806
7. Pinned game commit:
   https://github.com/SoundGuyAI/OpenAIBuildWeek/commit/2674d397ad8cf88f7739874f22abbeed7640f9d5
8. Capture workflow commit:
   https://github.com/SoundGuyAI/OpenAIBuildWeek/commit/c02228df86c1b7c2abddb5ad1a9bf4e6b65f1983
9. Local provenance:
   `videos/kaiju-qa-devpost/assets/prototype/CI_PROVENANCE.md`
10. Final media probe:
    `videos/kaiju-qa-devpost/renders/video-ffprobe.json`
11. Final loudness measurement:
    `videos/kaiju-qa-devpost/renders/video-loudness.json`
12. Render QA and native-resolution proof frames:
    `evidence/devpost-kaiju-qa-video/render-qa.md` and
    `videos/kaiju-qa-devpost/renders/qa/`

The Official Rules control if another page conflicts with them and should be
checked again immediately before submission.

## Official requirements and current status

| Requirement | Current official requirement, faithfully summarized | Current evidence | Result |
| --- | --- | --- | --- |
| Deadline | Submit by July 21, 2026 at 5:00 p.m. Pacific Time (July 22 at 00:00 UTC). | Final upload is not recorded. | Time-critical external gate |
| Eligibility | Entrants must satisfy age, residence/territory, organization, and representative rules. | Not assessable from video assets. | Unverified external gate |
| Required project | Build a project with Codex and GPT-5.6 in one best-fit category. | Working Kaiju QA implementation, model, tests, build, browser CI, and moving demo are verified. | Pass |
| New/extended work | New work must fall within the submission period, or a pre-existing project must be meaningfully extended with dated evidence. | Feature records and verified commits are dated 2026-07-20/21, within the period. | Pass for dated work evidence |
| Functionality | The project must run consistently on its intended platform and function as depicted in the video/description. | Production build and desktop/mobile Chromium E2E pass; the moving insert demonstrates the same model states shown by the reconstruction. | Pass for demonstrated browser scope |
| Category | Choose the best-fit category. Education covers students, teachers, and educational organizations. | The game makes regression judgment and evidence-gated release playable for learners. | Pass; Education is the strongest fit |
| Video duration | Demonstration video must be shorter than three minutes. | Final container duration is 95.1 seconds. | Pass |
| Clear demo/audio | Include a clear demo with audio explaining what was built and how Codex and GPT-5.6 were used. | The encoded master contains the labeled moving working-prototype segment, continuous English narration/captions, and concrete model/test/CI evidence. | Pass |
| Video delivery | Upload publicly to YouTube and provide the URL in the Devpost form. | The final MP4 exists locally; no public YouTube URL or signed-out playback check is recorded. | **Submission blocker** |
| Video IP | Third-party trademarks, music, and other protected materials require permission. | Current assets are first-party, original, generated/licensed with retained terms, or OFL fonts; no music or third-party SFX remain. | Pass on reviewed provenance |
| Repository | Supply a public repository with relevant licensing or share a private repository with both judging addresses. | Repository exists; final visibility/license/share decision is not evidenced. | **Submission blocker** |
| README | Explain Codex acceleration, human decisions, and GPT-5.6/Codex contributions. | Verified feature README contains a concrete collaboration account and human scope decisions. | Pass for content |
| Codex session | Provide the `/feedback` session ID for the thread where most core functionality was built. | Not present in this package. | **Submission blocker** |
| Judge access | Keep a free, unrestricted working project available through judging. | Buildability is proven; a public demo/test-build URL is not recorded. | **Submission blocker** |
| Language | Materials must be English or provide English translations. | Narration, captions, and copy are English. | Pass |

The official organizer guidance permits recorded or AI-assisted voice-over and
emphasizes clarity over production polish. The final AAC track contains the
main narration over the silent working-demo insert, so the demo is an
audio-accompanied part of the delivered master rather than a silent screencast.

## Final rendered-master verification

Reviewed artifact:
`videos/kaiju-qa-devpost/renders/video.mp4`

- SHA-256:
  `388d292f792c8043f36fc7934c90d948181f6cb9c9a524113ed44e031dc104ef`;
- size: 23,278,588 bytes;
- container: MP4, 95.100000 seconds;
- video: H.264 High, yuv420p BT.709, 1920×1080, 30 fps, 2,850 frames,
  95.000000 seconds;
- audio: AAC LC, 48 kHz stereo, 95.100000 seconds; and
- full video/audio decode: pass with no FFmpeg errors.

The encoded program measures `-14.23 LUFS-I`, `-0.94 dBTP`, and `3.30 LU`
loudness range. Speech loudness is on the intended target and comfortably
suited to a narration-led submission. The measured peak is 0.06 dB above the
team's conservative `-1.0 dBTP` target but remains below digital full scale;
this is a non-blocking delivery variance, not a competition-rule failure.

Silence analysis reaches 95.1 seconds and finds final speech signal through
approximately 94.78 seconds, followed by the intended 0.32-second tail. The
closing word is not truncated. Expected comprehension pauses are preserved,
and the near-identical stereo channels fold down without a cancellation risk.

The rendered-master contact sheet and nine native-resolution proof frames show
no blank, corrupt, clipped, missing, or visibly malformed frame at the major
story beats. The nested browser clip is present and legible after final H.264
encoding, and the 0.1-second difference between the visual stream and audio/
container duration produces no visible defect.

## Working-demo verification in the rendered master

### Provenance

GitHub Actions run `29791302806` is authentic and succeeded:

- workflow: `Capture Kaiju QA working demo`;
- branch/head: `codex/devpost-kaiju-qa-video` at
  `c02228df86c1b7c2abddb5ad1a9bf4e6b65f1983`;
- pinned game checkout:
  `2674d397ad8cf88f7739874f22abbeed7640f9d5`;
- successful steps: game dependency install, production build, Chromium
  install, Playwright interaction recording, FFmpeg conversion, and artifact
  upload;
- artifact: `kaiju-qa-working-demo-29791302806-1`, ID `8480384644`;
- artifact digest:
  `sha256:2d0f66828c191f1b8623aaa4859772d39c4cb092674b6b0112af7dedc966a67b`;
- local `working-demo.mp4` SHA-256:
  `e884bb26ab72900b8da104075769e3aa85ad0233cc54a6a23a0a1ba62db837f9`.

The local file hash matches the provenance ledger. The recorded probe reports
H.264, 1280×720, 30 fps, 8.166667 seconds, silent, and 1,181,671 bytes.

The capture source is committed and transparent. It launches the pinned
production build on the GitHub runner, moves a visible demo cursor, performs
real Playwright clicks/checks, and injects explicit action captions. The raw
interaction interval is recorded as 16.711 seconds and is intentionally
time-compressed by the workflow into the 8.166667-second insert.

### Encoded integration and visible adequacy

The final MP4 carries the clip from 78.0 through 86.166667 seconds with:

- `Browser capture - working prototype`;
- a fixed evidence panel naming broad regression, targeted slow zone, and
  release gate; and
- the external English narration and burned-in captions continuing over it.

Rendered-master samples at 79.0, 80.5, 82.0, 84.0, and 85.8 seconds visibly
show:

1. baseline evidence;
2. the tower-failure transition;
3. the ambulance regression under the broad guardrail;
4. the targeted slow-zone choice; and
5. `3 / 3 CURRENT: RELEASE EARNED` plus the released debrief.

This satisfies the rules' clear-demo requirement in the actual deliverable. A
judge can observe input location, state changes, regression, correction, rerun,
and release in the real prototype. The insert is fast, but the cursor, action
captions, persistent side panel, surrounding narration, and visible attempt
history make the causal sequence understandable. Final encoding preserves the
clip without a black/frozen frame, caption collision, or evidence-label loss.

## Frame-2 truthfulness repair

Frame 2 now states:

- stranded car: pass;
- emergency lane: pass;
- fragile tower: untested; and
- `2 OF 3 / TOWER UNTESTED — PARTIAL PASS`.

This matches `src/kaiju-qa/game-model.ts`, the browser tests, the real working
demo, and the CI screenshot's `Baseline — 2 pass` attempt. The previous internal
contradiction is resolved.

The narration's `one happy path is not proof` remains fair: it describes the
single active rescue example while the interface also records the preserved
emergency-lane criterion. It no longer conflicts with the visible count.

## Truthfulness and claim separation

Passes:

- Frames 2–7 remain explicitly marked
  `CONCEPT VISUALIZATION - NOT GAMEPLAY CAPTURE` for their full 9–78 second
  span.
- The concept overlay ends exactly when the real browser recording starts.
- The real insert is explicitly marked `Browser capture - working prototype`
  and identifies remote CI plus the pinned game commit.
- After the insert, frame 8 separately labels committed game artifacts and then
  returns to a concept-visualization label for the generated hero lockup.
- Displayed model/test paths, six-test claim, commit IDs, workflow IDs, and pass
  statuses correspond to verified repository evidence.
- No XR runtime claim is made; demonstrated runtime scope is desktop Chromium,
  with separate CI evidence for desktop/mobile Chromium.
- The injected cursor/banner/captions are presentation aids, while the underlying
  transitions are real Playwright interactions. The `CI reproduction` and
  remote-capture labels make that distinction transparent.

No material truthfulness blocker remains.

The persistent concept disclosure and working-prototype label remain present
and readable in the 1080p master. Fine internal application microcopy is softer
inside the scaled browser insert, but the large action labels, attempt history,
state changes, and evidence panel carry every material claim without relying on
that microcopy.

## Judging-criteria coverage

Stage One viability is now well supported by a running implementation, passing
CI, and moving demo. Stage Two's four criteria are equally weighted, with
Technological Implementation first in tie-breaking order.

| Criterion | Current coverage | Assessment |
| --- | --- | --- |
| Technological Implementation | Verified deterministic model, six model tests, production build, desktop/mobile browser E2E, exact commits/runs, and a moving pinned-build demonstration. | Strong |
| Design | Complete causal experience from partial baseline through edge case, broad regression, targeted correction, rerun, and release; real product UI is shown. | Strong |
| Potential Impact | The game concretely practices acceptance criteria, regression reasoning, scoped fixes, and evidence-gated release. | Strong mechanism; audience wording can improve |
| Quality of the Idea | Miniature-city coverage, player-as-QA role, regression-as-monster reversal, and tiny earned release stamp remain distinctive and memorable. | Strong |

## Codex and GPT-5.6 messaging

The narration explicitly says GPT-5.6 and Codex shaped scoped plans, tests, and
review. Frame 8 supports that line with the real model path, model-test path,
implementation CI, capture CI, and working output. The verified README adds the
human side of the collaboration: tutorial simplicity, preserved player agency,
determinism, scope cuts, no unverified XR claim, and mergeability over spectacle.

Assessment:

- official video minimum: pass;
- technical-implementation evidence: strong;
- README human/Codex boundary: pass;
- remaining proof obligation: preserve and submit the required core
  `/feedback` session ID.

For competitive strength, one spoken human-decision example would still be
better than grouping plans/tests/review together, but this is a non-blocking
scoring refinement.

## Education fit and closing recall

Education remains the best-fit category. The product does not merely explain
regression testing; the moving demo shows the learner making a broad choice,
observing harm to an earlier criterion, narrowing the rule, rerunning evidence,
and earning release.

The spoken cut still does not explicitly name early software learners,
bootcamp students, career switchers, teachers, or classroom replay. Adding one
short audience sentence would improve Potential Impact scoring, but the game
and README already make the Education fit credible.

The closing remains highly judge-retellable:

- goal → change → evidence → gate;
- the regression is the real monster; and
- a Loop Engineer proves a change deserves to ship.

## Rights and provenance

No unresolved rights blocker was found in the current ledger:

- The reviewed final master is hash-identified above, and its retained media
  streams contain only the documented visual composition and Kokoro narration.
- `working-demo.mp4` and the CI screenshots are first-party repository-owned
  captures with exact commits, runs, artifact IDs/digests, dates, and hashes.
- Reconstruction graphics are original HTML/CSS/SVG.
- The Azure FLUX hero now has a retained provider/model/date/prompt/hash record,
  Black Forest Labs commercial-output guidance, and Microsoft Marketplace
  terms in `capture/AZURE_FLUX_PROVENANCE.md`.
- Kokoro-82M v1.0 ONNX, `am_michael`, upstream sources, Apache-2.0 declaration,
  engine hashes, date, and generated WAV hashes are recorded in
  `assets/voice/KOKORO_PROVENANCE.md` and `ASSET_LICENSES.md`.
- Included fonts retain SIL Open Font License files and hashes.
- The final master contains no music and no third-party SFX; the only encoded
  audio program is the documented narration track.
- No Quaternius asset, third-party product UI, visible trademark, celebrity,
  watermark, or recognizable franchise character is used.

This is a provenance assessment, not legal advice; the entrant remains
responsible for the warranties made on submission.

## Blocking findings

### Video/source/render blockers

**None.** The final master passes duration, format, decode, clear-demo, audio,
caption/disclosure, truthfulness, visual-integrity, and rights/provenance review.

### Submission-external blockers

1. Upload the final video publicly to YouTube, verify signed-out playback, and
   provide the URL in Devpost.
2. Provide a free, unrestricted working-project URL/test build through the end
   of judging.
3. Confirm repository visibility/licensing or share the private repository with
   both official judging addresses.
4. Provide the core Codex `/feedback` session ID.
5. Confirm entrant/team eligibility and authorized representation.
6. Complete submission before July 21, 2026 at 5:00 p.m. Pacific Time.

## Non-blocking findings

- The measured `-0.94 dBTP` peak is 0.06 dB above the team's conservative
  `-1.0 dBTP` target. It remains below full scale and is not an official-rule or
  release blocker; verify the public YouTube transcode during signed-out QA.
- The 8.166667-second demo is deliberately accelerated from a 16.711-second raw
  interaction. It remains understandable at normal playback because the large
  action labels, cursor, attempt history, and persistent evidence panel agree.
- Fine application microcopy is naturally soft after scaling a 1280×720 capture
  into the 1080p composition, but no material demo claim depends on it.
- Naming the learner audience once would strengthen Potential Impact, and naming
  one concrete human-versus-Codex decision would strengthen the collaboration
  story; neither omission defeats the official video minimum.
- XR remains honestly deferred and is not required to validate the demonstrated
  desktop/mobile browser product.
- A final human listen on the upload device remains advisable for subjective
  pronunciation and comfort, although encoded loudness, continuity, speech
  tail, stereo fold-down, captions, and technical terms pass objective checks.

## Release recommendation

**Approve `videos/kaiju-qa-devpost/renders/video.mp4` as the final competition
video master.** No further video, audio, truthfulness, or rights remediation is
required for the reviewed file.

Proceed to public YouTube upload and Devpost submission only after completing
the submission-external gates above. Before submitting, verify the YouTube URL
while signed out, confirm the complete 95.1-second master and narration play
after platform transcoding, and recheck the live deadline/rules once more.
