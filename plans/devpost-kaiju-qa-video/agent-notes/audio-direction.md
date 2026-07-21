# Voice and sound direction: Kaiju QA Devpost video

## Audio north star

The soundtrack should feel like a trusted QA lead walking a teammate through a
surprising result: confident, warm, precise, and lightly amused. The narrator
admires the kaiju's careful compliance and treats each failure as useful
evidence. Comedy comes from the mismatch between an enormous helper and a tiny,
incomplete rule—not from panic, destruction, or ridicule.

The mix must remain intelligible on laptop and phone speakers. Voice carries the
lesson; music supplies momentum; sound effects confirm visible state changes.
No required idea may depend on bass, stereo width, or an uncaptioned sound.

## Production decision for the available audio state

- Use the offline Kokoro path already available in HyperFrames for the final
  English narration. Do not block the cut on HeyGen authentication or a remote
  voice provider.
- Render narration as short lossless clips, normally one sentence or one shot
  beat per file. A segmented read makes pronunciation, pauses, and picture sync
  repairable without regenerating the entire 88-second track.
- Keep one voice, one speed setting, and one processing chain across every clip.
  Record the Kokoro voice identifier, speed, source text, render date, and file
  hash in the production audio metadata.
- MusicGen dependencies are unavailable, so generated music is not on the
  critical path. Use only an original simple bed or a verified, cleared CC0/CC
  track whose license is recorded in `ASSET_LICENSES.md`.
- If no suitable licensed music is ready, ship a confident VO-and-SFX mix with
  a very light original tonal pulse. Clean speech is stronger than rushed or
  ambiguously licensed music.

## English narrator profile

Choose an adult English Kokoro voice with a clear neutral accent, a comfortable
mid register, clean consonants, and restrained sibilance. Select for first-pass
comprehension rather than dramatic character. The voice can read as any gender;
avoid a child voice, celebrity imitation, movie-trailer bass, synthetic news
anchor, classroom baby talk, or faux Japanese accent.

Performance character:

- **Role:** experienced quality engineer and generous guide, not omniscient
  announcer.
- **Temperature:** warm and curious in the opening, factual at the regression,
  quietly satisfied at release.
- **Comedy:** a dry smile and precise micro-pauses; never sarcasm, mugging, or a
  laugh-track cadence.
- **Point of view:** use “we” for incomplete assumptions. The kaiju is a capable
  teammate following the current contract.
- **Energy:** conversational confidence at roughly 70% intensity. Save the
  strongest emphasis for “regression,” “full suite,” and “release.”
- **Ending:** land the final line as earned confidence, not a sales shout.

Audition the selected voice on these three lines before rendering the full
script:

> One happy path is not proof.

> The kaiju is not the monster. The regression is.

> Three tests. Three passes. Now the release stamp means something.

The chosen voice must keep “happy path” conversational, make “regression” fully
intelligible on a phone speaker, and preserve warmth through the short final
sentences.

## Pace and word budget for the 88-second cut

Target **180–188 spoken words**, with **184 words** as the production aim and
**190 words** as the hard ceiling. Reserve approximately 7–9 seconds of the cut
for visual comprehension, reactions, and sound-only punctuation. At 184 words,
the overall program rate is about 125 words per minute; across roughly 80
seconds of active speech, the delivery is about 138 words per minute. The
190-word ceiling across 79 seconds of active speech is about 144 words per
minute.

Start Kokoro at its natural/default speed. A final speed adjustment in the
approximate **0.98–1.03×** range is acceptable after picture lock. If the read
does not fit, trim words before exceeding **1.05×**; accelerated TTS will weaken
both comedy and comprehension.

