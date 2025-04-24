import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';

const Nav = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');
      navigate('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header>
      <div className="nav-container">
        <h1>Urban Duo</h1>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Productos</Link></li>
            <li><Link to="/cart">Carrito</Link></li>
          </ul>
          <div className="nav-actions">
            <Link to="/admin">Login</Link>
            {user && (
              <button onClick={handleLogout}>Cerrar Sesión</button>
            )}
            <Link to="/contact" className="contact-btn">Contáctanos</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Nav;