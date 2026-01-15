/**
 * Script de migración de imágenes de Cloudinary
 * Migra imágenes del cloud name antiguo al nuevo y actualiza productos en Firestore
 */

require('dotenv').config();
const { db } = require('./config/firebaseAdmin');
const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');

// Configuración de Cloudinary
const OLD_CLOUD_NAME = 'dmmlobp9k';
const NEW_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const UPLOAD_PRESET = 'mycustompreset';

// Validar configuración
if (!NEW_CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('❌ Faltan credenciales de Cloudinary en .env');
  process.exit(1);
}

/**
 * Genera firma para upload seguro
 */
function generateSignature(timestamp) {
  const paramsString = `timestamp=${timestamp}&upload_preset=${UPLOAD_PRESET}`;
  return crypto
    .createHash('sha256')
    .update(paramsString + API_SECRET)
    .digest('hex');
}

/**
 * Sube una imagen a Cloudinary desde URL
 */
async function uploadImageToCloudinary(imageUrl) {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = generateSignature(timestamp);

    const formData = new FormData();
    formData.append('file', imageUrl);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp);
    formData.append('api_key', API_KEY);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${NEW_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: formData.getHeaders()
      }
    );

    return response.data.secure_url;
  } catch (error) {
    console.error('Error subiendo imagen:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Migra todas las imágenes de productos
 */
async function migrateImages() {
  console.log('🚀 Iniciando migración de imágenes...\n');
  console.log(`   Cloud antiguo: ${OLD_CLOUD_NAME}`);
  console.log(`   Cloud nuevo: ${NEW_CLOUD_NAME}\n`);

  try {
    // Obtener todos los productos
    const productosSnapshot = await db.collection('productos').get();
    
    if (productosSnapshot.empty) {
      console.log('⚠️  No hay productos para migrar');
      return;
    }

    console.log(`📦 Encontrados ${productosSnapshot.size} productos\n`);

    let migrados = 0;
    let errores = 0;
    let sinCambios = 0;

    for (const doc of productosSnapshot.docs) {
      const producto = doc.data();
      const productoId = doc.id;

      console.log(`\n📸 Procesando: ${producto.titulo}`);
      console.log(`   ID: ${productoId}`);
      console.log(`   URL actual: ${producto.imagenUrl}`);

      // Verificar si la imagen es del cloud antiguo
      if (!producto.imagenUrl || !producto.imagenUrl.includes(OLD_CLOUD_NAME)) {
        console.log('   ⏭️  Ya está migrado o no tiene imagen del cloud antiguo');
        sinCambios++;
        continue;
      }

      try {
        // Subir imagen al nuevo cloud
        console.log('   ⬆️  Subiendo a nuevo cloud...');
        const newImageUrl = await uploadImageToCloudinary(producto.imagenUrl);
        
        // Actualizar producto en Firestore
        await db.collection('productos').doc(productoId).update({
          imagenUrl: newImageUrl,
          updatedAt: new Date()
        });

        console.log(`   ✅ Migrado exitosamente`);
        console.log(`   Nueva URL: ${newImageUrl}`);
        migrados++;

        // Pausa breve para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`   ❌ Error migrando: ${error.message}`);
        errores++;
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Migrados exitosamente: ${migrados}`);
    console.log(`❌ Errores: ${errores}`);
    console.log(`⏭️  Sin cambios: ${sinCambios}`);
    console.log(`📦 Total procesados: ${productosSnapshot.size}`);
    console.log('═══════════════════════════════════════\n');

    if (migrados > 0) {
      console.log('🎉 Migración completada con éxito!');
    }

  } catch (error) {
    console.error('❌ Error fatal en migración:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

// Ejecutar migración
migrateImages();
