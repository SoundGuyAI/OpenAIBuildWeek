# HyperFrames production plan — Kaiju QA Devpost video

Role: HyperFrames production specialist

Project: `videos/kaiju-qa-devpost/`

Platform: Windows / PowerShell

Workflow: `product-launch-video`, no-capture path

## Executive recommendation

Keep the current eight-frame, 1920×1080 product-launch structure and build it
as original HTML/CSS/SVG concept animation with the Azure hero still only in
Frames 1 and 8. Use the already selected `creative-mode` frame preset, local
Kokoro narration, burned-in captions, no music, and no IWSDK/IWER/runtime work.

The production should not dispatch frame workers yet. Four prerequisites remain:

1. Install a full FFmpeg build that includes `ffmpeg.exe` and `ffprobe.exe`.
2. Prove the offline Kokoro-to-word-timing path with one short TTS/transcription
   smoke test. Kokoro is installed, but the current machine has no Whisper cache,
   CMake, or C++ build tool.
3. Stage local font files for Archivo Black, Space Grotesk, and JetBrains Mono,
   with their licenses and hashes. The current project names these fonts but has
   no font files.
4. Finish Step 4 visual direction in `STORYBOARD.md`: every frame needs a
   time-coded Scene sequence, `focal`, `roles`, and deliberate `sfx` policy.

After those gates, build one calibration frame first—Frame 5, the ambulance
regression—then dispatch one agent for every remaining frame. Frame 5 is the
best visual-system proof because it must communicate the broad rule, stopped
ambulance, preserved tower pass, and regression state without relying on copy.

## Current project audit

| Item | Current state | Production implication |
| --- | --- | --- |
| Brief | `BRIEF.md` exists; autonomous, YouTube/Devpost, 1920×1080, 95 seconds, narrated, `creative-mode` | Route and creative defaults are locked. |
| Storyboard | Eight outline frames totaling exactly 95 seconds | This is the top of the desired 75–95 second window; real TTS timing must be checked before build. |
| Script | Eight narrated lines, 186 words | Appropriate for roughly 80–90 seconds with pauses. |
| Design system | `frame.md` and `.hyperframes/caption-skin.html` exist | Step 2 is complete; do not rerun the preset builder casually because it overwrites both artifacts. |
| Composition | `index.html` is still the 10-second blank scaffold; no `compositions/` directory | Assembly has not begun. |
| Assets | No project `assets/` directory yet | Run asset staging after visual direction; fonts must be added before workers. |
| Hero image | 1024×768 PNG, 358,847 bytes, SHA-256 `b61b21ebdbbd1b7bc289eea1c6837998276fc26d259de46832659676c73adf3c` | File is valid, matches the ledger, and should be cropped/contained rather than stretched to 16:9. |
| Audio | No `audio_meta.json`, `audio_engine_meta.json`, or generated voice files | Audio preflight is the next hard technical gate. |
| Captions | Enabled in the storyboard; no generated caption composition | Word timings are mandatory before assembly. |
| Music | `music: none` | Preserve the no-music decision; do not let provider auto-detection add a track. |
| CLI | Project scripts pin `hyperframes@0.7.64` | Use that exact version for authoring checks and render. |
| Node | Node 22.18.0; npm/npx 11.8.0 | Meets the HyperFrames Node 22+ requirement. |
| FFmpeg | `ffmpeg` and `ffprobe` are absent from `PATH` | Hard blocker for audio duration checks, final render, and acceptance probing. |
| HeyGen | CLI absent; no HeyGen/HYPERFRAMES key and no `~/.heygen/credentials` | Expected offline state; not a blocker because the brief selects Kokoro. |
| Kokoro | `kokoro_onnx` and `soundfile` import successfully; model and voices are cached | Local TTS is ready. |
| Caption ASR | No Whisper cache; `cmake`, `ninja`, `cl`, and `make` are absent | Kokoro can speak, but automated word timing is likely to fail until this is fixed. |
| Browser | System Chrome exists; HyperFrames pinned-browser cache is absent | Run `browser ensure` before the first browser gate. |
| Machine | 4 logical CPUs, 28 GB RAM, about 7.4 GB free RAM and 19.7 GB free on C: during audit | Render with one worker initially; avoid IWSDK and extra Chrome sessions. |

