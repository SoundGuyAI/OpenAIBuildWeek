# Kaiju QA asset provenance

This ledger covers every file shipped under `public/assets/kaiju-qa/` as of
2026-07-21. The compact set contains 29 files totaling 3,138,809 bytes. Source
packs and archives are checked in under `source-assets/kaiju-qa/` so another
agent can reproduce or extend the selected asset set without relying on this
machine's temporary directory.

The project download/generation date is recorded as **2026-07-20**. The source
session crossed midnight UTC: cache writes occurred from 2026-07-21 00:03Z,
model conversion completed at 00:10Z, and the first Kenney copies completed at
00:11Z. Both dates are retained here so the record is unambiguous.

## Source packs and license evidence

| Pack or generator | Source page | Download source | License/status | Preserved record |
| --- | --- | --- | --- | --- |
| Quaternius Ultimate Monsters | https://quaternius.com/packs/ultimatemonsters.html | https://drive.google.com/drive/folders/18m4KpzpEzhC9wl7jzr6dUc0N8Jozr79C?usp=sharing | CC0 1.0 per the official pack/license pages | `public/assets/kaiju-qa/licenses/quaternius-ultimate-monsters-CC0.txt` |
| Quaternius Simple Buildings | https://quaternius.com/packs/simplebuildings.html | https://drive.google.com/drive/folders/1r-FcNFxC6ziN0oI3GqZJdEkdzglFQHQH?usp=sharing | CC0 1.0 per the official pack/license pages | `public/assets/kaiju-qa/licenses/quaternius-simple-buildings-CC0.txt` |
| Quaternius Cars | https://quaternius.com/packs/cars.html | https://drive.google.com/drive/folders/1fKlbDry77iY8KlEoxzUxIAZQL_XhzWlA?usp=sharing | CC0 1.0; vendor license downloaded with the selected files | `public/assets/kaiju-qa/licenses/quaternius-cars-CC0.txt` |
| Kenney Factory Kit 3.0 | https://kenney.nl/assets/factory-kit | `kenney_factory-kit_3.0.zip` from Kenney's asset CDN | CC0 1.0; vendor license bundled in the archive | `public/assets/kaiju-qa/licenses/kenney-factory-kit-CC0.txt` |
| Azure AI Foundry / Black Forest Labs | Local request instructions: `C:\UnityProj\Tmp\Flux-Image-Generation.md` | Provider API response (`b64_json`) | Generated project asset; **not part of the CC0 set**. No provider-terms snapshot was preserved with the image. | This document's FLUX record |

Quaternius' official license statement is
https://quaternius.com/faq.html. The CC0 legal tool referenced by the records is
https://creativecommons.org/publicdomain/zero/1.0/.

The local Ultimate Monsters vendor license is preserved verbatim, but its
header says `Ultimate Platformer Pack`. That apparent vendor-file mismatch is
why this ledger also retains the Ultimate Monsters pack page and exact source
folder. The Simple Buildings source folder exposed no `License.txt` during the
selective download, so the new Simple Buildings record explicitly identifies
itself as a project-created provenance supplement rather than a vendor file.

Kenney's local archive was downloaded as `factory-kit.zip` (the source filename
was `kenney_factory-kit_3.0.zip`), 4,511,890 bytes, SHA-256
`7e31fb2308e90304672bd15cd18fa9d9f02c03731a8cbc57a8e3e1c181dfb0a7`.

## Shipped Quaternius models

All rows below were selectively downloaded on 2026-07-20. They were imported
and exported to GLB with Blender 4.4.0 on 2026-07-21 at 00:10Z by
`scripts/prepare-kaiju-qa-assets.py`. The script removes cameras/lights,
retains the Dino skin and animations, applies static transforms, embeds
materials/images, and exports glTF 2.0 GLBs.

### Ultimate Monsters — CC0 1.0

| Source filename | Local output | Conversion method |
| --- | --- | --- |
| `Big/glTF/Dino.gltf` (cached as `ultimate-monsters/Dino.gltf`) | `public/assets/kaiju-qa/models/characters/kaiju.glb` | Blender glTF import/export; skin, morphs, and 14 animation clips retained |

### Simple Buildings — CC0 1.0

| Source filename | Local output | Conversion method |
| --- | --- | --- |
| `FBX/Hospital.fbx` | `public/assets/kaiju-qa/models/city/hospital.glb` | Blender FBX import, static transform normalization, GLB export |
| `FBX/Flat.fbx` | `public/assets/kaiju-qa/models/city/flat.glb` | Blender FBX import, static transform normalization, GLB export |
| `FBX/House.fbx` | `public/assets/kaiju-qa/models/city/house.glb` | Blender FBX import, static transform normalization, GLB export |
| `FBX/Shop.fbx` | `public/assets/kaiju-qa/models/city/shop.glb` | Blender FBX import, static transform normalization, GLB export |

