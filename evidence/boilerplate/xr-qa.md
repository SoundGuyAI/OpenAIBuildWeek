# XR QA post-merge evidence-gap audit: boilerplate

Branch: `chore/boilerplate-post-merge-review`  
Deployed base commit: `be6dd7136a91d4062ba59c3e0d4c838b1bf21804`  
Audit date: 2026-07-20  
Status: **Fail — required successful-session XR evidence was not run**

## Scope and constraint

This is a post-merge evidence-gap audit, not an XR runtime test. Per the user
constraint, no local browser, IWSDK runtime, IWER session, WebXR session, or
physical headset was started or observed. No emulator/headset model, XR browser
version, runtime version, or live input mode is available to report.

The audit reviewed the plan, XR QA role, Definition of Done, XR support and scene
source, deterministic Playwright coverage, existing evidence, and GitHub Actions
run `29748804444`. Static implementation paths are not credited as observed XR
behavior.

## Result matrix

| Area | Expected evidence | Evidence available | Result |
| --- | --- | --- | --- |
| Unsupported WebXR — desktop | A non-XR player remains in the browser, the Enter VR control becomes unavailable, and desktop/touch fallback guidance is announced | Deterministic Playwright test passed in the Desktop Chrome project in run `29748804444` | **Pass** |
| Unsupported WebXR — mobile | The same unavailable state and fallback guidance work at the mobile profile | Deterministic Playwright test passed in the Pixel 7 project in run `29748804444` | **Pass** |
| Denied XR request — desktop | A rejected `requestSession` produces a visible, enabled Retry VR control and permission guidance | Deterministic Playwright test passed in the Desktop Chrome project in run `29748804444` | **Pass** |
| Denied XR request — mobile | The same retryable denied-request state works at the mobile profile | Deterministic Playwright test passed in the Pixel 7 project in run `29748804444` | **Pass** |
| Successful XR session setup | `requestSession`, renderer session setup, active-state UI, and first immersive frame complete successfully | No successful WebXR session was requested or observed | **Not run** |
| Reference space, pose, origin, and scale | The resolved reference space is usable; headset pose is stable; floor height, player origin, letter distance, and world scale are correct | No IWER or headset observation | **Not run** |
| Left and right controllers | Both controllers track and expose the intended ray/grip interactions | No controller input was connected or observed | **Not run** |
| Hands | Hand tracking initializes and applicable hand interactions work without blocking controller use | No hand-tracking session was connected or observed | **Not run** |
| Locomotion | The player can move over the locomotion floor, respects usable boundaries, and does not fall, jump, or drift unexpectedly | No immersive locomotion test | **Not run** |
| Grabbing | Interactable letters can be targeted, grabbed, moved, released, and re-grabbed with the intended inputs | No immersive interaction test | **Not run** |
| XR pointer/UI reachability | Enter/exit state and any applicable in-session UI remain readable and reachable | No immersive UI test | **Not run** |
| Exit and re-entry | Exiting restores non-immersive state and camera/UI correctly; re-entry succeeds without duplicated state, entities, listeners, or inputs | No session lifecycle test | **Not run** |
| Comfort | Scale, standing/seated behavior, locomotion, floating motion, frame stability, and repeated interaction are comfortable | No sustained IWER or headset run | **Not run** |
| Console, network, and ECS inspection during XR | No new XR-path console/page/network failures occur, and scene/ECS state remains coherent through entry, interaction, exit, and re-entry | No runtime diagnostics were collected | **Not run** |
| Physical release-gate headset | The complete XR path works on the named headset/browser with controller and, where supported, hand input | No physical headset evidence is available | **Not run** |
| XR evidence gate | Applicable successful-session and physical-device behaviors have durable evidence | Only deterministic unsupported and denied-request browser coverage is available | **Fail** |

The failed gate records missing required evidence; it does not assert that an XR
runtime defect was observed.

## What run 29748804444 proves

GitHub Actions run `29748804444`, validation job `88373560719`, completed
successfully against merged `main` commit
`be6dd7136a91d4062ba59c3e0d4c838b1bf21804`. The desktop and mobile Chromium
projects executed deterministic tests that replace `navigator.xr` with test
doubles for two cases:

1. `isSessionSupported()` resolves `false`.
2. `requestSession()` rejects with `NotAllowedError`.

Those tests prove the visible unsupported fallback and retryable denied-request
UI states on the two configured browser profiles. They do not create an XR
session, attach a renderer to a session, resolve a real reference space, provide
tracked input, render an immersive frame, or exercise session exit/re-entry.

## Required future IWER test

An IWER tester must use the exact release candidate under test and must first
check for and reuse any existing IWSDK runtime/dev server rather than starting a
duplicate. Record the commit, URL, OS, browser version, IWSDK/IWER version,
emulated headset profile, reference-space mode, and enabled input modes.

1. Load the page and record initial console, page, and critical network state.
2. Enter immersive VR and confirm the first immersive frame appears without an
   exception or stuck launching state.
3. Confirm headset pose and recenter behavior. Verify that the grid/floor is at
   the expected floor height, the player origin is sensible, and `HELLO WORLD`
   has a comfortable readable size and distance.
4. Exercise left and right controllers independently: tracking, rays, grip or
   grab input, release, and loss/recovery if IWER supports it.
5. Enable and exercise both hands if the emulated profile supports hand
   tracking; record unsupported hand behavior separately rather than treating
   it as controller evidence.
6. Move forward, backward, and laterally across the locomotion surface. Check
   boundaries, height, drift, unexpected acceleration, and recovery/reset.
7. Target, grab, move, release, and re-grab at least two different letters,
   using both sides where supported. Confirm the letters remain visible and no
   duplicate interaction or stuck-grab state appears.
8. Pause and resume the floating motion and verify readability and comfort both
   ways.
9. Exit XR. Confirm the browser camera, Enter VR control, status message, and
   desktop state recover. Re-enter XR and repeat locomotion plus one grab.
10. Inspect console/page/network output and scene/ECS state after re-entry for
    duplicate entities, listeners, sessions, controllers, or errors.
11. Remain in the scene for at least two minutes and record frame instability,
    scale discomfort, motion discomfort, reach strain, or disorientation.

## Required future physical-headset test

Repeat the successful-session procedure on the named release-gate headset using
its production WebXR browser and the deployed HTTPS URL. Record headset model,
OS/runtime version, browser version, guardian/room setup, standing or seated
stance, controller models, hand-tracking availability, and tester. At minimum,
verify entry, scale/origin, both controllers, hands when supported, locomotion,
grabbing, reset/recenter, exit, re-entry, and a two-to-three-minute comfort run.

## Artifacts to capture

- Update this matrix with expected versus actually observed behavior, tester,
  device/runtime details, exact steps, and defects.
- `03-vr.webp`: legible IWER immersive view showing `HELLO WORLD`, floor/world
  scale, and tracked controller or hand state.
- `04-headset.webp`: physical-headset or mirrored-view evidence from the
  release-gate device showing the successful immersive scene and input state.
- `05-exit-reentry.webm`: short recording of initial entry, one locomotion
  action, one grab/release, exit, re-entry, and another interaction. If video
  capture is unavailable, provide numbered before/after screenshots and a
  timestamped step log instead.
- Console/page/network log or trace covering entry through re-entry, with any
  warnings and failures called out rather than omitted.
- A defect note for every failed step, including reproduction steps, expected
  versus observed behavior, device/runtime details, and supporting media.

Until those observations and artifacts exist, successful XR operation, comfort,
and physical-headset readiness remain unverified.
