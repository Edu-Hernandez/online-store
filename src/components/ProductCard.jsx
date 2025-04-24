const ProductCard = ({ product, openModal }) => {
  if (!product || !product.nombre || !product.precio || !product.images || !product.images.length) {
    return <div className="product-card">Producto no válido</div>;
  }

  return (
    <div className="product-card">
      <img
        src={product.images[0]}
        alt={product.nombre}
        className="product-image"
        onClick={() => openModal(product)}
      />
      <div className="content">
        <h3>{product.nombre}</h3>
        <div className="price-and-button">
          <p className="product-price">S/ {product.precio.toFixed(2)}</p>
          <button className="view-more-btn" onClick={() => openModal(product)}>
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;