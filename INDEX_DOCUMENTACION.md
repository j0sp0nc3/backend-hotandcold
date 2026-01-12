# 📚 ÍNDICE DE DOCUMENTACIÓN - Hot and Cold

Este es el índice de toda la documentación del proyecto. Aquí encontrarás dónde está cada cosa.

---

## 🎯 DOCUMENTOS POR TEMA

### 🔥 FIREBASE (Base de datos en la nube)

**Si quieres entender cómo funciona Firebase:**
- 📄 [`FIREBASE_FUNCIONAMIENTO_INTERNO.md`](./FIREBASE_FUNCIONAMIENTO_INTERNO.md)
  - Explicación técnica detallada
  - Cómo se almacenan los datos
  - Cómo funciona la autenticación
  - Costos y rendimiento
  - Comparativa con alternativas

**Si quieres migrar a otro proyecto Firebase:**
- 📄 [`FIREBASE_MIGRACION_RAPIDA.md`](./FIREBASE_MIGRACION_RAPIDA.md)
  - 5 pasos rápidos (5 minutos)
  - Sin perder datos
  - Checklist paso a paso
  - Solución de problemas

**Si quieres guía detallada de migración:**
- 📄 [`FIREBASE_MIGRACION_Y_GESTION.md`](./FIREBASE_MIGRACION_Y_GESTION.md)
  - Explicación completa de Firebase
  - Cómo exportar datos
  - Cómo importar datos
  - Scripts automatizados
  - Monitoreo y costos

---

### 🏗️ ARQUITECTURA Y FLUJO DE DATOS

**Si quieres entender cómo funciona el proyecto:**
- 📄 [`ARQUITECTURA_Y_FLUJO_DE_DATOS.md`](./ARQUITECTURA_Y_FLUJO_DE_DATOS.md)
  - Diagrama general del sistema
  - Estructura de directorios
  - 4 flujos principales (registro, login, cotizaciones, contactos)
  - Dónde se almacenan los datos
  - Cómo fluye una petición HTTP completa

---

### 💻 CÓDIGO Y COMPONENTES

**Si quieres ver ejemplos de código:**
- 📄 [`GUIA_TECNICA_COMPONENTES.md`](./GUIA_TECNICA_COMPONENTES.md)
  - AuthContext.jsx (gestión de usuarios)
  - apiConfig.js (configuración centralizada)
  - Formulario de login
  - Formulario de cotización
  - Rutas de autenticación del backend
  - Manejo de formularios en backend
  - Ejemplo completo paso a paso

---

### 📍 CONTENIDO Y UBICACIONES

**Si quieres saber dónde está cada cosa:**
- 📄 [`CONTENIDO_Y_UBICACIONES.md`](./CONTENIDO_Y_UBICACIONES.md)
  - Dónde están las imágenes
  - Dónde están los textos de servicios
  - Dónde están los estilos CSS
  - Cómo editar contenido
  - Mapa visual de toda la página
  - Archivos importantes

---

## 🚀 SCRIPTS DISPONIBLES

### Exportar datos Firebase
```bash
cd backend-hotandcold
node export-firestore.js
```
**Resultado:** `backup_firebase_YYYY-MM-DD.json`

### Importar datos a Firebase
```bash
cd backend-hotandcold
node import-firestore.js
```
**O especificar archivo:**
```bash
node import-firestore.js backup_firebase_2024-01-11.json
```

---

## 🗺️ FLUJO DE DOCUMENTACIÓN RECOMENDADO

### Si eres NUEVO en el proyecto:
```
1. Lee: ARQUITECTURA_Y_FLUJO_DE_DATOS.md
   (Entiende qué es y cómo funciona)

2. Lee: CONTENIDO_Y_UBICACIONES.md
   (Sabe dónde está todo)

3. Lee: GUIA_TECNICA_COMPONENTES.md
   (Ve cómo está hecho)

4. Explora el código en VSCode
```

