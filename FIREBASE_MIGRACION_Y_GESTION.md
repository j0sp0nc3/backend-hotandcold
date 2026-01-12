# 🔥 FIREBASE - Guía Completa y Migración de Proyectos

Este documento explica cómo funciona Firebase y cómo cambiar entre diferentes proyectos sin perder datos.

---

## 🎯 ¿QUÉ ES FIREBASE?

Firebase es una **plataforma de Google en la nube** que proporciona:

| Servicio | ¿Para qué sirve? |
|----------|-----------------|
| **Firestore** | Base de datos en la nube (documentos JSON) |
| **Realtime Database** | Base de datos con sincronización en tiempo real |
| **Storage** | Almacenamiento de archivos (imágenes, PDFs, etc) |
| **Authentication** | Sistema de login/registro de usuarios |
| **Hosting** | Alojar la aplicación web |
| **Cloud Functions** | Ejecutar código en el servidor |

**En tu proyecto usas:**
- ✅ Firestore (guardar usuarios, mensajes, contactos)
- ✅ Storage (guardar imágenes de productos, si se implementa)
- ✅ Authentication (login/registro)

---

## 📊 ESTRUCTURA DE FIRESTORE (Base de datos)

### ¿Cómo se organizan los datos?

```
Firestore es como un conjunto de Excel en la nube:

DATABASE (hotandcold-15168)
├── COLECCIÓN "usuarios"
│   ├── DOCUMENTO (ID único)
│   │   ├── username: "juan"
│   │   ├── password: "$2b$10$hash..."
│   │   └── createdAt: 2024-01-11T20:30:00Z
│   └── DOCUMENTO
│       └── ...
│
├── COLECCIÓN "mensajes"
│   ├── DOCUMENTO
│   │   ├── nombre: "José"
│   │   ├── apellido: "Ponce"
│   │   ├── email: "jose@example.com"
│   │   ├── telefono: "989639876"
│   │   ├── mensaje: "Quiero cotización..."
│   │   └── timestamp: 2024-01-11T20:30:00Z
│   └── DOCUMENTO
│       └── ...
│
└── COLECCIÓN "contactos"
    ├── DOCUMENTO
    │   ├── nombre: "María"
    │   ├── email: "maria@example.com"
    │   └── timestamp: 2024-01-11T20:35:00Z
    └── DOCUMENTO
        └── ...
```

### Diferencia: Colecciones vs Documentos

```
COLECCIÓN  = Una tabla (ej: "usuarios")
DOCUMENTO  = Una fila (ej: un usuario específico)
CAMPO      = Una columna (ej: "username", "email")

ejemplo:
Colección: usuarios
└── Documento: user_123
    ├── Documento campo username: "juan"
    ├── Documento campo email: "juan@example.com"
    └── Documento campo password: "hashed..."
```

---

## 🔑 TUS CREDENCIALES DE FIREBASE ACTUALES

### Proyecto actual
```
Nombre: hotandcold-15168
URL: https://console.firebase.google.com/project/hotandcold-15168
```

### Archivo de credenciales
```
Ubicación: backend-hotandcold/hotandcold-15168-firebase-adminsdk-fbsvc-8f106b30ec.json

Contiene:
{
  "type": "service_account",
  "project_id": "hotandcold-15168",
  "private_key_id": "8f106b30ec",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk-fbsvc@hotandcold-15168.iam.gserviceaccount.com",
  "client_id": "117...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/..."
}
```

---

## 🔄 CÓMO FUNCIONA LA CONEXIÓN BACKEND ↔ FIREBASE

### Flujo de conexión

```
1. Backend inicia (Node.js)
   ↓
2. Lee archivo: hotandcold-15168-firebase-adminsdk-fbsvc-8f106b30ec.json
   ↓
3. Se autentica con Firebase usando las credenciales
   ↓
4. Obtiene referencia a la base de datos (db)
   ↓
5. Puede hacer operaciones:
   - Crear: db.collection('usuarios').add({...})
   - Leer: db.collection('usuarios').get()
   - Actualizar: db.collection('usuarios').doc('id').update({...})
   - Eliminar: db.collection('usuarios').doc('id').delete()
```

### Código de inicialización

**Ubicación:** `backend-hotandcold/config/firebaseAdmin.js`

```javascript
const admin = require('firebase-admin');

// Lee las credenciales del archivo JSON
const serviceAccount = require('../hotandcold-15168-firebase-adminsdk-fbsvc-8f106b30ec.json');

// Inicializa Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://hotandcold-15168.firebaseio.com'
});

// Obtiene referencia a Firestore
const db = admin.firestore();

module.exports = { db };
```

