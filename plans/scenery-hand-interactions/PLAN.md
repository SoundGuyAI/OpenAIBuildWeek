# Feature plan: scenery-hand-interactions

Branch: `fix/scenery-hand-interactions`
Created: 2026-07-21
Status: complete — approved with documented device/polish follow-ups

## Player outcome

Kaiju QA reads as one intentional miniature world: the kaiju, helmet, eyes,
buildings, props, and controls stay physically coherent, while controller and
articulated-hand input can reliably grab and operate every gameplay control.

## Source prompt

`docs/conversation/2026-07-20-kaiju-qa.md`, entry “scenery coherence and
hand-interaction remediation”.

## Acceptance criteria

- [x] Kaiju body, eyes, helmet, and animation remain visually attached at rest
  and throughout authored motion.
- [x] Scenery uses the shipped Quaternius/Kenney models where they improve
  silhouette and meaning; remaining primitives are intentional support geometry.
- [x] Buildings, roads, lab controls, fixtures, and cards are grounded without
  obvious hovering, clipping, or contradictory scale.
- [x] Lever, cartridges, fixtures, stamp, buttons, and draggable cards accept
  mouse/touch, controller ray, and articulated-hand/pinch interaction through
  the IWSDK interaction path.
- [x] Lever interaction has a forgiving collider and stable grab ownership.
- [x] Desktop and mobile campaign behavior remains unchanged.
- [x] Typecheck, model tests, build, browser E2E, visual review, and XR review are
  recorded. Physical-headset verification remains a documented device-only gap.

## Non-goals

- Replacing the deterministic campaign model or tutorial progression.
- Adding physics simulation, a new asset pack, or a second input system.
- Changing the established narration or core game rules.

## Architecture and API choices

- Preserve IWSDK `RayInteractable`/shared input instead of adding a custom raycaster.
- Keep imported models under stable transform roots so authored animation moves
  whole assemblies rather than individual decorative children.
- Prefer existing optimized GLBs and shared materials/geometries.
- Add narrow pure helpers/tests where input eligibility or transform math can be
  separated from the browser/XR runtime.

## Work breakdown

| Task | Owner/agent | Write scope | Depends on | Done when |
| --- | --- | --- | --- | --- |
| Visual/asset audit | Visual specialist | `plans/scenery-hand-interactions/agent-notes/visual-audit.md` | Logged prompt | Concrete transform/asset findings ranked |
| XR interaction audit | IWSDK specialist | `plans/scenery-hand-interactions/agent-notes/xr-audit.md` | Logged prompt | Hand/controller event and collider gaps identified |
| Scene remediation | Orchestrator | `src/kaiju-qa/scene.ts`, `src/kaiju-qa/assets.ts` | Audits | Coherent models and grounded composition |
| Control remediation | Interaction implementer | `src/kaiju-qa/control-fixtures.ts`, owned model test | XR audit | Lever geometry/interaction support is robust |
| Integration and shared input | Orchestrator | `src/index.ts`, shared tests/config | Scene and control work | All interactive entities accept shared input |
| Browser QA | Independent QA | browser report/evidence only | Integrated build | Desktop/mobile tests and screenshots pass |
| XR/review | Independent reviewer | XR/review reports only | Integrated build | Hand/controller checklist independently reviewed |

## Test matrix

| Surface | Scenario | Expected result | Evidence |
| --- | --- | --- | --- |
| Desktop | Complete interactions and inspect animation | Attached character parts, grounded scene, reliable controls | Browser report + screenshot |
| Mobile | Drag fixture/cartridge and operate lever | Touch remains direct and page does not scroll | Browser report + screenshot |
| VR/IWER | Pinch/ray grab lever, cards, fixtures, cartridges, stamp | One grab owner, forgiving targets, correct release | XR report + screenshot |

## Risks and rollback

- Imported model pivots vary; wrap GLBs in authored transform groups rather than
  altering shared loader state.
- Broader hit targets must not cover adjacent controls; use dedicated invisible
  interaction geometry scoped to each entity.
- If articulated-hand synthesis is unavailable locally, record the runtime gap
  and verify the same IWSDK select/grab path plus controller IWER evidence.

## Review checklist

- [x] Typecheck
- [x] Model tests
- [x] Production build
- [x] Browser E2E
- [x] IWER runtime/session and interactable-registration smoke test
- [x] Evidence manifest complete
- [x] Independent re-review complete
