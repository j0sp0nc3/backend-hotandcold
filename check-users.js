/**
 * Script para verificar y crear usuario de prueba
 */

const bcrypt = require('bcrypt');
const { db } = require('./config/firebaseAdmin');

async function checkAndCreateUser() {
  try {
    console.log('🔍 Verificando usuarios en Firestore...\n');
    
    // Obtener todos los usuarios
    const usersSnapshot = await db.collection('usuarios').get();
    
    if (usersSnapshot.empty) {
      console.log('⚠️  No hay usuarios registrados\n');
      console.log('📝 Creando usuario de prueba...');
      
      // Crear usuario admin de prueba
      const username = 'admin';
      const password = 'admin123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await db.collection('usuarios').add({
        username,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Usuario de prueba creado:');
      console.log('   👤 Username: admin');
      console.log('   🔑 Password: admin123\n');
    } else {
      console.log(`✅ Encontrados ${usersSnapshot.size} usuario(s):\n`);
      
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   👤 Username: ${data.username}`);
        console.log(`   🆔 ID: ${doc.id}`);
        console.log(`   📅 Creado: ${data.createdAt?.toDate().toLocaleString('es-ES')}\n`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAndCreateUser();
