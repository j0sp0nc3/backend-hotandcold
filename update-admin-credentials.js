/**
 * Script para actualizar credenciales de usuario
 */

const bcrypt = require('bcrypt');
const { db } = require('./config/firebaseAdmin');

async function updateUserCredentials() {
  try {
    console.log('🔐 Actualizando credenciales de usuario...\n');
    
    // Buscar usuario admin
    const usersSnapshot = await db.collection('usuarios')
      .where('username', '==', 'admin')
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.log('⚠️  Usuario admin no encontrado');
      console.log('Creando nuevo usuario...');
      
      // Crear nuevo usuario
      const newUsername = 'josponce';
      const newPassword = 'Natalia01_';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await db.collection('usuarios').add({
        username: newUsername,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Usuario creado:');
      console.log(`   Username: ${newUsername}`);
      console.log(`   Password: ${newPassword}\n`);
    } else {
      // Actualizar usuario existente
      const userDoc = usersSnapshot.docs[0];
      const userId = userDoc.id;
      
      const newUsername = 'josponce';
      const newPassword = 'Natalia01_';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await db.collection('usuarios').doc(userId).update({
        username: newUsername,
        password: hashedPassword,
        updatedAt: new Date()
      });
      
      console.log('✅ Usuario actualizado:');
      console.log(`   ID: ${userId}`);
      console.log(`   Username anterior: admin`);
      console.log(`   Username nuevo: ${newUsername}`);
      console.log(`   Password nueva: ${newPassword}\n`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateUserCredentials();
