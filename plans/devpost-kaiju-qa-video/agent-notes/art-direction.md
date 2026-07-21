# Art direction and asset/licensing research — Kaiju QA Devpost video

Role: art director and asset/licensing researcher  
Research date: 2026-07-20  
Video target: narrated HyperFrames concept visualization, 1920×1080, 16:9,
75–95 seconds

## Executive recommendation

Build the video around **one visual system, not a slideshow of generated art**:

1. Use the supplied Azure FLUX.2-pro `kaiju-qa.png` as a short opening/closing
   continuity anchor and visual-quality promise.
2. Tell the complete happy-path → edge-case → regression → targeted-fix story
   with original HTML/CSS/SVG motion using a deliberately simplified version of
   the same tabletop laboratory.
3. Do **not** import a Quaternius pack for the first production pass. The license
   is suitable, but the candidate packs add conversion work, visual drift,
   embedded markings, or unnecessary detail. Original vector buildings,
   vehicles, robot arms, and a reusable vector kaiju will be clearer and easier
   to animate and provenance-check.
4. Generate at most **one optional additional FLUX still**: the fragile-tower
   cold-open failure plate. Generate it only if reference-image conditioning is
   confirmed on the documented Azure endpoint and the result visibly matches
   the supplied kaiju. If two attempts fail the continuity/rejection checklist,
   stop and use the SVG scene.

This is the strongest route for a judge-facing video because the generated still
provides emotional charm while deterministic vector motion provides explanatory
precision. It also keeps every critical beat editable without touching the game
runtime.

## Visual north star

**Toy Safety Lab:** a warm, low-poly tabletop where a helpful baby kaiju is the
subject of a quality-engineering rehearsal, not a monster attack.

The governing visual idea is **“the regression is the real monster.”** The kaiju
should remain earnest and lovable in every frame. Risk is communicated by broken
evidence paths, unstable test props, and a broad rule that blocks a rescue—not by
making the character angry, destructive, or ashamed.

Desired tone:

- tactile miniature laboratory rather than generic software dashboard;
- workplace comedy rather than disaster spectacle;
- precise evidence rather than chaotic VFX;
- optimistic release confidence rather than a victory explosion;
- premium low-poly illustration rather than mixed stock-asset collage.

## Supplied concept-art audit

Source inspected read-only:
`C:/UnityProj/OpenAIBuildWeek-loop-engineer-concepts/docs/design/loop-engineer-concepts/assets/kaiju-qa.png`

| Property | Finding |
| --- | --- |
| Dimensions | 1024×768, 4:3 |
| File size | 358,847 bytes |
| SHA-256 | `b61b21ebdbbd1b7bc289eea1c6837998276fc26d259de46832659676c73adf3c` |
| Recorded origin | Azure AI Foundry, `FLUX.2-pro`, generated 2026-07-20 |
| Recorded prompt | Preserved in `docs/design/loop-engineer-concepts/AZURE_FLUX_PROMPTS.md` |
| Seed | Not recorded in the supplied manifest |
| Status | Planning concept art; not gameplay capture |

### What works

- The yellow hard hat immediately frames the kaiju as a supervised helper.
- The teal kaiju, cream belly, lime path, coral blocks, and warm safety yellow
  form a distinctive, friendly palette.
- The tabletop, miniature buildings, robotic arms, test lights, and translucent
  path rails communicate “controlled test course” without explanatory text.
- The centered character and shallow depth of field create a strong thumbnail.
- The image contains no visible title, logo, watermark, or pseudo-interface text.

### What does not carry the story by itself

- It shows a general successful course, not the fragile-tower failure or blocked
  ambulance regression that judges must remember.
- It is a flattened still with baked depth of field; its objects cannot be moved
  independently without brittle cutout work.
- Several signal lights are too small to carry pass/fail meaning at video and
  mobile-thumbnail scale.
- The building set is intentionally varied, but that variation becomes noise
  when the narration needs the audience to compare exactly two scenarios.
- A 16:9 crop retains the kaiju but removes roughly 96 pixels from both the top
  and bottom of the 4:3 source. The remaining 1024×576 picture must be enlarged
  about 1.875× for 1920×1080 output, so avoid close pushes or prolonged display.

### Approved use in the video

- Show full-screen for roughly 2.5–3.5 seconds in the opening or title reveal.
- Use `object-position: 50% 55%` as the first 16:9 crop candidate; verify that
  the helmet, lower feet, left building, right tower, and both robot arms remain
  inside title/caption safe areas.
