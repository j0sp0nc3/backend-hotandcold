// seed-productos.js
// Script para poblar la colección 'productos' con termos eléctricos

const { db } = require('./config/firebaseAdmin');

const productos = [
  {
    id: 'tesy-concepta-80l',
    titulo: '080 L. Tesy. Termo eléctrico Concepta',
    marca: 'Tesy',
    modelo: 'Concepta',
    capacidad: '80 litros',
    potencia: 'N/A',
    voltaje: '220V',
    tipo: 'Termo Eléctrico Mural',
    descripcion: 'Termo eléctrico Tesy Concepta de 80 litros, diseño cilíndrico vertical con acabado blanco, ideal para instalación mural.',
    caracteristicas: [
      'Capacidad: 80 litros',
      'Instalación mural vertical',
      'Acabado en color blanco',
      'Diseño cilíndrico compacto',
      'Termostato regulable',
      'Resistencia de alta durabilidad'
    ],
    precio: 0,
    disponible: true,
    categoria: 'calefaccion',
    subcategoria: 'termos-electricos',
    imagenUrl: 'https://res.cloudinary.com/dnfjrc2de/image/upload/v1737004690/n9fnhenvinxpokyffom3_qr0a2b.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rheem-120l-1500w',
    titulo: 'Termo Eléctrico Rheem 120 Litros Mural 220V 1500W',
    marca: 'Rheem',
    modelo: 'Mural 120L',
    capacidad: '120 litros',
    potencia: '1500W',
    voltaje: '220V',
    tipo: 'Termo Eléctrico Mural',
    descripcion: 'Termo eléctrico Rheem de 120 litros con potencia de 1500W, diseño cilíndrico vertical para instalación mural, ideal para familias medianas.',
    caracteristicas: [
      'Capacidad: 120 litros',
      'Potencia: 1500W',
      'Voltaje: 220V',
      'Instalación mural vertical',
      'Acabado en color blanco',
      'Termostato de seguridad',
      'Resistencia blindada',
      'Indicador luminoso de funcionamiento',
      'Válvula de seguridad incluida'
    ],
    precio: 0,
    disponible: true,
    categoria: 'calefaccion',
    subcategoria: 'termos-electricos',
    imagenUrl: 'https://res.cloudinary.com/dnfjrc2de/image/upload/v1737004726/losgkjuebhopnerqcyen_xlvkdj.webp',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'anwo-50l-1700w',
    titulo: 'Termo Eléctrico Mural 50 Litros 1.7 KW 220V - Anwo',
    marca: 'Anwo',
    modelo: 'Mural 50L',
    capacidad: '50 litros',
    potencia: '1.7 KW (1700W)',
    voltaje: '220V',
    tipo: 'Termo Eléctrico Mural',
    descripcion: 'Termo eléctrico Anwo de 50 litros con potencia de 1.7 KW, diseño rectangular compacto ideal para espacios reducidos.',
    caracteristicas: [
      'Capacidad: 50 litros',
      'Potencia: 1.7 KW (1700W)',
      'Voltaje: 220V',
      'Diseño rectangular compacto',
      'Instalación mural',
      'Acabado en color blanco',
      'Panel de control con display',
      'Termostato digital',
      'Resistencia de alta eficiencia',
      'Protección contra sobrecalentamiento',
      'Ideal para espacios pequeños'
    ],
    precio: 0,
    disponible: true,
    categoria: 'calefaccion',
    subcategoria: 'termos-electricos',
    imagenUrl: 'https://res.cloudinary.com/dnfjrc2de/image/upload/v1737004710/bus5q47qeqyjnhyxma3d_nk8xsm.webp',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function poblarProductos() {
  try {
    console.log('═══════════════════════════════════════════════');
    console.log('🔥 POBLANDO COLECCIÓN DE PRODUCTOS');
    console.log('═══════════════════════════════════════════════\n');

    let agregados = 0;
    let errores = 0;

    for (const producto of productos) {
      try {
        console.log(`📦 Agregando: ${producto.titulo}...`);
        
        // Verificar si el producto ya existe
        const docRef = db.collection('productos').doc(producto.id);
        const doc = await docRef.get();
        
        if (doc.exists) {
          console.log(`   ⚠️  Producto ya existe, actualizando...\n`);
          await docRef.update({
            ...producto,
            updatedAt: new Date()
          });
        } else {
          await docRef.set(producto);
          console.log(`   ✅ Producto agregado\n`);
        }
        
        agregados++;
      } catch (error) {
        console.error(`   ❌ Error al agregar ${producto.titulo}:`, error.message, '\n');
        errores++;
      }
    }

    console.log('═══════════════════════════════════════════════');
    console.log('✅ PROCESO COMPLETADO');
    console.log('═══════════════════════════════════════════════');
    console.log(`📊 Resumen:`);
    console.log(`   - Productos agregados/actualizados: ${agregados}`);
    console.log(`   - Errores: ${errores}`);
    console.log(`   - Total procesados: ${productos.length}`);
    console.log('═══════════════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el proceso:', error);
    process.exit(1);
  }
}

poblarProductos();
