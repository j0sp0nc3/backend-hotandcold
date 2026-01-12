# 📦 ANÁLISIS DE DEPENDENCIAS - BACKEND

## DEPENDENCIAS ACTUALES

```json
{
  "bcrypt": "^6.0.0",          ← Encriptación de contraseñas
  "cors": "^2.8.5",             ← CORS para frontend
  "dotenv": "^16.6.1",          ← Variables de entorno
  "express": "^5.1.0",          ← Framework web
  "firebase-admin": "^13.4.0",  ← Conexión a Firebase
  "nodemailer": "^7.0.3"        ← Envío de emails
}
```

---

## ANÁLISIS DE USO

### ✅ DEPENDENCIAS UTILIZADAS

#### 1. **express** (NECESARIA)
- ✅ Usado en: index.js, test-server.js, simple-auth.js
- ✅ Propósito: Framework web principal
- ✅ Status: **MANTENER**

#### 2. **cors** (NECESARIA)
- ✅ Usado en: index.js, test-server.js, simple-auth.js
- ✅ Propósito: Permitir solicitudes desde frontend (localhost:3000)
- ✅ Status: **MANTENER**

#### 3. **firebase-admin** (NECESARIA)
- ✅ Usado en: config/firebaseAdmin.js, export-firestore.js, import-firestore.js
- ✅ Propósito: Conexión a Firestore
- ✅ Status: **MANTENER**

#### 4. **dotenv** (NECESARIA)
- ✅ Usado en: config/firebaseAdmin.js, index.js, test-server.js
- ✅ Propósito: Cargar variables de entorno (.env)
- ✅ Status: **MANTENER**

---

### ⚠️ DEPENDENCIAS CON PROBLEMAS

#### 5. **nodemailer** (PARCIALMENTE USADO)

**Ubicación:**
- Usado en: index.js (líneas 56, 140)

**Problema:**
- Solo se usa en `index.js` para enviar emails al contactar
- NO se usa en `test-server.js` (servidor principal de desarrollo)
- Requiere variables de entorno: `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`

**Riesgo:**
- ⚠️ Si EMAIL_USER o EMAIL_PASS no están configurados → Error
- ⚠️ Dependencia pesada (~1.4MB) para una sola función

**Análisis de uso:**
```javascript
// Función de contacto - 2 lugares en index.js
app.post('/api/contact', async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({ ... });
});

app.post('/api/cotizacion', async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({ ... });
});
```

**Status:** ⚠️ **REVISAR NECESIDAD**

---

#### 6. **bcrypt** (NO UTILIZADO EN CÓDIGO ACTIVO)

**Ubicación:**
- ✅ Usado en: simple-auth.js (líneas 43, 69)
- ❌ NO usado en: index.js, test-server.js

**Problema:**
- Solo en `simple-auth.js` que es un archivo DUPLICADO
- `index.js` y `test-server.js` (servidores principales) NO encriptan contraseñas
- Almacenan contraseñas en texto plano (INSEGURO)

**Análisis:**
```javascript
// simple-auth.js (ARCHIVO REDUNDANTE)
const hashedPassword = await bcrypt.hash(password, 10);
const validPassword = await bcrypt.compare(password, userData.password);

// index.js (SERVIDOR PRINCIPAL - INSEGURO)
usuarios.set(username, { password }); // ❌ Sin encriptación
if (user.password !== password) {     // ❌ Comparación directa
```

**Status:** ⚠️ **NECESARIO PERO USARLO EN SERVIDOR PRINCIPAL**

---

## 📊 RESUMEN

| Dependencia | Usada | Ubicación | Criticidad | Recomendación |
|-------------|-------|-----------|------------|---------------|
| express | ✅ | index.js, test-server.js | CRÍTICA | ✅ Mantener |
| cors | ✅ | Todos los servidores | CRÍTICA | ✅ Mantener |
| firebase-admin | ✅ | config/, export, import | CRÍTICA | ✅ Mantener |
| dotenv | ✅ | config/, index, test | CRÍTICA | ✅ Mantener |
| nodemailer | ⚠️ | index.js solamente | MEDIA | ⚠️ Revisar |
| bcrypt | ⚠️ | simple-auth.js (redundante) | ALTA | 🔧 Integrar a index.js |