## Windows production sequence

### 1. Set deterministic paths and pin the nested CLI

Run from PowerShell. Quote every path; do not depend on the current shell being
in the repository root.

```powershell
$Repo = 'C:\UnityProj\OpenAIBuildWeek-devpost-kaiju-qa-video'
$Project = Join-Path $Repo 'videos\kaiju-qa-devpost'
$PLV = Join-Path $Repo '.agents\skills\product-launch-video'
$Rules = Join-Path $Repo '.agents\skills\hyperframes-animation\rules'

Set-Location $Project

# package-lock remains untouched; node_modules is already ignored by the repo.
npm install --no-save --no-package-lock hyperframes@0.7.64
npx --no-install hyperframes --version
```

Why install the local transient pin: the project `npm` scripts already name
`hyperframes@0.7.64`, but the media engine launches nested bare
`npx hyperframes tts` and `npx hyperframes transcribe` commands. A local
`node_modules/.bin/hyperframes` keeps those child calls on the same version.

Do not run `hyperframes skills update` during this branch's production pass.
The workflow files are already installed, and an update can rewrite many
tracked `.agents/skills` files, creating a large, conflict-prone diff one day
before the deadline. If a genuine incompatibility is found, refresh skills in
an isolated maintenance worktree and intentionally review the resulting diff.

### 2. Clear environment blockers before authoring

Install a full Windows FFmpeg distribution containing both executables, reopen
the shell if the installer changed `PATH`, then verify:

```powershell
Get-Command ffmpeg, ffprobe
ffmpeg -hide_banner -version
ffprobe -hide_banner -version
npx --no-install hyperframes doctor --json
npx --no-install hyperframes browser ensure
```

`doctor --json` always exits zero, so gate on its JSON `ok` field rather than
the process exit code. The browser command should install HyperFrames' pinned
Chrome; the system Chrome is present as a fallback, but the pinned browser is
the reproducible path.

### 3. Lock the intentional offline audio route

Run and retain the output of:

```powershell
npx --no-install hyperframes auth status
```

For this autonomous project, signed-out exit code 1 is an expected offline
state, not an error. Do not create a repository `.env` and do not copy any
credentials from Symphony. If the shell unexpectedly has provider credentials,
clear them only in the current production process and point `HEYGEN_CONFIG_DIR`
at an empty temporary directory before audio generation. Also clear an
unexpected `ELEVENLABS_API_KEY`; otherwise the shared engine may choose a cloud
provider instead of Kokoro.

This matters twice:

- TTS provider selection is automatic: HeyGen → ElevenLabs → Kokoro.
- The product-launch audio adapter hard-codes BGM mode to `retrieve`. With the
  storyboard value `music: none`, a signed-in run could search for a track named
  “none.” Staying offline correctly yields no BGM.

### 4. Prove TTS and word timing before generating eight lines

Use a short smoke line in `%TEMP%` first:

```powershell
$AudioProbe = Join-Path $env:TEMP 'kaiju-qa-tts-probe.wav'
$TranscriptProbe = Join-Path $env:TEMP 'kaiju-qa-transcript-probe'

npx --no-install hyperframes tts 'One happy path is not proof.' `
  --voice am_michael `
  --output $AudioProbe

ffprobe -v error -show_entries format=duration `
  -of default=nw=1:nk=1 $AudioProbe

npx --no-install hyperframes transcribe $AudioProbe `
  --model small.en `
  --dir $TranscriptProbe
