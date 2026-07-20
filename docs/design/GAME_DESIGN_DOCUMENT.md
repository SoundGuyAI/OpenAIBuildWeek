# Game design document

Status: discovery | concept locked | production | feature frozen | shipped  
Owner: unassigned  
Last updated: YYYY-MM-DD  
Playable URL:  
Current build/commit:

Keep this document short enough to reread before approving a feature. Link to
plans for implementation detail. Mark uncertain claims as assumptions and give
each risky assumption an owner and validation date.

## 1. Player promise and concept lock

- **Working title:**
- **Player promise:** One memorable sentence about what the player does or feels.
- **One-line pitch:** `[fantasy]` through `[core verb]` to achieve `[goal]`, with
  `[twist or escalation]`.
- **Target player and judging audience:**
- **Dominant emotion:**
- **Core verb:**
- **Meaningful choice or skill:**
- **Why 3D matters:**
- **Why VR is better:**
- **Target session:** 2-3 minutes
- **Replay reason:**
- **Concept-lock date and owner:**

### Non-goals

List at least three attractive ideas this version will not attempt.

1.
2.
3.

## 2. Design pillars and proof

Use no more than three pillars. A pillar must guide cuts, not merely sound good.

| Pillar | Player-visible proof | Feature or behavior we would reject |
| --- | --- | --- |
| 1. |  |  |
| 2. |  |  |
| 3. |  |  |

Every feature must strengthen a pillar or remove a demonstrated blocker.

## 3. The 180-second demo arc

Design for a cold player who receives no spoken tutorial. Exact times may shift,
but every beat needs an observable player action and feedback.

| Time | Player understands/feels | Player action | Game response | Presenter/spectator sees | Recovery if missed |
| --- | --- | --- | --- | --- | --- |
| 0:00-0:20 | Invitation and goal |  |  |  |  |
| 0:20-0:45 | How the core verb works |  |  |  |  |
| 0:45-1:30 | Competence through repetition |  |  |  |  |
| 1:30-2:20 | Escalation and meaningful choice |  |  |  |  |
| 2:20-3:00 | Climax, result, and replay invitation |  |  |  |  |

### Hero moment

- **Trigger:**
- **What the player does:**
- **Visual, audio, motion, haptic, and UI feedback:**
- **What makes it legible to a spectator or in a recording:**
- **Fallback if audio, XR, or network access is unavailable:**

## 4. Core loop and game states

Describe one repetition in verbs, not systems:

`notice -> decide -> act -> read feedback -> adapt -> resolve/retry`

| Step | Player decision/action | Immediate feedback | State change | Variation on later repetitions |
| --- | --- | --- | --- | --- |
| Notice |  |  |  |  |
| Decide |  |  |  |  |
| Act |  |  |  |  |
| Read/adapt |  |  |  |  |
| Resolve/retry |  |  |  |  |

### State contract

- **Cold load:**
- **Ready/start:**
- **Playing:**
- **Partial success:**
- **Win/result:**
- **Failure:**
- **One-action retry:**
- **Pause/tab hidden/headset removed:**
- **XR entry denied or unavailable:**
- **Recoverable error:**

## 5. Rules, progression, and scoring

- **Goal expressed to the player:**
- **Rules the player must infer or learn:**
- **Meaningful choices:**
- **Difficulty/escalation curve:**
- **Win condition:**
- **Fail condition:**
- **Scoring and what it teaches:**
- **How the result invites replay:**
- **How the player cannot get permanently stuck:**

## 6. Cross-platform interaction contract

Preserve the same fantasy, rules, goals, feedback, and result across modes. The
gesture may differ. If a mode intentionally differs, state why that difference
improves the mode rather than treating it as a fallback.

| Player intent | Desktop | Mobile/touch | XR controllers | Hands, if supported | Feedback shared by all modes |
| --- | --- | --- | --- | --- | --- |
| Look/aim |  |  |  |  |  |
| Move/reposition |  |  |  |  |  |
| Primary/core verb |  |  |  |  |  |
| Secondary action |  |  |  |  |  |
| Pause/recenter |  |  |  |  |  |
| Retry/exit |  |  |  |  |  |

### Interaction budgets

- **Maximum simultaneous targets:**
- **Minimum target size/distance by mode:**
- **Required actions available one-handed:**
- **Mobile orientation and safe-area behavior:**
- **XR stance:** seated | standing | room-scale | selectable
- **Locomotion and turn mode:**
- **Dominant-hand assumptions:**
- **Loss-of-focus/controller/tracking behavior:**

## 7. Onboarding and communication

