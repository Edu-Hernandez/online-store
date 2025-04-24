import { useState } from 'react';
import Swal from 'sweetalert2';

const ProductModal = ({ product, closeModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);  // Estado para la cantidad

  // Validar datos
  if (!product || !product.nombre || !product.precio || !product.descripcion || !product.images || !product.images.length) {
    return (
      <div className="modal">
        <div className="modal-content">
          <button className="modal-close" onClick={closeModal}>×</button>
          <p>Producto no válido</p>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  // Función para manejar el cambio de cantidad
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const addToCart = () => {
    // Cargar carrito actual
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    // Verificar si el producto ya está en el carrito
    const exists = cart.some((item) => item.id === product.id);
    if (!exists) {
      // Añadir producto al carrito
      const cartItem = {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        descripcion: product.descripcion,
        images: [product.images[0]], // Solo la primera imagen
        cantidad: quantity, // Guardar cantidad
      };
      cart.push(cartItem);
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Producto añadido al carrito:', cartItem);
      Swal.fire({
        icon: 'success',
        title: `¡${quantity} Producto(s) añadido(s) al carrito!`,
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      // Si el producto ya está en el carrito, se actualiza la cantidad
      const updatedCart = cart.map(item => {
        if (item.id === product.id) {
          item.cantidad += quantity;
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      Swal.fire({
        icon: 'success',
        title: `¡Se ha actualizado la cantidad a ${quantity} en el carrito!`,
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>×</button>
        <div className="carousel">
          <img src={product.images[currentImageIndex]} alt={product.nombre} />
          <button className="carousel-btn prev" onClick={prevImage}>←</button>
          <button className="carousel-btn next" onClick={nextImage}>→</button>
        </div>
        <h2>{product.nombre}</h2>
        <p>{product.descripcion}</p>
        <p className="price">S/ {product.precio.toFixed(2)}</p>
        
        <div className="quantity-selector">
          <label htmlFor="quantity-input" className="quantity-label">Cantidad:</label>
          <div className="quantity-control">
            <button
              type="button"
              className="quantity-btn decrement"
              onClick={() => handleQuantityChange({ target: { value: Math.max(1, quantity - 1) } })}
              disabled={quantity <= 1}
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <input
              id="quantity-input"
              type="number"
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
              className="quantity-display"
              aria-valuenow={quantity}
              aria-label="Cantidad actual"
            />
            <button
              type="button"
              className="quantity-btn increment"
              onClick={() => handleQuantityChange({ target: { value: quantity + 1 } })}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>
        <button className="add-to-cart" onClick={addToCart}>Añadir al carrito</button>
      </div>
    </div>
  );
};

export default ProductModal;
