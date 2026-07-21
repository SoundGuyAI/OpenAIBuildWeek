# XR/MR QA: Kaiju QA playtest remediation

Branch: `feature/kaiju-qa`

Review date: 2026-07-21 UTC

Runtime: IWSDK `0.4.2`, Quest 3 IWER

Verdict: **IWER PASS / PHYSICAL DEVICE PENDING**

## What was verified

The final remediation was exercised in an `immersive-ar` session with anchors,
hit testing, and plane detection enabled.

- A steep/wall surface produced the authored red invalid reticle.
- A horizontal surface produced the authored cyan valid reticle.
- The workbench could be placed and anchored on the valid surface.
- The desktop FLUX laboratory backdrop was not rendered in MR.
- Controller hold/move/release placed the first gameplay prop.
- An in-world card could be grabbed and moved while its target connector updated.
- Exit returned one desktop workbench and one placement reticle.
- Re-entry restored one MR workbench, preserved campaign state, and did not
  duplicate the gameplay root or interaction entities.

The earlier tactile-controller campaign pass remains applicable to the same
shared IWSDK interaction entities: Quest-controller rays moved props and rule
cartridges, pulled the test lever, pressed the release stamp, completed the
Training Yard, and remained functional after exit/re-entry.

## Evidence

![Confirmed MR workbench](./03-vr.webp)

`03-vr.webp` shows the confirmed MR workbench state after placement. IWER uses a
neutral room proxy rather than a real camera feed; the important assertion is
that the desktop laboratory backdrop is absent and the game is composited in an
`immersive-ar` session.

| Artifact | Proof |
| --- | --- |
| `06-mr-placement-invalid.webp` | Red invalid ring on a steep surface |
| `07-mr-placement-valid.webp` | Cyan valid ring on a horizontal surface |
| `08-mr-card-drag.webp` | Controller ray dragging a card with its live connector |
| `09-mr-controller-drag.webp` | Controller-driven gameplay manipulation after placement |
| `10-mr-reentry.webp` | Re-entry with one persistent workbench and preserved state |

## Placement and fallback behavior

- The primary path uses hit-test/plane results and accepts only sufficiently
  horizontal surfaces.
- Anchored placement can be detached for repositioning or XR exit.
- If hit testing, plane detection, anchoring, or alpha passthrough is unavailable,
  the experience keeps a readable manual fallback in front of the player with
  translation, height, and yaw adjustment.
- If the runtime reports an opaque blend mode, the safe fallback retains a
  background instead of rendering unreadable dark-on-dark content.
- Local drag planes are transformed through the placed workbench rotation, so
  prop/card movement remains correct after placement and yaw adjustment.

## Lifecycle observations

- Session offer policy is `once`, preventing repeated automatic launch prompts.
- The explicit MR launcher is serialized so one user action creates one session.
- Campaign data lives outside the transient XR root and survives exit/re-entry.
- Repositioning and exit detach the anchor before restoring desktop transforms.
- The `viewer` reference-space fallback was removed; placement uses supported
  floor/local spaces and the manual fallback when required.

## Boundaries

This is emulator/runtime certification, not a physical Quest 3 pass. Real
passthrough video, optics, reach, tracking loss, controller ergonomics, haptics,
thermal behavior, and comfort still require an on-device session.
