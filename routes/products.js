const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');

/**
 * GET /api/products
 * Obtener todos los productos
 */
router.get('/', async (req, res) => {
  try {
    const productosSnapshot = await db.collection('productos').get();
    const productos = [];
    
    productosSnapshot.forEach(doc => {
      productos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      data: productos,
      total: productos.length
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
});

/**
 * GET /api/products/:id
 * Obtener un producto por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productoDoc = await db.collection('productos').doc(id).get();

    if (!productoDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: productoDoc.id,
        ...productoDoc.data()
      }
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  }
});

/**
 * POST /api/products
 * Crear un nuevo producto
 */
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, imagenUrl, precio, categoria, disponible } = req.body;

    // Validaciones básicas
    if (!titulo || !imagenUrl) {
      return res.status(400).json({
        success: false,
        message: 'Título e imagen son requeridos'
      });
    }

    const nuevoProducto = {
      titulo,
      descripcion: descripcion || '',
      imagenUrl,
      precio: precio || 0,
      categoria: categoria || 'general',
      disponible: disponible !== undefined ? disponible : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('productos').add(nuevoProducto);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: {
        id: docRef.id,
        ...nuevoProducto
      }
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
});

/**
 * PUT /api/products/:id
 * Actualizar un producto existente
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, imagenUrl, precio, categoria, disponible } = req.body;

    // Verificar que el producto existe
    const productoDoc = await db.collection('productos').doc(id).get();
    if (!productoDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const actualizacion = {
      ...(titulo && { titulo }),
      ...(descripcion !== undefined && { descripcion }),
      ...(imagenUrl && { imagenUrl }),
      ...(precio !== undefined && { precio }),
      ...(categoria && { categoria }),
      ...(disponible !== undefined && { disponible }),
      updatedAt: new Date()
    };

    await db.collection('productos').doc(id).update(actualizacion);

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: {
        id,
        ...actualizacion
      }
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
});

/**
 * DELETE /api/products/:id
 * Eliminar un producto
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el producto existe
    const productoDoc = await db.collection('productos').doc(id).get();
    if (!productoDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    await db.collection('productos').doc(id).delete();

    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
});

module.exports = router;
