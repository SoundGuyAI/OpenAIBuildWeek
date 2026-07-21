# Scenery and hand-interaction evidence

Status: approved with documented device/polish follow-ups

This folder contains the fresh evidence for `fix/scenery-hand-interactions`.

## Captures

- `01-desktop.jpg` — 1280×720 desktop composition after the scenery/model fix.
- `02-mobile.jpg` — 390×844 portrait composition and reachable touch UI.
- `03-iwer.png` — Meta Quest 3 IWER mixed-reality session smoke capture, when
  present; see `xr-qa.md` for exactly what it does and does not certify.
- `04-iwer-controller-lever.png` — post-baseline IWER state after exact car snap,
  exclusive two-controller lever ownership, threshold pull, and release.
- `05-vehicles-restored.png` — rebuilt Training Yard with the blue service car
  and white district SUV visibly rendered after the vehicle-material repair.
- `06-building-colors-restored.png` — rebuilt Training Yard with teal, coral,
  yellow, and blue city-model identities restored alongside visible vehicles.

## Independent reports

- `browser-qa.md` — desktop/mobile visual, console, request, and E2E review.
- `xr-qa.md` — controller/hand input architecture and IWER runtime review.
- `review.md` — final independent code and evidence review.

## Automated verification

Run from the repository root:

```text
npm run typecheck
npm run test:model
npm run build
npm run test:e2e:run
```

The latest integrated pass completed with 24/24 model tests, a successful production
build, and 6/6 applicable Playwright campaign tests (the other 6 scenarios are
intentional capability skips). The browser run covered the complete desktop
campaign, repeated lever/stamp/rule operation, and native touch on the first
mobile prop without page, request, or HTTP errors.

## Acceptance mapping

- Character/model coherence: authored Quaternius Dino parts are used as one
  animated assembly; procedural eyes and the floating procedural hat are gone.
- Scenery coherence: shipped Quaternius/Kenney models replace ambiguous props;
  authored materials are preserved and remaining primitives are structural.
- Vehicle visibility: Quaternius vehicle clones narrowly repair the source
  files' zero-alpha masked materials; the car and SUV are visibly restored in
  `05-vehicles-restored.png` without changing other imported transparency.
- Building color: city-model texture maps and geometry remain authored, while
  semantic tints restore the hospital/flat/house/shop palette visible in
  `06-building-colors-restored.png`.
- Manipulation: props, fixtures, cartridges, lever, and stamp register both
  `RayInteractable` and `PokeInteractable`; screen, controller-ray, and direct
  touch samples share constrained ownership/release logic.
- Lever: a larger dedicated invisible target, mechanical fixture details, and
  focused model tests improve acquisition without covering neighboring tools.
- XR controller: IWER successfully entered a Meta Quest 3 session, confirmed
  placement, snapped the car to its exact target, rejected a competing left
  controller while the right controller owned the lever, preserved capture
  outside the collider, and advanced exactly once after threshold/release. The
  browser warn/error query was empty.
- XR hands: IWER hand pinch and fingertip-poke attempts did not produce an
  actionable pointer under the pinned 0.4.2 gamepad-backed input gate. The live
  entities expose both `RayInteractable` and `PokeInteractable`; physical-hand
  behavior remains an explicitly unclaimed headset follow-up.