- Apply only a restrained 100%→104% push, soft vignette, and moving evidence-line
  overlay. Do not fake a large parallax move from a single raster.
- Add a persistent, readable `CONCEPT VISUALIZATION` disclosure whenever the
  image is presented as a game scene. Do not call it gameplay.
- If reused at the end, place it inside a designed evidence/release frame rather
  than replaying the same full-screen crop.
- When the orchestrator copies it into the isolated video project, preserve the
  exact source path, hash, prompt manifest, generation date, model, dimensions,
  and disclosure in `ASSET_LICENSES.md`.

## Core art system

### Palette

Use these tokens across every SVG, caption, transition, chart, and generated-art
grade. Do not sample new colors per frame.

| Token | Hex | Use |
| --- | --- | --- |
| Lab ink | `#0B1220` | Background, caption panel, deep shadows |
| Midnight slate | `#263449` | Lab walls, inactive modules, secondary panels |
| Paper ivory | `#F5F1E8` | Table surface, primary type, neutral vehicle body |
| Kaiju teal | `#3FAE9B` | Kaiju body and brand accent |
| Route cyan | `#5BD7D1` | Historical evidence paths and inspection glow |
| Safety yellow | `#FFD24A` | Helmet, current action, CTA, approval seal |
| Verified lime | `#B7E35A` | Passing path and release gate only |
| Regression coral | `#FF6B5E` | Failure, broken criterion, broad-fix warning |
| Blocked amber | `#F3A83B` | Stalled/waiting state distinct from failure |

Rules:

- Keep roughly 70% of every frame neutral ink/slate/ivory, 20% teal/cyan, and
  no more than 10% yellow/lime/coral/amber state accents.
- Never use red versus green as the sole distinction. Pair color with line
  shape, icon silhouette, motion, and spatial outcome.
- Coral means a criterion was violated; amber means motion is blocked or
  waiting; lime means the complete gate passed. Do not reuse those colors as
  decorative confetti.
- Type on ink/slate is ivory. Type on yellow/lime is lab ink. Do not place lime,
  yellow, or cyan body copy on ivory.

### Typography

Recommended bundled fonts:

- **Space Grotesk 700** for titles, beat labels, counters, and the release stamp.
- **Atkinson Hyperlegible 600/700** for narration captions and explanatory copy.

Both are available under the SIL Open Font License through Google Fonts. Bundle
the exact WOFF2 files used and retain their `OFL.txt` files; do not depend on a
network font request during deterministic rendering.

Fallback stack if the font files cannot be vendored cleanly:
`Arial, Helvetica, sans-serif`. A reproducible system fallback is preferable to
an unlicensed downloaded font.

Sizing at 1920×1080:

| Use | Size | Notes |
| --- | ---: | --- |
| Main title | 104–128 px | Maximum two short lines; sentence case preferred |
| Beat heading | 64–80 px | 3–7 words |
| Evidence label | 30–38 px | Semibold, attached to one object/path |
| Caption | 50–56 px | Atkinson 700, 1.12–1.18 line height |
| Disclosure/source | 24–28 px | Always legible, never hidden in a corner crop |

Avoid bubbly novelty fonts, condensed “movie trailer” type, all-caps paragraphs,
outlined meme captions, faux-stencil military type, and type baked into generated
images.

### Shape language

- **Kaiju / empathy:** rounded bean body, circular eyes, short limbs, soft cream
  belly, three or four lime dorsal plates, oversized hard-hat dome.
- **Lab / authority:** rounded octagons, chamfered rectangles, articulated arms,
  socket rings, and clean 45-degree joins.
- **Test props:** simple recognizable silhouettes with no more than three color
  regions per object.
- **Fragile tower:** top-heavy stack of five offset blocks; the unstable
  silhouette must read before it falls.
- **Broad fix:** a coral square fence or full-building “freeze field” crossing
  every route. It should look blunt and overreaching.
- **Targeted fix:** one small lime rounded boundary surrounding only the fragile
  tower’s corner; it should look measured and local.
- **Pass evidence:** one continuous solid path with a traveling dot and rounded
  check-shaped end cap.
- **Failure evidence:** a branched/zigzag path with a visible break and X-shaped
  end cap.
- **Blocked evidence:** a path terminating at two parallel stop bars.
- **Untested evidence:** neutral dotted path with no animated pulse.

