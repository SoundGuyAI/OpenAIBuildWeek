# Loop Engineer concept proposals — plan

Branch: `codex/loop-engineer-concepts`  
Slug: `loop-engineer-concepts`  
Deliverable type: docs-only design spike

## Outcome

Produce five visually distinct, research-grounded WebXR game proposals under the shared title **Loop Engineer**, then package them as a concise Markdown proposal and a self-contained offline HTML concept book that makes comparison possible at a glance.

## Completion status

The design spike is complete and independently approved for a docs-only PR.
The concept book recommends **Kaiju QA**, keeps **The Museum of Almosts** as the
originality backup, and identifies **Sunrise Express** as the lower-risk delivery
backup. Five Azure FLUX.2-pro concept images, three deterministic infographics,
the Markdown proposal, offline HTML, Devpost draft, asset plan, research notes,
and QA evidence are present under feature-scoped paths.

Validation completed on 2026-07-20 after rebasing onto current `origin/main`:

- `npm run typecheck` — pass.
- `npm run build` — pass; existing bundle-size warning only.
- HTML validation — pass; validator engine-version warning only.
- Direct offline desktop/mobile browser QA — pass with refreshed evidence.
- Independent final review — approve; all four experience-review blockers resolved.
- Repository gameplay E2E — 4 pass / 2 fail because the unchanged baseline
  Hello World remained at `data-xr-state="checking"` in headless desktop/mobile
  Chromium. This branch changes no gameplay/runtime file; the limitation is
  recorded rather than treated as concept-book certification.

## Acceptance criteria

1. Exactly five concepts are mechanically, aesthetically, and narratively distinct while teaching a common Loop Engineering + SDLC learning model.
2. Every concept defines a 2–3 minute judged demo, its core verb, learning beats, win/fail/retry loop, and equivalent desktop, touch, and XR controls.
3. Every concept has a four-hour smallest-complete build scope using IWSDK 0.4.2, Codex/GPT-5.6, primitive geometry, and/or clearly licensed free asset candidates.
4. The package explains the researched learning flow, judging fit, originality/differentiation, feasibility, accessibility, comfort, performance, and cut ladder.
5. Devpost submission preparation includes draft project copy, tagline, elevator pitch, feature list, “how it was built,” challenge/use-of-OpenAI material, demo-video storyboard, screenshots checklist, repository/demo links checklist, and a requirements checklist tied to cited current sources.
6. Concept art is generated with the requested Azure FLUX.2-pro path; deterministic diagrams and infographics are authored as inline SVG/HTML so labels remain accurate.
7. `docs/design/loop-engineer-concepts/PROPOSALS.md` is concise and decision-oriented; `docs/design/loop-engineer-concepts/index.html` opens directly from disk with no server or network requests.
8. The HTML is readable at desktop and mobile widths, keyboard navigable, reduced-motion aware, and has no console/page/request failures during offline browser QA.
9. Generated assets are kept reasonably small; Git LFS is enabled only if tracked binary size justifies it.
10. Research notes, ownership, evidence, prompt log, validation results, and independent review are committed with the deliverables.

## Non-goals

- Implementing any of the five games.
- Entering XR or certifying runtime interaction in this docs-only branch.
- Downloading or redistributing third-party 3D packs before a concept is selected.
- Making an unqualified claim that a concept has no precedent anywhere.
- Submitting the project to Devpost or publishing a public deployment.

## Architecture and production choices

- Isolated sibling worktree; no edits in the primary `main` worktree.
- Proposal-specific files live under `docs/design/loop-engineer-concepts/`, `plans/loop-engineer-concepts/`, and `evidence/loop-engineer-concepts/` to minimize merge overlap.
- Offline HTML uses one local entry file, local generated images, inline SVG diagrams, and progressive enhancement only.
- Research citations and asset-license links remain visible in both formats.
- The orchestrator owns shared/integration files; specialists write only their assigned note/report paths.

## Integrated concept set

Discovery produced broader mechanic and narrative territories; the canonical
proposal integrates them into five intentionally different player verbs:

1. **Stormglass** — align prisms and compare storm traces.
2. **The Tomorrow Garden** — cultivate one variable and compare seasons.
3. **Kaiju QA** — stage edge cases and catch a regression.
4. **Sunrise Express** — route a rehearsal through release dependencies.
5. **The Museum of Almosts** — inspect layered prototypes and revise one cause.

The paper recommendation is **Kaiju QA**, with **The Museum of Almosts** as the
backup. Selection remains a human decision after reviewing the offline concept
book.

Research defines Loop Engineering as an emerging practitioner term rather than
a standardized SDLC. The proposal therefore states a dated project definition
and teaches Goal → Act → Observe → Adjust under a pass/stop/escalate gate nested
inside the wider SDLC.

The final selected binary assets are all under 0.5 MB and total under 2 MB.
Git LFS is intentionally not enabled because it would add clone and review
friction without solving a large-file problem.

## Work breakdown

1. Research current competition requirements, Loop Engineering/SDLC learning sources, comparable games, IWSDK feasibility, and free asset licenses.
2. Generate divergent mechanics, narrative frames, art directions, humor beats, and marketing hooks through specialist notes.
3. Integrate five concepts and score them against originality, teaching clarity, cross-platform delight, judgeability, and four-hour feasibility.
4. Generate five hero images with Azure FLUX.2-pro and optimize them for an offline concept book.
5. Build Markdown and self-contained HTML deliverables, including comparison and game-loop infographics.
6. Validate links/content, then test the offline HTML on desktop and mobile browser profiles.
7. Run experience-quality and independent reviews, fix blocking findings, complete evidence/logs, publish branch, and open a draft PR.

## Risks and mitigations

- **Competition page changes:** capture exact dated requirements and cite official Devpost/OpenAI sources.
- **“Loop Engineering” ambiguity:** define the term from credible current sources and distinguish it from generic iteration.
- **Concept convergence:** enforce different player verbs, spaces, failure modes, and emotional arcs.
- **Image text errors:** keep generated art text-free; place all labels in HTML/SVG.
- **Four-hour overreach:** require a minute-by-minute build budget and explicit cuts for each concept.
- **Offline breakage:** prohibit CDN fonts/scripts and validate from a `file://` URL with network unavailable.
- **Binary bloat:** encode hero art as optimized WebP and check tracked object sizes before deciding on LFS.

## Test matrix

| Surface | Check | Expected evidence |
| --- | --- | --- |
| Markdown | Structure, links, citations, five concepts, submission checklist | Review notes and link scan |
| Desktop Chromium | Open via `file://`, navigate all concepts, inspect layout/console/network | Screenshot + browser report |
| Mobile Chromium | 390×844 layout, touch-sized navigation, no horizontal overflow | Screenshot + browser report |
| Keyboard/accessibility | Tab order, visible focus, semantic headings, image alt text | Browser report |
| Reduced motion | Motion disabled under media preference | Browser report |
| Offline | No external runtime requests | Network log/report |
| XR | Not applicable to static design artifact; review proposed interaction mappings only | XR QA note |

## Required evidence

- Official-source research citations and access dates.
- Azure FLUX prompt manifest and generated image files.
- Desktop and mobile screenshots of the offline HTML.
- Browser console/network results.
- Experience-quality review and independent review.
- Final branch, commit, PR, and validation summary.
