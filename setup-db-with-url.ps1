# PowerShell script to setup database with DATABASE_URL

Write-Host ""
Write-Host "=== DATABASE SETUP FOR VERCEL ===" -ForegroundColor Cyan
Write-Host ""

# Get DATABASE_URL from user
Write-Host "Please provide your DATABASE_URL from Vercel:" -ForegroundColor Yellow
Write-Host "1. Go to Vercel Dashboard -> Your Project -> Settings -> Environment Variables" -ForegroundColor Gray
Write-Host "2. Copy the DATABASE_URL value" -ForegroundColor Gray
Write-Host "3. Paste it below (or press Enter to skip and create .env.local manually)" -ForegroundColor Gray
Write-Host ""

$dbUrl = Read-Host "DATABASE_URL"

if ([string]::IsNullOrWhiteSpace($dbUrl)) {
    Write-Host ""
    Write-Host "No DATABASE_URL provided. Creating .env.local template..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Get DATABASE_URL from Vercel Dashboard" -ForegroundColor White
    Write-Host "2. Create .env.local file with:" -ForegroundColor White
    Write-Host '   DATABASE_URL="your-connection-string-here"' -ForegroundColor Gray
    Write-Host "3. Run: .\setup-db.ps1" -ForegroundColor White
    exit
}

# Create .env.local file
Write-Host ""
Write-Host "Creating .env.local file..." -ForegroundColor Yellow
"DATABASE_URL=$dbUrl" | Out-File -FilePath ".env.local" -Encoding utf8
Write-Host "[OK] .env.local created" -ForegroundColor Green

# Generate Prisma Client
Write-Host ""
Write-Host "1. Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "   [OK] Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Push schema to database
Write-Host "2. Creating database tables..." -ForegroundColor Cyan
npx prisma db push --accept-data-loss
if ($LASTEXITCODE -eq 0) {
    Write-Host "   [OK] Database tables created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== SUCCESS ===" -ForegroundColor Green
    Write-Host "Your database is now set up. Refresh your admin dashboard!" -ForegroundColor White
    Write-Host ""
    Write-Host "You can now:" -ForegroundColor Cyan
    Write-Host "  - Refresh your admin dashboard (error should be gone)" -ForegroundColor Gray
    Write-Host "  - Register test students from the home page" -ForegroundColor Gray
    Write-Host "  - View them in the admin dashboard" -ForegroundColor Gray
} else {
    Write-Host "   [ERROR] Failed to create database tables" -ForegroundColor Red
    Write-Host "   Check your DATABASE_URL connection string" -ForegroundColor Yellow
    exit 1
}
