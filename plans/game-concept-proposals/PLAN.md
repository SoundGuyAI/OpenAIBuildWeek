# Plan: visual WebXR game concept proposals

Branch: `codex/design-game-proposals`
Created: 2026-07-20
Status: complete; independent design and visual gates passed

## Outcome

Create a compact, highly visual proposal containing 20 original and clearly
distinct game concepts that share one codebase across desktop, mobile, and XR.

## Acceptance criteria

- [x] Exactly 20 concepts with visibly different fantasies, verbs, structures,
      tones, and spatial interactions.
- [x] One concept is **Loop Engineer**, an edutainment game where the player
  employs an NPC who teaches agentic software development across SDLC and SDLR
  through loop engineering.
- [x] Every concept explains desktop, touch, and XR input mappings.
- [x] Every concept has a one-line hook, visual shorthand, core loop, distinctive
      mechanic, scope/risk signal, and originality note.
- [x] The document can be skimmed visually before reading body text.
- [x] Azure FLUX.2-pro concept art and repository-native infographics are used.
- [x] Markdown source and a polished, visually verified PDF are included.
- [x] Similarity risks are researched and phrased carefully without claiming
      absolute novelty.
- [x] Files remain isolated to design/planning/evidence/output paths plus owned
      artifact-generation scripts and append-only decision/log updates.
- [x] Git LFS is initialized; the largest tracked artifact is the 7.2 MB PDF,
      well below GitHub's 100 MB file limit, so pointer tracking is not
      warranted.
- [x] Independent review passes before commit and push.

## Planned outputs

- `docs/design/game-concepts/WEBXR_GAME_PROPOSALS.md`
- `docs/design/game-concepts/assets/`
- `docs/design/game-concepts/infographics/`
- `output/pdf/webxr-game-concept-proposals.pdf`
- `evidence/game-concept-proposals/`

## Constraints

- Do not modify application source, package configuration, or existing feature
  evidence.
- Optimize for hackathon feasibility while preserving genuinely different game
  identities.
- Treat physical-headset comfort and mobile usability as first-class design
  constraints.

## Validation

- Confirm concept count and required fields mechanically.
- Render the PDF to PNG pages and inspect every page for clipping, hierarchy,
  contrast, image quality, and legibility.
- Confirm the PDF is tagged, declares its language, includes an outline, and
  provides meaningful image alternatives through semantic source HTML.
- Verify the checked-in SHA-256 provenance manifest after the final build.
- Inspect generated image sizes before deciding whether Git LFS is necessary.
- Run an independent editorial/originality review before publication.