| Time | Narrative job | Approximate word target | Delivery note |
| --- | --- | ---: | --- |
| 00:00–00:09 | Problem and Kaiju QA promise | 22 | Bright, direct hook; complete the promise by 00:09. |
| 00:09–00:21 | Happy path and incomplete coverage | 24 | Enjoy the pass, then pause before “partial pass.” |
| 00:21–00:34 | Fragile-tower edge case | 26 | Matter-of-fact; leave the tower fold briefly un-narrated. |
| 00:34–00:48 | Over-broad fix and ambulance regression | 31 | False relief, then slow down and clearly land “regression.” |
| 00:48–01:05 | Evidence comparison, targeted fix, full suite | 36 | Steady diagnostic cadence; give each scenario equal weight. |
| 01:05–01:18 | Cross-device design and truthful Codex process | 24 | Factual, compact, no unsupported implementation claim. |
| 01:18–01:28 | Learning impact and earned release | 21 | Gentle lift, then silence for the tiny seal and end card. |

The table totals **184 words**. Preserve at least these non-speech beats:

- 0.5–0.8 seconds on the fragile tower folding after cause is visible.
- 0.6–0.9 seconds on the ambulance stopping before the word “regression.”
- 0.4–0.7 seconds after the final regression-suite pass.
- 0.8–1.2 seconds for the tiny approval seal and lab bell at the close.

## Pronunciation and TTS text notes

Captions retain normal product spelling. If Kokoro mispronounces a term, use
the TTS-only hint in the render source and record the substitution in metadata.
Do not expose phonetic spellings in captions.

| Caption spelling | Intended pronunciation | TTS-only fallback |
| --- | --- | --- |
| Kaiju | **KYE-joo**, /ˈkaɪ.dʒuː/ | `KYE-joo` |
| Kaiju QA | **KYE-joo cue ay** | `KYE-joo Q A` |
| QA | **cue ay**, never “qua” | `Q A` |
| Loop Engineering | **loop en-juh-NEER-ing** | `Loop Engineering` with a comma before it if a reset is needed |
| regression | **ree-GRESH-un** | `regression` or `ree-GRESH-un` |
| Codex | **COH-decks** | `COH-decks` |
| Devpost | **DEV-post** | `DEV post` |
| AI-assisted | **A I assisted** | `A I assisted` |
| WebXR | **web ex ar** | `web X R` |
| city-wide | **CITY-wide** | `city wide` |
| targeted slow zone | stress **TAR-get-ed SLOW zone** | keep as separate short phrase |

Use ordinary periods and commas as the primary prosody controls. Prefer two
short rendered sentences over ellipses, repeated punctuation, or a long clause
whose rhythm Kokoro cannot recover. Put a full stop before an important reveal
instead of forcing emphasis with all caps.

## Performance map

- **Cold open:** friendly urgency, not disaster-film urgency. “Fast help is not
  always safe help” is an intriguing observation, not a warning siren.
- **Happy path:** allow a small smile on “Pass,” then a dry half-beat before
  “partial pass.” Keep “One happy path is not proof” plain and memorable.
- **Tower edge case:** respect the useful failure. Lower intensity slightly so
  the visual cause remains primary.
- **Bad fix:** let “Tower saved. Ship it?” sound genuinely tempting. Do not wink
  so hard that the answer is obvious before the ambulance appears.
- **Regression:** remove the smile. Speak “The regression is” slightly slower,
  with no overlapping effect on the key noun.
- **Diagnosis:** restore warmth and use parallel phrasing for car, tower, and
  ambulance. The rhythm should make the complete suite easy to retell.
- **Release:** give “Three tests. Three passes.” two clean, equal beats. Pause
  before the stamp. End with calm conviction.

## Music direction

Use a small, playful systems-lab palette rather than cinematic kaiju scoring:
soft mallets or plucked synth, muted hand percussion, a warm restrained bass
line, and one gentle evidence-loop motif. Aim near **94–100 BPM** so edits can
move briskly without making the narration feel hurried. Keep the harmony
curious and optimistic, with no vocals.

Suggested arc:

1. **00:00–00:09:** one curious pulse and sparse plucks under the hook.
2. **00:09–00:34:** establish a light, repeatable pattern as scenarios are
   added.
