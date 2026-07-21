# Independent review: Devpost Kaiju QA video

Status: **BLOCKED FOR PR/MERGE — FINAL VIDEO MASTER APPROVED**

Review date: 2026-07-21 UTC
Reviewer role: final independent reviewer
Reviewed state: branch `codex/devpost-kaiju-qa-video`, committed diff from
`main`, current shared worktree, final source/provenance, evidence package,
`renders/video.mp4`, and `renders/qa/contact-sheet.png`.

## Decisive outcome

The final video itself passes. No unresolved source, render, audio, visual,
truthfulness, licensing/provenance, IWSDK/IWER, or demonstrated-product blocker
was found for the reviewed master.

The branch is not yet merge-ready because the reviewed final state is not
contained in Git. The remote branch still points to `c02228d`, while the final
source repairs, working-demo asset, rendered master, render metadata, QA frames,
and final evidence updates remain modified or untracked locally. There is also
no draft PR. These are branch-completion blockers, not defects in the approved
video.

## Branch blockers

1. **Commit and push the reviewed final state.** The intended final artifacts
   and evidence are not all part of `HEAD` or the remote branch. Until they are
   committed, the immutable PR diff cannot reproduce the master reviewed here.
   Preserve the approved master SHA-256:
   `388d292f792c8043f36fc7934c90d948181f6cb9c9a524113ed44e031dc104ef`.
2. **Exclude unrelated generated skill material.** Untracked `.agents/skills/`,
   `agent/`, and root `skills-lock.json` are outside the feature plan, add a
   large conflict-prone surface, and must not be included in the video branch.
   This agrees with the production note that skill updates belong in an
   isolated maintenance worktree.
3. **Complete conversation logging before PR.** The append-only log contains
   the original video request, Telegram follow-up, and exact `render` approval.
   The final-review delegation/finalization prompts are not recorded; the
   orchestrator must append them because the reviewer does not own the log.
4. **Open the planned draft PR against `main`.** No PR currently exists for the
   branch. Acceptance criterion 11 and the repository completion workflow are
   therefore incomplete. CI and PR-level review cannot be assessed until the
   final commit is pushed and the PR exists.

Once these four items are complete, no further video re-render or content
change is required if the master hash and reviewed source remain unchanged.

## Non-blocking findings

- HyperFrames `0.7.64` checks pass with zero runtime, layout, motion, or gating
  errors. Seven composition-size warnings, intentional transient travel
  findings, and one sampled contrast warning remain advisory; the encoded proof
  frames are readable and the prominent disclosure is clear.
- The measured true peak is `-0.94 dBTP`, 0.06 dB above the team's preferred
  `-1.00 dBTP` ceiling. It remains below full scale, decodes cleanly, and is not
  a competition or release blocker.
- The real browser demonstration is accelerated from 16.711 seconds to
  8.166667 seconds. Large action labels, the cursor, attempt history, and the
  persistent evidence panel keep the causal sequence understandable.
- Fine application microcopy inside the scaled 1280x720 capture is softer than
  the surrounding graphics, but no material claim depends on that microcopy.
- A final human listen on the upload device remains advisable for subjective
  TTS pronunciation and small-speaker intelligibility.

## Scope and ownership compliance

- The branch is based directly on current `main`; `main` is an ancestor of the
  reviewed branch head.
- The intended feature diff is isolated to the capture workflow, conversation
  log, plan, evidence, and `videos/kaiju-qa-devpost/`. No `src/` or `tests/`
  file is changed.
- Agent assignments provide disjoint write scopes. Frame workers owned one
  frame each, shared integration remained orchestrator-owned, visual/audio/
  competition reviewers were independent, and this reviewer changed only this
  file.
- No local IWSDK, IWER, WebXR, Vite game server, or game E2E run was used for
  this video review. The only game execution was the documented GitHub-hosted
  capture of pinned game commit `2674d39`.
- GitHub Actions runs `29786685632` and `29791302806` succeeded at the claimed
  commits. Their artifact IDs and SHA-256 digests match the provenance ledger.
- The explicit XR-QA N/A record is appropriate because this branch changes no
  game runtime, 3D, input, locomotion, interaction, or session state.

## Validation and evidence completeness

- Final master SHA-256:
  `388d292f792c8043f36fc7934c90d948181f6cb9c9a524113ed44e031dc104ef`.
- MP4 probe: H.264 High, AAC LC, 1920x1080, BT.709/yuv420p, 30 fps,
  2,850 video frames, 95.0-second video, 95.1-second container/audio, AAC
  48 kHz stereo.
- Full video/audio decode completed with no errors, dropped frames, or black
  interval findings. The final spoken word and its natural tail are retained.
- Loudness independently matches the retained report: `-14.23 LUFS-I`,
  `-0.94 dBTP`, and `3.30 LU` LRA.
- The rendered contact sheet and nine native-resolution proof frames show no
  blank, corrupt, clipped, missing, or malformed major story beat. The moving
  browser insert survives final encoding and reaches `3 / 3 CURRENT: RELEASE
  EARNED`.
- Caption evidence is internally consistent: 35 semantic cards cover all 170
  narration words, source timing maps exactly to `audio_meta.json`, and the
  embedded caption groups match `caption_groups.json`.
- Truthfulness passes: reconstructed scenes are labeled `CONCEPT VISUALIZATION
  - NOT GAMEPLAY CAPTURE`; the real insert is labeled `BROWSER CAPTURE -
  WORKING PROTOTYPE`; the baseline is correctly `2 OF 3 / TOWER UNTESTED`; and
  model/test paths, six-test claim, commits, CI runs, and browser scope match
  verified repository evidence. No XR certification is claimed.
- Rights/provenance passes for the retained assets: first-party CI captures,
  original HTML/CSS/SVG, documented Azure FLUX.2-pro output, Kokoro-82M
  narration with retained Apache-2.0 provenance, and OFL fonts with hashes and
  license files. The final cut contains no music, third-party SFX, Quaternius
  assets, visible third-party trademark, watermark, celebrity, or recognizable
  franchise character.
- Independent render, visual, audio/caption, competition, and XR-N/A evidence is
  present and contains no unresolved video-master blocker.

## Submission-external gates

These do not block committing or opening the branch PR, but they block the
Devpost submission:

1. Upload the approved master publicly to YouTube and verify the complete
   95.1-second video, narration, captions, and visual quality while signed out.
2. Provide a free, unrestricted working-project URL/test build through judging.
3. Confirm repository visibility/licensing or share a private repository with
   the required judging accounts.
4. Provide the core Codex `/feedback` session ID requested by the submission.
5. Confirm entrant/team eligibility and authorized representation.
6. Complete the Devpost submission before July 21, 2026 at 5:00 p.m. Pacific
   Time (July 22, 2026 at 00:00 UTC), after one final live-rules check.

The planned Telegram completion message is a post-PR orchestration action, not a
video-quality gate, and was intentionally not sent by this reviewer.

## Residual risks

- Public-platform transcoding may alter sharpness or peak level; signed-out
  YouTube playback is the final delivery check.
- Asset-rights review is evidence-based and not legal advice; the entrant
  remains responsible for submission warranties.
- The final PR must include only the intentional video/evidence artifacts and
  must preserve the reviewed master hash. Any source or master change after
  this review requires targeted revalidation.

## Final recommendation

**Approve the final MP4 and current video content. Block merge/PR completion
until the reviewed artifacts are committed and pushed, unrelated generated
skill files are excluded, the prompt log is current, and the draft PR exists.**
