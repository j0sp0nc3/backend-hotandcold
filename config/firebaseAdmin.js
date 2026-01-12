const admin = require('firebase-admin');
const path = require('path');

// Cargar variables de entorno desde .env
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Construir objeto de credenciales desde variables de entorno
// OPCIÓN 1: Desde variables de entorno (RECOMENDADO - más seguro)
const useEnvCredentials = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY;

let serviceAccount;

if (useEnvCredentials) {
  // Usar credenciales desde .env
  serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Convertir \n a saltos de línea reales
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  };
  console.log('🔐 Usando credenciales desde variables de entorno (.env)');
} else {
  // OPCIÓN 2: Fallback a archivo JSON (para desarrollo local sin .env)
  try {
    // Buscar archivos JSON de credenciales en el directorio
    const fs = require('fs');
    const files = fs.readdirSync(__dirname + '/..')
      .filter(f => f.includes('firebase-adminsdk') && f.endsWith('.json'));
    
    if (files.length > 0) {
      const credFile = files[0];
      serviceAccount = require('../' + credFile);
      console.log(`⚠️  ADVERTENCIA: Usando archivo JSON (${credFile})`);
      console.log('ℹ️  Para producción, usa variables de entorno con .env');
    } else {
      throw new Error('No Firebase credentials found');
    }
  } catch (error) {
    console.error('❌ Error: No se encontraron credenciales de Firebase');
    console.error('Solución:');
    console.error('1. Copia el archivo .env.example a .env');
    console.error('2. Llena con tus credenciales reales');
    console.error('O coloca el archivo JSON de credenciales en este directorio');
    process.exit(1);
  }
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID
  });
  console.log('✅ Firebase Admin SDK inicializado');
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error.message);
  process.exit(1);
}

const db = admin.firestore();

module.exports = { admin, db };
