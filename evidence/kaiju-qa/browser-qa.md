# Browser QA: Kaiju QA tactile E2E

Branch: `feature/kaiju-qa`
Review date: 2026-07-21
Scope: independent desktop/touch verification of the current direct-manipulation canvas implementation. `tests/e2e/xr-support.spec.ts` was preserved and was not run or edited.

## Current verdict

**PASS on the clean PR runner.**

GitHub Actions run `29806773348` executed the serialized desktop/mobile suite on
commit `f1c7c57`: **5 passed, 5 expected project skips, 0 test failures in 9.8
minutes**. Runtime summaries reported no application console problems, page
errors, failed requests, or HTTP errors. The overall job was marked failed only
afterward because the artifact step required the now-unused
`test-results/evidence/` directory. The workflow now uploads the committed
desktop/mobile/campaign evidence as a reliable fallback and retains any
run-generated evidence directory when present.

The stale button-era test was replaced with real canvas input coverage. Runtime
evidence confirms that an invalid prop drop is recognized and announced, and
that a CDP-native touch drag places the service car while all sampled scroll
positions remain `0,0`. A complete real-drag four-district campaign also passed
during the redesign loop before the final accessibility/causal-visual patch;
those patches preserve the same IWSDK interaction entities and reducer intents.
The final local production-build rerun did not return a clean reporter result
on this machine because repeated IWSDK/Chromium runs left an overloaded browser
process pool. The clean PR runner has now supplied that reporter result.

No source defect was established by these runs. The observed failures were test-harness issues or browser/runtime startup limits, documented below.

## Owned changes

- `tests/e2e/hello-world.spec.ts`
  - Uses `window.__KAIJU_QA__.getDebugTargets()` only to discover/assert projected canvas coordinates.
  - Sends real Playwright mouse drags for props and rules, lever pulls, and stamp presses; it never dispatches game intents or mutates debug state.
  - Covers invalid-drop recovery followed by a valid retry.
  - Covers the intended four-level desktop campaign and verifies final release/attempt state.
  - Uses Chromium CDP `Input.dispatchTouchEvent` for a native touch drag and samples window/document/body/visual-viewport scroll throughout the gesture.
  - Captures console messages, page errors, failed requests, and HTTP responses `>=400`.
  - Records Chromium's repeated WebGL `GPU stall due to ReadPixels` warning separately from application warnings/errors.
- `evidence/kaiju-qa/browser-qa.md`
  - Replaced the prior static-only report with this executed verification record.

## Exact commands and results

| Command | Result |
| --- | --- |
| `npm run typecheck` | **PASS**, exit 0, after the tactile suite and optional browser-channel override were added. |
| `node node_modules/vite/bin/vite.js build --outDir C:\Users\Oded\AppData\Local\Temp\kaiju-qa-e2e-20260721 --emptyOutDir` | **PASS**, exit 0; 498 modules transformed. Temporary output was outside the repository. Vite reported the existing chunk-size warning. |
| `node scripts/run-e2e.mjs tests/e2e/hello-world.spec.ts --workers=1 --reporter=line` | **INCOMPLETE**. The initial run exposed a describe-level project-skip API mistake, which was fixed. A later combined run produced partial desktop/mobile artifacts but exceeded the external 20-minute command ceiling. |
| `node scripts/run-e2e.mjs tests/e2e/hello-world.spec.ts --project=desktop-chromium --workers=1 --reporter=line --grep=recovers` | **FAIL / startup blocker**. Bundled Chromium did not set `data-iwsdk-ready="true"` within 180 seconds; the body remained at the initial Training Yard state with no readiness attribute. |
| `$env:KAIJU_QA_BROWSER_CHANNEL='chrome'; node scripts/run-e2e.mjs tests/e2e/hello-world.spec.ts --project=desktop-chromium --workers=1 --reporter=line --grep=recovers` | **Interaction reached; assertion harness failed, then fixed.** The invalid drag produced the exact visible message `Drop the test prop into its glowing city socket.` The run failed only because `getByRole('status')` matched both visible and visually hidden live regions. The assertion now targets `#status`. The post-fix rerun was interrupted before a final reporter result. |
| `npm run test:e2e:run` after final redesign fixes | **Harness findings fixed; no clean local completion.** The first run exposed an ambiguous heading locator and overly aggressive concurrent XR startup; the selector is now exact, XR startup allows 300 seconds, XR fallback tests run only once, and `playwright.config.ts` uses one worker. A second run was terminated by the external 30-minute ceiling without a final Playwright report; orphaned headless processes confirmed local runner saturation. |
| GitHub Actions run `29806773348` on commit `f1c7c57` | **PASS for E2E.** 5 applicable tests passed, 5 cross-project skips were expected, and all runtime cleanliness assertions passed in 9.8 minutes. The subsequent artifact upload—not the tests—caused the job's failed conclusion. |

