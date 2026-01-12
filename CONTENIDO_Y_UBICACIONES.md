# 📍 DÓNDE ESTÁ ALMACENADO EL CONTENIDO - Hot and Cold

Este documento explica exactamente dónde encontrar imágenes, textos y servicios de cada página.

---

## 🎯 RESUMEN GENERAL

| Elemento | Ubicación | Tipo | Editable |
|----------|-----------|------|----------|
| **Imágenes estáticas** | `frontend-hotandcold/public/assets/` | Archivos .webp, .avif, .jpg | ✅ Sí |
| **Textos de servicios** | `frontend-hotandcold/src/pages/*.jsx` | Código JSX hardcodeado | ✅ Sí |
| **Estilos CSS** | `frontend-hotandcold/src/components/*.css` | Archivos CSS | ✅ Sí |
| **Productos** | Firebase Firestore (opcional) | Base de datos | ✅ Sí |
| **Formularios** | `frontend-hotandcold/src/components/` | Código JSX | ✅ Sí |

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
frontend-hotandcold/
├── public/
│   └── assets/                    ← 🖼️ AQUÍ VAN LAS IMÁGENES
│       ├── Calefacción/
│       │   ├── c1.webp (Calderas)
│       │   ├── c2.webp
│       │   └── ...
│       ├── Climatización/
│       │   ├── cli1.avif
│       │   ├── cli2.avif
│       │   └── ...
│       ├── Ventilación/
│       │   ├── v1.webp (si existen)
│       │   └── ...
│       └── Otros/
│           ├── logo.avif (Logo de la empresa)
│           ├── h2.avif hasta h6.avif (Imágenes generales)
│           ├── t1.jpg hasta t9.jpg (Imágenes de trabajos)
│           └── ...
│
└── src/
    ├── pages/                     ← 📝 AQUÍ ESTÁN LOS TEXTOS DE SERVICIOS
    │   ├── HomePage.jsx           (Página inicio + Cotización)
    │   ├── Calefaccion.jsx        (Servicios de Calefacción)
    │   ├── Climatizacion.jsx      (Servicios de Climatización)
    │   ├── Ventilacion.jsx        (Servicios de Ventilación)
    │   ├── tienda.jsx             (Tienda de productos)
    │   └── login.jsx              (Página de login)
    │
    └── components/                ← 🎨 AQUÍ ESTÁN LOS ESTILOS Y COMPONENTES
        ├── navbar.jsx             (Barra de navegación)
        ├── footer.jsx             (Pie de página + Formulario contacto)
        ├── ProductList.jsx        (Lista de productos)
        ├── ProductDetail.jsx      (Detalle de producto)
        ├── ImageUpload.jsx        (Upload de imágenes)
        ├── home.css               (Estilos de HomePage)
        ├── calefaccion.css        (Estilos de Calefacción)
        ├── climatizacion.css      (Estilos de Climatización)
        └── ventilacion.css        (Estilos de Ventilación)
```

---

## 🖼️ IMÁGENES POR SECCIÓN

### Ubicación física
```
c:\MigracionRepos\frontend-hotandcold\public\assets\
```

### Archivos disponibles

#### Calefacción (c*.webp)
```
c1.webp   - Imagen 1 de calefacción
c2.webp   - Imagen 2 de calefacción
c3.webp   - Imagen 3 de calefacción
c4.webp   - Imagen 4 de calefacción
```

#### Climatización (cli*.avif, climatizacion.*)
```
cli1.avif   - Imagen 1 climatización
cli2.avif   - Imagen 2 climatización
cli3.avif   - Imagen 3 climatización
cli4.avif   - Imagen 4 climatización
climatizacion.jpg
climatizacion.webp
```

#### Calderas Instaladas (a*.webp)
```
a1.webp   - Instalación 1
a2.webp   - Instalación 2
a3.webp   - Instalación 3
a4.webp   - Instalación 4
```

#### Loza y Piso Radiante (e*.webp)
```
e1.webp   - Piso radiante 1
e2.webp   - Piso radiante 2
e3.webp   - Piso radiante 3
e4.webp   - Piso radiante 4
```

#### Calefacción Central (o*.webp)
```
o1.webp   - Radiador/Central 1
o2.webp   - Radiador/Central 2
o3.webp   - Radiador/Central 3
o4.webp   - Radiador/Central 4
o5.jpg    - Instalación gas
```

#### Instalaciones de Gas (u*.webp)
```
u1.webp   - Gas 1
u2.webp   - Gas 2
u3.webp   - Gas 3
u4.webp   - Gas 4
```

#### Imágenes generales (h*.avif, t*.jpg)
```
h2.avif, h3.avif, h4.avif, h5.avif, h6.avif  - Imágenes de servicios
logo.avif                                       - Logo empresa
r.avif, r2.avif                               - Imágenes adicionales
t1.jpg a t9.jpg                               - Trabajos realizados
```

#### Otros
```
casa.webp, anwo.webp, documento.webp, llave.jpg, login.jpg, termo.jpg
```

---

## 📝 TEXTOS POR PÁGINA

### 1. HomePage.jsx
**Ubicación:** `src/pages/HomePage.jsx` (438 líneas)

**Contenido:**

#### Categorías de trabajos (líneas 31-45)
```javascript
const categorias = [
  {
    categoria: "Calderas y Piso Mural",
    imagenes: ['/assets/c2.webp', '/assets/c1.webp', '/assets/c3.webp', '/assets/c4.webp']
  },
  {
    categoria: "Calderas Instaladas",
    imagenes: ['/assets/a1.webp', '/assets/a2.webp', '/assets/a3.webp', '/assets/a4.webp']
  },
  // ... más categorías
];
```

**Dónde están los textos descriptivos:**
```jsx
// Línea 270-280: "Climatización Residencial"
<h3 className="font-bold text-lg text-black mt-4">Climatización Residencial</h3>
<p className="font-bold text-base text-black">
  Disfrutá el confort con nuestros climatizadores...
