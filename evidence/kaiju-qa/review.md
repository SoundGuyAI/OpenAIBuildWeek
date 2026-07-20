# Independent review: kaiju-qa

Review date: 2026-07-20 UTC
Branch: `feature/kaiju-qa`
Scope: latest corrected working-tree state; this review changed only this file.

## Verdict

**APPROVE FOR PR / MERGE FROM THE STATIC CODE-REVIEW SCOPE.** No code blocker
remains. The prior P1 attempt-retention defect is resolved, its intended
behavior is covered by the pure model suite, and the authored browser test now
asserts all three retained labels.

This is not browser, mobile-device, assistive-technology, or XR runtime
certification. Those sign-offs remain explicitly deferred by the owner and
must stay deferred in product and competition claims until their respective
runtime gates are executed.

## Blocking findings

None in the reviewed code, model, static UI, IWSDK integration, or authored
test changes.

## Resolved prior blocker

The history policy is now centralized in
`src/kaiju-qa/game-model.ts::selectAttemptHistory()`:

- retain the baseline attempt;
- retain the first `freeze-near-buildings` suite, which is the guided broad-rule
  ambulance regression;
- retain the latest suite;
- remove duplicate slots when the guided regression is also the latest suite.

`src/index.ts` renders this selector directly. The sixth model test exercises
the multi-wrong-choice path and proves the retained guardrails are
`[null, "freeze-near-buildings", "slow-striped-zones"]`. The authored E2E path
also requires three visible attempt rows labeled `Baseline`,
`FREEZE NEAR BUILDINGS`, and `SLOW IN STRIPED ZONES`. This satisfies the
persistent-evidence learning and product contract that caused the earlier
changes-requested verdict.

## Non-blocking findings

1. **Runtime sign-off is still absent by design.** The expanded Playwright suite
   typechecks and now covers the full desktop/mobile loop, retained history,
   keyboard focus recovery, mobile geometry/tap targets, reduced motion, and
   broad request/HTTP diagnostics. It was not executed, so none of those
   authored assertions may be reported as runtime passes yet.

2. **Production payload remains a measured-release risk.** The build succeeds
   but emits the known large-chunk warning: the main minified bundle is about
   1.71 MB and Havok WASM is about 2.09 MB (about 664 kB gzip). Cold-cache mobile
   transfer and time-to-first-action still require browser measurement. This is
   not a correctness blocker for this feature PR.

3. **Evidence manifest bookkeeping trails the latest test count.** The top-level
   evidence README still records the older `5 tests passed` result while the
   current suite passes 6/6. That orchestrator-owned summary should be refreshed
   before evidence freeze; the underlying test and this independent review are
   accurate.

## Corrected-state assessment

- **Tutorial and state transitions:** Pass by source and model inspection. The
  baseline is visibly partial, tower staging precedes failure, the guided broad
  rule produces the ambulance regression, independent choices preserve agency,
  and reset returns to the canonical initial state.
- **Release gate:** Pass. Guardrail changes stale previous evidence, only a
  latest complete targeted 3/3 suite unlocks Release, and release remains a
  separate one-shot action.
- **Persistent evidence:** Pass after correction. Baseline, guided freeze
  regression, and latest player suite remain available for comparison even
  after an additional wrong independent choice.
- **UI/model/scene wiring:** Pass statically. DOM and world-space proxies use the
  shared intent/model path; the scene projects deterministic outcomes and does
  not calculate rules or release eligibility.
- **IWSDK API and lifecycle:** Pass statically. Gameplay objects use
  `world.createTransformEntity`; interaction follows the
  `Interactable`/`Pressed` qualification pattern; geometry and materials are
  pooled outside update work and disposed once on final teardown; reset/retry
  do not rebuild the world.
- **Accessibility/static behavior:** Pass for the reviewed source contract. The
  debrief is non-modal, only one exposed polite live status remains, focus is
  restored to meaningful controls after core transitions, selected scenarios
  have semantic and visible state, statuses are not color-only, and reduced
  motion removes the release scale change.
- **Test quality:** Pass for merge-level static/model coverage. Six deterministic
  model tests cover the central rules, immutability, reset, and retained-history
  regression. The E2E additions are relevant and well targeted, but remain
  authored rather than executed.
- **Competition fit and claims:** Pass statically. The README presents a clear
  Education-category judge path, bounded learning claims, deterministic local
  architecture, Codex/GPT-5.6 collaboration, asset policy, and an honest XR
  limitation. No secret, credential, backend, account, or live-model dependency
  was found in the reviewed feature paths.

## QA-report remediation status

The browser and experience reports now include explicit post-review addenda.
They preserve the original independent findings as history while stating which
source/test findings were remediated and which runtime conclusions remain
unverified. This resolves the prior evidence-honesty concern without rewriting
the original QA record. The XR report remains appropriately conditional and
does not claim immersive gameplay certification.

## Exact checks run

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run test:model` | Pass - 6 tests, 0 failures |
| `npm run build` | Pass - 494 modules; known large-chunk warning |
| `git diff --check` | Pass - no whitespace errors |

Not run, by explicit constraint: Playwright, Vite preview, IWSDK runtime,
IWER/reference tooling, browser, mobile device, assistive technology, and
headset sessions.

## Scope and ownership compliance

The plan, assignment manifest, prompt log, specialist notes, evidence manifest,
and independent QA reports are present. Changed implementation, shared, and
test paths remain consistent with the recorded owners. The final reviewer
changed only `evidence/kaiju-qa/review.md`; no source, test, branch, or commit
operation was performed. No conflict marker or whitespace error was found.

## Residual risks and deferred release gates

- Run the production Playwright matrix before claiming desktop/mobile behavior,
  screenshots, console/network cleanliness, or keyboard/touch runtime parity.
- Run an assistive-technology pass before making screen-reader or broader
  accessibility claims.
- Measure cold-cache startup and weakest-device performance before the mobile
  release gate.
- Keep immersive XR described only as a preserved, statically reviewed entry
  path. Controller rays, complete in-world actions/evidence, exit/re-entry,
  visibility ordering, seated reach, comfort, readability, and frame rate are
  uncertified.
- Hosted deployment, public demo/video, repository licensing, and final
  submission artifacts remain release-candidate work outside this code review.

## Merge / PR verdict

**PR verdict: APPROVE.** The latest corrected state has no remaining code
blocker and is mergeable from the independent static/code-review perspective.
Browser/mobile/AT/XR sign-offs remain deferred and must not be inferred from
this approval.

Path: `evidence/kaiju-qa/review.md`
Verdict: **APPROVE - no code blocker remains; runtime certification deferred.**
