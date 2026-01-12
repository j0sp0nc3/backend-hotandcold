# ⚡ GUÍA RÁPIDA - Migrar Firebase en 5 minutos

## 🎯 OBJETIVO
Cambiar de un proyecto Firebase a otro **SIN PERDER DATOS**.

---

## 5 PASOS SIMPLES

### ✅ PASO 1: Exportar datos actuales (2 minutos)

```bash
cd c:\MigracionRepos\backend-hotandcold
node export-firestore.js
```

**Resultado:** Se crea archivo `backup_firebase_YYYY-MM-DD.json` con todos tus datos.

---

### ✅ PASO 2: Crear nuevo proyecto Firebase (1 minuto)

1. Ve a: https://console.firebase.google.com
2. Click: "Agregar proyecto"
3. Nombre: `hotandcold-nuevo` (o el que quieras)
4. Espera a que se cree (1-2 minutos)

---

### ✅ PASO 3: Descargar nuevas credenciales (1 minuto)

1. En Firebase Console → Configuración (⚙️)
2. Pestaña: "Cuentas de servicio"
3. Click: "Generar nueva clave privada"
4. Se descarga archivo JSON
5. Copia a: `backend-hotandcold/` con nombre como `hotandcold-nuevo-firebase-adminsdk-XXXXX.json`

---

### ✅ PASO 4: Actualizar backend (1 minuto)

**Edita:** `backend-hotandcold/config/firebaseAdmin.js`

```javascript
// CAMBIAR ESTO:
const serviceAccount = require('../hotandcold-15168-firebase-adminsdk-fbsvc-8f106b30ec.json');
// POR ESTO:
const serviceAccount = require('../hotandcold-nuevo-firebase-adminsdk-XXXXX.json');//c:\Users\HP\Downloads\hotandcold-nuevo-firebase-adminsdk-fbsvc-a8ef5c8455.json

// Y CAMBIAR ESTO:
databaseURL: 'https://hotandcold-15168.firebaseio.com'
// POR ESTO:
databaseURL: 'https://hotandcold-nuevo.firebaseio.com'
```

---

### ✅ PASO 5: Importar datos (1 minuto)

```bash
cd c:\MigracionRepos\backend-hotandcold
node import-firestore.js
```

**Resultado:** Todos tus datos están ahora en el nuevo Firebase.

---

## ✨ ¡LISTO!

Tu nuevo Firebase tiene exactamente los mismos datos que el anterior.

---

## 🔍 VERIFICAR

```bash
# Inicia el servidor
node test-server.js

# En otro terminal, abre:
# http://localhost:3001/api/almacenamiento

# Deberías ver todos tus datos
```

---

## 📋 CHECKLIST

- [ ] Exporté datos (`backup_firebase_*.json` creado)
- [ ] Creé nuevo proyecto Firebase
- [ ] Descargué nuevas credenciales (archivo JSON)
- [ ] Actualicé `firebaseAdmin.js`
- [ ] Importé datos con `import-firestore.js`
- [ ] Verifiqué datos en `/api/almacenamiento`

---

## 🆘 PROBLEMAS COMUNES

### "No puedo importar, da error de permisos"

```
Solución: Ve a Firebase Console → Firestore Database → Reglas
Y cambia a:
match /databases/{database}/documents {
  match /{document=**} {
    allow read, write: if true;
  }
}
```

### "¿Dónde está el archivo backup?"

```
Debería estar en:
c:\MigracionRepos\backend-hotandcold\backup_firebase_2024-01-11.json
(la fecha cambia según cuándo ejecutaste export)
```

### "No encuentro las nuevas credenciales"

```
Firebase Console → Tu proyecto → Configuración (⚙️) 
→ Pestaña "Cuentas de servicio" → "Generar nueva clave privada"
→ Se descarga automáticamente
```

---

## 💾 GUARDAR EL BACKUP

Guarda el archivo `backup_firebase_*.json` en un lugar seguro:
- Carpeta en tu computadora
- Google Drive
- OneDrive
- Cualquier nube

**NO lo subas a GitHub** (contiene datos sensibles).

---

¡Así de fácil! 🚀
