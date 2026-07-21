# Render QA: Devpost Kaiju QA video

Status: pass

## HyperFrames checks

- HyperFrames CLI: `0.7.64` (latest/pinned version confirmed before render).
- Transition verification: 7 cross-track transitions verified.
- Final 15-point source sweep: passed with 0 runtime, layout, or motion
  errors. The remaining lint findings are seven non-blocking composition-size
  warnings; the sampled overflow findings are intentional animated travel.
- Final source contact sheets:
  `videos/kaiju-qa-devpost/snapshots/contact-sheet-1.jpg` and
  `contact-sheet-2.jpg`.
- The CLI's deprecated StaticGuard emitted false `data-end` claims against
  generated media state. Source media elements use `data-duration`; the normal
  HyperFrames contract check passed.

## Render execution

- Approved by the user on 2026-07-21 with the exact reply `render`.
- First high-quality GPU/begin-frame attempt reached frame 2447/2850, then
  Headless Chrome closed the capture target. The composition reported no
  browser, page, request, or media error before that host-level failure.
- Stable retry used one worker, SwiftShader/software browser capture,
  `HF_DE_PARALLEL_ROUTER=false`, and a 600000 ms protocol timeout. It rendered
  all 2850 frames and muxed successfully.
- The HyperFrames render's video stream was retained without re-encoding. A
  two-pass audio-only normalization raised narration from `-20.73 LUFS` to
  `-14.23 LUFS`, with a measured true peak of `-0.94 dBTP` and LRA `3.30 LU`.

## Media probe

Final file: `videos/kaiju-qa-devpost/renders/video.mp4`

- SHA-256:
  `388d292f792c8043f36fc7934c90d948181f6cb9c9a524113ed44e031dc104ef`
- Size: 23,278,588 bytes.
- Container duration: 95.100000 seconds.
- Video: H.264 High, 1920 x 1080, yuv420p, BT.709, 30 fps, 2850 frames,
  95.000000 seconds.
- Audio: AAC LC, 48 kHz, stereo, 95.100000 seconds.
- Full FFmpeg decode completed with no errors.
- Expected quiet holds were detected at 16.545-20.056, 34.355-40.045,
  49.725-51.064, 60.014-63.059, and 72.519-78.068 seconds; these align with
  the scripted comprehension pauses.
- The last 1.1 seconds contain signal (`-19.4 dB` mean, `-1.4 dB` maximum),
  confirming the closing word is not truncated.
- Stereo-channel difference is extremely low (`-66.8 dB` mean), so mono
  fold-down presents no cancellation concern.

## Artifacts

- Final master: `videos/kaiju-qa-devpost/renders/video.mp4`
- Rendered-master contact sheet:
  `videos/kaiju-qa-devpost/renders/qa/contact-sheet.png`
- Nine native-resolution rendered proof frames under
  `videos/kaiju-qa-devpost/renders/qa/`.
- Source contact sheets and per-scene snapshots under
  `videos/kaiju-qa-devpost/snapshots/`.

## Remaining risks

- YouTube upload and signed-out playback verification remain outside this
  branch and must be completed in the Devpost submission workflow.
- Repository visibility/license, free judge access, entrant eligibility, and
  the required Codex `/feedback` session ID remain submission-external gates.
- Human audition on the final upload device remains advisable, although source
  coverage, encoded loudness, waveform continuity, and caption timing all pass
  deterministic checks.