### Si quieres ENTENDER FIREBASE:
```
1. Lee: FIREBASE_FUNCIONAMIENTO_INTERNO.md
   (Entiende qué es y por qué se usa)

2. Lee: FIREBASE_MIGRACION_Y_GESTION.md
   (Entiende cómo funciona internamente)

3. Opcional: FIREBASE_MIGRACION_RAPIDA.md
   (Para referencia rápida)
```

### Si necesitas MIGRAR FIREBASE:
```
1. Abre: FIREBASE_MIGRACION_RAPIDA.md
   (5 pasos rápidos)

2. Si necesitas más detalles: FIREBASE_MIGRACION_Y_GESTION.md
   (Guía completa)

3. Ejecuta scripts:
   - export-firestore.js
   - import-firestore.js
```

### Si necesitas EDITAR CONTENIDO:
```
1. Abre: CONTENIDO_Y_UBICACIONES.md
   (Encuentra dónde editar)

2. Edita el archivo
   - Si es imagen: public/assets/
   - Si es texto: src/pages/*.jsx
   - Si es estilo: src/components/*.css

3. Recarga el navegador
```

---

## 📂 ESTRUCTURA DE CARPETAS CLAVE

```
c:\MigracionRepos\
│
├── 📄 ARQUITECTURA_Y_FLUJO_DE_DATOS.md         ← Cómo funciona
├── 📄 CONTENIDO_Y_UBICACIONES.md               ← Dónde está todo
├── 📄 GUIA_TECNICA_COMPONENTES.md              ← Código
├── 📄 FIREBASE_MIGRACION_Y_GESTION.md          ← Firebase detalle
├── 📄 FIREBASE_MIGRACION_RAPIDA.md             ← Firebase rápido
├── 📄 FIREBASE_FUNCIONAMIENTO_INTERNO.md       ← Firebase técnico
├── 📄 README.md                                ← Inicio rápido
├── 📄 SETUP_COMPLETADO.md                      ← Checklist setup
│
├── 📂 backend-hotandcold/
│   ├── 🔑 hotandcold-15168-firebase-adminsdk-fbsvc-8f106b30ec.json  ← Credenciales
│   ├── 📄 test-server.js                       ← Servidor principal
│   ├── 📄 index.js                             ← Servidor alternativo
│   ├── 📄 export-firestore.js                  ← Script exportar
│   ├── 📄 import-firestore.js                  ← Script importar
│   ├── 📄 package.json                         ← Dependencias
│   │
│   ├── 📂 config/
│   │   └── firebaseAdmin.js                    ← Configuración Firebase
│   │
│   ├── 📂 routes/
│   │   └── auth.js                             ← Rutas autenticación
│   │
│   └── 📂 middlewares/
│       └── verifyToken.js                      ← Verificar JWT
│
└── 📂 frontend-hotandcold/
    ├── 📄 vite.config.js                       ← Configuración build
    ├── 📄 package.json                         ← Dependencias
    ├── 📄 index.html                           ← HTML principal
    ├── .env.local                              ← Variables ambiente
    │
    ├── 📂 public/
    │   └── 📂 assets/                          ← IMÁGENES
    │       ├── c1.webp, c2.webp, ... (Calefacción)
    │       ├── cli1.avif, cli2.avif, ... (Climatización)
    │       ├── a1.webp, a2.webp, ... (Calderas)
    │       ├── logo.avif, h2.avif, ...
    │       └── t1.jpg, t2.jpg, ... (Trabajos)
    │
    └── 📂 src/
        ├── 📄 App.jsx                          ← App principal
        ├── 📄 main.jsx                         ← Punto entrada
        ├── 📄 firebaseConfig.js                ← Config Firebase cliente
        │
        ├── 📂 config/
        │   └── apiConfig.js                    ← Configuración API
        │
        ├── 📂 context/
        │   └── AuthContext.jsx                 ← Estado autenticación
        │
        ├── 📂 pages/                           ← TEXTOS DE SERVICIOS
        │   ├── HomePage.jsx                    ← Inicio
        │   ├── Calefaccion.jsx                 ← Calefacción
        │   ├── Climatizacion.jsx               ← Climatización
        │   ├── Ventilacion.jsx                 ← Ventilación
        │   ├── tienda.jsx                      ← Tienda
        │   └── login.jsx                       ← Login
        │
        └── 📂 components/                      ← ESTILOS
            ├── navbar.jsx
            ├── footer.jsx
            ├── home.css                        ← Estilos inicio
            ├── calefaccion.css                 ← Estilos calefacción
            ├── climatizacion.css               ← Estilos climatización
            └── ventilacion.css                 ← Estilos ventilación
```

