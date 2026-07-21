# Independent experience retest: Kaiju QA

Review date: 2026-07-21 UTC

Branch: `feature/kaiju-qa`

Verdict: **CONDITIONAL APPROVE — no current experience or source blocker;
clean PR CI remains the publication gate.**

This retest reviews the latest shared working-tree source and supplied post-fix
browser/XR evidence. No IWSDK runtime was started for this review. No source,
test, asset, manifest, branch, commit, or screenshot was changed.

## Final gate summary

| Gate | Current result |
| --- | --- |
| B1 - neutral, player-owned rule choice | **Pass.** The neutral three-cartridge handoff remains intact, and broad, alternate, and targeted installation cues now return no narration. Regression narration reports evidence without naming the answer. |
| B2 - persistent visual regression and fix | **Pass.** Persistent current/prior routes, pass/fail/late/blocked markers, hazard protection, and distinct scope geometry visibly embody the regression and targeted recovery after motion ends. |
| B3 - keyboard/switch/semantic plus touch/XR parity | **Pass for the experience gate.** Keyboard world actions, native focusable switch-action buttons, semantic instruction/rule/evidence/release text, native touch drag with zero sampled page scroll, and the supplied Quest 3 IWER controller campaign evidence cover the required interaction modes. |
| Mobile utility and narration fixes | **Pass.** Utility icons and accessible labels survive runtime updates, compact controls no longer expose overflowing mobile text, regression cues are evidence-first, and rule installation no longer leaks the intended solution. |

## Closed experience blockers

### B1 - The rule decision is now player-owned

After the guided broad-rule demonstration, the expected target is an unnamed
rule choice. All candidate cartridges expose their scope, wrong broad and
alternate choices are accepted and produce distinct regressions, and release
copy does not name the correct cartridge. `narrationFor()` now returns `null`
for every rule-install visual cue while retaining the authored regression cue
for the resulting failed suite. Narration-on and narration-muted players
therefore receive the same evidence-led decision.

### B2 - Regression and recovery remain visually embodied

The tabletop preserves current and prior route traces, actor positions,
prior-pass badges, and large result markers. A wrong rule simultaneously shows
the new hazard protected and an established behavior blocked or late. The
targeted rule restores the complete route set. The causal story is persistent,
non-color-only, and remains available under reduced motion.

### B3 - Equivalent accessible and cross-input paths are present

The focused scene supports arrow-key candidate navigation and Enter/Space
activation for place, choose, run, release, advance, and reset-related flow.
The DOM also exposes native focusable buttons for the same current actions and
preserves focus when the action set changes. Semantic text names the current
instruction, every rule scope, scenario evidence status, and release-lock
reason; one polite live region carries announcements.

Native touch placement and no-scroll sampling passed. The supplied Quest 3
IWER controller campaign passed the controller interaction path. These results
close the prior experience-parity blocker; assistive-technology certification
and physical-device behavior remain residual validation rather than current
experience source blockers.

## Resolved SDK nomenclature finding

The earlier P1 finding treated `RayInteractable` as a custom or disallowed
interaction path. The installed pinned IWSDK 0.4.2 declaration proves the
opposite: `RayInteractable` is the canonical ray-target component and
`Interactable` is declared as its deprecated alias with the instruction to use
`RayInteractable` instead. The current source therefore uses the SDK component
directly for screen, touch, and XR hit targeting and event delivery.

`registerManipulation()` derives a camera ray only after IWSDK has selected and
captured a screen pointer target. That ray intersects the already-active
object's drag plane to convert two-dimensional pointer motion into tabletop
movement; it does not search for, select, or capture scene targets. XR continues
to consume the controller ray delivered by IWSDK. No hand-rolled normal
interaction raycaster remains, so P1 is closed.

## Non-blocking residuals

- **Clean-CI browser confirmation:** the latest local wrapper was defeated by
  the saturated VM browser/runtime process pool. Existing desktop campaign,
  invalid-drop, touch, typecheck, model, and build evidence found no current
  gameplay failure. A clean serialized CI result remains the appropriate final
  confirmation after P1 is corrected.
- **Physical Quest 3 testing:** IWER evidence does not certify real optics,
  tracking, reach, haptics, comfort, thermal behavior, controller loss, or
  sustained headset frame rate.
- **Assistive technology and responsive extremes:** NVDA/VoiceOver, 200% text
  zoom, and small-landscape completion would strengthen certification but are
  not publication blockers given the current native semantic and keyboard paths.
- **Judge-facing proof:** a clean thumbnail-readable regression/fix comparison
  would improve the publication story, although the persistent implementation
  now satisfies the underlying experience gate.

## Final publication verdict

**CONDITIONAL APPROVE.** All prior experience blockers and the mobile/narration
remediation pass this retest. The pinned SDK evidence closes P1, and the
narration toggle now exposes the correct inverse action while muted. Commit the
reviewed worktree and require the clean serialized PR CI run before merge or
public release. Physical-headset testing remains explicitly optional for this
PR and required only for a claim of physical Quest 3 certification.
