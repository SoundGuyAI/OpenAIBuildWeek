# Experience quality review: boilerplate

Branch: `chore/boilerplate-post-merge-review`  
Reviewed: 2026-07-20  
Method: static source, test, plan, and evidence inspection only  
Runtime coverage by this reviewer: none

## Scope and evidence boundary

This report reviews the post-merge boilerplate against the experience-quality
role card and `docs/DEFINITION_OF_DONE.md`. The reviewer did **not** open or run
the page, launch browser automation, use IWER, or enter a headset. No rendered,
touch-device, controller, hand-tracking, audio, frame-rate, or comfort behavior
is claimed as observed here.

Existing Playwright specifications and reports were read as context, but they
were not rerun and are not direct observations by this reviewer. Their current
assertions establish boot/status/control visibility and responsive structure;
they do not establish that movement changes the view, a letter can be
manipulated, visual feedback is legible, or a successful XR session is
comfortable.

Priority meanings:

- **P1**: core player promise or release-quality certification is absent or
  unverified; resolve or explicitly accept before treating that surface as
  release-ready.
- **P2**: meaningful accessibility, comfort, usability, or performance risk;
  fix or observe on the named release-gate device.
- **P3**: polish or semantic cleanup with a lower likelihood of blocking use.

Finding types:

- **Code-confirmed** means the property follows directly from the inspected
  markup, CSS, TypeScript, or tests.
- **Observation required** means static source can identify the risk or intended
  mechanism but cannot establish the player-visible result.

## Static verdict

The boilerplate has good static foundations: native controls, descriptive
movement-button labels, a live status region, visible-focus styling, safe-area
offsets, explicit XR launch/failure text, reduced-motion handling, and a
low-allocation animation loop. The declared foreground/background colors also
have strong source-level contrast.

Experience quality is **not fully certified** under this review constraint. The
largest remaining gaps are keyboard access to the core letter action,
unobserved pointer/touch/XR interaction and feedback, missing source-level
in-headset instruction/comfort coverage, small-screen reflow risk, and
unmeasured mobile/headset rendering cost.

## Input discoverability and operability

| Input | Code-confirmed properties | Properties requiring observation |
| --- | --- | --- |
| Keyboard | Desktop copy names WASD and arrow movement. HUD actions are native buttons and receive the shared `:focus-visible` treatment. | Actual locomotion, prevention of unwanted browser behavior, focus visibility over the rendered scene, and post-XR focus restoration are unobserved. There is no application keyboard path for selecting, moving, or releasing a letter. |
| Pointer | Each letter entity receives `Interactable` and `DistanceGrabbable`. Desktop copy says to point, touch, or grab letters. | Hit areas, hover/availability cues, the exact press/drag/release gesture, occlusion by the HUD, and recovery after an interrupted drag are unobserved. |
| Touch | Coarse/narrow layouts expose four 52 by 52 CSS-pixel movement buttons with directional `aria-label`s. Pointer capture plus `pointerup`, `pointercancel`, and `lostpointercapture` dispatch key-up events. | The controls synthesize `KeyboardEvent`s; no inspected test proves IWSDK consumes them to move the player. Hold/release, multi-touch diagonals, interrupted input, and touch-letter manipulation remain unobserved. |
| XR controllers/hands | The world requests hand tracking, enables grabbing, and gives letters `DistanceGrabbable`. The browser HUD provides checking, enter, exit, unavailable, and retry labels. | No in-world controller/hand vocabulary is defined in application source. Ray/direct reach, trigger/grip/pinch mapping, haptics, controller loss, hand/controller switching, exit/re-entry, and focus after exit remain unobserved. |

## Accessibility and visual legibility

### Code-confirmed strengths

- `index.html` declares `lang="en"`, a responsive viewport with
  `viewport-fit=cover`, a named controls region, native buttons, and a
  `role="status"` element for changing readiness and XR messages.
- Movement symbols have text alternatives: Move forward, left, backward, and
  right. Dynamic XR button text communicates checking, entry, exit,
  unavailable, and retry states.
