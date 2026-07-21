# Independent final review: Kaiju QA

Review date: 2026-07-21 UTC
Branch: `feature/kaiju-qa`
Scope: latest working-tree state after the narration and screen-drag fixes. This
review changed only this file and did not run new validation or perform branch,
commit, push, or merge operations.

## Publication verdict

**CONDITIONAL APPROVE — no remaining source, model, asset, IWSDK, or evidenced
experience blocker was found. The feature is approved for commit and PR
publication; final merge/public release remains gated on a clean PR CI run.**

The failed-to-complete local E2E wrapper is classified as a runner/process-pool
problem rather than a demonstrated application defect. CI is still a required
release gate, not an optional follow-up. Physical Quest 3 testing remains a
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

## Required CI gate — not a current source blocker

The clean PR runner must execute the serialized production E2E command and
return a final reporter result. The local final wrapper attempts were disrupted
by slow IWSDK/Chromium startup, external command ceilings, orphaned browser
processes, and a saturated process pool. Focused runs established real invalid
drop behavior and native touch/no-scroll behavior; an earlier complete
four-district campaign used real canvas drags, lever pulls, and stamp presses.
No application exception, failed request, or HTTP error was established in the
completed focused evidence.

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
| `npm run test:model` | Pass, 8/8 |
| `npm run build` | Pass; known bundle-size warning |
| `git diff --check` | Pass in the reviewed working tree |
| Invalid desktop drop | Real interaction observed; authored recovery retry retained |
| Native CDP touch / no-scroll | Pass |
| Complete desktop real-drag campaign | Earlier redesign-loop pass; final committed rerun delegated to CI |
| Quest 3 IWER controller/lifecycle | Pass; physical headset pending |
| Final local E2E wrapper | Incomplete because of host startup/process issues |

## Merge and publication classification

**Code-review verdict: APPROVE.**

**PR verdict: APPROVE after the reviewed worktree is committed.**

**Publication verdict: CONDITIONAL APPROVE — publish/merge after clean required
CI. Physical-headset and formal assistive-technology certification remain
explicit residuals, not automatic blockers.**
