# Independent review: Devpost Kaiju QA video

Status: **PASS — BRANCH/PR COMPLETE; SUBMISSION-EXTERNAL GATES REMAIN**

Review date: 2026-07-21 UTC
Reviewer role: final independent reviewer
Reviewed state: branch `codex/devpost-kaiju-qa-video`, committed diff from
`main`, current shared worktree, final source/provenance, evidence package,
`renders/video.mp4`, and `renders/qa/contact-sheet.png`.

## Decisive outcome

The final video itself passes. No unresolved source, render, audio, visual,
truthfulness, licensing/provenance, IWSDK/IWER, or demonstrated-product blocker
was found for the reviewed master.

The reviewed final state is committed as `11516ac`, pushed to
`origin/codex/devpost-kaiju-qa-video`, and represented by draft PR #6 against
`main`. Unrelated generated skill material was excluded, the append-only
conversation log was updated, and the planned Telegram completion notification
was sent successfully. Branch publication and PR-preparation requirements now
pass.

## Branch and PR completion

- Pass: reviewed state committed as `11516ac` and pushed to the intended remote
  feature branch.
- Pass: draft PR #6 opened against `main`:
  `https://github.com/SoundGuyAI/OpenAIBuildWeek/pull/6`.
- Pass: unrelated `.agents/skills/`, `agent/`, and root `skills-lock.json`
  material excluded from the publication scope.
- Pass: append-only conversation logging brought current.
- Pass: post-PR Telegram completion notification sent successfully.
- Pass: the approved master remains identified by SHA-256
  `388d292f792c8043f36fc7934c90d948181f6cb9c9a524113ed44e031dc104ef`.

There are no remaining branch-publication or PR-preparation blockers recorded
by this review.

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

The planned Telegram completion message has been sent successfully and is no
longer an outstanding action.

## Residual risks

- Public-platform transcoding may alter sharpness or peak level; signed-out
  YouTube playback is the final delivery check.
- Asset-rights review is evidence-based and not legal advice; the entrant
  remains responsible for submission warranties.
- Any source or master change after commit `11516ac` requires targeted
  revalidation and must preserve or deliberately supersede the reviewed master
  hash.

## Final recommendation

**Approve the final MP4, branch publication state, and draft PR #6. No branch or
PR-completion blocker remains. Proceed with the submission-external gates before
the Devpost submission.**
