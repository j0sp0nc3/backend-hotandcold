// import-firestore.js
// Script para importar datos desde un archivo JSON de backup a Firestore

const { db } = require('./config/firebaseAdmin');
const fs = require('fs');
const path = require('path');

async function importarDatos(backupFile) {
  try {
    console.log('═══════════════════════════════════════════════');
    console.log('🔥 IMPORTANDO DATOS A FIRESTORE');
    console.log('═══════════════════════════════════════════════\n');

    // Determinar archivo de backup
    let filepath = backupFile;
    if (!filepath) {
      // Buscar el backup más reciente
      const files = fs.readdirSync(__dirname)
        .filter(f => f.startsWith('backup_firebase_') && f.endsWith('.json'))
        .sort()
        .reverse();

      if (files.length === 0) {
        throw new Error('❌ No se encontró archivo de backup. Usa: node import-firestore.js <archivo.json>');
      }
      filepath = files[0];
    }

    // Leer archivo de backup
    const fullPath = path.join(__dirname, filepath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`❌ Archivo no encontrado: ${filepath}`);
    }

    console.log(`📂 Leyendo backup: ${filepath}\n`);
    const backup = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

    // ════════════════════════════════════════════════════════════
    // IMPORTAR USUARIOS
    // ════════════════════════════════════════════════════════════
    if (backup.usuarios && backup.usuarios.length > 0) {
      console.log(`📤 Importando ${backup.usuarios.length} usuarios...`);
      let success = 0;
      let failed = 0;

      for (const user of backup.usuarios) {
        try {
          const { id, ...datos } = user;
          await db.collection('usuarios').doc(id).set(datos);
          success++;
        } catch (error) {
          console.error(`   ⚠️  Error al importar usuario ${user.id}: ${error.message}`);
          failed++;
        }
      }
      console.log(`   ✅ ${success} usuarios importados, ${failed} fallidos\n`);
    }

    // ════════════════════════════════════════════════════════════
    // IMPORTAR MENSAJES
    // ════════════════════════════════════════════════════════════
    if (backup.mensajes && backup.mensajes.length > 0) {
      console.log(`📤 Importando ${backup.mensajes.length} mensajes...`);
      let success = 0;
      let failed = 0;

      for (const msg of backup.mensajes) {
        try {
          const { id, timestamp, ...datos } = msg;
          const docData = {
            ...datos,
            timestamp: timestamp ? new Date(timestamp) : new Date()
          };
          await db.collection('mensajes').doc(id).set(docData);
          success++;
        } catch (error) {
          console.error(`   ⚠️  Error al importar mensaje ${msg.id}: ${error.message}`);
          failed++;
        }
      }
      console.log(`   ✅ ${success} mensajes importados, ${failed} fallidos\n`);
    }

    // ════════════════════════════════════════════════════════════
    // IMPORTAR CONTACTOS
    // ════════════════════════════════════════════════════════════
    if (backup.contactos && backup.contactos.length > 0) {
      console.log(`📤 Importando ${backup.contactos.length} contactos...`);
      let success = 0;
      let failed = 0;

      for (const contacto of backup.contactos) {
        try {
          const { id, timestamp, ...datos } = contacto;
          const docData = {
            ...datos,
            timestamp: timestamp ? new Date(timestamp) : new Date()
          };
          await db.collection('contactos').doc(id).set(docData);
          success++;
        } catch (error) {
          console.error(`   ⚠️  Error al importar contacto ${contacto.id}: ${error.message}`);
          failed++;
        }
      }
      console.log(`   ✅ ${success} contactos importados, ${failed} fallidos\n`);
    }

    console.log('═══════════════════════════════════════════════');
    console.log('✅ IMPORT COMPLETADO');
    console.log('═══════════════════════════════════════════════');
    console.log(`📊 Resumen final:`);
    console.log(`   - Usuarios: ${backup.resumen.total_usuarios}`);
    console.log(`   - Mensajes: ${backup.resumen.total_mensajes}`);
    console.log(`   - Contactos: ${backup.resumen.total_contactos}`);
    console.log('═══════════════════════════════════════════════\n');

    console.log('💡 Próximo paso: Verifica los datos en Firebase Console');
    console.log('   https://console.firebase.google.com\n');
  } catch (error) {
    console.error('\n❌ ERROR EN IMPORTACIÓN:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Obtener archivo de backup de argumentos
const backupFile = process.argv[2];

if (require.main === module) {
  importarDatos(backupFile).catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}

module.exports = { importarDatos };
