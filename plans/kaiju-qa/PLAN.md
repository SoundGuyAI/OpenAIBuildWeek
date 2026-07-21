# Feature plan: kaiju-qa

Branch: `feature/kaiju-qa`
Created: 2026-07-20T21:49:25.986Z
Status: playtest remediation complete locally; publication and clean PR CI pending

## Player promise

A first-time learner can understand Kaiju QA without presenter narration,
complete a nine-action tactile tutorial, and then transfer the evidence-driven
loop across three new districts. Desktop, touch, and XR use the same verbs:
grab, move, place, pull, and press.

## Sources and decisions

- Exact requests and follow-ups: `docs/conversation/2026-07-20-kaiju-qa.md`
- Concept reference:
  `C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/`
- Asset provenance: `docs/assets/KAIJU_QA_ASSETS.md`
- Audio provenance: `docs/assets/AUDIO_CREDITS.md`
- The owner's redesign request supersedes the original dashboard/button plan.
- Local IWSDK, browser, touch, and IWER testing are now approved.

## Learning spine

1. **Stage** the current case in the world.
2. **Run** the current behavior before changing it.
3. **Observe** persistent scenario evidence.
4. **Change** one explicit rule.
5. **Regress** every earlier pass as well as the new edge case.
6. **Release** only while one current targeted-rule run passes every scenario.

The tutorial deliberately demonstrates an over-broad rule and its regression.
Later districts preserve the loop while changing the fixture, hazard, rule
language, environment, and scenery.

## Acceptance criteria

- [x] The primary game is direct 3D manipulation, not desktop-only gameplay
  buttons or menus.
- [x] Desktop mouse, mobile touch, and XR rays feed the same interaction entities
  and game intents.
- [x] Invalid drops animate back home and never corrupt campaign state.
- [x] Training Yard teaches nine single-action stages with a world-space pop-up,
  animated arrow, source highlight, destination socket, narration, and captions.
- [x] The baseline, edge-case failure, broad-rule regression, targeted repair,
  fresh full-suite pass, and release gate are visible and deterministic.
- [x] School Crossing, Harbor Load, and Storm Shift provide three distinct
  transfer levels with their own fixtures, scenarios, rules, and scenery.
- [x] A wrong broad or alternate rule produces a recoverable regression; the
  player can replace it without replaying the campaign.
- [x] A release press is rejected until all required evidence is fresh and
  passing under the targeted rule.
- [x] Essential status uses words, icons/shapes, motion, and color rather than
  color alone.
- [x] Reduced motion removes nonessential choreography without hiding causality.
- [x] Offline Kokoro narration has synchronized captions, mute, replay, autoplay
  unlock, and visibility pause.
- [x] The hero and environment use documented Quaternius/Kenney assets, authored
  lighting and shadows, animation, particles, and a documented FLUX backdrop.
- [x] The critical campaign is local, deterministic, static-host compatible,
  and independent of physics, accounts, backends, or runtime model calls.
- [x] Focused browser/touch interaction, IWER controller verification, evidence
  capture, and independent review are complete; the clean full E2E reporter is
  an explicit PR CI merge gate.
- [x] Desktop is full-bleed with WASD, right-drag camera movement, and Reset View
  without stealing direct-manipulation input.
- [x] The RUN TESTS control is one upright hinged lever, all three rule
  cartridges have separate rack slots, and the installation dock is distinct.
- [x] Instruction/evidence/release/result cards are draggable and maintain live
  target connectors on desktop and in XR.
- [x] MR uses `immersive-ar`, horizontal-surface placement, anchoring, manual
  fallback controls, no desktop backdrop, and campaign-preserving re-entry.

## Non-goals

- Live GPT inference, free-form prompting, networking, accounts, or telemetry.
- Combat, destruction, physics simulation, locomotion, or room-scale reach.
- A progression economy, leaderboard, punitive fail screen, or hidden scoring.
- Marketing physical-headset comfort/performance as certified from IWER alone.

