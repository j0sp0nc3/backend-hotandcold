// export-firestore.js
// Script para exportar todos los datos de Firestore a un archivo JSON

const { db } = require('./config/firebaseAdmin');
const fs = require('fs');
const path = require('path');

async function exportarDatos() {
  try {
    console.log('═══════════════════════════════════════════════');
    console.log('🔥 EXPORTANDO DATOS DE FIRESTORE');
    console.log('═══════════════════════════════════════════════\n');

    const backup = {
      exported: new Date().toISOString(),
      project: 'hotandcold-15168',
      usuarios: [],
      mensajes: [],
      contactos: [],
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
    console.log('📥 Exportando mensajes de cotización...');
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
    // EXPORTAR CONTACTOS
    // ════════════════════════════════════════════════════════════
    console.log('📥 Exportando contactos...');
    try {
      const contactosSnap = await db.collection('contactos').get();
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
      console.log(`   ⚠️  Colección contactos no encontrada o error: ${error.message}\n`);
    }

    // ════════════════════════════════════════════════════════════
    // GUARDAR ARCHIVO
    // ════════════════════════════════════════════════════════════
    backup.resumen = {
      total_usuarios: backup.usuarios.length,
      total_mensajes: backup.mensajes.length,
      total_contactos: backup.contactos.length,
      fecha_export: new Date().toLocaleString('es-CL')
    };

    const filename = `backup_firebase_${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(__dirname, filename);

    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2), 'utf-8');

    console.log('═══════════════════════════════════════════════');
    console.log('✅ EXPORT COMPLETADO');
    console.log('═══════════════════════════════════════════════');
    console.log(`📁 Archivo: ${filename}`);
    console.log(`📊 Resumen:`);
    console.log(`   - Usuarios: ${backup.resumen.total_usuarios}`);
    console.log(`   - Mensajes: ${backup.resumen.total_mensajes}`);
    console.log(`   - Contactos: ${backup.resumen.total_contactos}`);
    console.log(`📅 Fecha: ${backup.resumen.fecha_export}`);
    console.log('═══════════════════════════════════════════════\n');

    return backup;
  } catch (error) {
    console.error('\n❌ ERROR EN EXPORTACIÓN:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  exportarDatos().catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}

module.exports = { exportarDatos };
