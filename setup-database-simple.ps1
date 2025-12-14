# Simple database setup script

Write-Host ""
Write-Host "=== SIMPLE DATABASE SETUP ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get DATABASE_URL
Write-Host "Step 1: Get your DATABASE_URL from Vercel" -ForegroundColor Yellow
Write-Host "  - Go to: https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "  - Click your project: control-engineering-peer-correction" -ForegroundColor Gray
Write-Host "  - Go to: Settings -> Environment Variables" -ForegroundColor Gray
Write-Host "  - Find DATABASE_URL and copy the value" -ForegroundColor Gray
Write-Host ""

$dbUrl = Read-Host "Paste your DATABASE_URL here"

if ([string]::IsNullOrWhiteSpace($dbUrl)) {
    Write-Host ""
    Write-Host "ERROR: DATABASE_URL is required!" -ForegroundColor Red
    Write-Host "Please run this script again and provide your DATABASE_URL" -ForegroundColor Yellow
    exit 1
}

# Step 2: Create .env.local
Write-Host ""
Write-Host "Step 2: Creating .env.local file..." -ForegroundColor Yellow
"DATABASE_URL=$dbUrl" | Out-File -FilePath ".env.local" -Encoding utf8 -NoNewline
Write-Host "[OK] .env.local created" -ForegroundColor Green

# Step 3: Generate Prisma Client
Write-Host ""
Write-Host "Step 3: Generating Prisma Client..." -ForegroundColor Yellow
$result = & npx prisma generate 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Failed to generate Prisma Client" -ForegroundColor Red
    Write-Host $result
    exit 1
}

# Step 4: Create database tables
Write-Host ""
Write-Host "Step 4: Creating database tables..." -ForegroundColor Yellow
Write-Host "This may take a few seconds..." -ForegroundColor Gray
$result = & npx prisma db push --accept-data-loss 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Database tables created!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Refresh your registration page" -ForegroundColor White
    Write-Host "  2. Try registering again - it should work now!" -ForegroundColor White
    Write-Host "  3. Check your admin dashboard - it should load without errors" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "[ERROR] Failed to create database tables" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error output:" -ForegroundColor Yellow
    Write-Host $result
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - Check if DATABASE_URL is correct" -ForegroundColor Gray
    Write-Host "  - Make sure your database is accessible" -ForegroundColor Gray
    Write-Host "  - Check Vercel dashboard for database status" -ForegroundColor Gray
    exit 1
}

