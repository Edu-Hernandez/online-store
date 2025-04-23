import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import Nav from './components/Nav';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Contact from './pages/Contact';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Estado de autenticación:', currentUser);
      setUser(currentUser);
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify({ uid: currentUser.uid }));
      } else {
        localStorage.removeItem('user');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <BrowserRouter>
      <Nav user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/admin"
          element={user ? <Navigate to="/dashboard" /> : <AdminLogin />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/admin" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;