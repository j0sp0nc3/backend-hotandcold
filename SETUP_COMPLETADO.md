# ✅ Configuración Completada - Frontend & Backend

## 🚀 Servidores en Ejecución

| Componente | URL | Puerto | Estado |
|-----------|-----|--------|--------|
| Frontend (Vite) | http://localhost:3000 | 3000 | ✅ Corriendo |
| Backend (Express) | http://localhost:3001 | 3001 | ✅ Corriendo |

---

## 📝 Cambios Realizados

### 1. **Configuración de API Centralizada**
- Creado: `src/config/apiConfig.js`
- Define todos los endpoints de la API
- Lee la URL base desde variable de entorno `VITE_API_URL`

### 2. **Variables de Entorno**
- Creado: `.env.local`
```
VITE_API_URL=http://localhost:3001
```

### 3. **Archivos Actualizados**

#### Frontend:
- ✅ `src/pages/login.jsx` - Usa `API_ENDPOINTS.LOGIN`
- ✅ `src/pages/HomePage.jsx` - Usa `API_ENDPOINTS.CONTACT`
- ✅ `src/components/footer.jsx` - Usa `API_ENDPOINTS.CONTACT_FOOTER`

#### Backend:
- ✅ `test-server.js` - Puerto 3001
- ✅ Soporta endpoints: `/api/register`, `/api/login`, `/api/contact`, `/api/contact-footer`

---

## 🧪 Endpoints Disponibles

### Authentication
```
POST /api/register
Content-Type: application/json

{
  "username": "usuario",
  "password": "password123"
}
```

```
POST /api/login
Content-Type: application/json

{
  "username": "usuario",
  "password": "password123"
}
```

### Contact
```
POST /api/contact
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "telefono": "123456789",
  "direccion": "Calle Principal",
  "rol": "cliente"
}
```

```
POST /api/contact-footer
Content-Type: application/json

{
  "nombre": "María",
  "apellido": "García",
  "email": "maria@example.com",
  "telefono": "987654321",
  "mensaje": "Mensaje de contacto"
}
```

### Admin
```
GET /api/stats
```

---

## 💡 Cómo Cambiar la URL del Backend

### Para Producción:
Actualizar `.env.local`:
```
VITE_API_URL=https://tu-backend-produccion.com
```

O actualizar `src/config/apiConfig.js` directamente.

---

## 🔄 Flujo de Comunicación

```
[FRONTEND en :3000]
         ↓
    Realiza fetch/axios a http://localhost:3001/api/*
         ↓
[BACKEND en :3001]
         ↓
    Procesa request
         ↓
    Retorna JSON response
         ↓
[FRONTEND] Actualiza UI
```

---

## 📦 Stack Tecnológico

### Frontend
- React 19
- Vite 6
- Tailwind CSS
- React Router v7
- Axios
- Firebase (para Firestore)

### Backend
- Node.js
- Express 5
- CORS
- Nodemailer
- Firebase Admin SDK
- Bcrypt

---

## ✨ Próximos Pasos

1. **Testing Manual en el Navegador**
   - Abre http://localhost:3000
   - Navega por la aplicación
   - Prueba el formulario de login
   - Prueba el formulario de contacto

2. **Integración con Firebase**
   - Habilitar Firestore en Google Cloud
   - Cambiar `test-server.js` por `index.js` en el backend
   - Las rutas y configuración ya están listas

3. **Deployment a Producción**
   - Backend a Render.com o similar
   - Frontend a Vercel o Netlify
   - Actualizar `.env.local` con URLs de producción

---

## 🐛 Troubleshooting

### Puerto 3000 o 3001 ya está en uso
```powershell
taskkill /F /IM node.exe
```

### El frontend no conecta con el backend
- Verificar que ambos servidores están corriendo
- Verificar la URL en `.env.local`
- Revisar la consola del navegador (F12) para errores de CORS

### CORS errors
- El backend está configurado para aceptar solicitudes locales
- Para producción, actualizar la configuración de CORS en `backend-hotandcold/index.js`

---

## 📞 Contacto y Soporte

Archivos clave:
- Backend: `c:\MigracionRepos\backend-hotandcold\`
- Frontend: `c:\MigracionRepos\frontend-hotandcold\`

Documentación:
- Backend README: `backend-hotandcold/README.md`
- CURL Examples: `backend-hotandcold/CURL_COMMANDS.md`
