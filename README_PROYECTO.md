# 🔥 HotAndCold - Proyecto Completo

Documentación centralizada del proyecto HotAndCold (Frontend + Backend + Firebase).

---

## 📚 DOCUMENTACIÓN PRINCIPAL

### 🎯 Comienza aquí
- **[INDEX_DOCUMENTACION.md](./INDEX_DOCUMENTACION.md)** - Índice de toda la documentación
  - Mapa de documentos
  - Flujo recomendado de lectura
  - Tareas comunes

---

### 🏗️ Entender el proyecto
1. **[ARQUITECTURA_Y_FLUJO_DE_DATOS.md](./ARQUITECTURA_Y_FLUJO_DE_DATOS.md)**
   - Cómo está organizado el proyecto
   - Flujo de datos completo
   - Dónde está almacenado cada cosa

2. **[CONTENIDO_Y_UBICACIONES.md](./CONTENIDO_Y_UBICACIONES.md)**
   - Dónde están las imágenes (public/assets/)
   - Dónde están los textos (src/pages/)
   - Dónde están los estilos (src/components/)
   - Cómo editar cada sección

3. **[GUIA_TECNICA_COMPONENTES.md](./GUIA_TECNICA_COMPONENTES.md)**
   - Código de componentes principales
   - Ejemplos prácticos
   - Cómo funcionan internamente

---

### 🔥 Firebase (Base de datos)
1. **[FIREBASE_FUNCIONAMIENTO_INTERNO.md](./FIREBASE_FUNCIONAMIENTO_INTERNO.md)**
   - Qué es Firebase y por qué se usa
   - Cómo funciona internamente
   - Cómo se almacenan los datos
   - Costos y seguridad

2. **[FIREBASE_MIGRACION_Y_GESTION.md](./FIREBASE_MIGRACION_Y_GESTION.md)**
   - Guía completa de migración
   - Cómo exportar datos
   - Cómo importar datos
   - Scripts automatizados
   - Solución de problemas

3. **[FIREBASE_MIGRACION_RAPIDA.md](./FIREBASE_MIGRACION_RAPIDA.md)**
   - 5 pasos en 5 minutos
   - Sin perder datos
   - Checklist paso a paso

---

## 🚀 INICIO RÁPIDO

### Requisitos
- Node.js v24+ instalado
- Acceso a: https://console.firebase.google.com
- Git (opcional)

### Iniciar servidores

```bash
# Terminal 1: Backend
cd backend-hotandcold
npm install
node test-server.js

# Terminal 2: Frontend
cd frontend-hotandcold
npm install
npm run dev
```

### Acceder a la aplicación
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Ver datos: http://localhost:3001/api/almacenamiento

---

## 📂 ESTRUCTURA DE CARPETAS

```
c:\MigracionRepos\
│
├── 📚 DOCUMENTACIÓN
│   ├── INDEX_DOCUMENTACION.md           ← ⭐ COMIENZA AQUÍ
│   ├── ARQUITECTURA_Y_FLUJO_DE_DATOS.md
│   ├── CONTENIDO_Y_UBICACIONES.md
│   ├── GUIA_TECNICA_COMPONENTES.md
│   ├── FIREBASE_MIGRACION_Y_GESTION.md
│   ├── FIREBASE_MIGRACION_RAPIDA.md
│   ├── FIREBASE_FUNCIONAMIENTO_INTERNO.md
│   ├── SETUP_COMPLETADO.md
│   └── README.md (este archivo)
│
├── 🔧 BACKEND
│   └── backend-hotandcold/
│       ├── test-server.js              (Servidor principal)
│       ├── index.js                    (Servidor alternativo)
│       ├── export-firestore.js         (Exportar datos)
│       ├── import-firestore.js         (Importar datos)
│       ├── config/firebaseAdmin.js     (Conexión Firebase)
│       ├── routes/auth.js              (Rutas API)
│       ├── middlewares/verifyToken.js  (Autenticación)
│       ├── package.json
│       └── hotandcold-15168-firebase-adminsdk-*.json (Credenciales)
│
└── 🎨 FRONTEND
    └── frontend-hotandcold/
        ├── src/
        │   ├── pages/                  (TEXTOS DE SERVICIOS)
        │   │   ├── HomePage.jsx
        │   │   ├── Calefaccion.jsx
        │   │   ├── Climatizacion.jsx
        │   │   ├── Ventilacion.jsx
        │   │   └── login.jsx
        │   ├── components/             (ESTILOS)
        │   │   ├── home.css
        │   │   ├── calefaccion.css
        │   │   ├── climatizacion.css
        │   │   └── ventilacion.css
        │   ├── context/AuthContext.jsx (Autenticación)
        │   ├── config/apiConfig.js     (Configuración API)
        │   └── firebaseConfig.js       (Firebase cliente)
        ├── public/assets/              (IMÁGENES)
        │   ├── c1.webp, c2.webp, ... (Calefacción)
        │   ├── cli1.avif, ... (Climatización)
        │   ├── logo.avif, h2.avif, ...
        │   └── t1.jpg, t2.jpg, ... (Trabajos)
        ├── .env.local                  (Variables ambiente)
        ├── vite.config.js
        ├── package.json
        └── index.html
```

---

## 🎯 TAREAS COMUNES

### Editar texto de una página
1. Abre: `frontend-hotandcold/src/pages/[Página].jsx`
2. Busca el texto
3. Reemplaza
4. Recarga navegador (F5)

**Ejemplo:** Cambiar título de Calefacción
```jsx
// En src/pages/Calefaccion.jsx
// ANTES:
<h2>Calefacción y climatización centralizada para todo tipo de espacios</h2>

// DESPUÉS:
<h2>Tu nuevo título aquí</h2>
```

### Cambiar una imagen
1. Reemplaza archivo en: `frontend-hotandcold/public/assets/`
2. O agrega nueva imagen y actualiza referencia en JSX
3. Recarga navegador

### Cambiar colores o estilos
1. Edita: `frontend-hotandcold/src/components/*.css`
2. Recarga navegador (F5)

### Exportar datos de Firebase
```bash
cd backend-hotandcold
node export-firestore.js
# Crea: backup_firebase_YYYY-MM-DD.json
```

### Importar datos a Firebase
```bash
cd backend-hotandcold
node import-firestore.js
# O: node import-firestore.js backup_firebase_2024-01-11.json
```

### Migrar a nuevo proyecto Firebase
1. Ejecuta: `node export-firestore.js` (hacer backup)
2. Crea nuevo proyecto en: https://console.firebase.google.com
3. Descarga nuevas credenciales (archivo JSON)
4. Actualiza: `backend-hotandcold/config/firebaseAdmin.js`
5. Ejecuta: `node import-firestore.js`

Para detalles: Ver [FIREBASE_MIGRACION_RAPIDA.md](./FIREBASE_MIGRACION_RAPIDA.md)

---

## 📊 TECNOLOGÍAS USADAS

### Frontend
- **React** 19.1.0 - Interfaz de usuario
- **Vite** 6.2.5 - Build tool (compila código rápido)
- **Tailwind CSS** 4.1.4 - Estilos
- **Axios** 1.8.4 - HTTP requests
- **React Router** 7.5.1 - Navegación
- **Firebase** 11.6.0 - Autenticación y Storage

### Backend
- **Node.js** v24.12.0 - Runtime JavaScript
- **Express** 5.1.0 - Framework HTTP
- **Firebase Admin** 13.4.0 - SDK para backend
- **bcrypt** 6.0.0 - Hash de contraseñas
- **CORS** 2.8.5 - Permitir requests cross-origin
- **Nodemailer** 7.0.3 - Envío de emails
- **dotenv** 16.5.0 - Variables de ambiente

### Base de Datos
- **Firestore** - Base de datos NoSQL en la nube
  - Colecciones: usuarios, mensajes, contactos

---

## 🔌 ENDPOINTS API

### Autenticación
```
POST /api/register
  Body: { username, password }
  Response: { message: "Usuario registrado" }

POST /api/login
  Body: { username, password }
  Response: { message: "Login exitoso", token, user }
```

### Formularios
```
POST /api/contact
  Body: { nombre, apellido, email, telefono, direccion, rol, mensaje }
  Response: { message: "Mensaje enviado..." }

POST /api/contact-footer
  Body: { nombre, apellido, email, telefono, mensaje }
  Response: { message: "Mensaje guardado..." }
```

### Información
```
GET /api/almacenamiento
  Response: { usuarios, mensajes, contactos, resumen }

GET /api/mensajes
  Response: { total, mensajes }

GET /api/contactos
  Response: { total, contactos }

GET /api/stats
  Response: { status, usuarios, timestamp }
```

---

## 🔐 VARIABLES DE AMBIENTE

### Backend (.env)
```
PORT=3001
FIREBASE_PROJECT_ID=hotandcold-15168
NODE_ENV=development
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3001
```

En producción:
```
VITE_API_URL=https://tu-backend.onrender.com
```

---

## 🌐 PROYECTOS FIREBASE

### Actual
- **Proyecto:** hotandcold-15168
- **Ubicación:** https://console.firebase.google.com/project/hotandcold-15168
- **Credenciales:** `hotandcold-15168-firebase-adminsdk-fbsvc-8f106b30ec.json`

### Colecciones
- `usuarios` - Cuentas de usuario
- `mensajes` - Cotizaciones del formulario
- `contactos` - Contactos del footer

---

## 📈 MONITOREO Y COSTOS

### Firebase Console
```
1. https://console.firebase.google.com
2. Selecciona proyecto: hotandcold-15168
3. Firestore Database → Uso
   - Lecturas/escrituras por día
   - Almacenamiento total
   - Costos estimados
```

### Plan actual
- **Spark (Gratis):**
  - 50,000 lecturas/día
  - 20,000 escrituras/día
  - 1 GB almacenamiento
  - **Suficiente para desarrollo**

---

## 🆘 TROUBLESHOOTING

### "Cannot find module 'firebase-admin'"
```bash
cd backend-hotandcold
npm install
```

### "CORS Error when sending forms"
- Verifica que `test-server.js` tenga CORS habilitado
- Origin debe ser: `http://localhost:3000`

### "UNAUTHENTICATED error from Firebase"
- Verifica el archivo JSON de credenciales existe
- Verifica que firebaseAdmin.js lo referencia correctamente
- Reinicia el servidor

### "No puedo editar el contenido"
- Guarda el archivo (Ctrl+S)
- Recarga el navegador (F5)
- Verifica que no hay errores en la consola (F12)

---

## 📚 RECURSOS ADICIONALES

| Recurso | URL |
|---------|-----|
| **Firebase Console** | https://console.firebase.google.com |
| **Documentación Firebase** | https://firebase.google.com/docs |
| **React Documentation** | https://react.dev |
| **Express Documentation** | https://expressjs.com |
| **Vite Documentation** | https://vitejs.dev |
| **Tailwind CSS** | https://tailwindcss.com |

---

## ✅ CHECKLIST RÁPIDO

Verifica que todo funciona:

```
[ ] Backend inicia sin errores (node test-server.js)
[ ] Frontend carga en http://localhost:3000
[ ] Puedo ver datos en http://localhost:3001/api/almacenamiento
[ ] Puedo enviar un formulario
[ ] Los datos aparecen en /api/almacenamiento
[ ] Puedo exportar datos (export-firestore.js)
```

---

## 👨‍💻 DESENVOLVIMIENTO

### Flujo típico de desarrollo:

```
1. Backend ejecutándose (Terminal 1)
2. Frontend ejecutándose (Terminal 2)
3. VSCode abierto (Editar código)
4. Navegador abierto (Ver cambios)

Cuando cambias código:
- Frontend: Recarga automática (Vite HMR)
- Backend: Reinicia manualmente (Ctrl+C y vuelve a iniciar)
```

### Verificar cambios:

```
Frontend:
- Edita src/pages/Calefaccion.jsx
- F5 en navegador
- ✅ Cambio visible

Backend:
- Edita config/firebaseAdmin.js
- Detén servidor (Ctrl+C)
- Inicia de nuevo (node test-server.js)
- ✅ Cambio efectivo
```

---

## 📝 NOTAS IMPORTANTES

1. **Nunca subas el archivo JSON de credenciales a GitHub**
   - Agrega a `.gitignore`: `*firebase-adminsdk*.json`

2. **Haz backup regular de datos**
   - Ejecuta mensualmente: `node export-firestore.js`
   - Guarda en lugar seguro (no en GitHub)

3. **Los datos se guardan en Firebase, no localmente**
   - Permanentes y compartidos entre usuarios
   - Accesibles desde cualquier dispositivo

4. **El entorno local es para desarrollo**
   - Usa credenciales test mientras sea posible
   - Cambia a credenciales de producción cuando despliegues

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Lee [INDEX_DOCUMENTACION.md](./INDEX_DOCUMENTACION.md)
2. ✅ Lee [ARQUITECTURA_Y_FLUJO_DE_DATOS.md](./ARQUITECTURA_Y_FLUJO_DE_DATOS.md)
3. ✅ Intenta editar algún contenido
4. ✅ Explora el código en VSCode
5. ✅ Prueba exportar/importar datos Firebase

---

**Última actualización:** 11 de enero de 2026

¿Dudas? Revisa la documentación correspondiente. ¡Mucha suerte! 🚀
