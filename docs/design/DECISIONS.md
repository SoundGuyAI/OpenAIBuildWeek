# Design and architecture decisions

Append decisions; do not rewrite history. Superseded decisions remain with a
link to the replacement.

## 2026-07-19 — Browser-first WebXR foundation

- **Decision:** Use IWSDK 0.4.2, TypeScript, Vite, VR session mode, locomotion,
  grabbing, and the Quest 3 emulator. Keep physics off initially.
- **Reason:** This is the official current generator output and gives the team a
  fast path to desktop/mobile, IWER testing, and real WebXR.
- **Consequence:** Features must be tested in desktop, mobile, and VR modes.

## 2026-07-19 — Feature branches carry plans and evidence

- **Decision:** Every feature uses `feature/<slug>` with matching `plans/<slug>`
  and `evidence/<slug>` folders.
- **Reason:** Hackathon speed benefits from clear ownership and reviewable proof.
- **Consequence:** No feature is merged without its plan, automated checks, and
  relevant browser/XR evidence.

## 2026-07-19 - Select and scope around a 180-second player arc

- **Decision:** Evaluate concepts and features against a cold-start 2-3 minute
  experience: meaningful interaction within 20 seconds, first success within 45
  seconds, one escalation, a clear result, and an immediate replay path.
- **Reason:** A short judged demo needs a complete and legible player story more
  than broad content or disconnected technical features.
- **Consequence:** Concept selection uses hard feasibility gates, weighted
  scoring, a risk prototype, a smallest-complete-game definition, and an ordered
  cut ladder. Features that do not strengthen the arc or remove a demonstrated
  blocker should not enter the feature-freeze scope.
