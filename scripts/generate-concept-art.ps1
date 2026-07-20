param(
    [string]$ManifestPath = "docs/design/game-concepts/assets/IMAGE_MANIFEST.md",
    [string]$OutputDirectory = "tmp/pdfs/flux",
    [int]$Width = 1344,
    [int]$Height = 768,
    [string[]]$Ids,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

$endpoint = "https://azureopenaigentest1.services.ai.azure.com/providers/blackforestlabs/v1/flux-2-pro?api-version=preview"
$apiKey = $env:AZURE_API_KEY
if (-not $apiKey) {
    $apiKey = [Environment]::GetEnvironmentVariable("AZURE_API_KEY", "User")
}
if (-not $apiKey) {
    $apiKey = [Environment]::GetEnvironmentVariable("AZURE_OPENAI_API_KEY", "User")
}
if (-not $apiKey) {
    throw "AZURE_API_KEY or AZURE_OPENAI_API_KEY is not available."
}

$manifest = Get-Content -LiteralPath $ManifestPath -Raw -Encoding UTF8
$pattern = '(?ms)^##\s+(?<id>\d{2})\s+-\s+(?<title>.+?)\r?$.*?^Prompt:\s*\r?$\s*^>\s+(?<prompt>.+?)\r?$'
$matches = [regex]::Matches($manifest, $pattern)
if ($matches.Count -eq 0) {
    throw "No image prompts were found in $ManifestPath."
}

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

$headers = @{
    Authorization  = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

foreach ($match in $matches) {
    $id = $match.Groups["id"].Value
    if ($Ids -and $id -notin $Ids) {
        continue
    }
    $title = $match.Groups["title"].Value.Trim()
    $prompt = $match.Groups["prompt"].Value.Trim()
    $outputPath = Join-Path $OutputDirectory "$id.png"

    if ((Test-Path -LiteralPath $outputPath) -and -not $Force) {
        Write-Host "Skipping existing $outputPath"
        continue
    }

    Write-Host "Generating $id - $title"
    $body = @{
        prompt = $prompt
        model  = "FLUX.2-pro"
        width  = $Width
        height = $Height
        n      = 1
    } | ConvertTo-Json -Compress

    $response = Invoke-RestMethod -Method Post -Uri $endpoint -Headers $headers -Body $body
    $base64 = $response.data[0].b64_json
    if (-not $base64) {
        throw "Azure FLUX returned no image data for plate $id."
    }

    $bytes = [Convert]::FromBase64String($base64)
    [IO.File]::WriteAllBytes((Join-Path (Get-Location) $outputPath), $bytes)
    Write-Host "Saved $outputPath ($($bytes.Length) bytes)"
}
