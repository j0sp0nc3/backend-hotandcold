# 💻 GUÍA TÉCNICA - Cómo Funcionan los Componentes

Este documento muestra código real de cómo funcionan los componentes principales.

---

## 1️⃣ AUTENTICACIÓN (AuthContext.jsx)

### ¿Qué es?
Un **Context de React** que mantiene el estado del usuario logueado en toda la aplicación.

### Ubicación
`src/context/AuthContext.jsx`

### Código simplificado
```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el contexto
const AuthContext = createContext();

// 2. Provider que envuelve toda la app
export const AuthProvider = ({ children }) => {
  // Estado: usuario actualmente logueado
  const [user, setUser] = useState(null);

  // Función: hacer login
  const login = (userData) => {
    setUser(userData);                                    // Guarda en memoria
    localStorage.setItem('user', JSON.stringify(userData)); // Guarda en disco
  };

  // Función: logout
  const logout = () => {
    setUser(null);                    // Limpia memoria
    localStorage.removeItem('user');  // Limpia disco
  };

  // Al cargar la app, recupera usuario de localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Restaura sesión
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook para usar el contexto en componentes
export const useAuth = () => {
  return useContext(AuthContext);
};
```

### Cómo se usa
```javascript
// En cualquier componente:
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <p>No estás logueado</p>;
  }

  return (
    <div>
      <p>Hola, {user.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 2️⃣ CONFIGURACIÓN DE API (apiConfig.js)

### ¿Qué es?
Un archivo **centralizado** que define todas las URLs de la API.

### Ubicación
`src/config/apiConfig.js`

### Código
```javascript
// Lee variable de ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Exporta todas las URLs
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  
  // Formularios
  CONTACT: `${API_BASE_URL}/api/contact`,
  CONTACT_FOOTER: `${API_BASE_URL}/api/contact-footer`,
  
  // Datos
  STATS: `${API_BASE_URL}/api/stats`,
};
```

### Por qué es útil
Si cambias el servidor:
- **Sin centralization:** Cambias 10 archivos
- **Con centralization:** Cambias 1 archivo (.env.local)

### Cómo se usa
```javascript
import { API_ENDPOINTS } from '../config/apiConfig';

// Usar en requests
fetch(API_ENDPOINTS.LOGIN, {
  method: 'POST',
  body: JSON.stringify({ username, password })
});
```

---

## 3️⃣ FORMULARIO DE LOGIN (login.jsx)

### ¿Qué es?
Una página que permite a usuarios iniciar sesión.

### Ubicación
`src/pages/login.jsx`

### Flujo
```
1. Usuario llena username y password
    ↓
2. Hace click en "Enviar"
    ↓
3. handleSubmit() valida datos localmente
    ↓
4. POST a /api/login con credenciales
    ↓
5. Backend verifica en Firestore
    ↓
6. Si es correcto:
   - Recibe token JWT
   - Guarda usuario en localStorage (AuthContext)
   - Redirige a HomePage
    ↓
7. Si es incorrecto:
   - Muestra error
```

### Código simplificado
```javascript
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/apiConfig';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      // 1. Envía credenciales al backend
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      // 2. Si es correcto
      if (response.ok) {
        // Guarda usuario en contexto + localStorage
        login({
          username: data.user.username,
          token: data.token
        });
        
        // Redirige a inicio
        window.location.href = '/';
      } else {
        // 3. Si hay error
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario"
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Enviar</button>
    </form>
  );
}
```

---

## 4️⃣ FORMULARIO DE COTIZACIÓN (HomePage.jsx)

### ¿Qué es?
Una página con un formulario para solicitar cotizaciones.

### Ubicación
`src/pages/HomePage.jsx`

### Flujo
```
1. Usuario rellena:
   - Nombre
   - Apellido
   - Email
   - Teléfono
   - Dirección
   - Rol (Dueño casa / Negocio)
   - Mensaje