### Cars — CC0 1.0

| Source filename | Local output | Conversion method |
| --- | --- | --- |
| `FBX/NormalCar1.fbx` | `public/assets/kaiju-qa/models/vehicles/car.glb` | Blender FBX import, static transform normalization, GLB export |
| `FBX/SUV.fbx` | `public/assets/kaiju-qa/models/vehicles/suv.glb` | Blender FBX import, static transform normalization, GLB export |
| `FBX/Cop.fbx` | `public/assets/kaiju-qa/models/vehicles/emergency.glb` | Blender FBX import, static transform normalization, GLB export |

`emergency.glb` is a **police car**, not an ambulance. Quaternius Public
Transport source is not present under `source-assets/kaiju-qa/`; the retained
source cache contains no valid Ambulance, TrafficLight, or TrafficCone source
from that pack. No Public Transport asset
was added or relabeled. Kenney's `warning-traffic.glb` is a Factory Kit warning
prop, not a Quaternius municipal traffic light.

## Shipped Kenney Factory Kit models — CC0 1.0

The archive was downloaded on 2026-07-20 and extracted at 2026-07-21 00:06Z.
Each GLB is copied byte-for-byte from `Models/GLB format/`; no geometry,
materials, names, or animation data are rewritten. The first ten models were
copied at 00:11Z; the five requested additions and required shared texture were
copied on 2026-07-21. Source and output SHA-256 values are identical.

| Source filename | Local output | Copy method |
| --- | --- | --- |
| `Models/GLB format/arrow-rounded.glb` | `public/assets/kaiju-qa/models/lab/arrow-rounded.glb` | Exact file copy |
| `Models/GLB format/button-floor-round.glb` | `public/assets/kaiju-qa/models/lab/button-floor-round.glb` | Exact file copy |
| `Models/GLB format/cog-c.glb` | `public/assets/kaiju-qa/models/lab/cog-c.glb` | Exact file copy |
| `Models/GLB format/conveyor-stripe.glb` | `public/assets/kaiju-qa/models/lab/conveyor-stripe.glb` | Exact file copy |
| `Models/GLB format/crane.glb` | `public/assets/kaiju-qa/models/lab/crane.glb` | Exact file copy |
| `Models/GLB format/crane-magnet.glb` | `public/assets/kaiju-qa/models/lab/crane-magnet.glb` | Exact file copy |
| `Models/GLB format/indicator-special-arrow.glb` | `public/assets/kaiju-qa/models/lab/indicator-special-arrow.glb` | Exact file copy |
| `Models/GLB format/indicator-special-cross.glb` | `public/assets/kaiju-qa/models/lab/indicator-special-cross.glb` | Exact file copy |
| `Models/GLB format/lever-single.glb` | `public/assets/kaiju-qa/models/lab/lever-single.glb` | Exact file copy |
| `Models/GLB format/machine-window.glb` | `public/assets/kaiju-qa/models/lab/machine-window.glb` | Exact file copy |
| `Models/GLB format/robot-arm-a.glb` | `public/assets/kaiju-qa/models/lab/robot-arm-a.glb` | Exact file copy |
| `Models/GLB format/robot-arm-b.glb` | `public/assets/kaiju-qa/models/lab/robot-arm-b.glb` | Exact file copy |
| `Models/GLB format/scanner-low.glb` | `public/assets/kaiju-qa/models/lab/scanner-low.glb` | Exact file copy |
| `Models/GLB format/screen-panel-wide.glb` | `public/assets/kaiju-qa/models/lab/screen-panel-wide.glb` | Exact file copy |
| `Models/GLB format/warning-traffic.glb` | `public/assets/kaiju-qa/models/lab/warning-traffic.glb` | Exact file copy |
| `Models/GLB format/Textures/colormap.png` | `public/assets/kaiju-qa/models/lab/Textures/colormap.png` | Exact file copy; shared external texture referenced by all 15 Kenney GLBs |

## Azure FLUX backdrop

Local output: `public/assets/kaiju-qa/textures/lab-backdrop.png`

- Project generation date: **2026-07-20**.
- Recovered request timestamp: 2026-07-21 00:07:30Z; file write completed
  2026-07-21 00:07:43Z after the project session crossed UTC midnight.
- Provider path: Azure AI Foundry, Black Forest Labs provider endpoint.
- Exact model: `FLUX.2-pro`.
- Request: 1536 × 1024, `n: 1`; no seed or reference image was supplied.
- Storage method: direct base64 decode of `response.data[0].b64_json`; no
  post-generation crop, paint, or compression step was recorded.
- File-format caveat: the provider response is a 1536 × 1024 **JPEG byte
  stream**, although the existing runtime filename has a `.png` extension.
  The filename is retained to avoid changing gameplay paths.
