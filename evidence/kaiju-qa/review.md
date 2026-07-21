# Independent final review: Kaiju QA

Review date: 2026-07-21 UTC
Branch: `feature/kaiju-qa`
Scope: independent redesign review plus the orchestrator's final playtest-
remediation acceptance record. The original reviewer changed only this file;
the addendum incorporates the later executed camera, controls, card, MR, and
browser evidence documented beside it.

## Publication verdict

**CONDITIONAL APPROVE — no remaining source, model, asset, IWSDK, or evidenced
experience blocker was found. The feature is approved for commit and PR
publication; final merge/public release remains gated on a clean PR CI run.**

The final serialized installed-Chrome run now completes: six applicable tests
pass with six expected project skips and clean application runtime telemetry.
PR CI is still a required merge gate. Physical Quest 3 testing remains a
bounded residual and does not invalidate the completed Quest 3 IWER software
path.

## Genuine remaining blockers

**None identified in the reviewed latest source and evidence.**

Any reproducible application failure from the clean CI run becomes a new
blocker and supersedes this approval. The pending commit is normal publication
sequencing per the owner's instruction; it is not treated as a defect in this
review. The PR must, of course, contain the exact reviewed files rather than the
older remote branch tip.

## Prior blockers resolved

### Neutral learning choice and narration

`src/index.ts::narrationFor()` now returns no cue for broad, alternate, or
targeted cartridge installation. The answer-giving `targeted` clip is therefore
not played during the neutral choice. Broad and alternate results play the
authored regression cue only after the player runs the evidence, while a fresh
passing suite unlocks release.

The model and presentation now agree on the learning contract:

- the guided comparison demonstrates the broad rule once;
- the handoff exposes all three written cartridge scopes without naming the
  correct candidate;
- either wrong candidate is accepted and produces its own persistent
  regression;
- the release-lock explanation does not reveal the target rule;
- release requires one fresh complete 3/3 suite under the passing rule.

This closes the experience report's former B1 blocker.

### IWSDK interaction compliance

The custom `Raycaster` has been removed. IWSDK `RayInteractable` remains
responsible for object hit targeting, pointer/controller event delivery, and
pointer capture. For screen drags only, the already-delivered normalized pointer
coordinates are converted into a camera ray solely to intersect the active
object's existing drag plane; that ray is not used to search, select, or capture
scene targets. XR continues to use the ray supplied by the IWSDK event.

On pinned IWSDK 0.4.2, `RayInteractable` is the component used by the existing
ECS query and is equivalent to the documented `Interactable` alias. The scene
uses `world.createTransformEntity`, keeps physics and locomotion disabled,
allocates drag temporaries outside the update loop, preserves one scene across
reset and XR re-entry, and tears down owned listeners/entities/resources only
on final disposal. No substantive IWSDK rule blocker remains.

### Visual causality and accessible source path

The latest scene keeps current and prior routes visible, distinguishes blocked
and late regressions, marks hazard protection, renders neutral written rule
scopes, and preserves the comparison after animation ends and under reduced
motion. This closes the former visual-causality blocker by source inspection.

The source also contains an equivalent keyboard and switch-control path,
semantic instruction/rule/evidence/release summaries, visible focus treatment,
captions, non-color status words/shapes, and one exposed polite live region.
Native CDP touch placement completed without page or viewport scrolling. Quest
3 IWER verified controller-ray prop and rule placement, invalid-drop recovery,
lever pulls, the release stamp, first-district completion, XR exit/re-entry, and
post-re-entry progression.

## Required PR CI gate — not a current source blocker

The final local installed-Chrome runner executes the serialized production E2E
command successfully. It covers invalid-drop recovery, the full four-district
real-drag campaign, native touch/no-scroll, mobile Stage 5 reachability, and MR
unsupported/denied fallbacks. Runtime hooks report no application exception,
failed request, HTTP error, or unexpected console error. PR CI remains the
required clean-environment confirmation for merge.

CI should confirm:

- the complete four-district real-drag campaign on the committed source;
- invalid-drop return followed by a valid retry;
- native touch placement and scroll lock;
- mocked unsupported/denied XR fallback tests;
- no application page error, failed request, HTTP error, or unexpected console
  error.

If CI passes, this review imposes no further publication hold. If CI exposes a
reproducible product failure, that failure is blocking until corrected.

## Non-blocking residuals and bounded claims

- **Physical headset:** Quest 3 IWER certifies the requested software/controller
  lifecycle, not physical optics, tracking quality, reach, haptics, comfort,
  thermal behavior, or sustained 72/90 Hz performance. Do not claim physical
  Quest 3 certification without a device run.
- **Accessibility certification:** keyboard, switch, semantic, caption, focus,
  and reduced-motion implementations are present, but a full NVDA/VoiceOver
  campaign and dedicated switch-user validation are not recorded. Publish the
  accessible path, but avoid claiming formal AT certification or complete
  parity until those runs exist.
- **Touch breadth:** native touch placement and no-scroll behavior passed; the
  entire campaign, cancellation, reset, and every utility layout were not
  independently replayed through touch. This is a follow-up coverage gap, not a
  demonstrated defect in the shared interaction/reducer path.
- **Performance:** the production build passes with the known large
  JavaScript/Havok payload warning. Cold-cache mobile and headset startup remain
  unmeasured.
- **XR diagnostics:** retain the active-session renderer resize warning and old
  reload-time destroyed-entity warnings as watch items. The verified exit and
  re-entry lifecycle did not reproduce player-visible state loss.
- **Asset provenance:** Quaternius/Kenney CC0 assets and Kokoro narration have
  detailed source, license, format, and checksum records. The FLUX backdrop has
  an exact prompt/model/hash but no preserved provider-terms snapshot and uses
  JPEG bytes under a `.png` name. Keep it outside CC0 claims and retain the
  documented distribution caveat.

## Validation evidence accepted

| Check | Final-review classification |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run test:model` | Pass, 23/23 across campaign and remediation helpers |
| `npm run build` | Pass; known bundle-size warning |
| `git diff --check` | Pass in the reviewed working tree |
| Invalid desktop drop | Real interaction observed; authored recovery retry retained |
| Native CDP touch / no-scroll | Pass |
| Complete desktop real-drag campaign | Pass on the final remediation source |
| Quest 3 IWER MR/controller/lifecycle | Pass; physical headset pending |
| Final local E2E wrapper | Pass, 6 applicable tests and 6 expected skips |

## PR feedback follow-up

- The historical XR-status thread is already addressed: XR UI updates restore
  the latest lab announcement in `#status` and publish XR-specific copy through
  `#xr-status`/the announcement channel instead.
- The historical stale-pose thread is outdated; the current `VisualCue` contract
  no longer exposes the old stale cue, and rule installation maps to the placed
  state before the fresh rerun.
- New fixture, callout, and placement helpers now import Three.js primitives
  exclusively through `@iwsdk/core`.
- Draggable card billboarding converts the camera's world quaternion into the
  card parent's local space, with a rotated-parent unit test.
- The package engine range now matches the TypeScript-stripping model-test
  command by supporting Node 22.12+ and Node 24+ rather than Node 20.
- Route ribbons now obey scene depth and no longer paint over the kaiju,
  buildings, or vehicles; the fixed School Crossing frame is committed as
  `11-route-layering-fixed.webp`.

## Merge and publication classification

**Code-review verdict: APPROVE.**

**PR verdict: APPROVE after the reviewed worktree is committed.**

**Publication verdict: CONDITIONAL APPROVE — publish/merge after clean required
CI. Physical-headset and formal assistive-technology certification remain
explicit residuals, not automatic blockers.**
