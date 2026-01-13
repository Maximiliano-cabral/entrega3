import fs from 'fs/promises';

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.init();
  }

  async init() {
    try {
      await this.loadProducts();
    } catch (error) {
      this.products = [];
      await this.saveProducts();
    }
  }

  async loadProducts() {
    const data = await fs.readFile(this.path, 'utf-8');
    this.products = JSON.parse(data);
  }

  async saveProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
  }

  async getProducts() {
    await this.loadProducts();
    return this.products;
  }

  async getProductById(id) {
    await this.loadProducts();
    return this.products.find(p => p.id === id);
  }

  async addProduct(product) {
    await this.loadProducts();
    
    // Validar que el código no esté repetido
    if (this.products.some(p => p.code === product.code)) {
      throw new Error('El código del producto ya existe');
    }

    // Generar ID
    const newId = this.products.length > 0 
      ? Math.max(...this.products.map(p => p.id)) + 1 
      : 1;

    const newProduct = {
      id: newId,
      ...product,
      status: product.status !== undefined ? product.status : true
    };

    this.products.push(newProduct);
    await this.saveProducts();
    
    return newProduct;
  }

  async updateProduct(id, updates) {
    await this.loadProducts();
    
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    // No permitir actualizar el ID
    delete updates.id;

    this.products[index] = {
      ...this.products[index],
      ...updates
    };

    await this.saveProducts();
    return this.products[index];
  }

  async deleteProduct(id) {
    await this.loadProducts();
    
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    await this.saveProducts();
    
    return true;
  }
}

export default ProductManager;