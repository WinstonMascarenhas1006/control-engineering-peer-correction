# PowerShell script to setup database on Vercel

Write-Host "`n=== DATABASE SETUP FOR VERCEL ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✓ Found .env.local file" -ForegroundColor Green
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Host "✓ DATABASE_URL found in .env.local" -ForegroundColor Green
        Write-Host ""
        Write-Host "Running Prisma commands..." -ForegroundColor Yellow
        Write-Host ""
        
        # Generate Prisma Client
        Write-Host "1. Generating Prisma Client..." -ForegroundColor Cyan
        npx prisma generate
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✓ Prisma Client generated" -ForegroundColor Green
        } else {
            Write-Host "   ✗ Failed to generate Prisma Client" -ForegroundColor Red
            exit 1
        }
        
        Write-Host ""
        
        # Push schema to database
        Write-Host "2. Creating database tables..." -ForegroundColor Cyan
        npx prisma db push --accept-data-loss
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✓ Database tables created successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "=== SUCCESS ===" -ForegroundColor Green
            Write-Host "Your database is now set up. Refresh your admin dashboard!" -ForegroundColor White
        } else {
            Write-Host "   ✗ Failed to create database tables" -ForegroundColor Red
            Write-Host "   Check your DATABASE_URL connection string" -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host "✗ DATABASE_URL not found in .env.local" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please:" -ForegroundColor Yellow
        Write-Host "1. Get DATABASE_URL from Vercel Dashboard:" -ForegroundColor White
        Write-Host "   - Go to your Vercel project" -ForegroundColor Gray
        Write-Host "   - Settings → Environment Variables" -ForegroundColor Gray
        Write-Host "   - Copy the DATABASE_URL value" -ForegroundColor Gray
        Write-Host ""
        Write-Host "2. Create .env.local file with:" -ForegroundColor White
        Write-Host "   DATABASE_URL=`"your-connection-string-here`"" -ForegroundColor Gray
        Write-Host ""
        Write-Host "3. Run this script again" -ForegroundColor White
    }
} else {
    Write-Host "✗ .env.local file not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Option 1: Use Vercel CLI (requires login):" -ForegroundColor Yellow
    Write-Host "   vercel login" -ForegroundColor Gray
    Write-Host "   vercel link" -ForegroundColor Gray
    Write-Host "   vercel env pull .env.local" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2: Manual setup:" -ForegroundColor Yellow
    Write-Host "   1. Get DATABASE_URL from Vercel Dashboard" -ForegroundColor White
    Write-Host "   2. Create .env.local file with DATABASE_URL" -ForegroundColor White
    Write-Host "   3. Run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "To get DATABASE_URL:" -ForegroundColor Cyan
    Write-Host "   - Go to Vercel Dashboard → Your Project" -ForegroundColor Gray
    Write-Host "   - Settings → Environment Variables" -ForegroundColor Gray
    Write-Host "   - Copy DATABASE_URL value" -ForegroundColor Gray
}

