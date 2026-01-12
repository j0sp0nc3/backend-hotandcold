#!/usr/bin/env powershell
# run-tests.ps1

Write-Host "Iniciando servidor..." -ForegroundColor Cyan

# Iniciar servidor en background
$serverProcess = Start-Process -FilePath "node" -ArgumentList "c:\MigracionRepos\backend-hotandcold\test-server.js" -NoNewWindow -PassThru

Write-Host "Esperando a que el servidor inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "`n" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  EJECUTANDO PRUEBAS DE API" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$BASE_URL = "http://localhost:3000"

# Test 1: Registrar usuario
Write-Host "`nTest 1: POST /api/register" -ForegroundColor Yellow
$username = "testuser_$(Get-Random)"
$body = @{
    username = $username
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
    Write-Host "[OK] Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Login
Write-Host "`nTest 2: POST /api/login" -ForegroundColor Yellow
$body = @{
    username = $username
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
    Write-Host "[OK] Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Stats
Write-Host "`nTest 3: GET /api/stats" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/stats" `
        -Method Get `
        -UseBasicParsing
    Write-Host "[OK] Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Pruebas completadas" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Terminar servidor
Write-Host "Deteniendo servidor..." -ForegroundColor Yellow
Stop-Process -Id $serverProcess.Id -Force
Write-Host "Servidor detenido" -ForegroundColor Green
