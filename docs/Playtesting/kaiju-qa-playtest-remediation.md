# Kaiju QA playtest remediation TODO

Source notes: `playtestNotes-thingsToFix-12-48.txt`

Visual baseline: `qa-bad1-Screenshot 2026-07-21 101119.png`

Status: complete on `feature/kaiju-qa`; publication/CI confirmation follows this checklist

## 1. Desktop composition and navigation

- [x] Make the 3D experience full-bleed across the available viewport.
- [x] Increase effective tabletop/workbench space and redistribute props so the
  scene does not leave a large unused lower region.
- [x] Prevent the right-side route results, fixture, lever, stamp, and rule
  controls from overlapping at common desktop aspect ratios.
- [x] Add desktop WASD camera movement.
- [x] Add mouse camera look/orbit without interfering with object dragging.
- [x] Keep Reset View and make it restore the authored readable framing.
- [x] Preserve responsive mobile framing and existing touch drag/no-scroll
  behavior.

## 2. Lever and physical controls

- [x] Replace the two overlapping lever-like objects with one coherent control.
- [x] Label it clearly as **RUN TESTS** in-world.
- [x] Start upright, pivot around a visible hinge toward the player, trigger at
  the end of the pull, and spring back after release.
- [x] Use the same grab/pull interaction for pointer, native touch, keyboard or
  switch access, and XR controller rays.
- [x] Keep the release/advance stamp spatially distinct from the test lever.

## 3. Rule cartridge staging

- [x] Create a separate three-slot rack for Broad, Alternate, and Targeted rule
  cartridges.
- [x] Create one clearly empty installation dock away from the rack.
- [x] Fix Stage 5 so **Freeze Near Every Structure** never overlaps **Slow in
  Tower Stripes** or the installation dock.
- [x] Preserve neutral player-owned choice and readable rule scope labels.
- [x] Ensure wrong-rule recovery remains possible without restarting a level.

## 4. Draggable popup cards and connectors

- [x] Make all in-world popup/instruction/evidence cards directly draggable.
- [x] Constrain cards to comfortable, readable movement planes in desktop and
  XR.
- [x] Give cards sensible home positions and a reset/recenter path.
- [x] Draw a readable connector line from a card to its associated target when
  one exists.
- [x] Update connector endpoints continuously while either card or target moves.
- [x] Avoid connectors obscuring gameplay objects, text, or other cards.
- [x] Preserve keyboard/switch and reduced-motion accessibility.

## 5. Passthrough MR workbench placement

- [x] Add a pre-game **Place Workbench** stage before the tutorial when entering
  XR.
- [x] Enable passthrough for the MR experience.
- [x] Let the player place, rotate, and confirm the workbench on an available
  horizontal surface.
- [x] Do not show the flat laboratory backdrop in XR/MR.
- [x] Keep the modeled workbench, game objects, cards, connectors, particles,
  and controls readable against varied real-world backgrounds.
- [x] Provide a safe fallback and clear copy when surface placement or
  passthrough is unavailable.
- [x] Preserve XR exit/re-entry without duplicating the scene or losing campaign
  progress.

## 6. Verification and evidence

- [x] Capture fresh desktop screenshots at initial load and Stage 5 using the
  zero-tab runtime.
- [x] Capture a fresh mobile screenshot and verify no-scroll touch placement.
- [x] Capture fresh XR/MR evidence showing workbench placement, no flat backdrop,
  card connectors, and controller interaction.
- [x] Run typecheck, model tests, production build, serialized desktop/mobile
  E2E, and focused camera/card/lever/rack tests.
- [x] Run Quest 3 IWER verification for placement flow, card dragging, lever
  pivot, object manipulation, exit/re-entry, and stable hierarchy.
- [x] Close every IWSDK/Playwright process and tab started by this work.
- [x] Update PR #5 with the playtest-remediation summary and evidence.
- [x] Send the requested Telegram completion notification only after all work is
  pushed and CI is green.

## Acceptance record

- TypeScript, 22 model checks, and the production build pass.
- The serialized installed-Chrome run passes six applicable desktop/mobile/MR
  fallback tests with six expected cross-project skips and no application
  console, page, request, or HTTP failures.
- Quest 3 IWER confirms `immersive-ar`, plane detection/hit testing, invalid and
  valid placement feedback, anchored workbench placement, controller object
  manipulation, draggable cards with live connectors, and clean exit/re-entry.
- `evidence/kaiju-qa/` now contains fresh initial, Stage 5, mobile, campaign,
  placement, controller, card-drag, and re-entry captures from this remediation.
