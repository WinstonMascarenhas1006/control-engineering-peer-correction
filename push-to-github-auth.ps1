# PowerShell script to push to GitHub with authentication

Write-Host "=== Push to GitHub ===" -ForegroundColor Cyan
Write-Host ""

$repoUrl = "https://github.com/winstonmascarenhas/control-engineering-peer-correction.git"

Write-Host "Repository: $repoUrl" -ForegroundColor Yellow
Write-Host ""

# Check if already authenticated
Write-Host "Choose authentication method:" -ForegroundColor Cyan
Write-Host "1. Personal Access Token (Recommended)" -ForegroundColor White
Write-Host "2. SSH Key" -ForegroundColor White
Write-Host "3. Try current credentials" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1-3)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Get your Personal Access Token from:" -ForegroundColor Yellow
    Write-Host "https://github.com/settings/tokens" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Select 'repo' scope when creating the token" -ForegroundColor Yellow
    Write-Host ""
    $token = Read-Host "Enter your Personal Access Token" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
    $plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    
    $authUrl = "https://$plainToken@github.com/winstonmascarenhas/control-engineering-peer-correction.git"
    git remote set-url origin $authUrl
    Write-Host "Remote updated with token" -ForegroundColor Green
}
elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "Switching to SSH..." -ForegroundColor Yellow
    git remote set-url origin "git@github.com:winstonmascarenhas/control-engineering-peer-correction.git"
    Write-Host "Remote updated to SSH" -ForegroundColor Green
    Write-Host "Make sure you have SSH key set up in GitHub" -ForegroundColor Yellow
}
else {
    Write-Host ""
    Write-Host "Trying with current credentials..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/winstonmascarenhas/control-engineering-peer-correction" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "✗ Push failed. Try:" -ForegroundColor Red
    Write-Host "  1. Create Personal Access Token: https://github.com/settings/tokens" -ForegroundColor Yellow
    Write-Host "  2. Run this script again and choose option 1" -ForegroundColor Yellow
    Write-Host "  3. Or see GITHUB_AUTH.md for detailed instructions" -ForegroundColor Yellow
}

