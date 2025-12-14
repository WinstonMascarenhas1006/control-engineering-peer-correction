# PowerShell script to push to GitHub
# Run this after creating the repository on GitHub

Write-Host "=== Push to GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Get repository name
$repoName = Read-Host "Enter your GitHub repository name (e.g., control-engineering-peer-correction)"

if ([string]::IsNullOrWhiteSpace($repoName)) {
    Write-Host "Repository name cannot be empty!" -ForegroundColor Red
    exit 1
}

$remoteUrl = "https://github.com/WinstonMascarenhas1006/$repoName.git"

Write-Host "Setting up remote: $remoteUrl" -ForegroundColor Yellow

# Remove existing remote if any
git remote remove origin 2>$null

# Add remote
git remote add origin $remoteUrl

# Rename branch to main if needed
git branch -M main 2>$null

# Push to GitHub
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository URL: https://github.com/WinstonMascarenhas1006/$repoName" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "✗ Push failed. Make sure:" -ForegroundColor Red
    Write-Host "  1. Repository exists on GitHub: https://github.com/WinstonMascarenhas1006/$repoName" -ForegroundColor Yellow
    Write-Host "  2. You're authenticated with GitHub" -ForegroundColor Yellow
    Write-Host "  3. Repository name is correct" -ForegroundColor Yellow
}