```

Gate: the WAV exists, has a positive duration, and the transcript contains
non-empty word-level timing records. Do not start the full script if this fails.

The likely Windows failure is the first Whisper run: this machine has Git but
no CMake or compiler toolchain and no cached Whisper binary/model. The safe
fixes are, in order:

1. Supply a known-good prebuilt `whisper-cli.exe` and point
   `HYPERFRAMES_WHISPER_PATH` to it.
2. Or install CMake plus a supported Windows C++ build tool, then rerun the
   single-line smoke test and allow HyperFrames to build/download once.
3. If the team elects to authenticate with HeyGen instead, its TTS path returns
   native word timestamps and avoids Whisper—but that changes the locked
   offline production choice and should be an orchestrator decision.

Do not accept an `audio_meta.json` with empty `words` arrays; captions would be
missing even if the voice WAVs exist.

### 5. Stage fonts and licenses

Before frame dispatch, place local WOFF2 files under
`videos/kaiju-qa-devpost/assets/fonts/` for every family named by `frame.md`:

- Archivo Black regular
- Space Grotesk regular (plus any weight actually used)
- JetBrains Mono regular

Add source URL, exact license, acquisition date, file hash, and permitted use to
`ASSET_LICENSES.md`. Add one canonical `@font-face` block to `frame.md` for
workers to copy into each sub-composition. The caption builder searches
`assets/fonts/` by family name, so use clear filenames such as
`ArchivoBlack-Regular.woff2`.

Do not rely on Google Fonts CSS or system fonts during render. The current
project has no font files, and clean/headless Chrome can silently fall back to a
generic face while all automated checks otherwise look healthy.

### 6. Finish visual direction and asset staging

The current storyboard has the story, duration, blueprint, and voiceover for
all eight frames, but it does not yet meet the Step 4 dispatch contract. For
each frame, the orchestrator must add:

- a time-coded `Scene 1 … Scene N` sequence spanning the full frame duration;
- a `focal` choice;
- `roles` for every candidate;
- an explicit SFX policy;
- non-empty `asset_candidates` text, even when the answer is “original
  HTML/CSS/SVG; no external asset.”

Then stage named assets synchronously:

```powershell
node (Join-Path $PLV 'scripts\stage-assets.mjs') `
  --storyboard .\STORYBOARD.md `
  --hyperframes .
```

Gate: `assets/kaiju-qa-hero.png` exists and hashes to the ledger value; every
other referenced path exists. Frames 2–7 should remain original vector work
unless a licensed asset is intentionally added.

### 7. Generate narration in the foreground first

For the first production run, prefer a foreground process so an audio error is
visible immediately. PowerShell's `&` is a call operator, not Unix background
syntax.

```powershell
node (Join-Path $PLV 'scripts\audio.mjs') `
  --script .\SCRIPT.md `
  --storyboard .\STORYBOARD.md `
  --hyperframes . `
  --out .\audio_meta.json `
  --voice am_michael `
  --speed 1.0
```

Gate with PowerShell after generation:

```powershell
$AudioMeta = Get-Content .\audio_meta.json -Raw | ConvertFrom-Json
if ($AudioMeta.voices.Count -ne 8) { throw 'Expected eight voice clips.' }
foreach ($Voice in $AudioMeta.voices) {
  if (-not (Test-Path -LiteralPath $Voice.path)) { throw "Missing $($Voice.path)" }
  if ($Voice.duration_s -le 0) { throw "Bad duration for frame $($Voice.frame)" }
  if ($Voice.words.Count -eq 0) { throw "No word timing for frame $($Voice.frame)" }
}
```

If concurrency is later desirable, use `Start-Process -WindowStyle Hidden
-PassThru` with separate stdout/stderr log paths and `Wait-Process` before
duration sync. Never fire-and-forget audio and immediately assemble; that can
produce a valid-looking silent index.

### 8. Synchronize real voice durations, then normalize Scene windows

```powershell
node (Join-Path $PLV 'scripts\audio.mjs') sync-durations `
  --audio-meta .\audio_meta.json `
  --storyboard .\STORYBOARD.md
