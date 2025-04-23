import { useState } from 'react';

const ProductModal = ({ product, closeModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        images: [product.images[0]] // Solo la primera imagen
      };
      cart.push(cartItem);
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Producto añadido al carrito:', cartItem);
      alert('¡Producto añadido al carrito!');
    } else {
      alert('Este producto ya está en el carrito');
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
        <button className="add-to-cart" onClick={addToCart}>Añadir al carrito</button>
      </div>
    </div>
  );
};

export default ProductModal;