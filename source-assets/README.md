# Kaiju QA source assets

This directory contains the exact downloaded source material used to build the
runtime assets under `public/assets/kaiju-qa/`. The preserved Kaiju source cache
contains 742 files totaling approximately 17.57 MiB. `.gitattributes` disables
text normalization for this cache so downloaded source bytes remain unchanged.

- `kaiju-qa/quaternius/` contains the selected FBX, glTF, texture, and bundled
  license files for the Quaternius Cars, Simple Buildings, and Ultimate Monsters
  packs.
- `kaiju-qa/kenney/factory-kit.zip` is the downloaded Kenney Factory Kit archive.
- `kaiju-qa/kenney/factory-kit-extracted/` is its extracted source tree,
  including `License.txt` and the original FBX/GLB formats.

The committed runtime subset is deliberately much smaller than this source
cache. Regenerate it with Blender using:

```powershell
blender --background --python scripts/prepare-kaiju-qa-assets.py -- `
  --quaternius-source-root source-assets/kaiju-qa/quaternius `
  --kenney-source-root source-assets/kaiju-qa/kenney/factory-kit-extracted `
  --output-root public/assets/kaiju-qa/models
```

See `docs/assets/KAIJU_QA_ASSETS.md` for source URLs, license qualifications,
conversion details, exact selections, and checksums.

## Download helper

The original Google Drive downloads used a disposable Python virtual
environment with the packages pinned in `source-assets/gdown-requirements.txt`.
Create it locally rather than committing machine-specific virtual-environment
binaries:

```powershell
python -m venv .local/gdown-venv
& .\.local\gdown-venv\Scripts\python.exe -m pip install -r source-assets\gdown-requirements.txt
```

The existing local environment was moved to `.local/gdown-venv/` and is ignored
by Git.
