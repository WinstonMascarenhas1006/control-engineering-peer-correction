# Script to push after creating the repository on GitHub

Write-Host "=== Push to GitHub ===" -ForegroundColor Cyan
Write-Host ""

$repoUrl = "https://github.com/WinstonMascarenhas1006/control-engineering-peer-correction.git"

Write-Host "Make sure you've created the repository first!" -ForegroundColor Yellow
Write-Host "Repository URL: $repoUrl" -ForegroundColor White
Write-Host ""

# Set remote
Write-Host "Setting remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $repoUrl

Write-Host "Remote configured: $repoUrl" -ForegroundColor Green
Write-Host ""

# Try to push
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/WinstonMascarenhas1006/control-engineering-peer-correction" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "✗ Push failed. Possible reasons:" -ForegroundColor Red
    Write-Host "  1. Repository not created yet - Create it at: https://github.com/new" -ForegroundColor Yellow
    Write-Host "  2. Authentication issue - You may need a Personal Access Token" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "If authentication fails, get a token from:" -ForegroundColor Cyan
    Write-Host "https://github.com/settings/tokens" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run:" -ForegroundColor Cyan
    Write-Host "git push https://YOUR_TOKEN@github.com/WinstonMascarenhas1006/control-engineering-peer-correction.git main" -ForegroundColor White
}

