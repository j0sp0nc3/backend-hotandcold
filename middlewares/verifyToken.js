// backend/middlewares/verifyToken.js
const admin = require("../config/firebaseAdmin");

/**
 * Middleware de autenticación
 * Verifica token de Firebase Auth
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
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    console.log(`✅ Usuario autenticado: ${decodedToken.email || decodedToken.uid}`);
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
