# Kaiju QA browser evidence provenance

- Repository: `SoundGuyAI/OpenAIBuildWeek`
- Branch: `feature/kaiju-qa`
- Commit: `2674d397ad8cf88f7739874f22abbeed7640f9d5`
- GitHub Actions workflow: `Pull request CI`, run `29786685632` (#13)
- Job: `Typecheck, build, and browser E2E`
- Result: success on 2026-07-20 UTC
- Evidence artifact: `browser-evidence-29786685632-1`, artifact ID `8478733358`
- Artifact digest: `sha256:c702a872b924b478a4a3f4d52081272dd8f8f01c23239882ee4aa839bd903716`

The successful job ran typecheck, built the production site, installed Chromium
dependencies, executed desktop and mobile Chromium E2E, and uploaded these two
screenshots. The copies in this video project are byte-identical to the GitHub
Actions artifact downloaded with `gh run download`.

## File hashes

- `ci-desktop.png`: `ea8d71e3bcb07b91b05f1a613184867b286ee5dddecf313c9750542e1909ce56`
- `ci-mobile.png`: `aaffb073883a1f42c13dfbb530eaf4d370424d4e822cad9d364df2eea0f2b529`

No IWSDK, IWER, Vite server, Playwright run, or browser game runtime was started
locally while preparing this video. The runtime evidence came from the existing
remote CI run.

## Moving working-demo capture

- Capture workflow: `Capture Kaiju QA working demo`
- Workflow run: `29791302806`
- Capture branch commit: `c02228df86c1b7c2abddb5ad1a9bf4e6b65f1983`
- Game source: pinned commit `2674d397ad8cf88f7739874f22abbeed7640f9d5`
- Artifact: `kaiju-qa-working-demo-29791302806-1`, ID `8480384644`
- Artifact digest:
  `sha256:2d0f66828c191f1b8623aaa4859772d39c4cb092674b6b0112af7dedc966a67b`
- `working-demo.mp4` SHA-256:
  `e884bb26ab72900b8da104075769e3aa85ad0233cc54a6a23a0a1ba62db837f9`
- Media probe: H.264, 1280 x 720, 30 fps, 8.166667 seconds, silent

The remote workflow built the pinned game commit, launched its production
preview on the GitHub-hosted runner, and used Playwright with a visible demo
cursor to record baseline evidence, the broad-guardrail ambulance regression,
the targeted slow-zone correction, the 3/3 rerun, and the earned release. The
capture script and workflow are committed with the video project.
