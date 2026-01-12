/**
 * TEST SERVER
 * Servidor de testing con almacenamiento dual (Firestore + local)
 * Útil para desarrollo y testing sin dependencias externas
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

require('dotenv').config();

const { db } = require('./config/firebaseAdmin');
const { sendQuotationEmail, sendContactEmail } = require('./utils/emailService');

const app = express();
const PORT = process.env.TEST_PORT || 3001;

console.log('🧪 Iniciando servidor de testing...\n');

// Almacenamiento en memoria para testing
const usuarios = new Map();
const mensajesLocales = [];
const contactosLocales = [];

// Archivo de backup local
const BACKUP_FILE = path.join(__dirname, 'data-backup.json');

// ============================================
// UTILIDADES
// ============================================

/**
 * Cargar datos desde archivo si existe
 */
function cargarDatos() {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const data = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
      mensajesLocales.push(...(data.mensajes || []));
      contactosLocales.push(...(data.contactos || []));
      console.log('✅ Datos cargados desde backup local');
    }
  } catch (err) {
    console.log('ℹ️  Sin datos previos en backup');
  }
}

/**
 * Guardar datos en archivo local
 */
function guardarDatos() {
  try {
    fs.writeFileSync(BACKUP_FILE, JSON.stringify({
      mensajes: mensajesLocales,
      contactos: contactosLocales,
      usuarios: Array.from(usuarios.entries()).map(([username, data]) => ({ username, ...data })),
      timestamp: new Date().toISOString()
    }, null, 2));
  } catch (err) {
    console.error('⚠️  Error guardando backup:', err.message);
  }
}

/**
 * Generar ID único local
 */
function generarIdLocal() {
  return 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Cargar datos al iniciar
cargarDatos();

// ============================================
// MIDDLEWARES
// ============================================

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],
  credentials: true
}));

// Debug middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// ============================================
// RUTAS - AUTENTICACIÓN
// ============================================

/**
 * Registro de usuario
 */
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
    }

    if (usuarios.has(username)) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    usuarios.set(username, { 
      password: hashedPassword, 
      createdAt: new Date().toISOString() 
    });

    guardarDatos();

    console.log('✅ Usuario registrado:', username);
    res.status(201).json({ message: 'Usuario registrado con éxito', username });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ message: 'Error del servidor', error: err.message });
  }
});

/**
 * Login de usuario
 */
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
    }

    const userData = usuarios.get(username);
    if (!userData) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, userData.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    console.log('✅ Login exitoso:', username);
    res.json({ message: 'Login exitoso', username });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ message: 'Error del servidor', error: err.message });
  }
});

// ============================================
// RUTAS - CONTACTO Y FORMULARIOS
// ============================================

/**
 * Contacto - Cotización
 */
app.post('/api/contact', async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, rol } = req.body;

  try {
    if (!nombre || !apellido || !email) {
      return res.status(400).json({ message: 'Nombre, apellido y email son requeridos' });
    }

    const documento = {
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      rol,
      timestamp: new Date().toISOString(),
      tipo: 'cotizacion',
      id: generarIdLocal()
    };

    // Intentar guardar en Firestore primero
    try {
      const docRef = await db.collection('cotizaciones').add(documento);
      console.log('✅ Cotización guardada en Firestore con ID:', docRef.id);

      // Intentar enviar email
      try {
        await sendQuotationEmail({ nombre, apellido, email, telefono, direccion, rol });
        console.log('📧 Email enviado correctamente');
      } catch (emailErr) {
        console.warn('⚠️  Error enviando email:', emailErr.message);
      }

      res.json({
        message: 'Cotización guardada correctamente',
        id: docRef.id,
        storage: 'firestore'
      });
    } catch (firestoreError) {
      console.warn('⚠️  Firestore no disponible, guardando localmente');
      mensajesLocales.push(documento);
      guardarDatos();

      res.json({
        message: 'Cotización guardada localmente (Firestore no disponible)',
        id: documento.id,
        storage: 'local',
        warning: 'Sincronización con Firebase pendiente'
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ message: 'Error al procesar la cotización', error: error.message });
  }
});

/**
 * Contacto - Footer
 */
app.post('/api/contact-footer', async (req, res) => {
  const { nombre, apellido, telefono, email, mensaje } = req.body;

  try {
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ message: 'Nombre, email y mensaje son requeridos' });
    }

    const documento = {
      nombre,
      apellido,
      telefono,
      email,
      mensaje,
      timestamp: new Date().toISOString(),
      tipo: 'contacto-footer',
      id: generarIdLocal()
    };

    // Intentar guardar en Firestore primero
    try {
      const docRef = await db.collection('mensajes-contacto').add(documento);
      console.log('✅ Mensaje guardado en Firestore con ID:', docRef.id);

      // Intentar enviar email
      try {
        await sendContactEmail({ nombre, apellido, telefono, email, mensaje });
        console.log('📧 Email de contacto enviado correctamente');
      } catch (emailErr) {
        console.warn('⚠️  Error enviando email:', emailErr.message);
      }

      res.json({
        message: 'Mensaje guardado correctamente',
        id: docRef.id,
        storage: 'firestore'
      });
    } catch (firestoreError) {
      console.warn('⚠️  Firestore no disponible, guardando localmente');
      contactosLocales.push(documento);
      guardarDatos();

      res.json({
        message: 'Mensaje guardado localmente (Firestore no disponible)',
        id: documento.id,
        storage: 'local',
        warning: 'Sincronización con Firebase pendiente'
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ message: 'Error al procesar el mensaje', error: error.message });
  }
});

