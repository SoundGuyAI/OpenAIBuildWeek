# Evidence — Loop Engineer concept proposals

Branch: `codex/loop-engineer-concepts`  
Base reviewed: `origin/main` at `9b9d69244073c937bfb39ef18bf8da4d84ea997d`  
Status: complete, independently approved, pushed, and opened as a draft PR

## Publication

- Content commit: `99cfc1e35c8ac3a87a78780cf9311388715f0cf8`
- Remote branch: `origin/codex/loop-engineer-concepts`
- Draft PR: <https://github.com/SoundGuyAI/OpenAIBuildWeek/pull/4>
- Target: `main`

## Evidence manifest

| Artifact | Purpose | Status |
| --- | --- | --- |
| `browser-qa.md` | Desktop/mobile/offline browser verification | Complete — PASS |
| `xr-qa.md` | Proposed XR interaction and comfort review | Complete — conditional design-feasibility pass; runtime N/A |
| `experience-review.md` | Visual/accessibility/performance review | Complete — historical blockers resolved in final artifact |
| `review.md` | Independent completion review | Complete — APPROVE, no blockers |
| `01-desktop.webp` | 1440×900 comparison and score evidence | Complete — SHA-256 `A59A0BA5E2BC76D8BD7AA046A15F042D6ACBB59E5913B234622D39BFCA5FB439` |
| `02-mobile.webp` | 390×844 mobile diagram evidence | Complete — SHA-256 `DB38C4040200A0493CD3E46892101B58FB76EAB8D0519EC0A566C24C1408C466` |

## Environment

- Worktree: `C:\UnityProj\OpenAIBuildWeek-loop-engineer-concepts`
- Date: 2026-07-20 UTC
- Deliverable: static Markdown plus offline HTML opened directly with `file://`
- Browser QA: Playwright Chromium 143, desktop 1440×900 and mobile/touch 390×844
- Runtime XR execution: not applicable to this docs-only branch; `xr-qa.md`
  records implementation gates for the later selected-concept branch

## Validation

| Check | Observed result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run build` | PASS; existing large-chunk warning only |
| `npx --yes html-validate@latest docs/design/loop-engineer-concepts/index.html` | PASS; validator engine-version warning only |
| Direct offline desktop/mobile QA | PASS; zero external runtime requests, request failures, console errors, page errors, broken images, unresolved fragments, or document-wide overflow |
| Keyboard, shortlist persistence, reduced motion, auditable scoring, mobile diagrams | PASS; exact procedures and observations are in `browser-qa.md` |
| `npm run test:e2e:run` | 4 PASS / 2 FAIL: unchanged baseline Hello World stayed at `data-xr-state="checking"` in desktop/mobile headless Chromium; both XR-support tests passed in both profiles |
| Independent review | APPROVE; all four prior experience-review blockers resolved |

## Asset and LFS decision

The five generated PNGs are each below 0.5 MB and total about 1.85 MiB. The
complete new binary set remains comfortably below normal GitHub limits, so Git
LFS was intentionally not enabled. No third-party 3D pack is redistributed.

## Known limitations

- The branch proposes games; it does not implement or runtime-certify one.
- Mobile evidence is Chromium emulation, not a physical phone.
- XR findings are design review only; IWER and physical-headset evidence belong
  to the selected-concept implementation branch.
- The Devpost packet still needs final game/demo/repository URLs, a public video,
  the implementation thread's `/feedback` session ID, and a submission-day rules check.
- The baseline gameplay E2E failure above remains outside this docs-only diff and
  is disclosed in the final review and PR.

## Follow-up link evidence

- The root IWSDK HUD contains an accessible `Explore concepts` anchor targeting
  `./docs/design/loop-engineer-concepts/index.html` in a new tab.
- `scripts/copy-concept-book.mjs` copies the canonical concept-book directory to
  the identical relative path under `dist` after `vite build`.
- Independent static review approved the relative URL, accessible anchor,
  desktop/mobile styling, build command, and cross-platform copy script with no
  blocking finding.
- Per the user's explicit VM constraint, IWSDK, Vite build/preview, browser E2E,
  and XR runtime checks were not run for this follow-up. Runtime verification is
  deferred to the user's later test pass.
