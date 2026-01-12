# 📝 Ejemplos de CURL para Testing Backend

## 🚀 Iniciar el Servidor

```bash
cd c:\MigracionRepos\backend-hotandcold
node index.js
```

---

## 1️⃣ Registrar un nuevo usuario

### CURL (CMD):
```bash
curl -X POST http://localhost:3000/api/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"usuario1\",\"password\":\"pass123\"}"
```

### CURL (PowerShell):
```powershell
curl.exe -X POST http://localhost:3000/api/register `
  -H "Content-Type: application/json" `
  -d '{"username":"usuario1","password":"pass123"}'
```

### PowerShell Invoke-WebRequest:
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

---

## 2️⃣ Login

### CURL (CMD):
```bash
curl -X POST http://localhost:3000/api/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"usuario1\",\"password\":\"pass123\"}"
```

### CURL (PowerShell):
```powershell
curl.exe -X POST http://localhost:3000/api/login `
  -H "Content-Type: application/json" `
  -d '{"username":"usuario1","password":"pass123"}'
```

### PowerShell Invoke-WebRequest:
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

---

## 3️⃣ Enviar formulario de contacto

### CURL (CMD):
```bash
curl -X POST http://localhost:3000/api/contact ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Juan\",\"apellido\":\"Pérez\",\"email\":\"juan@example.com\",\"telefono\":\"123456789\",\"direccion\":\"Calle Principal 123\",\"rol\":\"cliente\"}"
```

### CURL (PowerShell):
```powershell
curl.exe -X POST http://localhost:3000/api/contact `
  -H "Content-Type: application/json" `
  -d '{"nombre":"Juan","apellido":"Pérez","email":"juan@example.com","telefono":"123456789","direccion":"Calle Principal 123","rol":"cliente"}'
```

### PowerShell Invoke-WebRequest:
```powershell
$body = @{
    nombre = "Juan"
    apellido = "Pérez"
  email = "juan@example.com"
  telefono = "1234567890"
  direccion = "Calle Principal 123"
  rol = "cliente"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/contact" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

### Mensaje footer (PowerShell)
$body = @{
  nombre = "María"
  apellido = "García"
  telefono = "9876543210"
  email = "maria@example.com"
  mensaje = "Hola, me interesa el producto"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/contact-footer" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
