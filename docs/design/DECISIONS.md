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

## 2026-07-20 — Select Kaiju QA and protect the evidence loop

- **Decision:** Implement Kaiju QA as the Education-track game: record a partial
  baseline, add a fragile-tower edge case, expose an ambulance regression from
  an over-broad guardrail, then require a targeted rule and a current 3/3 suite
  before a separate Release action unlocks.
- **Reason:** The concept worktree ranked it highest for immediate judge
  comprehension, a memorable regression image, practical learning transfer,
  and deterministic delivery. Guided instruction must end before the player's
  final diagnosis so completion demonstrates a decision rather than tutorial
  obedience.
- **Consequence:** The protected core uses original primitive geometry,
  authored outcomes, persistent evidence, no physics or live model call, and a
  complete desktop/mobile path. The existing XR entry architecture is preserved,
  but IWSDK/IWER/headset runtime certification is deferred until the project
  owner approves running it on suitable hardware.

## 2026-07-20 — Replace the dashboard prototype with a tactile campaign

- **Supersedes:** The primitive-art, dashboard-control, single-level, and
  runtime-deferral consequences of “Select Kaiju QA and protect the evidence
  loop.” The educational state model and evidence gate remain protected.
- **Decision:** Make grab, move, place, pull, and press the primary verbs on
  desktop, touch, and XR. Teach them through a nine-stage world-space tutorial,
  then transfer the evidence loop across School Crossing, Harbor Load, and
  Storm Shift. Use documented Quaternius/Kenney assets, authored lighting and
  animation, a supporting FLUX backdrop, and offline Kokoro narration.
- **Reason:** The owner’s runtime review found the flat primitive scene,
  desktop buttons, detached guide, and single short loop below the concept-art
  quality bar and unsuitable for a convincing XR educational game.
- **Consequence:** DOM controls are secondary utilities only. Every gameplay
  action must work through IWSDK interaction entities; browser tests must send
  real pointer/touch events; IWER controller testing is approved and required;
  imported/generated media must retain source, license, prompt, and generation
  provenance.

## 2026-07-20 — Use the canonical IWSDK 0.4.2 ray-interaction component

- **Supersedes:** The repository prose and early Kaiju SDK note that require the
  deprecated `Interactable` alias spelling.
- **Decision:** Kaiju QA uses `RayInteractable` for SDK-owned hit targeting and
  pointer/controller event delivery. Screen-pointer ray math is limited to
  moving an already captured object on its drag plane; it never performs scene
  target discovery.
- **Reason:** The installed pinned SDK declaration marks `Interactable` as a
  deprecated alias and explicitly directs consumers to `RayInteractable`.
- **Consequence:** Review should evaluate behavior against the canonical 0.4.2
  component contract. A future repository-wide documentation cleanup can
  replace stale alias guidance independently of this feature branch.
