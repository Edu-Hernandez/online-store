import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
      console.log('Carrito cargado:', JSON.parse(savedCart));
    }
  }, []);

  // Eliminar un producto del carrito
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log('Producto eliminado:', productId);
  };

  // Calcular total
  const total = cartItems.reduce((sum, item) => sum + item.precio, 0);

  return (
    <main className="cart">
      <h1>Carrito de Compras</h1>
      {cartItems.length > 0 ? (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.images[0]} alt={item.nombre} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.nombre}</h3>
                <p>{item.descripcion}</p>
                <p className="price">S/ {item.precio.toFixed(2)}</p>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h2>Total: S/ {total.toFixed(2)}</h2>
            <button className="checkout-btn">Proceder al Pago</button>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <p>Tu carrito está vacío</p>
          <Link to="/" className="continue-shopping">
            Continuar comprando
          </Link>
        </div>
      )}
    </main>
  );
}