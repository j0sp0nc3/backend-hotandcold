/**
 * Script para verificar URLs de productos
 */

require('dotenv').config();
const { db } = require('./config/firebaseAdmin');

async function verificarProductos() {
  console.log('🔍 Verificando URLs de productos...\n');

  try {
    const productosSnapshot = await db.collection('productos').get();
    
    if (productosSnapshot.empty) {
      console.log('⚠️  No hay productos');
      return;
    }

    console.log(`📦 Total productos: ${productosSnapshot.size}\n`);

    productosSnapshot.forEach(doc => {
      const producto = doc.data();
      console.log(`\n📸 ${producto.titulo}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   URL: ${producto.imagenUrl}`);
      
      if (producto.imagenUrl.includes('dnfjrc2de')) {
        console.log('   ✅ Migrado al nuevo cloud');
      } else if (producto.imagenUrl.includes('dmmlobp9k')) {
        console.log('   ⚠️  Todavía en cloud antiguo');
      }
    });

    console.log('\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  process.exit(0);
}

verificarProductos();
