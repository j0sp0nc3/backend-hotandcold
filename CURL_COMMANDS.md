# 📝 Ejemplos CURL - Testing Backend HotAndCold

## 🚀 Iniciar Servidor

```bash
cd c:\MigracionRepos\backend-hotandcold
node index.js
```

---

## 1️⃣ Registrar Usuario

### PowerShell:
```powershell
$body = @{
    username = "usuario1"
    password = "pass123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### CURL:
```bash
curl -X POST http://localhost:3000/api/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"usuario1\",\"password\":\"pass123\"}"
```

---

## 2️⃣ Login

### PowerShell:
```powershell
$body = @{
    username = "usuario1"
    password = "pass123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### CURL:
```bash
curl -X POST http://localhost:3000/api/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"usuario1\",\"password\":\"pass123\"}"
```

---

## 3️⃣ Enviar Cotización

### PowerShell:
```powershell
$body = @{
    nombre = "Juan"
    apellido = "Pérez"
    email = "juan@example.com"
    telefono = "123456789"
    direccion = "Calle Principal 123"
    rol = "cliente"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/contact" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### CURL:
```bash
curl -X POST http://localhost:3000/api/contact ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Juan\",\"apellido\":\"Pérez\",\"email\":\"juan@example.com\",\"telefono\":\"123456789\",\"direccion\":\"Calle Principal 123\",\"rol\":\"cliente\"}"
```

---

## 4️⃣ Mensaje Footer

### PowerShell:
```powershell
$body = @{
    nombre = "María"
    apellido = "García"
    email = "maria@example.com"
    telefono = "987654321"
    mensaje = "Hola, me interesa saber más"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/contact-footer" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### CURL:
```bash
curl -X POST http://localhost:3000/api/contact-footer ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"María\",\"apellido\":\"García\",\"email\":\"maria@example.com\",\"telefono\":\"987654321\",\"mensaje\":\"Hola, me interesa saber más\"}"
```

---

## ✅ Respuestas Esperadas

**Registro exitoso:**
```json
{
  "message": "Usuario registrado con éxito"
}
```

**Login exitoso:**
```json
{
  "message": "Login exitoso",
  "username": "usuario1"
}
```

**Contacto enviado:**
```json
{
  "message": "Mensaje enviado y cotización guardada correctamente"
}
```

---

## 🧪 Script de Prueba Completo

```powershell
$BaseURL = "http://localhost:3000"
$User = "testuser_$(Get-Random)"
$Pass = "pass123"

Write-Host "🧪 Probando Endpoints`n" -ForegroundColor Cyan

# Registro
Write-Host "1. Registrando..." -ForegroundColor Yellow
$body = @{ username = $User; password = $Pass } | ConvertTo-Json
try {
    Invoke-WebRequest -Uri "$BaseURL/api/register" -Method Post `
      -ContentType "application/json" -Body $body | Out-Null
    Write-Host "✅ Registro OK`n" -ForegroundColor Green
} catch { Write-Host "❌ Error: $_`n" -ForegroundColor Red }

# Login
Write-Host "2. Login..." -ForegroundColor Yellow
$body = @{ username = $User; password = $Pass } | ConvertTo-Json
try {
    Invoke-WebRequest -Uri "$BaseURL/api/login" -Method Post `
      -ContentType "application/json" -Body $body | Out-Null
    Write-Host "✅ Login OK`n" -ForegroundColor Green
} catch { Write-Host "❌ Error: $_`n" -ForegroundColor Red }

# Contacto
Write-Host "3. Contacto..." -ForegroundColor Yellow
$body = @{
    nombre = "Test"
    apellido = "User"
    email = "test@example.com"
    telefono = "123456789"
    direccion = "Test St 123"
    rol = "cliente"
} | ConvertTo-Json
try {
    Invoke-WebRequest -Uri "$BaseURL/api/contact" -Method Post `
      -ContentType "application/json" -Body $body | Out-Null
    Write-Host "✅ Contacto OK`n" -ForegroundColor Green
} catch { Write-Host "❌ Error: $_`n" -ForegroundColor Red }

Write-Host "✅ Pruebas completadas" -ForegroundColor Cyan
```
