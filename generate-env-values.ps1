# PowerShell script to generate environment variable values

Write-Host "`n=== Environment Variable Value Generator ===" -ForegroundColor Cyan
Write-Host ""

# Generate ADMIN_SECRET
Write-Host "1. ADMIN_SECRET (Generated):" -ForegroundColor Yellow
$adminSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
Write-Host "   $adminSecret" -ForegroundColor Green
Write-Host ""

# ADMIN_USERNAME
Write-Host "2. ADMIN_USERNAME:" -ForegroundColor Yellow
Write-Host "   71791" -ForegroundColor Green
Write-Host ""

# ADMIN_PASSWORD
Write-Host "3. ADMIN_PASSWORD:" -ForegroundColor Yellow
Write-Host "   71791" -ForegroundColor Green
Write-Host "   (Change this to a strong password in production!)" -ForegroundColor Yellow
Write-Host ""

# DATABASE_URL
Write-Host "4. DATABASE_URL:" -ForegroundColor Yellow
Write-Host "   You need to create a PostgreSQL database first:" -ForegroundColor White
Write-Host "   - Option 1: Vercel Postgres (in your Vercel project)" -ForegroundColor Gray
Write-Host "   - Option 2: Neon (https://neon.tech) - Free" -ForegroundColor Gray
Write-Host "   - Option 3: Supabase (https://supabase.com) - Free" -ForegroundColor Gray
Write-Host "   - Option 4: Railway (https://railway.app) - Free" -ForegroundColor Gray
Write-Host "   Then copy the connection string they provide." -ForegroundColor White
Write-Host ""

# NEXT_PUBLIC_APP_URL
Write-Host "5. NEXT_PUBLIC_APP_URL:" -ForegroundColor Yellow
Write-Host "   https://control-engineering-peer-correction.vercel.app" -ForegroundColor Green
Write-Host "   (Update this after first deployment with your actual Vercel URL)" -ForegroundColor Yellow
Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Copy these values to Vercel Environment Variables:" -ForegroundColor White
Write-Host ""
Write-Host "ADMIN_SECRET=$adminSecret" -ForegroundColor Green
Write-Host "ADMIN_USERNAME=71791" -ForegroundColor Green
Write-Host "ADMIN_PASSWORD=71791" -ForegroundColor Green
Write-Host "DATABASE_URL=<get from database provider>" -ForegroundColor Yellow
Write-Host "NEXT_PUBLIC_APP_URL=https://control-engineering-peer-correction.vercel.app" -ForegroundColor Green
Write-Host ""
Write-Host "See GET_ENV_VALUES.md for detailed instructions`n" -ForegroundColor Cyan

