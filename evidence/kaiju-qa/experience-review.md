# Experience/accessibility/product QA review: kaiju-qa

Verdict: **CONDITIONAL / NOT READY TO SIGN OFF**.

## Post-review remediation (orchestrator, 2026-07-20)

The findings below are retained as the independent review record. The current
source now removes the false modal contract (`role="region"`), exposes one live
status region instead of duplicate announcements, restores keyboard focus to
the next meaningful control after core transitions, adds a visible selected
scenario keyline, broadens request diagnostics, authors keyboard/mobile
Playwright coverage, preserves the guided broad-regression attempt, and removes
release scaling in reduced-motion mode. Static blockers B1/H3/H4 are therefore
remediated in source. Browser, assistive-technology, mobile-device, performance,
and XR runtime confirmation remains deferred, so the overall experience verdict
stays conditional rather than signed off.

The source presents a coherent, unusually teachable QA loop: baseline evidence,
missing edge case, useful failure, regression, targeted choice, full-suite gate,
and release. The final choice is genuinely player-controlled after the guided
experiment. Static inspection also found one accessibility blocker and several
high-risk items that need runtime/device confirmation. No browser, IWSDK, or
headset runtime was started for this review.

## Evidence boundary

- **Verified from source:** HTML semantics, state-machine transitions, CSS rules,
  scene construction, package/build artifacts, and the current working-tree diff.
- **Static inference only:** actual visual legibility, touch hit testing, focus
  order in rendered layouts, screen-reader announcements, animation comfort,
  frame rate, network transfer time, and real-device behavior.
- **Not reviewed as runtime evidence:** the sibling browser/XR evidence files are
  still marked pending; no screenshots or test results were available to verify.

## What is working well

- **Tutorial clarity:** the five-step guide has one explicit primary action per
  step, progress text, hint escalation, hide/resume support, and short causal
  copy. The model rejects out-of-order tutorial actions with explanatory text.
- **Agency after tutorial:** `independent` state enables all three guardrails;
  the model preserves attempts, marks evidence stale on a changed guardrail,
  allows revision, and unlocks release only for the targeted current 3/3 pass.
- **Cognitive load/comedy:** the mission, loop rail, scenario cards, attempt
  history, and kind failure language make the lesson inspectable. The baby
  kaiju/rescue framing is warm without making failure punitive. This is a good
  Devpost Education fit because the mechanic demonstrates the claim rather than
  merely describing QA vocabulary.
- **Non-color cues:** status text is explicit (`PASS`, `FAIL`, `REGRESSION`,
  `STALE`, etc.); shapes and borders vary by status; scenario goals and outputs
  provide additional meaning. This is supported statically, not verified with
  a color-vision or contrast tool.
- **Reduced motion:** the system preference and in-product toggle both update
  `data-motion`; the scene receives the setting and uses an authored scale/pose
  path. CSS suppresses transition/animation duration. Runtime comfort remains
  unverified.

## Ranked findings

### Blocking

**B1 — False modal semantics and incomplete keyboard/screen-reader containment.**

`#debrief-panel` is `role="dialog" aria-modal="true"`, is focused on release,
and contains the final action, but the underlying controls are not inert, hidden,
or focus-trapped. A keyboard user can tab into the still-active game behind the
dialog; a screen reader may be told that background content is unavailable while
the DOM still exposes it. This can make the release result confusing or allow
state changes behind the final debrief. (Static source finding: `index.html:401-423`,
`src/index.ts:448-453`; no AT runtime verification.)

**Retest:** release with keyboard only; confirm focus enters the dialog, Tab and
Shift+Tab remain within it, Escape behavior is defined, the background is not
reachable, and focus returns predictably after “Test again.” Run an NVDA or Voice
Over pass and verify the release announcement, dialog heading, and button are
read once in a sensible order. If the background is intentionally interactive,
remove `aria-modal` and implement a non-modal status panel instead.

### High

**H1 — Static payload is large for the promised short, local experience.**

The current `dist` contains approximately 2.09 MB `HavokPhysics*.wasm`, 1.71 MB
main JS, 423 KB `inter` JS, and 198 KB worker JS before compression (about 4.5 MB
among the largest listed assets). This conflicts with the product goal of a
small deterministic tabletop unless the browser cache or transfer compression
materially changes the first-load experience. It also suggests physics/runtime
weight despite the game’s no-physics design. (Verified from the existing `dist`
artifact; network transfer and whether Havok is needed are not verified.)

**Retest:** measure cold-cache mobile first load on a throttled 4G profile,
record compressed transfer, time-to-first-action, and total JS/WASM fetched.
Remove or lazy-load unused physics/runtime chunks if the game does not need
them. Set a budget suitable for the judging path and fail CI when exceeded.

**H2 — Mobile layout is plausible but not proven at the smallest useful sizes.**

The responsive rules stack the HUD and make the action dock sticky, but the
five-step rail intentionally has 6rem minimum columns and horizontal overflow;
the action stack is long and the 3D canvas is touch-action disabled. This may be
usable, but it risks excessive scrolling, obscured sticky content, or a narrow
viewport where the evidence board is below the fold. (Static inference from
`src/styles.css:154-172`; no browser/device verification.)

**Retest:** at 320x568, 360x640, 390x844, landscape phone, and tablet, complete
the entire loop with touch. Confirm every action is visible or reachable without
losing context, no horizontal page overflow exists outside the intentionally
scrollable loop rail, sticky controls do not cover content, and all essential
labels remain readable at 200% text zoom.

