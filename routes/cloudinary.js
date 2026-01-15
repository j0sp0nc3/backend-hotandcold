/**
 * Routes - Cloudinary Signed Uploads
 * Endpoint seguro para generar firmas de subida
 */

const express = require('express');
const crypto = require('crypto');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Credenciales de Cloudinary - DEBEN estar en .env
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Validar que las credenciales estén configuradas
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn('⚠️  Credenciales de Cloudinary no configuradas en .env');
}

/**
 * POST /api/cloudinary/signature
 * Genera una firma segura para subir imágenes a Cloudinary
 * Requiere autenticación JWT
 */
router.post('/signature', verifyToken, (req, res) => {
  try {
    if (!CLOUDINARY_API_SECRET) {
      return res.status(500).json({ 
        message: 'Cloudinary no está configurado correctamente' 
      });
    }

    // Timestamp actual (en segundos)
    const timestamp = Math.round(Date.now() / 1000);

    // Parámetros para la firma
    const params = {
      timestamp: timestamp,
      upload_preset: 'mycustompreset'
    };

    // Crear string para firmar (orden alfabético de parámetros)
    const paramsString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    // Generar firma SHA-256
    const signature = crypto
      .createHash('sha256')
      .update(paramsString + CLOUDINARY_API_SECRET)
      .digest('hex');

    console.log('✅ Firma generada para usuario:', req.user?.username || req.user?.userId);

    // Devolver datos para el frontend
    res.json({
      signature,
      timestamp,
      cloudName: CLOUDINARY_CLOUD_NAME,
      apiKey: CLOUDINARY_API_KEY,
      uploadPreset: params.upload_preset
    });
  } catch (error) {
    console.error('❌ Error generando firma:', error.message);
    res.status(500).json({ 
      message: 'Error al generar firma de Cloudinary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
