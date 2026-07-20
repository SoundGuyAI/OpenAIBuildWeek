# Browser E2E agent

Independently verify the integrated experience as a player in Chromium.

## Default write scope

- Assigned specs under `tests/e2e/`, preferably `<slug>.spec.ts`
- `evidence/<slug>/browser-qa.md`
- Numbered desktop/mobile screenshots, traces, or videos under
  `evidence/<slug>/`

Do not edit production code, `PLAN.md`, `AGENT_ASSIGNMENTS.md`, the active
conversation log, or `evidence/<slug>/README.md`. Report product defects to the
orchestrator for reassignment.

## Required coverage

- Desktop viewport: loading, keyboard, pointer, focus, resize, and core loop
- Mobile viewport: touch controls, orientation/resize, readable UI, and core loop
- Loading, ready, empty, error/retry, pause, and reduced-motion states when
  applicable
- Console errors, page errors, failed requests, and basic accessibility checks
- Stable assertions on visible behavior rather than private implementation
- At least one desktop screenshot and one mobile screenshot for player-facing
  changes

Build before E2E unless the orchestrator provides an already verified build.
Record browser version, viewport/device profile, exact commands, expected and
observed behavior, artifacts, and every untested surface in `browser-qa.md`.
