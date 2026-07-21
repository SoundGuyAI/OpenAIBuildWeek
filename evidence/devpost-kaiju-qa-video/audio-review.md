# Audio and caption QA review: Devpost Kaiju QA video

Review date: 2026-07-21  
Reviewer role: independent audio and caption QA  
Final MP4 available: no

## Status

**Source pass. Final audio/caption approval remains pending the rendered MP4.**

The previous caption-cadence blocker is resolved. The source now has 35 semantic phrase cards rather than 79 rapidly changing fragments, while preserving all 170 narration words and their exact timings. No source-level audio, caption, clipping, coverage, assembly, or licensing blocker remains.

## Voice intelligibility and pacing

- Eight Kokoro `am_michael` WAVs cover all eight frames and all 170 scripted words. The clips total 95.0 seconds on the storyboard grid, with about 75.82 seconds of active narration: approximately 134.5 words per active minute and 107.4 words per program minute.
- Read-only PCM analysis reconfirmed 24 kHz, mono, 16-bit WAVs with exact intended clip durations. Active-speech RMS is consistent within 1.07 dB across clips (`-23.12` to `-24.19 dBFS`), sample peaks range from `-2.12` to `-4.21 dBFS`, and no full-scale clipped samples were found.
- Each clip retains its intended tail/padded visual-comprehension hold; no source clip appears truncated. Frames 2, 4, 6, and 7 deliberately retain multi-second holds after speech.
- Overall pacing remains comfortable. Frames 4 and 5 are the densest at about 161.5 and 160.0 active words per minute, so the phrases around "freeze near buildings" and the ambulance regression still require small-speaker audition.
- `SCRIPT.md` supplies TTS-only pronunciation spellings for Kaiju, GPT-5.6, and Codex while captions retain normal product spelling. Signal analysis cannot certify pronunciation or expressive intent; render audition is still required for "Kaiju QA," "regression," "GPT-5.6," "Codex," and the closing line.
- Voice and SFX hashes continue to match `ASSET_LICENSES.md`. Provider/voice ID, script, speed guidance, generation date, and hashes remain traceable across the project metadata and license ledger.
- The voice sources are below the preferred 48 kHz/24-bit production format, but this is not blocking if the final encoded mix is clean and meets the delivery loudness and peak targets.

## Music/SFX balance

- No music is present by design: metadata records `bgm: null` and `bgm_pending: false`, and the assembled index has no BGM track. There is no music-ducking or unlicensed-music risk.
- All eight sparse SFX cues still match `audio_meta.json` and `index.html` for path, global start, duration, and gain. Their hashes and Pixabay Content License basis remain recorded.
- The release chime at 75.0-77.5 seconds remains entirely inside a deliberate narration gap. No required state depends on sound alone.
- Previous read-only decoding found the two whooshes approximately 6-7 dB RMS below active narration, slightly hotter than the 8-12 dB intent, while click/error/typing cues were approximately 19-29 dB below it. This remains a final-mix audition item rather than a source blocker.
- Recheck cue overlaps at 5.20 seconds ("help is not"), 11.20 ("carry"), 25.40 ("behavior / different result"), 32.20 ("buildings"), 43.20 ("new safety rule"), 57.60 ("freeze with"), and 82.00 ("Kaiju QA makes it visible"). The 5.20 and 57.60 whooshes remain the primary masking risks.

## Caption synchronization and coverage

- Coverage and timing pass: all 170 narration words appear exactly once in `caption_groups.json`; text and global word start/end values exactly match `audio_meta.json`. The 35 groups embedded in `compositions/captions.html` exactly match the caption JSON.
- The voice clips remain assembled at `0, 9, 20, 30, 40, 51, 63, 78` seconds with durations `9, 11, 10, 10, 11, 12, 15, 17`, matching the 95-second caption timeline.
- Regrouping is materially improved: cards now contain one to nine words, average 4.86 words, with 18 cards in the preferred five-to-nine-word range. Only one card is a single word (`Pass.`).
- No card is shorter than 0.5 seconds. Seven are below 1.2 seconds, all functioning as deliberate short beats or reactions: `Pass.`, `Same behavior.`, `Tower saved.`, `Ship it?`, `Not yet.`, `Three tests.`, and `Three passes.` Only `Pass.` and `Not yet.` are below 0.8 seconds.
- Reading speed passes comfortably: no card exceeds 17 characters per second; the measured maximum is about 13.51 CPS.
- Technical spellings remain correct for Kaiju QA, happy path, edge case, regression, targeted slow zone, full suite, GPT-5.6, Codex, and Loop Engineering.
- The final CSS cascade corrects active-word contrast. Calculated contrast is approximately 12.99:1 for active dark text on yellow, 7.24:1 for upcoming text on the dark card, and 16.61:1 for spoken text on the dark card; all pass WCAG AA for normal text.
- Caption timings remain deterministic weighted alignment rather than ASR-derived alignment. Internal source synchronization passes, but actual phoneme/word-highlight accuracy still requires a rendered playback check at 1.0x and 0.75x.

## Blocking findings

None at source level. The prior caption-card churn finding is closed.

## Exact remaining post-render checks

1. Probe the final MP4 and record video/audio codecs, 1920x1080 resolution, 30 fps, duration near 95.0 seconds, audio sample rate, channel count, and audio-stream duration. Confirm the final word around 94.48 seconds is audible and not truncated.
2. Measure the encoded program itself: target `-15` to `-13 LUFS-I` and true peak no higher than `-1 dBTP`. Confirm both delivered channels contain signal and a mono fold-down has no cancellation.
3. Audition on headphones at 1.0x for pronunciation, edit clicks, TTS discontinuities, pumping, tails, and boundary artifacts at 9, 20, 30, 40, 51, 63, and 78 seconds.
4. Audition on laptop and phone speakers at modest volume. Confirm first-pass comprehension of "Kaiju QA," "happy path," "edge case," "regression," "targeted slow zone," "full suite," "GPT-5.6," "Codex," and "Loop Engineering."
5. Audition all SFX overlaps listed above. Lower the 5.20/57.60 whooshes if they mask consonants; raise quieter cues only if they are intended to register and remain safely below speech. Confirm the 75.0-second release chime lands cleanly in its narration gap.
6. Watch captions with sound at 1.0x and 0.75x. Verify phrase entry is within roughly 100 ms of speech, karaoke highlights follow the audible word, and exits hold two to four frames when space permits. Pay particular attention to the seven intentionally short cards.
7. Visually verify active/upcoming/spoken contrast in the encoded video, not only CSS; confirm the longest cards wrap to no more than two readable lines and remain clear of primary visuals and disclosures.
8. Watch once muted to confirm the complete loop remains understandable and no uncaptioned SFX carries required meaning. Listen once eyes closed to confirm narration does not imply that concept visualization is gameplay capture.
9. Confirm the broad-fix question hold, post-regression comparison space, full-suite completion pause, and release-chime/end-card hold remain intact. Run silence detection to ensure no required narration segment is accidentally absent.