- Buttons have a two-pixel focus outline with offset, in addition to border and
  background changes. Focus indication is not color alone because geometry and
  outline are also changed.
- The HUD and touch pad use safe-area offsets. The movement pad is larger than
  the general HUD controls and uses pointer capture to reduce stuck-input risk.
- Source-level contrast estimates for opaque/composited declared colors are
  strong: root text/page about 19.3:1, status text/HUD at least about 11.9:1,
  eyebrow/HUD about 11.7:1, ordinary button text/background about 16:1, Enter VR
  text/gradient endpoints at least about 13:1, and focus border/button about
  11:1. These are calculations from CSS values, not rendered measurements.

### Static limitations

- The scene container has an `aria-label`, but it is a non-focusable generic
  `div`; the ten letters have no DOM names, focus targets, state, or keyboard
  manipulation equivalent.
- The motion toggle changes its accessible name between Pause and Resume, but
  does not expose toggle state through `aria-pressed`.
- HUD text is relatively small: status/hint text is `0.9rem`, the eyebrow is
  `0.72rem`, and mobile HUD buttons are `0.82rem`. Readability with browser zoom,
  OS text scaling, low vision, glare, and a busy WebGL background is unobserved.
- Alpha backgrounds, backdrop blur, antialiasing, and `opacity: 0.45` on disabled
  controls mean the actual rendered contrast cannot be certified from source.
  Forced-colors/high-contrast behavior is also untested.

## Reduced motion and comfort

### Code-confirmed properties

- `prefers-reduced-motion: reduce` disables the floating word by default.
- A live media-query listener stops the float if the preference changes while
  the page is open and restores motion only when the player has not manually
  paused it.
- The Pause/Resume control remains available for explicit player choice.
- The CSS reduced-motion rule effectively removes authored transitions and
  animations. The floating system clamps large frame deltas and updates only
  one word-root entity without per-frame object allocation.
- Authored float motion is limited in source to 0.08 world units vertically and
  about 0.08 radians of yaw, but its perceived scale and comfort are not
  statically measurable.

### Comfort gaps requiring observation

- The source does not declare teleport, snap-turn, vignette, movement-speed, or
  seated/standing comfort options. Reduced-motion handling stops decorative
  floating but does not define an XR locomotion comfort path.
- The word root is placed at 1.8 world units high and 2.2 units forward, using
  distance grabbing. Comfortable scale, ray reach, direct-hand reach, seated
  visibility, standing visibility, and floor alignment require IWER/headset
  observation.
- No application-level in-headset reset/recenter instruction, controller-loss
  recovery prompt, or comfort prompt is defined. The source contains no
  in-world equivalent of the HTML hints; this review does not assume that the
  browser HUD is visible during immersive VR.
- Exit/re-entry restores camera state in code, but visual continuity,
  disorientation, duplicated input, and focus restoration require runtime
  testing.

## Audio and non-audio feedback

- No tracked audio asset or application audio API usage was found. Autoplay,
  level, mute, and retry-stacking risks are therefore not applicable to this
  boilerplate in its current form.
- Essential readiness and XR launch/failure information has a visual text
  equivalent in the status region; no information is audio-only.
- The application does not define per-letter hover, pressed, grabbed, released,
  invalid-action, haptic, or status feedback. IWSDK may provide some default
  interaction treatment, but that result is not established by this static
  review. Until observed, the core action cannot be credited with distinct
  availability, commit, and success feedback or with reinforcement across two
  channels.

## Performance-sensitive experience review

### Code-confirmed strengths

- Voxel geometry is shared, materials are created once per visible letter, and
  scene resources are allocated during setup rather than in the hot update
  loop.
- The floating system queries ECS state and updates one parent transform; it
  does not create vectors, materials, geometries, arrays, or timers per frame.
- Physics and scene understanding are disabled. Locomotion is configured to use
  a worker.

### Plausible risks requiring measurement

- The static letter patterns create **153 separate voxel `Mesh` instances**.
  Every voxel casts and receives shadows, and the key directional light casts
  shadows. The workload may multiply draw and shadow-pass cost on a phone or
  standalone headset even though geometry is shared.