---

## 📥 CÓMO CAMBIAR A UN NUEVO PROYECTO FIREBASE (SIN PERDER DATOS)

### ⚠️ IMPORTANTE
Si cambias de proyecto Firebase sin antes **exportar los datos**, **PERDERÁS TODA LA INFORMACIÓN**.

---

## PASO 1: Exportar datos del proyecto actual

### Opción A: Exportar desde Firebase Console (Interfaz visual)

```
1. Ve a: https://console.firebase.google.com
2. Selecciona proyecto: hotandcold-15168
3. Firestore Database → Menú (⋮) → Exportar colecciones
4. Selecciona colecciones: usuarios, mensajes, contactos
5. Espera a que se descargue el archivo JSON (puede tomar minutos)
6. Guarda el archivo en lugar seguro: backup_hotandcold.json
```

### Opción B: Exportar usando Firebase CLI

```bash
# 1. Instala Firebase CLI
npm install -g firebase-tools

# 2. Inicia sesión
firebase login

# 3. Exporta la base de datos
firebase firestore:export ./backup_hotandcold

# 4. Espera a que se complete (se crea una carpeta con los datos)
```

### Opción C: Exportar desde Backend (Script Node.js)

```javascript
// Crea archivo: backend-hotandcold/export-firestore.js
const { db } = require('./config/firebaseAdmin');
const fs = require('fs');

async function exportarDatos() {
  try {
    console.log('Exportando datos de Firestore...');

    // Exportar colección "usuarios"
    const usuariosSnap = await db.collection('usuarios').get();
    const usuarios = [];
    usuariosSnap.forEach(doc => {
      usuarios.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Exportar colección "mensajes"
    const mensajesSnap = await db.collection('mensajes').get();
    const mensajes = [];
    mensajesSnap.forEach(doc => {
      mensajes.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate().toISOString()
      });
    });

    // Exportar colección "contactos"
    const contactosSnap = await db.collection('contactos').get();
    const contactos = [];
    contactosSnap.forEach(doc => {
      contactos.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate().toISOString()
      });
    });

    // Guardar en archivo JSON
    const backup = {
      exported: new Date().toISOString(),
      usuarios,
      mensajes,
      contactos,
      resumen: {
        total_usuarios: usuarios.length,
        total_mensajes: mensajes.length,
        total_contactos: contactos.length
      }
    };

    fs.writeFileSync(
      './backup_hotandcold.json',
      JSON.stringify(backup, null, 2)
    );

    console.log('✅ Datos exportados a: backup_hotandcold.json');
    console.log(`Resumen: ${usuarios.length} usuarios, ${mensajes.length} mensajes, ${contactos.length} contactos`);
  } catch (error) {
    console.error('❌ Error exportando:', error);
  }
}

exportarDatos();
```

**Ejecutar:**
```bash
cd backend-hotandcold
node export-firestore.js
```

---

## PASO 2: Crear nuevo proyecto Firebase

### En Google Cloud Console

```
1. Ve a: https://console.firebase.google.com
2. Click en "Agregar proyecto"
3. Nombre: "hotandcold-nuevo" (o el nombre que quieras)
4. Espera a que se cree (1-2 minutos)
5. Selecciona el proyecto
6. Ve a Firestore Database
7. Crear base de datos en modo producción
8. Selecciona ubicación (recomendado: América del Sur)
```

---

## PASO 3: Descargar nuevas credenciales

### Generar archivo JSON con nuevas credenciales

```
1. En Firebase Console: Configuración del proyecto (⚙️)
2. Pestaña: Cuentas de servicio
3. Click: "Generar nueva clave privada"
4. Se descarga archivo JSON
5. Renómbralo: hotandcold-nuevo-firebase-adminsdk-XXXXX.json
6. Copia a: backend-hotandcold/
```

---

## PASO 4: Actualizar configuración del backend

### Editar firebaseAdmin.js

```javascript
// ANTES (archivo antiguo)
const serviceAccount = require('../hotandcold-15168-firebase-adminsdk-fbsvc-8f106b30ec.json');

// DESPUÉS (archivo nuevo)
const serviceAccount = require('../hotandcold-nuevo-firebase-adminsdk-XXXXX.json');

// Y el databaseURL:
// ANTES
databaseURL: 'https://hotandcold-15168.firebaseio.com'

// DESPUÉS
databaseURL: 'https://hotandcold-nuevo.firebaseio.com'
```

---

## PASO 5: Importar datos al nuevo proyecto

### Opción A: Usando Firebase Console