**H3 — Focus order and focus recovery are not specified for state changes.**

The source adds visible focus styling and focuses guardrail inputs after revise,
but does not explicitly move focus to the newly relevant primary action after
each tutorial transition, to the changed evidence after a run, or back to a
stable control after reset. The live region may announce changes while keyboard
users remain physically positioned on a now-disabled or semantically stale
control. (Static inference; exact browser focus behavior unverified.)

**Retest:** complete baseline, stage tower, run tower, select/run each wrong
guardrail, revise, rerun, release, and reset using Tab/Enter/Space only. At every
transition record focused element, announcement, and next logical action; ensure
there is no focus loss and no disabled-control dead end.

**H4 — Screen-reader live regions are duplicated and potentially noisy.**

Both `#status` and visually hidden `#announcement` are polite atomic live
regions, and both are assigned the same announcement on each render. This can
produce duplicate speech for every action. The status is also the visible lab
status, so it should not need a second identical announcer unless the two have
distinct purposes. (Static source finding: `index.html:360-362`, `425-430`,
`src/index.ts:476-477`.)

**Retest:** with NVDA/VoiceOver, perform the full loop and count announcements.
Use one live region for the concise state change, or make the second region
non-live and verify that detailed visible status remains available.

### Medium

**M1 — Tutorial copy is clear but the 3D causal proof may be spectator-dependent.**

The model and HUD make the regression legible in text, while `scene.ts` provides
route traces, status materials, and authored cues. A spectator at thumbnail size
may still miss why the ambulance regressed unless the changed route, blocked
lane, and before/after row are simultaneously prominent. (Static inference;
visual proof is unverified.)

**Retest:** record a 30–60 second silent spectator capture at desktop and mobile
sizes. Without narration, ask an uninvolved viewer to answer: what changed,
which earlier behavior regressed, and why the striped-zone choice is targeted.
Require all three answers from the frame/HUD alone.

**M2 — “Inspect” exists but its information scent is weak in source.**

Scenario cards expose `aria-pressed` and dispatch an inspect action, but the
markup does not visibly identify a selected state beyond the generic button
styles shown here, and the announcement is only “Scenario: STATUS.” A learner
may not understand that selecting a card changes the scene/evidence comparison.
(Static inference; rendered selected state not verified.)

**Retest:** inspect each scenario by mouse, keyboard, and touch; verify a strong
selected affordance, focused route/highlight, and a concise explanation of what
changed. Confirm the same information is announced to assistive technology.

**M3 — XR and scene-scale claims remain intentionally unverified.**

The existing immersive entry path is preserved and scene code creates world-space
control proxies, but no headset, re-entry, reachability, comfort, or spectator
scale test was run. This is acceptable under the explicit no-runtime constraint,
but the submission must not imply certified VR quality from this review.

**Retest:** on supported headset/browser, enter and exit XR, re-enter after
backgrounding, activate every world-space proxy, confirm controls are reachable
without awkward bending, and verify that the 3D scene does not occlude the DOM
lesson or cause discomfort at default scale.

**M4 — Build/Devpost readiness has visible evidence gaps.**

The README says browser evidence, public URL, demo video, feedback session, and
repository license are still pending. The plan also expects desktop/mobile
artifacts, but the current browser evidence file is pending. The educational
impact claim is appropriately modest, but the final submission needs a concrete
playable link and a short proof video showing the independent decision and
release gate.

**Retest:** populate browser evidence with command, commit, browser, viewport,
artifacts, and errors; provide a public URL and a silent/voiced demo that shows
the full causal arc; verify the license/provenance checklist before Devpost.

### Nice-to-have

**N1 — Add a persistent “why locked” relationship between release and evidence.**

The lock reason is present as text, but linking it to the failing/stale scenario
with a focusable action would reduce search cost, especially on mobile and for
new learners.

**N2 — Add a non-visual cue for the live 3D event timing.**

The authored scene cues are helpful for sighted players. A short, deduplicated
announcement such as “Ambulance lane blocked: regression” at the event moment
would improve parity, provided it does not repeat the later evidence update.

## Retest gate / acceptance checklist

Do not call this experience-ready until all of the following are recorded:

1. Modal dialog focus containment and screen-reader pass are green (B1).
2. Keyboard-only full loop passes with focus/announcement notes (H3/H4).
3. Cold-cache mobile performance and payload measurements meet an agreed budget
   (H1), with unused physics weight removed or justified.
4. 320px-width, landscape, touch, 200% zoom, and reduced-motion checks pass
   without obscured controls (H2).
5. An uninvolved spectator can explain the regression and targeted fix from a
   short capture (M1).
6. Browser artifacts, public demo URL/video, and Devpost/license readiness are
   attached to the evidence set (M4).
7. XR remains explicitly labelled “deferred/unverified” until a separate runtime
   review is completed (M3).

## Final path and verdict

Path: `C:/UnityProj/OpenAIBuildWeek-kaiju-qa/evidence/kaiju-qa/experience-review.md`

Verdict: **CONDITIONAL — strong instructional/product concept and a promising
static implementation, but not independently QA-approved until the modal
accessibility issue, keyboard/AT behavior, payload/mobile checks, and evidence
gaps are retested.**
