import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./data/products.json');

// Vista Home - Lista estática de productos
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', { 
      products,
      title: 'Lista de Productos'
    });
  } catch (error) {
    res.status(500).render('home', { 
      products: [], 
      error: 'Error al cargar productos',
      title: 'Lista de Productos'
    });
  }
});

// Vista Real Time Products - Con WebSockets
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { 
      products,
      title: 'Productos en Tiempo Real'
    });
  } catch (error) {
    res.status(500).render('realTimeProducts', { 
      products: [], 
      error: 'Error al cargar productos',
      title: 'Productos en Tiempo Real'
    });
  }
});

export default router;