- SHA-256:
  `8023c70fa67eb53f81a8e825b39a013034f26d5dea31c2537fb00400c2603b8d`.

Exact recovered prompt:

```text
Use case: stylized-concept. Asset type: wide environmental backdrop texture for a WebXR tabletop game. Create a polished cinematic miniature robotics safety laboratory background, viewed from a slightly elevated desk-height camera. Soft-focus shelves with colorful storage bins, articulated white robot arms at the left and right edges, warm practical lamps, teal instrument glow, subtle dust motes, premium stop-motion animated-film lighting, believable depth and soft shadows. Leave the center relatively calm and dark so a bright 3D tabletop city and cute kaiju remain readable in front. No characters, no monsters, no UI, no letters, no logos, no watermark, no readable text, no weapons. Wide 3:2 composition, seamless-feeling edges, high-end game environment concept quality.
```

The exact request is proven, but the provider-terms snapshot, response metadata,
and seed were not preserved. Treat this image as optional non-XR decorative or
marketing art. Prefer the modeled CC0 lab props for immersive XR, and do not use
the backdrop as interaction, safety, or gameplay-critical information.

## License artifacts

| Source record | Local output | Method/date | Status |
| --- | --- | --- | --- |
| Factory Kit `License.txt` | `public/assets/kaiju-qa/licenses/kenney-factory-kit-CC0.txt` | Exact copy, 2026-07-21 | Vendor CC0 record |
| Cars `License.txt` | `public/assets/kaiju-qa/licenses/quaternius-cars-CC0.txt` | Exact copy, 2026-07-21 | Vendor CC0 record |
| Ultimate Monsters `License.txt` | `public/assets/kaiju-qa/licenses/quaternius-ultimate-monsters-CC0.txt` | Exact copy, 2026-07-21 | Vendor CC0 text with the header mismatch noted above |
| Official Simple Buildings pack/license pages and selected-file list | `public/assets/kaiju-qa/licenses/quaternius-simple-buildings-CC0.txt` | Project provenance record, 2026-07-21 | Supplements the absent bundled record; clearly marked non-vendor |

## Converted-source checksums

These are the inputs that produced the eight Quaternius GLBs:

```text
d7c57a4ad6444f9c845ecdc13782a7430fcb377594a00f719cd2d37b9434b6de  1211215  ultimate-monsters/Dino.gltf
817348b386d5e43ca4613490f0da22edaa0193adb4fba9f33c826ed8cd6b9535   107244  simple-buildings/Hospital.fbx
bd94cbee2733bccc8dab5f4cb0b316bafa908e127e4552874b5a1623f1227f9c    52764  simple-buildings/Flat.fbx
b6125190760ddb78753594c329ab0f75b641dc90e56c01703ddabda08c038675    80892  simple-buildings/House.fbx
47f36b4fe832973e2f473df8993c6676bf4f2db63d52b94b5d2d5b5ee028e1b8    41164  simple-buildings/Shop.fbx
61ae9bd52c3217738ae633444eec3435f244690d95ae0807d4dd7ca8d3be14fb    72732  cars/NormalCar1.fbx
7c3769a955ab0cb628d4225a6a1695593d5e011649e8e0455c79014aa7691749    78076  cars/SUV.fbx
711f27060ce6dcc7a22075d9acc840df890cf37dd0fa8eb587d21df14d040e9c    79948  cars/Cop.fbx
```

## Shipped-file SHA-256 manifest

