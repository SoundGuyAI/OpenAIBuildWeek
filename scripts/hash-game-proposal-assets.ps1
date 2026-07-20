[CmdletBinding()]
param(
    [ValidateSet("Write", "Check")]
    [string]$Mode = "Write",
    [string]$ManifestPath = "docs/design/game-concepts/assets/SHA256SUMS"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))

function Resolve-RepositoryPath {
    param([Parameter(Mandatory = $true)][string]$Path)

    if ([IO.Path]::IsPathRooted($Path)) {
        return [IO.Path]::GetFullPath($Path)
    }

    return [IO.Path]::GetFullPath((Join-Path $repoRoot $Path))
}

$artifactPaths = @(
    "docs/design/game-concepts/assets/generated/01-systems-agents-strategy.webp",
    "docs/design/game-concepts/assets/generated/02-perception-evidence-invisible-worlds.webp",
    "docs/design/game-concepts/assets/generated/03-forces-shadows-folds-scale.webp",
    "docs/design/game-concepts/assets/generated/04-weather-ecology-light-cycles.webp",
    "docs/design/game-concepts/assets/generated/05-music-photography-language-improv.webp",
    "docs/design/game-concepts/proposals.json",
    "docs/design/game-concepts/infographics/originality-map.svg",
    "docs/design/game-concepts/infographics/platform-braid.svg",
    "docs/design/game-concepts/infographics/scope-risk-matrix.svg",
    "docs/design/game-concepts/infographics/shortlist-funnel.svg",
    "docs/design/game-concepts/infographics/universal-loop.svg",
    "docs/design/game-concepts/WEBXR_GAME_PROPOSALS.md",
    "output/pdf/webxr-game-concept-proposals.pdf"
)

$missingArtifacts = New-Object System.Collections.Generic.List[string]
$currentHashes = [ordered]@{}
foreach ($relativePath in $artifactPaths) {
    $fullPath = Resolve-RepositoryPath $relativePath
    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        $missingArtifacts.Add($relativePath)
        continue
    }

    $currentHashes[$relativePath] = (Get-FileHash -Algorithm SHA256 -LiteralPath $fullPath).Hash.ToLowerInvariant()
}

if ($missingArtifacts.Count -gt 0) {
    throw "Cannot hash an incomplete proposal. Missing artifact(s):`n - $($missingArtifacts -join "`n - ")"
}

$resolvedManifestPath = Resolve-RepositoryPath $ManifestPath

if ($Mode -eq "Write") {
    $manifestDirectory = Split-Path -Parent $resolvedManifestPath
    if (-not (Test-Path -LiteralPath $manifestDirectory -PathType Container)) {
        New-Item -ItemType Directory -Force -Path $manifestDirectory | Out-Null
    }

    $lines = foreach ($relativePath in $artifactPaths) {
        "{0} *{1}" -f $currentHashes[$relativePath], $relativePath
    }

    $temporaryPath = "$resolvedManifestPath.tmp-$PID"
    $utf8WithoutBom = New-Object Text.UTF8Encoding($false)
    try {
        [IO.File]::WriteAllText($temporaryPath, (($lines -join "`n") + "`n"), $utf8WithoutBom)
        Move-Item -LiteralPath $temporaryPath -Destination $resolvedManifestPath -Force
    }
    finally {
        Remove-Item -LiteralPath $temporaryPath -Force -ErrorAction SilentlyContinue
    }

    Write-Host "Wrote $($artifactPaths.Count) SHA-256 entries to $resolvedManifestPath"
    exit 0
}

if (-not (Test-Path -LiteralPath $resolvedManifestPath -PathType Leaf)) {
    throw "Hash manifest does not exist: $resolvedManifestPath. Run this script with -Mode Write first."
}

$manifestHashes = New-Object 'System.Collections.Generic.Dictionary[string,string]' ([StringComparer]::Ordinal)
$lineNumber = 0
foreach ($line in (Get-Content -LiteralPath $resolvedManifestPath -Encoding UTF8)) {
    $lineNumber++
    if ([string]::IsNullOrWhiteSpace($line)) {
        throw "Blank line at $resolvedManifestPath`:$lineNumber. Regenerate the manifest."
    }

    $match = [regex]::Match($line, '^(?<hash>[0-9a-f]{64}) \*(?<path>.+)$')
    if (-not $match.Success) {
        throw "Invalid SHA256SUMS entry at $resolvedManifestPath`:${lineNumber}: $line"
    }

    $relativePath = $match.Groups["path"].Value
    if ($relativePath.Contains('\')) {
        throw "Manifest paths must use forward slashes. Invalid entry at line ${lineNumber}: $relativePath"
    }
    if ($manifestHashes.ContainsKey($relativePath)) {
        throw "Duplicate manifest entry at line ${lineNumber}: $relativePath"
    }

    $manifestHashes.Add($relativePath, $match.Groups["hash"].Value)
}

$failures = New-Object System.Collections.Generic.List[string]
foreach ($relativePath in $artifactPaths) {
    if (-not $manifestHashes.ContainsKey($relativePath)) {
        $failures.Add("missing entry: $relativePath")
        continue
    }
    if ($manifestHashes[$relativePath] -ne $currentHashes[$relativePath]) {
        $failures.Add("hash mismatch: $relativePath")
    }
}

foreach ($relativePath in $manifestHashes.Keys) {
    if ($relativePath -notin $artifactPaths) {
        $failures.Add("unexpected entry: $relativePath")
    }
}

if ($failures.Count -gt 0) {
    throw "Proposal artifact verification failed:`n - $($failures -join "`n - ")"
}

Write-Host "Verified $($artifactPaths.Count) proposal artifacts against $resolvedManifestPath"