```
1. Firebase Console → Firestore Database
2. Menú (⋮) → Importar colecciones
3. Selecciona el archivo backup_hotandcold.json
4. Espera a que se cargue todo
```

### Opción B: Importar desde Backend (Script Node.js)

```javascript
// Crea archivo: backend-hotandcold/import-firestore.js
const { db } = require('./config/firebaseAdmin');
const fs = require('fs');

async function importarDatos() {
  try {
    console.log('Importando datos a Firestore...');

    // Leer archivo de backup
    const backup = JSON.parse(fs.readFileSync('./backup_hotandcold.json', 'utf-8'));

    // Importar usuarios
    console.log(`Importando ${backup.usuarios.length} usuarios...`);
    for (const user of backup.usuarios) {
      const { id, ...datos } = user;
      await db.collection('usuarios').doc(id).set(datos);
    }

    // Importar mensajes
    console.log(`Importando ${backup.mensajes.length} mensajes...`);
    for (const msg of backup.mensajes) {
      const { id, timestamp, ...datos } = msg;
      await db.collection('mensajes').doc(id).set({
        ...datos,
        timestamp: new Date(timestamp)
      });
    }

    // Importar contactos
    console.log(`Importando ${backup.contactos.length} contactos...`);
    for (const contacto of backup.contactos) {
      const { id, timestamp, ...datos } = contacto;
      await db.collection('contactos').doc(id).set({
        ...datos,
        timestamp: new Date(timestamp)
      });
    }

    console.log('✅ Datos importados correctamente');
  } catch (error) {
    console.error('❌ Error importando:', error);
  }
}

importarDatos();
```

**Ejecutar:**
```bash
cd backend-hotandcold
node import-firestore.js
```

---

## PASO 6: Verificar que todo funciona

```bash
# 1. Reinicia el backend
taskkill /F /IM node.exe
cd backend-hotandcold
node test-server.js

# 2. Abre en navegador
http://localhost:3001/api/almacenamiento

# 3. Debería mostrar todos los datos importados
```

---

## 📋 RESUMEN: PASOS PARA CAMBIAR DE FIREBASE

| Paso | Acción | Archivo |
|------|--------|---------|
| 1 | **Exportar datos** | backup_hotandcold.json |
| 2 | **Crear nuevo proyecto** | Firebase Console |
| 3 | **Descargar credenciales** | hotandcold-nuevo-firebase-adminsdk-XXXXX.json |
| 4 | **Actualizar config** | backend-hotandcold/config/firebaseAdmin.js |
| 5 | **Importar datos** | Script node import-firestore.js |
| 6 | **Verificar** | http://localhost:3001/api/almacenamiento |

---

## ⚡ SCRIPT RÁPIDO: Migrar en 1 comando

```javascript
// archivo: backend-hotandcold/migrate-firebase.js
const { db: oldDb } = require('./config/firebaseAdmin');
const admin = require('firebase-admin');
const fs = require('fs');

async function migrate() {
  try {
    console.log('1️⃣ Exportando datos...');
    
    // Exportar del proyecto actual
    const collections = ['usuarios', 'mensajes', 'contactos'];
    const data = {};

    for (const collection of collections) {
      const snap = await oldDb.collection(collection).get();
      data[collection] = [];
      snap.forEach(doc => {
        data[collection].push({
          id: doc.id,
          ...doc.data()
        });
      });
      console.log(`  ✅ ${data[collection].length} documentos de ${collection}`);
    }

    // Guardar backup
    fs.writeFileSync(
      './backup_firebase.json',
      JSON.stringify(data, null, 2)
    );
    console.log('  ✅ Backup guardado: backup_firebase.json');

    console.log('2️⃣ Listo para migrar');
    console.log('   Pasos siguientes:');
    console.log('   1. Crear nuevo proyecto Firebase');
    console.log('   2. Descargar nuevas credenciales');
    console.log('   3. Actualizar firebaseAdmin.js');
    console.log('   4. Ejecutar: node import-firestore.js');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

migrate();
```

---

## 🔐 SEGURIDAD: Proteger credenciales

### NO hacer

```bash
❌ Nunca subas el JSON a GitHub
❌ Nunca lo compartas por email
❌ Nunca lo pongas en mensajes públicos
```

### SÍ hacer

```bash
✅ Guarda en lugar seguro (carpeta privada)
✅ Agrega .gitignore para no subirlo a Git

# Edita .gitignore:
# backend-hotandcold/.gitignore
*firebase-adminsdk*.json
```

---

## 🔍 DIFERENCIAS: Firestore vs Realtime Database