```

Real voice duration is authoritative. Recalculate the total and confirm it is
inside the intended 75–95 second band and always below the Devpost hard maximum
of 2:59. If it exceeds 95 seconds, trim script words and regenerate audio; do
not speed past 1.05×. If it becomes shorter, preserve the lesson's silence
through punctuation and visual hold design rather than manually falsifying
synced durations.

After sync, make a mechanical pass over the time-coded Scene windows so each
final Scene ends at its frame's new duration. Do this before frame dispatch.

### 9. Use an explicit SFX policy

The installed offline SFX directory is inconsistent: its manifest names 19
effects, but only `chime.mp3` is present. `fetch-sfx` treats missing files as
non-blocking anomalies and skips them. Do not assume a cue exists because it is
listed in the manifest.

Safest deadline choices:

1. Use only the existing cleared `chime` for the final pass/release beat.
2. Or stage a very small set of original project-owned tactile cues and record
   their provenance.
3. Avoid refreshing the entire skill pack in this branch merely to recover SFX;
   that creates a large merge surface.

If the storyboard names only verified cues, run:

```powershell
node (Join-Path $PLV 'scripts\audio.mjs') fetch-sfx `
  --storyboard .\STORYBOARD.md `
  --hyperframes . `
  --audio-meta .\audio_meta.json
```

Treat any “bundled file missing” anomaly as a failed selected cue, even though
the script itself allows the video to continue.

### 10. Dispatch one frame per agent

The current 13-shot film plan has been consolidated into eight storyboard
frames. One worker owns one storyboard frame and must implement every time-coded
Scene window inside it; do not split camera cuts inside one frame across writers.

Build Frame 5 first as a calibration pilot, review its source against the
continuity contract, then submit the remaining seven workers together. Codex's
concurrency cap may queue one or more workers; queuing reduces parallelism, not
scope.

| Frame | Exclusive output | Blueprint / build emphasis |
| --- | --- | --- |
| 05 — Regression found | `compositions/frames/05-regression.html` | **Pilot.** `kinetic-type-beats` adapted around the stopped ambulance and “regression” reveal; prove shape-coded evidence works without text. |
| 01 — Fast help | `compositions/frames/01-fast-help.html` | `video-text-pivot`; crop/grade the 4:3 Azure still without stretching, then reveal concept title and test-lab framing. |
| 02 — Happy path | `compositions/frames/02-happy-path.html` | `cursor-ui-demo`; original tabletop interaction, criteria rail, retained path, and partial-pass interlock. |
| 03 — Edge case | `compositions/frames/03-edge-case.html` | `comparison-split`; preserve the happy-path evidence while the same behavior folds the toy tower. |
| 04 — Broad fix | `compositions/frames/04-broad-fix.html` | `grid-card-assemble`; broad field, tower pass, tempting stamp, and stopped release interlock. |
| 06 — Targeted fix | `compositions/frames/06-targeted-fix.html` | `spatial-pan-stations`; aligned path evidence and broad-field contraction into one local zone. |
| 07 — Release earned | `compositions/frames/07-release-earned.html` | `grid-card-assemble`; three readable suite states, completed loop, and tiny approval seal. |
| 08 — Prove it | `compositions/frames/08-prove-it.html` | `logo-assemble-lockup`; truthful cross-device design claim, actual repository artifacts, final hero return, and closing line. |

Each dispatch must contain the full
`.agents/skills/product-launch-video/sub-agents/frame-worker.md` text followed by
this context, with the frame's own storyboard block copied verbatim:

```text
PROJECT_DIR: C:\UnityProj\OpenAIBuildWeek-devpost-kaiju-qa-video\videos\kaiju-qa-devpost
frame_id: <exact basename, e.g. 05-regression>
Canvas: 1920x1080 at 30 fps
Captions: enabled; keep all load-bearing content above y=896
RULES_DIR: C:\UnityProj\OpenAIBuildWeek-devpost-kaiju-qa-video\.agents\skills\hyperframes-animation\rules
Confirmed sketch: no; preserve the shared frame.md and visual-continuity contract
Exclusive output: compositions/frames/<frame_id>.html
Reference after pilot: compositions/frames/05-regression.html is read-only
```

Worker rules that the orchestrator must enforce:

- The worker writes only its one HTML file and never edits `STORYBOARD.md`.
- All style, markup, GSAP loading, and scripts live inside `<template>`.
- Host id, inner `data-composition-id`, timeline key, and filename basename are
  identical.
- Style the sub-composition root through `#root`, not a class on the root.
- Full-bleed grounds live on a full-duration `.clip`, not on the root.
- Prefix every descendant id with the frame id to avoid cross-frame duplicates.
- No `<video>` or `<audio>` in a frame sub-composition. Root audio/media is
  assembled centrally.
