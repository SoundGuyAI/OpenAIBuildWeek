# Final audio and caption QA: Devpost Kaiju QA video

Review date: 2026-07-21  
Reviewer role: independent audio and caption QA  
Rendered master: `videos/kaiju-qa-devpost/renders/video.mp4`
Master SHA-256: `388d292f792c8043f36fc7934c90d948181f6cb9c9a524113ed44e031dc104ef`

## Status

**Final technical pass. No blocking audio or caption findings.**

The rendered master passes stream, decode, loudness, narration-continuity, silent-demo, final-word, caption-coverage, and rendered-frame checks. A human listening pass remains recommended for pronunciation, subjective TTS quality, and small-speaker intelligibility, but no measured issue requires another render.

## Rendered-master verification

- Master duration is 95.10 seconds. It contains 1920x1080 H.264 video at 30 fps and one AAC-LC audio stream at 48 kHz stereo, approximately 155 kb/s.
- A complete video/audio decode to a null sink finished without an error.
- Post-normalization measurement is `-14.23 LUFS-I`, `-0.94 dBTP`, and `3.30 LU` LRA. Integrated loudness and dynamics meet the intended delivery range.
- The measured true peak is 0.06 dB above the preferred `-1.00 dBTP` ceiling. This is recorded as a non-blocking codec-tolerance advisory: it remains below 0 dBTP, the full decode passes, and there is no evidence of clipping. Re-limit only if strict numerical `<= -1.00 dBTP` compliance is required by a downstream platform.
- Both encoded channels contain equivalent narration levels. During the demo interval each channel measures about `-17.14 dBFS` RMS; the left-minus-right residual is about `-61.02 dBFS`, approximately 43.9 dB below the program, consistent with the expected near-dual-mono narration after AAC encoding.

## Narration-only architecture and demo soundtrack

- Source and master architecture remain narration-only: eight voice tracks, no music, and no SFX. `audio_meta.json` records `bgm: null` and `sfx: []`; the index contains only the eight narration `<audio>` elements.
- `working-demo.mp4` has no audio stream and is explicitly `muted` in `index.html`. The final master retains Frame 8 narration over the 78.0-86.166667 second moving-demo interval, as intended.
- The encoded demo interval contains natural narration pauses below `-45 dBFS` at approximately 79.03-79.27, 81.28-81.59, and 83.88-84.10 seconds. Those deep pauses, the near-dual-mono channel result, the silent source asset, and the explicit mute collectively support that no browser/game soundtrack leaked into the master.
- There is no duplicate narration, music bed, or effect track in the source architecture. A final human headphone listen should still confirm that no perceptual artifact sounds like a second voice or game soundtrack.

## Voice coverage, continuity, and final word

- All eight Kokoro `am_michael` narration clips and all 170 scripted words are represented. Source WAV hashes continue to match `ASSET_LICENSES.md` and the Kokoro engine/voice provenance remains documented in `assets/voice/KOKORO_PROVENANCE.md`.
- Decoded narration starts following the long scene holds align with the scheduled word starts to within 11.4-35.4 ms at 9.08, 20.08, 30.08, 40.08, 51.08, 63.08, and 78.08 seconds. This is comfortably inside the approximately 100 ms synchronization target.
- Expected quiet holds survive the encode: approximately 16.55-20.06, 34.35-40.04, 49.73-51.06, 60.01-63.06, and 72.52-78.07 seconds. No unintended long dropout appears inside narrated sections.
- The final captioned word `ship.` is scheduled to end at 94.477 seconds. Decoded speech energy continues through approximately 94.781 seconds, preserving its natural tail, followed by 0.319 seconds of closing silence through 95.10 seconds. The final word is not truncated.
- Encoded audio in the 93.5-95.1 second window measures approximately `-19.45 dBFS` RMS with peaks near `-1.44 dBFS`, further confirming that the closing sentence is present and healthy.

## Caption coverage and rendered appearance

- `caption_groups.json` contains 35 semantic cards and all 170 narration words. Its word text and global timing map exactly to `audio_meta.json`; the groups embedded in `compositions/captions.html` match the JSON.
- Captions are burned into the video rather than delivered as a separate subtitle stream. Reading speed remains at or below approximately 13.51 characters per second, and the active/upcoming/spoken color states retain their high-contrast design.
- Final-master frames were inspected directly at 79.0, 82.0, 85.8, 86.2, and 94.2 seconds. Captions remain readable over the moving prototype, survive the 86.166667-second transition into implementation evidence, and display the final `ship.` highlight before the preserved audio tail.
- Scene-level encoded audio starts track the caption schedule within 35.4 ms. Word timing is still deterministic rather than ASR-derived, so subjective word-by-word karaoke accuracy remains part of the recommended human playback pass.

## Remaining human-audition risks

These are sign-off checks, not current blockers:

1. Listen on headphones for correct pronunciation and natural delivery of `Kaiju QA`, `regression`, `GPT-5.6`, `Codex`, and `Loop Engineering`; also check for TTS discontinuities or boundary clicks at 9, 20, 30, 40, 51, 63, and 78 seconds.
2. Listen on laptop and phone speakers at modest volume, especially during the denser Frames 4 and 5, to confirm every required noun and contrast is understandable without captions.
3. Listen through 78.0-86.166667 seconds to subjectively confirm that only narration is audible over the moving demo and that no AAC artifact resembles leaked browser sound or a duplicate voice.
4. Watch once at 1.0x and 0.75x to confirm word-level highlighting feels synchronized, the seven intentional short caption cards do not flash uncomfortably, and the longest cards remain readable in motion.
5. Watch once muted to reconfirm that the complete loop and working-prototype evidence remain understandable without audio.

## Blocking findings

None.