Use icons only as reinforcement. The physical outcome—tower falls, ambulance
stops, both routes clear—must remain understandable with every label removed.

## Low-poly tabletop laboratory staging

### Persistent set

Build one reusable 2.5D set and restage its modules rather than creating a new
world for every beat:

- matte ivory table with a thick dark edge and soft contact shadow;
- deep ink/slate lab backdrop with two blurred shelf silhouettes at most;
- three mint/teal city-base tiles that snap to a visible test grid;
- one road loop, one fragile-tower socket, one car/ambulance lane, and one
  release-gate socket;
- two simple robot arms framing the left and right thirds;
- one large three-lamp inspection beacon, with state also expressed by shape;
- the same baby-kaiju SVG group in every shot;
- a persistent translucent evidence rail that can retain previous attempts.

The tabletop should occupy the center 80% of frame. Preserve the upper 12–15%
for a short headline and the lower 16–20% for captions. Keep the kaiju and current
criterion out of the bottom caption rail.

### Camera and depth

- Default camera: elevated three-quarter view, approximately 30–35 degrees down,
  matching the supplied concept art.
- Use one consistent tabletop horizon and shadow direction.
- Simulate low-poly depth with 2–3 value planes per object, short cast shadows,
  and modest CSS perspective. Avoid glossy realism, detailed textures, or deep
  volumetric blur.
- Use a maximum 8–10% camera push. Save the only larger composition change for
  the final release hero frame.
- Keep core action inside the middle 70% so a future 4:3 or vertical excerpt can
  be made without redrawing the lesson.

### Scenario props

Create these as original SVG/HTML assets:

- **Stalled car:** compact coral car with raised hood and one amber beacon.
- **Ambulance/rescue van:** ivory van, coral side stripe, cyan roof beacon, and a
  heart/pulse motif if a symbol is needed. Do not use a red-cross emblem or a
  third-party emergency-service livery.
- **Fragile tower:** five coral/peach blocks on a small blue socket, with a
  visible off-center top block.
- **Slow-zone boundary:** lime/cyan rounded rail with four large corner nodes.
- **Release seal:** comically tiny yellow octagonal stamp, deliberately small in
  the kaiju’s hand.

The ambulance must be larger and simpler than a realistic vehicle. Its cyan
beacon and urgent straight motion should make its role clear before the caption
names it.

### Motion grammar

- Kaiju walk: gentle four-pose bob, 1.0–1.2 seconds per cycle; no stomping shake.
- Test run: evidence pulse leads the kaiju; outcome follows; result holds long
  enough to inspect.
- Failure: one short tower wobble, authored block fall, coral path break, then a
  12–16 frame pause. No debris cloud or destruction spectacle.
- Broad fix: coral field snaps on with a mechanical “too much” square wipe.
- Regression: ambulance approaches smoothly and stops at double bars; hold the
  stopped wheels and pulsing cyan beacon.
- Targeted fix: the large coral field contracts into a small lime boundary,
  visually expressing reduced scope.
- Final pass: both route pulses run concurrently, then join a continuous loop.
- Release: tiny stamp lands after the full pass; no confetti until the gate is
  visibly complete, and any celebratory particles should be fewer than twelve.

Use the inspection-light sweep or traveling evidence pulse as the recurring
transition. Avoid whip-pans, fast flashes, random camera shake, or continuous
background motion that competes with captions.

## Caption and on-screen-copy styling

Captions are part of the art system, not a utility overlay.

- Position captions in a centered lower rail with 96–120 px side margins and
  72–92 px bottom margin.
- Maximum two lines, approximately 32–38 characters per line, and preferably one
  complete thought per card.
- Atkinson Hyperlegible 700, 50–56 px, paper ivory on a `#0B1220` panel at
  88–94% opacity.
- Panel: 24–28 px corner radius, 26–34 px horizontal padding, 18–24 px vertical
  padding, subtle 2 px cyan top rule or left evidence notch.
- Emphasize at most one short phrase in safety yellow or verified lime; never
  recolor isolated words faster than they can be read.
- Caption entrance: 8–12 frame fade/6 px rise. Caption exit: 6–8 frame fade.
  Avoid word-by-word karaoke animation for the full narration.
- Kinetic headlines and captions must not repeat the same sentence. Headline
  names the beat (“ONE PASS ISN’T COVERAGE”); caption carries the spoken detail.
- Keep `CONCEPT VISUALIZATION` in a small top-left ink/ivory lozenge whenever a
  mock scene could be mistaken for captured gameplay.

