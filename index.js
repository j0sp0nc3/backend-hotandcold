/**
 * SERVIDOR PRINCIPAL
 * Express backend para Hot and Cold
 * Autenticación con Firestore + bcrypt, Contacto/Cotizaciones con email
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Rutas modulares
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Iniciando servidor backend...\n');

// ============================================
// MIDDLEWARES
// ============================================

// Debug middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Parseo de JSON
app.use(express.json());

// Configurar CORS
const corsOptions = {
  origin: [
    'https://www.hotandcold.cl',
    'https://hotandcold.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ============================================
// RUTAS
// ============================================

app.use('/api', authRoutes);
app.use('/api', contactRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
  console.log('📊 Rutas disponibles:');
  console.log('   POST /api/register');
  console.log('   POST /api/login');
  console.log('   POST /api/contact');
  console.log('   POST /api/contact-footer\n');
});

