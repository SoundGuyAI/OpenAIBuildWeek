# Devpost submission draft — Loop Engineer

Status: preparation only; update after one concept is selected and implemented.  
Official sources checked: 2026-07-20  
Recommended category: **Education**

## Non-negotiable official checklist

The OpenAI Build Week submission period ends **Tuesday, July 21, 2026 at
5:00 p.m. Pacific Time**. Judging runs July 22 through August 5, 2026; the
working project must remain free and available to judges through the end of
judging.

| Requirement | Current preparation |
| --- | --- |
| Working project built with Codex using GPT-5.6 | Design complete; implementation not yet selected |
| Choose one category | Education |
| Text description explaining features and functionality | Draft below |
| Public YouTube demo, shorter than three minutes | Storyboard below; recording pending |
| Demo audio explains what was built and how Codex + GPT-5.6 were used | Narration beats below |
| Repository URL for judging/testing | This repository; final public URL pending |
| Public repo with relevant license, or private repo shared with both official judge emails | Team decision pending |
| README setup, sample data if needed, run instructions, and Codex collaboration story | Existing README requires project-specific update |
| Main Codex /feedback session ID | Capture from the thread that builds most core functionality |
| Free, unrestricted judge access through August 5 at 5:00 p.m. PT | Deployment and uptime owner pending |
| Original, entrant-owned submission with compliant third-party licenses | Asset manifest prepared; final audit pending |
| English submission materials or English translations | Planned in English |

Official references:

- <https://openai.devpost.com/>
- <https://openai.devpost.com/rules>
- <https://openai.devpost.com/rules#submission-requirements>
- <https://openai.devpost.com/rules#7-judges-criteria>

## Submission identity

**Project name:** Loop Engineer  
**Recommended tagline:** Turn the AI build-test-learn loop into muscle memory.  
**25-word pitch:** A three-minute spatial game where aspiring developers guide
an AI-assisted change through goals, evidence, regression testing, and a safe
release—on desktop, mobile, or WebXR.

### Concept-specific subtitle options

| Concept | Submission title | Short hook |
| --- | --- | --- |
| Stormglass | Loop Engineer: Stormglass | Debug the storm. Verify the route. Ship the rescue. |
| The Tomorrow Garden | Loop Engineer: The Tomorrow Garden | Grow one change, read one season, release a stable world. |
| Kaiju QA | Loop Engineer: Kaiju QA | Test the tiny monster before it meets the real city. |
| Sunrise Express | Loop Engineer: Sunrise Express | Rehearse the release train, then ship the sunrise. |
| The Museum of Almosts | Loop Engineer: The Museum of Almosts | Compare every almost. Preserve the evidence. Finish the impossible. |

## Draft project description

AI can generate code quickly, but new developers still need the judgment to
define success, inspect what actually happened, diagnose failure, protect
quality criteria, and decide when to ship or stop. Static SDLC diagrams and
chatbot explanations rarely let a learner practice those decisions.

**Loop Engineer** turns that judgment into a short 3D game. The player frames a
goal, authorizes one bounded change, runs a repeatable test, reads spatial
evidence, catches a regression, and earns a safe release. The same complete
lesson works with a mouse, touch, or XR controller from one browser codebase.

The game teaches an emerging AI-era practice: Loop Engineering. Rather than
prompting until something looks right, a Loop Engineer designs the recurrence
around the agent—goal, action, observation, adjustment, and an explicit
pass/stop/escalate gate. The game also places that inner loop inside the wider
software development lifecycle, including operation and maintenance after
release.

## Core features

- One complete beginning-to-ending learning arc in under three minutes.
- A deterministic baseline, scoped change, observable result, regression, and
  release or escalation decision.
- Spatial evidence such as traces, attempt overlays, scenario coverage, or
  prototype diffs that remains visible between runs.
- Equal semantic controls on desktop, touch, and WebXR; XR improves embodiment
  without hiding functionality behind a headset.
- One-handed interaction, large targets, captions, non-color state cues,
  reduced-motion behavior, and one-action retry.
- Static-host-friendly critical path with no account, backend, live model, or
  network dependency after load.

## Audience and potential impact

**Primary learner:** first-year computer-science/software-engineering students,
bootcamp learners, and career switchers who use AI tools but have not yet built
strong verification and release judgment.

**Secondary user:** instructors who need a short classroom activity or formative
assessment that demonstrates reasoning rather than vocabulary recall.

**Specific learning evidence:** the player must define observable acceptance,
inspect external evidence before adjusting, preserve valid criteria during a
regression, and stop or escalate at an authority/risk boundary.

The submission should claim an engaging introductory practice opportunity—not
professional mastery or proven learning gains unless a real pilot is completed.

## Why it is different

Loop Engineer is not a syntax lesson, conveyor factory, node editor, or chatbot
quiz. The player does not win by writing the shortest program or finding a
clever prompt. They win by making a bounded change and producing enough evidence
to justify the next lifecycle decision.

