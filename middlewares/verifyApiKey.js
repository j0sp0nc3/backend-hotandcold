/**
 * Middleware de verificación de API Key
 * Protege rutas públicas para que solo aplicaciones autorizadas accedan
 */

// API Keys válidas - en producción deben estar en .env
const VALID_API_KEYS = [
  process.env.API_KEY_FRONTEND || 'hotandcold-frontend-2026-key',
  process.env.API_KEY_ADMIN || 'hotandcold-admin-2026-key'
];

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