- All motion is synchronous, seek-safe, finite, and uses the cited blueprint and
  rule recipes; no network fetch, timer, random state, or exit tween.
- The main subject is visible by 0.5 seconds and reveals continue across the
  voiceover instead of completing in the first quarter.
- A missing artifact after wait triggers one identical re-dispatch with repair
  context; the orchestrator, not workers, updates `status: animated`.

### 11. Build captions and assemble synchronously

After all eight frame files exist and the storyboard statuses are updated:

```powershell
node (Join-Path $PLV 'scripts\captions.mjs') build `
  --storyboard .\STORYBOARD.md `
  --audio-meta .\audio_meta.json `
  --hyperframes . `
  --out .\caption_groups.json

node (Join-Path $PLV 'scripts\assemble-index.mjs') `
  --storyboard .\STORYBOARD.md `
  --hyperframes . `
  --audio-meta .\audio_meta.json

node (Join-Path $PLV 'scripts\transitions.mjs') inject `
  --storyboard .\STORYBOARD.md `
  --hyperframes .

node (Join-Path $PLV 'scripts\transitions.mjs') verify `
  --storyboard .\STORYBOARD.md `
  --index .\index.html
```

Do not launch captions in the background and race assembly against it. On
Windows, sequential execution is cheap insurance: `assemble-index.mjs` includes
captions only when `compositions/captions.html` already exists.

Assembly output checks:

- eight frame sub-composition hosts;
- eight voice audio clips;
- one captions host;
- zero BGM clips;
- only the deliberately selected SFX clips;
- root duration equals the sum of synchronized frame durations;
- every asset/audio path exists on disk.

### 12. Run the browser gate, then inspect the contact sheet

Use `lint` for repair waves, then one strict final `check`; `check` is the current
replacement for the deprecated `validate` and `inspect` commands named in the
older plan.

```powershell
npx --no-install hyperframes lint --json

npm run check -- `
  --snapshots `
  --samples 17 `
  --at-transitions `
  --caption-zone 'x0=0;y0=.82;x1=1;y1=1;severity=error;seek=.25,1' `
  --frame-check `
  --strict
```

When a finding names one frame file, re-dispatch only that frame's worker with
the exact finding and repair context. Shared index/audio/caption findings remain
orchestrator-owned.

After sync, compute one midpoint per frame and run `snapshot --at`. With the
current unsynchronized 95-second plan, the provisional midpoints are:

```powershell
npx --no-install hyperframes snapshot `
  --at 4.5,14.5,25,35,45.5,57,70.5,86.5
```

Recompute this list after audio sync. Inspect the sheet at normal size and at
320×180, then inspect a grayscale/color-vision simulation separately. Gate on:

- no missing/unstyled sub-compositions;
- captions clear of load-bearing content;
- disclosure visible on every synthetic game-style frame;
- state meaning legible by shape, not red/green alone;
- no black frames, fallback fonts, broken asset paths, or front-loaded shots;
- Frame 8's “actual artifacts” claim backed only by genuine repository content.

### 13. Preview once, then render conservatively

Start Studio as a hidden background process, not a blocking foreground command,
and verify it remains running before handing over its URL. The final review URL
must include `#project/kaiju-qa-devpost`.

After explicit render approval:

```powershell
npm run render -- `
  --quality high `
  --fps 30 `
  --workers 1 `
  --no-browser-gpu `
  --output renders/video.mp4
```

This project is HTML/CSS/SVG, not WebGL, so one worker and disabled browser GPU
are the stable first attempt on a 4-logical-CPU machine. If that exposes a
browser rendering defect, retry with the default browser-GPU behavior before
changing composition code. Do not enable FFmpeg GPU encoding unless its codec
support was explicitly verified.

### 14. Verify the final MP4 independently

```powershell
Get-Item .\renders\video.mp4 | Select-Object FullName, Length

ffmpeg -v error -i .\renders\video.mp4 -f null NUL