---

## 🎯 ACCIONES RECOMENDADAS

### OPCIÓN 1: Mantener nodemailer (Recomendado)
**Condiciones:**
- ✅ Mantener si envío de emails es feature activa
- ✅ Configurar EMAIL_USER, EMAIL_PASS en .env
- ✅ Mantener en package.json

**Action:**
```bash
# Verificar que .env tiene:
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-app
EMAIL_TO=destino@empresa.com
```

### OPCIÓN 2: Eliminar nodemailer (Si no se usa)
**Condiciones:**
- ❌ Si no se usa función de emails
- ❌ Si no tienes credenciales de Gmail

**Action:**
```bash
cd backend-hotandcold
npm uninstall nodemailer
# Comentar/eliminar rutas /api/contact y /api/cotizacion en index.js
git add .
git commit -m "refactor: Eliminar nodemailer - no se usa"
```

---

### OPCIÓN 3: Integrar bcrypt correctamente (RECOMENDADO)
**Problema actual:**
- bcrypt solo en simple-auth.js (archivo que será eliminado)
- index.js y test-server.js guardan contraseñas en texto plano ❌

**Solución:**
```bash
# 1. bcrypt ya está instalado (en simple-auth.js)
# 2. Mover uso de bcrypt a index.js
# 3. Eliminar simple-auth.js
# 4. Actualizar package.json si es necesario

git add .
git commit -m "security: Integrar bcrypt para encriptación de contraseñas en servidor principal"
```

**Código a integrar en index.js:**
```javascript
const bcrypt = require('bcrypt');

// En /api/register
const hashedPassword = await bcrypt.hash(password, 10);
usuarios.set(username, { password: hashedPassword });

// En /api/login
const validPassword = await bcrypt.compare(password, userData.password);
```

---

## 📋 CHECKLIST DE DEPENDENCIAS

### MANTENER (SIN CAMBIOS)
- [x] express
- [x] cors
- [x] firebase-admin
- [x] dotenv

### REVISAR
- [ ] **nodemailer** - ¿Necesitas envío de emails?
  - [ ] SÍ → Mantener, configurar .env
  - [ ] NO → Eliminar con `npm uninstall nodemailer`

### INTEGRAR / MEJORAR
- [ ] **bcrypt** - Mover de simple-auth.js a index.js
  - [ ] Integrar en servidor principal
  - [ ] Eliminar simple-auth.js
  - [ ] Verificar que todas las contraseñas se encriptan

---

## 🔒 RECOMENDACIÓN FINAL

**Hacer 3 cosas:**

1. **Mantener core:** express, cors, firebase-admin, dotenv
   - Sin cambios

2. **Decidir sobre nodemailer:**
   - ¿Usas envío de emails? ✅ MANTENER
   - ¿No lo usas? ❌ ELIMINAR

3. **Integrar bcrypt correctamente:**
   - Mover a index.js (servidor principal)
   - Asegurar contraseñas encriptadas
   - Eliminar simple-auth.js

**Tamaño esperado después:**
```
Antes: ~500MB (con node_modules)
Después (sin nodemailer): ~450MB (si no se usa emails)
       (con nodemailer): ~500MB (si se usa emails)
```

---

## ❓ PREGUNTAS

1. **¿Necesitas envío de emails?**
   - Sí → Mantener nodemailer
   - No → Eliminar nodemailer

2. **¿Tienes configuradas las variables de EMAIL en .env?**
   - Sí → Verificar EMAIL_USER, EMAIL_PASS, EMAIL_TO
   - No → Agregar o eliminar función de emails

3. **¿Deseas integrar bcrypt en el servidor principal?**
   - Sí → Hacerlo en esta fase
   - No → Dejar como está

**Por favor, responde estas preguntas para proceder con las optimizaciones.**