## Architecture

- `src/kaiju-qa/game-model.ts` is the pure reducer and campaign source of truth.
- `src/kaiju-qa/scene.ts` creates the IWSDK world, interaction proxies,
  animation, level dressing, tutorial guidance, evidence board, and debug target
  projection.
- `src/kaiju-qa/assets.ts` and `public/assets/kaiju-qa/` provide documented local
  GLB/texture assets with no runtime CDN dependency.
- `src/kaiju-qa/narration.ts` and `narration-manifest.ts` provide offline audio
  playback and captions from `public/audio/narration/`.
- `src/index.ts` integrates the reducer, scene, accessibility utilities,
  narration, responsive camera, and IWSDK XR lifecycle.
- IWSDK `RayInteractable` owns screen, touch, and XR target discovery and event
  delivery. Screen drag math derives a camera ray only after capture to move the
  active object on its drag plane; XR uses the controller ray supplied by IWSDK.
- Rendering and audio respond to accepted reducer transitions; neither can
  mutate pass/fail or release eligibility.

## Test matrix

| Surface | Required behavior | Durable proof |
| --- | --- | --- |
| Pure model | Four districts, nine-stage tutorial, regressions, stale evidence, recovery, gates, reset, immutability | `tests/model/kaiju-qa-model.test.mjs` |
| Desktop Chromium | Invalid drop, real canvas drag/place, lever, cartridge swap, release stamp, all four districts | Playwright + `evidence/kaiju-qa/01-desktop.webp` |
| Mobile Chromium | Native touch drag/release, no page scroll, readable scene/pop-up/caption, utility controls remain secondary | Playwright + `evidence/kaiju-qa/02-mobile.webp` |
| XR / IWER | Enter, controller-ray grab/move/release, lever, stamp, exit/re-entry, scene hierarchy | `evidence/kaiju-qa/xr-qa.md` + `03-vr.webp` when capture succeeds |
| Accessibility | Captions, mute/replay, reduced motion, focus visibility, non-color results, responsive layout | Browser QA + experience review |
| Production | Typecheck, production build, full E2E, no critical console/page/network failures | Command log in evidence manifest |

## Risks and mitigations

- **IWER is not a physical headset.** Record controller/session evidence precisely
  and retain a physical comfort/performance gap.
- **3D coordinate tests can become brittle.** Discover screen targets through the
  read-only debug projection, but execute actual pointer/touch events on canvas.
- **Large assets can hurt mobile start-up.** Keep selected GLBs compact, local,
  and documented; reuse materials/geometries and avoid hot-loop allocation.
- **Spectacle can obscure the lesson.** Protect the world-space instruction,
  arrow, evidence board, sockets, and captions before decorative particles.
- **Shared-file conflicts.** Feature logic and assets live under Kaiju-specific
  paths; shared integration changes are limited and rebased before publication.

## Completion checklist

- [x] Every user prompt and decision logged
- [x] Specialist ownership recorded with disjoint write scopes
- [x] Four-level deterministic campaign implemented
- [x] Direct manipulation implemented across pointer, touch, and XR-ray paths
- [x] CC0/generated asset and audio provenance complete
- [x] Model suite passes 22/22 across campaign and remediation helpers
- [x] Typecheck passes after final source cleanup
- [x] Production build passes on final source state
- [x] Clean serialized browser/touch E2E passes locally: 6 applicable tests passed, 6 project skips
- [x] XR report and evidence updated from the final MR placement/controller/card/lifecycle IWER run
- [x] Independent final review has no source blocking finding; clean CI remains its merge gate
- [x] Final screenshots copied to `evidence/kaiju-qa/`
- [x] Branch rebased onto the current merge base and remediation diff kept isolated to Kaiju/shared integration paths
- [x] Branch committed, pushed, and PR #5 updated through the publication workflow
- [x] Telegram completion notification sent only after the pushed PR reaches green CI
