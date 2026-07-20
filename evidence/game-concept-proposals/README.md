# Evidence: game concept proposals

Branch: `codex/design-game-proposals`
Created: 2026-07-20
Status: complete; independent design and visual gates passed

## Artifact set

- Canonical data: `docs/design/game-concepts/proposals.json`
- Visual-first source: `docs/design/game-concepts/WEBXR_GAME_PROPOSALS.md`
- Azure FLUX manifest: `docs/design/game-concepts/assets/IMAGE_MANIFEST.md`
- Five generated WebPs: `docs/design/game-concepts/assets/generated/`
- Five semantic SVG infographics: `docs/design/game-concepts/infographics/`
- Final PDF: `output/pdf/webxr-game-concept-proposals.pdf`
- Tagged PDF build script: `scripts/build-game-proposals-pdf.mjs`
- FLUX generation helper: `scripts/generate-concept-art.ps1`
- Deterministic WebP conversion: `scripts/convert-concept-art.ps1`
- SHA-256 writer/checker: `scripts/hash-game-proposal-assets.ps1`
- Provenance manifest: `docs/design/game-concepts/assets/SHA256SUMS`

## Validation results

| Check              | Result                                                                         | Evidence                                        |
| ------------------ | ------------------------------------------------------------------------------ | ----------------------------------------------- |
| Locked concept set | Exactly 20 concepts in required order                                          | JSON parse and title-order assertion            |
| Required structure | All required fields present; every loop has four beats                         | Python schema assertions                        |
| Hook length        | Maximum eight words                                                            | Python token-count assertion                    |
| Art generation     | Five 1344 x 768 plates generated with Azure FLUX.2-pro                         | image manifest and WebP outputs                 |
| Art cleanup        | Plates 01 and 04 regenerated after pseudo-text was found                       | orchestrator visual inspection                  |
| Image mapping      | Numbered title callouts map all four subjects on every composite plate          | Rendered page inspection                        |
| Infographics       | Five semantic SVGs parse; numbered plots use explicit contrasting text fills    | XML parser and rendered inspection              |
| PDF build          | Exactly eight 960 x 540 CSS-pixel pages                                        | Playwright layout assertions and Poppler        |
| PDF access         | English, tagged structure, outline, semantic source, meaningful image alt text  | `pdfinfo` plus builder assertions               |
| PDF text           | All 20 concept titles extract; no ellipsis characters or truncated copy         | `pypdf` extraction assertion                    |
| Visual QA          | No clipped cards, ambiguous galleries, overlap, or illegible transitions        | `pdf-contact-sheet.webp` and page inspection    |
| Reproducibility    | 13 final source/binary artifacts match checked-in SHA-256 values                 | hash script in `-Mode Check`                    |
| Typecheck          | Pass                                                                             | `npm run typecheck`                             |
| Production build   | Pass; existing large-chunk warning only                                          | `npm run build`                                 |
| Browser regression | 5/6 pass; desktop boot remains in XR `checking` on this VM                       | `npm run test:e2e:run`                          |

## Visual QA iterations

1. Rejected the first Azure outputs for plates 01 and 04 because they contained
   generated pseudo-text and document-like marks.
2. Regenerated those plates with symbol-only constraints.
3. The first PDF render revealed gallery cards grouped by concept number rather
   than assigned art plate; corrected the mapping and rerendered.
4. The second render revealed a clipped final atlas row on page 2; enlarged the
   panel and rerendered.
5. Inspected all eight final pages at 1600 x 900 render resolution. The final
   contact sheet is `pdf-contact-sheet.webp`.
6. Independent review rejected the first PDF for inaccessible structure,
   ambiguous composite-art mapping, truncated cards, invisible plot numbers,
   and incomplete reproducibility notes.
7. Replaced the ReportLab export with semantic HTML rendered by Playwright as a
   tagged, outlined PDF; added explicit art callouts and complete compact copy.
8. Repaired both SVG plots, added deterministic WebP conversion and SHA-256
   verification, rendered all eight pages again, and inspected them individually.

## Git LFS decision

Git LFS 3.7.1 is initialized for this repository clone. The largest artifact is
the final tagged PDF at 7,132,624 bytes; generated WebPs are 93-147 KB and the
QA contact sheet remains small. The PDF is well below GitHub's 100 MB file
limit, so normal Git is appropriate and no LFS tracking rule was added.

## Remaining evidence

- Physical-headset XR certification on the team's XR-capable machine.

## Browser/XR environment limitation

The document-only branch does not change application source. The full existing
browser suite completed five of six checks: mobile boot/control behavior and
all explicit supported/unsupported WebXR fallback cases passed. The desktop
boot test timed out because `#enter-xr` remained in `data-xr-state="checking"`
instead of resolving to `supported` or `unsupported`. A focused CI-mode rerun
failed the same assertion on both attempts. This matches the previously noted
VM/headset-runtime limitation; the trace and screenshots remain in ignored
local Playwright output. No physical-headset claim is made from this machine.
