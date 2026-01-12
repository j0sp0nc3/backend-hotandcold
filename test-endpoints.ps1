# test-endpoints.ps1
# Script para probar los endpoints del backend

$BASE_URL = "http://localhost:3000"

Write-Host "🧪 Testing API Endpoints" -ForegroundColor Cyan
Write-Host "Base URL: $BASE_URL`n" -ForegroundColor Gray

# Test 1: Registrar usuario
Write-Host "Test 1: POST /api/register" -ForegroundColor Yellow
$body = @{
    username = "testuser_$(Get-Random)"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)`n" -ForegroundColor White
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response.StatusCode)`n" -ForegroundColor Red
}

# Test 2: Login
Write-Host "Test 2: POST /api/login" -ForegroundColor Yellow
$body = @{
    username = "testuser"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)`n" -ForegroundColor White
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Formulario de contacto
Write-Host "Test 3: POST /api/contact" -ForegroundColor Yellow
$body = @{
    nombre = "Juan"
    apellido = "Pérez"
    email = "juan@example.com"
    telefono = "1234567890"
    direccion = "Calle Principal 123"
    rol = "cliente"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/contact" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)`n" -ForegroundColor White
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Mensaje desde footer
Write-Host "Test 4: POST /api/contact-footer" -ForegroundColor Yellow
$body = @{
    nombre = "María"
    apellido = "García"
    telefono = "9876543210"
    email = "maria@example.com"
    mensaje = "Hola, me interesa el producto"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/contact-footer" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)`n" -ForegroundColor White
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "✅ Pruebas completadas" -ForegroundColor Cyan
