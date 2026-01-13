import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./data/products.json');

// GET /api/products - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const limit = req.query.limit;
    
    if (limit) {
      return res.json(products.slice(0, parseInt(limit)));
    }
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /api/products/:pid - Obtener producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(parseInt(req.params.pid));
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// POST /api/products - Crear producto
router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }
    
    const newProduct = await productManager.addProduct({
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || []
    });
    
    // Emitir evento de WebSocket para actualizar en tiempo real
    const io = req.app.get('io');
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
    
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/products/:pid - Actualizar producto
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(
      parseInt(req.params.pid),
      req.body
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Emitir evento de WebSocket
    const io = req.app.get('io');
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/products/:pid - Eliminar producto
router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await productManager.deleteProduct(parseInt(req.params.pid));
    
    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Emitir evento de WebSocket
    const io = req.app.get('io');
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
    
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;