| Característica | Firestore | Realtime Database |
|---|---|---|
| **Tipo** | Documentos (JSON) | Árbol de datos |
| **Escalabilidad** | Muy buena | Media |
| **Costo** | Pago por lectura/escritura | Pago por GB |
| **Recomendado para** | Aplicaciones modernas | Apps en tiempo real |
| **Tu proyecto usa** | ✅ Firestore | ❌ No |

**Manténte con Firestore**, es lo correcto para tu caso.

---

## 📊 MONITORIZAR USO Y COSTOS

### En Firebase Console

```
1. Ve a: https://console.firebase.google.com
2. Proyecto → Firestore Database
3. Pestaña: Uso
4. Verás:
   - Lecturas de documentos
   - Escrituras de documentos
   - Eliminaciones
   - Almacenamiento total

Actualización: cada 24 horas
```

### Costo estimado

```
Plan Spark (Gratis):
- 50,000 lecturas/día
- 20,000 escrituras/día
- 1 GB almacenamiento

Plan Blaze (Pago según uso):
- Lecturas: $0.06 por 100,000
- Escrituras: $0.18 por 100,000
- Almacenamiento: $0.18 por GB/mes

Tu proyecto actual: Probablemente Spark
(suficiente para desarrollo/pruebas)
```

---

## 🆘 SOLUCIONAR PROBLEMAS

### Error: "UNAUTHENTICATED"

```
❌ Problema: Las credenciales son inválidas
✅ Solución:
   1. Verifica que firebaseAdmin.js apunta al archivo correcto
   2. El archivo JSON debe ser válido (no corrupto)
   3. Reinicia el servidor
```

### Error: "Permission denied"

```
❌ Problema: La cuenta de servicio no tiene permisos
✅ Solución:
   1. Ve a Firebase Console → Firestore Database → Reglas
   2. Cambia a:
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if true;  // Temporal para testing
        }
      }
   3. Luego restringe según sea necesario
```

### Error: "Collection not found"

```
❌ Problema: La colección no existe aún
✅ Solución:
   1. Firestore crea colecciones automáticamente al insertar
   2. Si lo necesitas ahora, crea manualmente:
      Firebase Console → Firestore → Crear colección
   3. Nombre: "usuarios" (o la que necesites)
```

---

## 💡 CASOS DE USO PRÁCTICOS

### Caso 1: Quiero cambiar a Firebase de otra cuenta Google

```
1. Crea/usa otra cuenta Google
2. Crea nuevo proyecto en esa cuenta
3. Sigue los pasos 1-6 anteriores
4. Listo, sin perder datos
```

### Caso 2: Quiero duplicar proyecto (testing)

```
1. Exporta datos actual
2. Crea nuevo proyecto: "hotandcold-testing"
3. Importa datos
4. Actualiza backend para apuntar al nuevo proyecto
5. Ahora tienes 2 proyectos idénticos
```

### Caso 3: Quiero respaldar datos regularmente

```
# Crear script automatizado (cron job)
# Cada semana: ejecuta export-firestore.js
# Guarda en: cloud storage o GitHub

# Opción simple: ejecutar mensualmente
node backend-hotandcold/export-firestore.js
```

### Caso 4: Quiero limpiar datos sin perder estructura

```javascript
// Script para eliminar solo datos, no colecciones
const { db } = require('./config/firebaseAdmin');

async function limpiarDatos() {
  const collections = ['usuarios', 'mensajes', 'contactos'];
  
  for (const collection of collections) {
    const snap = await db.collection(collection).get();
    const batch = db.batch();
    
    snap.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`✅ ${collection} limpia`);
  }
}

limpiarDatos();
```

---

## 🚀 PRÓXIMAS ACCIONES RECOMENDADAS

1. **Crear backup ahora**
   ```bash
   cd backend-hotandcold
   node export-firestore.js
   ```

2. **Configurar .gitignore**
   ```bash
   echo "*firebase-adminsdk*.json" >> .gitignore
   ```

3. **Documentar el proceso**
   - Guarda este documento
   - Guarda el backup en lugar seguro

4. **Monitorizar costos**
   - Revisa Firebase Console cada mes
   - Asegúrate de estar en plan Spark (gratuito)

---

## 📚 RECURSOS ÚTILES

| Recurso | URL |
|---------|-----|
| **Firebase Console** | https://console.firebase.google.com |
| **Documentación Firestore** | https://firebase.google.com/docs/firestore |
| **Firebase Admin SDK** | https://firebase.google.com/docs/admin/setup |
| **Precios Firebase** | https://firebase.google.com/pricing |

---

¡Ahora entiendes cómo funciona Firebase y cómo migrar sin perder datos! 🚀
