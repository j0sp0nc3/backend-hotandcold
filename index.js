const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const admin = require('firebase-admin');

// Utilidades
const { sendQuotationEmail, sendContactEmail } = require('./utils/emailService');

console.log('📦 Cargando módulos...');

let db;
try {
  const { db: firebaseDb } = require('./config/firebaseAdmin');
  db = firebaseDb;
  console.log('✅ Firebase inicializado correctamente');
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error.message);
  db = null;
}

const verifyToken = require('./middlewares/verifyToken');
const authRoutes = require('./routes/auth');

// Variables de configuración
const PORT = process.env.PORT || 3000;

// La inicialización de Firebase Admin se realiza en config/firebaseAdmin.js

const app = express(); // Definir la instancia de Express

console.log('🚀 Inicializando Express...');

// Debug middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Middlewares globales
app.use(express.json()); // Parseo de JSON

// Configurar CORS
const corsOptions = {
  origin: ['https://www.hotandcold.cl', 'https://hotandcold.onrender.com', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/api', authRoutes);

app.post('/api/contact', async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, rol } = req.body;

  try {
    // Validar datos requeridos
    if (!nombre || !apellido || !email) {
      return res.status(400).json({ message: 'Nombre, apellido y email son requeridos' });
    }

    // 1. Enviar email
    await sendQuotationEmail({ nombre, apellido, email, telefono, direccion, rol });

    // 2. Guardar cotización en Firestore
    await db.collection('cotizaciones').add({
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      rol,
      fecha: new Date()
    });

    res.status(200).json({ message: 'Mensaje enviado y cotización guardada correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar el mensaje o guardar la cotización:', error);
    res.status(500).json({ message: 'Error al enviar el mensaje o guardar la cotización', error: error.message });
  }
});



app.post('/api/contact-footer', async (req, res) => {
  const { nombre, apellido, telefono, email, mensaje } = req.body;

  try {
    // Validar datos requeridos
    if (!nombre || !apellido || !email || !mensaje) {
      return res.status(400).json({ message: 'Nombre, apellido, email y mensaje son requeridos' });
    }

    // 1. Guardar en Firestore
    await db.collection('mensajes-contacto').add({
      nombre,
      apellido,
      telefono,
      email,
      mensaje,
      timestamp: new Date()
    });

    // 2. Enviar correo
    await sendContactEmail({ nombre, apellido, telefono, email, mensaje });

    res.status(200).json({ message: 'Mensaje guardado y enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al procesar el mensaje:', error);
    res.status(500).json({ message: 'Error al enviar o guardar el mensaje', error: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
