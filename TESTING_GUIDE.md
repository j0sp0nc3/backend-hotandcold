# 🧪 GUÍA DE TESTING - Backend Hot and Cold

## Descripción

Test suite unificado para validar endpoints de autenticación y contacto del backend.

## Archivos de Testing

### test-suite.js
Test suite principal escrito en Node.js puro (sin dependencias externas)
- Pruebas de autenticación (registro, login)
- Pruebas de contacto (cotizaciones, mensajes)
- Pruebas de conexión
- Output coloreado y detallado

### test-runner.ps1
Script PowerShell para ejecutar los tests de forma conveniente
- Parámetros: Server, Mode
- Manejo de colores y logging
- Validación de configuración

## Uso

### Opción 1: Node.js directo

```powershell
# Test completo en servidor de producción
node test-suite.js 3000 full

# Test de autenticación en servidor de testing
node test-suite.js 3001 auth

# Test de contacto
node test-suite.js 3000 contact
```

### Opción 2: PowerShell script

```powershell
# Test completo en servidor de producción (predeterminado)
.\test-runner.ps1

# Test en servidor de testing
.\test-runner.ps1 -Server testing

# Test solo de autenticación
.\test-runner.ps1 -Mode auth

# Combinados
.\test-runner.ps1 -Server testing -Mode contact
```

## Modos de Test

### `full` (predeterminado)
Ejecuta todos los tests:
- Tests de conexión
- Tests de autenticación
- Tests de contacto

### `auth`
Solo tests de autenticación:
- Registro de usuario válido
- Registro de usuario duplicado
- Registro sin campos requeridos
- Login con credenciales válidas
- Login con contraseña incorrecta
- Login con usuario no existente

### `contact`
Solo tests de contacto:
- Cotización válida
- Cotización sin campos requeridos
- Mensaje de contacto válido
- Mensaje sin campos requeridos

## Servidores

### Producción (puerto 3000)
```bash
node index.js
```

Luego ejecutar:
```powershell
.\test-runner.ps1 -Server production
```

### Testing (puerto 3001)
```bash
node test-server.js
```

Luego ejecutar:
```powershell
.\test-runner.ps1 -Server testing
```

## Resultados

El test suite proporciona:

1. **Output Coloreado**
   - ✓ Verde: Tests pasados
   - ✗ Rojo: Tests fallados
   - ℹ Amarillo: Información

2. **Resumen Final**
   - Total de tests
   - Tests pasados/fallados
   - Errores detallados

3. **Código de Salida**
   - 0: Todos los tests pasaron
   - 1: Algún test falló

## Ejemplos

### Ejecutar tests en servidor de producción

```powershell
PS> .\test-runner.ps1

╔════════════════════════════════════════╗
║  BACKEND TEST SUITE - Hot and Cold API  ║
╚════════════════════════════════════════╝

Puerto: 3000 | Modo: full | Timeout: 30000ms

🔌 TESTS DE CONEXIÓN

  Servidor está activo en http://localhost:3000 ... ✓

🔐 TESTS DE AUTENTICACIÓN

  Registrar usuario válido ... ✓
  Registrar usuario duplicado debe fallar ... ✓
  Registrar sin username debe fallar ... ✓
  Login con credenciales válidas ... ✓
  Login con contraseña incorrecta debe fallar ... ✓
  Login con usuario no existente debe fallar ... ✓

📧 TESTS DE CONTACTO

  Enviar cotización válida ... ✓
  Cotización sin nombre debe fallar ... ✓
  Enviar mensaje de contacto válido ... ✓
  Mensaje sin email debe fallar ... ✓

RESUMEN
Total: 13
Pasaron: 13
Fallaron: 0

✓ TODOS LOS TESTS PASARON
```

### Ejecutar solo tests de autenticación

```powershell
PS> .\test-runner.ps1 -Mode auth

...
Total: 7
Pasaron: 7
Fallaron: 0

✓ TODOS LOS TESTS PASARON
```

### Ejecutar en servidor de testing

```powershell
PS> .\test-runner.ps1 -Server testing

Puerto: 3001 | Modo: full | Timeout: 30000ms
...
```

## Solución de Problemas

### "No se puede conectar al servidor"
- Asegúrate de que el servidor esté corriendo en el puerto correcto
- Verifica con `netstat -ano | findstr :3000` (Windows) o `lsof -i :3000` (Unix)

### "Timeout después de 30000ms"
- El servidor está tardando demasiado en responder
- Aumenta el timeout modificando `TEST_TIMEOUT` en test-suite.js

### "Algunos tests fallaron"
- Revisa los errores detallados en el output
- Verifica que Firebase esté configurado correctamente
- Verifica las variables de entorno en .env

## Integración CI/CD

Para usar en CI/CD (GitHub Actions, etc.):

```bash
# Instalar dependencias
npm install

# Iniciar servidor en background
node index.js &

# Ejecutar tests
node test-suite.js 3000 full
```

## Archivos Eliminados

Los siguientes archivos de testing **obsoletos** han sido eliminados en favor de test-suite.js:
- ❌ run-tests.ps1 (reemplazado por test-runner.ps1)
- ❌ test-api.js (funcionalidad integrada en test-suite.js)
- ❌ test-endpoints.ps1 (reemplazado por test-runner.ps1)
- ❌ test-curl.bat (reemplazado por test-suite.js)
- ❌ CURL_COMMANDS.md (ver ejemplos en section siguiente)

## Ejemplos Manual con CURL

Si prefieres hacer requests manuales:

### Registro

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Cotización

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Juan",
    "apellido":"Pérez",
    "email":"juan@example.com",
    "telefono":"+56912345678",
    "direccion":"Calle Test 123",
    "rol":"cliente"
  }'
```

### Mensaje de Contacto

```bash
curl -X POST http://localhost:3000/api/contact-footer \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"María",
    "apellido":"García",
    "email":"maria@example.com",
    "telefono":"+56987654321",
    "mensaje":"Mensaje de prueba"
  }'
```

## Estadísticas

### Antes (4+ archivos de testing)
- run-tests.ps1: 50 líneas
- test-api.js: 68 líneas
- test-endpoints.ps1: 200+ líneas
- test-curl.bat: 100+ líneas
- **Total: 420+ líneas dispersas**

### Después (2 archivos unificados)
- test-suite.js: 400+ líneas (todo integrado)
- test-runner.ps1: 60 líneas
- **Total: 460 líneas, pero funcionalidad centralizada**

### Beneficios
✓ Código centralizado y mantenible
✓ Sin dependencias externas
✓ Output coloreado y profesional
✓ Fácil integración en CI/CD
✓ Documentación clara
