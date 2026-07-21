# Browser QA — scenery and hand interactions

Reviewed: 2026-07-21
Branch: `fix/scenery-hand-interactions`
Verdict: **Conditional pass**

## Scope and evidence

- Independently reviewed the feature plan, current scene/control implementation,
  control-fixture model tests, Playwright desktop/mobile specs, and the supplied
  `01-desktop.jpg` and `02-mobile.jpg` captures.
- The orchestrator's fresh ordered validation reported typecheck, model tests,
  build, and all six applicable E2E cases passing, with six expected
  cross-project skips and no page, request, HTTP, or application errors.
- A live in-app browser session was not available to this QA agent, so the
  runtime assessment below is based on those fresh results and supplied
  captures rather than an additional interactive browser run.

## Desktop visual assessment

Pass with minor reservations.

- The kaiju now reads as one authored character. The supplied frame shows no
  detached eyeballs, floating helmet, or separate accessory silhouette. The
  authored face is legible and the character is grounded near the center of the
  workbench.
- The scene has a clearer miniature-lab identity: the workshop backdrop, robot
  arms, tabletop, imported buildings, road markings, action sockets, and the
  run-tests control form a coherent hierarchy. Remaining primitive geometry is
  mostly functional (roads, sockets, route markings, platform, collider-backed
  controls) rather than arbitrary decoration.
- The lever is large, labeled, visually grounded, and has an understandable
  grab-and-pull silhouette. It no longer reads as an unexplained floating ball.
- The world-space instruction and evidence panels overlap the upper portion of
  the diorama and partially compete with buildings, but the current target,
  destination cue, kaiju, and lever remain distinguishable at 1280x720.
- A single Stage 1 still image cannot by itself certify attachment throughout
  every animation. The implementation uses the authored face and changes
  reaction clips to one-shot playback returning to idle, while the passing full
  desktop campaign is a useful regression signal.

## Mobile visual assessment

Conditional pass.

- The portrait capture preserves all HUD text and controls without clipping,
  and the action caption plus six utility buttons remain reachable.
- The diorama is framed too small for a primary touch surface. At 390x844 the
  entire game world occupies only a short band around the middle of the screen,
  while a large unused dark region separates it from the bottom caption. The
  kaiju, buildings, current prop, socket, and lever are consequently tiny and
  harder to parse or acquire than they are on desktop.
- Recommended follow-up: use a tighter portrait camera framing and/or collapse
  the two status cards after initial acknowledgement so the current prop,
  destination, kaiju, and active control receive materially more screen area.
  Preserve the existing non-scrolling HUD and bottom control reachability.

## Interaction regression assessment

- Desktop campaign coverage is strong: the E2E completes all four districts
  through prop drags, repeated lever pulls, cartridge installation, stamp
  presses, level advancement, and campaign completion. It also verifies invalid
  drop recovery, target return, state transitions, and a clean runtime.
- The lever has a dedicated invisible `0.36 x 0.54 x 0.36` hit target, exclusive
  pointer ownership, pointer capture, spring return, and deterministic progress
  tests. This is good browser-side evidence for a forgiving mouse target.
- Native mobile touch coverage proves the service-car drag works without page
  scrolling. The mobile Stage 5 test proves every cartridge and its dock project
  inside the canvas.
- Coverage gap: the mobile test reaches Stage 5 using Playwright mouse drags for
  the lever and intermediate actions. There is no native CDP touch exercise of
  the lever, cartridges, or stamp. Add at least one native-touch lever pull and,
  ideally, native-touch cartridge and stamp actions before treating all touch
  controls as certified.
- Browser E2E cannot certify controller-ray or articulated-hand pinch behavior.
  The shared IWSDK `RayInteractable`/`PokeInteractable` path and pointer capture
  are promising, but controller/hand acceptance remains dependent on the
  separate XR runtime review.

## Remaining findings

1. **P1 — Portrait composition is not yet visually polished.** The diorama and
   interactive targets are undersized and surrounded by avoidable dead space.
2. **P1 — Native-touch control coverage is incomplete.** Only the first fixture
   drag uses actual touch events; lever, cartridge, and stamp touch behavior is
   inferred from the shared pointer path.
3. **Resolved — Evidence filenames match their format.** The desktop and mobile
   JPEG captures are now named `01-desktop.jpg` and `02-mobile.jpg`.
4. **P2 — Visual evidence is limited to Stage 1.** Add a later-stage desktop or
   mobile capture showing cartridges and an operated lever if the evidence set
   is intended to demonstrate the complete control redesign.

## Verdict rationale

The desktop browser experience and existing campaign interactions pass, and the
original detached-character/meaningless-control complaint is visibly improved.
The verdict remains conditional because portrait presentation is still below a
polished bar and native touch does not yet directly cover the lever and other
critical controls. Controller and articulated-hand claims are outside this
browser certification and must remain open until XR QA passes.
