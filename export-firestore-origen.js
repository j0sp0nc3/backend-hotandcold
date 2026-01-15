// export-firestore-origen.js
// Script para exportar datos del Firestore ORIGEN (proyecto anterior)

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Cargar credenciales del proyecto ORIGEN
const serviceAccount = require('./firebase-adminsdk-origen.json');

// Inicializar Firebase Admin SDK con proyecto ORIGEN
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = admin.firestore();

async function exportarDatos() {
  try {
    console.log('═══════════════════════════════════════════════');
    console.log('🔥 EXPORTANDO DATOS DE FIRESTORE ORIGEN');
    console.log(`📦 Proyecto: ${serviceAccount.project_id}`);
    console.log('═══════════════════════════════════════════════\n');

    const backup = {
      exported: new Date().toISOString(),
      project: serviceAccount.project_id,
      usuarios: [],
      mensajes: [],
      cotizaciones: [],
      contactos: [],
      productos: [],
      resumen: {}
    };

    // ════════════════════════════════════════════════════════════
    // EXPORTAR USUARIOS
    // ════════════════════════════════════════════════════════════
    console.log('📥 Exportando usuarios...');
    try {
      const usuariosSnap = await db.collection('usuarios').get();
      usuariosSnap.forEach(doc => {
        backup.usuarios.push({
          id: doc.id,
          ...doc.data()
        });
      });
      console.log(`   ✅ ${backup.usuarios.length} usuarios exportados\n`);
    } catch (error) {
      console.log(`   ⚠️  Colección usuarios no encontrada o error: ${error.message}\n`);
    }

    // ════════════════════════════════════════════════════════════
    // EXPORTAR MENSAJES
    // ════════════════════════════════════════════════════════════
    console.log('📥 Exportando mensajes...');
    try {
      const mensajesSnap = await db.collection('mensajes').get();
      mensajesSnap.forEach(doc => {
        const data = doc.data();
        backup.mensajes.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : null
        });
      });
      console.log(`   ✅ ${backup.mensajes.length} mensajes exportados\n`);
    } catch (error) {
      console.log(`   ⚠️  Colección mensajes no encontrada o error: ${error.message}\n`);
    }

    // ════════════════════════════════════════════════════════════
    // EXPORTAR COTIZACIONES
    // ════════════════════════════════════════════════════════════
    console.log('📥 Exportando cotizaciones...');
    try {
      const cotizacionesSnap = await db.collection('cotizaciones').get();
      cotizacionesSnap.forEach(doc => {
        const data = doc.data();
        backup.cotizaciones.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : null
        });
      });
      console.log(`   ✅ ${backup.cotizaciones.length} cotizaciones exportadas\n`);
    } catch (error) {
      console.log(`   ⚠️  Colección cotizaciones no encontrada o error: ${error.message}\n`);
    }

    // ════════════════════════════════════════════════════════════
    // EXPORTAR MENSAJES-CONTACTO
    // ════════════════════════════════════════════════════════════
    console.log('📥 Exportando mensajes-contacto...');
    try {
      const contactosSnap = await db.collection('mensajes-contacto').get();
      contactosSnap.forEach(doc => {
        const data = doc.data();
        backup.contactos.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : null
        });
      });
      console.log(`   ✅ ${backup.contactos.length} contactos exportados\n`);
    } catch (error) {
      console.log(`   ⚠️  Colección mensajes-contacto no encontrada o error: ${error.message}\n`);
    }

    // ════════════════════════════════════════════════════════════
    // EXPORTAR PRODUCTOS
    // ════════════════════════════════════════════════════════════
    console.log('📥 Exportando productos...');
    try {
      const productosSnap = await db.collection('productos').get();
      productosSnap.forEach(doc => {
        const data = doc.data();
        backup.productos.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : null
        });
      });
      console.log(`   ✅ ${backup.productos.length} productos exportados\n`);
    } catch (error) {
      console.log(`   ⚠️  Colección productos no encontrada o error: ${error.message}\n`);
    }

    // ════════════════════════════════════════════════════════════
    // GUARDAR ARCHIVO
    // ════════════════════════════════════════════════════════════
    backup.resumen = {
      total_usuarios: backup.usuarios.length,
      total_mensajes: backup.mensajes.length,
      total_cotizaciones: backup.cotizaciones.length,
      total_contactos: backup.contactos.length,
      total_productos: backup.productos.length,
      fecha_export: new Date().toLocaleString('es-CL')
    };

    const filename = `backup_origen_${serviceAccount.project_id}_${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(__dirname, filename);

    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2), 'utf-8');

    console.log('═══════════════════════════════════════════════');
    console.log('✅ EXPORT COMPLETADO');
    console.log('═══════════════════════════════════════════════');
    console.log(`📁 Archivo: ${filename}`);
    console.log(`📊 Resumen:`);
    console.log(`   - Usuarios: ${backup.resumen.total_usuarios}`);
    console.log(`   - Mensajes: ${backup.resumen.total_mensajes}`);
    console.log(`   - Cotizaciones: ${backup.resumen.total_cotizaciones}`);
    console.log(`   - Contactos: ${backup.resumen.total_contactos}`);
    console.log(`   - Productos: ${backup.resumen.total_productos}`);
    console.log(`📅 Fecha: ${backup.resumen.fecha_export}`);
    console.log('═══════════════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la exportación:', error);
    process.exit(1);
  }
}

exportarDatos();
