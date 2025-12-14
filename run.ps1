# PowerShell script to help run the project
# Run this script: .\run.ps1

Write-Host "=== Peer Correction Lookup - Setup Script ===" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "✗ Node.js not found in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "After installation, restart your terminal and try again." -ForegroundColor Yellow
    exit 1
}

# Check for npm
Write-Host "Checking for npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
    } else {
        throw "npm not found"
    }
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
    exit 1
}

# Check for .env file
Write-Host "Checking for .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .env file exists" -ForegroundColor Green
} else {
    Write-Host "✗ .env file not found. Creating one..." -ForegroundColor Yellow
    @"
DATABASE_URL="postgresql://user:password@localhost:5432/peer_correction?schema=public"
ADMIN_SECRET="dev-secret-key-change-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✓ .env file created" -ForegroundColor Green
}

# Check if node_modules exists
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}

# Check for Docker
Write-Host "Checking for Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "✓ Docker found: $dockerVersion" -ForegroundColor Green
        
        # Check if PostgreSQL container is running
        $containerStatus = docker ps -a --filter "name=peer_correction_db" --format "{{.Status}}" 2>$null
        if ($containerStatus -like "*Up*") {
            Write-Host "✓ PostgreSQL container is running" -ForegroundColor Green
        } else {
            Write-Host "Starting PostgreSQL container..." -ForegroundColor Yellow
            docker-compose up -d
            if ($LASTEXITCODE -ne 0) {
                Write-Host "✗ Failed to start PostgreSQL container" -ForegroundColor Red
                Write-Host "Make sure Docker Desktop is running" -ForegroundColor Yellow
            } else {
                Write-Host "✓ PostgreSQL container started" -ForegroundColor Green
                Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
                Start-Sleep -Seconds 5
            }
        }
    } else {
        throw "Docker not found"
    }
} catch {
    Write-Host "⚠ Docker not found. You'll need to set up PostgreSQL manually." -ForegroundColor Yellow
    Write-Host "Update DATABASE_URL in .env file to point to your PostgreSQL instance." -ForegroundColor Yellow
}

# Generate Prisma Client
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npm run db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Warning: Failed to generate Prisma Client" -ForegroundColor Yellow
}

# Push database schema
Write-Host "Setting up database schema..." -ForegroundColor Yellow
npm run db:push
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Warning: Failed to push database schema" -ForegroundColor Yellow
    Write-Host "Make sure PostgreSQL is running and DATABASE_URL is correct" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Starting Development Server ===" -ForegroundColor Cyan
Write-Host "The application will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the development server
npm run dev

