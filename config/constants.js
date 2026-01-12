/**
 * Configuración Centralizada
 * Define constantes y configuraciones globales de la aplicación
 */

require('dotenv').config();

module.exports = {
  // Puertos
  PORT: process.env.PORT || 3000,
  TEST_PORT: process.env.TEST_PORT || 3001,

  // CORS
  CORS_ORIGINS: [
    'https://www.hotandcold.cl',
    'https://hotandcold.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001'
  ],

  // Ambiente
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEBUG: process.env.DEBUG === 'true',

  // Email
  EMAIL: {
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS,
    TO: process.env.EMAIL_TO,
    SERVICE: 'gmail'
  },

  // Firebase
  FIREBASE: {
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL
  },

  // Bcrypt
  BCRYPT_ROUNDS: 10,

  // Validation messages
  MESSAGES: {
    REQUIRED_FIELDS: 'Campos requeridos no proporcionados',
    USER_EXISTS: 'El usuario ya existe',
    USER_NOT_FOUND: 'Usuario no encontrado',
    INVALID_PASSWORD: 'Contraseña incorrecta',
    LOGIN_SUCCESS: 'Login exitoso',
    REGISTER_SUCCESS: 'Usuario registrado con éxito',
    CONTACT_SUCCESS: 'Mensaje guardado correctamente',
    EMAIL_ERROR: 'Error al enviar email',
    SERVER_ERROR: 'Error interno del servidor'
  }
};
