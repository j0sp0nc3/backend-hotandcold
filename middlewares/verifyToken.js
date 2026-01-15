// backend/middlewares/verifyToken.js
const jwt = require('jsonwebtoken');

// Secret para JWT - DEBE estar en .env
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware de autenticación
 * Verifica token JWT
 */
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    console.warn('⚠️ Intento de acceso sin token:', req.method, req.path);
    return res.status(401).json({ 
      success: false,
      message: "No autorizado - Token requerido" 
    });
  }

  const token = authHeader.split(" ")[1];
  
  if (!token) {
    console.warn('⚠️ Header de autorización mal formado:', req.method, req.path);
    return res.status(401).json({ 
      success: false,
      message: "No autorizado - Token mal formado" 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log(`✅ Usuario autenticado: ${decoded.username || decoded.userId}`);
    next();
  } catch (error) {
    console.error('❌ Token inválido:', error.message);
    res.status(401).json({ 
      success: false,
      message: "Token inválido o expirado" 
    });
  }
}

module.exports = verifyToken;