3. **00:34–00:48:** simplify the pattern and briefly withhold its resolution at
   the ambulance regression; do not turn ominous.
4. **00:48–01:05:** rebuild the motif as the broad rule contracts into the
   targeted slow zone.
5. **01:05–01:18:** thin the arrangement beneath cross-device and Codex process
   copy so dense terms remain clear.
6. **01:18–01:28:** resolve warmly, then leave space for the stamp and tiny bell.

Avoid trailer braams, heroic orchestra, disaster percussion, sub-bass impacts,
sirens, roars, franchise imitation, and busy high-frequency arpeggios. Music
must survive mono playback and should not rely on frequencies below 100 Hz.

## Sound-effect palette and cue priorities

Use quiet, tactile sounds that make the tabletop test lab feel physical and
safe. Favor short original/cleared sounds with minimal reverb.

| Beat | Preferred sound | Direction |
| --- | --- | --- |
| Kaiju movement | Soft felt-and-wood footfall | Weight without boom or threat; no roar. |
| Car rescue | Small magnetic lift click and gentle servo | Helpful precision, not machinery spectacle. |
| Scenario pass | One soft rounded chime plus a tactile check | Reuse consistently so the audience learns the grammar. |
| Incomplete coverage | Mechanical interlock click | Approval motion stops cleanly; no error buzzer. |
| Tower placement | Socket click and subtle readiness pulse | Confirms the player added an edge case. |
| Tower fold | Three or four light hinged block clacks | Clearly a reusable test fixture; never a crash or rubble impact. |
| Broad freeze rule | Low-volume amber boundary bloom | A restrained expanding tone, not a force field blast. |
| Ambulance test | One turn-signal tick or short neutral chirp | No siren, horn barrage, patient, panic, or collision. |
| Regression | Dry two-note unresolved marker | Enter after the stop is visible and clear space for the spoken word. |
| Targeted slow zone | Clean geometric contraction zip | The sound follows the visible boundary shrinking inward. |
| Full suite | Same pass cue three times with slight tonal lift | Identical grammar first; final cue may complete the chord. |
| Release gate | Small latch and card-slide sound | Signals permission earned by evidence. |
| Tiny seal | Precise miniature stamp thunk and one lab-bell ping | Comic scale contrast; short, centered, and satisfying. |

Keep the SFX count sparse. One informative cue per state change is stronger
than continuous UI chatter. If a cue and a spoken technical term collide, move
or lower the cue.

## Loudness, ducking, and technical mix targets

- Build the session at **48 kHz**, preferably 24-bit WAV for voice and effects;
  convert Kokoro source renders once during assembly rather than repeatedly.
- Deliver the final stereo program near **-14 LUFS integrated**, acceptable
  range **-15 to -13 LUFS-I**, with true peak no higher than **-1 dBTP**.
- Keep narration centered and mono-compatible. Aim for approximately **-16 to
  -14 LUFS short-term** during normal speech, with consistent phrase-to-phrase
  level and no clipped consonants.
- Apply only corrective voice processing: high-pass around 75–90 Hz, gentle
  de-essing, and roughly 2:1–3:1 compression with about 2–5 dB of gain
  reduction. Avoid radio-style density or audible pumping.
- Keep music approximately **12–16 dB below the narration** while speech is
  active. Use 6–9 dB of keyed ducking with an approximately 80–120 ms attack
  and 250–400 ms release, then automate by ear around pauses.
- During a deliberate non-speech reveal, music may rise only 3–4 dB. It should
  never announce a joke before the picture does.
- Keep ordinary effects approximately **8–12 dB below concurrent voice**. The
  final stamp may sit 4–6 dB below the preceding voice because it occupies a
  planned pause.
- Remove unnecessary low end from music and effects. Keep essential information
  in the midrange and avoid extreme stereo placement so phone and mono playback
  preserve every cue.
- Use short 4–10 ms edge fades on rendered clips to prevent clicks. Do not
  hard-gate TTS tails or let room tone jump between sentences.

