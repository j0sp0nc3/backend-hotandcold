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
const productsRoutes = require('./routes/products');

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
    'https://hotandcold.cl',
    'https://www.hotandcold.cl',
    'https://backend.hotandcold.cl',
    'https://hotandcold.onrender.com',
    'https://frontend-hotandcold.onrender.com',
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api', authRoutes);
app.use('/api', contactRoutes);
app.use('/api/products', productsRoutes);

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
  console.log('   GET  /health');
  console.log('   POST /api/register');
  console.log('   POST /api/login');
  console.log('   POST /api/contact');
  console.log('   POST /api/contact-footer');
  console.log('   GET  /api/products');
  console.log('   GET  /api/products/:id');
  console.log('   POST /api/products');
  console.log('   PUT  /api/products/:id');
  console.log('   DELETE /api/products/:id\n');
});