// ============================================
// RUTAS - ESTADÍSTICAS Y DEBUGGING
// ============================================

/**
 * Stats generales
 */
app.get('/api/stats', (req, res) => {
  res.json({
    status: 'ok',
    usuarios: usuarios.size,
    timestamp: new Date(),
    servidor: 'testing'
  });
});

/**
 * Ver todos los mensajes (Firestore + locales)
 */
app.get('/api/mensajes', async (req, res) => {
  const mensajes = [...mensajesLocales];

  try {
    const snapshot = await db.collection('mensajes-contacto').orderBy('fecha', 'desc').get();
    snapshot.forEach(doc => {
      mensajes.push({
        id: doc.id,
        ...doc.data(),
        timestamp: typeof doc.data().fecha === 'object'
          ? doc.data().fecha.toDate().toISOString()
          : doc.data().fecha,
        source: 'firestore'
      });
    });
  } catch (error) {
    console.warn('⚠️  Firestore no disponible, mostrando solo datos locales');
  }

  // Ordenar por timestamp descendente
  mensajes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({
    total: mensajes.length,
    mensajes: mensajes,
    sources: {
      firestore: mensajes.filter(m => m.source === 'firestore').length,
      local: mensajesLocales.length
    }
  });
});

/**
 * Ver todos los contactos (Firestore + locales)
 */
app.get('/api/contactos', async (req, res) => {
  const contactos = [...contactosLocales];

  try {
    const snapshot = await db.collection('cotizaciones').orderBy('fecha', 'desc').get();
    snapshot.forEach(doc => {
      contactos.push({
        id: doc.id,
        ...doc.data(),
        timestamp: typeof doc.data().fecha === 'object'
          ? doc.data().fecha.toDate().toISOString()
          : doc.data().fecha,
        source: 'firestore'
      });
    });
  } catch (error) {
    console.warn('⚠️  Firestore no disponible, mostrando solo datos locales');
  }

  // Ordenar por timestamp descendente
  contactos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({
    total: contactos.length,
    contactos: contactos,
    sources: {
      firestore: contactos.filter(c => c.source === 'firestore').length,
      local: contactosLocales.length
    }
  });
});

/**
 * Ver almacenamiento completo
 */
app.get('/api/almacenamiento', async (req, res) => {
  const datosFirestore = { mensajes: [], contactos: [] };

  try {
    const contactosSnapshot = await db.collection('cotizaciones').get();
    const mensajesSnapshot = await db.collection('mensajes-contacto').get();

    contactosSnapshot.forEach(doc => {
      datosFirestore.contactos.push({
        id: doc.id,
        ...doc.data(),
        timestamp: typeof doc.data().fecha === 'object'
          ? doc.data().fecha.toDate().toISOString()
          : doc.data().fecha,
        source: 'firestore'
      });
    });

    mensajesSnapshot.forEach(doc => {
      datosFirestore.mensajes.push({
        id: doc.id,
        ...doc.data(),
        timestamp: typeof doc.data().timestamp === 'object'
          ? doc.data().timestamp.toDate().toISOString()
          : doc.data().timestamp,
        source: 'firestore'
      });
    });
  } catch (error) {
    console.warn('⚠️  Firestore no disponible');
  }

  // Combinar datos locales y de Firestore
  const todosMensajes = [...mensajesLocales, ...datosFirestore.mensajes];
  const todosContactos = [...contactosLocales, ...datosFirestore.contactos];

  // Ordenar por timestamp
  todosMensajes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  todosContactos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({
    mensajes: todosMensajes,
    contactos: todosContactos,
    resumen: {
      total_mensajes: todosMensajes.length,
      total_contactos: todosContactos.length,
      mensajes_firestore: datosFirestore.mensajes.length,
      mensajes_locales: mensajesLocales.length,
      contactos_firestore: datosFirestore.contactos.length,
      contactos_locales: contactosLocales.length
    }
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`\n✅ Servidor de testing escuchando en http://localhost:${PORT}`);
  console.log('📊 Endpoints disponibles:');
  console.log(`   POST http://localhost:${PORT}/api/register`);
  console.log(`   POST http://localhost:${PORT}/api/login`);
  console.log(`   POST http://localhost:${PORT}/api/contact`);
  console.log(`   POST http://localhost:${PORT}/api/contact-footer`);
  console.log(`   GET  http://localhost:${PORT}/api/stats`);
  console.log(`   GET  http://localhost:${PORT}/api/mensajes`);
  console.log(`   GET  http://localhost:${PORT}/api/contactos`);
  console.log(`   GET  http://localhost:${PORT}/api/almacenamiento\n`);
});