The closest familiar genres expose programming, automation, or system repair.
Loop Engineer makes acceptance criteria, attempt memory, regression tests,
human authority, rollback, and release confidence the actual toys.

## How it will be built

- **Runtime:** IWSDK 0.4.2, TypeScript, Vite, ECS, Interactable components, and
  one compact stationary 3D scene.
- **Delivery:** one relative-path static build suitable for GitHub Pages.
- **Game logic:** deterministic state machine; preauthored outcomes and traces;
  no physics on the critical path.
- **Inputs:** shared semantic actions mapped to mouse, touch, XR ray, and
  optional direct grab.
- **Content:** primitives first; selected Quaternius CC0 packs only after
  license and file-size review.
- **Verification:** typecheck, production build, desktop/mobile browser E2E,
  IWER/WebXR interaction pass, evidence screenshots, accessibility and
  performance review.

## How Codex and GPT-5.6 were used

Use concrete dated evidence here after implementation. Suggested structure:

1. Codex converted the team prompt into acceptance criteria, risks, a test
   matrix, and an isolated branch/worktree.
2. Dedicated agents researched learning design, market collisions, IWSDK
   constraints, art direction, narrative, humor, and Devpost requirements.
3. Humans selected the concept, protected the learning objectives, and made
   final scope and taste decisions.
4. Codex implemented disjoint code slices, integrated them centrally, and
   created browser/XR tests and durable evidence.
5. Independent agents reviewed interaction, comfort, accessibility, and the
   final diff; humans accepted or rejected recommendations.

Before submission, name at least one Codex suggestion the team rejected or
corrected. That makes human judgment and the collaboration boundary credible.

## Challenges and accomplishments

Draft after implementation:

- Compressing a real feedback-and-release lesson into three minutes without a
  lecture or code editor.
- Keeping the same decisions legible with mouse, touch, and XR input.
- Turning failure into useful persistent evidence instead of punishment.
- Producing a complete static build and judge-ready fallback in four hours.
- Preserving accessibility, comfort, and deterministic behavior under extreme
  hackathon scope.

## Demo video storyboard — target 2:45

| Time | Picture | Required narration |
| --- | --- | --- |
| 0:00–0:10 | Hero failure and game title | The learner problem and one-line promise |
| 0:10–0:25 | Goal and acceptance criteria become visible | Named audience and Education-track fit |
| 0:25–1:25 | Mostly uninterrupted play through first change and result | What the player decides and why evidence matters |
| 1:25–1:55 | Regression, diagnosis, corrected retry | Why this is Loop Engineering rather than repeated prompting |
| 1:55–2:15 | Final release plus desktop/touch/XR montage | Cross-platform design, comfort, and accessibility |
| 2:15–2:38 | Repository, plan, tests, prompt log, and Codex session evidence | Exactly how Codex and GPT-5.6 accelerated the work; human decisions |
| 2:38–2:45 | Final hero state and URL/title | Specific impact and replay/classroom invitation |

Use captions in addition to the required audio. Avoid copyrighted music,
third-party trademarks, long team introductions, or a sped-up code montage.

## Screenshot and media checklist

1. **Hero:** selected game at the moment the failed evidence becomes obvious.
2. **Learning loop:** goal, change, evidence, and gate visible in one frame.
3. **Regression:** the second criterion visibly catches an over-broad fix.
4. **Release:** the final transformation after a repeat pass.
5. **Access:** desktop, mobile, and XR views showing the same task.
6. **Codex process:** repository plan/evidence view without secrets or private
   data.

Concept art in this design folder is planning material. Final Devpost media
should prioritize real gameplay captures and label any remaining mockups.

## README and judge-access checklist

- Put the public playable URL and 30-second quick start at the top.
- State tested desktop browser, phone/browser, IWER/headset, and exact commit.
- Explain controls for desktop, touch, and XR.
- Document the complete reset/retry path.
- List asset sources/licenses and generated-content provenance.
- Distinguish pre-existing boilerplate from post-July-13 hackathon work with
  dated commits and prompt logs.
- Keep the full lesson playable without a headset.
- Keep the build live, free, and unrestricted through August 5, 2026 at
  5:00 p.m. PT.
- If the repository remains private, share it with both
  testing@devpost.com and build-week-event@openai.com.
- Record the main /feedback Codex session ID before the submission form closes.

## Final fill-ins

- Selected concept:
- Team representative and eligibility recheck:
- Public demo URL:
- Repository URL and license:
- YouTube URL:
- Main Codex /feedback session ID:
- Final commit SHA:
- Tested desktop browser:
- Tested mobile device/browser:
- Tested headset/IWER configuration:
- Asset/license audit owner:
- Judge-access uptime owner:
- Final rules recheck timestamp:
