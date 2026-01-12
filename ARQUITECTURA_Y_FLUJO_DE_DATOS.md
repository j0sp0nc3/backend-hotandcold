# 📋 Arquitectura y Flujo de Datos - Hot and Cold

Este documento explica cómo funcionan los dos proyectos (Backend y Frontend) y de dónde viene toda la información.

---

## 🏗️ ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Frontend)                        │
│         React + Vite (Puerto 3000)                          │
│  ┌────────────────┐  ┌─────────────┐  ┌──────────────────┐ │
│  │  Componentes   │  │  Context    │  │  localStorage    │ │
│  │  (Páginas)     │  │  (AuthUser) │  │  (Datos locales) │ │
│  └────────────────┘  └─────────────┘  └──────────────────┘ │
│           │                 │                   │            │
│           └─────────────────┼───────────────────┘            │
│                             │                                 │
│                    ┌────────▼────────┐                       │
│                    │   API_ENDPOINTS │                       │
│                    │   (apiConfig.js)│                       │
│                    └────────┬────────┘                       │
└─────────────────────────────┼──────────────────────────────┘
                              │
                       HTTP Requests
                       (CORS habilitado)
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                   SERVIDOR (Backend)                        │
│         Express + Node.js (Puerto 3001)                     │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Rutas         │  │  Middlewares │  │  Controllers   │  │
│  │  /api/register │  │  - verifyToken│  │  - Lógica      │  │
│  │  /api/login    │  │  - CORS       │  │  - Validación  │  │
│  │  /api/contact  │  │  - JSON parse │  │  - Respuestas  │  │
│  └────────────────┘  └──────────────┘  └────────────────┘  │
│           │                                      │            │
│           └──────────────┬───────────────────────┘            │
│                          │                                    │
│            ┌─────────────▼──────────────┐                    │
│            │    Firebase Firestore      │                    │
│            │    (Base de datos en      │                    │
│            │     la nube)              │                    │
│            │ ┌────────────────────────┐│                    │
│            │ │ Colecciones:           ││                    │
│            │ │ - usuarios             ││                    │
│            │ │ - mensajes             ││                    │
│            │ │ - contactos            ││                    │
│            │ │ - productos (opcional) ││                    │
│            │ └────────────────────────┘│                    │
│            └────────────────────────────┘                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 📂 ESTRUCTURA DE DIRECTORIOS

### Backend (`backend-hotandcold/`)
```
backend-hotandcold/
├── index.js                          # Servidor principal (Firebase version)
├── test-server.js                    # Servidor de prueba (sin Firebase)
├── package.json                      # Dependencias Node.js
├── .env                              # Variables de ambiente (secretas)
├── config/
│   └── firebaseAdmin.js              # Configuración de Firebase Admin SDK
├── middlewares/
│   └── verifyToken.js                # Middleware para verificar JWT
├── routes/
│   └── auth.js                       # Rutas de autenticación
└── README.md                         # Documentación
```

### Frontend (`frontend-hotandcold/`)
```
frontend-hotandcold/
├── package.json                      # Dependencias React/Vite
├── vite.config.js                    # Configuración de Vite
├── index.html                        # HTML principal
├── .env.local                        # Variables de ambiente (local)
├── src/
│   ├── main.jsx                      # Punto de entrada
│   ├── App.jsx                       # Componente raíz
│   ├── firebaseConfig.js             # Configuración Firebase (cliente)
│   ├── config/
│   │   └── apiConfig.js              # URLs de API (centralizado)
│   ├── context/
│   │   └── AuthContext.jsx           # Estado de autenticación global
│   ├── components/
│   │   ├── navbar.jsx                # Barra de navegación
│   │   ├── footer.jsx                # Pie de página (formulario contacto)
│   │   ├── ProductList.jsx           # Lista de productos
│   │   ├── ProductDetail.jsx         # Detalle de producto
│   │   ├── ImageUpload.jsx           # Upload de imágenes
│   │   └── PrivateRoute.jsx          # Rutas protegidas
│   ├── pages/
│   │   ├── HomePage.jsx              # Página inicio (formulario cotización)
│   │   ├── login.jsx                 # Página de login
│   │   ├── Calefaccion.jsx           # Categoría: Calefacción
│   │   ├── Climatizacion.jsx         # Categoría: Climatización
│   │   ├── Ventilacion.jsx           # Categoría: Ventilación
│   │   └── tienda.jsx                # Tienda de productos
│   └── assets/                       # Imágenes y recursos
└── public/
    └── assets/                       # Archivos estáticos
```

---

## 🔄 FLUJOS DE DATOS PRINCIPALES

### 1️⃣ FLUJO DE REGISTRO DE USUARIO

```
1. Usuario en login.jsx rellena formulario
   ↓
2. handleSubmit() hace POST a /api/register con:
   {
     username: "juan",
     password: "micontraseña"
   }
   ↓
3. apiConfig.js resuelve URL:
   http://localhost:3001/api/register
   ↓
4. Backend (routes/auth.js) recibe POST:
   - Valida username y password no estén vacíos
   - Busca en Firestore si usuario existe
   - Si no existe: hashea contraseña con bcrypt
   - Guarda en colección "usuarios" de Firestore
   ↓
5. Responde al frontend:
   { message: "Usuario registrado con éxito" }
   ↓
6. Frontend muestra confirmación y redirige a login
```

**Archivos involucrados:**
- Frontend: `src/pages/login.jsx`
- Config: `src/config/apiConfig.js`
- Backend: `routes/auth.js`
- BD: Firestore (colección `usuarios`)

---

### 2️⃣ FLUJO DE LOGIN

```
1. Usuario en login.jsx ingresa credenciales
   ↓
2. handleSubmit() hace POST a /api/login con:
   {
     username: "juan",
     password: "micontraseña"
   }
   ↓
3. Backend (routes/auth.js) recibe POST:
   - Busca usuario en Firestore
   - Compara contraseña hasheada con bcrypt.compare()
   - Si es correcto: genera JWT token
   - Si es incorrecto: retorna error 401
   ↓
4. Responde al frontend:
   { 
     message: "Login exitoso",
     token: "eyJhbGciOiJIUzI1NiIs...",
     user: { username: "juan" }
   }
   ↓
5. Frontend (AuthContext.jsx):
   - Guarda datos en localStorage
   - Actualiza estado global (user)
   - Redirige a HomePage
   ↓
6. useAuth() hook en componentes accede a: user, login(), logout()
```

**Archivos involucrados:**
- Frontend: `src/pages/login.jsx`, `src/context/AuthContext.jsx`
- Backend: `routes/auth.js`
- BD: Firestore (colección `usuarios`)
- Storage local: localStorage (clave "user")

---

### 3️⃣ FLUJO DE FORMULARIO DE COTIZACIÓN (HomePage)

```
1. Usuario rellena formulario en HomePage.jsx:
   {
     nombre: "José",
     apellido: "Ponce",
     email: "jose@example.com",
     telefono: "989639876",
     direccion: "Calle 123",
     rol: "Dueño de Casa",
     mensaje: "Quiero cotización para calefacción"
   }
   ↓
2. handleSubmit() hace POST a /api/contact con datos
   ↓
3. Backend (test-server.js o index.js) recibe POST:
   - Imprime en consola para debugging
   - Almacena en array "mensajes" (memoria)
     O guarda en Firestore (colección "mensajes")
   ↓
4. Responde al frontend:
   { message: "Mensaje enviado y cotización guardada correctamente" }
   ↓
5. Frontend:
   - Muestra mensaje de éxito
   - Limpia formulario
```

**Archivos involucrados:**
- Frontend: `src/pages/HomePage.jsx`
- Backend: `test-server.js` (líneas 60-64) o `index.js`
- BD: Firestore (colección `mensajes`) O memoria

---

### 4️⃣ FLUJO DE CONTACTO DEL FOOTER

```
1. Usuario rellena formulario en footer.jsx:
   {
     nombre: "José",
     apellido: "Ponce",
     email: "jose@example.com",
     telefono: "989639876",
     mensaje: "Consulta general"
   }
   ↓
2. handleSubmit() hace POST a /api/contact-footer con datos
   ↓
3. Backend recibe POST:
   - Almacena en array "contactos" (memoria)
     O guarda en Firestore (colección "contactos")
   ↓
4. Responde:
   { message: "Mensaje guardado y enviado correctamente" }
   ↓
5. Frontend muestra confirmación y limpia formulario
```

**Archivos involucrados:**
- Frontend: `src/components/footer.jsx`
- Backend: `test-server.js` (líneas 66-70) o `index.js`
- BD: Firestore (colección `contactos`) O memoria

---

## 📍 DÓNDE SE ALMACENAN LOS DATOS

| Dato | Ubicación | Tipo | Persistencia |
|------|-----------|------|--------------|
| Usuario autenticado | `localStorage` | Local Browser | Mientras no limpies caché |
| Credenciales de usuario | Firebase Firestore | Cloud DB | Permanente |
| Mensajes de cotización | Firebase Firestore | Cloud DB | Permanente |
| Contactos del footer | Firebase Firestore | Cloud DB | Permanente |
| Productos | Firebase Storage + Firestore | Cloud DB | Permanente |
| Tokens JWT | En tránsito (si se implementa) | Memory | Solo durante sesión |

---

## 🔐 FLUJO DE AUTENTICACIÓN

### LocalStorage (Cliente)
```javascript
// Cuando hace login, se guarda:
localStorage.setItem('user', JSON.stringify({
  username: "juan",
  email: "juan@example.com",
  // ... otros datos
}));

// Al recargar la página, AuthContext.jsx lo recupera:
const storedUser = localStorage.getItem('user');
if (storedUser) {
  setUser(JSON.parse(storedUser));
}
```

### Firestore (Base de datos)
```javascript
// Colección: usuarios
// Documento ejemplo:
{
  username: "juan",
  password: "$2b$10$hashedPasswordAquí...", // Hasheada con bcrypt
  createdAt: 2024-01-11T18:30:00Z
}
```

---

## 🌐 FLUJO DE REQUESTS HTTP

### Cliente (Frontend) → Servidor (Backend)

```
1. Frontend prepara request:
   POST /api/contact
   Headers: { "Content-Type": "application/json" }
   Body: { nombre: "José", ... }

2. apiConfig.js resuelve URL:
   import.meta.env.VITE_API_URL || 'http://localhost:3001'
   
3. CORS debe permitir:
   - Origin: http://localhost:3000
   - Methods: GET, POST, PUT, DELETE
   - Headers: Content-Type

4. Backend (express) recibe y procesa

5. Responde con JSON:
   { message: "Mensaje guardado...", data: {...} }

6. Frontend procesa respuesta:
   - Si status 200-299: éxito
   - Si status 4xx-5xx: error
```

---

## 🚀 CÓMO FLUYE UNA PETICIÓN COMPLETA

### Ejemplo: Enviar formulario de contacto desde footer

```javascript
// 1. FRONTEND - footer.jsx
async function handleSubmit(e) {
  e.preventDefault();
  try {
    // 2. Obtiene URL de apiConfig.js
    const response = await axios.post(
      API_ENDPOINTS.CONTACT_FOOTER,  // "http://localhost:3001/api/contact-footer"
      formData  // { nombre, apellido, email, telefono, mensaje }
    );
    
    // 3. Si respuesta es 200 OK
    if (response.status === 200) {
      mostrarMensaje("Enviado correctamente", "success");
      setFormData({ nombre: "", apellido: "", ... });  // Limpia
    }
  } catch (error) {
    // Si hay error CORS, red, servidor, etc.
    mostrarMensaje("Error al enviar", "error");
    console.error(error);
  }
}

// 4. BACKEND - test-server.js
app.post('/api/contact-footer', (req, res) => {
  console.log('📥 POST /api/contact-footer', req.body);
  
  // Almacena en memoria (desarrollo)
  contactos.push({
    ...req.body,
    timestamp: new Date().toISOString(),
    id: contactos.length + 1
  });
  
  // O en Firestore (producción)
  // await db.collection('contactos').add({ ...req.body, timestamp: new Date() });
  
  // 5. Responde al cliente
  res.json({ 
    message: 'Mensaje guardado y enviado correctamente' 
  });
});

// 6. FRONTEND recibe y actualiza UI
```

