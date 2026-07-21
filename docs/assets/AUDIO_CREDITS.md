# Kaiju QA narration audio credits

Generated 2026-07-21 from project-authored English narration. The committed
WAV files are pre-generated runtime assets; the game does not synthesize speech
in the browser and does not require a TTS service or model download at runtime.

## Tool and model provenance

- Command: `npx --yes=false hyperframes tts <script.txt> --output <cue.wav> --voice bf_emma --speed 0.92 --json`
- Environment: `HYPERFRAMES_PYTHON=C:\Python313\python.exe`
- Tool: HyperFrames CLI `0.7.64`, local/offline `tts` command (Apache-2.0)
- Synthesis engine: Kokoro-82M
- Voice preset: `bf_emma` (Emma, British English)
- Model bundle: `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the
  `thewh1teagle/kokoro-onnx` `model-files-v1.0` release
- Delivery format: 24000 Hz, 1 channel, 16-bit WAV
- Total authored narration: 49.216 seconds across 12 clips
- Reproduction entry point: `node scripts/generate-narration.mjs`

HyperFrames is Apache-2.0 licensed. Its local TTS implementation uses the
MIT-licensed `kokoro-onnx` wrapper and downloads that project's v1.0 ONNX model
and voice bundle. The underlying Kokoro-82M model card declares the model and
weights Apache-2.0. Provenance and license references:

- https://github.com/heygen-com/hyperframes/blob/main/LICENSE
- https://github.com/thewh1teagle/kokoro-onnx/blob/main/LICENSE
- https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
- https://huggingface.co/hexgrad/Kokoro-82M
- https://github.com/hexgrad/kokoro/blob/main/LICENSE

These WAVs contain newly synthesized performances of text authored for Kaiju QA.
No third-party music, field recording, actor recording, or franchise audio is
redistributed in this narration set. Keep this credit file with redistributed
builds that include the generated clips.

## Generated clips

| Cue ID | File | Duration | SHA-256 | Script |
| --- | --- | ---: | --- | --- |
| `tutorial-intro` | `tutorial-intro.wav` | 5.397 s | `b73a6c2f3f73...` | Welcome to Kaiju QA. This little helper means well. Your job is to prove it is safe. |
| `place-car` | `place-car.wav` | 3.051 s | `58e6b3f0835e...` | Grab the stalled car and snap it into the glowing street. |
| `baseline` | `baseline.wav` | 3.648 s | `59e81c4d5d44...` | Pull the test lever. One happy path is not permission to ship. |
| `place-tower` | `place-tower.wav` | 4.693 s | `c2bcd525ad2d...` | Place the fragile tower beside the route. Same behavior, tougher evidence. |
| `tower-fail` | `tower-fail.wav` | 4.160 s | `b5b3a9d23088...` | The tower failed. Try the broad freeze rule, then rerun every test. |
| `regression` | `regression.wav` | 3.691 s | `c0be20eda8d9...` | Tower safe. Ambulance blocked. The fix broke an old pass. |
| `targeted` | `targeted.wav` | 4.053 s | `310b1a0469ae...` | Swap in the striped slow zone. Change only where the hazard exists. |
| `release` | `release.wav` | 3.264 s | `108d4971da0e...` | Three passes, no regressions. Press the release stamp. |
| `school` | `school.wav` | 3.947 s | `be2aca2dfc86...` | School crossing. Protect walkers without slowing the emergency route. |
| `harbor` | `harbor.wav` | 4.608 s | `52c5de51a367...` | Harbor load test. Check the heavy cargo boundary, not just the easy crate. |
| `storm` | `storm.wav` | 3.904 s | `ef285bd9f457...` | Storm shift. Add the rain condition and preserve every rescue route. |
| `finale` | `finale.wav` | 4.800 s | `1cb9fda4ee7a...` | Evidence accepted. Release earned. Our baby kaiju is ready for the city. |
