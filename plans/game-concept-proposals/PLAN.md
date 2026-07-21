# Plan: visual WebXR game concept proposals

Branch: `codex/design-game-proposals`
Created: 2026-07-20
Status: complete; proposal, gallery, licensing, and integration gates passed

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

- Do not modify application source or existing feature evidence. The gallery
  follow-up may add only the minimal package-script wiring needed to generate
  `public/designs/index.html` during the existing production build.
- Do not run IWSDK, the IWSDK dev server, game E2E, or an XR runtime on this VM;
  it is approved only for documentation and standalone static-gallery work.
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

## Follow-up: interactive design gallery

- [x] Generate a self-contained `public/designs/index.html` from canonical
      proposal data and approved art rather than maintaining duplicate content.
- [x] Make all 20 concepts browsable by search, category, originality risk, and
      shortlist status.
- [x] Keep the page useful at desktop, mobile, and narrow viewport sizes.
- [x] Provide visible keyboard focus, semantic controls, reduced-motion support,
      meaningful image alternatives, and a no-JavaScript content path.
- [x] Link to the full Markdown proposal and downloadable PDF.
- [x] Add the generator to the normal production build so GitHub Pages publishes
      the gallery at `/designs/`.
- [x] Capture desktop and mobile standalone-browser evidence.
- [x] Pass independent gallery review.

## Follow-up: free asset starter kits

- [x] Recommend a primary and optional supporting free asset pack for every one
      of the 20 concepts.
- [x] Prioritize coherent Quaternius CC0 packs and use other free libraries only
      when they materially improve the fit.
- [x] Record source URL, license, intended use, WebXR suitability, and required
      custom work for every recommendation.
- [x] Add the recommendations to the proposal source and interactive gallery.
- [x] Pass independent licensing/editorial review.
