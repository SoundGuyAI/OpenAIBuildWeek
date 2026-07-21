# Kaiju QA Devpost video - plan

Branch: `codex/devpost-kaiju-qa-video`  
Slug: `devpost-kaiju-qa-video`  
Status: rendered; final review and PR preparation

## Outcome

Create a judge-ready, narrated, captioned HyperFrames video that explains the
Kaiju QA game loop in under three minutes, makes the educational value and
regression mechanic immediately understandable, and can be revised without
touching the game runtime or other active feature branches.

## Locked brief

- Mode: autonomous; the user asked the team to make the creative decisions.
- Audience: OpenAI Build Week judges, educators, and AI-assisted-development learners.
- Message: Kaiju QA turns safe iteration - goal, bounded change, evidence,
  regression testing, and release - into a memorable three-minute spatial game.
- Angle: "The regression is the real monster." Start with a funny failure,
  reveal the quality-engineering loop, then end on earned release confidence.
- Destination/aspect: Devpost-hosted YouTube demo, 16:9 landscape.
- Language: English voice-over plus burned-in/readable captions.
- Target length: 75-95 seconds; hard maximum 2:59.
- Disclosure: concept visualization unless and until matching gameplay capture
  exists. Do not imply that mock scenes are implemented footage.

## Acceptance criteria

1. The final MP4 is 1920x1080, English, under three minutes, has intelligible
   voice-over, readable captions, and no clipped or silent required content.
2. A judge can retell the loop after one viewing: happy path, fragile-tower edge
   case, over-broad fix, ambulance regression, targeted slow-zone fix, full
   regression pass, release.
3. The first 10 seconds state both the learner problem and the Kaiju QA promise.
4. The story supports the competition criteria without unsupported claims:
   technological implementation plus explicit Codex and GPT-5.6 process,
   coherent design, specific education impact, and novel idea.
5. Every external asset has a source, license, download/generation date, and
   permitted-use note in `videos/kaiju-qa-devpost/ASSET_LICENSES.md`.
6. Generated concept imagery uses the documented Azure FLUX.2-pro workflow;
   no other image generator is used.
7. HyperFrames source is editable and reproducible: brief, capture inventory,
   `frame.md`, `STORYBOARD.md`, `SCRIPT.md`, per-frame HTML, audio metadata,
   assembled `index.html`, contact sheet, and final render are present.
8. HyperFrames check passes before render; ffprobe confirms
   video/audio streams, duration, resolution, and frame rate.
9. Independent visual, narrative, licensing, and competition reviews have no
   unresolved blocking findings.
10. No IWSDK command or runtime is launched, and no files under `src/` or game
    E2E tests are changed.
11. The branch is committed, pushed, and opened as a draft PR against `main`.
12. After the PR exists, send one concise Telegram completion message through
    the existing Symphony integration. Never print, copy, or commit `.env`
    secrets.

## Non-goals

- Implementing or changing the Kaiju QA game.
- Claiming concept art or HTML animation is captured gameplay.
- Launching IWSDK, IWER, WebXR, or a game dev server on this machine.
- Uploading to YouTube or submitting the Devpost entry.
- Adding large third-party asset packs to the repository.
- Changing Symphony or Telegram credentials/configuration.

## Source inputs

- Read-only concept worktree:
  `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts`.
- Primary concept:
  `docs/design/loop-engineer-concepts/PROPOSALS.md` (Kaiju QA section).
- Submission positioning:
  `docs/design/loop-engineer-concepts/DEVPOST_SUBMISSION_DRAFT.md`.
- Art/licensing:
  `docs/design/loop-engineer-concepts/ASSET_PLAN.md` and
  `AZURE_FLUX_PROMPTS.md`.
- Azure image instructions discovered at
  `C:/UnityProj/Tmp/Flux-Image-Generation.md`; the requested
  `C:/UnityProj/azuretemp` directory is not present.

The concept worktree is uncommitted as of intake. Copy only the small source
materials needed by the video into its isolated project directory and record
their provenance. Never edit the concept worktree.

## Production architecture

- HyperFrames `product-launch-video` workflow, no-capture path.
- Project root: `videos/kaiju-qa-devpost/`.
- Working-prototype evidence comes from GitHub Actions on pinned game commit
  `2674d39`; a workflow-dispatch capture records the interaction remotely so
  IWSDK is never started on this machine.
- Original HTML/CSS/SVG motion plus Azure FLUX concept stills; Quaternius CC0
  assets are optional and only used after license verification.
- One sub-agent owns each final frame HTML file; the orchestrator owns shared
  storyboard, script, frame system, index assembly, audio integration, and fixes.
- Voice source selected through HyperFrames media/TTS preflight. Local voice is
  acceptable if HeyGen authentication is unavailable.

## Story spine

1. Cold open: a helmeted baby kaiju "helps" a city test and topples the fragile
   tower - useful failure, not punishment.
2. Promise: this is a game about engineering the loop around AI-assisted change.
3. Happy path: stalled car succeeds, but one pass is not coverage.
4. Edge case: add the fragile tower and observe the failure.
5. Bad fix/regression: freezing near buildings saves the tower but blocks an
   ambulance.
6. Diagnosis: compare evidence, preserve both criteria, place a targeted
   slow-zone boundary.
7. Release: all scenarios pass; the kaiju applies a comically tiny approval seal.
8. Impact/process close: cross-device lesson, Codex-built evidence loop, and a
   classroom/replay invitation.

## Verification matrix

| Surface | Check | Evidence |
| --- | --- | --- |
| Source | HyperFrames lint/validate/inspect | `render-qa.md` |
| Visual | Contact sheet at frame midpoints; no overflow, occlusion, broken assets, or illegible captions | `snapshots/contact-sheet.jpg`, `visual-review.md` |
| Audio | Voice intelligibility, no clipping, music ducking, caption timing | `audio-review.md` |
| Compliance | Duration < 3:00, 16:9, English, no unlicensed music/trademarks | `competition-review.md`, `ASSET_LICENSES.md` |
| Truthfulness | Concept visualization disclosure and no unsupported implementation claims | `review.md` |
| Git | Diff limited to isolated video/plan/evidence/log paths | `review.md` |

## Risks and mitigations

- Deadline is July 21, 2026 at 5:00 PM PT: optimize for a concise 75-95 second
  story and deterministic HTML motion.
- HyperFrames Windows updater may fail to find `npx`: use the already installed,
  hash-locked workflow files and record the updater error.
- TTS provider may require sign-in: use the local engine after the required auth
  status checkpoint if HeyGen is unavailable.
- Visual continuity across generated images: prefer one hero still plus original
  SVG/HTML diagrams; generate only shots that materially improve the story.
- Render load: do not run IWSDK; render only the isolated HyperFrames project.
- Devpost truthfulness: label mock visuals and reserve real-gameplay claims for
  later matching capture.
- Notification secrecy: invoke the existing Symphony Telegram path with its
  local `.env`; keep all credential values out of logs, commits, and tool output.

## Delivery

- Editable project: `videos/kaiju-qa-devpost/`
- Final render: `videos/kaiju-qa-devpost/renders/video.mp4`
- Rendered-master contact sheet:
  `videos/kaiju-qa-devpost/renders/qa/contact-sheet.png`
- Source contact sheets:
  `videos/kaiju-qa-devpost/snapshots/contact-sheet-1.jpg` and
  `contact-sheet-2.jpg`
- Evidence: `evidence/devpost-kaiju-qa-video/`
- Draft PR against `main`
- Telegram completion ping after the PR is confirmed
