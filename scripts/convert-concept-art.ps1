[CmdletBinding()]
param(
    [string]$SourceDirectory = "tmp/pdfs/flux",
    [string]$OutputDirectory = "docs/design/game-concepts/assets/generated",
    [string]$CwebpPath = "cwebp",
    [string]$ExpectedCwebpVersion = "1.5.0"
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

function Get-CwebpVersion {
    param([Parameter(Mandatory = $true)][string]$Executable)

    try {
        $versionText = (& $Executable -version 2>&1 | Out-String).Trim()
    }
    catch {
        throw "Unable to run '$Executable'. Install libwebp $ExpectedCwebpVersion or pass -CwebpPath with the full path to cwebp.exe. $($_.Exception.Message)"
    }

    if ($LASTEXITCODE -ne 0) {
        throw "'$Executable -version' failed with exit code $LASTEXITCODE. Output: $versionText"
    }

    $match = [regex]::Match($versionText, '(?<!\d)(\d+\.\d+\.\d+)(?!\d)')
    if (-not $match.Success) {
        throw "Could not parse the cwebp version from: $versionText"
    }

    return $match.Groups[1].Value
}

function Assert-WebpFile {
    param([Parameter(Mandatory = $true)][string]$Path)

    $stream = [IO.File]::OpenRead($Path)
    try {
        if ($stream.Length -lt 12) {
            throw "Encoder output is too small to be a WebP file: $Path"
        }

        $header = New-Object byte[] 12
        $read = $stream.Read($header, 0, $header.Length)
        $riff = [Text.Encoding]::ASCII.GetString($header, 0, 4)
        $webp = [Text.Encoding]::ASCII.GetString($header, 8, 4)
        if ($read -ne 12 -or $riff -ne "RIFF" -or $webp -ne "WEBP") {
            throw "Encoder output does not contain a valid RIFF/WEBP header: $Path"
        }
    }
    finally {
        $stream.Dispose()
    }
}

$sourceRoot = Resolve-RepositoryPath $SourceDirectory
$outputRoot = Resolve-RepositoryPath $OutputDirectory

if (-not (Test-Path -LiteralPath $sourceRoot -PathType Container)) {
    throw "Concept-art PNG directory does not exist: $sourceRoot. Run scripts/generate-concept-art.ps1 first."
}

$actualVersion = Get-CwebpVersion $CwebpPath
if ($actualVersion -ne $ExpectedCwebpVersion) {
    throw "cwebp version mismatch. Required $ExpectedCwebpVersion, found $actualVersion. Refusing to produce hashes from a different encoder."
}

$plates = [ordered]@{
    "01.png" = "01-systems-agents-strategy.webp"
    "02.png" = "02-perception-evidence-invisible-worlds.webp"
    "03.png" = "03-forces-shadows-folds-scale.webp"
    "04.png" = "04-weather-ecology-light-cycles.webp"
    "05.png" = "05-music-photography-language-improv.webp"
}

$missingInputs = New-Object System.Collections.Generic.List[string]
foreach ($inputName in $plates.Keys) {
    $inputPath = Join-Path $sourceRoot $inputName
    if (-not (Test-Path -LiteralPath $inputPath -PathType Leaf)) {
        $missingInputs.Add($inputPath)
    }
}
if ($missingInputs.Count -gt 0) {
    throw "Missing required FLUX PNG input(s):`n - $($missingInputs -join "`n - ")"
}

New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null

# Every encoder choice is explicit. In particular, -mt is intentionally omitted
# so the pinned encoder runs single-threaded. Metadata is stripped from outputs.
$encoderArguments = @(
    "-quiet",
    "-q", "84",
    "-m", "6",
    "-pass", "10",
    "-alpha_q", "100",
    "-alpha_method", "1",
    "-alpha_filter", "best",
    "-alpha_cleanup",
    "-sns", "50",
    "-f", "0",
    "-segments", "4",
    "-pre", "0",
    "-partition_limit", "0",
    "-sharp_yuv",
    "-exact",
    "-metadata", "none"
)

foreach ($inputName in $plates.Keys) {
    $sourcePath = Join-Path $sourceRoot $inputName
    $destinationPath = Join-Path $outputRoot $plates[$inputName]
    $temporaryPath = "$destinationPath.tmp-$PID"

    Remove-Item -LiteralPath $temporaryPath -Force -ErrorAction SilentlyContinue
    try {
        & $CwebpPath @encoderArguments $sourcePath -o $temporaryPath
        if ($LASTEXITCODE -ne 0) {
            throw "cwebp failed for $sourcePath with exit code $LASTEXITCODE."
        }
        if (-not (Test-Path -LiteralPath $temporaryPath -PathType Leaf)) {
            throw "cwebp reported success but did not create $temporaryPath."
        }

        Assert-WebpFile $temporaryPath
        Move-Item -LiteralPath $temporaryPath -Destination $destinationPath -Force

        $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $destinationPath).Hash.ToLowerInvariant()
        $relativePath = $destinationPath.Substring($repoRoot.Length).TrimStart('\', '/') -replace '\\', '/'
        Write-Host "$hash  $relativePath"
    }
    finally {
        Remove-Item -LiteralPath $temporaryPath -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Converted all five concept-art plates with cwebp $actualVersion."