</p>

// Línea 281-290: "Calderas y Circuitos de Calefacción"
<h3 className="font-bold text-xl text-black mt-4 mb-2">Calderas y Circuitos de Calefacción</h3>
<p className="font-bold text-base text-black">
  Ponemos a punto calderas y circuitos...
</p>

// Línea 291-300: "Eficiencia Energética"
<h3 className="font-bold text-xl text-black mt-4">Eficiencia Energética - Paneles Solares</h3>

// Línea 301-310: "Bombas de Calor"
<h3 className="font-bold text-xl text-black mt-4 mb-2">Bombas de Calor para Piscinas</h3>
```

#### Formulario de Cotización (líneas 125-270)
```javascript
const [formData, setFormData] = useState({
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  direccion: "",
  rol: "",
  mensaje: ""
});
```

**Texto del formulario:**
```jsx
<h2 className="text-xl font-light mb-4">
  ¡Obtenga una cotización sin compromiso hoy!
</h2>
```

---

### 2. Calefaccion.jsx
**Ubicación:** `src/pages/Calefaccion.jsx` (143 líneas)

**Textos principales:**

#### Encabezado (línea 37-42)
```jsx
<h2>Calefacción y climatización centralizada para todo tipo de espacios</h2>
```

#### Descripción general (línea 48-54)
```jsx
<p>
  En Hot and Cold, nos especializamos en el diseño e instalación de sistemas 
  de calefacción y climatización centralizada, adaptados a las necesidades 
  específicas de cada cliente...
</p>
```

#### Tarjetas de beneficios (línea 62-85)
```jsx
<div className="calefaccion-card">
  <h2>¿Por qué calefacción centralizada?</h2>
  <p>Mejora la calidad del aire, elimina puntos fríos...</p>
</div>

<div className="calefaccion-card">
  <h2>Ideal para inmuebles exigentes</h2>
  <p>Perfecta para casas de más de un piso...</p>
</div>

<div className="calefaccion-card">
  <h2>Compatibilidad con energía solar y bombas de calor</h2>
  <p>Nuestros sistemas permiten integración...</p>
</div>

<div className="calefaccion-card">
  <h2>Instalación limpia y planificada</h2>
  <p>Nos adaptamos a las etapas de tu proyecto...</p>
</div>

<div className="calefaccion-card">
  <h2>¿Cuánto puedes ahorrar?</h2>
  <p>Un sistema bien diseñado puede reducir hasta un 30%...</p>
</div>
```

---

### 3. Climatizacion.jsx
**Ubicación:** `src/pages/Climatizacion.jsx` (151 líneas)

**Textos principales:**

#### Encabezado (línea 36-39)
```jsx
<h2>Proyectos y Servicios de Climatización</h2>
<p>Soluciones modernas y eficientes para tu confort térmico.</p>
```

#### Tarjeta principal (línea 44-48)
```jsx
<h2>¿Por que elegir a Hot And Cold?</h2>
```

#### Tarjetas de servicios (línea 49-67)
```jsx
<div class="clima-card">
  <h2>Atención personalizada y asesoría técnica experta</h2>
  <p>Evaluación del espacio y recomendaciones personalizadas...</p>
</div>

<div class="clima-card">
  <h2>Certificación y cumplimiento normativo</h2>
  <p>Técnicos certificados y cumplimiento con todas las normativas...</p>
</div>

<div class="clima-card">
  <h2>Garantía extendida y mantenimiento preventivo</h2>
  <p>Servicios con garantía prolongada...</p>
</div>