## Visual-continuity contract for all frame workers

Every frame should pass these checks before integration:

1. Same palette tokens; no local substitutes.
2. Same kaiju proportions, helmet, eye style, dorsal plates, and cream belly.
3. Same elevated camera, light from upper left, table edge, and city-base scale.
4. Maximum five material/value families in any shot.
5. Same route stroke width, node size, and pass/fail/blocked grammar.
6. State meaning uses silhouette and motion in addition to color.
7. Captions remain in the shared rail and do not cover the current criterion.
8. Generated art is disclosed; SVG scenes are described as concept animation,
   not gameplay capture.
9. No external logos, readable storefronts, vehicle brands, flags, protected
   emergency emblems, or pseudo-text.
10. No arbitrary particle system, camera shake, or new transition language.

Recommended continuity device: let a thin cyan evidence line persist between
shots. It can curl into the title underline, become the kaiju’s route, break at
the failure, stop at the ambulance regression, contract around the slow zone,
and finally close into the release loop. This creates one visual sentence across
the entire video.

## Quaternius CC0 audit

### License finding

The official Quaternius FAQ states that all models are CC0, can be used free in
commercial, educational, and personal projects, can be modified, and do not
require attribution; credit is appreciated. The inspected pack pages also mark
the listed packs CC0.

This is suitable for a Devpost video, but the production should still:

- download from the official pack page;
- retain the archive’s license/readme and hash;
- credit Quaternius voluntarily;
- use the actual downloadable model files, not website screenshots or pack
  preview images containing the Quaternius wordmark;
- inspect markings, symbols, and signs separately because CC0 status for a model
  does not remove unrelated trademark, emblem, privacy, or publicity concerns.

### Candidate-pack findings

