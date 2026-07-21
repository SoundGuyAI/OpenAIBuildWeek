# Asset and license ledger

All final media must be original, generated under the team's authorized tools,
or used under a compatible license. No asset enters the video without a row.

| Asset | Source | Rights/license | Acquired | SHA-256 | Use and disclosure |
| --- | --- | --- | --- | --- | --- |
| `capture/assets/kaiju-qa-hero.png` | Team-generated Azure FLUX.2-pro image copied from the read-only Loop Engineer concept worktree | Team-directed API output under the user's authorized Azure deployment; generation record and provider terms retained in `capture/AZURE_FLUX_PROVENANCE.md` | 2026-07-20 | `b61b21ebdbbd1b7bc289eea1c6837998276fc26d259de46832659676c73adf3c` | Hero/reveal/reference; label synthetic sequences as concept visualization, never gameplay capture |
| `assets/prototype/ci-desktop.png` | First-party GitHub Actions artifact from `feature/kaiju-qa` commit `2674d39`, run `29786685632` | Original project evidence; repository-owned browser capture | 2026-07-20 | `ea8d71e3bcb07b91b05f1a613184867b286ee5dddecf313c9750542e1909ce56` | Working-prototype desktop Chromium evidence; provenance in `assets/prototype/CI_PROVENANCE.md` |
| `assets/prototype/ci-mobile.png` | First-party GitHub Actions artifact from `feature/kaiju-qa` commit `2674d39`, run `29786685632` | Original project evidence; repository-owned browser capture | 2026-07-20 | `aaffb073883a1f42c13dfbb530eaf4d370424d4e822cad9d364df2eea0f2b529` | Working-prototype mobile Chromium evidence; provenance in `assets/prototype/CI_PROVENANCE.md` |
| Original HTML/CSS/SVG artwork | Authored in this branch | Original repository work | 2026-07-20 onward | Per Git history | Gameplay explanation, diagrams, titles, captions, transitions |
| `assets/voice/01.wav` - `08.wav` | Generated locally from `SCRIPT.md` with Kokoro-82M v1.0 ONNX voice `am_michael`; deterministic silence padding preserves the 95-second storyboard grid | Apache-2.0 upstream model/voice bundle; local generated speech, no third-party recording; source and engine hashes in `assets/voice/KOKORO_PROVENANCE.md` | 2026-07-20 | See voice hashes below | English voice-over |
| `assets/fonts/ArchivoBlack-Regular.ttf` | Google Fonts repository, `ofl/archivoblack` | SIL Open Font License 1.1; retained as `ArchivoBlack-OFL.txt` | 2026-07-20 | `dd9a89a019b4849f66ab75455fe7bdf931311042cbb0f0f97acc061539703180` | Display typography |
| `assets/fonts/SpaceGrotesk-Variable.ttf` | Google Fonts repository, `ofl/spacegrotesk` | SIL Open Font License 1.1; retained as `SpaceGrotesk-OFL.txt` | 2026-07-20 | `acad6de1fc93436f5c0f1f4137751ef04f1aea3063e7036535970ffcfbd79f72` | Body typography |
| `assets/fonts/JetBrainsMono-Variable.ttf` | Google Fonts repository, `ofl/jetbrainsmono` | SIL Open Font License 1.1; retained as `JetBrainsMono-OFL.txt` | 2026-07-20 | `48715a42ec242c21e9f02692891e147d022299a52e48d5e413e1a942193ffeda` | Evidence labels and artifact filenames |

## Optional Quaternius policy

Quaternius states that its models are CC0 and may be used in commercial,
educational, and personal projects. If any pack is used, add the exact pack URL,
download date, retained license/readme, file list, and hash before render. The
current production plan does not require downloading or redistributing a pack.

## Voice hashes

- `01.wav`: `7815e78981a66f0236109afdfde25ede28cca517a7e816424d37f115a129a64f`
- `02.wav`: `d881a0fa11cafa91e699e30ae19eb690ca32196bb94eee88dc40c6efc971dc3c`
- `03.wav`: `05842087282a34c8bc6f64a19a7fc32db7dbf3880c3a0f6cdfe200eec939c7a4`
- `04.wav`: `c97a66cbbd412e486966876fcb2f2f6b548d8e95a20bb7de28fc56c4bb02da0f`
- `05.wav`: `0ff38b62ba05565105da9a0ccd98f38e4f5353446227e8e9d8ddcbd29cbd3cab`
- `06.wav`: `0974e1433180ee85a42c3263bac7d25066b7c9b26d68e711e2c41e9f3f7c8261`
- `07.wav`: `c449b8fd0e23a1d0bace0cbe3c08d1ef10773f92808176819c91f7bf0381843b`
- `08.wav`: `1dc894b26b08deda760e44649632887efc5327b7d40afa3837e536e03ec9c38c`

The final cut intentionally contains no music or third-party SFX. Narration is
the only audio source, which keeps the competition master speech-first and
removes masking and per-file SFX provenance risk.