- The HUD and every button use translucent backgrounds/backdrop blur over a
  continuously rendered WebGL scene. This can add compositing cost on low-end
  mobile GPUs.
- Existing review evidence reports an approximately 1.69 MB minified JavaScript
  chunk and a 2.09 MB Havok WASM asset despite application physics being
  disabled. This reviewer did not rebuild or remeasure those artifacts. Cold
  startup, parse/compile time, worker startup, and memory pressure remain device
  risks.
- No weakest-device frame-time, thermal, memory, interaction-latency, or cold
  time-to-ready observation is available to this report.

## Ranked findings and observable retest criteria

### EQ-01 — P1 — Core letter manipulation has no keyboard-accessible path

**Type:** Code-confirmed.

Movement and the three HUD actions use keyboard-operable mechanisms, but the
core letter action exists only as 3D `Interactable`/`DistanceGrabbable`
entities. There is no focusable letter representation, accessible letter name,
keyboard select/move/release command, or documented keyboard exception.

**Retest:** Starting with a keyboard only, a tester can discover and perform the
declared core action on at least one named letter, receive clear commit/release
feedback, undo or reset the result, and traverse every HUD action with a visible
focus indicator. If keyboard letter manipulation is intentionally excluded,
record the platform/input exception and provide an equivalent non-pointer path
for the essential outcome.

### EQ-02 — P1 — Core input success and interaction feedback are not certified

**Type:** Observation required, with a source-level feedback gap.

The source wires plausible pointer, touch, controller, and hand mechanisms, but
the inspected tests do not move the player or manipulate a letter. Application
source also supplies no explicit hover, active, grab, release, invalid, haptic,
or status treatment for letters.

**Retest:** On desktop, phone, IWER, and headset as applicable, perform one full
availability -> commit -> move -> release interaction. Verify a visible target
state before commit, immediate acknowledgement on commit, continuous movement,
a stable release result, and recovery from cancellation. On mobile, hold and
release every movement arrow, test a two-button diagonal, interrupt a held
pointer, and confirm movement stops without a stuck key. Record controller and
hand results separately.

### EQ-03 — P1 — XR discoverability, comfort, and recovery remain unproven

**Type:** Code-confirmed absence of app-authored in-world guidance; observation
required for runtime behavior.

The browser HUD explains XR availability, but application source contains no
in-world controller/hand prompt or declared comfort choices. Scene scale,
locomotion, reach, floor alignment, controller loss, recenter/reset, and
exit/re-entry cannot be certified statically.

**Retest:** In IWER and a physical headset, enter from a fresh load with
controllers, then hands. Without coaching, identify the grab action, grab and
release near and distant letters, locomote, test seated and standing height,
lose/reconnect a controller, recenter/reset, exit, and re-enter. Confirm no
uncommanded camera motion, uncomfortable acceleration, scale mismatch,
duplicated input, or loss of the browser recovery path. Record any missing
teleport/snap-turn/comfort alternative as an explicit product limitation.

### EQ-04 — P2 — Prompts are viewport/pointer-class aware, not active-input aware

**Type:** Code-confirmed.

CSS swaps desktop and mobile hints using `(pointer: coarse)` or a 720-pixel
width, rather than the last active input. Narrow mouse windows can show touch
vocabulary, hybrid devices can show the wrong primary-pointer vocabulary, and
no controller/hand mapping is displayed. “Touch a letter to interact” and
“point, touch, or grab” also do not state the exact commit gesture.

**Retest:** Exercise a narrow desktop window, a touch laptop/tablet with mouse,
a phone with external keyboard, and XR controllers/hands. The visible prompt
must match the input currently in use and state the exact press/drag,
trigger/grip, or pinch action needed for first success without narration.

### EQ-05 — P2 — Mobile HUD actions fall below a robust touch-target height

**Type:** Code-confirmed dimensions; observation required for physical ease.

The mobile media rule reduces general buttons to a 38 CSS-pixel minimum height.
The four movement controls are a stronger 52 by 52 pixels. The smaller Enter
VR, Pause/Resume, and Reset actions may be difficult under one-handed use,
motion, or motor impairment.

