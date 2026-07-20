# Browser QA: kaiju-qa

Branch: `feature/kaiju-qa`
Review date: 2026-07-20
Scope: static browser/mobile QA only; no Playwright, browser, Vite preview, IWSDK, IWER, or WebXR runtime was started.

## Verdict

### Post-review remediation (orchestrator, 2026-07-20)

The findings below are preserved as the independent review record. After this
review, the authored suite was expanded to capture every failed request and
HTTP response `>=400`, execute the complete player loop under both Playwright
projects, retain the key broad-regression attempt, add a desktop keyboard/focus
path, and add mobile landscape, broader tap-target, and reduced-motion checks.
These changes typecheck but remain **unexecuted**, so browser sign-off is still
blocked solely on the deferred Playwright run.

**Static review: BLOCKED for browser sign-off; implementation is not statically rejected.**

The pure model and compile/build checks pass, but the required browser evidence does not exist because runtime execution was explicitly prohibited. The authored E2E suite covers the main happy loop and a small mobile smoke path, but it does not yet prove the complete desktop/mobile acceptance matrix, keyboard path, retry/recovery semantics, console/network cleanliness, or XR runtime behavior.

## Files and diff reviewed

- `AGENTS.md`
- `plans/kaiju-qa/PLAN.md`
- `src/index.ts`
- `index.html`
- `src/styles.css` (the requested root `styles.css` does not exist; this is the stylesheet imported by `src/index.ts`)
- `tests/e2e/hello-world.spec.ts`
- `tests/e2e/xr-support.spec.ts`
- Current working-tree diff and status on `feature/kaiju-qa`

Only this report path was edited: `evidence/kaiju-qa/browser-qa.md`.

## Commands and results

| Command | Result |
| --- | --- |
| `npm run typecheck` | PASS, exit 0 |
| `npm run build` | PASS, exit 0; Vite produced `dist/` |
| `npm run test:model` | PASS, 5 tests, 0 failures |
| Playwright / `npm run test:e2e` / `npm run test:e2e:run` | NOT RUN by instruction |
| Vite preview, IWSDK dev/runtime, IWER, browser/WebXR | NOT RUN by instruction |

Build warning: Vite reports a minified chunk larger than 500 kB. This is not a functional browser failure, but it is a performance/first-load risk worth tracking.

## Static implementation review

The selector/state wiring is internally consistent in the inspected paths:

- `index.html` defines the selectors used by `src/index.ts` and the E2E specs: `#primary-action`, `#guardrail-fieldset`, all three guardrail IDs, `#release-button`, `#reset-lab`, `#toggle-guide`, `#debrief-panel`, and the scenario status outputs.
- `src/index.ts` renders tutorial phase, release lock, guide visibility, scenario status, stale evidence, reduced-motion state, and the `data-iwsdk-ready` / `data-game-ready` readiness markers.
- The authored happy path follows baseline → stage tower → fail tower → broad guardrail regression → wrong narrow guardrail regression → targeted guardrail → release, then reset and guide collapse/expand.
- `tests/e2e/xr-support.spec.ts` checks unsupported XR and denied-session recovery state statically through mocked `navigator.xr`; it does not validate an actual session, exit, or re-entry.

## Unexecuted Playwright matrix

| Matrix row | Intended coverage | Static status |
| --- | --- | --- |
| Desktop Chromium happy path | Full tutorial, failure, guardrail comparison, targeted fix, release | Authored in `hello-world.spec.ts`; **unexecuted** |
| Desktop keyboard | Tab/Enter/Space through tutorial, guardrails, retry/reset, release | **No authored test**; unexecuted |
| Mobile Chromium full loop | Same complete loop at touch viewport | Main test is not mobile-only and is unexecuted; mobile-specific test only runs one baseline action |
| Mobile rotation/resize | Resize/rotate once with no horizontal overflow | **No authored resize/rotation assertion** |
| Mobile tap target audit | All actionable controls ≥44 px | Authored for action-dock buttons and guardrail labels only; scenario cards, guide/hint, reset, XR, and debrief controls are omitted; unexecuted |
| Reduced motion | Complete a run with authored transitions and no rapid motion | Only checks the data attribute and one baseline click; full loop unexecuted |
| Console/page errors | No runtime errors | Listener exists, but unexecuted |
| Network failures | No critical request failures | Listener filters to document/script/stylesheet only; unexecuted and incomplete for asset/WASM/font/fetch failures |
| XR unsupported | Clear disabled fallback | Mocked test authored; unexecuted |
| XR denied launch | Retryable failure | Mocked test authored; unexecuted |
| XR enter/exit/re-entry | Existing recovery path remains available | **No authored coverage**; runtime explicitly deferred |

## Ranked findings

### P0 — Browser release evidence is absent (blocking sign-off)

No browser runtime was run, so there is no evidence for actual DOM readiness, scene initialization, pointer/touch behavior, responsive geometry, console output, request failures, screenshot artifacts, or release/debrief behavior. This is the exact runtime gap required by the review constraint, not an implementation failure. Do not mark browser QA passed until the recommended CI command completes on a browser-capable runner.

### P1 — Authored E2E diagnostics do not actually cover all asset/network failures

