import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isConfirming, setIsConfirming] = useState(false);

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

  // Actualizar la cantidad de un producto en el carrito
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevenir cantidades menores a 1
    const updatedCart = cartItems.map((item) => {
      if (item.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log('Cantidad actualizada:', productId, newQuantity);
  };

  // Calcular total
  const total = cartItems.reduce((sum, item) => sum + item.precio * (item.quantity || 1), 0);

  // Manejar envío del pedido
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Mostrar confirmación
    setIsConfirming(true);
  };

  const confirmOrder = async () => {
    setIsConfirming(false);

    // Generar ID de pedido único (basado en timestamp)
    const orderId = `UD${Date.now()}`;
    const date = new Date().toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });

    // Formatear mensaje para WhatsApp
    let message = `*Nuevo Pedido - Urban Duo* 🎽\n\n`;
    message += `*ID Pedido*: ${orderId}\n`;
    message += `*Fecha*: ${date}\n\n`;
    message += `*Productos*:\n`;
    cartItems.forEach((item) => {
      message += `• *${item.nombre}*\n`;
      message += `  Cantidad: ${item.quantity || 1}\n`;
      message += `  Precio: S/ ${item.precio.toFixed(2)}\n`;
      message += `  Subtotal: S/ ${(item.precio * (item.quantity || 1)).toFixed(2)}\n\n`;
    });
    message += `*Total*: S/ ${total.toFixed(2)}\n\n`;
    message += `¡Gracias por elegir Urban Duo! 🙌\n`;
    message += `Por favor, confirma tu pedido respondiendo este mensaje.\n`;
    message += `Contacto: +51 927319124`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=+51927319124&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    // Enviar a Google Sheets (reemplaza con tu URL de Google Apps Script)
    const googleScriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // Ej: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
    try {
      await fetch(googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, date, items: cartItems, total }),
        mode: 'no-cors',
      });
      console.log('Pedido registrado en Google Sheets');

      // Opcional: Limpiar carrito después de enviar
      setCartItems([]);
      localStorage.setItem('cart', JSON.stringify([]));

      alert('¡Pedido enviado a WhatsApp y registrado exitosamente!');
    } catch (error) {
      console.error('Error al registrar en Google Sheets:', error);
      alert('Pedido enviado a WhatsApp, pero hubo un error al registrar en Google Sheets.');
    }
  };

  // Calcelar confirmación
  const cancelOrder = () => {
    setIsConfirming(false);
  };

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

                <div className="quantity-selector">
                  <label htmlFor={`quantity-${item.id}`} className="quantity-label">
                    Cantidad:
                  </label>
                  <div className="quantity-control">
                    <button
                      type="button"
                      className="quantity-btn decrement"
                      onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                      disabled={(item.quantity || 1) <= 1}
                      aria-label="Disminuir cantidad"
                    >
                      −
                    </button>
                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      value={item.quantity || 1}
                      min="1"
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                      className="quantity-display"
                      aria-valuenow={item.quantity || 1}
                      aria-label="Cantidad actual"
                    />
                    <button
                      type="button"
                      className="quantity-btn increment"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </div>

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
            <button className="checkout-btn" onClick={handleCheckout}>
              Enviar Pedido
            </button>
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

      {/* Modal de confirmación */}
      {isConfirming && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h2>Confirmar Pedido</h2>
            <p>¿Estás seguro de enviar este pedido a Urban Duo?</p>
            <div className="confirmation-buttons">
              <button className="confirm-btn" onClick={confirmOrder}>
                Sí, Enviar
              </button>
              <button className="cancel-btn" onClick={cancelOrder}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}