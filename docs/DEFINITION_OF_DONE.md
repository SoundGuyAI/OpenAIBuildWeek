# Definition of Done

A feature may merge only when every applicable item below is complete. Mark an
item not applicable only with a short reason in the feature evidence. "It works
on my machine" and "the code compiles" are not completion evidence.

## 1. Player outcome and scope

- Acceptance criteria describe observable player behavior, not implementation
  tasks, and map to the current design pillar or a demonstrated blocker.
- The feature has one primary player outcome and does not quietly introduce an
  unapproved mechanic, platform promise, service dependency, or content scope.
- A cold player can understand any new goal, affordance, or feedback without a
  teammate narrating it.
- Success, invalid action, failure, retry, and interruption behavior are defined
  wherever the feature can enter those states.
- The feature still works when optional polish or stretch content is absent.
- Any change to concept, pillars, rules, platform support, scope floor, or cut
  ladder is recorded append-only in `docs/design/DECISIONS.md`.

## 2. Cross-platform experience

- Desktop, mobile/touch, and VR preserve the same player fantasy, rules, goal,
  essential feedback, and result; intentional mode differences are documented.
- All required actions have tested mappings for the feature's release-gate
  inputs. No mode depends on hover, precision, multi-touch, two hands, or a
  keyboard without an intentional supported alternative.
- On-screen prompts show the active input vocabulary and do not expose controls
  from another mode.
- Touch targets, safe areas, orientation behavior, pointer lock, focus changes,
  XR entry/exit, controller loss, and recenter/reset behavior are handled when
  relevant.
- If the feature affects movement, camera, scale, acceleration, or world motion,
  its seated/standing and comfort behavior is explicitly tested.
- The feature can be reset or replayed without a page refresh unless the design
  documents a strong reason otherwise.

## 3. Demo-arc fit

- The feature has a named place in the 180-second beat sheet or is required to
  make that beat reliable.
- It does not delay meaningful interaction beyond 20 seconds or first success
  beyond 45 seconds without an approved design decision.
- New tutorial text, steps, and waiting time have been measured in a cold run.
- The feature's state and outcome are legible to both the player and a spectator
  watching a mirrored screen or recording.
- A missed action cannot silently stall the demo; the player receives a cue,
  recovery path, or quick retry.

## 4. Engineering and asset health

- IWSDK/ECS conventions in `AGENTS.md` are followed.
- `npm run typecheck` passes.
- `npm run build` passes without unexpected warnings.
- `npm run test:e2e:run` passes after the production build.
- Automated tests cover the highest-risk rule, state transition, or regression
  at the appropriate level; visual-only checks are not the sole proof of rules.
- No new browser console errors, uncaught page errors, failed critical requests,
  or unhandled promise rejections occur during the tested path.
- Loading, repeated retry, pause/resume, tab hide/show, and XR enter/exit do not
  duplicate entities, listeners, audio, timers, or persistent state.
- Hot loops avoid unnecessary allocations; shared GPU resources are reused and
  permanently removed resources are disposed.
- Critical assets are licensed, attributed when required, compressed, and load
  correctly from the GitHub Pages base path with case-sensitive URLs.
- The critical path has a documented degradation or recovery plan for any
  network, API, account, or live-service dependency.

## 5. Experience quality

- The core action has clear availability/hover, commit, success, and invalid or
  failure feedback using more than one channel when practical.
- Text is readable at the intended desktop, phone, and XR distances; contrast,
  focus, labels, and touch targets are reasonable.
- Essential information is not communicated by color alone or audio alone.
- Motion and locomotion are comfortable for the declared stance and turn mode,
  with the documented reduced-motion or comfort path available.
- Audio starts only after an allowed user gesture, uses appropriate levels, does
  not stack across retries, and has a visual equivalent for essential cues.
- The feature does not obscure the goal, score, progress, or recovery prompt at
  the moment the player needs it.
- Performance is observed during the feature's busiest moment on the weakest
  available release-gate device; material regressions are fixed or documented
  with an approved scope decision.

## 6. Verification and evidence

- `plans/<slug>/PLAN.md` contains the request, assumptions, observable acceptance
  criteria, risk notes, and a desktop/mobile/VR test matrix.
- `evidence/<slug>/README.md` records commit/build, date, tester, device, OS,
  browser, input mode, exact steps, expected result, actual result, and known
  limitations.
- Every acceptance criterion links to automated output or concise manual proof.
- Required screenshots or short recordings are legible, show the player-visible
  outcome, and follow the repository naming convention.
- Browser E2E covers the critical happy path and one valuable recovery or retry
  path. The production build, not only the dev server, is exercised.
- XR-affecting changes are tested in the available emulator/runtime and on the
  physical release-gate headset when hardware is available.
- Mobile-affecting changes are tested at a real touch viewport and on the
  release-gate phone/browser before release.
- An independent reviewer checks the implementation against the plan, this
  Definition of Done, and the current design documents; blocking findings are
  resolved or explicitly accepted by the human owner.
- The append-only conversation log and design decisions are current.
- The PR describes player impact, risks, tests, evidence, known limitations, and
  rollback/cut options; CI is green.

## 7. Release-candidate gate

These items apply to the hosted demo as a whole at feature freeze and before the
final submission, not to every small feature branch.

- The deployed GitHub Pages URL works from a fresh browser session with no local
  dev server, cached assets, private credentials, or repository access.
- A cold run reaches meaningful interaction within 20 seconds, first success
  within 45 seconds, and a clear ending in 2-3 minutes.
- The full arc is rehearsed on the named desktop browser, phone/browser, and
  physical headset release gates, with results recorded.
- The presenter can start, enter/exit XR, reset, retry, mute, recenter, and
  recover from the known highest-risk failure without editing state or code.
- The hero moment is readable in-headset and on the mirrored/recorded view.
- The smallest complete game remains playable if every item above the protected
  core in the cut ladder is disabled or removed.
- A backup browser path and local recording/screenshots are ready for headset,
  network, tracking, or audio failure.
- Final licenses/attributions, repository documentation, submission text, and
  demo links are complete and reviewed.

## Merge rule

The human feature owner may approve a documented non-blocking limitation. A
broken player promise, unavailable critical input, failed production build,
unrecoverable demo stall, or missing required evidence is blocking and cannot be
waived implicitly.
