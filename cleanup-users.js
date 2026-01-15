/**
 * Script para limpiar usuarios duplicados
 */

const { db } = require('./config/firebaseAdmin');

async function cleanupUsers() {
  try {
    console.log('🧹 Limpiando usuarios duplicados...\n');
    
    // Obtener todos los usuarios
    const usersSnapshot = await db.collection('usuarios').get();
    
    console.log(`📦 Total usuarios: ${usersSnapshot.size}\n`);
    
    if (usersSnapshot.size > 1) {
      // Mantener solo el más reciente
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Ordenar por fecha de creación (más reciente primero)
      users.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
      
      console.log('Usuario a mantener:');
      console.log(`   👤 ${users[0].username}`);
      console.log(`   🆔 ${users[0].id}`);
      console.log(`   📅 ${users[0].createdAt?.toDate().toLocaleString('es-ES')}\n`);
      
      // Eliminar los demás
      for (let i = 1; i < users.length; i++) {
        console.log(`🗑️  Eliminando usuario duplicado: ${users[i].id}`);
        await db.collection('usuarios').doc(users[i].id).delete();
      }
      
      console.log('\n✅ Limpieza completada');
    } else {
      console.log('✅ No hay usuarios duplicados');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanupUsers();
