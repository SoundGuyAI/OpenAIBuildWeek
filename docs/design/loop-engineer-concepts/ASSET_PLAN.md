# Free 3D asset plan

No third-party pack is downloaded or redistributed in this design branch. This
file records candidates so the selected four-hour build can begin with a
license-first shortlist and still fall back to primitive geometry.

## License policy

Quaternius states that its models are under **CC0**, may be used in commercial,
educational, and personal projects without attribution, and may be modified.
Credit is still recommended as good project hygiene.

- Official FAQ/license statement: <https://quaternius.com/faq.html>
- CC0 legal tool: <https://creativecommons.org/publicdomain/zero/1.0/>
- Asset index: <https://quaternius.com/>

Before importing any pack, preserve its downloaded license/readme, record the
pack URL and download date, inspect file size and formats, and verify that no
third-party trademarks or unrelated content are included.

## Candidate packs by concept

| Concept | Candidate pack | Intended use | Source |
| --- | --- | --- | --- |
| Stormglass | Ships | Courier airship placeholder | <https://quaternius.com/packs/ships.html> |
| Stormglass | Fantasy Props MegaKit | Brass table, levers, lenses, set dressing | <https://quaternius.com/packs/fantasypropsmegakit.html> |
| Stormglass | Ultimate Modular Ruins | Sky-lighthouse shell | <https://quaternius.com/packs/ultimatemodularruins.html> |
| Stormglass | Ultimate Stylized Nature | Layered rock/cloud silhouettes if suitable | <https://quaternius.com/packs/ultimatestylizednature.html> |
| Tomorrow Garden | Ultimate Crops | Plants and growth-state stand-ins | <https://quaternius.com/packs/ultimatecrops.html> |
| Tomorrow Garden | Stylized Nature MegaKit | Terrarium foliage | <https://quaternius.com/packs/stylizednaturemegakit.html> |
| Tomorrow Garden | Simple Nature | Lightweight fallback foliage | <https://quaternius.com/packs/simplenature.html> |
| Tomorrow Garden | Animated Robot | Gardener character | <https://quaternius.com/packs/animatedrobot.html> |
| Kaiju QA | Ultimate Monsters | Cooperative kaiju candidate | <https://quaternius.com/packs/ultimatemonsters.html> |
| Kaiju QA | Cute Monsters | Lower-detail kaiju candidate | <https://quaternius.com/packs/cutemonsters.html> |
| Kaiju QA | Simple Buildings | Fast miniature test city | <https://quaternius.com/packs/simplebuildings.html> |
| Kaiju QA | Downtown City Mega Kit | Optional richer city silhouettes | <https://quaternius.com/packs/downtowncitymegakit.html> |
| Kaiju QA | Cars | Stalled car and ambulance scenarios | <https://quaternius.com/packs/cars.html> |
| Kaiju QA | Turret Pack | Reusable lab/test fixtures, not weapons | <https://quaternius.com/packs/turretpack.html> |
| Sunrise Express | Modular Train | Hero train and cars | <https://quaternius.com/packs/modulartrain.html> |
| Sunrise Express | Public Transport | Alternate transit props | <https://quaternius.com/packs/publictransport.html> |
| Sunrise Express | Modular Streets | City and track-adjacent dressing | <https://quaternius.com/packs/modularstreets.html> |
| Sunrise Express | Buildings | Skyline silhouettes | <https://quaternius.com/packs/buildings.html> |
| Museum of Almosts | Furniture | Gallery pedestals and room dressing | <https://quaternius.com/packs/furniture.html> |
| Museum of Almosts | Ultimate Furniture | Alternate interior props | <https://quaternius.com/packs/ultimatefurniture.html> |
| Museum of Almosts | Fantasy Props MegaKit | Test crank and restoration tools | <https://quaternius.com/packs/fantasypropsmegakit.html> |

## Four-hour import rules

- Download only the selected concept's minimum pack subset.
- Prefer glTF/GLB when available; otherwise convert once and document the tool.
- Keep one atlas/material per pack when practical.
- Do not introduce physics colliders solely because a source asset includes
  them.
- Create gameplay entities through IWSDK world transforms and Interactable
  components; never drop raw models directly into the scene.
- Dispose permanently removed GPU resources.
- If import, animation, or licensing takes more than 20 minutes, use primitives
  and preserve the complete game loop.
- Record every retained asset and license in the final README.

## Generated concept art

The Azure FLUX.2-pro images in this folder are proposal visuals, not game assets
or final screenshots. Do not imply that they depict implemented gameplay. The
final Devpost submission should replace them with real captures wherever
possible.