## Executed interaction evidence

### Invalid desktop drop recovery

- The service car was dragged from its debug-projected grab point to the separately projected rule socket, not its valid prop socket.
- The game remained on expected interaction `{ type: "place-prop", prop: "car" }` and announced `Drop the test prop into its glowing city socket.`
- The authored test then waits for the car to return to its original projected point and performs a valid drag to `drop-prop-car`.
- Final clean-run result: **pass** in GitHub Actions, including the valid retry.

### Native CDP touch and scroll lock

- Mobile Chromium received `touchStart`, 18 interpolated `touchMove` events, and `touchEnd` through CDP `Input.dispatchTouchEvent`.
- The service car was placed successfully; the page snapshot showed `Training 2 / 9` and `Service Car placed in Training Yard.`
- Scroll assertions ran before the runtime-console assertion and passed: every sampled `window`, document element, body, and `visualViewport` X/Y value was `0`.
- The only failing assertion in that run was classification of four Chromium GL-driver warnings. The suite now records those warnings separately instead of treating them as application errors.

### Four-level desktop campaign

The authored and previously executed flow uses only visible canvas gestures:

1. Training Yard: car drag, lever, tower drag, lever, broad-rule drag, lever, targeted-rule drag, lever, release stamp, advance stamp.
2. School Crossing: crosswalk drag, lever, targeted-rule drag, lever, release stamp, advance stamp.
3. Harbor Load: heavy-cargo drag, lever, targeted-rule drag, lever, release stamp, advance stamp.
4. Storm Shift: rain-module drag, lever, targeted-rule drag, lever, release stamp.

It asserts all evidence passes, all four districts are released, attempt counts
are `4/2/2/2`, every final rule is `targeted`, and
`data-campaign-complete="true"`. The final neutral-choice model change required
one assertion update from a named targeted expectation to a neutral rule choice;
the physical drag sequence is otherwise unchanged.

## Console and network observations

- Successful browser initialization emitted the IWSDK/Three.js/EliCS informational banner.
- Mobile Chromium emitted four repeated browser-driver warnings matching `GL Driver Message ... GPU stall due to ReadPixels`; Chromium then reported that the warning would no longer repeat. These are recorded as browser/WebGL performance noise, not application console failures.
- GitHub Actions runtime summaries reported zero application console problems,
  zero page errors, zero failed requests, and zero HTTP error responses across
  invalid-drop recovery, the complete desktop campaign, and native touch.

## Residual gaps / blocking findings

1. **Bundled headless Chromium startup is unreliable on this machine.** The
   installed Chrome channel reached interaction; PR CI starts from a clean
   one-worker environment.
2. **XR is independently certified in Quest 3 IWER.** See `xr-qa.md`; physical
   headset comfort/performance remains outside browser QA.

## Recommended final integration run

On this machine, use the installed Chrome channel to avoid the observed bundled-browser startup stall:

```powershell
$env:KAIJU_QA_BROWSER_CHANNEL='chrome'
node scripts/run-e2e.mjs tests/e2e/hello-world.spec.ts --workers=1 --reporter=line
```

For CI with a healthy Playwright Chromium installation, omit `KAIJU_QA_BROWSER_CHANNEL` and run the same focused file.