ffprobe -v error `
  -show_entries 'format=duration:stream=index,codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels' `
  -of json `
  .\renders\video.mp4

ffmpeg -hide_banner -i .\renders\video.mp4 `
  -af 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json' `
  -f null NUL
```

Acceptance values:

- one 1920×1080 video stream;
- 30 fps;
- at least one audible audio stream;
- positive duration below 179 seconds, preferably 75–95 seconds;
- no decode errors;
- approximately -14 LUFS integrated and no true peak above -1 dBTP;
- voice and captions present through the final required line.

Finally watch once with sound, once muted, and listen once without picture.
Those three passes catch narrative dependence, caption gaps, and unsupported
gameplay implications that probes cannot.

## Failure matrix and safe fixes

| Failure | Likely evidence | Safe fix |
| --- | --- | --- |
| Skill updater rewrites the repository or fails to find `npx` | Large `.agents/skills` diff or updater spawn error | Do not update in this production branch. Use the installed files and pinned CLI. If diagnosis is necessary, Node's npm CLI exists at `C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js`; test in an isolated maintenance worktree. |
| Nested media calls use a different HyperFrames version | TTS/transcribe behavior differs from `npm run check` | Install `hyperframes@0.7.64` locally with `--no-save --no-package-lock`; use `npx --no-install`. |
| FFmpeg/FFprobe missing | Doctor failure; voice durations become NaN; render cannot encode; final probe unavailable | Install a complete build containing both binaries, reopen shell, rerun doctor and the one-line audio probe. Do not install an “ffmpeg only” essentials bundle without confirming ffprobe. |
| Signed-out auth status returns exit 1 | `auth status` says not signed in | Expected for this autonomous offline run. Continue with Kokoro; do not create a project `.env`. |
| Unexpected credential selects HeyGen/ElevenLabs or BGM | Cloud request, billing/auth error, or a music search for “none” | Clear provider variables in the child process and point `HEYGEN_CONFIG_DIR` to an empty temporary directory; rerun the one-line probe. |
| Kokoro speaks but captions have no timings | Voice WAVs exist; `words` arrays are empty; transcribe errors | Fix Whisper first with a prebuilt executable or CMake/compiler path. Stop before caption build. |
| Windows `python3.exe` opens Store alias | “Python was not found” from the WindowsApps alias | The installed media code probes candidates and should fall through to `C:\Python313\python.exe`; if a direct command is needed, use `python`, not `python3`. |
| Offline SFX silently disappear | `fetch-sfx` anomaly says bundled file missing | Use only the physically present `chime.mp3`, stage original cleared cues, or intentionally omit SFX. Do not trust manifest-only entries. |
| Font fallback in MP4 | Caption warning, layout drift, generic-looking type | Ship local WOFF2 files, embed `@font-face` inside every frame template, and record licenses/hashes. Never depend on remote Google Fonts. |
| CDN GSAP request fails | `check` reports failed jsDelivr request; timelines are undefined | First confirm network/proxy. Deadline fallback: vendor the exact GSAP 3.14.2 build once and update host, caption, and frame script references consistently; do not mix GSAP versions. |
| PowerShell background syntax causes a race | Missing captions/audio despite successful later files | Run audio/captions synchronously, or use hidden `Start-Process` plus `Wait-Process`. A trailing `&` is not the Unix background operator. |
| Sub-composition is blank or unstyled | Tiny default text, black frame, timeline registration timeout | Re-dispatch the named frame: keep all live nodes inside `<template>`, style root through `#root`, match all composition IDs, and place the ground on a timed `.clip`. |
| Media inside a frame renders black | Static checks pass but image/video panel is blank | Keep `<video>`/`<audio>` as direct children of the assembled host root. For this plan, frame workers should use `<img>`/SVG only; orchestrator owns all audio. |
| Cross-file duplicate IDs | One image/element disappears only after assembly | Prefix every frame descendant id with its frame id; scan assembled source before render. |
| Caption band collision | `check --caption-zone` error or contact-sheet overlap | Keep centers of all load-bearing content above y=896 and repair only the responsible frame. |
| Front-loaded/frozen shot | `sweep_static` or `motion_frozen`; full layout appears in first quarter | Spread Scene reveals across the voiceover and add motion sidecar assertions. Do not add meaningless drift merely to satisfy the check. |
| Asset staging misses hero image | Frame 1/8 broken request | Run `stage-assets.mjs`, verify hash, and use the exact `assets/kaiju-qa-hero.png` path. |
| Audio file exists but assembler skips it | Assembly anomaly says voice path not on disk; output has no audio | Require eight existing voice paths before assembly; inspect assembly counts and ffprobe streams. |
| Render stalls or makes the machine unusable | Several Chrome processes, low free RAM, timeout | Keep IWSDK/IWER closed, use `--workers 1`, close unrelated Chrome windows, and raise `--browser-timeout` only after identifying slow asset/font loading. |
| Pinned Chrome download fails | `browser ensure` error | Retry after checking proxy/disk. System Chrome exists for diagnosis, but document any fallback because pixels may differ from the pinned browser. |
| Preview URL is dead | Studio loads with no project or server exited | Keep preview running in a hidden process and use `http://localhost:<port>/#project/kaiju-qa-devpost`. |
| Duration drifts above target | Synced storyboard or ffprobe exceeds 95 seconds | Trim narration, regenerate, resync, rebuild captions/index, and rerun checks. Never patch only root duration. |