**Retest:** Make each HUD action at least 44 by 44 CSS pixels, or demonstrate an
equivalent target area and spacing. On the release-gate phone, activate every
HUD action ten times with no adjacent activation, including portrait and
landscape orientations.

### EQ-06 — P2 — Zoom, text scaling, landscape, and safe-area reflow may clip UI

**Type:** Plausible risk from code.

The document and app shell use `overflow: hidden`; the HUD is fixed and has no
maximum height or internal scrolling. Its width subtracts two rem from the
viewport but does not subtract both horizontal safe-area insets. Wrapped
buttons, larger text, short landscape heights, or a left display cutout can
push content off-screen or over the touch pad.

**Retest:** At 200% browser zoom and maximum supported OS text size, test at
320x568, the release-gate phone portrait/landscape, and a notched landscape
safe-area emulation. Heading, full status text, hints, all HUD buttons, and all
movement controls must remain readable and operable without overlap or clipped
content; provide scrolling or a compact layout if they do not fit.

### EQ-07 — P2 — Accessible state and scene semantics are incomplete

**Type:** Code-confirmed.

The motion button communicates the next action through text but not its current
toggle state through `aria-pressed`. The generic labeled scene container and
unlabeled 3D letters do not expose the scene contents or manipulation state to
assistive technology.

**Retest:** With a desktop screen reader, confirm the controls region, status
changes, VR availability/failure, motion state, and each essential scene action
are announced once and in useful order. Expose the motion state
programmatically and provide a named keyboard-operable representation or
documented equivalent for essential letter interaction.

### EQ-08 — P2 — Initialization failure has no player recovery action

**Type:** Code-confirmed failure path.

If `World.create` rejects, the only player message says the world could not
start and directs the player to the browser console. There is no retry control,
plain-language recovery step, or retained playable fallback.

**Retest:** Force world initialization to fail. A cold player must receive a
plain-language explanation, a usable retry/reload action, and any relevant
browser/WebGL guidance without opening developer tools. Retrying must not
duplicate listeners, entities, workers, or status announcements.

### EQ-09 — P2 — Mobile/headset GPU and startup cost require release-gate data

**Type:** Code-confirmed workload; observation required for impact.

The 153 shadowed voxel meshes, WebGL-overlaid backdrop filters, worker startup,
and reported bundle/WASM sizes are credible frame-pacing and startup risks.
Static allocation hygiene is good but does not establish device performance.

**Retest:** On the weakest release-gate phone and headset, record cold time to
ready/meaningful interaction, steady and busiest-moment frame pacing, long
tasks, memory, and thermal behavior. The page should reach meaningful
interaction within the project’s 20-second release gate and sustain the target
device refresh rate without persistent missed frames. Compare shadows and
backdrop blur disabled to identify the dominant cost if the gate is missed.

### EQ-10 — P3 — Permanent unavailability uses waiting semantics

**Type:** Code-confirmed.

All disabled buttons use `cursor: wait` and 45% opacity, including the permanent
“VR unavailable” state. That cursor implies progress rather than an unavailable
capability, and the lowered opacity may reduce legibility against the rendered
scene.

**Retest:** In unsupported WebXR, the button must look and sound unavailable,
not busy. Use a default/not-allowed cursor or state-specific style, verify the
full label remains legible, and confirm the status text explains the continuing
desktop/touch path.

## Required observational handoff

This static review can be closed as a document, but the following experience
claims remain outside its evidence boundary:

1. Desktop keyboard movement, pointer hit testing, visible hover/grab/release
   feedback, and focus appearance over the actual scene.
2. Real mobile target comfort, text scaling, safe areas, held movement,
   cancellation, multi-touch, and touch-letter interaction.
3. IWER/headset entry, controllers, hands, locomotion, comfort, scale,
   controller loss, exit/re-entry, and recenter/reset behavior.
4. Rendered contrast, forced colors, screen-reader output, startup latency,
   frame pacing, memory, and thermal behavior.

None of those items is marked pass by this report.
