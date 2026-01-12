/**
 * Routes - Contacto y Formularios
 * Maneja endpoints de cotizaciones y mensajes de contacto
 */

const express = require('express');
const { sendQuotationEmail, sendContactEmail } = require('../utils/emailService');
const { db } = require('../config/firebaseAdmin');
const { MESSAGES } = require('../config/constants');

const router = express.Router();

/**
 * POST /api/contact - Cotización
 * Guarda cotización en Firestore y envía email
 */
router.post('/contact', async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, rol } = req.body;

  console.log('📝 POST /api/contact:', { nombre, email });

  try {
    // Validar datos requeridos
    if (!nombre || !apellido || !email) {
      return res.status(400).json({ message: 'Nombre, apellido y email son requeridos' });
    }

    // 1. Enviar email
    try {
      await sendQuotationEmail({ nombre, apellido, email, telefono, direccion, rol });
      console.log('📧 Email de cotización enviado');
    } catch (emailErr) {
      console.warn('⚠️ Error enviando email:', emailErr.message);
      // Continuar aunque falle el email
    }

    // 2. Guardar cotización en Firestore
    const docRef = await db.collection('cotizaciones').add({
      nombre,
      apellido,
      email,
      telefono: telefono || '',
      direccion: direccion || '',
      rol: rol || '',
      fecha: new Date(),
      createdAt: new Date()
    });

    console.log('✅ Cotización guardada:', docRef.id);
    res.status(200).json({
      message: MESSAGES.CONTACT_SUCCESS,
      id: docRef.id
    });
  } catch (error) {
    console.error('❌ Error al guardar la cotización:', error.message);
    res.status(500).json({
      message: MESSAGES.SERVER_ERROR,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/contact-footer - Mensaje de contacto
 * Guarda mensaje en Firestore y envía email
 */
router.post('/contact-footer', async (req, res) => {
  const { nombre, apellido, telefono, email, mensaje } = req.body;

  console.log('📝 POST /api/contact-footer:', { nombre, email });

  try {
    // Validar datos requeridos
    if (!nombre || !apellido || !email || !mensaje) {
      return res.status(400).json({
        message: 'Nombre, apellido, email y mensaje son requeridos'
      });
    }

    // 1. Guardar en Firestore
    const docRef = await db.collection('mensajes-contacto').add({
      nombre,
      apellido,
      telefono: telefono || '',
      email,
      mensaje,
      timestamp: new Date(),
      createdAt: new Date()
    });

    console.log('✅ Mensaje guardado:', docRef.id);

    // 2. Enviar correo
    try {
      await sendContactEmail({ nombre, apellido, telefono, email, mensaje });
      console.log('📧 Email de contacto enviado');
    } catch (emailErr) {
      console.warn('⚠️ Error enviando email:', emailErr.message);
      // Continuar aunque falle el email
    }

    res.status(200).json({
      message: MESSAGES.CONTACT_SUCCESS,
      id: docRef.id
    });
  } catch (error) {
    console.error('❌ Error al procesar el mensaje:', error.message);
    res.status(500).json({
      message: MESSAGES.SERVER_ERROR,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