`captureRuntimeErrors()` in `tests/e2e/hello-world.spec.ts:10-16` records failed requests only when the resource type is `document`, `script`, or `stylesheet`. The test message claims “runtime or asset-loading errors,” but failed `fetch`/XHR, image, media, font, worker, or WASM requests are ignored. The build emits worker and Havok WASM assets, so a failed runtime asset could escape the assertion. This is a blocking observability gap for the acceptance criterion requiring no critical request errors.

### P1 — Mobile E2E does not cover the required full loop

The mobile-only test in `tests/e2e/hello-world.spec.ts:114-135` checks overflow, a subset of control heights, reduced-motion state, and one baseline click. It does not execute the tower edge case, broad guardrail regression, wrong narrow guardrail regression, targeted fix, release gate, release dialog, reset, or guide recovery on mobile. The main full-loop test is shared across projects but has no mobile-specific assertions beyond its screenshot name.

### P1 — Keyboard acceptance criterion has no authored test

The plan requires keyboard focus and Tab/Enter/Space operation through the critical path. The specs do not assert focus order, visible focus, keyboard activation of buttons/radios, or keyboard recovery after invalid/incomplete choices. CSS supplies `:focus-visible` styling, but that is not runtime evidence of operability.

### P2 — Recovery coverage is partial and misses invalid/incomplete choices

The happy test covers revising after a completed regression and reset after release. It does not attempt to run with no guardrail selected, stage/run controls out of order, release while evidence is stale, or retry after a failed/invalid action. The model tests cover release blocking, but browser-visible explanation, focus placement, and one-action retry are unverified.

### P2 — Mobile overflow assertion may miss horizontal overflow in nested scroll regions

The CSS intentionally gives `#loop-rail` and its `ol` horizontal scrolling at widths ≤900 px. The test checks only document-level `scrollWidth > clientWidth`; it does not assert that the nested rail is intentionally scrollable, that content is reachable by touch, or that no other panel clips text/buttons. The three-column desktop minimum widths are safely collapsed at ≤900 px, but only runtime geometry can confirm actual viewport behavior.

### P2 — Tap-target test is incomplete and labels are visually hidden inputs

The mobile selector checks `#action-dock button, #guardrail-fieldset label`, not every interactive element. The guardrail inputs are absolutely positioned and opacity 0, while the visible `.guardrail-choice` label receives the focus outline via the adjacent-input selector. This is plausibly operable, but the test should measure the visible label hit area and exercise touch activation, not only its bounding box. `#scenario-list button`, `#toggle-guide`, `#hint-button`, `#reset-lab`, and the debrief restart button are outside the audit.

### P3 — XR tests are mock contract tests, not browser/XR verification

The mocked `navigator.xr` tests cover unsupported and denied request feedback. They do not prove the real IWSDK world/session lifecycle, exit/re-entry, visibility handling, or headset/controller interaction. This is consistent with the plan’s explicit XR deferral and must remain labeled as deferred.

### P3 — Large production chunk warning

`npm run build` passes but reports a minified chunk above 500 kB. On mobile, this can increase time-to-interactive before `data-game-ready="true"`; the existing 90-second E2E readiness timeout may hide slow startup rather than diagnose it. Track separately from functional QA.

## Responsive/mobile risk assessment

- Positive: `viewport-fit=cover`, safe-area padding, a ≤900 px single-column layout, a sticky action dock, and default button minimum height of 2.75 rem are present.
- Positive: reduced-motion CSS disables transitions/animations, and the app mirrors the preference in `#game-ui[data-motion]`.
- Risk: the desktop grid has minimum columns of 17 rem / 15 rem / 17 rem and only collapses at 900 px; intermediate tablet widths depend on the breakpoint and should be exercised at several widths, not only one Playwright mobile project.
- Risk: the loop rail intentionally scrolls horizontally on narrow screens. This is not necessarily a defect, but it needs a touch assertion and a visual check that the rail does not create accidental page-level overflow.
- Risk: the fixed scene canvas remains full viewport behind a scrollable mobile UI. Runtime hit testing and pointer interception cannot be certified statically, especially around `pointer-events: none` on `#game-ui` and `pointer-events: auto` on descendants.
- Risk: the debrief is a fixed centered dialog with no explicit focus trap or Escape handling visible in the inspected code. Focus is moved to the dialog, but keyboard containment and return focus after dismissal/restart need browser verification.

## Console/network review

The application has a `console.error` path for IWSDK initialization failure and readiness changes to `error`, so page errors should fail a browser test if executed. However, the current request-failure filter is too narrow for the app’s worker/WASM/static asset surface. The recommended browser run should capture `console`, `pageerror`, all `requestfailed` events, and non-2xx responses for document/script/style/fetch/XHR/worker/WASM/media requests, while allowing intentional `about:blank` teardown navigation.

## Recommended CI command

Run the existing build plus Playwright suite on a browser-capable CI runner:

```bash
npm ci
npx playwright install --with-deps chromium
npm run typecheck
npm run build
npm run test:model
npm run test:e2e:run
```

For the current project’s intended validation order, the canonical final command remains `npm run test:e2e:run` after typecheck/build/model checks. Do not substitute `npm run test:e2e` when a separate build result is already being recorded, because it rebuilds before launching the browser harness.

## Final status

- Changed path: `evidence/kaiju-qa/browser-qa.md`
- No source, test, branch, commit, or unrelated evidence path was changed.
- Verdict: **BLOCKED for independent browser QA sign-off pending execution of the unexecuted Playwright matrix; static model/typecheck/build validation passes.**
