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