- **Goal cue visible on entry:**
- **First affordance and how it invites interaction:**
- **First-success feedback:**
- **Maximum tutorial text and reading level:**
- **How prompts disappear once understood:**
- **Non-color and non-audio cues for essential information:**
- **How a stuck player is nudged at 5, 10, and 20 seconds:**

## 8. World, tone, and feedback language

- **Setting and scale:**
- **Visual rules:** shape, palette, contrast, materials, and readable depth.
- **Audio rules:** ambience, action response, success, failure, and silence.
- **Motion/VFX rules:** anticipation, impact, persistence, and reduced-motion mode.
- **UI style:** world-space, screen-space, diegetic, or mixed.
- **Emotional arc:**

### Feedback stack for the core verb

| Phase | Visual | Audio | Motion | Haptic | UI/state confirmation |
| --- | --- | --- | --- | --- | --- |
| Available/hover |  |  |  |  |  |
| Commit/action |  |  |  |  |  |
| Success |  |  |  |  |  |
| Invalid/failure |  |  |  |  |  |

## 9. Content budget

Budget the smallest complete game first. A number without an owner is an
assumption, not a plan.

| Content type | Minimum complete | Feature-freeze cap | Owner/source | License/status |
| --- | ---: | ---: | --- | --- |
| Environments |  |  |  |  |
| Interactable types |  |  |  |  |
| Rounds/waves/puzzles |  |  |  |  |
| 3D models/material sets |  |  |  |  |
| VFX |  |  |  |  |
| Sound effects/music |  |  |  |  |
| UI screens/prompts |  |  |  |  |

## 10. Accessibility and comfort baseline

- **Readable text scale, contrast, and viewing distance:**
- **Non-color cues:**
- **Captions or visual equivalents for essential audio:**
- **One-handed and handedness support:**
- **Seated/standing support:**
- **Reduced motion, snap turn, teleport, or vignette options:**
- **Pause, recenter, mute, and reset access:**
- **Known exclusions and rationale:**

## 11. Technical and production boundaries

- **Supported release-gate devices/browsers:**
- **Performance and first-load targets:**
- **Static-host/offline-after-load requirements:**
- **Network, backend, account, or API dependencies:**
- **Physics needs and simpler alternative considered:**
- **Asset size and licensing constraints:**
- **Privacy/data collection:**
- **Known browser/XR degradation path:**

### Risk register

| Risky assumption | Earliest cheap test | Owner | Deadline | Pass condition | Kill/simplify response |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## 12. Scope ladder and schedule

### Scope floor: smallest complete game

Describe the version that still delivers the player promise, full demo arc, and
clean result/retry even after every optional feature is removed.

### Cut ladder

Cut from top to bottom. The final item is the core promise and is not cut without
changing the concept.

1. Stretch delight:
2. Cosmetic/content variation:
3. Secondary mechanic:
4. Optional input or mode:
5. Core promise - protect:

### Milestones

| Milestone | Playable outcome, not task list | Deadline | Owner | Exit evidence |
| --- | --- | --- | --- | --- |
| Risk spike | Riskiest assumption proved or concept simplified |  |  |  |
| Graybox | Full beginning-to-ending loop with placeholder assets |  |  |  |
| Core loop locked | Core verb and feedback work in desktop, touch, and XR |  |  |  |
| Feature freeze | No new mechanics; full 180-second arc is playable |  |  |  |
| Content/polish freeze | Final content, audio, comfort, and recovery states |  |  |  |
| Release candidate | Hosted build passes all release gates and rehearsal |  |  |  |

## 13. Demo and failure-recovery plan

- **Primary presenter and backup:**
- **Opening sentence:**
- **Actions the presenter performs, with timestamps:**
- **Fresh-start/reset procedure:**
- **Backup desktop/mobile path if XR fails:**
- **Backup local recording or screenshots:**
- **Network failure plan:**
- **Audio failure plan:**
- **Known rough edge the presenter must avoid:**
- **Final rehearsal date, device, URL, and owner:**

## 14. Validation map

Link each promise to observable evidence rather than checking that a subsystem
exists.

| Promise or acceptance criterion | Desktop evidence | Mobile evidence | XR evidence | Automated coverage | Owner/status |
| --- | --- | --- | --- | --- | --- |
| New player understands the goal |  |  |  |  |  |
| Core verb works and gives feedback |  |  |  |  |  |
| Full 180-second arc resolves |  |  |  |  |  |
| Retry/recovery works |  |  |  |  |  |
| Hero moment is legible |  |  |  |  |  |
