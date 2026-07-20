# XR QA: kaiju-qa

Branch: `feature/kaiju-qa`
Review date: 2026-07-20
Status: **static review only; XR is not runtime-certified**

## Scope and evidence

Reviewed `AGENTS.md`, `plans/kaiju-qa/PLAN.md`,
`plans/kaiju-qa/agent-notes/sdk-research.md`, `src/index.ts`,
`src/xr-support.ts`, `src/kaiju-qa/scene.ts`, `index.html`, and the current
working-tree diff. Per request, no IWSDK dev runtime, IWER, Playwright,
reference tool, or headset was run.

The current diff is broad and includes the Kaiju QA integration files, but this
report is the only file modified by this review.

## Static API and lifecycle review

| Area | Finding | Classification |
| --- | --- | --- |
| Entity creation | Gameplay roots and lights use `world.createTransformEntity`; no `world.scene.add` gameplay path was found. Child groups that need authored visibility/transform are rooted as entities, and controls are separate child entities. | Pass (static) |
| Interactable / Pressed | Controls add `Interactable`; the system queries `[Interactable, Pressed]` and subscribes to `qualify`, which matches the one-shot Pressed qualification pattern. Application code does not add/remove `Pressed`. | Pass (static); runtime duplicate behavior unverified |
| World-space control coverage | Proxies exist for add tower, three guardrails, run, release, and reset. There is no in-world proxy for `Revise guardrail`/retry, and no clear XR equivalent for inspecting/selecting scenario evidence. | **Blocker for complete XR gameplay claim** |
| Controller-ray assumptions | Fixed box meshes are plausible ray targets and no hand/poke/grab requirement is claimed. Left/right controller-ray hit testing, hit ordering, target activation, and accidental neighboring presses remain unverified. | Deferred runtime risk |
| Session entry | `checkImmersiveVrSupport()` uses `isSessionSupported(immersive-vr)`; launch uses the existing helper, `buildSessionInit`, reference-space resolution, and `renderer.xr.setSession`. Permission/security/setup failures are surfaced. | Pass (static) |
| Session exit / re-entry | `world.exitXR()` is used; session-end cleanup clears `world.session`, and camera state is restored. Scene/model state is preserved rather than rebuilt. Re-entry and exit during each game phase are not runtime-tested. | Pass by inspection; runtime gap |
| Visibility suspend/resume | Browser `visibilitychange` and IWSDK `world.visibilityState` are combined. Hidden/blurred state hides the tutorial marker; there is no active animation clock to freeze. Resume behavior and event ordering are unverified. | Pass for current static scene; runtime gap |
| Reset / dispose | Reset mutates game state and recenters presentation; it does not recreate XR entities. Final `beforeunload` disposal destroys owned entities child-to-root and disposes shared geometries/materials once. | Pass (static) |
| Seated scale / reach | Camera is authored at a desktop-like `(0.25, 2.2, 3.25)` pose and the tabletop/control row is fixed. No seated-height calibration, recenter affordance inside XR, reach envelope, or standing/seated layout evidence exists. | **Blocker for comfort/accessibility claim** |
| Text / board | Immersive XR cannot rely on the DOM overlay. The scene contains primitive shapes and unlabeled proxy plates, but no readable world-space goal/result board, labels, or status text. The essential QA loop is therefore not self-explanatory in-headset. | **Blocker for XR usability claim** |
| Reduced motion | DOM reduced-motion handling is present and the scene has no continuous animation. However, the release pose intentionally uses a different kaiju scale for reduced motion (`1.16` vs `1.12`), so the final authored pose is not identical; comfort was not runtime-tested. | Limitation; fix before strong comfort claim |

## Blockers vs documented limitations

### Blockers to merge-safe XR claims

1. Do not claim that the full Kaiju QA experience is playable or accessible in
   immersive XR. The in-world proxy set omits retry/revision and scenario
   evidence inspection, while the DOM controls are not a sufficient immersive
   UI contract.
2. Do not claim in-headset readability, seated usability, target reach,
   controller reliability, or comfort. There is no world-space text/board and
   no calibration or physical layout evidence.

These are claim blockers, not necessarily blockers to merging the feature if
the product scope explicitly remains “desktop/mobile primary; XR entry path
preserved.”

### Documented limitations / deferred verification

- No immersive session entry on a target browser/headset was exercised.
- No left/right controller-ray activation was exercised.
- No Pressed cleanup or duplicate prevention was observed across real session
  loss, pointer release, or controller disconnect.
- No browser-camera restoration was observed after session end.
- No document/XR visibility ordering or resume behavior was observed.
- No exit/re-entry was tested during baseline, failure, retry, or release.
- No hand-tracking or `layers` feature negotiation was tested.
- No 72 Hz performance, GPU loading, or code-split asset behavior was tested.
- Physical seated reach, board readability, and reduced-motion comfort remain
  uncertified.

## Exact uncertified runtime matrix

| Runtime / input surface | Static conclusion | Runtime result |
| --- | --- | --- |
| Desktop browser, non-XR DOM controls | Existing semantic controls remain the primary path. | Not run in this review |
| Mobile browser, touch DOM controls | Separate from immersive XR; no XR conclusion. | Not run in this review |
| WebXR `immersive-vr` support check | Public API path and failure states are present. | Not run |
| WebXR session request / permission / secure context | Error branches are implemented. | Not run |
| Left controller ray | Proxy geometry exists in principle. | **Uncertified** |
| Right controller ray | Proxy geometry exists in principle. | **Uncertified** |
| Hand tracking | Requested as an optional session feature, but not relied upon. | **Uncertified** |
| World-space add/run/guardrail/release/reset | Proxy entities are statically present. | **Uncertified** |
| World-space retry/revise and evidence inspection | No complete proxy/UI path found. | **Not covered** |
| XR hidden/blurred → visible | Suspension hook exists. | **Uncertified** |
| XR exit → browser camera restore | Cleanup path exists. | **Uncertified** |
| XR exit → re-entry | Scene preservation is designed. | **Uncertified** |
| Seated/standing scale and reach | No calibration or layout variant found. | **Uncertified / limitation** |
| In-headset text/status board readability | No board/text implementation found. | **Not covered** |
| Reduced-motion XR comfort | Static path only; final pose differs. | **Uncertified** |
| Physical headset performance | No measurement. | **Uncertified** |

## Verdict

**CONDITIONAL / NO XR CERTIFICATION.** The IWSDK API usage, one-shot
`Interactable`/`Pressed` pattern, session wrapper preservation, combined
visibility hook, and final resource teardown are statically merge-safe. The
feature may merge only with XR described honestly as an unverified preserved
entry path. Treat immersive XR gameplay, accessibility, comfort, readability,
and performance as uncertified until the missing world-space UI/action coverage
is addressed and the runtime matrix is exercised.

Report: [evidence/kaiju-qa/xr-qa.md](C:/UnityProj/OpenAIBuildWeek-kaiju-qa/evidence/kaiju-qa/xr-qa.md)
