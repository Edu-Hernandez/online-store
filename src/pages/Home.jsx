import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import HeroImage from '../assets/images/buso.png'; // Ajusta la ruta según tu imagen

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const lista = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log('Productos cargados:', lista);
        setProducts(lista);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    obtenerProductos();
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      <section className="hero-section">
        <div className="hero-text">
          <h2>Todo lo que necesitas para tu estilo urbano</h2>
          <p>
            Descubre la moda más moderna y de calidad premium. Encuentra prendas únicas que reflejen tu personalidad y estilo de vida.
          </p>
          <button className="start-btn">Comenzar</button>
        </div>
        <div className="hero-image">
          <img src={HeroImage} alt="Producto destacado" />
        </div>
      </section>
      <section className="about-us">
        <h2>Sobre Nosotros</h2>
        <p>
          En <strong> Urban Duo </strong>, nos apasiona ofrecerte ropa moderna y de alta calidad que resalte tu estilo único. Vendemos <strong>conjuntos</strong>, <strong>joggers</strong>, <strong>poleras</strong> y más, diseñados para jóvenes que buscan destacar en la ciudad.
          Realizamos entregas en todo  <strong>Lima</strong>, y también en <strong>Cajamarca</strong>. Con tiempos y costos que varían según la distancia. ¡Queremos que tu experiencia de compra sea tan increíble como nuestras prendas!
        </p>
      </section>
      <main>
        <h1>Explora Nuestra Colección Urbana</h1>
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} openModal={openModal} />
            ))
          ) : (
            <p>No hay productos disponibles</p>
          )}
        </div>
      </main>
      {selectedProduct && <ProductModal product={selectedProduct} closeModal={closeModal} />}
    </div>
  );
}