2. Hace click "Enviar"

3. handleSubmit() valida

4. POST a /api/contact

5. Backend almacena en Firebase

6. Responde éxito

7. Frontend:
   - Muestra "Mensaje enviado"
   - Limpia formulario
```

### Código simplificado
```javascript
import { useState } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';

function HomePage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    rol: '',
    mensaje: ''
  });

  const [message, setMessage] = useState('');

  // Actualiza estado cuando cambias inputs
  function handleChange(e) {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  }

  // Envía al backend
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // 1. POST a backend
      const response = await fetch(API_ENDPOINTS.CONTACT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      // 2. Si es éxito
      if (response.ok) {
        setMessage({
          texto: 'Mensaje enviado correctamente',
          tipo: 'success'
        });
        
        // Limpia formulario
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          direccion: '',
          rol: '',
          mensaje: ''
        });

        // Oculta mensaje después de 3 segundos
        setTimeout(() => setMessage({ texto: '', tipo: '' }), 3000);
      } else {
        setMessage({
          texto: 'Error: ' + data.message,
          tipo: 'error'
        });
      }
    } catch (error) {
      setMessage({
        texto: 'Error al enviar el formulario',
        tipo: 'error'
      });
    }
  }

  return (
    <div>
      {/* Muestra mensaje de éxito/error */}
      {message.texto && (
        <div className={`mensaje ${message.tipo}`}>
          {message.texto}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <input
          type="text"
          id="apellido"
          value={formData.apellido}
          onChange={handleChange}
          placeholder="Apellido"
          required
        />
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="tel"
          id="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          required
        />
        <input
          type="text"
          id="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Dirección"
          required
        />

        <label>
          <input
            type="checkbox"
            id="dueno-casa"
            checked={formData.rol === 'Dueño de Casa'}
            onChange={handleChange}
          />
          Dueño de Casa
        </label>

        <label>
          <input
            type="checkbox"
            id="dueno-negocio"
            checked={formData.rol === 'Dueño de Negocio'}
            onChange={handleChange}
          />
          Dueño de Negocio
        </label>

        <textarea
          id="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          placeholder="Mensaje"
          required
        ></textarea>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
```

---

## 5️⃣ BACKEND - RUTAS DE AUTENTICACIÓN (routes/auth.js)

### ¿Qué es?
Archivo que define cómo el backend procesa login y registro.

### Ubicación
`backend-hotandcold/routes/auth.js`

### POST /api/register
```javascript
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Valida que vienen los datos
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Usuario y contraseña requeridos' 
      });
    }

    // 2. Busca si usuario ya existe en Firestore
    const userQuery = await db.collection('usuarios')
      .where('username', '==', username)
      .get();
    
    if (!userQuery.empty) {
      return res.status(400).json({ 
        message: 'El usuario ya existe' 
      });
    }

    // 3. Hashea contraseña (no se guarda en claro)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Guarda en Firestore
    await db.collection('usuarios').add({
      username,
      password: hashedPassword,
      createdAt: new Date()
    });

    // 5. Responde éxito
    res.status(201).json({ 
      message: 'Usuario registrado con éxito' 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error del servidor', 
      error: err.message 
    });
  }
});
```

### POST /api/login
```javascript
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Valida
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Usuario y contraseña requeridos' 
      });
    }

    // 2. Busca usuario en Firestore
    const userQuery = await db.collection('usuarios')
      .where('username', '==', username)
      .get();

    if (userQuery.empty) {
      return res.status(401).json({ 
        message: 'Usuario o contraseña incorrecto' 
      });
    }

    const user = userQuery.docs[0].data();

    // 3. Compara contraseñas hasheadas
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Usuario o contraseña incorrecto' 
      });
    }

    // 4. Genera JWT token
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 5. Responde con token
    res.json({
      message: 'Login exitoso',
      token: token,
      user: {
        username: user.username
      }
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error del servidor' 
    });
  }
});
```

---

## 6️⃣ BACKEND - FORMULARIOS (test-server.js)

### POST /api/contact (Cotización)
```javascript
app.post('/api/contact', (req, res) => {
  console.log('📥 POST /api/contact', req.body);
  
  // 1. Almacena en array (desarrollo)
  mensajes.push({
    ...req.body,
    timestamp: new Date().toISOString(),
    id: mensajes.length + 1
  });
  
  // 2. O en Firebase (producción)
  // await db.collection('mensajes').add({
  //   ...req.body,
  //   timestamp: new Date()
  // });

  // 3. Responde
  res.json({ 
    message: 'Mensaje enviado y cotización guardada correctamente' 
  });
});
```

### POST /api/contact-footer (Contacto)
```javascript
app.post('/api/contact-footer', (req, res) => {
  console.log('📥 POST /api/contact-footer', req.body);
  
  // Almacena contacto
  contactos.push({
    ...req.body,
    timestamp: new Date().toISOString(),
    id: contactos.length + 1
  });

  res.json({ 
    message: 'Mensaje guardado y enviado correctamente' 
  });
});
```

### GET /api/almacenamiento (Ver todo)
```javascript
app.get('/api/almacenamiento', (req, res) => {
  res.json({
    usuarios: Array.from(usuarios.entries()),
    mensajes: mensajes,
    contactos: contactos,
    resumen: {
      total_usuarios: usuarios.size,
      total_mensajes: mensajes.length,
      total_contactos: contactos.length
    }
  });
});
```

---

## 🔄 EJEMPLO COMPLETO: Un usuario envía un formulario

### Paso 1: Frontend (footer.jsx)
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const data = {
    nombre: "José",
    apellido: "Ponce",
    email: "jose@example.com",
    telefono: "989639876",
    mensaje: "Consulta"
  };

  try {
    const response = await axios.post(
      API_ENDPOINTS.CONTACT_FOOTER,  // "http://localhost:3001/api/contact-footer"
      data
    );

    if (response.status === 200) {
      alert('Mensaje enviado!');
      setFormData({ nombre: "", apellido: "", ... });
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

### Paso 2: HTTP Request
```
POST http://localhost:3001/api/contact-footer
Content-Type: application/json

