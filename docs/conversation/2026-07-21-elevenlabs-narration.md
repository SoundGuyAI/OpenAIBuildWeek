# ElevenLabs narration migration — 2026-07-21

## 2026-07-21 — initial request

Branch: `main` (planning only; no implementation started)

> we want to use an elevenlabs voice instead

## 2026-07-21 — selected voice

> wBXNqKUATyqu0RtYt25i

## 2026-07-21 — delivery decision

> yes generate once for all the audio files we need

### Intake decision

- Replace the current pre-generated Kokoro narration clips with a complete, pre-generated ElevenLabs narration set using voice ID `wBXNqKUATyqu0RtYt25i`.
- Keep narration static at runtime: no API key, ElevenLabs request, or network dependency ships to players.

## 2026-07-21 — credential handling

> do we need an elevenlabs api key in the repo? i think we should just generate all the audio once with the api key and not save it in the env

> yeh go for it

### Confirmed decision

- Use a one-shot, hidden terminal prompt for the ElevenLabs API key during generation only. The generator must not write the key to the repository, environment files, logs, build output, or runtime bundle.

## 2026-07-21 — transfer and branch decision

> ok  move all of that into this worktree, delete than worktree and name this one audio-update

### Outcome

- Transferred the tested ElevenLabs generator and all twelve generated MP3 files into this checkout on branch `audio-update`.
- Verified that the transferred MP3 checksums exactly match the source worktree before cleanup.
- The original checkout's unrelated `package-lock.json` change and development-server conversation log remain uncommitted and untouched.

## 2026-07-21 — runtime audio replacement

> ok so now replace the old audio with the new ones

### Intended outcome

- Update the shipped narration manifest to resolve the generated ElevenLabs MP3 files instead of the previous Kokoro WAV files.

## 2026-07-21 — generator input order

> for the script, it should ask for two things, first the elevenlabs voice id, then the API key

### Intended outcome

- Future generation runs ask for a voice ID first, then prompt privately for the API key. Neither value is persisted.