---

## 🔧 TAREAS COMUNES

### Cambiar el texto de una página
```
Archivo: src/pages/Calefaccion.jsx (o la que sea)
Busca el texto
Reemplaza
Recarga navegador (F5)
✅ Listo
```

### Cambiar una imagen
```
Opción 1: Reemplazar archivo
  - Ve a: public/assets/
  - Reemplaza el archivo (ej: c1.webp)
  - Recarga navegador
  ✅ Listo

Opción 2: Agregar nueva imagen
  - Copia imagen a: public/assets/
  - En JSX, referencia como: /assets/nombre.webp
  - Recarga navegador
  ✅ Listo
```

### Cambiar color o estilo
```
Archivo: src/components/*.css (según la página)
Edita el CSS
Recarga navegador (F5)
✅ Listo
```

### Migrar a nuevo Firebase
```
1. node export-firestore.js
2. Crear nuevo proyecto Firebase
3. Descargar nuevas credenciales
4. Actualizar firebaseAdmin.js
5. node import-firestore.js
✅ Listo
```

### Ver datos almacenados
```
Opción 1: En navegador
  - http://localhost:3001/api/almacenamiento
  - Muestra todos los datos

Opción 2: En Firebase Console
  - https://console.firebase.google.com
  - Proyecto → Firestore Database
  - Colecciones: usuarios, mensajes, contactos

Opción 3: En terminal
  - Ver logs cuando se envían formularios
```

---

## 📞 CONTACTOS Y REFERENCIAS

| Recurso | URL |
|---------|-----|
| **Firebase Console** | https://console.firebase.google.com |
| **Documentación Firebase** | https://firebase.google.com/docs |
| **Documentación Firestore** | https://firebase.google.com/docs/firestore |
| **React Docs** | https://react.dev |
| **Vite Docs** | https://vitejs.dev |
| **Express Docs** | https://expressjs.com |

---

## ✅ CHECKLIST DE COMPRENSIÓN

**Marca lo que ya entiendes:**

### Arquitectura
- [ ] Sé qué es un backend y un frontend
- [ ] Sé cómo se comunican (HTTP)
- [ ] Entiendo qué es una API REST
- [ ] Entiendo qué es Firebase

### Proyecto
- [ ] Sé dónde están las imágenes
- [ ] Sé dónde están los textos
- [ ] Sé dónde están los estilos
- [ ] Sé cómo editar cada sección

### Firebase
- [ ] Sé cómo funciona Firestore
- [ ] Sé cómo exportar datos
- [ ] Sé cómo importar datos
- [ ] Sé cómo cambiar de proyecto

### Desarrollo
- [ ] Puedo iniciar el backend
- [ ] Puedo iniciar el frontend
- [ ] Puedo ver datos en /api/almacenamiento
- [ ] Puedo editar contenido sin romper nada

---

## 🆘 ¿DÓNDE EMPIEZO?

**Si no sabes por dónde empezar:**

1. Lee este archivo (ya lo estás haciendo ✓)
2. Lee: `ARQUITECTURA_Y_FLUJO_DE_DATOS.md` (5 min)
3. Lee: `CONTENIDO_Y_UBICACIONES.md` (5 min)
4. Abre VSCode y explora las carpetas
5. Intenta editar algo pequeño (un texto)
6. ¡Listo! Ya sabes cómo funciona todo

**Tiempo total:** 15-20 minutos ⏱️

---

¡Espero que esta documentación te sea útil! 🚀

**Última actualización:** 11 de enero de 2026

Si tienes dudas, revisa el archivo correspondiente o intenta ejecutar los scripts.
