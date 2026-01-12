#!/usr/bin/env node
/**
 * Script para inicializar Firestore en el proyecto Firebase
 * Crea las colecciones necesarias y documenta la estructura
 */

const admin = require('firebase-admin');
const serviceAccount = require('./hotandcold-nuevo-firebase-adminsdk-fbsvc-a8ef5c8455.json');

console.log('🔧 Inicializador de Firestore');
console.log('================================');
console.log('Proyecto:', serviceAccount.project_id);
console.log('');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = admin.firestore();

async function initializeFirestore() {
  try {
    console.log('📝 Creando estructura de Firestore...');
    
    // Crear documento de inicialización en cada colección
    const collections = ['mensajes', 'contactos', 'usuarios'];
    const timestamp = new Date();
    
    for (const collection of collections) {
      try {
        // Crear un documento de inicialización con metadatos
        const docRef = await db.collection(collection).doc('_metadata').set({
          createdAt: timestamp,
          type: collection,
          description: `Colección de ${collection}`,
          initialized: true
        });
        console.log(`✅ Colección '${collection}' inicializada`);
      } catch (err) {
        console.error(`⚠️  Error inicializando '${collection}':`, err.message);
      }
    }
    
    console.log('');
    console.log('🎉 ¡Firestore inicializado correctamente!');
    console.log('');
    console.log('Colecciones creadas:');
    console.log('  - mensajes (para formularios de contacto)');
    console.log('  - contactos (para contactos del footer)');
    console.log('  - usuarios (para cuentas de usuario)');
    console.log('');
    console.log('Puedes eliminar los documentos _metadata después si lo deseas.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    console.error('');
    console.error('Posibles causas:');
    console.error('1. Firestore API no está habilitada en Google Cloud');
    console.error('2. Las credenciales no tienen permisos suficientes');
    console.error('3. El proyecto Firebase no existe');
    console.error('');
    console.error('Soluciones:');
    console.error('1. Abre: https://console.cloud.google.com/apis/');
    console.error('2. Busca "Cloud Firestore API" y habilítala');
    console.error('3. O ve a Firebase Console > Database > Crear Firestore');
    
    process.exit(1);
  }
}

initializeFirestore();
