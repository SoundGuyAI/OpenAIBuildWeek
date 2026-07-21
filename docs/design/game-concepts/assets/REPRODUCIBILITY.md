# Game-proposal artifact reproducibility

This proposal separates deterministic post-processing from generative-image
provenance. The five checked-in WebP plates can be rebuilt deterministically
from a fixed set of source PNGs when the pinned encoder and settings below are
used. The complete proposal artifact set is then recorded and verified with
SHA-256 hashes.

## Reproducibility boundary

The Azure FLUX.2-pro endpoint used by `scripts/generate-concept-art.ps1` exposes
no documented seed parameter in the request contract used by this project.
The generated PNG pixels are therefore not promised to be bit-reproducible
across separate service calls. Preserve approved PNGs as provenance inputs when
an exact WebP rebuild is required. Generated and derived binaries are
provenance-checked by SHA-256 rather than described as deterministically
regenerable from prompts alone.

The PNG-to-WebP step is deterministic only under the following fixed inputs:

- identical PNG bytes named `01.png` through `05.png`;
- `cwebp` from libwebp `1.5.0` exactly;
- the encoder arguments fixed in `scripts/convert-concept-art.ps1`;
- the stable source-to-destination filename map in that script.

The script deliberately omits `-mt`, strips metadata, uses one temporary file
per output, validates the RIFF/WEBP header, and prints each resulting SHA-256.
It refuses to run with a different `cwebp` version or with any missing input.

## Install the pinned encoder on Windows

Run these commands from the repository root in Windows PowerShell 5.1 or newer.
They install the official libwebp `1.5.0` archive under the repository-local,
untracked `.tools` directory and verify the executable's reported version.

```powershell
$WebPVersion = "1.5.0"
$ToolsDirectory = Join-Path $PWD ".tools"
$Archive = Join-Path $env:TEMP "libwebp-$WebPVersion-windows-x64.zip"
$Uri = "https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-$WebPVersion-windows-x64.zip"

New-Item -ItemType Directory -Force -Path $ToolsDirectory | Out-Null
Invoke-WebRequest -UseBasicParsing -Uri $Uri -OutFile $Archive
Expand-Archive -LiteralPath $Archive -DestinationPath $ToolsDirectory -Force

$Cwebp = Join-Path $ToolsDirectory "libwebp-$WebPVersion-windows-x64\bin\cwebp.exe"
if (-not (Test-Path -LiteralPath $Cwebp -PathType Leaf)) {
    throw "Pinned cwebp executable was not found at $Cwebp"
}
$ReportedVersion = (& $Cwebp -version 2>&1 | Out-String).Trim()
if ($ReportedVersion -notmatch '(?<!\d)1\.5\.0(?!\d)') {
    throw "Expected cwebp 1.5.0, received: $ReportedVersion"
}
```

No Python, Node.js, ImageMagick, or additional PowerShell module is required by
either reproducibility script. `Get-FileHash`, included in Windows PowerShell
5.1 and PowerShell 7, provides SHA-256 hashing.

## Convert the five FLUX PNGs

The generation script writes numbered PNGs to `tmp/pdfs/flux` by default. With
those five approved source files present, run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\convert-concept-art.ps1 `
  -CwebpPath $Cwebp
```

The fixed conversion is equivalent to this command for each mapped input and
output name:

```text
cwebp -quiet -q 84 -m 6 -pass 10 -alpha_q 100 -alpha_method 1 -alpha_filter best -alpha_cleanup -sns 50 -f 0 -segments 4 -pre 0 -partition_limit 0 -sharp_yuv -exact -metadata none INPUT.png -o OUTPUT.webp
```

Stable output names are:

| Source | Repository output |
| --- | --- |
| `01.png` | `01-systems-agents-strategy.webp` |
| `02.png` | `02-perception-evidence-invisible-worlds.webp` |
| `03.png` | `03-forces-shadows-folds-scale.webp` |
| `04.png` | `04-weather-ecology-light-cycles.webp` |
| `05.png` | `05-music-photography-language-improv.webp` |

Custom source and output roots are supported with `-SourceDirectory` and
`-OutputDirectory`, but the five basenames remain fixed.

## Generate and verify SHA-256 provenance

After the proposal source and final PDF are complete, generate the canonical
manifest:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\hash-game-proposal-assets.ps1
```

The default output is
`docs/design/game-concepts/assets/SHA256SUMS`. It contains no timestamp and is
written as lowercase SHA-256 plus repository-relative, forward-slash paths in a
fixed order with UTF-8 (no BOM) and LF line endings. It covers:

- all five generated WebP plates;
- `proposals.json`;
- all five SVG infographics;
- `WEBXR_GAME_PROPOSALS.md`;
- `asset-recommendations.json` and the generated `public/designs/index.html`;
- `output/pdf/webxr-game-concept-proposals.pdf`.

Verify an existing manifest without rewriting it:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\hash-game-proposal-assets.ps1 -Mode Check
```

Verification fails on a missing artifact, malformed line, backslash path,
duplicate path, missing or extra manifest entry, or hash mismatch. Regenerate
`SHA256SUMS` only after an intentional artifact change and review its diff as
part of the proposal change.
