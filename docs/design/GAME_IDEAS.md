# Game idea workshop

Use this document to generate, pressure-test, and select a concept. Keep rejected
ideas and their scores: they document tradeoffs and may donate mechanics later.
The goal is not to find the largest idea. It is to find the smallest idea with
a memorable player story and a credible path to polish.

## Hackathon design constraints

- One codebase must feel intentional on desktop, mobile, and VR.
- The player reaches a meaningful interaction within 20 seconds and a first
  success within 45 seconds, without a teammate explaining the controls.
- The complete experience has a visible beginning, escalation, and ending in
  2-3 minutes.
- One polished core verb with layered feedback beats several shallow mechanics.
- 3D and VR should change what the player perceives or does, not merely provide
  a different camera.
- The critical path should be static-host friendly and resilient to unreliable
  event Wi-Fi.
- Prefer mechanics the team can graybox and test across all target inputs on
  the first day.

## Workshop flow

### 1. Set the box - 10 minutes

Write the deadline, team-hours, available devices, asset constraints, forbidden
scope, and judging priorities at the top of the meeting notes. Agree on the
maximum number of new technical unknowns the project can carry.

### 2. Diverge alone - 10 minutes

Each person writes three idea cards without discussion:

- one idea built around the team's favorite player fantasy;
- one idea built around a spatial/XR interaction;
- one deliberately tiny idea that could be complete in a day.

Variation matters more than detail. Do not combine ideas yet.

### 3. Clarify, do not pitch - 10 minutes

Read every card. Other participants may ask factual questions but may not sell,
defend, or redesign the idea. Mark hidden assumptions and unknowns.

### 4. Apply hard gates - 10 minutes

Reject or rewrite a concept if any answer is "no" or "unknown":

- Can a new player perform the core verb within 20 seconds?
- Can that verb feel deliberate with mouse, touch, and XR input?
- Can one environment and a small reusable content set deliver the full arc?
- Can the smallest version end with a clear success, failure, or score?
- Can the riskiest interaction be grayboxed in a short prototype?
- Can the critical path run without a backend or live generative service?
- Does the team have access to every device required to validate the promise?

An "unknown" may survive only if it gets an owner, a timeboxed spike, and a
kill condition.

### 5. Score independently - 10 minutes

Each person scores the surviving concepts before discussing totals. Use whole
numbers from 1 (poor) to 5 (excellent). Multiply by the listed weight; the
maximum weighted score is 100.

| Criterion | Weight | A score of 5 means... |
| --- | ---: | --- |
| Immediate comprehension | 15 | A new player sees the goal and acts within 20 seconds. |
| Core-verb satisfaction | 15 | One action is enjoyable enough to repeat and improve. |
| Complete 180-second arc | 15 | Hook, learning, escalation, climax, and ending all fit. |
| Buildability and polish path | 20 | The team can graybox it quickly and has time to tune it. |
| Cross-platform integrity | 10 | Desktop, touch, and XR preserve the same fantasy and rules. |
| Spatial/XR payoff | 10 | Depth, scale, embodiment, or spatial input materially improves play. |
| Demo legibility and visual payoff | 10 | Spectators can read it and it produces a memorable hero moment. |
| Distinctiveness and team energy | 5 | It feels specific, and the team wants to spend the event on it. |

Calculate each row as `(score / 5) x weight`.

| Concept | Comprehension /15 | Core verb /15 | Arc /15 | Build /20 | Parity /10 | XR /10 | Demo /10 | Energy /5 | Risk penalty | Total /100 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| _Add idea_ |  |  |  |  |  |  |  |  |  |  |

Apply evidence-based risk penalties after scoring:

- `-10`: depends on real-time multiplayer, accounts, or an unproven backend;
- `-10`: the core interaction cannot be tested on available target hardware;
- `-5`: requires an unowned critical art, animation, audio, or content pipeline;
- `-5`: relies on continuous smooth locomotion without a validated comfort plan;
- `-5`: carries more than one unproven technical dependency on the critical path;
- `-5`: needs a teammate to narrate the rules for the first-time player.

Do not hide disagreement in an average. Discuss any criterion where team scores
differ by three or more points.

### 6. Pre-mortem the top two - 10 minutes

For each finalist, finish this sentence: "It is demo day and this concept failed
because..." Name the earliest signal and the feature you would cut in response.

### 7. Select with a backup - 10 minutes

Choose one concept, one backup, and one decisive prototype. Record:

- why the winner beat the runner-up;
- the biggest assumption still unproven;
- the prototype owner, deadline, pass condition, and kill condition;
- the smallest complete game and ordered cut ladder;
- the exact time when the team will keep, simplify, or replace the concept.

## Idea card template

### Working title

- **Player promise:** In one sentence, what can the player do or feel?
- **One-line pitch:** `[fantasy]` through `[core verb]` to achieve `[goal]`, with
  `[twist or escalation]`.
- **Audience and intended emotion:**
- **Core verb:**
- **Meaningful choice or skill:**
- **20-second hook:**
- **45-second first success:**
- **180-second beat sheet:**
  - `0:00-0:20` Hook and invitation:
  - `0:20-0:45` Learn and first success:
  - `0:45-1:30` Repeat with one variation:
  - `1:30-2:20` Escalation and meaningful choice:
  - `2:20-3:00` Climax, result, and replay invitation:
- **Desktop mapping:**
- **Touch mapping:**
- **XR controller/hand mapping:**
- **Why 3D matters:**
- **Why VR is better:**
- **Win, fail, retry, and score:**
- **Smallest complete game:**
- **Required content budget:**
- **Hero feedback moment:** visual, audio, motion, haptic, and UI response.
- **Biggest player-experience risk:**
- **Biggest technical or production risk:**
- **30-minute prototype:**
- **Kill condition:**
- **First cut / last cut:**
- **One stretch feature:**

## Seed territories, not commitments

- **Tiny worlds:** manipulate a living diorama to solve short spatial problems.
- **Spatial spellcraft:** combine tools, positions, and objects to cast effects.
- **Impossible workshop:** assemble strange machines from grab-and-snap parts.
- **Rhythm in space:** catch, redirect, or sculpt music as spatial objects.
- **Cozy salvage:** recover meaningful objects from a compact zero-gravity scene.
- **Creature conductor:** guide a swarm with position, color, timing, and sound.
- **Perspective trick:** align objects from one viewpoint to transform the world.
- **One-room crisis:** use a few tactile controls to manage an escalating system.

Add at least three territories drawn from the team's own obsessions before
scoring. A concept with slightly lower numbers may win if its prototype produces
clear delight, but record that judgment explicitly in `DECISIONS.md`.
