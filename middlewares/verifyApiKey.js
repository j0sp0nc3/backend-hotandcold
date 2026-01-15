/**
 * Middleware de verificación de API Key
 * Protege rutas públicas para que solo aplicaciones autorizadas accedan
 */

// API Keys válidas - DEBEN estar en .env en producción
const VALID_API_KEYS = (process.env.VALID_API_KEYS || '').split(',').filter(Boolean);

// Validar que haya al menos una API key configurada
if (VALID_API_KEYS.length === 0) {
  console.error('⚠️ ADVERTENCIA: No hay API Keys configuradas en VALID_API_KEYS');
}

/**
 * Verifica que la petición incluya un API Key válido
 */
function verifyApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    console.warn('⚠️ Intento de acceso sin API Key:', req.method, req.path, req.ip);
    return res.status(403).json({ 
      success: false,
      message: "Acceso denegado - API Key requerida" 
    });
  }

  if (!VALID_API_KEYS.includes(apiKey)) {
    console.warn('⚠️ API Key inválida:', req.method, req.path, req.ip);
    return res.status(403).json({ 
      success: false,
      message: "Acceso denegado - API Key inválida" 
    });
  }

  console.log(`✅ API Key válida para: ${req.method} ${req.path}`);
  next();
}

module.exports = verifyApiKey;
