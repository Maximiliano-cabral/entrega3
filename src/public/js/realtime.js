// Conectar con Socket.io
const socket = io();

// Formulario para agregar productos
document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    code: document.getElementById('code').value,
    price: parseFloat(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value),
    category: document.getElementById('category').value,
    thumbnails: []
  };

  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      document.getElementById('productForm').reset();
      alert('Producto agregado correctamente');
    } else {
      const error = await response.json();
      alert('Error: ' + error.error);
    }
  } catch (error) {
    alert('Error al agregar el producto');
  }
});

// Función para eliminar producto
window.deleteProduct = async function(id) {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Producto eliminado correctamente');
      } else {
        alert('Error al eliminar el producto');
      }
    } catch (error) {
      alert('Error al eliminar el producto');
    }
  }
};

// Escuchar actualizaciones en tiempo real
socket.on('updateProducts', (products) => {
  const container = document.getElementById('productsContainer');
  
  if (products.length === 0) {
    container.innerHTML = `
      <div class="no-products">
        <p>No hay productos disponibles</p>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => `
    <div class="product-card" data-id="${product.id}">
      <button class="btn-delete" onclick="deleteProduct(${product.id})">Eliminar</button>
      <h3 class="product-title">${product.title}</h3>
      <p class="product-description">${product.description}</p>
      
      <div class="product-info">
        <span class="product-price">$${product.price}</span>
        <span class="product-stock">Stock: ${product.stock}</span>
      </div>
      
      <div>
        <span class="badge badge-category">${product.category}</span>
      </div>
      
      <p class="product-code">Código: ${product.code}</p>
    </div>
  `).join('');
});