# Questions for the team

These questions are ordered by leverage. Answer the **concept-lock questions**
before choosing a game. Short, concrete answers are better than aspirational
ones. Record settled answers in `DECISIONS.md` instead of silently changing
them later.

## Concept lock: answer before scoring ideas

1. **Who is the demo for, and what does the judging rubric actually reward?**
   Name the audience and rank the likely criteria: fun, technical ambition,
   originality, polish, use of WebXR, or business potential.
2. **What should a judge say in one sentence after playing?** Avoid feature
   lists; describe the memorable story they will retell.
3. **What is the one player verb that must feel good on a mouse, on touch, and
   with an XR controller or hand?** Examples: grab, aim, place, dodge, conduct,
   stack, or redirect.
4. **Why is this better in 3D, and what becomes uniquely delightful in VR?** If
   the answer is only "immersion," the concept is not specific enough.
5. **What is the complete 2-3 minute arc?** State the hook in the first 20
   seconds, the first success by 45 seconds, the escalation, and the ending.
6. **What can the player learn without a spoken explanation from a teammate?**
   Assume the judge opens the link alone and skips written instructions.
7. **What is the smallest version that still has a beginning, a meaningful
   choice or skill test, feedback, and an ending?** This is the scope floor.
8. **What are we explicitly not building?** Name at least three tempting
   exclusions, such as multiplayer, procedural worlds, accounts, a level
   editor, physics-heavy simulation, or custom hand gestures.

Do not select a concept until every candidate can answer questions 3-7 in one
or two sentences each.

## Player experience

9. What emotion should dominate each beat: curiosity, mastery, comedy, tension,
   surprise, competition, or calm?
10. What changes between the player's first and fifth repetition of the core
    verb: speed, precision, risk, combinations, spatial reasoning, or strategy?
11. What creates agency rather than a passive spectacle? What meaningful choice
    can the player make at least twice during the demo?
12. What are the win, fail, partial-success, retry, and replay reasons?
13. Can failure be understood in under two seconds, and can the player retry in
    one action without reloading the page?
14. What moment is the screenshot, GIF, or audience-reaction moment?
15. Is the experience single-player, local pass-and-play, asynchronous, or
    real-time multiplayer? What evidence justifies paying the multiplayer tax?

## Cross-platform interaction contract

16. Is the product browser-first with an enhanced VR mode, VR-first with a
    complete browser adaptation, or deliberately equal? What may differ without
    changing the core fantasy or outcome?
17. Can every required action be expressed with pointer movement plus one
    primary action? If not, what is the simplest input vocabulary that works on
    touch and XR?
18. Does the game require movement through the world? Could the world, targets,
    or tools move around a mostly stationary player instead?
19. If locomotion is required, what is the comfort baseline: room-scale,
    teleport, snap turn, smooth movement, seated, standing, or selectable?
20. Are XR controllers the baseline? Is hand tracking required, optional, or a
    stretch goal? Which exact hardware can the team test?
21. What happens when XR is unavailable, permission is denied, a controller is
    lost, orientation changes, or the browser tab loses focus?
22. What must be equally understandable across desktop, mobile, and VR even if
    the gestures differ: goals, feedback, score, progress, and recovery?

## Scope, content, and production

23. How many focused team-hours remain after setup, integration, testing,
    evidence capture, deployment, and submission work are reserved?
24. Who owns design, gameplay, 3D/art, audio, UI, integration, device testing,
    and the final demo? Where is the single point of failure?
25. Which assets already exist or can be made in under an hour? Which critical
    asset depends on an uncertain license, generator, contractor, or teammate?
26. What is the content budget: number of environments, interactable types,
    rounds, effects, sounds, tutorial steps, and UI screens?
27. What is the cut ladder, in order: cosmetic polish, optional content,
    secondary mechanic, alternate input, and anything else? What must never be
    cut because it is the core promise?
28. Which assumption deserves a 30-minute technical or paper prototype before
    the concept is approved?

## Delivery and demo operations

29. What is the exact deadline, timezone, submission format, maximum demo
    length, and judging setup?
30. Which repository, GitHub Pages URL, base path, and public asset licenses are
    required?
31. Which desktop browser, phone/browser combination, and physical headset are
    the release gates? Who owns each device run?
32. Will the venue network be reliable? Can the complete critical path work
    after initial load without accounts, APIs, or live services?
33. What is the presenter script, and what can the presenter do if XR entry,
    audio, tracking, or the network fails?
34. What is the last responsible moment for concept lock, feature freeze,
    content freeze, deployment rehearsal, and final device testing?

## Non-negotiable quality choices

35. Which accessibility needs are baseline for this team: readable scale and
    contrast, non-color cues, captions, one-handed play, seated mode, reduced
    motion, handedness, or audio-independent feedback?
36. What performance failure is unacceptable: slow first load, frame drops
    during the hero moment, interaction latency, thermal slowdown, or memory
    growth across retries?
37. What telemetry can be visible in development without collecting player
    data: mode, frame rate, current state, score, and last input?
38. What would make us kill or radically simplify the chosen concept after the
    first graybox playtest?

## Recommended next meeting output

End the first design meeting with exactly these artifacts:

- one selected concept and one backup concept;
- a one-sentence player promise;
- a 180-second demo beat sheet;
- one core verb and its desktop, touch, and XR mappings;
- a smallest complete game, a cut ladder, and one stretch feature;
- named owners for the riskiest prototype and each release-gate device;
- dated concept-lock, feature-freeze, and final-rehearsal checkpoints.