<div class="clima-card">
  <h2>Eficiencia energética y tecnología de punta</h2>
  <p>Uso de equipos de última generación...</p>
</div>
```

#### Imagen destacada (línea 76-84)
```jsx
<img src="/assets/t2.jpg" alt="Imagen del Card" />
```

#### Procedimiento (línea 89-91)
```jsx
<h2>¿Cómo realizamos nuestro trabajo?</h2>
```

---

### 4. Ventilacion.jsx
**Ubicación:** `src/pages/Ventilacion.jsx` (106 líneas)

**Textos principales:**

#### Encabezado (línea 25-26)
```jsx
<h2></h2>  {/* Vacío, pero hay overlay */}
```

#### Tarjeta principal (línea 35-41)
```jsx
<h2>Un mañana mejor</h2>
<p>Respira aire puro, vive con bienestar. Sistemas de ventilación...</p>
```

#### Descripción general (línea 47-49)
```jsx
<p>
  Ofrecemos soluciones de ventilación mecánica y natural para mejorar 
  la calidad del aire en hogares, oficinas e industrias...
</p>
```

#### Tarjetas de beneficios (línea 51-68)
```jsx
<div class="clima-card">
  <h2>Mejora la calidad del aire</h2>
  <p>Elimina contaminantes, olores y partículas en suspensión...</p>
</div>

<div class="clima-card">
  <h2>Control de humedad</h2>
  <p>Evita la condensación, hongos y problemas estructurales...</p>
</div>

<div class="clima-card">
  <h2>Cumplimiento normativo</h2>
  <p>Instalamos sistemas según las normativas...</p>
</div>

<div class="clima-card">
  <h2>Soluciones a medida</h2>
  <p>Diseñamos sistemas adaptados al tipo de inmueble...</p>
</div>
```

#### Sección "Trabaja con Nosotros" (línea 75-88)
```jsx
<h2>Trabaja con Nosotros</h2>

<div class="clima-card-b">
  <h2>Sé parte de nuestro equipo</h2>
  <p>Buscamos personas comprometidas, con ganas de crecer...</p>
</div>

<div class="clima-card-b">
  <h2>Crece con nosotros</h2>
  <p>Ofrecemos oportunidades de formación...</p>
</div>
```

#### Imagen destacada (línea 91-100)
```jsx
<img src="/assets/t3.jpg" alt="Imagen del Card" />
```

---

## 🎨 ESTILOS CSS

### Por archivo

| Archivo CSS | Página | Ubicación |
|-------------|--------|-----------|
| `home.css` | HomePage.jsx | `src/components/home.css` |
| `calefaccion.css` | Calefaccion.jsx | `src/components/calefaccion.css` |
| `climatizacion.css` | Climatizacion.jsx | `src/components/climatizacion.css` |
| `ventilacion.css` | Ventilacion.jsx | `src/components/ventilacion.css` |
| `navbar.css` | Navbar | `src/components/navbar.css` |
| `footer.css` (si existe) | Footer | `src/components/` |
| `login.css` | Login | `src/components/login.css` |
| `admin.css` | Admin | `src/components/admin.css` |

---

## 🔧 CÓMO EDITAR EL CONTENIDO

### 1. Cambiar una imagen
```bash
# Opción A: Reemplazar archivo existente
# Ve a: c:\MigracionRepos\frontend-hotandcold\public\assets\
# Reemplaza el archivo (ej: c1.webp)

# Opción B: Agregar nueva imagen
# Copia la imagen a la carpeta assets/
# Actualiza la referencia en el código JSX
```

### 2. Cambiar un texto
```javascript
// En Calefaccion.jsx, por ejemplo:
// Antes:
<h2>¿Por qué calefacción centralizada?</h2>
<p>Mejora la calidad del aire, elimina puntos fríos...</p>

// Después:
<h2>Tu nuevo título aquí</h2>
<p>Tu nuevo texto aquí...</p>
```

### 3. Agregar una nueva tarjeta de beneficios
```jsx
// En Calefaccion.jsx, agrega:
<div className="calefaccion-card">
  <h2>Nuevo beneficio</h2>
  <p>Descripción del nuevo beneficio aquí...</p>