{
  "nombre": "José",
  "apellido": "Ponce",
  "email": "jose@example.com",
  "telefono": "989639876",
  "mensaje": "Consulta"
}
```

### Paso 3: Backend (test-server.js)
```javascript
app.post('/api/contact-footer', (req, res) => {
  // 1. Recibe datos
  console.log('Datos recibidos:', req.body);

  // 2. Almacena
  contactos.push({
    id: contactos.length + 1,
    nombre: "José",
    apellido: "Ponce",
    email: "jose@example.com",
    telefono: "989639876",
    mensaje: "Consulta",
    timestamp: "2024-01-11T20:30:00.000Z"
  });

  // 3. Responde
  res.json({ message: "Mensaje guardado y enviado correctamente" });
});
```

### Paso 4: HTTP Response
```
Status: 200 OK
Content-Type: application/json

{
  "message": "Mensaje guardado y enviado correctamente"
}
```

### Paso 5: Frontend procesa respuesta
```javascript
if (response.status === 200) {
  alert('Mensaje enviado!');  // Muestra éxito
  setFormData({ ... });       // Limpia formulario
}
```

### Paso 6: Ver datos almacenados
```
GET http://localhost:3001/api/contactos

Response:
{
  "total": 1,
  "contactos": [
    {
      "id": 1,
      "nombre": "José",
      "apellido": "Ponce",
      "email": "jose@example.com",
      "telefono": "989639876",
      "mensaje": "Consulta",
      "timestamp": "2024-01-11T20:30:00.000Z"
    }
  ]
}
```

---

¡Espero que estos ejemplos de código te ayuden a entender mejor cómo funciona todo! 🚀