## Sources reviewed

Repository and production state:

- `AGENTS.md`
- `plans/devpost-kaiju-qa-video/PLAN.md`
- `plans/devpost-kaiju-qa-video/AGENT_ASSIGNMENTS.md`
- `plans/devpost-kaiju-qa-video/agent-notes/film-direction.md`
- `plans/devpost-kaiju-qa-video/agent-notes/narrative.md`
- `plans/devpost-kaiju-qa-video/agent-notes/art-direction.md`
- `plans/devpost-kaiju-qa-video/agent-notes/audio-direction.md`
- all current text/config/media-ledger files under `videos/kaiju-qa-devpost/`

Installed HyperFrames skills:

- `.agents/skills/hyperframes/SKILL.md`
- `.agents/skills/product-launch-video/SKILL.md`
- `.agents/skills/hyperframes-core/SKILL.md`
- `.agents/skills/hyperframes-creative/SKILL.md`
- `.agents/skills/hyperframes-animation/SKILL.md`
- `.agents/skills/media-use/SKILL.md`
- `.agents/skills/hyperframes-cli/SKILL.md`
- product-launch `frame-worker.md`, story/visual/motion references, and scripts
- core brief, storyboard, script, production, dispatch, determinism, media,
  tracks, sub-composition, and review references
- creative house-style, video-composition, design-spec, story-spine, and
  narration references
- animation blueprint/rule indexes
- media-use TTS, requirements, and TTS-to-captions references
- CLI init, doctor/browser, lint/check/snapshot, preview/render, and auth/cloud
  references

## Checks performed for this note

- Verified Node, npm, npx, Python, Chrome, Git, package-manager, memory, CPU,
  and disk availability without launching IWSDK/IWER or a server.
- Verified `ffmpeg`, `ffprobe`, `heygen`, CMake, Ninja, MSVC `cl`, and Make are
  currently unavailable on `PATH`.
- Verified Python 3.13.7, `kokoro_onnx`, and `soundfile`; confirmed the Kokoro
  model and voices are cached.
- Verified the Windows Store `python3` alias fails while `python` and `py -3`
  work; confirmed the installed media code contains a Windows fallback resolver.
- Verified no HeyGen/HYPERFRAMES environment credential and no default HeyGen
  credentials file, without reading or printing any secret value.
- Verified the hero PNG dimensions, byte size, hash, and duplicate adopted-media
  hash against `ASSET_LICENSES.md`.
- Counted eight storyboard frames, 95 planned seconds, and 186 spoken words.
- Verified the current absence of frame compositions, assembled assets, audio
  metadata, snapshots, and renders at audit time.
- Verified the current offline SFX manifest/file mismatch: 19 named manifest
  entries but only `chime.mp3` physically present.
- Performed a Markdown/source review only. No branch, commit, push, IWSDK, IWER,
  browser preview, game server, HyperFrames render, or shared project edit was
  performed.