| Pack | Official facts checked | Visual/use finding | Recommendation |
| --- | --- | --- | --- |
| [Ultimate Monsters](https://quaternius.com/packs/ultimatemonsters.html) | 50 animated models; FBX, OBJ, Blend, glTF; CC0 | Broad comic-monster range, but no supplied character matches the helmeted teal baby-kaiju silhouette without substantial remodeling/material work. Conversion/rasterization adds no value to an SVG-led video. | **Fallback only.** Use one model only if a later shot truly needs a rendered 3D turntable. Add an original helmet and rematerial completely. |
| [Cute Animated Monsters](https://quaternius.com/packs/cutemonsters.html) | 21 animated textured models; FBX, OBJ, Blend, glTF; CC0 | Squat mascot heads, strong baked textures, and very different eyes/surface treatment from the supplied concept art. | **Reject for this video.** High continuity drift. |
| [Simple Buildings](https://quaternius.com/packs/simplebuildings.html) | 10 atlas-textured buildings including hospital, houses, and shop; FBX, OBJ, Blend; CC0 | Closest useful scale, but the preview’s white/red-roof style conflicts with the teal toy lab, and the hospital carries a red-cross-like emblem that should not appear in final media. No glTF is listed. | **Reference only.** Original SVG buildings are faster. If used, recolor, remove all signage/emblems, and import only 2–3 meshes. |
| [Downtown City MegaKit](https://quaternius.com/packs/downtowncitymegakit.html) | 315 modular pieces; FBX, Blend, glTF; CC0 | Realistic Boston/NYC-style massing, detailed windows, signs, and a much denser surface language than the low-poly tabletop. Large browsing and conversion cost. | **Reject.** It would make the video look like two unrelated games. |
| [Cars](https://quaternius.com/packs/cars.html) | 8 models; FBX, OBJ, Blend; CC0 | Useful generic sedan silhouettes, but the preview includes taxi/police markings and does not provide the clean, immediately readable ambulance required by the story. | **Do not import initially.** Draw the stalled car and rescue van in SVG. If a car mesh is used, choose an unmarked civilian model and replace all materials. |
| [Steampunk Turret Pack](https://quaternius.com/packs/turretpack.html) | 37 models; FBX, OBJ, Blend; CC0 | Mechanical bases could be repurposed, but weapon silhouettes and copper steampunk styling undermine the friendly QA-lab tone. | **Reject.** Build two simple original robot arms instead. |
| [Animated Robot](https://quaternius.com/packs/animatedrobot.html) | One cute animated robot; FBX, OBJ, Blend; free for personal/commercial use under the site’s CC0 policy | Yellow industrial palette is compatible, but a second mascot competes with the kaiju and does not replace the required robot arms. | **Reject as a character.** Shape reference only. |

### Asset decision

For version one, use **zero Quaternius production assets**. This is not a license
rejection; it is an art-coherence and schedule decision. Revisit Ultimate
Monsters or Simple Buildings only if the finished SVG contact sheet feels too
flat after motion and lighting polish.

## Azure FLUX.2-pro recommendation and prompts

### Generation decision

No new image is required to explain the loop. The supplied still plus original
motion is the preferred production plan.

Generate one additional still only if all of the following are true:

- the Azure FLUX.2-pro endpoint supports using the supplied project-owned image
  as a visual reference in the available workflow;
- the storyboard still lacks an emotionally strong first-three-second failure;
- the output can be clearly labeled concept visualization;
- the kaiju, helmet, palette, table scale, and lab staging match the supplied
  still at thumbnail size;
- the image passes the rejection checklist within two attempts.

Suggested master size: 1536×864 if accepted by the deployed endpoint; otherwise
1024×576. Preserve the exact request JSON, response metadata, output hash, and
any reference-image hash.

### Optional prompt A — fragile-tower cold open

> Use the supplied project-owned Kaiju QA concept image as the visual reference
> for the same baby kaiju, laboratory, materials, palette, and low-poly rendering
> style. Create a wide cinematic 16:9 concept-visualization plate for a polished
> educational game. On a toy-scale quality-assurance tabletop, the same friendly
> teal baby kaiju with cream belly, lime dorsal plates, large dark eyes, and a
> bright yellow safety helmet is carefully carrying a tiny stalled coral car
> along a mint test road. Its tail has accidentally nudged a deliberately
> top-heavy fragile tower made from five coral and peach test blocks; the tower
> is caught at the first readable moment of tipping, with only two blocks in the
> air and no dust or city destruction. A cyan prior path and a broken coral
> evidence path make the failed criterion visible. Two simple robotic test arms
> frame the course. Warm ivory tabletop, teal laboratory modules, safety yellow,
> route cyan, verified lime, and regression coral, soft studio lighting, clean
> modular low-poly geometry, charming workplace comedy, strong silhouettes,
> focal action centered-right, calm dark negative space on the left for an
> external title. The kaiju looks surprised and concerned, never aggressive.
> Every surface is blank and unmarked. No readable text, pseudo-writing, labels,
> numbers, logos, storefronts, brands, flags, red-cross emblem, interface,
> watermark, signature, smoke, explosion, frightened civilians, injury, or
> photoreal destruction.

### Optional prompt B — isolated continuity reference, not final footage

Use only if the SVG artist needs a cleaner silhouette guide:

> A single full-body friendly baby kaiju character on a plain warm-gray studio
> background, matching the project-owned Kaiju QA concept: compact pear-shaped
> teal body, cream oval belly, three lime dorsal plates, short rounded limbs,
> broad tail, large dark glossy eyes, small gentle smile, and oversized bright
> yellow construction safety helmet. Low-poly toy-like 3D character design, front
> three-quarter standing pose, both feet and entire tail visible, soft neutral
> studio lighting, crisp silhouette, no props, no city, no robot, no second
> character, no texture noise, no text, labels, logos, symbols, watermark,
> signature, border, or character sheet annotations.

Do not use prompt B’s output as a substitute for consistent generated shots. It
is a temporary design reference for an original vector redraw.

### FLUX rejection checklist

Reject an output if any answer is “no”:

- Is this visibly the same kaiju as the supplied hero at 320×180?
- Are the yellow helmet, teal body, cream belly, and lime plates unchanged?
- Is the failure caused by helpful motion, not aggression?
- Does the fragile tower read without narration?
- Is there clean title space and a safe 16:9 crop?
- Are evidence paths legible and distinct by shape, not only color?
- Is every sign, panel, vehicle, and garment free of letters/pseudo-letters?
- Are there no logos, trademarks, flags, protected emergency emblems, signatures,
  or watermarks?
- Is the image free of extra limbs, merged props, floating blocks unrelated to
  the tower, and impossible robot joints?
- Can it be truthfully labeled concept visualization rather than gameplay?

## License and provenance checklist

Every retained asset should receive one row in
`videos/kaiju-qa-devpost/ASSET_LICENSES.md` with:

1. Stable asset ID and final repository path.
2. Human-readable asset name and exact use/frame range.
3. Creator/provider.
4. Original source page URL and direct download URL where applicable.
5. Access/download/generation timestamp in UTC.
6. License name, license URL, and a retained local license/readme path.
7. Permission summary for commercial video, modification, redistribution, and
   attribution; state whether credit is legally required or voluntary.
8. Original archive/file name, byte size, and SHA-256.
9. Modification log: crop, recolor, mesh reduction, vector redraw, compositing,
   audio edit, or format conversion.
10. Trademark/emblem/signage/privacy review result.
11. For generated imagery: provider, endpoint/model, exact prompt, request JSON,
    dimensions, seed if returned, reference-image IDs and hashes, output hash,
    generation date, selection/rejection notes, and concept-visualization
    disclosure.
12. For fonts: family, version/commit, source URL, exact WOFF2 files, `OFL.txt`,
    weights used, and whether files are embedded in the render.
13. For voice/music/SFX: source, performer/model, terms, generation/download
    date, edit history, and confirmation that the license permits a public
    Devpost/YouTube submission.
14. Reviewer initials/status and unresolved restrictions.

Recommended manifest columns:

`id | repo path | creator/provider | source URL | acquired UTC | license |
license proof | SHA-256 | modifications | frames used | disclosure/credit |
rights review | reviewer`

Do not record secrets, API keys, signed URLs, account identifiers, or provider
tokens.

## Production handoff priorities

1. Lock the palette, caption component, camera, table, kaiju SVG, evidence-path
   grammar, fragile tower, and rescue van before assigning final frame workers.
2. Give each worker the same shared visual tokens and a single reference frame.
3. Build one complete regression frame first; if the stopped rescue van and
   broad coral field are understandable without text, the system is working.
4. Use the supplied raster hero only after the SVG look is established so the
   video grade can bridge the two styles.
5. Review a 320×180 contact sheet in grayscale and in simulated common color-
   vision deficiencies; fix shape/state ambiguity before adding decoration.
6. Keep a strict concept disclosure until matching real gameplay capture exists.

## Sources and checks completed

Local sources read or inspected:

- `AGENTS.md`
- `plans/devpost-kaiju-qa-video/PLAN.md`
- `plans/devpost-kaiju-qa-video/AGENT_ASSIGNMENTS.md`
- read-only `docs/design/loop-engineer-concepts/PROPOSALS.md`
- read-only `docs/design/loop-engineer-concepts/DEVPOST_SUBMISSION_DRAFT.md`
- read-only `docs/design/loop-engineer-concepts/ASSET_PLAN.md`
- read-only `docs/design/loop-engineer-concepts/AZURE_FLUX_PROMPTS.md`
- read-only `plans/loop-engineer-concepts/agent-notes/art-direction.md`
- `C:/UnityProj/Tmp/Flux-Image-Generation.md`
- `videos/kaiju-qa-devpost/AGENTS.md`, `hyperframes.json`, and `meta.json`
- supplied `kaiju-qa.png` inspected at original resolution; dimensions, byte
  size, and SHA-256 verified as recorded above.

Official web sources checked on 2026-07-20:

- Quaternius FAQ/license: <https://quaternius.com/faq.html>
- Creative Commons CC0: <https://creativecommons.org/publicdomain/zero/1.0/>
- Quaternius pack pages linked in the audit table.
- Google Fonts, Space Grotesk:
  <https://fonts.google.com/specimen/Space+Grotesk>
- Google Fonts, Atkinson Hyperlegible:
  <https://fonts.google.com/specimen/Atkinson+Hyperlegible>
- Microsoft Foundry FLUX documentation:
  <https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-flux>
- Black Forest Labs FLUX.2 prompting guide:
  <https://docs.bfl.ai/guides/prompting_guide_flux2>

No third-party pack was downloaded, no Azure image was generated, no source or
runtime file was changed, and no IWSDK/IWER/runtime server was launched.

## Completion summary

- Defined the video’s palette, typography, shape/state grammar, tabletop staging,
  caption system, motion language, and cross-frame continuity rules.
- Audited the supplied Kaiju QA concept still and recorded its dimensions, hash,
  strengths, limitations, safe use, and disclosure requirement.
- Verified the official Quaternius CC0 policy and audited seven candidate packs.
- Recommended an original SVG/HTML production with no Quaternius asset import in
  version one.
- Recommended no additional generated stills by default and supplied one tightly
  scoped optional FLUX cold-open prompt plus a continuity-reference fallback.
- Supplied a production-ready license/provenance checklist and asset-manifest
  schema.
