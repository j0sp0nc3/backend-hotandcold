# Script para construir y ejecutar el contenedor Docker en Windows
# Con soporte para variables de entorno (Firebase + Email)

Write-Host "`n🐳 Docker Build Script - Hot and Cold Backend" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    Write-Host "📝 Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please edit .env with your credentials:" -ForegroundColor Yellow
    Write-Host "   - FIREBASE_PROJECT_ID" -ForegroundColor Gray
    Write-Host "   - FIREBASE_PRIVATE_KEY" -ForegroundColor Gray
    Write-Host "   - EMAIL_USER (Gmail)" -ForegroundColor Gray
    Write-Host "   - EMAIL_PASS (App password from https://myaccount.google.com/apppasswords)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Run this script again after updating .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ .env file found" -ForegroundColor Green
Write-Host ""

# Check if Docker is running
try {
    docker --version > $null 2>&1
} catch {
    Write-Host "❌ Docker is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Build image
Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
docker build -t hotandcold-backend:latest .

Write-Host "✅ Image built successfully" -ForegroundColor Green
Write-Host ""

# Stop existing container if running
Write-Host "🔍 Checking for existing container..." -ForegroundColor Yellow
$existing = docker ps -a --filter "name=hotandcold-backend" --format "{{.ID}}"
if ($existing) {
    Write-Host "🛑 Stopping existing container..." -ForegroundColor Yellow
    docker stop hotandcold-backend 2> $null
    docker rm hotandcold-backend 2> $null
}

# Run container
Write-Host "🚀 Starting container..." -ForegroundColor Yellow
docker run -d `
    -p 3000:3000 `
    --name hotandcold-backend `
    --env-file .env `
    --restart unless-stopped `
    hotandcold-backend:latest

Write-Host "✅ Container started" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Container status:" -ForegroundColor Cyan
docker ps --filter "name=hotandcold-backend"
Write-Host ""
Write-Host "🔍 View logs:" -ForegroundColor Cyan
Write-Host "   docker logs -f hotandcold-backend" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 Stop container:" -ForegroundColor Cyan
Write-Host "   docker stop hotandcold-backend" -ForegroundColor Gray
Write-Host ""
Write-Host "🗑️  Remove container:" -ForegroundColor Cyan
Write-Host "   docker rm hotandcold-backend" -ForegroundColor Gray
Write-Host ""