These are starting targets, not permission to normalize every element
independently. Final decisions are made against the complete mix on real small
speakers.

## Caption rhythm and audio relationship

- Burn in a faithful English transcript of the narration. Preserve the exact
  technical terms **happy path**, **edge case**, **regression**, **targeted slow
  zone**, and **full regression pass**.
- Use phrase-level cards of roughly 5–9 words. Maximum two lines, approximately
  42 characters per line, with semantic line breaks rather than equal lengths.
- Target no more than **17 characters per second** and treat **20 characters per
  second** as a hard maximum. Keep a caption visible for at least 1.2 seconds
  unless it is a very short reaction word already obvious from context.
- Synchronize caption entry with the spoken phrase to within roughly 100 ms and
  hold the exit for 2–4 frames after the final audible word when space permits.
- Do not introduce a new sentence on the exact frame of the tower fold,
  ambulance stop, full-suite completion, or tiny stamp. Finish the setup,
  briefly let the evidence land, then begin the next caption.
- Keep one complete thought per card. Avoid orphaned articles, single-word
  second lines, and rapid flashes caused by copying every TTS pause literally.
- Caption meaningful non-speech sounds only when they add information not
  already obvious on screen, for example `[approval interlock clicks]`. Sound
  effects must never be the sole explanation of a state change.
- Keep captions clear of the concept-visualization disclosure, criteria rail,
  and primary evidence. Audio jokes should not force extra on-screen copy.

## Render and mixing checks

Before approval, perform and record all of the following:

1. Listen once with picture on good headphones for pronunciation, edit clicks,
   TTS discontinuities, reverb tails, pumping, and masking.
2. Listen on built-in laptop speakers at a modest volume. Every required noun
   and contrast must be understandable without leaning toward the screen.
3. Listen on a phone speaker in portrait orientation. Confirm “Kaiju QA,”
   “happy path,” “regression,” “targeted slow zone,” “full suite,” “Codex,” and
   “Loop Engineering” remain intelligible.
4. Fold the mix to mono and check that music, pass cues, regression marker, and
   stamp do not disappear or become harsh.
5. Watch once muted. Captions and visual evidence must still communicate the
   entire loop; audio is reinforcement, not a hidden requirement.
6. Listen once with eyes closed. The narration should remain coherent without
   implying that concept visualization is implemented gameplay.
7. Verify the tower fold, ambulance stop, suite completion, and tiny seal each
   retain their planned pocket of silence.
8. Measure integrated loudness and true peak on the final encoded MP4, not only
   the pre-encode master. Confirm both channels are present and no required
   clip is silent or truncated.
9. Review caption timing at normal speed and at 0.75×. Check the two-line limit,
   reading speed, semantic breaks, and absence of captions over key reveal
   frames.
10. Confirm every music/SFX asset and the Kokoro render metadata have source,
    license or generation basis, date, and permitted-use note. No untracked
    placeholder audio may remain in the final render.

## Source basis

- `AGENTS.md`
- `plans/devpost-kaiju-qa-video/PLAN.md`
- `plans/devpost-kaiju-qa-video/AGENT_ASSIGNMENTS.md`
- `plans/devpost-kaiju-qa-video/agent-notes/narrative.md`
- `plans/devpost-kaiju-qa-video/agent-notes/film-direction.md`
- `plans/devpost-kaiju-qa-video/agent-notes/comedy.md`
- Production-state constraint supplied in the assignment: offline HyperFrames
  with Kokoro ready and MusicGen dependencies unavailable.

## Completion summary

Specified an offline-ready Kokoro narration profile, an 184-word timing target
for the 88-second cut, pronunciation and performance guidance, a
license-conscious music fallback, a restrained tactile SFX grammar, concrete
loudness and ducking targets, caption timing rules, and small-speaker mixing
checks. No IWSDK, IWER, browser, XR runtime, dev server, build, render, branch,
commit, or push operation is required for this direction note.