```text
61e86565dd297e143ad631594980eda0a17fc81a4cd7c6d71acf2f5e0cad30b6      700  public/assets/kaiju-qa/licenses/kenney-factory-kit-CC0.txt
83d8959f9fc56353ed571fbe2dc52e4bcd64508e2399501cd45ac2ce3df0bf8c      364  public/assets/kaiju-qa/licenses/quaternius-cars-CC0.txt
7e0cb89d0403dbf874a30b0d368fe6f77269689939b25c30e3f9bc771bd3ad28     1087  public/assets/kaiju-qa/licenses/quaternius-simple-buildings-CC0.txt
de990ef6fc68cffd7fd1ae342c4d0c823b541b8848d8f76bca5d3339f4de6f6e      374  public/assets/kaiju-qa/licenses/quaternius-ultimate-monsters-CC0.txt
d2000d879ce7172fdc545b010f4486c2035f87fb0564a797d95d56b9a9e40b44   744608  public/assets/kaiju-qa/models/characters/kaiju.glb
e0447f5c02fef3b6d22c28a4e8377c1618c169dd40fa7411754a4e610a7b9d77   101088  public/assets/kaiju-qa/models/city/flat.glb
34ed28baf99708ba402d2d65ba7b9e2616384a273b0f9dbcc0ca48aeade2d5ea   238544  public/assets/kaiju-qa/models/city/hospital.glb
fe0356be0f3a5a7af40a02849d6fe0517c4cff028c27df60f431e32fd28fff40   273256  public/assets/kaiju-qa/models/city/house.glb
ef2f62f1d51172a2f0bbbefca4aee6a92f196d5131763dc06047c4803b38dbae    95920  public/assets/kaiju-qa/models/city/shop.glb
9911e222d9df10a218c2ef8cca6148ae612237592ee45aafe18257d378b2fcde     5404  public/assets/kaiju-qa/models/lab/arrow-rounded.glb
154e93fa4613e5fcec4c0c4804ff3d0e4422b638385e1b9e08a6c39b9cd5fd5f    14628  public/assets/kaiju-qa/models/lab/button-floor-round.glb
b70cb142382c89ac028d443005658dbc2e45a909740bf9f17672baf5ac323fca    13660  public/assets/kaiju-qa/models/lab/cog-c.glb
c120efb00c977c69322de43d5209d5ebc9318905042e3dc9f37e0475bbd24dc0    23592  public/assets/kaiju-qa/models/lab/conveyor-stripe.glb
ceaf20fb976ce0415d2b3d40e723b6ad377845818fa4fa68b55434108b1a6880    53396  public/assets/kaiju-qa/models/lab/crane.glb
9ed1d4690e03fd4cafcd30d182b2319cc6c743794a50108332cab9d76a083f6e    16912  public/assets/kaiju-qa/models/lab/crane-magnet.glb
3cd514de3e283705df2baccf7cea62a70ba64e87311252fe26788be4377c0d49     2500  public/assets/kaiju-qa/models/lab/indicator-special-arrow.glb
327b218b7d1954dcc2e5f339ff01eda15e5f8b5c92696fd7956274115f547c09     2856  public/assets/kaiju-qa/models/lab/indicator-special-cross.glb
d7056a698ecb46c972d51848a77c8a9aca86f085cc5800347fce1c19c6c59477    17516  public/assets/kaiju-qa/models/lab/lever-single.glb
1387bd337354fca7c7cb4163e6bd4bef8711373bbe23dae01ba9d42cd35681b7    38812  public/assets/kaiju-qa/models/lab/machine-window.glb
ad3f766791adadd1cfb5ccc27d2b2ac8787848282f2a15b3c407f350dc281b68    50592  public/assets/kaiju-qa/models/lab/robot-arm-a.glb
0563cb35d985d4de73b8f07f9e0c16bbac76784e09a5753e4f6d9b77bdc8e163    44524  public/assets/kaiju-qa/models/lab/robot-arm-b.glb
0baa337bc3c653522ce01baa09cc02b8810640225e823fe735dc8e4167a7913b    22192  public/assets/kaiju-qa/models/lab/scanner-low.glb
092066a198f1f81c857ceab23497dd3ea6066d261a91497cf0f83f7ba951c4d0    16000  public/assets/kaiju-qa/models/lab/screen-panel-wide.glb
35d7bd6900dde0208429eeaec87fa17fbf024ed59f3f4eab54bc92802eba9dd7    11813  public/assets/kaiju-qa/models/lab/Textures/colormap.png
b231e97424839b252e80555bc97d7360d2f04006cb3919675725a297bae049cd    18192  public/assets/kaiju-qa/models/lab/warning-traffic.glb
fd73c05f3f6e85e290efcfe0fce808bbc480cc3e1786959559bf4ac2f8583236   158404  public/assets/kaiju-qa/models/vehicles/car.glb
36dd9e0f9fa8b8bf4a8fd5f9eddd7752b017d75e5b2f60b7b86f91ecfd82253e   211160  public/assets/kaiju-qa/models/vehicles/emergency.glb
1a8c8985e366efdac4c8b5ec4b7c49c7f70e2bb1944f7ba55b466cec352581f5   213276  public/assets/kaiju-qa/models/vehicles/suv.glb
8023c70fa67eb53f81a8e825b39a013034f26d5dea31c2537fb00400c2603b8d   747439  public/assets/kaiju-qa/textures/lab-backdrop.png
```

## Validation performed

On 2026-07-21, all 23 GLBs were checked for non-zero size, glTF 2 magic and
version, declared-length agreement, readable JSON chunks, valid BIN chunk
bounds, at least one mesh and node, and resolvable external buffer/image URIs.
All passed. The eight Quaternius GLBs are self-contained. The 15 Kenney GLBs
all resolve `Textures/colormap.png`; no dependency is missing.

The 15 Kenney GLBs and shared colormap were also checked byte-for-byte against
the extracted Factory Kit sources. SHA-256 values matched. The prep script
passes Python bytecode compilation and its argument path loads successfully in
Blender 4.4.0. This is a structural/readability check, not a substitute for a
full Khronos conformance-validator report.
