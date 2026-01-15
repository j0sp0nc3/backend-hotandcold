/**
 * Routes - Autenticación
 * Endpoints para registro y login con Firestore + bcrypt + JWT
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebaseAdmin');
const { MESSAGES, BCRYPT_ROUNDS } = require('../config/constants');

// Secret para JWT - DEBE estar en .env
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

// Validar que JWT_SECRET esté configurado
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado en las variables de entorno');
}

const router = express.Router();

/**
 * POST /api/register - Registro de usuario
 * Crea nuevo usuario con contraseña encriptada
 */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  console.log('📝 POST /api/register:', { username });

  try {
    // Validar campos requeridos
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
    }

    // Buscar usuario existente
    console.log('🔍 Buscando usuario en Firestore...');
    const userQuery = await db.collection('usuarios').where('username', '==', username).get();

    if (!userQuery.empty) {
      console.log('⚠️ Usuario ya existe');
      return res.status(409).json({ message: MESSAGES.USER_EXISTS });
    }

    // Encriptar contraseña
    console.log('🔐 Encriptando contraseña...');
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Guardar usuario en Firestore
    console.log('💾 Guardando en Firestore...');
    const docRef = await db.collection('usuarios').add({
      username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Usuario registrado exitosamente:', docRef.id);
    res.status(201).json({
      message: MESSAGES.REGISTER_SUCCESS,
      userId: docRef.id,
      username
    });
  } catch (err) {
    console.error('❌ Error en registro:', err.message);
    res.status(500).json({
      message: MESSAGES.SERVER_ERROR,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/**
 * POST /api/login - Autenticación de usuario
 * Verifica credenciales y devuelve información del usuario
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('📝 POST /api/login:', { username });

  try {
    // Validar campos requeridos
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
    }

    // Buscar usuario
    console.log('🔍 Buscando usuario...');
    const userQuery = await db.collection('usuarios')
      .where('username', '==', username)
      .limit(1)
      .get();

    if (userQuery.empty) {
      console.log('⚠️ Usuario no encontrado');
      return res.status(401).json({ message: MESSAGES.USER_NOT_FOUND });
    }

    // Obtener datos del usuario
    const userData = userQuery.docs[0].data();
    const userId = userQuery.docs[0].id;

    // Verificar contraseña
    console.log('🔐 Verificando contraseña...');
    const validPassword = await bcrypt.compare(password, userData.password);

    if (!validPassword) {
      console.log('⚠️ Contraseña incorrecta');
      return res.status(401).json({ message: MESSAGES.INVALID_PASSWORD });
    }

    // Generar JWT token
    const token = jwt.sign(
      { userId, username: userData.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log('✅ Login exitoso:', username);
    res.json({
      message: MESSAGES.LOGIN_SUCCESS,
      userId,
      username: userData.username,
      token
    });
  } catch (err) {
    console.error('❌ Error en login:', err.message);
    res.status(500).json({
      message: MESSAGES.SERVER_ERROR,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