</div>
```

### 4. Cambiar colores o estilos
```css
/* En calefaccion.css */
.calefaccion-card {
  background-color: #8ad1da;  /* Cambia el color aquí */
  padding: 20px;
  border-radius: 10px;
}
```

---

## 📊 MAPA DE CONTENIDO COMPLETO

```
PÁGINA INICIO (HomePage.jsx)
├── Barra de Navegación
│   └── Links a: Calefacción, Climatización, Ventilación, Tienda
│
├── Lista de Productos (ProductList component)
│   └── Muestra productos de Firebase (si está configurado)
│
├── Banner principal
│   ├── Imagen: logo.avif
│   └── Texto: "Proyectos y Servicios de Climatización"
│
├── Formulario de Cotización
│   ├── Campos: nombre, apellido, email, teléfono, dirección, rol, mensaje
│   ├── Endpoint: /api/contact
│   └── Almacena en: Firebase Firestore (colección "mensajes")
│
├── Tarjetas de servicios (4 cards)
│   ├── Climatización Residencial (Imagen: h2.avif)
│   ├── Calderas y Circuitos (Imagen: h3.avif)
│   ├── Eficiencia Energética (Imagen: hh6.jpg)
│   └── Bombas de Calor (Imagen: hh4.webp)
│
├── Sección "Nuestros trabajos"
│   └── 5 categorías de imágenes:
│       ├── Calderas y Piso Mural (c1-c4.webp)
│       ├── Calderas Instaladas (a1-a4.webp)
│       ├── Loza y Piso Radiante (e1-e4.webp)
│       ├── Calefacción Central (o1-o4.webp)
│       └── Instalaciones de Gas (u1-u4.webp)
│
├── Sección "Sello Diferenciador" (3 cards)
│   ├── Puntualidad
│   ├── Experiencia en el rubro
│   └── Manejo de proyectos bajo presión
│
└── Footer con formulario de contacto
    ├── Campos: nombre, apellido, email, teléfono, mensaje
    ├── Endpoint: /api/contact-footer
    └── Almacena en: Firebase Firestore (colección "contactos")

─────────────────────────────────────────────────────

PÁGINA CALEFACCIÓN (Calefaccion.jsx)
├── Imagen banner: bg-image (CSS background)
├── Título: "Calefacción y climatización centralizada..."
├── Descripción larga
└── 5 tarjetas de beneficios:
    ├── ¿Por qué calefacción centralizada?
    ├── Ideal para inmuebles exigentes
    ├── Compatibilidad con energía solar
    ├── Instalación limpia y planificada
    └── ¿Cuánto puedes ahorrar?

─────────────────────────────────────────────────────

PÁGINA CLIMATIZACIÓN (Climatizacion.jsx)
├── Imagen banner: bg-image
├── Título: "Proyectos y Servicios de Climatización"
├── Tarjeta principal: "¿Por qué elegir a Hot And Cold?"
├── 4 tarjetas de servicios:
│   ├── Atención personalizada
│   ├── Certificación normativa
│   ├── Garantía y mantenimiento
│   └── Eficiencia energética
├── Imagen destacada: t2.jpg
├── Sección: "¿Cómo realizamos nuestro trabajo?"
└── Más detalles...

─────────────────────────────────────────────────────

PÁGINA VENTILACIÓN (Ventilacion.jsx)
├── Imagen banner: bg-image
├── Tarjeta: "Un mañana mejor"
├── Descripción de servicios
├── 4 tarjetas de beneficios:
│   ├── Mejora la calidad del aire
│   ├── Control de humedad
│   ├── Cumplimiento normativo
│   └── Soluciones a medida
├── Sección: "Trabaja con Nosotros"
│   ├── "Sé parte de nuestro equipo"
│   └── "Crece con nosotros"
├── Imagen destacada: t3.jpg
└── Footer
```

---

## 🔍 ARCHIVOS MÁS IMPORTANTE A EDITAR

### Si quieres cambiar textos de servicios:
1. `src/pages/Calefaccion.jsx` (Calefacción)
2. `src/pages/Climatizacion.jsx` (Climatización)
3. `src/pages/Ventilacion.jsx` (Ventilación)
4. `src/pages/HomePage.jsx` (Inicio y cotización)

### Si quieres cambiar imágenes:
1. Reemplaza archivos en `public/assets/`
2. O actualiza referencias en los archivos JSX

### Si quieres cambiar estilos:
1. `src/components/calefaccion.css`
2. `src/components/climatizacion.css`
3. `src/components/ventilacion.css`
4. `src/components/home.css`

### Si quieres agregar contenido a Firebase:
1. Usa Firebase Console: https://console.firebase.google.com
2. Proyecto: `hotandcold-15168`
3. Firestore Database → Colecciones

---

## 📝 NOTAS IMPORTANTES

1. **Las imágenes se sirven desde:** `public/assets/`
   - En el código se referencian como: `/assets/nombre.webp`

2. **Los textos están hardcodeados en JSX:**
   - Para cambiar texto, debes editar el archivo .jsx
   - No hay base de datos de contenidos

3. **Los formularios guardan en Firebase:**
   - Cotizaciones → colección `mensajes`
   - Contacto footer → colección `contactos`

4. **El servidor backend:**
   - Port 3001: `backend-hotandcold/test-server.js`
   - Endpoints: `/api/contact`, `/api/contact-footer`

---

¡Todo el contenido está centralizado y listo para editar! 🚀