---

## 🔍 CÓMO VER LOS DATOS ALMACENADOS

### Opción 1: En el navegador
```
http://localhost:3001/api/almacenamiento
http://localhost:3001/api/contactos
http://localhost:3001/api/mensajes
```

### Opción 2: En Firebase Console
```
1. Ve a: https://console.firebase.google.com
2. Proyecto: hotandcold-15168
3. Firestore Database
4. Colecciones: usuarios, mensajes, contactos
```

### Opción 3: En el terminal/logs del backend
```
Cuando envías un formulario, ves:
📥 POST /api/contact-footer { nombre: "José", ... }
```

### Opción 4: En localStorage del navegador
```
1. Abre Developer Tools (F12)
2. Application → Local Storage
3. http://localhost:3000
4. Busca clave "user"
```

---

## 🛠️ VARIABLES DE ENVIRONMENT

### Backend (`.env`)
```
PORT=3001
FIREBASE_PROJECT_ID=hotandcold-15168
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk...@...iam.gserviceaccount.com
NODE_ENV=development
```

### Frontend (`.env.local`)
```
VITE_API_URL=http://localhost:3001
```

En producción cambiarían a:
```
VITE_API_URL=https://backend-hotandcold-xyz.onrender.com
```

---

## 📊 ARQUITECTURA DE DATOS FIRESTORE

```
firestore-database
├── usuarios (Colección)
│   ├── doc1
│   │   ├── username: "juan"
│   │   ├── password: "hashed..."
│   │   └── createdAt: Timestamp
│   └── doc2
│       └── ...
│
├── mensajes (Colección - Cotizaciones)
│   ├── doc1
│   │   ├── nombre: "José"
│   │   ├── apellido: "Ponce"
│   │   ├── email: "..."
│   │   ├── telefono: "..."
│   │   ├── direccion: "..."
│   │   ├── rol: "Dueño de Casa"
│   │   ├── mensaje: "..."
│   │   └── timestamp: Timestamp
│   └── doc2
│       └── ...
│
├── contactos (Colección - Footer)
│   ├── doc1
│   │   ├── nombre: "..."
│   │   ├── apellido: "..."
│   │   ├── email: "..."
│   │   ├── telefono: "..."
│   │   ├── mensaje: "..."
│   │   └── timestamp: Timestamp
│   └── doc2
│       └── ...
│
└── productos (Colección - Opcional)
    ├── doc1
    │   ├── nombre: "Caldera XYZ"
    │   ├── categoria: "Calefacción"
    │   ├── precio: 5000
    │   ├── imagen: "url..."
    │   └── descripcion: "..."
    └── doc2
        └── ...
```

---

## 🎯 RESUMEN RÁPIDO

**¿De dónde viene cada dato?**

1. **Usuario logueado** → Firebase (Firestore collection "usuarios") + localStorage
2. **Formularios enviados** → Frontend input fields → Backend → Firebase
3. **Mensajes de cotización** → HomePage.jsx → Backend → Firebase collection "mensajes"
4. **Contactos** → footer.jsx → Backend → Firebase collection "contactos"
5. **Productos** → Firebase Storage (imágenes) + Firestore (datos)
6. **Configuración API** → apiConfig.js (ambiente: local o prod)

**Ciclo de vida de un datos:**

```
Usuario escribe datos
    ↓
Frontend valida localmente
    ↓
HTTP POST a Backend
    ↓
Backend valida
    ↓
Firebase Firestore guarda
    ↓
Respuesta al Frontend
    ↓
UI actualiza (éxito/error)
```

---

¡Espero que esto te ayude a entender cómo fluye toda la información en el sistema! 🚀
